import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MathFormula from "@/components/ui/math";
import FormulaNote from "@/components/ui/formula-note";
import { articlePath } from "@/lib/paths";
import {
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from "@/components/learning/ArticleLearning";
import { NlpSection, Takeaway } from "./nlp-shared";
import {
  AiTevvLab,
  ChangeRegressionLab,
  EnvironmentProfileLab,
  EvidenceLadderLab,
  FailureLogicLab,
  HazardControlLab,
  MissionEnvelopeLab,
  QualificationMiniMap,
  ReleaseCaseLab,
  ReliabilityConfidenceLab,
  RequirementBudgetLab,
  TraceabilityLab,
  VerificationMethodLab,
} from "./robot-system-verification-validation-qualification/viz/SystemQualificationLabs";

const raw = String.raw;

function FormulaBlock({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: Array<[string, string]>;
}) {
  return (
    <div className="mb-8">
      <div className="not-prose min-w-0 rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-xs sm:text-base">
          {latex}
        </MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function EvidenceLedger({
  rows,
}: {
  rows: Array<{ label: string; question: string; kept: string }>;
}) {
  return (
    <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
      {rows.map((row, index) => (
        <div key={row.label} className="min-w-0 bg-background p-4">
          <div className="flex items-start gap-2">
            <span className="font-mono text-xs font-black text-blue-700/55 dark:text-blue-300/55">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-sm font-black leading-snug">{row.label}</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">먼저 물을 것:</strong>{" "}
            {row.question}
          </p>
          <p className="mt-2 text-xs leading-relaxed">
            <strong>남길 기록:</strong> {row.kept}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function RobotSystemVerificationValidationQualificationArticle() {
  return (
    <>
      <ConceptPrimer
        items={[
          {
            term: "Claim은 약속",
            meaning:
              "로봇이 어떤 조건에서 무엇을 할 수 있고 무엇을 하지 못하는지 검증 가능한 문장으로 적은 것이다.",
            why: "그럴듯한 demo와 field에서 지켜야 할 제품 약속을 구분한다.",
          },
          {
            term: "Evidence는 조건이 붙은 관찰",
            meaning:
              "시험 결과는 article, configuration, fixture, 환경, 절차, raw data and anomaly와 함께 있을 때만 claim을 지지한다.",
            why: "다른 firmware나 다른 환경의 pass를 현재 제품에 옮기지 않게 한다.",
          },
          {
            term: "Release는 불확실성의 종료가 아니다",
            meaning:
              "남은 위험, 가정, 제한된 ODD, monitor and response owner를 공개한 상태에서 운용을 시작하는 결정이다.",
            why: "초록색 dashboard가 모르는 것을 지워 버리지 않게 한다.",
          },
        ]}
      />

      <NlpSection
        id="mission-odd"
        marker="01"
        tone="blue"
        question="이 로봇은 정확히 어디서, 누구 곁에서, 무엇을 해야 하는가?"
        title="Mission을 조건 조합과 성공 판정으로 쓴다"
      >
        <QuestionLead
          question="창고에서 99% 성공했다면 야외 loading dock에도 출시해도 될까?"
          answer="아니다. 99%가 어느 바닥, 빛, 날씨, payload, battery, network, 사람 거리에서 나온 값인지 모르면 적용 범위를 알 수 없다. 먼저 실제 작업 이야기(ConOps)와 약속할 운용 조건의 경계(ODD)를 적고, 그 안의 어려운 조합을 보존해야 한다."
        />
        <QualificationMiniMap />
        <p>
          ConOps는 사용자가 하루 동안 로봇과 무엇을 하는지 시간 순서로 씁니다.
          ODD는 그 일이 일어날 수 있는 장소와 상태의 경계입니다.
          `indoor/outdoor` 한 단어로는 부족합니다. 젖은 steel plate, ramp angle,
          low sun, reflective wrap, payload center, wireless loss and charging
          state처럼 failure mechanism을 바꾸는 축을 남깁니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{\omega_k}_{\text{k번째 운용 조건}}=\Bigl(\underbrace{e_k}_{\text{환경}},\underbrace{p_k}_{\text{적재물}},\underbrace{h_k}_{\text{사람 상태}},\underbrace{n_k}_{\text{통신}},\underbrace{b_k}_{\text{전원 상태}}\Bigr)`}
          meaning="시나리오를 이름 하나가 아니라 고장 원인을 바꾸는 상태 묶음으로 보존한다. 같은 작업이라도 환경·적재물·사람·통신·배터리 조합이 달라지면 센서, 정지, 복구 근거가 유효한 범위도 달라진다."
          symbols={[
            [raw`\omega_k`, "k번째 운용 조건 묶음"],
            [raw`e_k,p_k,h_k,n_k,b_k`, "환경·적재물·사람·통신·배터리 상태"],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{P_{\mathrm{mission}}}_{\text{전체 임무 성공률}}=\underbrace{\sum_{k=1}^{K}w_k}_{\text{현장 조건 비중}}\underbrace{P(\mathrm{success}\mid\omega_k)}_{\text{그 조건에서의 성공}}\,,\qquad \underbrace{\sum_k w_k=1}_{\text{비중의 합}}`}
          meaning="조건별 성공률에 실제 현장 노출 비중을 곱해 합친다. 이 평균만으로 출시하면 드물지만 피해가 큰 조건을 숨길 수 있으므로 그런 조건은 별도 통과 기준으로 막아야 한다. 현장 비중을 시험 데이터의 표본 비중과 같다고 가정해서도 안 된다."
          symbols={[
            [raw`w_k`, "현장에서 k번째 조건이 나타날 비중"],
            [
              raw`P(\mathrm{success}\mid\omega_k)`,
              "해당 조건에서 성공할 조건부 확률",
            ],
            [raw`K`, "나누어 선언한 운용 조건의 수"],
          ]}
        />
        <MissionEnvelopeLab />
        <Misconception>
          ODD를 좁히는 것은 실패를 숨기는 일이 아닙니다. 검증하지 않은 곳까지
          된다고 말하지 않고, geo-fence, weather gate, speed reduction or human
          exclusion처럼 실제 운용 control로 경계를 지킬 때 정직한 release가
          됩니다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="requirements-budgets"
        marker="02"
        tone="teal"
        question="좋은 요구사항은 읽는 순간 어떤 시험을 할지 떠올릴 수 있는가?"
        title="Need를 한 가지 판정과 owned budget으로 바꾼다"
      >
        <p>
          `빨리 멈춰야 한다`는 올바른 바람이지만 아직 requirement가 아닙니다.
          누가, 어떤 starting speed/payload/slope에서, obstacle을 언제 감지한
          뒤, 어느 기준점까지, 얼마 이내에, 어떤 측정 오차로 멈춰야 하는지
          적어야 합니다. 한 문장에는 한 가지 pass/fail 판정만 둡니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{\mathcal R_i}_{\text{i번째 요구사항}}:\quad \underbrace{c_i(x)=\mathrm{true}}_{\text{적용 조건}}\Rightarrow\underbrace{|y_i-y_i^*|\le\delta_i}_{\text{목표와 허용오차를 비교}}`}
          meaning="적용 조건이 참일 때만 관찰값을 목표와 허용오차에 비교한다. 이 구조가 없으면 시험자가 조건과 판정을 임의로 고를 수 있다. 안전 상한처럼 방향이 중요한 요구사항은 절댓값 대신 부등호 방향을 그대로 보존한다."
          symbols={[
            [raw`c_i(x)`, "요구사항이 적용되는 상태와 조건을 나타내는 판정식"],
            [raw`y_i`, "실제로 측정한 결과"],
            [raw`y_i^*`, "목표값"],
            [raw`\delta_i`, "허용하는 측정·성능 오차"],
          ]}
        />
        <FormulaBlock
          latex={raw`\begin{aligned}\underbrace{T_{\mathrm{stop}}}_{\text{전체 정지 반응 시간}}&=\underbrace{T_{\mathrm{sense}}+T_{\mathrm{network}}}_{\text{관측 전달}}\\[3pt]&\quad+\underbrace{T_{\mathrm{compute}}+T_{\mathrm{control}}}_{\text{판단과 명령}}+\underbrace{T_{\mathrm{brake}}}_{\text{물리 정지}}\\[3pt]&\le\underbrace{T_{\mathrm{req}}}_{\text{시스템 허용 한계}}\end{aligned}`}
          meaning="센서가 사건을 본 뒤 실제 제동이 끝날 때까지 앞 단계의 대기와 실행 시간이 차례로 더해진다. 각 팀이 자기 목표를 통과해도 합계는 실패할 수 있으므로, 항마다 담당자·시계 기준·최악값 또는 백분위 기준·여유를 정해야 한다."
          symbols={[
            [
              raw`T_{\mathrm{stop}}`,
              "감지 사건부터 물리적으로 정지할 때까지 걸린 시간",
            ],
            [
              raw`T_{\mathrm{req}}`,
              "선언한 조건에서 허용하는 시스템 시간 한계",
            ],
            [raw`T_*`, "각 인터페이스 담당자에게 배분한 지연 시간"],
          ]}
        />
        <RequirementBudgetLab />
        <Takeaway>
          Requirement를 쓸 때 verification method, level, owner and rationale도
          함께 정합니다. 설계가 끝난 뒤 시험을 붙이면 측정할 수 없는 interface와
          sensor placement가 남습니다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="traceability"
        marker="03"
        tone="violet"
        question="어떤 pass가 어떤 약속을 닫았는지 한 edge씩 되짚을 수 있는가?"
        title="Requirement·interface·evidence의 양방향 trace를 만든다"
      >
        <p>
          Traceability는 문서 링크 개수가 아닙니다. Stakeholder need에서 system
          requirement, subsystem allocation, interface and verification result로
          내려가고, field anomaly에서 영향을 받은 requirement까지 다시 올라갈 수
          있어야 합니다. Orphan requirement는 evidence가 없고, orphan test는
          무엇을 입증하는지 모릅니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{C_{\mathrm{trace}}}_{\text{양방향 추적 완성도}}=\underbrace{\frac{|\{r\in\mathcal R:\exists e,\ r\leftrightarrow e\}|}{|\mathcal R|}}_{\text{근거와 왕복 연결된 요구사항 비율}}`}
          meaning="분자는 근거로 내려갈 수 있을 뿐 아니라 그 근거에서 요구사항으로 다시 올라올 수 있는 항목만 센다. 100%라는 숫자도 근거의 품질이나 통과를 보장하지 않으며, 중복 화면 캡처나 다른 제품 구성의 결과는 유효한 연결에서 제외한다."
          symbols={[
            [raw`\mathcal R`, "기준선으로 확정한 요구사항 집합"],
            [raw`e`, "제품 식별 정보와 판정이 붙은 근거 기록"],
            [raw`r\leftrightarrow e`, "요구사항과 근거 사이의 양방향 연결"],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{I_j}_{\text{j번째 인터페이스 계약}}=\Bigl(\underbrace{s_j,u_j,f_j,t_j}_{\text{형식·단위·좌표계·시계}},\underbrace{q_j,d_j,o_j}_{\text{주기·고장 대응·담당자}}\Bigr)`}
          meaning="인터페이스는 커넥터 이름만이 아니라 값의 의미와 실패했을 때의 행동까지 전달해야 한다. 데이터 형식이 맞아도 단위·좌표계·획득 시계가 다르면 수치는 거짓이 되며, 담당자가 없으면 시간 초과와 고장 복구 결정이 열린 채 남는다."
          symbols={[
            [raw`s_j,u_j,f_j,t_j`, "데이터 형식·단위·좌표계·시간 기준"],
            [raw`q_j`, "주기·서비스 품질·신선도 계약"],
            [raw`d_j`, "성능 저하 또는 고장 시의 대응"],
            [raw`o_j`, "판단과 변경을 책임지는 담당자"],
          ]}
        />
        <TraceabilityLab />
        <EvidenceLedger
          rows={[
            {
              label: "Requirement record",
              question: "누가 어느 조건에서 무엇을 얼마만큼 해야 하는가?",
              kept: "ID · rationale · parent · owner · method · level · tolerance",
            },
            {
              label: "Evidence record",
              question:
                "어떤 configuration과 procedure에서 무엇을 직접 관찰했는가?",
              kept: "article serial · setup · calibration · raw data · anomaly · result",
            },
            {
              label: "Interface record",
              question:
                "두 subsystem이 같은 물리량과 failure state를 이해하는가?",
              kept: "schema · unit · frame · clock · rate · timeout · owner",
            },
            {
              label: "Decision record",
              question: "불일치와 남은 위험을 누가 왜 받아들였는가?",
              kept: "claim · evidence · assumptions · waiver · expiry · approver",
            },
          ]}
        />
      </NlpSection>

      <NlpSection
        id="hazard-risk"
        marker="04"
        tone="amber"
        question="충돌이라는 한 단어 안에서 정확히 어떤 경로를 끊어야 하는가?"
        title="위험원에서 harm까지 bow-tie를 그린다"
      >
        <p>
          움직이는 arm은 hazard source이고, stale person track or failed brake는
          initiating cause입니다. 사람이 reachable zone에 있는 동안 stop이
          실패하는 것이 hazardous event이며, 접촉 뒤 injury가 harm입니다. 이
          구분이 있어야 speed limit, separation monitoring, guard, brake and
          warning이 어느 edge를 줄이는지 시험할 수 있습니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{P(H)}_{\text{손해가 일어날 확률}}=\underbrace{P(H\mid E,X)}_{\text{사건·노출 뒤 손해}}\underbrace{P(X\mid E)}_{\text{사람이 노출됨}}\underbrace{P(E)}_{\text{위험 사건 발생}}`}
          meaning="조건부 확률 사슬은 사건 예방, 노출 감소, 피해 완화를 서로 다른 책임으로 분리한다. 곱셈은 이 조건 관계가 맞을 때만 유효하며, 공통 원인이나 사람의 행동 변화가 빠지면 위험을 실제보다 작게 계산한다."
          symbols={[
            [raw`E`, "위험한 상태가 현실화된 사건"],
            [raw`X`, "사람이나 재산이 위험에 노출된 상태"],
            [raw`H`, "미리 정의한 피해 상태"],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{R_{\mathrm{res}}}_{\text{제어 뒤 남은 위험 추정값}}=\underbrace{R_0}_{\text{초기 위험}}\underbrace{\prod_{i=1}^{m}(1-\eta_i)}_{\text{서로 독립인 제어의 감소 효과}}`}
          meaning="각 제어가 직전 단계에 남은 위험의 일부를 줄이므로 감소 비율을 곱한다. 센서·전원·소프트웨어·가정을 공유하면 독립이라는 전제가 깨지며, 효과는 설계 의도가 아니라 고장 주입이나 대표 조건 시험으로 확인해야 한다."
          symbols={[
            [raw`R_0`, "선언한 시나리오에서 제어 전의 위험 척도"],
            [raw`\eta_i`, "근거로 확인한 i번째 제어의 감소 효과"],
            [raw`m`, "효과를 인정한 독립 제어의 수"],
          ]}
        />
        <HazardControlLab />
        <Misconception>
          Warning/manual is important하지만 본질 안전 설계와 safeguarding을
          대체하지 않습니다. Risk reduction hierarchy는 가능한 한 source를
          제거하고, 다음에 guard/interlock, 마지막에 information and training을
          사용합니다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="failure-logic"
        marker="05"
        tone="blue"
        question="FMEA 표와 두 채널 그림이 있으면 safety가 입증된 것인가?"
        title="Bottom-up failure와 top-down event 조합을 함께 찾는다"
      >
        <p>
          FMEA는 sensor, connector, process 하나가 실패했을 때 위로 어떤
          effect가 퍼지는지 찾습니다. Fault tree는 `정지하지 못함` 같은 top
          event를 만들 수 있는 OR/AND 조합을 아래로 찾습니다. 둘은 발견
          도구이며, high severity path의 제거와 control effectiveness evidence를
          대신하지 않습니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{RPN}_{\text{조사 우선순위 점수}}=\underbrace{S}_{\text{심각도 순위}}\underbrace{O}_{\text{발생도 순위}}\underbrace{D}_{\text{검출도 순위}}`}
          meaning="RPN은 서열 척도 세 개를 곱해 먼저 조사할 항목을 찾는 간이 지표다. 같은 곱을 만드는 서로 다른 조합은 안전 의미가 다르며, 발생도가 낮다는 이유로 치명적인 단일 고장점을 허용해서는 안 된다."
          symbols={[
            [raw`S,O,D`, "팀이 정의한 심각도·발생도·검출도 순위"],
            [
              raw`RPN`,
              "확률이나 예상 피해가 아니라 조사 우선순위를 정하는 점수",
            ],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{q_{\mathrm{sys}}}_{\text{두 채널이 함께 놓칠 확률}}=\underbrace{q_{\mathrm{cc}}}_{\text{공통 원인}}+\underbrace{(1-q_{\mathrm{cc}})q_Aq_B}_{\text{공통 원인이 없을 때의 동시 실패}}`}
          meaning="독립 실패를 곱하기 전에 두 채널을 한꺼번에 무너뜨리는 공통 원인 가지를 더한다. 전원선·설정·시계·환경·정비 절차를 공유하면 A와 B의 이름이 달라도 이 공통 원인이 전체 실패를 지배할 수 있다."
          symbols={[
            [raw`q_A,q_B`, "공통 원인이 없을 때 각 채널이 놓칠 확률"],
            [raw`q_{\mathrm{cc}}`, "선언한 공통 원인 발생 확률"],
            [raw`q_{\mathrm{sys}}`, "이 모형에서 최상위 사건을 놓칠 확률"],
          ]}
        />
        <FailureLogicLab />
        <Takeaway>
          Redundancy count보다 independence argument가 먼저입니다. Physical
          separation, diverse sensing/logic, independent shutdown energy,
          diagnostic coverage and maintenance common cause를 evidence로
          연결합니다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="verification-validation"
        marker="06"
        tone="teal"
        question="명세를 만족한 것과 사용자가 원하는 일을 해결한 것은 왜 다른가?"
        title="Verification와 validation의 비교 대상을 분리한다"
      >
        <p>
          Verification는 baselined `shall`을 기준으로 product가 제대로
          구현됐는지 묻습니다. Validation은 stakeholder expectation, ConOps and
          intended environment를 기준으로 올바른 product를 만들었는지 묻습니다.
          치수는 inspection, stopping distance는 test, structural margin은
          bounded analysis, operator recovery workflow는 representative
          demonstration처럼 claim에 맞는 method를 고릅니다.
        </p>
        <FormulaBlock
          latex={raw`\begin{aligned}
\underbrace{V_m}_{\text{방법 확인 집합}}
&=\bigl\{r\in\mathcal R\mid\underbrace{m(r)=1}_{\text{방법 적합}}\bigr\}\\[6pt]
\underbrace{V_e}_{\text{근거 확인 집합}}
&=\bigl\{r\in V_m\mid\underbrace{e(r)=1}_{\text{근거 유효}}\bigr\}\\[6pt]
\underbrace{V_{\mathrm{req}}}_{\text{검증 완료 집합}}
&=\bigl\{r\in V_e\mid\underbrace{d(r)=1}_{\text{판정 통과}}\bigr\}
\end{aligned}`}
          meaning="첫 줄은 주장에 맞는 검증 방법을 배정한 요구사항만 남긴다. 둘째 줄은 그중 제품 식별 정보와 적용 범위가 유효한 근거를 가진 항목만 남긴다. 마지막 줄은 검토된 판정까지 통과한 항목을 검증 완료 집합에 넣는다. 어딘가에 시험 결과가 존재한다는 사실만으로는 부족하다."
          symbols={[
            [raw`V_m`, "주장에 맞는 검증 방법을 배정한 요구사항 집합"],
            [raw`V_e`, "방법을 통과하고 유효한 근거까지 연결된 요구사항 집합"],
            [raw`m(r)`, "요구사항 r에 배정한 검증 방법"],
            [raw`e(r)`, "시험한 제품 구성에 묶인 근거 기록"],
            [raw`d(r)`, "검토를 끝낸 통과·실패·예외 승인 판정"],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{D_{\mathrm{val}}}_{\text{의도한 사용과 시험의 거리}}=\underbrace{\sum_{j=1}^{J}\lambda_j}_{\text{중요도 가중치}}\underbrace{d_j(\omega_{\mathrm{use}},\omega_{\mathrm{test}})}_{\text{조건별 불일치}}`}
          meaning="작업·환경·사람·시간·지원 절차에서 실제 사용과 시험이 얼마나 다른지를 중요도에 따라 합친다. 거리 0은 보편적인 표준값이 아니며, 프로젝트가 각 거리와 가중치를 정의하고 남은 차이가 현장 사용에 주는 의미를 설명해야 한다."
          symbols={[
            [
              raw`\omega_{\mathrm{use}},\omega_{\mathrm{test}}`,
              "의도한 사용 조건과 시험으로 재현한 조건",
            ],
            [raw`d_j`, "j번째 조건 축에서의 불일치 크기"],
            [raw`\lambda_j`, "임무와 안전에 따른 중요도 가중치"],
          ]}
        />
        <VerificationMethodLab />
        <Misconception>
          Qualification, acceptance and validation도 같은 말이 아닙니다.
          Qualification은 design margin/worst-case environment를, acceptance는
          delivered unit의 workmanship and function을, validation은 intended use
          적합성을 묻습니다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="evidence-ladder"
        marker="07"
        tone="violet"
        question="Simulation과 HIL은 무엇을 빠르게 찾고 무엇을 절대 대신하지 못하는가?"
        title="낮은 단계의 원인 분리와 높은 단계의 coupling을 연결한다"
      >
        <p>
          SIL은 algorithm and scenario를 싸게 반복하고, HIL은 actual I/O timing
          and protocol을 되돌립니다. Subsystem rig는 power, thermal, load and
          hardware faults를 추가하며, full robot은 interaction, environment and
          human workflow를 복원합니다. 위로 갈수록 비싸지만 아래 단계 model의
          omitted coupling을 확인합니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{\mathcal D_{\mathrm{claim}}}_{\text{주장을 적용할 영역}}\subseteq\underbrace{\mathcal D_{\mathrm{test}}\cap\mathcal D_{\mathrm{article}}\cap\mathcal D_{\mathrm{configuration}}}_{\text{시험 조건·시험체·제품 구성의 교집합}}`}
          meaning="주장의 범위는 실제로 재현한 시험 조건, 시험체의 대표성, 출시 제품 구성의 교집합보다 넓을 수 없다. 시뮬레이션 조건을 많이 돌려도 실제 구동기가 다르면 보완되지 않으며, 인증한 시제품 결과도 바뀐 양산 구성을 자동으로 덮지 않는다."
          symbols={[
            [raw`\mathcal D_{\mathrm{claim}}`, "외부에 약속한 조건 범위"],
            [raw`\mathcal D_{\mathrm{test}}`, "실제로 가한 자극과 환경의 범위"],
            [
              raw`\mathcal D_{\mathrm{article}}`,
              "시험체 이력과 실제 제품에 대한 물리적 대표성",
            ],
            [
              raw`\mathcal D_{\mathrm{configuration}}`,
              "출시한 하드웨어·소프트웨어·데이터 구성",
            ],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{e_{\mathrm{system}}}_{\text{현실과 예측의 차이}}=\underbrace{\sum_i e_i}_{\text{각 모형의 오차}}+\underbrace{e_{\mathrm{interaction}}}_{\text{연결과 상호작용의 추가 오차}}`}
          meaning="하위 시스템의 오차는 누적되고, 서로 연결했을 때만 나타나는 상호작용 오차가 따로 생긴다. 이 식은 빠진 오차를 찾기 위한 점검 장부이며, 모든 시스템의 오차가 독립인 스칼라라는 뜻은 아니다."
          symbols={[
            [raw`e_i`, "센서·모형·시간·구동기·환경 각각의 불일치"],
            [
              raw`e_{\mathrm{interaction}}`,
              "연결부와 상호작용에서 추가된 불일치",
            ],
            [raw`e_{\mathrm{system}}`, "끝에서 끝까지 실제로 측정한 잔여 오차"],
          ]}
        />
        <EvidenceLadderLab />
        <Takeaway>
          모든 걸 full robot에서 처음 찾으면 원인 분리가 어렵고 위험합니다. 모든
          걸 simulation에서 끝내면 물리가 빠집니다. 각 단계는 `무엇을 추가했고
          아직 무엇을 뺐는가`를 명시해야 합니다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="environment-tailoring"
        marker="08"
        tone="amber"
        question="Temperature, vibration, water 숫자는 어디서 와야 하는가?"
        title="Life-cycle environment와 test sequence에서 qualification을 만든다"
      >
        <p>
          MIL-STD-810H는 인터넷에서 method number와 level을 고르는 표가 아니라,
          materiel의 service life에 실제로 가해질 environment를 파악해 design
          and test를 tailoring하는 방향을 명시합니다. Warehouse robot이라면
          storage, truck transport, dock operation, washdown, charging and
          maintenance의 온도·습도·shock·vibration·dust/water·voltage·EMC
          profile을 먼저 만듭니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{\mathcal E_{\mathrm{life}}}_{\text{수명 전체 환경 집합}}=\underbrace{\bigcup_{p\in\{\mathrm{보관,운송,운용,정비}\}}\mathcal E_p}_{\text{각 단계의 노출을 합침}}`}
          meaning="합집합을 쓰면 정상 운용만 보다가 보관 저온이나 운송 충격을 빠뜨리는 일을 막을 수 있다. 다만 합집합은 노출 순서를 보존하지 않으므로, 전이 과정과 복합 노출은 다음 상태식으로 따로 다뤄야 한다."
          symbols={[
            [
              raw`\mathcal E_p`,
              "단계 p에서의 온도·습기·진동·충격·전압·오염 상태",
            ],
            [
              raw`\mathcal E_{\mathrm{life}}`,
              "요구사항과 시험 맞춤 설계에 넣을 수명 환경 범위",
            ],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{x_{k+1}}_{\text{다음 제품 상태}}=\underbrace{F_{e_k}}_{\text{k번째 노출의 변화}}\!\left(\underbrace{x_k}_{\text{이전 손상·습기·보정 상태}}\right)`}
          meaning="각 환경 시험이 다음 시험의 시작 상태를 바꾸므로 노출 순서가 중요하다. 진동은 밀봉 틈을 열고, 저온에서 고온으로 바뀌면 결로가 생기며, 물 분사가 끝난 뒤에도 절연과 부식 상태가 달라질 수 있다. 전후 기능 점검과 분해 검사가 이 누적 기억을 보존한다."
          symbols={[
            [
              raw`x_k`,
              "손상·습기·체결력·보정·소프트웨어 설정을 포함한 제품 상태",
            ],
            [raw`e_k`, "k번째로 가한 맞춤 환경 노출"],
            [raw`F_{e_k}`, "그 노출이 제품 상태를 바꾸는 전이 함수"],
          ]}
        />
        <EnvironmentProfileLab />
        <Misconception>
          Component IP label은 assembled robot의 cable gland, seam, breathing
          path, moving shaft and maintenance opening을 보증하지 않습니다. 또한
          NASA GEVS의 spaceflight test margin을 commercial robot에 그대로
          복사하지 않습니다. 배울 것은 test-pedigree와 before/after evidence
          구조입니다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="reliability-confidence"
        marker="09"
        tone="blue"
        question="고장이 한 번도 없었다면 reliability는 100%인가?"
        title="Duty·failure model·독립 표본·confidence를 함께 말한다"
      >
        <p>
          Zero failure는 좋은 관찰이지만 certainty가 아닙니다. 같은 unit의 같은
          쉬운 cycle은 independent products and field conditions를 충분히
          대표하지 못합니다. 먼저 distance가 아니라 stop count, joint reversal,
          payload, slope, thermal cycles and maintenance처럼 failure mechanism을
          움직이는 duty를 기록합니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{R(t)}_{\text{시간 t까지 생존할 확률}}=\underbrace{\exp\!\left[-\left(\frac{t}{\eta}\right)^{\beta}\right]}_{\text{와이블 수명 모형}}`}
          meaning="와이블 생존식은 대표 수명 eta와 고장률 추세를 정하는 모양 beta를 분리한다. beta가 1보다 작거나 비슷하거나 크면 고장 위험이 감소·일정·증가하는 경향을 나타낸다. 적합한 곡선은 중도 절단 자료, 사용 강도, 모집단이 같을 때만 옮겨 쓸 수 있다."
          symbols={[
            [raw`t`, "선언한 임무 시간 또는 고장 원인과 맞는 사용량"],
            [raw`\eta`, "누적 고장이 63.2%에 이르는 대표 수명 척도"],
            [raw`\beta`, "고장률 변화 모양을 정하는 값"],
            [raw`R(t)`, "수명 모형으로 계산한 생존 확률"],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{R_L}_{\text{무고장 시험의 신뢰도 하한}}=\underbrace{\alpha^{1/n_{\mathrm{eff}}}}_{\text{남은 불확실성을 유효 표본에 배분}}\,,\qquad \underbrace{\alpha=1-C}_{\text{허용한 오판 확률}}`}
          meaning="서로 독립이고 대표성 있는 유효 시험 n번에서 고장이 0회일 때, 신뢰수준 C로 주장할 수 있는 단측 신뢰도 하한이다. 서로 강하게 연관된 반복 시험은 유효 표본 수를 줄이며, 수명이 변하는 마모 구간이나 시험하지 않은 운용 영역은 이 식이 덮지 않는다."
          symbols={[
            [raw`C`, "선택한 신뢰수준"],
            [raw`\alpha`, "한쪽 방향으로 허용한 오판 확률"],
            [raw`n_{\mathrm{eff}}`, "독립성과 대표성을 반영한 유효 시험 횟수"],
            [raw`R_L`, "신뢰도에 대해 주장할 수 있는 하한"],
          ]}
        />
        <ReliabilityConfidenceLab />
        <Takeaway>
          Reliability claim에는 population, configuration, duty, time/demand
          unit, failure definition, maintenance policy, censoring, model and
          confidence를 함께 씁니다. `200 km` 하나는 이 상태를 보존하지 않습니다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="ai-tevv"
        marker="10"
        tone="teal"
        question="Offline accuracy가 높으면 사람 주변 closed-loop risk도 낮은가?"
        title="AI metric을 ODD strata와 system consequence로 되돌린다"
      >
        <p>
          Perception false negative가 system harm으로 가려면 해당 사람이
          나타나고, planner/control/monitor가 회복하지 못하며, physical
          contact가 harm으로 이어져야 합니다. 반대로 average accuracy는 쉬운
          indoor frames가 rare low-sun scenario를 덮을 수 있습니다. Dataset,
          simulation, replay and field shadow evaluation을 같은 scenario IDs로
          연결합니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{\mathcal R_{\mathrm{AI}}}_{\text{ODD 전체 예상 위험}}=\underbrace{\sum_{k=1}^{K}p_k}_{\text{현장 조건 빈도}}\underbrace{L_k(f,\pi,m)}_{\text{모형·정책·감시기의 조건별 손실}}`}
          meaning="같은 인공지능 오류도 시나리오와 복구 계층에 따라 결과가 달라지므로 조건을 나누어 위험을 합친다. p_k는 데이터셋 표본 비율이 아니라 현장 노출 비중이며, L_k에는 필요한 경우 폐루프에서 실제로 벌어진 결과까지 포함해야 한다."
          symbols={[
            [raw`p_k`, "현장 빈도 또는 상한을 둔 노출 가중치"],
            [raw`f`, "인공지능 모형"],
            [raw`\pi`, "경로 계획기와 제어기의 정책"],
            [raw`m`, "실행 중 감시와 복구 계층"],
            [raw`L_k`, "조건별 성능 저하 또는 피해 손실"],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{P(H\mid\omega_k)}_{\text{k조건에서의 피해}}=\underbrace{P(M\mid\omega_k)}_{\text{인공지능이 놓침}}\underbrace{P(F\mid M,\omega_k)}_{\text{회복도 실패}}\underbrace{P(H\mid F,\omega_k)}_{\text{물리 결과가 피해로 이어짐}}`}
          meaning="이 사슬은 오프라인에서 놓친 비율을 곧바로 피해 확률로 착각하지 않게 한다. 조건부 항들이 공통 원인을 공유할 수 있으므로 시나리오 시험과 고장 주입 근거가 따로 필요하며, 이 곱은 인과관계를 점검하는 모형이지 자동 인증식이 아니다."
          symbols={[
            [raw`M`, "관련 있는 인공지능 누락 또는 위험한 출력"],
            [raw`F`, "계획기·감시기·물리 복구가 모두 실패한 상태"],
            [raw`H`, "미리 정의한 피해"],
            [raw`\omega_k`, "k번째 운용 영역 조건"],
          ]}
        />
        <AiTevvLab />
        <Misconception>
          NIST AI RMF는 voluntary risk-management structure이며 robot safety
          certificate가 아닙니다. ISO 10218-1:2025도 industrial robot
          manufacturer scope이고 service/public, medical, military,
          airborne/space and severe-condition uses를 명시적으로 제외합니다.
          Applicable product standard and law는 별도 확인해야 합니다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="configuration-regression"
        marker="11"
        tone="violet"
        question="어제 통과한 시험은 오늘 model·seal·firmware가 바뀌어도 유효한가?"
        title="Evidence를 configuration과 anomaly에 묶고 change impact를 다시 연다"
      >
        <p>
          Release configuration은 Git commit만이 아닙니다. Mechanical drawing
          and tolerance, supplier part revision, calibration, firmware,
          parameters, AI model and dataset, container image, safety PLC and test
          procedure까지 하나의 identity를 이룹니다. Change는 linked hazard and
          evidence를 stale로 만들 수 있습니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{\Gamma_r}_{\text{r번째 출시 구성 식별자}}=\Bigl(\underbrace{H_r}_{\text{하드웨어}},\underbrace{S_r}_{\text{소프트웨어}},\underbrace{M_r,D_r}_{\text{모형·데이터}},\underbrace{C_r}_{\text{보정·매개변수}}\Bigr)`}
          meaning="하나의 코드 커밋만으로 물리 제품과 학습된 제품을 모두 식별할 수 없으므로 묶음으로 기록한다. 근거는 시험한 구성과 출시 구성이 같거나, 둘이 동등하다는 검토된 논증이 있을 때만 적용할 수 있다."
          symbols={[
            [raw`H_r`, "기계·전기 부품과 그 개정 번호"],
            [raw`S_r`, "펌웨어·미들웨어·응용 프로그램 빌드"],
            [raw`M_r,D_r`, "인공지능 모형과 관리되는 데이터의 식별자"],
            [raw`C_r`, "보정값과 실행 시 설정"],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{C_{\mathrm{impact}}}_{\text{변경 영향 닫힘 비율}}=\underbrace{\frac{|\mathcal A_{\mathrm{rerun}}\cup\mathcal A_{\mathrm{justified}}|}{|\mathcal A_{\mathrm{affected}}|}}_{\text{재검증 또는 근거 있는 유지 항목의 비율}}`}
          meaning="변경으로 영향을 받은 근거는 대표 구성에서 다시 시험하거나, 기존 근거가 여전히 적용된다는 동등성 논증으로 닫아야 한다. 비율이 높아도 열린 이상 현상, 만료된 예외 승인, 새 위험은 사라지지 않으며 별도 출시 관문으로 남는다."
          symbols={[
            [
              raw`\mathcal A_{\mathrm{affected}}`,
              "변경 영향 그래프가 무효 가능성으로 표시한 근거와 해석",
            ],
            [
              raw`\mathcal A_{\mathrm{rerun}}`,
              "대표 제품 구성에서 다시 얻은 근거",
            ],
            [
              raw`\mathcal A_{\mathrm{justified}}`,
              "검토된 적용성 논증으로 유지한 근거",
            ],
          ]}
        />
        <ChangeRegressionLab />
        <Takeaway>
          실패 trial을 지우지 않습니다. Predefined exclusion rule, raw data,
          root cause, correction, rerun and final disposition을 남깁니다.
          Waiver도 owner, residual risk, compensating control and expiration이
          있는 bounded decision입니다.
        </Takeaway>
      </NlpSection>

      <NlpSection
        id="release-field"
        marker="12"
        tone="amber"
        question="Release board는 무엇을 모른다고 말할 수 있어야 하는가?"
        title="Claim·evidence·assumption·residual risk와 field feedback을 닫는다"
      >
        <p>
          좋은 release case는 `모두 pass` 한 줄이 아닙니다. 어떤 claim이 fully
          supported인지, 어느 ODD and maintenance 조건에서만 conditional인지,
          무엇이 open/rejected인지, 누가 residual risk를 소유하는지 보여 줍니다.
          Field monitor는 degradation을 감지하고 safe state, service, incident
          review or requirement change로 연결합니다.
        </p>
        <FormulaBlock
          latex={raw`\underbrace{\mathcal S(c)}_{\text{주장 c를 지지하는 범위}}=\underbrace{\mathcal D_c\cap\mathcal D_e\cap\mathcal D_{\Gamma}}_{\text{주장 조건·근거 조건·출시 구성의 교집합}}`}
          meaning="지지 범위는 세 영역의 교집합이므로 가장 좁은 영역보다 넓어질 수 없다. 가정·이상 현상·예외 승인은 이 집합을 줄이거나 조건부로 만들며, 대시보드의 초록색 상태가 범위를 넓혀 주지는 않는다."
          symbols={[
            [raw`\mathcal D_c`, "약속한 운용·성능 조건 범위"],
            [raw`\mathcal D_e`, "유효한 근거가 실제로 덮는 범위"],
            [raw`\mathcal D_{\Gamma}`, "출시 제품 구성이 유지되는 범위"],
            [raw`\mathcal S(c)`, "근거를 들어 방어할 수 있는 주장 범위"],
          ]}
        />
        <FormulaBlock
          latex={raw`\underbrace{C_{\mathrm{monitor}}}_{\text{현장 고장 대응 포괄률}}=\underbrace{P(D\cap A\mid F)}_{\text{고장을 감지하고 대응함}}=\underbrace{P(D\mid F)P(A\mid D,F)}_{\text{감지와 대응의 조건부 곱}}`}
          meaning="감시기는 관련 고장을 제때 감지하고, 그 뒤 독립적인 대응이 실제로 실행될 때만 도움이 된다. 감시기 자체의 고장을 구분하지 못하는 원격 측정이나, 이미 실패한 부품 뒤에 대기하는 복구 명령은 겉보기 포괄률만 만든다."
          symbols={[
            [raw`F`, "현장에서 발생한 관련 고장 또는 성능 저하"],
            [raw`D`, "건강한 감시기가 제때 감지한 사건"],
            [raw`A`, "실제로 실행된 안전·성능 저하·정비 대응"],
            [
              raw`C_{\mathrm{monitor}}`,
              "고장 조건에서 감지와 대응이 함께 성공할 확률",
            ],
          ]}
        />
        <ReleaseCaseLab />
        <CapabilityCheck
          items={[
            "Vague product promise를 ConOps, ODD strata and measurable requirement로 바꾼다.",
            "End-to-end budget and interface owner가 빠진 local pass를 찾는다.",
            "Hazard, cause, event, exposure and harm을 구분하고 control edge를 시험한다.",
            "FMEA/RPN, fault tree, redundancy and common-cause의 책임을 구분한다.",
            "Verification, validation, qualification, acceptance and characterization을 구분한다.",
            "환경 시험을 life-cycle profile, sequence and before/after evidence로 tailoring한다.",
            "Zero failure, repeated trials and Weibull model의 confidence boundary를 설명한다.",
            "AI 평균 metric을 ODD strata, recovery and physical consequence로 되돌린다.",
            "Changed configuration이 stale하게 만든 evidence를 impact graph로 다시 연다.",
            "Supported, conditional, open and rejected claim을 residual risk와 함께 release한다.",
          ]}
        />
        <div className="not-prose mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            to={articlePath("ai", "robot-ai-top-down")}
            className="group rounded-md border border-border p-4 transition-colors hover:border-blue-600/35 hover:bg-blue-500/[0.035]"
          >
            <span className="flex items-center justify-between gap-3">
              <strong className="text-sm">
                위로 돌아가기 · Robot AI 전체 지도
              </strong>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
              Mission claim을 perception, planning, control, embedded and
              physical subsystem owner에게 다시 배분한다.
            </span>
          </Link>
          <Link
            to={articlePath("ai", "robot-contact-tribology-lubrication-wear")}
            className="group rounded-md border border-border p-4 transition-colors hover:border-teal-600/35 hover:bg-teal-500/[0.035]"
          >
            <span className="flex items-center justify-between gap-3">
              <strong className="text-sm">
                아래 evidence 예시 · Contact & Tribology
              </strong>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
              한 subsystem claim을 contact model, staged rig, teardown and
              release configuration으로 닫는 구체 사례를 본다.
            </span>
          </Link>
        </div>
        <SourceNotes
          sources={[
            {
              label: "NASA Systems Engineering Handbook Rev 2",
              href: "https://ntrs.nasa.gov/api/citations/20170001761/downloads/20170001761.pdf",
              note: "Stakeholder expectations, requirements metadata, interface/risk management, verification/validation matrices and test-article pedigree. NASA process를 commercial robot certification으로 전이하지 않는다.",
            },
            {
              label: "MIL-STD-810H Change 1 official DLA record",
              href: "https://quicksearch.dla.mil/qsdocdetails.aspx?ident_number=35978&lang=en",
              note: "Active 2022 environmental engineering and tailoring scope. The standard explicitly does not impose universal design/test specifications.",
            },
            {
              label: "GSFC-STD-7000B GEVS",
              href: "https://standards.nasa.gov/standard/gsfc/gsfc-std-7000",
              note: "Qualification, protoflight, acceptance and environmental verification architecture. Spaceflight levels are not robot default values.",
            },
            {
              label: "NIST AI RMF 1.0 and AIRC",
              href: "https://airc.nist.gov/",
              note: "Contextual AI risk management and TEVV resources; voluntary and not product certification.",
            },
            {
              label: "NIST Response Robot Performance Standards",
              href: "https://www.nist.gov/programs-projects/department-homeland-security-response-robot-performance-standards",
              note: "Responder-defined task fixtures, repeatable performance metrics and operational relevance.",
            },
            {
              label: "ISO 12100:2010 official scope",
              href: "https://www.iso.org/standard/51528.html",
              note: "Machinery risk assessment/reduction lifecycle. Full normative text and applicable law are required for conformance.",
            },
            {
              label: "ISO 10218-1:2025 official scope",
              href: "https://www.iso.org/standard/73933.html",
              note: "Current industrial robot manufacturer scope and explicit exclusions; application/integration and other robot classes require their applicable standards.",
            },
          ]}
        />
      </NlpSection>
    </>
  );
}
