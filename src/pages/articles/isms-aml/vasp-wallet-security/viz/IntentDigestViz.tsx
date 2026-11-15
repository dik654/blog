import SceneShell from "./SceneShell";

/**
 * 본문 대응: #key-signing-boundary 둘째 문단과 실패 주입 표의 "UI destination과 signer byte 불일치".
 * 서명 대상은 화면의 '0.3 BTC'가 아니라 아홉 필드를 canonical digest로 묶은 intent다.
 * 글이 값을 주지 않은 필드(destination·fee·nonce 등)는 이름만 적는다.
 */
const FIELDS = ["chain", "network", "asset", "destination", "amount", "fee", "nonce", "calldata", "policy generation"] as const;
const SHOWN: Partial<Record<(typeof FIELDS)[number], string>> = { asset: "BTC", amount: "0.3" };

const SCENES = [
  {
    label: "화면에 보이는 것",
    summary: "‘0.3 BTC’",
    note: "민지와 approver가 화면에서 보는 것은 ‘0.3 BTC’ 같은 요약입니다. 이 문자열만으로는 어느 chain·destination으로, 어떤 fee·nonce로 보내는지가 정해지지 않으므로 서명 대상이 될 수 없습니다.",
  },
  {
    label: "intent로 묶기",
    summary: "아홉 필드 → digest D",
    note: "chain·network·asset·destination·amount·fee·nonce·calldata·policy generation을 정해진 순서와 형식(canonical)으로 직렬화해 digest(고정 길이 요약값) 하나로 묶습니다. 필드 하나만 달라도 digest가 달라집니다.",
  },
  {
    label: "같은 byte인지 대조",
    summary: "approver D = signer D",
    note: "Approver가 승인한 digest와 signer가 받은 byte의 digest가 같아야 이 조건을 통과합니다. 통과해도 출금 release에는 정책·분리 승인·reconcile 조건이 함께 참이어야 합니다.",
  },
  {
    label: "destination만 바뀌면",
    summary: "D ≠ D′ → 서명 거절",
    note: "화면의 destination과 signer가 받은 byte의 destination이 다르면 digest가 달라집니다. 이때 signer는 어느 쪽이 맞는지 추측하지 않고 서명을 거절합니다(fail closed).",
  },
] as const;

function FieldGrid({ changed }: { changed: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {FIELDS.map((field) => {
        const isChanged = changed && field === "destination";
        return (
          <div
            key={field}
            className={`min-w-0 rounded-md border px-1 py-1 text-center text-[11px] leading-4 ${
              isChanged ? "border-red-600 text-red-700 dark:text-red-400" : "border-border bg-background"
            }`}
          >
            <span className="block break-words">{field}</span>
            <strong className="block font-mono">{isChanged ? "승인 ≠ 서명" : SHOWN[field] ?? "·"}</strong>
          </div>
        );
      })}
    </div>
  );
}

function Digest({ label, value, bad = false }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className={`mt-2 rounded-md border px-2 py-1.5 text-center text-xs ${bad ? "border-red-600 text-red-700 dark:text-red-400" : "border-primary text-primary"}`}>
      <span className="text-muted-foreground">{label} </span>
      <strong className="font-mono">{value}</strong>
    </div>
  );
}

export default function IntentDigestViz() {
  return (
    <SceneShell
      eyebrow="서명 대상 · canonical intent"
      title="Signer가 서명하는 것은 화면의 ‘0.3 BTC’가 아니라 아홉 필드를 묶은 digest입니다"
      description="digest는 입력 byte 전체를 hash해 얻은 고정 길이 요약값입니다. 민지의 0.3 BTC 출금을 예로, approver가 본 값과 signer가 받은 byte가 같은지를 digest 하나로 대조합니다. 값이 적히지 않은 칸(·)은 글이 값을 정하지 않은 필드입니다."
      ariaLabel="출금 intent의 필드가 digest로 묶이고 approver와 signer의 digest를 대조하는 과정"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-4 text-center">
                <span className="text-xs text-muted-foreground">출금 화면</span>
                <strong className="mt-2 block font-mono text-2xl">0.3 BTC</strong>
              </div>
              <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs leading-5 text-muted-foreground">
                정해지지 않은 것<br />chain · network · destination · fee · nonce · calldata · policy generation
              </div>
            </div>
          );
        }
        if (active === 1) {
          return (
            <div className="mx-auto max-w-md">
              <FieldGrid changed={false} />
              <p className="mt-2 text-center text-xs text-muted-foreground">↓ canonical 직렬화 → hash</p>
              <Digest label="intent digest" value="D" />
            </div>
          );
        }
        const mismatch = active === 3;
        return (
          <div className="mx-auto min-w-0 max-w-md">
            <p className="mb-1 text-xs font-bold">필드별 대조: approver가 승인한 intent ↔ signer가 받은 byte</p>
            <FieldGrid changed={mismatch} />
            <div className="grid grid-cols-2 gap-2">
              <Digest label="approver" value="D" />
              <Digest label="signer" value={mismatch ? "D′" : "D"} bad={mismatch} />
            </div>
            <p className={`mt-3 rounded-md border px-3 py-2 text-center text-sm font-bold ${mismatch ? "border-red-600 text-red-700 dark:text-red-400" : "border-green-600 text-green-700 dark:text-green-400"}`}>
              {mismatch ? "D ≠ D′ → 서명 거절 (fail closed)" : "D = D → 서명 대상 일치 조건 통과"}
            </p>
          </div>
        );
      }}
    />
  );
}
