import { FileFrame, FileRule, FileSteps } from "./FileVizPrimitives";

export default function SymlinkEscapeViz() {
  return (
    <FileFrame
      label="CURRENT GAP → HARDENING"
      title="입력 path가 아니라 실제로 열 object를 판정한다"
      description="lexical normalization과 canonicalization 뒤에도 race-resistant open과 sandbox mount가 필요합니다."
      note="Pinned wrapper는 canonical Path prefix를 검사하지만 actual open과 결합되지 않습니다. Handle-bound open은 다음 hardening 단계입니다."
    >
      <FileSteps
        items={[
          {
            label: "INPUT",
            title: "Normalize syntax",
            body: "separator·dot component·platform special form을 해석합니다.",
            tone: "blue",
          },
          {
            label: "TARGET",
            title: "Resolve existing parent",
            body: "symlink·junction을 따라 실제 parent identity를 확인합니다.",
            tone: "violet",
          },
          {
            label: "BOUNDARY",
            title: "Compare components",
            body: "canonical root와 target의 tree 관계를 판정합니다.",
            tone: "amber",
          },
          {
            label: "OPEN",
            title: "Use handle safely",
            body: "no-follow·directory handle·final identity를 재검증합니다.",
            tone: "emerald",
          },
        ]}
      />
      <FileRule>
        writable mount 자체를 workspace로 제한해 application check 실패의 피해를
        줄입니다.
      </FileRule>
    </FileFrame>
  );
}
