import RuntimeGuardViz from "./viz/RuntimeGuardViz";

const CALIBRATION = [
  ["true positive", "예기치 않은 언어 전환을 잡고 retry·review로 보냅니다."],
  ["false positive", "정상 번역 ‘首尔’을 위반으로 잘못 판단해 정답을 막습니다."],
  ["true negative", "한국어 계산·final과 허용 번역을 그대로 통과시킵니다."],
  ["false negative", "문자 규칙을 피한 의미상 언어 전환이나 로마자 표기를 놓칩니다."],
] as const;

export default function RuntimeGuard() {
  return (
    <section id="runtime-guard" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        런타임 가드는 문자 탐지와 의미 판정을 분리합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          모델 weight를 바꾸기 어렵거나 드문 실패를 배포 경계에서 막아야 한다면,
          생성 결과를 검사한 뒤 통과·재시도·검토를 결정할 수 있습니다. 이때
          값싼 deterministic checker는 <strong>문자와 구조</strong>를 찾고, LLM
          judge는 요청을 읽어 <strong>그 사용이 허용됐는지</strong> 판단합니다.
          두 역할을 섞지 않아야 정상 중국어 번역을 지우지 않으면서 명백한
          leakage를 빠르게 잡을 수 있습니다.
        </p>
        <p>
          고정 사례의 계산 설명에 “因此”가 끼면 checker가 Han script span을
          표시하고 judge는 예상하지 않은 전환이라고 판정할 수 있습니다. 그러나
          번역 필드의 “首尔”도 같은 Han character이므로, checker 결과만으로
          실패시키면 false positive입니다. script detector는 언어 semantics가
          아니라 검토 대상을 먼저 고르는 <strong>triage signal(선별 신호)</strong>
          이라는 경계를 코드와 운영 지표에 남겨야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <RuntimeGuardViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>1단계: deterministic checker는 관찰 가능한 사실만 반환합니다</h3>
        <p>
          Unicode range, script run 길이, 허용된 출력 field 밖의 문자 위치처럼
          같은 입력에 항상 같은 결과를 내는 규칙은 빠르고 설명하기 쉽습니다.
          다만 U+4E00–U+9FFF는 중국어만의 영역이 아니며 일본어 kanji와 한국어
          한자도 겹칩니다. language detector도 짧은 span에서는 불확실하므로,
          결과 이름을 <code>isChinese</code>보다 <code>hanSpans</code>처럼 사실에
          가깝게 짓는 편이 안전합니다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 overflow-hidden rounded-xl border border-border bg-muted/15 p-4 sm:p-5">
        <pre className="min-w-0 whitespace-pre-wrap break-words bg-transparent p-0 text-sm leading-6 text-foreground">
          {`type ScriptFinding = {
  field: "rationale" | "final_answer" | "translation";
  span: string;
  script: "Han";
  start: number;
  end: number;
};

// 사실만 반환한다. 오류 여부는 여기서 결정하지 않는다.
function findHanSpans(fields): ScriptFinding[] { /* ... */ }`}
        </pre>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Regex를 통과했다고 자연스러운 한국어라는 뜻도 아니고, span이 발견됐다고
          오류라는 뜻도 아닙니다. 고정 사례에서 <code>translation</code>의
          “首尔”은 allow rule로 통과시키되, 동일 span이
          <code>rationale</code>에 있으면 judge 대상으로 보냅니다.
        </p>

        <h3>2단계: false positive와 false negative를 함께 보정합니다</h3>
        <p>
          임계값은 감으로 정하지 않고 사람이 label한 calibration set에서 confusion matrix를 계산합니다. 번역·인용·고유명사처럼 허용 외국어가 많은 slice와
          예기치 않은 문자·구간 전환 slice를 함께 넣어야 탐지율을 올리다가 정상 응답을 과도하게 막는 문제가 보입니다.
        </p>
        <p>
          Threshold를 고른 calibration set과 별도의 holdout에서 같은 confusion matrix와 slice별 비용을 다시 확인합니다. Regex·Unicode
          normalization, language detector, judge model·prompt·schema version을 함께 기록해야 다음 배포에서 threshold 변화와
          detector 교체 효과를 구분합니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {CALIBRATION.map(([label, body]) => (
          <div key={label} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">{label}</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>3단계: 애매한 응답만 judge가 구조화해 판정합니다</h3>
        <p>
          Judge에는 원래 요청, 출력 field, checker findings, 허용 예외를 함께 제공합니다. 자유로운 비평문 대신 versioned schema로 판정하게 하면
          runtime이 문자열을 다시 추측하지 않고 분기합니다. 최소한 verdict, 위반 유형, span, confidence, 권장 action을 분리하고 schema를 채우지 못한
          결과는 pass로 간주하지 않습니다.
        </p>
      </div>

      <div className="not-prose my-6 min-w-0 overflow-hidden rounded-xl border border-border bg-muted/15 p-4 sm:p-5">
        <pre className="min-w-0 whitespace-pre-wrap break-words bg-transparent p-0 text-sm leading-6 text-foreground">
          {`{
  "verdict": "pass | retry | review",
  "violation": "none | unexpected_script | segment_switch | uncertain",
  "field": "rationale | final_answer | translation",
  "unexpected_spans": ["..."],
  "allowed_exception": true,
  "reason": "짧고 검증 가능한 근거"
}`}
        </pre>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          생성 모델과 judge가 같은 provider·model family라면 outage, prompt interpretation, language bias가 서로 상관될 수
          있습니다. Judge 호출을 하나 더 붙였다고 독립 검증이 되는 것은 아니므로 deterministic 정답 checker, 다른 family의 evaluator, sampled
          human review를 위험도에 맞게 섞습니다.
        </p>

        <h3>4단계: retry는 상한 뒤에 degrade나 review로 끝납니다</h3>
        <p>
          같은 prompt와 같은 sampling으로 무한 재생성하면 같은 실패와 비용만
          반복됩니다. 재시도에는 위반 field와 허용 예외를 짧게 피드백하고 횟수를
          제한합니다. 상한에 도달하면 중요도에 따라 최종 답변만 제공하는
          <strong>축약 응답으로 전환(degrade)</strong>, 사람이 확인하는
          <strong>review</strong>, 명시적 실패 중 하나로 종료합니다. 마지막 후보를
          임의로 pass시키는 것은 bounded retry가 아닙니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 lg:grid-cols-3">
        {[
          ["retry", "다른 instruction·route로 제한 횟수만 다시 생성하고 같은 paired checker를 적용합니다."],
          ["degrade", "계산 정답 3,200원처럼 검증 가능한 핵심만 제공하고 불확실한 부가 구간은 생략합니다."],
          ["review", "번역·법률·고위험 응답처럼 자동 판정 불확실성이 큰 사례를 사람에게 넘깁니다."],
        ].map(([title, body]) => (
          <div key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>운영 지표는 통과율보다 오류 비용을 보여 줘야 합니다</h3>
        <p>
          첫 시도 통과율, checker–judge 불일치, 사람이 확인한 false positive·false
          negative, retry 후 과제 정답률, 번역 예외 보존율, p50·p95 latency와 token
          비용을 slice별로 기록합니다. 가드가 지속적으로 많은 응답을 재시도한다면
          규칙을 더 복잡하게 쌓기보다 prompt, checkpoint, decoding과 입력 언어
          분포를 upstream에서 고칩니다.
        </p>
      </div>
    </section>
  );
}
