import { Link } from 'react-router-dom';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { CapabilityCheck, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { FeedbackContractViz, SignalCompositionViz, SignalDecisionLab } from './post-training-rlvr/viz/PostTrainingViz';

function RouteLink({ slug, label, description }: { slug: string; label: string; description: string }) {
  return (
    <Link to={articlePath('ai', slug)} className="group grid min-w-0 gap-1 border-b border-border py-4 transition-colors hover:bg-muted/20 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4 sm:px-2">
      <span className="text-sm font-black">{label}</span>
      <span className="text-sm leading-6 text-muted-foreground">{description}</span>
      <span className="hidden text-sm text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block">→</span>
    </Link>
  );
}

export default function PostTrainingRlvrArticle() {
  return (
    <>
      <section id="evidence-first" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">방법보다 먼저 “무엇이 부족한가”를 묻는다</h2>
        <QuestionLead
          question="새 의료 지식, JSON 형식, 도움되는 말투, unit test를 통과하는 코드는 모두 같은 post-training data로 학습하면 될까?"
          answer="아니다. 새 지식은 원문을 공급해야 하고, JSON은 정답 sequence를 보여 줄 수 있으며, 말투는 상대 선호로만 판단할 수 있고, code는 현재 policy의 새 시도를 실행 검증할 수 있다. 네 경우의 데이터 한 행과 loss, 데이터를 만드는 주체가 모두 다르다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Post-training은 하나의 알고리즘 이름이 아니다. Base model을 실제 assistant로 바꾸는 여러 <strong>feedback contract</strong>의 묶음이다.
            같은 model parameter를 업데이트해도 label 없는 text를 다시 읽는 것, ideal answer를 모방하는 것, 두 answer의 순서를 맞히는 것,
            직접 만든 rollout을 environment에서 채점하는 것은 서로 다른 문제를 푼다.
          </p>
          <p>
            따라서 첫 질문은 “SFT와 RL 중 무엇이 최신인가?”가 아니라 <strong>부족한 것이 지식인가 행동인가, 지금 만들 수 있는 정답은 text인가
            pair인가 executable result인가</strong>이다. 뒤에서 네 feedback contract를 먼저 복원한 다음, decision lab에서 같은 사례를 직접 판정한다.
          </p>
          <p>
            데이터 모양만으로 알고리즘을 정하지도 않는다. 같은 preference pair도 고정 data에서 policy를 직접 업데이트하는 DPO에 쓸 수 있고,
            별도 reward model을 학습한 뒤 현재 policy의 새 rollout을 채점하는 PPO식 RLHF에 쓸 수 있다. 따라서 row마다 label뿐 아니라
            <strong> 응답을 만든 collection policy, labeler 집단, 생성 설정과 수집 시점</strong>을 남겨야 뒤의 policy와 얼마나 멀어졌는지 판단할 수 있다.
          </p>
        </div>
      </section>

      <section id="knowledge-behavior" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">지식을 공급하는 일과 행동 확률을 바꾸는 일을 분리한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Model이 보지 못한 의료 지침을 answer preference만으로 알아내게 할 수는 없다. <strong>RAG</strong>는 문서를 inference context에 넣어
            가중치를 바꾸지 않고 최신 출처를 제공한다. <strong>Continued pre-training(CPT)</strong>은 label 없는 domain text로 다음-token objective를
            계속 학습해 domain의 어휘와 분포를 가중치에 적응시킨다. 출처·날짜·삭제 가능성이 중요하면 RAG가, 반복되는 domain language를 내부 표현에
            넓게 반영해야 하면 CPT가 후보가 된다.
          </p>
          <M display>{String.raw`\mathcal{L}_{\mathrm{CPT}}=-\sum_{t\in\underbrace{\mathcal{D}_{\mathrm{domain}}}_{\text{label 없는 domain token}}}\underbrace{\log p_{\theta}(z_t\mid z_{<t})}_{\text{실제 다음 token에 준 log 확률}}`}</M>
          <FormulaNote
            meaning="왜 모든 token을 맞히나: CPT에는 별도 ideal answer가 없고 domain corpus 자체가 학습 표본이기 때문이다. 이 objective는 문서의 언어 분포를 적응시키지만 특정 질문에 인용 가능한 최신 답을 보장하지 않는다."
            symbols={[
              ['D_domain', 'label 없이 모은 domain text token 집합'],
              ['z_t', 'domain 문서의 t번째 실제 token'],
              ['p_θ', '현재 model이 예측한 다음-token 분포'],
            ]}
          />
          <p>
            CPT loss가 내려가도 성공으로 끝내지 않는다. Domain corpus를 반복해 읽는 동안 일반 언어·코딩·안전 평가가 나빠지는
            <strong> forgetting</strong>이 생길 수 있다. 학습 전에 고정한 domain holdout과 general holdout을 함께 재고,
            domain만 좋아지고 general capability가 떨어지면 pre-training data replay, 더 작은 update, 조기 종료 또는 adapter처럼 영향 범위가 작은 방법을 검토한다.
            자주 바뀌는 사실이라면 weight에 더 넣기보다 RAG가 여전히 맞는지 다시 묻는다.
          </p>
          <Misconception>
            “새 정보를 넣는다”는 표현만으로 SFT와 CPT를 같은 방법으로 취급하면 안 된다. SFT example 안에 사실을 적을 수는 있지만,
            SFT의 직접 계약은 prompt에서 원하는 completion behavior를 재현하는 것이다. 출처가 바뀌는 사실 저장소를 대신하지 않는다.
          </Misconception>
        </div>
      </section>

      <section id="four-contracts" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">데이터 한 행이 달라지면 학습의 정답 단위도 달라진다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            SFT row는 <M>(x,y^*)</M>, preference row는 <M>(x,y_w,y_l)</M>, RLVR의 시작 row는 prompt <M>x</M>다.
            Preference response는 수집 당시 policy <M>{String.raw`q_{\mathrm{collect}}(y\mid x)`}</M>가 만들지만, RLVR completion은 현재 policy
            <M>{String.raw`\pi_\theta(y\mid x)`}</M>가 update마다 새로 만든다. 이 offline/online 차이가 탐색 가능성과 비용뿐 아니라
            <strong> 어느 분포에서 label과 verifier를 믿을 수 있는지</strong>까지 가른다.
          </p>
        </div>
        <FeedbackContractViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>SFT: 정답 completion을 직접 모방한다</h3>
          <M display>{String.raw`\mathcal{L}_{\mathrm{SFT}}=-\sum_{t=1}^{T}\underbrace{m_t}_{\text{completion token이면 1}}\underbrace{\log p_{\theta}(y_t\mid x,y_{<t})}_{\text{teacher token에 준 log 확률}}`}</M>
          <FormulaNote
            meaning="왜 mask를 곱하나: prompt와 system message는 답을 만들 조건이고, assistant completion이 직접 맞힐 target이기 때문이다. 구현에 따라 전체 sequence loss를 쓸 수도 있으므로 실제 data collator의 mask 계약을 확인해야 한다."
            symbols={[
              ['x', 'instruction과 system context'],
              ['y_t', 'ideal answer의 t번째 token'],
              ['m_t', '해당 위치가 학습 target인지 표시하는 mask'],
            ]}
          />

          <h3>Preference: 절대 점수 대신 chosen과 rejected의 순서를 맞힌다</h3>
          <M display>{String.raw`\begin{aligned}
\underbrace{\Delta_\theta(y\mid x)}_{\text{기준 대비 policy 변화}}
&=\log\frac{\pi_\theta(y\mid x)}{\pi_{\mathrm{ref}}(y\mid x)}\\
\underbrace{m_\theta(x,y_w,y_l)}_{\text{선호 답의 상대 증가량}}
&=\beta[\Delta_\theta(y_w\mid x)-\Delta_\theta(y_l\mid x)]\\
\underbrace{\mathcal L_{\mathrm{DPO}}}_{\text{선호 순서 loss}}
&=-\mathbb E_{\underbrace{(x,y_w,y_l)\sim\mathcal D}_{\text{고정 preference row}}}
\underbrace{\log\sigma(m_\theta)}_{\text{선호 순서를 맞힌 log 확률}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="왜 두 log-ratio를 빼나: chosen을 무조건 높이는 것이 아니라 reference policy와 비교했을 때 chosen이 rejected보다 더 많이 상승하도록 만들기 때문이다. 이 차이는 양수·음수 어느 값도 될 수 있으므로 sigmoid σ로 0과 1 사이의 'chosen이 이길 확률'로 바꾼다. 이어서 -log를 취하면 그 확률이 작을 때 손실이 크게 증가해 잘못 매긴 선호 순서를 더 강하게 고친다. 결국 DPO는 각 pair를 이진 분류하듯 최적화한다. DPO는 고정된 preference pair로 학습하므로 fine-tuning 중 새 rollout을 탐색하지 않는다."
            symbols={[
              ['y_w, y_l', '평가자가 고른 답과 거절한 답'],
              ['Δ_θ(y|x)', '응답 y의 log 확률이 reference 대비 얼마나 변했는지 나타낸 값'],
              ['m_θ', '선호 답의 reference 대비 증가량에서 비선호 답의 증가량을 뺀 margin'],
              ['σ', '실수 범위의 margin을 0과 1 사이의 pairwise preference 확률로 바꾸는 sigmoid'],
              ['π_θ', '업데이트하는 policy'],
              ['π_ref', '이동 기준이 되는 고정 reference policy'],
              ['β', 'preference strength와 reference 이동의 scale'],
            ]}
          />
          <h3>Preference pair에는 DPO와 reward-model PPO라는 두 갈래가 있다</h3>
          <p>
            <strong>DPO</strong>는 고정된 chosen/rejected pair에서 reference 대비 두 응답의 상대 log-probability를 바로 조정한다.
            학습 중 새 답을 만들고 사람에게 다시 묻지 않으므로 단순하지만, collection policy가 거의 만들지 않았던 현재 policy의 응답에는
            preference 근거가 약하다. <strong>Reward-model PPO형 RLHF</strong>는 같은 pair로 scalar reward model을 먼저 학습한 뒤,
            현재 actor가 만든 새 rollout을 reward model로 채점하고 PPO로 업데이트한다. 새 분포를 보지만 reward model이 수집 분포 밖에서
            그럴듯한 오점수를 낼 수 있고, actor가 그 빈틈을 반복 탐색할 수 있다.
          </p>
          <p>
            따라서 “preference data가 있다” 다음에는 두 질문이 필요하다. 고정 pair 범위 안의 작은 행동 교정이면 DPO가 기준선이고,
            현재 policy의 새 시도를 계속 평가해야 하면 reward model과 bounded online update가 후보다. 어느 쪽이든 labeler 기준이나 사용자 집단이 바뀌는
            <strong> preference drift</strong>를 막지는 못한다. 최신 policy output을 다시 pair로 뽑아 label agreement와 slice별 선택률을 감사하고,
            기준이 이동했다면 오래된 pair의 weight를 조정하거나 새로 수집해야 한다.
          </p>

          <h3>RLVR: 현재 policy가 만든 새 시도의 실행 결과를 되먹인다</h3>
          <M display>{String.raw`J_{\mathrm{RLVR}}(\theta)=\mathbb{E}_{\underbrace{x\sim\mathcal D}_{\text{학습 문제 분포}}}\mathbb{E}_{\underbrace{y\sim\pi_{\theta}(\cdot\mid x)}_{\text{현재 policy가 만든 rollout}}}\!\left[\underbrace{r_{\mathrm{verify}}(x,y)}_{\text{실행 가능한 성공 판정}}\right]`}</M>
          <FormulaNote
            meaning="왜 문제와 rollout을 따로 평균내나: 여러 문제에서 현재 policy의 새 전략을 시도하고 verifier를 통과한 trajectory의 확률을 높이기 위해서다. 그러나 이 식은 verifier 점수만 높인다. Checker가 잘못된 답을 통과시키면 policy는 그 빈틈을 강화하는 reward hacking을 할 수 있고, 정답 판정만으로 풀이의 충실성·안전성·설명 품질·다른 문제로의 일반화까지 검증하지는 못한다. Advantage, clipping과 divergence 제약은 update 폭을 제한할 뿐 잘못된 verifier 목표를 고치지 않는다."
            symbols={[
              ['x ~ D', '학습 문제 분포에서 뽑은 prompt 또는 task'],
              ['y ~ π_θ', '현재 policy에서 sample한 complete answer'],
              ['r_verify', '정답 checker, unit test, compiler 또는 proof verifier가 준 reward'],
              ['J_RLVR', '높이려는 expected verifier reward'],
            ]}
          />
          <h3>Verifier는 정답 함수가 아니라 공격받는 평가 프로그램이다</h3>
          <p>
            좋은 verifier는 같은 input, code version, seed와 resource limit에서 같은 판정을 내는 <strong>결정성</strong>부터 가진다.
            틀린 답을 통과시키는 false positive는 곧 policy가 최적화할 shortcut이 되고, 맞는 풀이를 막는 false negative는 유효한 탐색 경로를 지운다.
            작은 사람이 검산한 표본으로 두 오류율을 따로 재고, parser 오류와 실제 오답도 다른 code로 기록한다.
          </p>
          <p>
            우회 저항도 필요하다. 공개 예제와 training test만 맞히지 못하도록 hidden case를 분리하고, 수학식은 문자열 일치보다 symbolic equivalence와
            domain constraint를 검사하며, code는 격리된 sandbox에서 시간·memory·network 권한을 제한한다. Policy checkpoint가 바뀔 때 adversarial sample을
            다시 모아 verifier version을 올린다. 현재 policy가 이전에 없던 output 형식을 만들면 판정 분포도 바뀌므로,
            <strong> rollout policy와 verifier version을 한 receipt로 묶어야</strong> reward 상승의 원인을 재현할 수 있다.
          </p>
        </div>
        <div className="mt-8">
          <SignalDecisionLab />
        </div>
        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
          <h3>한 사례를 끝까지 판정한다: 일차방정식 tutor</h3>
          <p>
            목표를 “<M>ax+b=c</M>, <M>{String.raw`a\ne0`}</M>인 문제를 한국어로 설명하고 정확한 <M>x</M>를 낸다”로 고정하자.
            먼저 coefficient, 음수·분수, 양변 연산과 표현 template를 나누고 일부 family는 처음부터 held-out으로 잠근다.
            이미 base model이 기본 대수를 풀 수 있다면 새 수학 지식 부족이 아니므로 CPT부터 시작하지 않는다.
          </p>
          <ol>
            <li><strong>SFT:</strong> “양변에서 같은 수를 빼기 → 계수로 나누기 → 검산”이라는 출력 순서와 한국어 형식을 teacher completion으로 보여 준다.</li>
            <li><strong>Preference:</strong> 둘 다 정답이지만 더 짧고 이해하기 쉬운 설명을 고른다. 고정 pair만 충분하면 DPO, 현재 tutor가 새로 만드는 설명을 계속 상대 평가해야 하면 reward model과 PPO형 RLHF를 검토한다.</li>
            <li><strong>RLVR:</strong> 최종 <M>x=(c-b)/a</M>와 각 줄의 등가성을 symbolic checker로 검사한다. 문자열 모양은 달라도 같은 식이면 통과시키고, 0으로 나누거나 문제 조건을 바꾼 풀이는 거부한다.</li>
            <li><strong>Release:</strong> training verifier가 보지 않은 coefficient·template family에서 정답률, 형식, 설명 선호와 token 비용을 따로 잰다.</li>
          </ol>
          <p>
            이 사례에서도 RLVR 하나가 전부를 소유하지 않는다. Symbolic verifier는 대수적 등가성을 검사하지만 설명이 초보자에게 친절한지,
            중간 문장이 실제 model 계산을 충실히 드러내는지까지 알지 못한다. 그 부분은 preference evaluation과 별도 오류 분석이 맡는다.
          </p>
        </div>
      </section>

      <section id="compose-signals" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실제 제품은 하나를 고르는 대신 신호의 소유권을 나눈다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            의료 JSON assistant를 만든다고 하자. 의료 사실과 출처는 retrieval 또는 domain adaptation이 맡고, JSON schema와 tool protocol은 SFT가 맡는다.
            같은 사실을 더 공감 있게 표현하는 문제는 preference data가, 약물 용량 계산이나 schema validity처럼 program으로 확인 가능한 좁은 부분은 RLVR이 맡을 수 있다.
            이 순서는 보편 recipe가 아니라 <strong>각 신호가 답할 수 있는 질문을 분리한 설계 예</strong>다.
          </p>
        </div>
        <SignalCompositionViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 데이터를 `post_training.jsonl`로 합치면 provenance가 사라진다. 최소한 row schema, source, labeler 또는 verifier version,
            생성 policy, split, 적용 loss를 함께 보존해야 한다. 특히 verifier가 본 test와 held-out evaluation을 분리하지 않으면 training reward가
            capability처럼 보이는 leakage가 생긴다.
          </p>
          <h3>Held-out은 row가 아니라 문제 생성 원인을 분리한다</h3>
          <p>
            같은 template에 숫자만 바꾼 prompt를 train과 evaluation에 나누면 암기한 풀이 틀이 일반화처럼 보인다. 수학은 문제 family·generator seed·정리,
            code는 repository·과제 lineage, 대화는 사용자·시나리오 단위로 묶어 split한다. Training verifier의 공개 case와 별도로
            policy가 볼 수 없는 hidden verifier를 고정하고, 최종 release set은 data·prompt·checker 변경 뒤에도 다시 섞지 않는다.
          </p>
          <h3>Training reward가 멈추거나 오를 때 서로 다른 실패를 진단한다</h3>
          <ul>
            <li><strong>Reward가 0 근처에서 정체되고 rollout도 모두 비슷하다:</strong> 현재 policy가 성공 경로를 sample하지 못한 것이다. 더 긴 학습보다 curriculum, cold-start SFT와 탐색 다양성을 먼저 본다.</li>
            <li><strong>Training reward는 오르는데 held-out이 그대로이거나 하락한다:</strong> 공개 case 암기, verifier shortcut 또는 data leakage를 의심한다. RL step을 늘리기 전에 실패 output으로 checker를 보강한다.</li>
            <li><strong>Training·held-out이 모두 정체되는데 사람이 맞다고 판정한 답을 verifier가 거부한다:</strong> false negative와 parser coverage 문제다. Policy보다 verifier를 먼저 수정한다.</li>
            <li><strong>Reward는 높지만 entropy와 고유 풀이가 급감한다:</strong> 좁은 형식 한 개로 collapse했을 수 있다. 정답률과 별도로 diversity와 비용을 중단 gate에 넣는다.</li>
          </ul>
          <h3>방법마다 실패 소유자가 다르다</h3>
          <p>
            <strong>CPT forgetting</strong>은 domain/general holdout의 동시 변화로 찾고, <strong>preference drift</strong>는 최신 policy pair의
            label agreement와 사용자 slice로 찾는다. <strong>RLVR hacking</strong>은 training verifier를 통과했지만 hidden·adversarial case에서
            실패하는 output으로 찾는다. 세 실패를 “post-training 과적합” 하나로 뭉개면 CPT에는 data mixture를, preference에는 label recollection을,
            RLVR에는 checker 수정을 적용해야 한다는 차이를 놓친다.
          </p>
          <p>
            DeepSeek-R1-Zero는 SFT 없이 RL을 먼저 적용해 reasoning behavior가 나타날 수 있음을 보였다. 반면 공개된 DeepSeek-R1 multi-stage recipe는
            cold-start data와 여러 단계를 사용해 readability와 broader capability를 보완했다. 결론은 “항상 SFT부터”도 “SFT는 필요 없음”도 아니다.
            초기 policy, task, verifier, 출력 품질 요구가 순서를 결정한다.
          </p>
        </div>
      </section>

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">신호를 고른 뒤에만 알고리즘과 구현으로 내려간다</h2>
        <div className="not-prose border-t border-border">
          <RouteLink slug="reasoning-post-training-frontier" label="현재 실패" description="Sparse credit, entropy collapse, overthinking과 CoT monitorability를 서로 다른 병목으로 읽는다." />
          <RouteLink slug="rlhf" label="RLHF 실행 기준점" description="K-way ranking이 Bradley-Terry reward, offset normalization과 bounded PPO token update로 이어지는 계약을 복원한다." />
          <RouteLink slug="rl-ppo-continuous-control" label="Policy optimization" description="Probability ratio, advantage와 clipping이 한 update의 이동을 어떻게 제한하는지 계산한다." />
          <RouteLink slug="open-r1" label="Open-R1 구현" description="Prompt row에서 rollout, verifier, group advantage, update와 held-out evaluation까지 실제 code path로 닫는다." />
        </div>
        <CapabilityCheck
          items={[
            '새 지식 부족과 원하는 행동 부족을 구분한다.',
            'RAG와 CPT가 context와 weight 중 어디를 바꾸는지 설명한다.',
            'CPT, SFT, preference, RLVR dataset row를 각각 쓴다.',
            '같은 preference pair에서 DPO와 reward-model PPO가 갈라지는 실행 경로를 설명한다.',
            'Collection policy, current policy와 RLVR rollout 분포가 달라질 때 label과 verifier의 신뢰 범위를 다시 검사한다.',
            'Verifier의 결정성, false positive·negative, hidden case와 우회 저항을 release 계약으로 만든다.',
            'Training reward 정체·상승과 held-out·entropy 변화를 조합해 실패 owner를 고른다.',
            'CPT forgetting, preference drift와 RLVR hacking에 서로 다른 수정 방식을 적용한다.',
            '의료·JSON·말투·hidden-test coding 사례에 첫 신호를 고른다.',
            '일차방정식 tutor에서 SFT·preference·RLVR·held-out의 소유권을 처음부터 끝까지 나눈다.',
            '한 제품에서 여러 신호의 소유권을 겹치지 않게 조합한다.',
          ]}
        />
        <SourceNotes
          sources={[
            { label: 'Gururangan et al. · Don’t Stop Pretraining', href: 'https://aclanthology.org/2020.acl-main.740/', note: 'Label 없는 domain/task corpus로 continued pre-training을 수행하는 원 연구.' },
            { label: 'Ouyang et al. · InstructGPT', href: 'https://arxiv.org/abs/2203.02155', note: 'Demonstration SFT, human ranking reward model, PPO와 pre-training mix를 연결한 canonical pipeline.' },
            { label: 'Rafailov et al. · Direct Preference Optimization', href: 'https://arxiv.org/abs/2305.18290', note: 'Reward model fitting과 online RL 없이 fixed preference pair를 classification loss로 최적화하는 방법.' },
            { label: 'Gao et al. · Scaling Laws for Reward Model Overoptimization', href: 'https://arxiv.org/abs/2210.10760', note: 'Reward model을 더 강하게 최적화할 때 proxy reward와 gold reward가 갈라지는 현상을 측정한 1차 연구.' },
            { label: 'Shao et al. · DeepSeekMath', href: 'https://arxiv.org/abs/2402.03300', note: '수학 문제의 rule-based reward와 GRPO를 연결하고 공개 benchmark로 평가한 근거.' },
            { label: 'DeepSeek-AI · DeepSeek-R1', href: 'https://arxiv.org/abs/2501.12948', note: 'SFT 없는 R1-Zero와 cold-start를 포함한 multi-stage R1을 함께 공개한 reasoning RL 근거.' },
          ]}
        />
      </section>
    </>
  );
}
