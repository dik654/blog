import MMRViz from './viz/MMRViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function MMR({ onCodeRef }: Props) {
  const open = (k: string) => onCodeRef?.(k, codeRefs[k]);
  return (
    <section id="mmr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle Mountain Range 구조 & 증명</h2>
      <div className="not-prose mb-8">
        <MMRViz onOpenCode={onCodeRef ? open : undefined} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MMR — <strong>append-only Merkle 구조</strong><br />
          높이가 줄어드는 완전 이진 트리(peak)의 연속<br />
          리밸런싱 없이 O(1) 순차 쓰기, SSD 최적화
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => open('mmr-family')} />
            <span className="text-[10px] text-muted-foreground self-center">mmr/mod.rs — Family</span>
            <CodeViewButton onClick={() => open('mmr-batch')} />
            <span className="text-[10px] text-muted-foreground self-center">batch.rs — Batch API</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-3">좌표 변환: Location ↔ Position</h3>
        <p>
          <strong>Location</strong> = 리프 삽입 순서 인덱스 (0, 1, 2, ...)<br />
          <strong>Position</strong> = post-order 순회 노드 인덱스<br />
          변환: Position = 2*N - popcount(N) where N = Location
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">증명 구조</h3>
        <p>
          <strong>Blueprint</strong>: fold_prefix + fetch_nodes<br />
          fold_prefix — 범위 이전 peak들을 하나의 accumulator로 접기<br />
          fetch_nodes — 리프→peak 경로의 형제 노드<br />
          검증: 재구성한 루트 = Hash(leaves || fold(peaks))
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => open('mmr-proof')} />
            <span className="text-[10px] text-muted-foreground self-center">proof.rs — range_proof()</span>
          </div>
        )}

        <div className="rounded-lg border border-amber-300 bg-amber-50/30 dark:bg-amber-950/10 p-4 mt-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">💡 설계 인사이트</p>
          <p className="text-sm">Position이 변하지 않는 안정 식별자 — 노드 추가 시 기존 Position 불변. 이 성질이 pruning과 historical proof를 가능하게 함.</p>
        </div>
      </div>
    </section>
  );
}
