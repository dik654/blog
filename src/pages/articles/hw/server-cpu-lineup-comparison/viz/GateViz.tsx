import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SelectionGate.tsx — 구성표를 먼저 적는 순서 */
const SCENES = ["장치 목록", "레인 예산", "메모리·NUMA", "호스트 계산", "전력·냉각", "라이선스·운영"] as const;
const NOTES = [
  "GPU 8장, NIC 2장, NVMe 4개를 먼저 적습니다. 제품명은 아직 고르지 않습니다.",
  "직접 연결 요구는 128 + 32 + 16 = 176레인입니다. 128레인 플랫폼 하나로는 모자랍니다.",
  "채널 수뿐 아니라 어느 소켓의 메모리와 장치를 묶을지 정합니다. 원격 경로는 소켓 간 링크를 한 번 더 지납니다.",
  "데이터 로딩·압축·통신 제어를 실측해 필요한 코어 성격과 수를 정합니다. GPU 사용률이 낮다는 이유만으로 코어를 늘리지는 않습니다.",
  "CPU와 GPU의 최대 전력, 랙 PDU, 냉각 여유, 섀시 슬롯을 함께 통과해야 합니다.",
  "코어·소켓 단위 라이선스와 BMC·이중 전원·지원 계약까지 더한 뒤에야 후보 플랫폼이 확정됩니다.",
] as const;

const STEPC = "#6366f1";
const DONE = "#10b981";
const MUTED = "#94a3b8";
const STEPS = ["장치 목록", "레인 예산", "메모리·NUMA", "호스트 계산", "전력·냉각", "라이선스·운영"];
const RECEIPTS = [
  "8 GPU · 2 NIC · 4 NVMe",
  "176 필요 · 128 제공 → 48 부족",
  "채널 수 + local path 확인",
  "loader·decode·network profile",
  "PDU·airflow·slot 통과",
  "TCO·BMC·지원 계약 통과",
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      documentFlow
      eyebrow="선택 순서"
      title="제품을 먼저 고르면 조립 단계에서 막힙니다"
      description="같은 8-GPU 노드를 여섯 관문에 통과시킨 뒤 플랫폼을 고릅니다."
      note="어느 관문 하나라도 실패하면 더 비싼 CPU가 아니라 구성 자체를 다시 설계합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CPU 선택 판단 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(30rem,calc(100svh-15rem))] sm:min-h-[23rem] sm:overflow-y-auto"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <ol className="mt-4 grid gap-2 sm:hidden" aria-label="CPU 플랫폼 선택 여섯 관문">
            {STEPS.map((label, index) => {
              const done = index < step;
              const active = index === step;
              return (
                <li
                  key={label}
                  className={`grid min-h-11 grid-cols-[2rem_minmax(0,1fr)] items-center gap-2 border px-2 py-2 ${
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : done
                        ? "border-emerald-500/50 bg-emerald-500/5 text-foreground"
                        : "border-border text-muted-foreground"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current text-xs font-black">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-xs leading-5">{label}</strong>
                    <span className="block break-keep text-[11px] leading-5">{RECEIPTS[index]}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          <svg viewBox="0 0 480 266" className="mt-4 hidden w-full max-w-2xl sm:block" aria-label="CPU 플랫폼 선택 여섯 관문">
            <line x1={42} y1={37} x2={42} y2={227} stroke={MUTED} strokeWidth={1.25} />
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              const color = done ? DONE : active ? STEPC : MUTED;
              const y = 26 + i * 39;
              return (
                <g key={s}>
                  <circle cx={42} cy={y + 14} r={10} fill="white" stroke={color} strokeWidth={1.25} />
                  <text x={42} y={y + 17} textAnchor="middle" fontSize={8} fontWeight={800} fill={color}>
                    {i + 1}
                  </text>
                  <rect
                    x={64}
                    y={y}
                    width={384}
                    height={28}
                    fill={color}
                    fillOpacity={active ? 0.16 : done ? 0.08 : 0.04}
                    stroke={color}
                    strokeWidth={active ? 1.25 : 1}
                  />
                  <text x={76} y={y + 18} fontSize={9} fontWeight={700} fill={color}>
                    {s}
                  </text>
                  <text x={438} y={y + 18} textAnchor="end" fontSize={8} fill={color}>
                    {RECEIPTS[i]}
                  </text>
                </g>
              );
            })}
            <text x={64} y={258} fontSize={9} fill={step === STEPS.length - 1 ? DONE : MUTED}>
              {step === STEPS.length - 1 ? "여섯 영수증이 모두 남아야 선택을 설명할 수 있습니다" : "현재 관문의 숫자가 다음 관문의 입력이 됩니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
