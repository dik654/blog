import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LlmApplicationCachingViz from "./llm-application-caching/viz/LlmApplicationCachingViz";

/**
 * LLM 애플리케이션 캐시: exact-match·semantic·retrieval·tool result·staleness
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function LlmApplicationCachingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          애플리케이션 캐시는 무엇을 담느냐로 다섯 갈래로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM 애플리케이션에서 캐시는 같은 계산을 다시 하지 않으려고 결과를 저장해 두는
            장치입니다. 그런데 “같은 계산”을 판정하는 기준이 layer마다 다릅니다. 문자 그대로
            같은 요청인지, 의미가 비슷한 요청인지, 검색 결과인지, 도구 호출 결과인지에 따라
            저장하는 대상과 판정 방법이 갈립니다.
          </p>
          <p>
            Application cache부터 exact-match, semantic, retrieval, embedding, tool result 다섯 종류로 나눕니다. 그리고 각
            종류가 무엇을 key로 삼고 무엇을 hit 판정 기준으로 삼는지 봅니다.
          </p>
          <p>
            <Link to="/ai/vllm-paged-attention#prefix-caching">vLLM paged attention</Link>{" "}
            글은 이미 GPU 안에서 KV 값을 재사용하는 prefix caching을 다뤘습니다. 그 캐시는
            model runtime 내부의 attention 계산 결과를 저장합니다. 이 글이 다루는 application
            cache는 그보다 위층, 즉 애플리케이션 코드가 LLM 호출·검색·도구 실행 자체를
            건너뛰기 위해 두는 캐시입니다. 두 층은 같은 “캐시”라는 이름을 쓰지만 저장 대상과
            무효화 조건이 다릅니다.
          </p>
          <p>
            저장 대상에서 시작해 운영 지표로 내려갑니다. 다섯 종류의 캐시 대상 → semantic cache의 유사도 threshold → cache
            key·invalidation·TTL·staleness → cache hit/miss/hit rate → cache warming과 LRU eviction 순서입니다.
          </p>
        </div>
        <ContentBoundary article="llm-application-caching" />
      </section>

      <section id="cache-taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Application cache는 재사용 판정 대상 다섯 가지로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Application cache는 LLM 애플리케이션이 반복되는 요청·비용이 큰 계산을 다시 하지
            않으려고 두는 저장소를 통틀어 부르는 이름입니다. 그 아래 exact-match, semantic,
            retrieval, embedding, tool result 다섯 종류가 “무엇을 캐싱하는가”라는 한 축으로
            나뉩니다.
          </p>
          <p>
            Exact-match cache는 요청 문자열 자체가 완전히 같을 때만 저장된 응답을
            돌려줍니다. Semantic cache는 문자열이 달라도 의미가 비슷하면 hit으로
            인정합니다. 이 둘은 “LLM 호출 자체를 건너뛴다”는 점에서 같은 층에 있지만 판정
            기준이 다릅니다.
          </p>
          <p>
            Retrieval cache는 vector DB나 검색 엔진에 보낸 조회의 결과 문서 목록을 저장하고, embedding cache는 텍스트를 embedding vector로
            바꾸는 계산 결과를 저장합니다. 둘 다 LLM 호출 이전 단계를 건너뛰므로 retrieval-augmented generation 파이프라인의 앞부분에 놓입니다.
          </p>
          <p>
            Tool result cache는 외부 API·함수 호출의 결과를 저장합니다. 예를 들어 같은
            좌표로 날씨를 두 번 물으면 두 번째는 API를 다시 부르지 않고 저장된 응답을
            돌려줍니다. 이 캐시만 LLM 바깥의 부수 효과(side effect) 유무를 함께 확인해야
            합니다.
          </p>
        </div>
        <LlmApplicationCachingViz />
        <TermBreakdown
          title="무엇을 캐싱하는가로 나눈 다섯 종류"
          description="같은 '캐시'라는 이름이지만 저장 대상과 hit 판정 기준이 다릅니다."
          items={[
            {
              term: "Application Cache",
              description: "LLM 애플리케이션이 반복 요청·비용이 큰 계산을 다시 하지 않으려고 두는 저장소 전체를 가리키는 상위 이름입니다.",
              example: "요청-응답을 저장하는 exact-match cache부터 도구 호출 결과를 저장하는 tool result cache까지 모두 포함합니다.",
              boundary: "이름만으로는 어떤 종류의 재사용인지 알 수 없어 아래 다섯 종류로 좁혀 봐야 합니다.",
            },
            {
              term: "Exact-Match Cache",
              description: "요청 문자열(또는 정규화한 요청)이 완전히 같을 때만 저장된 응답을 돌려주는 캐시입니다.",
              example: "같은 system prompt와 같은 user 질문이 토씨 하나까지 같을 때만 hit입니다.",
              boundary: "질문을 한 글자만 바꿔도 miss가 되어, 자연어처럼 표현이 다양한 입력에는 hit rate가 낮습니다.",
            },
            {
              term: "Semantic Cache",
              description: "요청을 embedding으로 바꾼 뒤 저장된 요청들과 similarity를 비교해, 문자열이 달라도 의미가 비슷하면 hit으로 인정하는 캐시입니다.",
              example: "GPTCache는 이 방식으로 “파리의 수도는?”과 “프랑스 수도가 어디야?”를 같은 hit으로 묶을 수 있습니다.",
              boundary: "Similarity 판정이 틀리면 다른 질문에 엉뚱한 답을 캐시로 돌려줄 위험이 있습니다(다음 절).",
            },
            {
              term: "Retrieval Cache",
              description: "검색 질의 하나에 대해 vector DB·검색 엔진이 돌려준 문서 목록 자체를 저장하는 캐시입니다.",
              example: "같은 질의로 top-5 문서를 다시 검색하지 않고 저장된 목록을 그대로 씁니다.",
              boundary: "문서 목록이 최신 knowledge base 갱신을 반영 못 하면 오래된 정보를 계속 돌려줄 수 있습니다.",
            },
            {
              term: "Embedding Cache",
              description: "텍스트를 embedding vector로 바꾸는 계산 결과를 저장하는 캐시입니다.",
              example: "같은 문서 chunk를 여러 파이프라인이 반복해서 embedding할 때 계산을 한 번만 합니다.",
              boundary: "Embedding model 자체가 바뀌면 저장된 vector는 새 model의 공간과 맞지 않아 무효화해야 합니다.",
            },
            {
              term: "Tool Result Cache",
              description: "외부 API·함수 호출의 결과를 저장하는 캐시로, 부수 효과(side effect) 유무를 함께 확인해야 하는 유일한 종류입니다.",
              example: "같은 주문 번호로 배송 조회 API를 반복 호출하지 않고 저장된 결과를 돌려줍니다.",
              boundary: "결제·주문처럼 부수 효과가 있는 호출은 결과를 캐싱해도 다음 호출까지 캐싱하면 안 됩니다.",
            },
          ]}
        />
      </section>

      <section id="semantic-threshold" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Threshold를 낮추면 hit은 늘고 오답도 함께 늘어납니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Semantic cache에서 hit을 인정하는 기준선이 threshold입니다. 새 요청의 embedding과 저장된 요청의 embedding 사이 similarity 점수가
            이 값 이상이어야 hit이 됩니다. Cosine similarity를 쓴다면 보통 0과 1 사이 값으로, 예를 들어 0.95 이상만 hit으로 받아들이는 식입니다.
          </p>
          <p>
            Threshold를 낮추면 더 많은 요청이 비슷하다고 인정되어 hit rate는 올라가지만 의미가 실제로 다른 질문까지 hit으로 묶일 위험이 커집니다. “서울 인구는?”과
            “서울 면적은?”은 문장 구조가 비슷해 similarity 점수가 높게 나올 수 있지만 정답은 전혀 다릅니다.
          </p>
          <p>
            반대로 threshold를 너무 높이면 실제로 같은 의미의 질문도 miss로 처리되어
            semantic cache가 exact-match cache와 다를 바 없어집니다. 그래서 threshold는
            hit rate와 오답률 사이에서 애플리케이션마다 다시 맞춰야 하는 값입니다.
          </p>
        </div>
        <ExplainedFormula
          question="새 요청의 embedding이 저장된 요청과 얼마나 가까워야 semantic cache hit으로 인정하나요?"
          idea="두 embedding vector 사이 cosine similarity를 계산해 미리 정한 threshold 이상이면 hit, 미만이면 miss로 판정합니다."
          formula={String.raw`\mathrm{sim}(q,c)=\dfrac{\vec q\cdot\vec c}{\lVert\vec q\rVert\,\lVert\vec c\rVert},\quad \text{hit} \iff \mathrm{sim}(q,c)\ge\tau`}
          annotatedFormula={String.raw`\mathrm{sim}(q,c)=\underbrace{\dfrac{\vec q\cdot\vec c}{\lVert\vec q\rVert\,\lVert\vec c\rVert}}_{\text{두 embedding 사이 각도 기반 유사도}},\quad \underbrace{\text{hit} \iff \mathrm{sim}(q,c)\ge\tau}_{\text{threshold 비교}}`}
          operations={[
            { expression: String.raw`\vec q\cdot\vec c`, annotation: ["새 요청 embedding과 저장된 요청 embedding의", "내적을 계산해 방향이 얼마나 겹치는지 봅니다."] },
            { expression: String.raw`\lVert\vec q\rVert\,\lVert\vec c\rVert`, annotation: ["두 vector의 크기를 곱해 내적을", "0~1 범위의 각도 유사도로 정규화합니다."] },
            { expression: String.raw`\mathrm{sim}(q,c)\ge\tau`, annotation: ["정규화한 유사도가", "미리 정한 threshold \\tau 이상인지 비교합니다."] },
          ]}
          terms={[
            { symbol: "q", name: "새 요청", description: "지금 들어온 요청을 embedding vector로 바꾼 값입니다." },
            { symbol: "c", name: "저장된 요청", description: "cache에 이미 저장돼 있는 과거 요청의 embedding vector입니다." },
            { symbol: "\\tau", name: "Semantic cache threshold", description: "hit으로 인정할 최소 유사도 값입니다(예: 0.95)." },
          ]}
          assumptions={[
            "Cosine similarity가 의미적 유사성을 잘 대표한다고 가정합니다. Embedding model이 바뀌면 같은 threshold가 다른 의미를 가질 수 있습니다.",
            "질문 하나의 답이 유일하다고 가정합니다. 문맥에 따라 정답이 달라지는 질문은 threshold를 아무리 높여도 오답 위험이 남습니다.",
          ]}
          interpretation="Threshold를 0.99에서 0.90으로 낮추면 hit rate는 올라가지만, 표현은 비슷하고 의도는 다른 질문(“인구는?” vs “면적은?”)까지 같은 답을 돌려줄 위험이 함께 커집니다. 그래서 정답이 하나로 고정된 FAQ류 질의에는 낮은 threshold를, 수치·조건이 자주 바뀌는 질의에는 높은 threshold를 씁니다."
        />
        <div id="paper-gptcache" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zilliz · GPTCache (공식 문서)"
            citeKey={1}
            href="https://github.com/zilliztech/GPTCache"
          >
            전통적 캐시가 새 질의와 저장된 질의 사이 exact match만 쓰는 것과 달리,
            embedding 알고리즘으로 질의를 vector로 바꾸고 vector store에서 similarity
            search를 수행해 문자열이 달라도 유사한 질의를 hit으로 처리한다고 설명합니다.
            성능 지표로 hit ratio(전체 요청 대비 캐시가 응답한 비율)와 recall(캐시가
            응답했어야 할 요청 중 실제로 응답한 비율)을 구분합니다. Threshold는
            <code>similarity_threshold</code> 설정값으로 조정 가능하다고 밝히지만
            모든 도메인에 맞는 고정값을 제시하지는 않으며, false positive·false
            negative가 발생할 수 있음을 명시합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="cache-key-ttl-staleness" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cache key가 넓으면 staleness가, 좁으면 hit rate가 줄어듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Cache key는 저장된 값을 다시 찾아올 때 쓰는 식별자입니다. Exact-match
            cache라면 요청 문자열과 model, temperature 같은 생성 옵션까지 묶어 key로
            삼습니다. 옵션 하나라도 key에서 빠지면 다른 조건의 응답을 같은 값으로
            돌려주는 오류가 생깁니다.
          </p>
          <p>
            저장된 값을 더 이상 쓰지 못하게 지우거나 무효로 표시하는 일을 cache invalidation이라 합니다. 방식은 두 가지를 함께 씁니다. 원본 데이터가 바뀌었을 때
            명시적으로 지우는 쪽과, 일정 시간이 지나면 자동으로 무효가 되는 TTL(time to live) 쪽입니다.
          </p>
          <p>
            TTL은 값이 유효하다고 보는 최대 시간입니다. TTL을 짧게 잡으면 오래된 값을
            돌려줄 위험, 즉 cache staleness는 줄지만 그만큼 자주 miss가 나서 hit rate도
            낮아집니다. TTL을 길게 잡으면 반대로 hit rate는 오르지만 staleness 위험이
            커집니다.
          </p>
          <p>
            예를 들어 환율처럼 자주 바뀌는 값을 담은 tool result cache는 TTL을 몇 분
            단위로 짧게 잡아야 하고, 회사 소개처럼 거의 안 바뀌는 문서를 담은 retrieval
            cache는 TTL을 며칠 단위로 길게 잡아도 staleness 위험이 크지 않습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="요청 하나가 cache key 생성부터 hit/miss 처리까지 지나는 절차"
          input={["incoming request", "exact-match store", "semantic store(threshold τ)", "TTL 설정"]}
          steps={[
            { code: "key ← hash(prompt, model, options)  # cache key 생성", note: "요청을 재현하는 데 필요한 조건을 모두 key에 넣습니다." },
            { code: "if exact_store.has(key) and not expired(key): return exact_store[key]", note: "Exact-match lookup — TTL이 지나지 않았을 때만 hit입니다." },
            { code: "q ← embed(prompt)", note: "Exact-match가 miss면 semantic lookup을 위해 embedding을 만듭니다." },
            { code: "c ← nearest(semantic_store, q)", note: "저장된 요청 중 가장 가까운 후보를 찾습니다." },
            { code: "if c and sim(q, c) ≥ τ and not expired(c): return semantic_store[c]", note: "Threshold와 TTL을 모두 통과해야 semantic hit입니다." },
            { code: "result ← execute(request)  # 둘 다 miss면 실제로 실행", note: "LLM 호출·검색·도구 실행 중 해당하는 작업을 수행합니다." },
            { code: "exact_store[key] ← result; semantic_store[q] ← result  # TTL과 함께 저장", note: "다음 같은 요청·비슷한 요청이 hit할 수 있도록 저장합니다." },
          ]}
          output="요청에 대한 응답(hit 또는 새로 실행한 결과)과, 갱신된 캐시 상태"
        />
        <TermBreakdown
          title="Key·무효화·수명을 나누는 세 개념과 그 위험"
          items={[
            { term: "Cache Key", description: "요청을 재현하는 조건(문자열·model·옵션)을 하나로 묶어 저장·조회에 쓰는 식별자입니다.", example: "prompt 해시 + model 이름 + temperature 값을 이어 붙인 문자열.", boundary: "Key에서 빠뜨린 조건이 있으면 다른 조건의 결과를 같은 값으로 잘못 돌려줍니다." },
            { term: "Cache Invalidation", description: "원본이 바뀌었을 때 저장된 값을 지우거나 무효로 표시하는 절차입니다.", example: "문서가 갱신되면 그 문서를 참조한 retrieval cache 항목을 즉시 지웁니다.", boundary: "무효화를 누락하면 원본이 바뀌어도 캐시는 옛 값을 계속 돌려줍니다." },
            { term: "Time to Live (TTL)", description: "저장된 값이 유효하다고 보는 최대 시간으로, 지나면 자동으로 무효가 됩니다.", example: "환율 조회 결과는 TTL 5분, 회사 소개 문서는 TTL 3일.", boundary: "TTL만으로는 TTL이 끝나기 전에 원본이 바뀌는 경우까지 막지 못해 명시적 invalidation과 함께 씁니다." },
            { term: "Cache Staleness", description: "캐시가 원본의 최신 상태와 어긋난 오래된 값을 돌려줄 위험입니다.", example: "가격이 인상됐는데 TTL이 남아 있어 옛 가격을 계속 응답.", boundary: "Staleness를 없애려고 TTL을 0에 가깝게 줄이면 사실상 캐시를 안 쓰는 것과 같아집니다." },
          ]}
        />
      </section>

      <section id="hit-miss-rate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Hit rate는 hit과 miss를 더한 전체에서 hit이 차지하는 비율입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Cache hit은 요청이 저장된 값을 찾아 그대로 돌려준 경우이고, cache miss는
            저장된 값을 찾지 못해 실제로 계산을 다시 실행한 경우입니다. Cache hit rate는
            일정 기간 동안 이 둘을 더한 전체 조회 중 hit이 차지한 비율입니다.
          </p>
          <p>
            예를 들어 하루 10,000건의 요청 중 6,200건이 hit이고 3,800건이 miss였다면 hit rate는 62%입니다. 이 숫자는
            threshold·TTL·warming(다음 절) 설정을 바꿀 때마다 함께 움직이므로 캐시 설정을 조정한 뒤 반드시 다시 재보는 지표입니다.
          </p>
          <p>
            <Link to="/ai/vllm-paged-attention#prefix-operations">
              vLLM paged attention
            </Link>{" "}
            글의 prefix cache hit rate는 이 식과 같은 형태를 GPU 안 KV block 재사용에
            적용한 특수한 경우입니다. 그 지표는 token 단위로 세지만, 이 글의 hit rate는
            요청 단위로 셉니다.
          </p>
        </div>
        <ExplainedFormula
          question="일정 기간 동안 캐시가 실제로 얼마나 자주 도움이 됐는지 어떻게 숫자 하나로 보나요?"
          idea="같은 기간의 hit 수와 miss 수를 더해 전체 조회 수를 만들고, 그중 hit이 차지한 비율을 계산합니다."
          formula={String.raw`R_{\mathrm{hit}}=\dfrac{N_{\mathrm{hit}}}{N_{\mathrm{hit}}+N_{\mathrm{miss}}}`}
          annotatedFormula={String.raw`R_{\mathrm{hit}}=\dfrac{\overbrace{N_{\mathrm{hit}}}^{\text{저장된 값을 그대로 돌려준 횟수}}}{\underbrace{N_{\mathrm{hit}}+N_{\mathrm{miss}}}_{\text{같은 기간의 전체 조회 수}}}`}
          operations={[
            { expression: String.raw`N_{\mathrm{hit}}+N_{\mathrm{miss}}`, annotation: ["같은 기간의 hit 수와 miss 수를 더해", "전체 조회 수를 만듭니다."] },
            { expression: String.raw`\dfrac{N_{\mathrm{hit}}}{N_{\mathrm{hit}}+N_{\mathrm{miss}}}`, annotation: ["hit 수를 전체 조회 수로 나눠", "hit이 차지하는 비율을 얻습니다."] },
          ]}
          terms={[
            { symbol: "N_{\\mathrm{hit}}", name: "Cache Hit 수", description: "저장된 값을 찾아 그대로 돌려준 조회 횟수입니다." },
            { symbol: "N_{\\mathrm{miss}}", name: "Cache Miss 수", description: "저장된 값을 찾지 못해 실제로 계산을 다시 실행한 조회 횟수입니다." },
            { symbol: "R_{\\mathrm{hit}}", name: "Cache Hit Rate", description: "전체 조회 중 hit이 차지한 비율입니다." },
          ]}
          assumptions={[
            "Hit과 miss를 같은 시간 창(예: 하루, 한 시간)에서 집계한다고 가정합니다.",
            "여러 캐시 종류(exact-match·semantic·retrieval)를 합쳐서 셀 수도, 따로 셀 수도 있으며 어느 쪽인지 명시해야 비교가 가능합니다.",
          ]}
          interpretation="Hit rate 62%는 “요청 10건 중 6건은 계산 없이 응답했다”는 뜻입니다. Threshold를 낮추거나 TTL을 늘리면 이 숫자는 오르지만, 앞 절들이 보여 준 오답률·staleness 위험이 함께 오르므로 hit rate 하나만 보고 설정을 판단하면 안 됩니다."
        />
        <ProgressiveDetail
          title="실제 서비스의 hit rate는 왜 캐시 종류마다 크게 다른가요"
          preview="Exact-match cache의 hit rate는 보통 한 자릿수~수십 %대에 머물지만, FAQ성 질의가 많은 서비스의 semantic cache는 그보다 훨씬 높게 나올 수 있습니다."
        >
          <p>
            일반 채팅형 요청은 문장이 매번 달라서 exact-match hit rate가 낮게 나오는 경우가 많습니다. 반면 같은 질문 유형이 반복되는 고객 지원 FAQ 서비스는
            semantic cache의 hit rate가 훨씬 높게 나올 수 있습니다. 이 차이는 캐시 설정의 문제가 아니라 요청 분포 자체의 차이이므로 hit rate 목표는 캐시
            종류뿐 아니라 실제 트래픽 패턴을 보고 정해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="warming-eviction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Warming은 채우는 시점을, LRU는 비우는 순서를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Cache warming은 캐시를 미리 채워 두는 일입니다. 실제 트래픽이 몰리기 전에, 자주 나올 것으로 예상되는 요청을 먼저 실행해 그 결과를 넣어 둡니다. 배포 직후처럼
            캐시가 비어 있는 상태에서는 처음 몇 분간 모든 요청이 miss가 되므로, 자주 묻는 질문 목록을 미리 실행해 두면 이 구간을 줄일 수 있습니다.
          </p>
          <p>
            캐시 용량이 가득 찼을 때 무엇을 먼저 지울지는 eviction 정책이 정합니다. 그 정책 가운데 LRU(least recently used)는 가장 오랫동안 조회되지 않은
            항목부터 지우는 방식으로, “최근에 쓰인 항목이 곧 다시 쓰일 가능성이 높다”는 가정에 기댑니다.
          </p>
          <p>
            Warming은 캐시를 채우는 시작점을, LRU는 캐시가 넘칠 때 비우는 순서를
            정하므로 서로 반대 방향의 절차입니다. Warming으로 채운 항목도 오래 조회되지
            않으면 LRU에 의해 그대로 밀려날 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="채우는 절차와 비우는 정책"
          items={[
            { term: "Cache Warming", description: "실제 트래픽 전에 예상 요청의 결과를 미리 캐시에 채워 두는 절차입니다.", example: "배포 직후 자주 묻는 질문 100개를 미리 실행해 캐시에 채워 둡니다.", boundary: "예상이 틀리면 warming에 쓴 계산이 실제로는 한 번도 hit하지 못할 수 있습니다." },
            { term: "LRU", description: "캐시가 가득 찼을 때 가장 오랫동안 조회되지 않은 항목부터 지우는 eviction 정책입니다.", example: "용량 1,000건인 캐시에 1,001번째 항목이 들어오면 가장 오래 안 쓰인 항목을 지웁니다.", boundary: "가끔 쓰이지만 반드시 남아 있어야 하는 항목(예: 드문 안전 규칙 응답)도 LRU 기준으로는 먼저 밀려날 수 있습니다." },
          ]}
        />
        <div id="paper-belady" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Belady · A Study of Replacement Algorithms for a Virtual-Storage Computer (IBM Systems Journal, 1966)"
            citeKey={2}
            href="https://doi.org/10.1147/sj.52.0078"
          >
            캐시(당시 논문에서는 virtual storage의 page)가 가득 찼을 때 무엇을 내보낼지
            정하는 여러 replacement 알고리즘을 비교하고, 미래 참조를 완벽히 아는
            이상적인 최적 알고리즘(이후 Belady's algorithm으로 불림)을 함께 제시해
            LRU 같은 실용 알고리즘의 성능을 비교할 기준선으로 삼습니다. 이 이상적
            알고리즘은 미래를 알아야 하므로 실제 시스템에는 쓸 수 없다는 한계를
            논문 스스로 명시합니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
