import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-level-scheduling — 300 token 요청을 64 token block으로 자르고, pod별 index와 block hash를 맞춰
 * 예상 적중 token을 세며, hash 사슬 때문에 앞 block 하나가 달라지면 뒤 block이 모두 불일치가 된다.
 * (300−1)÷64+1 = 5개 block: 64·64·64·64·44. pod A 4×64 = 256 token, pod B 0 token.
 */
const BLOCKS = [64, 64, 64, 64, 44] as const;
const BLOCK_LIST: readonly number[] = BLOCKS;
const STARTS = BLOCK_LIST.reduce<number[]>(
  (acc, size, index) => [
    ...acc,
    index === 0 ? 0 : acc[index - 1] + BLOCK_LIST[index - 1],
  ],
  [],
);

const X0 = 50;
const X1 = 316;
const TOTAL = 300;
const bx = (token: number) => X0 + (token / TOTAL) * (X1 - X0);

const BLUE = "#2563eb";
const GREEN = "#059669";
const RED = "#dc2626";
const GRAY = "#64748b";
const LIGHT = "#94a3b8";

interface Scene {
  label: string;
  summary: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "64 token씩 자르기",
    summary: "(300 − 1) ÷ 64 + 1 = 5 block",
    note: "입력 300 token을 앞에서부터 64 token씩 자르면 block 다섯 개가 나오고 마지막 block에는 남은 44 token만 들어갑니다. (가정) 앞 256 token은 모든 요청에 같은 system prompt입니다.",
  },
  {
    label: "pod별 index와 맞춰 보기",
    summary: "pod A 4 × 64 = 256 · pod B 0",
    note: "block마다 hash를 만들어 pod별 LRU index에서 찾습니다. 방금 같은 prompt의 요청을 받은 pod A에는 앞 네 block의 hash가 있어 256 token이 이미 계산돼 있을 것으로 예상되고, 그런 요청을 받은 적 없는 pod B는 0입니다.",
  },
  {
    label: "hash를 사슬로 엮기",
    summary: "hᵢ = H(block i 내용, hᵢ₋₁)",
    note: "block i의 hash는 그 block 내용의 hash와 바로 앞 hash를 함께 넣어 만듭니다. 첫 block은 모델 이름과 cache salt로 만든 seed에 이어지므로 모델이 다르면 같은 문장도 섞이지 않습니다.",
  },
  {
    label: "앞부분 한 곳이 다르면",
    summary: "h₀부터 h₄까지 모두 다름 → 0 token",
    note: "(가정) 10번째 token 하나만 다른 요청이면 block 0의 내용 hash가 달라지고, 그 값이 사슬을 타고 뒤로 전해져 내용이 같은 block 1~3의 hash도 모두 달라집니다. 처음부터 이어서 같은 앞부분만 일치로 잡히므로 pod A의 예상 적중도 0입니다.",
  },
];

