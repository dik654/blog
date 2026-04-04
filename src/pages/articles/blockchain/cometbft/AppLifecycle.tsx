import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import AppLifecycleViz from './viz/AppLifecycleViz';
import { LIFECYCLE_CODE, LIFECYCLE_ANNOTATIONS, LEGACY_VS_ABCIPP, LEGACY_ANNOTATIONS } from './AppLifecycleData';
import type { CodeRef } from '@/components/code/types';

export default function AppLifecycle({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="app-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">애플리케이션 생명주기</h2>
      <div className="not-prose mb-8"><AppLifecycleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ABCI++ (v0.38+)에서 블록 생명주기는 4단계로 구성됩니다.
          <br />
          <strong>PrepareProposal → ProcessProposal → FinalizeBlock → Commit</strong> 순서로 실행됩니다.
          <br />
          레거시 ABCI의 BeginBlock/DeliverTx/EndBlock을 FinalizeBlock 하나로 통합했습니다.
          <br />
          앱이 블록 구성과 투표 확장(Vote Extension)을 직접 제어할 수 있습니다.
        </p>
        <CitationBlock source="CometBFT ABCI++ Spec" citeKey={7} type="paper" href="https://docs.cometbft.com/v0.38/spec/abci/">
          <p className="italic">"ABCI++ gives the application more control over block construction and vote extensions"</p>
          <p className="mt-2 text-xs">ABCI++의 핵심 변화: 앱이 블록 내용을 결정하고, 투표에 임의 데이터를 첨부할 수 있습니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 생명주기 상세</h3>
        <CodePanel title="ABCI++ 블록 실행 6단계" code={LIFECYCLE_CODE} annotations={LIFECYCLE_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">레거시 vs ABCI++ 비교</h3>
        <CodePanel title="ABCI 진화: 개별 호출 → 통합" code={LEGACY_VS_ABCIPP} annotations={LEGACY_ANNOTATIONS} />
      </div>
    </section>
  );
}
