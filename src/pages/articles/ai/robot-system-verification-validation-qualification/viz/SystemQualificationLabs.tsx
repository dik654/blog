import { useState, type ReactNode } from "react";
import { ClipboardCheck, Route } from "lucide-react";
import { MetricGrid, SegmentedControl } from "../../nlp-shared";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const fmt = (v: number, d = 0) => (Number.isFinite(v) ? v.toFixed(d) : "n/a");

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
        <span>{label}</span>
        <span className="shrink-0 font-mono text-muted-foreground">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        className="h-2 w-full cursor-pointer accent-blue-600"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function LabShell({
  index,
  title,
  status,
  children,
  metrics,
}: {
  index: string;
  title: string;
  status: string;
  children: ReactNode;
  metrics: Array<{ label: string; value: string; accent?: boolean }>;
}) {
  return (
    <figure className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-16 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pl-6 sm:pr-20">
        <span className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300">
          <ClipboardCheck className="h-4 w-4" /> SYSTEM LAB {index}
        </span>
        <strong className="min-w-0 break-words text-sm leading-snug sm:text-center">
          {title}
        </strong>
        <span className="whitespace-nowrap text-[10px] font-black text-teal-700 dark:text-teal-300 sm:text-right">
          {status}
        </span>
      </figcaption>
      {children}
      <div className="border-t border-border p-4 sm:p-6">
        <MetricGrid mobileColumns={2} items={metrics} />
      </div>
    </figure>
  );
}

function PlotFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="qualification-system-plot relative h-44 min-w-0 overflow-hidden rounded-md border border-border sm:h-72">
      <div className="flex h-9 min-w-0 items-center border-b border-border bg-background/95 px-3">
        <span className="min-w-0 break-words text-[10px] font-black leading-tight text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 top-9 bg-[linear-gradient(to_right,rgba(148,163,184,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.12)_1px,transparent_1px)] bg-[size:16.66%_25%]">
        {children}
      </div>
    </div>
  );
}

function Split({ controls, plot }: { controls: ReactNode; plot: ReactNode }) {
  return (
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,.76fr)_minmax(0,1.24fr)]">
      <div className="space-y-5">{controls}</div>
      {plot}
    </div>
  );
}

