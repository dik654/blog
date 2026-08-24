import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function WeakSubjectivity({ title }: { title: string }) {
  return (
    <section id="weak-subjectivity" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}: sync-committee period와 같은 시간이 아니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Proof-of-stake에서 아주 오래 offline이었던 client는 이미 빠져나간 validator가 만든 장거리 history를 protocol message만으로
          구분하기 어렵습니다. Weak subjectivity는 최근 finalized checkpoint를 사회적·운영적으로 받아 이 장거리 모호성을 끊는 신뢰
          경계입니다. 자세한 정본은 <Link to="/blockchain/prysm-finality#weak-subjectivity">weak-subjectivity checkpoint</Link>가 소유합니다.
        </p>
      </div>
      <ExplainedFormula
        question="현재 slot 기준으로 checkpoint가 얼마나 오래됐는지 어떻게 계산할까요?"
        idea="Slot 차이를 network의 seconds-per-slot으로 바꿉니다. 이 나이는 구현 정책의 입력이며, 그 자체가 protocol의 보편적인 안전 기간은 아닙니다."
        formula={String.raw`age_{days}=\frac{(s_{now}-s_C)\,T_{slot}}{86{,}400}`}
        annotatedFormula={String.raw`age_{days}=\underbrace{\frac{(s_{now}-s_C)\,T_{slot}}{86{,}400}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{(s_{now}-s_C)\,T_{slot}}{86{,}400}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Slot 차이를 network의","seconds-per-slot으로 바꿉니다."] },
        ]}
        terms={[
          { symbol: "s_{now}", name: "현재 slot", description: "Genesis time과 local clock에서 계산한 network의 현재 slot" },
          { symbol: "s_C", name: "Checkpoint slot", description: "Trusted checkpoint가 속한 beacon slot" },
          { symbol: "T_{slot}", name: "Slot 시간", description: "해당 network config의 seconds per slot(초/slot)" },
          { symbol: "86{,}400", name: "하루의 초", description: "24×60×60 초/day 단위 변환" },
          { symbol: "age_{days}", name: "Checkpoint 나이", description: "현재와 checkpoint 사이의 경과 일수" },
        ]}
        assumptions={[
          "Local clock·genesis time·network config가 맞고 checkpoint slot이 현재보다 미래가 아닙니다.",
          "Weak-subjectivity period는 validator set·churn과 spec/config에 따라 계산하며 이 단순 age 식과 같지 않습니다.",
          "Helios의 strict two-week check는 확인한 구현 snapshot의 운영 정책이며 모든 light client의 protocol 상수가 아닙니다.",
        ]}
        interpretation="예를 들어 12초 slot에서 86,400 slots가 지났다면 12일입니다. 이 값이 14일보다 작다는 이유만으로 출처가 악의적이지 않다는 보장은 없고, 14일을 넘었다는 이유만으로 모든 network에서 같은 공격 조건이 성립한다고 일반화해서도 안 됩니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Sync committee가 mainnet preset에서 256 epochs, 즉 8,192 slots마다 바뀌는 약 27.3시간은 committee rotation 주기입니다.
          과거 글처럼 이를 weak-subjectivity 유효 기간으로 쓰면 전혀 다른 두 경계를 합치게 됩니다. Full validator나 consensus node도 오래
          offline이었다면 PoS의 weak-subjectivity bootstrap 문제를 피하지 못하며, “제네시스부터 실행하니 신뢰 입력이 없다”는 설명도 정확하지 않습니다.
        </p>
      </div>
    </section>
  );
}
