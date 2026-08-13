import { FileFrame, FileRule, FileSteps } from "./FileVizPrimitives";

export default function SearchViz() {
  return (
    <FileFrame
      label="TOP-DOWN REPOSITORY SEARCH"
      title="filename에서 content로 좁히고 필요한 range만 읽는다"
      description="glob과 grep은 서로 대체하는 도구가 아니라 큰 repository의 후보를 단계적으로 줄이는 두 검색 축입니다."
      note="ignore·hidden·symlink 정책과 truncation을 결과에 표시해 ‘없음’과 ‘검색하지 않음’을 구분합니다."
    >
      <FileSteps
        items={[
          {
            label: "01",
            title: "Set boundary",
            body: "workspace root와 ignore·symlink policy를 고정합니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Glob candidates",
            body: "directory와 filename pattern으로 file 집합을 줄입니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Grep content",
            body: "literal 또는 bounded regex로 match 좌표를 찾습니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Read ranges",
            body: "상위 match의 필요한 line range만 다시 읽습니다.",
            tone: "emerald",
          },
        ]}
      />
      <FileRule>
        결과는 stable order와 cursor를 사용하고 match·file·byte budget을 각각
        제한합니다.
      </FileRule>
    </FileFrame>
  );
}
