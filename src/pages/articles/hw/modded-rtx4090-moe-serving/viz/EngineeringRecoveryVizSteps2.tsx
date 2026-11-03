import { motion } from "framer-motion";
import { ActionBox, AlertBox, DataBox, StatusBox } from "@/components/viz/boxes";
import { C } from "./EngineeringRecoveryVizData";

export function Step3() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.quantC}>C) 실제 activation 통신 정밀도를 낮춘다</text>
  <DataBox x={40} y={52} w={150} h={48} label="BF16 activation" sub="2 byte / element" color={C.warn} />
  <motion.path d="M195 76 H285" stroke={C.quantC} strokeWidth={1.25} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
  <DataBox x={290} y={52} w={150} h={48} label="FP8 activation" sub="1 byte / element" color={C.quantC} />
  <AlertBox x={65} y={125} w={350} h={48} label="Weight-only INT4와 다른 레버" sub="정확도와 collective bytes를 함께 확인" color={C.warn} />
  </g>; }

export function Step4() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.batchD}>D) Batch가 키우는 것과 가리는 것을 함께 잰다</text>
  <StatusBox x={35} y={50} w={180} h={48} label="compute 증가" sub="overlap 여지" progress={0.8} color={C.ok} />
  <StatusBox x={265} y={50} w={180} h={48} label="payload 증가" sub="토큰·activation" progress={0.8} color={C.warn} />
  <ActionBox x={70} y={125} w={340} h={46} label="collective duration + overlap ratio" sub="TTFT와 메모리도 다시 측정" color={C.batchD} />
  </g>; }

export function Step5() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}>최적화는 하나씩 바꾸고 trace로 닫는다</text>
  <ActionBox x={20} y={52} w={135} h={46} label="원격 토큰" sub="expert placement" color={C.expertA} />
  <ActionBox x={173} y={52} w={135} h={46} label="실제 bytes" sub="activation precision" color={C.quantC} />
  <ActionBox x={326} y={52} w={135} h={46} label="대기 시간" sub="parallelism·overlap" color={C.time} />
  <AlertBox x={45} y={125} w={390} h={48} label="PCIe 상한은 그대로" sub="효과는 target workload의 p95·p99로 판정" color={C.warn} />
  </g>; }
