import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  RagIngestionLocator,
  RagIngestionReturn,
} from "./rag-ingestion-and-chunking/RagIngestionLocator";
import RagIngestionAndChunkingViz from "./rag-ingestion-and-chunking/viz/RagIngestionAndChunkingViz";

export default function RagIngestionAndChunkingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <RagIngestionLocator />
        <RagIngestionAndChunkingViz />
        <h2 className="mb-6 text-2xl font-bold">
          문서 한 건이 검색 단위가 되기까지
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            환불 규정이 v16에서 v17로 바뀌었다고 하겠습니다. 파일을 다시
            올리는 것만으로는 충분하지 않습니다. 질문이 v17을 검색해야 하고,
            답변의 인용은 v17 원문의 정확한 위치를 가리켜야 하며, v16에서
            파생된 chunk는 더 이상 검색되면 안 됩니다.
          </p>
          <p>
            이 글은 부모 글에서 본 RAG 전체 경로 가운데 질문 전에 실행되는
            부분만 엽니다. 원문을 구조 있는 element로 바꾸고, 검색 단위로
            나누고, 필요한 문맥을 보충한 뒤 색인 작업에 넘기는 과정입니다.
          </p>
          <p>
            계속 추적할 사례는 <strong>policy-v17 → element e-037 → chunk
            c-8f31 → index-v42</strong>입니다. ID와 개수는 동작을 설명하기 위한
            가정이며 실제 측정값이 아닙니다. Embedding 모델 선택과 후보 검색은
            이 글이 정하지 않습니다.
          </p>
        </div>
        <ContentBoundary article="rag-ingestion-and-chunking" />
      </section>

      <section id="parsing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">구조 보존</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            PDF에서 글자를 읽었다고 파싱이 끝나는 것은 아닙니다. 제목 계층,
            문단 순서, 표의 머리글과 행 관계, 페이지와 원문 offset을 함께
            보존해야 뒤 단계가 “이 문장은 어디에서 왔는가”에 답할 수 있습니다.
          </p>
          <p>
            예를 들어 e-037이 <code>환불 &gt; 예외</code> 아래의 1180~1540
            문자 구간이라고 기록하면, 나중에 만들어진 c-8f31을 원문 §4.2로
            되돌릴 수 있습니다. 문자열만 남기면 같은 문장이 어느 revision의
            어느 표·문단에서 나왔는지 잃습니다.
          </p>
          <p>
            표 셀을 어떤 순서로 복원하고 스캔 PDF의 layout을 어떻게 읽는지는
            <Link to="/cs/ai/document-parsing-and-table-extraction">
              문서 구조 파싱 글
            </Link>
            에서 더 깊이 다룹니다. 여기서는 파서의 출력 계약만 사용합니다.
          </p>
        </div>
        <TermBreakdown
          title="파서가 다음 단계에 넘기는 최소 기록"
          description="본문 내용과 원문으로 돌아갈 좌표를 분리해 보존합니다."
          items={[
            {
              term: "Element",
              description: "제목·문단·표처럼 구조와 종류를 가진 파싱 결과입니다.",
              example: "e-037 · paragraph · heading_path=환불/예외.",
              boundary: "텍스트만 같아도 revision이나 위치가 다르면 다른 element입니다.",
            },
            {
              term: "Provenance",
              description: "파생 데이터가 어느 원문에서 나왔는지 되짚는 기록입니다.",
              example: "source=policy, revision=v17, page=7, offset=1180:1540.",
              boundary: "파일 이름 하나는 내용 변경과 같은 이름의 재업로드를 구분하지 못합니다.",
            },
          ]}
        />
      </section>

      <section id="chunking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">고정 경계</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고정 길이 분할은 한 chunk의 최대 길이와 다음 chunk가 다시 포함할
            길이를 정합니다. 1,000 token 문서를 size 500, overlap 50으로
            자르면 다음 시작점은 450 token씩 전진합니다.
          </p>
        </div>
        <ExplainedFormula
          question="1,000-token 문서는 몇 개의 chunk가 될까요?"
          idea="첫 chunk 하나를 만든 뒤, 아직 덮지 못한 길이를 stride로 몇 번 더 전진해야 하는지 계산합니다."
          formula={String.raw`N=\begin{cases}1,&L\le s\\1+\left\lceil\dfrac{L-s}{s-o}\right\rceil,&L>s\end{cases}`}
          annotatedFormula={String.raw`N=\begin{cases}1,&\underbrace{L\le s}_{\text{한 chunk 안에 들어감}}\\1+\left\lceil\underbrace{\dfrac{L-s}{s-o}}_{\text{남은 길이 ÷ stride}}\right\rceil,&L>s\end{cases}`}
          operations={[
            {
              expression: String.raw`s-o`,
              annotation: ["500−50=450", "다음 시작점이 전진하는 stride"],
            },
            {
              expression: String.raw`L-s`,
              annotation: ["1,000−500=500", "첫 chunk가 덮고 남은 길이"],
            },
            {
              expression: String.raw`1+\left\lceil 500/450\right\rceil`,
              annotation: ["첫 chunk 1개에 두 번의 전진을 더해", "총 3개"],
            },
          ]}
          terms={[
            { symbol: "L", name: "문서 길이", description: "같은 tokenizer로 센 전체 token 수입니다." },
            { symbol: "s", name: "chunk size", description: "한 chunk의 최대 token 수입니다." },
            { symbol: "o", name: "overlap", description: "이웃 chunk가 함께 담는 token 수입니다." },
            { symbol: "N", name: "chunk 수", description: "끝의 짧은 조각까지 포함한 결과 개수입니다." },
          ]}
          assumptions={[
            "0 ≤ overlap < chunk size이고 길이는 같은 tokenizer의 token 단위입니다.",
            "문장·표·제목 경계를 보지 않고 길이만으로 자르는 설명용 계산입니다.",
            "마지막에 짧게 남은 구간도 chunk 하나로 셉니다.",
          ]}
          interpretation="시작점은 0, 450, 900이고 구간은 [0,500), [450,950), [900,1,000)입니다. 480~530 문장은 두 번째 chunk에 온전히 들어가지만, overlap이 없으면 두 chunk에 나뉩니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Overlap은 경계 손실을 줄이지만 없애지는 않습니다. 경계를 가로지르는
            span이 overlap보다 길거나, 표의 머리글과 행이 더 멀리 떨어져 있으면
            어느 chunk에도 완전한 의미가 남지 않을 수 있습니다.
          </p>
          <p>
            Size를 키우면 더 많은 문맥이 한 덩어리에 남는 대신 서로 다른
            주제가 섞일 수 있습니다. Size를 줄이면 후보는 세밀해지지만 조건과
            예외가 갈라지고 저장·검색할 chunk 수도 늘어납니다. 따라서 “500과
            50이 정답”이 아니라 평가 질문과 문서 구조에 맞춰 비교해야 합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Size를 키우면 정답 근거도 항상 더 잘 남을까요?"
          preview="아닙니다. 경계 손실은 줄어도 무관한 문장이 섞인 큰 chunk가 검색 후보에서 밀리면 최종 문맥에는 들어가지 못합니다."
        >
          <p>
            분할 단계에서는 원문 span이 chunk에 들어갔는지 확인할 수 있습니다.
            검색과 문맥 조립을 거친 뒤 실제 답변 입력에 남았는지는 부모 글의
            <Link to="/cs/ai/rag-pipeline#evaluation">단계별 평가</Link>에서
            따로 측정합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="semantic-chunking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">의미 경계</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            의미 기반 분할은 일정한 token 위치 대신 이웃 문장 묶음의 embedding
            거리가 크게 벌어지는 지점을 경계 후보로 삼습니다. 결과 chunk의
            길이는 같지 않지만, 화제가 바뀌는 곳에서 나눌 수 있습니다.
          </p>
          <p>
            LlamaIndex의 <code>SemanticSplitterNodeParser</code>는
            <code>buffer_size</code>만큼 문장을 묶어 비교하고, 이웃 묶음 사이
            cosine dissimilarity가 지정한 percentile을 넘을 때 node를 나눕니다.
            현재 공식 API 문서의 기본값은 buffer 1, percentile 95입니다. 이는
            구현 기본값이지 모든 한국어 문서에 맞는 최적값이 아닙니다.
          </p>
          <p>
            이 방식에는 문장 분리와 추가 embedding 계산이 필요합니다. 표나
            코드처럼 문장 유사도만으로 구조를 설명하기 어려운 자료에서는
            제목·표 경계를 먼저 보존하는 구조 기반 분할이 더 중요할 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="두 경계가 보는 신호"
          items={[
            {
              term: "Fixed-size",
              description: "같은 길이와 overlap 규칙으로 시작 위치를 계산합니다.",
              example: "0·450·900 token에서 시작합니다.",
              boundary: "내용의 전환과 무관하게 잘릴 수 있습니다.",
            },
            {
              term: "Semantic",
              description: "이웃 문장 묶음의 의미 거리가 큰 위치를 찾습니다.",
              example: "거리 분포의 95 percentile을 넘는 경계를 선택합니다.",
              boundary: "추가 모델 계산과 언어별 문장 분리 품질에 의존합니다.",
            },
          ]}
        />
      </section>

      <section id="contextual-retrieval" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문맥 보충</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            “요청 뒤 7일 안에 가능합니다”라는 chunk만 보면 무엇을 요청한
            것인지 알기 어렵습니다. Contextual Retrieval은 문서 전체를 참고해
            만든 짧은 설명을 chunk 앞에 붙이고, 그 텍스트를 embedding과 BM25
            색인의 입력으로 사용합니다.
          </p>
          <p>
            Anthropic의 예에서 contextual text는 보통 50~100 token입니다.
            공식 자기보고 실험에서는 top-20 검색 실패율이 5.7%에서 contextual
            embedding 3.7%, contextual BM25까지 2.9%, reranking까지 1.9%로
            낮아졌습니다. 이 값은 해당 데이터셋·모델·검색 설정의 결과이며,
            우리 문서에서도 같은 폭으로 줄어든다는 뜻은 아닙니다.
          </p>
          <p>
            검색용 prefix와 인용할 원문은 분리해 보존해야 합니다. Prefix가
            잘못 생성되거나 나중에 생성 모델을 바꾸더라도 raw chunk와 원문
            위치는 그대로 확인할 수 있어야 합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="의미 기반 분할과 문맥 prefix는 같은 기능일까요?"
          preview="아닙니다. 하나는 어디서 자를지 정하고, 다른 하나는 잘린 조각만으로 알 수 없는 배경을 검색 입력에 보충합니다."
        >
          <p>
            Fixed-size와 semantic chunking 어느 쪽을 쓰더라도 잘린 조각은
            문서 전체의 맥락을 잃을 수 있습니다. Contextual prefix는 그 뒤에
            선택적으로 붙는 별도 파생물입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">증분 반영</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원문 revision을 키로 삼으면 바뀐 문서만 다시 처리할 수 있습니다.
            하지만 새 chunk가 준비되기 전에 이전 chunk를 지우면 검색 공백이
            생기고, 새것만 추가하면 v16과 v17이 함께 검색됩니다. 그래서
            staging manifest를 검증한 뒤 active alias를 바꾸고 이전 revision을
            검색에서 제외합니다.
          </p>
        </div>
        <AlgorithmBlock
          title="policy-v17 수집에서 active index 반영까지"
          input={[
            "source=policy/refund, revision=v17, content_hash=7a2…, ACL=employee",
            "parser·splitter·contextualizer·embedding 설정 버전",
            "현재 active manifest=index-v41",
          ]}
          steps={[
            {
              code: "if manifest.has(source, revision, config_hash): return existing_receipt",
              note: "같은 원문과 같은 설정을 다시 받으면 중복 파생물을 만들지 않습니다.",
            },
            {
              code: "elements = parse(source_blob, keep=[heading, table, page, offset])",
              note: "텍스트와 함께 원문으로 돌아갈 구조와 위치를 보존합니다.",
            },
            {
              code: "chunks = split(elements, size=500, overlap=50)",
              note: "각 chunk에 source revision·element ID·offset·분할 설정을 붙입니다.",
            },
            {
              code: "search_text = contextualize(chunk); keep(raw_text, search_text)",
              note: "문맥 보충을 쓴다면 검색용 텍스트와 인용할 원문을 분리합니다.",
            },
            {
              code: "upsert(staging_index, embed(search_text), metadata)",
              note: "Embedding 작업은 source·revision·ACL·설정 checksum이 든 payload를 받습니다.",
            },
            {
              code: "validate(staging_manifest); swap_alias(); tombstone(v16_chunks)",
              note: "새 revision이 완전한지 확인한 뒤 공개하고 이전 파생물을 검색에서 뺍니다.",
            },
          ]}
          output="index-v42 manifest와 source→element→chunk→vector lineage, 이전 revision tombstone"
        />
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">근거</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            수치와 API 기본값은 아래 공식 자료의 범위에서만 사용했습니다.
            실제 chunk 크기와 경계 방식은 우리 문서와 질문 집합에서 별도로
            평가해야 합니다.
          </p>
        </div>
        <div id="paper-anthropic" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Anthropic · Contextual Retrieval"
            citeKey={1}
            href="https://www.anthropic.com/research/contextual-retrieval"
            type="code"
          >
            Chunk별 짧은 설명을 원문 앞에 붙여 contextual embedding과 BM25
            색인을 만드는 방법, prompt caching 비용 가정, top-20 실패율
            5.7→3.7→2.9→1.9%의 자기보고 실험 범위를 확인했습니다.
          </CitationBlock>
        </div>
        <div id="paper-langchain" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="LangChain TextSplitter · Python reference v1.1.2"
            citeKey={2}
            href="https://reference.langchain.com/python/langchain-text-splitters/base/TextSplitter"
            type="code"
          >
            chunk_size·chunk_overlap·length_function·add_start_index가 분할 결과를
            결정한다는 현재 공식 API 계약을 확인했습니다. 기본값을 이 글의
            권장값으로 사용하지는 않았습니다.
          </CitationBlock>
        </div>
        <div id="paper-llamaindex" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="LlamaIndex · SemanticSplitterNodeParser API"
            citeKey={3}
            href="https://docs.llamaindex.ai/en/stable/api_reference/node_parsers/semantic_splitter/"
            type="code"
          >
            buffer_size와 breakpoint_percentile_threshold가 이웃 문장 묶음의
            cosine dissimilarity로 node 경계를 정하며, 현재 문서의 기본값이
            각각 1과 95임을 확인했습니다.
          </CitationBlock>
        </div>
      </section>

      <RagIngestionReturn />
    </div>
  );
}
