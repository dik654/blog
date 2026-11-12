import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kernel-source — Punica의 expand 한 번 FLOP·I/O 식에 7절 숫자를 넣는다.
 * s_n=4, h_i=16, h_o=4,096, BF16 2 byte.
 * 입출력 2×4×(16+4,096) = 32,896 byte, B 한 장 2×16×4,096 = 131,072 byte.
 * n=1: 163,968 · n=3: 426,112 · n=4(token마다 따로): 557,184 byte. FLOP = 2×4×16×4,096 = 524,288.
 */
const IO_BYTES = 32_896;
const B_BYTES = 131_072;
const FLOP = 524_288;
const SCALE = 600_000;
const BOUNDARY = 161;

const ROWS = [
  { key: "one", label: "네 token이 같은 adapter", n: 1 },
  { key: "seg", label: "구간으로 묶음 (7절)", n: 3 },
  { key: "each", label: "token마다 따로", n: 4 },
] as const;

const SCENES = [
  {
    label: "7절 batch: adapter 3종",
    summary: "426,112 byte",
    shown: [1], current: 1,
    note: "회색은 token 네 개가 16칸을 읽고 4,096칸을 쓰는 몫(32,896 byte)이고, 청록 한 칸은 expand가 읽는 B 한 장(16×4,096×2 byte = 131,072 byte)입니다. 종류가 셋이라 B를 세 장 읽어 전체의 92%가 B 읽기입니다.",
  },
  {
    label: "모두 같은 adapter면 n=1",
    summary: "163,968 byte",
    shown: [0, 1], current: 0,
    note: "token 수와 계산량은 그대로인데 B를 한 장만 읽습니다. 바뀐 것은 청록 칸의 개수뿐입니다.",
  },
  {
    label: "token마다 따로 계산하면",
    summary: "557,184 byte · 31% 더",
    shown: [0, 1, 2], current: 2,
    note: "adapter A를 쓰는 두 token이 그 adapter의 B를 따로 한 번씩 읽어 n 자리에 4가 들어갑니다. 구간으로 묶은 426,112 byte보다 31% 많습니다.",
  },
  {
    label: "byte당 계산을 A100 경계와 비교",
    summary: "3.20 · 1.23 · 0.94 ≪ 161",
    shown: [0, 1, 2], current: -1,
    note: "세 경우 모두 계산량 524,288 FLOP을 옮긴 byte로 나눴습니다. 논문이 그린 A100 경계 161(312 TFLOP/s ÷ 1.935 TB/s)보다 훨씬 낮아 셋 다 메모리 읽기에 묶입니다. tile·cache 재사용을 뺀 하한 모형입니다.",
  },
] as const;

const fmt = (value: number) => value.toLocaleString("en-US");

export default function ExpandIoViz() {
  return (
    <SceneShell
      eyebrow="expand 한 번의 I/O"
      title="계산량은 그대로인데 adapter 종류 수만큼 B를 더 읽습니다"
      description="막대는 expand 한 번이 옮기는 byte입니다. n은 이번 batch에 등장한 서로 다른 adapter 수이고, 계산량은 세 경우 모두 2×4×16×4,096 = 524,288 FLOP입니다."
      ariaLabel="adapter 종류 수 n에 따라 expand 한 번이 옮기는 byte와 byte당 계산 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ratioMode = active === 3;
        return (
          <div className="min-w-0 space-y-4">
            {ROWS.map((row, index) => {
              const shown = (scene.shown as readonly number[]).includes(index);
              const isCurrent = scene.current === index;
              const total = IO_BYTES + row.n * B_BYTES;
              const ratio = FLOP / total;
              return (
                <div key={row.key} className={`min-w-0 ${shown ? "" : "opacity-30"}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
                    <span className={isCurrent ? "font-bold" : "text-muted-foreground"}>
                      {row.label} · n={row.n}
                    </span>
                    <span className="font-mono">
                      {!shown ? "−" : ratioMode ? `${ratio.toFixed(2)} FLOP/byte` : `${fmt(total)} byte`}
                    </span>
                  </div>
                  <div className="mt-1 flex h-5 min-w-0 gap-px rounded-sm bg-muted/40">
                    {ratioMode ? (
                      <div className="h-full rounded-sm" style={{ width: `${Math.max((ratio / BOUNDARY) * 100, 0.6)}%`, backgroundColor: "#2563eb" }} />
                    ) : (
                      shown && (
                        <>
                          <div className="h-full rounded-sm" style={{ width: `${(IO_BYTES / SCALE) * 100}%`, backgroundColor: "#64748b" }} />
                          {Array.from({ length: row.n }, (_, block) => (
                            <div
                              key={block}
                              className="flex h-full items-center justify-center rounded-sm text-[10px] font-bold text-white"
                              style={{ width: `${(B_BYTES / SCALE) * 100}%`, backgroundColor: "#0d9488" }}
                            >
                              B
                            </div>
                          ))}
                        </>
                      )
                    )}
                  </div>
                </div>
              );
            })}
            <div className="min-h-[2.5rem] text-xs leading-5 text-muted-foreground">
              {ratioMode ? (
                <div className="min-w-0">
                  <div className="h-2 rounded-sm" style={{ backgroundColor: "#d97706" }} />
                  <p className="mt-1">주황 막대 전체 = A100 경계 161 FLOP/byte. 파란 막대가 이 길이에 닿아야 계산에 묶입니다.</p>
                </div>
              ) : (
                <p>
                  <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#64748b" }} />
                  입출력 32,896 byte
                  <span className="ml-3 mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#0d9488" }} />
                  B 한 장 131,072 byte · 막대 전체 600,000 byte
                </p>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
