import RLApproachViz from './viz/RLApproachViz';

export default function RLApproach() {
  return (
    <section id="rl-approach" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RL로 한국어 사고 강제하기</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Smoothie-Qwen은 lm_head의 token-level logit을 재가중치한다.<br />
          그 한 번의 변환으로 leakage의 95%가 사라진다. 하지만 나머지 5%는 어디서 오는가.<br />
          대부분은 긴 reasoning의 중간 — "think 모드에 들어간 뒤, 한국어 attractor보다 중국어 attractor가 강한 지점들"이다.
        </p>
        <p className="leading-7">
          이건 token 단위 보정으로 완전히 잡을 수 없다.<br />
          모델이 "사고 경로" 자체를 선택하는 차원의 문제이기 때문이다.<br />
          policy 전체를 다시 학습시켜야 한다 — 그래서 RL.
        </p>
        <p className="leading-7">
          2025년 "Making Qwen3 Think in Korean with Reinforcement Learning" 논문이 정확히 이 접근을 취한다.<br />
          보상 함수에 Korean Language Consistency 항목을 넣고, oracle judge LLM으로 출력을 채점하고, GRPO로 policy를 업데이트한다.<br />
          이 섹션은 그 설계를 학습 루프 차원에서 뜯어본다.
        </p>

        <div className="not-prose my-8"><RLApproachViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 token 수정으로는 부족한가</h3>
        <p className="leading-7">
          Smoothie는 token의 logit을 균일하게 깎는다. 그 효과는 수학적으로 명확하다 — 한자 토큰의 확률이 낮아진다.<br />
          하지만 reasoning은 token이 아니라 시퀀스의 분포 문제다.<br />
          "지금이 사고 모드인가", "사고의 흐름이 어떤 언어로 이어지고 있는가" 같은 판단은 hidden state가 학습한 attractor에서 나온다.
        </p>
        <p className="leading-7">
          attractor는 policy의 성질이다 — "이 문맥에서 다음 토큰은 이런 분포"라는 함수.<br />
          이 함수 자체가 중국어 쪽으로 기울어 있으면, 개별 토큰 logit을 아무리 깎아도 분포의 기하 구조는 바뀌지 않는다.<br />
          sampling 한 번마다 한자가 조금 덜 나올 뿐, 긴 시퀀스에서 "중국어 모드로 사고하는" 경향은 그대로다.
        </p>
        <p className="leading-7">
          policy 자체를 움직이는 유일한 방법은 학습이다.<br />
          supervised fine-tuning은 "정답 출력을 모방하라"로 강한 신호를 주지만, 정답 데이터셋을 직접 만드는 게 비싸다.<br />
          RL은 "어떤 출력이 좋은지 정의만 해주면 모델이 스스로 탐색한다" — reward function 설계가 데이터셋보다 싸다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">보상 함수 — 4개 항목의 가중 합</h3>
        <p className="leading-7">
          논문이 제안한 구성은 단순하다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          R = 1.0 · Accuracy + 0.2 · Format + 0.2 · Korean + 0.2 · Length
        </pre>
        <p className="leading-7">
          <strong>Accuracy (1.0)</strong> — 정답 정확도. 압도적 가중치. 이게 0이면 모델이 "한국어로 헛소리하는" 방향으로 망가진다.<br />
          <strong>Format (0.2)</strong> — <code>&lt;think&gt;...&lt;/think&gt;</code> 태그 준수. reasoning 포맷이 깨지면 downstream 파싱이 실패한다.<br />
          <strong>Korean consistency (0.2)</strong> — 출력이 한국어로 일관되면 높은 값. 이 섹션의 핵심.<br />
          <strong>Length (0.2)</strong> — 8192 토큰 초과 시 soft 페널티. position decay를 막기 위한 장치.
        </p>
        <p className="leading-7">
          Accuracy가 5배 크기인 건 의도적이다.<br />
          언어 일관성을 위해 정확성을 희생하면 모델이 망한다 — "한국어로 틀린 답"은 쓸모없다.<br />
          하지만 나머지 3개가 모두 0이면 정책이 그 방향으로 움직일 이유가 없다.<br />
          작은 양의 보상도 수천 스텝 누적되면 정책을 점진 이동시킨다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>왜 0.2 인가</strong> — 저자들이 실험으로 튜닝한 값이다.<br />
          0.1로 내리면 한국어 일관성 개선이 너무 느리고, 0.5로 올리면 Accuracy와 충돌해서 정답률이 떨어진다.<br />
          보상 가중치는 "exploration 신호의 방향"과 "exploitation 신호의 강도"의 타협점이다.<br />
          이 값은 모델과 데이터셋에 따라 다시 튜닝해야 할 가능성이 높다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Korean consistency를 어떻게 채점하는가</h3>
        <p className="leading-7">
          가장 단순한 구현은 regex다. "한글 유니코드 비율 ≥ 95%면 1, 아니면 0".<br />
          이게 즉각적으로 gaming에 취약하다는 걸 저자들이 발견한다.<br />
          모델이 점수를 올리기 위해 찾아낸 전략: 한자를 음차(transliteration)로 대체. "分析"을 "펀시"로 쓴다.<br />
          유니코드 규칙은 통과하지만 의미가 망가진다.
        </p>
        <p className="leading-7">
          그래서 oracle judge LLM을 쓴다.<br />
          큰 모델(논문에서는 GPT-4급)을 judge로 써서 "이 응답이 한국어로 일관되게 사고했는가"를 평가한다.<br />
          0 / 0.5 / 1 삼단 채점 — 완전 일관 / 혼합 / 깨짐.
        </p>
        <p className="leading-7">
          judge prompt의 핵심은 의미 보존 요구다.<br />
          "한글 비율"이 아니라 "한국어로 자연스럽게 표현됐는가", "한자어를 한국어 표기로 쓰되 의미가 보존되는가"를 묻는다.<br />
          이 질문에는 regex가 답할 수 없다 — 언어 이해가 필요하다.
        </p>
        <p className="leading-7">
          실제 설계는 규칙 기반과 LLM 기반의 혼합이다.<br />
          규칙 기반은 싸고 빠르게 명백한 실패를 걸러낸다. LLM judge는 미묘한 경우를 판정한다.<br />
          두 신호를 결합해서 gaming에 강한 reward를 만든다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GRPO 학습 루프</h3>
        <p className="leading-7">
          논문은 DeepSeek이 제안한 GRPO(Group Relative Policy Optimization)를 쓴다.<br />
          PPO의 critic network를 없애고, 그룹 평균을 baseline으로 쓰는 변형이다.
        </p>
        <p className="leading-7">
          한 스텝의 흐름:
        </p>
        <ol className="leading-7">
          <li>프롬프트 하나를 뽑는다 (한국어 reasoning 문제).</li>
          <li>현재 policy로 N개 응답을 샘플링한다 (기본 N=8).</li>
          <li>각 응답에 대해 R = Accuracy + 0.2·(Format + Korean + Length) 계산.</li>
          <li>그룹 내 보상 평균을 baseline으로 advantage <code>A_i = R_i − mean(R)</code>를 구한다.</li>
          <li>A &gt; 0 인 응답은 확률을 올리고, A &lt; 0 인 응답은 낮추는 방향으로 policy gradient 업데이트.</li>
        </ol>
        <p className="leading-7">
          GRPO의 이점은 critic 학습이 필요 없다는 것이다.<br />
          보통 PPO는 value function(critic)을 별도 학습하는데, RL with LLM에서 critic 학습이 가장 불안정한 지점이다.<br />
          그룹 평균을 baseline으로 쓰면 variance 감축은 critic만큼 강하지 않지만, 구현이 간단하고 실패 지점이 적다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">학습 비용 — RL은 공짜가 아니다</h3>
        <p className="leading-7">
          한 스텝의 연산량을 분해해 보자.<br />
          1 프롬프트 × 8 rollout × max 8192 토큰 = 약 65K 토큰 생성.<br />
          이 토큰들을 대해 reward 계산 (oracle judge 호출 포함).
        </p>
        <p className="leading-7">
          가장 무거운 부분은 generation이다.<br />
          8K 토큰 생성을 8번 하면 KV cache가 크고, policy 크기가 Qwen3-8B면 1 스텝이 분 단위.<br />
          여기에 oracle judge 호출이 rollout마다 들어간다.
        </p>
        <p className="leading-7">
          논문 보고에 따르면 Qwen3-8B, 약 1~2K 스텝, A100 8장 급 하드웨어에서 며칠 단위가 걸린다.<br />
          학습 자체 외에도 데이터셋 구축 비용이 크다 — 한국어 reasoning 문제 + 정답 + judge prompt 세트를 만들어야 한다.
        </p>
        <p className="leading-7">
          Smoothie-Qwen 변환이 GPU 한 장 몇 분이었다는 걸 생각하면, RL은 대략 100~1000배 비쌀 수 있다.<br />
          효과가 그만큼 더 좋아야 정당화된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">결과 — 일관성과 정확성이 함께 오른다</h3>
        <p className="leading-7">
          논문의 흥미로운 결과: Korean consistency를 보상에 넣었더니 정확도까지 올랐다.<br />
          KMMLU에서 baseline 대비 개선, 한자 leakage는 거의 0.<br />
          "일관성과 정확성의 trade"라는 직관과 반대다.
        </p>
        <p className="leading-7">
          왜 이렇게 되는가.<br />
          한국어로 사고하도록 강제하면 한국어 reasoning 데이터의 품질이 간접적으로 올라가는 효과가 있다.<br />
          모델이 중국어 모드로 사고할 때는 한국어 문맥 이해가 얕고, 한국어로 사고할 때는 한국어 문맥 이해가 깊어진다.<br />
          "한국어로 생각하기"는 언어 선택이 아니라 representation의 선택이다.
        </p>
        <p className="leading-7">
          특히 긴 think 블록에서의 안정성이 크게 개선된다.<br />
          Smoothie만 적용했을 때 60% 정도였던 "긴 사고의 언어 일관성"이 95%+로 올라간다.<br />
          이건 attractor 재정렬의 직접 효과다 — token-level 보정으로는 줄 수 없는 신호.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">언제 RL까지 가야 하는가</h3>
        <p className="leading-7">
          RL은 강력하지만 비싸다. 적용 기준을 현실적으로 정리해 보자.
        </p>
        <p className="leading-7">
          <strong>RL이 정당화되는 경우</strong>:
        </p>
        <ul className="leading-7">
          <li>Smoothie + 런타임 가드로 해결되지 않는 잔여 leakage가 분명히 존재</li>
          <li>모델이 긴 사고(8K+)를 자주 하는 워크로드 — reasoning-heavy 에이전트</li>
          <li>GPU 시간과 한국어 reasoning 데이터셋이 확보돼 있음</li>
          <li>한국어 품질이 제품의 핵심 차별점 — 2% 개선도 의미 있음</li>
        </ul>
        <p className="leading-7">
          <strong>RL이 오버킬인 경우</strong>:
        </p>
        <ul className="leading-7">
          <li>응답이 대체로 짧음 (1K 토큰 이내)</li>
          <li>Smoothie만으로 leakage가 허용 범위 안에 들어옴</li>
          <li>POC / 프로토타입 / 내부용 도구</li>
          <li>GPU 예산이 제한적이거나 데이터셋이 없음</li>
        </ul>
        <p className="leading-7">
          대부분의 에이전트는 후자에 해당한다.<br />
          그래서 이 글의 권장 순서는 명확하다 — 먼저 Smoothie로 갈아끼우고, 남는 문제만 런타임 가드로 막고, 그 후에도 남는 문제가 있으면 그때 RL을 검토한다.<br />
          다음 섹션에서 런타임 가드 패턴을 본다.
        </p>
      </div>
    </section>
  );
}
