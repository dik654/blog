import SceneShell from "./SceneShell";

/**
 * 본문 대응: #blob-migration 제목(blob schema·counter·migration receipt를 먼저 설계)과
 * stages의 SEAL·UNSEAL/MIGRATE, details의 AEAD metadata·Migration 카드, release gate 실패 표.
 * counter 1·2, 세대 g1·g2는 그림을 위한 가정 값이다. Crash 지점도 가정이다.
 * 재조정(reconcile) 규칙 자체는 본문이 정하지 않으므로 그림도 결과를 정하지 않는다.
 */
const SCENES = [
  { label: "봉인된 blob 하나", summary: "ciphertext + metadata를 tag가 함께 인증", kind: "envelope", note: "Blob 하나에 nonce·ciphertext·tag와 identity policy·용도·schema 세대·counter 같은 metadata를 함께 넣어 한 번에(atomic) 저장합니다. Tag는 ciphertext뿐 아니라 metadata도 인증합니다." },
  { label: "metadata만 바꿔 끼우기", summary: "tag 불일치 → unseal 거부", kind: "swap", note: "Metadata를 인증하지 않으면 유효한 ciphertext를 다른 용도나 version으로 바꿔 끼울 수 있습니다. 인증한 metadata를 바꾸면 tag가 맞지 않아 unseal이 거부되고 plaintext는 나오지 않습니다." },
  { label: "옛 blob을 다시 넣기", summary: "tag는 유효, counter가 다름 → rollback 거부", kind: "replay", note: "예전에 정상적으로 봉인한 blob은 tag 검사를 통과합니다. 이것을 막는 칸이 counter·세대이고, 정책이 기대하는 값과 다르면 rollback으로 거부합니다." },
  { label: "migration: old를 열고 검증", summary: "old decrypt → validate", kind: "m1", note: "Upgrade migration은 허용된 source가 old blob(g1)을 열고 policy와 tag를 검증하는 데서 시작합니다. 꺼낸 plaintext는 enclave 안에서 최소 시간만 씁니다." },
  { label: "새 blob을 쓰다가 crash", summary: "g1 완전 · g2 불완전", kind: "m2", note: "새 identity용 blob(g2)을 봉인해 쓰는 도중 멈췄다고 가정합니다. 디스크에는 완전한 g1과 불완전한 g2가 함께 있습니다. 이때 g1을 확인 없이 지우는 blind delete는 금지이고, 어느 세대가 authoritative인지 재조정합니다." },
  { label: "두 blob과 receipt", summary: "old decrypt → validate → new seal", kind: "m3", note: "g2까지 다 쓰면 디스크에 두 세대가 있고, receipt가 두 blob과 migration attempt를 기록합니다. Crash 뒤에는 이 기록으로 어느 세대가 authoritative인지 재조정합니다." },
] as const;

const box = "min-w-0 rounded-lg border bg-background p-2 text-center text-[11px] leading-4 sm:text-xs";

