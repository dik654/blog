import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — sign.c 135행 새 y, 140행 Ay, 해시로 challenge, 158–162행 z=y+cs1, 163행 크기 검사, 걸리면 rej.
 * 시도 1: y=[3,1](가정) → Ay=[2·3+3·1, 4·3+1·1]=[9,13], c=1(가정), z=[3,1]+[1,2]=[4,3] → 4는 |성분|<4 실패.
 * 시도 2: y=[2,1] → Ay=[7,9], z=[3,3] → 통과.
 */
const INK = "#64748b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const W = 360;
const H = 232;

const STEPS = [
  { where: "135행", what: "새 마스크 y" },
  { where: "140행", what: "약속 Ay" },
  { where: "해시", what: "challenge c" },
  { where: "158–162행", what: "응답 z = y + cs" },
  { where: "163행", what: "크기 검사 (예: |성분| < 4)" },
];

const FIRST = ["[3,1]", "[9,13]", "1", "[4,3]", "4 → 실패"];
const SECOND = ["[2,1]", "[7,9]", "1", "[3,3]", "통과"];

const SCENES = [
  { label: "첫 후보를 만듭니다", summary: "z = [4, 3]", values: FIRST, note: "새 y를 뽑아 약속 Ay를 계산하고, 그 높은 부분과 메시지 요약을 해시해 challenge를 만든 뒤 응답을 구성합니다. 값은 작은 예이며 y=[3,1]과 c=1은 [4,3]을 보이려는 가정입니다." },
  { label: "크기 검사에 걸립니다", summary: "rej로 돌아감", values: FIRST, note: "작은 예에서 각 성분의 절댓값이 4 미만이어야 한다고 가정하면 4에서 실패합니다. 코드의 rej는 후보를 버리고 처음으로 돌아가는 자리입니다." },
  { label: "새 마스크로 다시 만듭니다", summary: "z = [3, 3]", values: SECOND, note: "마스크가 바뀌면 약속도 응답도 함께 바뀝니다. 3절의 y=[2,1]을 쓰면 약속은 [7,9], 응답은 [3,3]입니다. c=1은 작은 예의 고정값입니다." },
  { label: "통과한 후보만 이어 갑니다", summary: "[3, 3] 통과", values: SECOND, note: "버린 [4,3]은 공개하지 않습니다. 실제 임계값은 GAMMA1−BETA와 다른 표준 상수이고, 그림은 크기 검사 한 곳만 보여 줍니다. 코드의 다른 조건은 생략했습니다." },
] as const;

export default function SignLoopViz() {
  return (
    <SceneShell
      eyebrow="서명 후보의 되돌림"
      title="통과할 때까지 후보를 버리고 처음으로 돌아갑니다"
      description="왼쪽 표시는 PQClean 고정본 sign.c의 행 번호이고, 오른쪽 값은 글의 작은 예입니다(가정). 코드가 실제로 다루는 값은 이 숫자들이 아닙니다."
      ariaLabel="마스크, 약속, challenge, 응답, 크기 검사를 거쳐 실패하면 처음으로 돌아가는 서명 생성 고리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const failed = active === 1;
        const passed = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {STEPS.map((step, i) => {
              const y = 4 + i * 36;
              const check = i === 4;
              const color = check && failed ? RED : check && passed ? GREEN : INK;
              return (
                <g key={step.where}>
                  <rect x={4} y={y} width={300} height={30} rx={5} fill={color} fillOpacity={check && (failed || passed) ? 0.1 : 0} stroke={color} strokeWidth={1} />
                  <text x={12} y={y + 20} fontSize={10.5} fontFamily="monospace" fill={INK}>{step.where}</text>
                  <text x={78} y={y + 20} fontSize={11.5} className="fill-foreground">{step.what}</text>
                  <text x={298} y={y + 20} textAnchor="end" fontSize={12} fontWeight={700} fontFamily="monospace" fill={check && failed ? RED : check && passed ? GREEN : undefined} className={check && (failed || passed) ? undefined : "fill-foreground"}>
                    {check && !failed && !passed ? "" : scene.values[i]}
                  </text>
                  {i < 4 && <line x1={154} x2={154} y1={y + 30} y2={y + 36} stroke={INK} strokeWidth={1} />}
                </g>
              );
            })}
            <path d="M304 163 L340 163 L340 19 L308 19" fill="none" stroke={failed ? RED : INK} strokeWidth={failed ? 1.25 : 1} strokeDasharray={failed ? undefined : "3 3"} />
            <path d="M313 14 L306 19 L313 24" fill="none" stroke={failed ? RED : INK} strokeWidth={failed ? 1.25 : 1} />
            <text x={352} y={95} textAnchor="middle" fontSize={11} fontWeight={failed ? 700 : 400} fill={failed ? RED : INK} transform="rotate(90 352 95)">rej</text>
            <line x1={154} x2={154} y1={178} y2={194} stroke={passed ? GREEN : INK} strokeWidth={passed ? 1.25 : 1} strokeDasharray={passed ? undefined : "3 3"} />
            <rect x={54} y={194} width={200} height={32} rx={5} fill={passed ? GREEN : "none"} fillOpacity={passed ? 0.1 : 0} stroke={passed ? GREEN : INK} strokeWidth={1} strokeDasharray={passed ? undefined : "3 3"} />
            <text x={154} y={215} textAnchor="middle" fontSize={12} fontWeight={passed ? 700 : 400} fill={passed ? undefined : INK} className={passed ? "fill-foreground" : undefined}>통과한 응답만 다음 단계로</text>
          </svg>
        );
      }}
    />
  );
}
