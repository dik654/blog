import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { DATASET_LINEAGE, PERMISSION_RECEIPT } from "../trace";

const SCENES = [
  "원본과 사람을 식별",
  "조작 생성을 기록",
  "유통·전처리를 기록",
  "crop에서 원본까지 재생",
] as const;

const NOTES = [
  "clip-042와 person-C를 group 042-C로 묶고 permission-C-r3을 연결합니다. Permission 내용은 설명용 가정입니다.",
  "swap-042-Z는 clip-042를 사용한 generator-Z@recipe-z7의 출력이라고 기록합니다. 파일 이름만으로 생성 조건을 추정하지 않습니다.",
  "Social codec, frame timestamp, 얼굴 track과 crop revision을 각각 parent-child 관계로 남깁니다.",
  "crop-04-a1에서 parent ID를 거꾸로 따라 social-042-Z.mp4, swap-042-Z, clip-042와 permission-C-r3을 다시 찾습니다.",
] as const;

const STAGES = [
  { title: "Source", detail: "clip-042 · person-C" },
  { title: "Generation", detail: "swap-042-Z · recipe z7" },
  { title: "Distribution", detail: "social codec · frame · crop" },
  { title: "Replay", detail: "crop-04-a1 → source · permission" },
] as const;

export default function ProvenanceChainViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-provenance-chain"
      eyebrow="출처 사슬"
      title="crop-04-a1에서 clip-042와 permission-C-r3까지 돌아갑니다"
      description="고정된 다섯 artifact에서 parent link와 사용 범위 연결이 어느 단계에 추가되는지 따라갑니다."
      note={`${PERMISSION_RECEIPT.revision} · 허용 가정: ${PERMISSION_RECEIPT.allowed} · 포함하지 않은 범위: ${PERMISSION_RECEIPT.notCovered}`}
      scenes={SCENES}
      controlLabels={STAGES.map((stage) => stage.title)}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => {
        const visibleUntil = active === 0 ? 0 : active === 1 ? 1 : 4;
        const replay = active === 3;
        return (
          <div>
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-y border-border py-3">
              <div className="min-w-0">
                <span className="text-[10px] font-black text-primary">사용 범위 revision</span>
                <strong className="mt-1 block break-keep text-sm">{PERMISSION_RECEIPT.revision}</strong>
              </div>
              <span className="max-w-[16rem] break-keep text-right text-[11px] leading-5 text-muted-foreground">{PERMISSION_RECEIPT.allowed}</span>
            </div>
            <ol className="grid grid-cols-5 gap-px bg-border p-px" aria-label="원본에서 crop까지의 파생 artifact">
              {DATASET_LINEAGE.map((item, index) => {
                const reached = index <= visibleUntil;
                const current = replay ? index === DATASET_LINEAGE.length - 1 : index === visibleUntil;
                return (
                  <li key={item.id} aria-current={current ? "step" : undefined} className={`min-w-0 px-3 py-4 ${reached ? "bg-background" : "bg-muted/25 text-muted-foreground"}`}>
                    <span className={`font-mono text-[9px] font-black ${current ? "text-primary" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")}</span>
                    <strong className="mt-1 block break-keep text-[11px] leading-5">{item.type}</strong>
                    <code className="mt-2 block break-all text-[10px] leading-4">{item.id}</code>
                    <span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground">{reached ? item.detail : "parent 미확인"}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-right font-mono text-[10px] text-primary">{replay ? "← parent_id를 따라 원본까지 재생" : "parent_id →"}</p>
          </div>
        );
      }}
    </DeepfakeStageViz>
  );
}
