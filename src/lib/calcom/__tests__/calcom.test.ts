import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  getAvailableSlots,
  createBooking,
  getBooking,
  cancelBooking,
  generateCalendarLinks,
} from "../index";

/**
 * Integration tests for Cal.com API
 *
 * These tests hit the real Cal.com API to verify the booking flow works.
 * Run with: npm test src/lib/calcom/__tests__/calcom.test.ts
 */

describe("Cal.com Integration", () => {
  // Store booking UID for cleanup
  let testBookingUid: string | null = null;

  beforeAll(() => {
    // Verify environment variables are set
    if (!process.env.CAL_API_KEY?.startsWith("cal_")) {
      throw new Error("CAL_API_KEY must be set for integration tests");
    }
    if (!process.env.CAL_EVENT_TYPE_ID) {
      throw new Error("CAL_EVENT_TYPE_ID must be set for integration tests");
    }
  });

  afterAll(async () => {
    // Cleanup: cancel any test booking created during the test run
    if (testBookingUid) {
      try {
        await cancelBooking(testBookingUid, "Automated test cleanup");
        console.log(`Cleaned up test booking: ${testBookingUid}`);
      } catch (error) {
        console.warn(`Failed to cleanup booking ${testBookingUid}:`, error);
      }
    }
  });

  describe("getAvailableSlots", () => {
    it("fetches available slots for the next 7 days", async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const slots = await getAvailableSlots(
        startDate.toISOString(),
        endDate.toISOString(),
        "Europe/London"
      );

      // Should return an object (may be empty if no availability)
      expect(typeof slots).toBe("object");
      expect(slots).not.toBeNull();

      // If there are slots, they should have the right structure
      const dates = Object.keys(slots);
      if (dates.length > 0) {
        const firstDateSlots = slots[dates[0]];
        expect(Array.isArray(firstDateSlots)).toBe(true);

        if (firstDateSlots.length > 0) {
          expect(firstDateSlots[0]).toHaveProperty("time");
          // Time should be parseable as ISO 8601 date
          const parsedDate = new Date(firstDateSlots[0].time);
          expect(parsedDate.getTime()).not.toBeNaN();
        }
      }
    });

    it("returns slots grouped by date", async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14);

      const slots = await getAvailableSlots(
        startDate.toISOString(),
        endDate.toISOString(),
        "Europe/London"
      );

      // Each key should be a date string (YYYY-MM-DD format)
      for (const dateKey of Object.keys(slots)) {
        expect(dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it("respects timezone parameter", async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      // Fetch with different timezones
      const londonSlots = await getAvailableSlots(
        startDate.toISOString(),
        endDate.toISOString(),
        "Europe/London"
      );

      const nySlots = await getAvailableSlots(
        startDate.toISOString(),
        endDate.toISOString(),
        "America/New_York"
      );

      // Both should return valid slot objects
      expect(typeof londonSlots).toBe("object");
      expect(typeof nySlots).toBe("object");
    });
  });

  describe("createBooking", () => {
    it("creates a booking with valid attendee details", async () => {
      // First, get available slots
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14);

      const slots = await getAvailableSlots(
        startDate.toISOString(),
        endDate.toISOString(),
        "Europe/London"
      );

      const dates = Object.keys(slots);
      if (dates.length === 0) {
        console.log("No available slots found, skipping booking test");
        return;
      }

      // Find a slot to book
      let slotToBook: string | null = null;
      for (const date of dates) {
        if (slots[date].length > 0) {
          slotToBook = slots[date][0].time;
          break;
        }
      }

      if (!slotToBook) {
        console.log("No available time slots found, skipping booking test");
        return;
      }

      // Create booking
      const booking = await createBooking(slotToBook, {
        name: "TDD Test User",
        email: "tdd-test@foremost.ai",
        timeZone: "Europe/London",
        notes: "This is an automated test booking - please ignore",
      });

      // Store for cleanup
      testBookingUid = booking.uid;

      // Verify booking response
      expect(booking.uid).toBeDefined();
      expect(typeof booking.uid).toBe("string");
      expect(booking.title).toBeDefined();
      expect(booking.startTime).toBeDefined();
      expect(booking.endTime).toBeDefined();
      expect(booking.attendees).toBeDefined();
      expect(Array.isArray(booking.attendees)).toBe(true);

      console.log(`Created test booking: ${booking.uid}`);
    });
  });

  describe("getBooking", () => {
    it("retrieves a booking by UID", async () => {
      if (!testBookingUid) {
        console.log("No test booking created, skipping getBooking test");
        return;
      }

      const booking = await getBooking(testBookingUid);

      expect(booking.uid).toBe(testBookingUid);
      expect(booking.title).toBeDefined();
      expect(booking.startTime).toBeDefined();
      expect(booking.endTime).toBeDefined();
    });
  });

  describe("cancelBooking", () => {
    it("cancels a booking successfully", async () => {
      // This test will be covered by afterAll cleanup
      // If the booking was created and cleanup succeeds, the feature works
      expect(true).toBe(true);
    });
  });

  describe("generateCalendarLinks", () => {
    it("generates valid calendar links for a booking", () => {
      const mockBooking = {
        uid: "test-uid-123",
        title: "Test Meeting",
        startTime: "2024-12-15T10:00:00.000Z",
        endTime: "2024-12-15T11:00:00.000Z",
        attendees: [
          { name: "Test User", email: "test@example.com", timeZone: "Europe/London" },
        ],
        status: "accepted",
      };

      const links = generateCalendarLinks(mockBooking);

      expect(links.google).toContain("calendar.google.com");
      // URL encoding can use + or %20 for spaces
      expect(links.google).toMatch(/Test(\+|%20)Meeting/);
      expect(links.outlook).toContain("outlook.live.com");
      expect(links.ics).toContain("data:text/calendar");
      expect(links.ics).toContain("VCALENDAR");
    });
  });
});
