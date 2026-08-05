import type { ReactNode } from 'react';
import {
  Activity,
  Boxes,
  Clock3,
  Crosshair,
  FileCheck2,
  Gauge,
  Network,
  Radar,
  RefreshCw,
  Route,
  ScanSearch,
  ShieldAlert,
  SlidersHorizontal,
  Waypoints,
} from 'lucide-react';
import {
  PaperSceneViz,
  type PaperMechanismScene,
} from './ModelBasedRlPaperViz';

const raw = String.raw;
const palette = {
  cyan: '#31b7c6',
  gold: '#d5a139',
  green: '#3da977',
  violet: '#8b78e6',
  red: '#dc6670',
  muted: '#7b8794',
};

function Surface({
  label,
  children,
  footer,
}: {
  label: string;
  children: ReactNode;
  footer: string;
}) {
  return (
    <figure
      className="min-w-0 border-y border-border bg-muted/[0.12]"
      aria-label={label}
      data-domain-diagram
    >
      <div className="flex min-h-[18rem] min-w-0 flex-col justify-center p-3 sm:p-4">
        {children}
      </div>
      <figcaption className="border-t border-border px-3 py-3 text-xs font-semibold leading-5 text-muted-foreground sm:px-4">
        {footer}
      </figcaption>
    </figure>
  );
}

function FlowLedger({
  items,
}: {
  items: Array<{ label: string; value: string; detail: string; tone: keyof typeof palette }>;
}) {
  return (
    <div className="grid min-w-0 border-y border-border bg-background sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <div
          className="relative min-w-0 border-b border-border p-3 sm:border-r lg:border-b-0"
          key={item.label}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 border border-current"
              style={{ color: palette[item.tone] }}
              aria-hidden="true"
            />
            <p className="font-mono text-[11px] font-black uppercase leading-4 text-muted-foreground">
              {String(index + 1).padStart(2, '0')} · {item.label}
            </p>
          </div>
          <p className="mt-2 break-words text-sm font-black leading-5 [overflow-wrap:anywhere]">
            {item.value}
          </p>
          <p className="mt-1 break-words text-[11px] leading-5 text-muted-foreground [overflow-wrap:anywhere]">
            {item.detail}
          </p>
        </div>
      ))}
    </div>
  );
}

