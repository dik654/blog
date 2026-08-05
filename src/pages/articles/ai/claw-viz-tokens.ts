export const clawViz = {
  panel: 'var(--card)',
  panelAlt: 'var(--muted)',
  border: 'var(--border)',
  text: 'var(--foreground)',
  muted: 'var(--muted-foreground)',
  rail: '#64748b',
  claw: '#2563eb',
  original: '#0f766e',
  warning: '#a16207',
  danger: '#b42318',
  info: '#0891b2',
  violet: '#6d28d9',
};

export const comparisonAccent = (index: number) => [
  clawViz.rail,
  clawViz.warning,
  clawViz.original,
  clawViz.violet,
][index % 4];
