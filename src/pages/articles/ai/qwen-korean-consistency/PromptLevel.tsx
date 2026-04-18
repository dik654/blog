import PromptLevelViz from './viz/PromptLevelViz';

export default function PromptLevel() {
  return (
    <section id="prompt-level" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프롬프트 가드레일의 한계</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          가장 먼저 시도하는 해법은 항상 프롬프트다.<br />
          시스템 프롬프트에 "한국어로만 답변하세요"를 넣고, 강조 표현을 추가하고, few-shot에 한국어 예시를 박는다.<br />
          비용이 0이고 즉시 적용되니 당연한 첫 수다.
        </p>
        <p className="leading-7">
          그런데 며칠 돌려보면 같은 결론에 도달한다 — <strong>프롬프트로는 부족하다</strong>.<br />
          이게 단순히 "더 강한 prompt를 짜면 된다"의 문제가 아니라는 걸 받아들이는 게 출발점이다.<br />
          이 섹션은 왜 부족한지를 5가지 실패 모드로 분해한다.
        </p>

        <div className="not-prose my-8"><PromptLevelViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 instruction은 약한 bias만 만드는가</h3>
        <p className="leading-7">
          시스템 프롬프트도 결국 입력 토큰 시퀀스의 일부다.<br />
          모델 입장에서 "한국어로만 답변하세요"는 hidden state h를 약간 회전시키는 정도의 영향만 갖는다.<br />
          lm_head 가중치 행렬 W는 그대로다 — 학습 시 강하게 정렬된 한자 토큰 row는 prompt 한 줄로 약화되지 않는다.
        </p>
        <p className="leading-7">
          수치로 표현하면 이렇다.<br />
          가드 없이 logit("分析") = 7.8, logit("분석") = 7.2 였다고 하자. 격차 0.6.<br />
          시스템 프롬프트를 강하게 넣어도 격차는 0.1~0.2 정도만 줄어든다. 부호는 안 뒤집힌다.<br />
          softmax는 작은 logit 차이도 큰 확률 차이로 증폭하므로, 0.1 격차도 한자가 70% 확률로 선택되는 결과로 이어진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 모드 ① — Reasoning bypass</h3>
        <p className="leading-7">
          가장 흔하고 가장 거슬리는 패턴이다.<br />
          최종 답변은 한국어로 깔끔하게 나오는데, <code>&lt;think&gt;</code> 블록 안이 통째로 중국어로 채워진다.<br />
          시스템 프롬프트를 "추론 과정도 한국어로"라고 명시해도 거의 효과가 없다.
        </p>
        <p className="leading-7">
          원인은 학습 분포에 있다.<br />
          Qwen3의 long-CoT 학습 데이터는 압도적으로 중국어와 영어다. "한국어로 길게 사고하는" 분포 자체가 학습된 적이 없다.<br />
          모델이 reasoning 모드에 진입하는 순간, 그 모드와 강하게 상관된 attractor — 즉 중국어 reasoning 토큰 패턴 — 가 prompt instruction을 압도한다.
        </p>
        <p className="leading-7">
          시스템 프롬프트는 컨텍스트 맨 앞에 있고, reasoning이 시작되는 시점에는 이미 멀리 떨어져 있다.<br />
          그 사이를 채우는 토큰들이 self-conditioning을 만들고, 그 self-conditioning이 한자 분포를 향해 단조롭게 흐른다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 모드 ② — Position decay</h3>
        <p className="leading-7">
          응답이 짧을 때는 prompt가 효과를 발휘한다.<br />
          하지만 응답 길이가 1000토큰을 넘기면 한자 비율이 monotonic하게 증가한다.<br />
          실측해 보면 거의 선형에 가까운 곡선이 그려진다.
        </p>
        <p className="leading-7">
          attention 거리가 길어질수록 시스템 프롬프트의 영향력은 약해지고, 최근에 생성된 토큰들의 self-prime이 강해진다.<br />
          한 번 한자 토큰이 등장하면 그 토큰이 다음 한자 토큰을 부른다 — self-reinforcement 루프.<br />
          이 루프는 prompt로 끊을 수 없다. 입력단 가드가 출력단 self-conditioning을 못 이긴다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>실측 사례</strong> — 동일 질문, 동일 시스템 프롬프트로 응답 길이만 다르게 했을 때:<br />
          200토큰: 한자 비율 8% / 600토큰: 22% / 1200토큰: 44%.<br />
          길이가 6배 늘어나면 한자 비율은 5배 증가한다. 이건 prompt 강도를 올린다고 막을 수 있는 패턴이 아니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 모드 ③ — Domain trigger</h3>
        <p className="leading-7">
          코드 블록이나 LaTeX 수식이 등장하는 순간 한자 비율이 급증한다.<br />
          학습 데이터에서 "코드 + 중국어 주석/설명" 패턴이 풍부했기 때문이다.<br />
          모델은 코드 직후의 자연어 위치에서 한자 토큰을 자연스러운 후보로 본다.
        </p>
        <p className="leading-7">
          이건 도메인 전환 시점에서 hidden state가 학습 분포의 mode로 끌려가는 현상이다.<br />
          prompt에 "코드 주변에서도 한국어로"를 넣어도 효과가 미미한 이유는 단순하다 — domain shift는 instruction보다 강하다.<br />
          모델은 "지금이 어떤 문맥인가"를 hidden state로 판단하는데, 그 판단을 prompt 한 줄로 뒤집기 어렵다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 모드 ④ — Few-shot 오염</h3>
        <p className="leading-7">
          가드를 강화하려고 few-shot 예시를 추가했는데 오히려 leakage가 증가하는 역설이 자주 일어난다.<br />
          원인은 한 가지다 — 예시에 한자가 한 글자라도 섞이면 그것이 허용 신호가 된다.
        </p>
        <p className="leading-7">
          in-context learning은 부정 신호("이건 하지 마")보다 긍정 신호("이렇게 해")에 압도적으로 강하다.<br />
          "A: 分析 결과 평균은..."이라는 예시를 한 번이라도 보여주면, 모델은 "한자어를 한자로 쓰는 것이 정답 형식이다"라고 학습한다.<br />
          예시를 직접 검수하지 않으면 가드용으로 넣은 few-shot이 leakage를 정당화하는 신호로 변한다.
        </p>
        <p className="leading-7">
          더 미묘한 케이스: 영어 단어가 섞인 예시도 같은 효과를 낸다.<br />
          "A: API 호출 결과를 ..." 같은 예시는 "한국어 + 외국어 혼용 OK" 신호로 해석되고, 그 외국어 자리에 한자가 자주 들어찬다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 모드 ⑤ — Instruction conflict</h3>
        <p className="leading-7">
          마지막 실패 모드는 다른 4개보다 본질적이다.<br />
          "가장 정확한 표현을 쓰되 반드시 한국어로"는 모델에게 두 목표를 동시에 요구한다.
        </p>
        <p className="leading-7">
          문제는 두 목표가 lm_head 구조에서 충돌한다는 것이다.<br />
          RLHF로 학습된 모델은 "가장 적합한 토큰"을 찾도록 강하게 정렬돼 있다.<br />
          그런데 lm_head 분포에서 "가장 적합한"의 우승자가 한자 후보인 경우가 많다.<br />
          정확성을 추구할수록 한자가 채택되고, 한국어 강제와 정면으로 부딪힌다.
        </p>
        <p className="leading-7">
          이 충돌은 prompt 강도로 해소되지 않는다.<br />
          "절대 한국어로만"을 외쳐도 모델은 "그러면 차선 토큰을 골라야 하는데, 차선 토큰의 logit이 너무 낮아서 정확성이 떨어진다"는 trade-off를 매 토큰마다 마주한다.<br />
          해법은 그 trade-off 자체를 lm_head 차원에서 재구성하는 것이다 — 정확하게 Smoothie-Qwen이 하는 일.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">5가지 모드의 공통 구조</h3>
        <p className="leading-7">
          5가지 실패 모드는 모두 같은 구조를 공유한다.<br />
          prompt는 입력 시퀀스의 일부 → hidden state에 약한 bias → lm_head logit 격차의 부호를 못 뒤집음.<br />
          어떤 실패 모드든 사슬의 마지막 고리에서 같은 병목에 부딪힌다.
        </p>
        <p className="leading-7">
          그래서 해법의 위치를 옮겨야 한다.<br />
          입력 시퀀스의 일부로 머무는 prompt에서, 출력 logit을 직접 만지는 lm_head로, 또는 학습 신호 자체를 재정렬하는 RL 보상으로.<br />
          나머지 섹션은 그 이동을 따라간다 — 가장 가벼운 런타임 가드부터, 가장 무거운 RL 재학습까지.
        </p>
      </div>
    </section>
  );
}
