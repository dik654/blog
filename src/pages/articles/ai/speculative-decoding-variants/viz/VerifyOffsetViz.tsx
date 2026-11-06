import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 보관한 점수는 R을, R 자리는 A를, A 자리는 Y를 확인한다.
 * 입력 칸과 확인 칸이 한 칸씩 어긋나므로 대각선 화살표로 그린다. 입력·문장은 가정이다.
 */
interface Scene {
  label: string;
  summary: string;
  note: string;
  checks: number;
  third: "Y" | "X";
}

const SCENES: readonly Scene[] = [
  { label: "후보 셋을 한 입력에", summary: "큰 모델 실행 1번", checks: 0, third: "Y", note: "앞 회차는 네 번째 토큰까지 처리했습니다. 이번에는 값싼 부품이 쓴 R·A·Y를 한 입력에 놓고 큰 모델을 한 번 실행합니다." },
  { label: "보관한 점수 → R", summary: "R 확인", checks: 1, third: "Y", note: "언어 모델은 읽은 자리에서 다음 토큰의 점수를 냅니다. 앞 회차가 네 번째 토큰을 처리하며 만들어 보관한 다섯 번째 자리 점수가 첫 후보 R을 확인합니다." },
  { label: "R 자리 → A", summary: "R · A 확인", checks: 2, third: "Y", note: "이번 실행에서 R 자리의 계산은 그 다음 토큰을 고릅니다. 그 선택이 후보 A와 같은지 봅니다. 칸이 한 칸씩 어긋나는 이유입니다." },
  { label: "A 자리 → Y", summary: "세 토큰 확정", checks: 3, third: "Y", note: "A 자리의 계산이 Y를 고르면 셋이 연속으로 맞습니다. 큰 모델 실행 한 번으로 R·A·Y를 문장에 붙입니다." },
  { label: "RA 다음이 X라면", summary: "R · A만 남음", checks: 3, third: "X", note: "큰 모델이 RA 다음에 X를 고르면 R과 A까지만 남깁니다. 문장은 앞에서부터 이어지므로 틀린 Y 뒤의 후보는 맞더라도 사용할 수 없습니다." },
];

const COL_W = 66;
const GAP = 6;
const colX = (col: number) => 4 + col * (COL_W + GAP);
const TOP_Y = 26;
const BOTTOM_Y = 100;
const BOX_H = 42;
const GREEN = "#16a34a";
const RED = "#dc2626";
const SLATE = "#94a3b8";

export default function VerifyOffsetViz() {
  return (
    <SceneShell
      eyebrow="한 칸씩 어긋난 확인"
      title="각 자리의 계산은 자기 자신이 아니라 다음 후보를 확인합니다"
      description="위 칸은 큰 모델이 읽는 입력, 아래 칸은 각 자리에서 고른 다음 토큰입니다. 대각선을 따라 후보와 비교합니다. R·A·Y는 설명을 위한 가정입니다."
      ariaLabel="보관한 점수와 각 자리의 계산이 다음 후보를 확인하는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rejected = scene.third === "X";
        const inputs = ["R", "A", "Y"];
        const picks = ["R", "A", scene.third];
        return (
          <svg viewBox="0 0 364 196" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={16} fontSize={13} className="fill-muted-foreground">큰 모델이 읽는 입력</text>
            <text x={4} y={BOTTOM_Y + BOX_H + 18} fontSize={13} className="fill-muted-foreground">그 자리가 고른 다음 토큰</text>

            <rect x={colX(0)} y={TOP_Y} width={COL_W} height={BOX_H} rx={6} fill="none" stroke={SLATE} strokeWidth={1} strokeDasharray="3 3" />
            <text x={colX(0) + COL_W / 2} y={TOP_Y + 18} textAnchor="middle" fontSize={12} className="fill-muted-foreground">넷째 토큰</text>
            <text x={colX(0) + COL_W / 2} y={TOP_Y + 34} textAnchor="middle" fontSize={12} className="fill-muted-foreground">앞 회차</text>

            {inputs.map((token, index) => {
              const col = index + 1;
              const checked = scene.checks > index;
              const bad = rejected && index === 2;
              const stroke = bad ? RED : checked ? GREEN : SLATE;
              return (
                <g key={token}>
                  <rect x={colX(col)} y={TOP_Y} width={COL_W} height={BOX_H} rx={6} fill={checked && !bad ? GREEN : "none"} fillOpacity={0.15} stroke={stroke} strokeWidth={1} strokeDasharray={bad ? "3 3" : undefined} />
                  <text x={colX(col) + COL_W / 2} y={TOP_Y + 27} textAnchor="middle" fontSize={17} fontWeight={700} fill={bad ? RED : undefined} className={bad ? undefined : "fill-foreground"}>{token}</text>
                </g>
              );
            })}

            {[0, 1, 2].map((index) => {
              const on = scene.checks > index;
              const color = on ? "#2563eb" : "#cbd5e1";
              const x1 = colX(index) + COL_W / 2;
              const x2 = colX(index + 1) + COL_W / 2;
              const y1 = TOP_Y + BOX_H + 2;
              const y2 = BOTTOM_Y - 2;
              return (
                <g key={index}>
                  <line x1={x1} y1={y1} x2={x2 - 3} y2={y2 - 2} stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
                  <polygon points={`${x2},${y2} ${x2 - 8},${y2 - 1} ${x2 - 4},${y2 - 7}`} fill={color} />
                </g>
              );
            })}

            <text x={colX(0) + COL_W / 2} y={BOTTOM_Y + 18} textAnchor="middle" fontSize={12} className="fill-muted-foreground">보관한</text>
            <text x={colX(0) + COL_W / 2} y={BOTTOM_Y + 34} textAnchor="middle" fontSize={12} className="fill-muted-foreground">점수</text>

            {picks.map((pick, index) => {
              const col = index + 1;
              const on = scene.checks > index;
              const bad = pick === "X";
              return (
                <g key={col}>
                  <rect x={colX(col)} y={BOTTOM_Y} width={COL_W} height={BOX_H} rx={6} className={on ? "fill-background" : undefined} fill={on ? undefined : "none"} stroke={on ? (bad ? RED : GREEN) : "#cbd5e1"} strokeWidth={1} strokeDasharray={on ? undefined : "3 3"} />
                  <text x={colX(col) + COL_W / 2} y={BOTTOM_Y + 27} textAnchor="middle" fontSize={on ? 15 : 13} fontWeight={on ? 700 : 400} fill={on ? (bad ? RED : GREEN) : "#94a3b8"}>{on ? (bad ? "X ≠ Y" : `${pick} = ${pick}`) : "?"}</text>
                </g>
              );
            })}

            <rect x={colX(4)} y={BOTTOM_Y} width={COL_W} height={BOX_H} rx={6} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <text x={colX(4) + COL_W / 2} y={BOTTOM_Y + 18} textAnchor="middle" fontSize={12} className="fill-muted-foreground">Y 자리</text>
            <text x={colX(4) + COL_W / 2} y={BOTTOM_Y + 34} textAnchor="middle" fontSize={12} className="fill-muted-foreground">{rejected ? "버림" : "다음 회차"}</text>

            <text x={4} y={188} fontSize={14} fontWeight={700} className="fill-foreground">
              {scene.checks === 0 ? "확정: 아직 없음" : `확정: ${rejected ? "R · A" : ["R", "A", "Y"].slice(0, scene.checks).join(" · ")}`}
            </text>
          </svg>
        );
      }}
    />
  );
}
