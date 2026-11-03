import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "URL은 받을 곳을 정합니다",
    body: "https://files.example/readme.txt는 서버 위치를 알려 줍니다. 같은 URL이 오늘은 hello, 내일은 hello!를 돌려줘도 URL 자체는 바뀌지 않습니다.",
  },
  {
    label: "CID는 기대하는 bytes를 고정합니다",
    body: "이 사례의 raw bytes는 정확히 hello 다섯 글자입니다. CID 안의 SHA-256 digest가 기대값을 고정합니다.",
  },
  {
    label: "어느 provider에서든 bytes를 받습니다",
    body: "Provider A와 B는 위치 후보일 뿐입니다. CID가 있다고 provider가 존재하거나 응답한다는 보장은 없습니다.",
  },
  {
    label: "받은 bytes를 다시 hash해 판정합니다",
    body: "SHA-256(received)가 CID의 digest와 같으면 bytes를 수락합니다. 이 검사는 작성자·내용의 진실성·malware 안전성을 증명하지 않습니다.",
  },
] as const;

const COLORS = {
  location: "#dc2626",
  cid: "#4f46e5",
  provider: "#0284c7",
  accept: "#059669",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="addressing-arrow"
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

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth="1.2"
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd="url(#addressing-arrow)"
    />
  );
}

export default function AddressingCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 500 210"
          aria-label="hello bytes를 URL로 찾고 CID로 검증하는 과정"
        >
          <ArrowDefs />

          <rect
            x="18"
            y="22"
            width="190"
            height="54"
            rx="7"
            fill={`${COLORS.location}0d`}
            stroke={COLORS.location}
          />
          <text
            x="113"
            y="43"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={COLORS.location}
          >
            files.example/readme.txt
          </text>
          <text
            x="113"
            y="61"
            textAnchor="middle"
            fontSize="9"
            fill={COLORS.location}
          >
            위치는 같아도 응답 bytes는 바뀔 수 있음
          </text>

          <rect
            x="292"
            y="22"
            width="190"
            height="54"
            rx="7"
            fill={`${COLORS.cid}0d`}
            stroke={COLORS.cid}
            opacity={step >= 1 ? 1 : 0.28}
          />
          <text
            x="387"
            y="43"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={COLORS.cid}
            opacity={step >= 1 ? 1 : 0.45}
          >
            raw CIDv1 · bafk…4yeq
          </text>
          <text
            x="387"
            y="61"
            textAnchor="middle"
            fontSize="9"
            fill={COLORS.cid}
            opacity={step >= 1 ? 1 : 0.45}
          >
            기대 bytes = UTF-8 “hello”
          </text>

          {step >= 2 && (
            <>
              <rect
                x="48"
                y="112"
                width="112"
                height="38"
                rx="7"
                fill={`${COLORS.provider}0d`}
                stroke={COLORS.provider}
              />
              <text
                x="104"
                y="135"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={COLORS.provider}
              >
                Provider A · “hello”
              </text>
              <rect
                x="196"
                y="112"
                width="112"
                height="38"
                rx="7"
                fill={`${COLORS.provider}0d`}
                stroke={COLORS.provider}
              />
              <text
                x="252"
                y="135"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={COLORS.provider}
              >
                Provider B · “hello!”
              </text>
              <Arrow
                x1={104}
                y1={106}
                x2={335}
                y2={80}
                color={COLORS.provider}
                dashed
              />
              <Arrow
                x1={252}
                y1={106}
                x2={367}
                y2={80}
                color={COLORS.provider}
                dashed
              />
            </>
          )}

          {step >= 3 && (
            <>
              <rect
                x="336"
                y="110"
                width="146"
                height="76"
                rx="7"
                fill={`${COLORS.accept}0d`}
                stroke={COLORS.accept}
              />
              <text
                x="409"
                y="131"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={COLORS.accept}
              >
                SHA-256(received) = digest?
              </text>
              <text
                x="409"
                y="151"
                textAnchor="middle"
                fontSize="9"
                fill={COLORS.accept}
              >
                “hello” → ACCEPT
              </text>
              <text
                x="409"
                y="168"
                textAnchor="middle"
                fontSize="9"
                fill={COLORS.location}
              >
                “hello!” → REJECT
              </text>
              <Arrow x1={387} y1={82} x2={405} y2={104} color={COLORS.accept} />
            </>
          )}

          <text
            x="250"
            y="204"
            textAnchor="middle"
            fontSize="8.5"
            fill="var(--muted-foreground)"
          >
            CID는 검증 기준입니다 · provider 발견과 availability는 별도입니다
          </text>
        </svg>
      )}
    </StepViz>
  );
}
