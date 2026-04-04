import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">P2P 스택 전체 구조</h2>
      <p className="text-sm text-muted-foreground mb-4">
        CometBFT P2P — MConnection(다중화) → Switch(피어 관리) → Reactor(메시지 핸들러) 3계층.<br />
        아래 step을 넘기며 각 계층의 역할과 소스 코드를 추적한다.
      </p>
      <div className="not-prose"><ContextViz onOpenCode={open} /></div>
    </section>
  );
}
