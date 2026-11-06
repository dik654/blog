import { ColumnVector, Op, PublicTable } from "./MathCells";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — A=[[2,3],[4,1]], s=[1,2], e=[1,0], y=[2,1], c=1, mod 17.
 * As=[8,6], t=As+e=[9,6], Ay=[7,9], z=y+cs=[3,3]. 모든 값이 17보다 작아 나머지 계산이 값을 바꾸지 않는다.
 */
const INK = "#64748b";
const AMBER = "#d97706";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const W = 360;
const H = 226;

const SCENES = [
  { label: "비밀에 공개 표를 곱합니다", summary: "As = [8, 6]", note: "A는 누구나 보는 공개 표, s는 서명자만 쥔 비밀 벡터입니다. 표의 한 행과 s를 칸끼리 곱해 더하면 결과의 한 칸이 나옵니다." },
  { label: "작은 오류를 더해 공개합니다", summary: "t = [8, 6] + [1, 0] = [9, 6]", note: "작은 오류 e를 더한 t가 공개값입니다. 표 A와 t는 아래 ‘공개됨’ 칸에 있고, s와 e는 서명자 쪽에 남습니다." },
  { label: "서명마다 새 마스크로 약속을 만듭니다", summary: "Ay = [7, 9]", note: "마스크 y는 비밀을 가리려고 서명 때 새로 고르는 값입니다. 여기에 A를 곱한 Ay가 약속입니다. 메시지와 이 약속을 함께 확인해 나온 값이 challenge c이고, 작은 예에서는 c=1로 놓습니다." },
  { label: "비밀과 마스크를 섞어 응답합니다", summary: "z = [2, 1] + 1×[1, 2] = [3, 3]", note: "서명 쪽으로 나가는 값은 s가 아니라 섞인 z입니다. 두 차원과 c=1은 계산을 따라가기 위한 작은 예이며 실제 보안 수준이나 표준 서명을 재현하지 않습니다." },
] as const;

const TRAY = [
  { signer: ["s = [1,2]"], open: ["A"], sent: [] as string[] },
  { signer: ["s = [1,2]", "e = [1,0]"], open: ["A", "t = [9,6]"], sent: [] as string[] },
  { signer: ["s = [1,2]", "e = [1,0]", "y = [2,1]", "Ay = [7,9]"], open: ["A", "t = [9,6]"], sent: [] as string[] },
  { signer: ["s = [1,2]", "e = [1,0]", "y = [2,1]", "Ay = [7,9]"], open: ["A", "t = [9,6]"], sent: ["c = 1", "z = [3,3]"] },
];

function Expression({ lines, x }: { lines: [string, string]; x: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <text key={line} x={x} y={32 + i * 26 + 18} fontSize={12} fontFamily="monospace" fill={INK}>{line}</text>
      ))}
    </>
  );
}

export default function MixedValuesViz() {
  return (
    <SceneShell
      eyebrow="작은 계산 네 칸"
      title="비밀 [1,2]가 공개값과 응답 속으로 들어가는 순서"
      description="모든 값을 17로 나눈 나머지로 다룬다고 놓은 작은 예입니다(가정). 이 예의 값은 모두 17보다 작아 나머지를 취해도 그대로입니다."
      ariaLabel="공개값 t, 약속 Ay, 응답 z를 차례로 계산하고 값이 어디에 남는지 보여 주는 그림"
      scenes={SCENES}
      render={(active) => {
        const tray = TRAY[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {(active === 0 || active === 2) && (
              <>
                <PublicTable x={4} y={32} />
                <Op x={72} y={62}>×</Op>
                <ColumnVector x={84} y={32} values={active === 0 ? [1, 2] : [2, 1]} name={active === 0 ? "s" : "y"} tone="secret" />
                <Op x={128} y={62}>=</Op>
                <Expression x={140} lines={active === 0 ? ["2×1 + 3×2", "4×1 + 1×2"] : ["2×2 + 3×1", "4×2 + 1×1"]} />
                <Op x={232} y={62}>=</Op>
                <ColumnVector x={246} y={32} values={active === 0 ? [8, 6] : [7, 9]} name={active === 0 ? "As" : "Ay"} tone={active === 0 ? "base" : "secret"} />
              </>
            )}
            {active === 1 && (
              <>
                <ColumnVector x={60} y={32} values={[8, 6]} name="As" />
                <Op x={112} y={62}>+</Op>
                <ColumnVector x={134} y={32} values={[1, 0]} name="e" tone="secret" />
                <Op x={186} y={62}>=</Op>
                <ColumnVector x={208} y={32} values={[9, 6]} name="t" tone="public" />
              </>
            )}
            {active === 3 && (
              <>
                <ColumnVector x={40} y={32} values={[2, 1]} name="y" tone="secret" />
                <Op x={86} y={62}>+</Op>
                <text x={118} y={62} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={INK}>1 ×</text>
                <ColumnVector x={140} y={32} values={[1, 2]} name="s" tone="secret" />
                <Op x={190} y={62}>=</Op>
                <ColumnVector x={210} y={32} values={[3, 3]} name="z" tone="ok" />
              </>
            )}
            {[
              { x: 4, title: "서명자 쪽에 남음", color: AMBER, items: tray.signer },
              { x: 124, title: "공개됨", color: BLUE, items: tray.open },
              { x: 244, title: "서명으로 나감", color: GREEN, items: tray.sent },
            ].map((column) => (
              <g key={column.title}>
                <rect x={column.x} y={102} width={112} height={118} rx={6} fill="none" stroke={column.color} strokeWidth={1} />
                <text x={column.x + 56} y={121} textAnchor="middle" fontSize={11} fontWeight={700} fill={column.color}>{column.title}</text>
                {column.items.map((item, i) => (
                  <text key={item} x={column.x + 56} y={142 + i * 19} textAnchor="middle" fontSize={12} fontFamily="monospace" className="fill-foreground">{item}</text>
                ))}
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
