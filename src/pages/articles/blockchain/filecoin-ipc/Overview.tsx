import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IPC 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('ipc-subnet', codeRefs['ipc-subnet'])} />
          <span className="text-[10px] text-muted-foreground self-center">subnet.go — IPC 서브넷</span>
        </div>
        <p>
          IPC(InterPlanetary Consensus)는 Filecoin의 L2 서브넷 프레임워크.<br />
          메인넷의 보안을 상속하면서 커스텀 합의와 실행 환경을 구성
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 IPC가 Filecoin을 "범용 L1"으로 변환</strong> — 스토리지 전용이 아닌 컴퓨팅 플랫폼.<br />
          서브넷에서 DeFi, AI 추론, 게임 등 다양한 워크로드를 실행 가능
        </p>
      </div>
    </section>
  );
}
