import ExplainedFormula from "@/components/ui/explained-formula";
import PTQProcessViz from "./viz/PTQProcessViz";

export default function PTQ() {
  return <section id="ptq" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">PTQ는 calibration 표본으로 scale을 정하고, 학습 없이 배포 artifact를 만드는 절차입니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>Post-training quantization(PTQ)은 이미 학습된 checkpoint를 고정한 채 observer가 representative input의 tensor 통계를 모으고 quantized operator로 변환합니다. Label 수보다 실제 sequence length·language·image contrast·rare activation pattern을 얼마나 덮는지가 중요하며, test를 calibration에 쓰면 선택 정보가 새어 들어갑니다.</p>
      <p>Per-tensor는 tensor 전체가 scale 하나를 공유해 metadata와 kernel이 단순하지만 한 channel의 outlier가 나머지 resolution을 망칠 수 있습니다. Per-channel은 output channel마다, group-wise는 연속 weight 여러 개마다 scale을 두어 오차를 줄이는 대신 scale metadata·load·packing 제약이 늘어납니다.</p>
    </div>
    <ExplainedFormula
      question="Scale을 더 잘게 나누면 오차와 metadata는 어떻게 함께 바뀔까요?"
      idea={<>Tensor를 G개 group으로 나누고 각 group에 독립 scale과 zero-point를 둡니다. Group이 작아지면 local range에 맞는 촘촘한 grid를 쓸 수 있지만 저장하고 읽을 scale 수가 늘어납니다.</>}
      formula={String.raw`\begin{aligned}
q_i&=Q(x_i;s_{g(i)},z_{g(i)})\\
G&=\left\lceil\frac{N}{n_g}\right\rceil\\
S_{\mathrm{meta}}&=G\,(b_s+b_z)
\end{aligned}`}
      terms={[
        { symbol: "g(i)", name: "group assignment", description: "Element i가 공유할 scale group의 index입니다." },
        { symbol: "N", name: "element count", description: "현재 quantized tensor의 전체 scalar 수입니다." },
        { symbol: "n_g", name: "group size", description: "Scale 하나를 공유하는 연속 element 수입니다." },
        { symbol: "b_s,b_z", name: "metadata bytes", description: "Group마다 저장하는 scale과 zero-point의 byte 수입니다." },
      ]}
      assumptions={["마지막 group의 padding과 alignment, tensor header는 생략한 raw metadata 계산입니다.", "Per-channel axis와 group layout이 target kernel의 packing convention과 같아야 합니다.", "더 작은 group이 task quality를 항상 높이지 않으며 scale estimation noise와 memory bandwidth도 함께 측정합니다."]}
      interpretation="N=4096, group size 128이면 scale group은 32개입니다. FP16 scale 2 byte와 zero-point 1 byte를 쓰면 raw metadata는 96 byte지만 실제 format의 block header와 alignment가 더해질 수 있습니다."
    />
    <ExplainedFormula
      question="Calibration 표본이 실제 activation range를 덮었는지 어떤 수치로 확인할까요?"
      idea={<>배포와 분리한 validation input에서 quantizer 범위를 벗어나 끝 code에 포화된 element 비율을 layer·input slice별로 셉니다. 평균만 보지 않고 가장 취약한 slice를 남깁니다.</>}
      formula={String.raw`\begin{aligned}
I_i^{(\ell,c)}&=\mathbf 1[x_i<r_{\min}^{(\ell)}\ \lor\ x_i>r_{\max}^{(\ell)}]\\
\rho_{\mathrm{sat}}^{(\ell,c)}
&=\frac{1}{N_{\ell,c}}\sum_{i=1}^{N_{\ell,c}}I_i^{(\ell,c)}\\
\rho_{\mathrm{worst}}&=\max_{\ell,c}\rho_{\mathrm{sat}}^{(\ell,c)}
\end{aligned}`}
      terms={[
        { symbol: "ell", name: "layer/operator", description: "Activation range와 sensitivity를 따로 기록할 model 위치입니다." },
        { symbol: "c", name: "traffic slice", description: "Language·length·image condition처럼 배포 분포를 나눈 구간입니다." },
        { symbol: "I_i", name: "saturation indicator", description: "Element가 현재 layer range 밖이면 1, range 안이면 0입니다." },
        { symbol: "rho_sat", name: "saturation rate", description: "설정 range 밖으로 나가 endpoint에 clipping된 element 비율입니다." },
      ]}
      assumptions={["Range와 observer state를 고정한 뒤 calibration과 다른 validation input으로 측정합니다.", "Element saturation이 작은데도 중요한 channel 오차로 task quality가 나빠질 수 있어 layer bypass ablation을 함께 봅니다.", "NaN·Inf와 runtime fallback은 saturation과 별도 오류로 기록합니다."]}
      interpretation="전체 평균 .01%라도 긴 한국어 query slice의 특정 layer가 4%면 calibration coverage가 부족할 수 있습니다. 그 layer만 높은 precision으로 남기는 mixed-precision 후보와 표본 보강을 비교합니다."
    />
    <div className="not-prose my-8"><PTQProcessViz /></div>
    <div id="paper-smoothquant" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">논문 읽기 · SmoothQuant</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">SmoothQuant는 LLM activation outlier 때문에 W8A8 PTQ가 어려운 문제를 다루며, 수학적으로 동등한 channel scaling으로 난이도를 activation에서 weight로 옮깁니다. 논문의 정확도와 속도는 OPT·BLOOM·GLM 계열, calibration·INT8 kernel과 hardware 조건의 결과이지 모든 model과 low-bit format의 보장은 아닙니다.</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.mlr.press/v202/xiao23c.html" target="_blank" rel="noreferrer">Equivalent scaling·W8A8·실험 범위 보기</a>
    </div>
  </section>;
}
