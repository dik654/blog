import type { CodeRef } from '@/components/code/types';

export default function Settlement({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="settlement" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">온체인 정산 &amp; 사용량 과금</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          FVM 스마트 컨트랙트로 사용량 기반 과금을 자동화.<br />
          클라이언트가 FIL을 예치 → SP가 서비스 → 주기적으로 자동 정산. 컨트랙트 코드가 곧 SLA
        </p>
      </div>
    </section>
  );
}
