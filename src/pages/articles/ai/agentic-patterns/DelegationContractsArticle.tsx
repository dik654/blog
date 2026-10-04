import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { DelegationOwnershipViz } from "./viz/ModernAgentPatternViz";

export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 여러 작업자가 만든 결과를 어떻게 믿고 합칠까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            서로 다른 자료를 읽는 일은 나누면 빨라질 수 있습니다. 그러나 같은
            파일을 두 사람이 동시에 고치거나, 서로 다른 자료 버전을 읽은 결과를
            합치면 한 사람이 할 때 없던 충돌이 생깁니다.
          </p>
          <p>
            일을 나누기 전에 입력과 쓸 수 있는 위치, 제출할 결과, 합치는 책임을
            정합니다. 작업자 수보다 그 경계가 결과를 좌우합니다. 이 글은 자료 두
            개를 병렬로 읽어 하나의 보고서를 만드는 과정을 따라갑니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 나눠 읽고 따로 제출한 뒤 한곳에서 합칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            일을 나누는 쪽이 같은 기준 시점과 목표를 전달합니다. 각 작업자는
            자기 자료만 읽고 결과를 정해진 위치에 씁니다. 합치는 쪽은 자료
            버전과 근거를 확인한 뒤 최종 결과를 만듭니다.
          </p>
          <p>
            사용자에게 답할 책임이 누구에게 남는지도 정해야 합니다. 일부 조사만 부탁하는 것과 대화 전체를 다른 담당자에게 넘기는 것은 이후 미완료 상태의 소유자가 다릅니다. 실제
            제출물을 보며 이 차이를 확인합니다.
          </p>
        </div>
        <ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2">
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">1</span>
            <span>입력과 목표를 고정한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">2</span>
            <span>독립된 일을 수행한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">3</span>
            <span>근거가 붙은 결과를 제출한다</span>
          </li>
          <li className="border-l border-border pl-4">
            <span className="block text-sm text-muted-foreground">4</span>
            <span>검사한 뒤 최종 결과를 만든다</span>
          </li>
        </ol>
      </section>

      <section id="small-case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 두 문서의 3건과 2건을 합칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            작업자 A는 문서 1에서 문제 3건을, B는 문서 2에서 문제 2건을
            찾습니다. 두 문서는 같은 날짜에 고정한 판본이며 결과는 별도 파일에
            씁니다. 내용상 같은 문제가 1건 겹친다고 합시다. 이 숫자는
            가정입니다. (가정)
          </p>
          <p>
            최종 고유 문제 수는 3+2−1=4건입니다. 원문 위치 없이 3건과 2건이라는
            합계만 받으면 중복인지 다른 문제인지 판정할 수 없습니다. A의
            제출물을 두 번 받았을 때도 결과가 7건으로 늘어나면 안 됩니다. (가정)
          </p>
        </div>
      </section>

      <section
        id="inside-delegation"
        data-teach-level="1"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          4. 입력·쓰기·합치기·대화의 책임을 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            A와 B가 읽을 문서 판본은 일을 나누는 쪽이 고정합니다. 각각 쓸 파일을
            따로 지정하고 최종 보고서는 한 담당자가 작성합니다. 제출물에는
            발견한 문제, 근거 위치, 읽은 판본과 제출 식별자를 넣습니다.
          </p>
          <p>
            사용자 요청과 미완료 항목을 관리하는 쪽도 따로 정합니다. 자료 조사를
            요청했다면 원래 담당자가 최종 판단을 계속 맡습니다. 대화 자체를 넘길
            때는 이전에 실행한 일과 아직 확인하지 못한 결과도 함께 전달합니다.
          </p>
        </div>
      </section>

      <section
        id="why-delegation"
        data-teach-level="2"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          5. 같은 결과를 두 번 받거나 다른 판본을 읽을 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            A의 응답이 늦어 재요청했는데 두 제출물이 모두 돌아올 수 있습니다.
            제출 식별자를 확인하면 동일 결과를 두 번 합치는 일을 막습니다. B가
            최신 문서를 임의로 읽었다면 두 결과의 비교 기준이 달라졌으므로
            그대로 합치지 않습니다.
          </p>
          <p>
            같은 파일에 두 작업자가 동시에 쓰는 경우에는 어느 내용을 채택할지
            정해야 합니다. 각자 자기 출력에 쓰고 한곳에서 검사해 합치는 방식은
            이 충돌을 줄입니다. 이런 역할에 이름을 붙이면 위임 요청도 구체적으로
            쓸 수 있습니다.
          </p>
        </div>
      </section>

      <section
        id="delegation-contract"
        data-teach-level="3"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          6. 일을 맡기는 요청에도 입력과 반환 조건이 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            작업을 넘기는 행위가 delegation입니다. 위임 요청에는 목표, 입력
            판본, 허용 범위, 결과 형식, 기한과 완료 검사를 적습니다. 이 글에서는
            이런 묶음을 delegation contract라고 부릅니다.
          </p>
        </div>
        <TermBreakdown
          title="역할을 이해한 뒤 이름을 붙입니다"
          items={[
            {
              term: "Input owner",
              description: "읽을 자료와 그 판본을 고정하는 담당자입니다.",
              boundary:
                "각자 움직이는 최신 자료를 읽으면 결과의 기준 시점이 달라집니다.",
            },
            {
              term: "Artifact writer",
              description: "지정된 결과를 작성하는 담당자입니다.",
              boundary:
                "공유 파일의 자유로운 동시 쓰기는 충돌 정책이 필요합니다.",
            },
            {
              term: "Merge owner",
              description:
                "근거·형식·중복·충돌을 확인하고 최종 결과를 합치는 담당자입니다.",
              boundary: "작업자의 완료 문장만으로 제출물을 채택하지 않습니다.",
            },
            {
              term: "Conversation-state owner",
              description:
                "사용자 요청·미완료 행동·최종 답변을 이어 관리하는 담당자입니다.",
              boundary: "조사 위임과 대화 인계는 소유권이 다릅니다.",
            },
            {
              term: "Manager call",
              description:
                "중앙 담당자가 전문가를 도구처럼 호출해 결과를 받습니다.",
              boundary: "최종 대화 책임은 중앙에 남습니다.",
            },
            {
              term: "Handoff",
              description: "대화의 다음 처리 책임을 다른 담당자에게 넘깁니다.",
              boundary: "미완료 실행과 승인 상태도 전달해야 합니다.",
            },
            {
              term: "Idempotent merge",
              description:
                "같은 제출물을 반복 적용해도 한 번 적용한 결과와 같습니다.",
              boundary:
                "각 시도마다 새 제출 식별자를 만들면 중복 판별이 깨질 수 있습니다.",
            },
            {
              term: "Commutative merge",
              description:
                "결과의 도착 순서가 바뀌어도 같은 최종 결과를 만듭니다.",
              boundary: "상충하는 수정안을 단순 덮어쓰면 이 성질이 없습니다.",
            },
          ]}
        />
        <DelegationOwnershipViz />
      </section>

      <section
        id="manager-handoff"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          7. 제출 식별자로 중복을 빼고 네 문제를 남깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            A는 receipt=A1, sources=doc1:r1, issues=&#123;x,y,z&#125;를, B는
            receipt=B1, sources=doc2:r1, issues=&#123;z,w&#125;를 제출합니다.
            Merge owner가 각 문제의 원문 위치를 확인하고 같은 z를 하나로 합치면
            &#123;x,y,z,w&#125;, 4건입니다. (가정)
          </p>
          <p>
            A1이 다시 오면 이미 적용한 제출물로 표시해 결과를 그대로 둡니다.
            내용이 다른데 식별자만 같다면 덮어쓰지 않고 충돌로 보고합니다.
            의미가 비슷하다는 이유만으로 다른 문제를 같은 z로 강제하지 않습니다.
            (가정)
          </p>
          <p>
            이 조사는 manager call이므로 중앙 담당자가 최종 보고서를 씁니다.
            Handoff로 바꾸려면 새 담당자에게 아직 확인 중인 문제와 A1·B1 적용
            여부까지 넘겨야 합니다. 반환 파일뿐 아니라 다음 대화 책임도 다르다는
            뜻입니다.
          </p>
        </div>
      </section>

      <section
        id="parallel-merge"
        data-teach-level="5"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          8. 공식 위임 구조를 제출물에 적용합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            OpenAI의 실무 가이드는 중앙 관리자가 전문가를 도구처럼 부르는
            manager 구조와, 담당을 넘기는 decentralized 구조를 구분합니다.
            다음은 관리자가 결과를 통합하는 역할을 가리키는 원문의 짧은
            표현입니다.
          </p>
        </div>
        <div id="paper-openai-agent-guide" className="mt-8 scroll-mt-20">
          <CitationBlock
            source="OpenAI — A practical guide to building agents, Multi-agent systems"
            citeKey={1}
            href="https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/"
          >
            <q>
              one agent to control workflow execution and have access to the
              user
            </q>
          </CitationBlock>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              이 사례에서는 A1과 B1을 받아 최종 4건으로 정리하는 담당자가 manager입니다. 문서가 제시하는 구조를 이 예에 대응한 것이며 중복 식별과 판본 검사는 애플리케이션이
              별도로 설계해야 합니다. 위임 자체가 이 검사를 자동으로 보장하지 않습니다. (가정)
            </p>
          </div>
        </div>
        <AlgorithmBlock
          title="제출물 합치기 (의사코드)"
          input={[
            "고정한 입력 판본과 제출물 A1·B1",
            "허용된 결과 형식과 원문 확인 규칙",
          ]}
          steps={[
            {
              code: "check_schema_and_source_revision(result)",
              note: "제출물 형식과 입력 판본을 확인합니다.",
            },
            {
              code: "if receipt already applied: compare_digest; return",
              note: "동일 제출은 생략하고 다른 내용이면 충돌을 알립니다.",
            },
            {
              code: "verify_issue_evidence(result.issues)",
              note: "원문 위치가 주장을 뒷받침하는지 확인합니다.",
            },
            {
              code: "merge_distinct_issues(); record(receipt)",
              note: "의미와 근거가 같은 항목만 중복 처리합니다.",
            },
          ]}
          output="근거가 연결된 고유 문제 4건과 적용한 제출 목록"
        />
      </section>

      <section
        id="delegation-boundaries"
        data-teach-level="7"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          9. 병렬 실행의 비용과 상관된 오류가 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            자료가 독립적일 때는 병렬 읽기가 유리하지만 합치는 비용이 더 클 수도
            있습니다. 같은 가정을 공유한 여러 작업자가 같은 오류를 반복하면 투표
            수만 늘어납니다. 역할을 나눴다는 사실과 독립적인 검증은 다릅니다.
          </p>
          <p>
            한 파일의 같은 구간을 수정해야 한다면 변경을 순서대로 적용하거나
            충돌을 검출합니다. 작업자를 늘리기 전에 독립된 입력과 출력 경계를
            만들 수 있는지 확인합니다. 실제 구현은{" "}
            <a href="/cs/ai/multi-agent-implementation">Multi-agent 구현</a>에서
            이어집니다.
          </p>
        </div>
        <ContentBoundary article="agent-delegation-contracts" />
      </section>

      <section
        id="prediction-questions"
        data-teach-level="review"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          10. 도착 순서가 달라져도 결과가 같을까요
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            A1이 두 번 도착하면 최종 문제 수는 얼마여야 하며 무엇으로 중복을
            확인하나요? (답: 7절)
          </p>
          <p>
            B가 doc2:r2를 읽었습니다. doc1:r1과 바로 합쳐도 되는지 무엇을
            확인하나요? (답: 5절)
          </p>
          <p>
            조사만 위임하는 경우와 대화까지 넘기는 경우, 최종 답변과 미완료
            실행의 책임은 어떻게 달라지나요? (답: 7절)
          </p>
        </div>
      </section>
    </div>
  );
}
