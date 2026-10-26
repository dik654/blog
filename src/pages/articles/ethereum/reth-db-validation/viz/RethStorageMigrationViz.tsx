import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["원본 보존", "Static 이관", "RocksDB 이관", "V2 전환", "경계별 재시작", "증거로 결정"] as const;
const NOTES = [
  "Migration 전 V1 MDBX와 기존 static/RocksDB directory, chain tip/hash, binary·config를 같은 run ID로 보존합니다. 이 묶음이 rollback과 oracle의 출발점입니다.",
  "Account/storage changesets와 receipts를 공식 phase 순서대로 static files에 씁니다. 각 segment range와 checksum, 중단 지점을 기록합니다.",
  "Transaction hash numbers와 account/storage history를 RocksDB로 옮깁니다. Batch 중간 중단 뒤 MDBX checkpoints와 index progress가 어떻게 다시 맞춰지는지 검사합니다.",
  "자료 이동이 끝난 뒤에 StorageSettings를 V2로 바꾸고 old MDBX tables를 clear·compact한 다음 pipeline이 남은 자료를 rebuild합니다. Version flip을 자료 이동보다 앞세우지 않습니다.",
  "각 phase 직전·중간·직후에 candidate process를 종료합니다. 재시작은 정상 완료, 안전한 재개, 명시적 실패 중 하나여야 하며 mixed frontier로 serving하면 기각합니다.",
  "같은 chain query·state root·history 결과와 restart·rollback을 통과한 run에서만 시간·공간·query latency를 비교합니다. 측정이 없으면 결정은 proposed입니다.",
] as const;

const Phase = ({ title, state, tone = "plain" }: { title: string; state: string; tone?: "plain" | "active" | "done" | "warn" }) => {
  const style = tone === "active" ? "border-primary text-primary" : tone === "warn" ? "border-amber-500/70 text-amber-700 dark:text-amber-300" : tone === "done" ? "border-primary/40" : "border-border text-muted-foreground";
  return <div className={`border bg-background p-3 ${style}`}><strong className="block break-keep text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-4">{state}</span></div>;
};

export default function RethStorageMigrationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6800, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame eyebrow="실무 경로 · V1→V2 migration" title="원본을 보존하고 각 phase를 중단해도 같은 체인으로 돌아오는지 확인합니다" description="Migration 완료 장면만 보는 대신 copy, version flip, cleanup과 rebuild의 모든 복구 경계를 시험합니다." note="화면의 진행률은 실험 구조를 설명하는 예시입니다. 대상 환경에서 얻은 시간·용량·복구 측정값은 없습니다." canvasClassName="px-2 py-2 sm:p-5">
      <div id={scenes.playbackId} data-viz-live-only data-reth-migration-scene={active} tabIndex={0} role="group" aria-label="Reth Storage V1에서 V2로 이동하고 phase별 중단과 rollback을 검증하는 과정" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">{SCENES.map((label, index) => <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}><span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} /><span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span><strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong></div>)}</div>
        <section className="mt-3 min-h-[20rem] border border-border bg-background p-3 sm:min-h-[17rem] sm:p-5">
          {active === 0 ? <div className="grid min-h-[14rem] content-center gap-3"><div className="grid gap-3 sm:grid-cols-2"><Phase title="V1 ORACLE" state="MDBX snapshot · tip/hash · query digest" tone="active" /><Phase title="ROLLBACK BUNDLE" state="binary · MDBX · static · RocksDB · config" tone="active" /></div><p className="border-y border-border py-3 text-center text-xs font-bold">사본에서만 migration · 원본은 읽기 전용 보존</p></div> : null}
          {active === 1 ? <div className="grid min-h-[14rem] content-center gap-3"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Phase title="Account changesets" state="static range copy" tone="done" /><Phase title="Storage changesets" state="static range copy" tone="active" /><Phase title="Receipts" state="다음 phase" /><Phase title="StorageSettings" state="아직 V1" /></div><p className="text-center text-xs text-muted-foreground">Range · row count · checksum · kill point receipt</p></div> : null}
          {active === 2 ? <div className="grid min-h-[14rem] content-center gap-3"><div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr]"><Phase title="MDBX SOURCE" state="tx hash · history tables" tone="done" /><span className="hidden self-center font-black text-primary sm:block">batch →</span><div className="grid gap-2"><Phase title="ROCKSDB" state="TransactionHashNumbers" tone="done" /><Phase title="ROCKSDB" state="AccountsHistory · StoragesHistory" tone="active" /></div></div><p className="border-y border-border py-3 text-center text-xs font-bold">Rocks progress ↔ MDBX stage checkpoint 대조</p></div> : null}
          {active === 3 ? <div className="grid min-h-[14rem] content-center gap-3"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><Phase title="01 · settings" state="V1 → V2" tone="done" /><Phase title="02 · clear" state="migrated MDBX tables" tone="active" /><Phase title="03 · compact" state="MDBX 공간 정리" /><Phase title="04 · rebuild" state="pipeline remaining data" /></div><p className="border-y border-primary/50 py-3 text-center text-xs font-bold text-primary">자료 이관 완료 뒤 version flip · cleanup은 snapshot 없이 rollback할 수 없음</p></div> : null}
          {active === 4 ? <div className="grid min-h-[14rem] content-center gap-4"><div className="grid grid-cols-3 gap-2"><Phase title="직전 종료" state="phase를 다시 시작해도 동일" tone="done" /><Phase title="중간 종료" state="resume 또는 명시적 실패" tone="warn" /><Phase title="직후 종료" state="다음 phase로 안전하게 전진" tone="done" /></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center"><strong className="border border-amber-500/70 p-3 text-xs">mixed frontier 발견</strong><span className="font-black text-primary">→</span><strong className="border border-primary p-3 text-xs">serving 중지 · 사본 보존 · 복구</strong></div></div> : null}
          {active === 5 ? <div className="grid min-h-[14rem] content-center gap-3"><div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">{[["정합성", "tip·root·rows"], ["복구", "restart·rollback"], ["비용", "time·bytes·space"], ["서비스", "query p99·중단"]].map(([a,b]) => <div key={a} className="bg-background p-3"><span className="text-[9px] text-muted-foreground">{a}</span><strong className="mt-1 block text-xs">{b}</strong></div>)}</div><div className="grid grid-cols-3 gap-px bg-border p-px"><Phase title="STATUS" state="proposed" /><Phase title="채택" state="모든 gate + SLO" tone="active" /><Phase title="되돌리기" state="동일 snapshot bundle" /></div><p className="border-y border-border py-3 text-center text-xs font-bold">Manifest + raw artifacts + parity diff + rollback receipt가 한 run ID로 연결</p></div> : null}
        </section>
        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={["보존", "Static", "Rocks", "전환", "재시작", "결정"]} playLabel="Reth migration 검증 재생" className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
