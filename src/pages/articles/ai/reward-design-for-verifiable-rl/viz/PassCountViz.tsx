import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 정답 40·오답 60, 통과 50(정답 38 + 오답 12), 탈락 50(정답 2 + 오답 48).
 * 칸 하나가 답 하나입니다. 원 = 정답, 네모 = 오답, 채움 = 통과, 빈 칸 = 탈락.
 * 장면마다 분모에 드는 칸만 보이고 분자 칸만 진합니다.
 */
type Kind = "goodPass" | "goodFail" | "badPass" | "badFail";

const kindOf = (index: number): Kind => (index < 38 ? "goodPass" : index < 40 ? "goodFail" : index < 52 ? "badPass" : "badFail");
const CELLS = Array.from({ length: 100 }, (_, index) => kindOf(index));

const ALL: readonly Kind[] = ["goodPass", "goodFail", "badPass", "badFail"];

interface Scene {
  label: string;
  summary: string;
  note: string;
  denominator: readonly Kind[];
  numerator: readonly Kind[];
}

const SCENES: readonly Scene[] = [
  { label: "실제 정답률", summary: "40 / 100 = 40%", denominator: ALL, numerator: ["goodPass", "goodFail"], note: "원 40개가 실제 정답입니다. 채점기의 판단과 상관없이 별도로 확인한 값입니다." },
  { label: "채점기 통과율", summary: "50 / 100 = 50%", denominator: ALL, numerator: ["goodPass", "badPass"], note: "채운 칸 50개가 통과한 답입니다. 분모는 앞과 같은 100개이지만 세는 칸이 달라져 50%가 됩니다." },
  { label: "통과한 답의 정답 비율", summary: "38 / 50 = 76%", denominator: ["goodPass", "badPass"], numerator: ["goodPass"], note: "이제 분모가 통과한 50개로 좁아집니다. 그중 채운 원 38개만 정답이고 채운 네모 12개는 잘못 통과한 오답입니다." },
  { label: "정답을 놓치지 않는 비율", summary: "38 / 40 = 95%", denominator: ["goodPass", "goodFail"], numerator: ["goodPass"], note: "분모를 실제 정답 40개로 바꿉니다. 분자는 같은 38개인데 비율은 95%입니다. 빈 원 2개가 놓친 정답입니다." },
  { label: "학습 신호에 섞이는 칸", summary: "잘못 통과 12 · 잘못 탈락 2", denominator: ALL, numerator: ["badPass", "goodFail"], note: "통과 여부만 받으면 네모 12개를 원 38개와 같은 방향으로 강화할 수 있고, 빈 원 2개에는 좋은 답을 줄이는 신호가 섞입니다." },
];

const COLOR: Record<Kind, string> = { goodPass: "#2563eb", goodFail: "#2563eb", badPass: "#d97706", badFail: "#d97706" };
const CELL = 20;

function Glyph({ kind, cx, cy, opacity = 1 }: { kind: Kind; cx: number; cy: number; opacity?: number }) {
  const filled = kind === "goodPass" || kind === "badPass";
  const fill = filled ? COLOR[kind] : "none";
  if (kind === "goodPass" || kind === "goodFail") {
    return <circle cx={cx} cy={cy} r={7} fill={fill} stroke={COLOR[kind]} strokeWidth={1} opacity={opacity} />;
  }
  return <rect x={cx - 6.5} y={cy - 6.5} width={13} height={13} rx={1} fill={fill} stroke={COLOR[kind]} strokeWidth={1} opacity={opacity} />;
}

const LEGEND: readonly { kind: Kind; label: string; count: number }[] = [
  { kind: "goodPass", label: "정답·통과", count: 38 },
  { kind: "goodFail", label: "정답·탈락", count: 2 },
  { kind: "badPass", label: "오답·통과", count: 12 },
  { kind: "badFail", label: "오답·탈락", count: 48 },
];

export default function PassCountViz() {
  return (
    <SceneShell
      eyebrow="같은 100개, 다른 분모"
      title="답 100개를 칸으로 세면 네 비율의 분모가 보입니다"
      description="칸 하나가 답 하나입니다 (가정). 원은 정답, 네모는 오답, 채움은 통과, 빈 칸은 탈락입니다. 진한 칸이 분자, 연한 칸은 나머지 분모, 거의 안 보이는 칸은 분모 밖입니다."
      ariaLabel="정답과 통과를 교차한 100칸에서 비율의 분모와 분자를 바꿔 보기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 items-center gap-4 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-6">
            <svg viewBox="0 0 200 200" className="mx-auto block h-auto w-[11.5rem] max-w-full sm:w-[17rem]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {CELLS.map((kind, index) => {
                const inDen = scene.denominator.includes(kind);
                const inNum = scene.numerator.includes(kind);
                return (
                  <Glyph
                    key={index}
                    kind={kind}
                    cx={(index % 10) * CELL + CELL / 2}
                    cy={Math.floor(index / 10) * CELL + CELL / 2}
                    opacity={inNum ? 1 : inDen ? 0.35 : 0.08}
                  />
                );
              })}
            </svg>
            <ul className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-1 sm:text-sm">
              {LEGEND.map((item) => (
                <li key={item.kind} className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" aria-hidden="true"><Glyph kind={item.kind} cx={10} cy={10} /></svg>
                  <span className="min-w-0">{item.label}</span>
                  <span className="ml-auto font-mono font-bold">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
