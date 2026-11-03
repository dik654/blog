import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "권한 확인",
  "공간 예약",
  "바이트 전송",
  "업로드 접수",
  "위치 색인",
  "검색 확인",
  "장기 보관",
] as const;

const SCENES = [
  {
    question: "Alice가 이 Space에 파일을 올릴 권한이 있을까요?",
    answer:
      "서명, audience, 만료 시점과 위임 사슬을 확인해 space/blob/add 권한이 이 Space DID까지 이어지는지 봅니다.",
    bytes: "로컬 파일",
    capability: "Space DID · blob/add",
    receipt: "invocation 허용",
    later: "저장은 아직 시작 전",
  },
  {
    question: "권한이 있으면 바로 파일을 보내면 될까요?",
    answer:
      "먼저 blob digest와 크기에 맞는 저장 위치를 allocate합니다. 이미 같은 blob이 있다면 새 전송이 필요 없을 수도 있습니다.",
    bytes: "digest d · size n",
    capability: "blob/allocate",
    receipt: "주소 또는 기존 위치",
    later: "실제 bytes는 미확인",
  },
  {
    question: "예약한 위치에는 무엇을 보내야 할까요?",
    answer:
      "HTTP PUT으로 정확히 n bytes를 보냅니다. 성공 응답만 믿지 않고 받은 bytes의 multihash와 크기가 요청과 같은지 확인합니다.",
    bytes: "PUT body → provider",
    capability: "http/put",
    receipt: "전송 완료 신호",
    later: "서비스 accept 대기",
  },
  {
    question: "PUT이 끝나면 업로드 완료일까요?",
    answer:
      "아닙니다. accept task가 allocation과 PUT 결과를 확인하고 location commitment를 남겨야 blob effect chain이 끝납니다.",
    bytes: "digest d 일치",
    capability: "blob/accept",
    receipt: "site commitment",
    later: "DAG 검색은 별도",
  },
  {
    question: "Root CID만으로 원하는 block 위치를 알 수 있을까요?",
    answer:
      "큰 DAG가 여러 shard로 나뉘면 부족합니다. Sharded DAG index가 block digest를 shard digest·offset·length에 연결합니다.",
    bytes: "CAR shards",
    capability: "space/index/add",
    receipt: "root → shard → range",
    later: "실제 retrieval 미확인",
  },
  {
    question: "색인이 있으면 파일을 받을 수 있다는 뜻일까요?",
    answer:
      "아닙니다. 표본 block의 byte range를 실제로 읽고 다시 CID를 계산해 index와 shard가 함께 살아 있는지 확인합니다.",
    bytes: "S[j][offset:offset+length]",
    capability: "retrieval policy",
    receipt: "CID(bytes) = expected",
    later: "현재 검색만 확인",
  },
  {
    question: "이제 Filecoin에 영구 보관됐다고 말해도 될까요?",
    answer:
      "아닙니다. offer, piece aggregation, aggregate acceptance와 deal tracking은 비동기로 이어집니다. 현재 spec의 maturity와 각 receipt를 따로 표시합니다.",
    bytes: "piece → aggregate",
    capability: "filecoin/offer",
    receipt: "단계별 signed receipt",
    later: "permanent 보장 아님",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 현재 확정된 것은 ${scene.receipt}입니다.`,
);

export function StorachaReceiptViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Alice의 파일 한 건 · Space 한 곳 · 같은 blob digest"
      title="업로드 버튼 한 번은 권한 확인부터 Filecoin 추적까지 여러 영수증을 시작합니다"
      description="각 단계가 무엇을 확정하고, 다음 단계에서 다시 무엇을 물어야 하는지 한 요청으로 따라갑니다."
      note="Blob 업로드 성공, DAG 검색 가능, Filecoin deal 상태는 서로 다른 사실입니다. 하나의 receipt로 나머지를 대신하지 않습니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Storacha 업로드 receipt 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[39rem] space-y-4 sm:min-h-[32rem] xl:min-h-[27rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`border px-1 py-2 text-center text-[9px] font-black ${
                    index === scenes.active
                      ? "border-primary bg-primary/10"
                      : index < scenes.active
                        ? "border-foreground/30 bg-background"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(12rem,0.65fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 생기는 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.question}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.answer}
                </p>
              </div>
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계에서 확정된 것
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.receipt}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  아직 남은 질문 · {scene.later}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["실제 bytes", scene.bytes],
                ["권한·작업", scene.capability],
                ["현재 receipt", scene.receipt],
                ["다음 질문", scene.later],
              ].map(([label, value], index) => (
                <article
                  key={label}
                  className={`min-w-0 border bg-background p-3 ${
                    index === 2 ? "border-primary/60" : "border-border"
                  }`}
                >
                  <p className="text-[9px] font-bold text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                    {value}
                  </p>
                </article>
              ))}
            </div>

            <div className="flex gap-1" aria-hidden="true">
              {LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`h-1.5 flex-1 ${
                    index <= scenes.active ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="한 파일의 Storacha receipt 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
