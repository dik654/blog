import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const ATTACK = "#dc2626";
const DEFENSE = "#4f46e5";
const HONEST = "#059669";
const MUTED = "var(--muted-foreground)";

const STEPS = [
  "한 운영자 Mallory가 서로 다른 공개키·노드 ID 40개를 만듭니다.",
  "한 public /24만 쓰면 geth 버킷 quota상 최대 2자리입니다.",
  "여덟 public /24를 쓰면 quota 계산만으로는 8×2=16자리가 가능합니다.",
  "16자리는 용량 상한일 뿐입니다. 거리·liveness·replacement도 통과해야 합니다.",
];

function Slots({ filled }: { filled: number }) {
  return (
    <g>
      {Array.from({ length: 16 }, (_, index) => {
        const col = index % 8;
        const row = Math.floor(index / 8);
        const active = index < filled;
        return (
          <g key={index}>
            <rect
              x={44 + col * 34}
              y={124 + row * 34}
              width={27}
              height={25}
              rx={5}
              fill={active ? `${ATTACK}20` : "var(--card)"}
              stroke={active ? ATTACK : "var(--border)"}
              strokeWidth={1}
            />
            <text
              x={57.5 + col * 34}
              y={141 + row * 34}
              textAnchor="middle"
              fontSize={9}
              fontWeight={active ? 700 : 500}
              fill={active ? ATTACK : MUTED}
            >
              {active ? "M" : index + 1}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function SybilAttackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 360 255"
          className="mx-auto h-auto w-full max-w-xl"
          role="img"
          aria-label={STEPS[step]}
        >
          <defs>
            <marker
              id="sybil-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={ATTACK} />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <line
                x1={180}
                y1={67}
                x2={180}
                y2={91}
                stroke={ATTACK}
                strokeWidth={1.2}
                markerEnd="url(#sybil-arrow)"
              />
              <rect
                x={120}
                y={25}
                width={120}
                height={42}
                rx={10}
                fill={`${ATTACK}12`}
                stroke={ATTACK}
              />
              <text
                x={180}
                y={43}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={ATTACK}
              >
                운영자 1명 · Mallory
              </text>
              <text
                x={180}
                y={58}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                서버·회선·자금은 한 주체
              </text>
              <rect
                x={62}
                y={95}
                width={236}
                height={78}
                rx={12}
                fill="var(--card)"
                stroke="var(--border)"
              />
              <text
                x={180}
                y={114}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="var(--foreground)"
              >
                서로 다른 공개키·노드 ID 40개
              </text>
              {Array.from({ length: 10 }, (_, index) => (
                <g key={index}>
                  <circle
                    cx={84 + (index % 5) * 48}
                    cy={136 + Math.floor(index / 5) * 23}
                    r={8}
                    fill={`${ATTACK}18`}
                    stroke={ATTACK}
                  />
                  <text
                    x={84 + (index % 5) * 48}
                    y={139 + Math.floor(index / 5) * 23}
                    textAnchor="middle"
                    fontSize={7.5}
                    fontWeight={700}
                    fill={ATTACK}
                  >
                    M{index + 1}
                  </text>
                </g>
              ))}
              <text
                x={180}
                y={203}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="var(--foreground)"
              >
                ID 40개 ≠ 독립 운영자 40명
              </text>
              <text
                x={180}
                y={221}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                이것이 Sybil 능력의 출발점입니다
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <text
                x={180}
                y={25}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="var(--foreground)"
              >
                목표 거리 버킷 · 16자리
              </text>
              <rect
                x={42}
                y={42}
                width={276}
                height={52}
                rx={10}
                fill={`${DEFENSE}0D`}
                stroke={DEFENSE}
              />
              <text
                x={180}
                y={63}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill={DEFENSE}
              >
                203.0.113.0/24에서 후보 40개 도착
              </text>
              <text
                x={180}
                y={80}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                같은 prefix의 버킷 상한 = 2
              </text>
              <Slots filled={2} />
              <text
                x={180}
                y={207}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={ATTACK}
              >
                40개를 보내도 quota 자리 상한은 2개
              </text>
              <text
                x={180}
                y={225}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                2 ÷ 16 = 12.5% · 공격 부재의 증명은 아님
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <text
                x={180}
                y={25}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="var(--foreground)"
              >
                목표 거리 버킷 · 16자리
              </text>
              <rect
                x={42}
                y={42}
                width={276}
                height={52}
                rx={10}
                fill={`${ATTACK}0D`}
                stroke={ATTACK}
              />
              <text
                x={180}
                y={63}
                textAnchor="middle"
                fontSize={10.5}
                fontWeight={700}
                fill={ATTACK}
              >
                Mallory가 public /24를 8개 확보
              </text>
              <text
                x={180}
                y={80}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                prefix마다 2자리 × 8 = 16자리
              </text>
              <Slots filled={16} />
              <text
                x={180}
                y={207}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={ATTACK}
              >
                Prefix quota만 보면 전체 점유 가능
              </text>
              <text
                x={180}
                y={225}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                여러 prefix가 여러 운영자를 뜻하지 않습니다
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <rect
                x={39}
                y={24}
                width={282}
                height={54}
                rx={10}
                fill={`${ATTACK}0D`}
                stroke={ATTACK}
              />
              <text
                x={180}
                y={46}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={ATTACK}
              >
                quota상 16자리 가능
              </text>
              <text
                x={180}
                y={64}
                textAnchor="middle"
                fontSize={9.5}
                fill={MUTED}
              >
                아직 실제 버킷 점유·Eclipse 성공은 아님
              </text>
              <line
                x1={180}
                y1={78}
                x2={180}
                y2={98}
                stroke={DEFENSE}
                strokeWidth={1.2}
              />
              {[
                ["ID 거리", "목표 버킷에 들어오는가?"],
                ["입장·교체", "live·replacement 경쟁을 이기는가?"],
                ["생존", "PING·record 검증을 통과하는가?"],
                ["다른 경로", "정직한 bootstrap·응답이 남아 있는가?"],
              ].map(([label, detail], index) => (
                <g key={label}>
                  <rect
                    x={42}
                    y={101 + index * 32}
                    width={276}
                    height={25}
                    rx={6}
                    fill="var(--card)"
                    stroke={index === 3 ? HONEST : DEFENSE}
                  />
                  <text
                    x={55}
                    y={117 + index * 32}
                    fontSize={9.5}
                    fontWeight={700}
                    fill={index === 3 ? HONEST : DEFENSE}
                  >
                    {label}
                  </text>
                  <text
                    x={305}
                    y={117 + index * 32}
                    textAnchor="end"
                    fontSize={9}
                    fill={MUTED}
                  >
                    {detail}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
