import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "CID 생성",
  "후보 탐색",
  "block 수신",
  "byte 검증",
  "piece 연결",
  "보관 증명",
  "retrieval 확인",
] as const;

const SCENES = [
  {
    title: "Alice의 10 MiB 파일을 UnixFS DAG로 나누고 root CID를 만듭니다",
    detail:
      "Root CID는 파일 이름이나 서버 주소가 아니라 DAG의 codec과 block hash를 포함한 content identity입니다. Importer·chunker가 달라지면 같은 원본 파일도 다른 DAG와 root CID가 될 수 있습니다.",
    object: "원본 bytes → DAG blocks",
    evidence: "root CID · block CIDs",
    question: "어디서 받을 수 있나?",
    claim: "내용의 정체만 고정",
  },
  {
    title: "Routing이 이 CID를 제공한다고 광고한 peer 후보를 돌려줍니다",
    detail:
      "Delegated routing이나 DHT의 provider record는 연결을 시도할 후보입니다. 광고가 있다는 사실만으로 그 peer가 지금 block을 가지고 있거나 빠르게 줄 수 있다고 결론내리면 안 됩니다.",
    object: "root/block CID query",
    evidence: "peer ID · multiaddr · protocol",
    question: "후보가 실제 byte를 주나?",
    claim: "전송 후보만 발견",
  },
  {
    title: "Bitswap이 필요한 block을 요청하고 payload를 받습니다",
    detail:
      "Client는 Have 또는 Block 요청을 보내고 peer는 Have·DontHave나 block payload로 답할 수 있습니다. Have 응답은 전송 성공이 아니며, 받은 payload도 아직 요청한 content인지 검증해야 합니다.",
    object: "wantlist · Have · Block",
    evidence: "peer별 transfer receipt",
    question: "받은 byte가 맞나?",
    claim: "전송 사실만 관측",
  },
  {
    title: "각 block의 CID를 다시 계산한 뒤에만 retrieval 성공으로 기록합니다",
    detail:
      "Block bytes에 CID가 지정한 multihash를 적용해 요청한 CID와 비교합니다. Gateway가 HTTP 200을 주거나 peer가 Block 메시지를 보냈다는 사실은 이 무결성 검사를 대신하지 못합니다.",
    object: "received block bytes",
    evidence: "CID(bytes) = requested CID",
    question: "장기 보관은 누가 약속하나?",
    claim: "현재 byte 무결성 확인",
  },
  {
    title:
      "같은 content를 CAR와 Filecoin piece로 포장해 identity map을 남깁니다",
    detail:
      "Root CID, CAR digest, PieceCID와 deal ID는 서로 다른 값입니다. Chunker·CAR 순서·padding·piece size와 도구 버전을 함께 기록해야 IPFS content와 Filecoin storage artifact를 다시 연결할 수 있습니다.",
    object: "DAG → CAR → piece",
    evidence: "root CID · CAR · PieceCID map",
    question: "보관 약속이 실제로 진행됐나?",
    claim: "두 체계의 ID를 연결",
  },
  {
    title: "Deal lifecycle과 PoRep·PoSt가 보관 증거를 만듭니다",
    detail:
      "Deal activation은 storage lifecycle의 한 단계이고 PoRep·PoSt는 protocol이 요구한 보관 증거입니다. 이 증거는 특정 gateway의 지연이나 사용자가 지금 파일을 내려받을 수 있는지까지 보장하지 않습니다.",
    object: "piece · deal · replica",
    evidence: "activation · PoRep · PoSt",
    question: "사용자가 지금 받을 수 있나?",
    claim: "보관 증거를 확인",
  },
  {
    title: "마지막으로 cold path에서 실제 파일을 받고 CID를 다시 확인합니다",
    detail:
      "Local cache를 비운 뒤 정한 조건에서 retrieval하고 route, first-byte, transfer, verify 시간을 따로 봅니다. Storage proof가 있어도 이 retrieval은 별도로 실패할 수 있습니다.",
    object: "cold retrieval sample",
    evidence: "verified bytes · 단계별 latency",
    question: "어느 단계가 실패했나?",
    claim: "현재 verified retrieval 확인",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 이 단계의 결론은 ${scene.claim}입니다.`,
);

function PathNode({
  step,
  active,
  title,
  detail,
}: {
  step: number;
  active: number;
  title: string;
  detail: string;
}) {
  const current = active === step;
  const complete = active > step;
  return (
    <div
      className={`min-w-0 border p-2.5 motion-safe:transition-colors motion-safe:duration-300 sm:p-3 ${
        current
          ? "border-primary bg-primary/10"
          : complete
            ? "border-foreground/30 bg-background"
            : "border-border bg-background text-muted-foreground"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`grid size-5 shrink-0 place-items-center border font-mono text-[9px] font-black ${
            current
              ? "border-primary bg-primary text-primary-foreground"
              : complete
                ? "border-foreground/40"
                : "border-border"
          }`}
        >
          {complete ? "✓" : step + 1}
        </span>
        <p className="break-keep text-[10px] font-black leading-4 sm:text-xs">
          {title}
        </p>
      </div>
      <p className="mt-2 hidden break-keep font-mono text-[9px] leading-4 opacity-80 sm:block">
        {detail}
      </p>
    </div>
  );
}

