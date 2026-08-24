import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";
import { ModuleBox } from "@/components/viz/boxes";

const sp = { type: "spring" as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: "L2 Tx", sub: "트랜잭션 배치", color: "#a855f7", x: 5 },
  { label: "bus-map", sub: "EVM 재실행", color: "#3b82f6", x: 80 },
  { label: "Gadget", sub: "오퍼코드 제약", color: "#10b981", x: 155 },
  { label: "Table", sub: "Rw/Keccak", color: "#f59e0b", x: 230 },
  { label: "Halo2", sub: "KZG+SHPLONK", color: "#ec4899", x: 305 },
  { label: "집계", sub: "온체인 검증", color: "#6366f1", x: 380 },
];

const STEPS = [
  {
    label: "트랜잭션 입력",
    body: "L2 트랜잭션 배치가 증명 파이프라인에 들어옵니다.",
  },
  {
    label: "bus-mapping",
    body: "EVM을 재실행하여 오퍼코드별 ExecStep(스택/메모리)을 기록합니다.",
  },
  {
    label: "ExecutionGadget",
    body: "각 오퍼코드의 가젯이 제약을 등록하고 셀에 값을 할당합니다.",
  },
  {
    label: "공유 테이블 룩업",
    body: "RwTable, KeccakTable 등으로 서브회로 간 일관성을 검증합니다.",
  },
  {
    label: "Halo2 증명",
    body: "모든 게이트/룩업 제약을 KZG 커밋 + SHPLONK로 증명합니다.",
  },
  {
    label: "집계 증명",
    body: "서브회로 증명들을 집계하여 온체인 검증용으로 압축합니다.",
  },
];

export default function EVMProvingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 450 80"
          className="w-[450px] !min-w-[450px] !max-w-none shrink-0 sm:w-full sm:!min-w-0 sm:!max-w-2xl"
          style={{ height: "auto" }}
        >
          {NODES.map((n, i) => {
            const active = i <= step;
            const hl = i === step;
            return (
              <g key={n.label}>
                {i > 0 && (
                  <motion.line
                    x1={NODES[i - 1].x + 64}
                    y1={38}
                    x2={n.x}
                    y2={38}
                    stroke={NODES[i - 1].color}
                    strokeWidth={0.7}
                    animate={{ opacity: active ? 0.5 : 0.1 }}
                    transition={sp}
                  />
                )}
                <motion.g
                  animate={{ opacity: active ? 1 : 0.2 }}
                  transition={sp}
                >
                  <ModuleBox
                    x={n.x}
                    y={17}
                    w={64}
                    h={42}
                    label={n.label}
                    sub={n.sub}
                    color={n.color}
                  />
                  {hl && (
                    <rect
                      x={n.x - 2}
                      y={15}
                      width={68}
                      height={46}
                      rx={12}
                      fill="none"
                      stroke={n.color}
                      strokeWidth={1.2}
                    />
                  )}
                </motion.g>
              </g>
            );
          })}
          {/* Gadget -> Table cross link */}
          {step >= 3 && (
            <motion.path
              d="M 187,59 Q 225,72 262,59"
              fill="none"
              stroke="#10b98160"
              strokeWidth={0.6}
              strokeDasharray="2 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={sp}
            />
          )}
        </svg>
      )}
    </StepViz>
  );
}
