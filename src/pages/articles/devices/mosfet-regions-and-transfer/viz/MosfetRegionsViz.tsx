import { useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CASES = {
  cutoff: { label: "게이트 0.4 V", gate: "0.4 V", drain: "1.0 V", current: "이상값 0 mA", region: "차단", channel: "강한 전자 길이 없습니다", dotX: 190, dotY: 125 },
  linear: { label: "양끝 0.2 V", gate: "1.5 V", drain: "0.2 V", current: "0.18 mA", region: "선형 영역", channel: "드레인 끝에도 전자 길이 남습니다", dotX: 62, dotY: 89 },
  edge: { label: "양끝 1.0 V", gate: "1.5 V", drain: "1.0 V", current: "0.5 mA", region: "핀치오프 경계", channel: "드레인 끝의 전자 길이가 잘록합니다", dotX: 190, dotY: 25 },
  saturation: { label: "양끝 1.5 V", gate: "1.5 V", drain: "1.5 V", current: "이상값 0.5 mA", region: "포화 영역", channel: "여분 전압은 잘록한 끝에 주로 걸립니다", dotX: 270, dotY: 25 },
} as const;

type CaseKey = keyof typeof CASES;

export default function MosfetRegionsViz() {
  const [selected, setSelected] = useState<CaseKey>("linear");
  const current = CASES[selected];
  return (
    <VizFrame
      eyebrow="한 긴 채널 소자"
      title="양끝 전압을 올리면 전류는 어느 지점에서 둔화될까요?"
      description="전압 사례를 눌러 채널 끝의 상태와 이상 전류 곡선의 위치를 비교하세요."
      note="문턱 0.5 V와 k=1 mA/V²는 가정입니다. 0.4 V의 0 mA도 강한 반전만 남긴 이상값이며 실제 약한 반전 전류는 0이 아닙니다. 곡선은 게이트 1.5 V 기준입니다."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="MOSFET 전압 사례 선택">
        {(Object.keys(CASES) as CaseKey[]).map((key) => (
          <button type="button" key={key} aria-pressed={selected === key} onClick={() => setSelected(key)} className={`rounded-md border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${selected === key ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-muted"}`}>
            {CASES[key].label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2" aria-live="polite">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm font-semibold">게이트 {current.gate} · 소스 0 V · 드레인 {current.drain}</p>
          <div className="mt-4 rounded-md border border-dashed border-border bg-muted/40 p-3 text-center text-xs">절연된 게이트 · 표면의 전자 수를 조절</div>
          <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2 text-center text-xs">
            <span className="rounded-md border border-border p-2">소스</span>
            <span className={`rounded-md border p-2 ${selected === "cutoff" ? "border-dashed border-border bg-muted/30" : "border-blue-500/50 bg-blue-500/10"}`}>{current.channel}</span>
            <span className="rounded-md border border-border p-2">드레인</span>
          </div>
          <p className="mt-4 text-sm"><strong>{current.region}:</strong> {current.current}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs font-semibold">게이트 1.5 V의 이상 전류 곡선</p>
          <svg className="mt-2 h-auto w-full" viewBox="0 0 300 155" role="img" aria-label={`게이트 1.5볼트 이상 전류 곡선과 현재 사례 ${current.region}, ${current.current}`}>
            <path d="M30 15 V125 H280" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M30 125 L62 89 L94 61 L126 41 L158 29 L190 25 H270" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M190 20 V125" fill="none" stroke="#94a3b8" strokeDasharray="4 4" />
            <circle cx={current.dotX} cy={current.dotY} r="5" fill="#ea580c" />
            <text x="4" y="23" fontSize="10" fill="currentColor">I (mA)</text>
            <text x="22" y="142" fontSize="10" fill="currentColor">0</text>
            <text x="173" y="142" fontSize="10" fill="currentColor">1.0</text>
            <text x="248" y="142" fontSize="10" fill="currentColor">1.5 V</text>
            <text x="214" y="18" fontSize="10" fill="currentColor">0.5 mA</text>
          </svg>
          <p className="text-xs leading-5 text-muted-foreground">점선 1.0 V는 여분 전압과 같은 포화 시작점입니다. 게이트 0.4 V의 주황 점은 별도의 차단 사례입니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}
