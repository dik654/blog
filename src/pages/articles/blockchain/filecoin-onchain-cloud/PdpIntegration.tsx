import type { CodeRef } from '@/components/code/types';

export default function PdpIntegration({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="pdp-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PDP 기반 검증 가능 스토리지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          SP가 핫 데이터를 PDP로 주기적으로 증명. 봉인 없이 원본 그대로 저장.<br />
          증명 실패 시 자동 패널티 → SP 담보에서 클라이언트에게 보상 지급
        </p>
      </div>
    </section>
  );
}
