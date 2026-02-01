import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock crypto module
vi.mock('crypto', () => ({
  default: {
    createHash: vi.fn(() => ({
      update: vi.fn(() => ({
        digest: vi.fn(() => 'mock-hash-1234567890123456'),
      })),
    })),
  },
}))

// Use vi.hoisted for the mock function
const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}))

// Mock Resend with a proper class
vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = {
      send: mockSend,
    }
  },
}))

// Mock the email template
vi.mock('../../email-templates/scan-report-email', () => ({
  ScanReportEmail: vi.fn(() => 'mocked-email-template'),
}))

import { sendScanReport } from '../send-scan-report'
import type { ScanResult } from '@/lib/scanner/types'

// Sample scan result for testing
const mockScanResult: ScanResult = {
  url: 'https://example.com',
  businessName: 'Test Corp',
  industry: 'Technology',
  pagesAnalysed: 5,
  opportunities: [
    {
      id: 'opp-1',
      title: 'AI Chatbot',
      description: 'Implement AI chatbot for customer support',
      category: 'chatbot',
      targetPages: ['https://example.com/support'],
      painPointsSolved: ['Slow response times'],
      complexity: 2,
      impact: 4,
      implementationSketch: 'Use Claude for chat',
      icon: 'MessageSquare',
    },
    {
      id: 'opp-2',
      title: 'Content Generation',
      description: 'Automate content creation',
      category: 'content',
      targetPages: ['https://example.com/blog'],
      painPointsSolved: ['Manual content writing'],
      complexity: 3,
      impact: 3,
      implementationSketch: 'Use Claude for writing',
      icon: 'FileText',
    },
  ],
  topRecommendation: null,
  summary: 'Test Corp has great AI potential.',
}

describe('sendScanReport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSend.mockReset()
    // Default successful response
    mockSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('email validation', () => {
    it('rejects invalid email format', async () => {
      const result = await sendScanReport({
        result: mockScanResult,
        email: 'not-an-email',
        name: 'Test User',
      })

      expect(result.error).toBe('Please enter a valid email address.')
      expect(mockSend).not.toHaveBeenCalled()
    })

    it('rejects email without @', async () => {
      const result = await sendScanReport({
        result: mockScanResult,
        email: 'userdomain.com',
      })

      expect(result.error).toBe('Please enter a valid email address.')
    })

    it('rejects email without domain', async () => {
      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@',
      })

      expect(result.error).toBe('Please enter a valid email address.')
    })

    it('accepts valid email address', async () => {
      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalled()
    })

    it('accepts email with subdomain', async () => {
      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@mail.example.com',
      })

      expect(result.success).toBe(true)
    })

    it('accepts email with plus sign', async () => {
      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user+tag@example.com',
      })

      expect(result.success).toBe(true)
    })
  })

  describe('successful email sending', () => {
    it('sends both user report and lead notification', async () => {
      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
        name: 'Test User',
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe('Report sent successfully! Check your inbox.')
      expect(mockSend).toHaveBeenCalledTimes(2)
    })

    it('includes correct user email data', async () => {
      await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
        name: 'Test User',
      })

      // First call is user email
      const userEmailCall = mockSend.mock.calls[0][0]
      expect(userEmailCall.to).toBe('user@example.com')
      expect(userEmailCall.subject).toContain('Test Corp')
      expect(userEmailCall.subject).toContain('AI Opportunity Report')
    })

    it('includes correct lead notification data', async () => {
      await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
        name: 'Test User',
      })

      // Second call is lead notification
      const leadEmailCall = mockSend.mock.calls[1][0]
      expect(leadEmailCall.subject).toContain('New Scanner Lead')
      expect(leadEmailCall.subject).toContain('Test Corp')
      expect(leadEmailCall.text).toContain('user@example.com')
      expect(leadEmailCall.text).toContain('Test User')
      expect(leadEmailCall.replyTo).toBe('user@example.com')
    })

    it('works without optional name parameter', async () => {
      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      expect(result.success).toBe(true)

      // Lead email should not include name line
      const leadEmailCall = mockSend.mock.calls[1][0]
      expect(leadEmailCall.text).not.toContain('Contact Name:')
    })

    it('includes idempotency key headers', async () => {
      await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      // Both calls should have idempotency key headers
      const userEmailOptions = mockSend.mock.calls[0][1]
      const leadEmailOptions = mockSend.mock.calls[1][1]

      expect(userEmailOptions.headers['Idempotency-Key']).toContain('scan-report-user-')
      expect(leadEmailOptions.headers['Idempotency-Key']).toContain('scan-report-lead-')
    })
  })

  describe('error handling', () => {
    it('returns error when user email fails', async () => {
      mockSend
        .mockResolvedValueOnce({ data: null, error: { message: 'Email failed' } })
        .mockResolvedValueOnce({ data: { id: 'lead-123' }, error: null })

      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      expect(result.error).toBe('Failed to send report. Please try again.')
    })

    it('succeeds when only lead notification fails', async () => {
      mockSend
        .mockResolvedValueOnce({ data: { id: 'user-123' }, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Lead email failed' } })

      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      // Should still succeed - lead notification failure is logged but not reported to user
      expect(result.success).toBe(true)
    })

    it('handles thrown exceptions', async () => {
      mockSend.mockRejectedValue(new Error('Network error'))

      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      // When exceptions are thrown and caught by sendWithRetry, it returns error
      // which then triggers the "Failed to send report" message
      expect(result.error).toBe('Failed to send report. Please try again.')
    })
  })

  describe('retry logic', () => {
    it('retries on 500 errors', async () => {
      // First attempt fails with 500, second succeeds
      mockSend
        .mockRejectedValueOnce({ statusCode: 500 })
        .mockResolvedValueOnce({ data: { id: 'email-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'lead-123' }, error: null })

      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      expect(result.success).toBe(true)
      // Should have retried the first email
      expect(mockSend).toHaveBeenCalledTimes(3)
    })

    it('retries on 429 rate limit errors', async () => {
      mockSend
        .mockRejectedValueOnce({ statusCode: 429 })
        .mockResolvedValueOnce({ data: { id: 'email-123' }, error: null })
        .mockResolvedValueOnce({ data: { id: 'lead-123' }, error: null })

      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      expect(result.success).toBe(true)
    })

    it('does not retry on 400 client errors', async () => {
      mockSend
        .mockRejectedValueOnce({ statusCode: 400, message: 'Bad request' })
        .mockResolvedValueOnce({ data: { id: 'lead-123' }, error: null })

      const result = await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      // Should fail immediately without retry - error from sendWithRetry triggers this message
      expect(result.error).toBe('Failed to send report. Please try again.')
    })
  })

  describe('opportunity listing', () => {
    it('includes all opportunities in lead notification', async () => {
      await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      const leadEmailCall = mockSend.mock.calls[1][0]
      expect(leadEmailCall.text).toContain('AI Chatbot')
      expect(leadEmailCall.text).toContain('Content Generation')
      expect(leadEmailCall.text).toContain('Impact: 4/5')
      expect(leadEmailCall.text).toContain('Impact: 3/5')
    })

    it('includes summary in lead notification', async () => {
      await sendScanReport({
        result: mockScanResult,
        email: 'user@example.com',
      })

      const leadEmailCall = mockSend.mock.calls[1][0]
      expect(leadEmailCall.text).toContain('Test Corp has great AI potential.')
    })
  })
})
