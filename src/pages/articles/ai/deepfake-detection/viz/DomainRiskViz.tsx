import DeepfakeStageViz from "./DeepfakeStageViz";

const SCENES = [
  "도메인과 표본 수 고정",
  "도메인별 평균 계산",
  "전체 평균 계산",
  "가장 취약한 조건 선택",
] as const;

const NOTES = [
  "평가 전에 known/raw 60개, known/JPEG 30개, unseen/social 10개의 독립 source group을 선언합니다. 결과를 본 뒤 유리한 slice를 만들지 않습니다.",
  "같은 loss를 각 domain 안에서 평균하면 0.10, 0.30, 0.80입니다. 표본 수와 불확실성도 평균 옆에 남겨야 합니다.",
  "전체 평균은 (60×0.10+30×0.30+10×0.80)/100=0.23입니다. 큰 known domain이 작은 취약 domain을 희석합니다.",
  "Worst-domain risk는 세 평균 중 최댓값 0.80입니다. 선언한 domain의 취약점을 드러낼 뿐 미래의 모든 생성기에서 0.80 이하라는 뜻은 아닙니다.",
] as const;

const STAGES = [
  { title: "평가 표", detail: "조건과 독립 원본 수를 먼저 고정" },
  { title: "조건별 평균", detail: "0.10 · 0.30 · 0.80" },
  { title: "전체 평균", detail: "가중 평균 0.23" },
  { title: "취약 조건", detail: "전체 0.23 · 최댓값 0.80 비교" },
] as const;

const DOMAINS = [
  { name: "known / raw", support: 60, mean: 0.1, total: 6 },
  { name: "known / JPEG", support: 30, mean: 0.3, total: 9 },
  { name: "unseen / social", support: 10, mean: 0.8, total: 8 },
] as const;

export default function DomainRiskViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-domain-risk"
      eyebrow="조건별 위험"
      title="전체 평균 0.23이 가린 loss 0.80을 찾습니다"
      description="표본 수를 고정하고 조건별 평균, 전체 가중 평균, 가장 큰 조건별 평균을 차례로 계산합니다."
      note="표본 수와 loss는 계산을 보여 주기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div>
          <div className="grid grid-cols-[minmax(9rem,1fr)_5rem_minmax(9rem,1.5fr)_5rem] gap-3 border-b border-border pb-2 text-[11px] font-bold text-muted-foreground">
            <span>평가 domain</span>
            <span className="text-right">원본 수</span>
            <span>평균 loss</span>
            <span className="text-right">loss 합</span>
          </div>
          {DOMAINS.map((domain, index) => {
            const worst = index === 2 && active >= 3;
            return (
              <div key={domain.name} className={`grid grid-cols-[minmax(9rem,1fr)_5rem_minmax(9rem,1.5fr)_5rem] items-center gap-3 border-b border-border py-3 text-xs ${worst ? "bg-primary/8" : ""}`}>
                <strong className="break-keep">{domain.name}</strong>
                <span className={active >= 0 ? "text-right font-mono" : "text-right text-muted-foreground"}>{domain.support}</span>
                <span className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-2">
                  <span className="h-2 bg-muted">
                    <span className={`block h-full transition-[width] duration-500 ${worst ? "bg-primary" : "bg-muted-foreground/50"}`} style={{ width: active >= 1 ? `${domain.mean * 100}%` : "0%" }} />
                  </span>
                  <span className="text-right font-mono">{active >= 1 ? domain.mean.toFixed(2) : "—"}</span>
                </span>
                <span className="text-right font-mono">{active >= 2 ? domain.total : "—"}</span>
              </div>
            );
          })}
          <div className="mt-4 grid grid-cols-2 gap-6 border-t border-border pt-4 text-xs">
            <span className={active >= 2 ? "text-foreground" : "text-muted-foreground"}>
              전체 평균 <strong className="ml-2 font-mono text-base">{active >= 2 ? "23 / 100 = 0.23" : "—"}</strong>
            </span>
            <span className={`text-right ${active >= 3 ? "text-primary" : "text-muted-foreground"}`}>
              Worst-domain <strong className="ml-2 font-mono text-base">{active >= 3 ? "max = 0.80" : "—"}</strong>
            </span>
          </div>
        </div>
      )}
    </DeepfakeStageViz>
  );
}
