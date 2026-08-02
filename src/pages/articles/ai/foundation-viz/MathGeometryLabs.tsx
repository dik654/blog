import { useState } from 'react';
import { ArrowDown, ArrowRight, CircleCheck, Equal, MoveRight } from 'lucide-react';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function LinearMapGeometryLab() {
  const [signal, setSignal] = useState(1.2);
  const [nullShift, setNullShift] = useState(0.9);
  const output = 1.5 * signal;
  const inputX = 116 + signal * 54;
  const inputY = 116 - nullShift * 54;
  const mirrorY = 116 + nullShift * 54;
  const outputX = 72 + output * 48;

  return (
    <figure
      data-linear-map-geometry-lab
      className="article-viz-surface not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-300">LINEAR MAP LAB</p>
        <h3 className="mt-1 max-w-3xl text-base font-bold leading-snug sm:text-lg">
          입력이 달라도 null space 방향의 차이는 출력에서 사라진다
        </h3>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          보존되는 row-space 성분 · {signal.toFixed(1)}
          <input
            aria-label="보존되는 성분"
            className="mt-3 block w-full accent-teal-700"
            max="1.6"
            min="-1.6"
            onChange={(event) => setSignal(Number(event.target.value))}
            step="0.1"
            type="range"
            value={signal}
          />
        </label>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          지워지는 null-space 차이 · ±{nullShift.toFixed(1)}
          <input
            aria-label="null space 성분"
            className="mt-3 block w-full accent-rose-700"
            max="1.5"
            min="0"
            onChange={(event) => setNullShift(Number(event.target.value))}
            step="0.1"
            type="range"
            value={nullShift}
          />
        </label>
      </div>

      <div data-viz-canvas className="grid min-w-0 gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,0.86fr)] lg:items-center">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold text-muted-foreground">입력 공간 · row space ⊕ null space</p>
          <svg viewBox="0 0 300 232" className="block aspect-[300/232] w-full" role="img" aria-label="같은 row space 성분과 서로 반대인 null space 성분을 가진 두 입력 vector">
            <defs>
              <marker id="linear-map-arrow-teal" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#0f766e" />
              </marker>
              <marker id="linear-map-arrow-rose" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#be123c" />
              </marker>
            </defs>
            <line x1="28" y1="116" x2="276" y2="116" stroke="currentColor" strokeWidth="1.5" opacity="0.22" />
            <line x1="116" y1="20" x2="116" y2="212" stroke="currentColor" strokeWidth="1.5" opacity="0.22" />
            <text x="272" y="106" fill="currentColor" fontSize="13" textAnchor="end">보존 방향</text>
            <text x="126" y="32" fill="currentColor" fontSize="13">null 방향</text>
            <line x1="116" y1="116" x2={inputX} y2={inputY} stroke="#0f766e" strokeWidth="3" markerEnd="url(#linear-map-arrow-teal)" />
            <line x1="116" y1="116" x2={inputX} y2={mirrorY} stroke="#be123c" strokeWidth="3" markerEnd="url(#linear-map-arrow-rose)" />
            <line x1={inputX} y1={inputY} x2={inputX} y2="116" stroke="#be123c" strokeDasharray="5 4" opacity="0.65" />
            <line x1={inputX} y1={mirrorY} x2={inputX} y2="116" stroke="#be123c" strokeDasharray="5 4" opacity="0.65" />
            <circle cx={inputX} cy={inputY} fill="#0f766e" r="5" />
            <circle cx={inputX} cy={mirrorY} fill="#be123c" r="5" />
            <text x={clamp(inputX + 10, 20, 252)} y={clamp(inputY - 8, 20, 215)} fill="#0f766e" fontSize="13" fontWeight="700">x₁</text>
            <text x={clamp(inputX + 10, 20, 252)} y={clamp(mirrorY + 17, 20, 220)} fill="#be123c" fontSize="13" fontWeight="700">x₂</text>
          </svg>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-muted/20 font-mono text-sm font-bold">
            A
          </div>
          <ArrowRight className="ml-2 hidden h-5 w-5 text-muted-foreground lg:block" aria-hidden="true" />
          <ArrowDown className="ml-2 h-5 w-5 text-muted-foreground lg:hidden" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold text-muted-foreground">출력 공간 · column space</p>
          <svg viewBox="0 50 270 132" className="block aspect-[270/132] w-full" role="img" aria-label="두 입력이 같은 출력 점으로 겹치는 column space">
            <line x1="30" y1="116" x2="244" y2="116" stroke="currentColor" strokeWidth="1.5" opacity="0.22" />
            <text x="240" y="105" fill="currentColor" fontSize="13" textAnchor="end">column space</text>
            <line x1="72" y1="116" x2={outputX} y2="116" stroke="#2563eb" strokeWidth="4" />
            <circle cx={outputX} cy="116" fill="#2563eb" r="8" />
            <circle cx={outputX} cy="116" fill="none" r="14" stroke="#2563eb" strokeWidth="2" opacity="0.35" />
            <text x={clamp(outputX, 44, 220)} y="88" fill="#2563eb" fontSize="13" fontWeight="700" textAnchor="middle">Ax₁ = Ax₂</text>
            <text x="135" y="177" fill="currentColor" fontSize="13" textAnchor="middle" opacity="0.72">
              null 성분 ±{nullShift.toFixed(1)}은 관측되지 않음
            </text>
          </svg>
        </div>
      </div>

      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
        <div className="bg-background p-4">
          <span className="text-[11px] font-semibold text-muted-foreground">두 입력의 차이</span>
          <strong className="mt-1 block font-mono text-base">x₁ - x₂ ∈ Null(A)</strong>
        </div>
        <div className="bg-background p-4">
          <span className="text-[11px] font-semibold text-muted-foreground">관측 가능한 출력</span>
          <strong className="mt-1 block font-mono text-base">y = {output.toFixed(2)}</strong>
        </div>
        <div className="bg-background p-4">
          <span className="text-[11px] font-semibold text-muted-foreground">역문제의 선택</span>
          <strong className="mt-1 block text-sm">A⁺y는 null 성분이 0인 최소 norm 해</strong>
        </div>
      </div>
    </figure>
  );
}

