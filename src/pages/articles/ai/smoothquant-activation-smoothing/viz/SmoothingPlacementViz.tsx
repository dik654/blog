import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-smooth — smooth_ln_fcs가 s를 정하고(29–39행) LayerNorm과 Linear에 흡수하는(41–45행) 순서,
 * 그리고 Llama 층에서 smoothing을 받는 두 곳(126–141행)과 받지 않는 o_proj·down_proj(#boundary).
 */
const SCENES = [
  {
    label: "① s 하나를 정합니다",
    summary: "q·k·v의 max|W_j|를 다시 max",
    note: "q·k·v는 같은 X를 받으므로 세 Linear의 입력 채널별 max|W_j|를 다시 max로 묶어 s 하나를 만듭니다. X는 하나인데 s가 Linear마다 다르면 LayerNorm을 한 가지로 나눌 수 없기 때문입니다.",
  },
  {
    label: "② 앞은 나누고 뒤는 곱합니다",
    summary: "LayerNorm ÷ s · Linear × s",
    note: "실행 중에 X를 나누지 않고, X를 만드는 LayerNorm의 weight와 bias를 s로 나눕니다. 뒤 Linear weight는 입력 채널 열마다 s를 곱합니다. 변환 뒤에도 연산 그래프가 같아 실행 중 추가 kernel이 없습니다.",
  },
  {
    label: "③ Llama 층에서 받는 곳",
    summary: "norm 뒤 두 곳만",
    note: "input_layernorm 뒤의 q·k·v와 post_attention_layernorm 뒤의 gate·up이 smoothing을 받습니다. RMSNorm은 bias가 없어 weight만 나눕니다. 이 코드는 o_proj와 down_proj에는 smoothing을 걸지 않습니다. 둘의 입력은 norm이 아니라 앞 계산의 출력이라 s를 공짜로 흡수할 norm이 없기 때문입니다(12절).",
  },
] as const;

function Box({ title, detail, tone }: { title: string; detail?: string; tone: "on" | "off" | "plain" | "calc" }) {
  const style =
    tone === "on"
      ? { borderColor: "#2563eb", backgroundColor: "#2563eb14" }
      : tone === "calc"
        ? { borderColor: "#d97706", backgroundColor: "#d9770614" }
        : tone === "off"
          ? { borderColor: "#94a3b8", borderStyle: "dashed" as const }
          : { borderColor: "#cbd5e1" };
  return (
    <div className="min-w-0 rounded-lg border px-2.5 py-1.5 text-[11px] leading-4 sm:px-3 sm:py-2 sm:text-xs sm:leading-5" style={style}>
      <p className="break-words font-mono font-bold">{title}</p>
      {detail && <p className="mt-0.5 text-muted-foreground">{detail}</p>}
    </div>
  );
}

const Arrow = () => <p className="text-center font-mono text-[11px] leading-3 text-muted-foreground" aria-hidden>↓</p>;

function SmoothFlow({ step }: { step: 0 | 1 }) {
  const absorb = step === 1;
  return (
    <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-6">
      <div className="min-w-0 space-y-1.5">
        <Box title="LayerNorm" detail={absorb ? "weight ÷ s, bias ÷ s" : "그대로"} tone={absorb ? "on" : "plain"} />
        <Arrow />
        <Box title="X (같은 입력)" detail={absorb ? "LayerNorm이 줄어든 만큼 X ÷ s가 된 셈" : "보정 표본에서 채널별 max|X_j|를 미리 잼"} tone={absorb ? "plain" : "calc"} />
        <Arrow />
        <div className="grid grid-cols-3 gap-1.5">
          {["q_proj", "k_proj", "v_proj"].map((name) => (
            <Box key={name} title={name} detail={absorb ? "열마다 × s" : "max|W_j|"} tone={absorb ? "on" : "calc"} />
          ))}
        </div>
      </div>
      <div className="min-w-0 space-y-1.5 self-center">
        <Box title="max|W_j| = max(q, k, v)" detail="세 Linear의 채널 j 최댓값 중 큰 값" tone={absorb ? "plain" : "calc"} />
        <Arrow />
        <Box title="s_j = max|X_j|^α / max|W_j|^(1−α)" detail="입력 채널마다 하나, 세 Linear가 공유" tone={absorb ? "plain" : "calc"} />
      </div>
    </div>
  );
}

const LAYER = [
  [
    { title: "input_layernorm", detail: "RMSNorm · weight ÷ s", tone: "on" },
    { title: "q_proj · k_proj · v_proj", detail: "smoothing 받음 · weight × s", tone: "on" },
    { title: "attention 계산", tone: "plain" },
    { title: "o_proj", detail: "받지 않음 · 입력이 앞 계산의 출력", tone: "off" },
  ],
  [
    { title: "post_attention_layernorm", detail: "RMSNorm · weight ÷ s", tone: "on" },
    { title: "gate_proj · up_proj", detail: "smoothing 받음 · weight × s", tone: "on" },
    { title: "MLP 중간 계산", tone: "plain" },
    { title: "down_proj", detail: "받지 않음 · 입력이 앞 계산의 출력", tone: "off" },
  ],
] as const;

function LayerMap() {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 md:gap-6">
      {LAYER.map((col, ci) => (
        <div key={ci} className="min-w-0 space-y-1.5">
          <p className="text-xs font-bold text-muted-foreground">{ci === 0 ? "attention 쪽" : "MLP 쪽"}</p>
          {col.map((b, bi) => (
            <div key={b.title} className="space-y-1.5">
              {bi > 0 && <Arrow />}
              <Box title={b.title} detail={"detail" in b ? b.detail : undefined} tone={b.tone} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function SmoothingPlacementViz() {
  return (
    <SceneShell
      eyebrow="smooth.py의 흡수 위치"
      title="s는 norm에서 나누고 바로 뒤 Linear에서 곱합니다"
      description="파랑 테두리는 s를 흡수하는 곳, 주황은 s를 정하는 데 쓰는 값, 점선은 smoothing을 받지 않는 Linear입니다. s_j는 입력 채널 j마다 하나씩 있는 나누는 수(smoothing factor)입니다."
      note="mit-han-lab/smoothquant c61476d smooth.py 기준입니다. 층 안의 다른 연결은 생략했습니다."
      ariaLabel="smoothing factor를 계산하고 LayerNorm과 Linear에 흡수하는 순서, Llama 층에서 흡수하는 위치"
      scenes={SCENES}
      render={(active) => (active === 2 ? <LayerMap /> : <SmoothFlow step={active === 0 ? 0 : 1} />)}
    />
  );
}
