import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { KuboGcViz, KuboReceiptViz } from "./viz/ModernKuboViz";

const KUBO_BITSWAP =
  "https://github.com/ipfs/kubo/blob/v0.43.1/core/node/bitswap.go";
const KUBO_PROVIDER =
  "https://github.com/ipfs/kubo/blob/v0.43.1/core/node/provider.go";
const KUBO_GC =
  "https://github.com/ipfs/kubo/blob/v0.43.1/gc/gc.go";
const TRUSTLESS_GATEWAY =
  "https://specs.ipfs.tech/http-gateways/trustless-gateway/";

export default function ModernKuboArticle() {
  return (
    <article>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          CID는 파일의 위치가 아니라, 받아야 할 bytes의 검증 기준입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>
              Kubo가 하는 일은 CID를 보고 곧바로 파일을 꺼내는 것이 아니라,
              물어볼 peer를 찾고 block을 받은 뒤 CID로 확인하고 local 보존 여부를
              정하는 것입니다.
            </strong>
          </p>
          <p>
            이 글에서는 한 사례만 끝까지 따라갑니다. Alice의 저장소에는
            <code>payroll-report-v1</code>의 UnixFS DAG가 있습니다. Root block
            <code>A</code>는 child block <code>B</code>와 <code>C</code>를
            가리킵니다. Bob은 root CID <code>A</code>만 알고 있고 자신의 local
            blockstore에는 세 block이 모두 없습니다.
          </p>
          <p>
            Provider 탐색은 Bob에게 후보 <code>P1</code>과 <code>P2</code>를
            돌려줍니다. <code>P1</code>의 광고는 오래되어 응답하지 않고,
            <code>P2</code>가 Alice입니다. Bob은 같은 CID를 <code>P2</code>에
            요청해 <code>A</code>를 받고, 그 안의 link를 읽은 뒤 <code>B</code>와
            <code>C</code>도 반복해서 가져옵니다. 마지막으로 recursive pin을
            걸어 local GC가 세 block을 지우지 않게 합니다.
          </p>
          <p>
            이 경로에는 서로 바꿔 쓸 수 없는 네 가지 증거가 있습니다. CID는
            bytes의 정체를, provider record는 물어볼 후보를, block receipt는
            실제 수신을, pin은 이 저장소 안에서의 보존을 말합니다. 앞 단계가
            성공했다고 뒤 단계까지 성공한 것으로 간주하면 stale 광고, partial
            DAG, hash mismatch, GC 삭제를 구별할 수 없습니다.
          </p>
          <p>
            CID와 Merkle DAG 자체는
            <Link to="/cs/p2p/content-addressing#overview"> content addressing</Link>
            에서, 후보를 반복해 좁히는 원리는
            <Link to="/cs/p2p/kademlia#overview"> Kademlia</Link>에서 다룹니다.
            여기서는 Kubo v0.43.1이 그 사이를 어떻게 연결하는지만 봅니다.
          </p>
        </div>

        <KuboReceiptViz />
      </section>

      <section id="routing-bitswap" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Provider 탐색은 후보를 만들고, retrieval은 검증할 block을 가져옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice가 block을 local blockstore에 넣으면 provider subsystem에 해당
            multihash의 제공 작업이 들어갈 수 있습니다. 하지만 v0.43.1의
            <code>StartProviding</code>과 <code>ProvideOnce</code>는 작업을 provide
            queue에 넣은 뒤 돌아오는 비동기 경로입니다.
          </p>
          <p>
            따라서 호출 성공은 “remote DHT 모두가 지금 광고를 받았다”는
            영수증이 아닙니다. Provider가 닫혔거나 충분히 오래 offline이면 queue
            등록 자체가 실패할 수도 있습니다.
          </p>
          <p>
            Bob 쪽에서 Kubo는 자체 provider query manager를 Bitswap client에
            연결합니다. v0.43.1의 기본값은 provider search delay 1초, 최대
            provider 결과 10개입니다. 이 숫자는 검색을 조절하는 설정값이지,
            정확히 1초 안에 10명을 발견한다는 SLA가 아닙니다. 후보가 0명일 수도
            있고, 첫 후보가 stale일 수도 있습니다.
          </p>
          <p>
            Block을 가져오는 길도 하나로 고정되지 않습니다. 설정에 따라 libp2p
            Bitswap network와 HTTP Retrieval을 함께 구성할 수 있고, 둘 다 끄면
            Kubo는 Bitswap을 초기화하지 않습니다. Transport가 무엇이든 release
            기준은 같습니다. 요청한 CID와 받은 block bytes가 맞아야 하고, root
            안의 link가 가리키는 child까지 모두 가져와야 완성된 DAG라고 말할 수
            있습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="CID A 하나에서 검증된 A·B·C DAG를 만드는 요청 절차"
          input={[
            "root=A, pending={A}, verified={}, provider 후보=P1(stale), P2(Alice)",
            "local blockstore에는 A·B·C가 없음",
          ]}
          steps={[
            {
              code: "cid = pending.pop(); local = blockstore.get(cid)",
              note: "Local hit이면 network를 쓰지 않습니다. Miss는 CID invalid가 아니라 외부 retrieval의 시작 조건입니다.",
            },
            {
              code: "if local is missing: candidates = findProviders(cid, boundedLimit)",
              note: "Provider record는 질의 후보입니다. 현재 possession·응답 속도·정직성을 증명하지 않습니다.",
            },
            {
              code: "for peer in candidates: block = request(peer, cid, deadline)",
              note: "P1 timeout은 이유를 기록하고 P2로 넘어갑니다. 같은 CID를 요청하며 timeout을 CID 오류로 바꾸지 않습니다.",
            },
            {
              code: "if hash(block.bytes) != cid.multihash: reject(peer, mismatch)",
              note: "Secure connection이나 HTTP 200은 content identity를 대신하지 않습니다. 불일치 bytes는 검증된 결과로 공개하지 않습니다.",
            },
            {
              code: "blockstore.put(block); verified.add(cid); pending.add(block.links - verified)",
              note: "A를 저장한 뒤 A가 가리키는 B·C를 새 pending으로 넣습니다. Root 한 개 수신과 전체 DAG 완성을 구분합니다.",
            },
            {
              code: "when pending is empty: pinRecursive(A)",
              note: "Pin은 local GC 보호입니다. Remote replica나 backup을 만들지는 않습니다.",
            },
          ]}
          repeatUntil="pending이 비거나, 모든 후보가 소진되거나, 취소·크기 제한·deadline에 도달할 때까지 CID별로 반복합니다."
          output="verified={A,B,C}, complete DAG receipt, local recursive pin receipt"
        />

        <CitationBlock
          source="Kubo v0.43.1 — core/node/bitswap.go · Boxo v0.43.0"
          citeKey={1}
          type="code"
          href={KUBO_BITSWAP}
        >
          <div id="paper-kubo-routing-v0431" className="space-y-2 text-sm leading-6">
            <p>
              <strong>확인한 구현:</strong> provider search delay 1초, 최대 provider
              10개의 기본값, Kubo 전용 provider query manager, libp2p와 HTTP
              Retrieval network 조합을 확인합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Kubo가 retrieval 후보와 network를 어떻게
              조립하는지에 한정합니다. 후보 수·검색 시간·download 성공률의 SLA는
              아닙니다.
            </p>
          </div>
        </CitationBlock>

        <CitationBlock
          source="Kubo v0.43.1 — core/node/provider.go"
          citeKey={2}
          type="code"
          href={KUBO_PROVIDER}
        >
          <div id="paper-kubo-provider-v0431" className="space-y-2 text-sm leading-6">
            <p>
              <strong>확인한 구현:</strong> <code>StartProviding</code>과
              <code>ProvideOnce</code>가 key를 queue에 추가한 뒤 비동기로 실제
              provide를 수행하며, closed·offline 상태에서 등록이 실패할 수 있음을
              확인합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Local provide lifecycle입니다. Remote
              routing table 반영 시각이나 영구적인 content availability를
              보장하지 않습니다.
            </p>
          </div>
        </CitationBlock>
      </section>

      <section id="pinning-gc" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Pin은 복제 명령이 아니라, local GC가 따라갈 보존 root입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            고정 사례의 blockstore를 <code>B={"{A,B,C,D,E}"}</code>라고
            하겠습니다. Recursive pin <code>A</code>에서 <code>A→B,C</code>를
            따라가고, MFS 또는 internal root가 <code>E</code>를 가리킵니다.
            그러면 보호 집합은 <code>R={"{A,B,C,E}"}</code>이고 어떤 root에서도
            닿지 않는 <code>D</code>만 sweep 후보입니다.
          </p>
          <p>
            Root <code>A</code>의 pin을 풀었다고 <code>B</code>와 <code>C</code>를
            즉시 지우면 안 됩니다. 다른 pin이나 MFS가 같은 child를 공유할 수
            있기 때문입니다. GC는 먼저 모든 보존 root에서 reachability를 다시
            계산하고 그 결과를 전체 block key 집합에서 뺍니다.
          </p>
        </div>

        <KuboGcViz />

        <CalculationWalkthrough
          title="작은 blockstore의 GC 장부"
          question="왜 A·B·C·E는 남고 D만 삭제 후보가 될까요?"
          scope="Kubo v0.43.1 GC의 mark-and-sweep 경계만 단순화합니다. 실제 disk bytes, datastore overhead와 concurrent write 비용은 포함하지 않습니다."
          steps={[
            {
              label: "GC 시작 시 가진 block key를 적습니다",
              expression: "B = {A, B, C, D, E}",
              result: "전체 5개",
              reason: "이 집합은 저장 용량이 아니라 비교할 local block key의 snapshot입니다.",
            },
            {
              label: "Recursive pin A에서 link를 따라갑니다",
              expression: "reach(A) = {A, B, C}",
              result: "3개 보호",
              reason: "Root A만 표시하지 않고 A가 가리키는 B와 C까지 표시합니다.",
            },
            {
              label: "다른 보존 root가 가리키는 E를 합칩니다",
              expression: "R = {A, B, C} ∪ {E}",
              result: "R = {A, B, C, E}",
              reason: "Pin·MFS·internal root 중 하나라도 block에 닿으면 보호됩니다.",
            },
            {
              label: "전체에서 보호 집합을 뺍니다",
              expression: "D_delete = B ∖ R",
              result: "D_delete = {D}",
              reason: "D만 어떤 보존 root에서도 닿지 않으므로 sweep 후보가 됩니다.",
            },
          ]}
          conclusion="다섯 block 중 지울 수 있는 후보는 D 하나입니다. Unpin은 삭제 영수증이 아니라 다음 GC에서 보호 집합을 다시 계산하게 하는 상태 변경입니다."
          caveats={[
            "Mark 도중 child link를 못 읽으면 v0.43.1은 ErrCannotFetchAllLinks로 sweep 전에 중단합니다.",
            "개별 delete가 실패하면 다른 후보 삭제는 계속하고 마지막에 ErrCannotDeleteSomeBlocks를 냅니다.",
            "Pin은 local repository 보존이며 remote 복제·backup·disk failure 복구와 다릅니다.",
          ]}
        />

        <ExplainedFormula
          question="GC 식에서 각 기호는 실제로 무엇을 뜻할까요?"
          idea="모든 local block key에서 보존 root를 따라 도달한 key를 뺍니다. 차집합에 남은 key만 삭제 후보입니다."
          formula={String.raw`R=R_{\mathrm{pin}}\cup R_{\mathrm{MFS}}\cup R_{\mathrm{internal}},\qquad D_{\mathrm{delete}}=B\setminus R`}
          annotatedFormula={String.raw`\underbrace{R}_{\text{보호 집합}}=\underbrace{R_{\mathrm{pin}}\cup R_{\mathrm{MFS}}\cup R_{\mathrm{internal}}}_{\text{각 root에서 닿은 block}},\qquad \underbrace{D_{\mathrm{delete}}}_{\text{삭제 후보}}=\underbrace{B}_{\text{local 전체}}\setminus\underbrace{R}_{\text{보호됨}}`}
          operations={[
            {
              expression: String.raw`R_{\mathrm{pin}}\cup R_{\mathrm{MFS}}\cup R_{\mathrm{internal}}`,
              annotation: ["모든 보존 root에서", "DAG link를 따라간 key의 합집합"],
            },
            {
              expression: String.raw`B\setminus R`,
              annotation: ["local 전체에서 보호 key를 제외", "남은 key만 sweep 후보"],
            },
          ]}
          terms={[
            { symbol: "B", name: "Blockstore keys", description: "GC가 확인하는 local block key 전체입니다." },
            { symbol: "R", name: "Protected keys", description: "Pin·MFS·internal root에서 도달한 block key입니다." },
            { symbol: "D_delete", name: "Delete candidates", description: "어떤 보존 root에서도 닿지 않은 sweep 후보입니다." },
          ]}
          assumptions={[
            "GC lock 안에서 best-effort root snapshot과 mark·sweep 경계를 유지합니다.",
            "Reachability 탐색이 모두 성공해야 sweep을 시작합니다.",
            "같은 multihash의 block은 codec이 달라도 같은 저장 block으로 보호합니다.",
          ]}
          interpretation="고정 사례에서는 B={A,B,C,D,E}, R={A,B,C,E}이므로 D_delete={D}입니다. 이 식은 지워도 되는 key를 고르며 실제 회수 bytes를 바로 계산하지는 않습니다."
        />

        <CitationBlock
          source="Kubo v0.43.1 — gc/gc.go"
          citeKey={3}
          type="code"
          href={KUBO_GC}
        >
          <div id="paper-kubo-gc-v0431" className="space-y-2 text-sm leading-6">
            <p>
              <strong>확인한 구현:</strong> GC lock, recursive·direct pin과
              best-effort root의 mark, raw CID key 변환, unmarked block sweep,
              mark 실패 시 중단과 delete 실패 후 계속하는 오류 경계를 확인합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 한 Kubo repository의 local
              reachability와 삭제입니다. Remote replica 수나 backup 복구 가능성은
              말하지 않습니다.
            </p>
          </div>
        </CitationBlock>
      </section>

      <section id="release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Gateway의 HTTP 200과 end-to-end content 검증은 같은 영수증이 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            일반 path gateway가 UnixFS 파일을 풀어 HTTP body로 돌려주면, 그
            재구성된 파일 bytes를 root CID와 바로 hash 비교해서는 안 됩니다.
            Root CID는 보통 UnixFS root DAG block을 가리키며, 사용자에게 보이는
            파일 전체 bytes의 단순 hash가 아니기 때문입니다. HTTP 200은 요청에
            응답했다는 transport/access 결과일 뿐입니다.
          </p>
          <p>
            Trustless Gateway는 검증 가능한 표현을 따로 정의합니다. Raw block
            응답은 <code>/ipfs/{"{cid}"}</code> 한 block에만 쓰며 body의 multihash를
            요청 CID와 직접 비교할 수 있습니다. Path traversal이나 전체 UnixFS
            DAG가 필요하면 CAR stream을 받아 각 block의 CID를 확인하고, 요청한
            root와 path를 따라 원하는 결과가 만들어졌는지 검증해야 합니다.
          </p>
          <p>
            따라서 Bob의 release gate는 두 층입니다. 먼저 block마다 CID를
            확인합니다. 그다음 <code>A→B,C</code> traversal이 완성됐는지, size와
            codec·authorization 정책을 통과했는지 확인합니다. 둘을 통과하기 전의
            임시 파일이나 CAR는 payroll 시스템에 공개하지 않습니다.
          </p>
        </div>

        <CitationBlock
          source="IPFS Trustless Gateway Specification — 2026-03-05"
          citeKey={4}
          type="spec"
          href={TRUSTLESS_GATEWAY}
        >
          <div id="paper-kubo-trustless-gateway-20260305" className="space-y-2 text-sm leading-6">
            <p>
              <strong>확인한 규격:</strong> 검증 가능한 응답을 raw block 또는 CAR
              stream으로 제한하고, raw는 단일 CID path만 허용하며, raw body의
              hash가 요청 CID의 multihash와 같아야 한다고 정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> HTTP gateway에서 end-to-end integrity를
              확인하는 표현 규칙입니다. Content availability, application
              authorization, malware 안전성을 보장하지 않습니다.
            </p>
          </div>
        </CitationBlock>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>한 trace로 묶어야 하는 release test</h3>
          <p>
            먼저 Alice가 <code>A·B·C</code>를 add하고 provide queue에 넣은 시각을
            기록합니다. 이어서 Bob이 후보를 발견하고 <code>P1</code>에서 timeout이
            난 시각, <code>P2</code>에서 block을 받은 시각을 같은 trace ID에
            연결합니다.
          </p>
          <p>
            그다음에는 block별 CID 검증과 DAG 완성 여부를 남깁니다. 마지막으로
            recursive pin을 건 뒤 GC를 실행하고 <code>A·B·C</code>가 남았는지
            확인합니다.
          </p>
          <p>
            이 기록이 있어야 “provide API가 성공했는데 왜 fetch가 실패했나”를
            queue, routing, retrieval, validation 중 어느 경계에서 깨졌는지
            설명할 수 있습니다.
          </p>
          <p>
            실패도 한 queue에 섞지 않습니다. Timeout과 stale provider는 다음
            후보로 재시도할 수 있지만, hash mismatch는 손상·악성 응답으로
            분리합니다. Partial DAG는 누락 CID를 기록하고, authorization 실패는
            다른 provider를 찾는다고 해결되지 않습니다. 취소되면 열린 stream과
            iterator를 닫고 검증 전 임시 결과를 삭제합니다.
          </p>
          <h3>이제 스스로 예측해 볼 질문</h3>
          <ul>
            <li>
              Provider 후보가 10개여도 모두 stale이면 Bob은 어떤 영수증까지 얻고
              어디서 멈출까요?
            </li>
            <li>
              A는 받았지만 C가 누락되면 CID A 검증 성공과 파일 공개 가능 여부는
              어떻게 달라질까요?
            </li>
            <li>
              A의 pin을 풀어도 MFS가 B를 가리키면 다음 GC에서 B가 남는 이유는
              무엇일까요?
            </li>
            <li>
              일반 gateway의 deserialized file body와 trustless CAR를 같은 방식으로
              hash 검증하면 왜 틀릴까요?
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
}
