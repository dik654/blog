import SceneShell from "./SceneShell";

/**
 * 본문 대응: #autobahn — "장애가 끝난 뒤 합의는 길어진 각 lane 전체를 다시 제안하지 않고 최신 tip을 가리킬 수 있습니다.
 * 다만 누락된 payload를 실제로 받는 SYNC 비용은 사라지지 않습니다."
 * 장애 전 cut [A7, B5, C8, D6]은 위 AutobahnLaneCutViz의 값이다.
 * 장애 중 lane마다 car 3개가 더 붙는 것(→ A10, B8, C11, D9)과 C9~C11이 빠진 복제본은 설명용 가정이다.
 */
const LANES = ["A", "B", "C", "D"] as const;
const OLD_TIP = [7, 5, 8, 6] as const;
const GROWTH = 3;
const FIRST = 4;
const LAST = 11;
const CAR_W = 34;
const LEFT = 30;
const ROW_H = 30;
const TOP = 26;
const cx = (car: number) => LEFT + (car - FIRST) * (CAR_W + 4);
const rowY = (lane: number) => TOP + lane * ROW_H;

const SCENES = [
  {
    label: "장애 전 cut",
    summary: "cut s = [A7, B5, C8, D6]",
    grown: false,
    newCut: false,
    sync: false,
    note: "주 노드가 각 lane의 최신 certified tip을 모아 cut을 제안하고 커밋했습니다. Tip 하나가 그 앞 history의 가용성 근거이므로 cut은 네 위치만 가리킵니다.",
  },
  {
    label: "주 노드 정지",
    summary: "합의는 멈추고 lane은 자람",
    grown: true,
    newCut: false,
    sync: false,
    note: "주 노드가 멈춰도 lane의 data 전파는 계속될 수 있습니다. 여기서는 lane마다 car 3개가 더 붙었다고 둡니다(가정). 그동안 cut을 낼 주 노드가 없으니 복제본들은 Timeout 2f+1개로 TC를 만듭니다.",
  },
  {
    label: "새 cut 하나",
    summary: "cut s+1 = [A10, B8, C11, D9] · car 12개를 네 tip으로",
    grown: true,
    newCut: true,
    sync: false,
    note: "다음 주 노드는 밀린 car 12개를 하나씩 다시 제안하지 않고 각 lane의 최신 certified tip 네 개를 가리키는 cut을 제안합니다(A10·B8·C11·D9가 인증됐다고 가정). 이전 view에서 커밋됐을 수 있는 cut이 있으면 앞 문단의 TC 규칙으로 먼저 보존합니다.",
  },
  {
    label: "SYNC는 남음",
    summary: "C9~C11이 없는 복제본은 먼저 받아야 실행 (가정)",
    grown: true,
    newCut: true,
    sync: true,
    note: "CommitQC가 tip을 가리켜도, 그 history를 갖지 못한 복제본은 빠진 payload를 실제로 받아야 lane들을 섞어 실행할 수 있습니다. 합의 메시지는 짧아졌지만 이 동기화 bytes는 그대로 남습니다.",
  },
] as const;

function cutPath(tips: readonly number[]) {
  return tips
    .map((tip, lane) => {
      const x = cx(tip) + CAR_W + 2;
      return `${lane === 0 ? "M" : "L"} ${x} ${rowY(lane) - 3} L ${x} ${rowY(lane) + ROW_H - 7}`;
    })
    .join(" ");
}

export default function AutobahnBacklogCutViz() {
  return (
    <SceneShell
      eyebrow="Autobahn · 장애 뒤 backlog"
      title="밀린 car를 다시 나열하지 않고 각 lane의 tip만 가리킵니다"
      description="한 줄이 한 복제본의 lane이고, 칸 하나가 car(그 복제본이 낸 data proposal)입니다. 세로로 꺾이는 선이 cut, 즉 각 lane에서 어느 car까지 순서에 넣을지 정한 경계입니다. A4보다 앞 car는 생략했습니다."
      ariaLabel="장애 동안 자란 네 lane을 새 cut 하나가 tip으로 가리키고, 빠진 history는 따로 동기화하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const newTips = OLD_TIP.map((tip) => tip + GROWTH);
        return (
          <svg viewBox="0 0 360 158" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {LANES.map((lane, laneIndex) => {
              const tip = scene.grown ? newTips[laneIndex] : OLD_TIP[laneIndex];
              const cars = Array.from({ length: LAST - FIRST + 1 }, (_, offset) => FIRST + offset).filter((car) => car <= tip);
              return (
                <g key={lane}>
                  <text x={8} y={rowY(laneIndex) + 15} fontSize={11} fontWeight={700} fill="#334155">
                    {lane}
                  </text>
                  {cars.map((car) => {
                    const backlog = car > OLD_TIP[laneIndex];
                    const missing = scene.sync && lane === "C" && backlog;
                    return (
                      <g key={car}>
                        <rect
                          x={cx(car)}
                          y={rowY(laneIndex)}
                          width={CAR_W}
                          height={ROW_H - 10}
                          rx={4}
                          fill={missing ? "#fef3c7" : backlog ? "#ede9fe" : "#f1f5f9"}
                          stroke={missing ? "#d97706" : backlog ? "#7c3aed" : "#94a3b8"}
                          strokeWidth={missing ? 1.25 : 1}
                          strokeDasharray={missing ? "3 2" : undefined}
                        />
                        <text x={cx(car) + CAR_W / 2} y={rowY(laneIndex) + 14} textAnchor="middle" fontSize={10} fill="#0f172a">
                          {lane}
                          {car}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
            <path d={cutPath(OLD_TIP)} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeDasharray={scene.newCut ? "4 3" : undefined} opacity={scene.newCut ? 0.6 : 1} />
            {scene.newCut && <path d={cutPath(newTips)} fill="none" stroke="#16a34a" strokeWidth={1.25} />}
            <text x={8} y={16} fontSize={11} fill="#2563eb">
              파랑: cut s
            </text>
            {scene.newCut && (
              <text x={86} y={16} fontSize={11} fill="#16a34a">
                초록: cut s+1
              </text>
            )}
            {scene.grown && (
              <text x={180} y={16} fontSize={11} fill="#7c3aed">
                보라: 장애 중 붙은 car
              </text>
            )}
            {scene.sync && (
              <text x={8} y={154} fontSize={11} fill="#b45309">
                주황 점선: 이 복제본에 아직 없는 C9~C11 (가정) → SYNC
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
