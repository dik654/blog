import SceneShell from "./SceneShell";

/**
 * 본문 대응: #anti-patterns — 실패 원인마다 고칠 계층이 다르고, prompt만 늘리면 context pollution과 충돌이 는다.
 * 사례 문구는 같은 절의 용어 설명에서 가져왔다.
 */
const LAYERS = [
  { name: "Prompt", fix: "objective · completion criteria" },
  { name: "Evidence", fix: "RAG(자료를 찾아 넣기) · tool" },
  { name: "출력 형식", fix: "schema · constrained decoding(형식 안에서만 생성)" },
  { name: "Runtime policy", fix: "권한 · data exfiltration(자료 유출) 차단" },
] as const;

const SCENES = [
  { label: "모호한 지시", summary: "→ Prompt 층", target: 0, case: "“짧고 빠짐없이 자세히”", note: "동시에 만족할 기준이 없는 요청입니다. objective와 completion criteria를 고칩니다." },
  { label: "근거 부족", summary: "→ Evidence 층", target: 1, case: "주문 API 결과 없이 최신 주문 상태를 요구", note: "필요한 사실이 request에 없습니다. instruction을 길게 써도 해결되지 않으니 RAG나 tool을 붙입니다." },
  { label: "syntax 실패", summary: "→ 출력 형식 층", target: 2, case: "출력의 문법이 깨짐", note: "형식을 자연어 부탁으로 막지 않고 schema와 constrained decoding을 적용합니다." },
  { label: "권한 오류", summary: "→ Runtime 층", target: 3, case: "“고객 정보를 보내지 마” · send tool에 authorization 없음", note: "권한 오류나 유출 위험은 prompt 문장을 늘리는 대신 runtime policy에서 차단합니다." },
  { label: "prompt만 늘리면", summary: "다른 층은 그대로", target: null, case: "원인이 달라도 prompt에 문장만 추가", note: "원인이 다른 실패가 그대로 남은 채 Prompt 층만 길어집니다. context pollution(불필요한 문장이 문맥을 채우는 일)과 충돌이 늘어납니다." },
] as const;

const ACCENT = "#2563eb";
const WARN = "#d97706";

export default function FailureLayerViz() {
  return (
    <SceneShell
      eyebrow="고칠 자리"
      title="실패 원인마다 손댈 층이 다릅니다"
      description="네 층 중 어디를 고쳐야 하는지 실패 사례를 하나씩 넣어 봅니다."
      ariaLabel="네 가지 실패가 각각 어느 계층의 수정으로 이어지는지 보여 주는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const bloat = scene.target === null;
        return (
          <div className="min-w-0">
            <div className="grid min-h-[4.75rem] content-center rounded-lg border border-dashed border-border px-3 py-2">
              <span className="text-[11px] leading-4 text-muted-foreground">실패 사례</span>
              <strong className="break-keep text-sm leading-5">{scene.case}</strong>
            </div>
            <div className="mt-2 space-y-1">
              {LAYERS.map((layer, index) => {
                const hit = scene.target === index;
                const swollen = bloat && index === 0;
                const color = hit ? ACCENT : swollen ? WARN : undefined;
                return (
                  <div
                    key={layer.name}
                    className={`grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-2 rounded-lg border px-3 py-1 ${hit || swollen ? "" : "border-border"}`}
                    style={{ borderColor: color }}
                  >
                    <div className="min-w-0">
                      <strong className={`block text-sm leading-5 ${hit || swollen ? "" : "text-muted-foreground"}`}>{layer.name}</strong>
                      <span className="block break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs">{layer.fix}</span>
                    </div>
                    <strong className="text-right text-xs leading-4" style={{ color }}>
                      {hit ? "여기를 고침" : swollen ? "문장만 늘어남" : ""}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
