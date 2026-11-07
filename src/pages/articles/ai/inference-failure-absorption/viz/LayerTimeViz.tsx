import SceneShell from "./SceneShell";

/**
 * 본문 대응: #time-constants — 층마다 흡수 시간의 단위가 다르고, 빠른 층의 일을 느린 층에 미루면 그 차이만큼 요청이 떨어진다.
 * 칸은 단위 이름일 뿐 눈금이 아니다. 글이 측정값을 주지 않았으므로 칸 안의 위치에 뜻을 두지 않는다.
 */
const UNITS = ["밀리초", "초", "분", "시간"] as const;

const ROWS = [
  { name: "파드 고르기", from: 1, span: 1, tag: "요청 경로 안" },
  { name: "게이트웨이 fallback", from: 2, span: 1, tag: "" },
  { name: "엣지 우회", from: 2, span: 2, tag: "" },
  { name: "재스케줄", from: 3, span: 1, tag: "요청 경로 밖" },
  { name: "새 클러스터", from: 4, span: 1, tag: "요청 경로 밖" },
] as const;

interface Scene {
  label: string;
  summary: string;
  note: string;
  lit: readonly number[];
}

const SCENES: readonly Scene[] = [
  { label: "파드 고르기", summary: "밀리초", lit: [0], note: "같은 클러스터 안에서 다른 파드로 보냅니다. 요청 경로 안에서 일어나지만 대신할 파드가 같은 클러스터에 있을 때만 됩니다." },
  { label: "게이트웨이 fallback", summary: "초", lit: [1], note: "fallback은 다른 곳으로 넘기는 일입니다. 리전 안의 다른 클러스터나 인접 리전, 외부로 넘깁니다. 상주 제약(요청을 정해진 지역에 두는 조건)이 걸린 요청은 넘길 곳이 없으면 넘기지 않습니다." },
  { label: "엣지 우회", summary: "초~분", lit: [2], note: "리전 자체를 바꿉니다. Anycast(같은 주소를 여러 곳이 받는 방식)면 빠르고 DNS면 전파 시간이 붙습니다. DNS 방식은 느린 대신 새 연결만 옮기므로 진행 중인 스트림을 끊지 않습니다." },
  { label: "재스케줄과 프로비저닝", summary: "분~시간", lit: [3, 4], note: "중앙이 배치를 다시 계산해 파드를 옮기는 데는 분, 새 클러스터를 띄우는 데는 시간이 걸립니다. 요청 경로 밖이라 이 층이 멈춰도 요청은 흐릅니다." },
  { label: "빠른 층의 일을 미루면", summary: "밀리초 → 분", lit: [0, 3], note: "밀리초 안에 대신할 수 있는 것을 분 단위 층에 맡기면 그 시간만큼 요청이 떨어집니다. 어느 층이 맡을지는 그 층이 흡수에 걸리는 시간이 장애가 만드는 손해보다 짧은지로 정합니다." },
];

const ACCENT = "#2563eb";
const LOSS = "#dc2626";
const GRID = "grid grid-cols-[5.75rem_repeat(4,minmax(0,1fr))] items-center gap-x-1 sm:grid-cols-[9.5rem_repeat(4,minmax(0,1fr))]";

export default function LayerTimeViz() {
  return (
    <SceneShell
      eyebrow="계층별 흡수 시간"
      title="흡수하는 층이 바뀌면 시간의 단위가 자릿수로 바뀝니다"
      description="가로 네 칸은 단위 이름이고 눈금이 아닙니다. 칸 안의 길이와 위치는 측정값이 아니며 막대는 그 층의 단위가 어느 칸에 속하는지만 보여 줍니다."
      ariaLabel="파드, 게이트웨이, 엣지, 재스케줄, 새 클러스터 층의 흡수 시간 단위"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const deferred = active === SCENES.length - 1;
        return (
          <div className="min-w-0">
            <div className={GRID}>
              <span />
              {UNITS.map((unit) => (
                <span key={unit} className="border-b border-border pb-1 text-center text-xs font-bold text-muted-foreground">{unit}</span>
              ))}
            </div>
            <div className="mt-2 space-y-2">
              {ROWS.map((row, index) => {
                const on = scene.lit.includes(index);
                return (
                  <div key={row.name} className={GRID}>
                    <span className={`min-w-0 text-xs leading-4 ${on ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                      {row.name}
                      {row.tag && <span className="block text-[11px] font-normal text-muted-foreground">{row.tag}</span>}
                    </span>
                    <span className="h-7 rounded-sm" style={{ gridColumn: `${row.from + 1} / span ${row.span}`, gridRow: 1, backgroundColor: on ? ACCENT : "#94a3b8", opacity: on ? 1 : 0.3 }} />
                    {deferred && index === 0 && (
                      <span className="flex h-7 items-center justify-center rounded-sm border border-dashed text-[11px] font-bold" style={{ gridColumn: "3 / span 2", gridRow: 1, borderColor: LOSS, color: LOSS }}>
                        요청이 떨어짐
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
