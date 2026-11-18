import SceneShell from "./SceneShell";
import { TaskGraph, type LinkCell, type TaskCell } from "./TaskGraph";

/**
 * 본문 대응: #plan-boundaries — 같은 schema:v4 관측도 기록된 연결이 틀리면 재계획 결과가 틀린다.
 * 바른 연결: 다시 실행 B·C 2개, 보존 D. 읽은 기록 누락: 낡은 B·C 결과 2개를 놓침. 전부 연결: B·C·D 3개 다시 실행, 보존 0(A는 두 경우 모두 출력 기록 갱신).
 */

interface Scene {
  label: string;
  summary: string;
  note: string;
  tasks: readonly [TaskCell, TaskCell, TaskCell, TaskCell];
  links: readonly [LinkCell, LinkCell];
  dLink: { text: string; kind: LinkCell["kind"] };
}

const SCENES: readonly Scene[] = [
  {
    label: "실제로 읽은 입력대로 연결",
    summary: "다시 실행 2개 · 보존 1개",
    note: "7절의 결과입니다. B가 schema를 읽은 기록이 있어 B와 그 결과를 읽은 C만 다시 열고, schema와 연결이 없는 D는 보존합니다. (가정)",
    tasks: [
      { id: "A", input: "자료 v4", output: "schema:v4", status: "출력 기록 갱신", tone: "update" },
      { id: "B", input: "schema:v3 ≠ v4", output: "client:r1", status: "다시 엶", tone: "reopen" },
      { id: "C", input: "client:r1", output: "검사 결과", status: "무효 표시", tone: "invalid" },
      { id: "D", input: "guide:r1", output: "안내 화면", status: "보존", tone: "keep" },
    ],
    links: [
      { label: "schema", kind: "normal" },
      { label: "client", kind: "normal" },
    ],
    dLink: { text: "D는 schema를 읽지 않습니다. 연결도 없습니다.", kind: "normal" },
  },
  {
    label: "읽은 자료를 빠뜨린 기록",
    summary: "낡은 결과 2개를 놓침",
    note: "B가 schema를 읽었다는 연결을 기록에서 빠뜨렸다고 해 봅시다. 바뀐 schema에서 따라갈 길이 없으니 v3으로 만든 client:r1과 그 r1의 통과 기록이 완료로 남습니다. 어떤 연결을 빠뜨렸는지는 설명용 선택입니다. (가정)",
    tasks: [
      { id: "A", input: "자료 v4", output: "schema:v4", status: "출력 기록 갱신", tone: "update" },
      { id: "B", input: "(기록 없음)", output: "client:r1", status: "완료로 남음 · 실제로는 v3 기반", tone: "stale" },
      { id: "C", input: "client:r1", output: "검사 결과", status: "통과로 남음 · 낡은 r1 검사", tone: "stale" },
      { id: "D", input: "guide:r1", output: "안내 화면", status: "보존", tone: "keep" },
    ],
    links: [
      { label: "기록 빠짐", kind: "missing" },
      { label: "client", kind: "normal" },
    ],
    dLink: { text: "D 보존 판단은 맞지만 영향을 받는 B·C를 놓쳤습니다.", kind: "normal" },
  },
  {
    label: "모든 작업을 서로 연결",
    summary: "다시 실행 3개 · 보존 0개",
    note: "반대로 실제로 읽지 않은 연결까지 모두 붙이면 작은 변경도 전체 재실행으로 번집니다. A 뒤의 B·C에 더해 자료와 무관한 D까지 다시 돌게 되어 보존할 결과가 남지 않습니다. 연결은 문서에 쓰인 순서보다 실제 읽은 입력에서 확인합니다. (가정)",
    tasks: [
      { id: "A", input: "자료 v4", output: "schema:v4", status: "출력 기록 갱신", tone: "update" },
      { id: "B", input: "schema:v4", output: "client:?", status: "다시 실행", tone: "reopen" },
      { id: "C", input: "client:?", output: "검사 결과", status: "다시 실행", tone: "reopen" },
      { id: "D", input: "guide:r1 + 전부", output: "안내 화면", status: "다시 실행", tone: "reopen" },
    ],
    links: [
      { label: "schema", kind: "normal" },
      { label: "client", kind: "normal" },
    ],
    dLink: { text: "D를 A·B·C와 모두 이어 붙였습니다. 실제로 읽지 않은 연결입니다. (가정)", kind: "extra" },
  },
];

export default function WiringErrorViz() {
  return (
    <SceneShell
      eyebrow="연결 기록의 오류"
      title="같은 schema:v4도 기록된 연결에 따라 다시 여는 작업이 달라집니다"
      description="7절의 A·B·C·D에 같은 schema:v4 관측을 넣고 연결 기록만 바꿉니다. 빨간 점선 화살표는 기록에서 빠진 연결, 빨간 점선 칸은 낡았는데도 완료로 남은 결과, 주황 점선 설명은 실제로 읽지 않았는데 붙인 연결입니다. 세 경우 모두 설명용 가정입니다. (가정)"
      ariaLabel="연결 기록이 바를 때, 빠졌을 때, 전부 연결됐을 때 다시 여는 작업 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return <TaskGraph tasks={scene.tasks} links={scene.links} dLink={scene.dLink} />;
      }}
    />
  );
}
