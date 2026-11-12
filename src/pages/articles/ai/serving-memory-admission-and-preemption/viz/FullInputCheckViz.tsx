import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-v1-admission — v0.27.1의 scheduler_reserve_full_isl(기본 True).
 * 입력 1000토큰 → ceil(1000/16) = 63block을 먼저 검사하고, 통과하면 이번 조각 256토큰 = 16block만 배정한다.
 * free 50: 16 ≤ 50이지만 63 > 50 → 검사 실패. free 70: 63 ≤ 70 → 첫 조각 16 배정, 추가 예약 0 가정에서 free 54.
 */
const BLOCK = 16;
const INPUT = 1000;
const CHUNK = 256;
const FULL = Math.ceil(INPUT / BLOCK);
const CHUNK_BLOCKS = CHUNK / BLOCK;
const AXIS_MAX = 80;

const SCENES = [
  {
    label: "두 개의 수요",
    summary: `전체 ${FULL} · 첫 조각 ${CHUNK_BLOCKS}`,
    free: 0,
    note: "입력 1000토큰은 block16으로 올림하면 63block입니다. 그런데 한 번에 다 계산하지 않고 256토큰씩 조각내 처리하면 첫 실행에 실제로 쓰는 공간은 16block입니다. (가정)",
  },
  {
    label: "free 50: 전체 검사에서 실패",
    summary: `${CHUNK_BLOCKS} ≤ 50 이지만 ${FULL} > 50`,
    free: 50,
    note: "첫 조각 16block은 free 50에 들어갑니다. 그러나 기본값 True인 전체 입력 검사가 63block이 들어가는지를 먼저 보므로, 하한이 0이어도 이 검사에서 실패해 수용되지 않습니다.",
  },
  {
    label: "free 70: 통과 뒤 16만 배정",
    summary: `${FULL} ≤ 70 → 배정 ${CHUNK_BLOCKS}`,
    free: 70,
    note: "free 70이면 전체 입력 63block 검사를 통과합니다. 실제로 배정하는 것은 이번 조각에 필요한 16block입니다. 추가 예약이 0인 이 사례에서는 free 54가 남습니다. 이 검사는 아직 생성하지 않은 최대 출력 길이 전부를 예약하는 규칙이 아닙니다.",
  },
] as const;

const pct = (blocks: number) => `${(blocks / AXIS_MAX) * 100}%`;

function Row({ label, value, color, dashed = false }: { label: string; value: number; color: string; dashed?: boolean }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)] sm:text-sm">
      <span className="font-semibold">
        {label} <span className="font-mono" style={{ color }}>{value}</span>
      </span>
      <div className="relative h-6 min-w-0">
        <div
          className="absolute left-0 top-0 h-full rounded-sm"
          style={{ width: pct(value), backgroundColor: dashed ? "transparent" : color, border: `1px ${dashed ? "dashed" : "solid"} ${color}` }}
        />
      </div>
    </div>
  );
}

export default function FullInputCheckViz() {
  return (
    <SceneShell
      eyebrow="전체 입력 검사와 조각 배정"
      title="첫 조각이 들어가도 전체 입력이 안 들어가면 받지 않습니다"
      description="막대 길이는 0–80block 축에서의 block 수입니다. 위 두 줄은 같은 요청의 두 수요, 아래 줄은 그 순간의 free block입니다. 13절의 설명용 숫자입니다."
      note="고정한 vLLM v0.27.1의 scheduler_reserve_full_isl 기본값 True 기준입니다. watermark 0, 추가 예약 0, 입력 재사용 없음으로 둡니다."
      ariaLabel="입력 1000토큰 요청의 전체 63block 검사와 첫 조각 16block 배정을 free 50과 70에서 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const judged = scene.free > 0;
        const pass = judged && FULL <= scene.free;
        const verdictColor = pass ? "#16a34a" : "#d97706";
        return (
          <div className="min-w-0 space-y-3">
            <Row label="전체 입력 검사" value={FULL} color="#2563eb" dashed />
            <Row label="첫 조각 배정" value={CHUNK_BLOCKS} color="#7c3aed" />
            <div className="border-t border-border pt-3">
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)] sm:text-sm">
                <span className="font-semibold">free</span>
                <div className="relative h-6 min-w-0 rounded-sm bg-muted/40">
                  {judged && (
                    <>
                      <div className="absolute left-0 top-0 h-full rounded-sm" style={{ width: pct(scene.free), backgroundColor: "#e2e8f0", border: "1px solid #94a3b8" }} />
                      {pass && <div className="absolute left-0 top-0 h-full rounded-sm" style={{ width: pct(CHUNK_BLOCKS), backgroundColor: "#7c3aed" }} />}
                      <span className="absolute top-1 font-mono text-[11px] font-bold text-slate-700" style={{ left: pass ? `calc(${pct(CHUNK_BLOCKS)} + 6px)` : 6 }}>
                        {pass ? `16 사용 · 남은 ${scene.free - CHUNK_BLOCKS}` : `${scene.free}`}
                      </span>
                    </>
                  )}
                  <div className="absolute -bottom-1 -top-1 w-0 border-l-2 border-dashed" style={{ left: pct(FULL), borderColor: "#2563eb" }} />
                </div>
              </div>
              <div className="mt-1 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 text-[11px] sm:grid-cols-[7rem_minmax(0,1fr)]">
                <span />
                <div className="relative h-4 min-w-0">
                  <span className="absolute -translate-x-1/2 whitespace-nowrap font-semibold" style={{ left: pct(FULL), color: "#2563eb" }}>
                    63
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm font-bold" style={{ color: judged ? verdictColor : "#94a3b8" }}>
              {judged ? (pass ? `free ${scene.free} ≥ 63 → 수용, 첫 조각 16block 연결` : `free ${scene.free} < 63 → 전체 입력 검사 실패, 수용 안 함`) : "free를 아직 정하지 않았습니다"}
            </p>
          </div>
        );
      }}
    />
  );
}
