import { motion } from "framer-motion";
import { ActionBox, AlertBox, DataBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./EngineeringRecoveryVizData";

export function Step0() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}>물리 링크는 상수 · 최적화 대상은 세 가지</text>
  <ModuleBox x={155} y={45} w={170} h={44} label="PCIe path" sub="소프트웨어로 폭을 못 늘림" color={C.pcie} />
  <ActionBox x={20} y={120} w={135} h={48} label="원격 토큰" sub="expert 배치" color={C.expertA} />
  <ActionBox x={173} y={120} w={135} h={48} label="payload bytes" sub="통신 정밀도" color={C.quantC} />
  <ActionBox x={326} y={120} w={135} h={48} label="대기 시간" sub="조합·overlap" color={C.time} />
  </g>; }

export function Step1() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.expertA}>A) 원격 expert로 가는 토큰을 줄인다</text>
  <ModuleBox x={30} y={50} w={140} h={48} label="GPU 0" sub="E0 · E1 · shared" color={C.expertA} />
  <ModuleBox x={310} y={50} w={140} h={48} label="GPU 1" sub="E2 · E3 · shared" color={C.expertA} />
  <motion.path d="M170 74 H310" stroke={C.warn} strokeWidth={1.2} strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
  <ActionBox x={80} y={125} w={320} h={46} label="측정: remote-token ratio" sub="배치 전후 dispatch bytes와 p99 비교" color={C.ok} />
  </g>; }

export function Step2() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ppB}>B) TP·PP·EP 조합을 같은 workload로 비교</text>
  <DataBox x={20} y={52} w={135} h={48} label="TP" sub="layer 내부 collective" color={C.ppB} />
  <DataBox x={173} y={52} w={135} h={48} label="PP" sub="stage 전달 + bubble" color={C.time} />
  <DataBox x={326} y={52} w={135} h={48} label="EP" sub="dispatch + combine" color={C.expertA} />
  <AlertBox x={65} y={125} w={350} h={48} label="자동 기본값 없음" sub="TTFT · TPOT · tokens/s · p99로 선택" color={C.warn} />
  </g>; }
