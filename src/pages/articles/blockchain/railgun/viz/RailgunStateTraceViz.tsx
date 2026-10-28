import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["기존 note", "입력 선택", "출력 작성", "회로 검증", "거래 조립", "계약 검증", "상태 반영"] as const;
const NOTES = [
  "Wallet은 이미 tree 0의 leaf 23에 값 10인 note가 있고, 동기화한 historical root R100과 membership path를 알고 있습니다. 계약에는 commitment만 있으며 금액과 소유자는 note 안에 감춰져 있습니다.",
  "Wallet은 note의 random, value 10, token, spending·nullifying key와 leaf 23의 Merkle path를 private witness로 고릅니다. 이 자료는 Broadcaster나 계약 calldata에 그대로 보내지 않습니다.",
  "받는 사람의 note 6과 거스름 note 4를 만들고 commitment C₆·C₄와 암호문을 계산합니다. 같은 token에서 10=6+4가 되어야 하며 6+5인 witness는 회로를 만족하지 못합니다.",
  "JoinSplit 회로는 서명, historical root membership, N=Poseidon(nullifyingKey, 23), 두 출력 commitment와 입력 합=출력 합을 한 relation으로 확인합니다. 공개 신호는 root·boundParams hash·N·C₆·C₄입니다.",
  "Wallet은 proof, R100, N, C₆·C₄, chain ID·tree number·암호문이 들어간 boundParams를 하나의 Transaction으로 묶습니다. boundParams 전체의 hash가 proof의 공개 신호이므로 암호문이나 chain을 바꿔 붙이면 검증이 깨져야 합니다.",
  "Broadcaster는 직렬화된 거래를 제출하고 gas를 냅니다. 계약은 chain ID·adapt sender·historical root·암호문 개수·verifying key·proof를 확인합니다. Broadcaster는 note 소유권이나 spent 상태를 판정하지 않습니다.",
  "같은 EVM transaction 안에서 N을 사용됨으로 기록하고 C₆·C₄를 tree에 추가합니다. 중간 검사가 실패하면 전체가 revert됩니다. 이후 같은 N을 다시 제출하면 proof가 같아도 ‘Note already spent’로 거절됩니다.",
] as const;

const MOBILE_NOTES = [
  "Wallet은 값 10 note와 root R100을 압니다. 계약에는 commitment만 있습니다.",
  "Wallet이 값·key·path를 private witness로 고릅니다. calldata에는 나오지 않습니다.",
  "받는 note 6과 거스름 note 4를 만듭니다. 같은 token에서 10=6+4여야 합니다.",
  "회로가 membership·소유권·nullifier·commitment·합계를 묶어 확인합니다.",
  "proof·R100·N₂₃·C₆·C₄와 boundParams를 Transaction으로 묶습니다.",
  "계약이 root·chain·proof와 nullifier의 첫 사용을 확인합니다. 제출자는 판정하지 않습니다.",
  "N₂₃을 used로 기록하고 C₆·C₄를 tree에 넣습니다. 실패하면 모두 revert됩니다.",
] as const;

const LANES = [
  ["WALLET", "witness·proof·ciphertext", "note 선택"],
  ["CIRCUIT", "membership·소유·합계", "관계 검증"],
  ["BROADCASTER", "제출·gas", "거래 제출"],
  ["CONTRACT", "공개 입력·state", "상태 변경"],
] as const;

