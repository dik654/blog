import VizFrame from "@/components/viz/VizFrame";

const boundary = [
  ["XML로 표현", "section·document id·desired output field", "모델과 parser가 읽는 구조"],
  ["Runtime에서 강제", "tool permission·network egress·secret access", "호스트가 판정하는 권한"],
  ["Validator로 확인", "citation 존재·domain range·policy rule", "출력 뒤의 독립 검사"],
] as const;

export default function AdvancedTagsDetailViz() {
  return (
    <VizFrame
      eyebrow="Control boundary"
      title="구조를 적는 일과 실행 권한을 강제하는 일은 서로 다른 계층입니다"
      description="<tool_call> 같은 문자열은 요청을 표현할 뿐입니다. 실제 실행 여부는 XML 바깥의 authorization이 결정합니다."
    >
      <div className="divide-y divide-border/70">
        {boundary.map(([owner, examples, guarantee]) => (
          <section
            key={owner}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr_1fr] sm:items-baseline"
          >
            <h4 className="text-sm font-bold">{owner}</h4>
            <p className="min-w-0 text-xs leading-5 text-primary [overflow-wrap:anywhere]">
              {examples}
            </p>
            <p className="min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {guarantee}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
