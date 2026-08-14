import { useState } from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    label: "STUN 발견",
    desc: "A, B 모두 STUN으로 자신의 NAT 외부 주소를 발견",
  },
  { label: "주소 교환", desc: "시그널링 채널로 서로의 외부 주소를 교환" },
  {
    label: "A → B 전송",
    desc: "A가 B의 관측 주소로 전송. A mapping은 생기지만 B filtering에 막힐 수 있음",
  },
  {
    label: "B → A 전송",
    desc: "B도 A의 관측 주소로 전송. 양쪽 mapping/filtering이 허용하면 왕복 성공",
  },
  {
    label: "Direct check 성공",
    desc: "실제 bidirectional check가 성공한 경우에만 direct path로 이동",
  },
];

const C = { a: "#6366f1", b: "#ec4899", nat: "#6b7280", ok: "#10b981" };

export default function HolePunchDetailViz() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">
        UDP Hole Punching 단계별
      </p>
      <svg
        viewBox="0 0 380 90"
        className="w-full max-w-2xl"
        style={{ height: "auto" }}
      >
        {/* Nodes */}
        {[
          { id: "A", x: 10, y: 30, c: C.a },
          { id: "NAT_A", x: 85, y: 30, c: C.nat },
          { id: "NAT_B", x: 235, y: 30, c: C.nat },
          { id: "B", x: 310, y: 30, c: C.b },
        ].map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={55}
              height={24}
              rx={5}
              fill={n.c + "12"}
              stroke={n.c}
              strokeWidth={1.25}
            />
            <text
              x={n.x + 27.5}
              y={n.y + 15}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill={n.c}
            >
              {n.id.startsWith("NAT") ? "NAT" : `Peer ${n.id}`}
            </text>
          </g>
        ))}

        {/* A→B attempt (dropped) */}
        {step >= 2 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 2 ? 1 : 0.3 }}
          >
            <line
              x1={140}
              y1={38}
              x2={235}
              y2={38}
              stroke={C.a}
              strokeWidth={1.25}
            />
            {step === 2 && (
              <>
                <rect
                  x={165}
                  y={24}
                  width={42}
                  height={12}
                  rx={2}
                  fill="var(--card)"
                />
                <text
                  x={186}
                  y={33}
                  textAnchor="middle"
                  fontSize={10}
                  fill={C.nat}
                >
                  DROP?
                </text>
              </>
            )}
          </motion.g>
        )}

        {/* B→A attempt (passes) */}
        {step >= 3 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <line
              x1={235}
              y1={48}
              x2={140}
              y2={48}
              stroke={step >= 4 ? C.ok : C.b}
              strokeWidth={1.25}
            />
            {step === 3 && (
              <>
                <rect
                  x={165}
                  y={50}
                  width={42}
                  height={12}
                  rx={2}
                  fill="var(--card)"
                />
                <text
                  x={186}
                  y={59}
                  textAnchor="middle"
                  fontSize={10}
                  fill={C.ok}
                >
                  PASS?
                </text>
              </>
            )}
          </motion.g>
        )}

        {/* Direct connection */}
        {step >= 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect
              x={148}
              y={68}
              width={84}
              height={14}
              rx={3}
              fill="var(--card)"
              stroke={C.ok}
              strokeWidth={1}
            />
            <text
              x={190}
              y={78}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill={C.ok}
            >
              Direct if checks pass
            </text>
          </motion.g>
        )}
      </svg>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            onClick={() => setStep(i)}
            className={`h-1 flex-1 rounded-full cursor-pointer transition-colors ${i <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>
      <p className="text-xs font-semibold text-center">{s.label}</p>
      <p className="text-[11px] text-foreground/60 text-center">{s.desc}</p>
    </div>
  );
}
