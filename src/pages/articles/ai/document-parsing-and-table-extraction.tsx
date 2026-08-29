import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import DocumentParsingAndTableExtractionViz from "./document-parsing-and-table-extraction/viz/DocumentParsingAndTableExtractionViz";

/**
 * 문서 구조 파싱: layout·reading order·OCR·표 추출과 linearization
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function DocumentParsingAndTableExtractionArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          문서 구조 파싱은 layout·순서·표 구조를 지켜야 뜻이 보존됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            PDF·HTML 문서를 그냥 pure text로 뽑으면 다단 레이아웃은 읽는 순서가 뒤섞이고, 표는 셀
            경계가 사라져 숫자가 엉뚱한 항목에 붙습니다. 표·다단 레이아웃처럼 구조가 있는 문서는
            layout을 분석하고 순서를 복원해야 뜻이 살아 있는 텍스트로 바뀝니다.
          </p>
          <p>
            이 글은 PDF·HTML에서 layout을 나누고 reading order를 복원하는 단계부터 시작해, OCR로
            이미지 문서를 읽고 표 영역을 찾아 구조를 인식한 뒤, 정규화와 linearization으로 LLM이
            읽을 수 있는 형태까지 만드는 하나의 파이프라인을 다룹니다.
          </p>
          <p>
            <Link to="/ai/rag-ingestion-and-chunking#parsing">RAG ingestion</Link> 글의 parsing
            단계는 표 셀 복원과 스캔 문서 layout 분석의 세부를 이 글에 넘겨 두고, 그 결과로 나온
            텍스트를 고정 길이나 문장 경계로 나누는 chunking 자체만 다룹니다. 이 글은 그 세부, 즉
            구조가 있는 문서를 chunking 이전에 어떻게 구조화하는지에만 집중합니다.
          </p>
        </div>
        <ContentBoundary article="document-parsing-and-table-extraction" />
      </section>

      <section id="layout-and-order" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Layout parsing은 문서를 영역으로 나누고 reading order는 그 순서를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Layout parsing은 문서를 title·paragraph·table 같은 영역으로 나누는 작업이고, reading
            order detection은 그 영역들을 사람이 실제로 읽는 순서로 정렬하는 작업입니다. 이 둘을
            합쳐 문서의 전체 구조를 뽑아내는 과정을 document structure extraction이라고
            부릅니다.
          </p>
          <p>
            PDF는 텍스트를 저장한 순서가 화면에 보이는 순서와 다를 수 있습니다. 2단 컬럼
            페이지에서 왼쪽 컬럼 문단을 채 읽기 전에 오른쪽 컬럼으로 건너뛰면, 왼쪽 마지막 문장과
            오른쪽 첫 문장이 그대로 이어 붙어 전혀 다른 문장이 만들어집니다.
          </p>
          <p>
            PyMuPDF는 get_text(sort=True) 옵션으로 좌상단에서 우하단 순서로 텍스트를 재정렬하거나,
            blocks·dict 형식으로 각 텍스트 블록의 좌표를 받아 reading order를 직접 계산하는
            방법을 제공합니다. 좌표만으로 순서를 복원하면 이미지·표 영역이 섞인 페이지에서는
            여전히 어긋날 수 있습니다.
          </p>
          <p>
            PDF parsing은 페이지 안 문자·선·이미지의 좌표를 읽어 내는 것이고, HTML parsing은 태그
            구조를 DOM tree, 즉 요소를 부모·자식 관계로 나타낸 트리로 바꾸는 것입니다. DOM tree는
            태그 자체가 계층을 담고 있어 PDF보다 순서 복원이 쉽지만, rowspan·colspan 같은 표 셀
            구조는 HTML에서도 따로 해석해야 합니다.
          </p>
          <p>
            pdfplumber는 그래픽 선이나 단어 정렬로 암시된 선을 찾아 그 교차점을 표 셀 경계로 잡는
            방식으로 PDF 안의 표 영역을 감지합니다. 이 감지 결과가 다음 절에서 다룰 table
            extraction의 입력이 됩니다.
          </p>
        </div>
        <TermBreakdown
          title="문서 구조를 이루는 여섯 개념"
          description="영역을 나누는 것, 순서를 정하는 것, 포맷별로 그 원소를 읽어 내는 것은 서로 다른 단계입니다."
          items={[
            { term: "Document Structure Extraction", description: "Layout parsing과 reading order를 합쳐 문서 전체 구조를 뽑는 과정입니다.", example: "제목·문단·표 영역을 나눈 뒤 읽는 순서로 정렬.", boundary: "영역 분류가 틀리면 순서를 아무리 잘 정해도 잘못된 구조가 됩니다." },
            { term: "Layout Parsing", description: "문서를 title·paragraph·table 같은 영역으로 나눕니다.", example: "페이지 하나를 제목 1개·본문 3개·표 1개 영역으로 분류.", boundary: "영역 경계가 애매한 디자인(사이드바 등)에서는 오분류가 늘어납니다." },
            { term: "Reading Order Detection", description: "나뉜 영역을 사람이 읽는 순서로 정렬합니다.", example: "2단 컬럼에서 왼쪽 컬럼 전체 다음 오른쪽 컬럼 순서로 정렬.", boundary: "좌표만으로는 표·그림이 섞인 복잡한 레이아웃에서 순서가 어긋날 수 있습니다." },
            { term: "PDF Parsing", description: "페이지 안 문자·선·이미지의 좌표를 읽어 냅니다.", example: "pdfplumber로 선의 교차점을 찾아 표 셀 경계로 사용.", boundary: "스캔 이미지 PDF는 문자 좌표 자체가 없어 OCR이 먼저 필요합니다." },
            { term: "HTML Parsing", description: "태그 구조를 DOM tree로 바꿉니다.", example: "&lt;table&gt;&lt;tr&gt;&lt;td&gt; 태그를 부모·자식 노드로 변환.", boundary: "태그 계층이 있어도 rowspan·colspan 속성은 별도로 해석해야 합니다." },
            { term: "DOM Tree", description: "HTML 요소를 부모·자식 관계로 나타낸 트리 구조입니다.", example: "document 노드 아래 html→body→table→tr→td 순서의 계층.", boundary: "트리 순서가 시각적 순서와 항상 같지는 않습니다(CSS로 재배치 가능)." },
          ]}
        />
      </section>

      <section id="ocr" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          OCR은 문자를 읽고 layout-aware OCR은 그 위치를 구조에 묶어 둡니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            OCR(광학 문자 인식)은 스캔 이미지나 사진 속 문자를 인식해 텍스트로 바꾸는
            기술입니다. 일반 OCR은 문자열만 뽑아내고 그 문자가 원래 어느 영역, 예를 들어
            제목인지 표인지는 버립니다.
          </p>
          <p>
            스캔된 표 이미지를 일반 OCR로 그대로 읽으면 셀마다 있던 숫자가 한 줄로 이어져,
            "2024 Q1 120 Q2 150"처럼 어느 숫자가 어느 열에 속했는지 문자열만으로는 알 수
            없습니다.
          </p>
          <p>
            Layout-aware OCR은 먼저 layout parsing으로 영역을 나누고 그 bounding box 좌표를
            유지한 채 문자만 인식해, 인식된 텍스트를 원래 영역·셀에 좌표로 이어 붙입니다.
            Unstructured 라이브러리의 hi_res 전략이 이 순서로 동작하고, ocr_only 전략은 layout
            분석 없이 이미지 전체를 텍스트로만 읽습니다.
          </p>
          <p>
            Layout-aware OCR도 문자 인식 자체의 정확도를 높여 주지는 않습니다. 글자가 틀리는
            문제와 그 글자가 어느 구조에 속하는지 모르는 문제는 원인이 달라 따로 풀어야 합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="OCR 전략은 auto·hi_res·ocr_only 중 언제 무엇을 고르나요?"
          preview="레이아웃 정보가 필요하면 hi_res, 스캔 이미지 전체를 빠르게 텍스트로만 뽑으면 ocr_only, 문서 종류를 모르면 auto가 적절합니다."
        >
          <p>
            auto 전략은 PDF에 이미 텍스트 layer가 있으면 OCR을 건너뛰고, 스캔 이미지처럼 텍스트
            layer가 없을 때만 자동으로 OCR 경로로 전환합니다. 문서 대부분이 born-digital PDF라면
            auto가 불필요한 OCR 호출을 줄여 줍니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="table-structure" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Table extraction이 영역을, structure recognition이 셀 구조를 찾습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Table extraction은 문서에서 표가 있는 영역을 찾는 것이고, table structure
            recognition은 그 영역 안에서 행·열과 병합 셀(rowspan·colspan), 헤더 위치까지
            복원하는 것입니다. 영역만 찾고 구조를 복원하지 않으면 표는 그냥 줄글 텍스트
            덩어리가 됩니다.
          </p>
          <p>
            Microsoft의 Table Transformer는 표 100만 개로 만든 PubTables-1M 데이터셋에서 구조를
            인식합니다. 셀 위치만 맞히는 GriTS_Top 점수는 0.9849로 거의 완벽하지만, 셀 내용까지
            정확히 일치해야 하는 AccCon 점수는 0.8243으로 떨어집니다. 병합 셀·헤더가 섞인 표는
            위치를 맞혀도 내용까지 맞히기가 그만큼 더 어렵다는 뜻입니다.
          </p>
        </div>
        <DocumentParsingAndTableExtractionViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            rowspan은 한 셀이 아래로 여러 행에 걸치는 병합, colspan은 옆으로 여러 열에 걸치는
            병합을 나타내는 속성입니다. 예를 들어 헤더 1행이 "지표"와 colspan=2인 "2024" 두
            셀뿐이고, 2행은 빈칸·"Q1"·"Q2" 세 셀이며, 데이터 행은 "매출·120·150" 세 칸이라고
            합시다.
          </p>
          <p>
            colspan을 무시하고 셀 개수 그대로 두면 1행은 2칸, 2행과 데이터 행은 3칸으로 열
            개수 자체가 어긋납니다. "2024"를 colspan만큼 두 칸으로 펼쳐야 1행도 3칸이 되어
            "2024"가 "Q1"·"Q2" 두 칸 모두와 짝지어지고, 그제서야 "매출" 행의 120·150이 각각 맞는
            열에 놓입니다.
          </p>
          <p>
            Multi-level header는 이렇게 표 위쪽에 여러 행으로 쌓인 헤더 구조를 가리킵니다. 이를
            하나의 flat header로 합치는 절차는 각 헤더 셀을 colspan만큼 실제 열 개수로 펼친 뒤,
            같은 열에 속한 여러 행의 헤더 텍스트를 위에서 아래 순서로 이어 붙여 "2024 Q1"처럼
            하나의 열 이름을 만드는 것입니다.
          </p>
        </div>
        <TermBreakdown
          title="표 구조 인식을 이루는 여섯 개념"
          description="영역을 찾는 것과 그 안의 셀·병합·헤더 구조를 복원하는 것은 다른 난이도의 작업입니다."
          items={[
            { term: "Table Extraction", description: "문서에서 표가 있는 영역을 찾습니다.", example: "페이지에서 표 bounding box 1개를 검출.", boundary: "영역만 찾고 셀 구조까지 복원하지는 않습니다." },
            { term: "Table Structure Recognition", description: "표 영역 안 행·열·헤더 위치를 복원합니다.", example: "GriTS_Top 0.9849, AccCon 0.8243(PubTables-1M 기준).", boundary: "위치 정확도가 높아도 병합 셀 내용까지 맞히는 정확도는 더 낮습니다." },
            { term: "rowspan", description: "한 셀이 아래로 여러 행에 걸치는 병합입니다.", example: "'지표' 헤더 셀이 2개 행에 걸쳐 표시.", boundary: "펼치지 않으면 아래 행의 열 개수가 줄어든 것처럼 보입니다." },
            { term: "colspan", description: "한 셀이 옆으로 여러 열에 걸치는 병합입니다.", example: "'2024' 헤더 셀이 'Q1'·'Q2' 두 열에 걸쳐 표시.", boundary: "펼치지 않으면 데이터 행과 헤더 행의 열 개수가 어긋납니다." },
            { term: "Multi-Level Header", description: "여러 행에 걸쳐 쌓인 헤더 구조입니다.", example: "1행 '2024', 2행 'Q1'·'Q2'로 이뤄진 2단 헤더.", boundary: "행을 그대로 이어 붙이면 헤더가 아니라 데이터처럼 취급될 수 있습니다." },
            { term: "Merged Cell Expansion", description: "병합 셀을 실제 열 개수로 펼쳐 되돌리는 작업입니다.", example: "colspan=2 셀 하나를 같은 값의 두 셀로 복제.", boundary: "펼치는 규칙을 잘못 적용하면 없던 열이 생기거나 값이 중복될 수 있습니다." },
          ]}
        />
      </section>

      <section id="table-normalization" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Table normalization은 규격화하고 linearization은 문장으로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Table normalization은 인식된 표를 병합 셀이 모두 펼쳐지고 헤더가 한 행으로 합쳐진
            규격 형태, 즉 모든 행의 열 개수가 같은 사각형 테이블로 만드는 작업입니다. 이
            규격화가 끝나야 표를 markdown이나 문장으로 옮기는 linearization을 적용할 수
            있습니다.
          </p>
          <p>
            Row-level representation은 표의 각 행을 "열 이름=값" 나열로 바꿔 행 하나가 그
            자체로 독립된 문장처럼 읽히게 만드는 형태입니다. 앞의 매출 행은 "매출: 2024
            Q1=120, 2024 Q2=150"처럼 열 이름을 값에 직접 붙여 표현합니다.
          </p>
          <p>
            표를 LLM이 읽게 만드는 linearization은 크게 두 방식입니다. Markdown 표 방식은
            "| 지표 | 2024 Q1 | 2024 Q2 |"처럼 열 그대로의 표 모양을 유지해 열 사이 관계가
            한눈에 보이고, row-level 문장 방식은 행마다 열 이름을 반복해 행 하나만 떼어내도
            뜻이 통합니다.
          </p>
          <p>
            Markdown 표는 헤더가 맨 위 한 줄뿐이라 표가 chunk 경계에서 잘리면 뒤쪽 행은 헤더
            없이 숫자만 남습니다. Row-level 문장은 행마다 열 이름을 반복해 어느 chunk에
            들어가도 뜻을 유지하지만, 같은 이름을 행마다 반복해 전체 크기는 markdown보다
            커집니다.
          </p>
        </div>
        <AlgorithmBlock
          title="PDF에서 linearized 표까지 이어지는 구조 파싱 파이프라인"
          input={[
            "원본 PDF 또는 HTML 문서",
            "layout 모델 또는 태그 구조(DOM tree)",
            "표 구조 인식 모델(예: Table Transformer)",
            "linearization 방식 선택(markdown | row-level)",
          ]}
          steps={[
            { code: "regions = detect_layout(page)", note: "Layout parsing이 페이지를 title·paragraph·table 같은 영역으로 나눕니다." },
            { code: "order = sort_reading_order(regions)", note: "Reading order detection이 영역 좌표를 사람이 읽는 순서로 정렬합니다." },
            { code: "text = ocr_if_scanned(order)", note: "스캔 문서라면 layout-aware OCR이 영역 좌표를 유지한 채 문자를 인식합니다." },
            { code: "table_boxes = detect_tables(order)", note: "Table extraction이 표라고 분류된 영역만 따로 찾습니다." },
            { code: "cells = recognize_structure(table_boxes)", note: "Table structure recognition이 rowspan·colspan·헤더 위치를 복원합니다." },
            { code: "grid = normalize(expand_merged_cells(cells))", note: "병합 셀·multi-level header를 펼친 뒤 열 개수가 같은 사각형 grid로 만듭니다." },
            { code: "text_out = linearize(grid, mode)", note: "선택한 방식(markdown | row-level)으로 표를 LLM이 읽을 텍스트로 바꿉니다." },
          ]}
          output="위치·순서·구조가 보존된 문서 텍스트와 표별 linearized 텍스트"
        />
      </section>

      <section id="metadata-and-chunking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Table metadata·provenance가 있어야 chunking이 안전합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Table metadata는 표 하나에 붙는 페이지 번호·좌표·원본 파일·컬럼 이름 같은 부가
            정보입니다. 이 정보가 없으면 linearize된 텍스트만 남아 어느 문서 몇 페이지에서 나온
            표인지 되짚을 수 없습니다.
          </p>
          <p>
            Document provenance는 추출된 표 값을 원본 문서의 정확한 위치, 즉 페이지·bounding
            box·파일 버전까지 연결해 답을 검증할 수 있게 하는 계약입니다. Unstructured
            라이브러리는 표를 chunk로 나눌 때 원본 요소를 metadata.orig_elements 필드에 남겨,
            나중에 페이지 번호와 좌표를 다시 조회할 수 있게 합니다.
          </p>
          <p>
            Structure-preserving chunking은 표나 다단 레이아웃처럼 구조가 있는 블록을 일반
            chunking 규칙(고정 길이·문장 경계)으로 자르지 않고, 표 전체나 최소한 행 단위로
            나누는 chunking 방법입니다. Unstructured의 chunking 전략은 표 요소를 다른 요소와
            절대 합치지 않고, 최대 크기를 넘으면 표 전용 TableChunk로만 나눕니다.
          </p>
          <p>
            고정 길이 512 token 규칙을 표에 그대로 적용하면, 헤더 행은 앞 chunk에 남고 데이터
            행 절반은 다음 chunk로 넘어가 뒤 chunk만 읽는 검색에서는 숫자가 무슨 열인지 알 수
            없습니다. Structure-preserving chunking은 표를 통째로 한 chunk에 두거나, 쪼개더라도
            row-level representation처럼 행마다 헤더를 반복해 조각마다 뜻을 지킵니다.
          </p>
          <p>
            표가 아닌 일반 본문의 chunk size·overlap·semantic chunking은{" "}
            <Link to="/ai/rag-ingestion-and-chunking#chunking">RAG ingestion</Link> 글의
            정본이며, 이 글은 표·다단 레이아웃이 그 규칙 앞에서 예외로 다뤄져야 하는 이유만
            다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="Metadata·provenance·chunking의 역할 구분"
          items={[
            { term: "Table Metadata", description: "표에 붙는 페이지·좌표·파일·컬럼 이름 같은 부가 정보입니다.", example: "page_number=12, coordinates, source_file='manual.pdf'.", boundary: "metadata 자체가 최신 문서 버전을 가리키는지는 별도로 확인해야 합니다." },
            { term: "Document Provenance", description: "추출 값을 원본 위치까지 연결해 검증 가능하게 하는 계약입니다.", example: "orig_elements로 chunk 하나에서도 원본 페이지·좌표 재조회.", boundary: "provenance가 있어도 원본 자체의 정확성까지 보장하지는 않습니다." },
            { term: "Structure-Preserving Chunking", description: "구조가 있는 블록을 표·행 단위로만 나눕니다.", example: "512 token 규칙 대신 표를 통째로 하나의 chunk로 유지.", boundary: "표를 통째로 두면 chunk 크기 상한을 넘는 큰 표는 별도 TableChunk 분할이 필요합니다." },
          ]}
        />
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 공식 도구 문서와 표 구조 인식 논문 두 계열로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Layout parsing과 reading order, OCR 전략은 Unstructured·pdfplumber·PyMuPDF의 공식
            문서를 근거로 삼았습니다.
          </p>
          <p>
            표 구조 인식과 linearization의 정확도 수치는 PubTables-1M(Table Transformer)과
            TableFormer 논문에서 가져왔습니다.
          </p>
          <p>
            Table metadata·provenance와 structure-preserving chunking은 Unstructured의
            chunking 문서를 근거로 삼았습니다.
          </p>
        </div>
        <div id="paper-unstructured-partition" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Unstructured.io · Partitioning (core-functionality docs)"
            citeKey={1}
            href="https://docs.unstructured.io/open-source/core-functionality/partitioning"
            type="code"
          >
            PDF·HTML·이미지에서 Title·NarrativeText·Table 같은 element로 문서를 나누고, 표는
            text_as_html metadata로 HTML 구조를 보존하며, OCR은 auto·hi_res·ocr_only 세 전략
            중 선택하는 partition 함수를 정의합니다.
          </CitationBlock>
        </div>
        <div id="paper-pdfplumber" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="jsvine · pdfplumber (공식 저장소)"
            citeKey={2}
            href="https://github.com/jsvine/pdfplumber"
            type="code"
          >
            그래픽 선이나 단어 정렬로 암시된 선을 찾아 교차점을 셀 경계로 잡는 lines·text·explicit
            세 표 감지 전략과, layout·sort 옵션으로 페이지 읽기 순서를 보존하는 텍스트 추출
            방법을 정의합니다.
          </CitationBlock>
        </div>
        <div id="paper-pymupdf" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="PyMuPDF · Text Extraction Recipes (공식 문서)"
            citeKey={3}
            href="https://pymupdf.readthedocs.io/en/latest/recipes-text.html"
            type="code"
          >
            다단 PDF에서 텍스트 저장 순서와 시각 순서가 달라지는 문제를 get_text(sort=True)와
            blocks·dict 좌표 기반 재정렬로 해결하는 방법을 설명합니다.
          </CitationBlock>
        </div>
        <div id="paper-pubtables1m" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Smock, Pesala, Abraham · PubTables-1M: Towards Comprehensive Table Extraction From Unstructured Documents (CVPR 2022)"
            citeKey={4}
            href="https://arxiv.org/abs/2110.00061"
          >
            표 100만 개 규모의 데이터셋을 정규화 절차로 만들고, transformer 기반 객체 탐지 모델
            하나로 표 탐지·구조 인식·기능 분석을 커스터마이징 없이 수행합니다. 구조 인식 모델은
            위치 기준 GriTS_Top 0.9849, 내용까지 맞아야 하는 AccCon 0.8243을 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-tableformer" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Nassar, Livathinos, Lysak, Staar · TableFormer: Table Structure Understanding With Transformers (CVPR 2022)"
            citeKey={5}
            href="https://arxiv.org/abs/2203.01017"
          >
            Transformer 기반 디코더로 표 구조를 HTML(rowspan·colspan 포함)로 예측하고 PDF에서
            직접 셀 내용을 추출합니다. TEDS 점수가 단순 표에서 91%→98.5%, 병합 셀·다단 헤더가
            있는 복잡 표에서 88.7%→95%로 보고됩니다.
          </CitationBlock>
        </div>
        <div id="paper-unstructured-chunking" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Unstructured.io · Chunking (core-functionality docs)"
            citeKey={6}
            href="https://docs.unstructured.io/open-source/core-functionality/chunking"
            type="code"
          >
            Table element를 다른 element와 절대 결합하지 않고 최대 크기를 넘으면 TableChunk로만
            분할하며, metadata.orig_elements 필드에 원본 요소(페이지 번호·좌표)를 보존해 chunk
            이후에도 조회할 수 있게 합니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          표를 만든 뒤 검색 단위로 자르는 chunk size·overlap·contextual retrieval은{" "}
          <Link to="/ai/rag-ingestion-and-chunking#chunking">RAG ingestion</Link> 글을, 그
          chunk가 retrieval·generation에서 어떻게 쓰이는지는{" "}
          <Link to="/ai/rag-pipeline#chunking">RAG 파이프라인</Link> 글을 참고하세요.
        </p>
      </section>
    </div>
  );
}
