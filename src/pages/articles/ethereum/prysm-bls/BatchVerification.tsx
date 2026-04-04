import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BatchVerification({ onCodeRef }: Props) {
  return (
    <section id="batch-verification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">배치 검증 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>AggregateVerify</strong> — 서로 다른 (pk, msg) 쌍의 집계 서명을 한 번에 검증한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('bls-batch', codeRefs['bls-batch'])} />
          <span className="text-[10px] text-muted-foreground self-center">AggregateVerify()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">배치 vs 개별 성능</h3>
        <ul>
          <li><strong>개별 Verify</strong> — 패어링 2회/건. 1000건 = 2000 패어링</li>
          <li><strong>FastAggregateVerify</strong> — 패어링 2회 + 포인트 덧셈 999회</li>
          <li><strong>AggregateVerify</strong> — n+1 패어링 (밀러 루프 배치 최적화)</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 전략 선택</strong> — Prysm은 블록 내 어테스테이션 검증 시 FastAggregateVerify 우선<br />
          서로 다른 메시지가 섞이면 AggregateVerify로 폴백<br />
          Rogue-Key 방어: Proof of Possession — 검증자 등록 시 pk 소유 증명 제출
        </p>
      </div>
    </section>
  );
}
