import type { ReactNode } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Axis3D,
  CheckCircle2,
  CircleDot,
  GitBranch,
  Gauge,
  Network,
  RefreshCw,
  Route,
  Scale,
  ShieldAlert,
  Spline,
  Workflow,
  XCircle,
} from 'lucide-react';
import {
  PaperSceneViz,
  type PaperMechanismScene,
} from './ModelBasedRlPaperViz';

const raw = String.raw;
const palette = {
  gold: '#d6a84b',
  cyan: '#38b8c8',
  violet: '#8f7be8',
  green: '#3fa978',
  red: '#d9676e',
  muted: '#7d8794',
};

type FlowStep = {
  label: string;
  value: string;
  detail: string;
  tone?: keyof typeof palette;
};

function Diagram({
  label,
  children,
  footer,
}: {
  label: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <figure
      className="min-w-0 border-y border-border bg-muted/[0.12]"
      aria-label={label}
      data-domain-diagram
    >
      <div className="flex min-h-[19rem] min-w-0 flex-col justify-center p-3 sm:p-4">
        {children}
      </div>
      {footer ? (
        <figcaption className="border-t border-border px-3 py-3 text-xs font-semibold leading-5 text-muted-foreground sm:px-4">
          {footer}
        </figcaption>
      ) : null}
    </figure>
  );
}

function FlowArrow() {
  return (
    <span className="flex h-8 shrink-0 items-center justify-center text-muted-foreground md:h-auto md:w-8" aria-hidden="true">
      <ArrowDown className="h-4 w-4 md:hidden" />
      <ArrowRight className="hidden h-4 w-4 md:block" />
    </span>
  );
}

function FlowStrip({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="flex min-w-0 flex-col border-y border-border bg-background md:flex-row md:items-stretch">
      {steps.map((step, index) => (
        <div className="contents" key={`${step.label}-${step.value}`}>
          <div className="min-w-0 flex-1 px-3 py-3 sm:px-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 border border-current"
                style={{ color: palette[step.tone ?? 'muted'] }}
                aria-hidden="true"
              />
              <p className="font-mono text-[11px] font-black uppercase leading-4 text-muted-foreground">
                {step.label}
              </p>
            </div>
            <p className="mt-2 break-words text-sm font-black leading-5 [overflow-wrap:anywhere]">
              {step.value}
            </p>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {step.detail}
            </p>
          </div>
          {index < steps.length - 1 ? <FlowArrow /> : null}
        </div>
      ))}
    </div>
  );
}

