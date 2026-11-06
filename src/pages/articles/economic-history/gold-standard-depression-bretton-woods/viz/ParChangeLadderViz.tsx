import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 1944년 IMF 협정문 4조 5항. 처음 평가에서 잰 누적 변경 폭에 따른 세 칸.
 * 10%·그다음 10%(=20%까지)·그 이상. 아래로 내려갈수록 기금의 검토가 무거워집니다.
 */
const SCENES = [
  { label: "먼저 지나는 문", summary: "근본적 불균형 · 사전 협의", note: "근본적 불균형을 바로잡기 위해서만 제안할 수 있고, 기금과 협의한 뒤에만 바꿉니다. 폭은 처음 평가에서 잽니다." },
  { label: "누적 10% 이내", summary: "기금은 이의를 제기하지 않음", note: "처음 평가에서 쌓인 변경이 10% 이내면 기금은 이의를 제기하지 않았습니다." },
  { label: "그다음 10%까지", summary: "동의 또는 반대 · 요청 시 72시간", note: "그다음 10%까지는 기금이 동의하거나 반대할 수 있습니다. 회원국이 요청하면 72시간 안에 태도를 밝혀야 했습니다." },
  { label: "그 이상", summary: "더 긴 검토 기간", note: "그 이상의 변경은 더 긴 검토 기간을 가졌습니다. 폭이 클수록 기금의 판단을 더 오래 거칩니다." },
] as const;

const W = 320;
const H = 214;
const MUTED = "#64748b";
const IDLE = "#94a3b8";
const BLUE = "#2563eb";
const RULE_X = 44;
const RUNG_X = 54;
const RUNG_W = W - RUNG_X - 2;
const RUNG_H = 46;
const RUNG_TOP = 62;

const RUNGS = [
  { top: "0%", main: "이의 제기 없음", sub: "기금과 협의는 함" },
  { top: "10%", main: "동의 또는 반대", sub: "요청 시 72시간 안에" },
  { top: "20%", main: "더 긴 검토 기간", sub: "그 이상의 변경" },
] as const;

export default function ParChangeLadderViz() {
  return (
    <SceneShell
      eyebrow="변경 폭의 문턱"
      title="누적 변경이 커질수록 기금의 검토가 무거워집니다"
      description="통화의 공식 가치(평가, par value)를 얼마나 바꿀 수 있었을까요? 세로 눈금이 처음 평가에서 쌓인 변경 폭입니다."
      note="1944년 7월 22일 채택된 IMF 협정문 4조 5항을 세계금위원회 공개 발췌본으로 옮긴 그림입니다. 20%는 10%에 그다음 10%를 더한 값입니다."
      ariaLabel="평가 변경의 조건과 누적 변경 폭에 따른 세 단계"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          <rect x={2} y={2} width={W - 4} height={46} rx={8} fill="none" stroke={index === 0 ? BLUE : IDLE} strokeWidth={index === 0 ? 1.25 : 1} />
          <text x={160} y={21} textAnchor="middle" fontSize={13} fontWeight={700} fill={index === 0 ? BLUE : MUTED}>근본적 불균형을 바로잡을 때만</text>
          <text x={160} y={39} textAnchor="middle" fontSize={13} fill={index === 0 ? BLUE : MUTED}>기금과 협의한 뒤에만</text>
          <line x1={RULE_X} x2={RULE_X} y1={RUNG_TOP} y2={RUNG_TOP + 3 * (RUNG_H + 4)} stroke={MUTED} strokeWidth={1} />
          {RUNGS.map((rung, row) => {
            const y = RUNG_TOP + row * (RUNG_H + 4);
            const on = index === row + 1;
            return (
              <g key={rung.top}>
                <line x1={RULE_X - 5} x2={RULE_X} y1={y} y2={y} stroke={MUTED} strokeWidth={1} />
                <text x={RULE_X - 8} y={y + 5} textAnchor="end" fontSize={12} fontWeight={700} fill={MUTED}>{rung.top}</text>
                <rect x={RUNG_X} y={y} width={RUNG_W} height={RUNG_H} rx={8} fill={on ? BLUE : "none"} fillOpacity={on ? 0.1 : 0} stroke={on ? BLUE : IDLE} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
                <text x={RUNG_X + 12} y={y + 20} fontSize={13} fontWeight={700} fill={on ? BLUE : MUTED}>{rung.main}</text>
                <text x={RUNG_X + 12} y={y + 37} fontSize={12} fill={on ? BLUE : MUTED}>{rung.sub}</text>
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
