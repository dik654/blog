import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SandboxViz from './viz/SandboxViz';

export default function Sandbox({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sandbox" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SandboxStatus와 실제 강제를 분리해서 읽기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 snapshot의 Linux launcher는 bubblewrap이 아니라 <code>unshare</code>다. user, mount,
          IPC, PID, UTS namespace를 요청하고 설정에 따라 network namespace도 추가한다. 중요한 질문은
          “sandbox라는 이름이 있는가”가 아니라 <strong>어떤 자원이 실제로 격리됐는가</strong>다.
        </p>
        <p>
          소스는 requested, supported, active, fallback reason을 나눠 기록한다. 이 구분은 좋다. 다만
          status field의 이름만 믿지 말고 launcher가 그 field를 어떤 OS option으로 바꾸는지 끝까지
          추적해야 한다.
        </p>
        <p>
          특히 현재 builder는 <code>namespace_active</code> 값과 무관하게 launcher를 만들기만 하면
          <code>--user --mount --ipc --pid --uts</code>를 모두 넣고, <code>--net</code>만
          <code>network_active</code>에 따라 추가한다. 따라서 network만 요청한 상태에서는
          <code>namespace_active=false</code>인데도 여러 namespace가 실제 command에 들어간다.
          status와 OS 인자를 같은 사실로 읽으면 안 되는 구체적인 반례다.
        </p>
      </div>

      <SandboxViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('sandbox-status', codeRefs['sandbox-status'])}
            label="request·support·active 계산 보기"
          />
          <CodeViewButton
            onClick={() => onCodeRef('unshare-command', codeRefs['unshare-command'])}
            label="실제 unshare 인자 보기"
          />
        </div>

        <h3>요청, 지원, 활성의 세 문장</h3>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['requested', '사용자와 config가 namespace, network, filesystem mode를 원한다고 적었다.'],
            ['supported', '현재 Linux 환경에서 unshare user namespace probe가 성공했다.'],
            ['active', '요청한 namespace/network 조건이 지원돼 launcher에 반영될 수 있다.'],
            ['enforced', '실제 child process의 금지된 syscall이나 path 접근이 실패했다. 별도 검증이 필요하다.'],
          ].map(([term, meaning]) => (
            <div key={term} className="grid gap-2 px-4 py-3 sm:grid-cols-[110px_minmax(0,1fr)]">
              <code className="text-[13px] font-semibold">{term}</code>
              <span className="text-sm leading-relaxed text-muted-foreground">{meaning}</span>
            </div>
          ))}
        </div>

        <h3>현재 filesystem mode의 핵심 공백</h3>
        <p>
          <code>filesystem_active</code>는 sandbox가 enabled이고 mode가 Off가 아니면 true가 된다.
          하지만 <code>build_linux_sandbox_command()</code>는 workspace나 allow-list를 bind mount로
          제한하지 않는다. mode와 allowed mounts를 환경변수로 child에게 전달하고 HOME/TMPDIR를
          workspace 하위로 바꿀 뿐이다. 환경변수는 shell의 절대 경로 접근을 강제로 막지 않는다.
        </p>
        <p>
          따라서 현재 코드에서 <code>workspace-only</code>를 “workspace 밖을 읽거나 쓸 수 없음”으로
          설명하면 안 된다. 이 보장을 만들려면 mount namespace 안에서 read-only root와 writable
          workspace를 실제로 구성하거나, 검증된 별도 sandbox backend가 필요하다.
        </p>

        <h3>launcher가 없을 때는 fail-open</h3>
        <p>
          Linux가 아니거나 sandbox가 꺼졌거나 <code>namespace_active</code>와
          <code>network_active</code>가 <strong>둘 다 false</strong>면 builder는 <code>None</code>을
          반환한다. 둘 중 하나라도 true면 launcher를 만든다. launcher가 없을 때 실행 코드는 거부하지
          않고 host의 <code>sh -lc</code>로 fallback한다. config load 실패도 default config로
          이어진다. 개발자 대화형 profile에서는 편리할 수 있지만 unattended worker의 안전한 기본값은
          아니다.
        </p>
        <div className="not-prose my-5 grid gap-3 md:grid-cols-3">
          {[
            ['개발 profile', '명시적 Ask와 눈에 띄는 unsandboxed 배지를 전제로 제한적으로 허용한다.'],
            ['Production profile', '필수 isolation probe가 실패하면 worker를 unhealthy로 만들거나 위험 실행을 거부한다.'],
            ['CI profile', '상위 container를 경계로 삼았다면 image, mounts, network policy를 실행 record에 남긴다.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-border p-4">
              <p className="m-0 text-sm font-semibold">{title}</p>
              <p className="mb-0 mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <h3>보장 여부는 부정 테스트로 확인한다</h3>
        <p>
          status 값만 assert하지 말고 sandbox 안 command가 <code>/etc</code> 쓰기, workspace 밖
          읽기, 외부 network 연결, 다른 process signal 보내기에 실제로 실패하는지 시험해야 한다.
          timeout test도 응답 시간이 아니라 child와 grandchild가 사라지고 reap됐는지를 확인해야 한다.
        </p>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['filesystem', 'workspace 안 write는 성공하고, workspace 밖 read/write는 실패하는가?'],
            ['network', 'isolateNetwork=true에서 DNS와 직접 IP 연결이 모두 실패하는가?'],
            ['process', 'namespace 밖 PID 관찰과 signal 전송이 실패하는가?'],
            ['lifecycle', 'timeout/cancel 뒤 descendant와 pipe reader가 남지 않는가?'],
            ['fallback', '필수 기능이 없을 때 조용히 host 실행으로 내려가지 않는가?'],
          ].map(([area, check]) => (
            <div key={area} className="grid gap-2 px-4 py-3 sm:grid-cols-[110px_minmax(0,1fr)]">
              <strong className="text-sm">{area}</strong>
              <span className="text-sm leading-relaxed text-muted-foreground">{check}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
