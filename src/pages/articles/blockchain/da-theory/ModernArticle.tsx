import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import DataAvailabilityLocator, { DataAvailabilityMapReturn } from "./DataAvailabilityLocator";
import { DAArchitectureViz, DataAvailabilityTraceViz, ErasureGridViz } from "./viz/ModernDAViz";

function Boundary({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-l-2 border-primary/45 pl-4">
      <h3 className="break-keep text-sm font-bold text-foreground">{title}</h3>
      <div className="mt-2 text-sm leading-7 text-muted-foreground">{children}</div>
    </div>
  );
}

export default function ModernDAArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6 scroll-mt-20">
        <DataAvailabilityLocator current="da-theory" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold tracking-tight">전체 자료를 받지 않고도 다시 구할 수 있다고 어떻게 판단합니까?</h2>
        </div>
        <DataAvailabilityTraceViz />
        <p className="text-lg leading-8 text-foreground/90">
          원본 D0~D3 네 조각을 P4~P7까지 여덟 조각으로 늘렸다고 가정하겠습니다. 검증자는 서로 다른 보관자에게서 D1·P4·P6·P7을 받고, 각 조각이 게시자가 남긴 약속에 속하는지 확인한 뒤 원본 네 조각을 실제로 복원합니다.
        </p>
        <p>
          핵심은 한 번의 검사가 모든 질문에 답하지 않는다는 점입니다. 받은 조각이 진짜여도 나머지가 숨겨졌을 수 있고, 조각이 충분히 많아도 잘못된 규칙으로 만들었다면 복원이 실패할 수 있습니다. 이 글은 그 경계를 설명합니다. 버전 변경을 시험하고 되돌리는 방법은 <Link to="/cs/blockchain/da-validation#overview">실무 검증 글</Link>로 분리합니다.
        </p>
      </section>

      <section id="black-box" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">큰 흐름</p>
        <h2 className="break-keep text-2xl font-bold">늘리고, 약속하고, 나누고, 확인하고, 복원합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm sm:grid-cols-5">
          {[
            ["1", "늘리기", "D0~D3 → P4~P7"],
            ["2", "약속하기", "조각 집합을 짧은 값에 결속"],
            ["3", "나누기", "서로 다른 보관 경로"],
            ["4", "확인하기", "위치·증거·응답 시간"],
            ["5", "복원하기", "유효 조각 4개 → 원본"],
          ].map(([number, title, body]) => (
            <li key={number} className="min-w-0 bg-background p-3">
              <span className="font-mono text-[9px] font-black text-primary">{number}</span>
              <strong className="mt-1 block break-keep text-xs">{title}</strong>
              <span className="mt-2 block break-keep text-[10px] leading-5 text-muted-foreground">{body}</span>
            </li>
          ))}
        </ol>
        <p>
          약속값은 받은 조각의 출처를 확인하는 장치이고, 복원 규칙은 빠진 조각을 계산하는 장치이며, 여러 보관 경로는 자료를 실제로 받을 가능성을 만드는 장치입니다. 세 역할을 한 상자로 합치면 어느 단계가 실패했는지 찾을 수 없습니다.
        </p>
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">작은 수치 사례</p>
        <h2 className="break-keep text-2xl font-bold">네 조각을 여덟 조각으로 늘리면 절반의 유효 조각으로 원본을 구할 수 있습니다</h2>
        <ErasureGridViz />
        <p>
          원본 네 조각과 같은 크기의 복원용 조각 네 개를 더하므로 저장량은 두 배입니다. 대신 위치를 알고 손상된 값을 걸러 낼 수 있다면, 여덟 자리 중 서로 다른 유효 조각 네 개로 원본을 계산할 수 있습니다. “절반을 잃어도 된다”는 말은 이 조건을 생략한 줄임말입니다.
        </p>
      </section>

      <section id="separation" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">역할을 나눈 이유</p>
        <h2 className="break-keep text-2xl font-bold">조각의 진위, 복원 규칙, 네트워크 응답은 서로 다른 실패를 찾습니다</h2>
        <div className="not-prose grid gap-5 md:grid-cols-3">
          <Boundary title="받은 조각이 약속에 속합니까?">
            <p>조각과 증거를 약속값에 대조합니다. 성공해도 다른 조각을 누가 보관하는지는 알 수 없습니다.</p>
          </Boundary>
          <Boundary title="조각이 같은 복원 규칙을 따릅니까?">
            <p>조각 번호와 인코딩 규칙을 고정하고 실제 복원을 확인합니다. 잘못 만든 여분 조각은 많아도 도움이 되지 않습니다.</p>
          </Boundary>
          <Boundary title="정해진 시간 안에 충분히 받습니까?">
            <p>서로 다른 위치와 경로의 응답을 기록합니다. 한 보관자가 모든 요청을 통제하면 표본의 독립성이 사라집니다.</p>
          </Boundary>
        </div>
      </section>

      <section id="names" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">표준 이름</p>
        <h2 className="break-keep text-2xl font-bold">이제 각 역할에 이름을 붙일 수 있습니다</h2>
        <dl className="not-prose space-y-4">
          <div className="border-y border-border py-4"><dt className="font-bold">받은 조각의 진위 확인 → 진위성(authenticity)</dt><dd className="mt-2 text-sm leading-7 text-muted-foreground">KZG proof나 Merkle proof가 받은 값이 약속된 집합에 속하는지 확인합니다.</dd></div>
          <div className="border-b border-border pb-4"><dt className="font-bold">복원용 조각이 같은 규칙을 따름 → 인코딩 유효성(encoding validity)</dt><dd className="mt-2 text-sm leading-7 text-muted-foreground">Reed–Solomon 규칙, 조각 번호와 code profile이 맞는지 확인합니다.</dd></div>
          <div className="border-b border-border pb-4"><dt className="font-bold">자료를 제때 다시 얻을 수 있음 → 데이터 가용성(data availability)</dt><dd className="mt-2 text-sm leading-7 text-muted-foreground">정해진 네트워크·표본·응답 시간 조건에서 복원 임계값만큼 조각을 얻을 수 있는 성질입니다.</dd></div>
          <div className="border-b border-border pb-4"><dt className="font-bold">전체 대신 일부 위치를 요청함 → 데이터 가용성 표본 추출(DAS)</dt><dd className="mt-2 text-sm leading-7 text-muted-foreground">무작위 또는 프로토콜이 정한 위치의 응답으로 숨김 가능성을 확률적으로 줄입니다.</dd></div>
        </dl>
        <p>
          실행 결과가 올바른지를 묻는 유효성(validity)은 이 셋과 별도입니다. 자료를 모두 얻어도 계산이 틀릴 수 있고, 계산 증명이 맞아도 자료가 숨겨질 수 있습니다.
        </p>
      </section>

      <section id="erasure-code" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">복원 규칙</p>
        <h2 className="break-keep text-2xl font-bold">Reed–Solomon은 원본 복사본이 아니라 다항식의 추가 평가값을 만듭니다</h2>
        <p>
          유한체 위에서 D0~D3 네 값을 지나는 3차 이하 다항식을 정하고, 다른 네 지점에서 값을 더 계산하면 P4~P7을 얻습니다. 이를 (8,4) 코드라고 부릅니다. Code rate는 4÷8=1/2이고, 원본 대비 추가 공간은 (8−4)÷4=1입니다.
        </p>
        <p>
          어디가 비었는지 아는 누락(erasure)에서는 서로 다른 네 평가값으로 다항식을 보간할 수 있습니다. 반면 잘못된 값의 위치도 모르는 오류(error)는 위치와 값을 함께 찾아야 하므로 같은 여분으로 고칠 수 있는 수가 줄어듭니다. 다항식과 거리 계산은 <Link to="/cs/blockchain/erasure-coding#reed-solomon">Erasure coding 글</Link>이 맡습니다.
        </p>
      </section>

      <section id="eip4844" className="space-y-6 scroll-mt-20">
        <p className="text-xs font-bold text-primary">전체 수신 단계</p>
        <h2 className="break-keep text-2xl font-bold">EIP-4844는 blob을 별도 운반하지만 합의 노드는 sidecar 전체를 받습니다</h2>
        <p>
          Type-3 거래에는 blob 원문 대신 versioned hash 목록이 들어갑니다. Blob, KZG commitment와 proof는 합의 계층의 sidecar로 함께 전파됩니다. EVM contract는 blob byte를 직접 읽지 않고, 거래의 versioned hash와 sidecar commitment가 연결됐는지를 확인합니다.
        </p>
        <ExplainedFormula
          question="EIP-4844 blob 하나의 고정 byte 수는 어떻게 계산합니까?"
          idea={<>Blob은 4,096개의 field-element 자리로 구성되고 각 자리는 32 bytes입니다. 두 프로토콜 상수를 곱하면 131,072 bytes, 즉 128 KiB가 됩니다.</>}
          formula={String.raw`B_{blob}=4096\;\text{elements}\times32\;\text{bytes/element}=131072\;\text{bytes}=128\;\text{KiB}`}
          annotatedFormula={String.raw`B_{blob}=\underbrace{4096\;\text{elements}}_{\text{자리 수}}\times\underbrace{32\;\text{bytes/element}}_{\text{자리 하나의 크기}}=\underbrace{131072\;\text{bytes}}_{128\;\text{KiB}}`}
          operations={[
            { expression: String.raw`4096\;\text{elements}\times32\;\text{bytes/element}`, annotation: ["4,096개 자리에", "자리마다 32 bytes를 곱합니다", "각 값은 field 범위를 따라야 합니다"] },
            { expression: String.raw`131072\;\text{bytes}=128\;\text{KiB}`, annotation: ["131,072÷1,024=128", "임의 파일 128 KiB를 그대로 넣는다는", "뜻은 아닙니다"] },
          ]}
          terms={[
            { symbol: "B_{blob}", name: "Blob byte length", description: "EIP-4844 blob 한 개의 고정 직렬화 길이입니다." },
            { symbol: "4096", name: "Field elements", description: "FIELD_ELEMENTS_PER_BLOB가 정한 자리 수입니다." },
            { symbol: "32", name: "Bytes per element", description: "BYTES_PER_FIELD_ELEMENT가 정한 각 자리의 길이입니다." },
          ]}
          assumptions={["EIP-4844의 blob 직렬화 상수를 사용합니다.", "Field element 값은 BLS modulus보다 작아야 하므로 모든 32-byte 문자열이 유효한 것은 아닙니다.", "블록당 blob 수와 가격 매개변수는 fork별로 따로 고정합니다."]}
          interpretation="Blob 하나의 크기는 고정이지만 블록당 허용량과 가격은 별도 매개변수입니다. EIP-4844 자체에서는 합의 노드가 sidecar 전체를 받으므로, 이 단계를 부분 표본 추출로 설명하면 안 됩니다."
        />
        <div id="paper-eip4844">
          <CitationBlock source="EIP-4844 · Shard Blob Transactions" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-4844">
            <p><strong>문제:</strong> Rollup 자료를 EVM state보다 저렴하고 임시적인 합의 자료로 운반해야 합니다.</p>
            <p><strong>기여:</strong> Blob 거래, sidecar, KZG commitment, versioned hash와 blob gas의 경계를 정의합니다.</p>
            <p><strong>범위:</strong> EIP-4844의 운송·검증 의미입니다. 후속 표본 추출이나 rollup 실행 유효성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="kzg" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">조각의 진위</p>
        <h2 className="break-keep text-2xl font-bold">KZG proof는 받은 조각을 약속값에 결속하지만 가용성을 만들지는 않습니다</h2>
        <p>
          KZG polynomial commitment는 큰 다항식을 고정 길이 group element 하나에 묶고, 특정 지점의 평가값이 맞다는 짧은 opening proof를 제공합니다. PeerDAS에서는 cell proof가 받은 cell이 확장된 blob 다항식과 일치하는지 확인합니다.
        </p>
        <p>
          검증 성공으로 알 수 있는 것은 받은 조각의 진위뿐입니다. 다른 열을 누가 보관하는지, 요청 경로가 독립적인지, 응답이 마감 전에 왔는지, 충분한 조각으로 복원되는지는 별도로 확인해야 합니다.
        </p>
        <div id="paper-kzg">
          <CitationBlock source="Kate–Zaverucha–Goldberg · Constant-Size Commitments to Polynomials" citeKey={2} href="https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf">
            <p><strong>문제:</strong> 다항식에 짧게 commit하고 평가값을 짧은 proof로 열어야 합니다.</p>
            <p><strong>기여:</strong> Bilinear pairing과 structured reference를 이용한 constant-size polynomial commitment를 제시합니다.</p>
            <p><strong>범위:</strong> 논문의 보안 가정과 setup model 안의 commitment 근거이며, network availability의 근거는 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="peerdas" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">Ethereum의 부분 수신</p>
        <h2 className="break-keep text-2xl font-bold">PeerDAS는 각 blob 행을 가로로 늘리고 같은 위치를 열로 묶습니다</h2>
        <p>
          각 blob은 하나의 행이 되고 1차원 Reed–Solomon 확장으로 가로 길이가 두 배가 됩니다. 여러 blob 행의 같은 cell 번호를 세로로 모은 것이 data column입니다. 노드는 ID에서 정해지는 custody column을 보관하고, 블록마다 다른 column을 peer에게 요청합니다.
        </p>
        <p>
          전체 column의 절반 이상을 얻으면 각 행의 다항식을 보간해 확장 행을 다시 만들 수 있습니다. 행을 쌓은 모습이 표처럼 보여도 세로 방향 parity를 추가한 2차원 코드는 아닙니다.
        </p>
        <div id="paper-peerdas">
          <CitationBlock source="Ethereum consensus-specs v1.6.1 · Fulu DAS core" citeKey={3} href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/fulu/das-core.md">
            <p><strong>문제:</strong> 모든 합의 노드가 모든 blob을 받는 대역폭을 줄이면서 자료 복원 가능성을 확인해야 합니다.</p>
            <p><strong>기여:</strong> Data column, deterministic custody, sampling과 50% column reconstruction 경계를 정의합니다.</p>
            <p><strong>범위:</strong> v1.6.1의 Fulu 규격에 한정합니다. 이후 매개변수나 Celestia식 2차원 코드를 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="celestia" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">행과 열을 함께 늘리는 구조</p>
        <h2 className="break-keep text-2xl font-bold">Celestia 계열은 원본 정사각형의 행과 열을 모두 확장합니다</h2>
        <p>
          4×4 원본 16칸에서 시작해 각 행을 8칸으로 늘리고, 그 결과의 각 열도 8칸으로 늘리면 8×8의 64칸이 됩니다. 전체 code rate는 16÷64=1/4입니다. 가로와 세로 모두에 복원 관계가 생기므로 좌표 단위의 표본과 행·열 복원을 사용합니다.
        </p>
        <p>
          이 구조의 1/4 비율이나 share 단위를 PeerDAS에 옮기면 틀립니다. PeerDAS는 blob 행별 1차원 확장과 data column을 사용하고, Celestia 계열은 2차원 extended data square를 사용합니다.
        </p>
        <div id="paper-celestia-2d">
          <CitationBlock source="Celestia App v10.5.0 · Data square layout" citeKey={4} href="https://github.com/celestiaorg/celestia-app/blob/v10.5.0/specs/src/data_square_layout.md">
            <p><strong>문제:</strong> Namespaced block 자료를 표본 추출과 복원이 가능한 정사각형으로 구성해야 합니다.</p>
            <p><strong>기여:</strong> Data square의 행·열 배치와 확장 구조를 공식 application specification으로 설명합니다.</p>
            <p><strong>범위:</strong> v10.5.0의 자료 구조에 한정합니다. 모든 DA network가 같은 표본 수와 layout을 쓴다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="sampling" className="space-y-6 scroll-mt-20">
        <p className="text-xs font-bold text-primary">표본 확률</p>
        <h2 className="break-keep text-2xl font-bold">표본 성공률은 숨긴 비율과 요청 독립성을 적었을 때만 의미가 있습니다</h2>
        <ExplainedFormula
          question="전체의 f 비율을 숨겼을 때 s번 표본이 모두 숨김을 놓칠 확률은 얼마입니까?"
          idea={<>한 번의 균등한 표본이 숨기지 않은 영역에 떨어질 확률은 1−f입니다. 같은 조건에서 서로 독립인 표본 s개가 모두 숨김을 비껴갈 확률은 이를 s번 곱합니다.</>}
          formula={String.raw`P_{miss}=(1-f)^s,\qquad f=\tfrac12,\;s=10 \Rightarrow P_{miss}=\tfrac1{1024}\approx0.0977\%`}
          annotatedFormula={String.raw`P_{miss}=\underbrace{(1-f)^s}_{\text{s번 모두 숨긴 곳을 비껴감}},\qquad \underbrace{f=\tfrac12,\;s=10}_{\text{설명용 가정}} \Rightarrow \underbrace{P_{miss}=\tfrac1{1024}}_{\approx0.0977\%}`}
          operations={[
            { expression: String.raw`(1-f)^s`, annotation: ["한 표본이 숨기지 않은 곳에 떨어질", "확률 1−f를 독립 표본 s번 곱합니다"] },
            { expression: String.raw`P_{miss}=\tfrac1{1024}`, annotation: ["(1/2)¹⁰=1/1,024", "탐지 확률은 약 99.9023%", "같은 peer가 요청을 통제하면 무효입니다"] },
          ]}
          terms={[
            { symbol: "f", name: "Hidden fraction", description: "공격자가 숨겼다고 모델링한 전체 조각 비율입니다." },
            { symbol: "s", name: "Sample count", description: "균등하고 독립이라고 가정한 표본 수입니다." },
            { symbol: "P_{miss}", name: "Miss probability", description: "모든 표본이 보이는 영역에만 떨어져 숨김을 놓칠 확률입니다." },
          ]}
          assumptions={["표본 위치가 균등하고 공격자에게 미리 알려지지 않습니다.", "응답 peer와 경로가 충분히 독립적이며 eclipse와 상관관계를 따로 통제합니다.", "숨김 비율 f가 실제 인코딩과 복원 임계값에서 도출됐습니다.", "조각 증거와 응답 마감 시간을 별도로 확인합니다."]}
          interpretation="열 번 성공했다는 숫자만으로 보편적인 안전성을 말할 수 없습니다. 실제 프로토콜의 표본 단위·custody·peer 선택·복원 임계값이 이 장난감 모형의 전제와 맞아야 합니다."
        />
        <div id="paper-fraud-da">
          <CitationBlock source="Al-Bassam et al. · Fraud and Data Availability Proofs" citeKey={5} href="https://arxiv.org/abs/1809.09044">
            <p><strong>문제:</strong> Light client가 전체 block을 받지 않고 data withholding과 잘못된 인코딩을 찾아야 합니다.</p>
            <p><strong>기여:</strong> 2차원 erasure-coded Merkle tree, 무작위 표본과 fraud proof를 결합한 구조를 제시합니다.</p>
            <p><strong>범위:</strong> 논문의 2차원 code·network·sampling model에 한정합니다. EIP-4844나 PeerDAS가 그대로 같은 구조를 구현한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="comparison" className="space-y-6 scroll-mt-20">
        <p className="text-xs font-bold text-primary">세 구조의 경계</p>
        <h2 className="break-keep text-2xl font-bold">확장 방향과 검증자가 받는 단위를 먼저 비교합니다</h2>
        <DAArchitectureViz />
        <p>
          EIP-4844는 거래와 sidecar를 분리하고 합의 노드가 blob 전체를 받습니다. PeerDAS는 각 blob 행을 가로로 늘린 뒤 열 단위로 보관·표본 추출합니다. Celestia 계열은 원본 정사각형을 가로와 세로로 늘리고 share 좌표를 확인합니다. 모두 자료 게시를 다루지만 같은 인코딩 차원이나 같은 표본 단위를 쓰지 않습니다.
        </p>
      </section>

      <section id="failure-boundaries" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">설명할 수 없는 범위</p>
        <h2 className="break-keep text-2xl font-bold">표본 성공 하나를 전체 시스템의 안전성으로 확대하지 않습니다</h2>
        <ul className="space-y-3 pl-5 text-sm leading-7">
          <li>조각 증거가 맞아도 나머지 조각의 존재와 peer 다양성은 확인되지 않습니다.</li>
          <li>복원에 성공해도 거래 실행 결과와 state transition이 올바른지는 별도 검증입니다.</li>
          <li>한 검증자가 표본에 성공해도 eclipse된 다른 검증자가 같은 view를 얻는다고 보장할 수 없습니다.</li>
          <li>설명용 (8,4) 코드와 10회 표본 수를 실제 프로토콜의 고정 매개변수로 사용하지 않습니다.</li>
        </ul>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">읽고 바로 확인할 질문</p>
        <h2 className="break-keep text-2xl font-bold">세 질문에 답하면 다음 실무 글로 넘어갈 수 있습니다</h2>
        <ol className="space-y-3 pl-5 text-sm leading-7">
          <li>조각 증거가 성공해도 전체 자료를 받을 수 있다고 단정할 수 없는 이유는 무엇입니까? <span className="text-muted-foreground">(답: 역할을 나눈 이유)</span></li>
          <li>PeerDAS의 표 모양과 Celestia의 2차원 확장이 다른 지점은 무엇입니까? <span className="text-muted-foreground">(답: Ethereum의 부분 수신·행과 열을 함께 늘리는 구조)</span></li>
          <li>표본 누락 확률 식을 사용할 수 없게 만드는 네트워크 조건은 무엇입니까? <span className="text-muted-foreground">(답: 표본 확률)</span></li>
        </ol>
      </section>

      <DataAvailabilityMapReturn current="da-theory" />
    </article>
  );
}
