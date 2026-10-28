import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["고정", "기준선", "재사용", "변조", "중단", "되돌리기", "결정"] as const;
const NOTES = [
  "Chain ID·contract/proxy 구현·contract source·circuit source·zkey/vkey·wallet engine·deployment와 시작 block을 한 manifest에 고정합니다. 문서의 current 설명만으로 exact artifact를 대신하지 않습니다.",
  "기존 note 10을 6과 4로 나누는 송금을 baseline과 candidate에서 독립 실행합니다. root·N·C₆·C₄·proof 판정, contract events와 wallet 잔액이 같은 receipt를 남깁니다.",
  "기준선에서 사용한 N을 같은 tree에 다시 제출합니다. Candidate가 proof 검증만 보고 통과시키거나 wallet이 spent note를 다시 잔액으로 세면 즉시 기각합니다.",
  "Historical root, chain ID, ciphertext, output commitment, boundParams, proof를 한 항목씩 바꿉니다. 10→11 witness는 proof를 만들거나 검증할 수 없어야 하고, 결속 필드의 변경은 fail closed해야 합니다.",
  "Wallet event sync, proof 생성, Broadcaster 제출 직전에 각각 process를 중단합니다. 재시작 뒤 on-chain event 순서로 tree와 nullifier를 다시 만들고 phantom balance·중복 제출·오래된 fee quote가 없어야 합니다.",
  "Candidate engine을 격리하고 이전 호환 artifact로 되돌린 뒤 최신 on-chain state를 처음부터 또는 checkpoint부터 재동기화합니다. 이미 반영된 on-chain nullifier와 commitment는 되돌리지 않습니다.",
  "정상·부정 fixture, 동기화 복구와 호환 rollback이 같아야 그 뒤에 proving·sync·submit latency와 gas를 비교합니다. 대상 환경 측정이 없으면 상태는 proposed입니다.",
] as const;

const MOBILE_NOTES = [
  "Contract·circuit·zkey/vkey·engine·deployment와 시작 block을 한 manifest에 고정합니다.",
  "10→6+4를 두 버전에서 실행해 receipt·events·wallet view를 같은 ID로 대조합니다.",
  "이미 사용한 N₂₃을 다시 내면 계약과 wallet이 모두 재사용을 거절해야 합니다.",
  "root·chain·ciphertext·commitment를 하나씩 바꿔 모든 결속이 fail closed인지 봅니다.",
  "동기화·proof 생성·제출 직전에 멈춘 뒤 phantom balance와 중복 제출이 없는지 봅니다.",
  "후보를 격리하고 호환 artifact로 복구한 뒤 최신 on-chain state를 다시 동기화합니다.",
  "정상·부정 입력과 복구·rollback이 같아야 성능 비교로 넘어갑니다. 아직은 proposed입니다.",
] as const;

const FIXTURES = [
  ["BASE", "10 → 6 + 4", "PASS"],
  ["REPLAY", "same N₂₃", "REJECT"],
  ["MUTATE", "root·chain·ciphertext", "REJECT"],
  ["RESTART", "event sync resume", "RECOVER"],
] as const;

