import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type ProductScene = {
  owner: string;
  title: string;
  detail: string;
  receipt: string;
  storage: string;
  retrieval: string;
  values: readonly [string, string, string, string, string, string, string];
};

const PRODUCT_LABELS = [
  "요청",
  "데이터",
  "검증",
  "sealing",
  "indexing",
  "저장 완료",
  "가져오기",
] as const;

const PRODUCT_COLUMNS = [
  ["product 요청", "deal ULID"],
  ["data source", "8 MiB"],
  ["입력 검증", "piece P"],
  ["보관 위치", "sector 42"],
  ["검색 준비", "index"],
  ["product 상태", "complete"],
  ["전달 결과", "CID Q"],
] as const;

const PRODUCT_SCENES: readonly ProductScene[] = [
  {
    owner: "client + market service",
    title: "하나의 deal ULID로 ddo_v1과 retrieval_v1을 요청합니다",
    detail:
      "입구에서 accepted가 됐다는 뜻입니다. 데이터 검증, sector 활성화, indexing은 아직 끝나지 않았습니다.",
    receipt: "deal ULID · requested products",
    storage: "accepted",
    retrieval: "요청 전",
    values: ["accepted", "대기", "대기", "대기", "대기", "미완료", "요청 전"],
  },
  {
    owner: "data source + market service",
    title: "Provider pull 또는 upload finalize 뒤에 데이터 처리를 시작합니다",
    detail:
      "Upload 경로는 byte 전송만으로 끝나지 않습니다. finalize 뒤 pipeline이 processing으로 넘어가야 합니다.",
    receipt: "source digest · finalized upload",
    storage: "uploading → processing",
    retrieval: "요청 전",
    values: ["accepted", "finalized", "대기", "대기", "대기", "미완료", "요청 전"],
  },
  {
    owner: "market service + contract view",
    title: "실제 데이터의 piece와 선택적 contract 조건을 따로 확인합니다",
    detail:
      "Piece commitment와 크기는 데이터에서 다시 계산합니다. verifyDeal=true는 payment나 notification 성공까지 보장하지 않습니다.",
    receipt: "piece P · optional contract check",
    storage: "inputs verified",
    retrieval: "요청 전",
    values: ["accepted", "finalized", "P 일치", "대기", "대기", "미완료", "요청 전"],
  },
  {
    owner: "sealing pipeline + actor state",
    title: "ddo_v1이 sector 42의 sealing과 활성화를 진행합니다",
    detail:
      "Piece P가 CommD와 CommR, precommit·provecommit을 거쳐 actor의 활성 sector에 연결됩니다.",
    receipt: "sector 42 · active",
    storage: "sealing",
    retrieval: "요청 전",
    values: ["accepted", "finalized", "P 일치", "42 active", "대기", "미완료", "요청 전"],
  },
  {
    owner: "retrieval_v1 product",
    title: "요청한 설정에 따라 index와 announcement를 준비합니다",
    detail:
      "Sector가 active여도 검색용 index와 endpoint 준비가 자동으로 끝나는 것은 아닙니다.",
    receipt: "index state · announce policy",
    storage: "indexing",
    retrieval: "검색 준비 중",
    values: ["accepted", "finalized", "P 일치", "42 active", "준비됨", "미완료", "후보 준비"],
  },
  {
    owner: "market service",
    title: "요청한 product가 모두 terminal complete일 때 저장 요청을 완료합니다",
    detail:
      "이 complete는 이번 product pipeline의 끝입니다. 앞으로 모든 retrieval이 성공한다는 보증은 아닙니다.",
    receipt: "terminal product statuses",
    storage: "complete",
    retrieval: "서비스 후보",
    values: ["accepted", "finalized", "P 일치", "42 active", "준비됨", "complete", "후보 준비"],
  },
  {
    owner: "retrieval client + provider",
    title: "나중의 retrieval은 provider 탐색부터 데이터 검증까지 다시 진행합니다",
    detail:
      "Endpoint와 cache·unseal, 전송 경로를 확인하고 받은 데이터가 CID Q와 같은지 마지막에 검증합니다.",
    receipt: "CID Q · verified delivered bytes",
    storage: "complete 유지",
    retrieval: "delivery 완료",
    values: ["accepted", "finalized", "P 일치", "42 active", "준비됨", "complete", "Q 검증됨"],
  },
];

const PRODUCT_NOTES = PRODUCT_SCENES.map(
  (scene, index) =>
    `${index + 1}. ${scene.title} ${scene.detail} 저장 상태는 ${scene.storage}, retrieval 상태는 ${scene.retrieval}입니다.`,
);

