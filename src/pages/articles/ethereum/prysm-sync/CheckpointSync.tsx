import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function CheckpointSync({ onCodeRef: _ }: Props) {
  return (
    <section id="checkpoint-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 싱크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Checkpoint Sync는 Finalized된 상태를 신뢰할 수 있는 소스에서 직접 다운로드한다.<br />
          제네시스부터 재실행하지 않으므로 <strong>수 분</strong>이면 동기화가 완료된다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">동작 과정</h3>
        <ul>
          <li><strong>체크포인트 URL 설정</strong> — <code>--checkpoint-sync-url</code> 플래그로 지정</li>
          <li><strong>Finalized State 다운로드</strong> — /eth/v2/debug/beacon/states/finalized</li>
          <li><strong>Finalized Block 다운로드</strong> — 해당 상태의 블록도 함께 받음</li>
          <li><strong>DB 초기화</strong> — 다운로드한 상태·블록으로 DB를 설정</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Weak Subjectivity 보안</strong> — 체크포인트 싱크는 Weak Subjectivity Period 내에서만 안전<br />
          이 기간이 지나면 공격자가 가짜 상태를 주입할 수 있어<br />
          신뢰할 수 있는 소스(Infura, Lodestar 등) 선택이 보안의 핵심
        </p>
      </div>
    </section>
  );
}
