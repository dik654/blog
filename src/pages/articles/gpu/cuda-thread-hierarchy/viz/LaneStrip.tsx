/** Warp 하나의 32 lane을 한 줄로 그립니다. color가 null이면 참여하지 않거나 비어 있는 lane입니다. */
export default function LaneStrip({
  colorOf,
  outline = true,
  ring = null,
}: {
  colorOf: (lane: number) => string | null;
  outline?: boolean;
  ring?: number | null;
}) {
  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(32, minmax(0, 1fr))" }}>
      {Array.from({ length: 32 }, (_, lane) => {
        const color = colorOf(lane);
        return (
          <span
            key={lane}
            className="h-5 rounded-[1px] border"
            style={{
              backgroundColor: color ?? "transparent",
              borderColor: lane === ring ? "#dc2626" : color ? color : outline ? "#94a3b8" : "transparent",
              opacity: !color && outline ? 0.55 : 1,
              outline: lane === ring ? "1px solid #dc2626" : undefined,
              outlineOffset: lane === ring ? 1 : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
