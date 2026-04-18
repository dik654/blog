import CodePanel from '@/components/ui/code-panel';
import TimeoutStrategyViz from './viz/TimeoutStrategyViz';
import { TIMEOUT_CODE, TIMEOUT_ANNOTATIONS, PERF_TABLE, PARALLEL_CODE, PARALLEL_ANNOTATIONS } from './ConsensusPerformanceData';
import type { CodeRef } from '@/components/code/types';

const CELL = 'border border-border px-4 py-2';

export default function ConsensusPerformance({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="consensus-performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 성능 최적화</h2>
      <div className="not-prose mb-8"><TimeoutStrategyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 합의 성능은 세 가지 요소에 크게 좌우됩니다.
          <br />
          <strong>타임아웃 설정</strong>, <strong>블록 크기</strong>, <strong>병렬 처리 전략</strong>입니다.
          <br />
          라운드 실패 시 타임아웃이 점진적으로 증가합니다.
          <br />
          네트워크 복구를 기다리면서도 불필요한 리소스 낭비를 방지합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">타임아웃 전략</h3>
        <CodePanel title="라운드별 타임아웃 동적 증가" code={TIMEOUT_CODE} annotations={TIMEOUT_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">성능 파라미터 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>파라미터</th>
                <th className={`${CELL} text-left`}>기본값</th>
                <th className={`${CELL} text-left`}>효과</th>
              </tr>
            </thead>
            <tbody>
              {PERF_TABLE.map(r => (
                <tr key={r.param}>
                  <td className={`${CELL} font-mono text-xs`}>{r.param}</td>
                  <td className={CELL}>{r.default_val}</td>
                  <td className={CELL}>{r.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">병렬 처리 최적화</h3>
        <CodePanel title="PartSet 분할 + ABCI 동시 연결" code={PARALLEL_CODE} annotations={PARALLEL_ANNOTATIONS} />

        {/* ── 메인넷 성능 수치 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">메인넷 성능 수치 — 실전 벤치마크</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Cosmos Hub (ATOM)</p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="text-xs font-medium">Block time</span><span>6~7s</span>
                <span className="text-xs font-medium">TPS</span><span>~20</span>
                <span className="text-xs font-medium">Block size</span><span>~100KB</span>
                <span className="text-xs font-medium">Validators</span><span>175</span>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Osmosis</p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="text-xs font-medium">Block time</span><span>5s</span>
                <span className="text-xs font-medium">TPS</span><span>~150 (DEX TX 많음)</span>
                <span className="text-xs font-medium">Block size</span><span>평균 500KB</span>
                <span className="text-xs font-medium">Validators</span><span>150</span>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">dYdX v4</p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="text-xs font-medium">Block time</span><span>1.3s (매우 빠름)</span>
                <span className="text-xs font-medium">TPS</span><span>~2000 (orderbook)</span>
                <span className="text-xs font-medium">Validators</span><span>60</span>
                <span className="text-xs font-medium">특징</span><span>Vote Extensions 적극 활용</span>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Sei Network</p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="text-xs font-medium">Block time</span><span>500ms (가장 빠름)</span>
                <span className="text-xs font-medium">TPS</span><span>~12,000 (병렬 EVM)</span>
                <span className="text-xs font-medium">Validators</span><span>50</span>
                <span className="text-xs font-medium">특징</span><span>Optimistic block processing</span>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">성능 결정 요소</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">1. Validator 수</strong> — 적을수록 빠름 (60: ~1s, 175: ~5s)</p>
                <p><strong className="text-foreground">2. Timeout 설정</strong> — Cosmos Hub 1s/1s/1s (느림) / dYdX 250ms/150ms/150ms (빠름)</p>
                <p><strong className="text-foreground">3. Block size</strong> — <code>max_bytes</code> 기본 1MB, 크면 TPS 증가 but 전파 느려짐</p>
                <p><strong className="text-foreground">4. ABCI 앱</strong> — EVM ~100ms / Cosmos SDK ~50ms per block</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Scalability 한계</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Validator &gt; 200 → gossip 오버헤드 급증</p>
                <p>Block size &gt; 5MB → 전파 timeout 빈번</p>
                <p>Network latency &gt; 200ms → round 실패 증가</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          CometBFT 성능은 <strong>validator 수 + timeout + block size</strong>로 결정.<br />
          Cosmos Hub(느림) → dYdX(빠름) → Sei(최고속)로 trade-off.<br />
          validator 줄이고 timeout 줄이면 TPS 증가 (탈중앙성과 반비례).
        </p>
      </div>
    </section>
  );
}
