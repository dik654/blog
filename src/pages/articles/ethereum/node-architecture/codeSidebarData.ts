import type { LineNote } from './archCodeRefs';

export const COLORS: Record<LineNote['color'], {
  bg: string; border: string; badgeBg: string; badgeText: string; dot: string;
}> = {
  sky:     { bg: 'rgba(14,165,233,0.09)',  border: '#0ea5e9', badgeBg: '#e0f2fe', badgeText: '#0369a1', dot: '#0ea5e9' },
  emerald: { bg: 'rgba(16,185,129,0.09)',  border: '#10b981', badgeBg: '#d1fae5', badgeText: '#065f46', dot: '#10b981' },
  amber:   { bg: 'rgba(245,158,11,0.09)',  border: '#f59e0b', badgeBg: '#fef3c7', badgeText: '#92400e', dot: '#f59e0b' },
  violet:  { bg: 'rgba(139,92,246,0.09)',  border: '#8b5cf6', badgeBg: '#ede9fe', badgeText: '#4c1d95', dot: '#8b5cf6' },
  rose:    { bg: 'rgba(244,63,94,0.09)',   border: '#f43f5e', badgeBg: '#ffe4e6', badgeText: '#881337', dot: '#f43f5e' },
};

export const CIRCLES = ['①', '②', '③', '④', '⑤', '⑥'];
