import Overview from './claw-bash/Overview';
import ValidationPipeline from './claw-bash/ValidationPipeline';
import CommandIntentSection from './claw-bash/CommandIntent';
import Sandbox from './claw-bash/Sandbox';
import OriginalDiff from './claw-bash/OriginalDiff';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { codeRefs } from './claw-bash/codeRefs';

export default function ClawBashArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <QuestionLead
        question="명령 문자열에서 rm, sudo, curl을 잘 찾아내면 shell을 안전하게 실행할 수 있을까?"
        answer={<>아니다. pattern과 intent는 위험 신호를 만들 뿐 containment가 아니다. shell은 redirection, substitution과 자식 프로세스로 실행 중 새 행동을 구성하므로, 최종 경계는 OS sandbox와 process·resource control이 맡아야 한다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'signal과 enforcement', meaning: 'signal은 위험 가능성을 알려 주고, enforcement는 금지된 자원 접근을 실제로 실패시킨다.', why: '문자열 분류는 우회될 수 있지만 kernel sandbox는 syscall 결과를 제한한다.' },
          { term: 'process tree', meaning: 'shell PID뿐 아니라 그 shell이 만든 자식·손자 프로세스 전체.', why: '부모 한 개만 kill하면 background child가 남아 계속 파일이나 네트워크를 사용할 수 있다.' },
          { term: 'fail-open / fail-closed', meaning: 'sandbox가 없을 때 계속 실행할지, 위험 실행을 거부할지의 배포 정책.', why: '개발 환경의 편리한 fallback을 production 기본값으로 사용하면 containment가 사라진다.' },
          { term: 'exit semantics', meaning: 'exit code, stdout, stderr, signal, timeout을 함께 해석하는 계약.', why: 'grep의 no-match처럼 non-zero가 곧 시스템 오류가 아닌 명령도 있다.' },
        ]}
      />
      <Misconception>
        Permission에서 Allow가 나왔다는 것은 사용자가 요청할 수 있다는 뜻이다. command가 안전하다는 뜻이 아니며, file path check만으로 shell 내부에서 계산되는 path를 제한할 수도 없다.
      </Misconception>
      <Overview onCodeRef={sidebar.open} />
      <ValidationPipeline onCodeRef={sidebar.open} />
      <CommandIntentSection onCodeRef={sidebar.open} />
      <Sandbox onCodeRef={sidebar.open} />
      <OriginalDiff />
      <CapabilityCheck
        title="Production shell runner를 닫는 체크"
        items={[
          'validation 모듈의 존재와 production 호출 경로 연결 여부를 별도로 증명한다.',
          'pattern과 intent를 heuristic signal로 설명하고 containment라고 부르지 않는다.',
          'sandbox unavailable일 때 위험 명령을 거부하는 fail-closed profile을 둔다.',
          'workspace·network·secret 접근이 실제로 실패하는 부정 테스트를 둔다.',
          'timeout 때 PID 하나가 아니라 process group/job 전체를 종료하고 reap한다.',
          'background task registry, output, cancel, descendant cleanup을 구현한다.',
          'exit code, signal, timeout과 정책 거부를 서로 다른 결과로 감사한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-3 text-sm">
        <span>선행 1: <InternalLink slug="claw-permissions" learningPathId="ai-claw-security">Authorization decision</InternalLink></span>
        <span>선행 2: <InternalLink slug="claw-file-ops" learningPathId="ai-claw-security">구조화된 file boundary</InternalLink></span>
        <span>다음: <InternalLink slug="claw-worker-boot" learningPathId="ai-claw-lifecycle">화면 증거로 갱신하는 worker 실행 상태</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw bash.rs · ab4498', href: 'https://github.com/ultraworkers/claw-code/blob/ab44985916cb0d53d2f7a55ea90e0d7be97d4626/rust/crates/runtime/src/bash.rs', note: 'foreground/background 실행, timeout, output, sandbox launcher fallback의 고정 구현. 본문 코드 패널과 byte-identical하다.' },
          { label: 'Claw bash_validation.rs · ab4498', href: 'https://github.com/ultraworkers/claw-code/blob/ab44985916cb0d53d2f7a55ea90e0d7be97d4626/rust/crates/runtime/src/bash_validation.rs', note: 'Allow·Block·Warn, 네 단계 validation 후보, 여덟 intent heuristic의 고정 원문.' },
          { label: 'Claw sandbox.rs · ab4498', href: 'https://github.com/ultraworkers/claw-code/blob/ab44985916cb0d53d2f7a55ea90e0d7be97d4626/rust/crates/runtime/src/sandbox.rs', note: 'request/status 계산과 Linux unshare launcher 인자의 고정 원문.' },
          { label: 'Claw tools lib.rs · ab4498', href: 'https://github.com/ultraworkers/claw-code/blob/ab44985916cb0d53d2f7a55ea90e0d7be97d4626/rust/crates/tools/src/lib.rs', note: 'Bash 분류, optional enforcer dispatch, branch preflight gateway의 고정 원문. 본문 코드 패널은 필요한 세 범위를 byte-for-byte 추출한다.' },
          { label: 'GNU Bash manual', href: 'https://www.gnu.org/software/bash/manual/bash.html', note: 'pipeline, redirection, subshell, command substitution과 exit status의 기준.' },
          { label: 'Claude Code sandboxing', href: 'https://code.claude.com/docs/en/sandboxing', note: '운영 제품의 filesystem·network isolation과 permission 관계를 비교하기 위한 공식 설명.' },
          { label: 'GNU grep exit status', href: 'https://www.gnu.org/s/grep/manual/html_node/Exit-Status.html', note: '0=match, 1=no match, 2=error처럼 non-zero의 의미가 명령마다 다름을 보여 준다.' },
        ]}
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{}}
        projectMetas={{
          'claw-code': {
            id: 'claw-code',
            label: 'Claw Code · Rust',
            badgeClass: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
          },
        }}
      />
    </>
  );
}
