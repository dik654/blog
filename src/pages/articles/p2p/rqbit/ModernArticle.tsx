import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { RqbitPipelineViz, RqbitRangeViz } from "./viz/ModernRqbitViz";

export default function ModernRqbitArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            rqbit v9.0.1 · commit a499d2f · BTv1 download path
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            rqbit는 piece의 작업 주체를 정하고, hash가 맞은 뒤에만 읽는 쪽을 깨웁니다
          </h2>
        </header>
        <p className="text-lg leading-8">
          한 문장으로 답하면, rqbit는 peer 후보를 실제 연결과 구분하고, 필요한 piece를
          한 peer의 작업으로 예약해 16 KiB chunk를 모은 뒤, 전체 piece의 SHA-1이 맞아야
          HAVE 상태와 대기 중인 file stream을 갱신하는 Rust BitTorrent client입니다.
        </p>
        <p>
          앞 글의 700 KiB torrent를 그대로 사용하겠습니다. Piece length는 256 KiB이고,
          400 KiB부터 200 KiB를 읽는 stream은 piece 1과 2가 필요합니다. Peer A가 piece 1을
          너무 오래 붙잡으면 peer B가 그 작업을 가져올 수 있습니다. 그러나 chunk가 모두
          disk에 써졌다는 사실만으로 stream을 깨우지 않습니다.
        </p>
        <p>
          <code>check_piece</code>가
          성공해 checked state로 바뀐 뒤에만 읽기를 계속합니다.
        </p>
        <p>
          Metainfo·tracker·DHT·piece hash의 protocol 원리는 <a className="text-primary hover:underline" href="/cs/p2p/bittorrent#overview">BitTorrent 글</a>이
          소유합니다. 이 글은 그 원리가 rqbit 9.0.1의 <code>PieceTracker</code>, peer task,
          <code>FileOps</code>, <code>FileStream</code>에서 어떤 state transition이 되는지
          실제 source 순서로 좁혀 봅니다.
        </p>
        <RqbitPipelineViz />
      </section>

      <section id="peer-piece" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · candidate와 piece owner</p>
          <h2 className="mt-2 text-2xl font-bold">
            주소 후보와 다운로드 작업 주체를 따로 기록해야 죽은 peer의 일을 돌려놓을 수 있습니다
          </h2>
        </header>
        <p>
          DHT·tracker·PEX에서 온 IP:port는 <code>peer_queue</code>에 들어갈 후보입니다.
          Peer limit 안에서 연결하고 handshake·bitfield를 처리해야 live peer가 됩니다. Choke된
          peer는 새 piece를 얻지 못합니다. 연결이 죽으면 backoff 뒤 다시 후보 queue로 갈 수
          있지만, backoff를 다 쓰면 peer state에서 제거합니다.
        </p>
        <p>
          현재 <code>PieceTracker</code>는 각 piece를 HAVE, QUEUED, IN_FLIGHT,
          NOT_NEEDED 중 정확히 한 상태로 둔다는 invariant를 명시합니다. IN_FLIGHT에는
          owner peer와 시작 시각이 있습니다. Pause할 때도 in-flight piece를 queue로 되돌린
          뒤 <code>ChunkTracker</code>로 바꾸므로, 사라진 task가 piece를 영원히 점유하지 않습니다.
        </p>
        <p>
          선택 순서는 단순한 “첫 peer에게 하나 배정”이 아닙니다. 새 peer의 평균 piece 시간이
          4초라면 먼저 40초 이상 걸린 다른 owner의 piece를 steal할 수 있는지 봅니다. 없으면
          active stream이 곧 읽을 priority piece, 그다음 일반 queue를 봅니다. 그래도 일이
          없으면 12초 이상 걸린 owner를 다시 찾습니다.
        </p>
        <p>
          10배와 3배는 v9.0.1 source에 박힌
          현재 threshold이며 보편적인 BitTorrent 규칙은 아닙니다.
        </p>
        <CalculationWalkthrough
          title="rqbit 9.0.1의 steal threshold를 손으로 확인"
          question="평균 4초인 peer B는 44초째인 piece 1을 가져올 수 있을까요?"
          scope="PieceTracker::acquire_piece의 첫 10× steal branch만 계산합니다. B가 piece 1을 보유하고 per-piece write lock을 잡을 수 있다는 조건입니다."
          steps={[
            {
              label: "새 peer의 평균 시간을 기준으로 둡니다",
              expression: "B average = 4 s",
              result: "기준 4초",
              reason: "기존 owner A의 평균이 아니라 일을 가져오려는 B의 측정값입니다.",
            },
            {
              label: "첫 steal 문턱을 계산합니다",
              expression: "4 s × 10 = 40 s",
              result: "10× 문턱 40초",
              reason: "새 queue piece를 찾기 전에 아주 느린 in-flight 작업부터 확인합니다.",
            },
            {
              label: "A가 붙잡은 실제 시간을 비교합니다",
              expression: "44 s ≥ 40 s",
              result: "steal 후보",
              reason: "B의 bitfield와 can_steal lock 조건도 통과해야 최종 선택됩니다.",
            },
            {
              label: "Owner를 바꾸고 시간을 다시 잽니다",
              expression: "owner: A → B, started = now",
              result: "B가 piece 1 담당",
              reason: "이후 A의 같은 piece request를 cancel하고 B의 새 attempt를 추적합니다.",
            },
          ]}
          conclusion="이 고정 사례에서는 첫 10× branch에서 B가 piece 1을 가져옵니다. 39초였다면 새 priority·queued piece를 먼저 찾고, 마지막 3× branch에서 다시 판단합니다."
          caveats={[
            "평균 시간이 아직 없으면 steal 계산을 건너뜁니다.",
            "느리다는 이유만으로 data corruption을 뜻하지 않으며, hash admission은 뒤에서 따로 합니다.",
          ]}
        />
        <AlgorithmBlock
          title="Peer B가 다음 piece를 얻는 실제 선택 순서"
          input={[
            "peer = B, average_piece_time = 4 s",
            "B.bitfield + active stream priority pieces",
            "PieceTracker { queued, inflight(owner, started) }",
          ]}
          steps={[
            {
              code: "return None if B is choked",
              note: "연결 후보나 live peer라는 사실만으로 request 권한이 생기지 않습니다.",
            },
            {
              code: "try_steal(peer=B, threshold=10×average)",
              note: "B가 가진 piece이고 write lock을 얻을 수 있는 가장 오래된 작업을 찾습니다.",
            },
            {
              code: "else reserve first stream_priority piece B has",
              note: "FileStream들이 다음에 읽을 piece를 서로 interleave해 먼저 제시합니다.",
            },
            {
              code: "else reserve first queued piece B has",
              note: "선택 파일의 일반 download 순서에서 아직 owner가 없는 piece를 찾습니다.",
            },
            {
              code: "else try_steal(peer=B, threshold=3×average)",
              note: "새 일이 없을 때 덜 극단적으로 느린 owner까지 재검토합니다.",
            },
            {
              code: "on Stolen(piece, A): notify A and cancel A requests",
              note: "PieceTracker lock을 놓은 뒤 peer table을 만져 lock 순서 deadlock을 피합니다.",
            },
          ]}
          output="Reserved(piece) · Stolen(piece, from_peer) · NoneAvailable"
        />
        <p>
          v9.0.1은 attempt generation 번호를 block마다 붙이지 않습니다. 대신 cancel을 보낸
          request 수만큼 <code>late_cancelled_request_tolerance</code>를 올립니다. 그 범위의
          늦은 chunk는 쓰지 않고 무시하며, 범위를 넘은 unexpected chunk는 peer 오류가 됩니다.
        </p>
        <p>
          Disk에 쓰기 직전에도 PieceTracker의 현재 owner가 sender인지 다시 확인하므로 이전
          owner의 늦은 byte가 새 owner의 piece buffer에 섞이지 않습니다.
        </p>
        <div id="paper-rqbit-live-v901">
          <CitationBlock
            source="rqbit v9.0.1 — piece_tracker.rs · torrent_state/live/mod.rs"
            citeKey={1}
            type="code"
            href="https://github.com/ikatson/rqbit/blob/v9.0.1/crates/librqbit/src/piece_tracker.rs"
          >
            <p><strong>문제:</strong> 여러 peer task가 piece를 중복 점유하지 않게 예약하고 실패·pause·slow owner 뒤 다시 배치합니다.</p>
            <p><strong>기여:</strong> HAVE·QUEUED·IN_FLIGHT·NOT_NEEDED invariant, 10×→reserve→3× acquisition, owner steal을 구현합니다.</p>
            <p><strong>전제:</strong> rqbit v9.0.1 tag commit a499d2f의 BTv1 live path와 session option을 고정합니다.</p>
            <p><strong>근거 범위:</strong> 한 process 안의 piece owner와 peer request scheduling입니다.</p>
            <p><strong>말하지 않는 것:</strong> Peer의 정직성, 고정 throughput, 이 threshold의 모든 workload 최적성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="piece-verify" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · chunk receipt와 piece admission</p>
          <h2 className="mt-2 text-2xl font-bold">
            마지막 chunk를 쓴 순간과 검증된 piece가 된 순간 사이에 hash gate가 있습니다
          </h2>
        </header>
        <p>
          rqbit의 <code>CHUNK_SIZE</code>는 16,384 bytes입니다. Live peer의 기본 request
          window는 128개이며 extended handshake의 <code>reqq</code>가 더 작으면 그 값으로
          줄어듭니다. 따라서 단순 상한 장부로는 peer 하나당 최대 128×16 KiB=2 MiB의
          request가 날아갈 수 있습니다. 실제 outstanding byte는 남은 piece, choke,
          response와 option에 따라 더 작습니다.
        </p>
        <p>
          Piece message가 오면 rqbit는 per-piece write lock을 잡고 chunk를 storage에 씁니다.
          <code>mark_chunk_downloaded</code>가 Completed를 반환하면 PieceTracker의 in-flight
          entry를 먼저 뺍니다. 그다음 <code>FileOps::check_piece</code>가 여러 file에 걸칠 수
          있는 piece byte를 읽어 SHA-1을 계산하고 metainfo와 비교합니다.
        </p>
        <p>
          Match면 <code>mark_piece_hash_ok</code> 뒤 checked byte·piece counter를 올리고,
          file readiness, stream waker와 peer HAVE를 갱신합니다. Mismatch면
          <code>mark_piece_hash_failed</code>가 piece를 queue로 되돌리고 현재 peer task를
          오류로 끝냅니다. Hash 하나만으로 어느 byte가 틀렸는지는 모르므로 piece 전체를
          다시 받습니다.
        </p>
        <CalculationWalkthrough
          title="기본 peer request window의 byte 상한"
          question="16 KiB chunk를 128개 요청하면 outstanding payload는 얼마일까요?"
          scope="rqbit v9.0.1의 CHUNK_SIZE와 DEFAULT_PEER_REQUEST_WINDOW만 곱한 상한 장부입니다. Wire header·TCP/uTP overhead와 실제 response timing은 뺍니다."
          steps={[
            {
              label: "Chunk 하나의 byte를 확인합니다",
              expression: "16 KiB = 16 × 1,024 B",
              result: "16,384 B",
              reason: "Rqbit core constant와 BitTorrent request 단위를 같은 byte로 맞춥니다.",
            },
            {
              label: "기본 window 수를 곱합니다",
              expression: "16 KiB × 128",
              result: "2,048 KiB",
              reason: "응답을 기다리며 동시에 추적할 수 있는 request slot 수입니다.",
            },
            {
              label: "MiB로 바꿉니다",
              expression: "2,048 KiB ÷ 1,024",
              result: "2 MiB",
              reason: "Peer 하나의 기본 payload 상한을 읽기 쉬운 단위로 바꿉니다.",
            },
          ]}
          conclusion="기본 설정의 산술 상한은 peer당 2 MiB입니다. 이것은 메모리 전체 사용량이나 실제 network traffic 측정값이 아닙니다."
          caveats={[
            "Peer가 광고한 reqq가 128보다 작으면 request window도 작아집니다.",
            "마지막 chunk, 이미 완료된 piece, cancel·timeout 때문에 실제 outstanding payload는 달라집니다.",
          ]}
        />
        <div id="paper-rqbit-file-ops-v901">
          <CitationBlock
            source="rqbit v9.0.1 — file_ops.rs · live piece completion"
            citeKey={2}
            type="code"
            href="https://github.com/ikatson/rqbit/blob/v9.0.1/crates/librqbit/src/file_ops.rs"
          >
            <p><strong>문제:</strong> Storage에 모은 chunk들이 metainfo가 지정한 정확한 piece인지 판정합니다.</p>
            <p><strong>기여:</strong> Multi-file range hashing, expected SHA-1 비교, success·broken state transition을 구현합니다.</p>
            <p><strong>전제:</strong> BTv1 metainfo, Lengths와 FileStorage mapping이 같은 torrent에 속합니다.</p>
            <p><strong>근거 범위:</strong> Live download의 completed-piece integrity admission입니다.</p>
            <p><strong>말하지 않는 것:</strong> Publisher 신원, malware 안전성, disk fsync 완료, SHA-1의 신규 설계 적합성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="range-release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · verified range stream과 restart</p>
          <h2 className="mt-2 text-2xl font-bold">
            현재 piece가 없으면 FileStream은 Pending으로 기다립니다
          </h2>
        </header>
        <p>
          rqbit의 streaming API는 file ID 하나로 <code>FileStream</code>을 만듭니다. HTTP
          handler 같은 caller가 seek한 뒤 read할 수 있지만, stream 자체가 여러 file을
          이어 붙인 가상 파일은 아닙니다. File 안 offset에 그 file의 torrent 절대 시작
          offset을 더해야 실제 piece index가 나옵니다.
        </p>
        <ExplainedFormula
          question="파일 안 offset o부터 n byte를 읽을 때 필요한 torrent piece는 어디까지일까요?"
          idea="파일의 torrent 절대 시작점 A를 더해 첫 byte와 마지막 포함 byte를 전체 torrent 좌표로 바꾼 뒤 piece length L로 나눕니다."
          formula={String.raw`p_{first}=\operatorname{floor}\!\left(\frac{A+o}{L}\right),\quad p_{last}=\operatorname{floor}\!\left(\frac{A+o+n-1}{L}\right)`}
          annotatedFormula={String.raw`\underbrace{p_{first}}_{\text{첫 필요 piece}}=\operatorname{floor}\!\left(\frac{\underbrace{A}_{\text{파일의 torrent 시작}}+\underbrace{o}_{\text{파일 안 시작 offset}}}{\underbrace{L}_{\text{piece 길이}}}\right),\quad \underbrace{p_{last}}_{\text{마지막 필요 piece}}=\operatorname{floor}\!\left(\frac{A+o+\underbrace{n}_{\text{읽을 byte 수}}-1}{L}\right)`}
          operations={[
            { expression: String.raw`A+o`, annotation: ["파일 내부 좌표를 torrent 전체 좌표로 옮깁니다.", "고정 예시는 첫 파일이라 A=0입니다."] },
            { expression: String.raw`A+o+n-1`, annotation: ["End-exclusive가 아니라 마지막 포함 byte를 구합니다.", "400+200−1=599 KiB입니다."] },
            { expression: String.raw`\operatorname{floor}(byte/L)`, annotation: ["각 byte가 들어 있는 0-based piece index입니다.", "400 KiB는 piece 1, 599 KiB는 piece 2입니다."] },
          ]}
          terms={[
            { symbol: "A", name: "file absolute start", description: "해당 file이 torrent 전체 byte 열에서 시작하는 offset입니다." },
            { symbol: "o", name: "file offset", description: "Caller가 file 안에서 seek한 0-based byte 위치입니다." },
            { symbol: "n", name: "read length", description: "읽고 싶은 byte 수이며 n=0은 식 밖에서 빈 요청으로 처리합니다." },
            { symbol: "L", name: "piece length", description: "Metainfo의 일반 piece 길이입니다. 마지막 piece는 더 짧을 수 있습니다." },
          ]}
          assumptions={[
            "0<n이고 o+n이 file length 안에 있으며 정수 overflow가 없습니다.",
            "고정 예시의 file은 torrent offset A=0에서 시작합니다.",
            "BTv1 multi-file piece는 file 경계를 넘을 수 있지만 FileStream은 한 file의 byte만 반환합니다.",
          ]}
          interpretation="A=0, o=400 KiB, n=200 KiB, L=256 KiB이면 first=1, last=2입니다. 두 piece가 checked여야 전체 range를 반환할 수 있습니다."
        />
        <CalculationWalkthrough
          title="400–599 KiB range를 piece로 바꾸는 장부"
          question="왜 piece 1과 2를 모두 기다려야 할까요?"
          scope="첫 file이 torrent offset 0에서 시작하고 전체 torrent는 700 KiB입니다. Range는 [400, 600) KiB입니다."
          steps={[
            {
              label: "마지막 포함 byte를 구합니다",
              expression: "400 + 200 - 1",
              result: "599 KiB",
              reason: "600 KiB는 end-exclusive라 실제 response에 포함되지 않습니다.",
            },
            {
              label: "첫 byte의 piece를 찾습니다",
              expression: "floor(400 ÷ 256)",
              result: "piece 1",
              reason: "Piece 1은 256–511 KiB를 덮습니다.",
            },
            {
              label: "마지막 byte의 piece를 찾습니다",
              expression: "floor(599 ÷ 256)",
              result: "piece 2",
              reason: "Piece 2는 이 torrent의 512–699 KiB를 덮습니다.",
            },
            {
              label: "필요한 연속 piece 수를 셉니다",
              expression: "2 - 1 + 1",
              result: "2 pieces",
              reason: "양 끝 index를 모두 포함하므로 1을 더합니다.",
            },
          ]}
          conclusion="Piece 1이 있어도 piece 2가 없으면 첫 부분만 읽은 뒤 다음 poll은 Pending입니다. Piece 2 hash 성공이 waker를 깨우면 남은 byte를 이어 읽습니다."
          caveats={[
            "한 번의 poll_read는 현재 piece 경계·file 끝·caller buffer 중 가장 가까운 곳까지만 읽습니다.",
            "이 계산은 ready 조건을 찾을 뿐 HTTP authorization이나 response cache 정책을 결정하지 않습니다.",
          ]}
        />
        <RqbitRangeViz />
        <p>
          Runtime에서 새로 받은 piece는 이 hash gate를 통과합니다. 다만 process restart의
          fast-resume은 모든 HAVE piece를 매번 전부 다시 hash하지 않습니다. v9.0.1은 file마다
          적어도 한 piece를 고르고 나머지는 감소하는 확률로 sampling해 검사합니다.
        </p>
        <p>
          Sample
          하나라도 깨지면 저장된 bitfield를 지우고 full recovery 쪽으로 돌아갑니다. 따라서
          “resume이 즉시 됐다”를 “disk의 모든 byte를 이번 시작에서 재검증했다”로 확대하면 안 됩니다.
        </p>
        <div id="paper-rqbit-streaming-v901">
          <CitationBlock
            source="rqbit v9.0.1 — streaming.rs · initializing.rs"
            citeKey={3}
            type="code"
            href="https://github.com/ikatson/rqbit/blob/v9.0.1/crates/librqbit/src/torrent_state/streaming.rs"
          >
            <p><strong>문제:</strong> Download 중인 file에서 아직 없는 piece를 기다리고 restart 시간을 줄입니다.</p>
            <p><strong>기여:</strong> FileStream의 piece-aware Pending·waker, stream priority interleave와 sampled fast-resume validation을 구현합니다.</p>
            <p><strong>전제:</strong> rqbit v9.0.1 storage·metainfo·saved bitfield가 같은 session directory에 속합니다.</p>
            <p><strong>근거 범위:</strong> 한 file의 local read readiness와 initialization-time have-state recovery입니다.</p>
            <p><strong>말하지 않는 것:</strong> 모든 restart의 full rehash, HTTP 권한, disk durability, consumer receipt를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
