import InitViz from "./viz/InitViz";

const ownershipRows = [
  [
    "프로젝트 설정",
    ".claw/config.json",
    "팀이 공유할 기본값만 기록하고 secret은 넣지 않습니다.",
  ],
  [
    "에이전트 지침",
    ".claw/AGENTS.md",
    "감지한 명령은 초안으로 표시하고 사람이 검토합니다.",
  ],
  [
    "런타임 데이터",
    ".claw/sessions/ · debug/",
    "기본적으로 ignore하고 보존 기간을 따로 둡니다.",
  ],
  [
    "인증 정보",
    "OS keychain 또는 credential helper",
    "저장소 파일에 생성하지 않습니다.",
  ],
];

export default function Init() {
  return (
    <section id="init" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        프로젝트 초기화는 감지가 아니라 안전한 병합이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>claw init</code>의 목적은 파일 몇 개를 만드는 데 있지 않습니다.
          기존 저장소를 조사해 필요한 설정의 초안을 제안하고, 사용자가 소유한
          파일을 보존하면서 에이전트가 다시 읽을 수 있는 형태로 기록하는 것이
          핵심입니다. 프로젝트 타입 감지는 이 과정의 입력일 뿐 자동 실행 권한이
          아닙니다.
        </p>

        <InitViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          inspect와 apply를 분리한다
        </h3>
        <p>
          init을 한 함수에서 바로 기록하면 어떤 파일이 바뀔지 확인하기 어렵고,
          중간 실패 때 부분 생성물이 남습니다. 먼저 read-only inspect 단계에서
          저장소 루트, 기존 설정, 언어와 빌드 도구의 시그널, ignore 규칙을
          수집합니다. 그 결과로 change plan과 diff를 만든 뒤 대화형 확인 또는
          명시적 <code>--yes</code> 정책을 거쳐 apply하는 편이 안전합니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {[
            ["Inspect", "읽기만 하며 기존 파일의 digest와 출처를 기록합니다."],
            ["Plan", "create·append·skip·conflict를 구분한 diff를 보여줍니다."],
            [
              "Apply",
              "확인된 변경만 원자적으로 기록하고 결과를 다시 검증합니다.",
            ],
          ].map(([title, description]) => (
            <section
              key={title}
              className="rounded-2xl border border-border/70 bg-card p-4"
            >
              <h4 className="text-sm font-bold">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </section>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          프로젝트 감지는 복수 결과와 불확실성을 허용한다
        </h3>
        <p>
          <code>package.json</code> 하나를 보고 저장소 전체를 JavaScript
          프로젝트로 단정하면 monorepo를 잘못 이해할 수 있습니다. 감지 결과는
          언어 하나가 아니라 workspace별 evidence 목록이어야 하며, 파일 위치와
          신뢰도를 함께 보존하는 것이 좋습니다. build·test 명령도 manifest에
          실제로 선언된 script를 우선하고, 추정한 명령은 “제안”으로 표시해야
          합니다.
        </p>
        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-border/70">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">시그널</th>
                <th className="px-4 py-3 font-semibold">알 수 있는 것</th>
                <th className="px-4 py-3 font-semibold">단정하면 안 되는 것</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {[
                [
                  "Cargo.toml",
                  "해당 경로가 Cargo package/workspace라는 점",
                  "저장소 전체가 Rust뿐이라는 점",
                ],
                [
                  "package.json",
                  "scripts와 package manager 힌트",
                  "임의 script가 안전하다는 점",
                ],
                [
                  "pyproject.toml",
                  "Python tool과 package metadata",
                  "venv 위치와 실행 환경",
                ],
                [
                  "go.mod",
                  "Go module 경계",
                  "모든 하위 디렉터리의 단일 module 소속",
                ],
              ].map(([signal, known, unknown]) => (
                <tr key={signal}>
                  <td className="px-4 py-3">
                    <code className="text-xs text-primary">{signal}</code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{known}</td>
                  <td className="px-4 py-3 text-muted-foreground">{unknown}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          생성 파일의 소유권을 분리한다
        </h3>
        <p>
          팀이 검토하고 커밋할 설정, 각 사용자의 런타임 데이터, 인증 정보는 같은
          <code>.claw</code> 이름 아래 있더라도 수명주기가 다릅니다. 무엇을
          생성할지보다 누가 소유하고 어디에 저장할지를 먼저 정하면 secret을
          실수로 커밋하거나 세션 로그를 팀 설정처럼 공유하는 일을 줄일 수
          있습니다.
        </p>
        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-border/70">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">종류</th>
                <th className="px-4 py-3 font-semibold">예시 위치</th>
                <th className="px-4 py-3 font-semibold">기본 원칙</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {ownershipRows.map(([kind, path, rule]) => (
                <tr key={kind}>
                  <td className="px-4 py-3 font-medium">{kind}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-primary">{path}</code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          재실행해도 사용자 편집을 지우지 않아야 한다
        </h3>
        <p>
          안전한 init은 idempotent해야 합니다. 같은 버전과 같은 입력으로 다시
          실행했을 때 새 변경이 없어야 하며, 도구가 생성한 block에는 marker와
          schema version을 남겨 자기 영역만 갱신해야 합니다. marker 밖의 사용자
          편집이나 알 수 없는 기존 설정은 자동 덮어쓰지 말고 conflict로
          보고합니다. 파일 기록은 같은 디렉터리의 임시 파일에 쓴 뒤 atomic
          rename하고, 실패하면 이전 파일이 그대로 남아야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          초기화가 곧 신뢰 승인은 아니다
        </h3>
        <p>
          clone한 저장소에서 init을 실행했다고 해서 프로젝트 스크립트와 MCP
          서버, 플러그인을 모두 신뢰한 것은 아닙니다. init은 발견한 capability를
          비활성 상태로 기록하고, 실제 첫 실행에서 사용자에게 출처와 효과를
          보여준 뒤 별도로 승인받아야 합니다. 설정의 병합 순서와 secret 저장은
          <a href="/ai/claw-config">설정과 bootstrap 글</a>이, 실행 권한은
          <a href="/ai/claw-permissions">권한 모델 글</a>이 각각 소유합니다.
        </p>
      </div>
    </section>
  );
}
