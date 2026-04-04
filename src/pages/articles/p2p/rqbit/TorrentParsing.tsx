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
      </div>
    </section>
  );
}
