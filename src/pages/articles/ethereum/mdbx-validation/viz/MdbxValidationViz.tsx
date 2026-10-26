import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "조건을 고정",
  "Commit 기준선",
  "경계에서 중단",
  "다시 열어 선택",
  "공간·순서 경계",
  "증거로 결정",
] as const;

const NOTES = [
  "libmdbx v0.14.3 commit f7a3a93과 build options, sync mode, page/map geometry, filesystem·mount·storage cache, operation trace와 oracle digest를 한 manifest에 고정합니다.",
  "같은 write trace를 candidate와 독립 ordered-map oracle에 넣고, commit 반환값과 transaction ID, key·DUPSORT 결과를 receipt로 남깁니다. 정상 실행 결과부터 일치해야 장애 시험을 해석할 수 있습니다.",
  "새 data pages 기록, meta 공개, sync 호출 전후에서 격리된 candidate 프로세스만 종료합니다. 전원 장애를 주장하려면 별도의 안전한 장비·가상화 시험이 필요하며 process kill 결과를 정전 결과로 확대하지 않습니다.",
  "재시작한 MDBX가 고른 마지막 일관된 meta의 txid·root와 logical rows를 oracle receipt에 대조합니다. Old generation 또는 new generation 중 하나여야 하며 섞인 결과나 성공 응답보다 오래된 손실은 설정 계약에 따라 판정합니다.",
  "Long reader로 page 재사용이 늦어지는 경우, map full, reader slot, writer contention과 DUPSORT codec·comparator 경계를 별도로 재생합니다. Crash만 통과해도 운영 준비가 끝나는 것은 아닙니다.",
  "Correctness와 recovery gate를 통과한 run에서만 commit latency, sync time, page faults, RSS, map growth와 p99를 비교합니다. 측정값이 없으면 ADR은 proposed이며 rollback artifact와 재진입 조건을 함께 남깁니다.",
] as const;

const Meta = ({
  id,
  txid,
  root,
  selected = false,
  unknown = false,
}: {
  id: string;
  txid: string;
  root: string;
  selected?: boolean;
  unknown?: boolean;
}) => (
  <div className={`border bg-background p-3 ${selected ? "border-primary" : unknown ? "border-dashed border-amber-500/70" : "border-border"}`}>
    <div className="flex items-center justify-between gap-2">
      <strong className="font-mono text-[10px]">META {id}</strong>
      <span className={`text-[9px] font-bold ${selected ? "text-primary" : "text-muted-foreground"}`}>{selected ? "선택" : unknown ? "검사 필요" : "후보"}</span>
    </div>
    <p className="mt-2 font-mono text-xs font-black">txid {txid} · root {root}</p>
  </div>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0 bg-background p-2 text-center">
    <span className="block text-[9px] font-bold text-muted-foreground">{label}</span>
    <strong className="mt-1 block break-keep text-[10px] leading-4">{value}</strong>
  </div>
);

