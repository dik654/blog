import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DiffusionLanguageRefinementViz from "./diffusion-language-models/viz/DiffusionLanguageRefinementViz";

export default function DiffusionLanguageModelsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="ar-vs-diffusion" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Diffusion LLM은 다음 token 대신 문장 전체의 빈칸을 반복해서 복원합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Autoregressive language model은 왼쪽 prefix가 정해진 뒤 다음 token 하나의
            확률을 냅니다. Diffusion language model은 완성된 token sequence를 MASK로
            점차 가리는 forward process를 만들고, 반대 방향에서는 현재 보이는 token
            전체를 이용해 masked 위치들을 복원합니다. 둘 다 확률 model이지만
            factorization과 sampling state가 다릅니다.
          </p>
          <p>
            Image diffusion과 닮은 점은 data를 단순한 noise state로 보낸 뒤 여러 reverse
            step으로 되돌린다는 것입니다. 다른 점은 language token이 discrete category라는
            점입니다. 대표적인 masked diffusion은 Gaussian 값을 조금씩 더하는 대신 원 token을
            특별한 absorbing state인 <code>[MASK]</code>로 바꿉니다.
          </p>
          <p>
            그래서 “Diffusion LLM은 image diffusion을 text에 그대로 적용했다”는 말은
            절반만 맞습니다. 공통 생성 원리는 있지만 corruption kernel, output 분포,
            loss와 runtime이 모두 이산 token에 맞게 다시 설계됩니다.
          </p>
        </div>
        <DiffusionLanguageRefinementViz />
        <ContentBoundary article="diffusion-language-models" />
      </section>

      <section id="forward-objective" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Forward process는 token마다 남길지 MASK로 보낼지 독립적으로 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Clean sequence <code>x</code>에서 noise time <code>t∈[0,1]</code>를 뽑고,
            각 위치를 확률 <code>t</code>로 MASK로 바꿉니다. <code>t=0.2</code>면 평균
            20%가 가려지고, <code>t=1</code>이면 모든 위치가 MASK입니다. Network는 가려진
            위치의 원 token만 cross-entropy로 맞힙니다.
          </p>
          <p>
            BERT의 고정 15% masked-language modeling과 겉모양이 비슷하지만 역할은 다릅니다.
            Masked diffusion은 0에서 1까지 여러 mask ratio를 학습하고 그 denoiser를 실제
            generative reverse chain에 사용합니다.
          </p>
          <p>
            MDLM은 absorbing mask process와 SUBS parameterization을 사용합니다. 이를 통해
            objective를 mask ratio에 따라 가중된 masked-LM loss의 mixture로 단순화했습니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 token은 time t에서 어떤 확률로 원래 값을 유지하거나 MASK가 되나요?"
          idea="Discrete state를 평균내는 대신 두 categorical outcome에 확률 질량을 나눕니다. 1−t는 원 token에, t는 absorbing MASK state에 둡니다."
          formula={String.raw`q(x_t^i\mid x_0^i)=(1-t)\,\delta_{x_0^i}+t\,\delta_{m}`}
          annotatedFormula={String.raw`q(x_t^i\mid x_0^i)=\underbrace{(1-t)\,\delta_{x_0^i}}_{\text{원 token을 유지하는 질량}}+\underbrace{t\,\delta_m}_{\text{MASK state로 보내는 질량}},\qquad \underbrace{(1-t)+t}_{\text{전체 확률 질량}}=1`}
          operations={[
            { expression: String.raw`(1-t)\,\delta_{x_0^i}`, annotation: ["낮은 noise time에는 큰 질량을 원 token에 두어", "보이는 context를 유지"] },
            { expression: String.raw`t\,\delta_m`, annotation: ["남은 질량을 특별한 MASK category에 두어", "복원해야 할 위치 생성"] },
            { expression: String.raw`(1-t)+t`, annotation: ["두 outcome의 질량을 더해", "categorical probability 1 유지"] },
          ]}
          terms={[
            { symbol: String.raw`x_0^i`, name: "Clean token", description: "원 sequence의 i번째 vocabulary token입니다." },
            { symbol: "m", name: "Absorbing MASK", description: "Forward에서 도달하면 원 token 정보가 사라지는 특별한 state입니다." },
            { symbol: "t", name: "Masking time", description: "이 단순 schedule에서 각 위치가 MASK일 확률입니다." },
          ]}
          assumptions={["각 token 위치를 독립적으로 masking하는 absorbing process의 단순형입니다.", "실제 논문은 continuous-time notation·schedule weighting·padding과 condition token masking 규칙을 추가합니다."]}
          interpretation="이 식은 token ID끼리 수치적으로 보간하지 않습니다. 원 token과 MASK라는 두 categorical outcome 사이에서 확률 질량만 이동합니다."
        />
        <ExplainedFormula
          question="왜 loss는 MASK가 된 위치에서만 원 token의 log probability를 계산하나요?"
          idea="보이는 token은 이미 정답이 입력에 있으므로 복사 loss를 주지 않습니다. Indicator로 masked 위치만 고르고, time별 weight로 전체 reverse process의 likelihood bound에 맞춥니다."
          formula={String.raw`\mathcal L(\theta)=\mathbb E_{x,t,x_t}\!\left[w(t)\sum_{i=1}^{L}\mathbf 1[x_t^i=m]\,\big(-\log p_\theta(x_0^i\mid x_t,t)\big)\right]`}
          annotatedFormula={String.raw`\mathcal L(\theta)=\mathbb E\!\left[\underbrace{w(t)}_{\text{noise-time 가중치}}\underbrace{\sum_{i=1}^{L}\mathbf 1[x_t^i=m]}_{\text{MASK 위치만 선택}}\underbrace{\big(-\log p_\theta(x_0^i\mid x_t,t)\big)}_{\text{원 token의 cross-entropy}}\right]`}
          operations={[
            { expression: String.raw`\mathbf 1[x_t^i=m]`, annotation: ["현재 위치가 MASK인지 확인해", "보이는 token의 trivial copy loss 제거"] },
            { expression: String.raw`-\log p_\theta(x_0^i\mid x_t,t)`, annotation: ["원 token에 준 확률을 negative log로 바꿔", "틀린 복원에 큰 penalty 부여"] },
            { expression: String.raw`w(t)\sum_{i=1}^{L}`, annotation: ["time별 가중치와 모든 masked 위치를 합쳐", "한 sequence의 denoising objective 구성"] },
          ]}
          terms={[
            { symbol: "L", name: "Sequence length", description: "현재 학습 sequence의 token 위치 수입니다." },
            { symbol: String.raw`p_\theta`, name: "Mask predictor", description: "양방향 context를 읽고 각 masked 위치의 vocabulary 분포를 냅니다." },
            { symbol: "w(t)", name: "Time weighting", description: "선택한 variational objective와 schedule에 따라 noise time 기여를 조정합니다." },
          ]}
          assumptions={["Conditioning prompt는 보존하고 response 위치만 masking하는 SFT에서는 indicator 범위가 response로 제한됩니다.", "정확한 w(t)는 MDLM·LLaDA 등 formulation에 따라 다르므로 단일 상수로 일반화하지 않습니다."]}
          interpretation="형태는 masked-LM loss와 비슷하지만 random mask ratio와 reverse sampler까지 함께 정의돼야 generative diffusion contract가 완성됩니다."
        />
        <div id="paper-mdlm" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Sahoo et al. · Simple and Effective Masked Diffusion Language Models"
            citeKey={1}
            href="https://arxiv.org/abs/2406.07524"
          >
            NeurIPS 2024 MDLM은 absorbing MASK와 SUBS parameterization으로 continuous-time
            variational objective를 weighted masked-LM loss로 단순화하고, encoder-only
            backbone과 semi-autoregressive sampler를 평가했습니다. Perplexity 결과는 해당
            data·model·sampler 범위입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="reverse-sampling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Reverse sampler는 동시에 채우고, 일부를 다시 지우며, 확정을 늘려 갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sampling은 fully masked response에서 시작합니다. 각 step에서 bidirectional
            Transformer가 모든 masked 위치의 vocabulary 분포를 냅니다. 그중 일부 token을
            채운 뒤, 다음 time의 mask 수에 맞게 낮은 신뢰도 위치를 다시 MASK로 보낼 수
            있습니다. 왼쪽 token을 영구 확정하는 AR과 달리 뒤쪽 문맥을 보고 앞쪽 후보를
            고치는 경로가 열립니다.
          </p>
          <p>
            하지만 반복 수정이 항상 정답을 향하는 것은 아닙니다. 초기의 잘못된 고신뢰도
            token이 고정되거나, confidence가 calibration되지 않아 중요한 token이 계속
            remask될 수 있습니다. Step 수·remasking schedule·token selection은 quality와
            latency를 함께 바꾸는 sampler hyperparameter입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Low-confidence remasking을 쓰는 masked diffusion sampler"
          input={["prompt tokens p", "response length L", "sampling steps S", "trained mask predictor p_θ", "temperature와 remask schedule"]}
          steps={[
            { code: "r ← [MASK]^L", note: "응답 영역 L개를 모두 absorbing MASK state로 초기화합니다." },
            { code: "for k = S, S−1, …, 1:", note: "Mask가 많은 상태에서 적은 상태로 reverse time을 진행합니다." },
            { code: "  logits ← p_θ(concat(p, r), t=k/S)", note: "Causal mask 없이 prompt와 현재 response 전체를 읽습니다." },
            { code: "  candidates, confidence ← sample(logits at masked positions)", note: "모든 masked 위치의 token 후보와 신뢰도를 한 forward에서 얻습니다." },
            { code: "  r[masked] ← candidates", note: "이번 step에서 masked 위치를 잠정적으로 채웁니다." },
            { code: "  keep_count ← schedule(k−1, S, L)", note: "다음 step에 확정해 둘 token 수를 정합니다." },
            { code: "  r[lowest_confidence outside keep_count] ← [MASK]", note: "불확실한 token은 다음 forward에서 문맥 전체를 보고 다시 예측하게 합니다." },
          ]}
          repeatUntil="S번의 reverse step을 마치거나 MASK가 모두 사라질 때까지 반복합니다."
          output="완성된 response token sequence r"
        />
        <div id="paper-llada" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Nie et al. · Large Language Diffusion Models (LLaDA)"
            citeKey={2}
            href="https://arxiv.org/abs/2502.09992"
          >
            LLaDA는 random mask-ratio pretraining과 SFT, low-confidence remasking을 대규모
            language model에 적용했습니다. 8B benchmark와 reversal-task 결과는 저자
            자기보고이며 GPT 계열 전체보다 diffusion이 우월하다는 일반 결론이 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="runtime-blocks" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          병렬 token 예측은 가능하지만 매 step 전체 문맥을 다시 읽는 비용이 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Full-sequence masked diffusion은 한 forward에서 여러 token을 채울 수 있습니다.
            그러나 다음 reverse step에서는 token 상태가 여러 위치에서 바뀌므로 전체 sequence의
            attention을 다시 계산하는 것이 기본입니다. Decoder-only AR의 causal prefix처럼
            “앞부분은 영원히 변하지 않는다”는 전제가 없어 일반적인 token-by-token KV cache를
            그대로 쓰기 어렵습니다.
          </p>
          <p>
            따라서 speed는 <code>한 step에서 채운 유효 token 수</code>만으로 판단하지 않습니다.
            Sequence length, sampling step 수, block size, forward latency, remask 비율과 quality를
            함께 재야 합니다. LLaDA 논문도 system-level KV-cache optimization이 없는 초기
            구현이라고 한계를 적었습니다.
          </p>
          <p>
            Block diffusion은 이 비용을 줄이는 절충입니다. Block 사이는 autoregressive하게
            확정해 이전 block을 causal prefix로 cache하고, 현재 block 안에서만 diffusion으로
            여러 token을 고칩니다. 대신 미래 block 전체를 보며 앞 token을 자유롭게 수정하는
            full diffusion의 장점 일부를 포기합니다.
          </p>
        </div>
        <TermBreakdown
          title="AR·full diffusion·block diffusion의 runtime 경계"
          items={[
            { term: "Autoregressive", description: "다음 token 하나를 내고 이미 확정된 prefix의 K/V를 재사용합니다.", boundary: "한 forward의 병렬 output 위치 수는 작지만 cache와 streaming이 단순합니다." },
            { term: "Full-sequence diffusion", description: "응답 전체의 masked 위치를 함께 예측하고 여러 step에서 수정합니다.", boundary: "전체 상태가 바뀌어 ordinary causal KV cache와 고정 prefix 가정이 약합니다." },
            { term: "Block diffusion", description: "완료 block은 causal prefix로 확정하고 현재 block 내부에서만 diffusion refinement를 수행합니다.", boundary: "Block 밖의 미래 문맥을 이용한 전역 arbitrary-order 수정은 제한됩니다." },
            { term: "Semi-autoregressive sampling", description: "여러 token chunk를 순서대로 만들되 chunk 내부에는 masked generation을 쓰는 넓은 계열입니다.", boundary: "논문마다 block 정의·training objective·cache 범위가 다르므로 같은 이름만으로 speed를 비교하지 않습니다." },
          ]}
        />
        <div id="paper-block-diffusion" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Arriola et al. · Block Diffusion: Interpolating Between Autoregressive and Diffusion Language Models"
            citeKey={3}
            href="https://openreview.net/pdf?id=tyEyYT267x"
          >
            ICLR 2025 Block Diffusion은 block 사이 AR factorization과 block 내부 diffusion을
            결합해 arbitrary-length generation과 일부 KV caching을 지원합니다. 이는 full
            diffusion의 유일한 가속법도, 모든 block size에서 AR·diffusion보다 빠르다는
            보장도 아닙니다.
          </CitationBlock>
        </div>
        <ProgressiveDetail
          title="Dream처럼 AR checkpoint에서 시작한 Diffusion LLM은 같은 계열인가요?"
          preview="Mask-based discrete diffusion이라는 큰 계열은 같지만 initialization·noise rescheduling·training data가 달라 결과를 LLaDA나 MDLM에 그대로 귀속할 수 없습니다."
        >
          <p>
            Dream 7B는 AR-based initialization과 context-adaptive token-level noise
            rescheduling을 사용한다고 보고했습니다. 이는 from-scratch LLaDA나 MDLM의
            실험 recipe와 다릅니다. 2025년 preprint의 planning·coding·infilling 결과는
            해당 checkpoint와 evaluation으로 한정해 읽어야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="world-model-boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Diffusion LLM도 그 자체로 물리 세계의 transition model은 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Diffusion LLM은 arbitrary-order generation과 infilling처럼 language sequence를
            수정하는 새로운 policy를 제공합니다. 그러나 token sequence를 복원하는 능력과
            action 뒤의 physical state를 예측하는 능력은 다릅니다.
          </p>
          <p>
            World model로 가려면 visual state와 time, action을 함께 표현해야 합니다. 또한
            dynamics objective와 closed-loop evaluation이 추가돼야 합니다.
          </p>
          <p>
            Diffusion backbone을 VLM·VLA에 붙이는 연구도 등장했지만 아직 빠르게 변하는
            연구 단계입니다. “양방향으로 token을 고치니 계획을 잘한다”는 직관만으로 robot
            success를 결론낼 수 없습니다.
          </p>
          <p>
            같은 base model과 데이터, inference budget에서 AR와 diffusion policy를 비교해야
            합니다. 이때 trajectory success뿐 아니라 latency와 실패 복구도 함께 봅니다.
          </p>
          <p>
            다시 큰 지도에 놓으면 <Link to="/ai/modern-image-model-stack">image stack</Link>은
            spatial sample 생성, Diffusion LLM은 discrete sequence refinement, world model은
            action-conditioned temporal transition을 맡습니다. 세 축은 결합될 수 있지만
            이름이 비슷하다는 이유로 하나의 단선적 진화로 묶이지 않습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
