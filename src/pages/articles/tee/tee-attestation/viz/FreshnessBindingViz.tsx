import SceneShell from "./SceneShell";

/**
 * 본문 대응: #freshness-binding — nonce는 서명된 evidence 안에 있어야 하고,
 * secret은 검증한 workload의 public key에 묶인 channel로만 나가야 한다.
 * nonce 값 7f3a·19c0과 pk_W라는 이름은 설명용 가정이다.
 */
type Verdict = "ok" | "bad";

const SCENES = [
  {
    label: "Nonce가 서명 안에 있음",
    summary: "서명 안 nonce = 이번 nonce",
    note: "Relying party가 이번에 7f3a를 발급했고, attester는 그 값을 서명된 evidence 안에 넣었습니다. Verifier는 서명 안의 nonce를 이번 값과 비교하므로 오래된 evidence는 이 비교를 통과할 수 없습니다.",
    issued: "7f3a (이번에 새로 발급)",
    signedNonce: "7f3a",
    loose: null,
    compared: "서명 안 nonce",
    result: "7f3a = 7f3a → 최신",
    verdict: "ok",
    appData: "—",
    key: 0,
  },
  {
    label: "Nonce가 서명 밖 field",
    summary: "예전 evidence + 새 nonce 붙이기",
    note: "공격자가 예전에 받은 정상 evidence(서명 안 nonce 19c0)에 서명되지 않은 field로 7f3a를 붙였습니다. Verifier가 이 바깥 field로 비교하면 예전 evidence가 이번 것처럼 통과합니다. 서명 안 값으로 비교했다면 19c0 ≠ 7f3a로 걸렸을 것입니다.",
    issued: "7f3a (이번에 새로 발급)",
    signedNonce: "19c0 (예전 값)",
    loose: "7f3a (공격자가 붙임)",
    compared: "서명 밖 field",
    result: "7f3a = 7f3a → 잘못 통과",
    verdict: "bad",
    appData: "—",
    key: 0,
  },
  {
    label: "Nonce를 오래 재사용",
    summary: "같은 19c0을 다시 발급",
    note: "이번에는 서명 안 값으로 비교하지만 relying party가 예전 nonce 19c0을 다시 썼습니다. 그때 받은 정상 evidence에도 19c0이 서명돼 있으므로 공격자가 그것을 다시 내밀면 통과합니다.",
    issued: "19c0 (예전 값 재사용)",
    signedNonce: "19c0 (예전 값)",
    loose: null,
    compared: "서명 안 nonce",
    result: "19c0 = 19c0 → 잘못 통과",
    verdict: "bad",
    appData: "—",
    key: 0,
  },
  {
    label: "Key를 평문 HTTP로 전달",
    summary: "검증한 대상 ≠ 받는 대상일 수 있음",
    note: "Evidence 검증은 통과했지만 payroll key를 평문 HTTP response로 보냈습니다. 검증한 workload와 key를 받는 쪽을 이어 주는 것이 없으므로 두 대상이 같다는 보장이 없습니다.",
    issued: "7f3a (이번에 새로 발급)",
    signedNonce: "7f3a",
    loose: null,
    compared: "서명 안 nonce",
    result: "7f3a = 7f3a → 최신",
    verdict: "ok",
    appData: "—",
    key: 1,
  },
  {
    label: "Channel binding",
    summary: "pk_W로 검증 대상과 수신자를 묶음",
    note: "Workload public key pk_W를 evidence의 application data에 넣어 서명받고, 같은 pk_W로 TLS session을 엽니다. Key는 그 session으로만 나가므로 검증한 대상과 secret을 받는 대상이 같아집니다.",
    issued: "7f3a (이번에 새로 발급)",
    signedNonce: "7f3a",
    loose: null,
    compared: "서명 안 nonce",
    result: "7f3a = 7f3a → 최신",
    verdict: "ok",
    appData: "pk_W",
    key: 2,
  },
] as const;

