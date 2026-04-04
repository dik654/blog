import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Checkpointing({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="checkpointing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인팅 & 크로스 서브넷 메시지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('ipc-subnet', codeRefs['ipc-subnet'])} />
          <span className="text-[10px] text-muted-foreground self-center">SubmitCheckpoint()</span>
        </div>
        <p>
          서브넷 상태 해시를 주기적으로 메인넷에 커밋 → 보안 앵커 역할.<br />
          체크포인트 = (서브넷ID, 에폭, 상태루트, 크로스메시지 머클루트)
        </p>
        <p>
          검증자 2/3 이상 서명이 있어야 체크포인트가 수락됨.<br />
          크로스 서브넷 메시지: 서브넷 간 FIL 이동이나 메시지 전달이 가능
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 계층적 보안 모델</strong> — 서브넷이 서브넷을 생성할 수도 있음(재귀적).<br />
          최종 보안 앵커는 항상 Filecoin 메인넷. 계층 깊이에 상관없이 메인넷의 finality를 상속
        </p>
      </div>
    </section>
  );
}
