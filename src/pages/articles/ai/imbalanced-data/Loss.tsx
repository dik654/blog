import ExplainedFormula from "@/components/ui/explained-formula";
import FocalLossViz from "./viz/FocalLossViz";

export default function Loss() {
  return (
    <section id="loss" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Class weight는 class를, focal loss는 현재 난이도를 가중합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Inverse-frequency class weight는 minority sample의 평균 기여를 키울 수 있지만 실제 오류 비용이나 label quality까지 알려주지는 않습니다. 너무 큰 weight는 잘못된 minority label의 gradient도 함께 증폭합니다. Focal loss는 class 빈도만 보는 대신 model이 이미 쉽게 맞힌 example의 loss를 줄입니다.</p></div>
      <ExplainedFormula question="Focal loss는 easy example의 cross-entropy 기여를 어떻게 줄일까?" idea={<>정답 class에 준 probability pt가 1에 가까울수록 modulation factor (1−pt)^γ가 0에 가까워집니다. γ=0이면 factor가 1이므로 ordinary cross-entropy로 돌아옵니다.</>} formula={String.raw`\operatorname{FL}(p_t)=-\alpha_t(1-p_t)^{\gamma}\log p_t`} terms={[{symbol:"pₜ",name:"target-class probability",description:"Binary이면 y=1일 때 p, y=0일 때 1−p입니다."},{symbol:"αₜ",name:"class balance factor",description:"Target class별 loss scale을 선택적으로 조정합니다."},{symbol:"γ",name:"focusing parameter",description:"Easy example down-weighting의 강도를 정하는 0 이상의 값입니다."},{symbol:"−log pₜ",name:"cross-entropy term",description:"정답 probability가 작을수록 커지는 기본 NLL입니다."}]} assumptions={["Probability와 target mapping이 올바른 classification loss입니다.","Hard example이 informative하다는 전제이며 label noise가 hard set을 지배하지 않습니다."]} interpretation="γ가 클수록 easy negative의 영향은 빠르게 줄지만 probability calibration과 optimization이 달라질 수 있습니다. RetinaNet의 α·γ는 해당 dense detection recipe이지 보편 기본값이 아닙니다." />
      <div id="paper-focal-loss" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">논문 읽기 · Dense detector의 easy negative</p><p className="mt-2 text-sm font-semibold">Focal Loss for Dense Object Detection</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Dense one-stage detector에서 수많은 easy background example이 학습을 지배하는 문제를 분석하고 well-classified example을 줄이는 focal loss와 RetinaNet을 제안했습니다. 이 결과는 dense detection 조건이며 일반적인 tabular imbalance의 최적 loss를 보장하지 않습니다.</p><a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content_ICCV_2017/html/Lin_Focal_Loss_for_ICCV_2017_paper.html" target="_blank" rel="noreferrer">원 논문의 loss와 RetinaNet 실험 보기</a></div>
      <div className="not-prose my-8"><FocalLossViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none"><p>Resampling과 weighted loss를 동시에 적용하면 minority 신호를 두 번 보정할 수 있습니다. 한 번에 하나씩 추가하고 ranking, calibration, class별 gradient와 error slice를 비교해야 어느 intervention이 이득을 만들었는지 알 수 있습니다.</p></div>
    </section>
  );
}
