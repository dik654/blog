import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";

export default function Overview() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 짧은 답이 먼저 끝나면 다음 요청을 시작해야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 사람이 문장 생성을 요청했다고 합시다. 한 사람의 답은 짧고 다른
            사람의 답은 깁니다. 두 답이 모두 끝날 때까지 새 요청을 받지 못한다면
            짧은 답이 끝난 자리도 오래 비워 둡니다. 온라인 서비스는 이런 빈
            시간을 줄이면서 먼저 시작한 답도 계속 이어야 합니다.
          </p>
          <p>
            이 글에서는 서로 길이가 다른 세 요청을 한 번의 계산마다 다시
            조합합니다. 무엇을 기다리게 하고 무엇을 메모리에 남기는지 알면
            처리량을 높인 설정이 왜 첫 응답을 늦출 수도 있는지 이해할 수
            있습니다.
          </p>
        </div>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 받고 고르고 계산하고 결과를 돌려줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            바깥에서 보면 문장이 들어오고 생성한 문장 조각이 차례로 나갑니다.
            안에서는 요청 기록을 보관하는 자리, 이번 계산에 넣을 양을 고르는
            자리, 실제 계산을 수행하는 자리가 이어집니다. 계산 결과가 돌아오면
            끝난 요청을 빼고 남은 요청의 진행 상태를 갱신합니다.
          </p>
          <p>
            매번 새 요청을 모두 실행할 수는 없습니다. 이번에 계산할 양, 함께
            진행할 요청 수, 다음 계산에 남길 기록 공간에 각각 제한이 있습니다.
            우선 세 제한 안에서 움직이는 작은 사례를 만들겠습니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>입력 문장과 요청 식별자를 받는다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>이번에 처리할 요청과 양을 고른다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>계산하고 요청별 기록을 갱신한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>출력을 보내고 완료한 요청을 뺀다</span>
          </li>
        </ol>
      </section>
      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 한 번에 4조각, 요청은 최대 2개를 처리합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            A의 입력은 6조각이고 원하는 출력은 3조각입니다. B는 입력 2조각·출력 2조각이며 나중에 오는 C는 입력 3조각·출력 1조각입니다. 조각은 모델이 처리하는 정수 단위로만
            생각하면 됩니다. 실제 문장의 글자 수와 같다고 가정하지 않습니다. (가정)
          </p>
          <p>
            한 번의 계산에서 처리할 조각은 최대 4개, 함께 진행할 요청은 최대 2개입니다. 기록을 저장할 메모리는 충분하며 입력 재사용과 미리 여러 후보를 만드는 기능은 끕니다. A와
            B가 기다리며 C는 세 번째 계산이 끝난 뒤 도착한다고 정합니다. (가정)
          </p>
          <p>
            처음에는 A의 입력 4조각만 읽습니다. 다음에는 A의 남은 2조각과 B의
            2조각을 함께 읽습니다. 각 입력을 다 읽으면 첫 출력 조각을 고를 수
            있습니다. 입력을 4조각 처리했다고 출력도 4조각 생기는 것은 아닙니다.
            (가정)
          </p>
        </div>
      </section>
      <section id="inside-engine" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 각 요청은 읽은 위치와 남겨 둔 기록이 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            A를 4조각 읽은 뒤에는 읽은 위치가 4이고 아직 입력 2조각이 남습니다.
            다음 계산에서 처음부터 읽지 않도록 이미 처리한 부분의 중간 결과를
            저장합니다. B는 자기 입력과 별도의 진행 기록을 가집니다.
          </p>
          <p>
            선택 담당자는 남은 계산 양을 줄이고 필요한 저장 공간을 확보합니다.
            계산 담당자가 실제 결과를 돌려주면 요청 식별자로 맞춰 출력과 진행
            위치를 갱신합니다. 끝난 요청의 작업 자리는 새 요청에 넘길 수
            있습니다.
          </p>
          <p>
            저장 기록 일부는 이후 입력에서 재사용하도록 남길 수 있습니다. 요청이
            끝났다는 사실이 모든 메모리를 즉시 지웠다는 뜻은 아니라는 점도
            기억해 둡니다.
          </p>
        </div>
      </section>
      <section id="why-engine" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          5. 처리할 양과 저장할 공간을 따로 제한해야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            두 번째 계산에는 A와 B의 입력 2조각씩이 들어가 합계 4조각입니다.
            요청 수만 보면 2개지만 한 요청의 긴 입력을 한꺼번에 넣으면 계산 양은
            훨씬 커질 수 있습니다. 요청 수 제한만으로 한 번의 계산 시간을 제한할
            수 없는 이유입니다.
          </p>
          <p>
            반대로 계산 여유가 있어도 각 요청의 중간 결과를 저장할 공간이 없으면
            진행할 수 없습니다. 기록을 비우고 나중에 다시 계산하거나 일부 요청을
            기다리게 해야 합니다. 계산량과 저장량은 서로 대신할 수 없는
            조건입니다.
          </p>
          <p>
            긴 입력 하나를 나누어 읽으면 이미 답을 쓰는 요청이 중간에 진행할
            기회를 얻습니다. 다만 너무 잘게 나누면 실행 준비 비용이 커질 수
            있습니다. 이제 이 역할과 처리 단계에 이름을 붙이겠습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
