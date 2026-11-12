import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import GateMatrixViz from "./agent-approval-and-sandbox/viz/GateMatrixViz";
import InheritedBoundaryViz from "./agent-approval-and-sandbox/viz/InheritedBoundaryViz";
import WallGapsViz from "./agent-approval-and-sandbox/viz/WallGapsViz";

/**
 * 에이전트 승인과 샌드박스는 서로를 대신하지 못합니다
 *
 * 근거: docs/agent-landscape-2026-11-06.md 와 2026-11-06에 다시 받아 대조한 각 구현의 공식 문서·소스.
 * 공유 숫자: 명령 5개, 피해 3→1→1→0건, 사람에게 물은 횟수 0→2→0→1번. 명령과 숨은 효과는 가정이다.
 */

const POSTURES = [
  {
    name: "Codex CLI",
    version: "rust-v0.167.0",
    approval: "on-request: 벽 안의 명령은 묻지 않음",
    wall: "기본 workspace-write",
    network: "꺼짐",
  },
  {
    name: "Antigravity CLI",
    version: "문서 기준",
    approval: "Default: 벽 안은 허용, 밖은 물음",
    wall: "Default에서 켜짐",
    network: "없음",
  },
  {
    name: "Cursor",
    version: "문서 기준",
    approval: "Auto-review(문서 권장): 분류기가 심사",
    wall: "가능한 셸 명령에 적용",
    network: "기본 deny",
  },
  {
    name: "Claude Code",
    version: "v2.1.318",
    approval: "auto: 분류기가 심사",
    wall: "기본 꺼짐, /sandbox로 켬",
    network: "켜면 허용 목록이 빈 채 시작",
  },
  {
    name: "Gemini CLI",
    version: "v0.67.0",
    approval: "default 승인 모드로 시작",
    wall: "플래그나 설정으로 켬",
    network: "Seatbelt 기본 프로필은 허용",
  },
  {
    name: "OpenClaw",
    version: "v2026.11.1",
    approval: "auto(문서 권장): 목록 밖을 심사",
    wall: "기본 꺼짐",
    network: "켜면 Docker 기본값은 none",
  },
  {
    name: "OpenCode",
    version: "v2.2.5",
    approval: "기본 정책이 allow",
    wall: "공개 문서에서 찾지 못함",
    network: "도구 제한 미확인",
  },
  {
    name: "OpenHands",
    version: "SDK v1.60.1",
    approval: "AlwaysConfirm 등 정책을 고름",
    wall: "Docker 등 작업 공간 단위",
    network: "미확인",
  },
  {
    name: "claw-code",
    version: "v0.1.11",
    approval: "workspace-write 모드",
    wall: "Linux unshare만, 기본 요청",
    network: "격리 기본값 꺼짐",
  },
] as const;

export default function AgentApprovalAndSandboxArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 허락한 npm test가 외부로 자료를 보낼 수 있습니다</h2>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            코딩 에이전트에게 로그인 오류를 고치라고 맡겼습니다. 에이전트가 <code>npm test</code>를 실행하겠다고 묻자 평소처럼 허락합니다. 테스트는 초록색으로 끝났습니다. 그런데 테스트가 불러온 의존성 하나가 그사이 <code>.env</code>를 읽어 외부로 보냈다면(가정) 허락한 사람은 무엇을 놓친 걸까요?
          </p>
          <p className="leading-7">놓친 것이 없습니다. 화면에 보인 것은 <code>npm test</code> 한 줄이었고 그 한 줄만 보고는 안쪽에서 무슨 일이 생길지 알 수 없습니다. 더 꼼꼼히 읽는다고 풀리는 문제가 아니라, 명령을 허락하는 일과 명령이 실제로 건드릴 수 있는 범위를 정하는 일이 다른 일이라서 생기는 문제입니다.</p>
          <p className="leading-7">이 글은 에이전트 하나가 낸 명령 다섯 개를 끝까지 따라갑니다. 두 일 중 하나만 있으면 무엇이 남는지 세어 보고 둘을 함께 쓰면 무엇이 달라지는지 확인한 다음, 지금 쓰이는 아홉 구현이 이 둘을 어떻게 다르게 조합했는지 비교합니다.</p>
          <p className="leading-7">
            지금은 허락과 범위가 별개라는 사실만 가져가면 됩니다. 그럼 명령 하나는 어떤 길을 지나 실제 효과를 남길까요?
          </p>
        </div>
        <ContentBoundary article="agent-approval-and-sandbox" />
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 명령 하나는 두 번 걸러진 뒤 효과를 남깁니다</h2>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none max-w-none dark:prose-invert">
          <p className="text-lg leading-8">바깥에서 보면 흐름은 단순합니다. 모델이 명령을 제안하면 실행 환경이 그 명령을 돌리고 파일이나 네트워크에 효과가 남고, 결과가 다시 모델에게 돌아갑니다. 이 왕복은{" "}<Link to="/cs/ai/agent-loop-foundations">에이전트 루프</Link>에서 본 그대로입니다.</p>
          <p className="leading-7">
            걸러 낼 기회는 이 길 위에 두 번 있습니다. 첫 번째는 실행하기 직전입니다. 명령 문자열을 보고 돌려도 되는지 정합니다. 이것을 실행 전 심사라고 부르겠습니다.
          </p>
          <p className="leading-7">
            두 번째는 실행하는 동안입니다. 프로세스가 파일을 열거나 네트워크에 연결할 때마다 운영체제가 허용 범위를 확인합니다. 이것을 실행 중 벽이라고 부르겠습니다. 벽은 명령의 이름을 묻지 않고 그 순간의 동작만 봅니다.
          </p>
          <p className="leading-7">
            두 관문의 위치는 이것으로 잡혔습니다. 다음 절에서는 실제 명령을 넣어 각 관문이 무엇을 막는지 셉니다.
          </p>
        </div>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 명령 5개를 넣으면 관문마다 남는 피해가 다릅니다</h2>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mb-6 max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            같은 명령 5개(가정)를 네 가지 설정에 넣으면 피해가 몇 건 남을까요?
          </p>
        </div>
        <GateMatrixViz />
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">처음 두 명령은 원래 할 일입니다. 나머지 셋이 문제인데 셋의 성격이 서로 다릅니다. <code>npm test</code>는 이름이 멀쩡하고 안쪽의 전송만 나쁩니다. <code>rm -rf src</code>는 모델이 빌드 정리로 착각해 낸 실수이고 작업 폴더 안에서 일어납니다. <code>~/.bashrc</code>에 줄을 더하는 명령은 작업 폴더 밖을 건드립니다.</p>
          <p className="leading-7">심사만 쓰면 <code>rg</code>, <code>sed</code>, <code>npm test</code>를 허용 목록에 넣고 나머지 2개를 묻습니다. 사람이 둘 다 거부하면 피해는 3건에서 1건으로 줄지만 남는 1건이 바로 첫 절의 전송입니다. 허용 목록을 아무리 잘 만들어도 이름이 같으면 같은 판정이 나옵니다.</p>
          <p className="leading-7">벽만 쓰면 작업 폴더 밖 쓰기와 네트워크를 닫고 아무것도 묻지 않습니다. 전송과 <code>~/.bashrc</code> 기록은 저절로 실패합니다. 그래도 피해가 1건 남는데 <code>rm -rf src</code>는 벽이 허락한 범위 안의 쓰기이기 때문입니다.</p>
          <p className="leading-7">둘을 합치면 벽 위에 삭제를 묻는 규칙 하나만 더해도 피해가 0건이 됩니다. 눈여겨볼 숫자는 물음 횟수입니다. 심사만 쓸 때 2번이던 물음이 1번으로 줄어드는데 폴더 밖 쓰기를 벽이 대신 막아 주어 사람이 볼 필요가 없어졌기 때문입니다.</p>
          <p className="leading-7">이 표의 결론은 피해 3, 1, 1, 0이라는 네 숫자입니다. 심사와 벽이 남기는 1건이 왜 서로 다른 명령인지는 다음 절의 일입니다.</p>
        </div>
      </section>

      <section id="why-two" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 심사는 문자열을 보고 벽은 실제 동작을 봅니다</h2>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mb-6 max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            허락한 한 줄과 실제 효과 사이에는 무엇이 있을까요?
          </p>
        </div>
        <InheritedBoundaryViz />
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            심사가 놓치는 이유는 입력에 있습니다. 심사가 받는 것은 실행 전의 문자열이고, 전송은 실행 뒤 네 번째 층의 프로세스에서 생깁니다. 아직 일어나지 않은 동작을 문자열에서 읽어 낼 수는 없습니다. 사람이 보든 모델이 보든 이 한계는 같습니다.
          </p>
          <p className="leading-7">
            벽이 이것을 잡는 이유도 위치에 있습니다. 제한은 프로세스에 걸리고 자식 프로세스가 그대로 물려받습니다. 그래서 스크립트 이름을 미리 몰라도 맨 아래 프로세스의 연결 시도가 실패합니다. 테스트 판정은 그대로 나오니 일을 멈출 필요도 없습니다.
          </p>
          <p className="leading-7">
            반대로 벽이 삭제를 놓치는 이유는 입력에 의도가 없어서입니다. 운영체제가 보는 것은 허용된 폴더 안의 파일을 지우는 호출입니다. 소스를 고치려고 지우는지 실수로 지우는지는 구별하지 못합니다. 이 판단은 명령의 뜻을 읽는 쪽, 곧 심사가 맡아야 합니다.
          </p>
          <p className="leading-7">쉽게 말하면 심사는 무엇을 하려는지를 보고 벽은 무엇을 하고 있는지를 봅니다. 앞 절에서 남은 두 건이 서로 달랐던 까닭이 이것입니다.</p>
          <p className="leading-7">
            이제 구조는 설명이 됩니다. 남은 일은 업계가 이 두 관문을 어떤 이름으로 부르는지 맞추는 것입니다.
          </p>
        </div>
      </section>

      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 두 관문과 그 사이의 요청에 이름을 붙입니다</h2>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mb-6 max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            구현마다 설정 이름은 달라도 맡은 역할은 다음 네 가지로 정리됩니다.
          </p>
        </div>
        <TermBreakdown
          title="역할과 이름"
          items={[
            {
              term: "승인 정책(approval policy)",
              description: "실행 전 심사를 언제 사람이나 분류기에게 넘길지 정하는 설정입니다.",
              example: "npm test는 허용 목록에 있어 바로 실행하고 rm -rf src는 묻습니다.",
              boundary: "실행 전 문자열을 보므로 자식 프로세스의 동작은 보지 못합니다.",
            },
            {
              term: "샌드박스(sandbox)",
              description: "운영체제 기능으로 프로세스가 건드릴 파일과 네트워크를 제한하는 실행 중 벽입니다.",
              example: "~/.bashrc 쓰기와 203.0.113.7 연결이 실패합니다.",
              boundary: "허용 범위 안의 파괴는 막지 못하고, 기본 읽기 범위도 구현마다 다릅니다.",
            },
            {
              term: "경계 밖 실행 요청(escalation)",
              description: "벽 안에서 실패한 명령을 벽 밖에서 다시 돌려도 되는지 묻는 절차입니다.",
              example: "~/.bashrc 쓰기가 실패하면 에이전트가 벽 밖 실행을 요청합니다.",
              boundary: "요청을 승인하면 그 실행에는 벽이 없으므로 심사가 유일한 관문이 됩니다.",
            },
            {
              term: "분류기 자동 심사(classifier review)",
              description: "사람 대신 별도의 모델이 심사를 맡는 방식입니다.",
              example: "rm -rf src를 사람에게 묻는 대신 분류기가 허용이나 거부를 정합니다.",
              boundary: "심사를 자동화할 뿐 벽이 되지는 않으며, 판단이 확률적이라 결과를 미리 단정할 수 없습니다.",
            },
          ]}
        />
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            벽을 어떤 기술로 만드느냐는 이 글의 범위가 아닙니다. 시스템 호출이 어느 커널까지 가는지는{" "}
            <Link to="/cs/ai/sandbox-runtime-isolation">런타임 격리</Link> 글에서, 프로세스가 보는 자원을 나누는 원리는{" "}
            <Link to="/cs/ai/agent-sandbox-security">Container 보안 기초</Link>에서 다룹니다. 외부 연결을 목적지별로 통제하는 방법은{" "}
            <Link to="/cs/ai/sandbox-deployment-controls#egress">배포 통제</Link> 글에 있습니다.
          </p>
          <p className="leading-7">
            이름까지 맞췄으니 같은 다섯 명령을 실제 제품의 기본 설정으로 돌려 볼 차례입니다.
          </p>
        </div>
      </section>

      <section id="trace" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. Codex 기본 설정에서는 삭제 한 건이 남습니다</h2>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none max-w-none dark:prose-invert">
          <p className="text-lg leading-8">Codex CLI의 저위험 로컬 구성은 <code>sandbox_mode = &quot;workspace-write&quot;</code>와 <code>approval_policy = &quot;on-request&quot;</code>입니다. 문서에 따르면 이 구성에서 벽이 허용한 명령은 승인 없이 실행되고 네트워크는 꺼져 있습니다. 다섯 명령을 차례로 넣어 봅니다.</p>
          <p className="leading-7">
            <code>rg</code>와 <code>sed</code>는 작업 폴더 안의 읽기와 쓰기라 묻지 않고 실행됩니다. <code>npm test</code>도 묻지 않고 실행되지만 네트워크가 꺼져 있어 숨은 전송이 실패합니다. 여기까지는 앞 표의 벽 장면과 같습니다.
          </p>
          <p className="leading-7"><code>~/.bashrc</code> 쓰기는 작업 폴더 밖이라 실패하고 에이전트는 경계 밖 실행을 요청할 수 있습니다. 사람이 거부하면 피해가 없습니다. 문제는 <code>rm -rf src</code>입니다. 작업 폴더 안의 쓰기이므로 벽이 허용하고 그래서 묻지도 않습니다. 피해 1건이 그대로 남아 앞 표의 벽 장면과 숫자가 같습니다.</p>
          <p className="leading-7">다만 복구할 길은 남습니다. 같은 문서는 쓰기 가능한 폴더 안에서도 <code>.git</code>을 읽기 전용으로 보호한다고 밝힙니다. 삭제된 파일 중 커밋해 둔 내용은 되돌릴 수 있고 커밋하지 않은 수정만 잃습니다. 벽이 막지 못한 피해의 크기를 다른 장치가 줄이는 셈입니다.</p>
          <p className="leading-7">이 결과가 Codex만의 약점은 아닙니다. 묻는 횟수를 줄이려면 벽 안의 일을 믿어야 하고 그 믿음의 대가가 이 한 건입니다. 다음 절에서 원문의 표현을 직접 확인합니다.</p>
        </div>
      </section>

      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 구현들의 문서도 두 관문을 따로 설명합니다</h2>
        <div id="paper-codex-sandboxing" className="scroll-mt-20">
          <CitationBlock source="OpenAI Codex 문서 — Sandboxing" citeKey={1} href="https://learn.chatgpt.com/docs/sandboxing">
            <q>Sandboxing and approvals are different controls that work together.</q>
          </CitationBlock>
          <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-3 max-w-none dark:prose-invert">
            <p className="leading-7">
              같은 문서는 벽이 기술적 경계를 정하고 승인 정책은 그 경계를 넘기 전에 언제 멈출지를 정한다고 이어 갑니다. 또 패키지 관리자와 테스트 실행기 같은 명령도 같은 경계를 물려받는다고 적습니다. 사례의 <code>npm test</code>에서 전송이 실패한 근거가 이 문장입니다.
            </p>
          </div>
        </div>
        <div id="paper-claude-code-sandboxing" className="mt-8 scroll-mt-20">
          <CitationBlock source="Claude Code 문서 — Sandboxing" citeKey={2} href="https://code.claude.com/docs/en/sandboxing">
            <q>Most of the machine, including credential files such as ~/.ssh and ~/.aws/credentials</q>
          </CitationBlock>
          <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-3 max-w-none dark:prose-invert">
            <p className="leading-7">
              샌드박스 안에서 기본으로 읽을 수 있는 범위를 적은 표의 한 칸입니다. 쓰기와 네트워크는 닫혀도 읽기는 대부분 열려 있다는 뜻입니다. 사례에 비밀 키를 읽는 명령이 있었다면 읽기 자체는 성공합니다. 설정(<code>denyRead</code>)으로 좁힐 수 있지만 기본값은 이렇습니다.
            </p>
            <p className="leading-7">이 문서는 샌드박스가 기본으로 꺼져 있다고 밝히고 켜면 허용 도메인 목록이 빈 채로 시작한다고 적습니다. auto 모드에서 목록 밖 호스트 연결은 기본적으로 거부됩니다. 사례에 넣으면 <code>npm test</code>의 전송은 샌드박스를 켰을 때 실패합니다.</p>
          </div>
        </div>
        <div id="paper-claude-code-permission-modes" className="mt-8 scroll-mt-20">
          <CitationBlock source="Claude Code 문서 — Permission modes" citeKey={3} href="https://code.claude.com/docs/en/permission-modes">
            <q>a second model, the classifier, reviews actions instead of you</q>
          </CitationBlock>
          <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-3 max-w-none dark:prose-invert">
            <p className="leading-7">v2.1.283부터 대화형 세션의 기본 시작 모드가 이 auto 모드입니다. 분류기는 사람의 자리를 대신하므로 실행 전 심사에 속합니다. 사례의 <code>rm -rf src</code>를 분류기가 어떻게 판정할지는 문서로 단정할 수 없고 같은 문서가 샌드박스나 컨테이너를 추가 방어로 소개합니다.</p>
          </div>
        </div>
        <div id="paper-opencode-permissions" className="mt-8 scroll-mt-20">
          <CitationBlock source="OpenCode V2 문서 — Permissions" citeKey={4} href="https://opencode.ai/v2/docs/permissions/">
            <q>Every agent, including custom agents, starts with this ordered base policy</q>
          </CitationBlock>
          <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-3 max-w-none dark:prose-invert">
            <p className="leading-7">
              이 기본 정책의 첫 줄은 모든 동작을 허용하는 규칙이고 <code>.env</code> 읽기 정도만 묻습니다. 작업 폴더 밖 접근도 기본 허용입니다. 공개 문서에서 운영체제 샌드박스를 찾지 못했으므로, 기본값 그대로라면 사례는 첫 장면처럼 5개가 모두 실행되어 피해 3건이 됩니다. 규칙을 더해 바꿀 수 있습니다.
            </p>
          </div>
        </div>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            네 문서만 봐도 기본값의 간격이 큽니다. 이 간격을 아홉 구현으로 넓혀 봅니다.
          </p>
        </div>
      </section>

      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 아홉 구현의 기본값은 벽을 언제 켜느냐로 갈립니다</h2>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none max-w-none dark:prose-invert">
          <p className="text-lg leading-8">구현을 가르는 첫 질문은 벽이 처음부터 켜져 있느냐입니다. Codex와 Antigravity의 기본 구성은 벽을 먼저 세우고 그 안의 일을 묻지 않습니다. 앞 표의 벽 장면에 가까우므로 물음은 적고 폴더 안의 삭제가 위험으로 남습니다.</p>
          <p className="leading-7">Claude Code는 분류기 심사로 시작하고 벽은 사용자가 켭니다. 앞 표의 심사 장면에 가까우므로 벽이 없는 동안에는 자식 프로세스의 전송을 운영체제가 막아 주지 않습니다. OpenClaw도 샌드박스가 기본 꺼짐이고 Gemini CLI는 플래그나 설정으로 켜며 켜더라도 macOS 기본 프로필은 네트워크를 허용합니다.</p>
          <p className="leading-7">전제가 다른 구현도 있습니다. OpenClaw는 메시지 채널에서 요청을 받는 게이트웨이라 코딩 CLI와 위협 상황이 다르고 OpenHands는 프로세스가 아니라 작업 공간 전체를 컨테이너에 넣습니다. 그래서 아래 표는 순위가 아니라 각 구현이 처음에 어디서부터 믿고 시작하는지를 보여 줍니다.</p>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="pb-2 text-left text-xs text-muted-foreground">
              2026-11-06에 공식 문서와 저장소에서 확인한 기본값입니다. Claude Code, Cursor, Antigravity는 소스를 볼 수 없어 문서로만 확인했습니다.
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-3 font-bold">구현</th>
                <th className="py-2 pr-3 font-bold">실행 전 심사</th>
                <th className="py-2 pr-3 font-bold">실행 중 벽</th>
                <th className="py-2 font-bold">벽 안의 네트워크</th>
              </tr>
            </thead>
            <tbody>
              {POSTURES.map((row) => (
                <tr key={row.name} className="border-b border-border align-top">
                  <td className="py-2 pr-3">
                    <span className="font-bold">{row.name}</span>
                    <span className="block text-xs text-muted-foreground">{row.version}</span>
                  </td>
                  <td className="py-2 pr-3">{row.approval}</td>
                  <td className="py-2 pr-3">{row.wall}</td>
                  <td className="py-2">{row.network}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ProgressiveDetail
          title="벽은 운영체제마다 어떤 기술로 만들어지나요?"
          preview="같은 Linux에서도 구현마다 기술이 다릅니다. 기술 이름이 같아도 기본 허용 범위는 같지 않습니다."
        >
          <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none max-w-none dark:prose-invert">
            <p className="leading-7">
              Claude Code는 macOS에서 Seatbelt를, Linux와 WSL2에서 bubblewrap을 쓰고 네이티브 Windows에서는 명령을 샌드박스 없이 실행합니다. Codex의 Linux 도우미는 파일과 namespace 격리에 bubblewrap을, 시스템 호출 필터에 seccomp를 씁니다.
            </p>
            <p className="leading-7">
              Antigravity는 Linux에서 커널 namespace를, macOS에서 <code>sandbox-exec</code>를, Windows에서 AppContainer를 씁니다. claw-code는 Linux의 <code>unshare</code>만 지원하고 다른 운영체제에서는 격리를 쓸 수 없다고 보고합니다. 네트워크 격리는 기본값이 꺼짐이라 켜지 않으면 사례의 전송이 그대로 나갑니다.
            </p>
          </div>
        </ProgressiveDetail>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            표의 값은 기준일이 지나면 달라집니다. 예를 들어 Codex 문서는 <code>untrusted</code> 승인 정책을 더는 지원하지 않으니 설정에서 지우라고 안내합니다. 이름을 외우기보다 쓰는 도구의 설정을 사례 다섯 명령으로 직접 대조하는 편이 오래 갑니다. 그 대조에서도 잡히지 않는 빈틈은 다음 절에서 봅니다.
          </p>
        </div>
      </section>

      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 둘을 다 켜도 남는 빈틈과 고르는 기준</h2>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none max-w-none dark:prose-invert">
          <p className="text-lg leading-8">앞 표의 피해 0건은 다섯 명령 안에서 센 숫자이고 안전 보증이 아닙니다. 사람이 물음마다 바르게 거부한다는 가정부터 깨지기 쉽고 벽에도 뚫린 곳이 있습니다.</p>
        </div>
        <WallGapsViz />
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none mt-6 max-w-none dark:prose-invert">
          <p className="leading-7">
            가장 흔한 빈틈은 벽 밖에서 도는 부품입니다. Claude Code 문서는 샌드박스가 셸 명령을 감쌀 뿐이고 내장 파일 도구, 훅, 로컬 MCP 서버는 그 밖에서 돈다고 적습니다. 셸만 막았다고 에이전트 전체를 막은 것이 아닙니다.
          </p>
          <p className="leading-7">
            허용한 목적지도 통로가 됩니다. 패키지 저장소를 열어 두면 그곳으로 올리는 전송도 같은 호스트로 향합니다. 벽이 호스트 이름만 본다면 내용은 구별하지 못합니다. 경계 밖 실행을 승인하는 순간에도 그 실행에는 벽이 없으니 심사 하나만 남습니다.
          </p>
          <p className="leading-7">
            OpenClaw 문서는 자기 샌드박스를 두고 완전한 보안 경계가 아니라고 직접 밝힙니다. 신뢰할 수 없는 코드를 돌린다면 프로세스 제한을 넘어{" "}
            <Link to="/cs/ai/sandbox-runtime-isolation#runtime-spectrum">격리 수준</Link>을 올리는 판단이 따로 필요합니다.
          </p>
          <p className="leading-7">
            고르는 기준은 사람이 곁에 있느냐와 무엇을 돌리느냐로 정리됩니다. 내 저장소를 보며 대화로 쓴다면 벽을 켜고 삭제와 배포처럼 되돌리기 어려운 일에 묻는 규칙을 더합니다. 사람 없이 돌린다면 묻는 관문이 사라지므로 벽과 격리 수준, 그리고 커밋 같은 복구 수단에 맡깁니다.
          </p>
          <p className="leading-7">
            피해 범위를 미리 좁힌다는 생각은{" "}
            <Link to="/cs/ai/agent-control-boundaries#blast-radius">최소 권한</Link>과 같은 뿌리입니다. 심사와 벽은 그 생각을 실행 전과 실행 중에 각각 적용한 것입니다.
          </p>
        </div>
      </section>

      <section id="prediction-questions" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 설정을 바꾸면 결과를 예측해 보세요</h2>
        <div className="prose prose-neutral prose-code:before:content-none prose-code:after:content-none max-w-none dark:prose-invert">
          <p className="leading-7">
            사례에 <code>cat ~/.ssh/id_rsa</code>를 여섯 번째 명령으로 더하면, 벽만 켠 Claude Code 기본값에서 읽기는 성공할까요? 외부로 나갈 수 있을까요? (답: 7절)
          </p>
          <p className="leading-7">
            Codex 구성에서 <code>network_access = true</code>로 바꾸면 앞 표의 피해 건수는 어떻게 달라질까요? (답: 3절, 6절)
          </p>
          <p className="leading-7">
            사람 없이 밤새 돌리는 작업에서 승인 정책만 엄격하게 올리면 무엇이 달라지고 무엇이 그대로일까요? (답: 4절, 9절)
          </p>
        </div>
      </section>
    </div>
  );
}
