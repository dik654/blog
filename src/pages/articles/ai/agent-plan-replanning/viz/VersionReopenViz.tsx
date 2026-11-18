import SceneShell from "./SceneShell";
import { TaskGraph, type LinkCell, type TaskCell } from "./TaskGraph";

/**
 * 본문 대응: #executable-plan — schema:v3→v4 관측 뒤 B·C만 다시 열고 D를 보존한다.
 * 첫 기록 A(out schema:v3), B(in schema:v3, out client:r1), C(in client:r1, pass), D(in guide:r1, pass).
 * 다시 연 작업 2개(B·C), 보존 1개(D). 4장면은 본문의 "만약 안내 화면도 자료에 의존했다면" 갈래.
 */

interface Scene {
  label: string;
  summary: string;
  note: string;
  tasks: readonly [TaskCell, TaskCell, TaskCell, TaskCell];
  links: readonly [LinkCell, LinkCell];
  dLink: { text: string; kind: LinkCell["kind"] };
  record: readonly [string, string, string, string];
}

const RECORD_LABELS = ["깨진 전제", "다시 연 작업", "보존한 결과", "남은 예산"] as const;

const SCENES: readonly Scene[] = [
  {
    label: "첫 기록",
    summary: "4개 작업 모두 완료",
    note: "각 칸에 읽은 입력과 만든 결과의 버전이 남아 있습니다. B는 schema:v3으로 client:r1을 만들었고 C는 바로 그 r1을 검사했습니다. D는 이 자료와 무관한 guide:r1만 읽습니다. (가정)",
    tasks: [
      { id: "A", input: "자료 v3", output: "schema:v3", status: "완료", tone: "done" },
      { id: "B", input: "schema:v3", output: "client:r1", status: "완료", tone: "done" },
      { id: "C", input: "client:r1", output: "검사 결과", status: "통과", tone: "done" },
      { id: "D", input: "guide:r1", output: "안내 화면", status: "통과", tone: "done" },
    ],
    links: [
      { label: "schema", kind: "normal" },
      { label: "client", kind: "normal" },
    ],
    dLink: { text: "D는 schema를 읽지 않습니다. A→B→C와 연결이 없습니다.", kind: "normal" },
    record: ["—", "—", "—", "—"],
  },
  {
    label: "schema:v4 발견",
    summary: "다시 열 작업: B·C",
    note: "A의 출력 기록을 schema:v4로 갱신합니다. B가 읽은 v3은 새 요구와 다르므로 B를 다시 엽니다. C는 B의 결과 r1을 읽었으므로 통과 기록을 무효로 표시합니다. D로 가는 연결은 없습니다. (가정)",
    tasks: [
      { id: "A", input: "자료 v4", output: "schema:v4", status: "출력 기록 갱신", tone: "update" },
      { id: "B", input: "schema:v3 ≠ v4", output: "client:r1", status: "다시 엶", tone: "reopen" },
      { id: "C", input: "client:r1", output: "검사 결과", status: "무효 표시", tone: "invalid" },
      { id: "D", input: "guide:r1", output: "안내 화면", status: "입력 그대로", tone: "done" },
    ],
    links: [
      { label: "v4 도착", kind: "normal" },
      { label: "r1 낡음", kind: "normal" },
    ],
    dLink: { text: "바뀐 schema에서 D로 이어지는 연결이 없어 영향이 닿지 않습니다.", kind: "normal" },
    record: ["schema:v3", "B · C", "—", "수치 없음"],
  },
  {
    label: "B·C만 다시 실행",
    summary: "다시 실행 2개 · 보존 1개",
    note: "B가 client:r2를 만들고 C가 r2를 통과시키면 A→B→C는 새 자료에 맞습니다. D의 guide:r1과 완료 조건은 바뀌지 않아 기존 결과를 유지합니다. 계획 변경에는 네 칸을 함께 남깁니다. 남은 예산은 본문에 수치가 없어 칸만 둡니다.",
    tasks: [
      { id: "A", input: "자료 v4", output: "schema:v4", status: "완료", tone: "done" },
      { id: "B", input: "schema:v4", output: "client:r2", status: "새 결과", tone: "fresh" },
      { id: "C", input: "client:r2", output: "검사 결과", status: "r2 통과", tone: "fresh" },
      { id: "D", input: "guide:r1", output: "안내 화면", status: "기존 결과 보존", tone: "keep" },
    ],
    links: [
      { label: "schema", kind: "normal" },
      { label: "client", kind: "normal" },
    ],
    dLink: { text: "D는 입력과 검사 조건이 같아 다시 실행하지 않습니다.", kind: "normal" },
    record: ["schema:v3", "B · C", "D (guide:r1)", "수치 없음"],
  },
  {
    label: "만약 D도 자료를 읽었다면",
    summary: "D도 보존 불가",
    note: "안내 화면도 자료에 의존했다면 schema:v4가 D의 입력을 바꾸므로 D를 보존할 수 없습니다. 같은 변경이라도 기록된 연결에 따라 다시 열 작업이 달라집니다. 이 갈래는 본문의 가정을 바꿔 본 경우입니다. (가정)",
    tasks: [
      { id: "A", input: "자료 v4", output: "schema:v4", status: "출력 기록 갱신", tone: "update" },
      { id: "B", input: "schema:v3 ≠ v4", output: "client:r1", status: "다시 엶", tone: "reopen" },
      { id: "C", input: "client:r1", output: "검사 결과", status: "무효 표시", tone: "invalid" },
      { id: "D", input: "guide:r1 + schema", output: "안내 화면", status: "다시 엶", tone: "reopen" },
    ],
    links: [
      { label: "v4 도착", kind: "normal" },
      { label: "r1 낡음", kind: "normal" },
    ],
    dLink: { text: "schema → D 연결이 있다면 D의 입력도 바뀝니다. (가정)", kind: "extra" },
    record: ["schema:v3", "B · C · D", "없음", "수치 없음"],
  },
];

export default function VersionReopenViz() {
  return (
    <SceneShell
      eyebrow="재계획 · 영향 따라가기"
      title="schema:v4 하나가 어느 작업을 다시 여는지 따라갑니다"
      description="칸 하나가 작업 하나입니다. 칸 안의 '읽음'은 입력 버전, '만듦'은 결과 버전입니다. 화살표는 앞 작업의 결과를 뒤 작업이 읽는 연결입니다. 작업과 버전은 본문의 설명용 사례입니다. (가정)"
      ariaLabel="schema 버전 3에서 4로 바뀔 때 작업 B와 C만 다시 열고 D를 보존하는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <TaskGraph tasks={scene.tasks} links={scene.links} dLink={scene.dLink} />
            <dl className="mt-4 grid grid-cols-2 gap-px border border-border bg-border text-xs sm:grid-cols-4">
              {RECORD_LABELS.map((label, slot) => (
                <div key={label} className="min-w-0 bg-background px-2 py-2">
                  <dt className="text-[10px] font-bold text-muted-foreground">{label}</dt>
                  <dd className="mt-1 break-keep font-mono font-bold">{scene.record[slot]}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      }}
    />
  );
}
