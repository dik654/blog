import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { ReleaseGateViz } from './animation-production/viz/ProductionDecisionViz';

export default function AnimationVideoEvaluationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">평가는 좋은 sample을 고르는 일이 아니라 다음 결정을 만드는 일이다</h2>
        <BeginnerBridge title="평균 점수만 보면 한 번의 큰 실패가 사라진다">
          열 편의 영상 가운데 아홉 편이 아주 좋아도, 주인공의 얼굴이 한 편에서 다른 사람으로 바뀌면 그 결과를 그대로 출시하기는 어렵다. 먼저 영상 생성 평가는 <strong>좋아 보이는 결과를 고르는 일</strong>이 아니라, 반복해서 망가지는 장면과 출시를 막아야 할 실패를 찾는 일이라고 잡고 시작한다.
        </BeginnerBridge>
        <QuestionLead
          question="고정 prompt 10개와 seed 5개에서 평균 점수가 가장 높은 model을 출시하면 충분할까?"
          answer="아니다. 평균은 identity 붕괴 한 번, 사용 권리 미확인, 정해 둔 GPU memory budget의 OOM 같은 치명 실패를 숨길 수 있다. Reproducible closed set, 새로운 실패를 찾는 open set, frame-level trace와 hard release gate를 함께 써야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Closed set', meaning: 'Prompt, reference, seed와 runtime을 고정해 version끼리 비교하는 평가다.', why: '변경 전후의 regression을 반복해서 찾는다.' },
          { term: 'Open set', meaning: '새 content와 failure probe로 예상 밖 취약점을 찾는 평가다.', why: '고정 benchmark에 과적합된 개선을 잡는다.' },
          { term: 'Failure taxonomy', meaning: 'Semantic, identity/IP, line·shape, motion intent, camera, temporal defect, runtime·rights의 일곱 축으로 실패를 나누는 체계다.', why: '같은 이름을 rubric, hard gate와 report에서 재사용해 평균 점수를 다음 실험으로 번역한다.' },
          { term: 'Hard gate', meaning: '하나라도 실패하면 평균과 관계없이 release를 막는 조건이다.', why: '치명 risk가 높은 quality·rights·runtime 결함을 숨기지 않는다.' },
        ]} />
        <ReleaseGateViz />
      </section>

      <section id="rubric" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Animation 품질을 한 숫자로 먼저 접지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>평가 vector를 먼저 보존한다.</p>
          <ul>
            <li><strong>Semantic:</strong> character, action, scene과 prompt가 맞는가.</li>
            <li><strong>Identity/IP:</strong> 얼굴, 의상, prop과 palette가 시간축에서 유지되는가.</li>
            <li><strong>Line·shape:</strong> outline topology, flat color region과 silhouette가 흔들리지 않는가.</li>
            <li><strong>Motion intent:</strong> anticipation, spacing, smear, impact와 follow-through가 읽히는가.</li>
            <li><strong>Camera:</strong> 지시한 pan·track·zoom과 object motion이 분리되는가.</li>
            <li><strong>Temporal defect:</strong> flicker, melting, double edge, interpolation artifact와 audio desync가 있는가.</li>
            <li><strong>Runtime·rights:</strong> budget 안에서 재현되고 모든 source와 weight를 사용할 수 있는가.</li>
          </ul>
          <M display>{String.raw`\begin{gathered}
            \underbrace{\mathbf q(y)=[q_s,q_i,q_l,q_m,q_c,q_t]}_{\text{후보의 품질 벡터}}\\[4pt]
            \underbrace{S(y)=\sum_k w_kq_k(y)}_{\text{후보 정렬 점수}}\\[4pt]
            \underbrace{G_q(y)=\prod_{j\in\mathcal H_q}\mathbf 1[q_j(y)\ge\tau_j]}_{\text{필수 품질 통과}}\\[4pt]
            \underbrace{G_B(y)=\mathbf 1[c_{\mathrm{runtime}}(y)\le B]}_{\text{실행 예산 통과}}\\[4pt]
            \underbrace{G(y)=G_q(y)G_B(y)r_{\mathrm{rights}}(y)}_{\text{최종 hard gate}}
          \end{gathered}`}</M>
          <FormulaNote
            meaning="가중 점수는 후보를 정렬하는 데 쓸 수 있지만 hard gate를 대체하지 않는다. 각 지시함수는 조건을 통과하면 1, 실패하면 0을 내고, 이 값들을 곱해 논리 AND처럼 묶으므로 하나라도 0이면 최종 gate도 0이 된다. Weight와 threshold는 결과를 보기 전에 정하고 project version으로 고정한다."
            symbols={[
              [String.raw`\mathbf q(y)`, '결과 video y의 항목별 품질 vector'],
              [String.raw`q_s,q_i,q_l`, '의미 보존, character 정체성, 선과 shape 안정성'],
              [String.raw`q_m,q_c,q_t`, '동작 의도, camera 제어, 시간축 안정성'],
              [String.raw`w_k`, '프로젝트 목적에 따른 soft score의 상대 비중'],
              [String.raw`\mathcal H_q`, '품질 vector 중 release를 반드시 막아야 하는 항목 집합'],
              [String.raw`\tau_j`, 'j번째 hard gate의 최소 허용값'],
              [String.raw`c_{\text{runtime}},B`, '실제 실행 비용과 그 프로젝트의 최대 허용 예산'],
              [String.raw`r_{\text{rights}}`, '모든 source·weight·output 권리를 확인했으면 1인 이진 gate'],
            ]}
          />
          <p>
            사람에게 1~5점만 묻기보다 anchor를 준다. 예를 들어 identity 5는 key pose와 빠른 motion 모두 동일 character로 확실히 보이고, 3은 한 구간에서 흔들리지만 복구되며,
            1은 다른 character로 바뀌거나 얼굴이 사라지는 상태다. Reviewer disagreement도 저장해 애매한 기준을 찾는다.
          </p>
          <CitationBlock source="AnimationBench" citeKey={1} href="https://arxiv.org/abs/2604.15299">
            <p>AnimationBench는 Twelve Principles와 IP Preservation을 측정 축으로 만들고 semantic consistency, motion rationality, camera consistency를 더한다. Closed-set reproducibility와 open-set diagnostic evaluation을 분리한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="benchmark" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Prompt와 seed가 아니라 전체 run manifest를 고정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 seed라도 model revision, VAE, text encoder, frame 수, sampler, guidance, dtype, quantization(weight와 activation을 더 적은 bit로 표현하는 규칙), reference preprocessing와 postprocess가 다르면 paired comparison이 아니다.
            Evaluation unit은 prompt 한 줄이 아니라 run manifest다.
          </p>
          <pre><code>{`case_id: leap_locked_camera_v3
input:
  prompt_hash: sha256:...
  reference_hash: sha256:...
  seed: 1234
runtime:
  model_revision: ...
  vae_revision: ...
  frames: 193
  display_fps: 24
  sampler: ...
  steps: 28
  dtype: bf16
postprocess:
  native: true
  vfi: {enabled: false, revision: null}
evidence:
  raw_frames: artifacts/leap/native/
  metrics: artifacts/leap/metrics.json
  review: artifacts/leap/review.json`}</code></pre>
          <p><code>bf16</code>은 exponent 범위를 넓게 유지한 16-bit 부동소수점 dtype이다. Manifest에는 이름만 적지 않고 실제 runtime이 이 dtype을 어느 연산에 적용했는지도 가능한 범위에서 기록한다.</p>
          <p>
            Closed set은 최소한 정지 pose, 빠른 limb motion, fixed camera, camera pan, occlusion, small prop, speaking face와 limited-animation cadence를 분리한다.
            Version A와 B는 같은 case·seed pair에서 비교한다. Seed 평균과 함께 “B가 A보다 나은 pair의 비율”을 보고 sample cherry-picking을 줄인다.
          </p>
          <M display>{String.raw`\begin{aligned}
            d_{c,s}&=\underbrace{S(y^{B}_{c,s})-S(y^{A}_{c,s})}_{\text{같은 case·seed의 scalar 점수 변화}}\\
            p_{\text{win}}&=\underbrace{\frac{1}{|C||S|}\sum_{c\in C}\sum_{s\in S}\mathbf 1[d_{c,s}>\delta]}_{\text{의미 있는 개선 pair의 비율}}
          \end{aligned}`}</M>
          <FormulaNote
            meaning="Paired comparison은 seed 운을 줄인다. Delta는 metric noise보다 큰 최소 개선폭으로 정하며 평균 변화, win rate와 worst-case를 함께 본다."
            symbols={[
              [String.raw`c,s`, '고정 evaluation case와 seed'],
              [String.raw`y^A,y^B`, '변경 전후 system의 결과'],
              [String.raw`S(y)`, '앞 절에서 정의한 scalar 정렬 점수'],
              [String.raw`d_{c,s}`, '같은 조건에서 측정한 scalar 정렬 점수 차이'],
              [String.raw`\delta`, '우연한 흔들림이 아닌 의미 있는 최소 개선폭'],
            ]}
          />
        </div>
      </section>

      <section id="diagnostics" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Open set은 leaderboard가 놓친 failure를 찾는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Closed set을 통과한 뒤 새 character shape, unusual camera, fast occlusion, text prop, long hold, smear-to-impact와 audio interruption을 넣는다.
            Open set은 점수를 안정적으로 비교하기보다 “어떤 contract가 깨지는가”를 발견하는 단계다. 발견한 반복 failure는 다음 release의 closed regression case로 승격한다.
          </p>
          <p>자동 metric과 VLM judge는 triage에 쓰고 source artifact를 남긴다.</p>
          <ul>
            <li>Face/character embedding drift는 appearance 변화를 찾지만 의도된 expression까지 penalty할 수 있다.</li>
            <li>Optical-flow residual은 flicker 후보를 찾지만 smear와 camera cut을 잘못 센다.</li>
            <li>VLM judge는 prompt·motion을 설명할 수 있지만 prompt wording과 frame sampling에 민감하다.</li>
            <li>Human reviewer는 연출 의도를 판단하지만 fatigue와 기준 drift가 있어 blind pair·anchor·agreement가 필요하다.</li>
          </ul>
          <Misconception>Human 평가가 있으면 자동 metric이 필요 없거나, 자동 metric이 높으면 human review가 필요 없다는 양자택일은 틀리다. 두 증거가 서로 다른 failure를 찾는다.</Misconception>
        </div>
      </section>

      <section id="report" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최초 실패 stage와 다음 한 개입을 기록한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Failure report는 현상만 적지 않고 earliest owner까지 좁힌다.</p>
          <pre><code>{`case_id: leap_locked_camera_v3
variant: anime-lora-r48-step2400
seed: 1234
failure:
  observed_at: frame_097
  symptom: impact silhouette weakened
  earliest_stage: vfi_output
  native_frame: pass
  vfi_frame: fail
  encode_frame: fail
hard_gate: motion_intent
decision: reject
next_change:
  only: disable VFI around protected cadence markers
  keep_fixed: [model, adapter, prompt, seed, native_frames, codec]
evidence: [frame_096.png, frame_097.png, frame_098.png, cadence.json]`}</code></pre>
          <p>
            이 예에서는 training data나 rank를 바꾸지 않는다. Native impact는 통과했고 VFI 이후 처음 실패했기 때문이다. 다음 실험은 protected marker 주변 보간을 끄는 한 변화만 수행한다.
            반대로 native frame부터 identity가 무너지면 VFI를 고쳐도 해결되지 않는다.
          </p>
          <p>
            Release package에는 model·adapter·workflow revision, full manifest, closed/open results, raw evidence, known limitations, rights decision, rollback pointer와 reviewer를 넣는다.
            평균 score image 한 장은 release evidence가 아니다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Animation quality를 semantic·identity·line·motion·camera·time vector로 분리할 수 있다.',
          'Soft weighted score가 높아도 hard gate 하나로 release를 중단할 수 있다.',
          'Model revision부터 postprocess까지 같은 paired manifest로 version을 비교할 수 있다.',
          'Earliest failure stage를 찾아 다음 실험에서 하나의 intervention만 바꿀 수 있다.',
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Release 또는 reject 뒤에는 <InternalLink slug="animation-production-workflow">Production Contract</InternalLink>로 돌아가 acceptance version과 다음 한 개입을 갱신한다. 새 model 후보를 비교해도 이 계약과 evidence schema는 유지한다.
          </p>
        </div>
        <SourceNotes sources={[
          { label: 'AnimationBench paper', href: 'https://arxiv.org/abs/2604.15299', note: 'Animation-specific dimensions, closed-set reproducibility와 open-set diagnostics의 최신 근거.' },
          { label: 'AniMatrix paper', href: 'https://arxiv.org/abs/2605.03652', note: 'Professional animator evaluation의 production dimensions와 intentional deformation 경계.' },
          { label: 'LTX-2 official trainer', href: 'https://github.com/Lightricks/LTX-2/tree/main/packages/ltx-trainer', note: 'Validation prompt, checkpoint와 inference artifact를 실제 run manifest로 연결할 구현 사례.' },
        ]} />
      </section>
    </div>
  );
}
