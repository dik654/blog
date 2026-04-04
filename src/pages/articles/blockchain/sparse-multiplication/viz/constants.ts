// Shared colors and constants for all sparse multiplication viz
export const PRIMARY = '#6366f1';   // indigo — main element
export const ACCENT = '#10b981';    // emerald — non-zero slots
export const WARN = '#f59e0b';      // amber — highlight/savings
export const MUTED = '#6b7280';     // gray — zero/inactive

export const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

// 12 Fp slots — non-zero positions for line function (indices 0, 2, 3)
export const NONZERO_IDX = [0, 2, 3] as const;
export const SLOT_COUNT = 12;
