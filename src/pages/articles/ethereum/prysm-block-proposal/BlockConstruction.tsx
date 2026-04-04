import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlockConstruction({ onCodeRef }: Props) {
  return (
    <section id="block-construction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 조립</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('aggregate-attestations', codeRefs['aggregate-attestations'])} />
          <span className="text-[10px] text-muted-foreground self-center">어테스테이션 수집</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 임시 상태 전이</strong> — 조립된 블록으로 임시 상태 전이를 실행<br />
          결과 상태의 HashTreeRoot를 block.StateRoot에 설정<br />
          이 과정이 블록 조립에서 가장 비용이 큰 연산
        </p>
      </div>
    </section>
  );
}
