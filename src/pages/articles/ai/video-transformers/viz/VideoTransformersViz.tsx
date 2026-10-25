import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import {
  attentionPairLedger,
  tubeletGrid,
  videoMaeTubeMaskLedger,
} from "../calculations";

type SceneProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
};

function Scene({
  id,
  eyebrow,
  title,
  description,
  labels,
  notes,
  children,
}: SceneProps) {
  const controls = useAnimatedScenes(labels.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? labels.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      className="my-8 !block !h-auto !max-h-none !overflow-visible [&>figcaption]:mb-3 [&>figcaption>h3]:mt-1 [&>figcaption>h3]:text-base [&>figcaption>h3]:leading-6 [&>figcaption>p:last-child]:hidden sm:[&>figcaption]:mb-5 sm:[&>figcaption>h3]:mt-2 sm:[&>figcaption>h3]:text-lg sm:[&>figcaption>h3]:leading-7 sm:[&>figcaption>p:last-child]:mt-2 sm:[&>figcaption>p:last-child]:block sm:[&>figcaption>p:last-child]:text-sm sm:[&>figcaption>p:last-child]:leading-6"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label={`${title}의 ${labels.length}단계 설명`}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div
          data-viz-live-only
          className="flex min-h-0 flex-col justify-center sm:min-h-[22rem]"
        >
          <p className="text-[11px] font-black text-primary">
            장면 {String(active + 1).padStart(2, "0")} /{" "}
            {String(labels.length).padStart(2, "0")}
          </p>
          <h4 className="mt-1 break-keep text-sm font-bold leading-6 sm:mt-2 sm:text-base sm:leading-7">
            {labels[active]}
          </h4>
          <div className="mt-3 min-w-0 sm:mt-5">{children(active)}</div>
          <p className="mt-3 border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:mt-5 sm:pl-4 sm:text-sm sm:leading-7">
            {notes[active]}
          </p>
        </div>
        <AnimatedSceneControls
          labels={labels}
          active={active}
          playing={controls.playing}
          reducedMotion={controls.reducedMotion}
          setActive={controls.setActive}
          setPlaying={controls.setPlaying}
        />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {labels.map((label, index) => (
            <li
              key={label}
              className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <strong>
                {index + 1}. {label}
              </strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

const GRID = tubeletGrid({
  frames: 16,
  height: 224,
  width: 224,
  tubeletDepth: 2,
  patchSize: 16,
});
const PAIRS = attentionPairLedger({
  temporalPositions: GRID.temporalPositions,
  spatialPositions: GRID.spatialPositions,
});
const MASK = videoMaeTubeMaskLedger({
  temporalPositions: GRID.temporalPositions,
  spatialPositions: GRID.spatialPositions,
  maskRatio: 0.9,
});

const PIPELINE = [
  {
    short: "입력",
    title: "16 sampled frames",
    detail: "30 fps · source stride 2",
    result: "src 0…30 · 1.0 s",
  },
  {
    short: "분할",
    title: "2×16×16 tubelet",
    detail: "시간 2장 · 공간 16×16",
    result: "8×14×14",
  },
  {
    short: "연결",
    title: "Attention graph",
    detail: "joint 또는 time→space",
    result: "2,458,624 / 319,872",
  },
  {
    short: "가림",
    title: "VideoMAE tube mask",
    detail: "같은 공간 mask를 시간축에 반복",
    result: "160 visible",
  },
] as const;

export function VideoTransformerOverviewViz() {
  const labels = [
    "같은 timestamp clip을 고정",
    "두 sampled frames와 공간 patch를 묶기",
    "1,568개 token의 연결 방식을 선택",
    "같은 공간 mask를 시간축에 반복",
    "두 절감 축을 서로 다른 단계로 구분",
  ] as const;
  const notes = [
    "앞 글과 같은 입력을 씁니다. 30 fps 원본에서 source frame을 두 칸마다 골라 0부터 30까지 16장을 읽으므로 첫 장과 마지막 장 사이는 1초입니다.",
    "인접한 model-input frame 두 장과 같은 16×16 공간을 묶습니다. 시간축 8개, 공간축 14×14개이므로 1,568개 tubelet token이 생깁니다.",
    "Joint attention은 1,568개 전체를 직접 비교합니다. TimeSformer의 divided block은 같은 공간 위치의 시간 관계를 먼저 읽고 같은 시간의 공간 관계를 읽습니다.",
    "VideoMAE의 tube mask는 공간 mask 하나를 만든 뒤 8개 시간 위치에 그대로 반복합니다. Masking은 연결 그래프가 아니라 encoder에 들어가는 token 집합을 바꿉니다.",
    "Divided attention은 interaction을 나누고 VideoMAE masking은 pretraining encoder input을 줄입니다. 두 방법은 같은 비용을 줄이는 대체 표현이 아닙니다.",
  ] as const;

  return (
    <Scene
      id="video-transformer-overview"
      eyebrow="전체 지도"
      title="같은 16장을 token·연결·mask로 바꾸는 경로"
      description="입력을 바꾸는 단계와 token 사이 계산을 바꾸는 단계를 분리합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-4" role="img" aria-label={notes[active]}>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
          >
            {Array.from({ length: 16 }, (_, index) => (
              <div
                key={index}
                className={`h-7 border-y transition-colors sm:h-9 ${
                  active === 0
                    ? "border-primary/70 bg-primary/10"
                    : "border-border bg-muted/20"
                }`}
                title={`model frame ${index}, source frame ${index * 2}`}
              >
                <span className="sr-only">source frame {index * 2}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 font-mono text-[9px] text-muted-foreground sm:text-[10px]">
            <span>src 0 · 0.000 s</span>
            <span>src 30 · 1.000 s</span>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
            {PIPELINE.map((item, index) => {
              const selected =
                active > 0 && (index === active - 1 || active === 4);
              return (
                <div
                  key={item.short}
                  className={`min-w-0 bg-background px-3 py-3 transition-colors sm:px-4 sm:py-4 ${
                    selected ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="font-mono text-[9px] font-black text-primary">
                    0{index + 1} · {item.short}
                  </span>
                  <strong className="mt-1 block break-keep text-xs leading-5">
                    {item.title}
                  </strong>
                  <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground sm:mt-2 sm:leading-5">
                    {item.detail}
                  </span>
                  <code className="mt-2 block break-words font-mono text-[10px] leading-4 text-primary sm:mt-3 sm:leading-5">
                    {item.result}
                  </code>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-px bg-border p-px text-[10px] leading-5">
            <div
              className={`bg-background px-3 py-2 ${active === 4 ? "bg-primary/10" : ""}`}
            >
              <strong>Divided attention</strong>
              <span className="block text-muted-foreground">
                어떤 token끼리 비교할지 변경
              </span>
            </div>
            <div
              className={`bg-background px-3 py-2 ${active === 4 ? "bg-primary/10" : ""}`}
            >
              <strong>VideoMAE masking</strong>
              <span className="block text-muted-foreground">
                encoder가 받을 token을 변경
              </span>
            </div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function TubeletGeometryViz() {
  const labels = [
    "16개 sampled frame을 놓기",
    "시간축에서 두 장씩 묶기",
    "224×224를 16×16 patch로 나누기",
    "세 축의 위치 수를 곱하기",
  ] as const;
  const notes = [
    "Model input은 source index 0·2·4부터 30까지 16장입니다. Tubelet은 raw video의 연속 frame이 아니라 이 sampled input에서 인접한 frame을 묶습니다.",
    "Tubelet depth가 2이므로 input frame 16장은 8개 시간 위치가 됩니다. 첫 tubelet은 source frame 0과 2, 다음 tubelet은 4와 6을 묶습니다.",
    "높이와 너비는 각각 224/16=14칸입니다. 한 시간 위치에는 14×14=196개 공간 위치가 있습니다.",
    "시간 8, 공간 196을 곱하면 1,568 tokens입니다. 이 수는 embedding dimension이 아니라 sequence length입니다.",
  ] as const;

  return (
    <Scene
      id="video-tubelet-geometry"
      eyebrow="입력 분할"
      title="16×224×224가 8×14×14가 되는 과정"
      description="시간·높이·너비를 각각 나눈 뒤 마지막에 곱합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div
          className="grid grid-cols-[minmax(0,1.35fr)_minmax(7rem,.65fr)] gap-3 sm:grid-cols-[minmax(0,1.25fr)_minmax(12rem,.75fr)] sm:gap-4"
          role="img"
          aria-label={notes[active]}
        >
          <div className="min-w-0 border-y border-border px-3 py-4 sm:px-4">
            <span className="text-[10px] font-bold text-muted-foreground">
              시간축
            </span>
            <div
              className="mt-3 grid gap-1"
              style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}
            >
              {Array.from({ length: 8 }, (_, pair) => (
                <div
                  key={pair}
                  className={`min-w-0 border-y px-1 py-2 text-center transition-colors ${
                    active >= 1
                      ? "border-primary/60 bg-primary/10"
                      : "border-border"
                  }`}
                >
                  <span className="block font-mono text-[8px] text-muted-foreground sm:text-[9px]">
                    {pair * 2}·{pair * 2 + 1}
                  </span>
                  <strong className="mt-1 block font-mono text-[9px] sm:text-[10px]">
                    t{pair}
                  </strong>
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] text-primary">
              input frame 16 / depth 2 = 8 temporal positions
            </p>
          </div>

          <div
            className={`border-y px-3 py-4 transition-colors ${active >= 2 ? "border-primary/60 bg-primary/5" : "border-border"}`}
          >
            <span className="text-[10px] font-bold text-muted-foreground">
              공간축
            </span>
            <div
              className="mt-3 grid w-28 gap-px bg-border p-px"
              style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
            >
              {Array.from({ length: 49 }, (_, index) => (
                <span
                  key={index}
                  className="aspect-square bg-background"
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] text-primary">
              14 rows × 14 cols = 196
            </p>
          </div>

          <div
            className={`col-span-2 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 border-y px-3 py-4 text-center transition-colors ${active === 3 ? "border-primary/70 bg-primary/10" : "border-border"}`}
          >
            <div>
              <span className="block text-[9px] text-muted-foreground">
                시간
              </span>
              <strong className="text-xl">8</strong>
            </div>
            <span className="text-muted-foreground">×</span>
            <div>
              <span className="block text-[9px] text-muted-foreground">
                공간
              </span>
              <strong className="text-xl">196</strong>
            </div>
            <span className="text-muted-foreground">=</span>
            <div>
              <span className="block text-[9px] text-muted-foreground">
                sequence
              </span>
              <strong className="text-xl text-primary">1,568</strong>
            </div>
          </div>
        </div>
      )}
    </Scene>
  );
}

function TokenNeighborhood({ active }: { active: number }) {
  const rows = 3;
  const columns = 4;
  const queryRow = 1;
  const queryColumn = 1;

  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const query = row === queryRow && column === queryColumn;
        const joint = active === 1;
        const temporal = active === 2 && column === queryColumn;
        const dividedTemporal = active === 3 && column === queryColumn;
        const dividedSpatial = active === 3 && row === queryRow;
        const inheritedThroughTemporal = active === 3 && row !== queryRow;
        const reachable =
          joint || temporal || dividedTemporal || dividedSpatial;
        return (
          <div
            key={index}
            className={`flex min-h-12 min-w-0 items-center justify-center border-y font-mono text-[9px] transition-colors sm:min-h-14 sm:text-[10px] ${
              query
                ? "border-primary bg-primary text-primary-foreground"
                : reachable
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : inheritedThroughTemporal
                    ? "border-primary/25 bg-primary/5 text-muted-foreground"
                    : "border-border text-muted-foreground"
            }`}
          >
            t{row}·s{column}
          </div>
        );
      })}
    </div>
  );
}

export function SpaceTimeAttentionViz() {
  const labels = [
    "질문할 token 하나를 고르기",
    "Joint는 모든 token을 직접 비교",
    "Temporal attention은 같은 공간 위치를 비교",
    "Spatial attention이 같은 시간의 위치를 이어 받기",
    "실제 1,568개 입력의 pair 수를 대조",
  ] as const;
  const notes = [
    "작은 3×4 격자에서 가운데 token t1·s1을 query로 둡니다. 실제 사례는 시간 8개와 공간 196개이지만 연결 규칙은 같습니다.",
    "Joint attention에서는 query 하나가 모든 시간·공간 token을 직접 비교합니다. 실제 pair proxy는 (8×196)²=2,458,624입니다.",
    "TimeSformer divided block의 공식 코드는 먼저 spatial position별로 tensor를 재배열해 8개 시간 token끼리 temporal attention을 수행합니다.",
    "그 결과를 다시 시간별 공간 격자로 재배열해 spatial attention을 수행합니다. 두 단계 뒤 정보가 퍼질 수 있지만 joint처럼 한 score matrix에서 모든 pair를 직접 비교하지는 않습니다.",
    "T=8,S=196이면 spatial 307,328 pairs와 temporal 12,544 pairs를 더해 319,872입니다. 이는 attention score pair proxy이며 실제 latency가 아닙니다.",
  ] as const;

  return (
    <Scene
      id="video-space-time-attention"
      eyebrow="연결 그래프"
      title="Joint 한 번과 time→space 두 단계를 구분하기"
      description="작은 격자에서 직접 연결을 본 뒤 실제 token 수를 대입합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div
          className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-stretch"
          role="img"
          aria-label={notes[active]}
        >
          <div className="min-w-0 border-y border-border px-3 py-4">
            <div className="mb-3 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
              <span>작은 연결 예시 · T=3, S=4</span>
              <span className="font-mono text-primary">query t1·s1</span>
            </div>
            <TokenNeighborhood active={active} />
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[9px] leading-4 text-muted-foreground">
              <span>
                <i className="mr-1 inline-block size-2 bg-primary align-middle" />
                query
              </span>
              <span>
                <i className="mr-1 inline-block size-2 bg-primary/20 align-middle" />
                현재 stage의 직접 score
              </span>
              <span>
                <i className="mr-1 inline-block size-2 bg-primary/5 align-middle" />
                앞 stage에서 전달
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-1">
            <div
              className={`bg-background px-3 py-3 ${active === 1 || active === 4 ? "bg-primary/10" : ""}`}
            >
              <span className="text-[9px] font-bold text-muted-foreground">
                JOINT
              </span>
              <strong className="mt-1 block font-mono text-base text-primary">
                {PAIRS.jointPairs.toLocaleString()}
              </strong>
              <span className="block text-[9px] leading-4 text-muted-foreground">
                (TS)² direct pairs
              </span>
            </div>
            <div
              className={`bg-background px-3 py-3 ${active >= 2 ? "bg-primary/10" : ""}`}
            >
              <span className="text-[9px] font-bold text-muted-foreground">
                DIVIDED
              </span>
              <strong className="mt-1 block font-mono text-base text-primary">
                {PAIRS.dividedPairs.toLocaleString()}
              </strong>
              <span className="block text-[9px] leading-4 text-muted-foreground">
                TS² + ST² pairs
              </span>
            </div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function VideoMaeTubeMaskViz() {
  const labels = [
    "전체 1,568개 tubelet을 놓기",
    "공간 196개 중 176개를 가리기",
    "같은 공간 mask를 8개 시간 위치에 반복",
    "Encoder에는 160개 visible token만 전달",
    "Decoder에서 1,408개 masked target을 복원",
  ] as const;
  const notes = [
    "Tubelet geometry 뒤에는 시간 8×공간 196=1,568개 token이 있습니다. 아직 어느 token도 가리지 않았습니다.",
    "공식 TubeMaskingGenerator는 시간 위치 하나의 공간 196개에서 int(0.9×196)=176개를 masked로 정합니다. 따라서 visible은 20개입니다.",
    "한 번 섞은 공간 mask 배열을 8개 시간 위치에 그대로 복제합니다. 같은 공간 위치가 시간축 전체에서 가려지므로 adjacent frame의 같은 위치를 그대로 베끼기 어렵게 합니다.",
    "공식 encoder는 boolean mask의 반대인 ~mask 위치만 골라 reshape합니다. 20 visible positions×8 temporal positions=160개가 큰 encoder에 들어갑니다.",
    "Decoder 입력에는 encoded visible tokens와 mask tokens가 다시 합쳐집니다. 공식 구현은 마지막 1,408개 masked token prediction만 반환해 pixel reconstruction loss에 사용합니다.",
  ] as const;
  const visibleColumns = new Set([2]);

  return (
    <Scene
      id="videomae-tube-mask"
      eyebrow="Masked pretraining"
      title="90%라는 비율을 실제 160개 입력으로 바꾸기"
      description="공식 구현의 정수화·시간축 반복·encoder 선택 순서를 따릅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div
          className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_15rem]"
          role="img"
          aria-label={notes[active]}
        >
          <div className="min-w-0 border-y border-border px-3 py-3">
            <div className="mb-2 flex items-center justify-between gap-2 text-[9px] text-muted-foreground">
              <span>시간 8행 · 공간 일부만 축약 표시</span>
              <span className="font-mono text-primary">같은 mask pattern</span>
            </div>
            <div className="space-y-1">
              {Array.from({ length: 8 }, (_, temporal) => (
                <div
                  key={temporal}
                  className="grid grid-cols-[1.7rem_minmax(0,1fr)] items-center gap-2"
                >
                  <span className="font-mono text-[8px] text-muted-foreground">
                    t{temporal}
                  </span>
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
                    }}
                  >
                    {Array.from({ length: 10 }, (_, column) => {
                      const masked = active >= 1 && !visibleColumns.has(column);
                      const encoderVisible =
                        active === 3 && visibleColumns.has(column);
                      const decoderTarget = active === 4 && masked;
                      return (
                        <span
                          key={column}
                          className={`h-4 border-y transition-colors sm:h-5 ${
                            encoderVisible
                              ? "border-primary bg-primary"
                              : decoderTarget
                                ? "border-primary/60 bg-primary/15"
                                : masked
                                  ? "border-border bg-muted/70"
                                  : "border-primary/60 bg-primary/10"
                          }`}
                          aria-hidden="true"
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[9px] leading-4 text-muted-foreground">
              <span>축약 그림은 1/10 비율만 표시</span>
              <span>계산은 196개 전체에 적용</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-1">
            {[
              ["공간당 mask", MASK.maskedPerTemporalPosition],
              ["시간당 visible", MASK.visiblePerTemporalPosition],
              ["Encoder 입력", MASK.visibleTokens],
              ["Decoder target", MASK.maskedTokens],
            ].map(([label, value], index) => {
              const highlighted =
                (active === 1 && index < 2) ||
                (active === 3 && index === 2) ||
                (active === 4 && index === 3);
              return (
                <div
                  key={label}
                  className={`bg-background px-3 py-2.5 ${highlighted ? "bg-primary/10" : ""}`}
                >
                  <span className="block text-[9px] text-muted-foreground">
                    {label}
                  </span>
                  <strong className="mt-1 block font-mono text-base text-primary">
                    {Number(value).toLocaleString()}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Scene>
  );
}
