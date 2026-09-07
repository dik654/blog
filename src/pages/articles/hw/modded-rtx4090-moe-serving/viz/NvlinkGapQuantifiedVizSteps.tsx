import { motion } from "framer-motion";
import { DataBox, ModuleBox, AlertBox } from "@/components/viz/boxes";
import { C } from "./NvlinkGapQuantifiedVizData";

/** Step 0: PCIe raw bandwidth 공식 유도 — 항을 순서대로 강조하며 곱해 나간다 */
export function Step0() {
  const terms = [
    { x: 15, w: 64, label: "R", sub: "16 GT/s" },
    { x: 93, w: 64, label: "L", sub: "16 lane" },
    { x: 171, w: 78, label: "encoding", sub: "128/130" },
    { x: 263, w: 54, label: "8", sub: "bit→byte" },
  ];
  const ops = ["×", "×", "÷"];
  const opX = [84, 162, 254];

  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.formula}
      >
        PCIe raw bandwidth 공식 — R × L × 128/130 ÷ 8
      </text>

      {terms.map((t, i) => (
        <motion.g
          key={t.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.22 }}
        >
          <DataBox
            x={t.x}
            y={55}
            w={t.w}
            h={34}
            label={t.label}
            sub={t.sub}
            color={C.formula}
            outlined
          />
        </motion.g>
      ))}

      {ops.map((op, i) => (
        <motion.text
          key={i}
          x={opX[i]}
          y={78}
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          fill={C.formula}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.22 + 0.15 }}
        >
          {op}
        </motion.text>
      ))}

      <motion.text
        x={322}
        y={78}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill={C.formula}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.95 }}
      >
        =
      </motion.text>

      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.05, type: "spring" }}
      >
        <DataBox
          x={331}
          y={50}
          w={134}
          h={44}
          label="≈31.5 GB/s"
          sub="편도 (one-way)"
          color={C.formula}
          outlined
        />
      </motion.g>

      <motion.line
        x1={398}
        y1={94}
        x2={398}
        y2={122}
        stroke={C.formula}
        strokeWidth={1.2}
        markerEnd="url(#ngqFormulaArrow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.35, duration: 0.25 }}
      />
      <motion.text
        x={362}
        y={112}
        textAnchor="middle"
        fontSize={7.5}
        fontWeight={600}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        ×2 duplex
      </motion.text>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.65 }}
      >
        <rect
          x={155}
          y={145}
          width={170}
          height={42}
          rx={8}
          fill="var(--card)"
          stroke={C.formula}
          strokeWidth={1}
        />
        <text
          x={240}
          y={164}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill={C.formula}
        >
          ≈63 GB/s
        </text>
        <text
          x={240}
          y={178}
          textAnchor="middle"
          fontSize={7.5}
          fill="var(--muted-foreground)"
        >
          duplex 합 (양방향 동시) — 4090의 GPU 간 상한
        </text>
      </motion.g>

      <defs>
        <marker
          id="ngqFormulaArrow"
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.formula} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 1: RTX 4090 — PCIe 하나만 남은 경로, NVLink 핀 부재 */
export function Step1() {
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.pcie}
      >
        RTX 4090 — GPU 간 유일한 경로는 PCIe
      </text>

      {/* 있었다면 자리했을 NVLink 경로 — 점선 + 취소선으로 부재 강조 */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <line
          x1={130}
          y1={54}
          x2={350}
          y2={54}
          stroke={C.alert}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.4}
        />
        <circle cx={240} cy={54} r={9} fill="var(--card)" stroke={C.alert} strokeWidth={1} />
        <text
          x={240}
          y={57.5}
          textAnchor="middle"
          fontSize={9}
          fontWeight={700}
          fill={C.alert}
        >
          ✕
        </text>
        <text
          x={240}
          y={40}
          textAnchor="middle"
          fontSize={7.5}
          fill={C.alert}
        >
          golden finger 커넥터 — PCB에서 삭제됨
        </text>
      </motion.g>

      <motion.g
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
      >
        <ModuleBox x={35} y={68} w={95} h={46} label="GPU 0" sub="RTX 4090" color={C.pcie} />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
      >
        <ModuleBox x={350} y={68} w={95} h={46} label="GPU 1" sub="RTX 4090" color={C.pcie} />
      </motion.g>

      <motion.line
        x1={130}
        y1={91}
        x2={350}
        y2={91}
        stroke={C.pcie}
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      />
      <motion.text
        x={240}
        y={86}
        textAnchor="middle"
        fontSize={7.5}
        fontWeight={600}
        fill={C.pcie}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        PCIe Gen4 x16 · ≈31.5GB/s 편도 · ≈63GB/s duplex
      </motion.text>

      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <AlertBox
          x={150}
          y={135}
          w={180}
          h={52}
          label="NVLink 핀 없음"
          sub="Ada Lovelace부터 삭제 — 개조로도 복구 불가"
          color={C.alert}
        />
      </motion.g>

      <motion.text
        x={240}
        y={200 - 3}
        textAnchor="middle"
        fontSize={7.5}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        GPU 2장이면 root complex 아래 P2P, 그 이상은 PCIe switch 경유
      </motion.text>
    </g>
  );
}

