import { codeRefs } from './codeRefs';
import FinalizeBlockViz from './viz/FinalizeBlockViz';
import CommitViz from './viz/CommitViz';
import type { CodeRef } from '@/components/code/types';

export default function FinalizeCommit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="finalize-commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FinalizeBlock & Commit</h2>
      <h3 className="text-lg font-semibold mb-3">FinalizeBlock — 블록 실행</h3>
      <div className="not-prose mb-6"><FinalizeBlockViz onOpenCode={open} /></div>
      <p className="text-sm border-l-2 border-amber-500/50 pl-3 mb-8">
        <strong>💡 ABCI v2 핵심 변경</strong> — BeginBlock/DeliverTx/EndBlock을 FinalizeBlock 하나로 통합<br />
        앱은 모든 TX를 한 번에 받아 처리, TxResults + ValidatorUpdates + AppHash 반환
      </p>
      <h3 className="text-lg font-semibold mb-3">Commit — 상태 영구 저장</h3>
      <div className="not-prose mb-6"><CommitViz onOpenCode={open} /></div>
      <p className="text-sm border-l-2 border-sky-500/50 pl-3">
        <strong>💡 Commit 순서</strong> — 앱 Commit() 후에 CometBFT state.Save() 호출<br />
        역순이면 크래시 복구 시 앱/CometBFT 상태 불일치 발생
      </p>
    </section>
  );
}
