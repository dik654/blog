import SceneShell from "./SceneShell";

/**
 * 본문 대응: #local-verification — HTTPS·SRI·CSP·WEBCAT 경계 표 바로 앞.
 * 침해된 서버가 무엇을 바꾸는지에 따라 SRI·CSP만 있을 때와 WEBCAT의 판정이 갈리는 지점을 장면으로 나눕니다.
 * 마지막 장면의 "signer key가 서버 밖에 있다"는 가정입니다(본문은 key custody를 별도 실무 판단으로 둡니다).
 */
type Check = "pass" | "fail" | "skip";

interface TamperScene {
  label: string;
  summary: string;
  note: string;
  changed: readonly boolean[];
  legacy: { verdict: string; runs: boolean };
  checks: readonly Check[];
}

const CHANGE_SLOTS = ["app.js", "HTML 속 SRI hash", "CSP header", "manifest"] as const;
const CHECK_SLOTS = ["E 등록", "M 서명·proof", "R app.js hash", "R CSP"] as const;

const SCENES: readonly TamperScene[] = [
  {
    label: "승인 배포 그대로",
    summary: "둘 다 실행",
    note: "SRI(Subresource Integrity)는 HTML이 script 태그에 적어 둔 hash와 받은 파일을 비교하는 브라우저 기능입니다. 서버가 아무것도 바꾸지 않았다면 SRI·CSP도, WEBCAT의 네 검사도 모두 통과합니다.",
    changed: [false, false, false, false],
    legacy: { verdict: "실행", runs: true },
    checks: ["pass", "pass", "pass", "pass"],
  },
  {
    label: "app.js만 바꿈",
    summary: "둘 다 막음",
    note: "HTML의 hash는 그대로 두고 app.js만 바꾸면 SRI가 불일치를 잡습니다. WEBCAT도 받은 bytes의 hash가 manifest 값과 달라 실행 전에 차단합니다.",
    changed: [true, false, false, false],
    legacy: { verdict: "SRI hash 불일치로 그 script 거부", runs: false },
    checks: ["pass", "pass", "fail", "pass"],
  },
  {
    label: "app.js와 HTML 속 hash를 함께 바꿈",
    summary: "SRI 통과 · WEBCAT 차단",
    note: "침해된 first-party는 HTML에 적힌 SRI hash도 바꿀 수 있습니다. 그러면 SRI는 바뀐 hash끼리 비교해 통과시킵니다. WEBCAT의 기준 hash는 HTML이 아니라 서명된 manifest에 있으므로 R이 실패합니다.",
    changed: [true, true, false, false],
    legacy: { verdict: "바뀐 hash와 일치 → 바뀐 app.js 실행", runs: true },
    checks: ["pass", "pass", "fail", "pass"],
  },
  {
    label: "CSP header를 느슨하게 바꿈",
    summary: "CSP는 바뀐 정책 집행 · WEBCAT 차단",
    note: "CSP는 브라우저가 받은 header나 meta policy를 그대로 집행하므로, 서버가 정책을 바꾸면 바뀐 정책이 적용됩니다. WEBCAT은 응답의 CSP를 manifest의 CSP와 비교해 다르면 차단합니다.",
    changed: [false, false, true, false],
    legacy: { verdict: "바뀐 정책으로 계속 실행", runs: true },
    checks: ["pass", "pass", "pass", "fail"],
  },
  {
    label: "manifest까지 새로 써 넣음",
    summary: "M 실패 → 차단 (가정)",
    note: "바뀐 hash를 적은 manifest를 넣어도 M은 trust policy의 signer 서명과 transparency proof를 요구합니다. 침해된 서버에 signer key가 없다는 가정 아래 M이 실패하며, 승인되지 않은 manifest와의 hash 비교는 의미가 없어 —로 둡니다.",
    changed: [true, true, false, true],
    legacy: { verdict: "바뀐 hash와 일치 → 바뀐 app.js 실행", runs: true },
    checks: ["pass", "fail", "skip", "skip"],
  },
];

const CHECK_TEXT: Record<Check, string> = { pass: "통과", fail: "실패", skip: "—" };
const CHECK_CLASS: Record<Check, string> = {
  pass: "text-emerald-700 dark:text-emerald-400",
  fail: "text-red-700 dark:text-red-400",
  skip: "text-muted-foreground",
};

export default function TamperCasesViz() {
  return (
    <SceneShell
      eyebrow="침해된 서버 · 다섯 가지 변경"
      title="서버가 무엇을 바꾸느냐에 따라 SRI·CSP와 WEBCAT의 판정이 갈립니다"
      description="위 칸은 침해된 서버가 바꾼 것, 아래 왼쪽은 SRI·CSP만 있을 때의 결과, 오른쪽은 WEBCAT 실행 조건 E·M·R의 검사 결과입니다. 모든 장면에서 HTTPS 자체는 성공합니다."
      note="WEBCAT은 승인된 코드의 취약점이나 개발자의 악의는 판정하지 않습니다. 마지막 장면은 signer key가 침해된 서버 밖에 있다는 가정에 기댑니다."
      ariaLabel="침해된 서버의 변경 종류별 SRI·CSP와 WEBCAT 판정 비교"
      scenes={SCENES}
      controlLabels={["원본", "app.js", "+hash", "CSP", "manifest"]}
      render={(active) => {
        const scene = SCENES[active];
        const webcatRuns = scene.checks.every((check) => check === "pass");
        const tamperedRuns = scene.legacy.runs && scene.changed.some(Boolean);
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="mb-1 text-[11px] font-bold text-muted-foreground">침해된 서버가 바꾼 것</p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {CHANGE_SLOTS.map((slot, index) => {
                  const changed = scene.changed[index];
                  return (
                    <div key={slot} className={`rounded-lg border px-1 py-1.5 text-center text-[11px] leading-4 sm:px-2 sm:text-xs sm:leading-5 ${changed ? "border-red-600" : "border-border"}`}>
                      <span className="block break-keep font-semibold">{slot}</span>
                      <span className={changed ? "font-bold text-red-700 dark:text-red-400" : "text-muted-foreground"}>{changed ? "바뀜" : "그대로"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="min-w-0 rounded-lg border border-border p-2 sm:p-3">
                <p className="text-[11px] font-bold text-muted-foreground">SRI·CSP만 있을 때</p>
                <p className="mt-2 break-keep text-xs font-semibold sm:text-sm">{scene.legacy.verdict}</p>
                <p className={`mt-2 text-xs font-bold ${tamperedRuns ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                  {tamperedRuns ? "변경된 상태로 실행됨" : scene.legacy.runs ? "승인 배포 실행" : "변경된 app.js는 실행 안 됨"}
                </p>
              </div>
              <div className="min-w-0 rounded-lg border border-border p-2 sm:p-3">
                <p className="break-keep text-[11px] font-bold text-muted-foreground">WEBCAT · E ∧ M ∧ R</p>
                <ul className="mt-2 space-y-0.5 text-[11px] sm:space-y-1 sm:text-xs">
                  {CHECK_SLOTS.map((slot, index) => {
                    const check = scene.checks[index];
                    return (
                      <li key={slot} className="flex items-center justify-between gap-2">
                        <span className="break-keep">{slot}</span>
                        <span className={`font-mono font-bold ${CHECK_CLASS[check]}`}>{CHECK_TEXT[check]}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className={`mt-2 text-xs font-bold ${webcatRuns ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {webcatRuns ? "승인 배포 실행" : "실행 전 page load 차단"}
                </p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
