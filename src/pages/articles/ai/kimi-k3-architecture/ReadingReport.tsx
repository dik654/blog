import { Link } from "react-router-dom";
import EvidenceLedgerViz from "./viz/EvidenceLedgerViz";

export default function ReadingReport() {
  return (
    <section id="reading-report" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Frontier report는 구성·학습·runtime·benchmark의 근거 강도를 따로 읽어야 한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          수 trillion parameter model은 component 하나를 바꿀 때마다 동일한 data·compute로 처음부터 다시 학습하는 full-scale 통제 실험이 매우 비쌉니다. 그래서 report의 configuration과 method equation은 정확히 확인할 수 있어도, 각 부품이 최종 benchmark에 몇 점을 더했는지는 같은 강도로 알 수 없는 경우가 많습니다. 공개 사실, 프로젝트의 종합 주장, 독자의 인과 추론을 한 표에 섞지 않아야 합니다.
        </p>
      </div>

      <EvidenceLedgerViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>약 2.5× scaling efficiency는 component 하나의 속도 배수가 아니다</h3>
        <p className="leading-8">
          K3 report의 scaling efficiency는 K2와 같은 validation loss에 도달하는 compute를 비교한 종합 지표입니다. Architecture뿐 아니라 data recipe와 optimizer·training 안정화가 함께 달라졌습니다. 따라서 “KDA가 2.5배 빠르다”, “LatentMoE가 benchmark를 2.5배 높였다”처럼 개별 component에 배수를 옮기면 근거 범위를 벗어납니다. Component별 작은-scale ablation과 최종-scale system 결과는 다른 evidence level로 표시해야 합니다.
        </p>

        <h3>Benchmark는 model weight만의 결과가 아니다</h3>
        <p className="leading-8">
          Coding·agent benchmark에서는 Kimi Code, Claude Code, Codex 같은 서로 다른 harness와 tool augmentation, reasoning effort와 sampling budget이 사용될 수 있습니다. 이때 점수는 model weight, system prompt, tool set, timeout, retry, judge를 합친 system measurement입니다. Model architecture를 비교하려면 task version과 harness를 맞춘 결과를 우선하고, 맞출 수 없다면 표의 차이를 model 단독 성능으로 해석하지 않습니다.
        </p>

        <h3>On-policy distillation은 architecture가 아니라 post-training 통합 방법이다</h3>
        <p className="leading-8">
          K3는 domain과 reasoning-effort에 특화된 여러 policy의 능력을 하나의 student에 통합하기 위해 multi-teacher on-policy distillation을 사용합니다. 여기서 on-policy라는 말은 student가 현재 policy로 만든 trajectory 분포에서 teacher signal을 받는다는 뜻입니다. Teacher가 반드시 student와 같은 checkpoint이거나 “자기 자신에게 배우는 방식”이라는 뜻은 아닙니다. Distillation의 logit·feature·sequence signal과 on/off-policy 구분은 <Link to="/ai/knowledge-distillation">지식 증류 정본</Link>에서 확장합니다.
        </p>

        <h3>Architecture의 효율은 runtime이 지원해야 실제 latency로 이어진다</h3>
        <p className="leading-8">
          Hybrid KDA–MLA는 KDA의 고정 recurrent state와 MLA의 token별 KV cache라는 서로 다른 cache를 함께 관리해야 합니다. Block AttnRes는 inter-block read와 intra-block partial sum을 병합해야 하고, 896-expert LatentMoE는 load-balanced expert-parallel kernel이 필요합니다. Report는 KDA-aware prefix cache, 전용 decode kernel, Block AttnRes fusion과 cache-aware scheduling을 별도 infrastructure 기여로 설명합니다. Architecture의 이론적인 state 절약이 범용 runtime에서 곧바로 같은 end-to-end latency를 낸다고 가정하면 안 됩니다.
        </p>

        <h3>다음 model에도 적용할 수 있는 읽기 순서</h3>
        <ol>
          <li>공식 configuration에서 layer·dimension·routing·context를 고정합니다.</li>
          <li>각 method가 줄이는 자원과 새로 추가하는 자원을 식으로 분리합니다.</li>
          <li>Component ablation, combined scaling result와 benchmark system 조건을 구분합니다.</li>
          <li>Training과 serving implementation이 architecture 가정을 실제로 지원하는지 확인합니다.</li>
          <li>공개되지 않은 인과 관계는 “가능한 해석”으로 남기고 사실처럼 쓰지 않습니다.</li>
        </ol>
        <p className="border-l border-primary/50 pl-4 text-sm leading-7">
          <strong>읽기 원칙:</strong> K3는 Transformer의 작은 변형 하나가 아니라 sequence·depth·width·post-training·runtime의 여러 설계를 조합한 system입니다. 이 층들을 분리해야 다음 model에서 무엇이 실제로 바뀌었는지, 무엇이 이름만 달라졌는지 추적할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
