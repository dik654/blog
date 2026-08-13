import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Identity", "같은 object·환자·사건", "identity ID로 group split"],
  ["Coordinate", "공간·시각·pose 기준", "calibration과 허용 오차"],
  ["Availability", "결측·가림·품질 저하", "값과 분리된 mask"],
  ["Order", "고정 slot 또는 unordered set", "재배열 intervention"],
];

export default function OverviewViz() {
  return (
    <VizFrame eyebrow="Sample contract" title="Fusion layer를 고르기 전에 한 episode의 네 관계를 고정합니다" description="각 행은 dataset manifest에 기록할 질문과 그 계약을 깨뜨렸을 때의 검사를 연결합니다.">
      <div className="min-w-0 border-y border-border">
        <div className="hidden grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] gap-6 border-b border-border py-3 text-xs font-semibold text-muted-foreground sm:grid">
          <span>관계</span><span>정의</span><span>검사</span>
        </div>
        {rows.map(([name, contract, audit]) => (
          <div key={name} className="grid min-w-0 gap-2 border-b border-border py-5 text-sm last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-6">
            <strong>{name}</strong>
            <span className="min-w-0 text-muted-foreground">{contract}</span>
            <span className="min-w-0 text-violet-800 dark:text-violet-200">{audit}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 border-l border-violet-500 pl-4 text-sm leading-6 text-muted-foreground">파일 단위 random split은 identity 관계를 깨뜨릴 수 있습니다. Episode manifest를 먼저 만든 뒤 그 ID를 기준으로 split합니다.</p>
    </VizFrame>
  );
}
