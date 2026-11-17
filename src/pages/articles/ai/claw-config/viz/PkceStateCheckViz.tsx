import ClawSceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #oauth "PKCE와 state는 서로 다른 공격을 막는다".
 * code만 가로챈 공격자는 verifier가 없어 token 교환을 완료하지 못한다(PKCE).
 * 이 login attempt가 시작하지 않았거나 이미 소비된 state의 callback은 code를 쓰지 않고 fail-closed한다(state).
 * 네 칸 = login 경로의 네 지점. 칸마다 그 장면에서 일어나는 일.
 */
type Tone = "plain" | "ok" | "bad" | "check" | "off";

const STATIONS = ["CLI", "browser · provider", "loopback callback", "token endpoint"] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  cells: readonly (readonly [string, Tone])[];
}[] = [
  {
    label: "정상 login: verifier는 CLI에만 있습니다",
    summary: "state 일치 → verifier 일치 → token",
    note: "CLI는 attempt마다 random verifier와 state를 만들고, browser에는 verifier 대신 challenge와 state만 보냅니다. callback에서 state를 확인한 뒤 code와 원본 verifier로 교환합니다.",
    cells: [
      ["verifier · state 보관", "plain"],
      ["challenge · state 전달", "plain"],
      ["code + state 수신 · state 일치", "ok"],
      ["code + verifier → 다시 계산한 challenge 일치 → token", "ok"],
    ],
  },
  {
    label: "공격 1: 중간에 code만 가로챘습니다",
    summary: "verifier 없음 → 교환 실패",
    note: "browser 쪽에서 code가 노출돼도 공격자에게는 verifier가 없습니다. token endpoint가 제출된 값으로 challenge를 다시 계산해 비교하므로 교환을 완료할 수 없습니다. 이 공격을 막는 것은 PKCE입니다.",
    cells: [
      ["verifier는 CLI 안에 그대로", "plain"],
      ["code 노출", "bad"],
      ["—", "off"],
      ["code만 제출 → verifier 검증 실패", "check"],
    ],
  },
  {
    label: "공격 2: 이 attempt가 시작하지 않은 callback",
    summary: "state 불일치 → code 사용 안 함",
    note: "state가 이 attempt의 값과 다르거나 이미 소비된 값이면 callback handler는 code를 쓰지 않고 fail-closed합니다. CSRF와 callback mix-up을 막는 것은 state 검증이며 PKCE가 이 검증을 대신하지 않습니다.",
    cells: [
      ["보관한 state와 비교", "plain"],
      ["—", "off"],
      ["다른 state 또는 소비된 state → 거부", "check"],
      ["교환 요청을 보내지 않음", "off"],
    ],
  },
  {
    label: "두 검사는 서로 다른 지점에 있습니다",
    summary: "callback = state · 교환 = verifier",
    note: "state는 callback을 받는 순간에, verifier는 token을 교환하는 순간에 검사합니다. 둘 다 통과해야 하며 TLS와 redirect URI 검증도 그대로 유지합니다.",
    cells: [
      ["verifier · state 생성", "plain"],
      ["challenge · state 전달", "plain"],
      ["검사 ① state 일치 · 한 번만 소비", "check"],
      ["검사 ② verifier → challenge 일치", "check"],
    ],
  },
];

const TONE: Record<Tone, string> = {
  plain: "border-border bg-background",
  ok: "border-emerald-600/60 bg-emerald-500/5",
  bad: "border-red-600 bg-red-500/5 text-red-700 dark:text-red-400",
  check: "border-amber-600 bg-amber-500/10 font-semibold",
  off: "border-dashed border-border/50 text-muted-foreground/60",
};

export default function PkceStateCheckViz() {
  return (
    <ClawSceneShell
      eyebrow="PKCE · state"
      title="code를 훔친 공격과 callback을 끼워 넣는 공격은 다른 검사에서 걸립니다"
      description="왼쪽부터 login 경로의 네 지점입니다. verifier는 CLI만 아는 random 문자열이고, challenge는 그 hash를 URL에 실을 수 있게 바꾼 값입니다."
      ariaLabel="정상 login, code 탈취, 끼워 넣은 callback에서 PKCE와 state 검사가 걸리는 지점"
      scenes={SCENES}
      render={(active) => (
        <ol className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {STATIONS.map((station, index) => {
            const [text, tone] = SCENES[active].cells[index];
            return (
              <li key={station} className={`min-w-0 rounded-lg border px-3 py-2.5 ${TONE[tone]}`}>
                <p className="text-[11px] font-bold text-muted-foreground">
                  {index + 1}. {station}
                </p>
                <p className="mt-1.5 break-keep text-xs leading-5">{text}</p>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
