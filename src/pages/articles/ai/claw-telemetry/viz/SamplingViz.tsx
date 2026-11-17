import TelemetrySceneShell from "./TelemetrySceneShell";

/**
 * 본문 대응: #session-tracer "sampling은 비용 절감이지 무작위 삭제가 아니다".
 * trace 10개 중 #4 오류, #8 느림, head가 #1·#5·#9를 남기고 tail이 #4·#8·#1을 남기는 것은 모두 설명용 가정입니다.
 */
type Status = "ok" | "error" | "slow";

const STATUS: readonly Status[] = ["ok", "ok", "ok", "error", "ok", "ok", "ok", "slow", "ok", "ok"];
const HEAD_KEEP: readonly number[] = [0, 4, 8];
const TAIL_KEEP: readonly number[] = [3, 7, 0];

const SCENES = [
  {
    label: "head: 시작할 때 결정",
    summary: "결과를 모른 채 10개 중 3개",
    reveal: false,
    keep: HEAD_KEEP,
    buffered: 0,
    audit: false,
    note: "head sampling은 trace가 시작될 때 남길지 정합니다. 이 시점에는 어느 trace가 오류로 끝날지 모르므로 판단 근거가 없습니다. 대신 끝날 때까지 들고 있을 필요가 없어 저렴합니다.",
  },
  {
    label: "head: 끝나고 보니",
    summary: "오류·느린 trace 보존 0개",
    reveal: true,
    keep: HEAD_KEEP,
    buffered: 0,
    audit: false,
    note: "결과가 나오고 보니 남긴 세 개는 모두 정상이고, 조사에 필요한 #4 오류와 #8 느린 요청은 버려졌습니다. 오류도 정상과 같은 확률로 버리면 이런 일이 생깁니다.",
  },
  {
    label: "tail: 끝난 뒤 결정",
    summary: "buffer 10개 → 오류·느림 보존",
    reveal: true,
    keep: TAIL_KEEP,
    buffered: 10,
    audit: false,
    note: "tail sampling은 trace가 끝난 뒤 결과를 보고 고릅니다. #4 오류와 #8 느린 trace를 남기고 정상 표본 하나를 더합니다. 그 대가로 10개 전부를 완료 때까지 buffer에 들고 있어야 합니다.",
  },
  {
    label: "감사·budget 차단은 따로",
    summary: "sampling과 분리해 항상 보존",
    reveal: true,
    keep: TAIL_KEEP,
    buffered: 10,
    audit: true,
    note: "보안 감사 이벤트와 budget 차단 기록은 위 sampling 확률과 상관없이 별도 경로로 보존합니다. 정상 trace를 줄이는 비용 절감이 감사 근거까지 지우지 않게 하기 위해서입니다.",
  },
] as const;

const W = 360;
const H = 176;
const LEFT = 8;
const CELL_W = 30;
const GAP = (W - 2 * LEFT - 10 * CELL_W) / 9;
const CELL_Y = 22;
const CELL_H = 40;

const STATUS_STYLE: Record<Status, { label: string; fill: string; stroke: string; text: string }> = {
  ok: { label: "정상", fill: "#f1f5f9", stroke: "#94a3b8", text: "#475569" },
  error: { label: "오류", fill: "#fee2e2", stroke: "#dc2626", text: "#b91c1c" },
  slow: { label: "느림", fill: "#fef3c7", stroke: "#d97706", text: "#92400e" },
};

export default function SamplingViz() {
  return (
    <TelemetrySceneShell
      eyebrow="SAMPLING · 설명용 trace 10개"
      title="언제 결정하느냐가 오류 trace를 남길지 정합니다"
      description="칸 하나가 trace 하나이고, 파란 테두리와 '보존' 표시가 남긴 trace입니다. head sampling은 시작 시점에, tail sampling은 완료 뒤에 남길지를 고릅니다. trace 수와 고른 칸은 설명용 가정입니다."
      ariaLabel="head sampling은 오류 trace를 놓치고 tail sampling은 buffering 비용으로 오류와 느린 trace를 보존"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT} y={13} fontSize={11} fontWeight={700} fill="#334155">
              {active < 2 ? "head sampling" : "tail sampling"}
            </text>
            <text x={W - LEFT} y={13} textAnchor="end" fontSize={10} fill="#64748b">
              {scene.reveal ? "결과 확인됨" : "결과 아직 모름"}
            </text>
            {STATUS.map((status, index) => {
              const x = LEFT + index * (CELL_W + GAP);
              const kept = scene.keep.includes(index);
              const style = scene.reveal ? STATUS_STYLE[status] : { label: "?", fill: "#ffffff", stroke: "#cbd5e1", text: "#94a3b8" };
              return (
                <g key={index}>
                  <rect x={x} y={CELL_Y} width={CELL_W} height={CELL_H} rx={4} fill={style.fill} stroke={kept ? "#2563eb" : style.stroke} strokeWidth={kept ? 1.25 : 1} />
                  <text x={x + CELL_W / 2} y={CELL_Y + 15} textAnchor="middle" fontSize={9} fill="#64748b">#{index + 1}</text>
                  <text x={x + CELL_W / 2} y={CELL_Y + 31} textAnchor="middle" fontSize={10} fontWeight={700} fill={style.text}>{style.label}</text>
                  <text x={x + CELL_W / 2} y={CELL_Y + CELL_H + 14} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={kept ? "#2563eb" : "#cbd5e1"}>
                    {kept ? "보존" : "버림"}
                  </text>
                </g>
              );
            })}

            <text x={LEFT} y={102} fontSize={10} fill="#475569">완료까지 들고 있는 buffer</text>
            <rect x={LEFT} y={108} width={W - 2 * LEFT} height={12} rx={2} fill="#ffffff" stroke="#cbd5e1" strokeWidth={1} />
            <rect x={LEFT} y={108} width={((W - 2 * LEFT) * scene.buffered) / 10} height={12} rx={2} fill="#bfdbfe" />
            <text x={W - LEFT} y={102} textAnchor="end" fontSize={10} fontWeight={700} fill={scene.buffered ? "#1d4ed8" : "#64748b"}>
              {scene.buffered} / 10
            </text>

            <g opacity={scene.audit ? 1 : 0.2}>
              <rect x={LEFT} y={134} width={W - 2 * LEFT} height={30} rx={4} fill="#fef3c7" stroke="#d97706" strokeWidth={1} strokeDasharray={scene.audit ? undefined : "3 2"} />
              <text x={LEFT + 8} y={153} fontSize={10.5} fontWeight={700} fill="#92400e">감사 event · budget 차단 기록</text>
              <text x={W - LEFT - 8} y={153} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#92400e">sampling 밖 · 항상 보존</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