function KalmanStructureVisual() {
  return (
    <Surface
      label="Control directions propagated through system dynamics span or fail to span the state plane"
      footer="Gain을 계산하기 전에 input direction B, AB, …가 필요한 state directions를 실제로 덮는지 검사한다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)] lg:items-center">
        <svg viewBox="0 0 430 270" className="block h-auto w-full" role="img" aria-label="Controllable and uncontrollable state directions">
          <defs>
            <marker id="kalman-state-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill={palette.muted} />
            </marker>
          </defs>
          <line x1="70" y1="220" x2="377" y2="220" stroke={palette.muted} strokeWidth="2" markerEnd="url(#kalman-state-arrow)" />
          <line x1="70" y1="220" x2="70" y2="28" stroke={palette.muted} strokeWidth="2" markerEnd="url(#kalman-state-arrow)" />
          <line x1="70" y1="220" x2="206" y2="151" stroke={palette.cyan} strokeWidth="7" markerEnd="url(#kalman-state-arrow)" />
          <line x1="70" y1="220" x2="293" y2="70" stroke={palette.gold} strokeWidth="7" markerEnd="url(#kalman-state-arrow)" />
          <path d="M70 220 L206 151 L293 70 Z" fill={palette.green} fillOpacity="0.09" stroke={palette.green} strokeWidth="2" strokeDasharray="6 5" />
          <line x1="70" y1="220" x2="115" y2="54" stroke={palette.red} strokeWidth="4" strokeDasharray="8 6" />
          <text x="213" y="147" fontSize="16" fontWeight="900" fill={palette.cyan}>B</text>
          <text x="298" y="67" fontSize="16" fontWeight="900" fill={palette.gold}>AB</text>
          <text x="119" y="49" fontSize="14" fontWeight="900" fill={palette.red}>닿지 않는 mode</text>
          <text x="278" y="244" fontSize="14" fontWeight="900" fill="currentColor">state x₁</text>
          <text x="22" y="42" fontSize="14" fontWeight="900" fill="currentColor">state x₂</text>
        </svg>
        <div className="min-w-0 divide-y divide-border border-y border-border bg-background">
          {[
            ['B', 'input이 즉시 미는 방향', palette.cyan],
            ['AB', 'plant dynamics 뒤 드러나는 방향', palette.gold],
            ['rank n', '모든 state direction에 도달', palette.green],
            ['rank < n', 'cost를 바꿔도 actuator가 못 미는 mode', palette.red],
          ].map(([symbol, detail, color]) => (
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 px-3 py-3" key={symbol}>
              <span className="font-mono text-sm font-black" style={{ color }}>{symbol}</span>
              <span className="text-xs leading-5 text-muted-foreground">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

function KalmanCostVisual() {
  return (
    <Surface
      label="Quadratic state and input penalties define which deviations are expensive"
      footer="Q와 R은 성능을 자동으로 발견하는 숫자가 아니다. State deviation과 actuator effort 사이의 설계 선호를 단위와 함께 선언한다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:items-center">
        <svg viewBox="0 0 380 250" className="block h-auto w-full" role="img" aria-label="Quadratic state cost contours">
          <line x1="52" y1="210" x2="344" y2="210" stroke={palette.muted} strokeWidth="2" />
          <line x1="52" y1="210" x2="52" y2="27" stroke={palette.muted} strokeWidth="2" />
          <ellipse cx="196" cy="127" rx="121" ry="70" fill="none" stroke={palette.cyan} strokeWidth="3" />
          <ellipse cx="196" cy="127" rx="84" ry="48" fill="none" stroke={palette.gold} strokeWidth="4" />
          <ellipse cx="196" cy="127" rx="43" ry="24" fill={palette.green} fillOpacity="0.12" stroke={palette.green} strokeWidth="4" />
          <path d="M309 181 C285 151 261 142 236 136" fill="none" stroke={palette.red} strokeWidth="4" strokeDasharray="7 5" />
          <circle cx="309" cy="181" r="6" fill={palette.red} />
          <text x="277" y="199" fontSize="13" fontWeight="900" fill={palette.red}>현재 state</text>
          <text x="155" y="132" fontSize="14" fontWeight="900" fill={palette.green}>origin</text>
          <text x="275" y="49" fontSize="13" fontWeight="900" fill={palette.cyan}>같은 state cost</text>
        </svg>
        <FlowLedger
          items={[
            { label: 'state', value: 'xᵀQx', detail: '어떤 상태 오차를 더 비싸게 볼지', tone: 'cyan' },
            { label: 'effort', value: 'uᵀRu', detail: '큰 actuator input을 얼마나 억제할지', tone: 'gold' },
            { label: 'terminal', value: 'x(T)ᵀSx(T)', detail: 'horizon 끝의 남은 오차 가격', tone: 'violet' },
            { label: 'total', value: 'J', detail: '이 model·cost에서만 의미 있는 optimum', tone: 'green' },
          ]}
        />
      </div>
    </Surface>
  );
}

function KalmanRiccatiVisual() {
  return (
    <Surface
      label="The Riccati equation carries terminal future cost backward through time"
      footer="Backward integration은 미래 전체를 매 순간 다시 탐색하는 대신, 남은 비용을 P(t) 하나에 압축한다."
    >
      <div className="min-w-0">
        <div className="grid grid-cols-[3.75rem_minmax(0,1fr)_3.75rem] items-center gap-2 sm:grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] sm:gap-3">
          <div className="text-center">
            <p className="font-mono text-xs font-black text-muted-foreground">NOW</p>
            <p className="mt-1 text-sm font-black">P(t₀)</p>
          </div>
          <div className="min-w-0">
            <p className="min-h-8 text-center text-[11px] font-black leading-4 text-violet-700 dark:text-violet-300">
              terminal cost에서<br className="sm:hidden" /> 역방향으로 적분
            </p>
            <div className="relative mt-2 h-5">
              <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
              <div className="absolute inset-x-1 top-[calc(50%-0.25rem)] flex justify-between sm:inset-x-5">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <span className="h-2.5 w-2.5 border-2 border-violet-500 bg-background" key={index} />
              ))}
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="font-mono text-xs font-black text-muted-foreground">END</p>
            <p className="mt-1 text-sm font-black">P(T)=S</p>
          </div>
        </div>
        <p className="mx-auto mb-4 mt-2 max-w-[27rem] text-center font-mono text-[11px] leading-5 text-muted-foreground">
          -Ṗ = 현재 state cost + 전파된 future cost - control로 줄이는 cost
        </p>
        <FlowLedger
          items={[
            { label: 'terminal', value: 'P(T)=S', detail: '끝 state의 가격을 고정', tone: 'violet' },
            { label: 'propagate', value: 'FᵀP+PF', detail: 'plant가 future cost를 옮김', tone: 'cyan' },
            { label: 'reduce', value: 'PGR⁻¹GᵀP', detail: 'input으로 줄일 수 있는 부분', tone: 'green' },
            { label: 'gain', value: 'K(t)=R⁻¹GᵀP', detail: 'future cost를 현재 feedback으로 변환', tone: 'gold' },
          ]}
        />
      </div>
    </Surface>
  );
}

function KalmanFeedbackVisual() {
  return (
    <Surface
      label="The state feedback loop maps state through the Riccati gain into the plant"
      footer="Derived law의 owner는 unconstrained full-state LQ regulator다. Sensor estimator와 saturation은 같은 수식 안에 자동으로 포함되지 않는다."
    >
      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] sm:items-center">
        {[
          ['STATE', 'x(t)', '현재 full state', palette.cyan],
          ['RICCATI GAIN', 'u=-K(t)x', 'future cost를 input으로', palette.violet],
          ['PLANT', 'ẋ=Fx+Gu', '새 state를 생성', palette.green],
        ].map(([label, value, detail, color], index) => (
          <div className="contents" key={label}>
            <div className="min-w-0 border-y border-border bg-background px-3 py-4 text-center">
              <p className="font-mono text-[11px] font-black text-muted-foreground">{label}</p>
              <p className="mt-2 text-base font-black" style={{ color }}>{value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
            {index < 2 ? (
              <div className="flex h-7 items-center justify-center text-lg font-black text-muted-foreground sm:h-auto">
                →
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-px border-y border-border bg-border sm:grid-cols-3">
        <div className="bg-emerald-500/[0.04] p-3 text-xs leading-5"><strong>원식 소유</strong><br />full state · unconstrained input</div>
        <div className="bg-amber-500/[0.04] p-3 text-xs leading-5"><strong>추가 owner</strong><br />observer · estimator uncertainty</div>
        <div className="bg-red-500/[0.04] p-3 text-xs leading-5"><strong>실행 경계</strong><br />saturation · delay · unmodeled mode</div>
      </div>
    </Surface>
  );
}

function KalmanHistoryBoundaryVisual() {
  return (
    <Surface
      label="Kalman's 1960 optimal control paper is separated from his filtering paper and later LQG implementation"
      footer="같은 해의 두 논문을 합쳐 기억하더라도, control theorem과 noisy observation estimator의 evidence owner는 분리한다."
    >
      <div className="relative min-w-0 py-4">
        <div className="absolute bottom-8 left-5 top-8 w-px bg-border sm:left-1/2" />
        <div className="space-y-4">
          {[
            ['1960 · CONTROL', 'controllability · observability · Riccati regulator', '이 글의 primary evidence', palette.green],
            ['1960 · FILTERING', 'noisy measurement에서 prediction·update', '별도 논문의 estimator evidence', palette.cyan],
            ['LATER · LQG', 'state estimate + LQR feedback', 'separation 구조를 사용한 후대 결합', palette.violet],
            ['DEPLOYMENT', 'saturation · delay · robustness · deadline', '논문 밖 validation owner', palette.red],
          ].map(([year, value, detail, color], index) => (
            <div className={`relative grid min-w-0 gap-2 pl-12 sm:grid-cols-2 sm:pl-0 ${index % 2 ? 'sm:text-left' : 'sm:text-right'}`} key={year}>
              <span className="absolute left-[0.9rem] top-4 h-3 w-3 border-2 bg-background sm:left-[calc(50%-0.35rem)]" style={{ borderColor: color }} />
              <div className={index % 2 ? 'sm:col-start-2 sm:pl-8' : 'sm:pr-8'}>
                <p className="font-mono text-[11px] font-black" style={{ color }}>{year}</p>
                <p className="mt-1 text-sm font-black leading-5">{value}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

function MpcHorizonVisual() {
  return (
    <Surface
      label="MPC predicts a constrained horizon but applies only the first input"
      footer="Optimizer가 만든 N-step plan은 feedback law 전체가 아니다. Plant에는 첫 input만 적용되고 다음 sample에서 새 state로 다시 푼다."
    >
      <svg viewBox="0 0 620 270" className="block h-auto w-full" role="img" aria-label="Constrained MPC prediction horizon">
        <rect x="55" y="40" width="510" height="168" fill="none" stroke={palette.green} strokeWidth="3" strokeDasharray="8 6" />
        <rect x="250" y="40" width="80" height="168" fill={palette.red} fillOpacity="0.13" stroke={palette.red} strokeWidth="2" />
        <text x="278" y="65" fontSize="13" fontWeight="900" fill={palette.red}>금지 상태</text>
        <path d="M76 181 C136 158 173 132 224 118 C294 99 349 134 407 96 C459 62 500 75 548 58" fill="none" stroke={palette.cyan} strokeWidth="5" />
        {[76, 132, 187, 242, 297, 352, 407, 462, 517, 548].map((cx, index) => (
          <circle
            cx={cx}
            cy={[181, 160, 134, 115, 103, 124, 96, 75, 68, 58][index]}
            r={index === 0 ? 10 : 6}
            fill={index === 0 ? palette.gold : 'var(--background)'}
            stroke={index === 0 ? palette.gold : palette.cyan}
            strokeWidth="4"
            key={cx}
          />
        ))}
        <path d="M76 216 H132" stroke={palette.gold} strokeWidth="8" />
        <text x="72" y="245" fontSize="14" fontWeight="900" fill={palette.gold}>지금 적용: u₀*</text>
        <text x="364" y="245" fontSize="14" fontWeight="900" fill={palette.muted}>u₁* … uₙ₋₁*: 아직 예측</text>
        <text x="61" y="29" fontSize="13" fontWeight="900" fill={palette.green}>X · U 제약 안의 prediction</text>
      </svg>
    </Surface>
  );
}

function MpcShiftVisual() {
  return (
    <Surface
      label="A feasible MPC plan is shifted and extended by a terminal controller to construct the next feasible candidate"
      footer="Recursive feasibility proof의 핵심은 다음 optimizer가 알아서 성공한다는 믿음이 아니라, 이전 해를 shift해 만드는 명시적 feasible candidate다."
    >
      <div className="space-y-5">
        {[
          ['time t의 feasible plan', ['u₀*', 'u₁*', 'u₂*', '…', 'uₙ₋₁*'], palette.cyan],
          ['time t+1의 candidate', ['u₁*', 'u₂*', '…', 'uₙ₋₁*', 'k_f(xₙ*)'], palette.green],
        ].map(([label, cells, color]) => (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center" key={String(label)}>
            <p className="text-xs font-black leading-5" style={{ color: String(color) }}>{label}</p>
            <div className="grid min-w-0 grid-cols-5 border-y border-border bg-background">
              {(cells as string[]).map((cell, index) => (
                <div className="min-w-0 border-r border-border px-1 py-4 text-center font-mono text-xs font-black last:border-r-0" key={`${cell}-${index}`}>
                  {cell}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="grid gap-px border-y border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-3 text-xs leading-5"><strong>버림</strong><br />이미 실행한 u₀*</div>
          <div className="bg-background p-3 text-xs leading-5"><strong>이동</strong><br />남은 feasible tail</div>
          <div className="bg-background p-3 text-xs leading-5"><strong>붙임</strong><br />X_f 안의 k_f(x)</div>
        </div>
      </div>
    </Surface>
  );
}

function MpcTerminalVisual() {
  return (
    <Surface
      label="The terminal set, local controller and terminal value close the horizon beyond N"
      footer="Terminal set만 있거나 terminal cost만 있다고 theorem이 완성되지 않는다. Set invariance, local feasibility와 value decrease가 함께 닫혀야 한다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:items-center">
        <svg viewBox="0 0 380 265" className="block h-auto w-full" role="img" aria-label="Invariant terminal set and value decrease">
          <ellipse cx="190" cy="134" rx="139" ry="91" fill={palette.cyan} fillOpacity="0.05" stroke={palette.cyan} strokeWidth="3" />
          <ellipse cx="190" cy="134" rx="84" ry="53" fill={palette.green} fillOpacity="0.12" stroke={palette.green} strokeWidth="4" />
          <circle cx="190" cy="134" r="8" fill={palette.gold} />
          <path d="M293 92 C259 100 245 112 222 121" fill="none" stroke={palette.violet} strokeWidth="4" strokeDasharray="7 5" />
          <path d="M222 121 C207 126 199 130 190 134" fill="none" stroke={palette.green} strokeWidth="5" />
          <text x="57" y="47" fontSize="14" fontWeight="900" fill={palette.cyan}>허용 상태 X</text>
          <text x="129" y="76" fontSize="14" fontWeight="900" fill={palette.green}>terminal set X_f</text>
          <text x="240" y="80" fontSize="13" fontWeight="900" fill={palette.violet}>k_f(x)</text>
          <text x="153" y="158" fontSize="13" fontWeight="900" fill={palette.gold}>목표</text>
        </svg>
        <FlowLedger
          items={[
            { label: 'set', value: 'x_N ∈ X_f', detail: 'horizon 끝에서 continuation 가능', tone: 'cyan' },
            { label: 'control', value: 'u=k_f(x)', detail: 'X_f 안을 떠나지 않는 local law', tone: 'green' },
            { label: 'value', value: 'V_f', detail: 'horizon 밖 future cost 압축', tone: 'violet' },
            { label: 'decrease', value: 'ΔV_f ≤ -ℓ', detail: 'tail이 stage cost 이상 감소', tone: 'gold' },
          ]}
        />
      </div>
    </Surface>
  );
}

function MpcRuntimeVisual() {
  return (
    <Surface
      label="MPC runtime distinguishes an optimal solution, a feasible early solution, infeasibility and a missed deadline"
      footer="Mathematical optimum의 owner와 real-time actuator command의 owner가 다르다. Status·solve time·fallback source를 같은 receipt에 남긴다."
    >
      <div className="grid min-w-0 gap-px border-y border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['OPTIMAL', 'deadline 안 optimum', 'u₀* 적용', palette.green, '✓'],
          ['FEASIBLE', 'early stop·suboptimal', '검증된 첫 input', palette.cyan, '△'],
          ['INFEASIBLE', '현재 state에서 해 없음', 'backup policy', palette.red, '×'],
          ['TIMEOUT', '해가 늦게 도착', 'last feasible / safe stop', palette.gold, '!'],
        ].map(([label, detail, action, color, symbol]) => (
          <div className="min-w-0 bg-background p-4" key={label}>
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs font-black" style={{ color }}>{label}</p>
              <span className="flex h-7 w-7 items-center justify-center border text-sm font-black" style={{ borderColor: color, color }}>{symbol}</span>
            </div>
            <p className="mt-3 text-sm font-black leading-5">{detail}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">실행: {action}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-y border-border bg-background px-3 py-3">
        <span className="font-mono text-[11px] font-black text-muted-foreground">RECEIPT</span>
        <span className="break-words text-xs font-semibold leading-5">model version · state timestamp · solver status · solve time · constraint residual · fallback owner</span>
      </div>
    </Surface>
  );
}

function MpcScopeVisual() {
  return (
    <Surface
      label="MPC guarantees are layered from nominal theorem through robust extensions to deployment evidence"
      footer="2000 review의 state-feedback regulation result를 output feedback, learned model, stochastic disturbance와 hardware deadline까지 자동 확장하지 않는다."
    >
      <div className="space-y-2">
        {[
          ['NOMINAL THEOREM', 'exact state · exact model · terminal assumptions', 'recursive feasibility · asymptotic stability', palette.green, '100%'],
          ['ROBUST EXTENSION', 'bounded disturbance · tube/tightening contract', 'robust invariant feasibility', palette.cyan, '82%'],
          ['OUTPUT FEEDBACK', 'estimator state · uncertainty propagation', 'belief/observer owner 추가', palette.violet, '64%'],
          ['DEPLOYMENT', 'deadline · actuator · telemetry · fallback', 'physical release evidence', palette.red, '46%'],
        ].map(([label, premise, claim, color, width]) => (
          <div className="grid min-w-0 gap-2 border-y border-border bg-background px-3 py-3 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-center" key={label}>
            <p className="font-mono text-[11px] font-black" style={{ color }}>{label}</p>
            <p className="text-xs leading-5 text-muted-foreground">{premise}</p>
            <div className="min-w-0">
              <p className="text-xs font-black leading-5">{claim}</p>
              <div className="mt-2 h-1.5 bg-muted">
                <div className="h-full" style={{ width, backgroundColor: color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function CspaceLiftVisual() {
  return (
    <Surface
      label="An extended rigid body in workspace becomes one point in configuration space"
      footer="Configuration point는 robot의 일부 점이 아니다. 모든 자유도를 고정해 extended body 전체 pose를 결정하는 좌표 묶음이다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0">
          <p className="font-mono text-xs font-black text-muted-foreground">WORKSPACE · EXTENDED BODY</p>
          <svg viewBox="0 0 360 225" className="mt-3 block h-auto w-full" role="img" aria-label="A rigid polygon at a workspace pose">
            <rect x="27" y="23" width="306" height="177" fill="none" stroke={palette.muted} strokeWidth="3" />
            <rect x="235" y="62" width="62" height="93" fill={palette.red} fillOpacity="0.14" stroke={palette.red} strokeWidth="3" />
            <g transform="translate(134 118) rotate(-22)">
              <path d="M-55 -28 H39 L59 0 L38 31 H-55 Z" fill={palette.cyan} fillOpacity="0.16" stroke={palette.cyan} strokeWidth="4" />
              <circle cx="0" cy="0" r="6" fill={palette.gold} />
              <line x1="0" y1="0" x2="72" y2="0" stroke={palette.gold} strokeWidth="3" />
            </g>
            <text x="80" y="181" fontSize="14" fontWeight="900" fill={palette.cyan}>body A 전체 pose</text>
            <text x="240" y="51" fontSize="13" fontWeight="900" fill={palette.red}>obstacle B</text>
          </svg>
        </div>
        <div className="flex h-8 items-center justify-center text-xl font-black text-muted-foreground lg:h-auto">→</div>
        <div className="min-w-0">
          <p className="font-mono text-xs font-black text-muted-foreground">CONFIGURATION SPACE · ONE POINT</p>
          <svg viewBox="0 0 360 225" className="mt-3 block h-auto w-full" role="img" aria-label="One configuration point with translation and rotation coordinates">
            <line x1="55" y1="185" x2="315" y2="185" stroke={palette.muted} strokeWidth="2" />
            <line x1="55" y1="185" x2="55" y2="35" stroke={palette.muted} strokeWidth="2" />
            <circle cx="190" cy="104" r="12" fill={palette.gold} />
            <line x1="190" y1="104" x2="190" y2="185" stroke={palette.gold} strokeWidth="2" strokeDasharray="5 4" />
            <line x1="190" y1="104" x2="55" y2="104" stroke={palette.gold} strokeWidth="2" strokeDasharray="5 4" />
            <path d="M214 105 A25 25 0 0 1 199 128" fill="none" stroke={palette.violet} strokeWidth="4" />
            <text x="277" y="207" fontSize="14" fontWeight="900" fill="currentColor">x</text>
            <text x="30" y="44" fontSize="14" fontWeight="900" fill="currentColor">y</text>
            <text x="213" y="134" fontSize="14" fontWeight="900" fill={palette.violet}>θ</text>
            <text x="111" y="74" fontSize="15" fontWeight="900" fill={palette.gold}>q=(x,y,θ)</text>
          </svg>
        </div>
      </div>
    </Surface>
  );
}

function CObstacleVisual() {
  return (
    <Surface
      label="A workspace obstacle is expanded by the reflected robot shape to become a configuration obstacle"
      footer="Translation-only fixed-orientation case에서는 extended-body collision이 reference point의 forbidden-region membership으로 정확히 바뀐다."
    >
      <div className="grid min-w-0 gap-4 sm:grid-cols-3 sm:items-center">
        {[
          ['obstacle B', 'M45 45 H155 V135 H45 Z', palette.red, '고정 장애물'],
          ['reflected -A', 'M74 45 L145 75 L121 142 L51 112 Z', palette.cyan, '기준점 주위로 반사한 body'],
          ['B ⊕ (-A)', 'M22 35 H147 L174 63 V151 H49 L22 123 Z', palette.gold, 'reference point가 피할 영역'],
        ].map(([title, path, color, detail], index) => (
          <div className="contents" key={title}>
            <div className="min-w-0 border-y border-border bg-background p-3">
              <p className="font-mono text-xs font-black text-muted-foreground">{title}</p>
              <svg viewBox="0 0 190 180" className="mt-2 block h-auto w-full" role="img" aria-label={String(title)}>
                <path d={String(path)} fill={String(color)} fillOpacity="0.13" stroke={String(color)} strokeWidth="4" />
                <circle cx="95" cy="91" r="5" fill={palette.muted} />
              </svg>
              <p className="text-center text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
            {index < 2 ? <div className="flex h-7 items-center justify-center text-lg font-black text-muted-foreground sm:hidden">+</div> : null}
          </div>
        ))}
      </div>
    </Surface>
  );
}

function CspacePathVisual() {
  return (
    <Surface
      label="Safe start and goal points do not imply the straight segment between them is safe"
      footer="Findspace는 point validity를, Findpath는 curve 전체의 validity와 free-space connectivity를 묻는다. 두 계약을 같은 검사로 축약하지 않는다."
    >
      <svg viewBox="0 0 610 300" className="block h-auto w-full" role="img" aria-label="Configuration obstacle blocks the straight path while a curved free path goes around it">
        <rect x="38" y="30" width="534" height="225" fill="none" stroke={palette.muted} strokeWidth="2" />
        <path d="M245 58 C300 39 379 61 402 115 C426 169 385 225 315 229 C250 232 205 189 212 133 C216 98 224 79 245 58 Z" fill={palette.red} fillOpacity="0.14" stroke={palette.red} strokeWidth="4" />
        <circle cx="89" cy="208" r="10" fill={palette.green} />
        <circle cx="518" cy="75" r="10" fill={palette.violet} />
        <line x1="89" y1="208" x2="518" y2="75" stroke={palette.red} strokeWidth="4" strokeDasharray="8 6" />
        <path d="M89 208 C170 257 309 265 404 234 C472 212 504 152 518 75" fill="none" stroke={palette.green} strokeWidth="6" />
        <circle cx="317" cy="137" r="8" fill={palette.red} />
        <text x="71" y="235" fontSize="14" fontWeight="900" fill={palette.green}>start</text>
        <text x="510" y="54" fontSize="14" fontWeight="900" fill={palette.violet}>goal</text>
        <text x="278" y="121" fontSize="14" fontWeight="900" fill={palette.red}>C-obstacle</text>
        <text x="211" y="282" fontSize="14" fontWeight="900" fill={palette.green}>모든 q가 free인 연속 curve</text>
      </svg>
    </Surface>
  );
}

function CspaceDimensionVisual() {
  return (
    <Surface
      label="Adding orientation turns one planar obstacle into a stack of orientation-dependent slices"
      footer="Rotation·articulation이 늘면 C-obstacle을 한 polygon으로 직접 만드는 비용이 커진다. Dimension 증가는 좌표 개수뿐 아니라 topology와 geometry 복잡도를 바꾼다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)] lg:items-center">
        <svg viewBox="0 0 430 300" className="block h-auto w-full" role="img" aria-label="Orientation slices stacked along theta">
          {[
            [30, 178, palette.cyan, 'θ₀'],
            [63, 131, palette.gold, 'θ₁'],
            [96, 84, palette.violet, 'θ₂'],
          ].map(([dx, dy, color, label]) => (
            <g transform={`translate(${dx} ${dy})`} key={String(label)}>
              <path d="M50 64 C82 22 165 15 208 45 C250 74 242 124 195 143 C143 164 71 139 50 101 Z" fill={String(color)} fillOpacity="0.08" stroke={String(color)} strokeWidth="4" />
              <text x="221" y="78" fontSize="14" fontWeight="900" fill={String(color)}>{label}</text>
            </g>
          ))}
          <line x1="61" y1="256" x2="147" y2="38" stroke={palette.muted} strokeWidth="2" strokeDasharray="6 5" />
          <text x="22" y="280" fontSize="14" fontWeight="900" fill="currentColor">x,y</text>
          <text x="137" y="29" fontSize="14" fontWeight="900" fill="currentColor">θ</text>
        </svg>
        <FlowLedger
          items={[
            { label: '2D move', value: '(x,y)', detail: 'translation-only point', tone: 'cyan' },
            { label: '2D pose', value: '(x,y,θ)', detail: 'orientation circle 추가', tone: 'gold' },
            { label: '3D pose', value: '(x,y,z,R)', detail: 'rotation chart·topology 추가', tone: 'violet' },
            { label: 'arm', value: '(q₁,…,qₙ)', detail: 'joint마다 obstacle surface 변화', tone: 'red' },
          ]}
        />
      </div>
    </Surface>
  );
}

function CspaceLegacyVisual() {
  return (
    <Surface
      label="Explicit configuration obstacles and modern implicit validity queries preserve the same collision meaning"
      footer="표현이 polygon에서 callback으로 바뀌어도 StateValid와 MotionValid가 같은 robot geometry·scene version을 읽어야 한다는 invariant는 남는다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <div className="min-w-0 border-y border-border bg-background p-4">
          <p className="font-mono text-xs font-black text-cyan-700 dark:text-cyan-300">1983 · EXPLICIT GEOMETRY</p>
          <svg viewBox="0 0 340 180" className="mt-3 block h-auto w-full" role="img" aria-label="Explicit polygonal configuration obstacle">
            <path d="M40 134 L92 43 L164 72 L220 35 L292 110 L242 151 L151 135 L93 159 Z" fill={palette.red} fillOpacity="0.12" stroke={palette.red} strokeWidth="4" />
            <path d="M24 163 L100 171 L166 143 L234 161 L318 151" fill="none" stroke={palette.green} strokeWidth="5" />
          </svg>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">CO geometry를 만들어 point·curve membership을 계산</p>
        </div>
        <div className="min-w-0 border-y border-border bg-background p-4">
          <p className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">MODERN · IMPLICIT QUERY</p>
          <div className="mt-5 space-y-3">
            {[
              ['StateValid(q)', 'configuration 하나의 collision'],
              ['MotionValid(q_a,q_b)', 'local path 전체의 collision'],
              ['SceneVersion', 'geometry·attached body snapshot'],
              ['Receipt', 'resolution·margin·checker version'],
            ].map(([call, detail]) => (
              <div className="grid grid-cols-[minmax(7.5rem,0.45fr)_minmax(0,1fr)] gap-3 border-y border-border px-3 py-2" key={call}>
                <span className="font-mono text-[11px] font-black">{call}</span>
                <span className="text-xs leading-5 text-muted-foreground">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}

function PrmBuildVisual() {
  const nodes = [
    [54, 205], [91, 151], [131, 214], [160, 126], [208, 74],
    [255, 112], [309, 68], [337, 160], [395, 117], [447, 61], [494, 181], [548, 120],
  ];
  return (
    <Surface
      label="PRM accepts collision-free samples as milestones and validated local paths as graph edges"
      footer="Roadmap은 C_free의 그림이 아니라 sampling·metric·local planner가 관찰하고 검증한 connectivity의 일부다."
    >
      <svg viewBox="0 0 620 290" className="block h-auto w-full" role="img" aria-label="Probabilistic roadmap nodes and edges around configuration obstacles">
        <path d="M204 119 C232 77 276 72 295 111 C314 150 289 191 246 189 C203 187 179 156 204 119 Z" fill={palette.red} fillOpacity="0.13" stroke={palette.red} strokeWidth="3" />
        <path d="M404 153 C426 120 476 116 498 150 C521 184 499 224 456 227 C414 230 382 188 404 153 Z" fill={palette.red} fillOpacity="0.13" stroke={palette.red} strokeWidth="3" />
        {[
          [0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,5],[4,6],[5,7],[6,8],[7,8],[7,10],[8,9],[8,11],[9,11],[10,11],
        ].map(([a, b]) => (
          <line x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={palette.muted} strokeWidth="3" key={`${a}-${b}`} />
        ))}
        {nodes.map(([cx, cy], index) => (
          <circle cx={cx} cy={cy} r="8" fill="var(--background)" stroke={index < 4 ? palette.cyan : palette.violet} strokeWidth="4" key={`${cx}-${cy}`} />
        ))}
        <text x="194" y="214" fontSize="13" fontWeight="900" fill={palette.red}>C-obstacle</text>
        <text x="45" y="256" fontSize="13" fontWeight="900" fill={palette.cyan}>free sample → node</text>
        <text x="398" y="256" fontSize="13" fontWeight="900" fill={palette.violet}>validated local path → edge</text>
      </svg>
    </Surface>
  );
}

function PrmLocalPlannerVisual() {
  return (
    <Surface
      label="Two valid endpoint configurations still need the whole local path to be collision checked"
      footer="Neighbor distance는 edge 후보를 고를 뿐이다. 실제 edge owner는 local planner가 만든 curve와 그 curve 전체의 collision validation이다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        {[
          ['REJECT EDGE', true, palette.red],
          ['ACCEPT EDGE', false, palette.green],
        ].map(([title, blocked, color]) => (
          <div className="min-w-0 border-y border-border bg-background p-3" key={String(title)}>
            <p className="font-mono text-xs font-black" style={{ color: String(color) }}>{title}</p>
            <svg viewBox="0 0 340 210" className="mt-2 block h-auto w-full" role="img" aria-label={String(title)}>
              <path d="M133 56 C175 33 224 51 238 92 C250 128 229 162 187 169 C147 175 110 142 111 103 C112 81 119 66 133 56 Z" fill={palette.red} fillOpacity="0.13" stroke={palette.red} strokeWidth="3" />
              <circle cx="44" cy="170" r="10" fill={palette.cyan} />
              <circle cx="300" cy="43" r="10" fill={palette.violet} />
              <path
                d={blocked ? 'M44 170 L300 43' : 'M44 170 C87 190 126 194 177 188 C245 180 282 112 300 43'}
                fill="none"
                stroke={String(color)}
                strokeWidth="5"
                strokeDasharray={blocked ? '8 6' : undefined}
              />
              {blocked ? <circle cx="178" cy="103" r="8" fill={palette.red} /> : null}
            </svg>
            <p className="text-center text-xs font-semibold leading-5 text-muted-foreground">
              {blocked ? 'endpoints free · segment collision' : 'endpoints free · 모든 interpolation free'}
            </p>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function PrmExpansionVisual() {
  return (
    <Surface
      label="Uniform samples miss a narrow passage, so difficult-region expansion concentrates work near failed connections"
      footer="Expansion sampling은 narrow passage oracle가 아니다. Connection failure를 clue로 삼아 budget을 다시 배분하는 heuristic owner다."
    >
      <svg viewBox="0 0 620 300" className="block h-auto w-full" role="img" aria-label="Narrow passage with uniform and expansion samples">
        <path d="M0 0 H620 V109 H355 V191 H620 V300 H0 V191 H265 V109 H0 Z" fill={palette.red} fillOpacity="0.12" stroke={palette.red} strokeWidth="3" />
        {[
          [55,56],[114,239],[185,65],[214,251],[397,52],[459,239],[540,66],[570,233],
        ].map(([cx,cy]) => <circle cx={cx} cy={cy} r="7" fill={palette.cyan} key={`${cx}-${cy}`} />)}
        {[
          [276,139],[293,158],[312,145],[329,168],[347,134],
        ].map(([cx,cy]) => <circle cx={cx} cy={cy} r="8" fill={palette.gold} stroke="var(--background)" strokeWidth="3" key={`${cx}-${cy}`} />)}
        <path d="M214 151 C259 153 280 144 312 145 C343 146 369 151 405 151" fill="none" stroke={palette.green} strokeWidth="5" />
        <text x="42" y="91" fontSize="13" fontWeight="900" fill={palette.cyan}>uniform samples</text>
        <text x="246" y="214" fontSize="13" fontWeight="900" fill={palette.gold}>failed-connection 주변 확장</text>
        <text x="455" y="174" fontSize="13" fontWeight="900" fill={palette.green}>component bridge</text>
      </svg>
    </Surface>
  );
}

function PrmQueryVisual() {
  return (
    <Surface
      label="A PRM query needs start and goal connectors in addition to a roadmap graph path"
      footer="Roadmap 내부가 연결돼도 start connector나 goal connector가 없으면 query는 실패한다. Connector validity를 graph search와 따로 기록한다."
    >
      <svg viewBox="0 0 620 270" className="block h-auto w-full" role="img" aria-label="Start and goal connected to a roadmap path">
        {[
          [155,183],[221,112],[294,151],[366,82],[438,137],
        ].map(([cx,cy]) => (
          <circle cx={cx} cy={cy} r="9" fill="var(--background)" stroke={palette.violet} strokeWidth="4" key={`${cx}-${cy}`} />
        ))}
        <circle cx="57" cy="216" r="12" fill={palette.green} />
        <circle cx="552" cy="57" r="12" fill={palette.gold} />
        <path d="M57 216 L155 183 L221 112 L294 151 L366 82 L438 137 L552 57" fill="none" stroke={palette.green} strokeWidth="6" />
        <path d="M155 183 L294 151 M221 112 L366 82 M294 151 L438 137" fill="none" stroke={palette.muted} strokeWidth="3" />
        <text x="31" y="250" fontSize="14" fontWeight="900" fill={palette.green}>start s</text>
        <text x="522" y="34" fontSize="14" fontWeight="900" fill={palette.gold}>goal g</text>
        <text x="76" y="181" fontSize="13" fontWeight="900" fill={palette.green}>L(s,n_s)</text>
        <text x="440" y="83" fontSize="13" fontWeight="900" fill={palette.green}>L(n_g,g)</text>
        <text x="246" y="217" fontSize="13" fontWeight="900" fill={palette.violet}>Search_G(n_s,n_g)</text>
      </svg>
    </Surface>
  );
}

function PrmEvidenceVisual() {
  return (
    <Surface
      label="Probabilistic completeness is separated from finite-run success, path optimality and deployment validity"
      footer="Samples가 늘면 성공 확률이 1로 간다는 asymptotic statement를 이번 deadline 성공, shortest path, moving-scene validity로 바꾸지 않는다."
    >
      <div className="grid min-w-0 gap-px border-y border-border bg-border sm:grid-cols-2">
        {[
          ['원 논문이 지지', '정적 holonomic scene에서 reusable roadmap·빠른 repeated query', palette.green, true],
          ['확률적 완전성의 의미', '적절한 조건에서 sample budget 증가 시 연결 발견 확률 증가', palette.cyan, true],
          ['지지하지 않음', '정해진 2초 안 성공·최단 또는 최대 clearance path', palette.red, false],
          ['추가 검증', 'scene revision·edge resolution·metric·connector receipt', palette.gold, false],
        ].map(([label, value, color, supported]) => (
          <div className="min-w-0 bg-background p-4" key={String(label)}>
            <div className="flex items-center gap-2">
              {supported ? <FileCheck2 className="h-4 w-4" style={{ color: String(color) }} /> : <ShieldAlert className="h-4 w-4" style={{ color: String(color) }} />}
              <p className="font-mono text-[11px] font-black" style={{ color: String(color) }}>{label}</p>
            </div>
            <p className="mt-3 text-sm font-black leading-6">{value}</p>
          </div>
        ))}
      </div>
    </Surface>
  );
}

const kalmanScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Structural gate',
    title: 'Cost를 고르기 전에 actuator가 state direction에 실제로 닿는지 검사한다',
    body: 'Controllability는 gain의 품질이 아니라 plant와 input channel의 구조다. Input effect를 state transition과 함께 누적한 Gramian이 어떤 direction에도 0 energy를 주지 않아야 arbitrary state direction을 움직일 수 있다.',
    icon: Radar,
    layout: 'flow',
    items: [],
    visual: <KalmanStructureVisual />,
    formula: raw`\begin{gathered}
\underbrace{W_c(t_0,t_1)}_{\text{구간의 control 영향}}
=\displaystyle\int_{t_0}^{t_1}
\Phi(t_1,\tau)G(\tau)G(\tau)^\top\Phi(t_1,\tau)^\top d\tau\\[6pt]
\underbrace{z^\top W_c z>0\quad(\forall z\ne0)}_{\text{모든 state direction에 control authority}}
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{A_c(\tau)=\Phi(t_1,\tau)G(\tau)}_{\text{input 영향을 같은 final-state 좌표로 옮김}}\\[4pt]
\underbrace{W_c=\int A_c(\tau)A_c(\tau)^\top d\tau}_{\text{구간의 direction별 control 영향을 합산}}\\[4pt]
\underbrace{z^\top W_cz>0\quad(\forall z\ne0)}_{\text{모든 state direction에 control authority}}
\end{gathered}`,
    formulaNote: 'G만 보는 대신 state transition Φ를 양쪽에 곱해 각 시점의 input 효과를 같은 final-state 좌표로 옮긴 뒤 적분한다. Positive definiteness는 어떤 nonzero direction도 input 영향에서 빠지지 않았음을 검사한다.',
    formulaSymbols: [['W_c', '주어진 시간 구간의 controllability Gramian'], ['\\Phi(t_1,\\tau)', '시점 τ의 state 변화를 t₁ 좌표까지 운반하는 transition matrix'], ['G(\\tau)', 'Input이 state derivative에 들어가는 direction'], ['z^\\top W_cz', 'Direction z에 도달하기 위한 control authority의 quadratic test']],
    callout: 'Full rank는 practical authority가 충분하다는 뜻이 아니다. Gramian의 작은 eigenvalue, actuator bound와 model unit을 함께 확인한다.',
    owner: 'Plant structure audit',
    output: 'reachable directions · Gramian spectrum',
    invariant: 'gain tuning never creates a missing control direction',
  },
  {
    eyebrow: '02 · Declared objective',
    title: 'Quadratic cost는 state 오차와 actuator effort 사이의 선호를 명시한다',
    body: 'Q·R·S는 데이터에서 저절로 나온 보편적 성능 척도가 아니다. 어떤 state component를 빨리 줄이고 어떤 input peak를 아낄지, horizon 끝의 오차를 얼마나 비싸게 볼지 단위가 붙은 계약이다.',
    icon: SlidersHorizontal,
    layout: 'flow',
    items: [],
    visual: <KalmanCostVisual />,
    formula: raw`\begin{gathered}
\underbrace{J}_{\text{최소화할 총 비용}}
=\underbrace{x(T)^\top Sx(T)}_{\text{종점 오차}}\\[3pt]
\quad+\displaystyle\int_{t_0}^{T}
\left(
\underbrace{x^\top Qx}_{\text{진행 중 state 오차}}
+
\underbrace{u^\top Ru}_{\text{control effort}}
\right)dt
\end{gathered}`,
    formulaNote: '제곱형을 쓰면 방향별 오차를 항상 음이 아닌 가격으로 더하고, matrix의 off-diagonal로 state 간 결합 선호도 표현할 수 있다. 다만 서로 다른 단위를 normalization 없이 한 식에 넣으면 weight 숫자의 의미가 왜곡된다.',
    formulaSymbols: [['Q', '진행 중 state deviation의 방향별 가격'], ['R', 'Control input magnitude의 방향별 가격'], ['S', 'Terminal state deviation의 가격'], ['J', '선언한 model·horizon·weights에 상대적인 total cost']],
    callout: '“Optimal”은 이 cost와 unconstrained model 안에서만 성립한다. Q·R 숫자를 바꾸면 문제 자체가 바뀐다.',
    owner: 'Control objective designer',
    output: 'quadratic regulator criterion',
    invariant: 'weights carry units and design intent',
  },
  {
    eyebrow: '03 · Riccati compression',
    title: 'Terminal future cost를 Riccati 식으로 거꾸로 접어 현재 feedback gain을 만든다',
    body: 'Quadratic value function을 가정하면 future trajectory 전체의 consequence가 matrix P(t)에 압축된다. Terminal condition P(T)=S에서 backward integrate하고, current state를 P와 input price에 통과시켜 gain을 얻는다.',
    icon: RefreshCw,
    layout: 'flow',
    items: [],
    visual: <KalmanRiccatiVisual />,
    formula: raw`\begin{gathered}
\underbrace{-\dot P}_{\text{미래에서 현재로 비용 전파}}
=\underbrace{F^\top P+PF+Q}_{\text{plant·현재 state cost}}\\[3pt]
-\underbrace{PGR^{-1}G^\top P}_{\text{control로 줄일 수 있는 future cost}},
\qquad
\underbrace{P(T)=S}_{\text{terminal 조건}}
\end{gathered}`,
    formulaNote: 'Riccati 식의 음의 시간 미분은 terminal value에서 현재 쪽으로 적분한다는 뜻이다. R^{-1}은 값싼 input direction을 더 활용하고, PGR^{-1}GᵀP 항은 control이 future cost를 줄이는 만큼을 뺀다.',
    formulaSymbols: [['P(t)', 'Current state x의 future cost xᵀP(t)x를 담는 matrix'], ['F^\\top P+PF', 'Plant dynamics가 value curvature를 운반하는 항'], ['PGR^{-1}G^\\top P', 'Optimal input을 사용해 줄일 수 있는 future cost'], ['P(T)=S', 'Backward integration을 시작하는 terminal value']],
    callout: 'P 계산이 끝났다고 state estimation과 input constraint가 해결되는 것은 아니다. 이 장면은 full-state unconstrained regulator만 소유한다.',
    owner: 'Finite-horizon LQ dynamic program',
    output: 'time-indexed value matrix P(t)',
    invariant: 'terminal condition and integration direction stay explicit',
  },
  {
    eyebrow: '04 · Closed-loop law',
    title: 'P가 담은 future consequence를 current state에 곱해 linear feedback를 실행한다',
    body: 'Gain K(t)=R^{-1}GᵀP(t)는 state direction을 input sensitivity로 바꾼다. 실제 plant는 이 input으로 새 state를 만들고 feedback loop가 반복된다.',
    icon: Activity,
    layout: 'flow',
    items: [],
    visual: <KalmanFeedbackVisual />,
    formula: raw`\begin{gathered}
\underbrace{K(t)}_{\text{state를 input으로 바꾸는 gain}}
=\underbrace{R^{-1}G(t)^\top P(t)}_{\text{effort 가격·input 방향·future cost}}\\[5pt]
\underbrace{u^\star(t)}_{\text{선언한 LQ 문제의 최적 input}}
=-\underbrace{K(t)x(t)}_{\text{origin 쪽 state feedback}}
\end{gathered}`,
    formulaNote: 'GᵀP는 state의 future-cost gradient를 input coordinate로 투영하고 R^{-1}은 input price로 scale한다. Minus sign은 value가 증가하는 방향의 반대로 input을 선택한다.',
    formulaSymbols: [['K(t)', 'Time-varying LQ state-feedback gain'], ['G^\\top P', 'State future-cost sensitivity를 input direction으로 투영'], ['R^{-1}', 'Control effort 가격에 따른 gain scaling'], ['u^\\star', 'Hard input bound가 없는 full-state LQ 문제의 optimal input']],
    callout: 'Saturation이 생기면 actual law는 더 이상 u=-Kx가 아니다. Saturated closed-loop를 별도로 재검증한다.',
    owner: 'Full-state regulator',
    output: 'current actuator input u*(t)',
    invariant: 'optimality scope remains model·cost·information specific',
  },
  {
    eyebrow: '05 · Historical and evidence boundary',
    title: 'Optimal control 논문과 filtering 논문, 후대 LQG를 한 원문처럼 합치지 않는다',
    body: '1960 optimal-control paper는 controllability·observability를 활용해 Riccati regulator의 existence와 stability를 다룬다. Noisy measurement prediction/update는 같은 해의 별도 filtering paper이며 LQG는 후대 결합이다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [],
    visual: <KalmanHistoryBoundaryVisual />,
    formula: raw`\begin{gathered}
\underbrace{u_t=-K_t x_t}_{\text{1960 control paper: full state}}\\[4pt]
\ne
\underbrace{\widehat x_{t|t}
=\widehat x_{t|t-1}+L_t(y_t-H\widehat x_{t|t-1})}_{\text{별도 filtering paper: noisy observation 보정}}\\[5pt]
\underbrace{u_t=-K_t\widehat x_{t|t}}_{\text{후대 LQG 결합}}
\end{gathered}`,
    formulaNote: 'Control gain K와 estimator gain L은 서로 다른 error와 covariance를 줄인다. 식을 한 block diagram에서 결합할 수 있어도 theorem·noise assumption·evidence source는 분리해야 한다.',
    formulaSymbols: [['K_t', 'State deviation을 줄이는 control gain'], ['L_t', 'Measurement innovation으로 estimate를 보정하는 filter gain'], ['x_t', 'Control paper가 가정한 full state'], ['\\widehat x_{t|t}', 'Observation history를 반영한 estimated state']],
    callout: 'Original theorem은 saturation, sensor delay, flexible mode와 real-time computation을 hardware에서 검증하지 않았다.',
    owner: 'Historical source and evidence audit',
    output: 'control/filter/LQG provenance boundary',
    invariant: 'same-year papers never share evidence silently',
  },
];

const mpcScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Receding finite horizon',
    title: '현재 state에서 constrained future를 풀되 plant에는 첫 input만 적용한다',
    body: 'MPC는 current state를 prediction의 initial condition으로 고정하고 N-step state·input sequence를 최적화한다. 전체 plan은 예측이며 u₀*만 실행한 뒤 actual next state에서 horizon을 다시 연다.',
    icon: Clock3,
    layout: 'flow',
    items: [],
    visual: <MpcHorizonVisual />,
    formula: raw`\begin{gathered}
\underbrace{\min_{u_{0:N-1}}}_{\text{future input sequence 선택}}
\left[
\underbrace{V_f(x_N)}_{\text{terminal tail}}
+
\sum_{k=0}^{N-1}\underbrace{\ell(x_k,u_k)}_{\text{horizon 안 cost}}
\right]\\[5pt]
\text{s.t.}\quad
\underbrace{x_{k+1}=f(x_k,u_k)}_{\text{prediction dynamics}},
\quad
\underbrace{x_k\in\mathcal X,\ u_k\in\mathcal U}_{\text{hard constraints}}
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{J_N=V_f(x_N)+\sum_{k=0}^{N-1}\ell(x_k,u_k)}_{\text{horizon cost}}\\[4pt]
\underbrace{\min_{u_{0:N-1}}J_N}_{\text{input sequence 선택}}\\[4pt]
\underbrace{x_{k+1}=f(x_k,u_k)}_{\text{prediction dynamics}}\\[3pt]
\underbrace{x_k\in\mathcal X,\ u_k\in\mathcal U}_{\text{hard constraints}}
\end{gathered}`,
    formulaNote: 'Minimization은 scalar action 하나가 아니라 horizon 전체 sequence를 고른다. Dynamics equality는 sequence를 state trajectory로 묶고, set membership은 비용이 낮더라도 금지 상태·input을 후보에서 제거한다.',
    formulaSymbols: [['u_{0:N-1}', '한 solve에서 선택하는 future input sequence'], ['\\ell', '각 prediction step의 state·input cost'], ['V_f', 'Horizon 밖 tail consequence를 압축한 terminal value'], ['\\mathcal X,\\mathcal U', 'Predicted state와 input이 지켜야 할 admissible sets']],
    callout: 'Finite horizon을 반복한다는 사실만으로 recursive feasibility나 stability가 나오지 않는다. Tail construction을 별도로 확인한다.',
    owner: 'Online finite-horizon optimizer',
    output: 'feasible predicted state·input sequence',
    invariant: 'only the first input is a plant command',
  },
  {
    eyebrow: '02 · Recursive feasibility witness',
    title: '이전 feasible plan을 한 칸 옮기고 terminal control을 붙여 다음 candidate를 만든다',
    body: 'Time t의 optimal sequence에서 이미 실행한 첫 input을 버리고 나머지를 shift한다. Terminal state가 invariant set 안에 있으면 local controller k_f를 마지막에 붙여 time t+1의 feasible witness를 구성한다.',
    icon: RefreshCw,
    layout: 'flow',
    items: [],
    visual: <MpcShiftVisual />,
    formula: raw`\begin{gathered}
\underbrace{\mathbf u_t^\star}_{\text{time }t\text{의 feasible plan}}
=(u_{0|t}^\star,u_{1|t}^\star,\ldots,u_{N-1|t}^\star)\\[4pt]
\underbrace{\widetilde{\mathbf u}_{t+1}}_{\text{다음 solve의 feasible witness}}
=(u_{1|t}^\star,\ldots,u_{N-1|t}^\star,
\underbrace{k_f(x_{N|t}^\star)}_{\text{terminal tail}})
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\mathbf u_t^\star=(u_{0|t}^\star,\ldots,u_{N-1|t}^\star)}_{\text{현재 feasible plan}}\\[4pt]
\underbrace{\widetilde{\mathbf u}_{t+1}}_{\text{다음 feasible witness}}
=\bigl(
\underbrace{u_{1|t}^\star,\ldots,u_{N-1|t}^\star}_{\text{남은 tail}},
\underbrace{k_f(x_{N|t}^\star)}_{\text{terminal input}}
\bigr)
\end{gathered}`,
    formulaNote: 'Shift는 이미 실행한 첫 input을 제거해 remaining plan의 시간 index를 맞춘다. 마지막 빈 칸에는 terminal set 안에서 constraints를 지키는 local controller를 붙여 다음 feasible candidate의 존재를 보인다.',
    formulaSymbols: [['\\mathbf u_t^\\star', '현재 optimization이 찾은 optimal feasible sequence'], ['\\widetilde{\\mathbf u}_{t+1}', '다음 state에서 사용할 수 있음을 보이는 shifted candidate'], ['k_f', 'Terminal set 안에서 admissible continuation을 만드는 local controller'], ['x_{N|t}^\\star', 'Current solve가 예측한 terminal state']],
    callout: 'Disturbance로 actual x_{t+1}가 nominal prediction과 다르면 이 shift proof를 그대로 사용할 수 없다. Robust invariant/tightening contract가 추가된다.',
    owner: 'Recursive-feasibility proof',
    output: 'next-step feasible candidate',
    invariant: 'tail feasibility is constructed, not assumed',
  },
  {
    eyebrow: '03 · Terminal ingredients',
    title: 'Terminal set·local controller·terminal value가 horizon 뒤의 feasible decrease를 닫는다',
    body: 'X_f는 horizon 끝에서 local controller가 계속 constraints를 지킬 수 있는 region이다. k_f가 X_f를 invariant하게 유지하고 V_f가 stage cost 이상 감소하면 finite horizon 뒤의 infinite tail을 proof 안에 접을 수 있다.',
    icon: Crosshair,
    layout: 'flow',
    items: [],
    visual: <MpcTerminalVisual />,
    formula: raw`\begin{gathered}
\underbrace{x\in\mathcal X_f}_{\text{terminal region}}
\Longrightarrow
\underbrace{f(x,k_f(x))\in\mathcal X_f}_{\text{다음 state도 region 안}}\\[5pt]
\underbrace{V_f(f(x,k_f(x)))-V_f(x)}_{\text{terminal value 변화}}
\le
-\underbrace{\ell(x,k_f(x))}_{\text{local stage cost}}
\end{gathered}`,
    formulaNote: '첫 줄은 local controller가 terminal set 밖으로 state를 내보내지 않는 invariance다. 둘째 줄은 horizon 밖 tail에서 terminal value가 positive stage cost만큼 줄어드는 Lyapunov decrease다.',
    formulaSymbols: [['\\mathcal X_f', 'Feasible local continuation이 존재하는 terminal set'], ['k_f(x)', 'Terminal set 안에서 사용할 admissible local controller'], ['V_f', 'Horizon 밖 future cost를 담는 terminal value'], ['\\ell(x,k_f(x))', 'Local continuation 한 step의 positive stage cost']],
    callout: 'Terminal equality, terminal set+cost, infinite-horizon formulation은 서로 다른 sufficient construction이다. 이름만 terminal이라고 합치지 않는다.',
    owner: 'Terminal-tail designer',
    output: 'invariance · value-decrease certificate',
    invariant: 'set, controller and cost conditions are checked together',
  },
  {
    eyebrow: '04 · Runtime feedback contract',
    title: 'Optimal·feasible·infeasible·timeout을 구분해 sampling deadline 안의 action owner를 정한다',
    body: 'MPC의 수학적 solve와 control runtime은 같은 시계가 아니다. Deadline 전에 optimality를 증명하지 못해도 feasible iterate가 있을 수 있고, infeasible 또는 timeout이면 별도 backup action이 plant를 소유해야 한다.',
    icon: Gauge,
    layout: 'flow',
    items: [],
    visual: <MpcRuntimeVisual />,
    formula: raw`\begin{gathered}
\underbrace{u_t}_{\text{이번 sample의 plant command}}
=
\begin{cases}
\underbrace{u_{0|t}^{\star}}_{\text{deadline 안 검증된 첫 input}},&
\text{optimal/feasible}\\[4pt]
\underbrace{u_{\rm backup}(x_t)}_{\text{별도 safety owner}},&
\text{infeasible/timeout}
\end{cases}\\[6pt]
\underbrace{x_{t+1}^{\rm measured}}_{\text{actual next state}}
\longrightarrow
\underbrace{\text{solve again}}_{\text{feedback 재개}}
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\text{optimal/feasible}\Longrightarrow
\underbrace{u_t=u_{0|t}^{\star}}_{\text{deadline 안 검증된 첫 input}}\\[4pt]
\text{infeasible/timeout}\Longrightarrow
\underbrace{u_t=u_{\rm backup}(x_t)}_{\text{별도 safety owner}}\\[4pt]
\underbrace{x_{t+1}^{\rm measured}\longrightarrow\text{solve again}}_{\text{actual state에서 feedback 재개}}
\end{gathered}`,
    formulaNote: 'Branch는 solver status와 deadline을 action ownership으로 바꾼다. Optimal plan이 늦게 도착하면 그 sample의 valid command가 아니며, backup은 논문 optimizer가 아니라 별도 검증된 runtime policy다.',
    formulaSymbols: [['u_{0|t}^{\\star}', 'Current solve가 deadline 안 반환한 첫 feasible input'], ['u_{\\rm backup}', 'Infeasible·timeout branch를 소유하는 별도 fallback'], ['x_{t+1}^{\\rm measured}', 'Plant 실행 뒤 다시 관측·추정한 actual state'], ['\\text{solve again}', 'Actual state로 horizon을 이동시키는 feedback operation']],
    callout: 'Last feasible plan을 재사용할 때도 stale state, remaining horizon와 constraint validity를 다시 검사한다.',
    owner: 'Real-time control supervisor',
    output: 'deadline-valid command · solver receipt',
    invariant: 'late optimum never overrides a current safe command',
  },
  {
    eyebrow: '05 · Theorem and deployment boundary',
    title: 'Nominal state-feedback theorem을 robust·output-feedback·hardware release로 자동 확장하지 않는다',
    body: 'Review가 정리한 대표 stability result는 model, state information, terminal assumptions와 exact online feasibility에 기대고 있다. Disturbance, estimator error, learned dynamics와 solver deadline은 각각 새 proof·validation owner를 요구한다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [],
    visual: <MpcScopeVisual />,
    formula: raw`\begin{gathered}
\underbrace{\substack{\text{exact nominal model}\\
x_t\text{ known},\ \text{terminal conditions}\\
\text{feasible solve at each sample}}}_{\text{theorem premises}}
\Longrightarrow
\underbrace{\substack{\text{recursive feasibility}\\
\text{nominal closed-loop stability}}}_{\text{paper-level conclusion}}\\[7pt]
\not\Longrightarrow
\underbrace{\substack{\text{model mismatch·noise 아래 constraint safety}\\
\text{deadline·actuator 포함 physical release}}}_{\text{별도 evidence 필요}}
\end{gathered}`,
    formulaNote: 'Implication 왼쪽의 premise를 유지해야 오른쪽 theorem conclusion을 사용할 수 있다. Disturbance와 estimator error가 추가되면 actual state가 nominal shifted trajectory에 있지 않으므로 robust set과 uncertainty contract가 필요하다.',
    formulaSymbols: [['\\text{theorem premises}', 'Nominal MPC stability proof가 요구하는 model·information·terminal·feasibility 조건'], ['\\text{recursive feasibility}', '한 step feasible이면 다음 step에도 feasible candidate가 존재'], ['\\text{nominal stability}', 'Declared equilibrium으로 nominal closed loop가 수렴'], ['\\not\\Longrightarrow', 'Nominal conclusion이 physical deployment guarantee를 자동으로 주지 않음']],
    callout: 'Review paper는 modern differentiable MPC, learning MPC와 특정 embedded solver의 runtime benchmark를 입증하지 않는다.',
    owner: 'Theorem scope and release audit',
    output: 'premise·conclusion·missing-evidence ledger',
    invariant: 'guarantee scope never expands with the MPC label',
  },
];

const cspaceScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Extended body to one point',
    title: 'Robot 전체 pose를 결정하는 모든 자유도를 configuration 한 점으로 묶는다',
    body: 'Workspace에서는 polygon·polyhedron 전체가 움직이지만 configuration space에서는 독립 translation·rotation·joint coordinates 한 묶음 q가 그 pose를 정한다. Collision question의 object가 body pair에서 point와 forbidden set으로 바뀐다.',
    icon: Boxes,
    layout: 'flow',
    items: [],
    visual: <CspaceLiftVisual />,
    formula: raw`\begin{gathered}
\underbrace{q=(q_1,\ldots,q_d)}_{\text{모든 독립 자유도의 한 configuration}}
\longmapsto
\underbrace{(A)_q}_{\text{workspace에 배치된 body 전체}}\\[5pt]
\underbrace{\mathrm{CO}_A(B)}_{\text{충돌 configuration 집합}}
=\underbrace{\{q\in\mathcal C_A:(A)_q\cap B\ne\varnothing\}}_{\text{body A와 obstacle B가 겹침}}
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{q=(q_1,\ldots,q_d)}_{\text{robot 자세 한 점}}\\[3pt]
q\longmapsto\underbrace{(A)_q}_{\text{배치된 body}}\\[4pt]
\underbrace{\mathrm{CO}_A(B)}_{\text{충돌 자세 집합}}\\[-1pt]
=\{q\in\mathcal C_A:(A)_q\cap B\ne\varnothing\}
\end{gathered}`,
    formulaNote: 'Forward placement map은 q 한 점으로 body A의 모든 workspace point를 배치한다. 그 배치와 B의 교집합이 비어 있지 않은 q만 모아 C-obstacle을 만든다.',
    formulaSymbols: [['q', 'Moving body의 모든 relevant degrees of freedom'], ['(A)_q', 'Configuration q에서 workspace에 놓인 body point set'], ['\\mathcal C_A', 'Body A가 가질 수 있는 모든 configurations의 공간'], ['\\mathrm{CO}_A(B)', 'Obstacle B와 충돌을 만드는 forbidden configurations']],
    callout: 'Configuration coordinates는 physical topology를 보존해야 한다. Revolute angle의 0과 2π를 서로 먼 점으로 취급하면 search가 깨진다.',
    owner: 'Configuration parameterization',
    output: 'body pose map · C-space point',
    invariant: 'one configuration fixes the whole modeled body pose',
  },
  {
    eyebrow: '02 · Configuration obstacle construction',
    title: '고정 orientation의 translation 문제는 obstacle과 반사 body의 Minkowski sum으로 바꾼다',
    body: 'Moving body의 reference point가 B⊕(-A) 안에 들어가면 translated A가 B와 겹친다. Extended body를 point robot처럼 search할 수 있지만 point가 피할 obstacle은 그만큼 팽창한다.',
    icon: ScanSearch,
    layout: 'flow',
    items: [],
    visual: <CObstacleVisual />,
    formula: raw`\begin{gathered}
\underbrace{-A}_{\text{reference point 주위로 body 반사}}
=\{-a:a\in A\}\\[4pt]
\underbrace{\mathrm{CO}_A(B)}_{\text{reference point의 forbidden region}}
=\underbrace{B\oplus(-A)}_{\text{obstacle과 reflected body의 모든 vector sum}}\\[4pt]
\text{단, }\underbrace{\text{orientation 고정·translation만}}_{\text{이 단순 set-sum의 적용 범위}}
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{-A=\{-a:a\in A\}}_{\text{body를 기준점 주위로 반사}}\\[4pt]
\underbrace{\mathrm{CO}_A(B)}_{\text{reference point의 금지 영역}}
=\underbrace{B\oplus(-A)}_{\text{두 point set의 vector sums}}\\[4pt]
\underbrace{\text{orientation 고정·translation만}}_{\text{단순 set-sum의 적용 범위}}
\end{gathered}`,
    formulaNote: 'Body를 반사하는 이유는 translated A의 어떤 point가 B의 어떤 point와 같아지는 reference displacement를 모으기 위해서다. Minkowski sum은 가능한 두 point vector 합을 전부 모아 forbidden reference positions를 만든다.',
    formulaSymbols: [['-A', 'Reference point를 원점으로 두고 반사한 moving-body geometry'], ['\\oplus', '두 point set의 모든 vector sums를 모으는 Minkowski sum'], ['B\\oplus(-A)', 'Point reference가 피해야 할 expanded obstacle'], ['\\text{orientation 고정}', 'Rotation dimension을 따로 고려하지 않는 special case']],
    callout: 'Reference point를 바꾸면 C-obstacle의 좌표 위치는 바뀌지만 collision 의미는 바뀌지 않아야 한다.',
    owner: 'Exact translation-only geometry',
    output: 'polygonal C-obstacle',
    invariant: 'point membership equals extended-body collision',
  },
  {
    eyebrow: '03 · Findspace versus Findpath',
    title: 'Start와 goal이 각각 안전해도 그 사이 직선이 안전하다는 뜻은 아니다',
    body: 'Findspace는 configuration 한 점이 forbidden set 밖인지 묻는다. Findpath는 start에서 goal까지 이어지는 연속 curve의 모든 점이 free인지와 두 점이 같은 free-space component에 있는지를 묻는다.',
    icon: Route,
    layout: 'flow',
    items: [],
    visual: <CspacePathVisual />,
    formula: raw`\begin{gathered}
\underbrace{\gamma:[0,1]\to\mathcal C_A}_{\text{configuration curve}},
\qquad
\underbrace{\gamma(0)=s,\ \gamma(1)=g}_{\text{endpoint 조건}}\\[5pt]
\underbrace{\forall t\in[0,1],\quad
\gamma(t)\notin\bigcup_j\mathrm{CO}_A(B_j)}_{\text{curve 전체의 collision-free 조건}}
\end{gathered}`,
    formulaNote: 'Universal quantifier ∀t가 중요한 이유는 endpoint 두 개만 검사하지 않고 interpolation 전체를 검사하기 위해서다. Union은 obstacle 하나라도 충돌시키는 configuration을 모두 forbidden으로 합친다.',
    formulaSymbols: [['\\gamma', 'Start와 goal을 잇는 continuous configuration path'], ['t', '실행 시간이 아니라 curve 위 위치를 나타내는 path parameter'], ['\\bigcup_j\\mathrm{CO}_A(B_j)', '모든 workspace obstacles가 만드는 forbidden configurations'], ['\\forall t', 'Path 중간 한 점도 collision이면 안 된다는 전 구간 조건']],
    callout: 'Geometric path가 free여도 velocity·torque·nonholonomic dynamics를 만족하는 것은 아니다. Retiming과 control은 다음 owner다.',
    owner: 'Free-space connectivity planner',
    output: 'continuous collision-free configuration path',
    invariant: 'endpoint validity never substitutes for edge validity',
  },
  {
    eyebrow: '04 · Rotation and articulation',
    title: 'Orientation과 joint가 추가될수록 obstacle은 한 polygon이 아니라 고차원 surface가 된다',
    body: '2D translation은 두 좌표지만 rotation을 추가하면 θ에 따라 forbidden slice 모양이 변한다. Spatial rotation과 articulated joints까지 늘면 explicit exact C-obstacle construction 비용과 coordinate topology 문제가 함께 커진다.',
    icon: Boxes,
    layout: 'flow',
    items: [],
    visual: <CspaceDimensionVisual />,
    formula: raw`\begin{gathered}
\underbrace{\mathcal C_{\rm planar}}_{\text{평면 rigid pose}}
\simeq
\underbrace{\mathbb R^2}_{x,y}
\times
\underbrace{S^1}_{\theta\equiv\theta+2\pi}\\[5pt]
\underbrace{\mathcal C_{\rm arm}}_{\text{n-joint configuration}}
\simeq
\prod_{i=1}^{n}
\underbrace{\mathcal Q_i}_{\text{joint }i\text{의 bound·topology}}
\end{gathered}`,
    formulaNote: 'Cartesian product를 쓰는 이유는 독립 degrees of freedom을 한 configuration으로 결합하기 위해서다. Revolute joint는 line ℝ가 아니라 endpoints가 이어지는 circle S¹이므로 wrapped distance가 필요하다.',
    formulaSymbols: [['\\mathbb R^2', 'Planar translation coordinates x와 y'], ['S^1', '0과 2π가 같은 orientation circle'], ['\\prod_i\\mathcal Q_i', 'Joint별 coordinate domains의 Cartesian product'], ['\\mathcal Q_i', 'Prismatic interval 또는 revolute circle처럼 joint topology를 담은 domain']],
    callout: 'Dimension 숫자만 늘리는 것이 아니다. Coordinate chart cut, wrap과 obstacle surface connectivity가 planner metric을 바꾼다.',
    owner: 'Configuration-space topology',
    output: 'dimension·chart·wrap contract',
    invariant: 'coordinate distance respects physical topology',
  },
  {
    eyebrow: '05 · Representation and evidence boundary',
    title: 'Explicit C-obstacle은 implicit validity callback으로 바뀌어도 collision 의미는 유지된다',
    body: '1983 paper는 polygon·polyhedron constructions와 visibility paths로 C-space reduction이 계산 가능함을 보였다. Modern high-DOF planners는 C_free를 전부 만들기보다 q와 local path를 collision checker에 질의한다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [],
    visual: <CspaceLegacyVisual />,
    formula: raw`\begin{gathered}
\underbrace{\operatorname{StateValid}(q)}_{\text{modern point query}}
\Longleftrightarrow
\underbrace{q\notin\bigcup_j\mathrm{CO}_A(B_j)}_{\text{1983 forbidden-set 의미}}\\[5pt]
\underbrace{\operatorname{MotionValid}(q_a,q_b)}_{\text{modern edge query}}
\Longleftrightarrow
\underbrace{L(q_a,q_b)\subset\mathcal C_{\rm free}}_{\text{local curve 전체가 free}}
\end{gathered}`,
    formulaNote: 'Equivalence는 representation이 아니라 semantic contract다. Explicit polygon membership과 collision callback이 같은 geometry·frame·attached body·margin을 읽을 때만 같은 validity를 뜻한다.',
    formulaSymbols: [['\\operatorname{StateValid}', 'Configuration 한 점의 collision-free 여부를 반환하는 callback'], ['\\operatorname{MotionValid}', '두 states 사이 local path 전체의 validity callback'], ['L(q_a,q_b)', 'Planner가 검사하는 interpolation 또는 local path'], ['\\mathcal C_{\\rm free}', '모든 C-obstacles 밖의 free configuration region']],
    callout: 'Paper의 exact shortest 2D visibility path는 zero-clearance일 수 있고 modern dynamic-scene·uncertainty safety를 입증하지 않는다.',
    owner: 'Collision semantics and provenance',
    output: 'explicit-to-implicit validity contract',
    invariant: 'representation changes never relax collision meaning',
  },
];

const prmScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Learning phase',
    title: 'Collision-free samples를 milestone으로, 검증된 local paths를 edges로 저장한다',
    body: 'PRM은 high-dimensional C_free를 explicit geometry로 전부 만들지 않는다. Random candidate가 free이면 node로 받아들이고, 가까운 nodes 사이 local path가 모두 free일 때만 reusable edge를 넣는다.',
    icon: Network,
    layout: 'flow',
    items: [],
    visual: <PrmBuildVisual />,
    formula: raw`\begin{gathered}
\underbrace{G=(N,E)}_{\text{정적 scene의 reusable roadmap}},
\qquad
\underbrace{N\subset\mathcal C_{\rm free}}_{\text{collision-free milestones}}\\[5pt]
\underbrace{(q_i,q_j)\in E}_{\text{검증된 graph edge}}
\Longrightarrow
\underbrace{L(q_i,q_j)\subset\mathcal C_{\rm free}}_{\text{local path 전체가 free}}
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{G=(N,E)}_{\text{재사용 roadmap}}\\[3pt]
\underbrace{N\subset\mathcal C_{\rm free}}_{\text{free milestones}}\\[4pt]
\underbrace{(q_i,q_j)\in E}_{\text{저장한 edge}}\\[-1pt]
\Longrightarrow L(q_i,q_j)\subset\mathcal C_{\rm free}
\end{gathered}`,
    formulaNote: 'Node set은 accepted free samples만 담는다. 저장된 edge라면 local planner가 만든 연속 path 전체가 free여야 한다. 반대로 feasible한 모든 pair가 edge일 필요는 없다. Neighbor selection이 일부 pair만 connection 후보로 고르기 때문이다.',
    formulaSymbols: [['G', 'Learning phase가 만든 roadmap graph'], ['N', 'Collision-free sampled configurations'], ['E', 'Validated local paths에 대응하는 graph edges'], ['L(q_i,q_j)', 'Nearby nodes를 잇는 robot-specific local path']],
    callout: 'Roadmap은 static robot geometry와 scene version에 묶인다. Attached object나 obstacle이 바뀌면 stored edge의 evidence가 stale해진다.',
    owner: 'Offline roadmap builder',
    output: 'nodes · validated edges · components',
    invariant: 'every stored edge owns a continuous validity check',
  },
  {
    eyebrow: '02 · Local planner boundary',
    title: '가까운 두 free node도 그 사이 interpolation이 obstacle을 통과하면 연결하지 않는다',
    body: 'Metric은 cheap candidate selector이고 local planner는 feasible curve producer다. Edge collision checker의 resolution이 너무 거칠면 colliding segment가 graph에 들어가 false solution을 만든다.',
    icon: ScanSearch,
    layout: 'flow',
    items: [],
    visual: <PrmLocalPlannerVisual />,
    formula: raw`\begin{gathered}
\underbrace{d(q_i,q_j)\le r}_{\text{neighbor 후보}}
\not\Longrightarrow
\underbrace{(q_i,q_j)\in E}_{\text{roadmap edge}}\\[5pt]
(q_i,q_j)\in E
\Longrightarrow
\underbrace{\forall \alpha\in[0,1],\
\operatorname{StateValid}(L_\alpha(q_i,q_j))}_{\text{curve 전 구간 검사}}
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{d(q_i,q_j)\le r}_{\text{neighbor 후보}}
\not\Longrightarrow
\underbrace{(q_i,q_j)\in E}_{\text{roadmap edge}}\\[4pt]
\underbrace{(q_i,q_j)\in E}_{\text{저장된 edge}}
\Longrightarrow\\[-1pt]
\underbrace{\forall\alpha\in[0,1],\
\operatorname{StateValid}(L_\alpha(q_i,q_j))}_{\text{local curve 전 구간 검사}}
\end{gathered}`,
    formulaNote: 'Distance threshold는 expensive local checks 수를 줄이기 위해 후보를 고른다. Universal α check는 endpoints 사이 interpolation 중 하나라도 collision이면 edge를 거부하기 위해 필요하다.',
    formulaSymbols: [['d(q_i,q_j)', 'Configuration topology와 physical scale을 반영한 neighbor metric'], ['r', 'Local connection을 시도할 radius 또는 candidate threshold'], ['L_\\alpha', 'Local path에서 fraction α에 해당하는 configuration'], ['\\forall\\alpha', 'Endpoint뿐 아니라 edge 전체를 검사하는 조건']],
    callout: 'Continuous collision detection이 아니면 interpolation resolution과 maximum workspace motion per segment를 receipt에 남긴다.',
    owner: 'Metric candidate selector + local validator',
    output: 'accepted/rejected edge evidence',
    invariant: 'nearby never means collision-free',
  },
  {
    eyebrow: '03 · Difficult-region expansion',
    title: 'Uniform volume sampling이 놓친 좁은 연결에는 failed-connection clue로 budget을 다시 배분한다',
    body: 'Narrow passage는 free volume이 작아 uniform samples가 드물게 들어간다. Original construction/expansion split은 연결 실패가 잦은 milestones 주변에 추가 samples를 배분해 disconnected components를 잇으려 한다.',
    icon: Radar,
    layout: 'flow',
    items: [],
    visual: <PrmExpansionVisual />,
    formula: raw`\begin{gathered}
\underbrace{\Pr[N_A=0]}_{\text{region }A\text{를 한 번도 못 뽑을 확률}}
=\underbrace{(1-\mu(A))^N}_{\text{독립 uniform sampling 직관}}\\[5pt]
\underbrace{\mu(A)\ll1}_{\text{좁은 passage volume}}
\Longrightarrow
\underbrace{N\text{ 또는 targeted expansion 증가}}_{\text{연결 관찰 기회 확대}}
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\Pr[N_A=0]}_{\text{region }A\text{를 못 뽑을 확률}}
=\underbrace{(1-\mu(A))^N}_{\text{독립 uniform sampling 직관}}\\[4pt]
\underbrace{\mu(A)\ll1}_{\text{좁은 passage mass}}
\Longrightarrow\\[-1pt]
\underbrace{N\text{ 또는 targeted expansion 증가}}_{\text{연결 관찰 기회 확대}}
\end{gathered}`,
    formulaNote: '이 toy probability는 narrow-region volume이 작을수록 finite N에서 한 번도 sample하지 못할 가능성이 커짐을 보여 주는 현대 설명식이며, 1996 main paper의 theorem 식으로 귀속하지 않는다. Expansion은 failed connections를 clue로 sampling 분포를 바꾼다.',
    formulaSymbols: [['A', 'Connectivity에 중요한 narrow free-space region'], ['\\mu(A)', 'Uniform sampling distribution 아래 region A의 probability mass'], ['N_A', 'N samples 중 A에 들어간 sample count'], ['N', 'Construction에 사용한 independent sample budget']],
    callout: 'Connection failure가 narrow passage를 완벽히 알려 주는 것은 아니다. Bad metric·local planner도 같은 failure signal을 만든다.',
    owner: 'Roadmap expansion heuristic',
    output: 'targeted samples · component bridges',
    invariant: 'sampling heuristic is not a completeness certificate',
  },
  {
    eyebrow: '04 · Query phase',
    title: 'Start connector·roadmap path·goal connector 세 조각이 모두 있을 때 query path가 완성된다',
    body: 'Start와 goal을 각각 reachable roadmap milestone에 local path로 붙인다. 그 뒤 graph search로 milestone sequence를 찾고 validated local segments를 순서대로 이어 full collision-free path를 만든다.',
    icon: Waypoints,
    layout: 'flow',
    items: [],
    visual: <PrmQueryVisual />,
    formula: raw`\begin{gathered}
\underbrace{\gamma_{\rm query}}_{\text{이번 start-goal path}}
=\underbrace{L(s,n_s)}_{\text{start connector}}\\[-1pt]
\quad\oplus
\underbrace{\operatorname{Search}_G(n_s,n_g)}_{\text{roadmap graph path}}
\oplus
\underbrace{L(n_g,g)}_{\text{goal connector}}
\end{gathered}`,
    formulaNote: 'Ordered concatenation ⊕를 쓰는 이유는 connector와 graph-edge local paths의 끝점을 맞춰 하나의 continuous curve로 만들기 위해서다. 어느 connector도 없으면 roadmap 내부 path만으로 query에 답할 수 없다.',
    formulaSymbols: [['s,g', '이번 query의 start와 goal configurations'], ['n_s,n_g', '각 endpoint가 local path로 도달한 roadmap milestones'], ['\\operatorname{Search}_G', 'Roadmap edge cost 위의 graph search'], ['\\oplus', 'Local path segments를 endpoint 순서대로 이어 붙이는 operation']],
    callout: 'Graph node sequence를 반환하는 데서 끝내지 않는다. Concatenated local paths 전체를 release resolution으로 재검증한다.',
    owner: 'Online query connector + graph search',
    output: 'ordered collision-free local segments',
    invariant: 'both endpoint connectors remain explicit',
  },
  {
    eyebrow: '05 · Probability and evidence boundary',
    title: '확률적 완전성·finite deadline 성공·path optimality·scene validity를 서로 분리한다',
    body: 'PRM의 repeated-query experiments는 static holonomic problems에서 learning/query split의 실용성을 보였다. Sample을 늘릴수록 성공 확률이 향상되는 성질은 finite run 성공이나 shortest path, changing scene에서의 validity를 뜻하지 않는다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [],
    visual: <PrmEvidenceVisual />,
    formula: raw`\begin{gathered}
\underbrace{\lim_{N\to\infty}
\Pr[\text{roadmap이 feasible connection 발견}]=1}_{\text{조건부 asymptotic completeness 의미}}\\[6pt]
\not\Longrightarrow
\underbrace{\Pr[\text{deadline }D\text{ 안 성공}]=1}_{\text{finite-run 보장 아님}}\\[4pt]
\not\Longrightarrow
\underbrace{\gamma_{\rm PRM}=\arg\min_{\gamma\subset\mathcal C_{\rm free}}c(\gamma)}_{\text{기본 PRM의 최적경로 보장 아님}}
\end{gathered}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\lim_{N\to\infty}\Pr[\text{feasible connection 발견}]=1}_{\text{조건부 asymptotic completeness}}\\[4pt]
\not\Longrightarrow
\underbrace{\Pr[\text{deadline }D\text{ 안 성공}]=1}_{\text{finite-run 보장 아님}}\\[4pt]
\not\Longrightarrow
\underbrace{\gamma_{\rm PRM}=\arg\min_{\gamma}c(\gamma)}_{\text{기본 PRM의 최적경로 보장 아님}}
\end{gathered}`,
    formulaNote: 'Limit는 sample budget이 무한히 커지는 asymptotic statement다. Fixed N·deadline D에서는 failure probability가 남고, basic PRM은 first feasible connectivity를 찾을 뿐 global path optimum을 자동으로 보장하지 않는다. Main paper와 별도 analysis provenance도 구분한다.',
    formulaSymbols: [['N', 'Roadmap construction sample budget'], ['D', '이번 query 또는 construction에 허용한 finite deadline'], ['\\gamma_{\\rm PRM}', 'Roadmap에서 조립한 feasible path'], ['c(\\gamma)', 'Length·clearance 등 별도로 선언한 path cost']],
    callout: 'Moving obstacle·scene revision에서는 probabilistic statement 이전에 stored nodes와 edges의 validity부터 다시 확인한다.',
    owner: 'Sampling guarantee and evidence audit',
    output: 'finite-run success · quality · scene-validity ledger',
    invariant: 'asymptotic completeness never becomes deadline certainty',
  },
];

function PlanningControlMechanismViz({
  paper,
  scenes,
}: {
  paper: 'kalman' | 'mpc' | 'cspace' | 'prm';
  scenes: PaperMechanismScene[];
}) {
  return (
    <div data-robot-planning-control-paper-viz={paper}>
      <PaperSceneViz
        scenes={scenes}
        ariaLabel={`${paper} 원 논문 핵심 메커니즘 장면`}
      />
    </div>
  );
}

export function KalmanOptimalControlMechanismViz() {
  return <PlanningControlMechanismViz paper="kalman" scenes={kalmanScenes} />;
}

export function MayneMpcMechanismViz() {
  return <PlanningControlMechanismViz paper="mpc" scenes={mpcScenes} />;
}

export function LozanoPerezCspaceMechanismViz() {
  return <PlanningControlMechanismViz paper="cspace" scenes={cspaceScenes} />;
}

export function KavrakiPrmMechanismViz() {
  return <PlanningControlMechanismViz paper="prm" scenes={prmScenes} />;
}
