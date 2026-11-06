import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sampling — counter 는 사건 수만 세고, sampler 는 고정 간격으로 warp 하나의 상태와 주소를 적는다.
 * 40 clock·warp 4개·4 clock 간격·표본 10개는 그림을 위한 가정이다. 표본 10개 중 6개가 memory 대기(글의 100개 중 60개와 같은 비율).
 */
const COLS = 40;
const WARPS = [0, 1, 2, 3] as const;
const ISSUES: readonly (readonly [number, number])[] = [
  [0, 0], [2, 1], [5, 2], [9, 3], [11, 0], [15, 1], [18, 2], [21, 3], [25, 0], [27, 1], [31, 2], [34, 3], [38, 0],
];
const SAMPLES = [
  { clock: 3, warp: 0, addr: "A", wait: true },
  { clock: 7, warp: 2, addr: "A", wait: true },
  { clock: 11, warp: 0, addr: "C", wait: false },
  { clock: 15, warp: 3, addr: "A", wait: true },
  { clock: 19, warp: 1, addr: "B", wait: true },
  { clock: 23, warp: 2, addr: "A", wait: true },
  { clock: 27, warp: 1, addr: "C", wait: false },
  { clock: 31, warp: 3, addr: "A", wait: true },
  { clock: 35, warp: 0, addr: "B", wait: false },
  { clock: 39, warp: 2, addr: "B", wait: false },
] as const;
const ADDRESSES = ["A", "B", "C"] as const;
const WAIT_TOTAL = SAMPLES.filter((sample) => sample.wait).length;

const LEFT = 28;
const CELL = 8.1;
const TOP = 22;
const ROW = 16;
const WAIT_COLOR = "#d97706";
const OTHER_COLOR = "#64748b";
const ISSUE_COLOR = "#2563eb";

const SCENES = [
  { label: "Counter 가 아는 것", summary: `issue ${ISSUES.length}번`, note: "Counter 는 issue 같은 사건을 셉니다. 파란 칸 수는 나오지만, 빈 칸에서 warp 들이 무엇을 기다렸는지는 남지 않습니다." },
  { label: "간격마다 하나씩", summary: "4 clock 간격 (가정)", note: "SM 마다 고정 간격으로 active warp(SM 에 올라온 warp) 하나를 무작위로 골라 program counter(instruction 주소)와 scheduler 상태를 적습니다. 실제 간격은 장치에 따라 32~2,048 clock 으로 달라질 수 있습니다." },
  { label: "주소별로 쌓기", summary: "A 5 · B 3 · C 2", note: "기록은 시간 순서가 아니라 instruction 주소별 표본 수로 남습니다. 어느 주소에 어떤 상태가 몰렸는지는 읽어도, 그 일이 언제였는지는 읽을 수 없습니다." },
  { label: "비율은 추정값", summary: `${WAIT_TOTAL} / ${SAMPLES.length} = 60%`, note: "표본의 60%가 memory 결과를 기다렸다면 관측된 active warp-cycle 의 약 60%가 그 상태였다고 추정합니다. 표본이 적으면 비율이 크게 흔들릴 수 있습니다." },
] as const;

const cx = (clock: number) => LEFT + clock * CELL;
const ry = (warp: number) => TOP + warp * ROW;