function Lane({ name, detail, mobileDetail, active, done }: { name: string; detail: string; mobileDetail: string; active: boolean; done: boolean }) {
  return (
    <div className={`min-w-0 border-l-2 px-1.5 py-1 leading-4 sm:px-3 sm:py-2 ${active ? "border-primary bg-primary/[0.06]" : done ? "border-foreground/35" : "border-border"}`}>
      <span className={`font-mono text-[9px] font-black ${active ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
      <span className="mt-1 block break-keep text-[9px] leading-3 text-muted-foreground sm:hidden">{mobileDetail}</span>
      <span className="mt-1 hidden break-keep text-[10px] leading-4 text-muted-foreground sm:block">{detail}</span>
    </div>
  );
}

function activeLaneForScene(active: number) {
  if (active <= 2) return 0;
  if (active === 3) return 1;
  if (active === 4 || active === 5) return active === 4 ? 0 : 3;
  return 3;
}

export default function RailgunStateTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;
  const lane = activeLaneForScene(active);

  return (
    <VizFrame
      eyebrow="개념 경로 · 값 10 note 한 개"
      title="값 10인 note가 값 6과 4인 새 note로 바뀌는 동안 무엇이 공개되는지 추적합니다"
      description="Wallet·회로·Broadcaster·계약이 같은 일을 하는 것처럼 보이지만, 각자 가진 자료와 바꾸는 상태는 다릅니다."
      note="10·6·4, leaf 23, R100은 설명용 값입니다. 공식 소스에서 확인한 field와 검사 순서는 아래 본문에서 버전과 함께 고정합니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-railgun-scene={active}
        tabIndex={0}
        role="group"
        aria-label="기존 note를 선택해 proof를 만들고 계약 상태에 반영하는 일곱 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="hidden grid-cols-7 gap-px bg-border p-px sm:grid">
          {SCENES.map((label, index) => (
            <div key={label} className={`min-w-0 bg-background py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 sm:block lg:text-[9px]">{label}</strong>
            </div>
          ))}
        </div>

        <div className="flex min-h-7 items-center justify-between border-b border-border px-1 leading-4 sm:hidden">
          <strong className="text-xs">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</strong>
          <span className="font-mono text-[10px] text-muted-foreground">{active + 1}/7</span>
        </div>

        <div className="mt-2 grid grid-cols-4 gap-px sm:mt-3 sm:gap-2">
          {LANES.map(([name, detail, mobileDetail], index) => <Lane key={name} name={name} detail={detail} mobileDetail={mobileDetail} active={index === lane} done={index < lane || active === 6} />)}
        </div>

        <section className="mt-2 border border-border bg-background p-2 sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-black text-muted-foreground">NOTE STATE</span>
            <strong className="text-[10px] text-primary">tree 0 · leaf 23</strong>
          </div>

          <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,.72fr)_auto_minmax(0,.72fr)] items-center gap-1 text-center leading-4">
            <div className={`border px-1 py-1 ${active <= 1 ? "border-primary bg-primary/[0.05]" : active >= 6 ? "border-border text-muted-foreground line-through" : "border-foreground/30"}`}>
              <span className="block font-mono text-[9px] font-black leading-3">INPUT</span>
              <strong className="block text-sm leading-4">10</strong>
              <span className="block text-[9px] leading-3 text-muted-foreground">C₁₀</span>
            </div>
            <span className="font-mono text-xs font-black text-primary">→</span>
            <div className={`border px-1 py-1 ${active >= 2 ? "border-primary bg-primary/[0.05]" : "border-dashed border-border text-muted-foreground"}`}>
              <span className="block text-[9px] leading-3">받는</span>
              <strong className="block text-sm leading-4">{active >= 2 ? "6" : "?"}</strong>
              <span className="text-[9px] leading-3">{active >= 2 ? "C₆" : "대기"}</span>
            </div>
            <span className="font-mono text-xs font-black text-primary">+</span>
            <div className={`border px-1 py-1 ${active >= 2 ? "border-primary bg-primary/[0.05]" : "border-dashed border-border text-muted-foreground"}`}>
              <span className="block text-[9px] leading-3">거스름</span>
              <strong className="block text-sm leading-4">{active >= 2 ? "4" : "?"}</strong>
              <span className="text-[9px] leading-3">{active >= 2 ? "C₄" : "대기"}</span>
            </div>
          </div>

          <div className="mt-1.5 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-3">
            <div className={`bg-background px-1 py-1 ${active >= 3 ? "text-primary" : "text-muted-foreground"}`}><strong className="block">회로</strong>{active >= 3 ? "10=6+4" : "대기"}</div>
            <div className={`bg-background px-1 py-1 ${active >= 5 ? "text-primary" : "text-muted-foreground"}`}><strong className="block">Proof</strong>{active >= 5 ? "PASS" : "대기"}</div>
            <div className={`bg-background px-1 py-1 ${active >= 6 ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}><strong className="block">State</strong>{active >= 6 ? "N used" : "대기"}</div>
          </div>

          <dl className="mt-1.5 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2 text-[10px] leading-4">
            <dt className="text-muted-foreground">root · N</dt><dd className="font-mono">{active >= 1 ? "R100" : "대기"} · {active >= 2 ? "N₂₃" : "대기"}</dd>
            <dt className="text-muted-foreground">outputs</dt><dd className="font-mono">{active >= 2 ? "C₆ · C₄" : "대기"}</dd>
            <dt className="text-muted-foreground">binding</dt><dd className="break-words font-mono">{active >= 4 ? "H(boundParams) · π" : "대기"}</dd>
          </dl>
        </section>

        <section className="mt-3 hidden gap-3 border border-border bg-background p-4 sm:grid sm:grid-cols-[minmax(0,1.1fr)_minmax(12rem,.9fr)]">
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] font-black text-muted-foreground">NOTE STATE</span>
              <strong className="text-[10px] text-primary">tree 0 · leaf 23</strong>
            </div>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center">
              <div className={`border p-3 ${active === 0 || active === 1 ? "border-primary bg-primary/[0.05]" : active >= 6 ? "border-border text-muted-foreground line-through" : "border-foreground/30"}`}>
                <span className="block font-mono text-[9px] font-black">INPUT</span>
                <strong className="mt-1 block text-lg">10</strong>
                <span className="block text-[9px] text-muted-foreground">C₁₀ · root R100</span>
              </div>
              <span className="font-mono text-xs font-black text-primary">→</span>
              <div className="grid grid-cols-2 gap-1">
                <div className={`border p-2 ${active >= 2 ? "border-primary bg-primary/[0.05]" : "border-dashed border-border text-muted-foreground"}`}><span className="text-[8px]">받는 note</span><strong className="block text-base">{active >= 2 ? "6" : "?"}</strong><span className="text-[8px]">{active >= 2 ? "C₆" : "대기"}</span></div>
                <div className={`border p-2 ${active >= 2 ? "border-primary bg-primary/[0.05]" : "border-dashed border-border text-muted-foreground"}`}><span className="text-[8px]">거스름 note</span><strong className="block text-base">{active >= 2 ? "4" : "?"}</strong><span className="text-[8px]">{active >= 2 ? "C₄" : "대기"}</span></div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-[10px]">
              <div className={`bg-background p-2 ${active >= 3 ? "text-primary" : "text-muted-foreground"}`}><strong className="block">회로</strong>{active >= 3 ? "10 = 6 + 4" : "대기"}</div>
              <div className={`bg-background p-2 ${active >= 5 ? "text-primary" : "text-muted-foreground"}`}><strong className="block">Proof</strong>{active >= 5 ? "PASS" : "대기"}</div>
              <div className={`bg-background p-2 ${active >= 6 ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}><strong className="block">State</strong>{active >= 6 ? "N used" : "대기"}</div>
            </div>
          </div>

          <div className="min-w-0 border-l-2 border-primary/45 pl-3 sm:pl-4">
            <span className="font-mono text-[9px] font-black text-muted-foreground">PUBLIC ARTIFACT</span>
            <dl className="mt-2 space-y-2 text-[9px] leading-4 sm:text-[10px]">
              {[
                ["root", active >= 1 ? "R100" : "대기"],
                ["nullifier", active >= 2 ? "N₂₃" : "대기"],
                ["outputs", active >= 2 ? "C₆ · C₄" : "대기"],
                ["boundParams", active >= 4 ? "H(chain·ciphertext·…)" : "대기"],
                ["proof", active >= 4 ? "π" : "대기"],
              ].map(([term, value]) => <div key={term} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2"><dt className="text-muted-foreground">{term}</dt><dd className={value === "대기" ? "text-muted-foreground" : "break-words font-mono text-foreground"}>{value}</dd></div>)}
            </dl>
            <p className="mt-3 break-keep text-[9px] leading-4 text-muted-foreground sm:text-[10px]">금액 10·6·4, token, spending key와 Merkle path는 private witness입니다.</p>
          </div>
        </section>

        <p data-scene-note className="mt-2 min-h-14 border-l-2 border-primary/50 pl-3 text-xs leading-[1.15rem] text-muted-foreground sm:mt-3 sm:min-h-24 sm:pl-4 sm:text-sm sm:leading-6">
          <span className="sm:hidden">{MOBILE_NOTES[active]}</span>
          <span className="hidden sm:inline">{NOTES[active]}</span>
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["note", "입력", "출력", "회로", "조립", "검증", "반영"]}
          playLabel="비공개 송금 경로 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function RailgunVisibilityViz() {
  const columns = [
    {
      title: "Wallet이 아는 것",
      tone: "text-primary",
      items: ["token·값 10", "spending·nullifying key", "random·leaf 23·Merkle path", "받는 note 6·거스름 note 4"],
    },
    {
      title: "계약이 확인하는 것",
      tone: "text-foreground",
      items: ["historical root R100", "nullifier N₂₃의 첫 사용", "C₆·C₄와 boundParams hash", "Groth16 proof·chain·암호문 개수"],
    },
    {
      title: "외부에 남는 것",
      tone: "text-amber-700 dark:text-amber-300",
      items: ["호출 시각·gas·calldata 크기", "Broadcaster 주소", "root·N·commitments·ciphertext", "shield·unshield의 공개 자산 흐름"],
    },
  ] as const;

  return (
    <figure data-viz="railgun-visibility-boundary" className="not-prose my-8 min-w-0 border-y border-border py-5">
      <figcaption>
        <p className="text-sm font-semibold text-foreground">같은 송금을 보더라도 세 주체가 보는 자료가 다릅니다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Zero knowledge는 회로 witness를 가립니다. 네트워크와 거래 메타데이터까지 자동으로 없애지는 않습니다.</p>
      </figcaption>
      <div className="mt-5 grid gap-px bg-border p-px lg:grid-cols-3">
        {columns.map((column) => (
          <section key={column.title} className="min-w-0 bg-background p-4">
            <h3 className={`break-keep text-sm font-bold ${column.tone}`}>{column.title}</h3>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
              {column.items.map((item) => <li key={item} className="border-l border-border pl-2">{item}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </figure>
  );
}
