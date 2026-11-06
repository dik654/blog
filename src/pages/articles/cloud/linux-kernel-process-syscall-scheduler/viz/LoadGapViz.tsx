import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — 1절의 세 숫자를 같은 눈금에서 읽는다.
 * CPU 사용률 40% × CPU 2개 = 평균 0.8개 바쁨. load 3 − 0.8 = 2.2.
 * 2.2가 D와 R로 몇 개씩 나뉘는지는 글이 정하지 않았으므로 한 덩어리 점선으로 그린다.
 */
const SCALE = 3;
const BUSY = 0.8;
const CPUS = 2;
const LOAD = 3;
const GAP = LOAD - BUSY;

const pct = (value: number) => `${(value / SCALE) * 100}%`;

const SCENES = [
  { label: "CPU 사용률 40%", summary: "2개 × 40% = 평균 0.8개", note: "(가정) 1절의 서버입니다. CPU 2개 가운데 평균 0.8개가 바빴다는 뜻입니다." },
  { label: "load 3", summary: "R과 D가 평균 3개", note: "load는 평균 3개로 CPU 칸 2개보다 깁니다. CPU에서 도는 작업만 세지 않고 R과 D를 함께 세기 때문입니다." },
  { label: "차이 2.2개", summary: "3 − 0.8 = 2.2", note: "차이 2.2개는 D이거나 한쪽 run queue에만 몰린 R입니다. 두 숫자만으로는 몇 개씩인지 나눌 수 없어 한 덩어리로 그렸습니다." },
  { label: "느린 압축", summary: "겨루면 24.6% · 한가하면 100%", note: "압축이 느린 것은 가중치 335가 웹 서버 스레드의 1024와 겨루기 때문입니다. 세 숫자는 같은 run queue를 다른 각도에서 본 것입니다." },
] as const;

function Units({ color, filled, dashed }: { color: string; filled: number; dashed: number }) {
  return (
    <div className="relative h-6 rounded-sm bg-muted/30">
      <div className="absolute inset-y-0 left-0 rounded-l-sm" style={{ width: pct(filled), backgroundColor: color }} />
      {dashed > 0 && <div className="absolute inset-y-0 rounded-r-sm border border-dashed border-[#dc2626]" style={{ left: pct(filled), width: pct(dashed) }} />}
      {[1, 2].map((tick) => (
        <div key={tick} className="absolute inset-y-0 w-px bg-border" style={{ left: pct(tick) }} />
      ))}
    </div>
  );
}

function Row({ title, value, dim, children }: { title: string; value: string; dim: boolean; children: ReactNode }) {
  return (
    <div className={`transition-opacity duration-300 motion-reduce:transition-none ${dim ? "opacity-35" : ""}`}>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="font-semibold">{title}</span>
        <span className="font-mono font-bold">{value}</span>
      </div>
      {children}
    </div>
  );
}

function ShareMini({ label, value, dim }: { label: string; value: number; dim: boolean }) {
  return (
    <div className={`grid grid-cols-[6.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs transition-opacity duration-300 motion-reduce:transition-none ${dim ? "opacity-35" : ""}`}>
      <span>{label}</span>
      <div className="h-3 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm bg-[#d97706]" style={{ width: `${value}%` }} />
      </div>
      <span className="text-right font-mono font-bold">{value}%</span>
    </div>
  );
}

export default function LoadGapViz() {
  return (
    <SceneShell
      eyebrow="세 숫자 다시 읽기"
      title="바쁜 CPU 0.8개와 load 3 사이의 2.2개는 어디 있을까요"
      description="두 막대의 한 칸은 CPU 또는 task 하나입니다. load는 R(실행 가능)과 D(깨울 수 없는 잠)를 셉니다."
      ariaLabel="CPU 사용률, load average, 그 차이와 압축 작업의 몫"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <Row title={`CPU ${CPUS}개 중 평균 바쁜 수`} value={`${BUSY} / ${CPUS}`} dim={active === 3}>
            <div className="relative">
              <Units color="#2563eb" filled={BUSY} dashed={0} />
              <div className="pointer-events-none absolute inset-y-0 left-0 rounded-sm border border-foreground/50" style={{ width: pct(CPUS) }} />
            </div>
          </Row>
          <Row title="load (R + D의 평균)" value={active === 0 ? "—" : `${LOAD}`} dim={active === 0 || active === 3}>
            <Units color="#2563eb" filled={BUSY} dashed={active >= 1 ? GAP : 0} />
          </Row>
          <div className={`grid grid-cols-2 gap-2 transition-opacity duration-300 motion-reduce:transition-none ${active === 2 ? "" : "opacity-35"}`}>
            <div className="rounded-sm border border-dashed border-[#dc2626] bg-background px-2 py-1.5 text-xs leading-5">
              <span className="block font-bold">디스크를 기다리는 D</span>
              <span className="text-muted-foreground">CPU를 쓰지 않아도 load에 듭니다</span>
            </div>
            <div className="rounded-sm border border-dashed border-[#dc2626] bg-background px-2 py-1.5 text-xs leading-5">
              <span className="block font-bold">한쪽 줄에 몰린 R</span>
              <span className="text-muted-foreground">다른 CPU가 놀아도 차례를 기다립니다</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <ShareMini label="웹 서버와 겨룰 때" value={24.6} dim={active !== 3} />
            <ShareMini label="웹 서버가 한가할 때" value={100} dim={active !== 3} />
          </div>
        </div>
      )}
    />
  );
}
