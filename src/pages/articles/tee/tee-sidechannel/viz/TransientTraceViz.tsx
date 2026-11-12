import SceneShell from "./SceneShell";

/**
 * 본문 대응: #leakage-model "Spectre" 칸 — architecturally commit되지 않은 access도
 * cache 같은 covert channel에 흔적을 남길 수 있다.
 * cache line 8개와 secret이 가리키는 line 3은 그림을 위한 가정이다.
 */
const LINES = 8;
const SECRET_LINE = 3;

const W = 360;
const H = 236;
const LEFT = 10;
const GAP = 4;
const CELL = (W - 2 * LEFT - (LINES - 1) * GAP) / LINES;
const cx = (line: number) => LEFT + line * (CELL + GAP);
const CELL_Y = 112;
const CELL_H = 30;

const SLATE = "#64748b";
const BLUE = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";
const LINE = "#94a3b8";
const MUTED = "#64748b";
const INK = "#1e293b";

const SCENES = [
  {
    label: "예측기를 길들입니다",
    summary: "분기 예측: 참",
    note: "같은 분기를 ‘참’ 쪽으로 여러 번 지나가게 해 예측기가 다음에도 참을 예상하게 만듭니다(mistraining). cache line은 비어 있다고 둡니다(가정).",
  },
  {
    label: "예측대로 먼저 실행합니다",
    summary: "secret 위치 line 3 적재",
    note: "실제 조건은 거짓이어도 CPU가 예측한 쪽을 먼저 실행할 수 있습니다(transient execution). 그 사이 secret이 정한 주소를 읽어 line 3이 cache에 들어옵니다.",
  },
  {
    label: "결과는 버려집니다",
    summary: "레지스터 결과 commit 안 됨",
    note: "조건이 거짓으로 확인되면 결과는 버려져 프로그램이 보는 값(architectural state)에 반영되지 않습니다. 그래도 line 3의 cache 흔적은 남을 수 있습니다.",
  },
  {
    label: "공격자가 시간을 잽니다",
    summary: "line 3만 빠름",
    note: "line 8개를 하나씩 읽어 시간을 재면 이미 cache에 있는 line 3만 빨리 돌아옵니다. Cache attack과 경로는 달라도 마지막에 재는 것은 같은 cache 상태입니다.",
  },
];

export default function TransientTraceViz() {
  return (
    <SceneShell
      eyebrow="Transient execution · Spectre"
      title="취소된 실행도 cache에 흔적을 남길 수 있습니다"
      description="위는 분기 예측기와 실행 결과, 아래 칸은 cache line입니다. 파란 칸이 secret에 따라 정해진 주소의 line입니다."
      ariaLabel="mistraining, 투기 실행, 결과 취소, 시간 측정의 네 단계"
      scenes={SCENES}
      render={(active) => {
        const loaded = active >= 1;
        const squashed = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={LEFT} y={8} width={164} height={64} rx={8} fill="none" stroke={active === 0 ? SLATE : LINE} strokeWidth={1} />
            <text x={LEFT + 10} y={28} fontSize={13} fontWeight={700} fill={INK}>분기 예측기</text>
            <text x={LEFT + 10} y={47} fontSize={12} fill={MUTED}>예측: 참</text>
            <text x={LEFT + 10} y={63} fontSize={12} fill={active === 0 ? MUTED : RED}>{active === 0 ? "참 · 참 · 참 …" : "실제 조건: 거짓"}</text>

            <rect x={W - LEFT - 164} y={8} width={164} height={64} rx={8} fill="none" stroke={active === 1 ? BLUE : active === 2 ? RED : LINE} strokeWidth={1} strokeDasharray={squashed ? "4 3" : undefined} />
            <text x={W - LEFT - 154} y={28} fontSize={13} fontWeight={700} fill={INK}>실행 결과</text>
            <text x={W - LEFT - 154} y={47} fontSize={12} fill={MUTED}>{active === 0 ? "아직 없음" : "secret 위치 읽기"}</text>
            <text x={W - LEFT - 154} y={63} fontSize={12} fontWeight={squashed ? 700 : 400} fill={squashed ? RED : active === 1 ? BLUE : MUTED}>{squashed ? "버림 · commit 안 됨" : active === 1 ? "앞서 실행 중" : "−"}</text>
            {squashed && <line x1={W - LEFT - 154} y1={43} x2={W - LEFT - 62} y2={43} stroke={RED} strokeWidth={1.25} />}

            <text x={LEFT} y={CELL_Y - 10} fontSize={12} fill={MUTED}>cache line (8개, 가정)</text>
            {active === 1 && (
              <line x1={W - LEFT - 82} y1={72} x2={cx(SECRET_LINE) + CELL / 2} y2={CELL_Y - 2} stroke={BLUE} strokeWidth={1.25} />
            )}
            {Array.from({ length: LINES }, (_, line) => {
              const isSecret = loaded && line === SECRET_LINE;
              return (
                <g key={line}>
                  <rect x={cx(line)} y={CELL_Y} width={CELL} height={CELL_H} rx={4} fill={isSecret ? BLUE : "none"} opacity={isSecret ? 0.9 : 1} stroke={isSecret ? BLUE : LINE} strokeWidth={1} strokeDasharray={isSecret ? undefined : "3 3"} />
                  <text x={cx(line) + CELL / 2} y={CELL_Y + CELL_H + 14} textAnchor="middle" fontSize={11} fill={MUTED}>{line}</text>
                </g>
              );
            })}
            {active === 2 && (
              <text x={cx(SECRET_LINE) + CELL / 2} y={CELL_Y + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">남음</text>
            )}

            {active === 3 && (
              <g>
                <text x={LEFT} y={176} fontSize={12} fill={MUTED}>읽은 시간 (막대가 짧을수록 빠름)</text>
                {Array.from({ length: LINES }, (_, line) => {
                  const fast = line === SECRET_LINE;
                  const h = fast ? 10 : 34;
                  return (
                    <g key={line}>
                      <rect x={cx(line) + CELL / 2 - 7} y={H - 6 - h} width={14} height={h} rx={2} fill={fast ? AMBER : SLATE} opacity={fast ? 0.95 : 0.45} />
                      {fast && <text x={cx(line) + CELL / 2 + 11} y={H - 8} fontSize={12} fontWeight={700} fill={AMBER}>빠름</text>}
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
