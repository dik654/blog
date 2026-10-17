import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 0.5초 만에 죽는 서비스를 RestartSec 1초와 2초로 재시작할 때 시작 시각을 시간축 위에 찍는다.
 * 한 mechanism: 첫 시작부터 10초 창 안에서 5번까지만 허락한다(StartLimitIntervalSec=10s, StartLimitBurst=5).
 * 주소는 9초에 생긴다(가정). 재시작 간격이 짧을수록 창 안에 시작이 몰려 먼저 한도에 걸린다.
 */
const LABELS = ["가정", "1초: 5번", "1초: 거절", "2초: 4번", "2초: 성공", "망이 끝내 안 오면"] as const;
const X0 = 24;
const PX = 21; // 1초당 px
const tx = (t: number) => X0 + t * PX;

interface Row {
  y: number;
  label: string;
  starts: number[];
  refused?: number;
  okAt?: number;
  windows: [number, number][];
}

interface Scene {
  rows: Row[];
  network: boolean;
  verdict: string;
  note: string;
}

const STARTS_1 = [0, 1.5, 3, 4.5, 6];
const STARTS_2 = [0, 2.5, 5, 7.5];

const SCENE_DATA: readonly Scene[] = [
  {
    rows: [
      { y: 56, label: "RestartSec=1s", starts: [], windows: [[0, 10]] },
      { y: 122, label: "RestartSec=2s", starts: [], windows: [[0, 10]] },
    ],
    network: true,
    verdict: "창 10초, 창 안에서 5번까지",
    note: "(가정) 서비스는 아직 없는 주소에 bind하려다 0.5초 만에 실패합니다. 주소는 부팅 9초에 생깁니다. 회색 띠는 첫 시작부터 10초짜리 셈 창입니다.",
  },
  {
    rows: [
      { y: 56, label: "RestartSec=1s", starts: STARTS_1, windows: [[0, 10]] },
      { y: 122, label: "RestartSec=2s", starts: [], windows: [[0, 10]] },
    ],
    network: true,
    verdict: "0 · 1.5 · 3 · 4.5 · 6초, 5번 허락",
    note: "실행 0.5초와 대기 1초를 더해 1.5초마다 시작 요청이 옵니다. 다섯 번째 요청까지는 창 안 횟수가 5보다 작아 통과합니다.",
  },
  {
    rows: [
      { y: 56, label: "RestartSec=1s", starts: STARTS_1, refused: 7.5, windows: [[0, 10]] },
      { y: 122, label: "RestartSec=2s", starts: [], windows: [[0, 10]] },
    ],
    network: true,
    verdict: "7.5초 여섯째 거절 → failed, 9초의 주소를 못 봄",
    note: "여섯째 요청은 7.5초로 창이 열린 지 10초가 안 됐고 이미 5번을 셌으므로 거절됩니다. 서비스는 start-limit-hit으로 멈추고, 9초에 주소가 생겨도 다시 시작하지 않습니다.",
  },
  {
    rows: [
      { y: 56, label: "RestartSec=1s", starts: STARTS_1, refused: 7.5, windows: [[0, 10]] },
      { y: 122, label: "RestartSec=2s", starts: STARTS_2, windows: [[0, 10]] },
    ],
    network: true,
    verdict: "0 · 2.5 · 5 · 7.5초, 4번째까지 실패",
    note: "대기를 2초로 늘리면 2.5초 간격입니다. 7.5초까지 네 번 시작하고 네 번 모두 주소가 없어 실패합니다.",
  },
  {
    rows: [
      { y: 56, label: "RestartSec=1s", starts: STARTS_1, refused: 7.5, windows: [[0, 10]] },
      { y: 122, label: "RestartSec=2s", starts: STARTS_2, okAt: 10, windows: [[0, 10]] },
    ],
    network: true,
    verdict: "10초 다섯째가 주소를 만나 실행 유지",
    note: "다섯째 시작은 10초입니다. 창 안 다섯 번째라 허락되고, 이미 9초에 주소가 생겼으므로 bind가 성공해 계속 실행됩니다. 더 늦게 재시작한 쪽이 살아남습니다.",
  },
  {
    rows: [
      { y: 56, label: "RestartSec=1s", starts: STARTS_1, refused: 7.5, windows: [[0, 10]] },
      { y: 122, label: "RestartSec=2s", starts: [...STARTS_2, 10, 12.5], windows: [[0, 10], [12.5, 13.5]] },
    ],
    network: false,
    verdict: "12.5초에 창이 새로 열려 끝없이 재시작",
    note: "주소가 끝내 오지 않으면 2.5초 간격은 여섯째가 12.5초라 첫 창(0~10초)을 벗어납니다. 창이 새로 열리고 횟수가 0이 되어 한도에 걸리지 않고 계속 재시작합니다.",
  },
];

