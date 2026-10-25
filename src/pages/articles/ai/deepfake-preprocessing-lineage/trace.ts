export type TraceStatus = "ok" | "NO_FACE" | "TRACK_SWITCH" | "TOO_SMALL" | "not-run";

export interface FrameTrace {
  timestamp: string;
  decode: TraceStatus;
  face: TraceStatus;
  track: TraceStatus;
  crop: TraceStatus;
}

export const FRAME_TRACE: readonly FrameTrace[] = [
  { timestamp: "00:00", decode: "ok", face: "ok", track: "ok", crop: "ok" },
  { timestamp: "00:01", decode: "ok", face: "ok", track: "ok", crop: "ok" },
  { timestamp: "00:02", decode: "ok", face: "NO_FACE", track: "not-run", crop: "not-run" },
  { timestamp: "00:03", decode: "ok", face: "ok", track: "ok", crop: "ok" },
  { timestamp: "00:04", decode: "ok", face: "ok", track: "ok", crop: "ok" },
  { timestamp: "00:05", decode: "ok", face: "ok", track: "TRACK_SWITCH", crop: "not-run" },
  { timestamp: "00:06", decode: "ok", face: "ok", track: "ok", crop: "ok" },
  { timestamp: "00:07", decode: "ok", face: "NO_FACE", track: "not-run", crop: "not-run" },
  { timestamp: "00:08", decode: "ok", face: "ok", track: "ok", crop: "TOO_SMALL" },
  { timestamp: "00:09", decode: "ok", face: "ok", track: "ok", crop: "ok" },
] as const;

export const STAGE_COUNTS = {
  eligible: FRAME_TRACE.length,
  decoded: FRAME_TRACE.filter((row) => row.decode === "ok").length,
  detected: FRAME_TRACE.filter((row) => row.face === "ok").length,
  tracked: FRAME_TRACE.filter((row) => row.track === "ok").length,
  cropped: FRAME_TRACE.filter((row) => row.crop === "ok").length,
} as const;
