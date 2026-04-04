import FinalizeBlockViz from './viz/FinalizeBlockViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ABCIIntegration({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="abci-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI 통합 — FinalizeBlock 파이프라인</h2>
      <div className="not-prose mb-8">
        <FinalizeBlockViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT 합의 후 <code>FinalizeBlock</code> 호출 → 앱이 블록 내 모든 TX를 실행<br />
          ABCI 2.0: <code>PrepareProposal</code> + <code>ProcessProposal</code>으로 앱이 블록 구성에 개입 가능
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => open('abci-finalizeblock')} />
          <span className="text-[10px] text-muted-foreground self-center">FinalizeBlock()</span>
          <CodeViewButton onClick={() => open('internal-finalizeblock')} />
          <span className="text-[10px] text-muted-foreground self-center">internalFinalizeBlock()</span>
          <CodeViewButton onClick={() => open('prepare-proposal')} />
          <span className="text-[10px] text-muted-foreground self-center">PrepareProposal()</span>
          <CodeViewButton onClick={() => open('commit')} />
          <span className="text-[10px] text-muted-foreground self-center">Commit()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">Optimistic Execution</h3>
        <p>
          ProcessProposal 직후 <strong>투기적 실행</strong> 시작 — 합의 완료 전 블록 실행을 선제 수행<br />
          FinalizeBlock 진입 시 해시 비교: 일치 → 결과 재사용, 불일치 → 상태 리셋 + 재실행<br />
          💡 대부분 일치 — 합의 지연 없이 블록 처리 시간 단축
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 생명주기</h3>
        <p>
          PrepareProposal → ProcessProposal → FinalizeBlock → Commit 순서<br />
          PrepareProposal: 제안자가 TX 선택/정렬 — MEV 방지 로직 삽입점<br />
          ProcessProposal: 검증자가 블록 유효성 확인<br />
          FinalizeBlock: beginBlock → TX 실행 → endBlock<br />
          Commit: MultiStore.Commit() → app_hash 영구 저장
        </p>
      </div>
    </section>
  );
}
