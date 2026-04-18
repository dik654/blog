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

        {/* ── SDR 핵심 특성 ── */}
        <div className="not-prose rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 my-4">
          <p className="text-sm font-bold text-sky-400 mb-2">Depth-Robust Graph 핵심</p>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>순차 계산만 가능 — 무단 병렬화 불가 (cheating 방지)</li>
            <li>시간과 공간 <strong>모두</strong> 필요 — space-time trade-off</li>
            <li>Alwen-Serbinenko 증명: parallel computation hard</li>
          </ul>
        </div>

        {/* ── 11-Layer 구조 + 노드 연산 ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">11 Layers (32 GiB)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code>layer 0</code> — original data encoding</li>
              <li><code>layer i</code> depends on <code>layer i-1</code></li>
              <li><strong>6</strong> DRG parents (within layer)</li>
              <li><strong>8</strong> Expander parents (from prev layer)</li>
              <li><strong>14</strong> total parent dependencies per node</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Node Computation</p>
            <div className="text-sm text-foreground/80 space-y-1">
              <p><code>node[i,j]</code> = <code>SHA256(replica_id || layer_i || node_id || parent_1..14_labels)</code></p>
              <ul className="space-y-1 mt-2">
                <li>SHA256 hash, 32 bytes output per node</li>
                <li>sequential — all 14 parents needed first</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Scale ── */}
        <div className="not-prose rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 my-4">
          <p className="text-sm font-bold text-amber-400 mb-2">Scale (32 GiB sector)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-foreground/80">
            <div><strong>~10<sup>9</sup></strong><br />nodes per layer</div>
            <div><strong>10<sup>10</sup></strong><br />nodes total (11 layers)</div>
            <div><strong>10<sup>11</sup></strong><br />SHA256 operations</div>
            <div><strong>3-5h</strong><br />on modern CPU</div>
          </div>
        </div>

        {/* ── Parallelism + Expander + Why SDR ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">병렬화</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>within layer — parallel (windows)</li>
              <li>between layers — <strong>sequential</strong></li>
              <li>multi-core CPU + SIMD (SHA-NI)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Expander Graph</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>추가 엔트로피 — shortcut attack 방지</li>
              <li>bipartite between layers</li>
              <li>random permutation</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Why SDR?</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>"I know the data" 아님</li>
              <li>"I <strong>stored</strong> the data physically"</li>
              <li>경제적 commitment 강제</li>
            </ul>
          </div>
        </div>

        {/* ── Alternatives + Performance ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">대안 비교</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><strong>Simple hashing</strong> — parallelizable (attack 취약)</li>
              <li><strong>Random walks</strong> — weak security</li>
              <li><strong>DRG</strong> — strong time-space binding</li>
              <li><strong>SDR</strong> — Filecoin 채택 (2019)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Performance 최적화</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>SIMD SHA256 (AVX2 / AVX512)</li>
              <li>multi-layer caching + parallel windows</li>
              <li>AMD EPYC 7003 series 권장</li>
              <li>~8-15 TFLOPS/sec effective</li>
            </ul>
          </div>
        </div>

        <p className="leading-7">
          SDR: <strong>11 layers x 14 parents x SHA256, sequential</strong>.<br />
          10<sup>11</sup> SHA256 operations per sector.<br />
          physical storage 경제적 commitment 강제.
        </p>
      </div>
    </section>
  );
}
