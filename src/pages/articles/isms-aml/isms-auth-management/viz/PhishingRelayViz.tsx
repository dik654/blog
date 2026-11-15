import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview "서로 다른 factor를 결합해야 MFA입니다" 둘째 문단.
 * 왼쪽 = 사용자 브라우저, 가운데 = 가짜 사이트(공격자), 오른쪽 = 실제 서비스.
 * domain 이름은 설명용 가정이다.
 */
const REAL = "bank.example";
const FAKE = "bank-login.example";

type Tone = "plain" | "warn" | "bad" | "ok";

const TONE_CLASS: Record<Tone, string> = {
  plain: "border-border text-foreground",
  warn: "border-amber-600 text-amber-700 dark:text-amber-400",
  bad: "border-red-600 text-red-700 dark:text-red-400",
  ok: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
};

const SCENES = [
  {
    label: "가짜 사이트에 입력",
    summary: "password + TOTP 482913",
    hop1: "password · 482913",
    hop2: "",
    cells: [
      { text: `주소창: ${FAKE}`, tone: "warn" },
      { text: "받은 값을 그대로 보관", tone: "bad" },
      { text: "아직 요청 없음", tone: "plain" },
    ] as const,
    note: "사용자는 실제 서비스와 비슷한 가짜 사이트에 password와 TOTP 앱의 6자리 숫자를 입력합니다. 두 값은 서로 다른 factor지만, 둘 다 사람이 옮겨 적는 값입니다.",
  },
  {
    label: "공격자가 실시간 중계",
    summary: "같은 값이 실제 서비스에 도착",
    hop1: "password · 482913",
    hop2: "password · 482913",
    cells: [
      { text: `주소창: ${FAKE}`, tone: "warn" },
      { text: "받자마자 실제 서비스로 전달", tone: "bad" },
      { text: "코드가 아직 유효 → 통과할 수 있음", tone: "bad" },
    ] as const,
    note: "TOTP 숫자는 짧은 시간 동안만 유효하지만, 공격자가 받자마자 실제 서비스에 넣으면 그 시간 안에 도착해 로그인이 통과될 수 있습니다.",
  },
  {
    label: "WebAuthn/FIDO2",
    summary: `서명 안 domain = ${FAKE}`,
    hop1: `서명(${FAKE})`,
    hop2: `서명(${FAKE})`,
    cells: [
      { text: `브라우저가 ${FAKE}를 서명에 넣음`, tone: "warn" },
      { text: "서명 속 domain은 바꿀 수 없음", tone: "bad" },
      { text: `기대한 ${REAL}와 다름 → 거부`, tone: "ok" },
    ] as const,
    note: "WebAuthn/FIDO2에서는 사람이 숫자를 옮기지 않고 기기가 응답에 서명합니다. 이 응답은 브라우저가 실제로 접속한 domain에 묶이므로, 가짜 사이트에서 만든 응답을 중계해도 실제 서비스가 기대한 domain과 맞지 않아 받아들여지지 않습니다.",
  },
] as const;

const COLUMNS = ["사용자 브라우저", "가짜 사이트 (공격자)", "실제 서비스"] as const;

export default function PhishingRelayViz() {
  return (
    <SceneShell
      eyebrow="Phishing relay"
      title="TOTP 숫자는 중계될 수 있고, domain에 묶인 서명은 중계해도 맞지 않습니다"
      description={`값은 위에서 아래로 이동합니다. TOTP는 앱이 일정 시간마다 바꿔 보여 주는 일회용 숫자입니다. 실제 서비스 ${REAL}, 가짜 사이트 ${FAKE}, 숫자 482913은 설명용 가정입니다.`}
      ariaLabel="TOTP 실시간 중계와 WebAuthn domain 결속의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const hops = [scene.hop1, scene.hop2];
        return (
          <div className="mx-auto grid min-w-0 max-w-xl gap-2">
            {COLUMNS.map((column, i) => (
              <div key={column} className="contents">
                <div className={`min-w-0 rounded-md border px-3 py-2 ${TONE_CLASS[scene.cells[i].tone]}`}>
                  <span className="block text-xs font-semibold text-muted-foreground">{column}</span>
                  <span className="mt-1 block break-words text-sm font-semibold leading-5">{scene.cells[i].text}</span>
                </div>
                {i < 2 && (
                  <div className="flex min-h-7 items-center justify-center px-1 font-mono text-xs text-muted-foreground">
                    {hops[i] ? (
                      <span className="break-all">
                        <span>↓ </span>
                        {hops[i]}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">(전달 없음)</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
