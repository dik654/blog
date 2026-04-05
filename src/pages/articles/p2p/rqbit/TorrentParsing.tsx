import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import TorrentParseViz from './viz/TorrentParseViz';

export default function TorrentParsing({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="torrent-parsing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Torrent 파싱</h2>
      <p className="leading-7 mb-4">
        rqbit은 .torrent 파일과 마그넷 링크를 모두 지원합니다.<br />
        bencode 크레이트가 Serde 기반 직렬화/역직렬화를 제공합니다.<br />
        librqbit_core가 토렌트 메타데이터의 핵심 타입(Id20, TorrentMetadata)을 정의합니다.
      </p>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('id20', codeRefs['id20'])} />
          <CodeViewButton onClick={() => onCodeRef('managed-torrent-shared', codeRefs['managed-torrent-shared'])} />
        </div>
      )}

      <TorrentParseViz />

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">핵심 데이터 타입</h3>
        <div className="rounded-xl border p-4">
          <ul className="space-y-1.5 text-sm">
            <li><strong className="font-mono">Id20</strong>: 20바이트 배열. Info Hash와 Peer ID의 기본 타입. XOR distance() 연산을 지원.</li>
            <li><strong className="font-mono">TorrentMetadata</strong>: 토렌트 이름, 피스 길이, 피스 해시 목록, file_infos(경로/크기)를 포함.</li>
            <li><strong className="font-mono">ManagedTorrentShared</strong>: Arc로 공유되는 토렌트 공통 정보. ID, 해시, 설정, 상태 변경 알림(Notify).</li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold">Bencode 직렬화</h3>
        <p className="leading-7">
          Bencode(BitTorrent 직렬화 형식)는 정수(i), 문자열(길이:), 리스트(l), 딕셔너리(d)로 구성됩니다.<br />
          rqbit의 bencode 크레이트는 Serde의 Deserialize/Serialize를 구현하여
          Rust 구조체와 Bencode 간 자동 변환을 지원합니다.<br />
          buffers 크레이트의 제로카피 최적화가 대용량 토렌트 파싱 성능을 보장합니다.
        </p>

        <h3 className="text-lg font-semibold">Bencode Format 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bencode Encoding (BEP-3)
//
// 4 Types:
//
// 1. Integer:
//    i<number>e
//    Examples:
//      i42e         → 42
//      i-7e         → -7
//      i0e          → 0
//      (no leading zeros, no i-0e)
//
// 2. Byte String:
//    <length>:<bytes>
//    Examples:
//      4:spam       → "spam"
//      0:           → ""
//      3:abc        → "abc"
//
// 3. List:
//    l<items>e
//    Examples:
//      l4:spam4:eggse       → ["spam", "eggs"]
//      li1ei2ei3ee          → [1, 2, 3]
//      le                   → []
//
// 4. Dictionary:
//    d<key-value pairs>e
//    Keys must be byte strings, sorted
//    Examples:
//      d3:foo3:bar5:helloi52ee
//        → {"foo": "bar", "hello": 52}

// .torrent File Structure:
//
// d
//   8:announce <tracker_url>
//   13:announce-list <list of trackers>
//   10:created by <client_name>
//   13:creation date i<timestamp>e
//   4:info d
//     6:length i<total_size>e
//     4:name <torrent_name>
//     12:piece length i<chunk_size>e
//     6:pieces <concatenated SHA-1 hashes>
//     5:files l (multi-file mode)
//       d
//         6:length i<file_size>e
//         4:path l<path_components>e
//       e
//     e
//   e
// e

// InfoHash Calculation:
//   info_hash = SHA-1(bencode(info_dict))
//
//   → 20-byte identifier
//   → 토렌트의 고유 ID
//   → Magnet link의 btih 파라미터

// Magnet Link Format:
//   magnet:?xt=urn:btih:<infohash>
//          &dn=<display_name>
//          &tr=<tracker_url>
//          &x.pe=<peer_address>
//
// InfoHash만으로 metadata 획득 가능:
//   - DHT에서 peer 찾기
//   - Peer에서 metadata fetch (BEP-9)
//   - .torrent 파일 없이 다운로드`}
        </pre>
      </div>
    </section>
  );
}
