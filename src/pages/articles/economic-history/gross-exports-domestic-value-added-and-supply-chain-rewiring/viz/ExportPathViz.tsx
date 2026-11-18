import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 외국 부품 40·국내 공급 40을 사서 조립에서 20을 더하고, 완제품 100이 수출되면 세관은 100을 기록.
 * 투입산출표가 앞단을 추적해 외국 40과 국내 60을 분리. 구매국이 소비하면 최종수요, 다시 가공해 제3국에 수출하면
 * 국내 60이 다음 나라의 수출 안에 들어감. 충격 분석은 어느 단계가 멈추고 대체 공급자가 품질·규격을 얼마나 빨리 맞추는지 본다.
 */
type NodeId = "foreign" | "domestic" | "assembly" | "customs" | "consume" | "reexport";

const NODES: Record<NodeId, { title: string; detail: string }> = {
  foreign: { title: "외국 공급자", detail: "부품 40 · 국경을 넘어 들어옴" },
  domestic: { title: "국내 공급자", detail: "부품·물류·설계 40" },
  assembly: { title: "조립 기업", detail: "40 + 40을 사서 조립 20을 더함 → 완제품 100" },
  customs: { title: "세관", detail: "수출 100을 기록" },
  consume: { title: "구매국에서 소비", detail: "가치가 최종수요에 닿음" },
  reexport: { title: "구매국이 다시 가공해 제3국에 수출", detail: "국내 60도 다음 나라의 수출 안에 들어감" },
};

const SCENES = [
  { label: "앞단에서 두 공급이 모입니다", summary: "외국 40 + 국내 40", lit: ["foreign", "domestic"], trace: false, stop: false, note: "조립 기업은 외국 부품 40과 국내 공급 40을 삽니다. 외국 부품은 국경과 세관을 지나 들어옵니다." },
  { label: "조립이 20을 더합니다", summary: "40 + 40 + 20 = 100", lit: ["foreign", "domestic", "assembly"], trace: false, stop: false, note: "조립 단계가 20을 더해 완제품 100이 됩니다." },
  { label: "세관은 100만 봅니다", summary: "수출 기록 100", lit: ["foreign", "domestic", "assembly", "customs"], trace: false, stop: false, note: "완제품 100이 수출되면 세관은 100을 기록합니다. 그 안에 외국 몫이 얼마인지는 이 기록에 따로 적히지 않습니다." },
  { label: "투입산출표가 앞단을 거슬러 갑니다", summary: "외국 40 · 국내 60", lit: ["foreign", "domestic", "assembly", "customs"], trace: true, stop: false, note: "투입산출표는 업종 사이에 무엇을 얼마나 사고팔았는지 적은 표입니다. 이 표로 앞단 거래를 추적하면 100을 외국 40과 국내 60으로 분리합니다." },
  { label: "뒷단에서 길이 갈라집니다", summary: "소비 또는 다시 수출", lit: ["foreign", "domestic", "assembly", "customs", "consume", "reexport"], trace: true, stop: false, note: "구매국이 완제품을 소비하면 가치가 최종수요에 닿습니다. 다시 가공해 제3국에 수출하면 국내 60도 다음 나라의 수출 안에 들어갑니다." },
  { label: "한 단계가 멈추면", summary: "대체 공급자는 얼마나 빨리?", lit: ["domestic", "assembly", "customs", "consume", "reexport"], trace: false, stop: true, note: "충격 분석에서는 어느 단계가 멈추는지, 대체 공급자가 얼마나 빨리 품질·규격을 맞출 수 있는지 봅니다. 여기서는 외국 공급이 멈춘 경우를 예로 들었습니다(가정)." },
] as const;

function Box({ id, lit, stop = false, tag }: { id: NodeId; lit: boolean; stop?: boolean; tag?: string }) {
  const node = NODES[id];
  return (
    <div
      className={`relative min-w-0 rounded-lg border px-3 py-2 text-sm leading-5 transition-opacity duration-300 motion-reduce:transition-none ${lit || stop ? "opacity-100" : "opacity-30"} ${stop ? "border-dashed" : ""}`}
      style={{ borderColor: stop ? "#dc2626" : lit ? "#2563eb" : "#94a3b8" }}
    >
      <span className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="font-semibold">{node.title}</span>
        {tag ? <span className="rounded-sm px-1.5 text-xs font-bold" style={{ backgroundColor: "#d9770629", color: "#b45309" }}>{tag}</span> : null}
      </span>
      <span className="block text-xs leading-5 text-muted-foreground">{stop ? "멈춤(가정) · 대체 공급자를 찾아야 함" : node.detail}</span>
    </div>
  );
}

function Arrow({ lit, label }: { lit: boolean; label: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground transition-opacity duration-300 motion-reduce:transition-none ${lit ? "" : "opacity-30"}`} aria-hidden>
      <span className="font-bold">↓</span>
      <span>{label}</span>
    </div>
  );
}

export default function ExportPathViz() {
  return (
    <SceneShell
      eyebrow="앞단·국경·뒷단"
      title="부품 40이 수출품 100이 되고 다시 다른 나라 수요가 되기까지"
      description="상자는 본문의 단계이고 숫자는 3절의 설명용 장부(외국 40·국내 조립 20·국내 공급 40)입니다."
      ariaLabel="외국 부품 40과 국내 공급 40이 조립과 세관을 거쳐 수출 100이 되고, 구매국에서 소비되거나 다시 수출되는 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = (id: NodeId) => (scene.lit as readonly string[]).includes(id);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2">
              <Box id="foreign" lit={on("foreign")} stop={scene.stop} tag={scene.trace ? "외국 40" : undefined} />
              <Box id="domestic" lit={on("domestic")} tag={scene.trace ? "국내 40" : undefined} />
            </div>
            <Arrow lit={on("assembly")} label="부품을 삽니다" />
            <Box id="assembly" lit={on("assembly")} tag={scene.trace ? "국내 20 → 국내 합 60" : undefined} />
            <Arrow lit={on("customs")} label="완제품 100 수출" />
            <Box id="customs" lit={on("customs")} tag={scene.trace ? "100 = 외국 40 + 국내 60" : undefined} />
            <Arrow lit={on("consume")} label="두 갈래" />
            <div className="grid grid-cols-2 gap-2">
              <Box id="consume" lit={on("consume")} />
              <Box id="reexport" lit={on("reexport")} />
            </div>
          </div>
        );
      }}
    />
  );
}
