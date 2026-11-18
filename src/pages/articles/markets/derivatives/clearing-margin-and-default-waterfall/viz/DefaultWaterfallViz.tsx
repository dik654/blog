import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — CFTC 스트레스 시험 보고서(2016)가 정리한 예의 재원 사용 순서.
 * 부도 회원 개시증거금 → 부도 회원 보증기금 부담분 → 청산소가 미리 정한 자기자본 일부
 * → 비부도 회원 보증기금 → 비부도 회원 추가 부담. 층의 크기는 본문에 없어 모든 층을 같은 높이로 그립니다.
 */
const LAYERS = [
  { name: "부도 회원의 개시증거금", payer: "부도 회원" },
  { name: "부도 회원의 보증기금 부담분", payer: "부도 회원" },
  { name: "청산소가 미리 정한 자기자본 일부", payer: "청산소" },
  { name: "비부도 회원의 보증기금", payer: "다른 회원" },
  { name: "비부도 회원의 추가 부담", payer: "다른 회원" },
] as const;

const SCENES = [
  { label: "손실은 부도 회원 담보부터", summary: "1층에서 멈추면 다른 사람 부담 없음", note: "회원이 지급하지 못해 포지션을 닫는 과정에서 생긴 손실은 먼저 그 회원이 맡긴 개시증거금으로 덮습니다. 여기서 다 덮이면 아래 층은 쓰이지 않습니다." },
  { label: "모자라면 그 회원의 기금 몫", summary: "1층 소진 → 2층", note: "개시증거금으로 모자랄 때만 부도 회원이 보증기금에 낸 부담분으로 넘어갑니다. 아직 부도 회원 자신의 돈입니다." },
  { label: "그다음 청산소 자기자본 일부", summary: "1·2층 소진 → 3층", note: "부도 회원 재원을 넘는 손실이 남으면 청산소가 미리 정한 자기자본 일부가 쓰입니다. 손실이 처음으로 부도 회원 바깥으로 넘어가는 지점입니다." },
  { label: "다른 회원들의 기금", summary: "1~3층 소진 → 4층", note: "그래도 남으면 부도와 무관한 회원들이 낸 보증기금이 쓰입니다. 순서는 누가 언제부터 남의 손실을 떠안는지를 보여 줍니다." },
  { label: "다른 회원들의 추가 부담", summary: "1~4층 소진 → 5층", note: "마지막 예시 층은 비부도 회원의 추가 부담입니다. 이 다섯 층은 CFTC 2016 보고서의 예이며, 모든 청산소가 같은 금액과 세부 순서를 쓰지는 않습니다." },
] as const;

const PAYER_COLOR: Record<(typeof LAYERS)[number]["payer"], string> = {
  "부도 회원": "#2563eb",
  청산소: "#7c3aed",
  "다른 회원": "#d97706",
};

export default function DefaultWaterfallViz() {
  return (
    <SceneShell
      eyebrow="손실 분담 순서"
      title="부도 손실은 앞 층이 바닥나야 다음 층으로 내려갑니다"
      description="손실 분담 순서(디폴트 워터폴)는 회원이 채무불이행했을 때 어느 재원을 먼저 쓰는지 정한 차례입니다. 칸 높이는 금액이 아닙니다. 각 층의 크기는 본문에 없고 청산소 규정마다 다릅니다."
      ariaLabel="부도 회원 개시증거금, 부도 회원 보증기금 부담분, 청산소 자기자본 일부, 비부도 회원 보증기금, 비부도 회원 추가 부담 순으로 손실이 내려가는 모습"
      scenes={SCENES}
      render={(active) => (
        <ol className="space-y-2">
          {LAYERS.map((layer, index) => {
            const used = index < active;
            const current = index === active;
            const color = PAYER_COLOR[layer.payer];
            return (
              <li
                key={layer.name}
                className={`grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-2 text-sm ${current ? "bg-background" : "border-border/60"} ${index > active ? "opacity-40" : ""}`}
                style={current ? { borderColor: color } : undefined}
              >
                <span className="font-mono text-xs font-bold" style={{ color }}>{index + 1}층</span>
                <span className={`min-w-0 leading-5 ${current ? "font-bold" : ""} ${used ? "text-muted-foreground" : ""}`}>{layer.name}</span>
                <span className="text-right text-xs font-semibold" style={{ color }}>
                  {layer.payer}
                  <span className="block font-normal text-muted-foreground">{used ? "소진" : current ? "손실 도달" : "대기"}</span>
                </span>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
