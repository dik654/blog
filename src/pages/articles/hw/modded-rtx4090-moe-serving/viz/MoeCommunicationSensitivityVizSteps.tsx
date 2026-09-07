import { motion } from "framer-motion";
import {
  ModuleBox,
  DataBox,
  ActionBox,
  StatusBox,
  AlertBox,
} from "@/components/viz/boxes";
import { C } from "./MoeCommunicationSensitivityVizData";

/* ── Step 0: 라우팅 — 연산은 sparse, 메모리는 dense ─────────── */
export function Step0() {
  const routerX = 150;
  const routerY = 78;
  const routerCx = routerX + 40;
  const routerCy = routerY + 22;

  const ew = 82;
  const eh = 46;
  // GPU 0: E0(active) / E1(idle) · GPU 1: E2(active) / E3(idle)
  const experts = [
    { id: "E0", x: 258, y: 36, active: true },
    { id: "E1", x: 258, y: 94, active: false },
    { id: "E2", x: 372, y: 36, active: true },
    { id: "E3", x: 372, y: 94, active: false },
  ];

  const tokens = [
    { spawnY: 46, targetIdx: 0, delay: 0 },
    { spawnY: 96, targetIdx: 2, delay: 0.55 },
    { spawnY: 146, targetIdx: 0, delay: 1.1 },
  ];

  return (
    <g>
      <text x={20} y={20} fontSize={8} fontWeight={700} fill={C.token}>
        토큰
      </text>

      {/* GPU 경계 (먼저 그려서 expert 박스가 위에 얹힘) */}
      <rect
        x={248}
        y={16}
        width={104}
        height={140}
        rx={8}
        fill="none"
        stroke={C.gpuBorder}
        strokeWidth={0.8}
        strokeDasharray="4 3"
      />
      <text
        x={300}
        y={28}
        textAnchor="middle"
        fontSize={7.5}
        fontWeight={700}
        fill={C.gpuBorder}
      >
        GPU 0
      </text>
      <rect
        x={362}
        y={16}
        width={104}
        height={140}
        rx={8}
        fill="none"
        stroke={C.gpuBorder}
        strokeWidth={0.8}
        strokeDasharray="4 3"
      />
      <text
        x={414}
        y={28}
        textAnchor="middle"
        fontSize={7.5}
        fontWeight={700}
        fill={C.gpuBorder}
      >
        GPU 1
      </text>

      <ModuleBox
        x={routerX}
        y={routerY}
        w={80}
        h={44}
        label="Router"
        sub="top-k 선택"
        color={C.router}
      />

      {experts.map((e) => (
        <g key={e.id} opacity={e.active ? 1 : 0.5}>
          <DataBox
            x={e.x}
            y={e.y}
            w={ew}
            h={eh}
            label={e.id}
            sub={e.active ? "연산 활성" : "메모리만 상주"}
            color={e.active ? C.expertActive : C.expertIdle}
            outlined={e.active}
          />
        </g>
      ))}

      {/* 토큰 흐름: spawn → router → 선택된 expert (반복 루프) */}
      {tokens.map((t, i) => {
        const target = experts[t.targetIdx];
        const tx = target.x + ew / 2;
        const ty = target.y + eh / 2;
        return (
          <motion.circle
            key={i}
            r={4}
            fill={C.token}
            initial={{ cx: 20, cy: t.spawnY, opacity: 0 }}
            animate={{
              cx: [20, routerCx, tx],
              cy: [t.spawnY, routerCy, ty],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.6,
              times: [0, 0.45, 0.9, 1],
              repeat: Infinity,
              repeatDelay: 0.4,
              delay: t.delay,
              ease: "easeInOut",
            }}
          />
        );
      })}

      <StatusBox
        x={20}
        y={164}
        w={202}
        h={30}
        label="연산: 선택된 expert만 (sparse)"
        color={C.expertActive}
        progress={0.5}
      />
      <StatusBox
        x={250}
        y={164}
        w={216}
        h={30}
        label="메모리: 전체 expert 상시 상주 (dense)"
        color={C.expertIdle}
        progress={1}
      />
    </g>
  );
}

