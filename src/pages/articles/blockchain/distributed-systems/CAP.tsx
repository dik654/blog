import ExplainedFormula from "@/components/ui/explained-formula";
import CAPViz from "./viz/CAPViz";

export default function CAP() {
  return (
    <section id="cap" className="scroll-mt-20">
      <header className="space-y-4">
        <p className="text-sm font-bold text-primary">03 · 분할 한계</p>
        <h2 className="text-2xl font-bold">CAP는 분할 중 두 약속의 충돌을 보입니다</h2>
        <p className="max-w-3xl text-lg leading-8 text-foreground/90">
          서로 연락할 수 없는 두 복제본에서 한쪽 쓰기가 완료된 뒤 다른 쪽이 읽기 요청을 받으면 무엇을 답할 수 있을까요? 먼저 실제 요청 순서를 확인합니다.
        </p>
      </header>

      <CAPViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>여기서 사용하는 세 단어는 평소 뜻보다 좁습니다</h3>
        <p>
          Gilbert와 Lynch의 모델에서 consistency는 모든 연산이 단일 복제본에서 한 순간씩 실행된 것처럼 보이는 <strong>linearizability</strong>입니다. Availability는 고장 나지 않은 노드가 받은 모든 요청에 결국 non-error 응답을 주는 성질입니다. Partition tolerance는 따로 켜는 기능이 아니라, 노드 집합 사이의 메시지가 계속 손실되는 실행도 모델에 포함한다는 뜻입니다.
        </p>
      </div>

      <ExplainedFormula
        question="분할 중 linearizability와 모든 요청의 응답을 왜 동시에 보장할 수 없을까요?"
        idea="A에서 완료된 쓰기를 B가 알 수 없도록 두 복제본 사이 메시지를 끊습니다. B가 예전 값을 답하면 최신성 약속을 깨고, 확인할 때까지 기다리거나 오류를 내면 응답 약속을 깹니다."
        formula={String.raw`P \Longrightarrow \neg(C_{lin} \land A_{resp})`}
        annotatedFormula={String.raw`\underbrace{P}_{\text{복제본 사이 분할}} \Longrightarrow \underbrace{\neg(C_{lin} \land A_{resp})}_{\text{두 약속의 동시 보장 불가}}`}
        operations={[
          { expression: String.raw`P \Longrightarrow`, annotation: ["A와 B 사이 메시지가 손실됩니다.", "A의 x=1 쓰기는 성공 응답까지 끝납니다."] },
          { expression: String.raw`\neg(C_{lin} \land A_{resp})`, annotation: ["B가 0을 답하면 linearizability 위반", "기다리거나 오류면 availability 위반"] },
        ]}
        terms={[
          { symbol: "P", name: "Partition execution", description: "복제본 집합 사이 메시지 손실이 지속되는 실행" },
          { symbol: "C_{lin}", name: "Linearizability", description: "실제 시간의 선후 관계를 보존하는 단일 연산 순서" },
          { symbol: "A_{resp}", name: "Response availability", description: "고장 나지 않은 노드의 모든 요청에 eventual non-error response" },
        ]}
        assumptions={[
          "분할 양쪽의 고장 나지 않은 노드가 각각 클라이언트 요청을 받습니다.",
          "Consistency와 availability는 Gilbert–Lynch 논문의 강한 정의를 사용합니다.",
        ]}
        interpretation="이 식은 정상 구간에서 언제나 일관성과 속도 중 하나를 버리라는 뜻이 아닙니다. 메시지가 실제로 끊긴 실행에서 두 정의를 동시에 만족할 수 없다는 뜻입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>제품을 CP·AP 한 글자로 고정하는 표가 아닙니다</h3>
        <p>
          CAP의 availability는 99.99% 같은 운영 SLA가 아니며, 정상 구간의 지연 시간도 직접 설명하지 않습니다. 실제 시스템은 key와 연산에 따라 읽기·쓰기 정책을 달리할 수 있고, 분할이 끝난 뒤 충돌을 조정할 수도 있습니다. 다만 위와 같은 실행에서는 linearizability와 모든 요청의 non-error 응답을 동시에 약속할 수 없습니다.
        </p>
      </div>

      <aside id="paper-gilbert-lynch-cap" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">원 논문 · CAP의 정의</p>
        <p className="mt-2 text-sm font-semibold">Brewer&apos;s Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Gilbert와 Lynch는 비동기 네트워크에서 atomic read/write object, 모든 요청의 응답, 임의 메시지 손실을 각각 정의하고 세 성질을 함께 만족할 수 없음을 보입니다. 이 결론을 모든 종류의 consistency나 평상시 latency로 일반화하면 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf" target="_blank" rel="noreferrer">Gilbert–Lynch 원문 보기</a>
      </aside>
    </section>
  );
}
