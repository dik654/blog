import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — H⁴(x)를 공개 끝값으로 놓는다(가정). H²(x)를 보이면 두 번 더 해시해 끝값을 확인한다.
 * 본 사람은 H³(x)도 만들 수 있으므로 이 사슬 하나만으로는 안전한 다회용 서명이 아니다.
 */
const INK = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const W = 360;
const H = 170;
const NODES = ["x", "H(x)", "H²(x)", "H³(x)", "H⁴(x)"];
const BOX = 58;
const GAP = 12;
const nx = (i: number) => 4 + i * (BOX + GAP);

const SCENES = [
  { label: "끝값 하나만 공개합니다", summary: "H를 네 번 → H⁴(x) 공개", note: "해시 H는 넣은 값에서 정해진 결과를 계산하는 함수입니다. 화살표는 계산이 가는 방향입니다. x에 H를 네 번 적용한 H⁴(x)를 공개 끝값으로 놓습니다(가정)." },
  { label: "H²(x)를 보여 줍니다", summary: "두 번 더 해시 → 끝값과 일치", note: "검증자는 받은 H²(x)를 두 번 더 해시해 공개 끝값과 같은지 확인할 수 있습니다." },
  { label: "본 사람도 앞으로 갈 수 있습니다", summary: "H³(x)도 만들 수 있음", note: "H²(x)를 본 사람은 한 번 더 해시해 H³(x)도 만들 수 있습니다. 그래서 이 사슬 하나만으로 안전한 다회용 서명이 되지는 않습니다." },
] as const;

export default function HashChainViz() {
  return (
    <SceneShell
      eyebrow="해시 사슬"
      title="끝값까지 확인되지만 본 사람도 그 길을 따라갈 수 있습니다"
      description="칸 하나가 값이고 오른쪽으로 갈수록 H를 한 번 더 적용한 값입니다. 네 번이라는 길이는 글의 설명용 가정입니다."
      ariaLabel="x부터 H⁴(x)까지의 해시 사슬에서 H²(x)를 공개했을 때 검증과 위조 가능 범위"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {NODES.map((name, i) => {
            const isEnd = i === 4;
            const shown = active >= 1 && i === 2;
            const forged = active === 2 && i === 3;
            const color = forged ? RED : shown ? AMBER : isEnd ? BLUE : INK;
            const hidden = !isEnd && !shown && !forged && (active >= 1 ? i < 2 : true);
            return (
              <g key={name}>
                <rect x={nx(i)} y={46} width={BOX} height={44} rx={6} fill={color} fillOpacity={hidden ? 0 : 0.12} stroke={color} strokeWidth={1} strokeDasharray={hidden ? "4 3" : undefined} />
                <text x={nx(i) + BOX / 2} y={73} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight={hidden ? 400 : 700} fill={hidden ? INK : undefined} className={hidden ? undefined : "fill-foreground"}>{name}</text>
                {i < 4 && (() => {
                  const hot = (active === 1 && i >= 2) || (active === 2 && i === 2);
                  const stroke = active === 2 && i === 2 ? RED : hot ? AMBER : INK;
                  return (
                    <>
                      <line x1={nx(i) + BOX} x2={nx(i) + BOX + GAP - 1} y1={68} y2={68} stroke={stroke} strokeWidth={hot ? 1.25 : 1} />
                      <path d={`M${nx(i) + BOX + GAP - 5} 64 L${nx(i) + BOX + GAP} 68 L${nx(i) + BOX + GAP - 5} 72`} fill="none" stroke={stroke} strokeWidth={hot ? 1.25 : 1} />
                    </>
                  );
                })()}
              </g>
            );
          })}
          <text x={nx(4) + BOX / 2} y={34} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>공개 끝값</text>
          {active >= 1 && <text x={nx(2) + BOX / 2} y={34} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>보여 준 값</text>}
          {active === 1 && (
            <>
              <path d={`M${nx(2) + BOX / 2} 100 L${nx(2) + BOX / 2} 108 L${nx(4) + BOX / 2} 108 L${nx(4) + BOX / 2} 100`} fill="none" stroke={AMBER} strokeWidth={1} />
              <text x={nx(3) + BOX / 2} y={128} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">검증자가 두 번 더 해시</text>
              <text x={nx(3) + BOX / 2} y={148} textAnchor="middle" fontSize={11} fill={INK}>끝값과 같은지 확인</text>
            </>
          )}
          {active === 2 && (
            <>
              <text x={nx(3) + BOX / 2} y={34} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>새로 만듦</text>
              <text x={180} y={128} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">H²(x)를 본 사람은 H³(x)도 만들 수 있음</text>
              <text x={180} y={148} textAnchor="middle" fontSize={11} fill={INK}>이 사슬 하나만으로는 안전한 다회용 서명이 아님</text>
            </>
          )}
          {active === 0 && (
            <text x={180} y={128} textAnchor="middle" fontSize={12} className="fill-foreground">점선 칸은 공개하지 않은 값입니다</text>
          )}
        </svg>
      )}
    />
  );
}