/* ── Step 1: TP all-reduce — 대칭·고정 ──────────────────── */
export function Step1() {
  const w = 90;
  const h = 40;
  const gpus = [
    { id: "GPU 0", x: 75, y: 30 },
    { id: "GPU 1", x: 315, y: 30 },
    { id: "GPU 2", x: 315, y: 128 },
    { id: "GPU 3", x: 75, y: 128 },
  ];
  const centers = gpus.map((g) => ({ x: g.x + w / 2, y: g.y + h / 2 }));
  const edges = [
    { a: centers[0], b: centers[1] },
    { a: centers[1], b: centers[2] },
    { a: centers[2], b: centers[3] },
    { a: centers[3], b: centers[0] },
  ];

  return (
    <g>
      <text
        x={240}
        y={16}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={C.tp}
      >
        TP all-reduce — 모든 엣지 동일 크기
      </text>

      {edges.map((e, i) => (
        <g key={i}>
          <line
            x1={e.a.x}
            y1={e.a.y}
            x2={e.b.x}
            y2={e.b.y}
            stroke={C.tp}
            strokeWidth={1}
            opacity={0.3}
          />
          <motion.circle
            r={3}
            fill={C.tp}
            initial={{ cx: e.a.x, cy: e.a.y, opacity: 0 }}
            animate={{
              cx: [e.a.x, e.b.x],
              cy: [e.a.y, e.b.y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.15,
            }}
          />
          <motion.circle
            r={3}
            fill={C.tp}
            initial={{ cx: e.b.x, cy: e.b.y, opacity: 0 }}
            animate={{
              cx: [e.b.x, e.a.x],
              cy: [e.b.y, e.a.y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.15 + 0.2,
            }}
          />
        </g>
      ))}

      {gpus.map((g) => (
        <ModuleBox
          key={g.id}
          x={g.x}
          y={g.y}
          w={w}
          h={h}
          label={g.id}
          sub="partial sum"
          color={C.tp}
        />
      ))}

      <ActionBox
        x={190}
        y={80}
        w={100}
        h={40}
        label="all-reduce"
        sub="layer당 고정 2회"
        color={C.tp}
      />

      <text
        x={240}
        y={192}
        textAnchor="middle"
        fontSize={7.5}
        fill="var(--muted-foreground)"
      >
        Attention 뒤 1회 + MLP 뒤 1회 — 라우팅과 무관하게 항상 고정
      </text>
    </g>
  );
}

/* ── Step 2: EP dispatch — 비대칭 all-to-all ────────────── */
export function Step2() {
  const A = { x: 15, y: 24, w: 95, h: 54, cx: 15 + 95, cy: 24 + 27 };
  const B = { x: 15, y: 118, w: 95, h: 54, cx: 15 + 95, cy: 118 + 27 };
  const G0 = { x: 372, y: 12, w: 94, h: 62, cx: 372, cy: 12 + 31 }; // 인기 expert(쏠림)
  const G1 = { x: 372, y: 126, w: 94, h: 62, cx: 372, cy: 126 + 31 }; // 비인기 expert

  const edges = [
    { from: A, to: G0, hot: true },
    { from: A, to: G1, hot: false },
    { from: B, to: G0, hot: true },
    { from: B, to: G1, hot: false },
  ];

  return (
    <g>
      <text
        x={240}
        y={16}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={C.ep}
      >
        Dispatch — 라우팅 결과대로 비대칭 흩뿌림
      </text>

      {edges.map((e, i) => {
        const dots = e.hot ? [0, 0.3, 0.6] : [0];
        return (
          <g key={i}>
            <line
              x1={e.from.cx}
              y1={e.from.cy}
              x2={e.to.cx}
              y2={e.to.cy}
              stroke={e.hot ? C.epHot : C.ep}
              strokeWidth={e.hot ? 1.2 : 0.5}
              opacity={e.hot ? 0.5 : 0.28}
            />
            {dots.map((d, di) => (
              <motion.circle
                key={di}
                r={e.hot ? 3.4 : 2.2}
                fill={e.hot ? C.epHot : C.ep}
                initial={{ cx: e.from.cx, cy: e.from.cy, opacity: 0 }}
                animate={{
                  cx: [e.from.cx, e.to.cx],
                  cy: [e.from.cy, e.to.cy],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  delay: d,
                  ease: "easeInOut",
                }}
              />
            ))}
          </g>
        );
      })}

      <ModuleBox x={A.x} y={A.y} w={A.w} h={A.h} label="GPU A" sub="토큰 보유" color={C.ep} />
      <ModuleBox x={B.x} y={B.y} w={B.w} h={B.h} label="GPU B" sub="토큰 보유" color={C.ep} />
      <ModuleBox
        x={G0.x}
        y={G0.y}
        w={G0.w}
        h={G0.h}
        label="GPU 0"
        sub="expert 인기 · 쏠림"
        color={C.epHot}
      />
      <ModuleBox
        x={G1.x}
        y={G1.y}
        w={G1.w}
        h={G1.h}
        label="GPU 1"
        sub="expert 비인기"
        color={C.ep}
      />

      <DataBox x={215} y={38} w={92} h={28} label="≈60 tokens" sub="GPU 0행" color={C.epHot} />
      <DataBox x={215} y={132} w={92} h={28} label="≈15 tokens" sub="GPU 1행" color={C.ep} />
    </g>
  );
}

/* ── Step 3: EP combine — 같은 불균형이 되돌아옴 ────────── */
export function Step3() {
  const A = { x: 15, y: 24, w: 95, h: 54, cx: 15 + 95, cy: 24 + 27 };
  const B = { x: 15, y: 118, w: 95, h: 54, cx: 15 + 95, cy: 118 + 27 };
  const G0 = { x: 372, y: 12, w: 94, h: 62, cx: 372, cy: 12 + 31 };
  const G1 = { x: 372, y: 126, w: 94, h: 62, cx: 372, cy: 126 + 31 };

  const edges = [
    { from: G0, to: A, hot: true },
    { from: G0, to: B, hot: true },
    { from: G1, to: A, hot: false },
    { from: G1, to: B, hot: false },
  ];

  return (
    <g>
      <text
        x={240}
        y={16}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={C.ep}
      >
        Combine — 결과가 같은 불균형으로 되돌아옴
      </text>

      {edges.map((e, i) => {
        const dots = e.hot ? [0, 0.3, 0.6] : [0];
        return (
          <g key={i}>
            <line
              x1={e.from.cx}
              y1={e.from.cy}
              x2={e.to.cx}
              y2={e.to.cy}
              stroke={e.hot ? C.epHot : C.ep}
              strokeWidth={e.hot ? 1.2 : 0.5}
              opacity={e.hot ? 0.5 : 0.28}
              strokeDasharray="3 2"
            />
            {dots.map((d, di) => (
              <motion.circle
                key={di}
                r={e.hot ? 3.4 : 2.2}
                fill={e.hot ? C.epHot : C.ep}
                initial={{ cx: e.from.cx, cy: e.from.cy, opacity: 0 }}
                animate={{
                  cx: [e.from.cx, e.to.cx],
                  cy: [e.from.cy, e.to.cy],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  delay: d,
                  ease: "easeInOut",
                }}
              />
            ))}
          </g>
        );
      })}

      <ModuleBox
        x={G0.x}
        y={G0.y}
        w={G0.w}
        h={G0.h}
        label="GPU 0"
        sub="결과 다량 발신"
        color={C.epHot}
      />
      <ModuleBox
        x={G1.x}
        y={G1.y}
        w={G1.w}
        h={G1.h}
        label="GPU 1"
        sub="결과 소량 발신"
        color={C.ep}
      />
      <ModuleBox x={A.x} y={A.y} w={A.w} h={A.h} label="GPU A" sub="토큰 원위치" color={C.ep} />
      <ModuleBox x={B.x} y={B.y} w={B.w} h={B.h} label="GPU B" sub="토큰 원위치" color={C.ep} />

      <ActionBox
        x={155}
        y={82}
        w={130}
        h={36}
        label="combine"
        sub="dispatch와 페어 · 방향만 반대"
        color={C.ep}
      />
    </g>
  );
}

/* ── Step 4: TP vs EP — 고정 비율 vs 가변 비율 ──────────── */
export function Step4() {
  const tpPts = [
    { x: 50, y: 110 },
    { x: 120, y: 110 },
    { x: 190, y: 110 },
  ];
  const epPts = [
    { x: 290, y: 132 },
    { x: 340, y: 72 },
    { x: 390, y: 118 },
    { x: 440, y: 56 },
  ];
  const tpPath = tpPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const epPath = epPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <g>
      <text x={120} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.tp}>
        TP — layer당 통신량 고정
      </text>
      <text x={365} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ep}>
        EP — 라우팅 쏠림 따라 가변
      </text>

      <line x1={30} y1={40} x2={30} y2={150} stroke="var(--border)" strokeWidth={0.8} />
      <line x1={30} y1={150} x2={210} y2={150} stroke="var(--border)" strokeWidth={0.8} />
      <line x1={270} y1={40} x2={270} y2={150} stroke="var(--border)" strokeWidth={0.8} />
      <line x1={270} y1={150} x2={450} y2={150} stroke="var(--border)" strokeWidth={0.8} />

      <motion.path
        d={tpPath}
        stroke={C.tp}
        strokeWidth={1.2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={epPath}
        stroke={C.ep}
        strokeWidth={1.2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {tpPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={C.tp} />
      ))}
      {epPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={C.ep} />
      ))}

      <text x={120} y={162} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        GPU 수 →
      </text>
      <text x={365} y={162} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        스텝(라우팅 분포) →
      </text>

      <DataBox x={30} y={172} w={72} h={26} label="TP" sub="고정" color={C.tp} />
      <DataBox x={378} y={172} w={72} h={26} label="EP" sub="가변" color={C.ep} />
    </g>
  );
}

