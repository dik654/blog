import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { ActivationPatchingLab, AttributionGraphExplorer } from './llm-circuit-analysis/viz/CircuitExplorers';

export default function LlmCircuitAnalysisArticle() {
  return (
    <>
      <section id="causal-question" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">어떤 내부 신호가 답의 원인인지 어떻게 확인할까?</h2>
        <QuestionLead
          question="Layer 16에서 ‘Paris’가 강하게 읽혔다면, 그 activation이 최종 답을 만들었다고 어떻게 검증할까?"
          answer="정답이 나오는 clean run과 입력 일부를 바꿔 오답이 나오는 corrupted run을 만든다. Clean activation 일부를 corrupted run에 옮겨 target logit이 복원되는지 측정한다. Attribution은 실험할 후보를 줄이고, exact patching·ablation과 negative control이 causal claim을 닫는다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Circuit은 모델 안에 따로 저장된 상자 목록이 아니다. 특정 input family에서 특정 behavior를 만드는 데 필요한 component와 정보 경로를
            연구자가 정의한 단위로 복원한 설명이다. Prompt, output metric과 corruption이 바뀌면 찾는 circuit도 달라질 수 있다.
          </p>
          <p>
            먼저 <InternalLink slug="llm-interpretability-frontier">최신 해석의 증거 사다리</InternalLink>에서 readout과 intervention의 경계를
            고정한다. Candidate가 token direction이면 <InternalLink slug="llm-interpretability-readouts">layer readout</InternalLink>을,
            sparse feature이면 <InternalLink slug="sparse-autoencoder">SAE reconstruction</InternalLink>을 함께 기록한다. 이 글은 그 후보를
            원 모델의 behavior 변화로 검증하는 실행 단계다.
          </p>
        </div>
      </section>

      <section id="activation-patching" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Clean state를 옮겨 깨진 행동을 복구하기</h2>
        <ActivationPatchingLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Clean prompt는 원하는 답을 내고 corrupted prompt는 비교할 정보 하나를 바꿔 오답을 낸다. 두 run의 차이가 너무 크면 patch effect가 무엇을
            의미하는지 모호해진다. 반대로 corruption이 behavior를 바꾸지 못하면 복원할 signal 자체가 없다.
          </p>
          <div data-formula-pair>
            <M display>{String.raw`\underbrace{\Delta m_{\mathrm{patch}}}_{\text{패치가 되살린 양}}=m_{\mathrm{patch}}-m_{\mathrm{corr}}`}</M>
            <M display>{String.raw`\underbrace{R_{\mathrm{patch}}}_{\text{복원 비율}}=\frac{\Delta m_{\mathrm{patch}}}{\underbrace{m_{\mathrm{clean}}-m_{\mathrm{corr}}}_{\text{원래 복원해야 할 전체 차이}}}`}</M>
            <FormulaNote
              meaning="왜 corrupted 값을 빼나: patch 전의 깨진 baseline에서 얼마나 회복했는지 보기 위해서다. 왜 clean–corrupted 차이로 나누나: prompt pair마다 원래 logit margin 차이가 달라도 0은 복원 없음, 1은 clean 수준 복원으로 비교하기 위해서다. 분모가 매우 작으면 이 비율은 불안정하므로 그런 pair는 제외한다."
              symbols={[["m_{\\mathrm{clean}}", 'clean run의 target logit difference 또는 behavior metric'], ["m_{\\mathrm{corr}}", 'corrupted run의 metric'], ["m_{\\mathrm{patch}}", '선택 activation을 clean 값으로 바꾼 뒤 metric'] ]}
            />
          </div>
          <p>
            Patch가 효과를 냈다면 해당 state가 정보를 운반한다는 강한 증거다. 그러나 activation을 다른 run에서 복사하면 원래 분포에 없던 조합이 생길
            수 있다. 반대로 ablation 효과가 없다고 비사용이 증명되는 것도 아니다. 중복 경로, backup head와 downstream self-repair가 손실을 메울 수 있다.
            Random layer patch, 같은 layer의 unrelated position, mean ablation, sign-flipped steering과 여러 corruption pair를 함께 본다.
          </p>
        </div>
      </section>

      <section id="attribution-patching" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">수천 component를 모두 patch하지 않고 후보 줄이기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Exact activation patching은 후보마다 downstream forward pass가 필요하다. Attribution patching은 activation 변화와 output metric의 gradient를
            곱해 작은 개입의 효과를 1차 근사한다. 계산이 싸므로 head, neuron, feature와 edge를 넓게 훑는 triage에 적합하다.
          </p>
          <div data-formula-pair>
            <M display>{String.raw`\underbrace{\delta a_i}_{\text{실제로 옮길 변화}}=a_i^{\mathrm{clean}}-a_i^{\mathrm{corr}}`}</M>
            <M display>{String.raw`\underbrace{\Delta m_i}_{\text{metric 변화의 근사}}\approx\underbrace{(\nabla_{a_i}m)^{\!\top}}_{\text{민감도 방향}}\underbrace{\delta a_i}_{\text{patch 방향}}`}</M>
            <FormulaNote
              meaning="왜 gradient와 activation 차이를 내적하나: metric을 activation 주변에서 1차 Taylor 전개하면, 어느 방향으로 얼마나 움직이는지가 metric 변화에 주는 국소 효과가 된다. 비선형성이 크거나 patch 이동이 크면 근사가 깨지므로 상위 후보는 exact patching으로 다시 확인한다."
              symbols={[["a_i", 'component i의 activation'], ["\\delta a_i", 'clean과 corrupted activation의 차이'], ["m", 'target logit difference 같은 scalar metric'], ["\\nabla_{a_i}m", 'activation 각 방향에 대한 metric 민감도'], ["\\Delta m_i", 'patch effect의 1차 근사'] ]}
            />
          </div>
        </div>
        <Misconception>Attribution score가 크다는 사실은 exact intervention 결과가 아니다. Gradient saturation, LayerNorm, 큰 activation 이동과 feature interaction에서 순위가 달라질 수 있다.</Misconception>
      </section>

      <section id="replacement-graph" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Attribution graph는 원 모델의 완전한 회로도일까?</h2>
        <ConceptPrimer
          title="Graph를 보기 전에 분리할 다섯 객체"
          items={[
            { term: 'Replacement model · 대체 모델', meaning: '원 모델의 일부 dense 계산을 사람이 읽기 쉬운 sparse module로 바꾼 별도 모델이다.', why: '대체 모델에서 보인 경로와 원 모델의 실제 계산을 같은 것으로 취급하지 않는다.' },
            { term: 'Cross-layer transcoder', meaning: '한 layer의 activation에서 뒤 layer에 생길 update를 sparse feature 경로로 예측하는 대체 module이다.', why: 'Single-layer feature 목록보다 layer 사이 계산 후보를 만들 수 있다.' },
            { term: 'Error node · 설명 밖 경로', meaning: '대체 module이 복원하지 못한 원 모델 계산을 graph에 남기는 잔차 통로다.', why: 'Error mass가 크면 읽기 좋은 node만으로 complete circuit을 주장하지 않는다.' },
            { term: 'Omitted attribution mass', meaning: '표시 threshold 아래라 graph에서 숨겼지만 target metric attribution에는 남아 있는 edge의 합이다.', why: '간단한 그림을 만들면서 버린 계산량을 수치로 드러낸다.' },
            { term: 'Mechanistic faithfulness', meaning: '대체 모델이 같은 답뿐 아니라 원 모델과 같은 내부 algorithm을 사용한다는 강한 조건이다.', why: 'Output fidelity가 높다는 사실만으로 내부 mechanism 동일성을 결론 내리지 않는다.' },
          ]}
        />
        <AttributionGraphExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Circuit Tracing은 원 MLP 계산을 sparse cross-layer transcoder로 바꾼 <strong>replacement model</strong>에서 feature node와 edge attribution을
            구성한다. 사람이 읽기 쉬운 node를 얻는 대신, 원 모델의 계산을 완전히 보존하지 못한 부분은 error node와 fidelity 차이로 남는다.
          </p>
          <p>
            Graph threshold를 높이면 중요한 edge 몇 개만 보여 서사가 선명해진다. 동시에 약한 edge 여러 개의 합과 error path가 사라질 수 있다.
            따라서 graph와 함께 target metric 보존율, omitted attribution mass, error node, 원 모델 patch 결과를 보고해야 한다.
          </p>
          <p>
            2025년의 attention QK tracing은 feature interaction을 query-key score 계산까지 확장한다. 그래도 attention weight 하나를 explanation으로
            되돌리는 것이 아니라, 어떤 upstream feature가 Q와 K를 만들어 특정 position 간 연결을 강화했는지와 value path가 무엇을 운반했는지를 분리한다.
          </p>
        </div>
      </section>

      <section id="experiment-design" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 장면이 아니라 반복 가능한 patch experiment로 만들기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 prompt에서 restoration이 높았다는 결과는 screenshot이지 circuit evidence set이 아니다. 먼저 같은 질문 구조를 유지하면서 entity,
            relation과 surface form을 바꾼 <strong>prompt family</strong>를 만든다. 각 pair는 clean과 corrupted가 목표 정보 하나만 다르고, baseline
            output metric이 충분히 갈라져야 한다.
          </p>
          <p>
            예를 들어 “France의 수도”를 clean으로, “Italy의 수도”를 corrupted로 쓴다면 target metric은 단일 Paris logit보다
            <strong>Paris−Rome logit difference</strong>가 낫다. 두 후보의 상대 선호를 직접 측정해 전체 vocabulary logit offset에 덜 민감하기
            때문이다. Corruption이 답만 바꾸는 것이 아니라 문장 길이, token position과 문법까지 바꾸면 patch site를 같은 좌표로 비교하기 어려워진다.
          </p>
        </div>
        <div className="not-prose my-8 border-y border-border">
          {[
            ['01 · Pair gate', 'Clean은 target behavior, corrupted는 contrast behavior를 안정적으로 낸다. Token alignment와 바뀐 정보의 범위를 기록한다.'],
            ['02 · Broad triage', 'Readout·SAE·gradient attribution으로 layer×position×component 후보를 넓게 훑는다. 아직 causal hit로 세지 않는다.'],
            ['03 · Exact patch', '상위 후보마다 clean activation을 corrupted run에 옮기고 full downstream forward pass로 restoration을 다시 잰다.'],
            ['04 · Negative control', 'Random component, unrelated position, same-norm random direction, reversed patch와 shuffled pair에서 효과가 사라지는지 본다.'],
            ['05 · Held-out family', 'Candidate를 고르는 데 쓰지 않은 entity·paraphrase에서 같은 layer band와 effect direction이 재현되는 범위를 측정한다.'],
          ].map(([label, detail]) => (
            <div key={label} className="grid min-w-0 gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5">
              <strong className="text-sm">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            결과 row에는 적어도 <code>pair_id</code>, clean/corrupted prompt hash, target metric, hook site, layer, position, attribution score,
            exact restoration, control type와 model revision을 남긴다. 그래야 threshold를 바꾸거나 새 checkpoint를 비교해도 “같은 experiment를
            다시 실행했다”고 말할 수 있다.
          </p>
          <p>
            두 실패는 같은 값으로 진단하지 않는다. Attribution score는 높은데 omitted mass나 error node가 크고 replacement fidelity가 낮다면
            먼저 대체 모델의 설명 손실을 의심한다. 반대로 graph fidelity가 충분하고 omitted mass도 작지만 exact restoration이 낮다면,
            gradient의 1차 근사가 큰 patch나 feature interaction의 비선형 효과를 잘못 순위화했는지 확인한다. 두 경우 모두 최종 판정은 원 모델의
            exact patch와 held-out prompt family에서 내린다.
          </p>
          <p>
            Component 하나를 patch했을 때 효과가 작아도 circuit이 없다는 뜻은 아니다. 여러 head가 같은 정보를 운반하거나 downstream
            self-repair가 깨진 state를 복구할 수 있다. 반대로 여러 component를 동시에 patch해 큰 효과가 났다면 개별 component의 필요성을
            분리하지 못한다. Single-site, path patching, multi-site ablation을 서로 다른 claim으로 보고한다.
          </p>
        </div>
        <Misconception>
          Attribution top-k에서 exact patch가 잘 맞았다는 결과를 같은 데이터에서만 평가하면 selection bias가 생긴다. Candidate selection prompt와
          effect estimation prompt를 나누고, control family의 최대 효과와 비교해야 한다.
        </Misconception>
      </section>

      <section id="validation-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Circuit claim을 닫는 최소 검증 계약</h2>
        <div className="not-prose border-y border-border">
          {[
            ['Behavior', 'Clean/corrupted pair와 target metric이 분석 질문을 실제로 분리한다.'],
            ['Localization', 'Readout·SAE·attribution으로 후보 component와 edge를 좁힌다.'],
            ['Intervention', 'Exact patching, ablation 또는 steering이 예측한 방향의 변화를 만든다.'],
            ['Controls', 'Random component, unrelated position, reversed direction과 matched prompt에서 같은 효과가 나타나지 않는다.'],
            ['Generalization', 'Paraphrase와 held-out entity에서도 경로와 효과가 유지되는 범위를 표시한다.'],
          ].map(([label, detail], index) => <div key={label} className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[3rem_8rem_minmax(0,1fr)]"><code className="text-xs font-black text-muted-foreground">0{index + 1}</code><strong className="text-sm">{label}</strong><p className="text-sm leading-relaxed text-muted-foreground">{detail}</p></div>)}
        </div>
        <CapabilityCheck items={['Clean/corrupted/patch run을 정의하고 restoration metric을 계산한다.', 'Attribution patching을 exact causal test가 아니라 후보 탐색 근사로 쓴다.', 'Replacement fidelity, error node와 omitted mass를 graph 해석에 포함한다.', 'Selection prompt와 held-out prompt를 분리해 일반화 범위를 측정한다.', '한 prompt circuit과 일반 mechanism claim의 범위를 구분한다.']} />
        <SourceNotes sources={[
          { label: 'Anthropic · Circuit Tracing Methods', href: 'https://transformer-circuits.pub/2025/attribution-graphs/methods.html', note: 'Replacement model, attribution graph와 constrained patching의 정의.' },
          { label: 'Anthropic · Tracing Attention QK Computation', href: 'https://transformer-circuits.pub/2025/attention-qk/index.html', note: 'Attention score를 feature interaction으로 추적하는 확장.' },
          { label: 'Anthropic · Improvements to Attribution Patching', href: 'https://transformer-circuits.pub/2024/march-update/index.html', note: 'Exact activation patching과 gradient approximation의 비용·주의점.' },
        ]} />
      </section>
    </>
  );
}
