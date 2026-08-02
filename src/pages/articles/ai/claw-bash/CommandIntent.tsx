import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import DestructiveLevelViz from './viz/DestructiveLevelViz';
import IntentCategoriesViz from './viz/IntentCategoriesViz';

export default function CommandIntentSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="command-intent" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">CommandIntent는 행동의 근사치다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          intent 분류기는 command 전체를 실행해 보지 않고 “대체로 어떤 종류의 행동인가”라는 label을
          붙인다. 현재 구현은 선행 환경변수 할당을 건너뛴 뒤 첫 command를 뽑고, 명령 목록과 일부
          <code>git</code>/<code>sed</code> 특수 규칙으로 여덟 category 중 하나를 고른다.
        </p>
        <p>
          이 label은 prompt 문구, 요구 permission, telemetry를 고르는 데 유용하다. 그러나 parser나
          sandbox verdict가 아니다. 특히 <code>Unknown</code>은 안전이 아니라 “이 분류기로 알 수
          없음”을 뜻한다.
        </p>
      </div>

      <IntentCategoriesViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose my-4">
          <CodeViewButton
            onClick={() => onCodeRef('intent-classifier', codeRefs['intent-classifier'])}
            label="첫 command 분류 코드 보기"
          />
        </div>
        <h3>첫 command만 보면 사라지는 행동</h3>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['echo ok > config', '첫 command는 read-like처럼 보이지만 redirection이 파일을 쓴다.'],
            ['cat list | xargs rm', '앞의 cat보다 pipeline 뒤의 rm이 실제 side effect를 만든다.'],
            ['find . -exec sh -c …', 'find 자체는 탐색 명령이지만 option이 임의 command를 실행한다.'],
            ['python -c "…"', 'interpreter 뒤 문자열 안의 filesystem·network 행동은 basename 목록에 없다.'],
            ['cmd=$(curl …); eval "$cmd"', 'substitution과 eval이 실행할 행동을 runtime에 조립한다.'],
          ].map(([command, gap]) => (
            <div key={command} className="grid gap-2 px-4 py-3 md:grid-cols-[220px_minmax(0,1fr)]">
              <code className="break-words whitespace-normal text-[13px] font-semibold">{command}</code>
              <span className="text-sm leading-relaxed text-muted-foreground">{gap}</span>
            </div>
          ))}
        </div>

        <h3>위험도 등급이 아니라 두 갈래 결과</h3>
        <p>
          destructive helper는 정교한 risk score를 계산하지 않는다. 알려진 substring 또는 broad
          <code>rm -rf</code>를 찾으면 Warn, 아니면 Allow다. category와 warning을 합쳐 Low에서
          Critical까지 표시하는 것은 현재 코드보다 강한 기능을 발명하는 셈이다.
        </p>
      </div>

      <DestructiveLevelViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>더 깊은 parser를 붙이면 무엇이 달라지는가</h3>
        <p>
          shell AST는 pipeline의 각 command, redirection 대상, subshell, heredoc, command
          substitution을 구조로 드러낸다. 그래도 완전한 안전 판정은 불가능하다. 외부 script와
          interpreter가 runtime 행동을 다시 만들기 때문이다. 목표는 “완벽한 정적 판정”이 아니라
          <strong>더 정확한 승인 설명 + 최소권한 sandbox + 실행 후 trace</strong>다.
        </p>
        <div className="not-prose my-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border p-4">
            <p className="m-0 text-sm font-semibold">분류 확신이 높을 때</p>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-muted-foreground">
              좁은 prompt와 필요한 resource만 연다. 예: read-only filesystem, network off.
            </p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="m-0 text-sm font-semibold">복합 syntax 또는 Unknown일 때</p>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-muted-foreground">
              더 강한 sandbox나 명시적 Ask로 올리고, sandbox가 없으면 fail-closed한다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
