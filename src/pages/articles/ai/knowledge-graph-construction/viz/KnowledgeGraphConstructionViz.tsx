import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["원문", "추출", "정규화", "식별", "검증", "기록"] as const;

const NOTES = [
  "d-17·d-22·d-31 세 문서를 source_id와 함께 받습니다. 아직 graph에는 아무것도 쓰지 않습니다.",
  "세 문서에서 mention 7개와 raw relation 4개를 뽑습니다. ‘민준 김’·‘M. Kim’·‘그 사용자’는 아직 서로 다른 mention입니다.",
  "자유로운 관계 표현을 usesAccount·reported·occursIn·memberOf 네 relation type으로 맞춥니다. 원문 표현과 source_id는 버리지 않습니다.",
  "Person mention 세 개만 후보 쌍으로 비교해 같은 사람이라고 판정한 뒤 canonical entity U-42 하나로 묶습니다. 다른 유형은 비교하지 않습니다.",
  "Subject·object 유형, 필수 source_id와 중복 edge key를 검사합니다. 검사를 통과하기 전에는 공개 graph version을 바꾸지 않습니다.",
  "검증된 node 5개·edge 4개를 kg-v43에 한 번 반영하고 alias·source_id·extractor version을 남깁니다. 같은 입력이 다시 와도 edge가 늘지 않습니다.",
] as const;

const MOBILE_NOTES = [
  "세 원문을 받았고 공개 graph는 아직 kg-v42입니다.",
  "원문 위치를 유지한 mention 7개와 relation 4개를 뽑았습니다.",
  "관계 이름 네 개를 맞추고 원문 표현은 보존했습니다.",
  "Person mention 세 개를 근거에 따라 U-42로 묶었습니다.",
  "유형·source_id·edge_key 검사를 모두 통과했습니다.",
  "검증된 node 5개와 edge 4개를 kg-v43에 기록했습니다.",
] as const;

const SOURCE_DOCS = [
  { id: "d-17", text: "민준 김은 계정 A-17을 사용한다." },
  { id: "d-22", text: "M. Kim은 모바일 앱에서 오류 E401을 보고했다." },
  { id: "d-31", text: "그 사용자는 tenant-a에 속한다." },
] as const;

const RAW_MENTIONS = [
  "m-01 민준 김",
  "m-02 A-17",
  "m-03 M. Kim",
  "m-04 모바일 앱",
  "m-05 E401",
  "m-06 그 사용자",
  "m-07 tenant-a",
] as const;