export default function SamplingAddressViz() {
  return (
    <SceneShell
      eyebrow="Counter 와 sampling"
      title="Sampler 는 간격마다 warp 하나를 적고, 시간 순서 없이 주소별로 쌓습니다"
      description="한 칸이 1 clock, 가로줄 하나가 warp 입니다. 칸 수·warp 4개·주소 A, B, C·표본 10개는 가정입니다."
      ariaLabel="counter 가 세는 사건과 sampler 가 고정 간격으로 뽑아 주소별로 쌓는 표본"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {WARPS.map((warp) => (
              <g key={warp}>
                <text x={0} y={ry(warp) + 11} fontSize={11} fill="currentColor">W{warp}</text>
                {Array.from({ length: COLS }, (_, clock) => (
                  <rect key={clock} x={cx(clock)} y={ry(warp)} width={CELL - 1} height={ROW - 2} fill="none" stroke="#94a3b8" strokeOpacity={0.35} strokeWidth={1} />
                ))}
              </g>
            ))}
            {ISSUES.map(([clock, warp]) => (
              <rect key={clock} x={cx(clock)} y={ry(warp)} width={CELL - 1} height={ROW - 2} fill={ISSUE_COLOR} opacity={active === 0 || active === 1 ? 0.9 : 0.35} />
            ))}
            {active >= 1 && SAMPLES.map((sample) => (
              <g key={sample.clock} opacity={active >= 2 ? 0.35 : 1}>
                <line x1={cx(sample.clock) + CELL / 2} x2={cx(sample.clock) + CELL / 2} y1={TOP - 8} y2={TOP - 2} stroke="#64748b" strokeWidth={1} />
                <rect x={cx(sample.clock) - 1} y={ry(sample.warp) - 1} width={CELL + 1} height={ROW} fill={sample.wait ? WAIT_COLOR : OTHER_COLOR} fillOpacity={0.55} stroke={sample.wait ? WAIT_COLOR : OTHER_COLOR} strokeWidth={1.25} />
              </g>
            ))}

            {active === 0 && (
              <g>
                <rect x={LEFT} y={112} width={324} height={46} rx={8} fill="none" stroke={ISSUE_COLOR} strokeWidth={1} />
                <text x={LEFT + 12} y={141} fontSize={14} fontWeight={700} fill="currentColor">Counter: issue {ISSUES.length}번</text>
                <rect x={LEFT} y={170} width={324} height={46} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={LEFT + 12} y={199} fontSize={13} fill="currentColor">빈 칸에서 무엇을 기다렸나: 기록 없음</text>
              </g>
            )}

            {active === 1 && (
              <g>
                <text x={LEFT} y={124} fontSize={12} fill="currentColor">적힌 순서대로 (warp · 주소)</text>
                {SAMPLES.map((sample, index) => {
                  const col = index % 5;
                  const row = Math.floor(index / 5);
                  return (
                    <g key={sample.clock}>
                      <rect x={LEFT + col * 65} y={136 + row * 40} width={60} height={32} rx={4} fill={sample.wait ? WAIT_COLOR : OTHER_COLOR} fillOpacity={0.2} stroke={sample.wait ? WAIT_COLOR : OTHER_COLOR} strokeWidth={1} />
                      <text x={LEFT + col * 65 + 30} y={157 + row * 40} textAnchor="middle" fontSize={12} fill="currentColor">W{sample.warp} · {sample.addr}</text>
                    </g>
                  );
                })}
              </g>
            )}

            {active >= 2 && (
              <g>
                {ADDRESSES.map((addr, column) => {
                  const inBin = SAMPLES.filter((sample) => sample.addr === addr);
                  const x = LEFT + column * 66;
                  return (
                    <g key={addr}>
                      {inBin.map((sample, index) => (
                        <rect key={sample.clock} x={x + 6} y={198 - (index + 1) * 16} width={44} height={14} fill={sample.wait ? WAIT_COLOR : OTHER_COLOR} fillOpacity={0.55} stroke={sample.wait ? WAIT_COLOR : OTHER_COLOR} strokeWidth={1} />
                      ))}
                      <line x1={x} x2={x + 56} y1={200} y2={200} stroke="#94a3b8" strokeWidth={1} />
                      <text x={x + 28} y={216} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">주소 {addr} · {inBin.length}</text>
                    </g>
                  );
                })}
                {active === 2 && (
                  <g fontSize={12} fill="currentColor">
                    <text x={236} y={136}>순서는 사라지고</text>
                    <text x={236} y={154}>주소·상태별</text>
                    <text x={236} y={172}>개수만 남습니다</text>
                  </g>
                )}
                {active === 3 && (
                  <g fontSize={12} fill="currentColor">
                    <text x={236} y={124} fontWeight={700}>표본 1개의 무게</text>
                    <text x={236} y={144}>10개 중 1개 → 10%</text>
                    <text x={236} y={162}>100개 중 1개 → 1%</text>
                    <text x={236} y={190}>잰 시간이 아니라</text>
                    <text x={236} y={208}>통계입니다</text>
                  </g>
                )}
              </g>
            )}
          </svg>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span><span className="mr-1 inline-block h-2.5 w-2.5 align-middle" style={{ backgroundColor: ISSUE_COLOR }} />파랑 issue</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 align-middle" style={{ backgroundColor: WAIT_COLOR }} />주황 memory 대기 표본</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 align-middle" style={{ backgroundColor: OTHER_COLOR }} />회색 그 외 표본</span>
          </div>
        </div>
      )}
    />
  );
}
