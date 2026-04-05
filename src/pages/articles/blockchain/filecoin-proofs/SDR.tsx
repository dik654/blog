import SDRLayerGenViz from './viz/SDRLayerGenViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function SDR({ title, onCodeRef }: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="sdr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'SDR & 봉인 파이프라인'}</h2>
      <div className="not-prose mb-8">
        <SDRLayerGenViz onOpenCode={onCodeRef
          ? (key) => onCodeRef(key, codeRefs[key]) : undefined} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SDR(Stacked DRG)</strong> — 11층 방향성 랜덤 그래프
          <br />
          노드당 14개 부모(DRG 6 + Expander 8)의 순차 SHA256 해싱
          <br />
          병렬화 불가 → 물리적 저장 공간 사용을 강제
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('seal-pc1', codeRefs['seal-pc1'])} />
            <span className="text-[10px] text-muted-foreground self-center">PC1 구현</span>
            <CodeViewButton onClick={() => onCodeRef('stacked-graph', codeRefs['stacked-graph'])} />
            <span className="text-[10px] text-muted-foreground self-center">graph.rs</span>
          </div>
        )}

        {/* ── SDR 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Stacked DRG (SDR) 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Stacked DRG (Depth Robust Graph):

// 개념:
// - Depth-robust graph
// - 순차 계산만 가능 (무단병렬 불가)
// - 시간과 공간 모두 필요
// - cheating 방지

// 11 layers (Filecoin 32GiB):
// - layer 0 = original data encoding
// - layer i depends on layer i-1
// - each node has parents:
//   - 6 DRG parents (within layer)
//   - 8 Expander parents (from prev layer)
//   - 14 total parent dependencies

// Node computation:
// node_i,j = SHA256(
//     replica_id ||
//     layer_i ||
//     node_id ||
//     parent_1_label ||
//     ...
//     parent_14_label
// )
// - SHA256 hash
// - sequential (all parents needed)
// - 32 bytes output per node

// Scale (32 GiB sector):
// - ~10^9 nodes per layer
// - 11 layers × 10^9 = 10^10 nodes total
// - 10^10 × 14 parents = 10^11 SHA256 operations
// - sequential execution
// - ~3-5 hours on modern CPU

// Parallelism:
// - within layer: parallel (windows)
// - between layers: sequential
// - multi-core CPU usage
// - SIMD instructions (SHA-NI)

// DRG Properties:
// - depth robust (Alwen-Serbinenko)
// - parallel computation hard
// - must store intermediate states
// - space-time trade-off

// Expander Graph:
// - additional entropy
// - prevents short-cut attacks
// - bipartite between layers
// - random permutation

// Why SDR?
// - physical storage verification
// - not just "I know the data"
// - "I stored the data physically"
// - economic commitment

// Alternatives considered:
// - simple hashing: parallelizable (attack)
// - random walks: weak security
// - DRG: strong time-space binding
// - SDR: Filecoin's choice (2019)

// Performance optimization:
// - SIMD SHA256 (AVX2/AVX512)
// - multi-layer caching
// - parallel windows
// - modern CPU: AMD EPYC 7003 series
// - ~8-15 TFLOPS/sec effective`}
        </pre>
        <p className="leading-7">
          SDR: <strong>11 layers × 14 parents × SHA256, sequential</strong>.<br />
          10^11 SHA256 operations per sector.<br />
          physical storage 경제적 commitment 강제.
        </p>
      </div>
    </section>
  );
}