export default function MdbxValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6800, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="실무 경로 · commit과 reopen 검증"
      title="같은 write를 기록하고, 끊고, 다시 열어 generation을 대조합니다"
      description="기능 소개가 아니라 MDBX release와 sync 설정을 운영 후보로 판단하는 증거 순서입니다."
      note="그림의 txid와 kill point는 실험 구조를 설명하기 위한 예시입니다. 대상 환경에서 얻은 복구·성능 측정값은 아직 없습니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-mdbx-validation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="MDBX 조건을 고정하고 commit 경계에서 중단한 뒤 다시 열어 복구와 비용을 검증하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6" aria-label="MDBX 검증의 여섯 단계">
          {SCENES.map((label, index) => (
            <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
              <span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong>
            </div>
          ))}
        </div>

        <section className="mt-3 min-h-[19rem] border border-border bg-background p-3 sm:min-h-[17rem] sm:p-5" aria-label="현재 MDBX 검증 상태">
          {active === 0 ? (
            <div className="grid min-h-[14rem] grid-cols-2 content-center gap-px bg-border p-px">
              {[
                ["SOURCE", "v0.14.3 · f7a3a93"],
                ["BUILD", "mdbx_chk -V options receipt"],
                ["DURABILITY", "sync mode · filesystem · mount"],
                ["STORAGE", "device · cache · virtual power model"],
                ["DATA", "trace digest · seed · oracle digest"],
                ["GEOMETRY", "page size · lower/now/upper map"],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 bg-background p-3">
                  <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
                  <p className="mt-1 break-all font-mono text-[10px] font-bold leading-4">{value}</p>
                </div>
              ))}
            </div>
          ) : null}

          {active === 1 ? (
            <div className="grid min-h-[14rem] content-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
              <div className="border border-border p-3">
                <span className="text-[9px] font-bold text-muted-foreground">CANDIDATE · MDBX</span>
                <p className="mt-2 font-mono text-xs font-black">put A=new → commit tx101</p>
                <div className="mt-3"><Meta id="B" txid="101" root="p2" selected /></div>
              </div>
              <span className="hidden text-center font-black text-primary sm:block">대조</span>
              <div className="border border-border p-3">
                <span className="text-[9px] font-bold text-muted-foreground">ORACLE · ordered map</span>
                <p className="mt-2 font-mono text-xs font-black">A=new · digest 7c…e1</p>
                <p className="mt-3 border-y border-border py-3 text-xs font-bold">commit receipt · tx101</p>
              </div>
            </div>
          ) : null}

          {active === 2 ? (
            <div className="grid min-h-[14rem] content-center gap-3">
              <div className="grid grid-cols-3 gap-px bg-border p-px text-center text-[10px] leading-4">
                <div className="bg-background p-3"><strong className="block">01 · data pages</strong><span className="mt-1 block text-muted-foreground">p52·p18·p2 작성</span></div>
                <div className="bg-background p-3"><strong className="block">02 · meta</strong><span className="mt-1 block text-muted-foreground">tx101·root p2 공개</span></div>
                <div className="bg-background p-3"><strong className="block">03 · sync</strong><span className="mt-1 block text-muted-foreground">mode별 flush 경계</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {["page 직후", "meta 전후", "sync 전후"].map((label, index) => (
                  <div key={label} className={`border p-3 ${index === 1 ? "border-amber-500/70" : "border-border"}`}>
                    <span className="text-[9px] font-bold text-muted-foreground">KILL POINT {index + 1}</span>
                    <strong className="mt-2 block text-xs">{label}</strong>
                  </div>
                ))}
              </div>
              <p className="border-y border-border py-3 text-center text-xs font-bold">격리된 candidate 프로세스만 종료 · 운영 데이터와 실제 장비 전원은 건드리지 않음</p>
            </div>
          ) : null}

          {active === 3 ? (
            <div className="grid min-h-[14rem] content-center gap-4">
              <div className="grid gap-2 sm:grid-cols-3">
                <Meta id="A" txid="100" root="p1" />
                <Meta id="B" txid="101" root="p2" selected />
                <Meta id="C" txid="102?" root="p?" unknown />
              </div>
              <div className="grid grid-cols-3 gap-px bg-border p-px">
                <Metric label="선택한 세대" value="tx101" />
                <Metric label="논리 rows" value="oracle와 대조" />
                <Metric label="혼합 graph" value="허용하지 않음" />
              </div>
              <p className="text-center text-xs leading-5 text-muted-foreground">마지막 일관된 meta와 root가 가리키는 전체 rows가 같은 generation이어야 합니다.</p>
            </div>
          ) : null}

          {active === 4 ? (
            <div className="grid min-h-[14rem] grid-cols-2 content-center gap-px bg-border p-px">
              {[
                ["Long reader", "oldest txid 고정 → retired pages 증가 → map growth"],
                ["Map full", "geometry 상한 도달 → write 실패와 안전한 재시도"],
                ["Reader slots", "slot exhaustion·stale reader detection·process liveness"],
                ["Writer contention", "single writer 대기·timeout·고객 latency"],
                ["DUPSORT", "codec·comparator·duplicate insert/delete·cursor order"],
                ["Build compatibility", "lock format·libc·process/container 조건"],
              ].map(([title, body]) => (
                <div key={title} className="bg-background p-3">
                  <strong className="text-xs">{title}</strong>
                  <p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          ) : null}

          {active === 5 ? (
            <div className="grid min-h-[14rem] content-center gap-3">
              <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
                <Metric label="정확성" value="rows·cursor·generation" />
                <Metric label="복구" value="reopen·RPO·RTO" />
                <Metric label="공간" value="RSS·map·reader age" />
                <Metric label="지연" value="commit·sync·p99" />
              </div>
              <div className="grid grid-cols-3 gap-px bg-border p-px">
                <div className="bg-background p-3"><span className="text-[9px] text-muted-foreground">STATUS</span><strong className="mt-1 block text-sm">proposed</strong></div>
                <div className="bg-background p-3"><span className="text-[9px] text-muted-foreground">채택</span><strong className="mt-1 block break-keep text-xs">모든 gate와 SLO 통과</strong></div>
                <div className="bg-background p-3"><span className="text-[9px] text-muted-foreground">되돌리기</span><strong className="mt-1 block break-keep text-xs">이전 binary·DB generation</strong></div>
              </div>
              <p className="border-y border-border py-3 text-center text-xs font-bold">Raw artifact + manifest + oracle diff + rollback receipt가 한 run ID로 연결되어야 합니다.</p>
            </div>
          ) : null}
        </section>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["고정", "기준", "중단", "재실행", "경계", "결정"]}
          playLabel="MDBX 검증 과정 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