const COLOR: Record<Verdict, string> = { ok: "#16a34a", bad: "#dc2626" };
const MUTED = "#64748b";
const LINE = "#94a3b8";
const ACCENT = "#2563eb";

export default function FreshnessBindingViz() {
  return (
    <SceneShell
      eyebrow="Freshness와 binding"
      title="Nonce가 어디에 있는지, key가 어디로 가는지"
      description="실선 상자는 attestation key로 서명된 evidence 영역, 점선 칸은 서명 밖 field입니다. Nonce는 relying party가 이번 요청마다 새로 발급하는 예측하기 어려운 값입니다. 7f3a·19c0·pk_W는 설명용 이름입니다(가정)."
      ariaLabel="nonce 위치와 key 전달 경로에 따라 최신성과 수신자 결속이 달라지는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const verdictColor = COLOR[s.verdict];
        const keyColor = s.key === 2 ? COLOR.ok : COLOR.bad;
        return (
          <div className="min-w-0 space-y-3 text-sm" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <p className="text-xs text-muted-foreground">
              Relying party가 보낸 nonce{" "}
              <span className="font-mono font-bold" style={{ color: s.issued.includes("재사용") ? COLOR.bad : ACCENT }}>{s.issued}</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                <p className="mb-1 text-xs font-bold">Evidence</p>
                <div className="rounded-lg px-3 py-2" style={{ border: `1.25px solid ${ACCENT}` }}>
                  <p className="text-[11px]" style={{ color: ACCENT }}>서명된 영역</p>
                  <p className="font-mono text-xs leading-6">measurement</p>
                  <p className="font-mono text-xs leading-6">nonce: {s.signedNonce}</p>
                  <p className="font-mono text-xs leading-6" style={s.appData === "pk_W" ? { color: ACCENT, fontWeight: 700 } : undefined}>application data: {s.appData}</p>
                </div>
                <div className="mt-2 rounded-md px-3 py-1 font-mono text-xs" style={{ border: `1px dashed ${s.loose ? COLOR.bad : LINE}`, color: s.loose ? COLOR.bad : MUTED, opacity: s.loose ? 1 : 0.7 }}>
                  서명 밖 field: {s.loose ?? "없음"}
                </div>
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-xs font-bold">Verifier 비교</p>
                <div className="rounded-lg border border-border px-3 py-2 text-xs leading-6">
                  <p className="text-muted-foreground">비교에 쓴 값</p>
                  <p className="font-bold" style={s.compared === "서명 밖 field" ? { color: COLOR.bad } : undefined}>{s.compared}</p>
                  <p className="mt-1 text-muted-foreground">결과</p>
                  <p className="font-mono font-bold" style={{ color: verdictColor }}>{s.result}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-3">
              <p className="mb-1.5 text-xs font-bold">payroll key 전달</p>
              {s.key === 0 ? (
                <p className="py-2 text-xs text-muted-foreground">아직 전달 전 · 최신성 판정이 먼저입니다</p>
              ) : (
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-xs">
                  <span className="rounded-md border border-border px-2 py-1.5">Relying party</span>
                  <span className="min-w-0 text-center">
                    <span className="block truncate" style={{ color: keyColor }}>{s.key === 2 ? "pk_W TLS session" : "평문 HTTP"}</span>
                    <span className="flex items-center" aria-hidden>
                      <span className="h-0 min-w-0 flex-1" style={{ borderTop: `1.25px ${s.key === 1 ? "dashed" : "solid"} ${keyColor}` }} />
                      <svg viewBox="0 0 8 10" className="h-2.5 w-2 shrink-0">
                        <path d="M1 1 L7 5 L1 9" fill="none" stroke={keyColor} strokeWidth={1.25} />
                      </svg>
                    </span>
                  </span>
                  <span className="rounded-md px-2 py-1.5 font-bold" style={{ border: `1px ${s.key === 1 ? "dashed" : "solid"} ${keyColor}`, color: keyColor }}>
                    {s.key === 2 ? "검증한 workload가 받음" : "검증한 대상인지 모름"}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
