import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #separation — 같은 화살표(집행 → 판정)가 누가 판정을 쥐느냐에 따라 뜻이 달라진다.
 * 네 장면은 본문의 독점, 기능 배분, 인적 겹침, 하나만 장악한 경우를 차례로 짚는다.
 */
const SCENES: readonly ShellScene[] = [
  { label: "한 곳이 셋을 쥘 때", summary: "E의 판정도 행정부", note: "E를 만든 행정부가 영장 발부와 최종 위헌 판정까지 독점하면 “영장이 없었다”는 신호는 제동으로 이어지기 어렵습니다. 자기 행동의 허용 범위를 자기가 최종 결정하기 때문입니다." },
  { label: "세 책임 경로로 나눌 때", summary: "E의 판정은 법원", note: "화살표는 앞 장면과 같지만 도착한 곳의 주인이 다릅니다. 영장 없는 명령을 다투는 일이 E를 낸 쪽과 다른 책임 경로로 넘어갑니다." },
  { label: "사람이 겹치는 체계", summary: "겸직 자체가 쟁점은 아님", note: "의원내각제처럼 입법 다수와 행정부가 인적으로 겹치는 체계도 있습니다. 핵심은 한 행위자가 셋을 아무 독립 제약 없이 모두 독점하지 못하게 기능과 책임 경로를 배분하는 데 있습니다." },
  { label: "하나만 장악했을 때", summary: "나머지를 통해 제동", note: "행정을 장악한 예입니다(가정). 나머지를 통해 제동이 걸리므로 남용하려면 여러 기관을 동시에 장악해야 합니다. 비용이 오르고 눈에 띄어 앞 절의 신호가 켜질 시간이 생깁니다." },
];

const X = [8, 126, 244];
const W = 88;
const CX = X.map((x) => x + W / 2);
const FUNCTIONS = [
  { name: "입법", does: "규칙 만들기" },
  { name: "행정", does: "집행하기" },
  { name: "사법", does: "판정하기" },
];
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#059669";
const RED = "#dc2626";
const GRAY = "#64748b";

function Band({ x, width, label, color }: { x: number; width: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x} y={6} width={width} height={28} rx={6} fill={`${color}1f`} stroke={color} strokeWidth={1} />
      <text x={x + width / 2} y={25} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

function Link({ from, to, color, id }: { from: number; to: number; color: string; id: string }) {
  const y = 112;
  return (
    <path
      d={`M${CX[from]} 102 V${y} H${CX[to]} V106`}
      fill="none"
      stroke={color}
      strokeWidth={1.25}
      markerEnd={`url(#${id})`}
    />
  );
}

export default function SeparationRoutesViz() {
  return (
    <SceneShell
      eyebrow="기능과 책임 경로"
      title="같은 화살표도 도착한 곳의 주인이 다르면 뜻이 달라집니다"
      description="아래 세 칸은 기능입니다. 입법은 일반 규칙을 정하고, 행정은 개별 사안에 그 규칙을 적용해 실행하며, 사법은 다툼이 생겼을 때 규칙에 맞는지 판정합니다. 위 띠는 그 기능을 쥔 곳입니다. E는 이 글의 가상 명령입니다."
      ariaLabel="규칙 제정, 집행, 판정을 누가 쥐는지에 따라 명령 E의 판정 경로가 달라지는 과정"
      scenes={SCENES}
      render={(active) => {
        const seized = active === 3;
        const caption = [
          "E를 판정하는 곳도 E를 낸 행정부",
          "E를 판정하는 곳은 다른 경로의 법원",
          "겹쳐도 셋을 제약 없이 독점하지 못하게 배분",
          "남은 두 곳에서 제동 → 동시 장악이 필요",
        ][active];
        const arrowColor = active === 0 ? RED : GREEN;
        return (
          <svg viewBox="0 0 340 158" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <marker id="separation-arrow-red" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7Z" fill={RED} />
              </marker>
              <marker id="separation-arrow-green" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7Z" fill={GREEN} />
              </marker>
            </defs>

            {active === 0 && <Band x={8} width={324} label="행정부가 셋을 모두 쥠" color={RED} />}
            {(active === 1 || active === 3) && (
              <>
                <Band x={X[0]} width={W} label="의회" color={BLUE} />
                <Band x={X[1]} width={W} label="행정부" color={AMBER} />
                <Band x={X[2]} width={W} label="법원" color={GREEN} />
              </>
            )}
            {active === 2 && (
              <>
                <Band x={X[0]} width={X[1] + W - X[0]} label="입법 다수·행정부 사람 겹침" color={AMBER} />
                <Band x={X[2]} width={W} label="법원" color={GREEN} />
              </>
            )}

            {FUNCTIONS.map((fn, index) => {
              const taken = seized && index === 1;
              return (
                <g key={fn.name}>
                  <rect
                    x={X[index]}
                    y={44}
                    width={W}
                    height={58}
                    rx={8}
                    fill={taken ? `${RED}14` : `${GRAY}14`}
                    stroke={taken ? RED : GRAY}
                    strokeWidth={1}
                    strokeDasharray={taken ? "4 3" : undefined}
                  />
                  <text x={CX[index]} y={67} textAnchor="middle" fontSize={14} fontWeight={700} fill="currentColor">{fn.name}</text>
                  <text x={CX[index]} y={87} textAnchor="middle" fontSize={11.5} fill={taken ? RED : GRAY}>{taken ? "장악됨" : fn.does}</text>
                </g>
              );
            })}

            {seized ? (
              <>
                <Link from={0} to={1} color={GREEN} id="separation-arrow-green" />
                <Link from={2} to={1} color={GREEN} id="separation-arrow-green" />
              </>
            ) : (
              <Link from={1} to={2} color={arrowColor} id={active === 0 ? "separation-arrow-red" : "separation-arrow-green"} />
            )}
            <text x={170} y={136} textAnchor="middle" fontSize={12} fontWeight={700} fill={arrowColor}>{caption}</text>
          </svg>
        );
      }}
    />
  );
}