export default function RailgunValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const active = scenes.active;
  const danger = active === 2 || active === 3;

  return (
    <VizFrame
      eyebrow="실무 경로 · 계약·회로·engine 변경"
      title="같은 note와 부정 입력을 재생해 state·proof·wallet view를 함께 대조합니다"
      description="정상 송금만 성공하는지 보는 대신 replay·field 변조·동기화 중단과 호환 rollback을 같은 실행 기록으로 비교합니다."
      note="격리한 test chain과 복제한 자료용 계획입니다. 운영 계약의 상태를 되감거나 실제 자산으로 장애를 주입하지 않습니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-railgun-validation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="RAILGUN 변경을 manifest 고정부터 부정 입력과 rollback까지 검증하는 일곱 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="hidden grid-cols-7 gap-px bg-border p-px sm:grid">
          {SCENES.map((label, index) => (
            <div key={label} className={`min-w-0 bg-background py-2 text-center ${index === active ? danger ? "text-amber-700 dark:text-amber-300" : "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 sm:block lg:text-[9px]">{label}</strong>
            </div>
          ))}
        </div>

        <div className="flex min-h-6 items-center justify-between border-b border-border px-1 leading-4 sm:hidden">
          <strong className="text-xs">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</strong>
          <span className="font-mono text-[10px] text-muted-foreground">{active + 1}/7</span>
        </div>

        <section className="mt-2 border border-border bg-background p-2 sm:hidden">
          <span className="font-mono text-[10px] font-black text-muted-foreground">PINNED ARTIFACT</span>
          <dl className="mt-1 grid grid-cols-[4rem_minmax(0,1fr)] gap-x-2 text-[9px] leading-3">
            <dt className="text-muted-foreground">Contract</dt><dd className="font-mono">30da515 · deploy</dd>
            <dt className="text-muted-foreground">Circuit</dt><dd className="font-mono">0aa2d13 · zkey/vkey</dd>
            <dt className="text-muted-foreground">Engine</dt><dd className="font-mono">version · start block</dd>
            <dt className="text-muted-foreground">State</dt><dd className="font-mono">tree 0 · R100 · leaf 23</dd>
          </dl>

          <div className="mt-2 border-t border-border pt-1">
            {FIXTURES.map(([name, input, expected], index) => {
              const visible = active >= Math.min(index + 1, 4);
              const selected = (active === 1 && index === 0) || (active === 2 && index === 1) || (active === 3 && index === 2) || (active >= 4 && index === 3);
              return (
                <div key={name} className={`grid min-h-5 grid-cols-[4.25rem_minmax(0,1fr)_3.75rem] items-center gap-1 border-b border-border/55 text-[9px] leading-3 last:border-0 ${selected ? "text-primary" : visible ? "text-foreground" : "text-muted-foreground"}`}>
                  <strong className="font-mono">{name}</strong>
                  <span className="break-keep">{visible ? input : "대기"}</span>
                  <span className={`text-right font-bold ${visible && expected === "REJECT" ? "text-amber-700 dark:text-amber-300" : ""}`}>{visible ? expected : "—"}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-3 hidden gap-3 border border-border bg-background p-4 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <span className="font-mono text-[9px] font-black text-muted-foreground">PINNED ARTIFACT</span>
            <dl className="mt-2 grid grid-cols-[6rem_minmax(0,1fr)] gap-x-2 gap-y-2 text-[9px] leading-4 sm:text-[10px]">
              {[
                ["Contract", "30da515 · deployment hash"],
                ["Circuit", "0aa2d13 · zkey/vkey digest"],
                ["Engine", "version · config · start block"],
                ["State", "tree 0 · R100 · leaf 23"],
              ].map(([term, value]) => <div key={term} className="contents"><dt className="text-muted-foreground">{term}</dt><dd className="break-words font-mono">{value}</dd></div>)}
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border p-px">
            {FIXTURES.map(([name, input, expected], index) => {
              const visible = active >= Math.min(index + 1, 4);
              const selected = (active === 1 && index === 0) || (active === 2 && index === 1) || (active === 3 && index === 2) || (active >= 4 && index === 3);
              return (
                <div key={name} className={`min-w-0 bg-background p-2 sm:p-3 ${selected ? "text-primary" : visible ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className="font-mono text-[8px] font-black">{name}</span>
                  <strong className="mt-1 block break-keep text-[9px] sm:text-[10px]">{visible ? input : "대기"}</strong>
                  <span className={`mt-1 block text-[8px] font-bold ${visible ? expected === "REJECT" ? "text-amber-700 dark:text-amber-300" : "text-primary" : "text-muted-foreground"}`}>{visible ? expected : "—"}</span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center text-[9px] leading-3 sm:mt-3 sm:text-[10px] sm:leading-4">
          <div className="border border-border p-1 sm:p-2"><strong className="block">BASE</strong><span className="text-muted-foreground">receipt·events·wallet view</span></div>
          <span className="font-mono font-black text-primary">대조</span>
          <div className={`border p-1 sm:p-2 ${danger ? "border-amber-500/70" : "border-primary/45"}`}><strong className="block">CANDIDATE</strong><span className="text-muted-foreground">{active < 5 ? "같은 fixture 독립 실행" : active === 5 ? "호환 artifact로 복구" : "proposed 또는 rejected"}</span></div>
        </div>

        <p data-scene-note className="mt-2 min-h-14 border-l-2 border-primary/50 pl-3 text-xs leading-[1.15rem] text-muted-foreground sm:mt-3 sm:min-h-24 sm:pl-4 sm:text-sm sm:leading-6">
          <span className="sm:hidden">{MOBILE_NOTES[active]}</span>
          <span className="hidden sm:inline">{NOTES[active]}</span>
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["고정", "정상", "재사용", "변조", "중단", "복구", "결정"]}
          playLabel="RAILGUN 변경 검증 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
