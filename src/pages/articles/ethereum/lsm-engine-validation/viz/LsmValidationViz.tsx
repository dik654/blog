import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "조건 고정",
  "입력 재생",
  "중간 종료",
  "복구 대조",
  "비용 측정",
  "결정 기록",
] as const;

const NOTES = [
  "엔진 commit, 전체 options dump, 파일시스템, 장치, 자료 digest와 seed를 한 run manifest에 고정합니다. 이 값이 다르면 같은 실험으로 비교하지 않습니다.",
  "overwrite·delete·point/range read·burst가 섞인 같은 operation trace를 baseline과 candidate에 순서까지 동일하게 넣습니다.",
  "WAL sync 전후, memtable freeze, SSTable 생성, compaction 결과 설치 같은 경계에서 실험용 프로세스만 종료합니다. 운영 장비에는 장애를 주입하지 않습니다.",
  "재시작 뒤 모든 key와 snapshot 결과를 독립 oracle과 대조합니다. 값·삭제·시점 결과가 하나라도 다르면 성능 비교로 넘어가지 않습니다.",
  "정확성 통과 run에서만 WAL·flush·compaction bytes, L0 파일, pending bytes, stall 시간, p50·p99와 복구 시간을 같은 구간으로 측정합니다.",
  "측정값과 실패 기록, 선택 이유, 되돌릴 profile을 ADR에 함께 남깁니다. 아직 실행하지 않았다면 결론은 proposed이며 우위는 미측정입니다.",
] as const;

const STAGE_OUTPUT = [
  ["입력", "manifest-v1", "상태", "비교 가능"],
  ["입력", "ops-v3 · seed 17", "상태", "두 profile 실행"],
  ["입력", "killpoint k-04", "상태", "재시작 대기"],
  ["입력", "oracle-v2", "상태", "값·snapshot 대조"],
  ["입력", "같은 관측 구간", "상태", "지표 receipt"],
  ["입력", "검증 receipt", "상태", "proposed 또는 accepted"],
] as const;

export default function LsmValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200, { loop: false });
  const active = scenes.active;
  const output = STAGE_OUTPUT[active];

  return (
    <VizFrame
      eyebrow="실무 경로 · 같은 입력, 다른 profile"
      title="설정 변경은 crash 뒤 같은 답을 복원한 다음에만 비용을 비교합니다"
      description="실험 manifest에서 ADR까지 증거가 어떻게 이어지는지 여섯 장면으로 봅니다."
      note="run ID, 자료량, candidate 설정과 결과값은 아직 대상 환경에서 측정하지 않았습니다. 이 그림은 실험의 순서와 판정 경계를 설명합니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-lsm-validation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="LSM 설정을 고정하고 장애 복구와 비용을 검증해 결정 기록으로 남기는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6" aria-label="LSM 검증의 여섯 단계">
          {SCENES.map((label, index) => (
            <div key={label} className={`min-w-0 bg-background px-2 py-2.5 ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className={`mb-2 block h-1 w-7 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
              <span className="font-mono text-[9px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-[11px] leading-4">{label}</strong>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-2">
          <section className="min-w-0 bg-background p-4" aria-label="고정된 비교 대상">
            <p className="text-[10px] font-bold text-muted-foreground">고정된 비교 대상</p>
            <div className="mt-3 grid gap-px bg-border p-px text-xs">
              <div className="bg-background px-3 py-2.5"><strong>Baseline</strong><span className="ml-2 text-muted-foreground">profile-a</span></div>
              <div className="bg-background px-3 py-2.5"><strong>Candidate</strong><span className="ml-2 text-muted-foreground">profile-b</span></div>
              <div className="bg-background px-3 py-2.5"><strong>RocksDB</strong><span className="ml-2 font-mono text-muted-foreground">2dc6bc5</span></div>
              <div className="bg-background px-3 py-2.5"><strong>자료</strong><span className="ml-2 text-muted-foreground">같은 trace·seed·장비</span></div>
            </div>
          </section>

          <section className="min-h-72 min-w-0 bg-background p-4" aria-label="현재 단계의 입력과 출력">
            <p className="text-[10px] font-bold text-muted-foreground">현재 단계의 증거</p>
            <div className="mt-3 border-y border-border py-3">
              <span className="text-[9px] font-bold text-muted-foreground">{output[0]}</span>
              <p className="mt-1 break-all font-mono text-xs font-bold">{output[1]}</p>
            </div>
            <div className="border-b border-border py-3">
              <span className="text-[9px] font-bold text-muted-foreground">{output[2]}</span>
              <p className="mt-1 break-keep text-sm font-black">{output[3]}</p>
            </div>
            {active >= 3 ? (
              <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center">
                <div className="bg-background px-2 py-2"><span className="block text-[9px] text-muted-foreground">값</span><strong className="mt-1 block text-xs">대조</strong></div>
                <div className="bg-background px-2 py-2"><span className="block text-[9px] text-muted-foreground">snapshot</span><strong className="mt-1 block text-xs">대조</strong></div>
                <div className="bg-background px-2 py-2"><span className="block text-[9px] text-muted-foreground">결과</span><strong className="mt-1 block text-xs text-primary">미측정</strong></div>
              </div>
            ) : null}
          </section>
        </div>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["고정", "재생", "종료", "대조", "측정", "결정"]}
          playLabel="LSM 검증 과정 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
