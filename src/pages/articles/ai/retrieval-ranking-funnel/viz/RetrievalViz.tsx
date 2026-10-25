import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  {
    short: "범위",
    title: "권한이 있는 문서만 검색 범위에 넣습니다.",
    note: "tenant-a와 공개 문서만 후보가 될 수 있습니다. 다른 tenant의 d-91은 BM25·HNSW 점수, 캐시, 재정렬기 입력 어디에도 나타나지 않습니다.",
    rows: [
      ["d-17", "tenant-a", "검색 허용"],
      ["d-04", "public", "검색 허용"],
      ["d-91", "tenant-b", "범위 밖"],
    ],
    receipt: ["universe: tenant-a + public", "revision: corpus-v42"],
  },
  {
    short: "후보",
    title: "BM25와 dense 검색이 서로 다른 후보를 찾습니다.",
    note: "BM25는 XR-17B 같은 정확한 문자열을, 밀집 벡터 검색은 ‘로그인 유지’와 ‘세션 만료 연장’ 같은 의미 대응을 찾습니다. 둘 중 하나만 쓰면 다른 종류의 정답을 놓칠 수 있습니다.",
    rows: [
      ["BM25", "d-17 · 1위", "d-22 · 5위"],
      ["Dense · 의미", "d-04 · 1위", "d-17 · 2위"],
      ["Graph", "선택 경로", "이번 질의 없음"],
    ],
    receipt: ["sparse cutoff: 5", "dense cutoff: 5"],
  },
  {
    short: "융합",
    title: "서로 다른 점수 대신 순위 근거를 합칩니다.",
    note: "k=60인 RRF 예시입니다. d-17은 두 목록에 모두 있어 1/61+1/62=0.03252를 얻습니다. 이 값은 설명용 계산이며 실측 품질이 아닙니다.",
    rows: [
      ["d-17", "1위 + 2위", "0.03252"],
      ["d-22", "5위 + 4위", "0.03101"],
      ["d-04", "없음 + 1위", "0.01639"],
    ],
    receipt: ["fusion: RRF", "k: 60"],
  },
  {
    short: "범위 제한",
    title: "비싼 재정렬기가 읽을 후보 수를 제한합니다.",
    note: "융합 결과 3개를 모두 읽도록 재정렬 범위를 3으로 잡았습니다. 범위가 2였다면 3위 d-04는 뒤 단계가 아무리 정확해도 볼 수 없습니다.",
    rows: [
      ["1", "d-17", "재정렬 입력"],
      ["2", "d-22", "재정렬 입력"],
      ["3", "d-04", "재정렬 입력"],
    ],
    receipt: ["후보 수: 3", "재정렬 범위: 3"],
  },
  {
    short: "재정렬",
    title: "질의와 후보를 함께 읽어 최종 순서를 바꿉니다.",
    note: "교차 인코더는 제한된 후보를 질의와 함께 읽어 d-04를 2위로 올립니다. ColBERT 같은 지연 상호작용 방식은 문서 토큰 벡터를 미리 계산해 두는 다른 비용 절충입니다.",
    rows: [
      ["d-17", "0.94", "최종 1위"],
      ["d-04", "0.89", "최종 2위"],
      ["d-22", "0.18", "제외"],
    ],
    receipt: ["ranker: cross-encoder-v7", "output: top-2"],
  },
  {
    short: "기록",
    title: "최종 문서뿐 아니라 단계별 누락 가능성을 함께 남깁니다.",
    note: "이 예시에서 허용된 정답 d-17·d-04가 모두 후보와 top-2에 남았습니다. 실제 출시는 같은 corpus revision에서 recall·ranking·latency를 따로 측정해야 합니다.",
    rows: [
      ["후보 재현율", "2 / 2", "1.00"],
      ["상위 2개 정확도", "2 / 2", "1.00"],
      ["지연·비용", "대상 환경", "미측정"],
    ],
    receipt: ["evidence: d-17, d-04", "trace: search-8f31"],
  },
] as const;

