import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — CDNA3 LDS의 bank 구조와 CDNA4 수치.
 * 세로줄 하나 = bank, 칸 하나 = 32비트 항목. 512개 중 일부만 그렸습니다.
 * 32×512×4 = 65,536바이트(64KB), 32×4 = 128바이트/클록. CDNA4는 160KB·256바이트/클록이며 bank 수는 백서에 없습니다.
 */
const SCENES = [
  { label: "칸 세기", summary: "32 × 512 × 4 = 65,536바이트", note: "CDNA3까지의 LDS입니다. bank 32개에 항목이 512개씩이라 16,384칸이고, 칸마다 4바이트이므로 65,536바이트, 곧 64KB입니다." },
  { label: "한 클록에 읽기", summary: "32 × 4 = 128바이트", note: "bank 하나가 한 번에 32비트, 곧 4바이트를 읽습니다. 32개 bank가 한 클록에 함께 읽으면 128바이트입니다." },
  { label: "같은 bank를 원하면", summary: "접근이 나뉠 수 있습니다", note: "서로 다른 주소가 동시에 같은 bank 자원을 요구하면 접근이 나뉠 수 있습니다. 그림의 bank 위치는 설명을 위해 고른 것으로, 실제 주소 배치가 아닙니다." },
  { label: "CDNA4로 오면", summary: "160KB · 클록당 256바이트", note: "CDNA4 백서는 bank 수를 늘려 용량을 160KB로, 읽기를 클록당 256바이트로 키웠다고 적지만 정확한 bank 수는 적지 않습니다. 그래서 CDNA3 규칙을 대입하지 않고 ISA 문서와 측정으로 확인합니다." },
] as const;

const W = 340;
const H = 196;
const X0 = 10;
const PITCH = 10;
const COL_W = 9;
const Y0 = 32;
const ROW = 15;
const RENDER_ROWS = [0, 1, 2, 3, 4, 5, 6] as const;
const BANKS = Array.from({ length: 32 }, (_, id) => id);
const BLUE = "#2563eb";
const MUTED = "#64748b";
const LINE = "#94a3b8";

/** 일곱 번째 줄은 마지막 항목(511)을 뜻하고, 그 앞 틈이 생략 표시입니다. */
const rowY = (row: number) => Y0 + row * ROW + (row === 6 ? 22 : 0);
const CONFLICT_BANK = 12;

function Bar({ y, label, value, width, text }: { y: number; label: string; value: string; width: number; text: string }) {
  return (
    <g>
      <text x={10} y={y + 13} fontSize={14} fill={MUTED}>{label}</text>
      <rect x={64} y={y} width={width} height={18} fill={text} />
      <text x={64 + width + 6} y={y + 14} fontSize={14} fontWeight={700} fill={MUTED}>{value}</text>
    </g>
  );
}

export default function LdsBankViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="LDS 안쪽"
      title="bank 32개를 칸으로 놓으면 용량과 읽기 폭이 함께 보입니다"
      description="bank는 LDS를 나눈 저장 구역입니다. 세로줄 하나가 bank, 칸 하나가 32비트 항목이며 512개 중 일부만 그렸습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CDNA3 LDS의 bank와 항목을 세고, 클록당 읽기 폭과 CDNA4 수치를 비교하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 ? (
            <>
              {active !== 2 && <text x={X0} y={22} fontSize={14} fontWeight={700} fill={MUTED}>bank 0</text>}
              {active !== 2 && <text x={X0 + 32 * PITCH} y={22} textAnchor="end" fontSize={14} fontWeight={700} fill={MUTED}>bank 31</text>}
              {active === 2 && <text x={X0 + CONFLICT_BANK * PITCH + 4} y={22} textAnchor="middle" fontSize={14} fontWeight={700} fill={BLUE}>같은 bank</text>}
              {BANKS.map((bank) =>
                RENDER_ROWS.map((row) => {
                  const read = active === 1 && row === 2;
                  const first = active === 2 && bank === CONFLICT_BANK && row === 1;
                  const second = active === 2 && bank === CONFLICT_BANK && row === 4;
                  return (
                    <rect
                      key={`${bank}-${row}`}
                      x={X0 + bank * PITCH}
                      y={rowY(row)}
                      width={COL_W}
                      height={ROW - 1}
                      fill={read || first ? BLUE : second ? "#2563eb33" : "none"}
                      stroke={second ? BLUE : LINE}
                      strokeWidth={second ? 1.25 : 0.5}
                      strokeDasharray={second ? "2 2" : undefined}
                    />
                  );
                }),
              )}
              <text x={W / 2} y={rowY(6) - 6} textAnchor="middle" fontSize={14} fill={MUTED}>⋮ 항목 512개</text>
              <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={14} fill={MUTED}>
                {active === 0 && "칸 하나 = 32비트(4바이트) 항목"}
                {active === 1 && "진한 칸 32개 × 4바이트 = 128바이트"}
                {active === 2 && "진한 칸 = 이번 · 점선 칸 = 다음 차례"}
              </text>
            </>
          ) : (
            <>
              <text x={10} y={18} fontSize={14} fontWeight={700} fill={MUTED}>LDS 용량</text>
              <Bar y={26} label="CDNA3" value="64KB" width={80} text={LINE} />
              <Bar y={48} label="CDNA4" value="160KB" width={200} text={BLUE} />
              <text x={10} y={90} fontSize={14} fontWeight={700} fill={MUTED}>클록당 읽기</text>
              <Bar y={98} label="CDNA3" value="128바이트" width={100} text={LINE} />
              <Bar y={120} label="CDNA4" value="256바이트" width={200} text={BLUE} />
              <text x={10} y={H - 10} fontSize={14} fill={MUTED}>CDNA4 bank 수: 백서에 없음</text>
            </>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
