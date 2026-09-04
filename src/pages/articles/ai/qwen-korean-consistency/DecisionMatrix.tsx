import DecisionMatrixViz from "./viz/DecisionMatrixViz";

const OPTIONS = [
  {
    name: "프롬프트",
    point: "request context",
    fit: "가중치 접근 없이 기본 언어·field·예외 정책을 명시할 때",
    limit: "학습 weight를 바꾸지 않으며 긴 출력과 어려운 문맥에서 지시 이탈이 남을 수 있음",
  },
  {
    name: "런타임 가드",
    point: "generated output",
    fit: "API 모델의 long-tail 실패를 감지하고 retry·degrade·review로 분기할 때",
    limit: "추가 latency·judge 비용과 false positive·false negative가 생김",
  },
  {
    name: "Smoothie-Qwen",
    point: "lm_head rows",
    fit: "오픈웨이트에서 특정 Unicode·subword 위험 token의 과도한 생성을 줄일 때",
    limit: "softmax 전체의 상대 확률과 정상 번역도 바뀌므로 paired evaluation이 필요함",
  },
  {
    name: "SFT · RL",
    point: "learned policy",
    fit: "reasoning trace와 문제 풀이 선호까지 반복적으로 바꿔야 할 때",
    limit: "data·compute·reward·judge·회귀 평가가 필요하고 인과를 분리하기 어려움",
  },
] as const;