/* ── Step 5: PCIe 전용 구성에서 드러나는 병목 ───────────── */
export function Step5() {
  return (
    <g>
      <line
        x1={242}
        y1={8}
        x2={242}
        y2={192}
        stroke="var(--border)"
        strokeWidth={0.8}
        strokeDasharray="3 3"
      />

      {/* ── 왼쪽: NVSwitch — 균일 fabric ── */}
      <line x1={120} y1={101} x2={45} y2={33} stroke={C.nvswitch} strokeWidth={0.8} opacity={0.4} />
      <line x1={120} y1={101} x2={195} y2={33} stroke={C.nvswitch} strokeWidth={0.8} opacity={0.4} />
      <line x1={120} y1={101} x2={45} y2={170} stroke={C.nvswitch} strokeWidth={0.8} opacity={0.4} />
      <line x1={120} y1={101} x2={195} y2={170} stroke={C.nvswitch} strokeWidth={0.8} opacity={0.4} />

      {[
        { x: 45, y: 33 },
        { x: 195, y: 33 },
        { x: 45, y: 170 },
        { x: 195, y: 170 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          r={2.6}
          fill={C.nvswitch}
          initial={{ cx: 120, cy: 101, opacity: 0 }}
          animate={{ cx: [120, p.x], cy: [101, p.y], opacity: [0, 1, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}

      <ModuleBox x={15} y={18} w={60} h={30} label="GPU0" color={C.nvswitch} />
      <ModuleBox x={165} y={18} w={60} h={30} label="GPU1" color={C.nvswitch} />
      <ModuleBox x={15} y={155} w={60} h={30} label="GPU2" color={C.nvswitch} />
      <ModuleBox x={165} y={155} w={60} h={30} label="GPU3" color={C.nvswitch} />
      <ModuleBox x={95} y={88} w={50} h={26} label="NVSwitch" sub="균일" color={C.nvswitch} />

      <text x={120} y={196} textAnchor="middle" fontSize={7} fill={C.nvswitch}>
        균등 — 어떤 pair도 같은 대역폭
      </text>

      {/* ── 오른쪽: PCIe 2-way — 특정 링크 포화 ── */}
      <motion.line
        x1={370}
        y1={92}
        x2={400}
        y2={92}
        stroke={C.pcie}
        strokeWidth={1.2}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {[0, 0.25, 0.5, 0.75].map((d, i) => (
        <motion.circle
          key={i}
          r={2.6}
          fill={C.pcie}
          initial={{ cx: 370, cy: 92, opacity: 0 }}
          animate={{ cx: [370, 400], cy: [92, 92], opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: d, ease: "linear" }}
        />
      ))}

      <ModuleBox x={290} y={70} w={80} h={44} label="GPU4" sub="expert 쏠림" color={C.pcie} />
      <ModuleBox x={400} y={70} w={70} h={44} label="GPU5" color={C.pcie} />

      <AlertBox
        x={300}
        y={12}
        w={150}
        h={42}
        label="PCIe 링크 포화"
        sub="라우팅이 조금만 쏠려도 여기가 병목"
        color={C.pcie}
      />

      <text x={365} y={196} textAnchor="middle" fontSize={7} fill={C.pcie}>
        PCIe 2-way — 쏠리면 이 링크만 포화
      </text>
    </g>
  );
}