function ProductCells({ scene, active }: { scene: ProductScene; active: number }) {
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
      {PRODUCT_COLUMNS.map(([title, id], index) => {
        const reached = index <= active;
        const current = index === active;
        return (
          <div
            key={title}
            className={`relative min-w-0 border bg-background p-2 sm:p-3 ${
              current
                ? "border-primary"
                : reached
                  ? "border-foreground/35"
                  : "border-border"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute -left-1 top-5 size-2 ${reached ? "bg-primary" : "bg-border"}`}
            />
            <p className="break-keep text-[8px] font-bold leading-4 text-muted-foreground sm:text-[9px]">
              {title}
            </p>
            <p className="mt-2 hidden break-keep font-mono text-[10px] font-black leading-5 [overflow-wrap:normal] sm:block">
              {id}
            </p>
            <p
              className={`mt-2 break-keep text-[10px] font-bold leading-4 [overflow-wrap:normal] sm:mt-4 sm:text-xs ${
                current ? "text-primary" : "text-foreground"
              }`}
            >
              {scene.values[index]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function ModernDealDeliveryViz() {
  const scenes = useAnimatedScenes(PRODUCT_SCENES.length, 7600, { loop: false });
  const scene = PRODUCT_SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="예제 · ddo_v1 + retrieval_v1"
      title="저장 완료와 전달 완료는 서로 다릅니다"
      description="같은 콘텐츠라도 저장 pipeline과 나중의 retrieval은 별도 상태입니다."
      note="Curio Market 2.0 예제입니다. Legacy built-in market deal이나 PDP처럼 다른 product는 단계와 chain 효과가 다를 수 있습니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Filecoin product 저장과 retrieval 완료 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)_12rem]">
            <div className="bg-background p-3">
              <p className="text-[9px] font-bold text-muted-foreground">현재 상태를 쓰는 주체</p>
              <p className="mt-2 break-keep text-xs font-black text-primary">{scene.owner}</p>
            </div>
            <div className="order-first col-span-2 bg-background p-3 sm:order-none sm:col-span-1 sm:p-4">
              <h4 className="break-keep text-sm font-black leading-6 sm:text-base">{scene.title}</h4>
              <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
            </div>
            <div className="bg-background p-3">
              <p className="text-[9px] font-bold text-muted-foreground">이 단계의 확인 기록</p>
              <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5">{scene.receipt}</p>
            </div>
          </div>

          <ProductCells scene={scene} active={scenes.active} />

          <div className="grid grid-cols-2 gap-2">
            <div className="border border-sky-500/60 bg-background p-3">
              <p className="text-[9px] font-bold text-muted-foreground">저장 product 상태</p>
              <p className="mt-2 break-keep text-xs font-black text-sky-700 dark:text-sky-300">{scene.storage}</p>
            </div>
            <div className="border border-emerald-500/60 bg-background p-3">
              <p className="text-[9px] font-bold text-muted-foreground">retrieval 요청 상태</p>
              <p className="mt-2 break-keep text-xs font-black text-emerald-700 dark:text-emerald-300">{scene.retrieval}</p>
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={PRODUCT_LABELS}
            controlLabels={PRODUCT_LABELS}
            playLabel="저장과 retrieval 경로 재생"
          />
        </div>
        <StaticSceneList labels={PRODUCT_LABELS} notes={PRODUCT_NOTES} />
      </div>
    </VizFrame>
  );
}

const COMPLETION_LABELS = ["요청 승인", "데이터 검증", "sector 활성화", "index 완료"] as const;
const COMPLETION_NAMES = ["요청 승인", "piece 일치", "sector 활성화", "index 완료"] as const;
const COMPLETION_SCENES = [
  {
    title: "Market service가 요청한 product와 data source를 승인했습니다",
    detail: "입구를 통과한 상태입니다. 실제 데이터, sector, index는 아직 확인하지 않았습니다.",
    bits: [1, 0, 0, 0],
  },
  {
    title: "받은 데이터의 piece commitment와 크기가 요청과 일치합니다",
    detail: "입력 검증은 끝났지만 ddo_v1의 sector 활성화와 indexing은 남아 있습니다.",
    bits: [1, 1, 0, 0],
  },
  {
    title: "Sector 42가 활성화됐지만 요청한 indexing은 아직 진행 중입니다",
    detail: "보관은 증명됐지만 retrieval_v1의 설정까지 끝나야 이 예제의 product 묶음이 완료됩니다.",
    bits: [1, 1, 1, 0],
  },
  {
    title: "요청한 indexing까지 complete여서 네 조건이 모두 1입니다",
    detail: "저장 요청은 완료됐습니다. 나중의 retrieval delivery는 별도 요청으로 다시 확인합니다.",
    bits: [1, 1, 1, 1],
  },
] as const;
const COMPLETION_NOTES = COMPLETION_SCENES.map(
  (scene, index) => `${index + 1}. ${scene.title} ${scene.detail}`,
);

export function ProductCompletionViz() {
  const scenes = useAnimatedScenes(COMPLETION_SCENES.length, 6800, { loop: false });
  const scene = COMPLETION_SCENES[scenes.active];
  const complete = scene.bits.every((bit) => bit === 1);

  return (
    <VizFrame
      eyebrow="Product 완료 조건"
      title="네 조건이 모두 1이어야 저장이 끝납니다"
      description="요청 승인과 terminal complete를 구별합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Market 2.0 product 완료 조건 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-sm font-black leading-6">{scene.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {COMPLETION_NAMES.map((name, index) => (
              <div
                key={name}
                className={`border p-3 ${
                  scene.bits[index]
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                <p className="break-keep text-[10px] font-bold text-muted-foreground">{name}</p>
                <p
                  className={`mt-3 font-mono text-2xl font-black ${
                    scene.bits[index] ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {scene.bits[index]}
                </p>
              </div>
            ))}
          </div>
          <div
            className={`grid gap-2 border p-4 sm:grid-cols-[minmax(0,1fr)_8rem] sm:items-center ${
              complete ? "border-primary" : "border-foreground/30"
            }`}
          >
            <p className="font-mono text-xs font-black">
              1 ∧ 1 ∧ 1 ∧ {scene.bits[3]} = {complete ? 1 : 0}
            </p>
            <p
              className={`text-right text-sm font-black ${
                complete ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {complete ? "저장 요청 완료" : "아직 미완료"}
            </p>
          </div>
          <AnimatedSceneControls
            {...scenes}
            labels={COMPLETION_LABELS}
            playLabel="조건 변화 재생"
          />
        </div>
        <StaticSceneList labels={COMPLETION_LABELS} notes={COMPLETION_NOTES} />
      </div>
    </VizFrame>
  );
}

const ACTIVATION_LABELS = ["승인", "검증", "배치", "증명", "활성화"] as const;
const ACTIVATION_STEPS = [
  {
    title: "ddo_v1이 provider와 duration, data source 조건을 통과합니다",
    detail: "Product admission은 sealing을 시작할 자격을 확인하는 단계입니다.",
  },
  {
    title: "Piece P와 선택적 external contract 조건을 따로 확인합니다",
    detail: "Contract가 있으면 allowlist와 verifyDeal을 확인하지만 payment 성공으로 확대하지 않습니다.",
  },
  {
    title: "Piece P가 sector 42의 데이터 배치에 들어갑니다",
    detail: "CommD는 데이터 배치를, CommR은 복제본을 가리킵니다.",
  },
  {
    title: "PreCommit과 ProveCommit 경로가 sector 증명을 확인합니다",
    detail: "메시지 제출과 현재 채택된 chain에서 확인된 상태를 구별합니다.",
  },
  {
    title: "Actor 상태가 sector 42를 active로 기록합니다",
    detail: "NV29 경로에서는 새 allocation ID가 0이며 DataCap이 QAP를 결정하지 않습니다.",
  },
] as const;
const ACTIVATION_NODES = [
  "ddo_v1",
  "piece P · contract",
  "sector 42 · CommD/CommR",
  "precommit · provecommit",
  "actor state · active",
] as const;
const ACTIVATION_NOTES = ACTIVATION_STEPS.map(
  (step, index) => `${index + 1}. ${step.title} ${step.detail}`,
);

export function SectorActivationViz() {
  const scenes = useAnimatedScenes(ACTIVATION_STEPS.length, 7200, { loop: false });
  const step = ACTIVATION_STEPS[scenes.active];

  return (
    <VizFrame
      eyebrow="ddo_v1 → sector 42"
      title="승인과 sector 활성화는 서로 다릅니다"
      description="같은 piece P와 sector 42를 따라 검증, 증명, actor 상태를 확인합니다."
      note="NV29 이후 경로와 legacy allocation이 있는 기록을 섞지 않습니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="ddo_v1이 sector 42에서 활성화되는 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-sm font-black leading-6">{step.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{step.detail}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {ACTIVATION_NODES.map((node, index) => (
              <div
                key={node}
                className={`relative min-w-0 border bg-background p-3 sm:min-h-28 ${
                  index === scenes.active
                    ? "border-primary"
                    : index < scenes.active
                      ? "border-foreground/35"
                      : "border-border"
                }`}
              >
                <p className="text-[9px] font-bold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 break-keep font-mono text-[10px] font-black leading-5">{node}</p>
                <p
                  className={`mt-3 text-[9px] font-bold ${
                    index <= scenes.active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {index < scenes.active ? "확인됨" : index === scenes.active ? "현재 단계" : "대기"}
                </p>
              </div>
            ))}
          </div>
          <AnimatedSceneControls
            {...scenes}
            labels={ACTIVATION_LABELS}
            playLabel="sector 경로 재생"
          />
        </div>
        <StaticSceneList labels={ACTIVATION_LABELS} notes={ACTIVATION_NOTES} />
      </div>
    </VizFrame>
  );
}

const RETRIEVAL_LABELS = ["요청", "탐색", "상태 확인", "전송", "검증"] as const;
const RETRIEVAL_SCENES = [
  {
    title: "Client가 CID Q의 8 MiB를 요청합니다",
    detail: "저장 product의 deal ULID가 아니라 되돌려 받을 콘텐츠 Q가 출발점입니다.",
    state: "요청 생성",
    evidence: "CID Q · range",
  },
  {
    title: "콘텐츠 라우팅에서 Q를 제공한다고 알린 후보를 찾습니다",
    detail: "검색 결과는 후보 목록일 뿐, 지금 데이터를 보낼 수 있다는 보장은 아닙니다.",
    state: "provider S 발견",
    evidence: "광고 시각 · 전송 방식",
  },
  {
    title: "Provider S의 cache·unseal과 정책을 확인합니다",
    detail: "Endpoint, 범위 요청, 인증, 가격과 실제 데이터 준비 상태를 확인합니다.",
    state: "전송 조건 확인",
    evidence: "cache/unseal · policy",
  },
  {
    title: "지원하는 전송 방식으로 8 MiB를 받습니다",
    detail: "HTTP, Graphsync, Bitswap 가운데 S가 실제로 지원하는 경로를 사용합니다.",
    state: "8 MiB 수신",
    evidence: "TTFB · 받은 byte 수",
  },
  {
    title: "받은 데이터가 CID Q와 일치하는지 검증합니다",
    detail: "전송 완료 응답만 믿지 않고 콘텐츠 식별자를 다시 계산합니다.",
    state: "delivery 완료",
    evidence: "CID Q · 8 MiB 일치",
  },
] as const;
const RETRIEVAL_NODES = ["CID Q", "provider 후보", "provider S", "8 MiB", "CID 검증"] as const;
const RETRIEVAL_NOTES = RETRIEVAL_SCENES.map(
  (step, index) =>
    `${index + 1}. ${step.title} ${step.detail} 확인 기록은 ${step.evidence}입니다.`,
);

export function RetrievalDeliveryViz() {
  const scenes = useAnimatedScenes(RETRIEVAL_SCENES.length, 7200, { loop: false });
  const step = RETRIEVAL_SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="CID Q · 8 MiB"
      title="저장 완료와 실제 전달은 서로 다릅니다"
      description="검색, 현재 가용성, 전송, 데이터 검증을 한 요청에서 추적합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="CID Q retrieval 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-px bg-border p-px sm:grid-cols-[minmax(0,1fr)_11rem]">
            <div className="bg-background p-3 sm:p-4">
              <h4 className="break-keep text-sm font-black leading-6">{step.title}</h4>
              <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{step.detail}</p>
            </div>
            <div className="bg-background p-3 sm:p-4">
              <p className="text-[9px] font-bold text-muted-foreground">현재 확인 기록</p>
              <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5">{step.evidence}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {RETRIEVAL_NODES.map((node, index) => (
              <div
                key={node}
                className={`border bg-background p-3 ${
                  index === scenes.active
                    ? "border-primary"
                    : index < scenes.active
                      ? "border-foreground/35"
                      : "border-border"
                }`}
              >
                <p className="break-keep font-mono text-[10px] font-black leading-5">{node}</p>
                <p
                  className={`mt-3 text-[9px] font-bold ${
                    index <= scenes.active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {index <= scenes.active ? "확인됨" : "대기"}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-foreground/35 bg-background p-3">
              <p className="text-[9px] font-bold text-muted-foreground">저장 product 상태</p>
              <p className="mt-2 text-xs font-black">complete 유지</p>
            </div>
            <div className="border border-primary bg-primary/5 p-3">
              <p className="text-[9px] font-bold text-muted-foreground">현재 retrieval 상태</p>
              <p className="mt-2 text-xs font-black text-primary">{step.state}</p>
            </div>
          </div>
          <p className="border-l-2 border-foreground/30 pl-3 text-[10px] leading-5 text-muted-foreground">
            Endpoint 중단, 오래된 검색 결과, unseal 지연이 있으면 retrieval만 실패할 수 있습니다.
          </p>
          <AnimatedSceneControls
            {...scenes}
            labels={RETRIEVAL_LABELS}
            playLabel="retrieval 경로 재생"
          />
        </div>
        <StaticSceneList labels={RETRIEVAL_LABELS} notes={RETRIEVAL_NOTES} />
      </div>
    </VizFrame>
  );
}

const MIGRATION_LABELS = ["버전 고정", "재현", "대조", "장애 주입", "판단"] as const;
const MIGRATION_SCENES = [
  {
    title: "Legacy snapshot과 새 Curio·Boost 구성을 각각 고정합니다",
    detail: "Source SHA, schema, Lotus API, actor/network version, enabled products와 retrieval 경로를 기록합니다.",
    source: "legacy read-only",
    candidate: "버전 고정",
    action: "쓰기 전환 금지",
  },
  {
    title: "같은 8 MiB와 product 요청을 candidate에서 재현합니다",
    detail: "Piece P, sector 42, index 결과처럼 두 경로에서 비교할 수 있는 식별자를 유지합니다.",
    source: "기존 기록 보존",
    candidate: "동일 입력 실행",
    action: "receipt 수집",
  },
  {
    title: "Product별 terminal status와 외부 효과를 대조합니다",
    detail: "Accepted 같은 이름이 아니라 piece, sector activation, index, delivered bytes를 비교합니다.",
    source: "기존 receipt",
    candidate: "새 receipt",
    action: "차이 기록",
  },
  {
    title: "Crash, finalize 누락, corrupted upload와 unseal 지연을 주입합니다",
    detail: "NV29 새 경로에서는 allocation 효과가 생기지 않는지도 확인합니다.",
    source: "재현 기준",
    candidate: "복구 경로 실행",
    action: "중복 효과 확인",
  },
  {
    title: "현재 상태를 조회한 뒤 전환하거나 이전 구성으로 돌아갑니다",
    detail: "이미 받은 데이터와 제출된 외부 효과를 먼저 확인하고, 확인하지 못한 단계만 다시 수행합니다.",
    source: "조회 가능",
    candidate: "통과 또는 중지",
    action: "전환 판단",
  },
] as const;
const MIGRATION_NOTES = MIGRATION_SCENES.map(
  (step, index) => `${index + 1}. ${step.title} ${step.detail}`,
);

export function MigrationRecoveryViz() {
  const scenes = useAnimatedScenes(MIGRATION_SCENES.length, 7600, { loop: false });
  const step = MIGRATION_SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Legacy → current profile"
      title="같은 입력에서 나온 확인 기록을 대조합니다"
      description="이전 경로를 보존하고 새 경로의 상태와 외부 효과를 단계별로 확인합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Lotus market 버전 전환과 복구 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div className="border border-border bg-background p-4">
            <h4 className="break-keep text-sm font-black leading-6">{step.title}</h4>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{step.detail}</p>
          </div>
          <div className="grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["기존 경로", step.source],
              ["새 경로", step.candidate],
              ["다음 행동", step.action],
            ].map(([label, value]) => (
              <div key={label} className="bg-background p-4">
                <p className="text-[9px] font-bold text-muted-foreground">{label}</p>
                <p className="mt-3 break-keep font-mono text-xs font-black text-primary">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {MIGRATION_LABELS.map((label, index) => (
              <div
                key={label}
                className={`border px-1 py-2 text-center text-[9px] font-black ${
                  index === scenes.active
                    ? "border-primary bg-primary/5"
                    : index < scenes.active
                      ? "border-foreground/35 bg-background"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                {index + 1}. {label}
              </div>
            ))}
          </div>
          <AnimatedSceneControls
            {...scenes}
            labels={MIGRATION_LABELS}
            playLabel="전환 검증 재생"
          />
        </div>
        <StaticSceneList labels={MIGRATION_LABELS} notes={MIGRATION_NOTES} />
      </div>
    </VizFrame>
  );
}
