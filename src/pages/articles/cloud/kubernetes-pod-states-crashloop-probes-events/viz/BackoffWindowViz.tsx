import SceneShell from "./SceneShell";

/**
 * 본문 대응: #backoff-mechanism — doBackOff가 "지금 − FinishedAt < 현재 대기"로 판단하는 창.
 * 장부에 이미 20초가 적힌 상황을 가정한다. sync 시각 8초·23초, 10분 넘게 산 650초는 그림을 위한 가정이다.
 * 판정: 8 < 20 → 안 띄움. 23 ≥ 20 → Next 20×2=40 적고 띄움. 2초 뒤 죽으면 새 FinishedAt 25초, 창 25~65초.
 * 만료: 650 > 600 → 장부를 새로 만들어 10초.
 */
interface Scene {
  label: string;
  summary: string;
  ledger: string;
  ledgerNext: string | null;
  decision: string;
  result: string;
  max: number;
  ticks: readonly number[];
  origin: number;
  window: readonly [number, number] | null;
  sync: number | null;
  extra: number | null;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "창 안에서 확인", summary: "8 < 20 → 띄우지 않음", ledger: "20초", ledgerNext: null, decision: "지금 − FinishedAt = 8초 < 현재 대기 20초", result: "Back-off event를 남기고 이번 sync는 띄우지 않음", max: 70, ticks: [0, 20, 40, 60], origin: 0, window: [0, 20], sync: 8, extra: null, note: "kubelet이 Pod를 다시 살피는 일을 sync라고 합니다. 기준은 kubelet이 확인한 시각이 아니라 컨테이너가 끝난 시각 FinishedAt입니다. 아직 창 안이라 Warning event를 남기고 ErrCrashLoopBackOff를 돌려줍니다." },
  { label: "창 밖에서 확인", summary: "23 ≥ 20 → 40초 적고 띄움", ledger: "20초", ledgerNext: "40초", decision: "지금 − FinishedAt = 23초 ≥ 현재 대기 20초", result: "Next가 장부를 두 배로 적은 뒤 컨테이너를 띄움", max: 70, ticks: [0, 20, 40, 60], origin: 0, window: [0, 20], sync: 23, extra: null, note: "조건이 거짓이면 먼저 Next가 다음 대기를 40초로 적고 그다음 컨테이너를 띄웁니다. 다음 대기는 재시작이 성공한 뒤가 아니라 재시작 직전에 정해집니다." },
  { label: "2초 만에 다시 죽음", summary: "새 FinishedAt부터 40초", ledger: "40초", ledgerNext: null, decision: "새 FinishedAt = 23 + 2 = 25초", result: "창은 25초부터 65초까지, 방금 적어 둔 40초만큼", max: 70, ticks: [0, 20, 40, 60], origin: 25, window: [25, 65], sync: null, extra: null, note: "방금 띄운 컨테이너가 2초 만에 죽으면(3절의 가정) 기준 시각이 새 FinishedAt으로 옮겨 갑니다. 다음 sync부터는 재시작 직전에 적어 둔 40초를 이 시각에서 셉니다." },
  { label: "10분 넘게 살다 죽음", summary: "650 > 600 → 10초부터", ledger: "새 장부", ledgerNext: "10초", decision: "FinishedAt − 마지막 갱신 = 650초 > 600초", result: "장부가 만료되어 10초부터 다시 셈", max: 700, ticks: [0, 200, 400, 600], origin: 650, window: null, sync: null, extra: 600, note: "이번엔 축이 마지막 갱신부터의 시간입니다. 컨테이너가 600초를 넘겨 살다 죽으면 장부를 새로 만들어 10초부터 셉니다. 상한을 100초로 바꿔도 이 600초는 그대로입니다." },
];

/** 장면마다 축의 0이 무엇인지. 앞 셋은 70초, 마지막은 700초 축이다. */
const AXIS_LABELS = ["FinishedAt부터 지난 초", "FinishedAt부터 지난 초", "앞 FinishedAt부터 지난 초", "마지막 갱신부터 지난 초"] as const;

const W = 340;
const LEFT = 12;
const AXIS_W = W - LEFT * 2;
const BASE_Y = 66;

export default function BackoffWindowViz() {
  return (
    <SceneShell
      eyebrow="backoff 창"
      title="다시 띄울지는 FinishedAt에서 잰 창 안인지로 정합니다"
      description="장부는 (Pod UID, 컨테이너 이름)마다 현재 대기와 마지막 갱신 시각을 적어 둡니다. 현재 대기가 20초까지 늘어난 상황을 가정했고 sync 시각과 650초도 가정입니다."
      ariaLabel="FinishedAt 기준 대기 창과 sync 시각, 장부 값의 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sx = (sec: number) => LEFT + (sec / scene.max) * AXIS_W;
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-muted-foreground">장부의 현재 대기</span>
              <span className="rounded border border-border bg-background px-2 py-0.5 font-mono font-bold">{scene.ledger}</span>
              <span className={`font-mono font-bold text-primary ${scene.ledgerNext ? "" : "invisible"}`}>→ {scene.ledgerNext ?? "−"}</span>
            </div>
            <svg viewBox={`0 0 ${W} 100`} className="mx-auto mt-2 h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {scene.window && (
                <>
                  <rect x={sx(scene.window[0])} y={BASE_Y - 22} width={sx(scene.window[1]) - sx(scene.window[0])} height={22} fill="#d97706" opacity={0.25} stroke="#b45309" strokeWidth={1} />
                  <text x={(sx(scene.window[0]) + sx(scene.window[1])) / 2} y={BASE_Y - 7} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">창</text>
                </>
              )}
              {scene.extra !== null && (
                <>
                  <line x1={sx(scene.extra)} x2={sx(scene.extra)} y1={BASE_Y - 30} y2={BASE_Y} stroke="#b45309" strokeWidth={1} strokeDasharray="3 3" />
                  <text x={sx(scene.extra) - 4} y={BASE_Y - 33} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">만료 600초</text>
                </>
              )}
              <line x1={sx(scene.origin)} x2={sx(scene.origin)} y1={BASE_Y - 30} y2={BASE_Y} stroke="#2563eb" strokeWidth={1.25} />
              <text x={sx(scene.origin) + (scene.origin > 500 ? 4 : 0)} y={BASE_Y - 45} textAnchor={scene.origin > 500 ? "end" : "start"} fontSize={11} fontWeight={700} fill="#2563eb">FinishedAt</text>
              {scene.sync !== null && (
                <>
                  <circle cx={sx(scene.sync)} cy={BASE_Y} r={4} fill="#0f766e" />
                  <text x={sx(scene.sync)} y={BASE_Y - 30} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f766e">sync {scene.sync}초</text>
                </>
              )}
              <line x1={LEFT} x2={W - LEFT} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
              {scene.ticks.map((tick) => (
                <g key={tick}>
                  <line x1={sx(tick)} x2={sx(tick)} y1={BASE_Y} y2={BASE_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={sx(tick)} y={BASE_Y + 17} textAnchor="middle" fontSize={11} className="fill-muted-foreground">{tick}</text>
                </g>
              ))}
              <text x={W - LEFT} y={BASE_Y + 31} textAnchor="end" fontSize={11} className="fill-muted-foreground">{AXIS_LABELS[active]}</text>
            </svg>
            <div className="mt-1 rounded-md border border-border bg-background px-3 py-2 text-xs leading-5">
              <p className="font-mono [overflow-wrap:anywhere]">{scene.decision}</p>
              <p className="font-semibold">{scene.result}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
