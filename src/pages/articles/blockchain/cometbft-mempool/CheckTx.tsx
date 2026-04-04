import { codeRefs } from './codeRefs';
import CheckTxFlowViz from './viz/CheckTxFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function CheckTx({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="checktx" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CheckTx → ABCI 검증</h2>
      <div className="not-prose mb-8">
        <CheckTxFlowViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 proxyMtx의 역할</strong> — CheckTx는 MempoolReactor.Receive, RPC 핸들러 등
          여러 고루틴에서 동시 호출 가능. proxyMtx.Lock()으로 ABCI 호출을 직렬화하여
          앱의 CheckTx가 순서대로 처리되도록 보장.
        </p>
      </div>
    </section>
  );
}
