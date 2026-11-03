import { motion } from "framer-motion";
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from "@/components/viz/boxes";
import { C } from "./NvlinkGapQuantifiedVizData";

export function Step4() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.h100}>DGX H100 · 4th-gen NVLink + NVSwitch</text>
  {[50,155,260,365].map((x,i) => <DataBox key={x} x={x} y={45} w={65} h={32} label={`GPU ${i}`} color={C.h100} />)}
  <ModuleBox x={155} y={105} w={170} h={42} label="NVSwitch" sub="8-GPU system fabric" color={C.h100} />
  {[82,187,292,397].map((x,i) => <motion.line key={x} x1={x} y1={77} x2={240} y2={105} stroke={C.h100} strokeWidth={1.2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.1 }} />)}
  <StatusBox x={130} y={158} w={220} h={34} label="900GB/s/GPU 양방향" progress={1} color={C.h100} />
  </g>; }

export function Step5() { const bars = [{x:55,h:10,label:"4090",v:"63",c:C.pcie},{x:165,h:20,label:"3090",v:"112.5",c:C.nvlink3090},{x:275,h:100,label:"A100",v:"600",c:C.nvswitch},{x:385,h:150,label:"H100",v:"900",c:C.h100}]; return <g>
  <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700}>명목 양방향 수치만 같은 축에 놓기</text>
  <line x1={25} y1={178} x2={455} y2={178} stroke="var(--border)" />
  {bars.map((b,i) => <g key={b.label}><motion.rect x={b.x} width={55} rx={4} fill={b.c} fillOpacity={0.75} initial={{ y:178,height:0 }} animate={{ y:178-b.h,height:b.h }} transition={{ delay:i*0.15 }} /><text x={b.x+27.5} y={172-b.h} textAnchor="middle" fontSize={8} fontWeight={700} fill={b.c}>{b.v}</text><text x={b.x+27.5} y={192} textAnchor="middle" fontSize={8}>{b.label}</text></g>)}
  <text x={240} y={32} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">600÷63≈9.5 · 900÷63≈14.3 · application speedup 아님</text>
  </g>; }

export function Step6() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}>스펙표에서 실제 출시 판단으로</text>
  <ActionBox x={25} y={48} w={130} h={52} label="1. P2P 확인" sub="topo -p2p p" color={C.pcie} />
  <ActionBox x={175} y={48} w={130} h={52} label="2. Pair 측정" sub="nvbandwidth" color={C.nvlink3090} />
  <ActionBox x={325} y={48} w={130} h={52} label="3. Collective" sub="NCCL tests" color={C.nvswitch} />
  <AlertBox x={65} y={125} w={350} h={46} label="4. Serving trace로 닫기" sub="TTFT · TPOT · p95 · p99 · errors" color={C.alert} />
  </g>; }
