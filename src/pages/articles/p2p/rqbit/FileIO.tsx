import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import FileIOViz from './viz/FileIOViz';

export default function FileIO({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="file-io" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">파일 I/O</h2>
      <p className="leading-7 mb-4">
        rqbit의 스토리지 계층은 FileStorage 트레이트로 추상화됩니다.<br />
        피스 기반 데이터를 파일 시스템에 매핑하고, SHA-1 해시 검증으로 무결성을 보장합니다.<br />
        HTTP 스트리밍과 UPnP 미디어 서버를 통해 다운로드 중인 파일도 실시간 제공합니다.
      </p>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('session-db', codeRefs['session-db'])} />
          <CodeViewButton onClick={() => onCodeRef('have-needed-selected', codeRefs['have-needed-selected'])} />
        </div>
      )}

      <FileIOViz />

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">성능 최적화</h3>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-foreground/60">기법</th>
                <th className="text-left py-2 px-3 font-medium text-foreground/60">설명</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['제로카피 버퍼', 'buffers 크레이트로 불필요한 메모리 복사 제거'],
                ['FastResume', '비트필드 저장/복원으로 재시작 시 전체 검사 회피'],
                ['pread/pwrite', '위치 기반 I/O로 파일 디스크립터 공유'],
                ['비동기 I/O', 'tokio 런타임 기반 논블로킹 파일 작업'],
                ['청크 추적', 'ChunkTracker가 피스 내 청크 수준 진행 관리'],
              ].map(([tech, desc]) => (
                <tr key={tech} className="border-b border-border/50">
                  <td className="py-2 px-3 font-mono text-foreground/70">{tech}</td>
                  <td className="py-2 px-3 text-foreground/80">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold">UPnP 미디어 서버</h3>
        <p className="leading-7">
          upnp-serve 크레이트가 DLNA 호환 미디어 서버를 구현합니다.<br />
          다운로드 중인 비디오를 스마트 TV 등 DLNA 기기에서 직접 스트리밍할 수 있습니다.<br />
          upnp 크레이트가 자동 포트 포워딩을 설정하여
          NAT(네트워크 주소 변환) 뒤에서도 외부 피어 연결을 받습니다.
        </p>

        <h3 className="text-lg font-semibold">파일 매핑 전략</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BitTorrent File ↔ Piece Mapping
//
// Multi-file torrent 구조:
//
//   Pieces: 연속된 바이트 스트림으로 취급
//
//   Files:
//     File 1: 0 ~ size1-1
//     File 2: size1 ~ size1+size2-1
//     File N: ...
//
//   Piece N → 여러 파일에 걸칠 수 있음
//
// Example:
//   Files: [A.mp4 (3GB), B.srt (20KB), C.mp3 (5MB)]
//   Piece size: 1MB
//
//   Piece 0: A.mp4 [0..1MB]
//   Piece 1: A.mp4 [1MB..2MB]
//   ...
//   Piece 3072: A.mp4 [..끝] + B.srt [처음]
//   Piece 3073: B.srt [..끝] + C.mp3 [처음]
//   ...

// Write 시 처리:
//
//   piece_idx, offset, data →
//     piece_start = piece_idx * piece_size
//     for each file in mapped_files:
//       if piece_start < file.end:
//         write to file at (piece_start - file.start)
//         update byte positions

// Read (streaming) 시:
//
//   HTTP Range request: bytes=1000000-2000000
//     start_piece = 1000000 / piece_size
//     end_piece = 2000000 / piece_size
//     wait for all pieces ready
//     serve bytes from files

// Performance Optimizations:
//
// 1. pread/pwrite (positional I/O)
//    File descriptor 공유 가능
//    No seek() syscall needed
//    Thread-safe reads
//
// 2. Pre-allocation
//    fallocate() or sparse files
//    Fragmentation 방지
//
// 3. Zero-copy with mmap (optional)
//    Read cache 자동 관리
//    Modified pages auto-writeback
//
// 4. Direct I/O (optional)
//    OS cache 우회
//    Large file용
//    관리 까다로움

// FastResume (resume.dat):
//   - Bitfield 저장
//   - 파일 체크섬 저장
//   - 다운로드 위치/개수
//   - 시작 시 재검증 skip
//
//   Checksum 다를 시 → 전체 재검증

// Streaming 지원 (rqbit):
//   HTTP API: /torrents/{id}/stream/{file_id}
//   Range request 지원
//   Sequential download 모드
//   DLNA/UPnP 연동`}
        </pre>
      </div>
    </section>
  );
}
