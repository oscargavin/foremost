import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the scanner module
const mockScanWebsite = vi.fn()
vi.mock('@/lib/scanner', () => ({
  scanWebsite: (...args: unknown[]) => mockScanWebsite(...args),
}))

// Helper to create unique IPs for rate limiting isolation
let ipCounter = 0
function getUniqueIP() {
  ipCounter++
  return `test-ip-${ipCounter}-${Date.now()}`
}

// Helper to create NextRequest
function createRequest(body: unknown, headers: Record<string, string> = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Always use a unique IP to avoid rate limiting interference
    'x-forwarded-for': getUniqueIP(),
    ...headers,
  }

  const request = new NextRequest('http://localhost:3000/api/scan', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(body),
  })
  return request
}

// Helper to consume SSE stream
async function consumeStream(response: Response): Promise<string[]> {
  const reader = response.body?.getReader()
  if (!reader) return []

  const chunks: string[] = []
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(decoder.decode(value))
  }

  return chunks
}

// Helper to parse SSE events
function parseSSEEvents(chunks: string[]): unknown[] {
  return chunks
    .join('')
    .split('\n\n')
    .filter(chunk => chunk.startsWith('data: '))
    .map(chunk => JSON.parse(chunk.replace('data: ', '')))
}

// We need to re-import the route for each test to reset rate limiting state
// Since that's complex, we'll work with the module-level state

