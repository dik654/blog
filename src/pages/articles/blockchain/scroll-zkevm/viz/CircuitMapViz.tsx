import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const P = "#6366f1",
  S = "#10b981",
  A = "#f59e0b";

const NODES = [
  { id: "super", label: "SuperCircuit", color: P, x: 180, y: 10 },
  { id: "evm", label: "EVM", color: P, x: 60, y: 65 },
  { id: "bytecode", label: "Bytecode", color: P, x: 160, y: 65 },
  { id: "copy", label: "Copy", color: P, x: 260, y: 65 },
  { id: "keccak", label: "Keccak", color: S, x: 40, y: 125 },
  { id: "mpt", label: "MPT", color: S, x: 130, y: 125 },
  { id: "sig", label: "Sig", color: A, x: 220, y: 125 },
  { id: "poseidon", label: "Poseidon", color: S, x: 310, y: 125 },
  { id: "sha", label: "SHA256", color: A, x: 80, y: 180 },
  { id: "ecc", label: "ECC", color: A, x: 180, y: 180 },
  { id: "modexp", label: "MODEXP", color: A, x: 280, y: 180 },
];

const EDGES = [
  { s: 0, t: 1 },
  { s: 0, t: 2 },
  { s: 0, t: 3 },
  { s: 1, t: 4 },
  { s: 1, t: 5 },
  { s: 1, t: 6 },
  { s: 5, t: 7 },
  { s: 1, t: 8 },
  { s: 1, t: 9 },
  { s: 1, t: 10 },
];

const ACTIVE: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [0, 1, 2, 3],
  [0, 4, 5, 7],
  [0, 6, 8, 9, 10],
];

const STEPS = [
  {
    label: "SuperCircuit 전체 구조",
    body: "SuperCircuit이 11개 서브회로를 통합하여 하나의 증명을 생성합니다.",
  },
  {
    label: "EVM 실행 계층",
    body: "EVM, Bytecode, Copy 회로가 오퍼코드 실행과 데이터 이동을 검증합니다.",
  },
  {
    label: "상태 & 해시 계층",
    body: "Keccak, MPT, Poseidon 회로가 상태 트리와 해시를 검증합니다.",
  },
  {
    label: "암호 & 프리컴파일",
    body: "Sig, SHA256, ECC, MODEXP 회로가 암호 연산을 검증합니다.",
  },
];

export default function CircuitMapViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 510 210"
          className="w-full max-w-2xl"
          style={{ height: "auto" }}
        >
          {EDGES.map((e, i) => {
            const s = NODES[e.s],
              t = NODES[e.t];
            const on = ACTIVE[step].includes(e.s) && ACTIVE[step].includes(e.t);
            return (
              <motion.line
                key={i}
                x1={s.x}
                y1={s.y + 12}
                x2={t.x}
                y2={t.y}
                stroke="var(--muted-foreground)"
                strokeWidth={1}
                animate={{ opacity: on ? 0.4 : 0.08 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
          {NODES.map((n, i) => {
            const on = ACTIVE[step].includes(i);
            return (
              <motion.g
                key={n.id}
                animate={{ opacity: on ? 1 : 0.15 }}
                transition={{ duration: 0.3 }}
              >
                <rect
                  x={n.x - 28}
                  y={n.y - 10}
                  width={56}
                  height={22}
                  rx={5}
                  fill={on ? n.color + "12" : "#fff0"}
                  stroke={n.color}
                  strokeWidth={on ? 1.5 : 1}
                />
                <text
                  x={n.x}
                  y={n.y + 4}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={500}
                  fill={n.color}
                >
                  {n.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
