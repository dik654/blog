import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prompt-delivery — send_prompt가 Ready에서만 보내고 기록을 남긴 뒤 Running이 되고,
 * misdelivery를 보면 replay_prompt를 보관하고 Ready로 돌아가는 순서. 첫 attempt의 effect는
 * pinned source가 조회하지 않으므로 마지막 장면까지 "모름"으로 남는다.
 */
type Field = { key: string; value: string; fresh: boolean };

const SCENES = [
  {
    label: "Ready 확인",
    summary: "Ready가 아니면 거부",
    status: 0,
    note: "send_prompt는 status가 ReadyForPrompt가 아니면 거부합니다. 아직 아무 기록도 바뀌지 않았습니다.",
  },
  {
    label: "첫 전송과 기록",
    summary: "attempt 1 · Running",
    status: 1,
    note: "보낼 때 attempt 수를 늘리고 prompt_in_flight, 전송 시각, 마지막 prompt, 기대하는 task receipt를 기록한 뒤 Running으로 바꿉니다.",
  },
  {
    label: "misdelivery 관찰",
    summary: "shell echo · cwd/receipt 불일치",
    status: 2,
    note: "이후 화면에서 prompt가 shell에 echo되거나, 관찰한 cwd·receipt가 기대값과 다르면 misdelivery로 분류합니다. 첫 전송이 무엇을 일으켰는지는 이 관찰로 알 수 없습니다.",
  },
  {
    label: "replay 준비",
    summary: "자동 복구 시 replay_prompt 보관 → Ready",
    status: 3,
    note: "자동 복구가 켜져 있으면 마지막 prompt를 replay_prompt에 보관하고 status를 다시 Ready로 돌립니다. 보관된 것은 다시 보낼 payload일 뿐입니다.",
  },
  {
    label: "다시 보내기 전에",
    summary: "attempt 1의 effect = 모름",
    status: 3,
    note: "Payload를 잃지 않았다는 것과 첫 전송이 아무 effect도 만들지 않았다는 것은 다른 말입니다. Operation ID·worker generation을 붙이고 이전 attempt의 acknowledgement·artifact·side effect를 먼저 조회하는 절차는 source 밖의 hardening입니다.",
  },
] as const;

const STATUSES = ["ReadyForPrompt", "Running", "misdelivery 분류", "ReadyForPrompt (자동 복구 시)"] as const;

function fieldsFor(active: number): Field[] {
  const sent = active >= 1;
  return [
    { key: "attempt 수", value: sent ? "1" : "0", fresh: active === 1 },
    { key: "prompt_in_flight · 전송 시각", value: sent ? "기록됨" : "—", fresh: active === 1 },
    { key: "마지막 prompt", value: sent ? "로그인 수정 prompt" : "—", fresh: active === 1 },
    { key: "기대 task receipt", value: sent ? "기록됨" : "—", fresh: active === 1 },
    { key: "replay_prompt", value: active >= 3 ? "마지막 prompt 사본" : "—", fresh: active === 3 },
  ];
}

export default function PromptReplayViz() {
  return (
    <SceneShell
      eyebrow="Ready 전송과 replay"
      title="w-17의 첫 전송이 misdelivery로 분류된 뒤 기록이 바뀌는 순서"
      description="위 줄은 status 변화와 misdelivery 분류, 왼쪽 표는 registry가 남기는 기록, 오른쪽 칸은 첫 attempt가 바깥에 남겼을지 모르는 effect입니다. Misdelivery는 prompt가 기대한 대상·작업과 어긋나게 전달된 것으로 보이는 관찰입니다."
      ariaLabel="send_prompt가 Ready를 확인하고 attempt를 기록한 뒤 misdelivery를 보고 replay_prompt를 보관하는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const fields = fieldsFor(active);
        return (
          <div className="min-w-0">
            <ol className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
              {STATUSES.map((status, index) => {
                const reached = index <= scene.status;
                const current = index === scene.status;
                const bad = index === 2;
                return (
                  <li
                    key={`${status}-${index}`}
                    className={`min-w-0 rounded-lg border px-2 py-2 text-center text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${
                      current ? (bad ? "border-rose-600 font-bold" : "border-blue-600 font-bold") : "border-border"
                    } ${reached ? "opacity-100" : "opacity-35"}`}
                  >
                    <span className="block text-[11px] text-muted-foreground">{index + 1}</span>
                    <span className="block break-words font-mono">{status}</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <dl className="min-w-0 rounded-lg border border-border bg-background">
                {fields.map((field) => (
                  <div key={field.key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 border-b border-border/60 px-3 py-1.5 text-xs leading-5 last:border-b-0">
                    <dt className="min-w-0 break-words text-muted-foreground">{field.key}</dt>
                    <dd className={`min-w-0 break-words ${field.fresh ? "font-bold text-blue-700 dark:text-blue-400" : ""}`}>{field.value}</dd>
                  </div>
                ))}
              </dl>
              <div
                className={`min-w-0 rounded-lg border border-dashed px-3 py-2.5 text-xs leading-5 ${
                  active === 4 ? "border-rose-600" : "border-border"
                }`}
              >
                <p className="text-sm font-bold">attempt 1의 바깥 effect</p>
                <p className="mt-1 font-mono text-base font-bold">{active >= 1 ? "모름" : "아직 전송 전"}</p>
                <p className="mt-1 text-muted-foreground">
                  {active >= 1 ? "Pinned source는 이 칸을 조회하지 않습니다." : "전송 전이라 effect가 생길 수 없습니다."}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
