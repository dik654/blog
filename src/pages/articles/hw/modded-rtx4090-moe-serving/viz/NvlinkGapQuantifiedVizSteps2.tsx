import { motion } from "framer-motion";
import { ModuleBox, DataBox } from "@/components/viz/boxes";
import { C } from "./NvlinkGapQuantifiedVizData";

/** Step 4: H100 — 같은 NVSwitch 구조, link 수만 늘어 900GB/s로 확장 */
export function Step4() {
  const nodes = [
    { x: 8, y: 16, w: 58, h: 22 },
    { x: 142, y: 16, w: 58, h: 22 },
    { x: 8, y: 150, w: 58, h: 22 },
    { x: 142, y: 150, w: 58, h: 22 },
  ];
  const hub = { x: 65, y: 84, w: 68, h: 32 };
  const hubCx = hub.x + hub.w / 2;
  const hubCy = hub.y + hub.h / 2;

  const scale = 140 / 900;
  const a100H = 600 * scale;
  const h100H = 900 * scale;
  const baseY = 178;

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.h100}>
        H100 — 같은 구조, 900GB/s로 확장
      </text>

      <line x1={244} y1={20} x2={244} y2={190} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />

      {/* 왼쪽: 축소된 NVSwitch mesh */}
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
            stroke={C.h100}
            strokeWidth={1}
            opacity={0.55}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}
          />
        );
      })}
      {nodes.map((n, i) => (
        <motion.g
          key={`n${i}`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.08 }}
        >
          <DataBox x={n.x} y={n.y} w={n.w} h={n.h} label={`GPU ${i}`} color={C.h100} />
        </motion.g>
      ))}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        <ModuleBox x={hub.x} y={hub.y} w={hub.w} h={hub.h} label="NVSwitch" sub="4th-gen · 18 link" color={C.h100} />
      </motion.g>
      <motion.text
        x={102}
        y={192}
        textAnchor="middle"
        fontSize={7}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        8-way full mesh
      </motion.text>

      {/* 오른쪽: A100 vs H100 막대 비교 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={272} y1={baseY} x2={445} y2={baseY} stroke="var(--border)" strokeWidth={1} />
      </motion.g>

      <motion.rect
        x={288}
        width={50}
        rx={4}
        fill={C.nvswitch}
        fillOpacity={0.75}
        initial={{ height: 0, y: baseY }}
        animate={{ height: a100H, y: baseY - a100H }}
        transition={{ delay: 0.7, duration: 0.45 }}
      />
      <motion.text
        x={313}
        y={baseY - a100H - 8}
        textAnchor="middle"
        fontSize={8}
        fontWeight={700}
        fill={C.nvswitch}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        A100 · 600
      </motion.text>

      <motion.rect
        x={378}
        width={50}
        rx={4}
        fill={C.h100}
        fillOpacity={0.75}
        initial={{ height: 0, y: baseY }}
        animate={{ height: h100H, y: baseY - h100H }}
        transition={{ delay: 0.9, duration: 0.45 }}
      />
      <motion.text
        x={403}
        y={baseY - h100H - 8}
        textAnchor="middle"
        fontSize={8}
        fontWeight={700}
        fill={C.h100}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.25 }}
      >
        H100 · 900
      </motion.text>

      <motion.text
        x={358}
        y={30}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill={C.h100}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        A100 대비 ×1.5
      </motion.text>
    </g>
  );
}

/** Step 5: 요약 막대 — 4090을 기준선으로 3090·A100·H100 배수 비교 */
export function Step5() {
  const scale = 150 / 900;
  const baseY = 185;
  const barW = 60;

  const p4090 = 63 * scale;
  const p3090pcie = 63 * scale;
  const p3090nvlink = 112.5 * scale;
  const pA100 = 600 * scale;
  const pH100 = 900 * scale;

  const bars = [
    { x: 35, key: "4090" },
    { x: 145, key: "3090" },
    { x: 255, key: "A100" },
    { x: 365, key: "H100" },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        4090 대비 배수 — 63GB/s를 1x로
      </text>

      <line x1={20} y1={baseY} x2={460} y2={baseY} stroke="var(--border)" strokeWidth={1} />

      {/* 4090 */}
      <motion.rect
        x={bars[0].x}
        width={barW}
        rx={4}
        fill={C.pcie}
        fillOpacity={0.75}
        initial={{ height: 0, y: baseY }}
        animate={{ height: p4090, y: baseY - p4090 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      />
      <motion.text x={bars[0].x + barW / 2} y={baseY - p4090 - 20} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.pcie}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        1x
      </motion.text>
      <motion.text x={bars[0].x + barW / 2} y={baseY - p4090 - 9} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        63GB/s
      </motion.text>

      {/* 3090: PCIe 구간 + NVLink 구간 stacked */}
      <motion.rect
        x={bars[1].x}
        width={barW}
        rx={4}
        fill={C.pcie}
        fillOpacity={0.6}
        initial={{ height: 0, y: baseY }}
        animate={{ height: p3090pcie, y: baseY - p3090pcie }}
        transition={{ delay: 0.35, duration: 0.4 }}
      />
      <motion.rect
        x={bars[1].x}
        width={barW}
        rx={4}
        fill={C.nvlink3090}
        fillOpacity={0.8}
        initial={{ height: 0, y: baseY - p3090pcie }}
        animate={{ height: p3090nvlink, y: baseY - p3090pcie - p3090nvlink }}
        transition={{ delay: 0.65, duration: 0.4 }}
      />
      <motion.text x={bars[1].x + barW / 2} y={baseY - p3090pcie - p3090nvlink - 20} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.nvlink3090}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
        1.8x
      </motion.text>
      <motion.text x={bars[1].x + barW / 2} y={baseY - p3090pcie - p3090nvlink - 9} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
        NVLink 112.5+PCIe 63
      </motion.text>

      {/* A100 */}
      <motion.rect
        x={bars[2].x}
        width={barW}
        rx={4}
        fill={C.nvswitch}
        fillOpacity={0.75}
        initial={{ height: 0, y: baseY }}
        animate={{ height: pA100, y: baseY - pA100 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      />
      <motion.text x={bars[2].x + barW / 2} y={baseY - pA100 - 20} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.nvswitch}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
        9.5x
      </motion.text>
      <motion.text x={bars[2].x + barW / 2} y={baseY - pA100 - 9} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
        600GB/s
      </motion.text>

      {/* H100 */}
      <motion.rect
        x={bars[3].x}
        width={barW}
        rx={4}
        fill={C.h100}
        fillOpacity={0.75}
        initial={{ height: 0, y: baseY }}
        animate={{ height: pH100, y: baseY - pH100 }}
        transition={{ delay: 0.75, duration: 0.4 }}
      />
      <motion.text x={bars[3].x + barW / 2} y={baseY - pH100 - 20} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.h100}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}>
        14.3x
      </motion.text>
      <motion.text x={bars[3].x + barW / 2} y={baseY - pH100 - 9} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}>
        900GB/s
      </motion.text>

      {bars.map((b) => (
        <text key={b.key} x={b.x + barW / 2} y={baseY + 13} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">
          {b.key}
        </text>
      ))}
    </g>
  );
}

