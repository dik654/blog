import CallBranchesViz from './viz/CallBranchesViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CallBranches({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="call-branches" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Call() 내부 분기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Call()은 단순한 함수 호출이 아님 — 스냅샷, 전송, 프리컴파일 분기, 컨트랙트 생성을 모두 처리
          <br />
          각 단계에서 실패하면 즉시 롤백 — 이전 상태로 되돌리고 에러 반환
        </p>
      </div>
      <div className="not-prose">
        <CallBranchesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
