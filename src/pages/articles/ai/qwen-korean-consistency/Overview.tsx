import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">한자 leakage는 왜 발생하는가</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Qwen으로 한국어 에이전트를 만들어 본 사람은 한 번쯤 마주친다.<br />
          평범한 문장 사이에 갑자기 <strong>分析</strong>, <strong>結果</strong>, <strong>問題</strong> 같은 한자가 끼어든다.<br />
          심한 경우 <code>&lt;think&gt;</code> 블록 전체가 중국어로 바뀐다.
        </p>
        <p className="leading-7">
          처음에는 프롬프트 탓이라고 생각하기 쉽다.<br />
          "한국어로만 답변하세요"를 시스템 프롬프트에 넣고, few-shot에 한국어 예시를 박고, 그래도 새는 토큰만 regex로 잘라낸다.<br />
          하지만 곧 깨닫는다 — 이건 프롬프트로 막을 수 있는 종류의 문제가 아니다.
        </p>
        <p className="leading-7">
          원인은 한 줄로 요약된다.<br />
          <strong>Qwen lm_head의 한자 토큰 logit이 한국어 토큰 logit을 자주 이긴다.</strong><br />
          그게 전부다. 나머지는 이 사실에서 파생된 증상일 뿐이다.
        </p>

        <div className="not-prose my-8"><OverviewViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">vocab과 사전학습 분포의 비대칭</h3>
        <p className="leading-7">
          Qwen 토크나이저는 BBPE(Byte-level BPE) 기반의 약 152K 토큰 vocab을 가진다.<br />
          이 vocab 안에 한글 음절(U+AC00~D7A3)과 CJK 통합 한자(U+4E00~9FFF)가 같은 ID 공간을 공유한다.<br />
          토큰 ID 그 자체는 언어 정보를 모른다 — 그냥 정수 인덱스다.
        </p>
        <p className="leading-7">
          문제는 사전학습 코퍼스 분포다.<br />
          Qwen2.5 / Qwen3는 영어와 중국어 중심으로 수조 토큰을 학습한다.<br />
          한국어 비중은 추정치로 1~3% 사이다. 같은 의미 단어 "분석"과 "分析"가 등장하는 빈도 격차가 한 자릿수 이상 벌어진다.
        </p>
        <p className="leading-7">
          학습 결과: lm_head 가중치 행렬 W의 한자 토큰 row가 한글 토큰 row보다 훨씬 풍부하게 학습된다.<br />
          한국어 컨텍스트 hidden state h가 들어와도, W·h를 계산하면 한자 row가 큰 inner product를 만들어낸다.<br />
          softmax는 그 logit 격차를 그대로 확률로 옮긴다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 reasoning 단계에서 더 심해지는가</h3>
        <p className="leading-7">
          가장 흥미로운 관찰은 <code>&lt;think&gt;</code> 블록 안에서 leakage가 폭증한다는 것이다.<br />
          최종 답변은 한국어로 깔끔하게 나오는데, 추론 과정만 중국어로 채워지는 경우가 흔하다.
        </p>
        <p className="leading-7">
          이유는 학습 신호의 출처에 있다.<br />
          Qwen3의 long-CoT(긴 추론) 학습 데이터는 압도적으로 중국어와 영어다.<br />
          모델이 "더 정밀하게 사고하는 모드"로 진입할수록, 그 모드와 강하게 상관된 토큰 — 즉 중국어 한자 — 의 logit이 솟구친다.<br />
          한국어 reasoning 패턴이 학습 분포에 거의 없으므로, 모델은 자연스럽게 중국어 reasoning으로 회귀한다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>핵심 통찰</strong> — leakage는 "한국어를 모른다"가 아니라 "한국어 reasoning 경로를 따로 학습한 적이 없다"는 문제다.<br />
          모델은 한국어 토큰 자체는 알고 있다. 다만 reasoning 모드의 attractor가 중국어 쪽에 크게 형성돼 있을 뿐이다.<br />
          이 차이가 해법 선택을 좌우한다 — 어휘 자체를 못 쓰는 게 아니라면, lm_head 단계의 가벼운 보정만으로도 큰 효과를 얻을 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">관찰되는 leakage 패턴 4가지</h3>
        <p className="leading-7">
          실전에서 마주치는 leakage는 몇 가지 정형화된 형태로 나타난다.<br />
          이 분류를 미리 알고 있으면 어느 해법이 어디에 효과적인지 판단하기 쉽다.
        </p>
        <ul className="leading-7">
          <li>
            <strong>어휘 치환</strong> — 한국어 문장 안의 한자어가 한자로 표기된다. "분석한다" → "分析한다".<br />
            가장 흔하고, 가장 거슬리지만, 의미는 보존된다. lm_head 보정으로 거의 다 잡힌다.
          </li>
          <li>
            <strong>think 블록 누출</strong> — 최종 답은 한국어인데 reasoning이 통째로 중국어/영어다.<br />
            사용자에게 직접 노출되지 않더라도 디버깅과 신뢰성에 치명적이다. RL 보정이 가장 효과적인 영역.
          </li>
          <li>
            <strong>코드/수식 주변 한자 폭증</strong> — 영어 식별자나 수식이 등장하면 그 직후 한자 토큰의 등장 빈도가 급증한다.<br />
            multilingual 코퍼스에서 코드 + 중국어 주석 패턴을 많이 봤기 때문이다.
          </li>
          <li>
            <strong>긴 응답 후반부 drift</strong> — 응답 길이가 길어질수록 한자 비율이 monotonic하게 증가한다.<br />
            컨텍스트가 자기참조하면서 한자 토큰이 한자 토큰을 부른다. Length 보상이 RL에서 따로 들어가는 이유.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">해법은 어디로 가야 하는가</h3>
        <p className="leading-7">
          문제가 lm_head 차원에서 발생한다는 사실은 해법의 위계를 자연스럽게 정해준다.<br />
          입력단(프롬프트)에서 멀어지고 가중치단(weight)에 가까워질수록 더 강력하고, 더 비쌀 가능성이 높다.
        </p>
        <p className="leading-7">
          이 글에서 다룰 4가지 해법은 그 스펙트럼을 따라 배치된다.
        </p>
        <ul className="leading-7">
          <li><strong>프롬프트 가드레일</strong> — 0 비용, 가장 약함. 왜 부족한지 다음 섹션에서 정리한다.</li>
          <li><strong>런타임 LLM judge + retry</strong> — 출력단 사후 검증. 추가 추론 비용이 들지만 모델은 그대로 둔다.</li>
          <li><strong>Smoothie-Qwen</strong> — dnotitia가 만든 lm_head weight 직접 조정. 재학습 없이 드롭인 교체. 비용 1회성.</li>
          <li><strong>RL fine-tune</strong> — Korean Language Consistency를 보상에 넣고 GRPO로 재학습. 가장 강력하고 가장 비쌈.</li>
        </ul>
        <p className="leading-7">
          각 섹션은 단순히 "어떻게 동작하는가"가 아니라 "<strong>왜 이 위치에서 효과가 나는가</strong>"를 추적한다.<br />
          토큰 → logit → softmax → 디코딩 → 보상 → 가중치 갱신, 이 사슬을 따라가다 보면 4가지 해법이 한 줄에 꿰진다.
        </p>
      </div>
    </section>
  );
}
