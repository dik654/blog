import SceneShell from "./SceneShell";

/**
 * 본문 대응: #view-recovery 둘째 문단 "같은 순번과 상태 해시에 CHECKPOINT 2f+1개가 모이면 안정된 체크포인트가 됩니다. 그때 낮은
 * watermark를 올리고 이전 기록을 정리할 수 있습니다. 상태 자체를 잃은 복제본은 인증된 상태를 다시 받은 뒤 해시를 확인하고,
 * 체크포인트 이후 요청을 재생해야 합니다."
 * 체크포인트 순번 100은 위 복구 그림과 같은 값이고, 현재 순번 130은 설명용 가정입니다. n=4, f=1이므로 2f+1 = 3.
 */
const MAX = 140;
const CHECKPOINT = 100;
const CURRENT = 130;
const LEFT = 20;
const RIGHT = 340;
const x = (seq: number) => LEFT + (seq / MAX) * (RIGHT - LEFT);

type Scene = {
  label: string;
  summary: string;
  note: string;
  votes: number;
  low: number;
  restore: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "기록이 쌓입니다",
    summary: "1 … 130번의 프로토콜 기록",
    note: "요청마다 PRE-PREPARE·PREPARE·COMMIT 기록이 남습니다. 지울 기준이 없으면 이 기록은 계속 늘어납니다. 현재 130번까지 처리했다고 가정합니다.",
    votes: 0,
    low: 0,
    restore: false,
  },
  {
    label: "CHECKPOINT 모으기",
    summary: "(100, 상태 해시) 3개 = 2f+1",
    note: "100번까지 실행한 뒤의 상태 해시를 담은 CHECKPOINT를 서로 다른 복제본 3대에서 받습니다. n=4, f=1에서 2f+1 = 3이므로 100번이 안정된 체크포인트가 됩니다.",
    votes: 3,
    low: 0,
    restore: false,
  },
  {
    label: "Low watermark 이동",
    summary: "0 → 100 · 100 이하 정리 가능",
    note: "Low watermark를 100으로 올립니다. 점선이 된 100번 이하의 프로토콜 기록은 지울 수 있고, 101번부터 130번까지는 그대로 둡니다.",
    votes: 3,
    low: CHECKPOINT,
    restore: false,
  },
  {
    label: "상태를 잃은 복제본",
    summary: "100번 상태 받기 → 해시 확인 → 101…130 재생",
    note: "상태 자체를 잃은 복제본은 100번 시점의 인증된 상태를 받아 안정된 체크포인트의 해시와 같은지 확인한 뒤, 101번부터 요청을 다시 실행해 따라잡습니다. 로컬 스냅샷 하나만 믿지 않습니다.",
    votes: 3,
    low: CHECKPOINT,
    restore: true,
  },
];

export default function WatermarkViz() {
  return (
    <SceneShell
      eyebrow="체크포인트와 watermark · n=4, f=1"
      title="안정된 체크포인트가 생기면 그 아래 기록을 정리할 수 있습니다"
      description="가로줄은 sequence 번호입니다. Low watermark는 복제본이 아직 프로토콜 기록을 지키는 순번 범위의 아래쪽 끝입니다. 체크포인트 100은 위 복구 그림과 같고, 현재 순번 130은 가정입니다."
      ariaLabel="안정 체크포인트, low watermark 이동, 상태 복구 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const low = scene.low;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={LEFT} y={20} fontSize={12} fontWeight={700} fill="#64748b">프로토콜 기록</text>
              {low > 0 && <rect x={x(1)} y={30} width={x(low) - x(1)} height={18} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />}
              <rect x={x(low + 1)} y={30} width={x(CURRENT) - x(low + 1)} height={18} rx={3} fill="#64748b" opacity={0.75} />
              {low > 0 && (
                <text x={(x(1) + x(low)) / 2} y={43} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">정리 가능</text>
              )}
              <line x1={LEFT} x2={RIGHT} y1={62} y2={62} stroke="#94a3b8" strokeWidth={1} />
              {[0, 50, 100, 130].map((seq) => (
                <g key={seq}>
                  <line x1={x(seq)} x2={x(seq)} y1={58} y2={66} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(seq)} y={79} textAnchor="middle" fontSize={12} fill="#64748b">{seq === CURRENT ? "130 현재" : seq}</text>
                </g>
              ))}
              <g opacity={scene.votes > 0 ? 1 : 0}>
                <line x1={x(CHECKPOINT)} x2={x(CHECKPOINT)} y1={26} y2={66} stroke="#2563eb" strokeWidth={1.25} />
                <text x={x(CHECKPOINT) - 4} y={20} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">안정 체크포인트</text>
              </g>
              <g>
                <polygon points={`${x(low)},${86} ${x(low) - 5},${95} ${x(low) + 5},${95}`} fill="#d97706" />
                <text x={x(low)} y={107} textAnchor={low > 0 ? "middle" : "start"} fontSize={12} fontWeight={700} fill="#b45309">
                  {`low watermark ${low}`}
                </text>
              </g>
              <g opacity={scene.restore ? 1 : 0}>
                <text x={LEFT} y={128} fontSize={12} fontWeight={700} fill="#475569">상태를 잃은 복제본</text>
                <rect x={x(CHECKPOINT) - 4} y={118} width={8} height={14} rx={2} fill="#2563eb" />
                <line x1={x(CHECKPOINT) + 6} x2={x(CURRENT)} y1={125} y2={125} stroke="#2563eb" strokeWidth={1.25} />
                <polygon points={`${x(CURRENT)},${125} ${x(CURRENT) - 6},${121} ${x(CURRENT) - 6},${129}`} fill="#2563eb" />
                <text x={(x(CHECKPOINT) + x(CURRENT)) / 2} y={143} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">101…130 재생</text>
              </g>
            </svg>
            <div className="grid min-w-0 grid-cols-[repeat(3,minmax(0,1fr))_auto] items-center gap-1.5 rounded-lg border border-border bg-background p-2.5 text-[11px]">
              {[0, 1, 2].map((slot) => (
                <span
                  key={slot}
                  className={`rounded border px-1 py-1 text-center font-semibold ${slot < scene.votes ? "border-[#2563eb]" : "border-dashed text-muted-foreground/60"}`}
                >
                  {slot < scene.votes ? "(100, 해시)" : "아직 없음"}
                </span>
              ))}
              <span className={`pl-1 font-bold ${scene.votes >= 3 ? "text-foreground" : "text-muted-foreground/60"}`}>{`${scene.votes} / 2f+1 = 3`}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
