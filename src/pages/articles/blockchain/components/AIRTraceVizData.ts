const TRACE_ROWS = 6;

const genFib = () => {
  const rows: number[][] = [];
  let a = 1, b = 1;
  for (let i = 0; i < TRACE_ROWS; i++) {
    rows.push([a, b, a + b]);
    [a, b] = [b, a + b];
  }
  return rows;
};

export const TRACE = genFib();
export { TRACE_ROWS };
export const COLS = ['a', 'b', 'c'];
export const COL_COLORS = ['#6366f1', '#0ea5e9', '#10b981'];
