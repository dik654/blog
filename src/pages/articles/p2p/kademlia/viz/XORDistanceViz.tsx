import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "Self S와 연락처 P1의 8-bit ID를 맞춥니다",
    body: "S=10110100(180), P1=10111001(185)입니다. XOR는 같은 길이의 같은 bit 위치끼리 계산합니다.",
  },
  {
    label: "같은 bit는 0, 다른 bit는 1로 바꿉니다",
    body: "앞 네 bit는 같고 뒤에서 차이가 생겨 XOR 결과가 00001101이 됩니다.",
  },
  {
    label: "XOR를 정수 13과 LogDist 4로 읽습니다",
    body: "00001101은 정수 13이고 가장 높은 1의 위치가 3이므로 LogDist는 3+1=4입니다.",
  },
  {
    label: "다른 연락처도 같은 self 기준으로 정렬합니다",
    body: "P2의 거리는 2, P1은 13, P4는 64, P3은 128입니다. 이 순서는 RTT나 지리적 가까움이 아닙니다.",
  },
] as const;

const A = [1, 0, 1, 1, 0, 1, 0, 0];
const B = [1, 0, 1, 1, 1, 0, 0, 1];
const X = A.map((bit, index) => bit ^ B[index]);
const X0 = 82;
const BW = 34;
const GAP = 7;

function BitRow({
  y,
  label,
  bits,
  color,
  active,
}: {
  y: number;
  label: string;
  bits: number[];
  color: string;
  active: boolean;
}) {
  return (
    <g opacity={active ? 1 : 0.3}>
      <text x="20" y={y + 18} fontSize="10" fontWeight="700" fill={color}>
        {label}
      </text>
      {bits.map((bit, index) => (
        <g key={`${label}-${index}`}>
          <rect
            x={X0 + index * (BW + GAP)}
            y={y}
            width={BW}
            height="28"
            rx="5"
            fill={`${color}0d`}
            stroke={color}
          />
          <text
            x={X0 + index * (BW + GAP) + BW / 2}
            y={y + 19}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill={color}
          >
            {bit}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function XORDistanceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 450 230"
          aria-label="Self S와 P1의 XOR 거리와 다른 연락처 정렬"
        >
          <BitRow y={20} label="S" bits={A} color="#4f46e5" active />
          <BitRow y={62} label="P1" bits={B} color="#059669" active />
          <BitRow
            y={110}
            label="S⊕P1"
            bits={X}
            color="#d97706"
            active={step >= 1}
          />

          {step >= 2 && (
            <>
              <rect
                x="82"
                y="154"
                width="157"
                height="34"
                rx="6"
                fill="#d977060d"
                stroke="#d97706"
              />
              <text
                x="160.5"
                y="175"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="#d97706"
              >
                00001101₂ = 13₁₀
              </text>
              <rect
                x="252"
                y="154"
                width="176"
                height="34"
                rx="6"
                fill="#7c3aed0d"
                stroke="#7c3aed"
              />
              <text
                x="340"
                y="175"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="#7c3aed"
              >
                highest bit 3 + 1 = LogDist 4
              </text>
            </>
          )}

          {step >= 3 && (
            <>
              {[
                ["P2", "2 · LD2"],
                ["P1", "13 · LD4"],
                ["P4", "64 · LD7"],
                ["P3", "128 · LD8"],
              ].map(([peer, distance], index) => (
                <g key={peer}>
                  <rect
                    x={66 + index * 94}
                    y="198"
                    width="84"
                    height="26"
                    rx="5"
                    fill="#0284c70d"
                    stroke="#0284c7"
                  />
                  <text
                    x={108 + index * 94}
                    y="215"
                    textAnchor="middle"
                    fontSize="8.8"
                    fontWeight="700"
                    fill="#0284c7"
                  >
                    {peer} · {distance}
                  </text>
                </g>
              ))}
            </>
          )}

          {step < 3 && (
            <text
              x="225"
              y="218"
              textAnchor="middle"
              fontSize="8.5"
              fill="var(--muted-foreground)"
            >
              8-bit fixture · 실제 protocol은 더 긴 고정 길이 ID를 씁니다
            </text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
