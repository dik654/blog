import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BannedPatternsViz from './viz/BannedPatternsViz';
import ValidationStagesViz from './viz/ValidationStagesViz';

export default function ValidationPipeline({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="validation-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">검증 모듈: 존재와 연결은 다른 사실이다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>bash_validation.rs</code>에는 쓸 만한 후보 파이프라인이 있다. 하지만 repository 호출
          지점을 추적하면 <code>validate_command()</code>의 호출자는 같은 파일의 test뿐이고,
          production의 <code>run_bash()</code>는 branch preflight 뒤 <code>execute_bash()</code>로
          간다. preflight는 branch freshness용 조기 반환이지 이 네 단계 validation의 연결점이 아니다.
          문서를 읽을 때는 “함수가 있다”를 “모든 실행에 강제된다”로 바꾸지 않아야 한다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('validation-pipeline', codeRefs['validation-pipeline'])}
            label="검증 결과와 intent 타입 보기"
          />
          <CodeViewButton
            onClick={() => onCodeRef('intent-classifier', codeRefs['intent-classifier'])}
            label="4단계 함수와 wiring 단서 보기"
          />
        </div>
        <h3>후보 파이프라인의 실제 네 단계</h3>
        <p>
          함수가 연결됐다고 가정해도 순서는 mode, <code>sed -i</code>, destructive warning, path
          heuristic의 네 단계다. 첫 <code>Allow</code>가 아닌 결과에서 즉시 반환하므로 뒤의 검사는
          실행되지 않는다. 이 short-circuit는 단순하지만 한 command에서 여러 위험을 동시에 설명하지는
          못한다.
        </p>
      </div>

      <ValidationStagesViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Allow, Block, Warn은 세 개의 서로 다른 계약이다</h3>
        <p>
          <code>Block</code>은 실행 금지다. <code>Warn</code>은 사용자 확인이나 상위 policy가 결정을
          이어 받아야 한다는 신호다. 그러므로 호출자가 Warn을 Allow처럼 처리하면 위험 패턴 목록을 아무리
          늘려도 방어가 되지 않는다. 반대로 모든 Warn을 무조건 Block하면 합법적인 작업이 지나치게 막힌다.
        </p>
        <p>
          production 연결에는 <strong>validation result → permission prompt → 승인 기록 → sandbox
          profile</strong>의 명시적 변환이 필요하다. 그리고 public entry point가 enforcer 없이 호출될
          수 있는지도 함께 막아야 한다.
        </p>
      </div>

      <BannedPatternsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          현재 destructive 검사는 root·home·현재 디렉터리 대상 <code>rm -rf</code>, filesystem 생성,
          raw disk write, 넓은 chmod, fork bomb 같은 substring과 <code>shred</code>,
          <code>wipefs</code>의 첫 command를 찾는다. 매치 결과는 모두 <strong>Warn</strong>이다.
          Low/Medium/High/Critical 네 등급이나 절대 deny 목록은 이 소스에 없다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton
            onClick={() => onCodeRef('destructive-signals', codeRefs['destructive-signals'])}
            label="destructive signal의 실제 반환값 보기"
          />
        </div>

        <h3>문자열 검사의 올바른 역할</h3>
        <p>
          <code>../</code>, <code>$HOME</code>, <code>rm -rf</code>를 찾는 검사는 빠른 설명과 prompt
          routing에 유용하다. 하지만 quote, variable expansion, command substitution, script
          interpreter, symlink, 실행 중 생성되는 path를 완전히 해석하지 못한다. 따라서 통과는 “안전
          증명”이 아니라 “알려진 신호를 발견하지 못함”이다.
        </p>
        <div className="not-prose my-5 grid gap-3 md:grid-cols-3">
          {[
            ['정적 신호', '어떤 이유로 승인을 요구했는지 짧고 이해하기 쉽게 설명한다.'],
            ['OS 강제', '분류가 틀려도 금지한 filesystem·network 접근이 실제로 실패하게 한다.'],
            ['감사', '누가 Warn을 승인했고 어떤 sandbox에서 무엇이 실행됐는지 연결해 남긴다.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-border p-4">
              <p className="m-0 text-sm font-semibold">{title}</p>
              <p className="mb-0 mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
