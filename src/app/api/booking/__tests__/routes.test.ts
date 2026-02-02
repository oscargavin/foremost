import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the calcom module
const mockGetAvailableSlots = vi.fn();
const mockCreateBooking = vi.fn();

vi.mock("@/lib/calcom", () => ({
  getAvailableSlots: (...args: unknown[]) => mockGetAvailableSlots(...args),
  createBooking: (...args: unknown[]) => mockCreateBooking(...args),
}));

// Helper to create unique IPs for rate limiting isolation
let ipCounter = 0;
function getUniqueIP() {
  ipCounter++;
  return `test-ip-${ipCounter}-${Date.now()}`;
}

// Helper to create NextRequest for slots
function createSlotsRequest(params: Record<string, string>, headers: Record<string, string> = {}) {
  const url = new URL("http://localhost:3000/api/booking/slots");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return new NextRequest(url, {
    method: "GET",
    headers: {
      "x-forwarded-for": getUniqueIP(),
      ...headers,
    },
  });
}

// Helper to create NextRequest for booking
function createBookingRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost:3000/api/booking/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": getUniqueIP(),
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("GET /api/booking/slots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAvailableSlots.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 when startDate is missing", async () => {
    const { GET } = await import("../slots/route");
    const request = createSlotsRequest({
      endDate: "2026-02-10T00:00:00Z",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid query parameters");
  });

  it("returns 400 when endDate is missing", async () => {
    const { GET } = await import("../slots/route");
    const request = createSlotsRequest({
      startDate: "2026-02-01T00:00:00Z",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid query parameters");
  });

  it("returns slots when parameters are valid", async () => {
    const { GET } = await import("../slots/route");
    const mockSlots = {
      "2026-02-03": [{ time: "2026-02-03T10:00:00Z" }, { time: "2026-02-03T11:00:00Z" }],
    };
    mockGetAvailableSlots.mockResolvedValue(mockSlots);

    const request = createSlotsRequest({
      startDate: "2026-02-01T00:00:00Z",
      endDate: "2026-02-10T00:00:00Z",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.slots).toEqual(mockSlots);
  });

  it("includes Cache-Control header", async () => {
    const { GET } = await import("../slots/route");
    mockGetAvailableSlots.mockResolvedValue({});

    const request = createSlotsRequest({
      startDate: "2026-02-01T00:00:00Z",
      endDate: "2026-02-10T00:00:00Z",
    });

    const response = await GET(request);

    expect(response.headers.get("Cache-Control")).toContain("s-maxage=60");
  });

  it("passes timezone to getAvailableSlots", async () => {
    const { GET } = await import("../slots/route");
    mockGetAvailableSlots.mockResolvedValue({});

    const request = createSlotsRequest({
      startDate: "2026-02-01T00:00:00Z",
      endDate: "2026-02-10T00:00:00Z",
      timeZone: "America/New_York",
    });

    await GET(request);

    expect(mockGetAvailableSlots).toHaveBeenCalledWith(
      "2026-02-01T00:00:00Z",
      "2026-02-10T00:00:00Z",
      "America/New_York"
    );
  });

  it("returns 500 when Cal.com API fails", async () => {
    const { GET } = await import("../slots/route");
    mockGetAvailableSlots.mockRejectedValue(new Error("Cal.com API down"));

    const request = createSlotsRequest({
      startDate: "2026-02-01T00:00:00Z",
      endDate: "2026-02-10T00:00:00Z",
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Cal.com API down");
  });
});

describe("POST /api/booking/create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateBooking.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 for invalid JSON body", async () => {
    const { POST } = await import("../create/route");
    const request = new NextRequest("http://localhost:3000/api/booking/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": getUniqueIP(),
      },
      body: "not valid json",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid JSON body");
  });

  it("returns 400 when slot is missing", async () => {
    const { POST } = await import("../create/route");
    const request = createBookingRequest({
      details: { name: "Test User", email: "test@example.com" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request body");
  });

  it("returns 400 when details are missing", async () => {
    const { POST } = await import("../create/route");
    const request = createBookingRequest({
      slot: { date: "2026-02-03", time: "2026-02-03T10:00:00Z", timeZone: "Europe/London" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request body");
  });

  it("returns 400 when email is invalid", async () => {
    const { POST } = await import("../create/route");
    const request = createBookingRequest({
      slot: { date: "2026-02-03", time: "2026-02-03T10:00:00Z", timeZone: "Europe/London" },
      details: { name: "Test User", email: "invalid-email" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid request body");
  });

  it("creates booking with valid data", async () => {
    const { POST } = await import("../create/route");
    const mockBooking = {
      uid: "test-uid-123",
      title: "Test Meeting",
      startTime: "2026-02-03T10:00:00Z",
      endTime: "2026-02-03T10:30:00Z",
      status: "accepted",
    };
    mockCreateBooking.mockResolvedValue(mockBooking);

    const request = createBookingRequest({
      slot: { date: "2026-02-03", time: "2026-02-03T10:00:00Z", timeZone: "Europe/London" },
      details: { name: "Test User", email: "test@example.com", company: "Test Co" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.booking.uid).toBe("test-uid-123");
  });

  it("passes correct data to createBooking", async () => {
    const { POST } = await import("../create/route");
    mockCreateBooking.mockResolvedValue({
      uid: "test-uid",
      title: "Test",
      startTime: "2026-02-03T10:00:00Z",
      endTime: "2026-02-03T10:30:00Z",
      status: "accepted",
    });

    const request = createBookingRequest({
      slot: { date: "2026-02-03", time: "2026-02-03T10:00:00Z", timeZone: "America/New_York" },
      details: { name: "John Doe", email: "john@example.com", notes: "Test notes" },
    });

    await POST(request);

    expect(mockCreateBooking).toHaveBeenCalledWith("2026-02-03T10:00:00Z", {
      name: "John Doe",
      email: "john@example.com",
      timeZone: "America/New_York",
      notes: "Test notes",
    });
  });

  it("returns 500 when Cal.com API fails", async () => {
    const { POST } = await import("../create/route");
    mockCreateBooking.mockRejectedValue(new Error("Booking failed"));

    const request = createBookingRequest({
      slot: { date: "2026-02-03", time: "2026-02-03T10:00:00Z", timeZone: "Europe/London" },
      details: { name: "Test User", email: "test@example.com" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Booking failed");
  });
});
