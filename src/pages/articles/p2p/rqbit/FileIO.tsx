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
      </div>
    </section>
  );
}
