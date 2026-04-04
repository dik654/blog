import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function GetHead({ onCodeRef }: Props) {
  return (
    <section id="get-head" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GetHead & 가중치 전파</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fc-head', codeRefs['fc-head'])} />
          <span className="text-[10px] text-muted-foreground self-center">computeHead()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Proposer Boost</strong> — 현재 슬롯 제안자의 블록에 위원회 가중치의 40%를 추가 부여<br />
          ex-ante reorg 공격을 방어하기 위한 메커니즘<br />
          동일 가중치 시 블록 루트 바이트 사전순 비교로 결정론적 결과 보장
        </p>
      </div>
    </section>
  );
}
