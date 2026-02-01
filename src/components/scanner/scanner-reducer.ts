import type { ScanProgress, ScanResult } from "@/lib/scanner/types";

// Scanner state types using discriminated unions
export type ScannerState =
  | { view: "input"; url: string }
  | { view: "scanning"; url: string; progress: ScanProgress }
  | { view: "error"; url: string; error: string }
  | { view: "results"; url: string; result: ScanResult; unlocked: boolean };

// Action types
export type ScannerAction =
  | { type: "SET_URL"; url: string }
  | { type: "START_SCAN" }
  | { type: "UPDATE_PROGRESS"; progress: ScanProgress }
  | { type: "SCAN_COMPLETE"; result: ScanResult }
  | { type: "SCAN_ERROR"; error: string }
  | { type: "UNLOCK_RESULTS" }
  | { type: "RESET" };

// Initial state
export const initialScannerState: ScannerState = {
  view: "input",
  url: "",
};

// Reducer function
export function scannerReducer(
  state: ScannerState,
  action: ScannerAction
): ScannerState {
  switch (action.type) {
    case "SET_URL":
      if (state.view === "input") {
        return { ...state, url: action.url };
      }
      return state;

    case "START_SCAN":
      if (state.view === "input" && state.url.trim()) {
        return {
          view: "scanning",
          url: state.url,
          progress: {
            stage: "initialising",
            message: "Initialising...",
            progress: 0,
          },
        };
      }
      return state;

    case "UPDATE_PROGRESS":
      if (state.view === "scanning") {
        return { ...state, progress: action.progress };
      }
      return state;

    case "SCAN_COMPLETE":
      if (state.view === "scanning") {
        return {
          view: "results",
          url: state.url,
          result: action.result,
          unlocked: false,
        };
      }
      return state;

    case "SCAN_ERROR":
      if (state.view === "scanning") {
        return {
          view: "error",
          url: state.url,
          error: action.error,
        };
      }
      return state;

    case "UNLOCK_RESULTS":
      if (state.view === "results") {
        return { ...state, unlocked: true };
      }
      return state;

    case "RESET":
      return initialScannerState;

    default:
      return state;
  }
}

// Helper to get URL from any state
export function getUrl(state: ScannerState): string {
  return state.url;
}

// Helper to check if scanning
export function isScanning(state: ScannerState): boolean {
  return state.view === "scanning";
}