function SourceLane({ active }: { active: number }) {
  return (
    <section
      aria-label="원문 세 건"
      className={`${active >= 3 ? "hidden lg:block" : ""} border-y border-border py-3`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        원문 3건
      </p>
      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px lg:hidden">
        {SOURCE_DOCS.map((doc, index) => (
          <div key={doc.id} className="min-w-0 bg-background px-2 py-2">
            <p className="font-mono text-[9px] font-bold text-primary">{doc.id}</p>
            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
              mention {index === 0 ? "2개" : index === 1 ? "3개" : "2개"}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 hidden space-y-3 lg:block">
        {SOURCE_DOCS.map((doc, index) => (
          <div
            key={doc.id}
            className={`grid grid-cols-[3.2rem_minmax(0,1fr)] gap-3 border-l-2 pl-3 transition-colors ${
              active <= 2 ? "border-primary" : "border-border"
            }`}
          >
            <span className="font-mono text-[10px] font-bold text-primary">
              {doc.id}
            </span>
            <p className="break-keep text-xs leading-5 text-foreground">
              {doc.text}
            </p>
            {active >= 1 ? (
              <p className="col-start-2 text-[10px] leading-4 text-muted-foreground">
                mention {index === 0 ? "m-01·m-02" : index === 1 ? "m-03·m-04·m-05" : "m-06·m-07"}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function StageRail({ active }: { active: number }) {
  return (
    <ol aria-label="구축 단계" className="hidden border-y border-border lg:block">
      {LABELS.map((label, index) => (
        <li
          key={label}
          className={`grid min-h-11 grid-cols-[2rem_minmax(0,1fr)] items-center gap-2 border-b border-border px-2 py-2 last:border-b-0 ${
            active === index ? "bg-primary/10 text-foreground" : "text-muted-foreground"
          }`}
        >
          <span className="font-mono text-[9px] font-bold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-xs font-bold">{label}</span>
        </li>
      ))}
    </ol>
  );
}

function MiniGraph() {
  return (
    <svg
      viewBox="0 0 430 310"
      className="mx-auto h-auto max-h-32 w-full sm:max-h-52 lg:max-h-none"
      role="img"
      aria-label="U-42와 계정, 오류, 앱, tenant를 잇는 node 5개와 edge 4개"
    >
      <defs>
        <marker id="kg-construction-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" className="fill-primary" />
        </marker>
      </defs>
      <g className="stroke-primary" strokeWidth="1.2" fill="none" markerEnd="url(#kg-construction-arrow)">
        <path d="M124 150 H232 V50 H311" />
        <path d="M124 150 H311" />
        <path d="M355 169 V211" />
        <path d="M124 150 H158 V278 H181" />
      </g>
      <g className="fill-muted-foreground text-[11px] font-semibold">
        <text x="214" y="140" textAnchor="middle">reported</text>
        <text x="210" y="40" textAnchor="middle">usesAccount</text>
        <text x="390" y="195" textAnchor="middle">occursIn</text>
        <text x="146" y="226" textAnchor="middle">memberOf</text>
      </g>
      {[
        { x: 80, y: 150, label: "U-42", sub: "Person" },
        { x: 355, y: 50, label: "A-17", sub: "Account" },
        { x: 355, y: 150, label: "E401", sub: "Error" },
        { x: 225, y: 278, label: "tenant-a", sub: "Tenant" },
        { x: 355, y: 230, label: "모바일 앱", sub: "App" },
      ].map((node, index) => (
        <g key={node.label}>
          <rect
            x={node.x - 48}
            y={node.y - 21}
            width="96"
            height="42"
            rx="2"
            className={index === 0 ? "fill-primary/12 stroke-primary" : "fill-background stroke-border"}
            strokeWidth="1.2"
          />
          <text x={node.x} y={node.y - 1} textAnchor="middle" className="fill-foreground text-xs font-bold">
            {node.label}
          </text>
          <text x={node.x} y={node.y + 12} textAnchor="middle" className="fill-muted-foreground text-[10px]">
            {node.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

function OutputLane({ active }: { active: number }) {
  return (
    <section aria-label="현재 구축 상태" className="min-w-0 border-y border-border py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          현재 구축 상태
        </p>
        <span className="font-mono text-[10px] font-bold text-primary">
          {active < 5 ? "staging" : "kg-v43"}
        </span>
      </div>

      <div className="min-h-24 sm:min-h-72">
      {active === 0 ? (
        <div className="flex min-h-24 items-center justify-center border-b border-dashed border-border text-center sm:min-h-72">
          <p className="max-w-56 break-keep text-sm font-bold leading-6 text-muted-foreground">
            입력만 접수했습니다.<br />공개 graph는 아직 바뀌지 않습니다.
          </p>
        </div>
      ) : null}

      {active === 1 ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {RAW_MENTIONS.map((mention) => (
            <span key={mention} className="border border-border px-2 py-2 font-mono text-[10px] leading-4">
              {mention}
            </span>
          ))}
          <p className="col-span-full border-t border-border pt-3 text-xs font-bold text-primary">
            mention 7 · raw relation 4
          </p>
        </div>
      ) : null}

      {active === 2 ? (
        <ol className="mt-4 space-y-2 font-mono text-[10px] leading-5">
          {[
            "m-01 ─usesAccount→ m-02 · d-17",
            "m-03 ─reported→ m-05 · d-22",
            "m-05 ─occursIn→ m-04 · d-22",
            "m-06 ─memberOf→ m-07 · d-31",
          ].map((edge) => (
            <li key={edge} className="border-l-2 border-primary pl-3">{edge}</li>
          ))}
        </ol>
      ) : null}

      {active === 3 ? (
        <div className="mt-4 space-y-5">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
            {["m-01\n민준 김", "m-03\nM. Kim", "m-06\n그 사용자"].map((mention) => (
              <span key={mention} className="whitespace-pre-line border border-primary/40 px-2 py-2 leading-4">
                {mention}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 text-primary" aria-hidden="true">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xl">↓</span>
            <span className="h-px w-10 bg-primary" />
          </div>
          <div className="mx-auto max-w-44 border-2 border-primary bg-primary/10 px-3 py-3 text-center">
            <strong className="font-mono text-sm">U-42</strong>
            <p className="mt-1 text-[10px] text-muted-foreground">alias 3개 · Person</p>
          </div>
          <p className="text-center text-xs text-muted-foreground">node 후보 7 → canonical node 5</p>
        </div>
      ) : null}

      {active === 4 ? (
        <dl className="mt-4 divide-y divide-border border-y border-border text-xs">
          {[
            ["유형", "Person ─reported→ Error", "통과"],
            ["근거", "edge 4개 모두 source_id 보유", "통과"],
            ["중복", "edge_key 4개 모두 고유", "통과"],
            ["격리", "실패 항목은 staging에 유지", "통과"],
          ].map(([label, detail, result]) => (
            <div key={label} className="grid grid-cols-[3.5rem_minmax(0,1fr)_2.5rem] gap-2 py-3">
              <dt className="font-bold">{label}</dt>
              <dd className="break-keep text-muted-foreground">{detail}</dd>
              <dd className="text-right font-bold text-primary">{result}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {active === 5 ? (
        <div className="mt-3">
          <MiniGraph />
          <div className="mt-1 grid grid-cols-3 gap-px bg-border p-px text-center text-[10px] sm:mt-2">
            <span className="bg-background px-2 py-1 sm:py-2"><strong className="mr-1 inline text-xs sm:block sm:text-sm">5</strong>node</span>
            <span className="bg-background px-2 py-1 sm:py-2"><strong className="mr-1 inline text-xs sm:block sm:text-sm">4</strong>edge</span>
            <span className="bg-background px-2 py-1 sm:py-2"><strong className="mr-1 inline text-xs sm:block sm:text-sm">3</strong>source</span>
          </div>
        </div>
      ) : null}
      </div>
    </section>
  );
}

export default function KnowledgeGraphConstructionViz() {
  const scenes = useAnimatedScenes(LABELS.length, 6200, { loop: false });

  return (
    <VizFrame
      eyebrow="그래프 구축 · 설명용 사례"
      title="문서 세 건이 검증 가능한 그래프 버전 하나가 되는 과정"
      description="왼쪽의 source_id를 유지한 채 mention을 뽑고, relation을 정규화하고, 같은 대상을 식별한 뒤 검증을 통과한 결과만 kg-v43에 기록합니다."
      note="d-17·d-22·d-31, U-42, kg-v43과 모든 점수는 메커니즘을 설명하기 위한 가정입니다. 특정 제품의 측정값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="원문에서 Knowledge Graph를 만드는 여섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-bold text-primary">
              {String(scenes.active + 1).padStart(2, "0")} / {String(LABELS.length).padStart(2, "0")}
            </p>
            <h4 className="mt-1 text-lg font-bold">{LABELS[scenes.active]}</h4>
          </div>
          <p className="max-w-md break-keep text-right text-[11px] leading-5 text-muted-foreground">
            공개 상태: {scenes.active < 5 ? "kg-v42 유지" : "kg-v43 전환"}
          </p>
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.1fr)_8rem_minmax(0,1.45fr)] lg:items-stretch">
          <SourceLane active={scenes.active} />
          <StageRail active={scenes.active} />
          <OutputLane active={scenes.active} />
        </div>

        <p className="mt-4 hidden border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:block">
          {NOTES[scenes.active]}
        </p>
        <p className="mt-3 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:hidden">
          {MOBILE_NOTES[scenes.active]}
        </p>

        <StaticSceneList labels={LABELS} notes={NOTES} />
        <AnimatedSceneControls {...scenes} labels={LABELS} playLabel="과정 재생" />
      </div>
    </VizFrame>
  );
}
