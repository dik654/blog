import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bundle — BundleState는 부모 상태 전체 snapshot이 아니라 변경분과 되돌림 기록이고,
 * bundle·cache에 없는 account는 backing database에서 읽는다.
 * 숫자는 본문 fixture: Alice 10 → 10 − 3 − 0.000021 = 6.999979, Bob 0 → 3 → 3 − 2 − 0.000021 = 0.999979, Carol 0 → 2.
 */

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  read: string;
  cache: readonly { name: string; value: string }[];
  bundle: readonly { name: string; original: string; present: string }[];
}[] = [
  {
    label: "실행 전",
    summary: "bundle · cache 비어 있음",
    note: "부모 상태는 backing database에 있습니다. 세 사용자 기준으로 보면 아직 bundle과 cache에는 아무 account도 없습니다.",
    read: "—",
    cache: [],
    bundle: [],
  },
  {
    label: "T₀가 Alice·Bob을 읽음",
    summary: "bundle·cache miss → DB 읽기",
    note: "첫 송금은 Alice와 Bob의 account가 필요합니다. bundle이나 cache에서 찾지 못하므로 revm state가 backing database에서 읽어 cache에 올립니다.",
    read: "Alice, Bob ← DB",
    cache: [
      { name: "Alice", value: "10" },
      { name: "Bob", value: "0" },
    ],
    bundle: [],
  },
  {
    label: "T₀ 실행 뒤",
    summary: "Alice 6.999979 · Bob 3",
    note: "Alice가 3 ETH와 수수료 0.000021 ETH를 내고 Bob이 3 ETH를 받습니다. 바뀐 값은 실행 중 상태에 반영됩니다.",
    read: "—",
    cache: [
      { name: "Alice", value: "6.999979" },
      { name: "Bob", value: "3" },
    ],
    bundle: [],
  },
  {
    label: "T₁: Bob은 cache, Carol은 DB",
    summary: "Bob 0.999979 · Carol 2",
    note: "둘째 송금이 읽는 Bob은 이미 cache에 있어 첫 거래 결과 3 ETH를 그대로 읽습니다. Carol은 처음 읽는 account라 database에서 가져옵니다. Bob이 2 ETH와 수수료를 내면 0.999979 ETH가 남습니다.",
    read: "Bob ← cache · Carol ← DB",
    cache: [
      { name: "Alice", value: "6.999979" },
      { name: "Bob", value: "0.999979" },
      { name: "Carol", value: "2" },
    ],
    bundle: [],
  },
  {
    label: "Transition 합치기",
    summary: "BundleRetention::Reverts",
    note: "사후 변경 뒤 transition을 BundleRetention::Reverts로 합치면 바뀐 account마다 original(블록 전)과 present(블록 후) 값이 남고, 되돌릴 기록이 reverts에 들어갑니다. 그 밖의 account는 bundle에 복사되지 않으므로, 나중에 bundle과 cache에 없으면 database에서 읽습니다.",
    read: "—",
    cache: [
      { name: "Alice", value: "6.999979" },
      { name: "Bob", value: "0.999979" },
      { name: "Carol", value: "2" },
    ],
    bundle: [
      { name: "Alice", original: "10", present: "6.999979" },
      { name: "Bob", original: "0", present: "0.999979" },
      { name: "Carol", original: "0", present: "2" },
    ],
  },
];

function Panel({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-2">
      <p className="text-[10px] font-black tracking-[0.06em] text-muted-foreground">{title}</p>
      <p className="text-[10px] leading-4 text-muted-foreground">{sub}</p>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function Line({ left, right, dim = false }: { left: string; right: string; dim?: boolean }) {
  return (
    <div className={`flex min-w-0 flex-col gap-0.5 rounded border px-1.5 py-1 font-mono text-[10px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-2 sm:text-[11px] ${dim ? "border-dashed border-border text-muted-foreground" : "border-primary/60"}`}>
      <span className="break-words">{left}</span>
      <span className="break-words sm:text-right">{right}</span>
    </div>
  );
}

export default function BundleLookupViz() {
  return (
    <SceneShell
      eyebrow="BundleState의 범위"
      title="Bundle은 부모 상태의 복사본이 아니라 바뀐 account만 모읍니다"
      description="세 칸은 차례로 부모 상태를 가진 backing database, cache, BundleState입니다. Cache는 revm state가 이번 실행에서 이미 읽은 account를 들고 있는 메모리 칸입니다. 금액은 본문의 설명용 fixture(ETH)입니다."
      note="세 사용자 잔액만 추적합니다. Nonce·storage·code와 fork별 system account 변화는 본문 fixture처럼 생략했습니다."
      ariaLabel="두 송금을 실행하는 동안 database, cache, BundleState에 account가 어떻게 들어가는지"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="rounded-lg border border-dashed border-border px-2 py-2 font-mono text-xs">
              <span className="text-muted-foreground">이번 장면의 읽기 · </span>
              <strong>{scene.read}</strong>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <Panel title="BACKING DATABASE" sub="부모 상태 · 그대로">
                <Line left="Alice" right="10" />
                <Line left="Bob" right="0" />
                <Line left="Carol" right="0" />
                <Line left="그 밖의 account" right="…" dim />
              </Panel>
              <Panel title="CACHE" sub="이번 실행에서 읽은 account">
                {[0, 1, 2].map((slot) => {
                  const row = scene.cache[slot];
                  return row ? <Line key={slot} left={row.name} right={row.value} /> : <Line key={slot} left="·" right="비어 있음" dim />;
                })}
              </Panel>
              <Panel title="BUNDLESTATE" sub="original → present · reverts">
                {[0, 1, 2].map((slot) => {
                  const row = scene.bundle[slot];
                  return row ? (
                    <Line key={slot} left={row.name} right={`${row.original} → ${row.present}`} />
                  ) : (
                    <Line key={slot} left="·" right="비어 있음" dim />
                  );
                })}
              </Panel>
            </div>
          </div>
        );
      }}
    />
  );
}
