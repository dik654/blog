import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — content 내적 128→512(네 배), 캐시 32,768→576(56.9배 작음).
 * vLLM kernel은 query·key 비율이 1에 가까우면 naive, 작으면 absorbed 경로를 쓴다.
 * 글에 비율의 경계값이 없으므로 숫자 문턱을 그리지 않는다.
 */
const SCENES = [
  { label: "대가: 곱셈", summary: "128 → 512 · 4배", note: "content 점수의 내적이 128차원에서 512차원으로 늘어 head당 곱셈이 네 배가 됩니다. 이 그림은 곱셈 쪽 비용입니다." },
  { label: "얻는 것: 캐시", summary: "32,768 → 576 · 56.9배 작음", note: "캐시 원소는 56.9배 줄어듭니다. decode가 메모리 대역폭에 묶여 있다는 전제 아래에서만 이 교환이 이득입니다." },
  { label: "prefill 경로", summary: "비율 ≈ 1 → naive", note: "prefill은 모든 token을 함께 처리해 query와 key의 수가 비슷합니다. vLLM의 MLA kernel은 이렇게 비율이 1에 가까우면 흡수하지 않은 naive 경로로 head별 key·value를 실제로 복원해 계산량을 아낍니다." },
  { label: "decode 경로", summary: "비율 작음 → 흡수", note: "decode에서는 새 token 하나의 query가 쌓인 key 여럿을 상대해 비율이 작습니다. 이때만 흡수된 경로를 씁니다. 글은 두 경로를 가르는 비율의 숫자 경계를 제시하지 않으므로 그림에도 적지 않았습니다." },
] as const;

function Bar({ label, value, max, color, text }: { label: string; value: number; max: number; color: string; text: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_4rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${Math.max((value / max) * 100, 1.5)}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{text}</span>
    </div>
  );
}

function Bars({ title, rows }: { title: string; rows: readonly { label: string; value: number; max: number; color: string; text: string }[] }) {
  return (
    <div className="min-w-0">
      <p className="mb-3 text-sm font-bold">{title}</p>
      <div className="space-y-3">
        {rows.map((row) => <Bar key={row.label} {...row} />)}
      </div>
    </div>
  );
}

function Branch({ pick }: { pick: 0 | 1 }) {
  const on = (index: 0 | 1) => index === pick;
  const color = (index: 0 | 1) => (on(index) ? "#2563eb" : "#94a3b8");
  return (
    <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={pick === 0 ? "비율이 1에 가까우면 naive 경로" : "비율이 작으면 흡수 경로"}>
      <rect x={6} y={56} width={92} height={38} rx={4} fill="none" stroke="#475569" strokeWidth={1} />
      <text x={52} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">query·key</text>
      <text x={52} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">비율</text>
      <path d="M 98 70 H 116 V 34 H 134" fill="none" stroke={color(0)} strokeWidth={1} />
      <path d="M 98 80 H 116 V 116 H 134" fill="none" stroke={color(1)} strokeWidth={1} />
      <text x={122} y={26} fontSize={11} fontWeight={on(0) ? 700 : 400} fill={on(0) ? "#2563eb" : "#64748b"}>1에 가까움</text>
      <text x={122} y={140} fontSize={11} fontWeight={on(1) ? 700 : 400} fill={on(1) ? "#2563eb" : "#64748b"}>작음</text>
      <rect x={134} y={34} width={220} height={36} rx={4} fill={on(0) ? "#2563eb" : "none"} fillOpacity={0.12} stroke={color(0)} strokeWidth={1} />
      <text x={244} y={49} textAnchor="middle" fontSize={11} fontWeight={700} fill={on(0) ? "#2563eb" : "#64748b"}>naive: head별 key·value 복원</text>
      <text x={244} y={63} textAnchor="middle" fontSize={11} fill={on(0) ? "#2563eb" : "#64748b"}>계산량을 아낌</text>
      <rect x={134} y={98} width={220} height={36} rx={4} fill={on(1) ? "#2563eb" : "none"} fillOpacity={0.12} stroke={color(1)} strokeWidth={1} />
      <text x={244} y={113} textAnchor="middle" fontSize={11} fontWeight={700} fill={on(1) ? "#2563eb" : "#64748b"}>흡수: latent를 그대로 소비</text>
      <text x={244} y={127} textAnchor="middle" fontSize={11} fill={on(1) ? "#2563eb" : "#64748b"}>메모리 왕복을 줄임</text>
    </svg>
  );
}

export default function TradeoffPathViz() {
  return (
    <SceneShell
      eyebrow="교환과 경로"
      title="곱셈을 더 내고 캐시를 줄이는 교환은 경로를 골라 씁니다"
      description="naive는 흡수하지 않고 복원해 계산하는 경로, 흡수는 앞 절처럼 미리 접은 행렬을 쓰는 경로입니다. 숫자는 DeepSeek-V2(236B) 기준이고 캐시는 원소 수입니다."
      ariaLabel="head당 곱셈 증가와 캐시 감소, 그리고 prefill과 decode의 경로 선택"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <Bars key="mul" title="content 내적의 차원" rows={[{ label: "표준", value: 128, max: 512, color: "#64748b", text: "128" }, { label: "MLA", value: 512, max: 512, color: "#d97706", text: "512" }]} />,
            <Bars key="cache" title="token당 KV cache 원소 수" rows={[{ label: "표준", value: 32768, max: 32768, color: "#64748b", text: "32,768" }, { label: "MLA", value: 576, max: 32768, color: "#2563eb", text: "576" }]} />,
            <Branch key="prefill" pick={0} />,
            <Branch key="decode" pick={1} />,
          ]}
        />
      )}
    />
  );
}
