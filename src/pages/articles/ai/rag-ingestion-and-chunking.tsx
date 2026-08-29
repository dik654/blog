import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RagIngestionAndChunkingViz from "./rag-ingestion-and-chunking/viz/RagIngestionAndChunkingViz";

/**
 * RAG ingestion: 문서 파싱·chunking·overlap·contextual retrieval
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function RagIngestionAndChunkingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Ingestion pipeline 이 문서를 잘라 knowledge base 를 채웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            RAG 가 검색하는 대상은 원본 파일이 아니라 knowledge base 입니다. Knowledge base 는
            문서·chunk·metadata·embedding vector 를 함께 담은 저장소이고, document ingestion
            pipeline 이 그 저장소를 채우는 절차입니다. 이 순서(parsing → chunking → embedding)를
            한 단계라도 건너뛰면 다음 단계가 받는 입력의 모양 자체가 깨집니다.
          </p>
          <p>
            이 글은 그 pipeline 의 앞쪽 절반, 즉 문서를 읽어 들여 검색 가능한 단위로 자르는
            parsing·chunking·contextual retrieval 을 다룹니다. Chunking 뒤에 오는 embedding
            버전 계약과 검색 funnel 자체는{" "}
            <Link to="/ai/rag-pipeline#embedding">RAG 파이프라인 글</Link>의 범위입니다.
          </p>
          <p>
            가정: 100 페이지 매뉴얼을 chunk 500 개로 잘라 knowledge base 에 넣었는데, 실제로
            질문에 답하는 chunk 는 그중 30 개뿐이었습니다. 나머지 470 개는 parsing 이 표를
            깨뜨렸거나, chunk 경계가 문장을 반으로 잘라 원래 뜻을 잃은 것들입니다. Ingestion
            단계의 선택 하나하나가 이 30 개와 470 개의 경계를 가릅니다.
          </p>
        </div>
        <RagIngestionAndChunkingViz />
        <ContentBoundary article="rag-ingestion-and-chunking" />
      </section>

      <section id="parsing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Document parsing 은 chunking 이 쓸 구조를 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            PDF, HTML, Markdown 은 저마다 다른 방식으로 제목과 문단, 표를 인코딩합니다. Parsing 은
            그 포맷을 벗겨 내고 순서가 있는 일반 텍스트를 만드는 단계입니다.
          </p>
          <p>
            이때 그 텍스트가 원래 어떤 구조(제목 경로, 문단, 표의 행과 열)에 속했는지도 함께
            남겨야 합니다. 구조 정보를 버리면 다음 단계인 chunking 은 평범한 글자열만 보고 자르게
            됩니다.
          </p>
          <p>
            이 글은 parsing 을 ingestion pipeline 의 한 단계로만 다룹니다. 표를 셀 단위로
            복원하거나 스캔 문서의 layout 을 분석하는 세부는 별도 글의 범위이며, 여기서는 parsing
            결과가 무엇을 보존해야 다음 단계인 chunking 이 안전하게 작동하는지만 봅니다.
          </p>
          <p>
            가정: 표 하나가 3 행 4 열이고 header 행에 항목 이름이 있습니다. Parsing 이 header 와
            data row 의 관계를 남기지 않으면, 뒤에 이어지는 chunking 은 숫자만 있는 행을 header
            없이 잘라내고, 그 chunk 는 어떤 항목의 숫자인지 알 수 없는 상태로 knowledge base 에
            들어갑니다.
          </p>
          <p>
            Parsing 이 남겨야 할 최소 단위는 문단 경계, 제목 계층, 표의 header-row 관계, 원문에서의
            문자 offset 입니다. Offset 을 남기지 않으면 나중에 어떤 chunk 가 원문 어디서 왔는지
            추적할 방법이 없습니다.
          </p>
        </div>
        <TermBreakdown
          title="이 글이 다루는 parsing 의 범위"
          description="Ingestion pipeline 관점에서 parsing 이 남겨야 할 것과, 이 글이 다루지 않는 것을 나눕니다."
          items={[
            { term: "Document parsing", description: "원본 포맷에서 텍스트와 구조(제목·문단·표)를 뽑는 단계입니다.", example: "PDF 본문 + 표 header/row 관계 + 원문 offset.", boundary: "표 셀 단위 복원·layout 분석 같은 parsing 자체의 세부는 이 글이 소유하지 않습니다." },
            { term: "원문 offset", description: "Chunk 가 원문 어디서 왔는지 되짚을 수 있는 문자 위치입니다.", example: "chunk 하나가 원문 480~530 문자 구간을 담았다는 기록.", boundary: "Offset 이 없으면 chunk 재현·업데이트 시 원문과의 대응을 잃습니다." },
          ]}
        />
      </section>

      <section id="chunking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Chunk size 와 overlap 이 검색 정밀도와 경계 손실을 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Document chunking 은 parsing 이 만든 연속 텍스트를 고정 길이(chunk size)로 나눠
            검색 단위를 만드는 단계입니다. Chunk 를 너무 크게 두면 서로 다른 주제가 한 chunk 에
            섞여 검색 정밀도가 떨어지고, 너무 작게 두면 조건과 예외가 다른 chunk 로 흩어집니다.
          </p>
          <p>
            그 사이를 메우는 것이 chunk overlap 입니다. 인접한 두 chunk 가 일부 구간을 공유하게
            해서, chunk 경계(chunk boundary)에 걸친 문장이 한쪽 chunk 에는 통째로 남게 만드는
            장치입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Chunk size 500, overlap 50 인 1,000-token 문서는 chunk 가 몇 개 나올까요?"
          idea="첫 chunk 이후로는 chunk size 에서 overlap 을 뺀 만큼(stride)만 앞으로 나가므로, overlap 을 뺀 나머지 길이를 그 stride 로 나누면 필요한 chunk 개수가 나옵니다."
          formula={String.raw`N=\left\lceil \frac{L-o}{s-o} \right\rceil`}
          annotatedFormula={String.raw`N=\left\lceil \underbrace{\frac{L-o}{s-o}}_{\text{남은 길이 ÷ stride}} \right\rceil`}
          operations={[
            { expression: String.raw`L-o`, annotation: ["문서 길이 L 에서 overlap 한 번을 먼저 빼", "첫 chunk 뒤에 실제로 더 덮어야 할 길이를 구함"] },
            { expression: String.raw`s-o`, annotation: ["chunk size 에서 overlap 을 뺀 stride 로", "다음 chunk 시작 위치가 얼마나 전진하는지 나타냄"] },
            { expression: String.raw`\left\lceil \cdot \right\rceil`, annotation: ["나눈 값을 올림해", "끝에 짧게 남는 조각도 chunk 하나로 셈"] },
          ]}
          terms={[
            { symbol: "L", name: "문서 길이", description: "token 단위로 잰 전체 문서 길이입니다." },
            { symbol: "s", name: "chunk size", description: "chunk 하나가 담는 최대 token 수입니다." },
            { symbol: "o", name: "chunk overlap", description: "인접 chunk 가 공유하는 token 수입니다." },
            { symbol: "N", name: "chunk 개수", description: "문서 하나를 자를 때 만들어지는 chunk 총수입니다." },
          ]}
          assumptions={[
            "Token 단위로 정확히 나뉜다고 가정하며 문장 경계는 고려하지 않은 순수 길이 계산입니다.",
            "마지막에 chunk size 보다 짧게 남는 조각도 chunk 하나로 셉니다.",
          ]}
          interpretation="L=1,000, s=500, o=50 이면 stride 는 450 이라 chunk 시작 위치는 0, 450, 900 이 되고 [0,500), [450,950), [900,1,000) 세 chunk 가 나옵니다. 마지막 chunk 는 100 token 짜리 짧은 조각입니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Overlap 의 효과는 경계에 걸친 문장에서 드러납니다. 480~530 번째 token 에 걸친 문장
            하나가 있다고 하면, overlap 이 없는 경우(stride 500) chunk 는 [0,500) 과 [500,1,000)
            으로 나뉘어 이 문장은 두 chunk 어디에도 온전히 남지 않습니다.
          </p>
          <p>
            같은 문장을 overlap 50 인 앞의 예로 다시 보면, 두 번째 chunk 가 [450,950) 구간을
            담으므로 480~530 문장 전체가 그 chunk 안에 통째로 들어갑니다. Overlap 이 경계에 걸친
            정보를 적어도 한쪽 chunk 에는 살려 두는 것입니다.
          </p>
          <p>
            다만 overlap 이 문장 길이보다 짧으면 이 보장은 깨집니다. 400~560 번째 token 에 걸친
            160-token 문장은 overlap 50 으로도 어느 chunk 에도 완전히 들어가지 않습니다. Overlap
            을 키우면 이런 경우는 줄지만, chunk 개수와 중복 저장량이 함께 늘어납니다.
          </p>
        </div>
        <TermBreakdown
          title="Chunk size · overlap · boundary 의 관계"
          items={[
            { term: "Document chunking", description: "연속 텍스트를 고정 길이 검색 단위로 나누는 단계입니다.", example: "500-token chunk 로 문서 하나를 여러 조각으로 나눔.", boundary: "Chunk 하나에 여러 주제가 섞이면 검색 정밀도가 떨어집니다." },
            { term: "Chunk size", description: "chunk 하나가 담는 최대 token 수입니다.", example: "500 token.", boundary: "너무 크면 주제가 섞이고, 너무 작으면 문맥이 흩어집니다." },
            { term: "Chunk overlap", description: "인접 chunk 가 공유하는 token 수입니다.", example: "50 token 중복.", boundary: "문장 길이보다 짧은 overlap 은 경계 손실을 완전히 막지 못합니다." },
            { term: "Chunk boundary", description: "한 chunk 가 끝나고 다음 chunk 로 넘어가는 자리입니다.", example: "[0,500) 과 [450,950) 사이 겹치는 [450,500) 구간.", boundary: "경계 자체를 없앨 수는 없고, overlap 은 그 경계의 손실을 줄이는 장치일 뿐입니다." },
          ]}
        />
        <ProgressiveDetail
          title="Chunk size 를 늘리면 span coverage 도 함께 오르나요?"
          preview="아닙니다. Chunk 를 키우면 경계 손실은 줄지만 각 chunk 안에 무관한 문장이 섞여 검색이 그 chunk 를 놓칠 위험이 커집니다."
        >
          <p>
            <Link to="/ai/rag-pipeline#chunking">RAG 파이프라인 글의 span coverage</Link> 는 정답
            근거가 최종 context 에 얼마나 남았는지를 잽니다. Chunk size 를 키우면 경계에 걸린
            손실은 줄어도, 그 chunk 가 검색 단계에서 아예 후보로 뽑히지 못하면 span coverage 는
            오히려 떨어집니다. Chunk size·overlap 은 이 글의 범위이고, 그 결과를 재는 span coverage
            수식은 RAG 파이프라인 글이 이미 정의합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="semantic-chunking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Semantic chunking 은 문장 유사도가 떨어지는 자리를 경계로 삼습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Fixed-size chunking 은 몇 번째 token 인지만 보고 자릅니다. Semantic chunking 은 문장을
            하나씩 embedding 한 뒤 이웃한 문장 사이의 유사도를 계산해, 그 유사도가 갑자기 떨어지는
            자리만 경계로 삼습니다. 주제가 바뀌는 자리에서 자르겠다는 뜻입니다.
          </p>
          <p>
            절차는 이렇습니다. 문서를 문장 단위로 나누고, 각 문장(또는 이웃 몇 개를 묶은 group)을
            embedding 합니다. 그다음 문장 i 와 문장 i+1 의 embedding 사이 거리를 차례로 계산해,
            그 거리가 전체 분포에서 상위 몇 퍼센트(percentile)에 들 때만 그 자리를 chunk boundary
            로 확정합니다.
          </p>
          <p>
            LlamaIndex 의 SemanticSplitterNodeParser 는 이 percentile 을 breakpoint_percentile_threshold
            라는 이름으로 노출하고, 기본 예시 값은 95 입니다. 문장 사이 유사도 하락이 상위 5 %
            안에 드는 자리만 경계로 인정한다는 뜻이며, buffer_size 파라미터로 경계를 계산할 때
            앞뒤로 몇 문장을 더 묶어 볼지 조절합니다.
          </p>
          <p>
            이 방식은 chunk 길이를 고정하지 않으므로 어떤 chunk 는 두 문장, 어떤 chunk 는 열 문장이
            될 수 있습니다. 그 대가로 문장마다 embedding 을 한 번 더 계산해야 해서, ingestion
            시점의 연산 비용이 fixed-size chunking 보다 커집니다.
          </p>
        </div>
        <TermBreakdown
          title="Fixed-size 와 semantic chunking 의 경계 결정 기준"
          items={[
            { term: "Semantic chunking", description: "문장 embedding 유사도가 급격히 떨어지는 자리를 경계로 삼는 방법입니다.", example: "이웃 문장 유사도 하락이 상위 5 %(percentile 95)에 들 때만 자름.", boundary: "문장 단위 embedding 이 추가로 필요해 ingestion 비용이 fixed-size 보다 높습니다." },
            { term: "Fixed-size chunking", description: "token 수만 보고 정해진 길이로 자르는 방법입니다.", example: "500 token 마다 자름.", boundary: "내용과 무관하게 잘라 문장이 중간에 끊길 수 있습니다." },
          ]}
        />
      </section>

      <section id="contextual-retrieval" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Contextual retrieval 은 chunk 앞에 문맥을 붙여 검색 실패율을 낮춥니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Chunk 하나만 떼어 보면 "그 회사의 매출은 지난 분기보다 3 % 늘었다" 같은 문장은 어느
            회사, 어느 분기인지 알 수 없습니다. Contextual retrieval 은 이 손실을 chunking 뒤,
            embedding 하기 전에 chunk 앞에 짧은 설명을 붙여 메우는 방법입니다.
          </p>
          <p>
            LLM 이 문서 전체를 보고 각 chunk 를 위한 50~100 token 짜리 설명을 생성합니다. Anthropic
            이 공개한 prompt 는 "이 chunk 를 검색에 도움이 되도록 문서 전체 맥락에 위치시키는 짧고
            명확한 설명을 달라"고 요청하는 형태입니다. 이렇게 만들어진 설명이 chunk 앞에 붙은 채로
            embedding·BM25 색인 양쪽에 들어갑니다.
          </p>
          <p>
            Anthropic 은 codebase·소설·arXiv 논문·과학 논문을 섞은 데이터셋에서 top-20 chunk
            검색의 실패율을 측정했습니다. 기존 방식의 실패율은 5.7 % 였고, contextual embedding
            만 추가하면 3.7 %(35 % 개선), contextual BM25 를 더하면 2.9 %(49 % 개선), 그 뒤에
            reranking 까지 더하면 1.9 %(67 % 개선)로 낮아졌습니다.
          </p>
          <p>
            문서마다 매번 이 설명을 새로 생성하면 비용이 크지만, prompt caching 으로 문서 본문을
            한 번만 context 에 올려 두고 chunk 별 설명만 반복 생성하면, Anthropic 은 문서 100 만
            token 당 1.02 달러의 일회성 비용으로 전체 chunk 의 설명을 만들 수 있다고 보고합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Contextual retrieval 은 semantic chunking 을 대체하나요?"
          preview="아닙니다. 둘은 서로 다른 문제를 풉니다. Semantic chunking 은 경계를 어디서 자를지 정하고, contextual retrieval 은 잘린 chunk 에 빠진 문맥을 붙입니다."
        >
          <p>
            Chunking 방식을 fixed-size 로 하든 semantic 으로 하든, 잘라낸 chunk 는 여전히 원문
            전체의 맥락을 잃습니다. Contextual retrieval 은 어느 chunking 방식 위에도 적용할 수
            있는 뒤 단계이며, Anthropic 의 실험도 chunking 자체는 고정해 두고 이 prefix 유무만
            비교했습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Ingestion pipeline 은 네 단계를 순서대로 묶어 index 를 채웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            앞서 다룬 네 단계를 하나의 pipeline 으로 이으면, 원본이 바뀔 때 그 source 에서 파생된
            chunk 만 다시 만들면 되는 구조가 됩니다. 전체를 매번 다시 도는 대신 바뀐 부분만
            갱신하는 것이 knowledge base 를 최신 상태로 유지하는 실용적인 방법입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="문서 ingestion pipeline: parsing 부터 index 반영까지"
          input={[
            "원본 문서 목록(PDF · HTML · Markdown 등)",
            "chunk size, chunk overlap(또는 semantic chunking 의 percentile threshold)",
            "contextual retrieval 사용 여부",
            "embedding model 과 대상 index",
          ]}
          steps={[
            { code: "for doc in raw_documents: parsed = parse(doc)", note: "원본 포맷에서 텍스트와 제목·문단·표 구조, 원문 offset 을 뽑습니다." },
            { code: "chunks = split(parsed, chunk_size, chunk_overlap)", note: "고정 길이(또는 semantic 기준)로 검색 단위를 만들고 각 chunk 에 source·offset metadata 를 남깁니다." },
            { code: "if contextual_retrieval: chunks = [prepend(c, summarize(parsed, c)) for c in chunks]", note: "필요하면 문서 전체를 본 LLM 이 만든 짧은 설명을 각 chunk 앞에 붙입니다." },
            { code: "vectors = embed(chunks); index.upsert(vectors, chunks, metadata)", note: "chunk 를 embedding 하고 knowledge base 색인에 넣습니다." },
            { code: "if source_updated(doc): rerun steps 1-4 for doc only", note: "원본이 바뀌면 그 source 에서 파생된 chunk 만 다시 만들어 index 를 갱신합니다." },
          ]}
          output="검색 가능한 knowledge base — chunk, (선택) context prefix, embedding, metadata 를 갖춘 index"
        />
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 Anthropic 의 실측 수치와 LangChain·LlamaIndex 의 공식 구현 문서입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Contextual retrieval 의 실패율 수치는 Anthropic 이 공개한 실험 결과를, chunk size·
            overlap·separator 계층은 LangChain 의 공식 문서를, semantic chunking 의 percentile
            threshold 는 LlamaIndex 의 공식 구현 문서를 근거로 삼았습니다.
          </p>
        </div>
        <div id="paper-anthropic" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Anthropic · Introducing Contextual Retrieval"
            citeKey={1}
            href="https://www.anthropic.com/news/contextual-retrieval"
            type="code"
          >
            Chunk 앞에 LLM 이 생성한 문서 맥락 설명을 붙여 embedding·BM25 색인에 넣는 방법을
            제시하고, codebase·소설·arXiv·과학 논문 데이터셋에서 top-20 chunk 검색 실패율을
            5.7 %에서 contextual embedding 만으로 3.7 %, contextual BM25 를 더해 2.9 %, reranking
            까지 더해 1.9 %로 낮췄다고 보고합니다. Prompt caching 을 쓰면 문서 100 만 token 당
            1.02 달러의 일회성 비용으로 처리된다고 밝힙니다.
          </CitationBlock>
        </div>
        <div id="paper-langchain" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="LangChain · Text splitters (공식 문서)"
            citeKey={2}
            href="https://python.langchain.com/docs/concepts/text_splitters/"
            type="code"
          >
            Chunk size 와 chunk overlap 을 받는 fixed-size 분할과, 문단(\n\n) → 줄바꿈(\n) → 공백
            → 문자 순서로 구분자를 차례로 시도하는 RecursiveCharacterTextSplitter 의 계층적 분할
            방식을 정의합니다. Markdown·HTML 처럼 구조가 있는 문서는 헤더·태그를 먼저 구분자로
            쓰는 전용 splitter 를 따로 둡니다.
          </CitationBlock>
        </div>
        <div id="paper-llamaindex" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="LlamaIndex · Node Parser Modules (공식 문서)"
            citeKey={3}
            href="https://developers.llamaindex.ai/python/framework/module_guides/loading/node_parsers/modules/"
            type="code"
          >
            SentenceSplitter 가 문장 경계를 존중하며 chunk_size·chunk_overlap 으로 자르는 방식과,
            SemanticSplitterNodeParser 가 이웃 문장 embedding 유사도의 breakpoint_percentile_threshold
            (예시 값 95)와 buffer_size 로 경계를 정하는 방식을 정의합니다. 영어 문장 분리 정규식
            기준이라 다른 언어에는 threshold 를 다시 조정해야 한다고 명시합니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Chunking 뒤에 오는 embedding 버전 계약과 검색 funnel 은{" "}
          <Link to="/ai/rag-pipeline#embedding">RAG 파이프라인 글</Link>이 정본입니다. 검색 결과를
          어떻게 재검색·재작성해 recall 을 더 올리는지는{" "}
          <Link to="/ai/query-transformation-and-adaptive-retrieval#overview">
            Query 변환과 적응형 검색 글
          </Link>
          로 이어집니다.
        </p>
      </section>
    </div>
  );
}
