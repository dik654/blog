import AdbCurrentViz from './viz/AdbCurrentViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function AdbCurrent({ onCodeRef }: Props) {
  const open = (k: string) => onCodeRef?.(k, codeRefs[k]);
  return (
    <section id="adb-current" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">qmdb::current — 현재 값 증명 & Grafting</h2>
      <div className="not-prose mb-8">
        <AdbCurrentViz onOpenCode={onCodeRef ? open : undefined} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          qmdb::current — <strong>"키의 현재 값"</strong>을 증명하는 DB<br />
          Any DB의 Operations MMR에 Activity Bitmap을 접목(graft)<br />
          이력 증명 + 활성 상태를 단일 증명으로 결합
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => open('current-db')} />
            <span className="text-[10px] text-muted-foreground self-center">current/db.rs — Db 구조체</span>
            <CodeViewButton onClick={() => open('grafting')} />
            <span className="text-[10px] text-muted-foreground self-center">grafting.rs — 접목 로직</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-3">Grafting 구조</h3>
        <p>
          grafting height = log2(chunk_size_bits)<br />
          grafted leaf = hash(bitmap_chunk || ops_subtree_root)<br />
          증명 1개로 연산 포함 + 활성 상태 동시 검증<br />
          독립 구조 2개 대비 증명 크기 ~50% 절감
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">OperationProof 검증 흐름</h3>
        <p>
          1. get_bit_from_chunk(loc) → 활성 비트 = 1 확인<br />
          2. range_proof.verify() → grafted MMR 루트 재구성<br />
          3. canonical root = Hash(ops_root || grafted_root [|| partial_chunk])
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => open('current-proof')} />
            <span className="text-[10px] text-muted-foreground self-center">proof.rs — OperationProof</span>
          </div>
        )}

        <div className="rounded-lg border border-amber-300 bg-amber-50/30 dark:bg-amber-950/10 p-4 mt-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">💡 설계 인사이트</p>
          <p className="text-sm">Grafting이 두 인증 구조를 하나로 합침 — 별도 Merkle Tree 유지 비용 제거. partial_chunk 처리로 미완성 청크도 루트에 반영.</p>
        </div>
      </div>
    </section>
  );
}
