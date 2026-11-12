import SceneShell from "./SceneShell";

/**
 * 본문 대응: #zone-flow-policy 둘째 문단 — Firewall 통과(443)는 사용자 권한을 증명하지 않고,
 * WAF는 HTTP parsing·rule set 범위의 payload 검사, VPN은 tunnel과 reachability만 만든다.
 * 403·DB effect 0은 release 표의 "Firewall allow지만 app role 불충분" 행, ‘다른 직원 급여’는 공식 해석 문장에서 왔다.
 * 장비의 앞뒤 순서는 이 그림의 배치(가정)이다.
 */
const SCENES = [
  {
    label: "Firewall: 이 flow가 열려 있는가",
    summary: "443 → 허용",
    question: "source·destination·service가 허용 flow와 맞는가",
    note: "Firewall은 L3/L4(IP 주소와 port 수준) 또는 application-aware 조건으로 flow를 허용·거부합니다. 443이 통과됐다는 것은 이 연결이 열려 있다는 뜻이지, 요청한 사람이 그 급여를 볼 수 있다는 뜻이 아닙니다.",
  },
  {
    label: "WAF: 아는 공격 pattern이 있는가",
    summary: "parsing·rule 범위 안에서만 검사",
    question: "해석할 수 있는 HTTP request에 rule이 아는 pattern이 있는가",
    note: "WAF는 HTTP를 해석할 수 있고 rule set이 다루는 범위에서만 payload를 봅니다. 그래서 업무 권한 판단, parameterized query(입력값을 SQL 문과 따로 넘기는 방식), output encoding(화면에 낼 때 특수문자를 바꾸는 처리)을 대신하지 못합니다.",
  },
  {
    label: "Application: 이 사람이 볼 수 있는가",
    summary: "403 · DB query·data effect 0",
    question: "이 사용자가 이 직원의 급여를 볼 권한이 있는가",
    note: "앞의 두 지점을 다 지나도 다른 직원 급여를 볼 권한이 없으면 application이 403으로 돌려보냅니다. 이때 DB에 query가 가지 않고 data effect가 0인지를 확인합니다.",
  },
  {
    label: "VPN: 닿을 수 있게 해 줄 뿐",
    summary: "tunnel 성공 ≠ app role",
    question: "그래서 이 사용자의 업무 role은 무엇인가 — VPN은 답하지 않음",
    note: "VPN이 성공하면 원격 사용자와 인증된 tunnel이 생기고 내부 서비스에 network로 닿을 수 있게 됩니다. App role은 생기지 않으므로 급여를 볼 수 있는지는 여전히 application이 판단합니다.",
  },
] as const;

const SLOTS = ["요청", "Firewall", "WAF", "Application", "DB"] as const;

/** 장면별 각 칸의 결과. null은 이 장면에서 아직 판단하지 않은 칸. */
const VERDICTS: readonly (readonly (string | null)[])[] = [
  ["직원 A", "443 허용", null, null, null],
  ["직원 A", "443 허용", "pattern 없음", null, null],
  ["직원 A", "443 허용", "pattern 없음", "403", "query 0"],
  ["원격 직원 A", null, null, "role 판단", null],
];
const FOCUS: readonly number[] = [1, 2, 3, 3];
const FOOT: readonly string[] = [
  "통과는 다음 지점으로 넘어간다는 뜻일 뿐",
  "통과는 다음 지점으로 넘어간다는 뜻일 뿐",
  "앞 두 지점의 ‘허용’은 권한 판단이 아님",
  "tunnel이 생겨도 role은 application이 따로 판단",
];

export default function DecisionLayersViz() {
  return (
    <SceneShell
      eyebrow="각 지점의 질문"
      title="443이 통과됐다고 급여를 볼 권한이 생기지는 않습니다"
      description="급여 조회 요청 하나가 지나가는 지점마다 서로 다른 질문에 답합니다. 주황 칸이 지금 답하는 지점이고, —는 그 장면에서 다루지 않는 칸입니다."
      note="장비의 앞뒤 순서와 ‘직원 A’는 이 그림이 둔 예(가정)입니다. 403과 DB effect 0은 이 글 release 표의 기대 결과입니다."
      ariaLabel="Firewall, WAF, application, VPN이 각각 판단하는 질문"
      scenes={SCENES}
      render={(active) => {
        const verdicts = VERDICTS[active];
        const focus = FOCUS[active];
        const vpn = active === 3;
        return (
          <div className="min-w-0" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <p className={`mb-2 rounded-md border px-3 py-1.5 text-xs font-semibold leading-5 sm:text-sm ${vpn ? "border-blue-600/60 text-blue-700 dark:text-blue-400" : "invisible border-transparent"}`}>
              VPN tunnel: 원격 사용자 ⇒ 내부 서비스 · 인증된 연결, network로 닿음
            </p>
            <ol className="grid min-w-0 gap-1.5 sm:grid-cols-5 sm:gap-2">
              {SLOTS.map((name, i) => {
                const v = verdicts[i];
                const isFocus = i === focus;
                const label = vpn && i === 0 ? "원격 사용자" : name;
                const bad = v === "403" || v === "query 0";
                return (
                  <li key={name} className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 sm:grid-cols-1 sm:gap-1.5">
                    <span
                      className={`rounded-md border px-2 py-2 text-center text-sm font-semibold ${
                        isFocus ? "border-amber-600 bg-amber-500/15" : "border-border bg-muted/30"
                      }`}
                    >
                      <span className="sm:hidden text-muted-foreground">{i > 0 ? "↓ " : ""}</span>
                      {label}
                    </span>
                    <span
                      className={`text-sm font-bold sm:text-center ${
                        v === null ? "text-muted-foreground/50" : bad ? "text-red-700 dark:text-red-400" : i === 0 ? "" : "text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {v ?? "—"}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">{FOOT[active]}</p>
            <p className="mt-2 rounded-md border border-border/70 px-3 py-2 text-sm leading-6">
              <span className="font-semibold">이 지점의 질문 </span>
              <span className="text-muted-foreground">{SCENES[active].question}</span>
            </p>
          </div>
        );
      }}
    />
  );
}
