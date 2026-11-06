import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 연간 예상 손실에는 다양한 사건의 확률과 손실이 함께 필요하다.
 * 이 글이 정한 값은 "이번 홍수의 손실 60"뿐이다. 나머지는 ?로 두고 값을 지어내지 않는다.
 * 사건을 셋으로 나눈 것은 설명용 가정이다.
 */
const ROWS = [
  { name: "더 작은 사건", loss: "?" },
  { name: "이번 홍수", loss: "60" },
  { name: "더 큰 사건", loss: "?" },
] as const;

const SCENES = [
  { label: "60이 아는 전부입니다", summary: "확률 없는 칸 하나", need: false, shift: false, note: "60은 홍수가 이미 일어났다는 조건의 직접 자산 손실입니다. 표에서 숫자가 있는 칸은 이 하나뿐이고, 이 사건이 한 해에 얼마나 자주 나는지는 여기 없습니다." },
  { label: "연간 예상 손실에 필요한 것", summary: "사건마다 확률 × 손실을 더함", need: true, shift: false, note: "연간 예상 손실은 각 사건의 발생확률과 그 사건의 손실을 곱해 더한 값입니다. 그래서 다양한 사건의 확률과 손실을 함께 알아야 하며, 이번 사건의 손실 60만으로 연 보험료나 대출 손실률을 정할 수 없습니다." },
  { label: "칸의 값도 움직입니다", summary: "과거 값이 그대로일까", need: true, shift: true, note: "같은 지역에 건물이 늘면 노출이 커지고, 배수 시설이 낡거나 보강되면 취약성이 바뀌어 손실 칸이 달라집니다. 기후 변화까지 있으면 과거 발생 빈도가 미래를 그대로 대표하지 않을 수 있어 확률 칸도 달라질 수 있습니다." },
] as const;

export default function ExpectedLossViz() {
  return (
    <SceneShell
      eyebrow="한 번의 손실과 한 해의 기대값"
      title="손실 60은 표의 한 칸일 뿐입니다"
      description="줄 하나가 사건 하나입니다. 사건을 셋으로 나눈 것은 설명용이며(가정), 물음표는 이 글에 값이 없는 칸입니다."
      ariaLabel="사건별 확률과 손실 표에서 60이 차지하는 칸"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const cell = "flex min-h-11 items-center justify-center rounded-lg border px-1 text-sm leading-5";
        const unknown = `border-dashed ${s.need ? "border-primary font-bold text-primary" : "border-border text-muted-foreground"}`;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-1.5 text-xs leading-5 text-muted-foreground">
              <span>사건</span>
              <span className="text-center">한 해의 확률<span className={`block ${s.shift ? "font-bold text-primary" : "invisible"}`}>← 기후</span></span>
              <span className="text-center">손실<span className={`block ${s.shift ? "font-bold text-primary" : "invisible"}`}>← 노출·취약성</span></span>
            </div>
            <div className="mt-1 space-y-1.5">
              {ROWS.map((row) => (
                <div key={row.name} className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-1.5">
                  <span className="flex items-center text-sm leading-5">{row.name}</span>
                  <span className={`${cell} ${unknown}`}>?</span>
                  <span className={`${cell} ${row.loss === "60" ? "border-primary bg-primary/10 font-bold" : unknown}`}>{row.loss}</span>
                </div>
              ))}
            </div>
            <p className={`mt-2 rounded-lg border border-border px-3 py-2 text-center text-sm font-bold leading-6 ${s.need ? "" : "invisible"}`}>
              연간 예상 손실 = (확률 × 손실)의 합
            </p>
          </div>
        );
      }}
    />
  );
}
