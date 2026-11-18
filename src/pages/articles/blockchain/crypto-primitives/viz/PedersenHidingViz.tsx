import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pedersen — 위수 19, H=2G, C=vG+rH=(v+2r)G.
 * v=3,r=4 → 11G, v=5,r=3 → 11G (binding 실패).
 * 고정한 v에서 r=0..18이면 v+2r mod 19가 19칸을 한 번씩 지남 (hiding 유지).
 * 칸 c에 도착하는 r = (c−v)·10 mod 19 (2의 역원이 10이므로).
 */
const ORDER = 19;
const INV2 = 10;
const CELLS = Array.from({ length: ORDER }, (_, c) => c);
const rFor = (v: number, c: number) => (((c - v) * INV2) % ORDER + ORDER) % ORDER;

const SCENES = [
  { label: "v=3으로 엽니다", summary: "3 + 2×4 = 11 → 11G", rows: [3], fill: false, note: "H=2G이므로 vG+rH는 (v+2r)G입니다. 위수가 19라 G를 19번 더하면 처음으로 돌아오고, 계수는 19로 나눈 나머지로만 셉니다. v=3, r=4는 11번 칸에 도착합니다." },
  { label: "v=5도 같은 칸", summary: "5 + 2×3 = 11 → 11G", rows: [3, 5], fill: false, note: "다른 값 v=5와 r=3도 같은 11G에 도착합니다. 한 결과를 두 값으로 열 수 있으니 binding이 깨졌습니다." },
  { label: "v=3의 r 19개", summary: "19칸을 한 번씩", rows: [3], fill: true, note: "v=3에 r을 0부터 18까지 넣으면 칸마다 정확히 하나의 r이 도착합니다. 칸 안의 숫자가 그 r입니다. r을 균등하게 고르면 C는 19칸에 균등하게 퍼집니다." },
  { label: "v=5의 r 19개", summary: "v=5도 19칸을 한 번씩", rows: [3, 5], fill: true, note: "v=5도 모든 칸을 한 번씩 지납니다. 두 줄 모두 칸마다 확률 1/19이므로 C 하나만 보고는 v가 3인지 5인지 가를 수 없습니다. 이 모형에서는 binding이 깨진 채로 한 약정의 hiding이 유지됩니다." },
] as const;

function Row({ v, fill }: { v: number; fill: boolean }) {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)] sm:grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-2">
      <span className="text-xs font-bold">v={v}</span>
      <div className="grid min-w-0 grid-cols-[repeat(19,minmax(0,1fr))] gap-px">
        {CELLS.map((c) => {
          const r = rFor(v, c);
          const hit = c === 11;
          const show = fill || hit;
          const color = v === 3 ? "#2563eb" : "#d97706";
          return (
            <span
              key={c}
              className="flex h-7 items-center justify-center overflow-hidden whitespace-nowrap rounded-sm border font-mono text-[9px] leading-none tracking-tighter sm:text-[11px] sm:tracking-normal"
              style={{
                borderColor: show ? color : "#cbd5e1",
                backgroundColor: show ? (hit ? color : `${color}22`) : "transparent",
                color: show ? (hit ? "#ffffff" : color) : "transparent",
                fontWeight: hit ? 700 : 500,
              }}
            >
              {show ? r : "·"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function PedersenHidingViz() {
  return (
    <SceneShell
      eyebrow="binding과 hiding"
      title="같은 칸에 두 값이 도착해도 칸의 분포는 같습니다"
      description="맨 윗줄은 결과 C가 몇 G인지(0~18), 아래 칸의 숫자는 그 칸에 도착하는 무작위 값 r입니다. 위수 19와 H=2G는 본문의 설명용 작은 군이며 안전하지 않습니다."
      ariaLabel="위수 19 군에서 v=3과 v=5의 약정이 도착하는 칸"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-[2rem_minmax(0,1fr)] sm:grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-2">
              <span className="text-[9px] text-muted-foreground sm:text-[11px]">C=?G</span>
              <div className="grid min-w-0 grid-cols-[repeat(19,minmax(0,1fr))] gap-px">
                {CELLS.map((c) => (
                  <span key={c} className={`whitespace-nowrap text-center font-mono text-[9px] tracking-tighter sm:text-[11px] sm:tracking-normal ${c === 11 ? "font-bold text-foreground" : "text-muted-foreground"}`}>{c}</span>
                ))}
              </div>
            </div>
            <Row v={3} fill={scene.fill} />
            {(scene.rows as readonly number[]).includes(5) ? <Row v={5} fill={scene.fill} /> : <div className="h-7" aria-hidden />}
          </div>
        );
      }}
    />
  );
}
