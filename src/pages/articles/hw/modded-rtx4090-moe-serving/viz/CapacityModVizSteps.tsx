import { motion } from "framer-motion";
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from "@/components/viz/boxes";
import { C, CHIP_XS } from "./CapacityModVizData";

function Chip({ x, y, color, delay = 0 }: { x: number; y: number; color: string; delay?: number }) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.25 }}>
      <rect x={x} y={y} width={24} height={22} rx={3} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={0.9} />
      <text x={x + 12} y={y + 14} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={color}>2G</text>
    </motion.g>
  );
}

function Bus({ y = 66 }: { y?: number }) {
  return <><rect x={20} y={y} width={440} height={14} rx={4} fill={C.bus} fillOpacity={0.1} stroke={C.bus} /><text x={240} y={y + 10} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.bus}>384-bit · 12채널 × 32-bit</text></>;
}

export function Step0() {
  return <g>
    <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.chip1}>정품 RTX 4090 · 앞면 2GB 칩 12개</text>
    {CHIP_XS.map((x, i) => <Chip key={x} x={x} y={28} color={C.chip1} delay={i * 0.04} />)}
    <Bus y={64} />
    <ActionBox x={55} y={100} w={370} h={38} label="채널마다 칩 하나" sub="12채널 × 1칩 × 2GB" color={C.bus} />
    <StatusBox x={140} y={150} w={200} h={40} label="총 24GB" sub="정품은 24칩 clamshell이 아니다" progress={0.5} color={C.capacity} />
  </g>;
}

export function Step1() {
  return <g>
    <text x={240} y={12} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.chip2}>대표 개조 사례 · 커스텀 clamshell PCB</text>
    {CHIP_XS.map((x, i) => <Chip key={`f${x}`} x={x} y={20} color={C.chip2} delay={i * 0.025} />)}
    <Bus y={50} />
    {CHIP_XS.map((x, i) => <Chip key={`b${x}`} x={x} y={72} color={C.chip2} delay={0.3 + i * 0.025} />)}
    <ActionBox x={45} y={108} w={390} h={38} label="채널마다 앞뒤 칩 두 개가 경로를 공유" sub="12채널 × 2칩 × 2GB" color={C.bus} />
    <StatusBox x={140} y={154} w={200} h={38} label="총 48GB" sub="칩 밀도가 아니라 칩 수가 2배" progress={1} color={C.capacity} />
  </g>;
}

export function Step2() {
  const terms = [["21Gb/s", "핀 속도"], ["384-bit", "버스 폭"], ["÷ 8", "bit→byte"]] as const;
  return <g>
    <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bus}>명목 메모리 대역폭 계산</text>
    {terms.map(([label, sub], i) => <motion.g key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}><DataBox x={45 + i * 145} y={55} w={100} h={42} label={label} sub={sub} color={C.bus} outlined /></motion.g>)}
    <text x={168} y={80} fontSize={14} fontWeight={700} fill={C.bus}>×</text><text x={313} y={80} fontSize={14} fontWeight={700} fill={C.bus}>×</text>
    <ActionBox x={115} y={120} w={250} h={44} label="21 × 384 ÷ 8 = 1,008GB/s" sub="칩 수·칩 용량은 식에 없다" color={C.capacity} />
    <text x={240} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">개조 카드가 21Gb/s를 유지하는지는 별도 실측</text>
  </g>;
}

export function Step3() {
  return <g>
    <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}>바뀌는 값과 그대로인 값을 분리한다</text>
    <ModuleBox x={35} y={45} w={170} h={54} label="정품" sub="12칩 · 24GB" color={C.chip1} />
    <ModuleBox x={275} y={45} w={170} h={54} label="개조 사례" sub="24칩 · 48GB" color={C.chip2} />
    <StatusBox x={35} y={120} w={170} h={44} label="용량 ×2" sub="24 → 48GB" progress={1} color={C.capacity} />
    <StatusBox x={275} y={120} w={170} h={44} label="명목 대역폭 ×1" sub="384-bit · 조건부 1,008GB/s" progress={0.5} color={C.bus} />
    <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">저장 공간과 초당 전송량은 서로 다른 축</text>
  </g>;
}

export function Step4() {
  return <g>
    <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}>48GB가 통신을 줄이는 유일한 경우</text>
    <DataBox x={30} y={50} w={130} h={44} label="24GB × 2" sub="모델 분할 필요" color={C.alert} />
    <motion.path d="M165 72 H300" stroke={C.capacity} strokeWidth={1.25} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
    <ModuleBox x={310} y={50} w={140} h={44} label="48GB × 1" sub="한 장에 상주" color={C.capacity} />
    <ActionBox x={55} y={118} w={370} h={48} label="GPU 경계가 사라지면 통신도 사라진다" sub="여전히 여러 장이면 P2P·host path 병목은 남는다" color={C.bus} />
  </g>;
}

export function Step5() {
  return <g>
    <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.alert}>인식 성공 뒤에 안정성 검증이 남는다</text>
    <AlertBox x={25} y={45} w={135} h={50} label="커스텀 PCB" sub="부품 이식·배선" color={C.alert} />
    <AlertBox x={173} y={45} w={135} h={50} label="비공식 펌웨어" sub="판매자별 구현" color={C.alert} />
    <AlertBox x={321} y={45} w={135} h={50} label="지원 없음" sub="워런티·복구 경로" color={C.alert} />
    <ActionBox x={45} y={120} w={390} h={48} label="장시간 memory test + serving trace" sub="Xid · 오류 · 클럭 · 온도 · 전력 · driver update" color={C.bus} />
    <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">48GB 표시는 출시 gate의 시작이지 끝이 아니다</text>
  </g>;
}
