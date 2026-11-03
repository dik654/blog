import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const ATTACK = "#dc2626";
const DEFENSE = "#4f46e5";
const HONEST = "#059669";
const MUTED = "var(--muted-foreground)";

const STEPS = [
  "Alice의 시작 후보에는 정직한 노드와 Mallory 노드가 섞여 있습니다.",
  "Mallory는 목표 T에 가까운 ID를 골라 여러 입구로 후보를 노출합니다.",
  "Alice는 가까운 Mallory 후보에게 T에 더 가까운 노드를 묻습니다.",
  "Mallory가 자기 노드만 돌려주면 shortlist에서 정직한 경로가 사라집니다.",
  "Bootstrap·입장·replacement·재검증·교차 확인을 겹쳐 이 경로를 끊습니다.",
];

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="eclipse-attack-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={ATTACK} />
      </marker>
      <marker
        id="eclipse-honest-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={HONEST} />
      </marker>
      <marker
        id="eclipse-defense-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={DEFENSE} />
      </marker>
    </defs>
  );
}

function Node({
  x,
  y,
  label,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  tone: string;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={17}
        fill={`${tone}15`}
        stroke={tone}
        strokeWidth={1.2}
      />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        fontSize={9.5}
        fontWeight={700}
        fill={tone}
      >
        {label}
      </text>
    </g>
  );
}

