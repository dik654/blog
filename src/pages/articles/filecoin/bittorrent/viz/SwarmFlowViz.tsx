import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";
import { AnnotationBox } from "@/components/viz/boxes";

const STEPS = [
  { label: ".torrent 파일에서 해시 목록 확인" },
  { label: "Tracker/DHT에서 피어 후보 획득" },
  { label: "여러 피어에서 병렬 다운로드" },
  { label: "SHA1 해시로 조각 무결성 검증" },
  { label: "수신 조각을 다른 피어에 재공유" },
];
const ANNOT = [
  "조각별 SHA1 해시 확인",
  "Tracker/DHT endpoint 후보",
  "여러 피어에서 block 다운로드",
  "SHA1 조각 무결성 검증",
  "조각 재공유 (Seeding)",
];
const C = ["#6366f1", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
const PEERS = ["P1", "P2", "P3", "P4", "P5", "P6"];

export default function SwarmFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 500 160"
          className="w-full max-w-2xl"
          style={{ height: "auto" }}
        >
          {/* peer circle layout */}
          {PEERS.map((p, i) => {
            const angle = (i / PEERS.length) * Math.PI * 2 - Math.PI / 2;
            const cx = 200 + Math.cos(angle) * 55;
            const cy = 75 + Math.sin(angle) * 45;
            const uploading = i % 2 === 0;
            const peerC = uploading ? "#10b981" : "#6366f1";
            return (
              <motion.g
                key={p}
                animate={{ scale: step >= 2 ? 1 : 0.85 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={16}
                  fill={peerC + "18"}
                  stroke={peerC}
                  strokeWidth={1.25}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill={peerC}
                >
                  {p}
                </text>
              </motion.g>
            );
          })}
          {/* central element per step */}
          {step === 0 && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ transformOrigin: "200px 75px" }}
            >
              <rect
                x={170}
                y={60}
                width={60}
                height={30}
                rx={6}
                fill={C[0] + "20"}
                stroke={C[0]}
                strokeWidth={1.25}
              />
              <text
                x={200}
                y={79}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill={C[0]}
              >
                .torrent
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect
                x={165}
                y={58}
                width={70}
                height={34}
                rx={6}
                fill={C[1] + "20"}
                stroke={C[1]}
                strokeWidth={1.25}
              />
              <text
                x={200}
                y={79}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill={C[1]}
              >
                Tracker
              </text>
              {PEERS.slice(0, 3).map((_, i) => {
                const angle = (i / PEERS.length) * Math.PI * 2 - Math.PI / 2;
                const tx = 200 + Math.cos(angle) * 55;
                const ty = 75 + Math.sin(angle) * 45;
                return (
                  <motion.line
                    key={i}
                    x1={200}
                    y1={75}
                    x2={tx}
                    y2={ty}
                    stroke={C[1]}
                    strokeWidth={1}
                    strokeOpacity={0.4}
                    strokeDasharray="4 3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                );
              })}
            </motion.g>
          )}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* cross connections */}
              {[
                [0, 3],
                [1, 4],
                [2, 5],
                [0, 5],
              ].map(([a, b], i) => {
                const aa = (a / 6) * Math.PI * 2 - Math.PI / 2;
                const ba = (b / 6) * Math.PI * 2 - Math.PI / 2;
                return (
                  <motion.line
                    key={i}
                    x1={200 + Math.cos(aa) * 55}
                    y1={75 + Math.sin(aa) * 45}
                    x2={200 + Math.cos(ba) * 55}
                    y2={75 + Math.sin(ba) * 45}
                    stroke={C[step]}
                    strokeWidth={1.25}
                    strokeOpacity={0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.08 }}
                  />
                );
              })}
            </motion.g>
          )}
          {/* step indicator */}
          <motion.text
            key={`indicator-${step}`}
            x={200}
            y={148}
            textAnchor="middle"
            fontSize={10}
            fill={C[step]}
            fillOpacity={0.6}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {
              [
                "해시 확인",
                "후보 탐색",
                "병렬 다운로드",
                "SHA1 검증",
                "조각 재공유",
              ][step]
            }
          </motion.text>
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={`annotation-${step}`}
          >
            <AnnotationBox
              x={394}
              y={46}
              w={98}
              h={68}
              label={ANNOT[step]}
              color={C[step]}
            />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
