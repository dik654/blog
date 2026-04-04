import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ForkchoiceUpdated({ onCodeRef }: Props) {
  return (
    <section id="forkchoice-updated" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ForkchoiceUpdated</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">역할</h3>
        <p>
          CL의 포크 선택 결과를 EL에 통보한다.<br />
          EL은 이 정보로 자체 캐노니컬 체인 헤드를 갱신한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('engine-forkchoice', codeRefs['engine-forkchoice'])} />
          <span className="text-[10px] text-muted-foreground self-center">ForkchoiceUpdated()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">ForkchoiceState</h3>
        <ul>
          <li><strong>headBlockHash</strong> — 현재 체인 헤드</li>
          <li><strong>safeBlockHash</strong> — 2/3 검증자가 투표한 블록</li>
          <li><strong>finalizedBlockHash</strong> — 되돌릴 수 없는 확정 블록</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 PayloadAttributes 이중 역할</strong> — 블록 제안자일 때만 포함<br />
          EL이 다음 블록 페이로드 빌드를 시작하고 payloadId를 반환<br />
          이 ID로 나중에 GetPayload를 호출 — FCU가 빌드 트리거 역할
        </p>
      </div>
    </section>
  );
}
