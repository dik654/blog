import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "문자열의 b는 base32 표시입니다",
    body: "b는 뒤의 binary CID를 base32로 썼다는 multibase prefix입니다. Binary CID 안의 field가 아닙니다.",
  },
  {
    label: "0x01은 CID version 1입니다",
    body: "Decoder는 최소 길이 unsigned varint를 읽습니다. 0x02·0x03 같은 예약 version이나 overlong varint를 거부합니다.",
  },
  {
    label: "0x55는 raw bytes codec입니다",
    body: "Content multicodec은 digest가 가리키는 bytes를 어떤 형식으로 해석할지 말합니다. 이 사례는 raw hello입니다.",
  },
  {
    label: "0x12·0x20 뒤에 digest가 옵니다",
    body: "0x12는 sha2-256, 0x20은 digest 32 bytes를 뜻합니다. Decoder는 정확히 32 bytes를 소비하고 trailing bytes도 거부합니다.",
  },
] as const;

const CID = "bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq";

const PARTS = [
  { x: 20, w: 60, label: "01", sub: "CIDv1", color: "#4f46e5", step: 1 },
  { x: 86, w: 70, label: "55", sub: "raw", color: "#0284c7", step: 2 },
  { x: 162, w: 70, label: "12", sub: "sha2-256", color: "#059669", step: 3 },
  { x: 238, w: 70, label: "20", sub: "32 bytes", color: "#d97706", step: 3 },
  {
    x: 314,
    w: 186,
    label: "2cf24dba…38b9824",
    sub: "digest of hello",
    color: "#dc2626",
    step: 3,
  },
] as const;

export default function CIDStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 520 188"
          aria-label="공식 raw hello CIDv1을 문자열과 binary field로 분해"
        >
          <rect
            x="20"
            y="18"
            width="480"
            height="42"
            rx="7"
            fill={step === 0 ? "#4f46e50d" : "#94a3b80d"}
            stroke={step === 0 ? "#4f46e5" : "#94a3b8"}
          />
          <text
            x="34"
            y="36"
            fontSize="10"
            fontWeight="700"
            fill={step === 0 ? "#4f46e5" : "#64748b"}
          >
            b
          </text>
          <text x="46" y="36" fontSize="8.8" fill="var(--foreground)">
            {CID.slice(1)}
          </text>
          <text
            x="260"
            y="52"
            textAnchor="middle"
            fontSize="8.5"
            fill="var(--muted-foreground)"
          >
            b = multibase base32 prefix · 그 뒤 = binary CID의 text encoding
          </text>

          <text
            x="20"
            y="85"
            fontSize="9"
            fontWeight="700"
            fill="var(--muted-foreground)"
          >
            binary CIDv1 (hex)
          </text>
          {PARTS.map((part) => {
            const active = step === part.step;
            return (
              <g key={`${part.x}-${part.label}`} opacity={active ? 1 : 0.28}>
                <rect
                  x={part.x}
                  y="96"
                  width={part.w}
                  height="52"
                  rx="6"
                  fill={`${part.color}0d`}
                  stroke={part.color}
                />
                <text
                  x={part.x + part.w / 2}
                  y="117"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={part.color}
                >
                  {part.label}
                </text>
                <text
                  x={part.x + part.w / 2}
                  y="136"
                  textAnchor="middle"
                  fontSize="8.5"
                  fill={part.color}
                >
                  {part.sub}
                </text>
              </g>
            );
          })}

          <path
            d="M162 158 H500"
            fill="none"
            stroke="#059669"
            strokeWidth="1.2"
          />
          <path
            d="M162 158 V153 M500 158 V153"
            fill="none"
            stroke="#059669"
            strokeWidth="1.2"
          />
          <text
            x="331"
            y="176"
            textAnchor="middle"
            fontSize="8.5"
            fill="#059669"
          >
            multihash = algorithm code + digest length + digest bytes
          </text>
        </svg>
      )}
    </StepViz>
  );
}