function StageRail({ active }: { active: number }) {
  return (
    <ol className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">
      {SCENES.map((scene, index) => {
        const current = index === active;
        const reached = index <= active;
        return (
          <li
            key={scene.short}
            className={`min-w-0 px-2 py-1 text-center text-[10px] font-bold leading-4 sm:py-2 sm:text-[11px] ${
              current
                ? "bg-primary text-primary-foreground"
                : reached
                  ? "bg-primary/10 text-primary"
                  : "bg-background text-muted-foreground"
            }`}
          >
            <span className="mr-1 font-mono text-[8px] opacity-70">
              {String(index + 1).padStart(2, "0")}
            </span>
            {scene.short}
          </li>
        );
      })}
    </ol>
  );
}

function SceneTable({ active }: { active: number }) {
  return (
    <div className="mt-2 overflow-hidden border border-border sm:mt-3">
      {SCENES[active].rows.map((row, index) => (
        <div
          key={`${active}-${row[0]}`}
          className="grid min-h-9 grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)_minmax(0,1fr)] items-center gap-px border-b border-border/70 bg-border/70 text-[10px] leading-4 last:border-b-0 sm:text-xs"
        >
          {row.map((cell, cellIndex) => (
            <span
              key={cell}
              className={`flex h-full min-w-0 items-center break-words bg-background px-2 py-2 sm:px-3 ${
                cellIndex === 0 ? "font-mono font-bold text-foreground" : "text-muted-foreground"
              } ${index === 2 && active === 0 ? "line-through decoration-primary/70" : ""}`}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function RetrievalViz() {
  const labels = SCENES.map((scene) => `${scene.short}: ${scene.title}`);
  const notes = SCENES.map((scene) => scene.note);
  const controls = useAnimatedScenes(SCENES.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? SCENES.length - 1 : controls.active;
  const scene = SCENES[active];

  return (
    <VizFrame
      eyebrow="질의 한 건 · 설명용 후보 변화"
      title="XR-17B 문의가 허용 문서 안에서 최종 근거 두 건으로 좁혀집니다"
      description="이름을 먼저 외우지 않고, 검색 범위와 후보 목록이 단계마다 어떻게 변하는지 따라갑니다."
      note="문서 ID·점수·지표는 계산을 설명하기 위한 가정입니다. 논문 결과와 대상 환경의 측정값은 본문에서 따로 구분합니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="retrieval-ranking-funnel"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="flex min-h-full min-w-0 flex-col border-y border-border/70 bg-background px-4 py-1 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-5 sm:py-3 lg:px-6 lg:py-5"
      >
        <div data-viz-live-only className="flex min-h-0 flex-1 flex-col">
          <StageRail active={active} />
          <div className="my-auto py-0 sm:py-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-1 sm:pb-2">
              <p className="font-mono text-[10px] font-bold text-foreground sm:text-xs">
                tenant-a · “XR-17B 로그인 유지 시간 늘리기”
              </p>
              <p className="text-[10px] font-black text-primary">
                장면 {String(active + 1).padStart(2, "0")}
              </p>
            </div>
            <h3 className="mt-2 min-h-8 break-keep text-sm font-bold leading-5 sm:mt-3 sm:min-h-10 sm:text-lg sm:leading-7">
              {scene.title}
            </h3>
            <SceneTable active={active} />
            <div className="mt-2 grid grid-cols-2 gap-px bg-border p-px sm:mt-3">
              {scene.receipt.map((item) => (
                <p
                  key={item}
                  className="min-w-0 break-words bg-background px-2 py-2 font-mono text-[9px] font-semibold leading-4 text-foreground sm:px-3 sm:text-[11px]"
                >
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-2 min-h-10 border-l border-primary/50 pl-3 text-[11px] leading-5 text-muted-foreground sm:mt-3 sm:pl-4 sm:text-xs lg:text-sm lg:leading-6">
              {scene.note}
            </p>
          </div>
        </div>
        <AnimatedSceneControls
          {...controls}
          active={active}
          labels={labels}
          controlLabels={SCENES.map((sceneItem) => sceneItem.short)}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-3 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-mobile-controls]]:hidden lg:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
