import LsmSceneShell from "./LsmSceneShell";

/**
 * 본문 대응: #write-path — "WAL에 썼다"와 "전원 손실 뒤에도 남는다"의 차이.
 * 칸 셋 = 프로세스 메모리 · 운영체제 버퍼 · persistent storage. 장애가 지우는 칸을 표시합니다.
 * non-sync: 프로세스 종료는 복구 가능, 전원 손실은 최근 변경 손실 가능.
 * sync=true: 반환 전 persistent storage까지 밀어내도록 요청. WAL 끔: flush 전 프로세스 종료에도 손실 가능.
 */
type Layer = 0 | 1 | 2;

const LAYERS = [
  { name: "프로세스 메모리", hint: "프로세스가 죽으면 사라짐" },
  { name: "운영체제 버퍼", hint: "장비 전원이 꺼지면 사라짐" },
  { name: "Persistent storage", hint: "전원 손실 뒤에도 남는 저장 장치" },
] as const;

const SCENES = [
  {
    label: "non-sync write 반환",
    summary: "WAL은 OS 버퍼까지",
    memtable: true,
    wal: 1 as Layer | null,
    wiped: [] as readonly Layer[],
    verdict: "아직 장애 없음",
    tone: "neutral",
    note: "Non-sync write는 WAL record를 운영체제 버퍼에 넘긴 뒤 반환할 수 있습니다. 그 순간 Put(A, 7)@41의 memtable 항목은 프로세스 메모리에, WAL record는 운영체제 버퍼에 있고 저장 장치에 닿았다고 볼 근거는 아직 없습니다.",
  },
  {
    label: "프로세스만 종료",
    summary: "OS 버퍼의 WAL로 복구",
    memtable: true,
    wal: 1 as Layer | null,
    wiped: [0] as readonly Layer[],
    verdict: "복구할 수 있음",
    tone: "good",
    note: "프로세스가 죽으면 memtable은 사라지지만 운영체제 버퍼의 WAL record는 남습니다. 재시작 뒤 이 WAL을 다시 적용해 A@41을 되살릴 수 있습니다.",
  },
  {
    label: "장비 전원 손실",
    summary: "최근 변경 손실 가능",
    memtable: true,
    wal: 1 as Layer | null,
    wiped: [0, 1] as readonly Layer[],
    verdict: "최근 변경이 사라질 수 있음",
    tone: "bad",
    note: "전원이 꺼지면 운영체제 버퍼도 함께 사라집니다. 성공 응답을 받았어도 저장 장치에 닿지 않은 최근 WAL 변경은 복구 근거가 없어질 수 있습니다.",
  },
  {
    label: "sync=true",
    summary: "반환 전 저장 장치까지 요청",
    memtable: true,
    wal: 2 as Layer | null,
    wiped: [0, 1] as readonly Layer[],
    verdict: "저장 장치의 WAL로 재생",
    tone: "good",
    note: "sync=true는 반환 전에 WAL을 persistent storage까지 밀어내는 경계를 요청합니다. 같은 전원 손실이 와도 그 경계까지 내려간 WAL record가 재생 근거로 남습니다.",
  },
  {
    label: "WAL을 끈 write",
    summary: "memtable에만 존재",
    memtable: true,
    wal: null as Layer | null,
    wiped: [0] as readonly Layer[],
    verdict: "flush 전이면 잃을 수 있음",
    tone: "bad",
    note: "WAL을 끄면 복구 기록 자체가 없습니다. Memtable이 SSTable로 flush되기 전에 프로세스만 죽어도 A@41은 잃을 수 있습니다.",
  },
] as const;

const TONE = {
  neutral: "border-border text-muted-foreground",
  good: "border-emerald-600 text-emerald-700 dark:text-emerald-300",
  bad: "border-rose-600 text-rose-700 dark:text-rose-300",
} as const;

function Chip({ text, lost }: { text: string; lost: boolean }) {
  return (
    <span
      className={`block break-keep rounded-md border px-2 py-1.5 text-center font-mono text-[11px] leading-4 ${
        lost ? "border-dashed border-rose-600 text-rose-700 line-through dark:text-rose-300" : "border-primary/60 bg-background text-foreground"
      }`}
    >
      {text}
    </span>
  );
}

export default function WalDurabilityViz() {
  return (
    <LsmSceneShell
      eyebrow="쓰기 경계 · 장애가 지우는 층"
      title="“WAL에 썼다”는 기록이 어느 층에 있는지까지 봐야 합니다"
      description="세 칸은 기록이 머무를 수 있는 층입니다. 장애가 지우는 칸은 점선으로 바뀝니다. Put(A, 7)@41은 본문의 설명용 예이며, 다섯 장면 모두 같은 write를 다른 조건에서 봅니다."
      ariaLabel="non-sync, sync, WAL 끔 조건에서 프로세스 종료와 전원 손실이 각각 어느 층의 기록을 지우는지 보여 주는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const wiped = new Set<Layer>(scene.wiped);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2">
              {LAYERS.map((layer, index) => {
                const layerIndex = index as Layer;
                const gone = wiped.has(layerIndex);
                const items = [
                  ...(layerIndex === 0 && scene.memtable ? ["memtable A@41"] : []),
                  ...(scene.wal === layerIndex ? ["WAL A@41"] : []),
                ];
                return (
                  <div
                    key={layer.name}
                    className={`flex min-h-[9.5rem] min-w-0 flex-col rounded-lg border p-2 ${gone ? "border-dashed border-rose-600/70" : "border-border bg-background"}`}
                  >
                    <strong className="break-keep text-[11px] leading-4 sm:text-xs">{layer.name}</strong>
                    <span className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground">{layer.hint}</span>
                    <div className="mt-auto space-y-1.5 pt-2">
                      {items.map((item) => (
                        <Chip key={item} text={item} lost={gone} />
                      ))}
                      {gone ? <span className="block text-center text-[10px] font-bold text-rose-700 dark:text-rose-300">이 층 사라짐</span> : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className={`mt-3 rounded-lg border px-3 py-2 text-center text-sm font-bold ${TONE[scene.tone]}`}>{scene.verdict}</p>
          </div>
        );
      }}
    />
  );
}
