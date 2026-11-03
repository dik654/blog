import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "연락처를 LogDist 구간에 나눕니다",
    body: "Self S 기준으로 P2는 LD2, P1은 LD4, P4는 LD7, P3은 LD8입니다. 이는 물리적 위치가 아니라 XOR ID 구간입니다.",
  },
  {
    label: "각 bucket은 bounded live entry만 둡니다",
    body: "설명용 LD4 bucket의 k는 3입니다. P1·N188·N189 세 연락처가 차면 더 넣을 live slot이 없습니다.",
  },
  {
    label: "새 N190은 replacement에 대기합니다",
    body: "Full bucket에 왔다고 기존 live entry를 즉시 밀어내지 않습니다. IP policy를 통과한 N190을 bounded replacement list에 둡니다.",
  },
  {
    label: "P1 재검증 실패 뒤 N190을 승격합니다",
    body: "P1이 재검증에 실패하면 제거하고 replacement N190을 live slot으로 옮깁니다. 후보가 여러 개일 때 선택 규칙은 구현에 귀속됩니다.",
  },
] as const;

const COLORS = {
  live: "#4f46e5",
  replacement: "#d97706",
  success: "#059669",
  failed: "#dc2626",
  quiet: "#94a3b8",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="bucket-arrow"
        viewBox="0 0 8 8"
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="4"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0 0 L8 4 L0 8 Z" fill="context-stroke" />
      </marker>
    </defs>
  );
}

function Pill({
  x,
  y,
  label,
  color,
  opacity = 1,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width="72"
        height="26"
        rx="5"
        fill={`${color}0d`}
        stroke={color}
      />
      <text
        x={x + 36}
        y={y + 17}
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill={color}
      >
        {label}
      </text>
    </g>
  );
}

function SmallRow({
  y,
  distance,
  peer,
  dimmed,
}: {
  y: number;
  distance: string;
  peer: string;
  dimmed: boolean;
}) {
  return (
    <g opacity={dimmed ? 0.25 : 1}>
      <text x="24" y={y + 17} fontSize="9.5" fontWeight="700" fill="#0284c7">
        {distance}
      </text>
      <rect
        x="80"
        y={y}
        width="380"
        height="26"
        rx="5"
        fill="#0284c708"
        stroke="#0284c7"
      />
      <text x="100" y={y + 17} fontSize="9" fontWeight="700" fill="#0284c7">
        {peer}
      </text>
    </g>
  );
}

export default function RoutingTableViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const focus = step >= 1;
        const failed = step >= 3;
        return (
          <svg
            viewBox="0 0 500 226"
            aria-label="LogDist별 bucket과 full bucket replacement 승격"
          >
            <ArrowDefs />
            <SmallRow
              y={14}
              distance="LD2"
              peer="P2 · XOR distance 2"
              dimmed={focus}
            />

            <text
              x="24"
              y="85"
              fontSize="9.5"
              fontWeight="700"
              fill={COLORS.live}
            >
              LD4
            </text>
            <rect
              x="80"
              y="54"
              width="280"
              height="50"
              rx="7"
              fill="#4f46e508"
              stroke={COLORS.live}
            />
            <text x="92" y="69" fontSize="8.5" fill={COLORS.live}>
              live entries · toy k=3
            </text>
            <Pill
              x={94}
              y={73}
              label={failed ? "P1 · failed" : "P1 · 185"}
              color={failed ? COLORS.failed : COLORS.live}
            />
            <Pill x={180} y={73} label="N188" color={COLORS.live} />
            <Pill x={266} y={73} label="N189" color={COLORS.live} />
            {failed && (
              <line
                x1="99"
                y1="78"
                x2="161"
                y2="94"
                stroke={COLORS.failed}
                strokeWidth="1.2"
              />
            )}

            <g opacity={step >= 2 ? 1 : 0.22}>
              <text x="374" y="69" fontSize="8.5" fill={COLORS.replacement}>
                replacement
              </text>
              <Pill
                x={380}
                y={73}
                label={failed ? "N190 ↑" : "N190"}
                color={failed ? COLORS.success : COLORS.replacement}
              />
            </g>

            {step === 2 && (
              <line
                x1="374"
                y1="86"
                x2="365"
                y2="86"
                stroke={COLORS.replacement}
                strokeWidth="1.2"
                strokeDasharray="4 3"
                markerEnd="url(#bucket-arrow)"
              />
            )}
            {failed && (
              <path
                d="M380 104 C330 132 174 132 132 108"
                fill="none"
                stroke={COLORS.success}
                strokeWidth="1.2"
                markerEnd="url(#bucket-arrow)"
              />
            )}

            <SmallRow
              y={126}
              distance="LD7"
              peer="P4 · XOR distance 64"
              dimmed={focus}
            />
            <SmallRow
              y={168}
              distance="LD8"
              peer="P3 · XOR distance 128"
              dimmed={focus}
            />

            <text
              x="250"
              y="218"
              textAnchor="middle"
              fontSize="8.5"
              fill="var(--muted-foreground)"
            >
              Toy k=3은 절차 설명용 · geth v1.17.8 bucketSize는 16입니다
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
