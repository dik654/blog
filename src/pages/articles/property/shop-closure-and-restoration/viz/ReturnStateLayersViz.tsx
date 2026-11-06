import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names, #comparison — 원상복구는 무조건 빈 콘크리트가 아니라, 입주 상태·계약·나중의 합의가 돌려놓을 선을 정한다.
 * 층의 두께와 선의 위치는 관계를 보이는 그림이며 특정 점포의 판정이 아닙니다.
 */
const SCENES = [
  { label: "흔한 단정", summary: "전부 헐면 끝?", note: "원상복구를 빈 콘크리트로 되돌리는 일로만 읽으면 선이 맨 아래에 그어집니다. 글은 무조건 그런 뜻은 아니라고 설명합니다." },
  { label: "입주 상태를 대조", summary: "입주 때 있던 층 위로", note: "입주할 때 이미 있던 시설은 점주가 나중에 설치한 시설과 구별해 봅니다. 계약이 다르게 정했다면 선은 달라질 수 있습니다." },
  { label: "나중의 합의", summary: "남길 시설과 제거할 시설", note: "임대인과 남길 시설·제거할 시설을 서면으로 맞추면 같은 층 안에서도 갈립니다. 공사 뒤 같은 시설을 두고 추가 비용을 다투는 일을 줄이는 단계입니다." },
  { label: "물려받은 시설", summary: "선의 위치부터 확인", note: "이전 점주가 설치한 시설을 물려받았다면 시설을 받은 상태와 복구 특약을 별도로 확인합니다. 관할 법과 계약 내용에 따라 결론이 달라지므로 여기서 선을 정해 그리지 않았습니다." },
] as const;

type Tone = "keep" | "remove" | "open";

const TONE: Record<Tone, string> = {
  keep: "border-border bg-muted/50",
  remove: "border-dashed border-red-600 text-red-700 dark:text-red-400",
  open: "border-dashed border-amber-600 text-amber-700 dark:text-amber-400",
};

function Layer({ text, tag, tone }: { text: string; tag: string; tone: Tone }) {
  return (
    <div className={`flex min-h-12 min-w-0 flex-1 flex-wrap items-center justify-between gap-x-2 rounded border px-3 py-1.5 text-sm ${TONE[tone]}`}>
      <span className="font-semibold">{text}</span>
      <span className="text-xs">{tag}</span>
    </div>
  );
}

function Line({ show, text, dashed = false }: { show: boolean; text: string; dashed?: boolean }) {
  return (
    <div className="flex h-7 items-center gap-2" aria-hidden={!show}>
      {show && (
        <>
          <span className={`min-w-0 flex-1 border-t ${dashed ? "border-dashed border-amber-600" : "border-primary"}`} />
          <span className={`shrink-0 text-xs font-bold ${dashed ? "text-amber-700 dark:text-amber-400" : "text-primary"}`}>{text}</span>
        </>
      )}
    </div>
  );
}

export default function ReturnStateLayersViz() {
  return (
    <SceneShell
      eyebrow="돌려놓을 선"
      title="어느 층까지 되돌릴지는 무엇이 정할까요"
      description="점포 바닥부터 위로 쌓인 층을 옆에서 본 그림입니다. 선 위는 제거 대상, 선 아래는 남습니다. 층의 두께는 설명용입니다."
      note="입주 상태, 계약, 나중의 합의와 적용 법을 함께 봐야 하며 이 그림은 개별 점포의 복구 범위를 판정하지 않습니다."
      ariaLabel="콘크리트, 입주 때 시설, 점주 설치 시설의 층 위에 돌려놓을 선을 옮겨 보는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[460px]">
          {active === 2 ? (
            /* 같은 층 안에서 선이 계단처럼 꺾입니다. 층 한 칸과 선 자리 한 칸을 그대로 쓰므로 전체 높이는 다른 장면과 같습니다. */
            <div className="relative flex gap-2">
              <div className="mb-1 flex min-w-0 flex-1 flex-col">
                <div className="flex h-6 items-center">
                  <span className="-mr-1 min-w-0 flex-1 border-t border-primary" />
                </div>
                <Layer text="남기기로 합의" tag="남음" tone="keep" />
              </div>
              <span className="absolute bottom-3.5 left-1/2 top-3 border-l border-primary" aria-hidden />
              <div className="flex min-w-0 flex-1 flex-col">
                <Layer text="제거하기로 합의" tag="제거" tone="remove" />
                <div className="-ml-1">
                  <Line show text="돌려놓을 선" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <Layer text="점주가 설치한 시설" tag={active === 3 ? "계약·합의 확인" : "제거"} tone={active === 3 ? "keep" : "remove"} />
              <Line show={active === 1 || active === 3} text={active === 3 ? "여기일까?" : "돌려놓을 선"} dashed={active === 3} />
            </>
          )}
          <Layer
            text={active === 3 ? "이전 점주가 두고 간 시설" : "입주 때 있던 시설"}
            tag={active === 0 ? "제거" : active === 3 ? "받은 상태 확인" : "남음"}
            tone={active === 0 ? "remove" : active === 3 ? "open" : "keep"}
          />
          <Line show={active === 0 || active === 3} text={active === 0 ? "돌려놓을 선?" : "여기일까?"} dashed />
          <Layer text="빈 콘크리트" tag="건물" tone="keep" />
        </div>
      )}
    />
  );
}
