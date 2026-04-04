import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BranchViz from './viz/BranchViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function CommitteeBranch({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="committee-branch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          RPC가 가짜 committee를 보내면 서명 위조가 가능해진다.
          <br />
          <code>is_valid_merkle_branch</code>로 committee가 state_root에 포함됨을 증명한다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 블록 실행으로 상태를 직접 계산한다.
          <br />
          Helios는 Merkle 증명으로 "이 committee가 진짜"임을 검증한다.
        </p>
      </div>
      <div className="not-prose">
        <BranchViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-init', codeRefs['hl-init'])} />
          <span className="text-[10px] text-muted-foreground">bootstrap.rs</span>
        </div>
      </div>
    </section>
  );
}
