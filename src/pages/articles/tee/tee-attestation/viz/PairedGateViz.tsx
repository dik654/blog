import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release-gate — 같은 evidence corpus·trust anchors·clock·policy에서 여덟 case를 재생하고,
 * allow가 아니어야 할 case가 하나라도 allow되면(false accept) candidate를 막고 이전 구성으로 되돌린다.
 * 장면 3의 "expired collateral을 허용"은 실패 모양을 보이려는 가정이다.
 */
const CASES = [
  "valid",
  "bad signature",
  "reused nonce",
  "altered measurement",
  "old TCB",
  "debug",
  "expired collateral",
  "unknown vendor field",
] as const;

const FAIL_CASE = 6;

const SCENES = [
  {
    label: "입력 고정",
    summary: "8개 case · 같은 조건",
    note: "Raw evidence corpus, trust anchors, clock, policy를 모두 고정한 채 여덟 case를 준비합니다. valid 하나만 allow이고 나머지 일곱은 allow되면 안 됩니다.",
    run: false,
    fail: false,
    rollback: false,
  },
  {
    label: "Candidate 재생",
    summary: "false accept 0 → 통과",
    note: "Candidate verifier로 여덟 case를 재생하고 decision·reason·raw digest·parser/policy version·latency를 비교합니다. allow되면 안 되는 일곱 case가 모두 allow되지 않았으므로 false accept는 0입니다.",
    run: true,
    fail: false,
    rollback: false,
  },
  {
    label: "False accept 하나",
    summary: "false accept 1 → hard gate 실패",
    note: "가정: candidate가 expired collateral case를 allow했습니다. 나머지 일곱 줄이 모두 맞아도 false accept 0은 hard gate이므로 이 candidate는 통과하지 못합니다.",
    run: true,
    fail: true,
    rollback: false,
  },
  {
    label: "Rollback",
    summary: "이전 세 가지로 되돌림",
    note: "Candidate가 실패하면 prior verifier binary, reference manifest, collateral snapshot으로 되돌립니다. Verifier 실행 파일만이 아니라 기준값과 collateral도 함께 이전 상태로 맞춥니다.",
    run: true,
    fail: true,
    rollback: true,
  },
] as const;

const OK = "#16a34a";
const BAD = "#dc2626";
const MUTED = "#64748b";

export default function PairedGateViz() {
  return (
    <SceneShell
      eyebrow="Paired gate"
      title="여덟 case를 같은 조건에서 다시 돌리고, 잘못된 allow가 하나라도 나오면 되돌립니다"
      description="Candidate는 새로 배포하려는 verifier 구성이고, 한 줄이 corpus의 case 하나입니다. False accept는 allow되면 안 되는 evidence를 allow한 경우이며, false accept 0은 하나만 어겨도 candidate를 막는 hard gate입니다. 칸의 판정은 본문 기준이고 장면 3의 실패 case는 가정입니다."
      ariaLabel="같은 corpus에서 candidate verifier를 재생해 false accept를 세고 실패하면 rollback하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const falseAccepts = s.run && s.fail ? 1 : 0;
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {["raw evidence corpus", "trust anchors", "clock", "policy"].map((item) => (
                <span key={item} className="rounded border border-border px-2 py-0.5 font-mono text-muted-foreground">{item} 고정</span>
              ))}
            </div>
            <div className="rounded-lg border border-border text-xs">
              <div className="grid grid-cols-[minmax(0,1fr)_4.25rem_4.75rem] sm:grid-cols-[minmax(0,1fr)_5.5rem_6rem] gap-2 border-b border-border px-2 py-1.5 sm:px-3 font-semibold text-muted-foreground">
                <span>case</span>
                <span>기대</span>
                <span>candidate</span>
              </div>
              {CASES.map((name, index) => {
                const expectedAllow = index === 0;
                const gotAllow = s.run ? expectedAllow || (s.fail && index === FAIL_CASE) : null;
                const wrong = gotAllow !== null && gotAllow !== expectedAllow;
                return (
                  <div key={name} className={`grid grid-cols-[minmax(0,1fr)_4.25rem_4.75rem] sm:grid-cols-[minmax(0,1fr)_5.5rem_6rem] items-center gap-2 px-2 py-1 sm:px-3 ${wrong ? "bg-red-500/10" : ""}`}>
                    <span className="min-w-0 break-words font-mono">{name}</span>
                    <span style={{ color: expectedAllow ? OK : MUTED }}>{expectedAllow ? "allow" : "allow 아님"}</span>
                    <span className="font-semibold" style={{ color: gotAllow === null ? MUTED : wrong ? BAD : gotAllow ? OK : MUTED }}>
                      {gotAllow === null ? "—" : wrong ? "allow ✕" : gotAllow ? "allow" : "allow 아님"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-muted-foreground">false accept</span>
                <span className="font-mono text-base font-bold" style={{ color: !s.run ? MUTED : falseAccepts ? BAD : OK }}>
                  {s.run ? `${falseAccepts}건` : "—"}
                </span>
              </div>
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-muted-foreground">{s.rollback ? "되돌린 구성" : "hard gate (false accept 0)"}</span>
                <span className="block font-semibold leading-5" style={{ color: !s.run ? MUTED : s.fail ? BAD : OK }}>
                  {!s.run ? "재생 전" : s.rollback ? "prior binary · manifest · collateral snapshot" : s.fail ? "실패 (0이어야 함)" : "통과"}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
