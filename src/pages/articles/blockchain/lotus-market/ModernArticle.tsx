import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ModernDealDeliveryViz, {
  MigrationRecoveryViz,
  ProductCompletionViz,
  RetrievalDeliveryViz,
  SectorActivationViz,
} from "./viz/ModernDealDeliveryViz";

const MARKET2 = "https://docs.curiostorage.org/market-2.0";
const FIP118 =
  "https://github.com/filecoin-project/FIPs/blob/04872b3795256e9846d3483981070c8d00a0aa1c/FIPS/fip-0118.md";
const RETRIEVAL =
  "https://docs.filecoin.io/basics/how-retrieval-works/serving-retrievals";
const BOOST =
  "https://github.com/filecoin-project/boost/tree/28c91c3aee65ac900502f9f0fc55b69f911c2980";

export default function ModernLotusMarketArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            파일을 보관했다는 말과 지금 되돌려 받았다는 말을 구별하기
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            저장 요청과 데이터 전달은 서로 다른 완료 기록이 필요합니다
          </h2>
        </header>

        <ModernDealDeliveryViz />

        <p className="text-lg leading-8 text-foreground/90">
          <strong>
            요청 승인, 데이터 보관, 검색 준비, 실제 전달을 한 상태로 묶어서는 안 됩니다.
          </strong>{" "}
          현재 Curio Market 2.0에서 deal은 요청한 product를 비동기로 처리하는 작업 묶음입니다.
          여기서 product는 저장이나 검색 준비처럼 이용자가 요청할 수 있는 작업 종류를 뜻합니다.
        </p>
        <p>
          이 글의 예제에서 <code>ddo_v1</code>은 데이터를 sector에 넣고 sealing을 진행합니다.
          <code>retrieval_v1</code>은 검색용 index와 announcement 방식을 정합니다. 나중에 이용자가
          실제 데이터를 받는 retrieval은 별도 요청이므로 검색부터 검증까지 다시 확인해야 합니다.
        </p>
        <p className="leading-7 text-muted-foreground">
          과거의 built-in market deal과 현재 product 모델은 체인에 남기는 효과가 다릅니다. 특히
          NV29부터 DataCap과 verified allocation 경로가 폐지됐고, 새 sector의 QAP는 콘텐츠나 deal
          publication으로 정해지지 않습니다. 설명과 실험을 시작하기 전에 network version과 product
          구성을 먼저 고정해야 하는 이유입니다.
        </p>
        <ContentBoundary article="lotus-market" />
      </section>

      <section id="deal-artifact" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 요청과 product 상태</p>
          <h2 className="mt-2 text-2xl font-bold">
            한 deal ID 안에서도 product별 완료 상태를 따로 봅니다
          </h2>
        </header>

        <ProductCompletionViz />

        <p>
          Market 2.0 deal에는 ULID 형식의 ID, 이용자, 요청한 product와 data source가 들어갑니다.
          Provider-pull 방식은 요청을 승인한 뒤 곧바로 처리하기 시작합니다. Upload 방식은 byte 전송이
          끝나도 자동으로 다음 단계로 넘어가지 않습니다. finalize 요청까지 받아야 processing을
          시작합니다.
        </p>
        <p>
          예제는 <code>ddo_v1</code>과 indexing을 켠 <code>retrieval_v1</code>을 함께 요청합니다. 서비스는
          실제 데이터에서 piece commitment와 크기를 다시 계산하고, 요청한 product가 각각 최종 상태인
          <code>complete</code>에 도달했는지 확인합니다. <code>accepted</code>나
          <code>uploading</code>만 보고 전체 요청이 끝났다고 판단하지 않습니다.
        </p>

        <ExplainedFormula
          question="이 예제의 저장 요청을 완료했다고 언제 말할 수 있을까요?"
          idea={
            <>
              요청 승인, 데이터 검증, sector 활성화, index 완료를 각각 참과 거짓으로 확인합니다.
            </>
          }
          formula={String.raw`A_{store}=A_{accept}\land A_{bytes}\land A_{seal}\land A_{index}`}
          annotatedFormula={String.raw`A_{store}=\underbrace{A_{accept}}_{\text{요청 승인}}\land\underbrace{A_{bytes}}_{\text{piece 일치}}\land\underbrace{A_{seal}}_{\text{sector 활성화}}\land\underbrace{A_{index}}_{\text{index 완료}}`}
          operations={[
            {
              expression: String.raw`A_{accept}\land A_{bytes}`,
              annotation: [
                "POST /deal 승인과 실제 데이터 검증을",
                "서로 다른 확인 기록으로 판단합니다",
              ],
            },
            {
              expression: String.raw`A_{seal}\land A_{index}`,
              annotation: [
                "ddo_v1 sealing과 요청한 indexing이",
                "모두 complete여야 Astore=1입니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "A_{store}",
              name: "저장 요청 완료",
              description: "이 글의 ddo_v1과 indexing 구성이 모두 끝나면 1입니다.",
            },
            {
              symbol: "A_{accept}",
              name: "요청 승인",
              description: "Product와 provider 정책, 선택적 contract 검증을 통과하면 1입니다.",
            },
            {
              symbol: "A_{bytes}",
              name: "데이터 검증",
              description: "전송된 데이터의 commitment와 크기가 요청과 같으면 1입니다.",
            },
            {
              symbol: "A_{seal}",
              name: "저장 활성화",
              description: "Piece가 증명된 sector와 활성화 기록에 연결되면 1입니다.",
            },
            {
              symbol: "A_{index}",
              name: "검색 준비",
              description: "이 예제에서 요청한 indexing product가 완료되면 1입니다.",
            },
          ]}
          assumptions={[
            "Curio Market 2.0의 ddo_v1과 indexing=true인 retrieval_v1 예제를 사용합니다.",
            "다른 product나 indexing=false 구성에서는 실제로 요청한 product의 완료 조건을 넣습니다.",
          ]}
          interpretation="요청만 승인됐거나 sealing만 끝났다면 Astore는 0입니다. Astore=1이어도 나중에 데이터 전달이 성공한다는 뜻은 아닙니다."
        />

        <p>
          <strong>반례:</strong> 이전 요청의 piece metadata를 재사용하면서 upload 데이터 한 블록을
          바꾸면 다시 계산한 commitment가 달라집니다. 이 요청은 처리 단계에 들어가기 전에 거절해야
          하며, 이전 deal의 sector 기록을 새 요청의 증거로 대신 쓸 수 없습니다.
        </p>

        <div id="paper-filecoin-deals">
          <CitationBlock citeKey={1} source="Curio Market 2.0 · official docs" href={MARKET2}>
            <p>
              <strong>문제:</strong> PoRep, PDP, retrieval처럼 서로 다른 service product를 하나의 요청
              형식과 상태 모델로 다뤄야 합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Deal ID, 이용자, product, data source 모델과 accepted →
              uploading → processing → sealing → indexing → complete/failed 생명주기를 정의합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> 2026-11-01 문서와 실제 Curio build, 활성화한 product,
              provider 정책을 함께 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Market 2.0이 요청을 받아 처리하는 현재 구조와 상태
              생명주기입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 모든 product가 모든 중간 상태를 거치거나 external contract,
              payment, 실제 전달까지 자동으로 성공한다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="activation" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · Sector 활성화</p>
          <h2 className="mt-2 text-2xl font-bold">
            선택적 contract 검증과 sector 활성화는 서로 다른 단계입니다
          </h2>
        </header>

        <SectorActivationViz />

        <p>
          예제의 <code>ddo_v1</code>에는 provider와 보관 기간이 필요합니다. External market contract를
          지정했다면 Curio는 allowlist와 <code>CurioDealViewV1.verifyDeal</code>을 읽기 전용으로
          확인합니다. 이 함수가 <code>true</code>를 반환해도 payment, payout, notification이
          성공했다는 뜻은 아닙니다.
        </p>
        <p>
          실제 piece는 sector 42의 CommD에 포함되고, replica commitment인 CommR과 함께 precommit과
          provecommit 경로를 거칩니다.{" "}
          <a className="text-primary hover:underline" href="/cs/blockchain/proofs-porep">
            PoRep 설명 글
          </a>
          에서 증명 단계를 자세히 다룹니다. 이 글에서는 product 상태가 sector 활성화 기록과 어떻게
          연결되는지만 추적합니다.
        </p>
        <p>
          NV29부터 새 DDO product에는 allocation ID를 넣지 않으며 contract view에도 0을 전달합니다.
          DataCap과 verified allocation은 더 이상 새 sector의 QAP를 결정하지 않습니다. 과거
          allocation과 publish 경로를 현재의 공통 흐름처럼 설명하면 안 됩니다.
        </p>

        <div id="paper-filecoin-nv29">
          <CitationBlock
            citeKey={2}
            source="FIP-0118 Solstice · pinned revision 04872b3"
            href={FIP118}
          >
            <p>
              <strong>문제:</strong> DataCap과 verified allocation을 sector quality에서 분리하고,
              service economy를 새 reward stream으로 옮겨야 합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> NV29부터 DataCap write path를 폐지하고, 새 sector에 콘텐츠와
              무관한 10× QAP를 적용하는 전환 규칙을 정의합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> Mainnet NV29 활성화 이후의 규칙과 정확한 actor bundle,
              network version을 사용합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Solstice의 protocol 전환과 호환되지 않는 경계입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 저장 서비스의 품질, payment, retrieval 가용성이나 특정
              market 구현을 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="retrieval" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 실제 데이터 전달</p>
          <h2 className="mt-2 text-2xl font-bold">
            Storage proof와 별도로 검색부터 데이터 검증까지 끝냅니다
          </h2>
        </header>

        <RetrievalDeliveryViz />

        <p>
          이용자가 CID Q를 요청하면 IPNI 같은 content routing에서 provider 후보와 지원 protocol 정보를
          찾습니다. 이어서 provider S의 현재 가용성, 범위 요청, unseal 상태, 가격과 인증 정책을
          확인합니다. 검색 결과에 이름이 있다는 사실만으로 지금 데이터를 보낼 수 있다고 단정하지
          않습니다.
        </p>
        <p>
          그다음 HTTP, Graphsync, Bitswap 가운데 실제로 지원하는 전송 방식으로 데이터를 받고,
          요청한 CID나 구간 commitment와 일치하는지 검증합니다. Payment channel은 특정 retrieval
          구성에서 쓸 수 있는 결제 방법이지 모든 retrieval의 필수 단계는 아닙니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">같은 조건으로 측정하기</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              CID Q의 <span className="whitespace-nowrap">8 MiB</span>를 같은 범위로 요청합니다.
              Provider 탐색 결과의 나이, cache와 unseal
              상태, 첫 byte까지 걸린 시간, 검증한 byte 수, 처리량, p99, 재시도 횟수를 기록합니다.
            </p>
          </article>
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">실패로 확인하는 경계</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              WindowPoSt가 유효해도 endpoint가 중단됐거나 index가 오래됐거나 unseal I/O가 밀리면
              전달은 실패합니다. 저장 증명을 서비스의 응답 보장으로 확대해서는 안 됩니다.
            </p>
          </article>
        </div>

        <div id="paper-filecoin-retrieval">
          <CitationBlock
            citeKey={3}
            source="Filecoin serving retrievals · official docs"
            href={RETRIEVAL}
          >
            <p>
              <strong>문제:</strong> 보관한 콘텐츠의 provider 탐색과 실제 전송을 storage proof에서
              분리해야 합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> IPNI query, provider 선택, Graphsync, Bitswap, HTTP 전송과
              payment 흐름을 설명합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> Advertisement 시각, 지원 protocol, cache와 unseal 상태,
              payment 정책을 요청마다 확인합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 공개 콘텐츠를 가져오는 공식 서비스 흐름입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Indexer의 최신성, 온라인 가용성, 무료 retrieval이나 고정
              지연 시간을 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 이전 버전에서 옮기기</p>
          <h2 className="mt-2 text-2xl font-bold">
            상태 이름이 아니라 같은 입력에서 나온 확인 기록을 대조합니다
          </h2>
        </header>

        <MigrationRecoveryViz />

        <p>
          전환 시험에서는 기존 Boost와 Lotus markets의 snapshot을 읽기 전용으로 보존합니다. 새
          Curio와 Boost의 source SHA, database schema, Lotus API, actor와 network version, 활성화한
          product, retrieval 경로를 함께 기록합니다. 이름이 같은 상태라도 버전과 구성이 다르면 같은
          결과라고 볼 수 없습니다.
        </p>
        <p>
          두 경로에 같은 데이터를 넣고 piece commitment, sector 42 활성화, index 결과를 대조합니다.
          이어서 process 중단, 중복 재시도, 손상된 upload, finalize 누락, 사용할 수 없는 endpoint,
          unseal 지연을 재현합니다. NV29 경로에서는 새 allocation 효과가 생기지 않아야 하고, 기존
          기록은 과거 상태를 조회하는 용도로만 남아야 합니다.
        </p>
        <p>
          검증 기록에는 source와 schema 버전, product별 최종 상태, piece와 proof와 실제 데이터 검증,
          단계별 p50과 p99, 실패 원인을 남깁니다. 새 경로가 기준을 통과하지 못하면 새 요청과 쓰기를
          멈추고 이전 호환 구성으로 돌아갑니다. 이때 이미 받은 데이터와 외부에 제출한 효과부터
          조회한 뒤, 확인되지 않은 단계만 다시 수행해야 합니다.
        </p>

        <div id="paper-boost-source">
          <CitationBlock
            type="code"
            citeKey={4}
            source="Boost v2.5.3 · commit 28c91c3"
            href={BOOST}
          >
            <p>
              <strong>문제:</strong> Boost의 현재 NV29 호환 범위와 기존 protocol의 경계를 고정해야
              합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> NV29 DataCap 폐지 대응을 포함한 고정 버전의 deal과
              retrieval source tree를 제공합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> 정확한 commit, database, Lotus 호환 표, actor와 network
              version, 배포 구성을 함께 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Boost v2.5.3 source와 release 경계입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 모든 provider의 표준 topology, Curio product 의미, deal
              성공이나 retrieval SLO를 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>

        <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">이 글을 읽은 뒤 확인할 것:</strong> 요청 승인, 저장,
          검색 준비, 실제 전달의 차이와 Market 2.0 product 상태를 설명할 수 있어야 합니다. 또한
          NV29에서 사라진 allocation 경로, sector 활성화와 retrieval의 서로 다른 완료 조건, 전환
          시험에서 재현할 실패를 구분할 수 있어야 합니다.
        </aside>
      </section>
    </article>
  );
}