export function ConstrainedOptimumLab() {
  const [budget, setBudget] = useState(1.5);
  const target = { x: 1.55, y: 1.25 };
  const excess = Math.max(0, target.x + target.y - budget);
  const optimum = {
    x: target.x - excess / 2,
    y: target.y - excess / 2,
  };
  const lambda = excess / 2;
  const width = 360;
  const height = 260;
  const origin = { x: 42, y: 222 };
  const scale = 78;
  const toX = (value: number) => origin.x + value * scale;
  const toY = (value: number) => origin.y - value * scale;
  const boundaryStart = { x: 0, y: budget };
  const boundaryEnd = { x: budget, y: 0 };
  const feasiblePoints = [
    `${toX(0)},${toY(0)}`,
    `${toX(0)},${toY(boundaryStart.y)}`,
    `${toX(boundaryEnd.x)},${toY(0)}`,
  ].join(' ');

  return (
    <figure
      data-constrained-optimum-lab
      className="article-viz-surface not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="font-mono text-[11px] font-bold text-orange-700 dark:text-orange-300">KKT FORCE BALANCE</p>
        <h3 className="mt-1 max-w-3xl text-base font-bold leading-snug sm:text-lg">
          제약 경계에서는 더 내려가려는 gradient와 경계의 법선이 균형을 이룬다
        </h3>
      </figcaption>

      <div className="border-b border-border bg-muted/15 p-4 sm:p-5">
        <label className="block min-w-0 text-xs font-semibold text-muted-foreground">
          사용할 수 있는 총 예산 · x + y ≤ {budget.toFixed(1)}
          <input
            aria-label="제약 예산"
            className="mt-3 block w-full accent-orange-700"
            max="2.7"
            min="1"
            onChange={(event) => setBudget(Number(event.target.value))}
            step="0.1"
            type="range"
            value={budget}
          />
        </label>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          목적함수는 목표점과의 제곱거리 <span className="font-mono text-foreground">f = 1/2[(x - 1.55)² + (y - 1.25)²]</span>다. 이 <span className="font-mono">1/2</span> 정의에 맞춰 아래 λ도 계산한다.
        </p>
      </div>

      <div data-viz-canvas className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
        <div className="min-w-0">
          <svg viewBox={`0 0 ${width} ${height}`} className="block aspect-[360/260] w-full" role="img" aria-label="목표점과 선형 예산 제약 아래의 최적점 및 KKT 방향">
            <defs>
              <marker id="kkt-arrow-rose" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#be123c" />
              </marker>
              <marker id="kkt-arrow-blue" markerHeight="7" markerWidth="7" orient="auto" refX="6" refY="3.5">
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#2563eb" />
              </marker>
            </defs>
            <line x1={origin.x} y1={origin.y} x2="332" y2={origin.y} stroke="currentColor" opacity="0.2" />
            <line x1={origin.x} y1={origin.y} x2={origin.x} y2="20" stroke="currentColor" opacity="0.2" />
            <polygon points={feasiblePoints} fill="#059669" opacity="0.10" />
            <line
              x1={toX(boundaryStart.x)}
              x2={toX(boundaryEnd.x)}
              y1={toY(boundaryStart.y)}
              y2={toY(boundaryEnd.y)}
              stroke="#d97706"
              strokeDasharray="7 5"
              strokeWidth="3"
            />
            {[0.32, 0.62, 0.92].map((radius) => (
              <circle
                key={radius}
                cx={toX(target.x)}
                cy={toY(target.y)}
                fill="none"
                r={radius * scale}
                stroke="currentColor"
                strokeWidth="1.4"
                opacity="0.16"
              />
            ))}
            <circle cx={toX(target.x)} cy={toY(target.y)} fill="#64748b" r="5" />
            <circle cx={toX(optimum.x)} cy={toY(optimum.y)} fill="#0f766e" r="7" />
            <circle cx={toX(optimum.x)} cy={toY(optimum.y)} fill="none" r="13" stroke="#0f766e" opacity="0.35" strokeWidth="2" />
            <text x={toX(optimum.x) - 11} y={toY(optimum.y) + 5} fill="#0f766e" fontSize="13" fontWeight="700" textAnchor="end">x*</text>
            <line
              x1={toX(optimum.x)}
              x2={toX(optimum.x) + 43}
              y1={toY(optimum.y)}
              y2={toY(optimum.y) + 43}
              stroke="#be123c"
              strokeWidth="3"
              markerEnd="url(#kkt-arrow-rose)"
            />
            <line
              x1={toX(optimum.x)}
              x2={toX(optimum.x) - 43}
              y1={toY(optimum.y)}
              y2={toY(optimum.y) - 43}
              stroke="#2563eb"
              strokeWidth="3"
              markerEnd="url(#kkt-arrow-blue)"
            />
          </svg>
          <div className="grid gap-2 border-t border-border pt-3 text-[11px] font-semibold leading-relaxed text-muted-foreground sm:grid-cols-3">
            <span className="flex items-start gap-2"><i className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-500" aria-hidden="true" />회색 점 · 제약이 없을 때의 목표</span>
            <span className="flex items-start gap-2"><i className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-700" aria-hidden="true" />x* · 제약 안에서 가능한 최적점</span>
            <span className="flex items-start gap-2"><i className="mt-1 h-2 w-2 shrink-0 rotate-45 border-b-2 border-r-2 border-amber-600" aria-hidden="true" />점선 · 활성화된 예산 경계</span>
            <span className="flex items-start gap-2 text-rose-700 dark:text-rose-300"><i className="mt-1 h-0.5 w-3 shrink-0 bg-rose-700" aria-hidden="true" />∇f · 더 낮아지려는 방향</span>
            <span className="flex items-start gap-2 text-blue-700 dark:text-blue-300"><i className="mt-1 h-0.5 w-3 shrink-0 bg-blue-700" aria-hidden="true" />λ∇g · gradient에 맞서는 법선</span>
            <span className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300"><i className="mt-1 h-2 w-2 shrink-0 bg-emerald-600/30" aria-hidden="true" />채운 영역 · feasible set</span>
          </div>
        </div>

        <div className="min-w-0 divide-y divide-border border-y border-border">
          <div className="py-4">
            <span className="text-[11px] font-semibold text-muted-foreground">Primal feasibility</span>
            <strong className="mt-1 block font-mono text-sm">x* + y* = {budget.toFixed(1)}</strong>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">예산을 늘리면 objective가 더 낮아지므로 경계가 활성화된다.</p>
          </div>
          <div className="py-4">
            <span className="text-[11px] font-semibold text-muted-foreground">Dual variable</span>
            <strong className="mt-1 block font-mono text-sm">λ* = {lambda.toFixed(2)}</strong>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">예산을 아주 조금 늘렸을 때 얻는 objective 개선의 국소 가격이다.</p>
          </div>
          <div className="py-4">
            <span className="text-[11px] font-semibold text-muted-foreground">Stationarity</span>
            <span className="mt-2 flex items-center gap-2 text-sm font-bold">
              <MoveRight className="h-4 w-4 text-rose-700" aria-hidden="true" />
              ∇f
              <Equal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              -λ*∇g
            </span>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">경계를 따라 허용되는 방향에는 더 줄일 1차 변화가 남지 않는다.</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 border-t border-border bg-emerald-500/[0.045] p-4 sm:px-5">
        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          이 장면은 convex objective와 선형 제약이라 KKT 조건이 전역 optimum의 판정서가 된다. Non-convex 문제에서는 같은 조건이 local stationary point만 보장할 수 있다.
        </p>
      </div>
    </figure>
  );
}
