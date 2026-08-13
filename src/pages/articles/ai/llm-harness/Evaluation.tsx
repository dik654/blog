import EvaluationViz from "./viz/EvaluationViz";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        평가: 최종 답변·trajectory·side effect를 함께 본다
      </h2>
      <div className="not-prose mb-8">
        <EvaluationViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          에이전트가 마지막에 내놓은 답만 채점하면, 우연히 맞은 결과와 안전한
          절차로 재현한 결과를 구분하기 어렵다. 반대로 trace를 길게 저장했다고
          평가가 끝나는 것도 아니다. 최종 artifact가 요구사항을 충족했는지,
          trajectory가 허용된 tool과 권한을 지켰는지, 외부 side effect가 의도한
          상태와 일치하는지, 비용과 latency가 운영 한도 안인지 각각 판정해야 한다.
        </p>

        <ExplainedFormula
          question="최종 결과물이 맞더라도 위험한 경로나 외부 변경이 있었다면 run을 통과시켜도 될까요?"
          idea={
            <p>
              전체 합격은 평균 점수가 아니라 필수 gate의 논리곱으로 둡니다. 어느
              한 항이라도 실패하면 결과물만 보존한 채 run 자체는 실패로 판정하고,
              해당 evidence를 복구와 회귀 테스트 입력으로 남깁니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            A_{\mathrm{run}}
            &=A_{\mathrm{artifact}}\land A_{\mathrm{trajectory}}\\
            &\quad\land A_{\mathrm{effect}}\land A_{\mathrm{budget}}
          \end{aligned}`}
          terms={[
            { symbol: String.raw`A_{\mathrm{artifact}}`, name: "artifact gate", description: "파일·응답·배포 상태가 acceptance condition과 test를 통과했는지 나타냅니다." },
            { symbol: String.raw`A_{\mathrm{trajectory}}`, name: "trajectory gate", description: "허용된 tool·resource·승인 경로와 execution policy를 지켰는지 나타냅니다." },
            { symbol: String.raw`A_{\mathrm{effect}}`, name: "effect gate", description: "외부 write가 의도한 대상·횟수·최종 상태와 일치하고 receipt로 확인되는지 나타냅니다." },
            { symbol: String.raw`A_{\mathrm{budget}}`, name: "budget gate", description: "Token·tool call·wall time·비용·retry가 정한 한도 안인지 나타냅니다." },
          ]}
          assumptions={[
            "각 gate의 대상과 판정 oracle이 run 시작 전에 정의돼 있습니다.",
            "외부 effect는 identity·target·operation key·result가 담긴 receipt로 관측할 수 있습니다.",
            "필수 gate를 평균 점수로 상쇄하지 않고 고위험 예외는 사람 검토로 escalation합니다.",
          ]}
          interpretation="산출물이 맞아도 secret을 외부로 전송했거나 같은 배포를 두 번 만들었다면 trajectory 또는 effect gate가 0이므로 전체 run은 실패입니다. 이 식은 성공 확률 계산이 아니라 필수 조건을 빠뜨리지 않기 위한 Boolean acceptance contract입니다."
        />

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          판정 수단은 확실한 것부터 쌓는다
        </h3>
        <ol>
          <li>
            <strong>결정적 검사</strong>: compiler, unit/e2e test, schema,
            database invariant, policy.
          </li>
          <li>
            <strong>환경 oracle</strong>: 브라우저 상태, API 응답, metric
            threshold, 실제 파일·리소스.
          </li>
          <li>
            <strong>Rubric judge</strong>: 디자인·설명 품질처럼 기계적으로 합격
            여부를 판정하기 어려운 항목.
          </li>
          <li>
            <strong>사람 검토</strong>: 고위험 변경, 불확실한 기준, judge 간
            불일치.
          </li>
        </ol>
        <p className="leading-7">
          compiler나 test처럼 결과가 분명한 검사부터 적용하고, 그것만으로 판단할
          수 없는 부분에 LLM judge와 사람 검토를 더한다. LLM judge의 평가는
          rubric, 입력 순서와 평가 모델에 따라 달라질 수 있으므로 blind pairwise,
          사람 label과의 calibration, judge version 고정이 필요하다. 특히 worker와
          judge가 같은 오류를 공유할 수 있으므로, 중요 조건은 별도의 deterministic
          oracle이나 다른 관점의 검토로 교차 확인한다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          Trace를 regression suite로 바꾼다
        </h3>
        <p className="leading-7">
          운영 trace는 디버깅 자료이지 그 자체로 benchmark가 아니다. 실패 run에서
          입력, 당시의 tool·model version, 기대 상태와 실제 상태를 잘라내 재현
          가능한 case로 만들고, 같은 유형의 정상 case도 함께 넣어야 한다. 그래야
          한 오류를 막기 위해 추가한 규칙이 다른 작업을 망치는지 확인할 수 있다.
          에이전트 평가는 정답률뿐 아니라 실패 유형, tool-call count, token,
          wall time, 승인 요청과 rollback까지 한 묶음으로 비교한다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">운영 지표</h3>
        <div className="not-prose my-4 grid gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Task success", "최종 상태와 회귀 통과율"],
            ["Efficiency", "turn·token·tool call·wall time"],
            ["Safety", "거부·승인·권한 위반·외부 전송"],
            ["Recovery", "재시도·rollback·사람 escalation"],
          ].map(([title, body]) => (
            <div key={title} className="border-t border-border/80 pt-4">
              <strong>{title}</strong>
              <p className="mt-2 leading-5 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
