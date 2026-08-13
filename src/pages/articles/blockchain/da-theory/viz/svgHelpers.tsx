/** Renders a line with arrowhead marker. id must be unique per SVG. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  id: string;
}) {
  return (
    <>
      <defs>
        <marker
          id={id}
          viewBox="0 0 6 6"
          refX={6}
          refY={3}
          markerWidth={5}
          markerHeight={5}
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6Z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={1}
        markerEnd={`url(#${id})`}
      />
    </>
  );
}