export default function PrefixBlockViz() {
  return (
    <SceneShell
      eyebrow="앞부분 캐시 예상"
      title="token을 block으로 자르고 hash를 사슬로 엮어 pod마다 이미 계산된 앞부분을 셉니다"
      description="맨 위 줄이 300 token 요청 하나이고 칸 너비가 token 수에 비례합니다. 둘째 줄은 block마다 만든 hash, 아래 두 줄은 각 pod의 index에 같은 hash가 있는지입니다."
      ariaLabel="300 token 요청의 block 분할, hash 사슬, pod별 예상 적중"
      scenes={SCENES}
      render={(active) => {
        const showHash = active >= 1;
        const showChain = active >= 2;
        const broken = active === 3;
        const podA = BLOCK_LIST.map((_, index) => index < 4 && !broken);
        const hitA = podA.filter(Boolean).length * 64;
        return (
          <svg
            viewBox="0 0 320 236"
            className="mx-auto h-auto w-full max-w-[520px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            <text x={4} y={42} fontSize={11} fontWeight={700} fill={GRAY}>
              요청
            </text>
            {BLOCK_LIST.map((size, index) => {
              const x = bx(STARTS[index]) + 1.5;
              const w = bx(STARTS[index] + size) - bx(STARTS[index]) - 3;
              const changed = broken && index === 0;
              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={26}
                    width={w}
                    height={26}
                    rx={3}
                    fill={changed ? RED : BLUE}
                    fillOpacity={changed ? 0.16 : index < 4 ? 0.14 : 0.06}
                    stroke={changed ? RED : BLUE}
                    strokeWidth={1}
                  />
                  <text
                    x={x + w / 2}
                    y={43}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill={changed ? RED : BLUE}
                  >
                    {size}
                  </text>
                  <text
                    x={x + w / 2}
                    y={66}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={changed ? 700 : 400}
                    fill={changed ? RED : GRAY}
                  >
                    {changed
                      ? "10번째 다름"
                      : `${STARTS[index]}–${STARTS[index] + size - 1}`}
                  </text>
                </g>
              );
            })}
            <path
              d={`M${bx(0) + 1.5},18 V14 H${bx(256) - 1.5} V18`}
              fill="none"
              stroke={GRAY}
              strokeWidth={1}
            />
            <text
              x={(bx(0) + bx(256)) / 2}
              y={10}
              textAnchor="middle"
              fontSize={10}
              fill={GRAY}
            >
              앞 256 token: 공통 system prompt (가정)
            </text>

            {showHash && (
              <g>
                <text x={4} y={110} fontSize={11} fontWeight={700} fill={GRAY}>
                  hash
                </text>
                {showChain && (
                  <g>
                    <rect
                      x={4}
                      y={120}
                      width={44}
                      height={20}
                      rx={3}
                      fill="none"
                      stroke={broken ? GRAY : LIGHT}
                      strokeWidth={1}
                    />
                    <text
                      x={26}
                      y={134}
                      textAnchor="middle"
                      fontSize={9}
                      fill={GRAY}
                    >
                      seed
                    </text>
                    <text
                      x={26}
                      y={152}
                      textAnchor="middle"
                      fontSize={9}
                      fill={GRAY}
                    >
                      모델·salt
                    </text>
                    <line
                      x1={48}
                      y1={126}
                      x2={bx(32) - 15}
                      y2={108}
                      stroke={LIGHT}
                      strokeWidth={1}
                    />
                  </g>
                )}
                {BLOCK_LIST.map((size, index) => {
                  const cx = bx(STARTS[index] + size / 2);
                  const bad = broken;
                  return (
                    <g key={index}>
                      <line
                        x1={cx}
                        y1={72}
                        x2={cx}
                        y2={92}
                        stroke={LIGHT}
                        strokeWidth={1}
                      />
                      <rect
                        x={cx - 15}
                        y={93}
                        width={30}
                        height={22}
                        rx={3}
                        fill={bad ? RED : BLUE}
                        fillOpacity={bad ? 0.14 : 0.08}
                        stroke={bad ? RED : BLUE}
                        strokeWidth={1}
                      />
                      <text
                        x={cx}
                        y={108}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={700}
                        fill={bad ? RED : BLUE}
                      >
                        h{index}
                      </text>
                      {showChain && index < BLOCK_LIST.length - 1 && (
                        <g>
                          <line
                            x1={cx + 15}
                            y1={104}
                            x2={
                              bx(
                                STARTS[index + 1] + BLOCK_LIST[index + 1] / 2,
                              ) - 18
                            }
                            y2={104}
                            stroke={bad ? RED : GRAY}
                            strokeWidth={1.25}
                          />
                          <path
                            d={`M${bx(STARTS[index + 1] + BLOCK_LIST[index + 1] / 2) - 18},100 l4,4 l-4,4`}
                            fill="none"
                            stroke={bad ? RED : GRAY}
                            strokeWidth={1.25}
                          />
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            )}

            {showHash && (
              <g>
                {(["pod A", "pod B"] as const).map((pod, row) => {
                  const y = 168 + row * 28;
                  return (
                    <g key={pod}>
                      <text
                        x={4}
                        y={y + 14}
                        fontSize={11}
                        fontWeight={700}
                        fill={GRAY}
                      >
                        {pod}
                      </text>
                      {BLOCK_LIST.map((size, index) => {
                        const hit = row === 0 && podA[index];
                        const missAfterBreak = row === 0 && broken && index < 4;
                        const cx = bx(STARTS[index] + size / 2);
                        return (
                          <g key={index}>
                            <rect
                              x={cx - 15}
                              y={y}
                              width={30}
                              height={20}
                              rx={3}
                              fill={hit ? GREEN : "none"}
                              fillOpacity={0.16}
                              stroke={
                                hit ? GREEN : missAfterBreak ? RED : LIGHT
                              }
                              strokeWidth={1}
                              strokeDasharray={hit ? undefined : "3 2"}
                            />
                            <text
                              x={cx}
                              y={y + 14}
                              textAnchor="middle"
                              fontSize={10}
                              fontWeight={700}
                              fill={hit ? GREEN : missAfterBreak ? RED : LIGHT}
                            >
                              {hit ? "있음" : "없음"}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
                <text x={4} y={230} fontSize={11} fill={GRAY}>
                  예상 적중: pod A{" "}
                  <tspan fontWeight={700} fill={hitA > 0 ? GREEN : RED}>
                    {hitA} token
                  </tspan>{" "}
                  · pod B <tspan fontWeight={700}>0 token</tspan>
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
