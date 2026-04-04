import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function NewPayload({ onCodeRef }: Props) {
  return (
    <section id="new-payload" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NewPayload 호출</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">호출 시점</h3>
        <p>
          비콘 블록 처리 중 <code>notifyNewPayload()</code>가<br />
          실행 페이로드를 추출하여 EL에 전달한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('engine-new-payload', codeRefs['engine-new-payload'])} />
          <span className="text-[10px] text-muted-foreground self-center">NewPayload()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">요청 파라미터</h3>
        <ul>
          <li><strong>executionPayload</strong> — 트랜잭션, 상태 루트, 가스 정보</li>
          <li><strong>versionedHashes</strong> — Deneb blob KZG 커밋먼트 해시</li>
          <li><strong>parentBeaconBlockRoot</strong> — 부모 비콘 블록 루트</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 응답 3가지 상태</strong> — VALID: 모든 TX 실행 성공 + 상태 루트 일치<br />
          INVALID: 실행 실패 → 포크 선택에서 해당 체인 제거<br />
          SYNCING: EL이 아직 동기화 중 → 나중에 재검증 (임시 보류)
        </p>
      </div>
    </section>
  );
}
