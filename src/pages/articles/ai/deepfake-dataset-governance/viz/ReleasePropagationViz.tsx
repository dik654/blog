import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { RELEASE_TRACE } from "../trace";

const SCENES = ["자료 release의 근거 확인", "사용 범위 revision 변경", "파생본을 다음 버전에서 제외", "Coverage와 주장 재계산"] as const;

const NOTES = [
  `${RELEASE_TRACE.datasetBefore}은 permission-C-r3과 독립 원본 ${RELEASE_TRACE.supportBefore}개의 근거로 generator-Z·social codec 결과를 공개합니다.`,
  "Permission-C-r4가 person-C를 새 release에 쓰지 않는 상태라고 가정합니다. 이 변경은 적용되는 정책을 표현한 예시이지 보편적인 법률 규칙이 아닙니다.",
  "Group 042-C의 source·조작 영상·재인코딩·frame·crop을 parent chain으로 찾아 dataset-d09 후보에서 제외합니다.",
  `독립 원본 수가 ${RELEASE_TRACE.supportBefore}에서 ${RELEASE_TRACE.supportAfter}로 줄어 설명용 최소값 ${RELEASE_TRACE.minimumSupport}을 밑돕니다. 새 release는 해당 조건의 수치 주장을 제외합니다.`,
] as const;

const STAGES = [
  { title: "Release d08", detail: "permission r3 · support 10" },
  { title: "Revision r4", detail: "새 release 사용 중지" },
  { title: "Lineage", detail: "group 042-C 파생본 제외" },
  { title: "Release d09", detail: "support 9 · 조건 주장 제외" },
] as const;

export default function ReleasePropagationViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-release-propagation"
      eyebrow="변경 전파"
      title="사용 범위 한 건의 변화가 자료 버전과 주장에 닿는 경로"
      description="권한 기록을 바꾼 뒤 파일을 숨기는 데서 멈추지 않고 lineage·coverage·claim receipt를 차례로 갱신합니다."
      note="Permission 상태·최소 support 10·release 행동은 설명용 가정이며 법률 자문이 아닙니다."
      scenes={SCENES}
      controlLabels={STAGES.map((stage) => stage.title)}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => {
        const values = [
          active >= 1 ? RELEASE_TRACE.permissionAfter : RELEASE_TRACE.permissionBefore,
          active >= 2 ? "group 042-C · 제외" : "group 042-C · 포함",
          active >= 3 ? `${RELEASE_TRACE.supportAfter} groups · 기준 미달` : `${RELEASE_TRACE.supportBefore} groups · 기준 충족`,
          active >= 3 ? RELEASE_TRACE.claimAfter : RELEASE_TRACE.claimBefore,
        ];
        return (
          <ol className="grid grid-cols-4 gap-px bg-border p-px" aria-label="사용 범위 변경이 자료 주장에 전파되는 네 단계">
            {STAGES.map((stage, index) => {
              const reached = active >= index;
              return (
                <li key={stage.title} className={`min-w-0 px-3 py-4 ${reached ? "bg-background" : "bg-muted/25 text-muted-foreground"}`}>
                  <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[11px] leading-5">{stage.title}</strong>
                  <span className={`mt-3 block break-keep text-[11px] leading-5 ${active === index ? "font-bold text-primary" : "text-muted-foreground"}`}>{values[index]}</span>
                </li>
              );
            })}
          </ol>
        );
      }}
    </DeepfakeStageViz>
  );
}