function KeyValueRail({
  entries,
}: {
  entries: Array<{ symbol: string; label: string; detail: string; tone: keyof typeof palette }>;
}) {
  return (
    <dl className="grid min-w-0 grid-cols-2 border-y border-border bg-background">
      {entries.map((entry) => (
        <div className="min-w-0 border-b border-r border-border p-3 last:border-b-0" key={entry.symbol}>
          <dt className="flex items-center gap-2">
            <span className="font-mono text-base font-black" style={{ color: palette[entry.tone] }}>
              {entry.symbol}
            </span>
            <span className="text-xs font-bold">{entry.label}</span>
          </dt>
          <dd className="mt-1 text-[11px] leading-5 text-muted-foreground">{entry.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

function TransformRail({
  label,
  steps,
  note,
}: {
  label: string;
  steps: string[];
  note: string;
}) {
  return (
    <div className="min-w-0 border-y border-border bg-background py-3">
      <p className="px-3 font-mono text-[11px] font-black uppercase text-muted-foreground">{label}</p>
      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-1 px-3">
        {steps.map((step, index) => (
          <div className="contents" key={step}>
            <span className="border border-border px-2 py-1.5 font-mono text-xs font-black">{step}</span>
            {index < steps.length - 1 ? (
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 border-t border-border px-3 pt-3 text-xs leading-5 text-muted-foreground">{note}</p>
    </div>
  );
}

function DhReuleauxGapVisual() {
  return (
    <Diagram
      label="Reuleaux joint symbols and the missing spatial geometry repaired by D-H frames"
      footer="기호의 종류를 아는 것과 adjacent axes 사이의 signed geometry를 계산할 수 있는 것은 다른 계약이다."
    >
      <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,0.85fr)_2rem_minmax(0,1.15fr)] md:items-center">
        <div className="min-w-0">
          <p className="font-mono text-xs font-black text-muted-foreground">REULEAUX-STYLE SYMBOL CHAIN</p>
          <svg viewBox="0 0 320 176" className="mt-3 block h-auto w-full" role="img" aria-label="Joint type symbols connected as a chain">
            <path d="M34 116 L104 70 L184 112 L270 54" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="8" strokeLinecap="round" />
            <circle cx="34" cy="116" r="18" fill="var(--background)" stroke={palette.cyan} strokeWidth="4" />
            <rect x="88" y="54" width="32" height="32" fill="var(--background)" stroke={palette.gold} strokeWidth="4" />
            <circle cx="184" cy="112" r="18" fill="var(--background)" stroke={palette.violet} strokeWidth="4" />
            <rect x="254" y="38" width="32" height="32" fill="var(--background)" stroke={palette.green} strokeWidth="4" />
            <text x="34" y="122" textAnchor="middle" fontSize="17" fontWeight="900" fill="currentColor">R</text>
            <text x="104" y="76" textAnchor="middle" fontSize="17" fontWeight="900" fill="currentColor">P</text>
            <text x="184" y="118" textAnchor="middle" fontSize="17" fontWeight="900" fill="currentColor">R</text>
            <text x="270" y="60" textAnchor="middle" fontSize="17" fontWeight="900" fill="currentColor">P</text>
            <path d="M80 142 H242" stroke={palette.red} strokeWidth="2" strokeDasharray="7 6" />
            <text x="161" y="164" textAnchor="middle" fontSize="14" fontWeight="800" fill={palette.red}>axis offset / twist missing</text>
          </svg>
        </div>
        <div className="hidden items-center justify-center md:flex" aria-hidden="true">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-xs font-black text-muted-foreground">SPATIAL EQUATION CONTRACT</p>
          <svg viewBox="0 0 360 176" className="mt-3 block h-auto w-full" role="img" aria-label="Two skew joint axes joined by a common normal">
            <line x1="85" y1="145" x2="85" y2="24" stroke={palette.cyan} strokeWidth="6" />
            <line x1="270" y1="150" x2="312" y2="30" stroke={palette.violet} strokeWidth="6" />
            <line x1="85" y1="92" x2="292" y2="88" stroke={palette.gold} strokeWidth="5" />
            <circle cx="85" cy="92" r="7" fill="var(--background)" stroke={palette.cyan} strokeWidth="4" />
            <circle cx="292" cy="88" r="7" fill="var(--background)" stroke={palette.violet} strokeWidth="4" />
            <path d="M102 75 A34 34 0 0 1 126 98" fill="none" stroke={palette.green} strokeWidth="3" />
            <text x="58" y="24" fontSize="17" fontWeight="900" fill={palette.cyan}>zᵢ₋₁</text>
            <text x="302" y="28" fontSize="17" fontWeight="900" fill={palette.violet}>zᵢ</text>
            <text x="174" y="76" fontSize="17" fontWeight="900" fill={palette.gold}>xᵢ₋₁</text>
            <text x="119" y="70" fontSize="16" fontWeight="900" fill={palette.green}>α</text>
            <text x="182" y="112" fontSize="16" fontWeight="900" fill={palette.gold}>a</text>
          </svg>
        </div>
      </div>
    </Diagram>
  );
}

function DhAxisConstructionVisual() {
  return (
    <Diagram
      label="D-H axis and common-normal frame construction"
      footer="z축은 joint axis가 소유하고 x축은 두 z축의 common normal이 소유한다. 네 값은 이 frame restriction 뒤에 남는 motion이다."
    >
      <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)] md:items-center">
        <svg viewBox="0 0 440 260" className="block h-auto w-full" role="img" aria-label="D-H frame with joint axes, common normal, twist, length, offset and angle">
          <defs>
            <marker id="dh-axis-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill={palette.muted} />
            </marker>
          </defs>
          <line x1="105" y1="225" x2="105" y2="28" stroke={palette.cyan} strokeWidth="6" />
          <line x1="318" y1="230" x2="365" y2="34" stroke={palette.violet} strokeWidth="6" />
          <line x1="105" y1="131" x2="342" y2="128" stroke={palette.gold} strokeWidth="5" markerEnd="url(#dh-axis-arrow)" />
          <line x1="105" y1="170" x2="105" y2="131" stroke={palette.green} strokeWidth="7" />
          <path d="M126 96 A45 45 0 0 1 157 132" fill="none" stroke={palette.red} strokeWidth="3" strokeDasharray="5 4" />
          <path d="M90 171 A31 31 0 0 1 118 188" fill="none" stroke={palette.violet} strokeWidth="3" />
          <circle cx="105" cy="131" r="7" fill="var(--background)" stroke={palette.cyan} strokeWidth="4" />
          <circle cx="342" cy="128" r="7" fill="var(--background)" stroke={palette.violet} strokeWidth="4" />
          <text x="72" y="28" fontSize="18" fontWeight="900" fill={palette.cyan}>zᵢ</text>
          <text x="356" y="33" fontSize="18" fontWeight="900" fill={palette.violet}>zᵢ₊₁</text>
          <text x="197" y="113" fontSize="18" fontWeight="900" fill={palette.gold}>xᵢ₊₁</text>
          <text x="190" y="153" fontSize="17" fontWeight="900" fill={palette.gold}>aᵢ</text>
          <text x="74" y="155" fontSize="17" fontWeight="900" fill={palette.green}>sᵢ</text>
          <text x="152" y="92" fontSize="17" fontWeight="900" fill={palette.red}>αᵢ</text>
          <text x="120" y="209" fontSize="17" fontWeight="900" fill={palette.violet}>θᵢ</text>
        </svg>
        <KeyValueRail
          entries={[
            { symbol: 'αᵢ', label: 'link twist', detail: 'xᵢ₊₁ 주위 zᵢ→zᵢ₊₁ angle', tone: 'red' },
            { symbol: 'aᵢ', label: 'link distance', detail: 'xᵢ₊₁을 따른 signed distance', tone: 'gold' },
            { symbol: 'sᵢ', label: 'pair offset', detail: 'zᵢ를 따른 common-normal offset', tone: 'green' },
            { symbol: 'θᵢ', label: 'pair angle', detail: 'zᵢ 주위 xᵢ→xᵢ₊₁ angle', tone: 'violet' },
          ]}
        />
      </div>
    </Diagram>
  );
}

function DhConventionForkVisual() {
  return (
    <Diagram
      label="Historical D-H convention layers separating the 1955 coordinate-change matrix, 1964 right-handed restatement and later proximal modified form"
      footer="세 층은 같은 physical geometry를 다시 parameterize할 수 있지만 matrix layout, alpha handedness, factor order와 indices를 먼저 변환해야 한다. 같은 tuple을 branch 사이에 복사하지 않는다."
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-3 lg:items-stretch">
        <TransformRail
          label="1955 · original coordinate change"
          steps={['[1,x,y,z]ᵀ', 'Zᵢ(θᵢ,sᵢ)', 'Xᵢ₊₁(aᵢ,αᵢᴸᴴ)']}
          note="Homogeneous coordinate가 첫 성분이고 α 부호는 도해·인쇄식의 implicit left-handed convention이다."
        />
        <TransformRail
          label="1964 · RH distal/standard restatement"
          steps={['Rz(θᵢ)', 'Dz(sᵢ)', 'Dx(aᵢ)', 'Rx(αᵢᴿᴴ)']}
          note="Right-handed α의 Zᵢ-then-Xᵢ₊₁ factorization을 modern [x,y,z,1]ᵀ layout으로 보인 층이다."
        />
        <TransformRail
          label="later · proximal / modified branch"
          steps={['X-group first', 'Z-group next', 'shifted indices']}
          note="Frame을 proximal side에 붙이는 후대 variant다. 1955 인쇄식이나 1964 distal row의 별칭이 아니다."
        />
      </div>
      <div className="mt-5 grid border-y border-border bg-background sm:grid-cols-3 sm:divide-x sm:divide-border">
        {[
          ['matrix layout', 'homogeneous coordinate가 first인가 last인가'],
          ['handedness', 'α가 left-handed인가 right-handed인가'],
          ['frame/index owner', 'Z-then-X인가 X-then-Z·shifted index인가'],
        ].map(([label, detail], index) => (
          <div className="min-w-0 border-b border-border p-3 last:border-b-0 sm:border-b-0" key={label}>
            <p className="font-mono text-[11px] font-black text-muted-foreground">0{index + 1} · {label}</p>
            <p className="mt-1 text-xs font-semibold leading-5">{detail}</p>
          </div>
        ))}
      </div>
    </Diagram>
  );
}

function DhClosureEndpointVisual() {
  return (
    <Diagram
      label="Open-chain endpoint composition compared with closed-loop transform closure"
      footer="Open chain은 끝 pose가 출력이고 closed mechanism은 loop product가 identity인지가 constraint다. 같은 local matrices라도 검증 경계가 다르다."
    >
      <div className="grid min-w-0 gap-6 md:grid-cols-2 md:divide-x md:divide-border">
        <div className="min-w-0 md:pr-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-black text-muted-foreground">OPEN CHAIN · ENDPOINT</p>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">output T₀ⁿ</span>
          </div>
          <svg viewBox="0 0 360 208" className="mt-3 block h-auto w-full" role="img" aria-label="Open serial chain ending at a tool frame">
            <path d="M35 175 L104 128 L185 145 L250 82 L324 47" fill="none" stroke="currentColor" strokeOpacity="0.58" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            {[['35','175'],['104','128'],['185','145'],['250','82']].map(([cx, cy], index) => (
              <circle key={cx} cx={cx} cy={cy} r="10" fill="var(--background)" stroke={index % 2 ? palette.violet : palette.cyan} strokeWidth="5" />
            ))}
            <line x1="324" y1="47" x2="348" y2="47" stroke={palette.red} strokeWidth="4" />
            <line x1="324" y1="47" x2="324" y2="22" stroke={palette.green} strokeWidth="4" />
            <text x="286" y="30" fontSize="16" fontWeight="900" fill={palette.gold}>tool</text>
            <text x="30" y="202" fontSize="14" fontWeight="800" fill="currentColor">base → T₀¹ → T₁² → ... → Tₙ₋₁ⁿ</text>
          </svg>
        </div>
        <div className="min-w-0 md:pl-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-black text-muted-foreground">CLOSED LOOP · CLOSURE</p>
            <span className="text-xs font-black text-violet-700 dark:text-violet-300">constraint I</span>
          </div>
          <svg viewBox="0 0 360 208" className="mt-3 block h-auto w-full" role="img" aria-label="Closed four-bar spatial loop whose transform product returns to identity">
            <defs>
              <marker id="dh-closure-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill={palette.green} />
              </marker>
            </defs>
            <path d="M67 164 L104 54 L272 47 L306 159 Z" fill="none" stroke="currentColor" strokeOpacity="0.58" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            {[[67,164],[104,54],[272,47],[306,159]].map(([cx, cy], index) => (
              <circle key={cx} cx={cx} cy={cy} r="10" fill="var(--background)" stroke={index % 2 ? palette.gold : palette.cyan} strokeWidth="5" />
            ))}
            <path d="M140 92 C175 65 220 70 241 103" fill="none" stroke={palette.green} strokeWidth="3" markerEnd="url(#dh-closure-arrow)" />
            <text x="178" y="122" textAnchor="middle" fontSize="24" fontWeight="900" fill={palette.green}>I</text>
            <text x="79" y="200" fontSize="14" fontWeight="800" fill="currentColor">return to the same frame</text>
          </svg>
        </div>
      </div>
    </Diagram>
  );
}

function DhNearParallelVisual() {
  const samples = [
    { label: 'separated', tilt: 28, offset: 52, tone: palette.green },
    { label: 'near parallel', tilt: 10, offset: 80, tone: palette.gold },
    { label: 'measurement-limited', tilt: 2, offset: 122, tone: palette.red },
  ];
  return (
    <Diagram
      label="Nearly parallel joint axes make the common-normal parameterization sensitive to small measurement changes"
      footer="1955의 증거는 nominal lower-pair mechanism을 완전한 matrix equation으로 적는 데 닿는다. Manufacturing noise의 identification conditioning은 별도 calibration evidence가 필요하다."
    >
      <div className="grid min-w-0 gap-4 sm:grid-cols-3">
        {samples.map((sample, index) => (
          <div className="min-w-0 border-y border-border bg-background px-3 py-3" key={sample.label}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] font-black uppercase text-muted-foreground">axis sample 0{index + 1}</p>
              <span className="text-xs font-black" style={{ color: sample.tone }}>{sample.label}</span>
            </div>
            <svg viewBox="0 0 240 170" className="mt-2 block h-auto w-full" role="img" aria-label={`${sample.label} axes and common normal`}>
              <line x1="54" y1="146" x2="54" y2="20" stroke={palette.cyan} strokeWidth="6" />
              <line
                x1={160 + sample.offset / 5}
                y1="146"
                x2={160 + sample.offset / 5 + sample.tilt}
                y2="20"
                stroke={sample.tone}
                strokeWidth="6"
              />
              <line x1="54" y1={102 - index * 22} x2={166 + sample.offset / 5} y2={102 - index * 22} stroke={palette.gold} strokeWidth="4" strokeDasharray={index === 2 ? '5 5' : undefined} />
              <path d={`M67 ${91 - index * 22} A24 24 0 0 1 ${86 + sample.tilt / 3} ${105 - index * 22}`} fill="none" stroke={sample.tone} strokeWidth="3" />
              <text x="18" y="165" fontSize="14" fontWeight="800" fill="currentColor">small axis error</text>
              <text x="219" y="165" textAnchor="end" fontSize="14" fontWeight="900" fill={sample.tone}>Δtable ↑</text>
            </svg>
          </div>
        ))}
      </div>
      <div className="mt-5 grid border-y border-border bg-background sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="p-3">
          <p className="text-xs font-black text-emerald-700 dark:text-emerald-300">논문이 지지</p>
          <p className="mt-1 text-xs leading-5">Nominal axes와 frame rule이 주어졌을 때 repeatable matrix description</p>
        </div>
        <ArrowRight className="mx-auto hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
        <div className="border-t border-border p-3 sm:border-l sm:border-t-0">
          <p className="text-xs font-black text-red-700 dark:text-red-300">추가 증거가 필요</p>
          <p className="mt-1 text-xs leading-5">Near-parallel axis identification, noise conditioning, encoder-zero calibration</p>
        </div>
      </div>
    </Diagram>
  );
}

const denavitHartenbergScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Reuleaux notation gap',
    title: 'Joint symbol만으로는 spatial axis 사이의 거리와 twist를 equation에 고정할 수 없다',
    body: 'Revolute·prismatic pair의 종류를 나열해도 adjacent axes가 3D에서 어떻게 놓였는지는 남는다. D-H의 출발점은 이 빠진 signed geometry를 frame과 matrix로 소유시키는 것이다.',
    icon: Network,
    layout: 'flow',
    items: [],
    visual: <DhReuleauxGapVisual />,
    formula: raw`\underbrace{\text{pair type·sequence}}_{\text{Reuleaux contracted formula}}+\underbrace{(a_i,\alpha_i,s_i,\theta_i)}_{\text{축 geometry와 pair variable}}\longrightarrow\underbrace{M_{i+1}}_{\text{계산 가능한 local coordinate change}}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\text{pair 종류·순서}}_{\text{기호 관계}}\\[3pt]
+\underbrace{(a_i,\alpha_i,s_i,\theta_i)}_{\text{축 geometry·pair 변수}}\\[3pt]
\Longrightarrow\underbrace{M_{i+1}}_{\text{계산 가능한 좌표 변환}}
\end{gathered}`,
    formulaNote: '기호의 이름과 공간 배치를 분리한다. D-H의 네 값은 arbitrary SE(3)의 네 자유도가 아니라 joint-axis와 common-normal로 frame을 제한한 뒤 남는 값이다.',
    formulaSymbols: [['a_i,\\alpha_i', 'Consecutive pair axes 사이의 fixed link geometry'], ['s_i,\\theta_i', 'Pair axis z_i 위의 offset과 angle'], ['M_{i+1}', '1955 배열·부호 convention의 adjacent coordinate-change matrix']],
    callout: 'D-H가 보완한 것은 그림의 장식이 아니라 equation completeness다. Pair type, frame rule, signed parameters와 multiply direction이 함께 있어야 다른 구현자가 같은 mechanism을 복원한다.',
    owner: 'Mechanism description',
    output: 'axis-indexed link vocabulary',
    invariant: 'joint type and spatial geometry remain distinct',
  },
  {
    eyebrow: '02 · Axis/common-normal construction',
    title: 'zᵢ를 pair axis에, xᵢ₊₁을 common perpendicular에 묶으면 여섯 frame freedom 중 둘이 사라진다',
    body: '두 adjacent joint axes를 먼저 고정하고 그 둘을 직교로 잇는 common normal을 x축으로 선택한다. 이 frame restriction이 twist·length·offset·angle의 네 scalar를 만든다.',
    icon: Axis3D,
    layout: 'compare',
    items: [],
    visual: <DhAxisConstructionVisual />,
    formula: raw`\underbrace{H_i\in z_i\cap x_{i+1},\qquad z_i\perp x_{i+1}}_{\text{adjacent frame에 건 두 geometric constraints}}\Longrightarrow\underbrace{6-2=4}_{\text{남는 독립 parameter}}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{H_i\in z_i\cap x_{i+1}}_{\text{두 축을 잇는 교점}},\qquad
\underbrace{z_i\perp x_{i+1}}_{\text{직교 조건}}\\[3pt]
\Longrightarrow\underbrace{6-2=4}_{\text{남는 독립 변수}}
\end{gathered}`,
    formulaNote: 'aᵢ·αᵢ는 xᵢ₊₁이 consecutive axes 사이에서 운반하는 link geometry이고 sᵢ·θᵢ는 zᵢ 위의 pair relation이다. Revolute는 θᵢ, prismatic은 sᵢ가 runtime variable이다.',
    formulaSymbols: [['H_i', 'Pair axis z_i와 next common perpendicular x_{i+1}의 교점'], ['z_i', 'Pair motion의 physical axis'], ['x_{i+1}', 'z_i와 z_{i+1}에 모두 직교하는 common perpendicular'], ['6-2', 'General frame pose에서 두 frame-choice constraints를 제거한 count']],
    callout: 'Parallel 또는 intersecting axes에서는 common normal 선택이 비유일할 수 있다. Table 숫자가 다르다는 사실만으로 physical mechanism이 다르다고 판정하지 말고 composed pose를 비교한다.',
    owner: 'Frame assignment rule',
    output: 'four parameters per lower pair',
    invariant: 'z follows joint axis; x follows common normal',
  },
  {
    eyebrow: '03 · Convention fork',
    title: '1955 matrix layout·LH α, 1964 RH 정리와 later modified branch를 한 식으로 뭉치지 않는다',
    body: '원문은 [1,x,y,z]ᵀ coordinate-change와 implicit left-handed α를 썼다. 1964 right-handed Z-then-X 정리와 later proximal X-then-Z variant는 변환 가능한 후대 층이지만 같은 인쇄식은 아니다.',
    icon: GitBranch,
    layout: 'compare',
    items: [],
    visual: <DhConventionForkVisual />,
    formula: raw`\underbrace{M_{i+1}^{(1955)}=Z_i(\theta_i,s_i)X_{i+1}(a_i,\alpha_i^{\mathrm{LH}})}_{\text{first-coordinate 배열·LH }\alpha}\xrightarrow{\text{배열·부호 변환}}\underbrace{{}^{i}T_{i+1}=R_z(\theta_i)D_z(s_i)D_x(a_i)R_x(\alpha_i^{\mathrm{RH}})}_{\text{1964 RH Z-then-X의 modern 배열}}\quad\underbrace{\text{X-then-Z + shifted index}}_{\text{later proximal/modified}}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{M_{i+1}^{(1955)}}_{\text{1955: 좌표 첫 칸·좌수 부호}}
=Z_i(\theta_i,s_i)X_{i+1}(a_i,\alpha_i^{\mathrm{LH}})\\[4pt]
\underbrace{{}^{i}T_{i+1}}_{\text{1964: 좌표 끝 칸·우수 부호}}
=R_z(\theta_i)D_z(s_i)\\[-1pt]
\phantom{{}^{i}T_{i+1}=}\;D_x(a_i)R_x(\alpha_i^{\mathrm{RH}})\\[4pt]
\underbrace{\text{X 묶음}\to\text{Z 묶음·index 이동}}_{\text{후대 modified 분기}}
\end{gathered}`,
    formulaNote: '첫 화살표는 동일한 coordinate change를 matrix layout과 handedness에 맞게 재표현한다. 마지막 branch는 frame assignment부터 다시 만든 후대 parameterization이므로 같은 row tuple을 재사용하지 않는다.',
    formulaSymbols: [['M_{i+1}^{(1955)}', 'Homogeneous coordinate가 첫 성분인 original coordinate-change matrix'], ['\\alpha_i^{\\mathrm{LH}}', '1955 도해·matrix의 implicit left-handed twist'], ['{}^{i}T_{i+1}', 'Right-handed Z-then-X를 modern last-coordinate layout으로 옮긴 transform'], ['\\text{X-then-Z + shifted index}', 'Later proximal/modified D-H의 frame·index contract']],
    callout: '“같은 D-H”라는 문자열은 충분한 interface가 아니다. Random joint samples에서 independent FK와 endpoint를 비교하는 regression test가 convention mix를 잡는다.',
    owner: 'Historical convention adapter',
    output: 'layout · handedness · factor-order contract',
    invariant: 'rows never cross convention branches',
  },
  {
    eyebrow: '04 · Closure versus endpoint',
    title: 'Open chain은 tool pose를 내고 closed mechanism은 같은 frame으로 돌아오는 closure residual을 남긴다',
    body: 'Adjacent transforms를 곱는 연산은 같지만 검증 대상은 다르다. Serial chain은 ordered endpoint transform이 출력이고 loop에서는 전체 product가 identity가 되어야 configuration이 닫힌다.',
    icon: Route,
    layout: 'compare',
    items: [],
    visual: <DhClosureEndpointVisual />,
    formula: raw`\underbrace{T_0^n=T_0^1T_1^2\cdots T_{n-1}^{n}}_{\text{open-chain endpoint}}\qquad\underbrace{\prod_{(i,j)\in\mathrm{loop}}T_i^j=I}_{\text{closed-loop closure constraint}}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{T_0^n=T_0^1T_1^2\cdots T_{n-1}^{n}}_{\text{열린 chain의 끝 자세}}\\[5pt]
\underbrace{\displaystyle\prod_{(i,j)\in\mathrm{loop}}T_i^j=I}_{\text{닫힌 loop의 복귀 조건}}
\end{gathered}`,
    formulaNote: '같은 local transform vocabulary가 endpoint computation과 loop equation 양쪽에 쓰인다. Loop에서는 matrix product가 identity에서 얼마나 벗어나는지가 constraint residual이다.',
    formulaSymbols: [['T_0^n', 'Base frame에서 본 open-chain tool pose'], ['\\prod T_i^j', '한 방향으로 loop를 순회한 ordered transform product'], ['I', '시작 frame으로 정확히 돌아왔음을 뜻하는 identity transform']],
    callout: 'Closure를 endpoint 하나처럼 취급하면 dependent joint constraints를 놓친다. 반대로 open chain에 identity closure를 강제하면 실제 reachable pose를 지운다.',
    owner: 'Chain composer or loop solver',
    output: 'tool pose or closure residual',
    invariant: 'matrix order follows physical traversal',
  },
  {
    eyebrow: '05 · Near-parallel evidence ceiling',
    title: '완전한 nominal notation은 nearly parallel axes의 calibration conditioning까지 보장하지 않는다',
    body: 'Axis가 거의 평행하면 작은 direction·origin measurement error가 common-normal frame과 parameter table을 크게 움직일 수 있다. Forward pose는 비슷해도 identified parameters는 불안정할 수 있다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [],
    visual: <DhNearParallelVisual />,
    formula: raw`\underbrace{\|\Delta T(q)\|}_{\text{pose 변화는 작을 수 있음}}\not\Rightarrow\underbrace{\|\Delta(\alpha,a,d,\theta)\|}_{\text{parameter 변화도 작음}}\qquad\text{near-parallel axes}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\|\Delta T(q)\|\ \text{작음}}_{\text{끝 자세 변화}}\\[3pt]
\not\Rightarrow
\underbrace{\|\Delta(\alpha,a,d,\theta)\|\ \text{작음}}_{\text{parameter 변화}}\\[3pt]
\underbrace{z_i\parallel z_{i+1}\ \text{근처}}_{\text{민감한 축 배치}}
\end{gathered}`,
    formulaNote: 'Parameter sensitivity와 pose sensitivity는 같은 지표가 아니다. 원 논문의 spatial notation evidence를 modern noisy calibration의 robustness certificate로 확장하지 않는다.',
    formulaSymbols: [['\\Delta T(q)', 'Axis perturbation 뒤 composed forward pose의 변화'], ['\\Delta(\\alpha,a,d,\\theta)', '같은 perturbation이 D-H table에 만든 변화'], ['\\not\\Rightarrow', '작은 pose residual이 stable parameter identification을 함의하지 않음']],
    callout: 'Deployment에서는 axis-angle separation, identification condition number, encoder-zero uncertainty와 independent endpoint residual을 함께 기록해야 한다.',
    owner: 'Calibration and evidence audit',
    output: 'pose residual · parameter sensitivity',
    invariant: 'nominal completeness ≠ noise robustness',
  },
];

export function DenavitHartenbergMechanismViz() {
  return (
    <div data-robot-kinematics-retiming-paper-viz="dh">
      <PaperSceneViz
        scenes={denavitHartenbergScenes}
        ariaLabel="Denavit-Hartenberg · Reuleaux notation gap에서 axis construction, convention, closure와 calibration evidence boundary까지"
      />
    </div>
  );
}

function WhitneyCommandFrameVisual() {
  const commands = [
    ['sweep', 'vₓ', 'hand x translation'],
    ['reach', 'vᵧ', 'hand y translation'],
    ['lift', 'v_z', 'hand z translation'],
    ['tilt', 'ωₓ', 'hand x rotation'],
    ['twist', 'ωᵧ', 'hand y rotation'],
    ['turn', 'ω_z', 'hand z rotation'],
  ];
  return (
    <Diagram
      label="Whitney hand-coordinate command frame with six translational and rotational commands"
      footer="Command name만 저장하면 frame ambiguity가 남는다. S의 여섯 component마다 frame, axis order, linear/angular unit을 같은 interface에 고정한다."
    >
      <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] md:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs font-black text-muted-foreground">OPERATOR VIEW → HAND FRAME</p>
            <span className="border border-border bg-background px-2 py-1 font-mono text-[11px] font-black">frame = H</span>
          </div>
          <svg viewBox="0 0 430 252" className="mt-3 block h-auto w-full" role="img" aria-label="Manipulator arm and local hand coordinate frame">
            <defs>
              <marker id="whitney-arrow-cyan" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill={palette.cyan} />
              </marker>
              <marker id="whitney-arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill={palette.green} />
              </marker>
              <marker id="whitney-arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill={palette.red} />
              </marker>
            </defs>
            <path d="M43 220 L112 169 L192 186 L261 111 L339 126" fill="none" stroke="currentColor" strokeOpacity="0.54" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            {[[43,220],[112,169],[192,186],[261,111]].map(([cx, cy], index) => (
              <circle key={cx} cx={cx} cy={cy} r="11" fill="var(--background)" stroke={index % 2 ? palette.violet : palette.gold} strokeWidth="5" />
            ))}
            <rect x="333" y="105" width="58" height="42" fill="var(--background)" stroke="currentColor" strokeWidth="4" />
            <line x1="362" y1="126" x2="420" y2="126" stroke={palette.red} strokeWidth="4" markerEnd="url(#whitney-arrow-red)" />
            <line x1="362" y1="126" x2="362" y2="61" stroke={palette.green} strokeWidth="4" markerEnd="url(#whitney-arrow-green)" />
            <line x1="362" y1="126" x2="327" y2="167" stroke={palette.cyan} strokeWidth="4" markerEnd="url(#whitney-arrow-cyan)" />
            <path d="M384 82 A45 45 0 0 1 409 111" fill="none" stroke={palette.violet} strokeWidth="3" strokeDasharray="6 5" />
            <text x="418" y="116" fontSize="16" fontWeight="900" fill={palette.red}>xᴴ</text>
            <text x="369" y="59" fontSize="16" fontWeight="900" fill={palette.green}>zᴴ</text>
            <text x="309" y="181" fontSize="16" fontWeight="900" fill={palette.cyan}>yᴴ</text>
            <text x="390" y="78" fontSize="15" fontWeight="900" fill={palette.violet}>ωᴴ</text>
            <text x="35" y="244" fontSize="14" fontWeight="800" fill="currentColor">shoulder</text>
            <text x="335" y="98" fontSize="14" fontWeight="800" fill="currentColor">hand H</text>
          </svg>
        </div>
        <div className="grid min-w-0 grid-cols-2 border-y border-border bg-background">
          {commands.map(([name, symbol, detail], index) => (
            <div className="min-w-0 border-b border-r border-border p-3" key={name}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-black">{name}</p>
                <span className="font-mono text-sm font-black" style={{ color: index < 3 ? palette.cyan : palette.violet }}>{symbol}</span>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </Diagram>
  );
}

function WhitneyJacobianColumnsVisual() {
  const columns = [
    { joint: 'J1', kind: 'revolute', top: 'u₁ × b₁₇', bottom: 'u₁', tone: 'cyan' as const },
    { joint: 'J2', kind: 'revolute', top: 'u₂ × b₂₇', bottom: 'u₂', tone: 'violet' as const },
    { joint: 'J3', kind: 'prismatic', top: 'u₃', bottom: '0', tone: 'gold' as const },
  ];
  return (
    <Diagram
      label="Each unit joint rate produces one translational and rotational Jacobian column at the hand"
      footer="Jacobian은 generic matrix를 먼저 채우는 표가 아니다. 현재 geometry에서 joint 하나만 unit rate로 움직였을 때 hand twist가 어떻게 생기는지 column별로 조립한다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)] lg:items-center">
        <svg viewBox="0 0 420 250" className="block h-auto w-full" role="img" aria-label="Three joints contributing unit-rate motion at the hand">
          <path d="M42 211 L121 161 L210 177 L287 102 L364 116" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          {[
            { cx: 121, cy: 161, color: palette.cyan, label: '1' },
            { cx: 210, cy: 177, color: palette.violet, label: '2' },
            { cx: 287, cy: 102, color: palette.gold, label: '3' },
          ].map((joint) => (
            <g key={joint.label}>
              <circle cx={joint.cx} cy={joint.cy} r="15" fill="var(--background)" stroke={joint.color} strokeWidth="5" />
              <text x={joint.cx} y={joint.cy + 5} textAnchor="middle" fontSize="14" fontWeight="900" fill="currentColor">{joint.label}</text>
            </g>
          ))}
          <path d="M96 135 A37 37 0 0 1 139 129" fill="none" stroke={palette.cyan} strokeWidth="4" strokeDasharray="6 5" />
          <path d="M189 145 A36 36 0 0 1 230 145" fill="none" stroke={palette.violet} strokeWidth="4" strokeDasharray="6 5" />
          <line x1="267" y1="77" x2="316" y2="54" stroke={palette.gold} strokeWidth="5" />
          <path d="M364 116 L400 88" fill="none" stroke={palette.green} strokeWidth="5" />
          <text x="26" y="238" fontSize="14" fontWeight="800" fill="currentColor">set one θ̇ⱼ = 1, all others = 0</text>
          <text x="325" y="73" fontSize="14" fontWeight="900" fill={palette.green}>hand twist</text>
        </svg>
        <div className="min-w-0 border-y border-border bg-background">
          <div className="grid grid-cols-[4.5rem_5rem_minmax(0,1fr)] border-b border-border px-3 py-2 font-mono text-[11px] font-black uppercase text-muted-foreground">
            <span>joint</span><span>unit rate</span><span>one column of J</span>
          </div>
          {columns.map((column) => (
            <div className="grid min-w-0 grid-cols-[4.5rem_5rem_minmax(0,1fr)] items-center border-b border-border px-3 py-3 last:border-b-0" key={column.joint}>
              <div>
                <p className="text-sm font-black" style={{ color: palette[column.tone] }}>{column.joint}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{column.kind}</p>
              </div>
              <p className="font-mono text-xs font-black">q̇ = eⱼ</p>
              <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] border-l border-border pl-3 font-mono text-xs font-black">
                <span className="row-span-2 flex items-center text-xl text-muted-foreground">[</span>
                <span>{column.top}</span>
                <span>{column.bottom}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Diagram>
  );
}

function WhitneyResolveMotorVisual() {
  return (
    <Diagram
      label="Desired hand rate resolves through inverse Jacobian to joint rates and then through linkage matrix to motor rates"
      footer="J는 hand-to-joint kinematics를, M₂는 joint-to-motor transmission을 소유한다. 두 map을 합쳐 쓰더라도 intermediate joint-rate command를 log에서 지우지 않는다."
    >
      <FlowStrip
        steps={[
          { label: 'task request', value: 'hand rate S', detail: 'command frame과 단위를 포함', tone: 'cyan' },
          { label: 'local resolve', value: 'J(θ)⁻¹', detail: 'current configuration에서만 valid', tone: 'violet' },
          { label: 'joint command', value: 'simultaneous θ̇', detail: '각 mechanism joint의 rate', tone: 'gold' },
          { label: 'transmission', value: 'motor rate φ̇', detail: 'gear·linkage matrix M₂ 적용', tone: 'green' },
        ]}
      />
      <div className="mt-5 min-w-0 border-y border-border bg-background px-3 py-4">
        <div className="grid min-w-0 gap-4 sm:grid-cols-[7rem_minmax(0,1fr)_7rem] sm:items-center">
          <div>
            <p className="font-mono text-[11px] font-black text-muted-foreground">JOINT SIDE</p>
            <p className="mt-1 text-sm font-black">θ̇₁ · θ̇₂ · θ̇₃</p>
          </div>
          <div className="space-y-2">
            {[
              ['J1 → motor A', '72%', palette.cyan],
              ['J2 → motors B+C', '45% + 31%', palette.violet],
              ['J3 → motor C', '64%', palette.gold],
            ].map(([label, value, color]) => (
              <div className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-3" key={label}>
                <div className="h-2 bg-muted">
                  <div className="h-full" style={{ width: String(value).split(' ')[0], backgroundColor: color }} />
                </div>
                <p className="text-right font-mono text-[11px] font-black">{label}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
            <p className="font-mono text-[11px] font-black text-muted-foreground">MOTOR SIDE</p>
            <p className="mt-1 text-sm font-black">φ̇A · φ̇B · φ̇C</p>
          </div>
        </div>
      </div>
    </Diagram>
  );
}

function WhitneyPoseLoopVisual() {
  return (
    <Diagram
      label="Pose correction loop repeatedly compares current and target hand pose, resolves a task rate, integrates joint rates and measures again"
      footer="한 번 계산한 final joint angle로 뛰는 analytic IK가 아니라 current pose에서 error를 다시 만드는 receding differential loop다. Saturation과 collision 검사는 별도 owner다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(15rem,0.65fr)_minmax(0,1.35fr)] lg:items-center">
        <div className="grid grid-cols-2 border-y border-border bg-background">
          <div className="border-r border-border p-3">
            <p className="font-mono text-[11px] font-black text-muted-foreground">CURRENT Hₖ</p>
            <svg viewBox="0 0 140 130" className="mt-2 block h-auto w-full" role="img" aria-label="Current hand pose">
              <rect x="36" y="53" width="50" height="32" fill="var(--background)" stroke={palette.cyan} strokeWidth="4" transform="rotate(-12 61 69)" />
              <line x1="62" y1="68" x2="118" y2="55" stroke={palette.red} strokeWidth="4" />
              <line x1="62" y1="68" x2="50" y2="18" stroke={palette.green} strokeWidth="4" />
              <circle cx="62" cy="68" r="5" fill={palette.cyan} />
              <text x="10" y="121" fontSize="13" fontWeight="800" fill="currentColor">measured pose</text>
            </svg>
          </div>
          <div className="p-3">
            <p className="font-mono text-[11px] font-black text-muted-foreground">TARGET H*</p>
            <svg viewBox="0 0 140 130" className="mt-2 block h-auto w-full" role="img" aria-label="Target hand pose">
              <rect x="50" y="35" width="50" height="32" fill="none" stroke={palette.green} strokeWidth="4" strokeDasharray="7 5" transform="rotate(9 75 51)" />
              <line x1="76" y1="51" x2="128" y2="61" stroke={palette.red} strokeWidth="4" strokeDasharray="6 4" />
              <line x1="76" y1="51" x2="85" y2="8" stroke={palette.green} strokeWidth="4" strokeDasharray="6 4" />
              <path d="M56 93 C73 104 94 93 99 75" fill="none" stroke={palette.violet} strokeWidth="3" />
              <text x="10" y="121" fontSize="13" fontWeight="800" fill="currentColor">desired pose</text>
            </svg>
          </div>
        </div>
        <div className="min-w-0">
          <FlowStrip
            steps={[
              { label: 'pose error', value: 'Δp · axis-angle', detail: 'translation과 orientation을 분리', tone: 'red' },
              { label: 'time budget', value: 'Sₖ = error / T', detail: 'hand-frame rate command 생성', tone: 'cyan' },
              { label: 'resolve', value: 'θ̇ₖ = Jₖ⁻¹Sₖ', detail: 'current local Jacobian 사용', tone: 'violet' },
              { label: 'advance', value: 'θₖ₊₁', detail: 'integrate and measure again', tone: 'green' },
            ]}
          />
          <div className="mt-4 flex items-center justify-center gap-3 border-y border-border bg-background px-3 py-3 text-xs font-black">
            <RefreshCw className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>read current pose</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>recompute error</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>stop on tolerance</span>
          </div>
        </div>
      </div>
    </Diagram>
  );
}

function MatrixShape({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) {
  return (
    <div
      className="grid h-24 w-full max-w-32 gap-1 border-x-2 border-foreground/50 px-2 py-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      aria-label={`${rows} by ${columns} matrix`}
    >
      {Array.from({ length: rows * columns }, (_, index) => {
        return (
          <span
            className="min-h-0 border border-cyan-600/50 bg-cyan-500/20"
            key={index}
          />
        );
      })}
    </div>
  );
}

function WhitneySolverBoundaryVisual() {
  const regimes = [
    { label: 'exact 6×6', tag: '1972', rows: 6, columns: 6, detail: 'square · nonsingular · all directions', status: 'J⁻¹', tone: palette.green },
    { label: 'reduced task', tag: '1972', rows: 4, columns: 4, detail: 'E-2 rows and columns removed together', status: '4×4 reduced inverse', tone: palette.gold },
    { label: 'redundant arm', tag: '1972', rows: 6, columns: 7, detail: 'n > 6 joints · full-row-rank task map', status: 'weighted minimum', tone: palette.violet },
    { label: 'damped solve', tag: '1986+', rows: 6, columns: 6, detail: 'near-singular gain is regularized', status: 'DLS · later work', tone: palette.red, later: true },
  ];
  return (
    <Diagram
      label="Whitney exact, reduced and redundant inverse regimes separated from later damped least squares"
      footer="1972는 exact inverse failure를 physical lost direction과 task reduction으로 읽고 redundancy에는 weighted criterion을 둔다. Near-singular damping은 이 paper의 contribution으로 소급하지 않는다."
    >
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {regimes.map((regime) => (
          <div className={`min-w-0 border-y bg-background py-3 ${regime.later ? 'border-dashed border-red-500/60' : 'border-border'}`} key={regime.label}>
            <div className="flex items-center justify-between gap-2 px-3">
              <p className="text-xs font-black">{regime.label}</p>
              <span className="font-mono text-[11px] font-black" style={{ color: regime.tone }}>{regime.tag}</span>
            </div>
            <div className="mt-3 flex justify-center px-3">
              <MatrixShape rows={regime.rows} columns={regime.columns} />
            </div>
            <div className="mt-3 border-t border-border px-3 pt-3">
              <p className="font-mono text-xs font-black" style={{ color: regime.tone }}>{regime.status}</p>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{regime.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex min-w-0 items-start gap-3 border-y border-border bg-background px-3 py-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
        <p className="text-xs font-semibold leading-5">
          Singular direction은 “inverse library가 실패했다”가 아니라 mechanism이 그 hand motion을 즉시 만들 수 없다는 rank evidence다.
        </p>
      </div>
    </Diagram>
  );
}

const whitneyScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Command frame',
    title: 'Operator command를 개별 joint switch가 아니라 hand에 붙은 여섯 motion axis로 정의한다',
    body: 'Sweep·reach·lift와 tilt·twist·turn은 사람이 작업을 보는 좌표다. Resolved control의 첫 계약은 이 여섯 component가 어느 frame과 axis order에 있는지 고정하는 것이다.',
    icon: Axis3D,
    layout: 'flow',
    items: [],
    visual: <WhitneyCommandFrameVisual />,
    formula: raw`\underbrace{{}^{H}\!S}_{\text{hand-frame command}}=\begin{bmatrix}\underbrace{\begin{matrix}{}^{H}\!v_x&{}^{H}\!v_y&{}^{H}\!v_z\end{matrix}}_{\text{평행이동 rate}}&\underbrace{\begin{matrix}{}^{H}\!\omega_x&{}^{H}\!\omega_y&{}^{H}\!\omega_z\end{matrix}}_{\text{회전 rate}}\end{bmatrix}^{\!\top}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{{}^{H}\!S}_{\text{hand frame 명령}}
=\begin{bmatrix}{}^{H}\!v\\{}^{H}\!\omega\end{bmatrix}\\[4pt]
\underbrace{{}^{H}\!v}_{\text{평행이동 rate}}
=\begin{bmatrix}v_x&v_y&v_z\end{bmatrix}^{\!\top}\\[3pt]
\underbrace{{}^{H}\!\omega}_{\text{회전 rate}}
=\begin{bmatrix}\omega_x&\omega_y&\omega_z\end{bmatrix}^{\!\top}
\end{gathered}`,
    formulaNote: 'S는 joint rate가 아니라 hand의 translational·rotational rate다. 같은 숫자라도 shoulder frame과 hand frame에서 다른 physical command가 된다.',
    formulaSymbols: [['{}^{H}\\!S', 'Hand-fixed coordinates로 표현한 six-dimensional task rate'], ['{}^{H}\\!v', 'Sweep·reach·lift에 해당하는 linear velocity components'], ['{}^{H}\\!\\omega', 'Tilt·twist·turn에 해당하는 angular velocity components']],
    callout: 'Frame과 unit metadata가 없는 S는 실행 가능한 command가 아니다. Runtime trace에는 selected command frame과 linear/angular scaling을 남긴다.',
    owner: 'Operator command interface',
    output: 'frame-stamped hand rate S',
    invariant: 'task axes never silently become joint axes',
  },
  {
    eyebrow: '02 · Unit-joint columns',
    title: '각 joint를 unit rate로 하나씩 움직여 hand twist contribution을 Jacobian column으로 쌓는다',
    body: 'Revolute joint는 axis 주위 회전과 axis-to-hand lever arm의 translation을 함께 만들고, prismatic joint는 axis 방향 translation만 만든다. 모든 column은 current pose에서 다시 정해진다.',
    icon: Spline,
    layout: 'bars',
    items: [],
    visual: <WhitneyJacobianColumnsVisual />,
    formula: raw`\underbrace{{}^{H}\!J_j}_{\text{joint }j\text{의 unit-rate column}}=\begin{cases}\begin{bmatrix}\underbrace{{}^{H}\!(u_j\times b_{j7})}_{\text{lever-arm translation}}\\[2pt]\underbrace{{}^{H}\!u_j}_{\text{axis rotation}}\end{bmatrix},&\text{revolute}\\[12pt]\begin{bmatrix}\underbrace{{}^{H}\!u_j}_{\text{axis translation}}\\[2pt]\underbrace{0}_{\text{rotation 없음}}\end{bmatrix},&\text{prismatic}\end{cases}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{{}^{H}\!J_j}_{\text{joint }j\text{의 한 열}}\\[2pt]
=\begin{cases}
\begin{bmatrix}{}^{H}(u_j\times b_{j7})\\{}^{H}u_j\end{bmatrix},
&\underbrace{\text{회전 관절}}_{\text{lever arm·축 회전}}\\[9pt]
\begin{bmatrix}{}^{H}u_j\\0\end{bmatrix},
&\underbrace{\text{직선 관절}}_{\text{축 이동·회전 없음}}
\end{cases}
\end{gathered}`,
    formulaNote: 'u_j는 joint axis direction이고 b_j7은 joint axis에서 hand까지의 lever arm이다. 둘을 반드시 S와 같은 hand frame으로 rotate한 뒤 column을 쌓는다.',
    formulaSymbols: [['{}^{H}\\!J_j', 'Joint j의 unit rate가 hand frame에 만드는 twist'], ['u_j\\times b_{j7}', 'Revolute axis의 lever arm이 만드는 translational velocity'], ['u_j', 'Joint axis direction'], ['b_{j7}', 'Joint j에서 hand frame까지의 position vector']],
    callout: 'Finite difference로 전체 J만 맞추는 검사에 더해 joint 하나씩 unit rate를 넣어 column owner를 검산한다. Axis sign이나 frame rotation 오류가 column 단위에서 드러난다.',
    owner: 'Current-configuration kinematics',
    output: 'ordered Jacobian columns',
    invariant: 'every column is expressed in the command frame',
  },
  {
    eyebrow: '03 · Resolve then drive',
    title: 'Hand rate를 joint rate로 resolve한 뒤 별도 linkage map으로 motor shaft rate에 넘긴다',
    body: 'Square nonsingular case에서는 J inverse가 simultaneous joint rates를 낸다. Physical transmission이 one-to-one이 아니면 M₂가 gear ratio와 coupled linkage를 적용해 actuator command를 만든다.',
    icon: Workflow,
    layout: 'flow',
    items: [],
    visual: <WhitneyResolveMotorVisual />,
    formula: raw`\underbrace{\dot\theta}_{\text{joint-rate command}}=\underbrace{J(\theta)^{-1}}_{\text{kinematic resolve}}\underbrace{S}_{\text{hand request}},\qquad\underbrace{\dot\phi}_{\text{motor shaft rate}}=\underbrace{M_2}_{\text{gear·linkage map}}\dot\theta`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\dot\theta}_{\text{관절 속도 명령}}
=\underbrace{J(\theta)^{-1}}_{\text{운동학 역변환}}
\underbrace{S}_{\text{손끝 요청}}\\[5pt]
\underbrace{\dot\phi}_{\text{모터 축 속도}}
=\underbrace{M_2}_{\text{gear·linkage 변환}}\dot\theta
\end{gathered}`,
    formulaNote: 'J inverse와 M₂는 서로 다른 physical boundary를 모델링한다. Joint servo가 받는 θ̇와 motor shaft가 실제로 적용한 φ̇를 따로 log해야 saturation과 linkage error를 구분할 수 있다.',
    formulaSymbols: [['J(\\theta)^{-1}', 'Current pose에서 hand rate를 joint rate로 되돌리는 exact local inverse'], ['M_2', 'Joint motion을 motor shaft motion으로 바꾸는 gear·linkage matrix'], ['\\dot\\theta', 'Mechanism joint-rate command'], ['\\dot\\phi', 'Physical motor shaft-rate command']],
    callout: 'Kinematic command가 feasible해도 motor limit은 별도다. M₂ 이후 saturation을 다시 J 앞으로 숨겨 넣으면 requested task rate와 applied motion의 차이를 감사할 수 없다.',
    owner: 'Resolver + transmission interface',
    output: 'θ̇ command · φ̇ applied request',
    invariant: 'kinematics and motor linkage stay separately observable',
  },
  {
    eyebrow: '04 · Pose correction loop',
    title: 'Current와 target hand pose의 차이를 rate로 바꾸고 이동 중 주기적으로 다시 resolve한다',
    body: 'Desired final joint angles를 직접 푸는 대신 translational error와 axis-angle orientation error를 remaining time으로 나눠 S를 만든다. Integration 뒤 current pose를 읽고 error를 재계산한다.',
    icon: RefreshCw,
    layout: 'timeline',
    items: [],
    visual: <WhitneyPoseLoopVisual />,
    formula: raw`\underbrace{S_k}_{\text{이번 correction command}}=\frac{1}{T_k}\begin{bmatrix}\underbrace{p^\star-p_k}_{\text{position error}}\\[2pt]\underbrace{\alpha_k\widehat u_k}_{\text{axis-angle orientation error}}\end{bmatrix},\qquad\underbrace{\theta_{k+1}}_{\text{다음 configuration}}=\theta_k+\Delta t\,J(\theta_k)^{-1}S_k`,
    formulaCompact: raw`\begin{gathered}
\underbrace{S_k}_{\text{이번 보정 명령}}
=\dfrac{1}{T_k}
\begin{bmatrix}
\underbrace{p^\star-p_k}_{\text{위치 오차}}\\[2pt]
\underbrace{\alpha_k\widehat u_k}_{\text{자세 오차}}
\end{bmatrix}\\[7pt]
\underbrace{\theta_{k+1}}_{\text{다음 관절 자세}}
=\theta_k+\Delta t\,J(\theta_k)^{-1}S_k
\end{gathered}`,
    formulaNote: 'Local linearization을 한 번 적용한 뒤 끝나는 식이 아니다. Δt마다 current pose와 Jacobian을 다시 계산해야 large-motion integration error를 correction할 수 있다.',
    formulaSymbols: [['p^\\star-p_k', 'Target과 current hand position의 translational error'], ['\\alpha_k\\widehat u_k', 'Current-to-target relative orientation의 axis-angle error'], ['T_k', 'Error를 rate로 바꾸는 remaining-time scale'], ['\\Delta t', 'Joint-rate command를 integration하는 control interval']],
    callout: '이 loop는 general convergence, collision-free path, joint limit 또는 rate saturation을 보장하지 않는다. Pose tolerance와 함께 applied-rate residual과 workspace validity를 검사한다.',
    owner: 'Pose-error controller',
    output: 'receding hand-rate sequence',
    invariant: 'pose error is recomputed from measured state',
  },
  {
    eyebrow: '05 · Solver and history boundary',
    title: 'Exact·reduced·redundant case는 1972 안에 있지만 damped least squares는 later remedy다',
    body: 'Square full-rank J는 exact inverse를 허용한다. Lost directions은 task/joint reduction으로 드러내고 extra joints는 weighted instantaneous cost로 결정한다. Near-singular damping은 이후 연구 경계에 둔다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [],
    visual: <WhitneySolverBoundaryVisual />,
    formula: raw`\underbrace{\dot\theta=A^{-1}J^\top(JA^{-1}J^\top)^{-1}S}_{\text{1972 weighted redundant solution}}\qquad\underbrace{\dot\theta_{\lambda}=J^\top(JJ^\top+\lambda^2I)^{-1}S}_{\text{later damped least squares}}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\dot\theta
=A^{-1}J^\top(JA^{-1}J^\top)^{-1}S}_{\text{1972: 가중 중복 해}}\\[7pt]
\underbrace{\dot\theta_{\lambda}
=J^\top(JJ^\top+\lambda^2I)^{-1}S}_{\text{후대: 감쇠 최소제곱}}
\end{gathered}`,
    formulaNote: '왼쪽은 retained task equality를 만족하면서 weighted joint-rate cost를 최소화한다. 오른쪽은 singular direction gain을 damping하는 later formulation이며 Whitney paper의 실험·유도 evidence가 아니다.',
    formulaSymbols: [['A', 'Redundant joints 사이의 instantaneous motion preference를 정하는 positive-definite weight'], ['JA^{-1}J^\\top', 'Retained task directions의 weighted rank를 담는 matrix'], ['\\lambda', 'Later DLS가 near-singular gain을 줄이는 damping coefficient'], ['I', 'Damping을 task-space directions에 더하는 identity matrix']],
    callout: 'Modern reproduction은 exact inverse, weighted generalized inverse와 DLS를 모두 비교할 수 있다. 다만 결과 표에서는 original method와 later robustness baseline의 provenance를 분리한다.',
    owner: 'Solver policy + evidence historian',
    output: 'rank-aware method selection',
    invariant: 'later damping is not attributed to 1972',
  },
];

export function WhitneyCoordinatedControlMechanismViz() {
  return (
    <div data-robot-kinematics-retiming-paper-viz="whitney">
      <PaperSceneViz
        scenes={whitneyScenes}
        ariaLabel="Whitney coordinated control · hand command frame에서 unit-joint Jacobian columns, motor linkage, pose correction과 solver history boundary까지"
      />
    </div>
  );
}

function ShinReductionVisual() {
  return (
    <Diagram
      label="A fixed multi-joint geometric path reduces through the chain rule to a two-dimensional path-position and path-speed problem"
      footer="Dimension reduction keeps the full path geometry inside qₛ·qₛₛ and the coupled dynamics inside M·Q·R·S. It does not optimize a new collision-free path."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)] lg:items-center">
        <div className="min-w-0 border-y border-border bg-background p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[11px] font-black text-muted-foreground">FIXED JOINT PATH q(s)</p>
            <span className="font-mono text-[11px] font-black text-violet-700 dark:text-violet-300">0 ≤ s ≤ 1</span>
          </div>
          <svg viewBox="0 0 300 220" className="mt-2 block h-auto w-full" role="img" aria-label="Three joint configurations sampled along one fixed geometric path">
            <path d="M31 180 C78 72 174 48 274 126" fill="none" stroke={palette.cyan} strokeWidth="5" strokeLinecap="round" />
            <path d="M31 180 L84 133 L133 155" fill="none" stroke="currentColor" strokeOpacity="0.42" strokeWidth="8" strokeLinecap="round" />
            <path d="M111 86 L167 60 L221 91" fill="none" stroke="currentColor" strokeOpacity="0.58" strokeWidth="8" strokeLinecap="round" />
            <path d="M199 78 L250 91 L274 126" fill="none" stroke="currentColor" strokeOpacity="0.74" strokeWidth="8" strokeLinecap="round" />
            {[[31,180],[84,133],[111,86],[167,60],[199,78],[250,91]].map(([cx, cy], index) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="var(--background)" stroke={index < 2 ? palette.muted : index < 4 ? palette.violet : palette.green} strokeWidth="4" />
            ))}
            <circle cx="31" cy="180" r="7" fill={palette.cyan} />
            <circle cx="274" cy="126" r="7" fill={palette.green} />
            <text x="18" y="211" fontSize="14" fontWeight="900" fill={palette.cyan}>s=0</text>
            <text x="249" y="155" fontSize="14" fontWeight="900" fill={palette.green}>s=1</text>
          </svg>
        </div>
        <div className="min-w-0">
          <FlowStrip
            steps={[
              { label: 'geometry', value: 'q(s), qₛ, qₛₛ', detail: 'path shape and derivatives', tone: 'cyan' },
              { label: 'one clock', value: 'ṡ and s̈', detail: 'all joints share path progress', tone: 'violet' },
              { label: 'path dynamics', value: 'τ = M s̈ + h', detail: 'coupled torque becomes affine in s̈', tone: 'gold' },
              { label: 'phase state', value: '(s, ṡ)', detail: 'two-dimensional feasible region', tone: 'green' },
            ]}
          />
          <div className="mt-5 grid border-y border-border bg-background sm:grid-cols-4 sm:divide-x sm:divide-border">
            {[
              ['M(s)', 'tangent inertia'],
              ['Q(s)ṡ²', 'curvature·Coriolis'],
              ['R(s)ṡ', 'viscous friction'],
              ['S(s)', 'gravity·load'],
            ].map(([value, label]) => (
              <div className="border-b border-border p-3 last:border-b-0 sm:border-b-0" key={value}>
                <p className="font-mono text-sm font-black">{value}</p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Diagram>
  );
}

function TorqueSignRow({
  sign,
  bounds,
  detail,
  tone,
  zero = false,
}: {
  sign: string;
  bounds: string;
  detail: string;
  tone: keyof typeof palette;
  zero?: boolean;
}) {
  return (
    <div className="grid min-w-0 gap-3 border-b border-border px-3 py-4 last:border-b-0 sm:grid-cols-[5.5rem_minmax(0,1fr)_minmax(10rem,0.8fr)] sm:items-center">
      <div className="flex items-center gap-2">
        {zero ? <XCircle className="h-4 w-4" style={{ color: palette[tone] }} aria-hidden="true" /> : <CircleDot className="h-4 w-4" style={{ color: palette[tone] }} aria-hidden="true" />}
        <span className="font-mono text-sm font-black">{sign}</span>
      </div>
      {zero ? (
        <div className="flex h-12 items-center justify-center border-y border-dashed border-border font-mono text-xs font-black">
          divide 금지 · hᵢ만 검사
        </div>
      ) : (
        <div className="relative h-12">
          <div className="absolute inset-x-1 top-6 h-0.5 bg-muted-foreground/40" />
          <div className="absolute left-[18%] right-[18%] top-[1.15rem] h-3 border-x-2" style={{ borderColor: palette[tone], backgroundColor: `${palette[tone]}25` }} />
          <span className="absolute left-[18%] top-0 -translate-x-1/2 font-mono text-[11px] font-black">Lᵢ</span>
          <span className="absolute right-[18%] top-0 translate-x-1/2 font-mono text-[11px] font-black">Uᵢ</span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[11px] font-bold text-muted-foreground">allowed s̈ interval</span>
        </div>
      )}
      <div>
        <p className="break-words font-mono text-xs font-black leading-5 [overflow-wrap:anywhere]" style={{ color: palette[tone] }}>{bounds}</p>
        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function ShinTorqueSignVisual() {
  return (
    <Diagram
      label="Torque bounds become path-acceleration intervals differently for positive, negative and zero inertia coefficient"
      footer="Joint별 interval을 모두 만든 뒤 L=max Lᵢ, U=min Uᵢ로 교차한다. Mᵢ≈0을 임의 epsilon으로 나누면 inequality direction과 pure speed infeasibility를 숨긴다."
    >
      <div className="min-w-0 border-y border-border bg-background">
        <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] border-b border-border px-3 py-2 font-mono text-[11px] font-black uppercase text-muted-foreground sm:grid-cols-[5.5rem_minmax(0,1fr)_minmax(10rem,0.8fr)]">
          <span>coefficient</span>
          <span>acceleration consequence</span>
          <span className="hidden sm:block">inequality owner</span>
        </div>
        <TorqueSignRow sign="Mᵢ > 0" bounds="lower torque → Lᵢ · upper torque → Uᵢ" detail="나누어도 inequality 방향이 유지된다." tone="green" />
        <TorqueSignRow sign="Mᵢ < 0" bounds="upper torque → Lᵢ · lower torque → Uᵢ" detail="음수로 나누므로 torque-bound owner가 뒤집힌다." tone="gold" />
        <TorqueSignRow sign="Mᵢ = 0" bounds="τmin ≤ hᵢ(s,ṡ) ≤ τmax" detail="현재 speed가 feasible한지만 판정하고 s̈ bound는 만들지 않는다." tone="red" zero />
      </div>
    </Diagram>
  );
}

function ShinIslandsVisual() {
  return (
    <Diagram
      label="The admissible phase-plane region can contain disconnected velocity intervals and internal islands of inadmissibility"
      footer="한 s slice에서 allowed speed가 여러 interval로 갈라질 수 있다. 최고 ceiling 하나만 저장하면 hole을 통과하는 불가능한 trajectory를 feasible로 오인한다."
    >
      <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(14rem,0.6fr)] md:items-center">
        <svg viewBox="0 0 520 310" className="block h-auto w-full" role="img" aria-label="Path position and speed phase plane with two inadmissible islands">
          <defs>
            <pattern id="shin-island-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke={palette.red} strokeWidth="3" opacity="0.55" />
            </pattern>
            <marker id="shin-phase-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill={palette.green} />
            </marker>
          </defs>
          <line x1="54" y1="270" x2="493" y2="270" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
          <line x1="54" y1="270" x2="54" y2="24" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
          <path d="M55 244 C110 132 173 67 239 72 C316 78 372 45 492 94 L492 270 L55 270 Z" fill={palette.cyan} fillOpacity="0.09" stroke={palette.cyan} strokeWidth="4" />
          <ellipse cx="226" cy="151" rx="54" ry="31" fill="url(#shin-island-hatch)" stroke={palette.red} strokeWidth="3" />
          <ellipse cx="359" cy="114" rx="43" ry="24" fill="url(#shin-island-hatch)" stroke={palette.red} strokeWidth="3" />
          <path d="M58 249 C135 168 170 113 217 111 C259 109 271 188 313 181 C357 174 383 75 486 102" fill="none" stroke={palette.green} strokeWidth="5" strokeLinecap="round" markerEnd="url(#shin-phase-arrow)" />
          <path d="M244 112 C264 105 283 110 298 129" fill="none" stroke={palette.gold} strokeWidth="3" strokeDasharray="6 5" />
          <text x="205" y="156" textAnchor="middle" fontSize="14" fontWeight="900" fill={palette.red}>hole A</text>
          <text x="359" y="119" textAnchor="middle" fontSize="14" fontWeight="900" fill={palette.red}>hole B</text>
          <text x="81" y="78" fontSize="14" fontWeight="900" fill={palette.cyan}>outer admissible boundary</text>
          <text x="405" y="143" fontSize="14" fontWeight="900" fill={palette.green}>feasible path</text>
          <text x="484" y="295" fontSize="16" fontWeight="900" fill="currentColor">s</text>
          <text x="20" y="36" fontSize="16" fontWeight="900" fill="currentColor">ṡ</text>
        </svg>
        <div className="min-w-0 border-y border-border bg-background p-3">
          <p className="font-mono text-[11px] font-black uppercase text-muted-foreground">vertical slice at s = sₐ</p>
          <div className="mt-4 grid grid-cols-[3rem_minmax(0,1fr)] gap-3">
            <div className="relative h-52">
              <div className="absolute bottom-0 left-1/2 top-0 w-0.5 -translate-x-1/2 bg-muted-foreground/40" />
              <span className="absolute left-0 top-0 font-mono text-[11px] font-black">high ṡ</span>
              <span className="absolute bottom-0 left-0 font-mono text-[11px] font-black">0</span>
            </div>
            <div className="relative h-52">
              <div className="absolute inset-x-0 bottom-[5%] h-[32%] border border-emerald-600/60 bg-emerald-500/15" />
              <div className="absolute inset-x-0 bottom-[37%] h-[24%] border border-dashed border-red-600/70 bg-red-500/10" />
              <div className="absolute inset-x-0 bottom-[61%] h-[22%] border border-emerald-600/60 bg-emerald-500/15" />
              <div className="absolute inset-x-0 bottom-[83%] h-[17%] border border-dashed border-red-600/70 bg-red-500/10" />
              <span className="absolute left-2 top-[22%] text-[11px] font-black text-emerald-700 dark:text-emerald-300">allowed interval 2</span>
              <span className="absolute left-2 top-[48%] text-[11px] font-black text-red-700 dark:text-red-300">hole</span>
              <span className="absolute bottom-[16%] left-2 text-[11px] font-black text-emerald-700 dark:text-emerald-300">allowed interval 1</span>
            </div>
          </div>
        </div>
      </div>
    </Diagram>
  );
}

function ShinAlgorithmBoundaryVisual() {
  return (
    <Diagram
      label="ACOTNI handles the no-island boundary with alternating acceleration and deceleration, while general ACOT constructs and searches a directed graph around multiple boundaries"
      footer="ACOTNI의 single-boundary zero search를 islands가 있는 general case에 그대로 반복하지 않는다. ACOT는 boundary와 island edge의 candidate curves·intersections를 먼저 만들고 highest feasible graph path를 backtracking으로 찾는다."
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:divide-x lg:divide-border">
        <div className="min-w-0 lg:pr-5">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs font-black text-muted-foreground">ACOTNI · NO ISLANDS</p>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">alternating bounds</span>
          </div>
          <svg viewBox="0 0 380 250" className="mt-3 block h-auto w-full" role="img" aria-label="ACOTNI phase trajectory with three switches under one admissible boundary">
            <path d="M35 217 C99 90 183 39 346 77" fill="none" stroke={palette.cyan} strokeWidth="4" />
            <path d="M36 218 C83 147 112 112 151 110 C193 108 201 155 235 153 C276 151 297 85 344 83" fill="none" stroke={palette.green} strokeWidth="5" />
            <path d="M36 218 C83 147 112 112 151 110" fill="none" stroke={palette.gold} strokeWidth="8" strokeOpacity="0.35" />
            <path d="M151 110 C193 108 201 155 235 153" fill="none" stroke={palette.violet} strokeWidth="8" strokeOpacity="0.35" />
            <path d="M235 153 C276 151 297 85 344 83" fill="none" stroke={palette.gold} strokeWidth="8" strokeOpacity="0.35" />
            {[[151,110,'A'],[235,153,'B'],[296,103,'C']].map(([cx, cy, label]) => (
              <g key={label}>
                <circle cx={cx} cy={cy} r="7" fill="var(--background)" stroke={palette.red} strokeWidth="4" />
                <text x={Number(cx) + 10} y={Number(cy) - 10} fontSize="14" fontWeight="900" fill={palette.red}>{label}</text>
              </g>
            ))}
            <text x="67" y="184" fontSize="13" fontWeight="900" fill={palette.gold}>최대 가속</text>
            <text x="170" y="135" fontSize="13" fontWeight="900" fill={palette.violet}>최대 감속</text>
            <text x="264" y="139" fontSize="13" fontWeight="900" fill={palette.gold}>최대 가속</text>
            <text x="284" y="60" textAnchor="middle" fontSize="13" fontWeight="900" fill={palette.cyan}>하나의 바깥 경계</text>
          </svg>
        </div>
        <div className="min-w-0 lg:pl-5">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs font-black text-muted-foreground">ACOT · GENERAL ISLAND CASE</p>
            <span className="text-xs font-black text-violet-700 dark:text-violet-300">directed graph + backtrack</span>
          </div>
          <svg viewBox="0 0 380 250" className="mt-3 block h-auto w-full" role="img" aria-label="General ACOT candidate trajectory graph routed around inadmissible islands">
            <ellipse cx="184" cy="105" rx="45" ry="25" fill={palette.red} fillOpacity="0.12" stroke={palette.red} strokeWidth="3" strokeDasharray="6 4" />
            <ellipse cx="275" cy="143" rx="38" ry="23" fill={palette.red} fillOpacity="0.12" stroke={palette.red} strokeWidth="3" strokeDasharray="6 4" />
            {[
              [36,207,'start'],[105,151,'n1'],[151,72,'n2'],[222,60,'n3'],[226,178,'n4'],[316,92,'n5'],[350,50,'goal'],
            ].map(([cx, cy, label]) => (
              <g key={label}>
                <circle cx={cx} cy={cy} r="8" fill="var(--background)" stroke={label === 'start' || label === 'goal' ? palette.green : palette.violet} strokeWidth="4" />
                <text x={Number(cx)} y={Number(cy) - 13} textAnchor="middle" fontSize="11" fontWeight="900" fill="currentColor">{label}</text>
              </g>
            ))}
            {[
              'M36 207 L105 151','M105 151 L151 72','M105 151 L226 178','M151 72 L222 60','M222 60 L316 92','M226 178 L316 92','M316 92 L350 50',
            ].map((d, index) => (
              <path key={d} d={d} fill="none" stroke={index === 2 || index === 5 ? palette.muted : palette.green} strokeWidth={index === 2 || index === 5 ? 2 : 4} strokeDasharray={index === 2 || index === 5 ? '5 5' : undefined} />
            ))}
            <path d="M226 178 L275 184" stroke={palette.red} strokeWidth="3" strokeDasharray="5 4" />
            <text x="182" y="109" textAnchor="middle" fontSize="12" fontWeight="900" fill={palette.red}>불가 영역</text>
            <text x="274" y="147" textAnchor="middle" fontSize="12" fontWeight="900" fill={palette.red}>막힌 경로</text>
            <text x="190" y="232" textAnchor="middle" fontSize="13" fontWeight="900" fill={palette.green}>가능한 높은 경로부터 탐색</text>
          </svg>
        </div>
      </div>
    </Diagram>
  );
}

function ShinEvidenceBoundaryVisual() {
  const rows = [
    { icon: CheckCircle2, label: '수학적 reduction', paper: 'fixed q(s), known dynamics', deployment: 'path·model version lock', tone: palette.green },
    { icon: CheckCircle2, label: 'nominal optimum', paper: 'torque bounds 안의 minimum time', deployment: 'margin을 둔 reference', tone: palette.green },
    { icon: XCircle, label: '추종 오차', paper: 'trajectory planner 밖', deployment: 'feedback + tracking residual', tone: palette.red },
    { icon: XCircle, label: 'actuator reality', paper: 'delay·bandwidth·thermal 미입증', deployment: 'saturation dwell + telemetry', tone: palette.red },
  ];
  return (
    <Diagram
      label="The paper's nominal minimum-time evidence boundary is separated from feedback tracking and deployment validation"
      footer="원문도 admissible boundary를 겨우 스치는 이론 trajectory가 minute error에 위험하다고 경고한다. Release artifact는 nominal optimum과 robustness margin을 같은 숫자로 합치지 않는다."
    >
      <div className="min-w-0 border-y border-border bg-background">
        <div className="grid grid-cols-[minmax(7rem,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-border px-3 py-2 font-mono text-[11px] font-black uppercase text-muted-foreground">
          <span>claim layer</span><span>paper evidence</span><span>deployment handoff</span>
        </div>
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div className="grid min-w-0 grid-cols-[minmax(7rem,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-border last:border-b-0" key={row.label}>
              <div className="flex min-w-0 items-start gap-2 p-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: row.tone }} aria-hidden="true" />
                <p className="text-xs font-black leading-5">{row.label}</p>
              </div>
              <p className="min-w-0 border-l border-border p-3 text-xs leading-5 text-muted-foreground">{row.paper}</p>
              <p className="min-w-0 border-l border-border p-3 text-xs font-semibold leading-5">{row.deployment}</p>
            </div>
          );
        })}
      </div>
      <FlowStrip
        steps={[
          { label: 'planner output', value: 'nominal s(t)', detail: 'model and bound version attached', tone: 'cyan' },
          { label: 'safety margin', value: 'stay inside boundary', detail: 'uncertainty reserve is explicit', tone: 'gold' },
          { label: 'feedback tracking', value: 'q·q̇ residual', detail: 'actual state corrects reference', tone: 'violet' },
          { label: 'release evidence', value: 'torque·delay·thermal', detail: 'hardware telemetry closes the loop', tone: 'green' },
        ]}
      />
    </Diagram>
  );
}

const shinMcKayScenes: PaperMechanismScene[] = [
  {
    eyebrow: '01 · Chain-rule 2D reduction',
    title: 'Fixed n-joint path의 geometry는 보존하고 timing state만 path position·speed 두 값으로 줄인다',
    body: 'q=q(s)를 미분하면 모든 joint velocity와 acceleration이 scalar progress rate·acceleration에 묶인다. 이를 coupled dynamics에 넣으면 각 actuator torque가 path acceleration에 affine한 식이 된다.',
    icon: Spline,
    layout: 'flow',
    items: [],
    visual: <ShinReductionVisual />,
    formula: raw`\underbrace{\dot q=q_s\dot s}_{\text{path tangent가 만든 joint speed}},\qquad\underbrace{\ddot q=q_s\ddot s+q_{ss}\dot s^2}_{\text{tangent·curvature joint acceleration}}\Longrightarrow\underbrace{\tau=M(s)\ddot s+Q(s)\dot s^2+R(s)\dot s+S(s)}_{\text{fixed-path scalar dynamics}}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\dot q=q_s\dot s}_{\text{접선이 만든 관절 속도}}\\[3pt]
\underbrace{\ddot q=q_s\ddot s+q_{ss}\dot s^2}_{\text{접선·곡률 관절 가속도}}\\[5pt]
\Longrightarrow\underbrace{\tau=M(s)\ddot s+Q(s)\dot s^2}_{\text{가속·속도 제곱}}\\[-1pt]
\phantom{\Longrightarrow\tau={}}+
\underbrace{R(s)\dot s+S(s)}_{\text{점성 마찰·중력}}
\end{gathered}`,
    formulaNote: '이 Viz의 s는 원문의 path parameter λ, ṡ는 원문의 pseudovelocity p와 같은 역할이다. 원문의 component dynamics에는 viscous friction R(s)ṡ가 남으며 R=0을 명시한 뒤에만 three-term 교육식으로 축약한다.',
    formulaSymbols: [['q_s', 'Path tangent dq/ds'], ['q_{ss}', 'Path curvature d²q/ds²'], ['M(s)', 'Path tangent 방향의 inertia coefficient'], ['Q(s),R(s),S(s)', 'Velocity-square, viscous-friction, gravity/load contributions']],
    callout: '이 reduction은 q(s)의 collision clearance나 geometric optimality를 다시 판단하지 않는다. Path planner가 낸 geometry version을 고정한 채 time law만 최적화한다.',
    owner: 'Path parameterizer + dynamics model',
    output: '2D state (s,ṡ) · scalar acceleration control',
    invariant: 'path geometry stays fixed during retiming',
  },
  {
    eyebrow: '02 · Signed torque interval',
    title: 'Mᵢ의 부호에 따라 torque bound가 acceleration interval의 어느 끝을 소유하는지 바뀐다',
    body: '현재 s·ṡ에서 inertia 이외의 torque hᵢ를 먼저 계산한다. Mᵢ가 양수면 inequality가 유지되고 음수면 뒤집히며, 0이면 나누지 않고 현재 speed 자체의 torque feasibility를 검사한다.',
    icon: Scale,
    layout: 'bars',
    items: [],
    visual: <ShinTorqueSignVisual />,
    formula: raw`\underbrace{\tau_i^{\min}\le M_i\ddot s+h_i\le\tau_i^{\max}}_{\text{joint }i\text{의 torque strip}}\Rightarrow\begin{cases}\underbrace{\frac{\tau_i^{\min}-h_i}{M_i}\le\ddot s\le\frac{\tau_i^{\max}-h_i}{M_i}}_{M_i>0:\ \text{방향 유지}}\\[9pt]\underbrace{\frac{\tau_i^{\max}-h_i}{M_i}\le\ddot s\le\frac{\tau_i^{\min}-h_i}{M_i}}_{M_i<0:\ \text{방향 반전}}\\[9pt]\underbrace{\tau_i^{\min}\le h_i\le\tau_i^{\max}}_{M_i=0:\ \text{speed feasibility만 검사}}\end{cases}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\tau_i^{\min}\le M_i\ddot s+h_i\le\tau_i^{\max}}_{\text{관절 }i\text{의 torque 범위}}\\[6pt]
M_i>0:\quad
\underbrace{\dfrac{\tau_i^{\min}-h_i}{M_i}\le\ddot s\le
\dfrac{\tau_i^{\max}-h_i}{M_i}}_{\text{부등호 방향 유지}}\\[7pt]
M_i<0:\quad
\underbrace{\dfrac{\tau_i^{\max}-h_i}{M_i}\le\ddot s\le
\dfrac{\tau_i^{\min}-h_i}{M_i}}_{\text{부등호 방향 반전}}\\[7pt]
M_i=0:\quad
\underbrace{\tau_i^{\min}\le h_i\le\tau_i^{\max}}_{\text{속도 가능성만 검사}}
\end{gathered}`,
    formulaNote: 'hᵢ=Qᵢṡ²+Rᵢṡ+Sᵢ다. Joint별 lower·upper acceleration bounds를 만든 뒤 intersection L=maxᵢLᵢ, U=minᵢUᵢ만 solver가 사용할 수 있다.',
    formulaSymbols: [['M_i', 'Path acceleration s̈가 joint i torque에 미치는 signed coefficient'], ['h_i', '현재 path speed와 position이 이미 사용하는 non-acceleration torque'], ['L_i,U_i', 'Joint i가 허용하는 path-acceleration interval endpoints'], ['L,U', '모든 joint interval의 intersection']],
    callout: 'Mᵢ≈0 case는 numerical nuisance가 아니라 branch condition이다. Separate tolerance와 speed-feasibility diagnostic 없이 division하면 false feasible cell이 생긴다.',
    owner: 'Torque-to-acceleration constraint adapter',
    output: 'joint intervals · global [L,U]',
    invariant: 'inequality direction follows the sign of Mᵢ',
  },
  {
    eyebrow: '03 · Disconnected admissible islands',
    title: '한 path position의 admissible speed가 여러 interval로 갈라져 phase plane 안에 hole이 생길 수 있다',
    body: 'Velocity-dependent torque bounds와 friction이 있으면 admissible set이 simply connected하다는 보장이 없다. Outer maximum-velocity curve 아래에도 지나갈 수 없는 islands가 남는다.',
    icon: Gauge,
    layout: 'boundary',
    items: [],
    visual: <ShinIslandsVisual />,
    formula: raw`\underbrace{\mathcal A(s)}_{\text{position }s\text{에서 허용되는 speed set}}=\underbrace{\{\dot s\ge0:L(s,\dot s)\le U(s,\dot s)\}}_{\text{모든 torque interval이 겹치는 점}}\;=\;\underbrace{\bigcup_{k=1}^{K(s)}[\ell_k(s),u_k(s)]}_{\text{여러 disconnected interval 가능}}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\mathcal A(s)}_{\text{위치 }s\text{의 허용 속도 집합}}\\[2pt]
=\underbrace{\{\dot s\ge0:L(s,\dot s)\le U(s,\dot s)\}}_{\text{모든 torque 구간이 겹침}}\\[4pt]
=\underbrace{\displaystyle\bigcup_{k=1}^{K(s)}[\ell_k(s),u_k(s)]}_{\text{분리된 여러 구간도 가능}}
\end{gathered}`,
    formulaNote: 'K(s)는 항상 1이 아니다. Original analysis는 quadratic velocity dependence가 open interval을 punch out해 inadmissible island를 만들 수 있음을 보인다.',
    formulaSymbols: [['\\mathcal A(s)', '고정 path position에서 torque constraints를 만족하는 speed들의 set'], ['L(s,\\dot s)', '모든 joints 중 가장 큰 lower acceleration bound'], ['U(s,\\dot s)', '모든 joints 중 가장 작은 upper acceleration bound'], ['K(s)', '해당 vertical slice의 disconnected admissible intervals 수']],
    callout: 'Grid implementation은 boolean feasibility mask 또는 interval list를 보존해야 한다. Position별 scalar ceiling 하나로 압축하면 island topology와 valid switch graph를 잃는다.',
    owner: 'Phase-plane feasibility builder',
    output: 'outer boundary · island edges · interval topology',
    invariant: 'holes are retained, not filled by a scalar ceiling',
  },
  {
    eyebrow: '04 · ACOTNI versus general ACOT',
    title: 'No-island zero search는 alternating multi-switch curve를 만들고 general case는 candidate graph를 탐색한다',
    body: 'ACOTNI는 outer boundary에서 accelerate·decelerate arcs를 연결해 A·B·C 같은 여러 switching points를 만들 수 있다. Islands가 생기면 ACOT가 모든 boundary edge와 intersections를 graph로 만들고 backtracking한다.',
    icon: Network,
    layout: 'tree',
    items: [],
    visual: <ShinAlgorithmBoundaryVisual />,
    formula: raw`\underbrace{\gamma^\star}_{\text{minimum-time phase trajectory}}=\underbrace{\arg\max_{\gamma\in\mathcal G_{\mathrm{feasible}}}\dot s_\gamma(s)}_{\text{각 branch에서 가능한 가장 높은 trajectory를 우선}}\qquad\underbrace{\text{dead end}\Rightarrow\text{backtrack}}_{\text{general ACOT graph traversal}}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{\gamma^\star}_{\text{최소시간 phase 경로}}
=\underbrace{\arg\max_{\gamma\in\mathcal G_{\rm feasible}}
\dot s_\gamma(s)}_{\text{가능한 높은 branch 우선}}\\[6pt]
\underbrace{\text{막힌 branch}\Rightarrow\text{이전 교점으로 복귀}}_{\text{일반 ACOT graph 탐색}}
\end{gathered}`,
    formulaNote: 'Maximum acceleration 한 번과 maximum deceleration 한 번만 잇는 두-arc caricature가 아니다. Boundary tangency, multiple switches와 islands가 candidate trajectory graph를 바꾼다.',
    formulaSymbols: [['\\gamma^\\star', 'Start boundary condition에서 goal boundary condition까지 잇는 optimal phase trajectory'], ['\\mathcal G_{\\mathrm{feasible}}', 'Boundary·island edge와 candidate trajectories가 만든 directed graph'], ['\\dot s_\\gamma(s)', 'Candidate branch가 position s에서 갖는 path speed'], ['\\text{backtrack}', '높은 branch가 dead end일 때 이전 switching intersection으로 돌아가는 search']],
    callout: 'ACOTNI와 ACOT의 이름을 단일 forward/backward intersection routine으로 합치지 않는다. General implementation receipt에는 boundary count, graph nodes, chosen switches와 backtrack events가 필요하다.',
    owner: 'Switch-curve constructor + graph search',
    output: 'ordered multi-switch phase trajectory',
    invariant: 'the selected path never crosses outer or island boundaries',
  },
  {
    eyebrow: '05 · Evidence and deployment boundary',
    title: 'Nominal minimum-time theorem은 boundary-touching reference를 주지만 physical tracking margin은 주지 않는다',
    body: '원문은 fixed analytic path, known dynamics와 actuator bounds 아래 algorithm termination·optimality를 다룬다. 실제 robot의 model error, delay, bandwidth와 thermal behavior는 feedback·margin·telemetry로 닫아야 한다.',
    icon: ShieldAlert,
    layout: 'boundary',
    items: [],
    visual: <ShinEvidenceBoundaryVisual />,
    formula: raw`\underbrace{T^\star=\int_0^1\frac{1}{\dot s^\star(s)}\,ds}_{\text{nominal model에서의 minimum traversal time}}\qquad\underbrace{\tau^{\min}\le\tau_{\mathrm{model}}\le\tau^{\max}}_{\text{planned feasibility}}\not\Rightarrow\underbrace{\tau^{\min}\le\tau_{\mathrm{actual}}\le\tau^{\max}}_{\text{uncertainty·delay 아래 actual feasibility}}`,
    formulaCompact: raw`\begin{gathered}
\underbrace{T^\star=\displaystyle\int_0^1
\frac{ds}{\dot s^\star(s)}}_{\text{명목 model의 최소 통과 시간}}\\[7pt]
\underbrace{\tau^{\min}\le\tau_{\rm model}\le\tau^{\max}}_{\text{계획상 가능}}\\[3pt]
\not\Rightarrow
\underbrace{\tau^{\min}\le\tau_{\rm actual}\le\tau^{\max}}_{\text{실제 실행도 가능}}
\end{gathered}`,
    formulaNote: '수학적 optimum과 deployment-safe reference는 다른 artifact다. Physical release에는 explicit torque reserve, tracking residual, saturation dwell, actuator bandwidth와 model-version provenance를 추가한다.',
    formulaSymbols: [['T^\\star', 'Specified path와 nominal constraints 아래의 minimum traversal time'], ['\\dot s^\\star(s)', 'ACOT/ACOTNI가 선택한 path-position별 optimal speed'], ['\\tau_{\\mathrm{model}}', 'Planner dynamics가 예측한 joint torque'], ['\\tau_{\\mathrm{actual}}', 'Feedback execution에서 telemetry로 관측한 joint torque']],
    callout: 'Boundary를 정확히 스치는 nominal profile을 그대로 production setpoint로 배포하지 않는다. Retiming proof, tracking controller와 hardware validation의 evidence owner를 분리한다.',
    owner: 'Evaluation and deployment gate',
    output: 'nominal optimum · margin · tracking telemetry',
    invariant: 'theorem scope never expands to hardware safety',
  },
];

export function ShinMcKayTimeOptimalMechanismViz() {
  return (
    <div data-robot-kinematics-retiming-paper-viz="shin-mckay">
      <PaperSceneViz
        scenes={shinMcKayScenes}
        ariaLabel="Shin-McKay minimum-time retiming · chain-rule reduction에서 signed torque intervals, disconnected islands, ACOT graph search와 deployment boundary까지"
      />
    </div>
  );
}
