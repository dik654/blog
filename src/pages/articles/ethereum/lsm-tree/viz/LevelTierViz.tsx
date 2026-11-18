import LsmSceneShell from "./LsmSceneShell";

/**
 * 본문 대응: #compaction — leveled는 level 내부 키 범위 겹침을 제한해 point read가 확인할 파일을 줄이지만
 * 큰 다음 level과 겹치는 바이트를 반복해 다시 쓸 수 있고, tiered 계열은 비슷한 크기의 run을 늦게 합쳐
 * 쓰기 증폭을 줄일 수 있지만 읽을 run 수와 임시 공간이 늘어날 수 있습니다.
 * 가로축 = 키 a~z. 파일 수와 경계, 찾는 키 k는 설명용 가정입니다.
 */
const W = 360;
const H = 196;
const LEFT = 46;
const STEP = 11.4;
const kx = (index: number) => LEFT + index * STEP;
const KEY_K = 10;
const READ_X = kx(KEY_K) + STEP / 2;

type Span = readonly [number, number];
const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const spanLabel = (span: Span) => `${LETTERS[span[0]]}–${LETTERS[span[1]]}`;
const covers = (span: Span, index: number) => span[0] <= index && index <= span[1];
const overlaps = (a: Span, b: Span) => a[0] <= b[1] && b[0] <= a[1];

const L1: readonly Span[] = [[0, 7], [8, 15], [16, 25]];
const L2: readonly Span[] = [[0, 4], [5, 9], [10, 14], [15, 19], [20, 25]];
const MOVING: Span = [8, 15];
const RUNS: readonly Span[] = [[0, 25], [0, 25], [0, 25]];

const SCENES = [
  {
    label: "Leveled · 겹치지 않는 파일",
    summary: "키 k: level마다 파일 1개",
    note: "Leveled compaction은 한 level 안에서 파일의 키 범위가 겹치지 않도록 강하게 제한합니다. 키 k를 찾는 point read는 level마다 k를 덮는 파일 하나만 확인하고, 같은 키의 중복 사본도 줄어듭니다. 그림은 L1·L2 두 level만 그렸습니다.",
  },
  {
    label: "Leveled · 아래로 내릴 때",
    summary: "겹치는 L2 파일 3개를 다시 씀",
    note: "대신 L1의 i–p 파일을 L2로 합치려면 그 범위와 겹치는 L2 파일 f–j, k–o, p–t를 함께 읽어 새로 써야 합니다. 다음 level이 클수록 겹치는 바이트가 많아지고, 파일을 내릴 때마다 이 재작성이 반복될 수 있습니다.",
  },
  {
    label: "Tiered · run을 쌓아 둠",
    summary: "키 k: run 3개 확인",
    note: "Tiered 계열은 비슷한 크기의 run을 바로 합치지 않고 쌓아 둡니다. Run마다 키 범위가 겹치므로 키 k를 찾는 point read는 세 run을 모두 확인해야 할 수 있습니다.",
  },
  {
    label: "Tiered · 늦게 한 번에 병합",
    summary: "입력 run과 결과가 함께 존재",
    note: "Run이 쌓인 뒤 한 번에 합치므로 같은 바이트를 다시 쓰는 횟수를 줄여 쓰기 증폭을 줄일 수 있습니다. 대신 결과를 manifest에 설치하기 전까지 입력 run을 지울 수 없어 임시 공간이 늘어날 수 있습니다. 어느 방식이 나은지는 입력 분포와 read/write 비율 없이 정해지지 않습니다.",
  },
] as const;

function FileRect({ span, y, tone, label = true }: { span: Span; y: number; tone: "plain" | "hit" | "move" | "rewrite" | "ghost" | "out"; label?: boolean }) {
  const x = kx(span[0]) + 1;
  const width = (span[1] - span[0] + 1) * STEP - 2;
  const stroke = tone === "hit" || tone === "out" ? "#2563eb" : tone === "move" || tone === "rewrite" ? "#d97706" : "#94a3b8";
  const fill = tone === "rewrite" ? "#fef3c7" : tone === "hit" || tone === "out" ? "#dbeafe" : tone === "move" ? "#fef3c7" : "#f8fafc";
  return (
    <g>
      <rect x={x} y={y} width={width} height={24} rx={4} fill={tone === "ghost" ? "none" : fill} stroke={stroke} strokeWidth={1} strokeDasharray={tone === "ghost" ? "4 3" : undefined} />
      {label ? (
        <text x={x + width / 2} y={y + 16} textAnchor="middle" fontSize={11} fill={tone === "ghost" ? "#64748b" : "#334155"}>
          {spanLabel(span)}
        </text>
      ) : null}
    </g>
  );
}

