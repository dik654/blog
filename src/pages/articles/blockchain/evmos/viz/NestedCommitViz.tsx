import EvmosSceneShell from "./EvmosSceneShell";

/**
 * 본문 대응: #evm-cache — StateDB.Commit, tmpCtx commit(), application Commit이 각각 어느 parent에 쓰는가.
 * 숫자는 본문 T7 fixture: 시작 1,000,000·sequence 7, ante 선차감 690,000·sequence 8, Bob에게 10,
 * 성공 뒤 반환 207,000 → Alice 516,990 / Bob 10.
 */
type LayerKey = "root" | "tx" | "tmp" | "journal";
type Status = "idle" | "active" | "dropped";

interface Layer {
  status: Status;
  text: string;
}

const NAMES: Record<LayerKey, { name: string; hint: string }> = {
  root: { name: "Committed state", hint: "application Commit만 바꿈" },
  tx: { name: "Parent transaction context", hint: "ante 결과가 있는 곳" },
  tmp: { name: "tmpCtx", hint: "ctx.CacheContext()로 만든 임시 branch" },
  journal: { name: "StateDB journal", hint: "EVM 변경 기록 · snapshot" },
};

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  layers: Record<LayerKey, Layer>;
}[] = [
  {
    label: "Ante가 끝난 직후",
    summary: "sequence 8 · 690,000 선차감",
    note: "Ante가 남긴 sequence 8과 선차감 690,000은 parent transaction context에 있습니다. Committed state에는 아직 Alice 1,000,000·sequence 7이 그대로입니다. ApplyTransaction은 이 안에 tmpCtx를 하나 더 엽니다.",
    layers: {
      root: { status: "idle", text: "Alice 1,000,000 · sequence 7 · Bob 0" },
      tx: { status: "active", text: "sequence 8 · 690,000 선차감" },
      tmp: { status: "active", text: "비어 있음" },
      journal: { status: "idle", text: "아직 없음" },
    },
  },
  {
    label: "EVM이 journal에 쌓습니다",
    summary: "Alice −10 · Bob +10 (journal)",
    note: "EVM이 바꾸는 account·code·storage·log·refund는 먼저 StateDB journal에 쌓입니다. Nested call이 실패하면 journal을 그 call의 snapshot까지만 되감습니다.",
    layers: {
      root: { status: "idle", text: "Alice 1,000,000 · sequence 7 · Bob 0" },
      tx: { status: "idle", text: "sequence 8 · 690,000 선차감" },
      tmp: { status: "idle", text: "비어 있음" },
      journal: { status: "active", text: "Alice −10 · Bob +10 · snapshot 경계 기록" },
    },
  },
  {
    label: "StateDB.Commit()",
    summary: "journal → tmpCtx keeper",
    note: "StateDB.Commit()은 살아남은 dirty state를 tmpCtx의 keeper에 씁니다. 이름은 Commit이지만 parent context도 root database version도 아직 바뀌지 않습니다.",
    layers: {
      root: { status: "idle", text: "Alice 1,000,000 · sequence 7 · Bob 0" },
      tx: { status: "idle", text: "sequence 8 · 690,000 선차감" },
      tmp: { status: "active", text: "Alice −10 · Bob +10" },
      journal: { status: "idle", text: "tmpCtx로 옮김" },
    },
  },
  {
    label: "성공이면 · tmpCtx commit()",
    summary: "!res.Failed() → parent에 합침",
    note: "EVM response가 성공이면 바깥 commit()이 tmpCtx를 parent transaction context에 합칩니다. 이제 ante 결과와 Bob +10이 같은 transaction branch에 있지만 여전히 block Commit 전입니다.",
    layers: {
      root: { status: "idle", text: "Alice 1,000,000 · sequence 7 · Bob 0" },
      tx: { status: "active", text: "sequence 8 · 690,000 선차감 · Alice −10 · Bob +10" },
      tmp: { status: "idle", text: "parent에 합쳐짐" },
      journal: { status: "idle", text: "tmpCtx로 옮김" },
    },
  },
  {
    label: "REVERT였다면 · 합치지 않음",
    summary: "res.Failed() → tmpCtx 버림",
    note: "같은 자리에서 EVM이 REVERT했다면 res.Failed()가 true라 value·storage·log를 담은 tmpCtx를 합치지 않습니다. VM error는 Go error가 아니라 response의 VmError에 담기므로 parent에 있는 sequence 8과 사용한 gas 비용은 남습니다.",
    layers: {
      root: { status: "idle", text: "Alice 1,000,000 · sequence 7 · Bob 0" },
      tx: { status: "active", text: "sequence 8 · 사용한 gas 비용 남음" },
      tmp: { status: "dropped", text: "value·storage·log 버림" },
      journal: { status: "dropped", text: "버림" },
    },
  },
  {
    label: "성공 경로 · application Commit",
    summary: "Alice 516,990 · Bob 10 · sequence 8",
    note: "성공 경로에서 쓰지 않은 gas 207,000을 돌려준 뒤 block이 application Commit에 도달해야 committed state가 바뀝니다. 세 번의 Commit 가운데 durable state를 만드는 것은 이것 하나입니다.",
    layers: {
      root: { status: "active", text: "Alice 516,990 · sequence 8 · Bob 10" },
      tx: { status: "idle", text: "207,000 반환 후 root state에 반영됨" },
      tmp: { status: "idle", text: "parent에 합쳐짐" },
      journal: { status: "idle", text: "tmpCtx로 옮김" },
    },
  },
];

const ORDER: readonly LayerKey[] = ["root", "tx", "tmp", "journal"];

function boxClass(status: Status) {
  if (status === "active") return "border-[#2563eb] bg-[#2563eb]/5";
  if (status === "dropped") return "border-dashed border-[#dc2626]";
  return "border-border";
}

function Nest({ layers, depth }: { layers: Record<LayerKey, Layer>; depth: number }) {
  const key = ORDER[depth];
  const layer = layers[key];
  const meta = NAMES[key];
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 sm:px-3 ${boxClass(layer.status)}`}>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <strong className="text-xs sm:text-sm">{meta.name}</strong>
        <span className="text-[11px] text-muted-foreground">{meta.hint}</span>
      </div>
      <p
        className={`mt-1 break-keep font-mono text-[11px] leading-5 sm:text-xs ${
          layer.status === "dropped" ? "text-[#b91c1c] line-through dark:text-[#f87171]" : layer.status === "active" ? "font-bold" : "text-muted-foreground"
        }`}
      >
        {layer.text}
      </p>
      {depth < ORDER.length - 1 ? (
        <div className="mt-2">
          <Nest layers={layers} depth={depth + 1} />
        </div>
      ) : null}
    </div>
  );
}

export default function NestedCommitViz() {
  return (
    <EvmosSceneShell
      eyebrow="Evmos v20 · 세 번의 Commit"
      title="Commit이라는 이름이 세 번 나오지만 쓰는 곳은 서로 다릅니다"
      description="바깥 상자일수록 오래 남는 state입니다. 안쪽 상자의 변경은 바로 바깥 상자에 합쳐질 때만 위로 올라갑니다. 수치는 본문 T7 설명용 fixture입니다."
      ariaLabel="StateDB journal, tmpCtx, parent transaction context, committed state의 중첩 구조에서 성공과 REVERT가 갈리는 과정"
      scenes={SCENES}
      render={(index) => <Nest layers={SCENES[index].layers} depth={0} />}
    />
  );
}
