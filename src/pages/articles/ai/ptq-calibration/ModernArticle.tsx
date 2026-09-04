import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CalibrationPipelineViz } from "../quantization/viz/ModernQuantizationViz";

export default function PtqCalibrationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          PTQ는 학습 없이 scale을 고르는 배포 전 변환입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Post-training quantization</strong>은 학습이 끝난
            checkpoint를 고정하고, 대표 입력으로 tensor range를 관측해 quantized
            artifact를 만드는 절차입니다.
          </p>
          <p>
            먼저 <a href="/ai/quantization">quantizer의 scale·clipping</a>을
            이해해야 합니다. 이 글은 scale을 어디에서 공유하고 어떤 표본으로
            검증하는지만 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="Calibration pipeline의 네 역할"
          items={[
            {
              term: "Checkpoint",
              description: "변환 전 float weights와 graph입니다.",
              example: "같은 base revision을 모든 candidate가 공유합니다.",
              boundary: "PTQ에서는 optimizer로 다시 학습하지 않습니다.",
            },
            {
              term: "Observer",
              description:
                "Tensor의 min/max·histogram·amax 같은 통계를 모읍니다.",
              example:
                "Layer 20 activation range를 calibration inputs에서 기록합니다.",
              boundary: "Observer output이 task quality 자체는 아닙니다.",
            },
            {
              term: "Calibration set",
              description: "Scale을 정할 representative input입니다.",
              example: "언어·길이·modality traffic slice를 포함합니다.",
              boundary: "최종 test를 재사용하면 선택 정보가 누출됩니다.",
            },
            {
              term: "Converted artifact",
              description:
                "Scale·packing·converted operators가 들어간 실행 단위입니다.",
              example: "Unsupported op fallback 목록도 receipt에 남깁니다.",
              boundary: "Fake observer graph와 실제 배포 binary를 구분합니다.",
            },
          ]}
        />
        <CalibrationPipelineViz />
        <ContentBoundary article="ptq-calibration" />
      </section>
      <section id="quantization-axes" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          언제 바꿀지는 PTQ·QAT가, 무엇을 바꿀지는 weight·activation이 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>PTQ(post-training quantization)</strong>는 학습이 끝난
            checkpoint를 그대로 두고 calibration만으로 scale을 정하는 반면,{" "}
            <strong>QAT(quantization-aware training)</strong>는 forward에
            fake quantization을 넣어 optimizer가 오차를 직접 보면서 weight를
            다시 학습합니다. 두 방법은 quantization error를 학습이 끝난 뒤에
            처리하는지 학습 도중에 처리하는지에서 갈립니다.
          </p>
          <p>
            같은 quantizer를 어느 tensor에 적용하는지도 별개의 축입니다.{" "}
            <strong>Weight quantization</strong>은 학습이 끝나 값이 고정된
            weight tensor만 낮은 정밀도로 바꾸고,{" "}
            <strong>activation quantization</strong>은 매 forward마다 새로
            계산되는 activation tensor까지 낮은 정밀도로 바꿉니다. Activation은
            입력에 따라 range가 흔들리므로 weight보다 다루기 어렵습니다.
          </p>
          <p>
            Weight만 4bit로 저장하고 activation은 그대로 두면{" "}
            <Link to="/ai/weight-only-quantization#overview">
              weight-only quantization
            </Link>
            이라 부르고, 둘 다 8bit로 낮추면 W8A8이라고 표기합니다. 이 글의
            calibration pipeline은 weight quantization·activation
            quantization 어느 쪽에도 적용되는 절차입니다.
          </p>
        </div>
      </section>
      <section id="scale-granularity" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Scale을 공유하는 범위가 error·metadata·kernel layout을 함께 바꿉니다
        </h2>
        <ExplainedFormula
          question="4096 weights를 group 128로 나누면 scale metadata가 왜 늘어나나요?"
          idea={
            <p>
              각 group마다 독립 scale과 zero-point를 저장하므로 group 수를 먼저
              구하고 group당 metadata byte를 곱합니다.
            </p>
          }
          formula={String.raw`G=\lceil N/n_g\rceil,\quad M_{\rm meta}=G(b_s+b_z)`}
          annotatedFormula={String.raw`\begin{aligned}G&=\underbrace{\left\lceil N/n_g\right\rceil}_{\text{scale group 수}}\\M_s&=\underbrace{G b_s}_{\text{scale bytes}}\\M_z&=\underbrace{G b_z}_{\text{zero-point bytes}}\\M_{\rm meta}&=\underbrace{M_s+M_z}_{\text{metadata 합계}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\lceil N/n_g\rceil`,
              annotation: ["원소 수를 group 크기로 나눠", "scale 개수 계산"],
            },
            {
              expression: String.raw`G(b_s+b_z)`,
              annotation: [
                "group당 metadata를 합하고",
                "전체 group 수만큼 반복",
              ],
            },
          ]}
          terms={[
            {
              symbol: "N",
              name: "원소 수",
              description: "Quantized tensor의 scalar 개수입니다.",
            },
            {
              symbol: String.raw`n_g`,
              name: "Group size",
              description: "Scale 하나를 공유하는 연속 원소 수입니다.",
            },
            {
              symbol: String.raw`b_s,b_z`,
              name: "Metadata bytes",
              description: "Scale과 zero-point 하나의 byte 수입니다.",
            },
          ]}
          assumptions={[
            "Padding·alignment·header는 제외한 raw 계산입니다.",
            "Group axis가 target kernel packing과 일치합니다.",
            "작은 group이 task quality를 자동 보장하지 않습니다.",
          ]}
          interpretation="4096/128=32 groups이고 scale 2 byte·zero-point 1 byte라면 raw metadata는 96 byte입니다."
        />
      </section>
      <section id="dynamic-static-outliers" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Static은 calibration dataset으로, dynamic은 실행 시 scale을 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Activation quantization은 scale을 언제 정하는지에 따라 갈립니다.{" "}
            <strong>Static quantization</strong>은 배포 전에{" "}
            <strong>calibration dataset</strong>을 흘려 관측한 range로 scale을
            고정하고, <strong>dynamic quantization</strong>은 매 forward마다
            그 순간의 min/max를 보고 scale을 즉석에서 계산합니다.
          </p>
          <p>
            이 글의 calibration set이 곧 static quantization이 쓰는
            calibration dataset입니다. Dynamic quantization은 이 표본을 따로
            두지 않는 대신 매 호출마다 관측 비용을 지불합니다.
          </p>
          <p>
            문제는 이 calibration dataset이 정한 range 안에{" "}
            <strong>outlier activation</strong>이 있을 때 생깁니다. 특정
            channel 값이 나머지보다 훨씬 크면 그 channel 하나가 tensor 전체의
            min/max를 정해버려 나머지 channel의 rounding error가 커집니다.
          </p>
          <p>
            <strong>Outlier handling</strong>은 이 난이도를 다른 곳으로 옮기는
            방법들입니다. SmoothQuant는 activation과 weight 사이에 동등한
            channel scaling을 넣어 난이도를 activation에서 weight로 옮기고
            (자세한 인용은 release 절 참고), AWQ는 channel마다 활성화 크기에
            비례한 scale을 따로 둬 salient weight를 보호합니다.
          </p>
        </div>
        <div id="paper-awq" className="scroll-mt-24">
          <CitationBlock
            source="AWQ"
            citeKey={1}
            href="https://arxiv.org/abs/2306.00978"
          >
            <strong>문제:</strong> Weight-only PTQ에서 몇 % salient weight를
            잘못 다루면 품질이 크게 떨어짐. <strong>기여:</strong> Activation
            크기를 기준으로 channel마다 다른 scale을 줘 salient weight를
            보호하는 channel-wise scaling. <strong>전제:</strong> 논문의
            model·calibration·kernel 조건. <strong>근거 범위:</strong> AWQ
            변환과 실험. <strong>과장 금지:</strong> 모든 model·bit width에서
            동일 품질과 속도를 보장하지 않습니다.
          </CitationBlock>
        </div>
      </section>
      <section id="coverage" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          평균 대신 layer와 traffic slice의 최악 포화를 찾습니다
        </h2>
        <ExplainedFormula
          question="Calibration range가 실제 입력을 덮는지 어떻게 측정하나요?"
          idea={
            <p>
              Validation input에서 range 밖 element를 indicator로 표시하고 layer와 slice별 비율을 계산한 뒤 최대값을 남깁니다.
            </p>
          }
          formula={String.raw`I_i^{\ell,c}=\mathbf1[x_i\notin R_\ell],\quad \rho_{\ell,c}=N_{\ell,c}^{-1}\sum_i I_i^{\ell,c},\quad \rho_{\rm worst}=\max_{\ell,c}\rho_{\ell,c}`}
          annotatedFormula={String.raw`\begin{aligned}I_i^{\ell,c}&=\underbrace{\mathbf1[x_i\notin R_\ell]}_{\text{range 밖이면 1}}\\C_{\ell,c}&=\underbrace{\sum_i I_i^{\ell,c}}_{\text{포화 개수}}\\\rho_{\ell,c}&=\underbrace{C_{\ell,c}/N_{\ell,c}}_{\text{slice 크기로 정규화}}\\\rho_{\rm worst}&=\underbrace{\max_{\ell,c}\rho_{\ell,c}}_{\text{최악 layer·slice}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[x_i\notin R_\ell]`,
              annotation: ["range 밖인지 판정해", "포화 사건을 0/1로 기록"],
            },
            {
              expression: String.raw`\sum_i I_i/N`,
              annotation: [
                "포화 사건을 세고",
                "서로 다른 크기를 비율로 정규화",
              ],
            },
            {
              expression: String.raw`\max_{\ell,c}\rho_{\ell,c}`,
              annotation: [
                "모든 layer·slice를 비교해",
                "가장 취약한 구간 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\ell`,
              name: "Layer",
              description: "Range를 별도로 기록한 operator 위치입니다.",
            },
            {
              symbol: "c",
              name: "Traffic slice",
              description: "언어·길이·modality 같은 배포 구간입니다.",
            },
            {
              symbol: String.raw`R_\ell`,
              name: "Representable range",
              description: "현재 layer scale이 복원할 수 있는 구간입니다.",
            },
          ]}
          assumptions={[
            "Calibration과 validation을 분리합니다.",
            "NaN·fallback은 saturation과 별도 집계합니다.",
            "낮은 saturation이 task quality를 보장하지 않습니다.",
          ]}
          interpretation="전체 .01%여도 긴 한국어 slice의 layer 20이 4%라면 해당 표본 보강·higher precision bypass를 같은 validation에서 비교합니다."
        />
      </section>
      <section id="release" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Scale 선택과 artifact release를 분리합니다
        </h2>
        <div id="paper-smoothquant" className="scroll-mt-24">
          <CitationBlock
            source="SmoothQuant"
            citeKey={2}
            href="https://proceedings.mlr.press/v202/xiao23c.html"
          >
            <strong>문제:</strong> LLM activation outlier가 W8A8 PTQ를 어렵게
            함. <strong>기여:</strong> 동등한 channel scaling으로 난이도를
            activation에서 weight로 이동. <strong>전제:</strong> 논문의
            model·calibration·INT8 kernel 조건. <strong>근거 범위:</strong>{" "}
            SmoothQuant 변환과 실험. <strong>과장 금지:</strong> 모든 model·bit
            width에서 동일 품질과 속도를 보장하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