function Axis() {
  return (
    <g>
      <line x1={kx(0)} x2={kx(26)} y1={H - 22} y2={H - 22} stroke="#94a3b8" strokeWidth={1} />
      <text x={kx(0)} y={H - 8} fontSize={11} fill="#64748b">a</text>
      <text x={kx(26)} y={H - 8} textAnchor="end" fontSize={11} fill="#64748b">z</text>
      <text x={(kx(0) + kx(26)) / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">키 범위</text>
    </g>
  );
}

function ReadLine({ top, bottom }: { top: number; bottom: number }) {
  return (
    <g>
      <line x1={READ_X} x2={READ_X} y1={top} y2={bottom} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
      <text x={READ_X} y={top - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">k</text>
    </g>
  );
}

export default function LevelTierViz() {
  return (
    <LsmSceneShell
      eyebrow="Compaction 방식 · 겹침과 재작성"
      title="Leveled는 겹침을 줄이며 다시 쓰고, tiered는 늦게 합치며 run을 남깁니다"
      description="가로축은 키 범위이고 막대 하나가 파일(run)입니다. 파일 수, 경계, 찾는 키 k는 설명용 가정입니다."
      ariaLabel="leveled compaction의 겹치지 않는 파일과 재작성, tiered compaction의 겹치는 run과 늦은 병합을 비교하는 그림"
      scenes={SCENES}
      render={(active) => {
        const leveled = active <= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {leveled ? (
              <g>
                <text x={4} y={52} fontSize={11} fontWeight={700} fill="#64748b">L1</text>
                <text x={4} y={118} fontSize={11} fontWeight={700} fill="#64748b">L2</text>
                {L1.map((span) => (
                  <FileRect
                    key={`l1-${span[0]}`}
                    span={span}
                    y={36}
                    tone={active === 0 ? (covers(span, KEY_K) ? "hit" : "plain") : span === MOVING ? "move" : "plain"}
                  />
                ))}
                {L2.map((span) => (
                  <FileRect
                    key={`l2-${span[0]}`}
                    span={span}
                    y={102}
                    tone={active === 0 ? (covers(span, KEY_K) ? "hit" : "plain") : overlaps(span, MOVING) ? "rewrite" : "plain"}
                  />
                ))}
                {active === 0 ? <ReadLine top={24} bottom={132} /> : null}
                {active === 1 ? (
                  <g>
                    <line x1={(kx(MOVING[0]) + kx(MOVING[1] + 1)) / 2} x2={(kx(MOVING[0]) + kx(MOVING[1] + 1)) / 2} y1={62} y2={98} stroke="#d97706" strokeWidth={1} />
                    <path d={`M ${(kx(MOVING[0]) + kx(MOVING[1] + 1)) / 2 - 4} 92 L ${(kx(MOVING[0]) + kx(MOVING[1] + 1)) / 2} 99 L ${(kx(MOVING[0]) + kx(MOVING[1] + 1)) / 2 + 4} 92`} fill="none" stroke="#d97706" strokeWidth={1} />
                    <text x={kx(26)} y={150} textAnchor="end" fontSize={11} fill="#b45309">주황 = 다시 읽고 쓰는 파일</text>
                  </g>
                ) : (
                  <text x={kx(26)} y={150} textAnchor="end" fontSize={11} fill="#2563eb">파랑 = k를 찾을 때 여는 파일</text>
                )}
              </g>
            ) : (
              <g>
                {RUNS.map((span, index) => (
                  <g key={`run-${index}`}>
                    <text x={4} y={34 + index * 32} fontSize={11} fontWeight={700} fill="#64748b">run {index + 1}</text>
                    <FileRect span={span} y={18 + index * 32} tone={active === 2 ? "hit" : "ghost"} label={false} />
                  </g>
                ))}
                {active === 2 ? <ReadLine top={12} bottom={118} /> : null}
                {active === 2 ? (
                  <text x={kx(26)} y={140} textAnchor="end" fontSize={11} fill="#2563eb">세 run 모두 k 범위를 덮음</text>
                ) : (
                  <g>
                    <text x={4} y={146} fontSize={11} fontWeight={700} fill="#64748b">결과</text>
                    <FileRect span={[0, 25]} y={130} tone="out" label={false} />
                    <text x={(kx(0) + kx(26)) / 2} y={124} textAnchor="middle" fontSize={11} fill="#64748b">점선 입력은 설치 전까지 남음</text>
                  </g>
                )}
              </g>
            )}
            <Axis />
          </svg>
        );
      }}
    />
  );
}
