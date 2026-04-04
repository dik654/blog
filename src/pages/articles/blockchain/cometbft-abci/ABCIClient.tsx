import { codeRefs } from './codeRefs';
import CallPathViz from './viz/CallPathViz';
import type { CodeRef } from '@/components/code/types';

export default function ABCIClient({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="abci-client" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI 클라이언트 — 호출 경로</h2>
      <div className="not-prose mb-6"><CallPathViz onOpenCode={open} /></div>
      <p className="text-sm border-l-2 border-amber-500/50 pl-3">
        <strong>💡 로컬 클라이언트가 가장 빠른 이유</strong> — Cosmos SDK는 CometBFT와 같은 프로세스에서 실행.<br />
        localClient는 Mutex 보호 직접 함수 호출 — gRPC 오버헤드(직렬화, 네트워크) 없음.
      </p>
    </section>
  );
}
