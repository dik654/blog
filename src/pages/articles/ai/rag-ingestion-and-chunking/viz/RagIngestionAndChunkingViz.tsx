import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  {
    short: "원문",
    title: "원문 내용과 revision·권한을 한 묶음으로 받습니다.",
    note: "파일 이름만으로 갱신 대상을 찾지 않습니다. source ID와 revision, 내용 hash, 유효 시점, ACL을 처리 요청에 함께 고정합니다.",
    from: "문서 원장",
    fromId: "policy / refund",
    to: "처리 요청",
    toId: "ingest-2048 · queued",
    fields: ["revision: v17", "sha256: 7a2…", "ACL: employee"],
  },
  {
    short: "구조",
    title: "Parser가 제목 계층과 원문 위치를 보존합니다.",
    note: "본문 문자열만 뽑으면 표 머리글과 행의 관계, 제목 경로, 원문 위치를 잃습니다. 파싱 결과가 chunk의 provenance가 됩니다.",
    from: "policy-v17.pdf",
    fromId: "§4.2 · 환불 조건",
    to: "parsed-v17",
    toId: "element e-037",
    fields: ["heading: 환불 > 예외", "offset: 1180:1540", "page: 7"],
  },
  {
    short: "분할",
    title: "분할 규칙이 검색 단위와 겹치는 구간을 만듭니다.",
    note: "1,000 token을 size 500·overlap 50으로 자르면 시작점은 0·450·900입니다. c-8f31은 경계에 걸린 480–530 문장을 온전히 보존합니다.",
    from: "parsed-v17",
    fromId: "1,000 token",
    to: "chunk manifest",
    toId: "c-8f31 · [450,950)",
    fields: ["c-01: [0,500)", "c-8f31: [450,950)", "c-03: [900,1000)"],
  },
  {
    short: "문맥",
    title: "필요하면 검색용 prefix를 붙이고 원문은 따로 보존합니다.",
    note: "검색용 텍스트를 바꿔도 인용은 raw span을 가리켜야 합니다. contextual prefix와 원문 내용, 생성 모델·prompt 버전을 분리해 기록합니다.",
    from: "raw chunk",
    fromId: "요청 뒤 7일 안에…",
    to: "검색용 chunk",
    toId: "ctx-c-8f31",
    fields: ["prefix: 환불 규정 v17 §4.2", "raw: c-8f31", "contextizer: ctx-v3"],
  },
  {
    short: "인계",
    title: "Embedding 작업에 재현 가능한 payload를 넘깁니다.",
    note: "이 글은 벡터를 만드는 모델을 고르지 않습니다. 같은 원문을 다시 처리했을 때 동일한 파생물을 식별할 수 있는 ID와 설정 checksum을 넘깁니다.",
    from: "ctx-c-8f31",
    fromId: "splitter cfg 91b…",
    to: "색인 입력",
    toId: "index-v42 / pending",
    fields: ["source: policy-v17", "embed model: embed-v5", "ACL: employee"],
  },
  {
    short: "반영",
    title: "새 revision을 공개한 뒤 이전 파생물을 검색에서 뺍니다.",
    note: "v17의 chunk가 모두 검증되기 전에 v16을 지우면 검색 공백이 생깁니다. staging 검증 뒤 alias를 바꾸고 이전 chunk를 tombstone 처리합니다.",
    from: "index-v42 / staging",
    fromId: "212 / 212 validated",
    to: "active index",
    toId: "alias → index-v42",
    fields: ["missing: 0", "v16: tombstoned", "manifest: committed"],
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

function Artifact({ label, id }: { label: string; id: string }) {
  return (
    <div className="min-w-0 border border-border bg-background px-3 py-3 sm:px-4">
      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 break-words font-mono text-[11px] font-bold leading-5 text-foreground sm:text-xs">
        {id}
      </p>
    </div>
  );
}

function SceneBody({ active }: { active: number }) {
  const scene = SCENES[active];
  return (
    <div className="mt-3">
      <div className="grid grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] items-stretch">
        <Artifact label={scene.from} id={scene.fromId} />
        <div className="flex items-center px-1" aria-hidden>
          <span className="h-px w-full bg-primary" />
        </div>
        <Artifact label={scene.to} id={scene.toId} />
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-px border border-border bg-border">
        {scene.fields.map((field, index) => {
          const [name, ...rest] = field.split(": ");
          return (
            <div key={field} className="min-w-0 bg-background px-2 py-2 sm:px-3 sm:py-2.5">
              <dt className="text-[9px] font-bold text-muted-foreground">
                필드 {index + 1}
              </dt>
              <dd className="mt-1 break-words font-mono text-[9px] font-semibold leading-4 text-foreground sm:text-[11px]">
                {rest.length ? (
                  <>
                    <span className="text-primary">{name}</span>: {rest.join(": ")}
                  </>
                ) : (
                  field
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export default function RagIngestionAndChunkingViz() {
  const labels = SCENES.map((scene) => `${scene.short}: ${scene.title}`);
  const notes = SCENES.map((scene) => scene.note);
  const controls = useAnimatedScenes(SCENES.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? SCENES.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow="검색 단위 · 설명용 갱신 한 건"
      title="policy-v17이 추적 가능한 chunk가 되어 index-v42에 반영됩니다"
      description="단계 이름을 먼저 외우지 않고, 같은 원문에서 어떤 artifact와 필드가 새로 생기는지 따라갑니다."
      note="policy-v17·ID·개수는 설명용 가정입니다. 아래 Anthropic 수치만 해당 공식 실험 결과입니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="rag-ingestion-flow"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="flex min-h-full min-w-0 flex-col border-y border-border/70 bg-background px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-5 sm:py-3 lg:px-6 lg:py-5"
      >
        <div data-viz-live-only>
          <StageRail active={active} />
          <p className="mt-3 text-[10px] font-black uppercase tracking-[.16em] text-primary">
            장면 · {String(active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 min-h-10 break-keep text-base font-bold leading-5 sm:text-lg sm:leading-7">
            {SCENES[active].title}
          </h3>
          <SceneBody active={active} />
          <p className="mt-3 min-h-10 border-l border-primary/50 pl-3 text-[11px] leading-5 text-muted-foreground sm:pl-4 sm:text-xs lg:text-sm lg:leading-6">
            {SCENES[active].note}
          </p>
        </div>
        <AnimatedSceneControls
          {...controls}
          active={active}
          labels={labels}
          controlLabels={SCENES.map((scene) => scene.short)}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-3 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-mobile-controls]]:hidden lg:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
