import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "가까운 seed 세 개로 시작합니다",
    body: "Target T와의 XOR 거리가 A=40, B=52, C=77인 연락처를 result에 넣습니다. 아직 누구에게도 묻지 않았습니다.",
  },
  {
    label: "α=3개 query slot을 채웁니다",
    body: "가까운 미조회 후보 A·B·C를 동시에 묻습니다. 후보를 하나씩 따라가는 경로가 아니라 최대 세 질문을 함께 유지합니다.",
  },
  {
    label: "A의 답이 오면 D를 즉시 묻습니다",
    body: "A가 D=11·E=65·중복 B=52를 돌려줍니다. 중복을 빼고 가까운 네 개를 남긴 뒤, 빈 slot에는 가장 가까운 미조회 D를 바로 넣습니다.",
  },
  {
    label: "늦은 C의 답과 D의 답도 합칩니다",
    body: "C는 result에서 밀려났어도 이미 보낸 query의 답 F=18은 받습니다. 이어 D가 G=3을 알려 주면 result는 G·D·F·A가 됩니다.",
  },
  {
    label: "미조회와 진행 중 query가 모두 0이면 끝냅니다",
    body: "최종 result G=3·D=11·F=18·A=40은 모두 한 번 이상 물었습니다. in-flight도 0이므로 geth식 event loop가 종료됩니다.",
  },
] as const;

const COLORS = {
  seed: "#4f46e5",
  active: "#0284c7",
  found: "#059669",
  quiet: "#94a3b8",
};

type Candidate = {
  id: string;
  distance: number;
  state: "unasked" | "asked" | "in-flight";
  kind?: "seed" | "found";
};

const RESULTS: readonly Candidate[][] = [
  [
    { id: "A", distance: 40, state: "unasked", kind: "seed" },
    { id: "B", distance: 52, state: "unasked", kind: "seed" },
    { id: "C", distance: 77, state: "unasked", kind: "seed" },
  ],
  [
    { id: "A", distance: 40, state: "in-flight", kind: "seed" },
    { id: "B", distance: 52, state: "in-flight", kind: "seed" },
    { id: "C", distance: 77, state: "in-flight", kind: "seed" },
  ],
  [
    { id: "D", distance: 11, state: "in-flight", kind: "found" },
    { id: "A", distance: 40, state: "asked", kind: "seed" },
    { id: "B", distance: 52, state: "in-flight", kind: "seed" },
    { id: "E", distance: 65, state: "unasked", kind: "found" },
  ],
  [
    { id: "G", distance: 3, state: "in-flight", kind: "found" },
    { id: "D", distance: 11, state: "asked", kind: "found" },
    { id: "F", distance: 18, state: "in-flight", kind: "found" },
    { id: "A", distance: 40, state: "asked", kind: "seed" },
  ],
  [
    { id: "G", distance: 3, state: "asked", kind: "found" },
    { id: "D", distance: 11, state: "asked", kind: "found" },
    { id: "F", distance: 18, state: "asked", kind: "found" },
    { id: "A", distance: 40, state: "asked", kind: "seed" },
  ],
];

const QUERIES = [
  ["비어 있음", "비어 있음", "비어 있음"],
  ["A · d40", "B · d52", "C · d77"],
  ["D · d11", "B · d52", "C · d77"],
  ["G · d3", "E · d65", "F · d18"],
  ["완료", "완료", "완료"],
] as const;

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="lookup-arrow"
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

function QuerySlot({
  x,
  label,
  step,
}: {
  x: number;
  label: string;
  step: number;
}) {
  const done = label === "완료";
  const empty = label === "비어 있음";
  const color = done ? COLORS.found : empty ? COLORS.quiet : COLORS.active;
  return (
    <g opacity={empty ? 0.5 : 1}>
      <rect
        x={x}
        y="34"
        width="112"
        height="38"
        rx="7"
        fill={`${color}0d`}
        stroke={color}
      />
      <text
        x={x + 56}
        y="50"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill={color}
      >
        {label}
      </text>
      <text
        x={x + 56}
        y="64"
        textAnchor="middle"
        fontSize="7.5"
        fill="var(--muted-foreground)"
      >
        {step === 0 ? "query slot" : done ? "in-flight 0" : "in-flight"}
      </text>
    </g>
  );
}

