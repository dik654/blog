import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 시장요인 경로 → 거래가치 재계산 → 상계집합·담보 규칙 → 양의·음의 노출과 개시증거금
 * → 상대방·자기 부도확률·손실률·조달곡선을 각 시점에 붙임 → CVA·DVA·FVA·MVA → 공통 자료·중복·버전 점검.
 * 조정별 입력 연결은 2절의 정의(상대방 부도의 양의 가치 손실, 자기 신용, 담보로 덮이지 않은 금액의 조달, 개시증거금 조달)를 따르고,
 * DVA↔음의 노출은 DVA의 일반 정의다.
 */
const STAGES = [
  { key: "paths", title: "① 미래 경로", items: ["시장요인 여러 경로", "경로마다 거래가치 재계산"] },
  { key: "exposure", title: "② 상계·담보 적용", items: ["양의 노출", "음의 노출", "담보로 덮이지 않은 금액", "개시증거금"] },
  { key: "curves", title: "③ 시점마다 붙임", items: ["상대방 부도확률·손실률", "자기 부도확률·손실률", "조달곡선"] },
] as const;

const ADJUSTMENTS = [
  { name: "CVA", meaning: "상대방 부도 손실", inputs: ["양의 노출", "상대방 부도확률·손실률"] },
  { name: "DVA", meaning: "자기 신용 효과", inputs: ["음의 노출", "자기 부도확률·손실률"] },
  { name: "FVA", meaning: "무담보 자금비용", inputs: ["담보로 덮이지 않은 금액", "조달곡선"] },
  { name: "MVA", meaning: "개시증거금 조달비용", inputs: ["개시증거금", "조달곡선"] },
] as const;

const SCENES = [
  { label: "미래 경로를 만듭니다", focus: "paths", summary: "경로마다 거래가치", note: "시장요인을 여러 미래 경로로 움직이고, 경로와 시점마다 거래가치를 다시 계산합니다. 오늘 가치 하나가 아니라 미래 가치의 분포가 나옵니다." },
  { label: "상계와 담보를 적용합니다", focus: "exposure", summary: "양의·음의 노출 · 개시증거금", note: "상계집합 안의 거래를 서로 상계하고 담보 규칙을 적용합니다. 그러면 받을 쪽(양의 노출), 줄 쪽(음의 노출), 담보로 덮이지 않은 금액과 개시증거금이 시점마다 나옵니다." },
  { label: "신용과 자금 곡선을 붙입니다", focus: "curves", summary: "부도확률 · 손실률 · 조달곡선", note: "각 시점에 상대방과 은행 자신의 부도확률, 손실률, 조달곡선을 붙입니다. 같은 곡선이 여러 조정에 다시 쓰입니다." },
  { label: "네 조정으로 모읍니다", focus: "adjust", summary: "CVA · DVA · FVA · MVA", note: "조정마다 쓰는 입력 짝이 다릅니다. 상대방 부도는 양의 노출과, 자기 신용은 음의 노출과, 자금비용은 담보로 덮이지 않은 금액과, 증거금 비용은 개시증거금과 짝을 이룹니다. 음의 노출(은행이 줄 가치)을 DVA에 쓰는 것은 DVA의 일반적인 정의를 따른 것입니다." },
  { label: "겹침과 버전을 점검합니다", focus: "check", summary: "조달곡선이 FVA·MVA에 공통", note: "조달곡선처럼 두 조정이 함께 쓰는 자료는 정의와 부호를 문서화하고 같은 효과를 두 번 세지 않는지 검사합니다. 가격, 일별 손익, 헤지와 자금 계획이 같은 계약·곡선 버전을 쓰는지도 맞춥니다." },
] as const;

const SHARED = "조달곡선";

export default function XvaInputMapViz() {
  return (
    <SceneShell
      eyebrow="계산 순서"
      title="같은 시나리오에서 네 조정이 서로 다른 입력 짝을 가져갑니다"
      description="위의 세 단계는 모든 시나리오·시점에 함께 전진하고, 아래 네 칸이 그 결과를 나눠 씁니다. 양의 노출은 상대방에게 받을 가치, 음의 노출은 상대방에게 줄 가치입니다."
      ariaLabel="xVA 계산에서 시나리오, 노출, 곡선이 CVA DVA FVA MVA로 이어지는 순서"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const late = scene.focus === "adjust" || scene.focus === "check";
        const stageOn = (key: string) => scene.focus === key || (late && key !== "paths");
        const chip = (item: string) => {
          const shared = scene.focus === "check" && item === SHARED;
          return shared ? "border-[#dc2626] bg-[#dc2626]/10 font-bold" : "border-border";
        };
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {STAGES.map((stage) => (
                <div key={stage.key} className={`rounded-lg border px-3 py-2 ${stageOn(stage.key) ? "border-[#2563eb]" : "border-border opacity-50"}`}>
                  <p className="text-xs font-bold">{stage.title}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {stage.items.map((item) => (
                      <span key={item} className={`rounded border px-1.5 py-0.5 text-[11px] leading-4 ${chip(item)}`}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground" aria-hidden>↓ ② ③에서 짝을 골라 ↓</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ADJUSTMENTS.map((adjustment) => (
                <div key={adjustment.name} className={`rounded-lg border px-2 py-2 text-xs leading-5 ${late ? "border-[#2563eb]" : "border-dashed border-border opacity-50"}`}>
                  <span className="block font-mono text-sm font-bold">{adjustment.name}</span>
                  <span className="block text-muted-foreground">{adjustment.meaning}</span>
                  <span className="mt-1 block">
                    {adjustment.inputs.map((input, n) => (
                      <span key={input} className={`mr-1 inline-block rounded border px-1 ${late ? chip(input) : "border-transparent"}`}>
                        {n > 0 ? "· " : ""}
                        {input}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
