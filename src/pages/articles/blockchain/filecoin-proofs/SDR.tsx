import SDRLayerGenViz from "./viz/SDRLayerGenViz";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function SDR({
  title,
  onCodeRef,
}: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="sdr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        {title ?? "SDR & 봉인 파이프라인"}
      </h2>
      <div className="not-prose mb-8">
        <SDRLayerGenViz
          onOpenCode={
            onCodeRef ? (key) => onCodeRef(key, codeRefs[key]) : undefined
          }
        />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SDR</strong>(Stacked Depth-Robust Graph)은 Filecoin PoRep에서 replica를 만드는 핵심
          과정입니다. 각 노드는 같은 레이어의 DRG 부모 6개와 이전 레이어의 Expander 부모 8개를 참조하므로,
          필요한 label을 건너뛰고 마지막 결과만 빠르게 계산하기 어렵습니다.
        </p>
        <p>
          이 구조가 모든 병렬 계산을 금지하는 것은 아닙니다. 준비가 끝난 구간은 window 단위로 함께 처리할 수 있지만 레이어 사이의 핵심 의존성은 순서대로 따라가야 합니다. 공격자가
          저장 공간을 아끼려고 replica를 필요할 때마다 다시 만들면 정상적인 저장 제공자보다 큰 시간 비용을 치릅니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton
              onClick={() => onCodeRef("seal-pc1", codeRefs["seal-pc1"])}
            />
            <span className="text-xs text-muted-foreground self-center">
              PC1 구현
            </span>
            <CodeViewButton
              onClick={() =>
                onCodeRef("stacked-graph", codeRefs["stacked-graph"])
              }
            />
            <span className="text-xs text-muted-foreground self-center">
              graph.rs
            </span>
          </div>
        )}

        {/* ── SDR 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Stacked DRG (SDR) 구조
        </h3>

        {/* ── SDR 핵심 특성 ── */}
        <div className="not-prose rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 my-4">
          <p className="text-sm font-bold text-sky-400 mb-2">
            Depth-Robust Graph 핵심
          </p>
          <ul className="text-sm space-y-1 text-foreground/80">
            <li>순차 계산만 가능 — 무단 병렬화 불가 (cheating 방지)</li>
            <li>
              시간과 공간 <strong>모두</strong> 필요 — space-time trade-off
            </li>
            <li>Alwen-Serbinenko 증명: parallel computation hard</li>
          </ul>
        </div>

        {/* ── 11-Layer 구조 + 노드 연산 ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">
              11 Layers (32 GiB)
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>
                <code>layer 0</code> — original data encoding
              </li>
              <li>
                <code>layer i</code> depends on <code>layer i-1</code>
              </li>
              <li>
                <strong>6</strong> DRG parents (within layer)
              </li>
              <li>
                <strong>8</strong> Expander parents (from prev layer)
              </li>
              <li>
                <strong>14</strong> total parent dependencies per node
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">
              Node Computation
            </p>
            <div className="text-sm text-foreground/80 space-y-1">
              <p>
                <code>node[i,j]</code> ={" "}
                <code>
                  SHA256(replica_id || layer_i || node_id ||
                  parent_1..14_labels)
                </code>
              </p>
              <ul className="space-y-1 mt-2">
                <li>SHA256 hash, 32 bytes output per node</li>
                <li>sequential — all 14 parents needed first</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Scale ── */}
        <div className="not-prose rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 my-4">
          <p className="text-sm font-bold text-amber-400 mb-2">
            Scale 예시 (32 GiB proof parameter)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-foreground/80">
            <div className="space-y-1">
              <strong>
                ~10<sup>9</sup>
              </strong>
              <span className="block">nodes per layer</span>
            </div>
            <div className="space-y-1">
              <strong>
                10<sup>10</sup>
              </strong>
              <span className="block">nodes total (11 layers)</span>
            </div>
            <div className="space-y-1">
              <strong>
                10<sup>11</sup>
              </strong>
              <span className="block">hash operations 규모</span>
            </div>
            <div className="space-y-1">
              <strong>profile-dependent</strong>
              <span className="block">sector·hardware·implementation</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-foreground/60">
            위 값은 계산 규모를 보여주는 order-of-magnitude 예시입니다. Layer 수,
            node encoding과 hash 횟수는 사용 중인 proof parameter와
            implementation에서 다시 계산해야 합니다.
          </p>
        </div>

        {/* ── Parallelism + Expander + Why SDR ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">병렬화</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>within layer — parallel (windows)</li>
              <li>
                between layers — <strong>sequential</strong>
              </li>
              <li>multi-core CPU + SIMD (SHA-NI)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">
              Expander Graph
            </p>
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
              <li>
                "I <strong>stored</strong> the data physically"
              </li>
              <li>경제적 commitment 강제</li>
            </ul>
          </div>
        </div>

        {/* ── Alternatives + Performance ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">대안 비교</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>
                <strong>Simple hashing</strong> — parallelizable (attack 취약)
              </li>
              <li>
                <strong>Random walks</strong> — weak security
              </li>
              <li>
                <strong>DRG</strong> — strong time-space binding
              </li>
              <li>
                <strong>SDR</strong> — Filecoin 채택 (2019)
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">
              Performance 최적화
            </p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>SIMD SHA256 (AVX2 / AVX512)</li>
              <li>multi-layer caching + parallel windows</li>
              <li>NUMA·memory bandwidth와 cache profile 확인</li>
              <li>sector size·proof parameter별 end-to-end benchmark</li>
            </ul>
          </div>
        </div>

        <p className="leading-7">
          SDR의 보안 성질은 “해시를 많이 계산한다”는 한 문장보다 11개 레이어와 부모 의존성이 계산 순서를 강제한다는 데 있습니다. 이 시간·공간 trade-off 때문에
          replica를 계속 보관하는 편이 챌린지 때마다 다시 계산하는 것보다 경제적으로 유리해집니다.
        </p>
      </div>
    </section>
  );
}
