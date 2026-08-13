import { FileFrame, FileRule, FileSteps } from "./FileVizPrimitives";

export default function PathAttackVectorsViz() {
  return (
    <FileFrame
      label="PLATFORM-SPECIFIC ESCAPES"
      title="같은 containment 원칙도 platform마다 확인할 object가 다르다"
      description="POSIX symlink와 mount, Windows reparse point와 device path, 존재하지 않는 새 target을 별도 case로 다룹니다."
      note="portable string normalization은 첫 단계일 뿐이며 platform handle API와 회귀 test가 필요합니다."
    >
      <FileSteps
        items={[
          {
            label: "LEXICAL",
            title: "Traversal",
            body: "..·absolute·비슷한 prefix directory를 component로 구분합니다.",
            tone: "blue",
          },
          {
            label: "POSIX",
            title: "Link & mount",
            body: "symlink·hard link·mount와 rename race를 고려합니다.",
            tone: "violet",
          },
          {
            label: "WINDOWS",
            title: "Reparse & device",
            body: "junction·UNC·device namespace·case rules를 확인합니다.",
            tone: "amber",
          },
          {
            label: "CREATE",
            title: "Missing target",
            body: "기존 parent handle에서 새 component를 안전하게 만듭니다.",
            tone: "emerald",
          },
        ]}
      />
      <FileRule>
        platform별 path corpus와 race test를 CI에서 실행해 추상화의 빈틈을
        확인합니다.
      </FileRule>
    </FileFrame>
  );
}
