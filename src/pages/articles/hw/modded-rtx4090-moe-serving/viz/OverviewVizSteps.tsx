import { motion } from "framer-motion";
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from "@/components/viz/boxes";
import { C } from "./OverviewVizData";

export function Step0() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}>용량을 늘린 방법부터 바로 센다</text>
  <ModuleBox x={30} y={48} w={150} h={48} label="정품 PCB" sub="2GB 칩 × 12 = 24GB" color={C.bandwidth} />
  <motion.path d="M185 72 H295" stroke={C.capacity} strokeWidth={1.25} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
  <ModuleBox x={300} y={48} w={150} h={48} label="커스텀 PCB" sub="2GB 칩 × 24 = 48GB" color={C.capacity} />
  <ActionBox x={55} y={120} w={370} h={44} label="칩 밀도 ×2가 아니라 칩 수 ×2" sub="384-bit 버스는 그대로" color={C.solved} />
  <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">대표 공개 사례 기준 · 판매자마다 구현은 다를 수 있음</text>
  </g>; }

export function Step1() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}>물리적 합계와 한 GPU의 주소 공간을 구분한다</text>
  <DataBox x={35} y={50} w={160} h={52} label="GPU 0" sub="48GB · expert A" color={C.capacity} />
  <DataBox x={285} y={50} w={160} h={52} label="GPU 1" sub="48GB · expert B" color={C.capacity} />
  <StatusBox x={85} y={125} w={310} h={46} label="물리 합계 96GB" sub="하지만 GPU 경계를 넘으면 통신 비용 발생" progress={1} color={C.solved} />
  </g>; }

export function Step2() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.alert}>RTX 4090의 실제 GPU 간 경로</text>
  <ModuleBox x={25} y={48} w={110} h={42} label="GPU 0" sub="48GB" color={C.bandwidth} />
  <ModuleBox x={185} y={48} w={110} h={42} label="Host memory" sub="staging 가능" color={C.alert} />
  <ModuleBox x={345} y={48} w={110} h={42} label="GPU 1" sub="48GB" color={C.bandwidth} />
  <motion.path d="M135 69 H185 M295 69 H345" stroke={C.alert} strokeWidth={1.25} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
  <AlertBox x={55} y={115} w={370} h={48} label="NVLink 없음 · CUDA P2P 미지원" sub="31.5GB/s 편도 raw ≠ application goodput" color={C.alert} />
  <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">topo -p2p와 nvbandwidth로 실제 경로를 확인</text>
  </g>; }

export function Step3() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.moe}>EP에서 한 MoE layer가 지나가는 길</text>
  <ModuleBox x={185} y={38} w={110} h={38} label="Router" sub="top-k" color={C.moe} />
  <DataBox x={30} y={112} w={140} h={42} label="GPU 0 experts" sub="local + remote token" color={C.capacity} />
  <DataBox x={310} y={112} w={140} h={42} label="GPU 1 experts" sub="load imbalance 가능" color={C.capacity} />
  {[0,1,2,3].map((i) => <motion.circle key={i} r={4} fill={C.moe} initial={{ cx: 240, cy: 78, opacity: 0 }} animate={{ cx: i % 2 ? 380 : 100, cy: 112, opacity: [0,1,1,0] }} transition={{ delay: i * 0.18, duration: 1, repeat: Infinity, repeatDelay: 0.6 }} />)}
  <ActionBox x={120} y={165} w={240} h={28} label="dispatch → compute → combine" color={C.moe} />
  </g>; }

export function Step4() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}>세 질문이 채택 결론을 만든다</text>
  <ActionBox x={25} y={48} w={130} h={52} label="1. 용량" sub="한 장에 합쳐지는가?" color={C.capacity} />
  <ActionBox x={175} y={48} w={130} h={52} label="2. 경로" sub="P2P인가, host인가?" color={C.bandwidth} />
  <ActionBox x={325} y={48} w={130} h={52} label="3. SLO" sub="p95·p99 통과?" color={C.solved} />
  <AlertBox x={55} y={125} w={370} h={48} label="명목 스펙만으로 출시하지 않는다" sub="request profile · 오류 · 전력 · 복구 시간까지 검증" color={C.alert} />
  </g>; }
