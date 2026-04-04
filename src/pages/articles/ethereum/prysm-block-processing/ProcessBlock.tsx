import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProcessBlock({ onCodeRef }: Props) {
  return (
    <section id="process-block" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ProcessBlock 내부</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('on-block', codeRefs['on-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">onBlock()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 RANDAO 보안</strong> — 제안자의 BLS 서명을 domain_randao로 검증 후<br />
          randaoMixes[epoch % 65536]에 XOR 반영<br />
          이전 RANDAO 값과 혼합하여 예측 불가능한 랜덤성 확보
        </p>
        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 eth1 투표 과반</strong> — 제안자가 관찰한 eth1 블록 해시를 투표<br />
          eth1_data_votes에 추가, 과반 시 상태에 확정<br />
          예치금 컨트랙트 상태를 비콘 체인에 반영하는 브릿지 역할
        </p>
      </div>
    </section>
  );
}
