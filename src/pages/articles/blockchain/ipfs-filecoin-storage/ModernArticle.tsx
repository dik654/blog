import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { IpfsFilecoinBoundaryViz } from "./IpfsFilecoinBoundaryViz";

const IPFS_REV = "3000be69497e47c399cdb719440d0809f085388b";
const KUBO_COMMIT = "acc53c093810a8fe9a4bc2f023f0b1e0c1d629b5";
const STORACHA_REV = "3b6791869635735ddb1a54aed7450ad6ef687c06";
const BITSWAP = `https://github.com/ipfs/specs/blob/${IPFS_REV}/src/bitswap-protocol.md`;
const ROUTING = `https://github.com/ipfs/specs/blob/${IPFS_REV}/src/routing/http-routing-v1.md`;
const KUBO = `https://github.com/ipfs/kubo/tree/${KUBO_COMMIT}`;
const FILECOIN = `https://github.com/storacha/specs/blob/${STORACHA_REV}/w3-filecoin.md`;

export default function ModernIpfsFilecoinStorage() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Alice의 10 MiB 파일을 찾고 장기 보관까지 확인하기
          </p>
          <h2 className="break-keep text-3xl font-bold tracking-tight">
            IPFS는 byte를 찾고 검증하며 Filecoin은 보관 약속과 증거를 기록합니다
          </h2>
        </header>

        <IpfsFilecoinBoundaryViz />

        <p className="text-lg leading-8 text-foreground/90">
          한 문장으로 말하면, <strong>IPFS</strong>는 “이 CID의 byte를 어디서
          받아 무결성을 확인할까”에 답하고 <strong>Filecoin</strong>은 “이
          piece의 보관 약속과 proof가 어떻게 진행됐나”에 답합니다. 그러면 바로
          한 가지 질문이 남습니다. Storage proof가 있으면 사용자가 지금 파일을
          빠르게 받을 수 있다는 뜻일까요? 그렇지 않습니다. 실제 retrieval은
          별도로 시험해야 합니다.
        </p>

        <p>
          아래에서는 같은 파일 하나를 끝까지 따라갑니다. Root CID를 만들고,
          provider 후보를 찾아 Bitswap으로 block을 받은 뒤, CID를 다시
          계산합니다. 이어서 CAR와 PieceCID를 연결해 Filecoin lifecycle과
          proof를 확인하고, 마지막에는 cache를 비운 cold path에서 실제 파일을
          다시 받습니다.
        </p>
        <ContentBoundary article="ipfs-filecoin-storage" />

        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>먼저 기억할 경계:</strong> “IPFS에 add했다”, “provider가
          있다고 검색됐다”, “Filecoin deal이 있다”, “PoSt가 기록됐다”, “지금
          빠르게 내려받았다”는 서로 다른 영수증입니다.
        </aside>
      </section>

      <section id="identity-map" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · 같은 파일을 가리키는 여러 ID를 연결한다
          </p>
          <h2 className="mt-2 break-keep text-2xl font-bold">
            Root CID와 PieceCID, deal ID는 같은 값이 아닙니다
          </h2>
        </header>

        <p>
          원본 파일을 UnixFS로 가져오면 여러 block과 root CID가 생깁니다. 이
          DAG를 CAR로 묶고 Filecoin piece 규칙에 맞춰 padding하면 별도의
          PieceCID가 생깁니다. On-chain deal ID는 다시 그 piece의 보관
          lifecycle을 가리키는 번호입니다. 따라서 한 값을 다른 값처럼 복사해서는
          안 됩니다.
        </p>

        <p>
          연결표에는 원본 digest와 크기, UnixFS importer·chunker, root와 block
          CIDs, CAR digest와 순서, piece commitment·size, deal·proof reference와
          사용한 도구 버전을 남깁니다. 같은 원본이라도 chunker나 CAR order,
          padding 규칙이 달라지면 새 연결표가 필요합니다.
        </p>

        <ExplainedFormula
          question="같은 10 MiB 파일에서 왜 root CID·CAR digest·PieceCID가 서로 다를까?"
          idea={
            <>
              원본 byte가 UnixFS DAG, CAR, Filecoin piece로 바뀔 때마다 입력과
              변환 규칙이 달라지므로 각 단계가 별도의 ID를 만듭니다.
            </>
          }
          formula={String.raw`F\xrightarrow{P_{unixfs}}(C_{root},\{C_i\})\xrightarrow{P_{car}}D_{car}\xrightarrow{P_{piece}}C_{piece}\xrightarrow{deal}D_{id}`}
          annotatedFormula={String.raw`\underbrace{F}_{\text{원본 byte}}\xrightarrow{\,P_{unixfs}\,}\underbrace{(C_{root},\{C_i\})}_{\text{UnixFS DAG}}\xrightarrow{\,P_{car}\,}\underbrace{D_{car}}_{\text{CAR bytes digest}}\xrightarrow{\,P_{piece}\,}\underbrace{C_{piece}}_{\text{piece commitment}}\xrightarrow{\,deal\,}\underbrace{D_{id}}_{\text{deal record}}`}
          operations={[
            {
              expression: String.raw`F\xrightarrow{P_{unixfs}}(C_{root},\{C_i\})`,
              annotation: [
                "Chunker·codec·DAG layout이 root와 block CIDs를 정합니다",
                "같은 원본도 UnixFS profile이 달라지면 다른 DAG가 됩니다",
              ],
            },
            {
              expression: String.raw`(C_{root},\{C_i\})\xrightarrow{P_{car}}D_{car}`,
              annotation: [
                "선택한 blocks와 CAR 순서가 archive bytes를 정합니다",
                "CAR digest는 root CID를 다른 이름으로 쓴 값이 아닙니다",
              ],
            },
            {
              expression: String.raw`D_{car}\xrightarrow{P_{piece}}C_{piece}\xrightarrow{deal}D_{id}`,
              annotation: [
                "Padding·piece size 규칙으로 commitment를 계산합니다",
                "Deal ID는 그 piece의 보관 lifecycle record를 가리킵니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "F",
              name: "Source bytes",
              description: "Alice가 넣은 10 MiB 원본 파일의 byte열입니다.",
            },
            {
              symbol: "C_{root}",
              name: "Root CID",
              description:
                "UnixFS/IPLD DAG에 들어가는 content identifier입니다.",
            },
            {
              symbol: "C_i",
              name: "Block CIDs",
              description:
                "DAG를 구성하는 각 block의 content identifier입니다.",
            },
            {
              symbol: "D_{car}",
              name: "CAR digest",
              description: "실제로 전달한 CAR bytes의 digest입니다.",
            },
            {
              symbol: "C_{piece}",
              name: "Piece commitment",
              description: "Filecoin piece 규칙으로 계산한 commitment입니다.",
            },
            {
              symbol: "P_{unixfs},P_{car},P_{piece}",
              name: "Transformation profiles",
              description:
                "Chunker·codec·CAR order·padding·piece size를 정한 규칙입니다.",
            },
            {
              symbol: "D_{id}",
              name: "Deal record ID",
              description:
                "Piece의 보관 lifecycle을 체인에서 찾는 식별자입니다.",
            },
          ]}
          assumptions={[
            "각 화살표의 profile과 도구 revision을 고정해야 같은 결과를 재현할 수 있습니다.",
            "이 식은 변환 관계를 나타내며 IPFS·Filecoin이 하나의 통합 ID를 발급한다는 뜻이 아닙니다.",
          ]}
          interpretation="Root CID는 content DAG, CAR digest는 archive bytes, PieceCID는 Filecoin piece commitment, deal ID는 lifecycle record를 식별합니다. 연결표는 이 서로 다른 값을 변환 profile과 함께 이어 주는 별도 기록입니다."
        />

        <div id="paper-ipfs-bitswap">
          <CitationBlock
            type="code"
            citeKey={1}
            source="IPFS Bitswap protocol · commit 3000be6"
            href={BITSWAP}
          >
            <p>
              <strong>핵심:</strong> Bitswap은 wantlist와 Block·Have·DontHave
              응답, payload와 pending bytes의 wire 역할을 정합니다.
            </p>
            <p>
              <strong>확인 범위:</strong> 2026-11-01에 IPFS specs HEAD와 Bitswap
              1.0·1.1·1.2 내용을 다시 확인했습니다.
            </p>
            <p>
              <strong>확대 금지:</strong> Have 응답과 provider 광고는 현재
              possession, 낮은 지연, 장기 보관이나 Filecoin deal을 보장하지
              않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="retrieve-path" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · 후보 탐색과 실제 byte 수신을 나눈다
          </p>
          <h2 className="mt-2 break-keep text-2xl font-bold">
            Provider record는 전송 성공 영수증이 아닙니다
          </h2>
        </header>

        <p>
          Delegated routing이나 DHT는 CID를 제공한다고 광고한 peer 후보를
          돌려줍니다. 현재 Routing V1은 주소와 transfer protocol을 filter할 수
          있지만, filter를 통과했다는 사실도 연결·전송·무결성을 보장하지는
          않습니다. Router는 local blockstore, IPFS peer·gateway와 별도
          retrieval path를 정해진 timeout 순서로 시도해야 합니다.
        </p>

        <p>
          각 시도에서는 provider identity와 route, 연결 시간, first-byte,
          transfer, CID 검증 시간, byte 수와 실패 원인을 남깁니다. Gateway가
          HTTP 200을 돌려줘도 받은 block의 multihash가 요청한 CID와 다르면
          실패입니다.
        </p>

        <ExplainedFormula
          question="파일 한 건을 505ms에 받았다면 어디서 시간이 들었는지 어떻게 찾을까?"
          idea={
            <>
              후보 탐색, 연결, 첫 byte 대기, 전체 전송과 CID 검증을 서로 다른
              구간으로 재서 더합니다.
            </>
          }
          formula={String.raw`T_{get}=T_{route}+T_{dial}+T_{first}+T_{transfer}+T_{verify}`}
          annotatedFormula={String.raw`\underbrace{T_{get}}_{\text{검증 완료까지}}=\underbrace{T_{route}+T_{dial}}_{\text{후보를 찾아 연결}}+\underbrace{T_{first}+T_{transfer}}_{\text{byte 수신}}+\underbrace{T_{verify}}_{\text{CID 재계산}}`}
          operations={[
            {
              expression: String.raw`20+30=50\text{ ms}`,
              annotation: [
                "Routing 20ms에 연결 30ms를 더합니다",
                "아직 payload byte를 받기 전입니다",
              ],
            },
            {
              expression: String.raw`50+400=450\text{ ms}`,
              annotation: [
                "첫 byte까지 50ms, 나머지 전송에 400ms입니다",
                "이 예제에서 가장 큰 구간은 transfer 400ms입니다",
              ],
            },
            {
              expression: String.raw`50+450+5=505\text{ ms}`,
              annotation: [
                "탐색·연결 50ms와 수신 450ms를 합칩니다",
                "마지막 CID 검증 5ms까지 더해 505ms입니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "T_{route}",
              name: "Routing time",
              description: "Provider 후보를 찾는 시간입니다.",
            },
            {
              symbol: "T_{dial}",
              name: "Connection time",
              description: "선택한 peer·gateway와 연결하는 시간입니다.",
            },
            {
              symbol: "T_{first}",
              name: "First-byte wait",
              description: "요청 뒤 첫 payload byte까지의 대기 시간입니다.",
            },
            {
              symbol: "T_{transfer}",
              name: "Transfer time",
              description: "기대한 bytes를 모두 받는 시간입니다.",
            },
            {
              symbol: "T_{verify}",
              name: "Verification time",
              description: "Decode와 multihash 재계산 시간입니다.",
            },
          ]}
          assumptions={[
            "같은 root CID, block 크기, timeout·retry policy와 monotonic clock을 사용합니다.",
            "Cache hit와 cold retrieval, local과 remote path를 섞어 비교하지 않습니다.",
          ]}
          interpretation="총 505ms라는 숫자만으로는 개선할 곳을 알 수 없습니다. 다섯 구간으로 나누면 이 예제에서는 transfer 400ms가 가장 큰 병목임을 바로 볼 수 있습니다."
        />

        <div id="paper-ipfs-routing">
          <CitationBlock
            type="code"
            citeKey={2}
            source="IPFS Delegated Routing V1 · commit 3000be6"
            href={ROUTING}
          >
            <p>
              <strong>핵심:</strong> Provider·peer·IPNS routing의 HTTP schema,
              TTL·cache와 address·protocol filtering을 정의합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Candidate discovery와 response
              transport에 한정합니다. 실제 block transfer는 Bitswap·gateway 같은
              별도 protocol이 맡습니다.
            </p>
            <p>
              <strong>확대 금지:</strong> Provider response를 current
              possession, successful transfer, CID integrity나 retention proof로
              해석하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="retention" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · Local 보존과 Filecoin proof를 구분한다
          </p>
          <h2 className="mt-2 break-keep text-2xl font-bold">
            Pin과 deal·PoRep·PoSt는 서로 다른 보관 경계입니다
          </h2>
        </header>

        <p>
          Kubo pin은 해당 node의 garbage collection에서 block을 지우지 않게 하는
          local 정책입니다. Network 전체 복제나 원격 gateway의 가용성 계약이
          아닙니다. Filecoin deal lifecycle과 PoRep·WindowPoSt는 storage
          evidence지만, 사용자의 retrieval route와 속도를 증명하지는 않습니다.
        </p>

        <p>
          따라서 같은 content에는 local pin 여부, Filecoin deal 상태, 최신
          storage proof와 현재 retrieval 결과가 서로 다른 상태값으로 존재합니다.
          하나를 읽었다고 나머지까지 참이라고 추론하면 “보관 증거는 있지만 지금
          꺼내오지 못하는 상태”나 “cache에는 있지만 장기 보관 약속은 없는 상태”를
          놓치게 됩니다.
        </p>

        <ExplainedFormula
          question="독립 경로 두 곳이 각각 90% 확률로 응답한다면 최소 한 곳의 응답 확률은?"
          idea={
            <>두 경로가 모두 실패할 확률을 먼저 구하고 전체 1에서 뺍니다.</>
          }
          formula={String.raw`P_{reachable}=1-\prod_{i=1}^{n}(1-a_i)`}
          annotatedFormula={String.raw`\underbrace{P_{reachable}}_{\text{한 경로 이상 성공}}=1-\underbrace{\prod_{i=1}^{n}(1-a_i)}_{\text{모든 경로가 함께 실패}}`}
          operations={[
            {
              expression: String.raw`1-a_1=1-0.9=0.1`,
              annotation: ["첫 경로가 실패할 모델 확률은 10%입니다"],
            },
            {
              expression: String.raw`0.1\times0.1=0.01`,
              annotation: [
                "두 실패가 독립이라는 가정 아래 함께 실패할 확률입니다",
              ],
            },
            {
              expression: String.raw`1-0.01=0.99`,
              annotation: [
                "최소 한 경로가 응답할 모델 확률은 99%입니다",
                "같은 gateway·IDC를 공유하면 이 계산은 과대평가입니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "P_{reachable}",
              name: "At-least-one reachability",
              description:
                "관찰 window에 한 경로 이상이 verified bytes를 주는 확률입니다.",
            },
            {
              symbol: "a_i",
              name: "Path availability",
              description: "i번째 path가 verified bytes를 반환할 확률입니다.",
            },
            {
              symbol: "1-a_i",
              name: "Path failure",
              description:
                "i번째 path가 검증된 영수증을 만들지 못할 확률입니다.",
            },
            {
              symbol: "n",
              name: "Path count",
              description: "독립이라고 가정한 retrieval path 수입니다.",
            },
          ]}
          assumptions={[
            "경로별 실패가 서로 독립이고 관찰 window 동안 aᵢ가 일정하다고 둡니다.",
            "같은 datacenter, DNS, gateway, billing과 software bug를 공유하면 독립 가정이 깨집니다.",
          ]}
          interpretation="독립 경로 두 곳이 각각 0.9라면 모델 결과는 0.99입니다. 공통 장애 원인이 있으면 실제 값이 더 낮으므로 이 계산만으로 99% SLA를 선언할 수 없습니다."
        />

        <div id="paper-ipfs-kubo">
          <CitationBlock
            type="code"
            citeKey={3}
            source="Kubo v0.43.1 · commit acc53c0"
            href={KUBO}
          >
            <p>
              <strong>핵심:</strong> 현재 안정 release의 blockstore, pin·GC,
              routing, Bitswap과 gateway 구현 경계를 고정합니다.
            </p>
            <p>
              <strong>확인 범위:</strong> 2026-11-01에 v0.43.1 annotated tag를
              source commit acc53c0으로 역참조했습니다. Release는 주로 v0.43.0의
              bug fix와 provider record write batching을 포함합니다.
            </p>
            <p>
              <strong>확대 금지:</strong> Local pin은 remote replication,
              Filecoin contract, uninterrupted gateway access나 영구 보존을
              뜻하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="evidence-boundary" className="space-y-6">
        <span id="release-gate" className="sr-only" aria-hidden="true" />
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · 각 증거가 말할 수 있는 범위를 구분한다
          </p>
          <h2 className="mt-2 break-keep text-2xl font-bold">
            Storage proof와 현재 retrieval은 서로를 대신하지 못합니다
          </h2>
        </header>

        <p>
          같은 파일을 따라가도 단계마다 관측 가능한 사실이 다릅니다. Provider
          record는 후보를 알려 주고, Bitswap payload는 전송이 일어났음을 보여
          주며, CID 재계산은 받은 byte의 무결성을 확인합니다. Deal과 storage
          proof는 보관 lifecycle의 증거입니다. 현재 retrieval 성공은 그 순간
          선택한 경로가 검증된 byte를 돌려줬다는 사실만 더합니다.
        </p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            [
              "후보는 찾았지만 전송 실패",
              "오래된 provider record를 받았으나 peer가 block을 주지 않습니다.",
            ],
            [
              "전송됐지만 무결성 실패",
              "Gateway가 HTTP 200을 보냈지만 byte에서 계산한 CID가 다릅니다.",
            ],
            [
              "보관 증거는 있지만 retrieval 실패",
              "Deal과 proof는 보이지만 현재 접근 가능한 경로가 없습니다.",
            ],
            [
              "retrieval은 되지만 보관 약속 없음",
              "Local cache가 즉시 응답해도 장기 replica나 deal은 없을 수 있습니다.",
            ],
          ].map(([title, detail]) => (
            <li key={title} className="rounded-lg border border-border p-4">
              <strong>{title}</strong>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {detail}
              </p>
            </li>
          ))}
        </ul>

        <ExplainedFormula
          question="Storage proof가 있으면 지금 파일을 받을 수 있다고 결론내릴 수 있을까?"
          idea={
            <>
              보관 증거와 현재 retrieval은 관측 대상과 실패 원인이 다르므로 어느
              방향으로도 자동 추론할 수 없습니다.
            </>
          }
          formula={String.raw`E_{storage}\nRightarrow R_{now}\qquad R_{now}\nRightarrow E_{storage}`}
          annotatedFormula={String.raw`\underbrace{E_{storage}}_{\text{deal·storage proof}}\nRightarrow\underbrace{R_{now}}_{\text{현재 verified retrieval}}\qquad\underbrace{R_{now}}_{\text{cache·peer 응답}}\nRightarrow\underbrace{E_{storage}}_{\text{장기 보관 증거}}`}
          operations={[
            {
              expression: String.raw`E_{storage}=1,\;R_{now}=0`,
              annotation: [
                "Deal과 proof는 확인했지만 접근 가능한 provider가 없는 반례입니다",
                "보관 증거만으로 현재 retrieval을 증명할 수 없습니다",
              ],
            },
            {
              expression: String.raw`R_{now}=1,\;E_{storage}=0`,
              annotation: [
                "Local cache가 byte를 돌려줬지만 장기 deal이 없는 반례입니다",
                "현재 retrieval만으로 장기 보관을 증명할 수 없습니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "E_{storage}",
              name: "Storage evidence",
              description:
                "Piece와 deal 상태, protocol이 요구한 storage proof를 확인한 사실입니다.",
            },
            {
              symbol: "R_{now}",
              name: "Current verified retrieval",
              description:
                "선택한 경로에서 지금 받은 byte가 요청한 CID와 일치한다는 사실입니다.",
            },
          ]}
          assumptions={[
            "두 기호는 확률이나 SLA가 아니라 서로 다른 관측 사실을 나타냅니다.",
            "현재 retrieval 표본의 성공을 미래 가용성이나 영구 보존으로 확대하지 않습니다.",
          ]}
          interpretation="Deal·proof와 verified retrieval을 같은 화면에서 연결해 볼 수는 있지만 하나가 다른 하나를 논리적으로 보장하지는 않습니다. 그래서 두 상태를 별도로 읽어야 합니다."
        />

        <p>
          이 경계를 지키면 실패 지점도 정확해집니다. 후보 탐색에서 멈췄는지,
          byte 전송이나 CID 검증에서 멈췄는지, piece·deal 연결이 끊겼는지,
          storage proof는 있으나 현재 retrieval만 실패했는지를 구분할 수 있습니다.
          한 단계가 실패하면 그 뒤의 더 강한 주장을 만들지 않고 해당 단계에서
          멈춥니다.
        </p>

        <div id="paper-ipfs-filecoin">
          <CitationBlock
            type="code"
            citeKey={4}
            source="Storacha–Filecoin pipeline · commit 3b67918"
            href={FILECOIN}
          >
            <p>
              <strong>핵심:</strong> Offer, aggregate, dealer와 tracker 역할이
              content upload를 piece aggregation과 deal status에 연결합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Storacha의 current Filecoin
              integration protocol snapshot입니다. Generic IPFS retrieval은 IPFS
              규격을 따릅니다.
            </p>
            <p>
              <strong>확대 금지:</strong> Offer나 deal status가 current
              retrieval, permanent availability, 고정 기간이나 PoRep·PoSt 전체
              의미를 대신하지 않습니다.
            </p>
          </CitationBlock>
        </div>

        <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">이 글의 결론:</strong> IPFS의
          CID는 받은 byte가 맞는지 확인하게 하고, Filecoin의 deal과 proof는 보관
          lifecycle의 증거를 남깁니다. 두 체계를 연결하더라도 사용자가 지금
          파일을 받을 수 있는지는 cold retrieval로 다시 확인해야 합니다.
        </aside>
      </section>
    </article>
  );
}
