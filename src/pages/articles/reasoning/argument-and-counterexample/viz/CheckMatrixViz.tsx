import SceneShell from "./SceneShell";

/** 본문 대응: #names — 사실 검사(전제)와 연결 검사(타당성)가 만드는 네 칸. 사례는 4·5·6절에서 가져온다. */
type CellKey = "sound" | "gap" | "falsePremise" | "both";

const CELLS: Record<CellKey, { title: string; body: string }> = {
  sound: { title: "건전", body: "폐점 규칙과 입점 사실을 모두 확인한 경우" },
  gap: { title: "따라오지 않음", body: "전자제품은 모두 카드를 받고 A도 받는 경우" },
  falsePremise: { title: "타당, 건전은 아님", body: "‘모든 가게가 밤 10시에 닫는다’가 거짓인 경우" },
  both: { title: "둘 다 실패", body: "이 글에 따로 나온 사례 없음" },
};

const SCENES: readonly { label: string; summary: string; note: string; cell: CellKey }[] = [
  { label: "카드 결제 사례", summary: "사실 통과 · 연결 실패", cell: "gap", note: "두 문장이 사례 안에서 참이어도 A의 업종은 정해지지 않습니다. 사실 검사를 통과한 것과 결론이 따라오는 것은 다른 일입니다." },
  { label: "A가 실제로 전자제품이어도", summary: "결론은 맞음 · 칸은 그대로", cell: "gap", note: "결론이 우연히 맞아도 카드 결제에서 업종을 알아낸 것은 아닙니다. 칸은 그대로이고, 같은 방법을 다음 가게에 쓰면 실패합니다." },
  { label: "밤 10시 폐점 사례", summary: "연결 통과 · 사실 실패", cell: "falsePremise", note: "모양은 빠져나갈 곳이 없습니다. 다만 24시간 영업점이 하나라도 있으면 첫 문장을 고쳐야 합니다. 타당성은 현실의 전제가 참인지까지 보장하지 않습니다." },
  { label: "규칙과 입점을 모두 확인", summary: "두 검사 통과 · 건전", cell: "sound", note: "연결이 타당하고 실제 전제도 모두 참입니다. 숨은 전제와 말의 뜻이 바뀌지 않았는지는 이 칸에 들어와도 따로 확인해야 합니다." },
];

function Cell({ id, active }: { id: CellKey; active: boolean }) {
  const cell = CELLS[id];
  return (
    <div className={`min-w-0 rounded-lg border p-2 sm:p-3 ${active ? "border-primary bg-background" : "border-border/60"}`}>
      <span className={`block h-4 text-xs font-bold text-primary ${active ? "" : "invisible"}`} aria-hidden={!active}>● 지금 사례</span>
      <span className={`block text-sm font-semibold leading-5 ${active ? "" : "text-muted-foreground"}`}>{cell.title}</span>
      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{cell.body}</span>
    </div>
  );
}

export default function CheckMatrixViz() {
  return (
    <SceneShell
      eyebrow="두 검사가 만드는 네 칸"
      title="전제의 참과 연결의 타당성은 다른 축입니다"
      description="가로는 연결 검사, 세로는 사실 검사입니다. 결론이 맞았는지는 어느 축에도 없습니다."
      ariaLabel="전제의 참 여부와 연결의 타당성이 만드는 네 칸에 이 글의 사례를 배치한 그림"
      scenes={SCENES}
      render={(active) => {
        const current = SCENES[active].cell;
        return (
          <div className="mx-auto grid min-w-0 max-w-[620px] grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-xs sm:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)]">
            <span />
            <span className="text-center font-semibold text-muted-foreground">연결 타당</span>
            <span className="text-center font-semibold text-muted-foreground">연결에 구멍</span>
            <span className="self-center font-semibold leading-4 text-muted-foreground">전제 모두 참</span>
            <Cell id="sound" active={current === "sound"} />
            <Cell id="gap" active={current === "gap"} />
            <span className="self-center font-semibold leading-4 text-muted-foreground">거짓 전제 있음</span>
            <Cell id="falsePremise" active={current === "falsePremise"} />
            <Cell id="both" active={current === "both"} />
          </div>
        );
      }}
    />
  );
}
