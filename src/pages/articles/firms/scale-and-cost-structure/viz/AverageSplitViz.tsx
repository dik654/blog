import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — B를 그대로 두고 수량만 늘려도 평균이 7에서 4.6으로 내려가는 이유.
 * 하나당 평균 = 준비 비용 ÷ 수량 + 하나당 추가 비용. B 20개: 3+4=7, B 100개: 0.6+4=4.6, C 100개: 3+1=4.
 */
const ROWS = [
  { name: "B · 20개", setup: 60, unit: 4, n: 20 },
  { name: "B · 100개", setup: 60, unit: 4, n: 100 },
  { name: "C · 100개", setup: 300, unit: 1, n: 100 },
] as const;

const MAX = 8;
const SHARE_COLOR = "#d97706";
const UNIT_COLOR = "#2563eb";

const SCENES = [
  {
    label: "B로 20개",
    summary: "140 ÷ 20 = 7",
    shown: 1,
    note: "평균은 전체 비용을 개수로 나눈 값입니다. 처음 쓰는 60을 20개가 나눠 하나당 3을 맡고, 부품마다 쓰는 4를 더해 7입니다.",
  },
  {
    label: "B 그대로 100개",
    summary: "460 ÷ 100 = 4.6",
    shown: 2,
    note: "설비도 부품마다 쓰는 4도 그대로입니다. 같은 60을 100개가 나누면서 하나당 몫이 3에서 0.6으로 줄어 평균이 2.4 내려갔습니다.",
  },
  {
    label: "100개에서 C로 바꾸면",
    summary: "400 ÷ 100 = 4",
    shown: 3,
    note: "C는 300을 100개가 나눠 하나당 3을 맡지만 부품마다 1만 씁니다. 같은 100개에서 B의 4.6보다 0.6 낮습니다. 이 0.6은 방법을 바꾼 변화입니다.",
  },
  {
    label: "두 변화를 나눠 읽기",
    summary: "7 → 4 = 2.4 + 0.6",
    shown: 3,
    note: "20개의 B에서 100개의 C까지 평균은 3 내려갑니다. 먼저 B 안에서 수량을 늘린 뒤 방법을 바꾸는 순서로 나누면 2.4는 같은 방법의 배분, 0.6은 방법 변경입니다. 정한 범위 안에서 생산 여력이 충분하다는 가정의 계산입니다.",
  },
] as const;

function fmt(value: number) {
  return Number(value.toFixed(2)).toString();
}

function Row({ row, visible, delta }: { row: (typeof ROWS)[number]; visible: boolean; delta: string | null }) {
  const share = row.setup / row.n;
  const total = share + row.unit;
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-x-2 gap-y-1 text-xs sm:grid-cols-[6rem_minmax(0,1fr)] sm:text-sm">
      <span className={visible ? "font-bold" : "text-muted-foreground/50"}>{row.name}</span>
      <div className="flex h-5 min-w-0 rounded-sm bg-muted/40">
        {visible ? (
          <>
            <div className="h-full" style={{ width: `${(share / MAX) * 100}%`, backgroundColor: SHARE_COLOR }} />
            <div className="h-full" style={{ width: `${(row.unit / MAX) * 100}%`, backgroundColor: UNIT_COLOR }} />
          </>
        ) : null}
      </div>
      <span />
      <span className={`font-mono ${visible ? "" : "invisible"}`}>
        {row.setup} ÷ {row.n} + {row.unit} = {fmt(share)} + {row.unit} = <b>{fmt(total)}</b>
        {delta ? <span className="block font-bold text-primary">{delta}</span> : null}
      </span>
    </div>
  );
}

export default function AverageSplitViz() {
  return (
    <SceneShell
      eyebrow="평균의 두 부분"
      title="부품마다 쓰는 돈은 그대로인데 평균이 내려가는 이유"
      description="막대 하나가 부품 하나의 평균 비용입니다. 주황은 처음 쓰는 준비 비용을 개수로 나눈 몫, 파랑은 부품을 하나 더 만들 때 드는 추가 비용입니다."
      note="(가정) 같은 화폐 단위의 설명용 숫자입니다. 2.4와 0.6은 B 안의 변화를 먼저 계산한 순서로 나눈 값입니다."
      ariaLabel="B와 C의 하나당 평균 비용을 준비 비용 몫과 추가 비용으로 나눈 막대"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: SHARE_COLOR }} />준비 비용 ÷ 개수</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: UNIT_COLOR }} />하나당 추가 비용</span>
            </div>
            {ROWS.map((row, r) => (
              <Row
                key={row.name}
                row={row}
                visible={r < scene.shown}
                delta={index === 3 && r === 1 ? "−2.4 같은 방법" : index === 3 && r === 2 ? "−0.6 방법 변경" : null}
              />
            ))}
          </div>
        );
      }}
    />
  );
}
