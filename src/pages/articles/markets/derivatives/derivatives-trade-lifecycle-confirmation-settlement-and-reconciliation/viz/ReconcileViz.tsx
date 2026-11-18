import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 확인은 체결 직후 한 거래의 조건을 합의하고, 대사는 살아 있는 거래 전체를
 * 주기적으로 비교한다. 나중의 수정이 한쪽에만 반영되거나 시장자료가 갈라지면 다시 틀어진다.
 * #names 용어 예시의 "100건 중 두 건의 차이"를 칸으로 그린다. 어느 칸이 틀어지는지는 가정이다.
 */
const TOTAL = 100;
const NEW_TRADE = 99;
const AMENDED = 36;
const MARKET = 81;

const STEPS = ["체결·확인", "대사 1회", "수정·자료 차이", "대사 2회", "해결"] as const;

const SCENES = [
  { label: "확인: 새 거래 한 건", summary: "한 건의 조건 합의", note: "체결 직후 확인은 방금 생긴 거래 한 건의 조건을 양쪽이 같은 내용으로 받아들이는 절차입니다. 나머지 99건은 이 확인의 대상이 아닙니다(살아 있는 거래 100건은 가정)." },
  { label: "대사 1회: 전체를 비교", summary: "100건 존재·조건·평가 비교", note: "대사는 살아 있는 거래 전체의 존재와 주요 조건·평가액을 정해진 주기로 상대 장부와 비교합니다. 이번에는 차이가 없었다고 놓았습니다(가정)." },
  { label: "나중에 다시 틀어집니다", summary: "확인 표시는 그대로", note: "한 거래의 수정이 A 장부에만 반영되고, 다른 한 거래는 양쪽 시장자료가 갈라졌습니다(가정). 두 거래 모두 처음 확인을 마친 상태라 확인 표시만 보면 아무 문제가 없어 보입니다." },
  { label: "대사 2회: 두 건 경보", summary: "100건 중 2건 차이", note: "다음 대사가 100건을 다시 비교해 두 건의 차이를 찾습니다. 첫 확인이 끝났다는 표시가 이후 대사를 대신하지 못하는 이유입니다." },
  { label: "원인을 고쳐 일치를 기록", summary: "경보 2 · 해결 2 따로 기록", note: "차이를 찾은 경보와, 원인을 고쳐 장부가 다시 일치한 상태를 따로 기록합니다. 경보만 있고 해결 기록이 없으면 아직 끝난 것이 아닙니다." },
] as const;

function cellColor(index: number, active: number) {
  const broken = index === AMENDED || index === MARKET;
  if (active === 0) return index === NEW_TRADE ? { fill: "#2563eb", border: "#2563eb" } : { fill: "transparent", border: "#e2e8f0" };
  if (active === 1) return { fill: "#bbf7d0", border: "#86efac" };
  if (active === 2) return broken ? { fill: "#bbf7d0", border: "#dc2626", dashed: true } : { fill: "#bbf7d0", border: "#86efac" };
  if (active === 3) return broken ? { fill: "#dc2626", border: "#dc2626" } : { fill: "#bbf7d0", border: "#86efac" };
  return broken ? { fill: "#15803d", border: "#15803d" } : { fill: "#bbf7d0", border: "#86efac" };
}

export default function ReconcileViz() {
  return (
    <SceneShell
      eyebrow="확인과 대사"
      title="확인은 한 건을 한 번, 대사는 전체를 주기마다 봅니다"
      description="칸 하나가 살아 있는 거래 한 건이며 100건은 글의 용어 예시를 따른 가정입니다. 어느 거래가 틀어지는지도 설명용 가정입니다."
      ariaLabel="거래 100건 중 새 거래 한 건을 확인하고, 대사로 전체를 비교하며, 나중에 틀어진 두 건을 다음 대사에서 찾아 고치는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <ol className="grid grid-cols-5 gap-1">
            {STEPS.map((step, index) => (
              <li key={step} className="min-w-0 text-center">
                <div className="h-1.5 rounded-sm" style={{ backgroundColor: index === active ? "#2563eb" : index < active ? "#93c5fd" : "#e2e8f0" }} />
                <span className={`mt-1 block break-keep text-[11px] leading-4 ${index === active ? "font-bold" : index < active ? "" : "text-muted-foreground/60"}`}>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 grid min-w-0 grid-cols-1 items-start gap-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            <div className="mx-auto grid w-full max-w-[11rem] grid-cols-10 sm:max-w-[15rem] gap-[3px]" role="img" aria-label={`거래 ${TOTAL}건: ${SCENES[active].summary}`}>
              {Array.from({ length: TOTAL }, (_, index) => {
                const color = cellColor(index, active);
                return (
                  <span
                    key={index}
                    className="aspect-square rounded-[2px] border"
                    style={{ backgroundColor: color.fill, borderColor: color.border, borderStyle: "dashed" in color && color.dashed ? "dashed" : "solid" }}
                  />
                );
              })}
            </div>
            <div className="grid min-w-0 grid-cols-3 gap-2 text-center text-xs sm:grid-cols-1 sm:text-left">
              <div className="rounded-lg border border-border px-2 py-2">
                <span className="block text-muted-foreground">이번 단계가 보는 거래</span>
                <span className="block font-mono text-sm font-bold">{active === 0 ? "1건" : active === 2 ? "−" : active === 4 ? "2건" : `${TOTAL}건`}</span>
              </div>
              <div className="rounded-lg border border-border px-2 py-2">
                <span className="block text-muted-foreground">경보</span>
                <span className="block font-mono text-sm font-bold" style={{ color: active >= 3 ? "#b91c1c" : undefined }}>{active >= 3 ? "2건" : "0건"}</span>
              </div>
              <div className="rounded-lg border border-border px-2 py-2">
                <span className="block text-muted-foreground">해결 기록</span>
                <span className="block font-mono text-sm font-bold" style={{ color: active === 4 ? "#15803d" : undefined }}>{active === 4 ? "2건" : "0건"}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-[2px] align-middle" style={{ backgroundColor: "#2563eb" }} />방금 확인한 거래</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-[2px] align-middle" style={{ backgroundColor: "#bbf7d0" }} />대사에서 일치</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-[2px] border border-dashed align-middle" style={{ borderColor: "#dc2626" }} />틀어졌지만 아직 모름</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-[2px] align-middle" style={{ backgroundColor: "#dc2626" }} />대사 경보</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-[2px] align-middle" style={{ backgroundColor: "#15803d" }} />원인 고쳐 일치</span>
          </div>
        </div>
      )}
    />
  );
}
