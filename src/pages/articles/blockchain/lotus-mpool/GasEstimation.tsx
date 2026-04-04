import { codeRefs } from './codeRefs';
import GasDetailViz from './viz/GasDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function GasEstimation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="gas-estimation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가스 추정 & 선택</h2>
      <div className="not-prose mb-8">
        <GasDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} BaseFee 계산 차이</strong> — 이더리움은 블록 가스 50% 기준 조정
          <br />
          Filecoin은 블록 한도 대비 실제 사용률로 조정 + 메시지 바이트 크기 별도 부과
        </p>
      </div>
    </section>
  );
}
