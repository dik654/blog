import { ToolFrame, ToolRule, ToolSteps } from "./ToolVizPrimitives";

export default function Pipeline5StepViz() {
  return (
    <ToolFrame
      label="EDIT_FILE · CALL-17"
      title="src/auth.ts 수정 제안이 실행 증거가 되기까지 다섯 경계를 지난다"
      description="edit_file(path, old_text, new_text)의 구조·현재 파일 상태·쓰기 권한·effect를 차례로 확인합니다."
      note="Timeout은 effect 없음이 아닙니다. call-17의 before/after digest와 diff receipt를 조회한 뒤 retry 여부를 정합니다."
    >
      <ToolSteps
        columns={5}
        compactMobile
        items={[
          {
            label: "01 · REGISTRY",
            title: "계약 고정",
            body: "edit_file의 source·schema digest·registry generation에 call-17을 묶습니다.",
            tone: "blue",
          },
          {
            label: "02 · VALIDATE",
            title: "입력·파일 확인",
            body: "세 required field, canonical src/auth.ts와 old_text·before hash를 확인합니다.",
            tone: "violet",
          },
          {
            label: "03 · AUTHORIZE",
            title: "쓰기 권한 판정",
            body: "workspace-write effect를 계산하고 현재 policy의 allow를 받습니다.",
            tone: "amber",
          },
          {
            label: "04 · DISPATCH",
            title: "허용된 수정 실행",
            body: "고정한 executor만 deadline과 cancellation 아래 patch를 적용합니다.",
            tone: "emerald",
          },
          {
            label: "05 · RETURN",
            title: "변경 증거 반환",
            body: "after digest·diff reference를 반환하고 login test의 dependency로 연결합니다.",
            tone: "slate",
          },
        ]}
      />
      <ToolRule>
        JSON이 유효해도 workspace 밖 경로라면 거부합니다. Reload로 generation이
        달라졌다면 새 contract를 모델에 보여 준 뒤 새 call로 시작합니다.
      </ToolRule>
    </ToolFrame>
  );
}
