import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture(4절)와 #source(8절) — dispatch는 목적지별로 입력을 모으고, 도착한 입력을 expert별 연속 구간으로
 * 배치하며, combine은 metadata로 원래 token 위치에 결과를 돌려놓는다. routing이 [13,42]→[14,42]로 바뀌면
 * 목적 GPU는 같아도 GPU 1의 expert별 구간이 달라진다.
 * token 37의 [13,42]는 본문 값이고, token 35·36·38과 그 expert 번호는 설명용 가정이다.
 * 목적 GPU = floor(expert / 8): 3→0, 9·13·14→1, 40·42·44→5.
 */
type Pick = { token: number; expert: number };

const BASE: readonly Pick[] = [
  { token: 35, expert: 9 },
  { token: 35, expert: 44 },
  { token: 36, expert: 42 },
  { token: 36, expert: 3 },
  { token: 37, expert: 13 },
  { token: 37, expert: 42 },
  { token: 38, expert: 14 },
  { token: 38, expert: 40 },
];
const CHANGED: readonly Pick[] = BASE.map((p) => (p.token === 37 && p.expert === 13 ? { token: 37, expert: 14 } : p));

const TOKENS = [35, 36, 37, 38] as const;
const GPU_SHOWN = [0, 1, 5] as const;
const gpuOf = (e: number) => Math.floor(e / 8);

/** 목적 GPU 안에서 expert 번호 순으로 연속 구간을 만든다. */
function segments(picks: readonly Pick[], gpu: number) {
  const experts = Array.from(new Set(picks.filter((p) => gpuOf(p.expert) === gpu).map((p) => p.expert))).sort((a, b) => a - b);
  return experts.map((e) => ({ expert: e, tokens: picks.filter((p) => p.expert === e).map((p) => p.token) }));
}

const SCENES = [
  { label: "원래 순서 · GPU 0", summary: "token 4개 × top-2 = 입력 8벌", note: "목적 GPU는 expert 번호를 8로 나눈 몫입니다. token 37의 13과 42는 GPU 1과 5로 갑니다." },
  { label: "Dispatch · 목적지별로 모음", summary: "GPU 0 1벌 · GPU 1 3벌 · GPU 5 4벌", note: "같은 목적지로 가는 입력끼리 모아 보냅니다. expert 3은 GPU 0 자신이라 밖으로 나가지 않습니다." },
  { label: "도착 · expert별 연속 구간", summary: "GPU 5: e40 | e42 e42 | e44", note: "도착한 입력을 expert별로 이어 붙여 각 expert가 자기 구간을 한 번에 계산합니다. 순서가 섞이니 원래 token을 metadata로 남깁니다." },
  { label: "Combine · 원래 위치로", summary: "metadata로 token 칸에 되돌림", note: "결과를 metadata대로 원래 token 칸에 돌려놓고 결합합니다. 기록이 틀리면 바이트 수가 맞아도 다른 token의 결과를 합칠 수 있습니다." },
  { label: "routing 변경 · [13,42] → [14,42]", summary: "목적 GPU 같음 · GPU 1 구간 바뀜", note: "새 선택 14도 GPU 1이라 바이트는 같지만 GPU 1의 구간이 바뀝니다. 옛 handle(위치 기록)은 못 쓰고 새로 dispatch해야 합니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const MUTED = "#94a3b8";

function Chip({ token, expert, strong, changed }: { token: number; expert?: number; strong: boolean; changed?: boolean }) {
  const color = changed ? AMBER : strong ? BLUE : MUTED;
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-sm border px-1 font-mono text-[11px] leading-5"
      style={{ borderColor: color, color: strong || changed ? color : undefined }}
    >
      t{token}
      {expert === undefined ? "" : `·e${expert}`}
    </span>
  );
}

export default function DispatchLayoutViz() {
  return (
    <SceneShell
      eyebrow="Dispatch layout"
      title="입력은 목적지별로 모였다가 expert별로 다시 놓이고, 기록을 따라 돌아옵니다"
      description="칩 t37·e13은 'token 37의 입력 한 벌이 expert 13으로 간다'는 뜻입니다. 구간 장면에서는 e13 묶음 안에 t37만 적습니다. GPU 0이 보내는 것만 그렸고, token 35·36·38의 선택은 설명용 가정입니다."
      note="GPU g에는 expert 8g~8g+7이 있다는 본문 배치를 씁니다. header와 metadata 바이트는 세지 않았습니다."
      ariaLabel="GPU 0의 token 네 개가 목적지별로 모였다가 expert별 구간에서 계산되고 원래 위치로 돌아오는 과정"
      scenes={SCENES}
      render={(active) => {
        const picks = active === 4 ? CHANGED : BASE;
        return (
          <div className="min-w-0 space-y-3">
            <div className="rounded-md border border-border p-2">
              <p className="text-[11px] font-bold text-muted-foreground">GPU 0 · token 순서</p>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {TOKENS.map((t) => (
                  <div key={t} className="flex min-w-0 flex-wrap items-center gap-1 rounded-sm border border-dashed border-border px-1.5 py-1">
                    <span className="w-8 shrink-0 font-mono text-[11px] font-bold">t{t}</span>
                    {active === 3 ? (
                      <span className="font-mono text-[11px] text-[#16a34a]">y 2개 결합</span>
                    ) : (
                      picks
                        .filter((p) => p.token === t)
                        .map((p) => (
                          <span key={p.expert} className="font-mono text-[11px]" style={{ color: t === 37 ? BLUE : undefined }}>
                            e{p.expert}→G{gpuOf(p.expert)}
                          </span>
                        ))
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {GPU_SHOWN.map((g) => {
                const bound = picks.filter((p) => gpuOf(p.expert) === g);
                const segs = segments(picks, g);
                return (
                  <div key={g} className="min-w-0 rounded-md border border-border p-2">
                    <p className="text-[11px] font-bold">
                      {g === 0 ? "GPU 0 (자신)" : `GPU ${g}`}
                      <span className="ml-1 font-normal text-muted-foreground">{active >= 1 ? `${bound.length}벌` : ""}</span>
                    </p>
                    <div className="mt-1.5 flex min-h-[3.25rem] flex-wrap content-start items-center gap-1">
                      {active === 0 ? (
                        <span className="text-[11px] text-muted-foreground">아직 보내지 않음</span>
                      ) : active === 1 ? (
                        bound.map((p) => <Chip key={`${p.token}-${p.expert}`} token={p.token} expert={p.expert} strong={p.token === 37} />)
                      ) : active === 3 ? (
                        <span className="text-[11px] text-muted-foreground">
                          y {bound.length}벌 → GPU 0의 token 칸으로
                        </span>
                      ) : (
                        segs.map((s) => (
                          <span key={s.expert} className="inline-flex max-w-full flex-wrap items-center gap-0.5 rounded-sm border border-border px-1 py-0.5">
                            <span className="font-mono text-[11px] font-bold text-muted-foreground">e{s.expert}</span>
                            {s.tokens.map((t) => (
                              <Chip key={t} token={t} strong={t === 37} changed={active === 4 && t === 37} />
                            ))}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
