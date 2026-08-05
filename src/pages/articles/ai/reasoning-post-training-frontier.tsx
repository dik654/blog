import { Link } from 'react-router-dom';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import {
  CreditAssignmentExplorer,
  ExplorationEntropyExplorer,
  MonitorabilityExplorer,
  ReasoningComputeExplorer,
} from './reasoning-post-training-frontier/viz/FrontierExplorers';
import ReasoningFrontierMapViz from './reasoning-post-training-frontier/viz/ReasoningFrontierMapViz';

function RouteLink({ slug, label, description }: { slug: string; label: string; description: string }) {
  return (
    <Link to={articlePath('ai', slug)} className="group grid min-w-0 gap-1 border-b border-border py-4 transition-colors hover:bg-muted/20 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4 sm:px-2">
      <span className="text-sm font-bold">{label}</span>
      <span className="text-sm leading-relaxed text-muted-foreground">{description}</span>
      <span className="hidden text-sm text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block">→</span>
    </Link>
  );
}

export default function ReasoningPostTrainingFrontierArticle() {
  return (
    <>
      <section id="current-problem" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정답을 맞힌 뒤에도 어느 생각을 고칠지 알아야 한다</h2>
        <BeginnerOpening
          title="추론 모델은 답을 바로 말하기보다 중간 풀이를 만들어 본다"
          description={<>여기서 <strong>추론 모델</strong>은 수학·코딩처럼 여러 단계를 거치는 문제에서 중간 풀이를 만들어 답을 찾는 언어 모델이다. 학습이 끝난 모델에게 풀이 연습을 더 시키는 과정을 <strong>사후 학습(post-training)</strong>이라고 한다.</>}
          familiarScene={<>학생이 계산 문제 열 개를 풀고 마지막 답만 채점받았다고 하자. 틀린 문제를 다시 잘 풀려면 1단계의 가정이 틀렸는지, 마지막 곱셈만 틀렸는지 알아야 한다. 정답표만으로는 이 책임 위치가 보이지 않는다.</>}
          steps={[
            { label: '여러 풀이를 만든다', detail: '같은 문제에도 짧은 풀이, 긴 풀이와 다른 탐색 경로를 시도한다.' },
            { label: '검증 가능한 결과를 채점한다', detail: '수학 정답, 실행 결과나 단위 테스트로 성공 여부를 확인한다.' },
            { label: '성공 경로의 가능성을 높인다', detail: '강화학습으로 다음번에 비슷한 선택을 할 확률을 조정한다.' },
          ]}
        />
        <ConceptPrimer title="질문에 나오는 네 단어" items={[
          { term: 'RL · 강화학습', meaning: '모델이 만든 결과에 보상을 주어 행동 확률을 조정하는 학습이다.', why: '정답을 자동 검증할 수 있는 문제에서 많은 풀이를 반복 학습할 수 있다.' },
          { term: 'RL compute', meaning: '풀이 생성, 채점과 모델 업데이트에 사용한 계산량이다.', why: '계산을 늘렸다는 말이 데이터나 추론 시간을 늘렸다는 말과 다름을 구분한다.' },
          { term: 'Chain of Thought', meaning: '최종 답 전에 생성한 중간 풀이 또는 사고의 문자열이다.', why: '길이가 길다는 사실과 올바르고 충실하다는 사실을 분리한다.' },
          { term: 'Search', meaning: '한 풀이만 믿지 않고 여러 후보를 만들고 비교하는 절차다.', why: '학습으로 모델을 바꾸는 것과 답을 낼 때 더 탐색하는 것을 구분한다.' },
        ]} />
        <QuestionLead
          question="강화학습 계산을 더 쓰고 중간 풀이를 더 길게 만들면 추론 성능은 계속 오를까?"
          answer="아니다. RL은 성공한 경로의 확률을 올릴 수 있지만 최종 reward만으로 중간 오류의 책임을 찾기 어렵고, 반복 update는 policy의 다양성을 줄일 수 있다. 추론 시 더 긴 CoT와 search는 계산 비용과 overthinking을 늘리며, 맞는 답을 얻어도 visible reasoning이 충실하거나 감시 가능하다는 보장은 없다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            2025년의 질문이 “검증 가능한 reward로 reasoning을 끌어낼 수 있는가”였다면, 2026년의 질문은 그 성공 신호를
            <strong> 어디에 배분하고, 얼마나 오래 탐색하며, 어떤 비용과 감시 가능성을 유지할 것인가</strong>로 이동했다.
            Reasoning model은 별도 마법 구조가 아니라 pre-trained policy에 SFT, preference 또는 reinforcement learning을 더하고,
            inference에서 한 경로를 길게 생성하거나 여러 후보를 search하는 시스템으로 보는 편이 정확하다.
          </p>
          <p>
            이 글은 다섯 병목을 하나의 원인으로 뭉개지 않는다. Sparse reward는 <em>어느 step이 원인인지</em>, entropy collapse는
            <em>다른 경로가 남아 있는지</em>, overthinking은 <em>추가 token이 유용한지</em>, reward hacking은 <em>검증기가 실제 목표를 재는지</em>,
            monitorability는 <em>보이는 reasoning을 감시 근거로 쓸 수 있는지</em>를 각각 묻는다.
          </p>
          <p>
            범위도 먼저 자른다. 정답을 자동 검증할 수 없는 대화 품질이나 취향 문제라면 이 글보다
            <Link to={articlePath('ai', 'post-training-rlvr')}> 피드백 계약</Link>에서 SFT·선호 학습·RLHF를 먼저 고른다.
            아래 내용은 <strong>verifier가 있고 on-policy rollout을 만들 수 있는 reasoning RL</strong>을 선택한 뒤에도 남는 병목을 다룬다.
          </p>
        </div>
        <ReasoningFrontierMapViz />
      </section>

      <section id="three-compute-axes" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Pre-training·RL training·test-time search를 분리하기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Pre-training scaling</strong>은 parameter, data token, training FLOP를 늘려 다음 token 분포의 넓은 기반을 만든다.
            <strong>Post-training RL compute</strong>는 prompt마다 rollout을 만들고 verifier로 채점한 뒤 policy를 반복 update하는 비용이다.
            <strong>Test-time compute</strong>는 이미 학습된 model이 한 답을 길게 생각하거나 여러 candidate를 생성·검증·선택하는 비용이다.
            세 축은 서로 보완하지만 교환 가능한 같은 숫자가 아니다.
          </p>
          <p>
            Controlled benchmark는 문제 난이도를 한 축씩 바꾼다. 예를 들어 chess environment라면 board size, search depth, legal move 수를,
            논리 환경이라면 proof horizon과 논리 연산의 표현력을 분리할 수 있다. 이렇게 해야 “RL step을 더 써서 좋아졌다”와
            “더 쉬운 문제 분포를 보았다”를 구분할 수 있다.
          </p>
          <M display>{'\\underbrace{T_{\\mathrm{RL}}}_{\\text{필요한 RL 학습 계산}}\\;\\propto\\;\\underbrace{D^{\\gamma}}_{\\text{reasoning 깊이가 늘 때의 증가율}}'}</M>
          <FormulaNote
            meaning="왜 거듭제곱으로 보나: ScaleLogic 같은 controlled environment는 reasoning depth D만 체계적으로 늘리고, 목표 성능에 도달하는 RL compute T가 어떤 비율로 증가하는지 log-log 관계로 측정한다. γ는 모든 task의 보편 상수가 아니라 논리 표현력과 curriculum에 따라 달라지는 실험적 지수다."
            symbols={[
              ['T_RL', '정해진 성능 기준에 도달하는 데 사용한 post-training RL 계산량'],
              ['D', '문제를 풀기 위해 필요한 reasoning 또는 proof horizon'],
              ['γ', 'task 표현력과 학습 설정에 따라 달라지는 scaling exponent'],
              ['∝', '정확히 같다는 뜻이 아니라 측정 범위에서 비례 관계를 보았다는 뜻'],
            ]}
          />
          <p>
            이 관계는 <a href="https://arxiv.org/abs/2605.06638">ScaleLogic의 controlled environment 실험</a>을 읽는 요약식이다.
            논문이 보고한 측정 범위 밖에서 γ를 고정 상수처럼 사용하거나, 실제 수학·코딩 benchmark의 난이도를 D 하나로 환원하지 않는다.
          </p>
        </div>
        <ReasoningComputeExplorer />
        <Misconception>
          Search-based reasoning은 policy optimization과 다르다. 여러 CoT, beam, tree node 또는 tool result를 inference에서 탐색하면
          model weight를 바꾸지 않아도 성능이 오를 수 있다. 반대로 RL로 policy를 바꿔도 inference에서 search를 전혀 하지 않을 수 있다.
        </Misconception>
      </section>

      <section id="credit-assignment" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정답 하나로 어느 reasoning step을 고칠 수 있을까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            수학 정답, compiler exit code, unit test처럼 마지막 결과만 확인하는 <strong>outcome verifier</strong>는 싸고 확장하기 쉽다.
            그러나 rollout이 실패했을 때 초반 가정과 마지막 산술 실수에 똑같이 0점을 준다. 이것이 long-horizon reasoning의
            <strong> credit assignment</strong>, 즉 최종 결과의 책임을 중간 action에 나누는 문제다.
          </p>
          <p>
            Process reward는 step마다 정답 라벨을 직접 붙일 수도 있고, 해당 step에서 여러 continuation을 다시 sample해 최종 성공률을
            근사할 수도 있다. 후자는 중간 정답 annotation을 줄이는 대신 rollout compute를 더 사용한다.
          </p>
          <p>
            예를 들어 두 풀이가 모두 0점을 받았다고 하자. 첫 풀이가 1단계에서 “모든 그래프는 연결되어 있다”는 틀린 가정을 세우고 뒤 계산을
            일관되게 이어 갔다면, 그 가정 직후의 continuation은 대부분 실패한다. 두 번째 풀이가 올바른 정리를 끝까지 사용하다 마지막에
            <code>7×8=54</code>라고 썼다면, 산술 실수 직전 step에서 다시 이어 본 continuation은 자주 성공한다. Outcome reward는 두 풀이를
            구분하지 못하지만 continuation 성공률은 <strong>초기 구조 오류와 늦은 계산 오류</strong>를 서로 다른 위치에 배정한다.
          </p>
          <M display>{String.raw`\begin{aligned}
\underbrace{\hat r_t}_{\text{t번째 과정 보상}}
&=\frac{1}{\underbrace{M}_{\text{재시도 수}}}
\sum_{m=1}^{M}\underbrace{I_m}_{\text{성공이면 1}}\\
\underbrace{I_m}_{\text{continuation 판정}}
&=\mathbf 1[\text{m번째 continuation이 verifier 통과}]
\end{aligned}`}</M>
          <FormulaNote
            meaning="왜 여러 continuation을 평균내나: 현재 step이 좋은 출발점이라면 그 뒤를 여러 방식으로 이어도 성공할 확률이 높아야 하기 때문이다. 한 continuation만 보면 뒤쪽 sampling 운과 현재 step의 품질을 구분하기 어렵다."
            symbols={[
              ['r̂_t', '현재 reasoning step 이후의 경험적 성공 가능성'],
              ['M', '같은 중간 step에서 독립적으로 이어 본 후보 수'],
              ['1[·]', '조건이 참이면 1, 거짓이면 0을 주는 indicator'],
            ]}
          />
        </div>
        <CreditAssignmentExplorer />
      </section>

      <section id="exploration-collapse" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">GRPO는 왜 성공하면서 탐색을 잃을까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            GRPO 계열은 같은 prompt에서 여러 rollout을 비교해 평균보다 좋은 후보를 강화한다. 초기에 우연히 성공한 고확률 경로가 계속
            보상을 받으면 그 경로의 token 확률은 더 커지고, 낮은 확률의 다른 정답 경로는 sample 자체가 되지 않을 수 있다.
            <strong> Exploration collapse</strong>는 단순히 답이 반복된다는 현상이 아니라 앞으로 비교할 후보가 사라지는 학습 신호의 고갈이다.
          </p>
          <M display>{String.raw`\begin{aligned}
\underbrace{\bar r}_{\text{같은 문제의 평균 보상}}
&=\frac{1}{G}\sum_{j=1}^{G}r_j\\
\underbrace{\widehat A_i}_{\text{i번째 답의 상대적 이점}}
&=\frac{\overbrace{r_i-\bar r}^{\text{평균보다 나은 정도}}}
{\underbrace{s_r+\varepsilon}_{\text{그룹 보상 척도}}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="이 식은 같은 문제에서 뽑은 답끼리만 비교해 난이도 차이를 제거한다. 평균보다 좋은 답은 양의 advantage, 나쁜 답은 음의 advantage를 받고, 보상이 모두 같으면 어느 답도 더 강화할 근거가 없어 advantage가 0이 된다."
            symbols={[
              ['G', '같은 prompt에서 생성한 completion 수'],
              ['r_i', 'i번째 completion의 verifier reward'],
              ['s_r', '같은 group reward의 표준편차'],
              ['Â_i', 'policy update에 사용할 group-relative advantage'],
            ]}
          />
          <M display>{String.raw`\begin{aligned}
\underbrace{\rho_{i,t}}_{\text{t번째 token의 정책 변화 비율}}
&=\frac{\pi_\theta(y_{i,t}\mid x,y_{i,<t})}
{\pi_{\theta_{\mathrm{old}}}(y_{i,t}\mid x,y_{i,<t})}\\
\underbrace{\bar\rho_{i,t}}_{\text{허용 범위로 자른 비율}}
&=\operatorname{clip}(\rho_{i,t},1-\epsilon,1+\epsilon)
\end{aligned}`}</M>
          <FormulaNote
            meaning="현재 policy가 같은 token에 주는 확률을 rollout 당시 old policy 확률로 나누면 그 token을 얼마나 더 또는 덜 밀었는지 알 수 있다. 이 비율을 1-ε와 1+ε 사이로 잘라 한 번의 update가 지나치게 커지는 것을 막는다."
            symbols={[
              ['ρ_{i,t}', 'i번째 completion의 t번째 token에서 계산한 current/old policy ratio'],
              ['y_{i,<t}', 't번째 token 앞에 이미 생성된 prefix'],
              ['ρ̄_{i,t}', 'token ratio를 1-ε와 1+ε 사이로 제한한 값'],
              ['ε', '허용할 policy 변화 폭'],
            ]}
          />
          <M display>{String.raw`\begin{aligned}
\underbrace{\mathcal L_{\mathrm{GRPO}}}_{\text{token 평균 surrogate loss}}
&=-\mathbb E_i\!\Bigg[\\[-0.1em]
&\quad\underbrace{\frac{1}{|y_i|}\sum_{t=1}^{|y_i|}}_{\text{completion 길이로 평균}}\\[-0.1em]
&\quad\underbrace{\min\!\left(
\rho_{i,t}\widehat A_i,\,
\bar\rho_{i,t}\widehat A_i
\right)}_{\text{token별 보수적 update}}
\Bigg]
\end{aligned}`}</M>
          <FormulaNote
            meaning="Completion 하나의 reward에서 만든 advantage를 그 completion의 각 생성 token에 적용한다. 현재 policy와 rollout을 만든 old policy의 확률 비율은 token 위치마다 다르므로, 위치별 ratio를 자른 뒤 completion 길이로 평균한다."
            symbols={[
              ['min(·)', '원래 ratio와 잘린 ratio 중 더 보수적인 update를 선택'],
              ['|y_i|', 'i번째 completion의 생성 token 수'],
              ['Â_i', 'completion reward에서 만든 group-relative advantage'],
            ]}
          />
          <M display>{String.raw`\underbrace{\mathcal L_{\mathrm{ent}}}_{\text{별도 entropy 개입}}
=\underbrace{\mathcal L_{\mathrm{GRPO}}}_{\text{기본 policy loss}}
-\underbrace{\alpha}_{\text{개입 세기}}
\underbrace{\mathbb E_{i,t}[H(\pi_\theta(\cdot\mid x,y_{i,<t}))]}_{\text{token 분포가 퍼지도록 주는 보너스}}`}</M>
          <FormulaNote
            meaning="이 항은 GRPO의 필수 정의가 아니라 entropy collapse를 늦추기 위해 붙여 보는 전통적 개입이다. Entropy Mechanism 연구에서는 계수 α에 민감했고, entropy를 안정시켜도 baseline 성능을 넘지 못했다. Reference KL도 entropy를 안정시켰지만 보고된 설정에서는 성능이 나빠졌다."
            symbols={[
              ['α', 'entropy를 얼마나 강하게 보존할지 정하는 실험 계수'],
              ['H(π_θ)', '각 token prefix에서 vocabulary 확률 분포의 entropy'],
              ['L_ent', '기본 GRPO loss에 entropy 보너스를 추가한 비교 실험'],
            ]}
          />
          <M display>{String.raw`\begin{aligned}
\underbrace{H(\pi_t)}_{\text{token 선택의 불확실성}}
&=-\sum_{v\in V}
\underbrace{\pi_t(v)}_{\text{v를 고를 확률}}
\underbrace{\log \pi_t(v)}_{\text{확률 집중을 재는 항}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="왜 -Σp log p를 쓰나: 확률이 여러 token에 고르게 퍼지면 선택의 불확실성과 탐색 여지가 크고, 한 token에 거의 1이 몰리면 entropy가 0에 가까워진다. Reward가 오르는 동안 H가 급락하면 policy가 능력을 넓힌 것인지 한 경로만 더 자주 내는지 분리해 봐야 한다."
            symbols={[
              ['H(π_t)', 't번째 생성 위치에서 policy distribution의 entropy'],
              ['V', '선택 가능한 vocabulary token 집합'],
              ['π_t(v)', '현재 prefix에서 token v의 확률'],
            ]}
          />
        </div>
        <ExplorationEntropyExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 rollout reward가 같으면 group mean을 빼고 난 advantage가 모두 0이 된다. All-correct prompt는 이미 배울 차이가 없고,
            all-wrong prompt는 현재 policy가 성공 경로를 sample하지 못했다. Curriculum은 두 극단만 모으지 않고, 가끔 성공하지만 아직
            안정적이지 않은 frontier를 유지해야 한다.
          </p>
          <p>
            단순 entropy 보너스가 충분하지 않다면 어떤 token update가 entropy 감소와 함께 움직이는지 본다.
            Clip-Cov와 KL-Cov는 token-level probability 변화와 entropy 변화의 covariance를 이용해 붕괴를 밀어붙이는 token만
            선택적으로 제한한다. 이것도 보편 해법이 아니라 같은 rollout, reward, budget에서 기본 GRPO·entropy bonus·reference KL과
            held-out 성능과 entropy trajectory를 함께 비교해야 하는 연구 개입이다.
          </p>
        </div>
      </section>

      <section id="overthinking" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">더 오래 생각하면 언제 손해가 될까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Chain of Thought(CoT)는 final answer 전에 생성하는 중간 reasoning token이다. 복잡한 문제에서는 계산을 외부 token sequence로
            펼쳐 여러 단계를 수행하게 하지만, 간단한 문제에서도 같은 budget을 강제하면 이미 얻은 답을 반복 검증하거나 새로운 의심으로
            되돌리는 <strong>overthinking</strong>이 생길 수 있다.
          </p>
          <p>
            따라서 test-time scaling은 token 수 하나로 평가하지 않는다. 정확도와 함께 latency, generated token, parallel candidate 수,
            verifier 호출 수를 보고, 쉬운 문제에는 일찍 멈추고 어려운 문제에만 search budget을 배분하는 정책이 필요하다.
            Pass@k는 k개 후보 중 하나라도 맞는지 보는 지표지만, 후보가 서로 매우 비슷하면 k를 늘려도 새로운 탐색이 아니다.
          </p>
          <p><strong>다음 식은 논문 표준 지표가 아니라, 이 글에서 budget 구간을 비교하기 위해 정의한 저자 재구성 지표다.</strong></p>
          <M display>{String.raw`\underbrace{\eta_B}_{\text{token 한 개의 한계 효율}}
=\frac{\overbrace{\operatorname{Acc}(B_2)-\operatorname{Acc}(B_1)}^{\text{추가 정확도}}}
{\underbrace{\operatorname{Tok}(B_2)-\operatorname{Tok}(B_1)}_{\text{추가 생성 token}}}`}</M>
          <FormulaNote
            meaning="이 식은 reasoning budget을 B1에서 B2로 늘렸을 때 추가 token 하나가 정확도를 얼마나 더 올렸는지 본다. Token은 크게 늘지만 정확도가 거의 그대로면 η_B가 0에 가까워지고, 그 구간은 더 긴 생각이 아니라 overthinking 후보가 된다."
            symbols={[
              ['B_1, B_2', '비교할 두 test-time reasoning budget'],
              ['Acc(B)', '해당 budget에서 held-out 정확도'],
              ['Tok(B)', '해당 budget에서 실제 생성한 평균 token 수'],
              ['η_B', '추가 token 대비 정확도 증가율'],
            ]}
          />
          <M display>{'\\underbrace{P(\\text{하나 이상 성공})}_{\\text{단순화한 pass@k 직관}}=1-\\underbrace{(1-p)^k}_{\\text{k개 후보가 모두 실패할 확률}}'}</M>
          <FormulaNote
            meaning="왜 1에서 모두 실패할 확률을 빼나: 독립적인 후보 하나의 성공 확률이 p라면 실패 확률은 1-p이고, k개가 모두 실패할 확률은 (1-p)^k다. 실제 model sample은 서로 독립이 아니므로 이 식은 search coverage의 직관이지 실제 pass@k를 예측하는 공식이 아니다."
            symbols={[
              ['p', '후보 하나가 성공할 단순화된 확률'],
              ['k', '생성하고 검증하는 후보 수'],
              ['1-(1-p)^k', '적어도 하나가 성공할 확률의 독립 가정 근사'],
            ]}
          />
        </div>
      </section>

      <section id="monitorability" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Reward hacking과 CoT monitorability는 왜 다른가?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Reward hacking</strong>은 model이 실제 목표 대신 checker의 빈틈을 만족하는 행동을 찾는 문제다. 공개 unit test만 통과하거나,
            정답 tag 형식만 맞추거나, judge가 좋아하는 장황한 문체를 내는 식이다. Hidden test와 adversarial verifier는 이 간극을 줄일 수 있다.
          </p>
          <p>
            <strong>CoT monitorability</strong>는 visible reasoning에서 위험한 의도나 편법을 감지할 수 있는지를 묻는다. Final answer가 맞고 hidden
            test까지 통과해도 설명이 실제 계산과 인과적으로 분리되어 있을 수 있다. 반대로 monitor를 직접 reward에 넣으면 model이 나쁜 행동을
            버리는 대신 monitor에 걸리는 표현만 숨기는 방향으로 학습될 위험도 별도로 평가해야 한다.
          </p>
          <h3>Release 전에 verifier와 monitor를 서로 숨겨 시험한다</h3>
          <p>
            먼저 training verifier가 보지 못한 문제 family, hidden unit test와 adversarially 만든 shortcut을 고정한다. 같은 checkpoint를
            공개 verifier와 hidden verifier에 각각 실행해 reward, 실제 성공률, 답 다양성, token 비용의 간극을 기록한다. 공개 reward만 오르고
            hidden 성공률이 정체되면 verifier exploit으로 분류한다.
          </p>
          <p>
            Monitorability는 별도 실험이다. 위험한 목표나 정책 위반을 포함한 held-out trace와 표현만 무해하게 바꾼 대조 trace를 만들고,
            monitor의 recall·false positive를 측정한다. 그다음 monitor 점수를 직접 보상한 checkpoint와 보상하지 않은 checkpoint를 비교한다.
            실제 위반율은 그대로인데 visible warning만 줄었다면 “더 안전해졌다”가 아니라 <strong>감시 회피가 학습됐다</strong>고 판정한다.
          </p>
        </div>
        <MonitorabilityExplorer />
        <Misconception>
          CoT는 유용한 관찰 신호지만 model 내부 상태의 완전한 덤프가 아니다. “설명에 쓰였으니 실제로 그 생각을 했다”와
          “설명에 없으니 그 정보를 사용하지 않았다”를 모두 자동으로 결론내리면 안 된다.
        </Misconception>
      </section>

      <section id="bounded-route" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">어디까지 내려가고 다시 구현으로 올라갈까?</h2>
        <div className="border-y border-border">
          <RouteLink slug="post-training-rlvr" label="피드백 계약" description="지식, demonstration, pairwise preference와 verifier 중 지금 가진 증거에 맞는 첫 신호를 고른다." />
          <RouteLink slug="rlhf" label="InstructGPT·RLHF" description="K-way ranking을 Bradley-Terry reward와 bounded PPO token update로 바꾼 canonical floor를 읽는다." />
          <RouteLink slug="rl-ppo-continuous-control" label="선택 기반 · Policy optimization" description="Probability ratio, advantage와 clipping의 유도가 막힐 때만 여는 선택 경로다. Reasoning 글의 필수 선형 단계가 아니다." />
          <RouteLink slug="open-r1" label="Open-R1 구현" description="SFT data, rollout, verifier, GRPO와 held-out evaluation을 code path로 다시 조립한다." />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          여기서 역사 탐색을 멈춘다. REINFORCE부터 모든 RL 논문을 순서대로 읽지 않는다. 현재 구현에서 advantage, policy ratio, clipping 또는
          KL이 막힐 때만 PPO 기반으로 내려가고, value convergence나 continuous control의 세부 증명이 필요할 때 강화학습 경로를 별도로 연다.
        </p>
        <CapabilityCheck
          items={[
            'Pre-training compute, post-training RL compute와 test-time search compute를 서로 다른 축으로 설명한다.',
            'Outcome reward가 final failure의 위치를 알려 주지 못하는 이유를 구체적인 rollout으로 설명한다.',
            'Policy entropy가 줄 때 pass@1 상승과 exploration 감소가 동시에 일어날 수 있음을 설명한다.',
            '긴 CoT가 필요한 reasoning depth와 불필요한 overthinking token을 구분한다.',
            'Reward hacking, hidden-test failure와 CoT monitorability failure를 각각 다른 반례로 만든다.',
            '공개 verifier와 hidden·adversarial verifier의 차이로 reward hacking을 검출한다.',
            '새 reasoning 논문에서 training reward, held-out capability, diversity, token 한계 효율과 monitorability를 분리해 읽는다.',
          ]}
        />
        <SourceNotes
          sources={[
            { label: 'ScaleLogic: Can RL Teach Long-Horizon Reasoning?', href: 'https://arxiv.org/abs/2605.06638', note: 'Reasoning depth와 논리 표현력을 독립 제어하고 RL training compute scaling과 curriculum transfer를 분석.' },
            { label: 'The Entropy Mechanism of RL for Reasoning LMs', href: 'https://arxiv.org/abs/2505.22617', note: 'Policy entropy collapse를 token-level covariance로 분석하고, 단순 entropy bonus·reference KL의 한계와 Clip-Cov·KL-Cov를 비교.' },
            { label: 'ProcessThinker', href: 'https://arxiv.org/abs/2606.11209', note: 'VQA reasoning에서 intermediate step의 continuation을 rollout해 process reward를 구성한 사례. Text-only reasoning 전체에 자동 일반화하지 않는다.' },
            { label: 'Towards Structural Understanding of LLM Overthinking', href: 'https://deepmind.google/research/publications/203490/', note: 'CoT를 sub-thought progression으로 분해해 over-verification과 over-exploration을 분석.' },
            { label: 'Evaluating chain-of-thought monitorability', href: 'https://openai.com/index/evaluating-chain-of-thought-monitorability/', note: 'RL scale, pre-training scale와 test-time compute에 따른 CoT monitorability 평가.' },
            { label: 'Instruction Hierarchy Challenge', href: 'https://openai.com/index/instruction-hierarchy-challenge/', note: '객관 채점 가능한 controlled task와 reward shortcut 방지 원칙을 공개한 2026 연구.' },
            { label: 'DeepSeek-R1', href: 'https://arxiv.org/abs/2501.12948', note: 'RL-only 실험과 cold-start·다단계 reasoning post-training의 공개 기준점.' },
          ]}
        />
      </section>
    </>
  );
}