function DownArrow({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`grid h-5 place-items-center text-xs motion-safe:transition-colors motion-safe:duration-300 ${
        active ? "text-primary" : "text-muted-foreground/50"
      }`}
    >
      ↓
    </div>
  );
}

export function IpfsFilecoinBoundaryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8400, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Alice의 10 MiB 파일 한 건 · 같은 content, 다른 증거"
      title="한 파일이 IPFS retrieval과 Filecoin 보관이라는 두 경로로 갈라집니다"
      description="CID를 공통 출발점으로 삼되, 현재 byte를 받았다는 증거와 장기 보관 증거를 서로 다른 경로에서 확인합니다."
      note="10 MiB와 경로별 시간은 설명용 예시입니다. 실제 chunker, CAR, piece, deal과 retrieval 조건은 사용한 버전과 network에 따라 달라집니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="IPFS와 Filecoin 한 파일 증거 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="space-y-4"
          >
            <div className="hidden grid-cols-7 gap-1.5 sm:grid">
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

            <div className="border border-border bg-muted/10 p-3 sm:p-4">
              <div className="mx-auto max-w-sm">
                <PathNode
                  step={0}
                  active={scenes.active}
                  title="원본 파일 → UnixFS DAG"
                  detail="10 MiB bytes · root CID · block CIDs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 sm:gap-4 lg:gap-8">
                <div className="min-w-0">
                  <p className="mb-2 text-center text-[9px] font-black text-primary">
                    IPFS · 지금 byte를 찾고 검증하는 경로
                  </p>
                  <DownArrow active={scenes.active >= 1} />
                  <PathNode
                    step={1}
                    active={scenes.active}
                    title="Provider 후보 탐색"
                    detail="DHT·Delegated Routing → peer·protocol"
                  />
                  <DownArrow active={scenes.active >= 2} />
                  <PathNode
                    step={2}
                    active={scenes.active}
                    title="Bitswap block 수신"
                    detail="Wantlist → Have·DontHave·Block"
                  />
                  <DownArrow active={scenes.active >= 3} />
                  <PathNode
                    step={3}
                    active={scenes.active}
                    title="CID 재계산"
                    detail="hash(received bytes) = requested CID"
                  />
                </div>

                <div className="min-w-0">
                  <p className="mb-2 text-center text-[9px] font-black text-primary">
                    Filecoin · 보관 약속과 증거를 잇는 경로
                  </p>
                  <DownArrow active={scenes.active >= 4} />
                  <PathNode
                    step={4}
                    active={scenes.active}
                    title="CAR → PieceCID 연결"
                    detail="CAR order·padding·piece profile"
                  />
                  <DownArrow active={scenes.active >= 5} />
                  <PathNode
                    step={5}
                    active={scenes.active}
                    title="Deal과 storage proof"
                    detail="activation · replica · PoRep·PoSt"
                  />
                  <DownArrow active={scenes.active >= 6} />
                  <PathNode
                    step={6}
                    active={scenes.active}
                    title="Cold retrieval 재확인"
                    detail="route · first-byte · transfer · verify"
                  />
                </div>
              </div>

              <div
                className={`mt-4 grid gap-px border p-px text-center text-[9px] font-black leading-5 motion-safe:transition-colors motion-safe:duration-300 sm:grid-cols-2 ${
                  scenes.active === 6
                    ? "border-primary bg-primary"
                    : "border-border bg-border"
                }`}
              >
                <p className="bg-background p-2">
                  storage evidence ⇏ 현재 retrieval
                </p>
                <p className="bg-background p-2">
                  현재 retrieval ⇏ 장기 storage evidence
                </p>
              </div>
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-[minmax(0,1.45fr)_minmax(10rem,0.55fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 답할 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.title}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.detail}
                </p>
                <p className="mt-3 border-l-2 border-primary pl-3 font-mono text-[10px] font-black leading-5 sm:hidden">
                  {scene.claim}
                </p>
              </div>
              <div className="hidden min-w-0 bg-background p-4 sm:block sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계에서 말할 수 있는 것
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.claim}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  다음 질문 · {scene.question}
                </p>
              </div>
            </div>

            <div className="hidden grid-cols-3 gap-2 sm:grid">
              {[
                ["현재 대상", scene.object],
                ["남은 증거", scene.evidence],
                ["꼬리 질문", scene.question],
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
                  <p className="mt-2 break-keep font-mono text-[9px] font-black leading-4 sm:text-xs sm:leading-5">
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
            playLabel="한 파일의 content·storage·retrieval 증거 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
