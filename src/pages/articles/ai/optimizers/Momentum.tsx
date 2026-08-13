import ExplainedFormula from "@/components/ui/explained-formula";
import MomentumViz from "./viz/MomentumViz";

export default function Momentum() {
  return (
    <section id="momentum" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Momentum: 과거 gradient의 exponentially weighted direction을 기억하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Mini-batch마다 부호가 번갈아 바뀌는 좌표는 누적 과정에서 상쇄되고, 여러 step 동안 같은 부호가 유지되는 좌표는 커집니다. 그래서 좁고 긴 quadratic valley에서 횡방향 진동을 줄이고 일관된 하강 방향을 강조할 수 있습니다.</p></div>
      <ExplainedFormula question="과거 gradient를 모두 저장하지 않고 최근 방향을 어떻게 요약할까요?" idea={<>이전 velocity를 β만큼 남기고 현재 gradient를 더합니다. 반복해서 펼치면 오래된 gradient일수록 β의 거듭제곱만큼 작아지는 weighted sum입니다.</>} formula={String.raw`v_t=\beta v_{t-1}+g_t=\sum_{k=0}^{t-1}\beta^k g_{t-k},\qquad \theta_{t+1}=\theta_t-\eta v_t`} terms={[{symbol:"v_t",name:"velocity state",description:"최근 gradient 방향을 exponentially weighted하게 누적한 optimizer state입니다."},{symbol:"\\beta",name:"momentum coefficient",description:"과거 방향을 다음 step까지 남기는 비율입니다."},{symbol:"\\beta^k",name:"age weight",description:"k step 전 gradient가 현재 velocity에 기여하는 감쇠 비율입니다."}]} assumptions={["이 식은 unnormalized momentum convention입니다. (1−β)를 곱하는 EMA convention과 scale이 다릅니다.","Parameter마다 같은 β를 쓰더라도 gradient coordinate의 scale과 correlation은 다를 수 있습니다."]} interpretation="β=0.9이면 10 step 전 gradient의 weight는 0.9¹⁰≈0.35입니다. '최근 10개만 평균'하는 hard window가 아니라 과거 전체를 지수적으로 감쇠합니다." />
      <MomentumViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Nesterov momentum은 momentum으로 이동할 지점을 미리 반영한 위치에서 gradient를 평가하는 look-ahead 변형입니다. 단순히 항상 overshoot를 없애는 장치라고 단정하지 말고, 사용한 수식 convention과 schedule을 함께 비교해야 합니다.</p></div>
    </section>
  );
}
