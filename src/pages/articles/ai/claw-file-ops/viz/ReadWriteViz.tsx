import { FileFrame, FileRule, FileSteps } from "./FileVizPrimitives";

export default function ReadWriteViz() {
  return (
    <FileFrame
      label="HARDENING TARGET"
      title="직접 쓰기를 conditional atomic replace로 확장한다"
      description="Pinned source의 write·edit에는 expected digest와 temporary rename이 없습니다. 아래는 stale overwrite를 막기 위한 다음 계약입니다."
      note="atomic rename은 단일 file 교체의 원자성만 보장하며 여러 file 변경 전체를 transaction으로 만들지는 않습니다."
    >
      <FileSteps
        items={[
          {
            label: "01",
            title: "Authorize path",
            body: "실제 target·file type·operation permission을 확인합니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Check version",
            body: "현재 digest와 expected digest를 비교합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Build replacement",
            body: "unique edit 또는 explicit overwrite로 새 content를 만듭니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Atomic replace",
            body: "temporary file을 검증하고 rename한 뒤 결과를 기록합니다.",
            tone: "emerald",
          },
        ]}
      />
      <FileRule>
        expected version이 다르면 자동 merge하지 않고 stale input으로
        실패합니다.
      </FileRule>
    </FileFrame>
  );
}
