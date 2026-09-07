import { motion } from "framer-motion";
import {
  ModuleBox,
  DataBox,
  ActionBox,
  StatusBox,
  AlertBox,
} from "@/components/viz/boxes";
import { C } from "./OverviewVizData";

/* 본문 대응: Overview.tsx 1문단 — "24GB→48GB 개조 카드, 가격은 훨씬 싸다" */
export function Step0() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.capacity}>
        중국 개조 업체가 파는 카드
      </text>

      <ModuleBox x={20} y={32} w={150} h={46} label="정품 RTX 4090" sub="24GB · 1GB칩 ×24" color={C.capacity} />

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <path d="M 176 55 L 302 55" stroke={C.capacity} strokeWidth={1} strokeDasharray="4 3" fill="none" markerEnd="url(#ov-arrow-0)" />
        <text x={239} y={48} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">칩 밀도 교체</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
        <ModuleBox x={310} y={32} w={150} h={46} label="개조 RTX 4090" sub="48GB · 2GB칩 ×24" color={C.capacity} />
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <rect x={20} y={98} width={300} height={10} rx={5} fill="var(--border)" opacity={0.3} />
        <motion.rect x={20} y={98} height={10} rx={5} fill={C.capacity}
          initial={{ width: 150 }} animate={{ width: 300 }} transition={{ delay: 1, duration: 0.6 }} />
        <text x={330} y={106} fontSize={8} fontWeight={700} fill={C.capacity}>×2</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
        <ActionBox x={20} y={130} w={440} h={44} label="워크스테이션·데이터센터 카드보다 훨씬 싸다" sub="용량만 보면 매력적인 선택지" color={C.neutral} />
      </motion.g>

      <text x={240} y={196} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        채널 수·버스 폭은 그대로, 칩 하나가 담는 용량만 두 배
      </text>

      <defs>
        <marker id="ov-arrow-0" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.capacity} />
        </marker>
      </defs>
    </g>
  );
}

/* 본문 대응: "두 장 붙여 MoE 서빙 → 용량 문제는 풀린다" */
export function Step1() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.solved}>
        48GB 두 장으로 MoE weight를 올린다
      </text>

      <DataBox x={40} y={34} w={150} h={40} label="GPU 0" sub="48GB · expert 상주" color={C.capacity} outlined />
      <DataBox x={290} y={34} w={150} h={40} label="GPU 1" sub="48GB · expert 상주" color={C.capacity} outlined />

      <motion.line x1={190} y1={54} x2={290} y2={54} stroke="var(--border)" strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.4 }} />
      <text x={240} y={48} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">GPU 간 링크</text>

      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <StatusBox x={40} y={92} w={400} h={48} label="MoE weight 전체 상주" sub="개조 이전엔 못 올리던 크기도 이제 올라간다" color={C.solved} progress={1} />
      </motion.g>

      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 }}>
        <ActionBox x={40} y={152} w={400} h={34} label="여기까지는 개조가 정확히 겨냥한 문제" sub="용량(들어가느냐)은 풀렸다" color={C.solved} />
      </motion.g>

      <text x={240} y={196} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        다음 문제: 이 두 GPU가 서로 데이터를 주고받는 통로는 무엇인가
      </text>
    </g>
  );
}

/* 본문 대응: "RTX 4090은 NVLink를 애초에 갖고 있지 않다 — 카드 사이 통신 경로는 그대로" */
export function Step2() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.alert}>
        GPU 사이 링크는 개조 전후 동일하다
      </text>

      <ModuleBox x={40} y={40} w={150} h={44} label="GPU 0" sub="48GB (개조)" color={C.capacity} />
      <ModuleBox x={290} y={40} w={150} h={44} label="GPU 1" sub="48GB (개조)" color={C.capacity} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={190} y1={62} x2={290} y2={62} stroke={C.bandwidth} strokeWidth={1.1} />
        <text x={240} y={56} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={C.bandwidth}>PCIe 하나뿐</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <AlertBox x={40} y={100} w={400} h={44} label="Ada Lovelace 세대부터 NVLink 핀 자체가 없다" sub="PCB 물리적 제약 — 개조로도 되돌릴 수 없다" color={C.alert} />
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
        <ActionBox x={40} y={152} w={400} h={34} label="메모리 칩 교체가 통신 경로까지 넓혀주진 않는다" sub="용량 회로와 통신 회로는 서로 다른 회로" color={C.neutral} />
      </motion.g>

      <text x={240} y={196} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        용량은 넉넉해졌지만 그 용량을 나눠 쓸 통로는 그대로 좁다
      </text>
    </g>
  );
}

