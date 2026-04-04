import RetrievalViz from './viz/RetrievalViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Retrieval({ onCodeRef }: Props) {
  return (
    <section id="retrieval" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">리트리벌 — HandleQuery() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        PayloadCID로 PieceStore 조회 → 가격 응답 → Payment Channel 전송<br />
        오프체인 마이크로페이먼트 — 최종 정산만 온체인
      </p>
      <div className="not-prose mb-8">
        <RetrievalViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