describe('POST /api/scan', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockScanWebsite.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('request validation', () => {
    it('returns 400 for invalid JSON body', async () => {
      const { POST } = await import('../route')
      const request = new NextRequest('http://localhost:3000/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': getUniqueIP(),
        },
        body: 'not valid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request body')
    })

    it('returns 400 when url is missing', async () => {
      const { POST } = await import('../route')
      const request = createRequest({})

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing url parameter')
    })

    it('returns 400 for invalid URL format', async () => {
      const { POST } = await import('../route')
      const request = createRequest({ url: 'not-a-valid-url' })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid URL format')
    })

    it('returns 400 for non-http(s) protocols', async () => {
      const { POST } = await import('../route')
      const request = createRequest({ url: 'ftp://example.com' })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid URL format')
    })

    it('accepts valid http URL', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'complete', progress: 100 }
      })

      const request = createRequest({ url: 'http://example.com' })
      const response = await POST(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('text/event-stream')
    })

    it('accepts valid https URL', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'complete', progress: 100 }
      })

      const request = createRequest({ url: 'https://example.com' })
      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  describe('SSE streaming', () => {
    it('streams progress events as SSE', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'initialising', progress: 5, message: 'Starting' }
        yield { stage: 'discovering', progress: 30, message: 'Discovering' }
        yield { stage: 'complete', progress: 100, message: 'Done' }
      })

      const request = createRequest({ url: 'https://example.com' })
      const response = await POST(request)

      expect(response.headers.get('Content-Type')).toBe('text/event-stream')
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-transform')

      const chunks = await consumeStream(response)
      const events = parseSSEEvents(chunks)

      expect(events).toHaveLength(3)
      expect(events[0]).toMatchObject({ stage: 'initialising', progress: 5 })
      expect(events[1]).toMatchObject({ stage: 'discovering', progress: 30 })
      expect(events[2]).toMatchObject({ stage: 'complete', progress: 100 })
    })

    it('includes correct SSE headers', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'complete' }
      })

      const request = createRequest({ url: 'https://example.com' })
      const response = await POST(request)

      expect(response.headers.get('Content-Type')).toBe('text/event-stream')
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-transform')
      expect(response.headers.get('Connection')).toBe('keep-alive')
      expect(response.headers.get('X-Accel-Buffering')).toBe('no')
    })

    it('handles scanner errors gracefully', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'initialising', progress: 5 }
        throw new Error('Scanner crashed')
      })

      const request = createRequest({ url: 'https://example.com' })
      const response = await POST(request)

      const chunks = await consumeStream(response)
      const events = parseSSEEvents(chunks)

      const lastEvent = events[events.length - 1] as { stage: string; detail: string }
      expect(lastEvent.stage).toBe('error')
      expect(lastEvent.detail).toBe('Scanner crashed')
    })

    it('handles non-Error throws', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        throw 'string error'
      })

      const request = createRequest({ url: 'https://example.com' })
      const response = await POST(request)

      const chunks = await consumeStream(response)
      const events = parseSSEEvents(chunks)

      const lastEvent = events[events.length - 1] as { stage: string; detail: string }
      expect(lastEvent.stage).toBe('error')
      expect(lastEvent.detail).toBe('Unknown error')
    })
  })

  describe('rate limiting', () => {
    it('allows requests within rate limit', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'complete' }
      })

      // Use unique IP - first request should succeed
      const request1 = createRequest({ url: 'https://example1.com' })
      const response1 = await POST(request1)
      expect(response1.status).toBe(200)
    })

    it('returns 429 when rate limit exceeded', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'complete' }
      })

      // Use same IP for all requests to trigger rate limit
      // Add a unique timestamp component to avoid collision with other test runs
      const sharedIp = `rate-limit-test-${Date.now()}-${Math.random()}`

      // Make MAX_REQUESTS (3) requests with small delays to ensure unique timestamps
      for (let i = 0; i < 3; i++) {
        const request = createRequest(
          { url: `https://example${i}.com` },
          { 'x-forwarded-for': sharedIp }
        )
        const response = await POST(request)
        // First 3 should succeed
        expect(response.status).toBe(200)
        // Consume the stream to complete the request
        await consumeStream(response)
        // Small delay to ensure different timestamps in the rate limit map
        await new Promise(r => setTimeout(r, 5))
      }

      // Fourth request should be rate limited
      const request = createRequest(
        { url: 'https://example4.com' },
        { 'x-forwarded-for': sharedIp }
      )
      const response = await POST(request)

      expect(response.status).toBe(429)
      const data = await response.json()
      expect(data.error).toBe('Rate limit exceeded')
    })

    it('extracts IP from x-forwarded-for header', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'complete' }
      })

      // Use a unique IP with multiple values
      const uniqueIp = `forwarded-ip-${Date.now()}`
      const request = createRequest(
        { url: 'https://example.com' },
        { 'x-forwarded-for': `${uniqueIp}, proxy1, proxy2` }
      )
      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('falls back to x-real-ip if x-forwarded-for not present', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'complete' }
      })

      const uniqueIp = `real-ip-${Date.now()}`
      const request = new NextRequest('http://localhost:3000/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-real-ip': uniqueIp,
        },
        body: JSON.stringify({ url: 'https://example.com' }),
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  describe('scanner integration', () => {
    it('passes correct config to scanWebsite', async () => {
      const { POST } = await import('../route')
      mockScanWebsite.mockImplementation(async function* () {
        yield { stage: 'complete' }
      })

      const request = createRequest({ url: 'https://test-site.com/path?query=1' })
      await POST(request)

      expect(mockScanWebsite).toHaveBeenCalledWith({
        targetUrl: 'https://test-site.com/path?query=1',
        maxPages: 8,
      })
    })

    it('streams all progress events from scanner', async () => {
      const { POST } = await import('../route')
      const progressEvents = [
        { stage: 'initialising', message: 'Starting', progress: 5 },
        { stage: 'discovering', message: 'Finding pages', progress: 20 },
        { stage: 'fetching', message: 'Getting content', progress: 40 },
        { stage: 'analysing', message: 'Analyzing', progress: 70 },
        { stage: 'generating', message: 'Creating report', progress: 90 },
        { stage: 'complete', message: 'Done', progress: 100, data: { businessName: 'Test' } },
      ]

      mockScanWebsite.mockImplementation(async function* () {
        for (const event of progressEvents) {
          yield event
        }
      })

      const request = createRequest({ url: 'https://example.com' })
      const response = await POST(request)
      const chunks = await consumeStream(response)
      const events = parseSSEEvents(chunks)

      expect(events).toHaveLength(6)
      expect(events).toEqual(progressEvents)
    })
  })
})
