import InitViz from "./viz/InitViz";
import { CitationBlock } from "@/components/ui/citation";

const ownershipRows = [
  [
    "프로젝트 설정",
    ".claw/settings.json · .claw.json",
    "Pinned init이 없을 때만 starter 값을 만들며 secret을 넣지 않습니다.",
  ],
  [
    "에이전트 지침",
    "CLAUDE.md",
    "감지한 언어·검증 명령의 초안을 만들되 기존 파일은 건너뜁니다.",
  ],
  [
    "런타임 데이터",
    ".claw/sessions/ · debug/",
    "기본적으로 ignore하고 보존 기간을 따로 둡니다.",
  ],
  [
    "인증 정보",
    "init artifact 아님",
    "환경 변수·credential subsystem의 책임이며 repository에 만들지 않습니다.",
  ],
];

export default function Init() {
  return (
    <section id="init" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        프로젝트 초기화는 create-if-missing과 안전한 변경 계획을 구분한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>claw init</code>의 목적은 파일 몇 개를 만드는 데 있지 않습니다.
          기존 저장소를 조사해 필요한 설정의 초안을 제안하고, 사용자가 소유한
          파일을 보존하면서 에이전트가 다시 읽을 수 있는 형태로 기록하는 것이
          핵심입니다. 프로젝트 타입 감지는 이 과정의 입력일 뿐 자동 실행 권한이
          아닙니다.
        </p>

        <div id="paper-claw-init-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code repository init @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/src/init.rs"
            citeKey={4}
            type="code"
          >
            <p>
              <strong>문제:</strong> 기존 repository에 starter config·guidance·ignore
              entry를 반복 실행 가능하게 추가합니다. <strong>기여:</strong> pinned
              source는 create-if-missing, gitignore entry 추가, stack detection과
              structured InitReport를 구현합니다. <strong>전제:</strong> commit과
              실행 cwd·기존 file bytes를 고정합니다. <strong>근거 범위:</strong>
              source와 idempotency test가 다루는 artifact입니다. <strong>일반화
              금지:</strong> 전체 diff preview·transaction·atomic rename·rollback이나
              실행 capability 승인까지 구현됐다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>

        <InitViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Pinned source와 원하는 inspect·plan·apply를 분리한다
        </h3>
        <p>
          Pinned <code>initialize_repo</code>는 <code>.claw</code> directory와 두
          starter setting file을 없을 때 만들고, <code>.gitignore</code>에는 필요한
          entry를 추가하며, 기존 <code>CLAUDE.md</code>는 덮어쓰지 않습니다. 각
          artifact status는 created·updated·partial·deferred·skipped로 보고하지만,
          모든 변경을 먼저 모아 diff로 보여준 뒤 한 번에 commit하는 transaction은
          아닙니다.
        </p>
        <p>
          더 강한 설계에서는 read-only inspect가 기존 digest와 stack signal을
          모으고, plan이 create·append·skip·conflict와 diff를 만든 뒤, 사용자가
          확인한 plan만 apply합니다. 이 구분은 중간 실패와 concurrent edit를
          다루기 위한 hardening 목표이며 현재 pinned source의 완료 기능으로
          소개하지 않습니다.
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
              className="rounded-lg border border-border/70 bg-card p-4"
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
        <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border/70">
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
        <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border/70">
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
          보고합니다. Pinned source는 create-if-missing과 exact ignore-entry 확인으로
          반복 실행의 대부분을 안정화하지만 marker 기반 block ownership이나
          expected digest는 없습니다. 임시 파일·fsync·atomic rename과 plan-wide
          rollback 역시 source에서 확인되지 않으므로 production hardening 항목으로
          남깁니다.
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
