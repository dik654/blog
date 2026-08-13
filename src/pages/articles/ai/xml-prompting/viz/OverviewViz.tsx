import VizFrame from "@/components/viz/VizFrame";

const boundaries = [
  ["Instruction", "해야 할 작업과 우선순위", "신뢰된 지시"],
  ["Evidence", "분석할 문서·사용자 입력", "명령이 아닌 데이터"],
  ["Example", "입출력 형식의 시범", "규칙을 보충하는 사례"],
  ["Output", "필드·형식·오류 처리", "consumer와의 계약"],
] as const;

export default function OverviewViz() {
  return (
    <VizFrame
      eyebrow="Input boundaries"
      title="XML 태그는 한 prompt 안에서 서로 다른 역할의 경계를 드러냅니다"
      description="태그가 권한을 만들지는 않지만, 지시와 untrusted data가 어디에서 갈리는지 사람이 검토하고 프로그램이 조립하기 쉬워집니다."
    >
      <div className="divide-y divide-border/70">
        {boundaries.map(([role, content, trust]) => (
          <section
            key={role}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_1fr_1fr] sm:items-baseline"
          >
            <h4 className="text-sm font-bold">{role}</h4>
            <p className="min-w-0 text-xs leading-5 text-primary [overflow-wrap:anywhere]">
              {content}
            </p>
            <p className="min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {trust}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