/** Step 6: topology 의존성 — PCIe는 경로에 따라 갈리고 NVSwitch는 균일 */
export function Step6() {
  return (
    <g>
      <line x1={240} y1={22} x2={240} y2={188} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />

      <text x={120} y={16} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.pcie}>
        PCIe — 경로에 따라 갈림
      </text>
      <text x={360} y={16} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.nvswitch}>
        NVSwitch — 항상 균일
      </text>

      {/* 왼쪽: 같은 root complex 직결 (진하고 두꺼운 표현) */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <DataBox x={10} y={38} w={56} h={26} label="GPU 0" color={C.pcie} />
        <DataBox x={155} y={38} w={56} h={26} label="GPU 1" color={C.pcie} />
        <line x1={66} y1={51} x2={155} y2={51} stroke={C.pcie} strokeWidth={1.2} opacity={0.9} />
        <text x={110} y={45} textAnchor="middle" fontSize={7} fill={C.pcie}>같은 root complex</text>
        <text x={110} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">≈31.5GB/s 그대로</text>
      </motion.g>

      {/* switch 경유 (얇고 옅게 — 저하 표현) */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <DataBox x={10} y={98} w={44} h={24} label="GPU 2" color={C.pcie} />
        <ModuleBox x={90} y={98} w={40} h={24} label="switch" color={C.pcie} />
        <DataBox x={172} y={98} w={44} h={24} label="GPU 3" color={C.pcie} />
        <line x1={54} y1={110} x2={90} y2={110} stroke={C.pcie} strokeWidth={0.9} opacity={0.4} />
        <line x1={130} y1={110} x2={172} y2={110} stroke={C.pcie} strokeWidth={0.9} opacity={0.4} />
        <text x={110} y={90} textAnchor="middle" fontSize={7} fill={C.pcie}>switch 몇 단 경유</text>
        <text x={110} y={135} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">achievable bandwidth 저하</text>
      </motion.g>

      {/* 오른쪽: NVSwitch 균일 mesh */}
      {[
        { x: 260, y: 42 },
        { x: 390, y: 42 },
        { x: 260, y: 150 },
        { x: 390, y: 150 },
      ].map((n, i) => (
        <motion.line
          key={`hl${i}`}
          x1={n.x + 24}
          y1={n.y + 12}
          x2={325}
          y2={100}
          stroke={C.nvswitch}
          strokeWidth={1}
          opacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
        />
      ))}
      {[
        { x: 260, y: 42, label: "GPU 0" },
        { x: 390, y: 42, label: "GPU 1" },
        { x: 260, y: 150, label: "GPU 2" },
        { x: 390, y: 150, label: "GPU 3" },
      ].map((n, i) => (
        <motion.g key={`hn${i}`} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 + i * 0.1 }}>
          <DataBox x={n.x} y={n.y} w={48} h={24} label={n.label} color={C.nvswitch} />
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.75, type: "spring" }}>
        <ModuleBox x={300} y={86} w={50} h={28} label="NVSwitch" color={C.nvswitch} />
      </motion.g>
      <motion.text x={360} y={188} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        어떤 pair를 골라도 동일 대역폭
      </motion.text>
    </g>
  );
}