/** Step 2: RTX 3090 — 같은 PCIe에 NVLink bridge가 두 번째 경로로 얹힌다 */
export function Step2() {
  return (
    <g>
      <text
        x={240}
        y={18}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.nvlink3090}
      >
        RTX 3090 — PCIe + NVLink bridge 두 경로
      </text>

      <motion.g
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
      >
        <ModuleBox x={35} y={58} w={95} h={42} label="GPU 0" sub="RTX 3090" color={C.nvlink3090} />
      </motion.g>
      <motion.g
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
      >
        <ModuleBox x={350} y={58} w={95} h={42} label="GPU 1" sub="RTX 3090" color={C.nvlink3090} />
      </motion.g>

      {/* PCIe 경로 (얇음, 기존 경로) */}
      <motion.line
        x1={130}
        y1={78}
        x2={350}
        y2={78}
        stroke={C.pcie}
        strokeWidth={1}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.35 }}
      />
      <motion.text
        x={240}
        y={73}
        textAnchor="middle"
        fontSize={7.5}
        fontWeight={600}
        fill={C.pcie}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        PCIe Gen4 x16 · ≈63GB/s duplex
      </motion.text>

      {/* NVLink bridge — 물리적 브리지 형태로 표현 */}
      <motion.g
        initial={{ opacity: 0, scaleX: 0.7 }}
        animate={{ opacity: 1, scaleX: 1 }}
        style={{ transformOrigin: "240px 108px" }}
        transition={{ delay: 0.85, duration: 0.35 }}
      >
        <rect
          x={130}
          y={100}
          width={220}
          height={16}
          rx={6}
          fill={C.nvlink3090}
          fillOpacity={0.12}
          stroke={C.nvlink3090}
          strokeWidth={1.1}
        />
        {Array.from({ length: 6 }, (_, i) => 145 + i * 34).map((cx) => (
          <circle key={cx} cx={cx} cy={108} r={2} fill={C.nvlink3090} />
        ))}
      </motion.g>
      <motion.text
        x={240}
        y={128}
        textAnchor="middle"
        fontSize={7.5}
        fontWeight={600}
        fill={C.nvlink3090}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        NVLink bridge · 112.5GB/s 집계 (≈1.8배)
      </motion.text>

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <rect
          x={110}
          y={150}
          width={260}
          height={34}
          rx={8}
          fill="var(--card)"
          stroke={C.nvlink3090}
          strokeWidth={0.9}
          strokeDasharray="4 3"
        />
        <text
          x={240}
          y={164}
          textAnchor="middle"
          fontSize={8.5}
          fontWeight={600}
          fill={C.nvlink3090}
        >
          2-way 전용
        </text>
        <text
          x={240}
          y={176}
          textAnchor="middle"
          fontSize={7.5}
          fill="var(--muted-foreground)"
        >
          bridge 폭이 정해 둔 고정 pair만 연결
        </text>
      </motion.g>
    </g>
  );
}

/** Step 3: A100 — NVSwitch가 8장 전체를 균일한 full mesh로 묶는다 */
export function Step3() {
  const top = [20, 130, 250, 365].map((x) => ({ x, y: 20, w: 78, h: 26 }));
  const bottom = [20, 130, 250, 365].map((x) => ({ x, y: 158, w: 78, h: 26 }));
  const nodes = [...top, ...bottom];
  const hub = { x: 195, y: 88, w: 90, h: 34 };
  const hubCx = hub.x + hub.w / 2;
  const hubCy = hub.y + hub.h / 2;

  return (
    <g>
      <text
        x={240}
        y={12}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={C.nvswitch}
      >
        A100 — NVSwitch로 8장 전체 full mesh
      </text>

      {nodes.map((n, i) => {
        const ncx = n.x + n.w / 2;
        const ncy = n.y + n.h / 2;
        return (
          <motion.line
            key={`l${i}`}
            x1={ncx}
            y1={ncy}
            x2={hubCx}
            y2={hubCy}
            stroke={C.nvswitch}
            strokeWidth={1}
            opacity={0.55}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
          />
        );
      })}

      {nodes.map((n, i) => (
        <motion.g
          key={`n${i}`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.05 }}
        >
          <DataBox x={n.x} y={n.y} w={n.w} h={n.h} label={`GPU ${i}`} color={C.nvswitch} />
        </motion.g>
      ))}

      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.75, type: "spring" }}
      >
        <ModuleBox x={hub.x} y={hub.y} w={hub.w} h={hub.h} label="NVSwitch" sub="3rd-gen NVLink 12 link" color={C.nvswitch} />
      </motion.g>

      <motion.text
        x={240}
        y={192}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={C.nvswitch}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        600GB/s 집계 · 어떤 GPU 쌍도 같은 대역폭 (≈9.5배)
      </motion.text>
    </g>
  );
}