type Mission = "indoor" | "dock" | "mixed";
export function MissionEnvelopeLab() {
  const [mission, setMission] = useState<Mission>("mixed");
  const [weather, setWeather] = useState(55);
  const [payload, setPayload] = useState(60);
  const [human, setHuman] = useState(45);
  const demanded =
    4 +
    Math.ceil(weather / 28) +
    Math.ceil(payload / 34) +
    Math.ceil(human / 34) +
    (mission === "mixed" ? 2 : mission === "dock" ? 1 : 0);
  const supported = clamp(
    12 - Math.ceil(weather / 38) - Math.ceil(human / 45),
    3,
    12,
  );
  const gap = Math.max(0, demanded - supported);
  const cells = [
    "마른 바닥",
    "젖은 바닥",
    "경사로",
    "도크 턱",
    "낮은 빛",
    "역광",
    "빈 적재",
    "정격 적재",
    "사람 없음",
    "사람 근접",
    "무선 정상",
    "무선 손실",
  ];
  return (
    <LabShell
      index="01"
      title="좋은 평균이 아니라 실제로 약속한 운용 영역부터 자른다"
      status="MISSION / ODD"
      metrics={[
        { label: "필요 조건 수", value: `${demanded}` },
        { label: "검증한 조건 수", value: `${supported}`, accent: gap === 0 },
        { label: "근거 없는 조건", value: `${gap}` },
        {
          label: "출시 판단",
          value: gap ? "조건부 운용" : "선언 ODD 안에서 검증",
        },
      ]}
    >
      <Split
        controls={
          <>
            <SegmentedControl
              label="임무 유형"
              value={mission}
              onChange={setMission}
              options={[
                { value: "indoor", label: "실내 창고" },
                { value: "dock", label: "야외 도크" },
                { value: "mixed", label: "혼합 운용" },
              ]}
            />
            <Range
              label="날씨 난이도"
              value={weather}
              min={0}
              max={100}
              unit="%"
              onChange={setWeather}
            />
            <Range
              label="적재 요구량"
              value={payload}
              min={0}
              max={100}
              unit="%"
              onChange={setPayload}
            />
            <Range
              label="사람 근접도"
              value={human}
              min={0}
              max={100}
              unit="%"
              onChange={setHuman}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              ODD는 제품 소개 문구가 아니라 floor, light, weather, payload,
              network, human and maintenance state의 조합입니다. 한 칸이 빠지면
              평균 성공률이 그 칸을 대신하지 않습니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="운용 설계 영역 ODD · 조건별 검증 범위">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              {cells.map((name, i) => {
                const x = 48 + (i % 4) * 137,
                  y = 55 + Math.floor(i / 4) * 68;
                const active = i < demanded,
                  covered = i < supported;
                return (
                  <g key={name}>
                    <rect
                      x={x}
                      y={y}
                      width="119"
                      height="48"
                      rx="5"
                      fill={
                        !active
                          ? "var(--muted)"
                          : covered
                            ? "#ccfbf1"
                            : "#fef3c7"
                      }
                      stroke={
                        !active
                          ? "var(--border)"
                          : covered
                            ? "#0d9488"
                            : "#d97706"
                      }
                      strokeWidth={active ? 2 : 1}
                    />
                    <text
                      x={x + 10}
                      y={y + 29}
                      fontSize="17"
                      fontWeight={active ? "750" : "600"}
                      fill={
                        active ? "var(--foreground)" : "var(--muted-foreground)"
                      }
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
              <text
                x="48"
                y="268"
                fontSize="19"
                fontWeight="700"
                fill={gap ? "#b45309" : "#0f766e"}
              >
                {gap
                  ? `${gap}개 조건은 아직 근거 없음`
                  : "선언한 조건과 검증한 조건이 일치"}
              </text>
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

type RequirementMode = "vague" | "atomic";
export function RequirementBudgetLab() {
  const [mode, setMode] = useState<RequirementMode>("vague");
  const [sensor, setSensor] = useState(35);
  const [compute, setCompute] = useState(48);
  const [actuation, setActuation] = useState(42);
  const budget = 110,
    total = sensor + compute + actuation,
    margin = budget - total;
  const quality = mode === "atomic" ? 5 : 2;
  const parts = [
    { n: "감지", v: sensor, c: "#2563eb" },
    { n: "판단", v: compute, c: "#7c3aed" },
    { n: "정지", v: actuation, c: "#0d9488" },
  ];
  let cursor = 58;
  return (
    <LabShell
      index="02"
      title="문장을 측정 가능한 predicate와 end-to-end budget으로 바꾼다"
      status="REQUIREMENTS"
      metrics={[
        {
          label: "요구사항 필드",
          value: `${quality}/5`,
          accent: quality === 5,
        },
        { label: "전체 지연", value: `${total} ms` },
        { label: "남은 시간 여유", value: `${margin} ms`, accent: margin >= 0 },
        {
          label: "판정",
          value:
            mode === "vague"
              ? "검증 불가능"
              : margin >= 0
                ? "atomic and budgeted"
                : "interface budget 초과",
        },
      ]}
    >
      <Split
        controls={
          <>
            <SegmentedControl
              label="요구사항 문장"
              value={mode}
              onChange={setMode}
              options={[
                { value: "vague", label: "빠르게 멈춰야 한다" },
                { value: "atomic", label: "조건·거리·시간·허용오차" },
              ]}
            />
            <Range
              label="센서와 감지"
              value={sensor}
              min={5}
              max={80}
              unit=" ms"
              onChange={setSensor}
            />
            <Range
              label="통신과 계산"
              value={compute}
              min={5}
              max={100}
              unit=" ms"
              onChange={setCompute}
            />
            <Range
              label="제어기와 제동"
              value={actuation}
              min={5}
              max={100}
              unit=" ms"
              onChange={setActuation}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              좋은 requirement는 주어, 조건, 관찰 가능한 동작, 수치와
              tolerance를 한 claim에 둡니다. Total stopping time은 여러 팀의
              local pass를 더한 값이므로 interface budget owner가 필요합니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="하나의 요구사항 · 여러 담당자의 지연 예산">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              <rect
                x="58"
                y="94"
                width="500"
                height="56"
                rx="6"
                fill="var(--muted)"
              />
              {parts.map((p) => {
                const w = (p.v / budget) * 500;
                const x = cursor;
                cursor += w;
                return (
                  <g key={p.n}>
                    <rect
                      x={x}
                      y="94"
                      width={Math.min(w, 558 - x)}
                      height="56"
                      fill={p.c}
                      opacity=".76"
                    />
                    <text
                      x={x + 8}
                      y="128"
                      fontSize="18"
                      fontWeight="800"
                      fill="white"
                    >
                      {p.n}
                    </text>
                  </g>
                );
              })}
              <line
                x1="558"
                y1="72"
                x2="558"
                y2="174"
                stroke="#dc2626"
                strokeWidth="3"
                strokeDasharray="6 5"
              />
              <text
                x="548"
                y="62"
                textAnchor="end"
                fontSize="19"
                fontWeight="800"
                fill="#b91c1c"
              >
                시스템 한계 110 ms
              </text>
              {["주체", "조건", "측정값", "단위", "허용오차"].map((n, i) => (
                <g key={n}>
                  <circle
                    cx={82 + i * 105}
                    cy="218"
                    r="9"
                    fill={i < quality ? "#0d9488" : "var(--muted)"}
                    stroke={i < quality ? "#0f766e" : "var(--border)"}
                  />
                  <text
                    x={98 + i * 105}
                    y="224"
                    fontSize="17"
                    fill="var(--muted-foreground)"
                  >
                    {n}
                  </text>
                </g>
              ))}
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

export function TraceabilityLab() {
  const [requirements, setRequirements] = useState(8);
  const [evidence, setEvidence] = useState(6);
  const [owners, setOwners] = useState(75);
  const linked = Math.min(
    requirements,
    evidence,
    Math.floor((requirements * owners) / 100),
  );
  const orphan = requirements - linked;
  const coverage = (linked / requirements) * 100;
  return (
    <LabShell
      index="03"
      title="Claim에서 raw evidence까지 끊어진 edge를 찾는다"
      status="TRACEABILITY"
      metrics={[
        { label: "요구사항", value: String(requirements) },
        {
          label: "닫힌 연결",
          value: `${linked}/${requirements}`,
          accent: orphan === 0,
        },
        { label: "고립 항목", value: String(orphan) },
        { label: "추적 완성도", value: `${fmt(coverage)}%` },
      ]}
    >
      <Split
        controls={
          <>
            <Range
              label="확정한 요구사항"
              value={requirements}
              min={4}
              max={12}
              onChange={setRequirements}
            />
            <Range
              label="유효한 근거 기록"
              value={evidence}
              min={1}
              max={12}
              onChange={setEvidence}
            />
            <Range
              label="인터페이스 담당자 지정"
              value={owners}
              min={20}
              max={100}
              step={5}
              unit="%"
              onChange={setOwners}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Coverage count는 screenshot 개수가 아닙니다. Requirement ID,
              owner, method, level, article serial, configuration, raw result
              and anomaly disposition이 같은 edge에 있어야 다시 판단할 수
              있습니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="주장 → 요구사항 → 인터페이스 → 근거">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              {Array.from({ length: requirements }, (_, i) => {
                const y = 42 + i * (210 / Math.max(1, requirements - 1));
                const ok = i < linked;
                return (
                  <g key={i}>
                    <circle cx="74" cy={y} r="8" fill="#2563eb" />
                    <path
                      d={`M84 ${y}C188 ${y} 198 ${42 + (i % 6) * 40} 292 ${42 + (i % 6) * 40}`}
                      fill="none"
                      stroke={ok ? "#0d9488" : "#d97706"}
                      strokeWidth={ok ? 2.5 : 2}
                      strokeDasharray={ok ? undefined : "6 5"}
                    />
                    {ok && (
                      <path
                        d={`M306 ${42 + (i % 6) * 40}C400 ${42 + (i % 6) * 40} 430 ${56 + (i % Math.max(1, evidence)) * 34} 534 ${56 + (i % Math.max(1, evidence)) * 34}`}
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="2.5"
                      />
                    )}
                  </g>
                );
              })}
              {Array.from({ length: 6 }, (_, i) => (
                <rect
                  key={i}
                  x="292"
                  y={30 + i * 40}
                  width="16"
                  height="24"
                  rx="3"
                  fill="#ede9fe"
                  stroke="#7c3aed"
                />
              ))}
              {Array.from({ length: evidence }, (_, i) => (
                <rect
                  key={i}
                  x="534"
                  y={44 + i * 34}
                  width="24"
                  height="18"
                  rx="3"
                  fill="#ccfbf1"
                  stroke="#0d9488"
                />
              ))}
              <text
                x="48"
                y="276"
                fontSize="18"
                fontWeight="800"
                fill="#2563eb"
              >
                요구사항
              </text>
              <text
                x="250"
                y="276"
                fontSize="18"
                fontWeight="800"
                fill="#6d28d9"
              >
                인터페이스
              </text>
              <text
                x="497"
                y="276"
                fontSize="18"
                fontWeight="800"
                fill="#0f766e"
              >
                근거
              </text>
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

type ControlLayer = "design" | "guard" | "info";
const controlLayerLabel: Record<ControlLayer, string> = {
  design: "본질 안전 설계",
  guard: "방호·인터록",
  info: "경고·매뉴얼",
};
export function HazardControlLab() {
  const [layer, setLayer] = useState<ControlLayer>("guard");
  const [exposure, setExposure] = useState(55);
  const [detection, setDetection] = useState(72);
  const [mitigation, setMitigation] = useState(70);
  const layerFactor =
    layer === "design" ? 0.28 : layer === "guard" ? 0.5 : 0.82;
  const residual = clamp(
    (exposure / 100) *
      (1 - ((detection / 100) * mitigation) / 100) *
      layerFactor *
      100,
    1,
    100,
  );
  return (
    <LabShell
      index="04"
      title="위험원을 hazardous event와 harm까지 연결하고 control hierarchy를 본다"
      status="HAZARD / RISK"
      metrics={[
        { label: "노출 가능성", value: `${exposure}%` },
        { label: "위험 저감 계층", value: controlLayerLabel[layer] },
        {
          label: "잔여 위험 추정값",
          value: `${fmt(residual, 1)}%`,
          accent: residual < 8,
        },
        {
          label: "안전 주장",
          value: residual < 8 ? "추가 근거 필요" : "위험 저감 미완료",
        },
      ]}
    >
      <Split
        controls={
          <>
            <SegmentedControl
              label="주요 위험 저감 수단"
              value={layer}
              onChange={setLayer}
              options={[
                { value: "design", label: "본질 안전 설계" },
                { value: "guard", label: "방호물·인터록" },
                { value: "info", label: "경고·매뉴얼" },
              ]}
            />
            <Range
              label="위험원 노출"
              value={exposure}
              min={5}
              max={100}
              unit="%"
              onChange={setExposure}
            />
            <Range
              label="고장 감지율"
              value={detection}
              min={0}
              max={100}
              unit="%"
              onChange={setDetection}
            />
            <Range
              label="피해 완화 효과"
              value={mitigation}
              min={0}
              max={100}
              unit="%"
              onChange={setMitigation}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Hazard는 손해 그 자체가 아니라 potential source입니다. Source →
              initiating cause → hazardous event → exposure → harm chain을
              그려야 control이 어느 edge를 끊는지 시험할 수 있습니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="보타이 분석 · 사건 예방과 피해 완화">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              <path
                d="M82 68C190 72 214 128 286 144M82 144H286M82 220C190 214 214 160 286 144"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />
              <path
                d="M334 144C412 128 448 72 548 68M334 144H548M334 144C412 160 448 216 548 220"
                fill="none"
                stroke="#d97706"
                strokeWidth="3"
              />
              <circle
                cx="310"
                cy="144"
                r="45"
                fill="#fee2e2"
                stroke="#dc2626"
                strokeWidth="3"
              />
              <text
                x="310"
                y="151"
                textAnchor="middle"
                fontSize="17"
                fontWeight="900"
                fill="#b91c1c"
              >
                위험 사건
              </text>
              {[
                ["원인 A", 82, 68],
                ["원인 B", 82, 144],
                ["원인 C", 82, 220],
                ["경상", 548, 68],
                ["중상", 548, 144],
                ["치명", 548, 220],
              ].map(([n, x, y]) => (
                <g key={String(n)}>
                  <circle
                    cx={Number(x)}
                    cy={Number(y)}
                    r="17"
                    fill="var(--background)"
                    stroke="var(--border)"
                    strokeWidth="2"
                  />
                  <text
                    x={Number(x) + (Number(x) < 300 ? -54 : 25)}
                    y={Number(y) + 6}
                    fontSize="17"
                    fontWeight="700"
                    fill="var(--muted-foreground)"
                  >
                    {n}
                  </text>
                </g>
              ))}
              <rect
                x="185"
                y="118"
                width="62"
                height="52"
                rx="5"
                fill={layer === "design" ? "#ccfbf1" : "var(--muted)"}
                stroke={layer === "design" ? "#0d9488" : "var(--border)"}
              />
              <rect
                x="374"
                y="118"
                width="62"
                height="52"
                rx="5"
                fill={
                  layer === "guard"
                    ? "#ccfbf1"
                    : layer === "info"
                      ? "#fef3c7"
                      : "var(--muted)"
                }
                stroke={layer === "guard" ? "#0d9488" : "#d97706"}
              />
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

type Dependency = "independent" | "shared";
export function FailureLogicLab() {
  const [dependency, setDependency] = useState<Dependency>("independent");
  const [channel, setChannel] = useState(92);
  const [common, setCommon] = useState(8);
  const q = 1 - channel / 100;
  const miss =
    dependency === "independent"
      ? q * q
      : common / 100 + (1 - common / 100) * q * q;
  const claimed = q * q;
  return (
    <LabShell
      index="05"
      title="두 channel을 그렸다고 independent safety가 생기지는 않는다"
      status="FMEA / FAULT TREE"
      metrics={[
        { label: "채널별 감지율", value: `${channel}%` },
        { label: "단순 계산 누락률", value: `${fmt(claimed * 100, 2)}%` },
        {
          label: "공통 원인 포함 누락률",
          value: `${fmt(miss * 100, 2)}%`,
          accent: miss < 0.01,
        },
        {
          label: "공통 원인 영향",
          value: `${fmt((miss - claimed) * 100, 2)}%`,
        },
      ]}
    >
      <Split
        controls={
          <>
            <SegmentedControl
              label="두 채널의 관계"
              value={dependency}
              onChange={setDependency}
              options={[
                { value: "independent", label: "독립 전원·논리" },
                { value: "shared", label: "공유 전원·설정" },
              ]}
            />
            <Range
              label="채널별 감지율"
              value={channel}
              min={50}
              max={99}
              unit="%"
              onChange={setChannel}
            />
            <Range
              label="공통 원인 확률"
              value={common}
              min={0}
              max={35}
              unit="%"
              onChange={setCommon}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              FMEA는 component에서 위로 failure effect를 찾고, fault tree는
              unwanted top event에서 아래로 원인 조합을 찾습니다. RPN 순위나 두
              채널 도형은 proof가 아닙니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="최상위 실패 사건 · 독립 실패와 공통 원인">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              <rect
                x="236"
                y="48"
                width="148"
                height="52"
                rx="6"
                fill="#fee2e2"
                stroke="#dc2626"
                strokeWidth="3"
              />
              <text
                x="256"
                y="80"
                fontSize="19"
                fontWeight="850"
                fill="#b91c1c"
              >
                정지 실패
              </text>
              <path
                d="M310 100V132M174 174L310 132L446 174"
                fill="none"
                stroke="#64748b"
                strokeWidth="3"
              />
              <circle
                cx="174"
                cy="190"
                r="42"
                fill="#dbeafe"
                stroke="#2563eb"
                strokeWidth="3"
              />
              <circle
                cx="446"
                cy="190"
                r="42"
                fill="#ccfbf1"
                stroke="#0d9488"
                strokeWidth="3"
              />
              <text
                x="174"
                y="197"
                textAnchor="middle"
                fontSize="18"
                fontWeight="800"
                fill="#1d4ed8"
              >
                A 채널
              </text>
              <text
                x="446"
                y="197"
                textAnchor="middle"
                fontSize="18"
                fontWeight="800"
                fill="#0f766e"
              >
                B 채널
              </text>
              {dependency === "shared" && (
                <>
                  <path
                    d="M310 132V216"
                    stroke="#d97706"
                    strokeWidth="4"
                    strokeDasharray="7 5"
                  />
                  <rect
                    x="248"
                    y="216"
                    width="124"
                    height="42"
                    rx="5"
                    fill="#fef3c7"
                    stroke="#d97706"
                    strokeWidth="3"
                  />
                  <text
                    x="264"
                    y="243"
                    fontSize="17"
                    fontWeight="850"
                    fill="#b45309"
                  >
                    공통 원인
                  </text>
                </>
              )}
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

type Claim = "dimension" | "stop" | "workflow" | "fault";
type Method = "inspection" | "analysis" | "demo" | "test";
const claimLabel: Record<Claim, string> = {
  dimension: "치수",
  stop: "정지 거리",
  workflow: "작업 흐름",
  fault: "고장 대응",
};
const methodLabel: Record<Method, string> = {
  inspection: "검사",
  analysis: "해석",
  demo: "시연",
  test: "시험",
};
const claimMethod: Record<Claim, Method> = {
  dimension: "inspection",
  stop: "test",
  workflow: "demo",
  fault: "test",
};
export function VerificationMethodLab() {
  const [claim, setClaim] = useState<Claim>("stop");
  const [method, setMethod] = useState<Method>("analysis");
  const [conditions, setConditions] = useState(65);
  const fit = method === claimMethod[claim];
  const validation = claim === "workflow";
  return (
    <LabShell
      index="06"
      title="Requirement마다 맞는 evidence method와 validation question을 고른다"
      status="VERIFY / VALIDATE"
      metrics={[
        { label: "주장 종류", value: claimLabel[claim] },
        { label: "선택한 방법", value: methodLabel[method] },
        { label: "방법 적합성", value: fit ? "맞음" : "부족", accent: fit },
        {
          label: "판단 질문",
          value: validation ? "사용자에게 맞는가" : "명세를 충족했는가",
        },
      ]}
    >
      <Split
        controls={
          <>
            <SegmentedControl
              label="주장 종류"
              value={claim}
              onChange={setClaim}
              options={[
                { value: "dimension", label: "치수" },
                { value: "stop", label: "정지 거리" },
                { value: "workflow", label: "작업 흐름" },
                { value: "fault", label: "고장 대응" },
              ]}
            />
            <SegmentedControl
              label="근거를 얻는 방법"
              value={method}
              onChange={setMethod}
              options={[
                { value: "inspection", label: "검사" },
                { value: "analysis", label: "해석" },
                { value: "demo", label: "시연" },
                { value: "test", label: "시험" },
              ]}
            />
            <Range
              label="의도한 사용 조건 재현율"
              value={conditions}
              min={10}
              max={100}
              unit="%"
              onChange={setConditions}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Verification는 `명세대로 만들었는가`, validation은 `의도한 사용에
              맞는가`를 묻습니다. 같은 test apparatus를 쓸 수 있어도 비교 대상이
              requirement인지 stakeholder scenario인지 다릅니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="주장별 검증 방법 · 근거 적합성">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              {(["inspection", "analysis", "demo", "test"] as Method[]).map(
                (m, i) => {
                  const selected = m === method,
                    correct = m === claimMethod[claim];
                  return (
                    <g key={m}>
                      <rect
                        x={64 + i * 136}
                        y="74"
                        width="112"
                        height="82"
                        rx="6"
                        fill={
                          selected
                            ? correct
                              ? "#ccfbf1"
                              : "#fef3c7"
                            : "var(--muted)"
                        }
                        stroke={
                          correct
                            ? "#0d9488"
                            : selected
                              ? "#d97706"
                              : "var(--border)"
                        }
                        strokeWidth={correct || selected ? 3 : 1}
                      />
                      <text
                        x={80 + i * 136}
                        y="120"
                        fontSize="18"
                        fontWeight="800"
                        fill="var(--foreground)"
                      >
                        {methodLabel[m]}
                      </text>
                    </g>
                  );
                },
              )}
              <path
                d="M64 210H556"
                stroke="var(--border)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d={`M64 210H${64 + (492 * conditions) / 100}`}
                stroke="#7c3aed"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <text
                x="64"
                y="254"
                fontSize="18"
                fontWeight="750"
                fill="#6d28d9"
              >
                의도한 사용 조건 재현율 {conditions}%
              </text>
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

type Level = "sil" | "hil" | "subsystem" | "robot";
const levelIndex: Record<Level, number> = {
  sil: 0,
  hil: 1,
  subsystem: 2,
  robot: 3,
};
const levelLabel: Record<Level, string> = {
  sil: "SIL",
  hil: "HIL",
  subsystem: "하위 시스템",
  robot: "전체 로봇",
};
export function EvidenceLadderLab() {
  const [level, setLevel] = useState<Level>("hil");
  const [correlation, setCorrelation] = useState(68);
  const [repeat, setRepeat] = useState(60);
  const restored = [
    ["논리", "가상 시간"],
    ["입출력", "실시간"],
    ["하드웨어", "열·하중"],
    ["임무", "사람·환경"],
  ];
  const idx = levelIndex[level];
  const applicability = clamp(
    (idx + 1) * 22 + correlation * 0.35 + repeat * 0.15,
    0,
    100,
  );
  const omitted = 3 - idx;
  return (
    <LabShell
      index="07"
      title="SIL·HIL·subsystem·full robot이 각각 되돌려 놓는 현실을 본다"
      status="EVIDENCE LADDER"
      metrics={[
        { label: "선택한 시험 단계", value: levelLabel[level] },
        {
          label: "현실 적용성 추정값",
          value: `${fmt(applicability)}%`,
          accent: applicability > 82,
        },
        { label: "빠진 물리 계층", value: String(omitted) },
        {
          label: "주요 용도",
          value: idx < 2 ? "빠른 반증" : "출시 근거 후보",
        },
      ]}
    >
      <Split
        controls={
          <>
            <SegmentedControl
              label="시험 단계"
              value={level}
              onChange={setLevel}
              options={[
                { value: "sil", label: "SIL" },
                { value: "hil", label: "HIL" },
                { value: "subsystem", label: "하위 시스템" },
                { value: "robot", label: "전체 로봇" },
              ]}
            />
            <Range
              label="모형과 하드웨어의 일치도"
              value={correlation}
              min={20}
              max={100}
              unit="%"
              onChange={setCorrelation}
            />
            <Range
              label="시나리오 반복성"
              value={repeat}
              min={20}
              max={100}
              unit="%"
              onChange={setRepeat}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Lower level은 원인을 빠르게 isolate하고 upper level은 omitted
              coupling을 되돌립니다. HIL pass는 motor heat, tire slip,
              structural compliance or human response를 자동으로 검증하지
              않습니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="원인 분리는 빠르게 ↑ · 실제 상호작용은 오른쪽으로 →">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              {restored.map((r, i) => {
                const x = 58 + i * 140,
                  y = 205 - i * 42,
                  active = i <= idx;
                return (
                  <g key={r[0]}>
                    <rect
                      x={x}
                      y={y}
                      width="116"
                      height={54 + i * 22}
                      rx="6"
                      fill={active ? "#dbeafe" : "var(--muted)"}
                      stroke={active ? "#2563eb" : "var(--border)"}
                      strokeWidth={active ? 3 : 1}
                    />
                    <text
                      x={x + 12}
                      y={y + 27}
                      fontSize="18"
                      fontWeight="850"
                      fill="var(--foreground)"
                    >
                      {["SIL", "HIL", "부품", "전체"][i]}
                    </text>
                    <text
                      x={x + 12}
                      y={y + 50}
                      fontSize="15"
                      fill="var(--muted-foreground)"
                    >
                      {r[0]}
                    </text>
                  </g>
                );
              })}
              <path
                d="M58 252C190 242 398 150 560 64"
                fill="none"
                stroke="#0d9488"
                strokeWidth="3"
                strokeDasharray="7 5"
              />
              <text
                x="368"
                y="48"
                fontSize="18"
                fontWeight="800"
                fill="#0f766e"
              >
                실제 상호작용 증가
              </text>
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

type Exposure = "storage" | "transport" | "operation" | "washdown";
const exposureLabel: Record<Exposure, string> = {
  storage: "보관",
  transport: "운송",
  operation: "운용",
  washdown: "세척",
};
export function EnvironmentProfileLab() {
  const [exposure, setExposure] = useState<Exposure>("operation");
  const [severity, setSeverity] = useState(65);
  const [sequence, setSequence] = useState(45);
  const [after, setAfter] = useState(70);
  const transitionRisk =
    exposure === "operation"
      ? sequence * 0.72
      : exposure === "washdown"
        ? sequence * 0.95
        : sequence * 0.45;
  const evidence = after * 0.62 + (100 - transitionRisk) * 0.38;
  const failure =
    transitionRisk > 55
      ? "상태 전이·복합 노출 확인 필요"
      : "단일 노출 선별 시험";
  const phases = [
    { n: "보관", c: "#7c3aed" },
    { n: "운송", c: "#2563eb" },
    { n: "운용", c: "#0d9488" },
    { n: "세척", c: "#d97706" },
  ];
  return (
    <LabShell
      index="08"
      title="표준 시험값을 복사하지 않고 life-cycle exposure를 tailoring한다"
      status="ENVIRONMENT"
      metrics={[
        { label: "선택한 수명 단계", value: exposureLabel[exposure] },
        { label: "노출 강도 추정값", value: `${severity}%` },
        { label: "상태 전이 위험", value: `${fmt(transitionRisk)}%` },
        {
          label: "전후 근거 완성도",
          value: `${fmt(evidence)}%`,
          accent: evidence > 78,
        },
      ]}
    >
      <Split
        controls={
          <>
            <SegmentedControl
              label="제품 수명 단계"
              value={exposure}
              onChange={setExposure}
              options={[
                { value: "storage", label: "보관" },
                { value: "transport", label: "운송" },
                { value: "operation", label: "운용" },
                { value: "washdown", label: "세척" },
              ]}
            />
            <Range
              label="맞춤 환경 노출 강도"
              value={severity}
              min={10}
              max={100}
              unit="%"
              onChange={setSeverity}
            />
            <Range
              label="순서·복합 노출 응력"
              value={sequence}
              min={0}
              max={100}
              unit="%"
              onChange={setSequence}
            />
            <Range
              label="시험 전후 기능 근거"
              value={after}
              min={0}
              max={100}
              unit="%"
              onChange={setAfter}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              MIL-STD-810H 자체도 universal test specification이 아니라 actual
              life-cycle environment에 맞추는 tailoring을 강조합니다.
              Cold-to-humid condensation처럼 transition이 single steady test보다
              더 위험할 수 있습니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="보관 → 운송 → 운용 → 세척 → 다음 시작 상태">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              {phases.map((p, i) => {
                const x = 48 + i * 140,
                  active = p.n === exposureLabel[exposure];
                return (
                  <g key={p.n}>
                    <rect
                      x={x}
                      y={78 + (i % 2) * 54}
                      width="112"
                      height="68"
                      rx="6"
                      fill={active ? p.c : "var(--muted)"}
                      fillOpacity={active ? 0.72 : 1}
                      stroke={active ? p.c : "var(--border)"}
                      strokeWidth={active ? 3 : 1}
                    />
                    <text
                      x={x + 24}
                      y={118 + (i % 2) * 54}
                      fontSize="19"
                      fontWeight="850"
                      fill={active ? "white" : "var(--muted-foreground)"}
                    >
                      {p.n}
                    </text>
                    {i < 3 && (
                      <path
                        d={`M${x + 112} ${112 + (i % 2) * 54}C${x + 126} ${112 + (i % 2) * 54} ${x + 127} ${112 + ((i + 1) % 2) * 54} ${x + 140} ${112 + ((i + 1) % 2) * 54}`}
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="3"
                      />
                    )}
                  </g>
                );
              })}
              <path
                d={`M52 238Q310 ${238 - transitionRisk * 1.35} 568 238`}
                fill="none"
                stroke={transitionRisk > 55 ? "#dc2626" : "#0d9488"}
                strokeWidth="4"
              />
              <text
                x="48"
                y="268"
                fontSize="18"
                fontWeight="800"
                fill={transitionRisk > 55 ? "#b91c1c" : "#0f766e"}
              >
                {failure}
              </text>
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

export function ReliabilityConfidenceLab() {
  const [n, setN] = useState(30);
  const [confidence, setConfidence] = useState(95);
  const [independence, setIndependence] = useState(75);
  const [beta, setBeta] = useState(1.4);
  const effective = Math.max(1, (n * independence) / 100);
  const alpha = 1 - confidence / 100;
  const lower = Math.pow(alpha, 1 / effective);
  const mission = 0.72;
  const survival = Math.exp(-Math.pow(mission, beta));
  return (
    <LabShell
      index="09"
      title="Zero failure를 100% reliability가 아니라 confidence bound로 읽는다"
      status="RELIABILITY"
      metrics={[
        { label: "명목 시험 횟수", value: String(n) },
        { label: "유효 독립 표본", value: fmt(effective, 1) },
        {
          label: `${confidence}% 신뢰 하한`,
          value: `${fmt(lower * 100, 1)}%`,
          accent: lower > 0.9,
        },
        {
          label: "임무 생존 확률 추정값",
          value: `${fmt(survival * 100, 1)}%`,
        },
      ]}
    >
      <Split
        controls={
          <>
            <Range
              label="무고장 시험 횟수"
              value={n}
              min={3}
              max={160}
              onChange={setN}
            />
            <Range
              label="신뢰수준"
              value={confidence}
              min={80}
              max={99}
              unit="%"
              onChange={setConfidence}
            />
            <Range
              label="독립 정보 비율"
              value={independence}
              min={10}
              max={100}
              unit="%"
              onChange={setIndependence}
            />
            <Range
              label="와이블 모양값 beta"
              value={beta}
              min={0.5}
              max={3}
              step={0.1}
              onChange={setBeta}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              한 unit을 같은 쉬운 cycle로 반복하면 nominal count만 늘고
              independent information은 적습니다. Beta&lt;1은 early failure,
              beta≈1은 constant hazard, beta&gt;1은 wear-out 경향을 나타내는
              model입니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="생존 곡선 · 신뢰도는 확실성과 다르다">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              <line
                x1="62"
                y1="235"
                x2="570"
                y2="235"
                stroke="var(--border)"
                strokeWidth="2"
              />
              <line
                x1="62"
                y1="48"
                x2="62"
                y2="235"
                stroke="var(--border)"
                strokeWidth="2"
              />
              <path
                d={Array.from({ length: 61 }, (_, i) => {
                  const t = i / 30;
                  const r = Math.exp(-Math.pow(t, beta));
                  return `${i ? "L" : "M"}${62 + i * 8.45} ${235 - r * 176}`;
                }).join(" ")}
                fill="none"
                stroke="#2563eb"
                strokeWidth="4"
              />
              <line
                x1="62"
                y1={235 - lower * 176}
                x2="570"
                y2={235 - lower * 176}
                stroke="#d97706"
                strokeWidth="3"
                strokeDasharray="7 5"
              />
              <text
                x="78"
                y={clamp(225 - lower * 176, 62, 216)}
                fontSize="18"
                fontWeight="800"
                fill="#b45309"
              >
                무고장 시험의 신뢰 하한 {fmt(lower * 100, 1)}%
              </text>
              <text
                x="472"
                y="270"
                fontSize="18"
                fill="var(--muted-foreground)"
              >
                정규화한 수명
              </text>
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

type AiMetric = "accuracy" | "risk";
export function AiTevvLab() {
  const [metric, setMetric] = useState<AiMetric>("accuracy");
  const [rare, setRare] = useState(12);
  const [threshold, setThreshold] = useState(65);
  const [closed, setClosed] = useState(55);
  const nominal = 0.97,
    rarePerf = clamp(0.55 + threshold / 250, 0, 1);
  const average = nominal * (1 - rare / 100) + (rarePerf * rare) / 100;
  const harm = (((1 - rarePerf) * rare) / 100) * (1 - closed / 100);
  const verdict =
    metric === "accuracy"
      ? `${fmt(average * 100, 1)}% 평균`
      : `${fmt(harm * 100, 2)}% 피해 추정`;
  return (
    <LabShell
      index="10"
      title="AI 평균 점수와 closed-loop consequence를 같은 metric으로 부르지 않는다"
      status="AI TEVV"
      metrics={[
        { label: "희귀 조건 비중", value: `${rare}%` },
        { label: "일반 조건 정확도", value: `${fmt(nominal * 100)}%` },
        {
          label: "화면에 보이는 판정",
          value: verdict,
          accent: metric === "risk" && harm < 0.01,
        },
        {
          label: "조건 포괄 경고",
          value: rare < 8 ? "희귀 조건 표본 부족" : "조건별 확인 가능",
        },
      ]}
    >
      <Split
        controls={
          <>
            <SegmentedControl
              label="판단 관점"
              value={metric}
              onChange={setMetric}
              options={[
                { value: "accuracy", label: "오프라인 평균" },
                { value: "risk", label: "폐루프 위험" },
              ]}
            />
            <Range
              label="희귀·위험 조건 비중"
              value={rare}
              min={1}
              max={40}
              unit="%"
              onChange={setRare}
            />
            <Range
              label="감지 임계값"
              value={threshold}
              min={20}
              max={95}
              unit="%"
              onChange={setThreshold}
            />
            <Range
              label="계획기·감시기 복구율"
              value={closed}
              min={0}
              max={100}
              unit="%"
              onChange={setClosed}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Dataset proportion, field frequency and harm severity는 서로
              다릅니다. Mean accuracy가 높아도 low-sun pedestrian miss처럼 rare
              high-consequence stratum은 별도 evidence와 monitor가 필요합니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="ODD 조건층 · 오프라인 점수와 시스템 결과">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              {[
                ["명목 실내", 0.97, "#0d9488"],
                ["젖은 도크", rarePerf, "#2563eb"],
                ["역광·사람", rarePerf - 0.12, "#d97706"],
                ["무선 손실", clamp(closed / 100, 0.1, 1), "#7c3aed"],
              ].map((r, i) => {
                const v = Number(r[1]),
                  w = v * 430;
                return (
                  <g key={String(r[0])}>
                    <text
                      x="54"
                      y={64 + i * 50}
                      fontSize="18"
                      fontWeight="750"
                      fill="var(--muted-foreground)"
                    >
                      {r[0]}
                    </text>
                    <rect
                      x="168"
                      y={45 + i * 50}
                      width="430"
                      height="24"
                      rx="4"
                      fill="var(--muted)"
                    />
                    <rect
                      x="168"
                      y={45 + i * 50}
                      width={w}
                      height="24"
                      rx="4"
                      fill={String(r[2])}
                      opacity=".78"
                    />
                    <text
                      x={Math.min(566, 176 + w)}
                      y={64 + i * 50}
                      fontSize="16"
                      fontWeight="800"
                      fill="var(--foreground)"
                    >
                      {fmt(v * 100)}%
                    </text>
                  </g>
                );
              })}
              <text
                x="54"
                y="268"
                fontSize="18"
                fontWeight="800"
                fill={metric === "risk" ? "#b91c1c" : "#0f766e"}
              >
                {metric === "risk"
                  ? "누락 × 노출 × 복구 실패를 본다"
                  : "쉬운 조건층이 평균을 지배한다"}
              </text>
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

type Change = "firmware" | "model" | "sensor" | "seal";
const changeLabel: Record<Change, string> = {
  firmware: "펌웨어",
  model: "AI 모형",
  sensor: "센서",
  seal: "밀봉",
};
const staleByChange: Record<Change, string[]> = {
  firmware: ["시간 동작", "고장 대응", "작업 흐름"],
  model: ["정확도", "위험", "임계값"],
  sensor: ["보정", "EMC", "ODD"],
  seal: ["침투", "마찰", "열"],
};
export function ChangeRegressionLab() {
  const [change, setChange] = useState<Change>("model");
  const [regression, setRegression] = useState(58);
  const [anomalies, setAnomalies] = useState(3);
  const stale = staleByChange[change];
  const rerun = Math.ceil((stale.length * regression) / 100);
  const open = stale.length - rerun + anomalies;
  const identity = `R3-${change.toUpperCase()}-${Math.round(regression)}`;
  return (
    <LabShell
      index="11"
      title="부품·firmware·model 변경이 stale하게 만든 evidence를 다시 연다"
      status="CHANGE / REGRESSION"
      metrics={[
        { label: "변경 항목", value: changeLabel[change] },
        { label: "다시 열 근거", value: String(stale.length) },
        {
          label: "재검증 완료",
          value: `${rerun}/${stale.length}`,
          accent: rerun === stale.length,
        },
        { label: "열린 판정", value: String(open) },
      ]}
    >
      <Split
        controls={
          <>
            <SegmentedControl
              label="바뀐 항목"
              value={change}
              onChange={setChange}
              options={[
                { value: "firmware", label: "펌웨어" },
                { value: "model", label: "AI 모형" },
                { value: "sensor", label: "센서" },
                { value: "seal", label: "밀봉" },
              ]}
            />
            <Range
              label="영향 연결 재시험률"
              value={regression}
              min={0}
              max={100}
              unit="%"
              onChange={setRegression}
            />
            <Range
              label="남은 이상·예외 승인"
              value={anomalies}
              min={0}
              max={8}
              onChange={setAnomalies}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Pass result는 configuration과 분리된 영구 자산이 아닙니다. Model
              threshold, QoS, camera, grease or seal revision이 바뀌면 linked
              requirement, hazard and evidence를 impact graph로 다시 엽니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="변경 영향 · 기존 근거의 적용성 재판단">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              <circle
                cx="132"
                cy="143"
                r="56"
                fill="#ede9fe"
                stroke="#7c3aed"
                strokeWidth="3"
              />
              <text
                x="97"
                y="137"
                fontSize="18"
                fontWeight="850"
                fill="#6d28d9"
              >
                {changeLabel[change]}
              </text>
              <text x="92" y="164" fontSize="15" fill="#6d28d9">
                {identity}
              </text>
              {stale.map((n, i) => {
                const y = 62 + i * 82,
                  done = i < rerun;
                return (
                  <g key={n}>
                    <path
                      d={`M188 143C260 143 274 ${y + 24} 352 ${y + 24}`}
                      fill="none"
                      stroke={done ? "#0d9488" : "#d97706"}
                      strokeWidth="3"
                      strokeDasharray={done ? undefined : "7 5"}
                    />
                    <rect
                      x="352"
                      y={y}
                      width="190"
                      height="48"
                      rx="6"
                      fill={done ? "#ccfbf1" : "#fef3c7"}
                      stroke={done ? "#0d9488" : "#d97706"}
                      strokeWidth="2"
                    />
                    <text
                      x="370"
                      y={y + 29}
                      fontSize="18"
                      fontWeight="800"
                      fill="var(--foreground)"
                    >
                      {n} · {done ? "완료" : "재검토"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

export function ReleaseCaseLab() {
  const [evidence, setEvidence] = useState(78);
  const [residual, setResidual] = useState(4);
  const [monitor, setMonitor] = useState(64);
  const [configuration, setConfiguration] = useState(82);
  const support = Math.min(evidence, configuration) * (1 - residual / 12);
  const field = monitor * (1 - residual / 15);
  const state =
    support > 75 && field > 55
      ? "조건과 잔여 위험이 명시된 release"
      : support > 55
        ? "조건부 pilot"
        : "release 보류";
  return (
    <LabShell
      index="12"
      title="Green dashboard 대신 claim·condition·evidence·open risk를 함께 공개한다"
      status="RELEASE CASE"
      metrics={[
        {
          label: "주장 지지 강도",
          value: `${fmt(support)}%`,
          accent: support > 75,
        },
        { label: "잔여 위험 수", value: String(residual) },
        { label: "현장 대응 포괄률", value: `${fmt(field)}%` },
        { label: "출시 위원회 판단", value: state },
      ]}
    >
      <Split
        controls={
          <>
            <Range
              label="현재 구성에 적용 가능한 근거"
              value={evidence}
              min={10}
              max={100}
              unit="%"
              onChange={setEvidence}
            />
            <Range
              label="열린 잔여 위험"
              value={residual}
              min={0}
              max={10}
              onChange={setResidual}
            />
            <Range
              label="현장 감시와 대응"
              value={monitor}
              min={0}
              max={100}
              unit="%"
              onChange={setMonitor}
            />
            <Range
              label="제품 구성 식별 완성도"
              value={configuration}
              min={10}
              max={100}
              unit="%"
              onChange={setConfiguration}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Release case는 모든 칸을 green으로 칠하는 문서가 아닙니다.
              Supported, conditional, open and rejected claim을
              조건·configuration·owner·expiry와 함께 남겨 field evidence가 다음
              requirement revision으로 돌아오게 합니다.
            </p>
          </>
        }
        plot={
          <PlotFrame label="주장 · 근거 · 가정 · 잔여 위험">
            <svg viewBox="0 0 620 288" className="h-full w-full">
              {[
                { n: "근거 충분", v: support, c: "#0d9488" },
                { n: "조건부", v: 100 - support, c: "#d97706" },
                { n: "현장 감시", v: field, c: "#2563eb" },
                { n: "열린 위험", v: residual * 10, c: "#dc2626" },
              ].map((r, i) => {
                const x = 54 + (i % 2) * 270,
                  y = 58 + Math.floor(i / 2) * 100;
                return (
                  <g key={r.n}>
                    <rect
                      x={x}
                      y={y}
                      width="238"
                      height="72"
                      rx="6"
                      fill="var(--background)"
                      stroke={r.c}
                      strokeWidth="3"
                    />
                    <text
                      x={x + 16}
                      y={y + 27}
                      fontSize="16"
                      fontWeight="900"
                      fill={r.c}
                    >
                      {r.n}
                    </text>
                    <rect
                      x={x + 16}
                      y={y + 43}
                      width="196"
                      height="10"
                      rx="5"
                      fill="var(--muted)"
                    />
                    <rect
                      x={x + 16}
                      y={y + 43}
                      width={(196 * clamp(r.v, 0, 100)) / 100}
                      height="10"
                      rx="5"
                      fill={r.c}
                    />
                  </g>
                );
              })}
              <text
                x="54"
                y="268"
                fontSize="18"
                fontWeight="850"
                fill={
                  state === "release 보류"
                    ? "#b91c1c"
                    : state === "조건부 pilot"
                      ? "#b45309"
                      : "#0f766e"
                }
              >
                {state} → 현장 변화가 요구사항으로 되돌아감
              </text>
            </svg>
          </PlotFrame>
        }
      />
    </LabShell>
  );
}

export function QualificationMiniMap() {
  return (
    <div className="not-prose my-6 flex items-start gap-3 rounded-md border border-border p-4 text-sm">
      <Route className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
      <span className="leading-relaxed">
        <strong>출시 근거 사슬:</strong> 임무·ODD → 측정 가능한 요구사항 →
        담당자·인터페이스·위험 → 검증·사용 적합성 확인 → 인증 시험·신뢰도 → 제품
        구성에 묶인 출시 → 현장 피드백
      </span>
    </div>
  );
}
