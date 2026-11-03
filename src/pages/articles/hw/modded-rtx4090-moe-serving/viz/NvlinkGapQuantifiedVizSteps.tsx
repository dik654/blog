import { motion } from "framer-motion";
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from "@/components/viz/boxes";
import { C } from "./NvlinkGapQuantifiedVizData";

export function Step0() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.formula}>한 방향 PCIe raw rate 계산</text>
  <DataBox x={20} y={52} w={90} h={42} label="16GT/s" sub="lane 속도" color={C.formula} outlined />
  <text x={120} y={78} fontSize={14} fontWeight={700} fill={C.formula}>×</text>
  <DataBox x={140} y={52} w={80} h={42} label="16" sub="lane 수" color={C.formula} outlined />
  <text x={230} y={78} fontSize={14} fontWeight={700} fill={C.formula}>×</text>
  <DataBox x={250} y={52} w={90} h={42} label="128/130" sub="encoding" color={C.formula} outlined />
  <text x={350} y={78} fontSize={14} fontWeight={700} fill={C.formula}>÷</text>
  <DataBox x={375} y={52} w={80} h={42} label="8" sub="bit→byte" color={C.formula} outlined />
  <ActionBox x={115} y={118} w={250} h={44} label="≈31.5GB/s 편도" sub="63GB/s는 양방향 합" color={C.formula} />
  <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">dispatch 한 방향의 분모로 63을 쓰지 않는다</text>
  </g>; }

export function Step1() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.alert}>RTX 4090 · direct P2P 미지원</text>
  <ModuleBox x={20} y={50} w={110} h={44} label="GPU 0" sub="PCIe x16" color={C.pcie} />
  <ModuleBox x={185} y={50} w={110} h={44} label="Host memory" sub="staging path" color={C.alert} />
  <ModuleBox x={350} y={50} w={110} h={44} label="GPU 1" sub="PCIe x16" color={C.pcie} />
  <motion.path d="M130 72 H185 M295 72 H350" stroke={C.alert} strokeWidth={1.25} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
  <AlertBox x={65} y={120} w={350} h={44} label="raw slot rate ≠ GPU↔GPU goodput" sub="topology·driver·host path를 실측" color={C.alert} />
  </g>; }

export function Step2() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.nvlink3090}>RTX 3090 · 두 카드 전용 bridge</text>
  <ModuleBox x={45} y={58} w={120} h={46} label="GPU 0" sub="RTX 3090" color={C.nvlink3090} />
  <ModuleBox x={315} y={58} w={120} h={46} label="GPU 1" sub="RTX 3090" color={C.nvlink3090} />
  <motion.rect x={165} y={68} width={150} height={18} rx={6} fill={C.nvlink3090} fillOpacity={0.15} stroke={C.nvlink3090} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: "240px 77px" }} />
  <ActionBox x={105} y={125} w={270} h={44} label="56.25GB/s/방향" sub="112.5GB/s 양방향 합 · 2-way" color={C.nvlink3090} />
  </g>; }

export function Step3() { return <g>
  <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.nvswitch}>HGX/DGX A100 · NVSwitch fabric</text>
  {[50,155,260,365].map((x,i) => <DataBox key={x} x={x} y={45} w={65} h={32} label={`GPU ${i}`} color={C.nvswitch} />)}
  <ModuleBox x={155} y={105} w={170} h={42} label="NVSwitch" sub="균일한 high-bandwidth fabric" color={C.nvswitch} />
  {[82,187,292,397].map((x,i) => <motion.line key={x} x1={x} y1={77} x2={240} y2={105} stroke={C.nvswitch} strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.1 }} />)}
  <StatusBox x={130} y={158} w={220} h={34} label="600GB/s/GPU 양방향" progress={0.67} color={C.nvswitch} />
  </g>; }