function Envelope({ purpose, counter, swapped }: { purpose: string; counter: string; swapped: "none" | "purpose" | "old" }) {
  const meta = [
    ["identity policy", "MRSIGNER"],
    ["용도", purpose],
    ["schema", "g1"],
    ["counter", counter],
  ] as const;
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,2.2fr)]">
        <div className={`${box} border-border`}><p className="font-semibold">nonce</p></div>
        <div className={`${box} border-border`}><p className="font-semibold">ciphertext</p><p className="text-muted-foreground">급여 서명 키</p></div>
        <div className={`${box} ${swapped === "purpose" ? "border-amber-600" : "border-border"}`}>
          <p className="font-semibold">tag</p>
          <p className={swapped === "purpose" ? "font-bold text-amber-700 dark:text-amber-400" : "text-muted-foreground"}>{swapped === "purpose" ? "≠ 불일치" : "검사"}</p>
        </div>
        <div className="col-span-3 grid grid-cols-4 gap-1 rounded-lg border border-dashed border-primary/60 p-1 sm:col-span-1">
          {meta.map(([name, value]) => {
            const hit = (swapped === "purpose" && name === "용도") || (swapped === "old" && name === "counter");
            return (
              <div key={name} className="min-w-0 rounded border border-border bg-background px-0.5 py-1 text-center text-[10px] leading-4">
                <p className="text-muted-foreground">{name}</p>
                <p className={hit ? "font-bold text-amber-700 dark:text-amber-400" : "font-semibold"}>{value}</p>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">점선 안 = authenticated metadata. Tag는 ciphertext와 이 칸들을 함께 인증합니다.</p>
    </div>
  );
}

function Disk({ g2, receipt, plaintext, step, crashed = false }: { g2: "none" | "partial" | "done"; receipt: string; plaintext: boolean; step: string; crashed?: boolean }) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
      <div className="min-w-0 rounded-lg border border-border p-2">
        <p className="text-[11px] font-semibold text-muted-foreground">enclave 메모리</p>
        <div className={`${box} mt-2 ${plaintext ? "border-amber-600" : "border-dashed border-border/60"}`}>
          <p className={plaintext ? "font-semibold text-amber-700 dark:text-amber-400" : "text-muted-foreground/70"}>{plaintext ? (crashed ? "plaintext (crash 시점까지)" : "plaintext (최소 시간)") : "plaintext 사용 끝 (가정)"}</p>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-muted-foreground">{step}</p>
      </div>
      <div className="min-w-0 rounded-lg border border-border p-2">
        <p className="text-[11px] font-semibold text-muted-foreground">디스크</p>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <div className={`${box} border-border`}><p className="font-semibold">blob g1</p><p className="text-muted-foreground">old identity</p><p>완전</p></div>
          <div className={`${box} ${g2 === "none" ? "border-dashed border-border/60 text-muted-foreground/60" : g2 === "partial" ? "border-dashed border-amber-600" : "border-border"}`}>
            <p className="font-semibold">blob g2</p>
            <p className="text-muted-foreground">new identity</p>
            <p className={g2 === "partial" ? "font-bold text-amber-700 dark:text-amber-400" : ""}>{g2 === "none" ? "아직 없음" : g2 === "partial" ? "쓰는 중 ✕" : "완전"}</p>
          </div>
          <div className={`${box} border-primary/60`}>
            <p className="font-semibold">receipt</p>
            <p className="text-muted-foreground">{receipt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlobMigrationViz() {
  return (
    <SceneShell
      eyebrow="Blob · counter · migration"
      title="Tag가 막는 것과 counter·receipt가 막는 것은 다르다"
      description="앞의 세 장면은 blob 하나의 칸, 뒤의 세 장면은 upgrade migration 동안의 메모리·디스크 상태입니다. counter 1·2, 세대 g1·g2, crash 시점, receipt에 attempt를 적는 시점은 그림을 위한 가정입니다."
      ariaLabel="sealed blob의 metadata 인증, 옛 blob 재생 거부, migration 중 crash와 receipt"
      scenes={SCENES}
      render={(active) => {
        const kind = SCENES[active].kind;
        if (kind === "envelope") return <Envelope purpose="급여 서명" counter="2" swapped="none" />;
        if (kind === "swap") return <Envelope purpose="다른 용도" counter="2" swapped="purpose" />;
        if (kind === "replay")
          return (
            <div className="min-w-0">
              <Envelope purpose="급여 서명" counter="1" swapped="old" />
              <p className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400">tag ✓ 유효 · counter 1 ≠ 기대 2 → rollback 거부</p>
            </div>
          );
        if (kind === "m1") return <Disk g2="none" receipt="attempt" plaintext step="g1 열기 → policy·tag 검증" />;
        if (kind === "m2") return <Disk g2="partial" receipt="attempt" plaintext crashed step="g2 봉인·쓰기 중 crash (가정) · g1 blind delete 금지" />;
        return <Disk g2="done" receipt="g1·g2·attempt" plaintext={false} step="old decrypt → validate → new seal 완료" />;
      }}
    />
  );
}