/* 본문 대응: "MoE는 dense보다 통신에 예민 — 매 layer all-to-all dispatch/combine" */
export function Step3() {
  const tokens = [0, 1, 2, 3];
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.moe}>
        MoE는 매 layer마다 GPU 경계를 넘나든다
      </text>

      <ModuleBox x={190} y={30} w={100} h={30} label="Router" sub="top-k 선택" color={C.moe} />

      <DataBox x={30} y={100} w={130} h={40} label="GPU 0 experts" color={C.capacity} outlined />
      <DataBox x={320} y={100} w={130} h={40} label="GPU 1 experts" color={C.capacity} outlined />

      {tokens.map((i) => {
        const toRight = i % 2 === 0;
        const targetX = toRight ? 380 : 95;
        return (
          <motion.circle
            key={i}
            r={4}
            fill={C.moe}
            initial={{ cx: 240, cy: 62, opacity: 0 }}
            animate={{ cx: targetX, cy: 100, opacity: [0, 1, 1, 0] }}
            transition={{ delay: 0.4 + i * 0.18, duration: 0.9, repeat: Infinity, repeatDelay: 0.6 }}
          />
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <text x={95} y={95} textAnchor="middle" fontSize={7} fill={C.moe}>dispatch</text>
        <text x={385} y={95} textAnchor="middle" fontSize={7} fill={C.moe}>dispatch</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
        <ActionBox x={40} y={152} w={400} h={34} label="dispatch + combine, 이 두 all-to-all이 layer마다 반복" sub="GPU 간 링크(PCIe)를 매번 그대로 거친다" color={C.moe} />
      </motion.g>

      <text x={240} y={196} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        토큰을 여러 expert에 흩뿌리고 다시 모으는 통신이 dense보다 훨씬 잦다
      </text>
    </g>
  );
}

/* 본문 대응: "용량은 늘었는데 그 용량을 나눠 쓸 통로가 가장 좁은 조합" */
export function Step4() {
  const barBaseY = 150;
  const barMaxH = 100;
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
        용량 축은 올라가고 대역폭 축은 그대로다
      </text>

      <line x1={70} y1={barBaseY} x2={410} y2={barBaseY} stroke="var(--border)" strokeWidth={1} />

      {/* 용량 막대: 24 -> 48 (성장) */}
      <text x={150} y={barBaseY + 16} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.capacity}>용량</text>
      <rect x={120} y={barBaseY - barMaxH * 0.5} width={26} height={barMaxH * 0.5} fill={C.capacity} opacity={0.28} rx={3} />
      <motion.rect x={154} width={26} rx={3} fill={C.capacity}
        initial={{ y: barBaseY - barMaxH * 0.5, height: barMaxH * 0.5 }}
        animate={{ y: barBaseY - barMaxH, height: barMaxH }}
        transition={{ delay: 0.4, duration: 0.6 }} />
      <text x={133} y={barBaseY - barMaxH * 0.5 - 6} textAnchor="middle" fontSize={7} fill={C.capacity}>24GB</text>
      <motion.text x={167} textAnchor="middle" fontSize={7} fontWeight={700} fill={C.capacity}
        initial={{ y: barBaseY - barMaxH * 0.5 - 6, opacity: 0 }}
        animate={{ y: barBaseY - barMaxH - 6, opacity: 1 }}
        transition={{ delay: 0.9 }}>48GB</motion.text>

      {/* 대역폭 막대: 변화 없음 (평평) */}
      <text x={330} y={barBaseY + 16} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.alert}>대역폭</text>
      <rect x={300} y={barBaseY - barMaxH * 0.3} width={26} height={barMaxH * 0.3} fill={C.alert} opacity={0.28} rx={3} />
      <motion.rect x={334} width={26} rx={3} fill={C.alert}
        initial={{ y: barBaseY, height: 0 }}
        animate={{ y: barBaseY - barMaxH * 0.3, height: barMaxH * 0.3 }}
        transition={{ delay: 1.1, duration: 0.4 }} />
      <text x={313} y={barBaseY - barMaxH * 0.3 - 6} textAnchor="middle" fontSize={7} fill={C.alert}>PCIe ≈63GB/s</text>
      <motion.text x={347} textAnchor="middle" fontSize={7} fontWeight={700} fill={C.alert}
        initial={{ y: barBaseY - barMaxH * 0.3 - 6, opacity: 0 }}
        animate={{ y: barBaseY - barMaxH * 0.3 - 6, opacity: 1 }}
        transition={{ delay: 1.4 }}>PCIe ≈63GB/s</motion.text>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
        <AlertBox x={40} y={168} w={400} h={26} label="용량을 나눠 쓸 통로가 가장 좁은 조합이 만들어진다" color={C.alert} />
      </motion.g>
    </g>
  );
}
