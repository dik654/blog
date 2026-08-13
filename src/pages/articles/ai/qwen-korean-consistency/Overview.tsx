import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import OverviewViz from "./viz/OverviewViz";

const FOUNDATIONS = [
  ["tokenizer", "/ai/tokenizer", "문자열을 token ID로 나누는 규칙"],
  ["Transformer architecture", "/ai/transformer-architecture", "hidden state와 lm_head까지의 계산 경로"],
  ["SFT", "/ai/supervised-fine-tuning", "정답 예시를 따라 하도록 weight를 갱신하는 학습"],
  ["RLHF", "/ai/rlhf", "reward로 policy의 상대 선호를 바꾸는 큰 그림"],
  ["Open-R1", "/ai/open-r1", "reasoning post-training을 재현하는 도구와 실험 계약"],
] as const;

const TEXT_UNITS = [
  {
    term: "Code point · script",
    meaning:
      "Code point는 Unicode가 문자 요소에 붙인 번호이고, script는 Han·Hangul처럼 표기 체계를 묶은 분류입니다. 둘 다 그 span이 어느 언어로 쓰였는지나 사용 의도를 단독으로 확정하지 못합니다.",
  },
  {
    term: "Grapheme cluster",
    meaning:
      "화면에서 한 글자로 보이는 단위입니다. 하나의 grapheme이 여러 code point의 조합일 수 있으므로 화면 글자 수와 code point 수가 항상 같지는 않습니다.",
  },
  {
    term: "Normalization → tokenizer",
    meaning:
      "겉보기에 같은 문자열도 Unicode 조합이 다를 수 있습니다. NFC 같은 normalization으로 표현을 맞춘 뒤에도 tokenizer는 이를 한 token, 여러 subword 또는 byte 조각으로 나눌 수 있습니다.",
  },
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        먼저 “한국어 문제”를 출력 구간별 실패로 다시 정의합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          다국어 모델이 한국어 질문에 영어·중국어를 섞는 현상을 넓게는
          <strong> language confusion</strong>이라고 부릅니다. 이 글에서
          <strong> language leakage</strong>는 그중에서도 요청과 정책이 허용하지
          않은 언어 span이 출력에 새어 나온 경우를 뜻합니다. 두 용어를 구분해야
          “외국 문자가 하나라도 있으면 실패”라는 잘못된 규칙을 피할 수 있습니다.
        </p>
        <p>
          고정 사례의 “首尔”은 중국어 문자이지만 사용자가 번역을 명시했으므로
          정상입니다. 반면 계산 설명 중에 이유 없이 “因此”가 끼면 문자 단위
          leakage이고, 연구용 reasoning trace 전체가 중국어로 바뀌면 구간 단위
          language confusion입니다. 최종 답변만 검사하면 두 번째 실패를 놓치고,
          문자 집합만 검사하면 정상 번역을 오탐합니다.
        </p>
      </div>

      <ContentBoundary article="qwen-korean-consistency" />

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>문자열이 다음 token으로 바뀌는 경로</h3>
        <p>
          계산 경로를 보기 전에 화면의 글자, Unicode 번호, tokenizer token을 같은
          단위로 취급하지 않아야 합니다. 아래 세 단위는 서로 연결되지만 어느 것도
          그 자체로 “중국어 오류”라는 판정은 아닙니다.
        </p>
      </div>

      <dl className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-3">
        {TEXT_UNITS.map((item) => (
          <div
            key={item.term}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <dt className="break-words text-sm font-semibold">{item.term}</dt>
            <dd className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {item.meaning}
            </dd>
          </div>
        ))}
      </dl>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          모델은 글자를 통째로 이해한 뒤 언어를 고르는 것이 아닙니다. 먼저
          <strong> tokenizer</strong>가 입력 문자열을 vocabulary의 token ID
          배열로 바꾸고, Transformer가 현재 문맥을 요약한
          <strong> hidden state</strong>를 만듭니다. 마지막 <code>lm_head</code>는
          vocabulary의 모든 후보에 <strong>logit</strong>, 즉 softmax 이전의
          정규화되지 않은 점수를 부여합니다.
        </p>
        <p>
          <strong>softmax</strong>는 각 logit을 독립적으로 확률로 바꾸는 함수가
          아니라, vocabulary 전체 후보를 한 분모에서 비교해 상대 확률을
          만듭니다. 따라서 중국어 token 하나의 logit을 낮추면 그 token만 사라지는
          것이 아니라 다른 모든 후보의 상대 확률도 조금씩 달라집니다. 실제 다음
          token은 이 확률과 temperature·top-p 같은 decoding 설정을 거쳐
          선택됩니다.
        </p>
        <p>
          이 계산 경로 때문에 원인을 <code>lm_head</code> 한 행으로만 돌릴 수는
          없습니다. tokenizer가 “首尔”을 몇 조각으로 나누는지, 앞서 생성한
          문맥이 어떤 hidden state를 만드는지, 학습 데이터와 post-training이
          어떤 언어 선호를 남겼는지가 모두 logit에 반영됩니다. Smoothie-Qwen은
          이 경로의 마지막 부분을 고치는 방법이고, SFT와 RL은 앞선 표현과 policy
          자체를 다시 학습하는 방법입니다.
        </p>

        <h3>reasoning과 final은 같은 출력이 아닙니다</h3>
        <p>
          연구 논문은 종종 응답을 reasoning trace와 final answer로 나눠 평가합니다.
          고정 사례라면 계산 근거가 적힌 연구용 trace와 “3,200원”이라는 최종
          답변, “首尔”이라는 번역 필드를 각각 채점해야 합니다. 한 구간이 한국어라고
          다른 구간도 한국어라고 가정할 수 없기 때문입니다.
        </p>
        <p>
          다만 출력된 reasoning trace를 모델 내부 계산의 완전하고 충실한
          설명으로 간주해서는 안 됩니다. 이 글에서 trace는 연구자가 학습·평가를
          위해 명시한 텍스트 필드이며, 제품에서는 숨겨진 chain-of-thought 공개를
          요구하는 대신 정답과 짧고 검증 가능한 근거를 요청할 수 있습니다.
        </p>

        <h3>기반 개념은 정본 글에서 가져옵니다</h3>
        <p>
          아래 개념을 이 글에서 다시 정의하면 설명이 중복되고 수정 지점도
          흩어집니다. 낯선 항목만 먼저 읽고 돌아오면, 이후 절의 수식이 어느
          계산을 바꾸는지 따라갈 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {FOUNDATIONS.map(([label, href, description]) => (
          <Link
            key={href}
            to={href}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4 transition-colors hover:border-primary/50"
          >
            <span className="text-sm font-semibold text-foreground">{label}</span>
            <span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">
              {description}
            </span>
          </Link>
        ))}
      </div>

      <div
        id="paper-qwen3-official"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Qwen3 Technical Report</p>
        <CitationBlock
          source="Qwen Team — Qwen3 Technical Report"
          citeKey={1}
          type="paper"
          href="https://arxiv.org/abs/2505.09388"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Qwen3 모델군의 architecture, pre-training, post-training과 multilingual·reasoning 평가를 한 기술 보고서에서 설명합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> thinking/non-thinking 동작과 dense·MoE 계열을 함께 제시해, 이 글이 다루는 Qwen3 checkpoint의 공식 배경을 제공합니다.</p>
            <p><strong>전제·실험 조건:</strong> 보고서가 명시한 Qwen3 모델군, 학습 recipe, benchmark와 decoding 조건 안에서 읽어야 합니다.</p>
            <p><strong>근거 범위:</strong> Qwen3가 다국어와 reasoning을 대상으로 설계됐다는 배경 근거이며, 한국어 leakage의 단일 원인을 규명한 실험은 아닙니다.</p>
            <p><strong>비주장:</strong> 모든 Qwen3 크기·checkpoint·serving 설정에서 같은 비율의 언어 혼용이 발생하거나 같은 보정법이 최적이라는 주장은 하지 않습니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>이제 실패를 네 label로 기록합니다</h3>
        <p>
          개입 전에 문자 혼용, 구간 전환, reasoning/final 불일치, 정상 예외를
          별도 label로 저장합니다. 길이·도메인·sampling 조건도 함께 기록해야
          프롬프트가 약한 것인지, 특정 입력이 다른 언어를 유도한 것인지, 모델
          version이 바뀐 것인지 재현할 수 있습니다. 다음 절은 가장 값싼 입력
          정책부터 시작하지만, 어떤 방법도 이 관찰 단계를 대신하지는 못합니다.
        </p>
      </div>
    </section>
  );
}