function Stack({ items, active, className = "" }: { items: readonly ReactNode[]; active: number; className?: string }) {
  return (
    <div className={`grid ${className}`}>
      {items.map((item, index) => (
        <div key={index} aria-hidden={index !== active} className={`col-start-1 row-start-1 ${index === active ? "" : "invisible"}`}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default function StartLimitViz() {
  const scenes = useAnimatedScenes(SCENE_DATA.length, 4300);
  const active = scenes.active;
  const scene = SCENE_DATA[active];

  return (
    <VizFrame
      eyebrow="StartLimitBurst / IntervalSec"
      title="빨리 재시작할수록 창 안에 시작이 몰려 먼저 멈춥니다"
      description="가로축은 부팅 뒤 초입니다. 작은 막대 하나가 시작 한 번(0.5초 실행 뒤 실패)이고, ×는 한도에 걸려 거절된 시작입니다."
      note="실행 0.5초와 주소 9초는 설명용 가정입니다. 한도 10초·5번과 > 비교는 systemd v249 기본값과 ratelimit.c를 따릅니다. 실제 시각에는 수 ms의 처리 지연이 더해집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="재시작 간격별 시작 시각과 시작 한도"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <p className="text-[11px] font-black text-primary">Scene · {String(active + 1).padStart(2, "0")}</p>
          <Stack active={active} className="mt-2" items={SCENE_DATA.map((s) => <h4 key={s.verdict} className="text-base font-bold">{s.verdict}</h4>)} />

          <svg viewBox="0 0 340 170" role="img" aria-label={scene.verdict} className="mt-3 h-auto w-full max-w-sm">
            {scene.rows.map((row) => (
              <g key={row.label}>
                {row.windows.map(([a, b]) => (
                  <rect key={a} x={tx(a)} y={row.y - 22} width={tx(b) - tx(a)} height={34} className="fill-muted" />
                ))}
                <text x={X0} y={row.y - 28} className="fill-foreground text-[10px]">{row.label}</text>
                <line x1={X0} x2={tx(13.5)} y1={row.y + 12} y2={row.y + 12} className="stroke-border" strokeWidth={1} />
                {row.starts.map((t) => {
                  const ok = row.okAt === t;
                  return (
                    <rect
                      key={t}
                      x={tx(t)}
                      y={row.y - 12}
                      width={ok ? tx(13.5) - tx(t) : 0.5 * PX}
                      height={18}
                      rx={2}
                      className={ok ? "fill-emerald-500/40 stroke-emerald-700" : "fill-primary/30 stroke-primary"}
                      strokeWidth={1}
                    />
                  );
                })}
                {row.refused !== undefined && (
                  <text x={tx(row.refused)} y={row.y + 3} textAnchor="middle" className="fill-rose-600 text-[16px] font-bold">×</text>
                )}
              </g>
            ))}
            {scene.network && (
              <g>
                <line x1={tx(9)} x2={tx(9)} y1={20} y2={140} className="stroke-emerald-700" strokeWidth={1} strokeDasharray="3 3" />
                <text x={tx(9) + 3} y={18} className="fill-emerald-700 text-[10px]">주소 생김 9s</text>
              </g>
            )}
            {[0, 2, 4, 6, 8, 10, 12].map((t) => (
              <g key={t}>
                <line x1={tx(t)} x2={tx(t)} y1={146} y2={150} className="stroke-muted-foreground" strokeWidth={1} />
                <text x={tx(t)} y={162} textAnchor="middle" className="fill-muted-foreground text-[10px]">{t}s</text>
              </g>
            ))}
          </svg>

          <Stack active={active} className="mt-3" items={SCENE_DATA.map((s) => <p key={s.note} className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{s.note}</p>)} />
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} />
      </div>
    </VizFrame>
  );
}
