import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 처음부터 있던 바닥과 점주가 나중에 설치한 바닥이 섞이면 어느 상태로 돌려줄지 다툰다.
 * 왼쪽 = 입주 때 기록, 오른쪽 = 마지막 날 실제. 층의 두께는 설명용입니다.
 */
const SCENES = [
  { label: "입주하는 날", summary: "처음 바닥을 찍어 둡니다", note: "계약 전 사진과 도면에 처음부터 있던 바닥이 남습니다. 새 바닥은 아직 없습니다." },
  { label: "3년 뒤", summary: "바닥이 두 겹", note: "점주가 그 위에 바닥을 새로 설치했습니다. 눈앞에는 맨 위 바닥만 보입니다." },
  { label: "기록이 없으면", summary: "어디까지 걷어 낼까?", note: "무엇이 처음부터 있었는지 증명할 그림이 없으면 어느 상태로 돌려줄지 다툴 수 있습니다." },
  { label: "기록이 있으면", summary: "대조가 정산 기준으로", note: "입주 사진과 대조하면 경계를 짚을 수 있습니다. 이 대조가 마지막 공제액을 판단할 기준이 되며, 실제 복구 범위는 계약과 합의, 적용 법에 따라 판단합니다." },
] as const;

type Tone = "base" | "orig" | "mine" | "unknown" | "none";

const TONE: Record<Tone, string> = {
  base: "border-border bg-muted/70",
  orig: "border-primary bg-primary/10",
  mine: "border-amber-600 text-amber-700 dark:text-amber-400",
  unknown: "border-dashed border-red-600 text-red-700 dark:text-red-400",
  none: "border-dashed border-border/40 text-muted-foreground/40",
};

function Slab({ text, tone }: { text: string; tone: Tone }) {
  return <div className={`flex h-full min-h-12 items-center justify-center rounded border px-1.5 py-1 text-center text-xs font-semibold leading-4 sm:text-sm ${TONE[tone]}`}>{text}</div>;
}

export default function FloorRecordLayersViz() {
  return (
    <SceneShell
      eyebrow="입주 기록"
      title="입주 기록이 왜 마지막 공제액 판단의 기준이 될까요"
      description="바닥을 옆에서 자른 그림입니다. 왼쪽은 입주 때 남긴 기록, 오른쪽은 마지막 날 실제 모습입니다."
      note="이 글의 바닥 예를 그린 것으로, 개별 점포의 복구 범위를 판정하지 않습니다."
      ariaLabel="입주 기록과 마지막 날의 바닥 층을 나란히 놓고 경계를 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const noRecord = active === 2;
        return (
          <div className="mx-auto grid w-full max-w-[520px] grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] gap-x-1 gap-y-1">
            <p className="col-start-1 m-0 pb-1 text-center text-xs font-bold text-muted-foreground sm:text-sm">입주 때 기록</p>
            <p className="col-start-3 m-0 pb-1 text-center text-xs font-bold text-muted-foreground sm:text-sm">마지막 날</p>
            <div className="col-start-1 row-start-2"><Slab text="—" tone="none" /></div>
            <div className="col-start-1 row-start-3"><Slab text={noRecord ? "사진·도면 없음" : "처음 있던 바닥"} tone={noRecord ? "none" : "orig"} /></div>
            <div className="col-start-1 row-start-4"><Slab text="건물" tone={noRecord ? "none" : "base"} /></div>
            {/* 표시는 2·3행 사이 틈(gap-y-1의 가운데)에 놓여 층 경계와 언제나 같은 높이입니다. */}
            <div className="relative col-start-2 row-start-3">
              {active === 3 && <span className="absolute inset-x-0 -top-0.5 border-t border-primary" />}
              {noRecord && <span className="absolute inset-x-0 -top-0.5 border-t border-dashed border-red-600" />}
              {(active === 3 || noRecord) && <span className={`absolute inset-x-0 top-1 text-center text-sm font-bold ${noRecord ? "text-red-700 dark:text-red-400" : "text-primary"}`}>{noRecord ? "?" : "대조"}</span>}
            </div>
            <div className="col-start-3 row-start-2">{active === 0 ? <Slab text="아직 없음" tone="none" /> : <Slab text={noRecord ? "바닥 (누가 설치?)" : "점주가 설치한 바닥"} tone={noRecord ? "unknown" : "mine"} />}</div>
            <div className="col-start-3 row-start-3">{active === 0 ? <Slab text="처음 있던 바닥" tone="orig" /> : <Slab text={noRecord ? "바닥 (누가 설치?)" : "처음 있던 바닥"} tone={noRecord ? "unknown" : "orig"} />}</div>
            <div className="col-start-3 row-start-4"><Slab text="건물" tone="base" /></div>
          </div>
        );
      }}
    />
  );
}