export default function DecisionMatrix() {
  return (
    <section id="decision-matrix" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        접근성·대상·비용·근거로 개입 지점을 고릅니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          프롬프트, Smoothie-Qwen, SFT·RL, 런타임 가드는 각각 요청 문맥, 출력층, 학습된 policy, 배포 경계라는 다른 부분을 바꿉니다. 강도가 다른 같은 약이
          아닙니다. 먼저 고정 사례의 실패가 문자 span인지, reasoning 구간 전환인지, 정상 번역 오탐인지 분류한 다음 가장 직접적인 한 개입을 candidate로 만듭니다.
        </p>
        <p>
          선택 질문은 네 가지입니다. <strong>Access</strong>는 model weight와
          학습 환경을 바꿀 수 있는지, <strong>Target</strong>은 표면 token과
          reasoning policy 중 무엇을 바꿀지, <strong>Cost</strong>는 offline
          training과 per-request latency 중 무엇을 감당할지,
          <strong>Evidence</strong>는 paired data와 사람이 확인한 label이 충분한지
          묻습니다. 방법 이름보다 이 제약이 먼저입니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <DecisionMatrixViz />
      </div>

      <div className="not-prose my-8 min-w-0 space-y-3">
        <p className="text-sm font-bold">방법별 책임과 한계</p>
        {OPTIONS.map((option) => (
          <section
            key={option.name}
            className="grid min-w-0 gap-3 rounded-xl border border-border/70 bg-background p-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:p-5"
          >
            <div className="min-w-0">
              <h3 className="break-words text-sm font-bold">{option.name}</h3>
              <p className="mt-1 break-words font-mono text-xs text-primary">{option.point}</p>
            </div>
            <dl className="grid min-w-0 gap-3 text-sm md:grid-cols-2">
              <div className="min-w-0">
                <dt className="text-xs font-semibold text-muted-foreground">잘 맞는 조건</dt>
                <dd className="mt-1 break-words leading-6">{option.fit}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs font-semibold text-muted-foreground">주요 비용·한계</dt>
                <dd className="mt-1 break-words leading-6">{option.limit}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>1. 결과를 보기 전에 평가 기준을 사전 등록합니다</h3>
        <p>
          Candidate를 실행한 뒤 잘 나온 예시만 골라 metric을 만드는 일을 막으려면,
          evaluation slice와 성공 기준을 먼저 versioning합니다. 고정 질문의
          한국어-only 변형, 긴 reasoning 변형, 중국어 번역 “首尔”을 요구하는
          예외 변형을 쌍으로 둡니다. Model checkpoint와 tokenizer revision, chat
          template, thinking mode, prompt, decoding, checker·judge version을 함께
          고정하고 seed를 지원하면 같은 seed를, 그렇지 않으면 반복 횟수와 결과
          분포를 기록합니다. 이런 <strong>preregistration(사전 등록)</strong>은 학술
          등록 제도라기보다 결과를 보기 전에 합격 기준을 정하는 내부 의사결정
          계약입니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["언어", "reasoning·final의 unexpected span과 segment switch를 분리합니다."],
          ["정답", "계산 결과 3,200원과 task benchmark를 candidate마다 동일하게 채점합니다."],
          ["예외", "사용자가 요청한 번역 ‘首尔’과 고유명사·인용을 보존했는지 봅니다."],
          ["운영", "latency·retry·judge token·GPU·artifact 관리 비용을 같은 단위로 기록합니다."],
        ].map(([title, body]) => (
          <div key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>2. 제약에 맞는 candidate 하나와 baseline을 비교합니다</h3>
        <p>
          Weight access가 없고 즉시 실패를 막아야 하면 prompt와 bounded runtime guard가 현실적인 후보입니다. 오픈웨이트에서 특정 문자군만 반복적으로 과다
          생성되면 Smoothie 변환본을 base와 비교합니다. 표면 표기는 안정됐는데 연구용 reasoning trace의 언어·정답 policy가 계속 무너지면 SFT를 먼저
          검토합니다. SFT 이후 여러 candidate의 상대 선호를 바꿀 reliable reward와 judge가 있을 때만 RL을 추가합니다.
        </p>
        <p>
          한 번에 모든 방법을 쌓으면 어느 층이 효과와 회귀를 만들었는지 알 수
          없습니다. Prompt candidate, smoothing candidate, SFT candidate처럼
          intervention을 분리하고 같은 preregistered set에서 paired outcome을
          저장합니다. 조합이 필요하면 각 단일 후보를 통과시킨 뒤 한 단계씩
          추가합니다.
        </p>

        <h3>3. canary에서 offline 근거가 운영에서도 유지되는지 봅니다</h3>
        <p>
          Offline 통과가 곧 전체 배포 승인은 아닙니다. Version을 pin한 candidate를 작은 traffic에 canary로 보냅니다. 언어 오류와 정답, 예외 보존,
          latency는 baseline과 동시에 관찰합니다. Judge가 개입하는 요청 비율과 human review 결과도 별도 metric으로 남깁니다. 이 metric으로
          detector가 조용히 정상 응답을 막고 있지 않은지 확인합니다.
        </p>

        <h3>4. rollback 기준은 배포 전에 수치와 action으로 연결합니다</h3>
        <p>
          예를 들어 unexpected leakage가 목표 이하더라도 번역 예외 보존율이나 핵심 task accuracy가 preregistered floor 아래로 내려가면
          rollback합니다. Runtime guard의 p95 latency나 review queue가 한도를 넘을 때도 같은 action을 정의합니다. 원본
          checkpoint·prompt·checker schema를 보존하고 route만 되돌릴 수 있어야 사고 중에 새 모델을 다시 빌드하지 않아도 됩니다.
        </p>

        <h3>조합의 기준은 중복 차단이 아니라 책임 분담입니다</h3>
        <p>
          Prompt는 기본 정책을 설명하고 model intervention은 반복되는 분포 문제를 줄이며 runtime guard는 드물게 남는 실패를 감지합니다. 세 층이 모두 “외국
          문자를 삭제”하도록 만들면 정상 번역을 여러 번 손상시키고 원인도 찾기 어려워집니다. 각 층의 입력과 출력, metric, fallback을 문서로 남긴 뒤 목표를 달성한 가장
          단순한 구성을 채택합니다.
        </p>
      </div>
    </section>
  );
}
