import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PieceManagerViz from './viz/PieceManagerViz';

export default function PieceManagement({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="piece-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">피스 관리</h2>
      <p className="leading-7 mb-4">
        ManagedTorrent는 토렌트의 전체 생명주기를 상태 머신(State Machine)으로 관리합니다.<br />
        Initializing, Paused, Live, Error 네 가지 상태를 거칩니다.<br />
        각 상태 전환에는 리소스 할당/해제와 비트필드 관리가 수반됩니다.
      </p>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('chunk-tracker', codeRefs['chunk-tracker'])} />
          <CodeViewButton onClick={() => onCodeRef('piece-tracker', codeRefs['piece-tracker'])} />
          <CodeViewButton onClick={() => onCodeRef('managed-torrent-state', codeRefs['managed-torrent-state'])} />
        </div>
      )}

      <PieceManagerViz />

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">상태 전이 규칙</h3>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-foreground/60">전이</th>
                <th className="text-left py-2 px-3 font-medium text-foreground/60">트리거</th>
                <th className="text-left py-2 px-3 font-medium text-foreground/60">부작용</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Init → Paused', '초기화 완료', '파일 구조 생성, 비트필드 저장'],
                ['Paused → Live', '시작 명령', '피어 연결, 트래커 announce, DHT 검색'],
                ['Live → Paused', '일시정지', '모든 피어 종료, 진행 상황 저장'],
                ['Any → Error', '오류 발생', 'Live면 pause() 호출, 오류 로깅'],
                ['Error → Init', '재시작', '전체 초기화 재수행'],
              ].map(([trans, trigger, effect]) => (
                <tr key={trans} className="border-b border-border/50">
                  <td className="py-2 px-3 font-mono text-foreground/70">{trans}</td>
                  <td className="py-2 px-3 text-foreground/80">{trigger}</td>
                  <td className="py-2 px-3 text-foreground/80">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold">동시성 설계</h3>
        <p className="leading-7">
          ManagedTorrentLocked는 RwLock으로 보호됩니다.<br />
          상태 전환은 take() 메서드로 원자적으로 수행됩니다.<br />
          state_change_notify(Notify)가 대기 중인 태스크들에게 변경을 알립니다.
        </p>

        <h3 className="text-lg font-semibold">Piece/Chunk 계층 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BitTorrent Piece Structure
//
// File 구조 계층:
//
//   Torrent
//   ├── Files (multi-file)
//   │   ├── File 1
//   │   ├── File 2
//   │   └── File N
//   └── Pieces (fixed size, e.g., 256KB/1MB)
//       ├── Piece 0
//       │   ├── Chunk 0 (16KB block)
//       │   ├── Chunk 1
//       │   └── Chunk N
//       ├── Piece 1
//       └── Piece N

// 크기 설정:
//
//   Piece size:
//     16KB ~ 16MB (일반적)
//     Small torrent: 16-256KB
//     Large torrent: 1-16MB
//
//   Block size (chunk):
//     항상 16KB (16384 bytes)
//     Wire protocol에서 request 단위

// Bitfield:
//   각 bit = 1 piece
//   1 = have, 0 = don't have
//
//   Example:
//     Bitfield: 10110010
//     Have pieces: 0, 2, 3, 6

// Request Flow:
//
//   1. Peer sends bitfield
//   2. Calculate interested pieces (rarest first)
//   3. Request block by block:
//      REQUEST(piece_idx, offset, length=16KB)
//   4. Peer responds: PIECE(piece_idx, offset, data)
//   5. Store in chunk buffer
//   6. When piece complete → verify SHA-1
//   7. If hash valid → write to disk
//   8. BROADCAST HAVE to all peers

// rqbit's PieceTracker:
//
//   pieces: HashMap<piece_idx, PieceState>
//
//   PieceState:
//     status: InProgress / Complete / Verified
//     chunks_received: Vec<bool>
//     buffer: Option<Vec<u8>>
//
//   ChunkTracker:
//     per-piece chunk tracking
//     fine-grained progress

// Hash Verification:
//
//   expected = torrent_info.piece_hashes[idx]
//   actual = SHA1(piece_data)
//
//   if actual != expected:
//     discard piece
//     request again (from different peer)
//     add "bad piece" to peer score

// Endgame Mode:
//   마지막 몇 piece 남았을 때
//   모든 피어에게 동시 요청
//   먼저 응답한 것 수락
//   나머지 CANCEL 전송`}
        </pre>
      </div>
    </section>
  );
}
