import VizFrame from "@/components/viz/VizFrame";

const primitives = [
  { label: "Tool", control: "Model-controlled proposal", purpose: "인자가 있는 계산·조회·변경", identity: "server 안에서 unique한 name", example: "create_ticket" },
  { label: "Resource", control: "Application-controlled context", purpose: "주소로 식별해 읽거나 구독", identity: "URI", example: "db://schema" },
  { label: "Prompt", control: "User-controlled template", purpose: "재사용할 message 시작 형식", identity: "prompt name + arguments", example: "review_code" },
] as const;

export default function PrimitivesViz() {
  return (
    <VizFrame
      eyebrow="Primitive map"
      title="같은 server 기능도 누가 선택하고 무엇이 남는지에 따라 나눕니다"
      description="이 구분이 model context 크기, 사용자 UI, side-effect 승인과 cache 수명을 결정합니다."
    >
      <div className="grid gap-7 md:grid-cols-3 md:gap-6">
        {primitives.map((item, index) => (
          <section key={item.label} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="text-sm font-bold">{item.label}</h4>
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-primary">{item.control}</p>
            <dl className="mt-4 space-y-3 text-xs leading-5">
              <div><dt className="font-bold">역할</dt><dd className="mt-1 text-muted-foreground">{item.purpose}</dd></div>
              <div><dt className="font-bold">정체성</dt><dd className="mt-1 text-muted-foreground">{item.identity}</dd></div>
              <div><dt className="font-bold">예</dt><dd className="mt-1 break-all font-mono text-muted-foreground">{item.example}</dd></div>
            </dl>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
