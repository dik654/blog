import SceneShell from "./SceneShell";

/**
 * 본문 대응: #escalation "incident key로 알림을 묶고 acknowledgement를 추적한다".
 * 같은 time window 안에 실패 event 세 개가 들어온다(가정).
 * 장면 1 = lane+target cooldown, 장면 2 = incident key, 장면 3 = 전송과 인수의 차이.
 */
const EVENTS = [
  { id: "e1", lane: "lane-a", fingerprint: "X", resource: "auth test" },
  { id: "e2", lane: "lane-a", fingerprint: "Y", resource: "auth test" },
  { id: "e3", lane: "lane-b", fingerprint: "X", resource: "auth test" },
] as const;

type Tone = "ok" | "bad" | "info";

const TONE_CLASS: Record<Tone, string> = {
  ok: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
  bad: "border-red-600 text-red-700 dark:text-red-400",
  info: "border-blue-600 text-blue-700 dark:text-blue-400",
};

const SCENES = [
  {
    label: "lane+target cooldown",
    summary: "Y 놓침 · X 두 번",
    outcomes: [
      { text: "알림 전송", tone: "info" },
      { text: "cooldown에 막힘 → Y 놓침", tone: "bad" },
      { text: "다른 lane이라 또 전송 → X 중복", tone: "bad" },
    ] as const,
    note: "lane과 target만 보면 e2는 같은 lane-a라 cooldown에 걸려 새 failure Y가 묻힙니다. e3는 같은 incident X인데 lane이 달라 한 번 더 전송됩니다.",
  },
  {
    label: "incident key로 묶기",
    summary: "incident 2개 · thread 2개",
    outcomes: [
      { text: "incident #1 새 thread", tone: "info" },
      { text: "fingerprint가 달라 incident #2", tone: "ok" },
      { text: "key가 같아 #1 thread에 이어 붙임", tone: "ok" },
    ] as const,
    note: "key를 service·failure fingerprint·affected resource·time window로 만들면 e2는 fingerprint가 달라 새 incident가 되고, e3는 e1과 key가 같아 기존 thread에 update로 붙습니다.",
  },
  {
    label: "전송 ≠ 인수",
    summary: "ack 없으면 다음 route",
    outcomes: [
      { text: "#1 message ID 저장 · ack 대기", tone: "info" },
      { text: "#2 owner가 ack · deadline 기록", tone: "ok" },
      { text: "#1 deadline까지 ack 없음 → 다음 route", tone: "bad" },
    ] as const,
    note: "메시지를 보냈다는 것과 사람이 인수했다는 것은 다릅니다. message ID·acknowledgement·owner·deadline을 저장하고 응답이 없는 incident만 다음 route로 올립니다. 해결이 확인되면 후속 알림과 자동 retry를 함께 끝냅니다.",
  },
] as const;

export default function IncidentKeyViz() {
  return (
    <SceneShell
      eyebrow="Incident grouping"
      title="알림을 lane이 아니라 incident 기준으로 묶습니다"
      description="한 줄이 실패 event 하나입니다. 세 event가 같은 service·같은 알림 target으로, 같은 time window 안에 들어왔다고 가정합니다. fingerprint는 같은 실패를 알아보는 식별값이고, X와 Y는 서로 다른 실패입니다."
      ariaLabel="lane과 target 기준 cooldown과 incident key 기준 묶음의 알림 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            {EVENTS.map((event, i) => {
              const outcome = scene.outcomes[i];
              return (
                <div key={event.id} className="grid min-w-0 gap-2 rounded-md border border-border/70 p-2 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-center">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-mono font-bold">{event.id}</span>
                    <span className="rounded border border-border px-1.5 py-0.5">{event.lane}</span>
                    <span className="rounded border border-border px-1.5 py-0.5 font-mono">fp {event.fingerprint}</span>
                    <span className="rounded border border-border px-1.5 py-0.5">{event.resource}</span>
                  </div>
                  <span className={`block rounded-md border px-2 py-1.5 text-xs font-semibold leading-5 sm:text-sm ${TONE_CLASS[outcome.tone]}`}>
                    {outcome.text}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