function CandidateCard({ x, candidate }: { x: number; candidate: Candidate }) {
  const color = candidate.kind === "found" ? COLORS.found : COLORS.seed;
  const state =
    candidate.state === "in-flight"
      ? "질의 중"
      : candidate.state === "asked"
        ? "물어봄"
        : "미조회";
  return (
    <g>
      <rect
        x={x}
        y="138"
        width="88"
        height="48"
        rx="7"
        fill={`${color}0d`}
        stroke={color}
      />
      <text
        x={x + 44}
        y="155"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill={color}
      >
        {candidate.id} · d={candidate.distance}
      </text>
      <text
        x={x + 44}
        y="173"
        textAnchor="middle"
        fontSize="8"
        fill="var(--muted-foreground)"
      >
        {state}
      </text>
    </g>
  );
}

export default function KadIterativeLookupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const result = RESULTS[step];
        const directionDown = step >= 2 && step <= 3;
        const showArrow = step >= 1 && step <= 3;
        const status =
          step === 0
            ? "seen 3 · asked 0 · in-flight 0"
            : step === 1
              ? "seen 3 · asked 3 · in-flight 3"
              : step === 2
                ? "A 응답 → D·E 추가, B 중복 제거"
                : step === 3
                  ? "C 응답 F=18 · D 응답 G=3"
                  : "unasked 0 · in-flight 0 → 종료";

        return (
          <svg
            viewBox="0 0 420 232"
            aria-label="Kademlia lookup의 query slot과 거리순 result 변화"
          >
            <ArrowDefs />
            <text
              x="18"
              y="20"
              fontSize="9"
              fontWeight="800"
              fill="var(--foreground)"
            >
              query slots · α=3
            </text>
            {QUERIES[step].map((label, index) => (
              <QuerySlot
                key={`${step}-${label}-${index}`}
                x={18 + index * 132}
                label={label}
                step={step}
              />
            ))}

            {showArrow && (
              <g>
                <path
                  d={directionDown ? "M210 76 L210 115" : "M210 126 L210 80"}
                  fill="none"
                  stroke={directionDown ? COLORS.found : COLORS.active}
                  strokeWidth="1.4"
                  markerEnd="url(#lookup-arrow)"
                />
                <text
                  x="220"
                  y="104"
                  fontSize="8"
                  fontWeight="700"
                  fill={directionDown ? COLORS.found : COLORS.active}
                >
                  {directionDown ? "응답 merge" : "가까운 미조회 선택"}
                </text>
              </g>
            )}

            <text
              x="18"
              y="127"
              fontSize="9"
              fontWeight="800"
              fill="var(--foreground)"
            >
              target 거리순 result · toy k=4
            </text>
            {result.map((candidate, index) => (
              <CandidateCard
                key={`${candidate.id}-${candidate.distance}`}
                x={18 + index * 98}
                candidate={candidate}
              />
            ))}
            {result.length < 4 && (
              <rect
                x={18 + result.length * 98}
                y="138"
                width="88"
                height="48"
                rx="7"
                fill="none"
                stroke={COLORS.quiet}
                strokeDasharray="4 3"
                opacity="0.5"
              />
            )}

            <rect
              x="18"
              y="199"
              width="384"
              height="24"
              rx="6"
              fill="#0f172a08"
              stroke="#94a3b866"
            />
            <text
              x="210"
              y="215"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="700"
              fill={step === 4 ? COLORS.found : "var(--muted-foreground)"}
            >
              {status}
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
