import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

export default function Overview() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 긴 입력을 받더라도 이미 쓰던 답을 이어 가야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 사람이 이미 답을 받고 있는데 새로 긴 문서 하나가 도착했다고
            합시다. 긴 문서를 끝까지 읽느라 진행하던 답을 오래 멈추면 화면에는
            응답이 끊긴 것처럼 보입니다. 반대로 기존 답만 계속 처리하면 새
            문서가 시작하지 못합니다.
          </p>
          <p>
            이 글에서는 매번 처리할 양을 나눠 세 요청을 함께 진행합니다. 누가
            먼저인지, 얼마나 줄지, 기록 공간이 부족하면 누구를 잠시 뺄지, 실제
            결과를 다음 선택에 어떻게 반영할지를 한 사례로 연결합니다.
          </p>
        </div>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 진행 상태와 예산을 받아 이번 계산 목록을 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            입력은 각 요청의 현재 위치와 목표 위치, 기다리는 순서, 쓸 수 있는
            계산 양과 저장 공간입니다. 출력은 요청별 이번 처리량과 저장
            위치입니다. 계산 결과가 돌아오면 완료한 요청을 빼고 위치를 갱신한 뒤
            다시 선택합니다.
          </p>
          <p>
            이번에 처리하겠다고 정한 계획과 실제 끝난 결과는 구분합니다. 실행
            도중 취소되거나 공간을 확보하지 못했다면 다음 계획에 그 상태를
            반영해야 같은 일을 두 번 세거나 끝난 요청을 계속 붙들지 않습니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>각 요청의 남은 계산량을 읽는다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>이번 예산과 공간 안에서 배정한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>계산 결과를 요청에 연결한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>완료·중단·진행 위치를 갱신한다</span>
          </li>
        </ol>
      </section>
      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 기존 요청에 1개씩 주면 새 입력에는 3개가 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            진행 중인 R1과 R2가 각각 다음 문장 조각 1개를 처리해야 합니다. R1의
            목표 위치는 9, 이미 계산한 위치는 8이며 R2도 차이가 1입니다. 새 요청
            P는 입력 12조각을 아직 읽지 않았습니다. 각 조각은 모델이 처리하는
            단위이며 글자 수와 같지는 않습니다. (가정)
          </p>
          <p>
            한 번의 전체 처리 상한은 5조각이고 요청은 최대 3개입니다. 긴 입력
            하나의 처리 상한은 4조각으로 정합니다. 저장 공간은 충분하며 후보를
            미리 생성하는 기능과 비동기 겹침은 끕니다. R1·R2는 P의 입력을 읽는
            네 번의 계산 동안 계속 진행한다고 합시다. (가정)
          </p>
          <p>
            R1에 1개, R2에 1개를 주면 5−1−1=3개가 남습니다. P의 상한은 4개여도
            이번에는 3개만 넣습니다. 실제 계산이 끝나야 P의 읽은 위치가 0에서
            3으로 바뀌었다고 확인할 수 있습니다. (가정)
          </p>
        </div>
      </section>
      <section
        id="inside-scheduler"
        data-teach-level="1"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          4. 순서와 배정량, 저장 위치를 함께 기록합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            선택할 때는 먼저 이미 진행하던 요청을 검토합니다. 각 요청의 목표
            위치에서 계산한 위치를 빼 필요한 양을 구하고 예산과 공간 조건에 맞춰
            줄입니다. 뒤에서 어떤 요청을 빼면 이미 예약한 양도 되돌려야 합니다.
          </p>
          <p>
            새 요청에는 남은 예산과 빈 요청 자리만 줍니다. P의 입력 12개를 모두
            넣었다고 기록해 놓고 실제로 3개만 처리하면 다음 계획은 9개를
            건너뛰게 됩니다. 계획량·실제 진행·확정된 출력을 같은 요청 식별자로
            연결해야 하는 이유입니다.
          </p>
        </div>
      </section>
      <section id="why-scheduler" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 처리 순서만 정해도 긴 작업의 독점은 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 도착한 요청부터 고르더라도 긴 입력에 예산을 전부 주면 이미 답을
            받는 사용자가 기다립니다. 긴 입력을 4개로 제한해도 두 기존 요청을
            먼저 배정하면 남는 양은 3개입니다. 순서와 요청별 상한, 전체 상한을
            함께 봐야 합니다.
          </p>
          <p>
            처리할 수 있는 순서도 저장 공간 때문에 달라집니다. 앞 요청은 공간이
            부족하고 뒤의 작은 요청은 들어갈 수 있을 때 순서를 지키며 멈출지
            건너뛸지 정책을 정해야 합니다. 건너뛰기가 반복되면 큰 요청이
            시작하지 못할 수도 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
