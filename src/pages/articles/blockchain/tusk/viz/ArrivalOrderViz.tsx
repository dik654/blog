import SceneShell from "./SceneShell";

/**
 * 본문 대응: #causal-order — 로컬 도착 순서 대신 모든 정직한 노드가 다시 계산할 수 있는 값으로 정렬.
 * 인증서 1A·1D(L1)·2B는 앞 DAG 그림의 이름입니다. 그림의 2B는 1A·1B·1D를 부모로 가리키지만 여기서는 1B를 생략합니다.
 * 두 노드의 도착 순서와 같은 라운드 안의 정렬 규칙(작성자 이름순)은 설명용 가정입니다.
 */
const SCENES = [
  { label: "같은 인증서", summary: "두 노드 모두 1A · 1D · 2B", note: "노드 A와 노드 B가 받은 인증서 집합은 같습니다. 2B는 1라운드의 1A와 1D를 부모로 가리킵니다(앞 그림의 부모 1B는 단순화를 위해 생략)." },
  { label: "도착 순서", summary: "A: 1A 먼저 · B: 1D 먼저", note: "네트워크 지연 때문에 같은 인증서도 노드마다 다른 순서로 도착할 수 있습니다(이 순서는 가정)." },
  { label: "도착순 출력", summary: "두 노드 출력 불일치", note: "도착한 순서대로 내보내면 A는 1A를, B는 1D를 먼저 출력합니다. 같은 인증서를 받고도 순서가 갈립니다." },
  { label: "규칙으로 정렬", summary: "두 노드 모두 1A → 1D → 2B", note: "라운드처럼 모든 정직한 노드가 다시 계산할 수 있는 값으로 정렬하면 도착 순서와 무관하게 같은 순서가 나옵니다. 같은 라운드 안의 작성자 이름순은 설명용 가정입니다." },
  { label: "중복 없음", summary: "이미 출력한 인증서는 건너뜀", note: "다음 지도자의 인과 과거에 1A·1D·2B가 다시 들어 있어도 이미 출력했으므로 내보내지 않고, 아직 출력하지 않은 인증서만 이어 붙입니다." },
] as const;

const ARRIVAL = { A: ["1A", "1D", "2B"], B: ["1D", "1A", "2B"] } as const;
const RULE = ["1A", "1D", "2B"] as const;

function Chip({ text, tone }: { text: string; tone: "plain" | "warn" | "ok" | "skip" | "empty" }) {
  const cls = {
    plain: "border-border bg-background",
    warn: "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]",
    ok: "border-[#2563eb] text-[#1d4ed8] dark:text-[#93c5fd]",
    skip: "border-dashed border-border text-muted-foreground line-through",
    empty: "border-dashed border-border/50 text-transparent",
  }[tone];
  return <span className={`inline-flex h-7 min-w-[2.6rem] items-center justify-center rounded-md border px-1.5 font-mono text-xs font-bold ${cls}`}>{text}</span>;
}

function NodeColumn({ name, active }: { name: "A" | "B"; active: number }) {
  const arrival = ARRIVAL[name];
  const output: readonly string[] = active === 2 ? arrival : active >= 3 ? RULE : [];
  return (
    <div className="min-w-0 rounded-lg border border-border p-2.5 sm:p-3">
      <p className="text-sm font-bold">노드 {name}</p>
      <p className="mt-2 text-[11px] font-semibold text-muted-foreground">{active === 0 ? "받은 인증서" : "도착 순서"}</p>
      <div className="mt-1 flex flex-wrap items-center gap-1">
        {(active === 0 ? RULE : arrival).map((cert, index) => (
          <span key={cert} className="contents">
            {index > 0 && <span className="text-xs text-muted-foreground" aria-hidden="true">{active === 0 ? "·" : "→"}</span>}
            <Chip text={cert} tone="plain" />
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] font-semibold text-muted-foreground">출력</p>
      <div className="mt-1 flex flex-wrap items-center gap-1">
        {[0, 1, 2].map((slot) => (
          <span key={slot} className="contents">
            {slot > 0 && <span className={`text-xs ${output.length ? "text-muted-foreground" : "text-transparent"}`} aria-hidden="true">→</span>}
            {output.length ? <Chip text={output[slot]} tone={active >= 3 ? "ok" : ARRIVAL.A[slot] === ARRIVAL.B[slot] ? "plain" : "warn"} /> : <Chip text="--" tone="empty" />}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[11px] font-semibold text-muted-foreground">다음 지도자 처리 때</p>
      <div className="mt-1 flex flex-wrap items-center gap-1">
        {RULE.map((cert) => <Chip key={cert} text={cert} tone={active === 4 ? "skip" : "empty"} />)}
        <span className={`text-xs ${active === 4 ? "text-muted-foreground" : "text-transparent"}`}>새 것만</span>
      </div>
    </div>
  );
}

export default function ArrivalOrderViz() {
  return (
    <SceneShell
      eyebrow="설명용 예시 · 인증서 3개"
      title="도착 순서로 출력하면 같은 인증서도 노드마다 다르게 나옵니다"
      description="인증서 이름은 앞 DAG 그림을 따릅니다(1A = 1라운드 작성자 A, 1D = L1). 빨간 칸은 같은 자리에서 두 노드가 어긋난 출력, 파란 칸은 규칙으로 정렬해 두 노드가 같아진 출력입니다."
      ariaLabel="두 노드가 같은 인증서를 다른 순서로 받을 때 도착순 출력과 규칙 기반 출력 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-4">
          <NodeColumn name="A" active={active} />
          <NodeColumn name="B" active={active} />
        </div>
      )}
    />
  );
}