export default function EclipseAttackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 360 280"
          className="mx-auto h-auto w-full max-w-xl"
          role="img"
          aria-label={STEPS[step]}
        >
          <ArrowDefs />

          {step === 0 && (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <line
                x1={91}
                y1={123}
                x2={151}
                y2={139}
                stroke={HONEST}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-honest-arrow)"
              />
              <line
                x1={91}
                y1={174}
                x2={151}
                y2={153}
                stroke={HONEST}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-honest-arrow)"
              />
              <line
                x1={269}
                y1={123}
                x2={209}
                y2={139}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <line
                x1={269}
                y1={174}
                x2={209}
                y2={153}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <text
                x={180}
                y={27}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="var(--foreground)"
              >
                Alice가 T를 찾기 시작한 순간
              </text>
              <rect
                x={114}
                y={48}
                width={132}
                height={43}
                rx={10}
                fill="var(--card)"
                stroke="var(--foreground)"
              />
              <text
                x={180}
                y={66}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill="var(--foreground)"
              >
                shortlist
              </text>
              <text
                x={180}
                y={82}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                정직한 후보 + Mallory 후보
              </text>
              <Node x={74} y={118} label="H1" tone={HONEST} />
              <Node x={74} y={179} label="H2" tone={HONEST} />
              <Node x={286} y={118} label="M1" tone={ATTACK} />
              <Node x={286} y={179} label="M2" tone={ATTACK} />
              <rect
                x={151}
                y={125}
                width={58}
                height={44}
                rx={10}
                fill={`${DEFENSE}12`}
                stroke={DEFENSE}
              />
              <text
                x={180}
                y={143}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={DEFENSE}
              >
                Alice
              </text>
              <text
                x={180}
                y={158}
                textAnchor="middle"
                fontSize={9}
                fill={MUTED}
              >
                target T
              </text>
              <rect
                x={51}
                y={222}
                width={258}
                height={34}
                rx={8}
                fill={`${HONEST}0D`}
                stroke={HONEST}
              />
              <text
                x={180}
                y={243}
                textAnchor="middle"
                fontSize={9.5}
                fill={HONEST}
              >
                정직한 후보가 남아 있어 아직 Eclipse가 아닙니다
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <line
                x1={180}
                y1={77}
                x2={180}
                y2={100}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <line
                x1={180}
                y1={148}
                x2={180}
                y2={172}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <rect
                x={91}
                y={27}
                width={178}
                height={50}
                rx={10}
                fill={`${ATTACK}12`}
                stroke={ATTACK}
              />
              <text
                x={180}
                y={48}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill={ATTACK}
              >
                ① ID grinding
              </text>
              <text
                x={180}
                y={64}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                T에 가까운 Mallory ID 선택
              </text>
              <rect
                x={57}
                y={104}
                width={246}
                height={44}
                rx={10}
                fill="var(--card)"
                stroke="var(--border)"
              />
              <text
                x={180}
                y={122}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill="var(--foreground)"
              >
                ② 후보 노출
              </text>
              <text
                x={180}
                y={138}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                bootstrap · lookup 응답 · inbound 접촉
              </text>
              <rect
                x={57}
                y={176}
                width={246}
                height={44}
                rx={10}
                fill={`${DEFENSE}0D`}
                stroke={DEFENSE}
              />
              <text
                x={180}
                y={194}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill={DEFENSE}
              >
                ③ 입장·교체·생존 규칙과 경쟁
              </text>
              <text
                x={180}
                y={210}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                quota · 기존 live entry · replacement · PING
              </text>
              <text
                x={180}
                y={250}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={ATTACK}
              >
                Sybil을 “보유”하는 것과 table에 “들어오는 것”은 다릅니다
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <line
                x1={180}
                y1={96}
                x2={107}
                y2={126}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <line
                x1={180}
                y1={96}
                x2={253}
                y2={126}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <rect
                x={118}
                y={39}
                width={124}
                height={57}
                rx={10}
                fill={`${DEFENSE}12`}
                stroke={DEFENSE}
              />
              <text
                x={180}
                y={60}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill={DEFENSE}
              >
                Alice의 lookup
              </text>
              <text
                x={180}
                y={77}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                “T에 더 가까운 노드는?”
              </text>
              <Node x={91} y={139} label="M1" tone={ATTACK} />
              <Node x={269} y={139} label="M2" tone={ATTACK} />
              <line
                x1={91}
                y1={157}
                x2={91}
                y2={190}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <line
                x1={269}
                y1={157}
                x2={269}
                y2={190}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <rect
                x={47}
                y={194}
                width={88}
                height={39}
                rx={8}
                fill={`${ATTACK}0D`}
                stroke={ATTACK}
              />
              <rect
                x={225}
                y={194}
                width={88}
                height={39}
                rx={8}
                fill={`${ATTACK}0D`}
                stroke={ATTACK}
              />
              <text
                x={91}
                y={218}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight={700}
                fill={ATTACK}
              >
                M3 · M4 반환
              </text>
              <text
                x={269}
                y={218}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight={700}
                fill={ATTACK}
              >
                M5 · M6 반환
              </text>
              <text
                x={180}
                y={259}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                Lookup 응답까지 통제해야 후보가 계속 Mallory 쪽으로 좁혀집니다
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <rect
                x={59}
                y={25}
                width={242}
                height={48}
                rx={10}
                fill={`${ATTACK}12`}
                stroke={ATTACK}
              />
              <text
                x={180}
                y={46}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill={ATTACK}
              >
                Alice의 최종 shortlist
              </text>
              <text
                x={180}
                y={62}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                M1 · M2 · M3 · M4 · M5 · M6 …
              </text>
              <line
                x1={180}
                y1={73}
                x2={180}
                y2={102}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <circle
                cx={180}
                cy={125}
                r={22}
                fill={`${DEFENSE}12`}
                stroke={DEFENSE}
                strokeWidth={1.2}
              />
              <text
                x={180}
                y={129}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={DEFENSE}
              >
                Alice
              </text>
              <path
                d="M 151 151 C 121 170, 96 193, 78 220"
                fill="none"
                stroke={HONEST}
                strokeWidth={1.2}
                strokeDasharray="4 4"
              />
              <path
                d="M 209 151 C 239 170, 264 193, 282 220"
                fill="none"
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#eclipse-attack-arrow)"
              />
              <g opacity={0.45}>
                <Node x={68} y={232} label="H" tone={HONEST} />
                <line
                  x1={83}
                  y1={221}
                  x2={99}
                  y2={205}
                  stroke={ATTACK}
                  strokeWidth={1.2}
                />
                <line
                  x1={84}
                  y1={205}
                  x2={99}
                  y2={221}
                  stroke={ATTACK}
                  strokeWidth={1.2}
                />
              </g>
              <Node x={292} y={232} label="M" tone={ATTACK} />
              <text
                x={180}
                y={267}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight={700}
                fill="var(--foreground)"
              >
                정직한 경로가 사라진 범위에서 view capture가 성립합니다
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <text
                x={180}
                y={24}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="var(--foreground)"
              >
                공격 경로의 문마다 다른 증거를 확인합니다
              </text>
              {[
                ["시작 표본", "독립된 bootstrap source", HONEST],
                ["입장", "prefix·direction·source quota", DEFENSE],
                [
                  "자리 교체",
                  "오래된 live entry + bounded replacement",
                  DEFENSE,
                ],
                ["생존", "PING + newer signed record", DEFENSE],
                ["Lookup", "여러 경로의 응답 교차 확인", HONEST],
                ["Payload", "application 내용은 다시 검증", HONEST],
              ].map(([label, detail, tone], index) => {
                const y = 43 + index * 36;
                return (
                  <g key={label}>
                    {index < 5 && (
                      <line
                        x1={180}
                        y1={y + 28}
                        x2={180}
                        y2={y + 35}
                        stroke={tone}
                        strokeWidth={1.2}
                        markerEnd="url(#eclipse-defense-arrow)"
                      />
                    )}
                    <rect
                      x={38}
                      y={y}
                      width={284}
                      height={29}
                      rx={7}
                      fill={`${tone}0D`}
                      stroke={tone}
                    />
                    <text
                      x={52}
                      y={y + 18.5}
                      fontSize={9.5}
                      fontWeight={700}
                      fill={tone}
                    >
                      {label}
                    </text>
                    <text
                      x={308}
                      y={y + 18.5}
                      textAnchor="end"
                      fontSize={9}
                      fill={MUTED}
                    >
                      {detail}
                    </text>
                  </g>
                );
              })}
              <text
                x={180}
                y={269}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight={700}
                fill={ATTACK}
              >
                한 층을 통과했다고 독립 운영자·정직성이 증명되지는 않습니다
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
