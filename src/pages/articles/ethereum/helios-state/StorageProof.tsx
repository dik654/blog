import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import StorageProofViz from './viz/StorageProofViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StorageProof({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="storage-proof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          스마트 컨트랙트의 저장 슬롯을 검증하려면 중첩 트라이가 필요하다.
          <br />
          어카운트의 <code>storageRoot</code>가 스토리지 트라이의 루트 역할.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 DB에서 storage를 직접 조회한다.
          <br />
          Helios는 2단계 증명(account + storage)으로 중첩 검증한다.
        </p>
      </div>
      <div className="not-prose">
        <StorageProofViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-storage-proof', codeRefs['hl-storage-proof'])} />
          <span className="text-[10px] text-muted-foreground">proof.rs</span>
        </div>
      </div>
    </section>
  );
}
