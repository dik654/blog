import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PayloadRetrieval({ onCodeRef }: Props) {
  return (
    <section id="payload-retrieval" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GetPayload & MEV-Boost</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">GetPayloadV3</h3>
        <p>
          ForkchoiceUpdated에서 받은 <code>payloadId</code>로<br />
          EL이 빌드한 페이로드를 회수한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('engine-get-payload', codeRefs['engine-get-payload'])} />
          <span className="text-[10px] text-muted-foreground self-center">GetPayload()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 조립 완료</h3>
        <ul>
          <li><strong>비콘 블록 헤더</strong> — slot, proposer_index, parent_root, state_root</li>
          <li><strong>실행 페이로드</strong> — GetPayload 또는 MEV-Boost에서 획득</li>
          <li><strong>BLS 서명</strong> — RANDAO reveal + 블록 서명</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 MEV-Boost 비드 비교</strong> — MEV-Boost 릴레이에서도 페이로드 비드를 받음<br />
          로컬 빌드 가치 vs 릴레이 비드 가치를 비교하여 더 높은 쪽 선택<br />
          조립된 블록에 제안자 서명을 추가하고 GossipSub으로 전파
        </p>
      </div>
    </section>
  );
}
