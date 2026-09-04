import ExplainedFormula from "@/components/ui/explained-formula";
import ArchitectureViz from "./viz/ArchitectureViz";

export default function Architecture() {
  return <section id="architecture" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">분해 패턴을 고르기 전에 worker가 무엇을 받아 무엇을 반환하고, 누가 합칠지부터 계약합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Coordinator–worker는 범위와 owner를 나누기 쉽고 map–reduce는 같은 schema의 독립 작업에 적합합니다. 작성과 검증 context를 분리하는 쪽은
            Actor–reviewer인데, test나 rubric이 없으면 의견만 한 번 더 생성합니다. Debate는 열린 판단에서 관점 차이가 실제 가치가 있을 때만
            round·budget·최종 판정자를 제한합니다.
          </p><p>이 네 패턴은 모두 <strong>agent role specialization</strong>의 예시입니다. 각 agent instance에 서로 다른 input·tool·artifact 범위를 부여해 한 agent가 모든 context를 떠안지 않게 나누는 일입니다. 나뉜 역할이 실제로 맞물리려면 실행 순서·의존성·합류 시점을 맞추는 <strong>agent coordination</strong>이 함께 있어야 하고, 아래 join 조건이 그 coordination을 완료로 판정하는 기준입니다.</p><p>
            Worker output에는 task ID, input snapshot, artifact URI/hash, evidence, validation status,
            uncertainty와 retry-safe receipt가 담깁니다. 자연어 보고 하나로 끝나지 않습니다. 그래서 coordinator가 원문 전체를 다시 읽지 않고
            schema와 충돌·누락만 확인할 수 있어야 분리 효과가 남습니다.
          </p></div><ExplainedFormula question="여러 worker 결과를 합친 output이 완료됐다고 언제 판정할까요?" idea={<>필수 task ID 집합과 성공 receipt가 있는 task ID 집합이 같고, artifact 충돌이 없으며 전역 validator가 통과해야 합니다.</>} formula={String.raw`\begin{aligned}
J_R&=\mathbf 1[R=K]\\
J_A&=\mathbf 1[\operatorname{conflicts}(A)=\varnothing]\\
\operatorname{join\_ok}&=J_RJ_A\mathbf 1[V(A)=1]
\end{aligned}`}
  annotatedFormula={String.raw`\begin{aligned}
J_R&=\underbrace{\mathbf 1[R=K]}_{\text{required tasks 계산}}\\
J_A&=\underbrace{\mathbf 1[\operatorname{conflicts}(A)=\varnothing]}_{\text{artifacts 계산}}\\
\operatorname{join\_ok}&=\underbrace{J_RJ_A\mathbf 1[V(A)=1]}_{\text{artifacts 계산}}
\end{aligned}`}
  operations={[
    { expression: String.raw`\mathbf 1[R=K]`, annotation: ["required tasks이(가) 식의 결과에 기여하는 방식을","계산합니다.","필수 task ID 집합과 성공 receipt가 있는 task","ID 집합이 같고, artifact 충돌이 없으며 전역"] },
    { expression: String.raw`\mathbf 1[\operatorname{conflicts}(A)=\varnothing]`, annotation: ["artifacts이(가) 식의 결과에 기여하는 방식을","계산합니다.","필수 task ID 집합과 성공 receipt가 있는 task","ID 집합이 같고, artifact 충돌이 없으며 전역"] },
    { expression: String.raw`J_RJ_A\mathbf 1[V(A)=1]`, annotation: ["artifacts이(가) 식의 결과에 기여하는 방식을","계산합니다.","필수 task ID 집합과 성공 receipt가 있는 task","ID 집합이 같고, artifact 충돌이 없으며 전역"] },
  ]} terms={[{symbol:"R",name:"required tasks",description:"계획에서 반드시 완료해야 한다고 고정한 task ID 집합입니다."},{symbol:"K",name:"successful receipts",description:"Schema·checksum·local validation을 통과한 receipt의 task ID 집합입니다."},{symbol:"A",name:"artifacts",description:"Worker가 반환한 file·record·report 등 versioned 결과 집합입니다."},{symbol:"V",name:"global validator",description:"합친 결과의 test·rubric·policy를 검사하는 결정적 또는 audited 판정입니다."}]} assumptions={["Task ID와 input snapshot이 retry마다 안정적이며 중복 receipt를 dedup합니다.","부분 성공을 허용한다면 required/optional과 degraded-output policy를 사전에 구분합니다.","Validator가 보지 않는 의미 오류는 join_ok=1이어도 남을 수 있으므로 audit 표본을 둡니다."]} interpretation="필수 10개 중 9개만 성공하면 보고서가 그럴듯해도 완료가 아닙니다. 10개가 모두 있어도 같은 파일을 서로 다르게 수정했거나 전체 test가 실패하면 join을 승인하지 않습니다."/><div className="not-prose my-8"><ArchitectureViz /></div></section>;
}
