import SceneShell from "./SceneShell";

/**
 * 본문 대응: #flashbots, #selection, #failure-boundary — getHeader로 받은 것은 Bid C의 header뿐이고 body는 relay에 남는다.
 * Proposer가 그 header를 담은 blinded block에 서명하면 그 header에 약속한 상태가 되고, 그 뒤 getPayload로 body를 회수해 대조한다.
 * 위 띠 = 단계와 서명 경계, 아래 = proposer가 가진 것 · relay 응답 · local L로 바꿀 수 있는지. relay 두 곳은 설명용 개수.
 */
interface CommitScene {
  label: string;
  summary: string;
  step: number;
  header: string;
  signature: string;
  body: string;
  bodyTone: "none" | "ok" | "bad";
  relays: readonly [string, string];
  local: string;
  localOpen: boolean;
  note: string;
}

const SCENES: readonly CommitScene[] = [
  {
    label: "getHeader",
    summary: "Bid C의 header만 받음",
    step: 0,
    header: "Bid C header · value 7",
    signature: "아직 없음",
    body: "relay에 있음",
    bodyTone: "none",
    relays: ["Bid C 응답 · body 보관", "다른 bid 응답 (가정)"],
    local: "선택 가능 · 서명 전",
    localOpen: true,
    note: "Proposer 쪽이 받은 것은 Bid C의 header와 value 7을 담은 signed bid입니다. Full body는 아직 relay 쪽에 있습니다. 이 시점에는 서명 전이므로 local L로 갈 수도 있습니다.",
  },
  {
    label: "blinded 서명",
    summary: "C header에 약속",
    step: 1,
    header: "Bid C header · value 7",
    signature: "C header를 담은 blinded block에 서명",
    body: "relay에 있음",
    bodyTone: "none",
    relays: ["Bid C body 보관 · 요청 전", "요청 전"],
    local: "대체 불가 · 이미 C header에 서명",
    localOpen: false,
    note: "Proposer는 Bid C의 execution header를 포함한 blinded block에 서명합니다. 이제 그 header에 약속한 상태이므로, 이후 문제가 생겨도 local L로 그냥 바꾸는 것으로 해결되지 않습니다.",
  },
  {
    label: "body 회수",
    summary: "header와 대조 → 첫 유효 body 채택 → 제안",
    step: 2,
    header: "Bid C header · value 7",
    signature: "서명 완료",
    body: "Bid C body · 서명한 header와 일치",
    bodyTone: "ok",
    relays: ["유효 body 먼저 도착 → 채택", "늦게 도착 (가정)"],
    local: "대체 불가 · 이미 C header에 서명",
    localOpen: false,
    note: "Proposer 쪽 client는 여러 relay에 동시에 body를 요청하고 timeout 안에 온 응답을 verifyPayload로 검사해 첫 유효 body를 채택합니다. Body의 block hash와 fork-specific 내용이 서명한 header와 맞아야 proposal로 이어집니다.",
  },
  {
    label: "body 미전달",
    summary: "timeout · 빈 결과",
    step: 2,
    header: "Bid C header · value 7",
    signature: "서명 완료",
    body: "timeout 안에 유효 body 없음",
    bodyTone: "bad",
    relays: ["유효 body 없음", "유효 body 없음"],
    local: "대체 불가 · 이미 C header에 서명",
    localOpen: false,
    note: "Timeout 안에 유효 body가 하나도 오지 않으면 빈 결과로 끝납니다. 무한 대기는 막지만 이미 서명한 slot을 되살리지는 못합니다. 서명 전의 no bid와 달리 proposal liveness에 직접 영향을 줍니다.",
  },
];

const STEPS = ["① getHeader", "② blinded 서명", "③ getPayload"] as const;

const BODY_TONE: Record<CommitScene["bodyTone"], string> = {
  none: "border-dashed border-border text-muted-foreground",
  ok: "border-[#16a34a] bg-[#16a34a]/10 text-[#15803d]",
  bad: "border-dashed border-[#dc2626] bg-[#dc2626]/10 text-[#dc2626]",
};

function Cell({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <span className="text-[11px] text-muted-foreground sm:text-xs">{label}</span>
      <span className={`min-w-0 break-keep rounded-md border px-2 py-1.5 text-[11px] font-semibold leading-4 sm:text-xs ${className}`}>{value}</span>
    </div>
  );
}

export default function BlindedCommitViz() {
  return (
    <SceneShell
      eyebrow="Header 선택과 body 전달"
      title="서명은 body를 받기 전에 일어납니다"
      description="Bid C=7을 고른 뒤를 따라갑니다. blinded block은 execution payload body 자리에 execution header를 담은 beacon block입니다. 그래서 proposer는 body를 보기 전에 서명합니다."
      note="Relay 두 곳과 두 번째 relay의 늦은 응답은 설명용입니다(가정). Value는 본문의 임의 단위입니다."
      ariaLabel="getHeader, blinded block 서명, getPayload 성공과 미전달을 비교하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-1 text-center text-[10px] font-bold sm:text-xs">
              {STEPS.map((step, index) => (
                <div key={step} className="contents">
                  {index === 2 ? (
                    <span className="flex w-5 flex-col items-center justify-center sm:w-6" aria-hidden>
                      <span className="h-full w-px bg-[#dc2626]" />
                    </span>
                  ) : null}
                  <span
                    className={`rounded-md border px-1 py-2 break-keep ${
                      index === scene.step ? "border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb]" : index < scene.step ? "border-border text-foreground" : "border-dashed border-border text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] leading-4 text-[#dc2626] sm:text-[11px]">빨간 선 = 서명 완료. 그 전에는 local L로 갈 수 있고, 그 뒤에는 C header에 약속한 상태입니다.</p>

            <div className="space-y-1.5">
              <Cell label="받은 header" value={scene.header} className="border-[#2563eb] text-[#2563eb]" />
              <Cell label="proposer 서명" value={scene.signature} className={scene.step >= 1 ? "border-[#b45309] text-[#b45309]" : "border-dashed border-border text-muted-foreground"} />
              <Cell label="full body" value={scene.body} className={BODY_TONE[scene.bodyTone]} />
              <Cell label="relay 응답" value={`R1: ${scene.relays[0]} · R2: ${scene.relays[1]}`} className="border-border text-foreground" />
              <Cell
                label="local L로 전환"
                value={scene.local}
                className={scene.localOpen ? "border-[#16a34a] text-[#15803d]" : "border-dashed border-[#dc2626] text-[#dc2626]"}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
