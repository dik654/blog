import { motion } from "framer-motion";
import { AlertBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./ReleaseGateVizData";

function Arrow({ y, color }: { y: number; color: string }) { return <motion.path d={`M240 ${y} V${y + 30}`} stroke={color} strokeWidth={1.25} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />; }
function Frame({ active, caption }: { active: number; caption: string }) {
  const nodes = [
    ["용도 허락?", "라이선스 gate", C.license],
    ["24GB에 들어감?", "용량 gate", C.capacity],
    ["48GB 한 장?", "통신 제거 가능", C.capacity],
    ["실제 path", "P2P / host", C.comm],
    ["병렬화 후보", "TP / PP / EP", C.pipeline],
    ["완화 A/B", "배치 / 정밀도 / overlap", C.ep],
    ["출시 판정", "SLO / 안정성", C.verdict],
  ] as const;
  return <g>
    {nodes.map(([label, sub, color], i) => <g key={label} opacity={i <= active ? 1 : 0.25}><ModuleBox x={135} y={20 + i * 48} w={210} h={34} label={label} sub={sub} color={color} />{i < nodes.length - 1 && <Arrow y={54 + i * 48} color={i < active ? color : "var(--border)"} />}</g>)}
    <AlertBox x={40} y={348} w={400} h={24} label={caption} color={C.gap} />
  </g>;
}
export function Step0() { return <Frame active={0} caption="용량을 재기 전에 상용 용도인지 라이선스부터 확인한다" />; }
export function Step1() { return <Frame active={1} caption="용량 숫자보다 먼저 한 장에 들어가는지 묻는다" />; }
export function Step2() { return <Frame active={2} caption="48GB 한 장으로 합치면 GPU 간 통신을 제거할 수 있다" />; }
export function Step3() { return <Frame active={3} caption="RTX 4090은 P2P 미지원 · host staging 가능" />; }
export function Step4() { return <Frame active={4} caption="PP를 기본값으로 고정하지 말고 같은 workload로 A/B" />; }
export function Step5() { return <Frame active={5} caption="통신 activation과 weight 정밀도를 구분" />; }
export function Step6() { return <Frame active={6} caption="명목 비율이 아니라 p95·p99와 안정성이 결론" />; }
