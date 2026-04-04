import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Talk({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="talk" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TALKREQ / TALKRESP</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          discv5는 노드 탐색 전용이 아니다. <code>TALKREQ/TALKRESP</code>를 통해
          임의의 애플리케이션 프로토콜을 디스커버리 채널 위에서 실행할 수 있다.
        </p>

        <h3>메시지 구조</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {[
            { name: 'TALKREQ', fields: 'ReqID, Protocol string, Message []byte' },
            { name: 'TALKRESP', fields: 'ReqID, Message []byte' },
          ].map(m => (
            <div key={m.name} className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="font-mono font-bold text-sm text-violet-400">{m.name}</p>
              <p className="text-xs text-foreground/60 mt-1 font-mono">{m.fields}</p>
            </div>
          ))}
        </div>
        <p>
          <code>Protocol</code> 필드는 문자열 식별자. 핸들러 미등록 시 빈 <code>TALKRESP</code> 반환.
        </p>

        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('handle-unknown', codeRefs['handle-unknown'])} />
          <span className="text-[10px] text-muted-foreground self-center">v5_udp.go — TalkRequest도 동일한 세션 핸드셰이크 위에서 동작</span>
        </div>

        <h3>Portal Network 활용</h3>
        <p>
          Portal Network는 <code>"portal"</code> 프로토콜 ID로 TALKREQ를 사용한다.<br />
          경량 클라이언트가 상태/히스토리/비콘 데이터에 TCP 없이 접근할 수 있다.<br />
          방화벽 환경에서도 유리하다.
        </p>
      </div>
    </section>
  );
}
