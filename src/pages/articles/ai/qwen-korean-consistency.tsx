import Overview from "./qwen-korean-consistency/Overview";
import PromptLevel from "./qwen-korean-consistency/PromptLevel";
import { Link } from "react-router-dom";
import RuntimeGuard from "./qwen-korean-consistency/RuntimeGuard";
import DecisionMatrix from "./qwen-korean-consistency/DecisionMatrix";

const ARTICLE_PATH = [
  ["현상 분류", "문자 혼용인지, 구간 전환인지, 정상 예외인지 먼저 가릅니다."],
  ["입력 정책", "프롬프트로 기대 언어와 허용 예외를 명시합니다."],
  ["출력층 보정", "독립 글에서 Smoothie-Qwen의 weight 편집 계약을 검증합니다."],
  ["학습", "독립 글에서 SFT와 Oracle-Guided Dr.GRPO의 update 경계를 읽습니다."],
  ["운영 가드", "규칙·judge·재시도·사람 검토의 책임을 나눕니다."],
  ["배포 결정", "같은 paired evaluation으로 후보를 비교하고 rollback을 준비합니다."],
] as const;

export default function QwenKoreanConsistencyArticle() {
  return (
    <div className="space-y-12">
      <header className="min-w-0">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 “Qwen이 한국어를 잘하느냐”를 한 점수로 판정하지 않습니다.
            먼저 <strong>어느 출력 구간에서 어떤 언어가 왜 문제인지</strong>를
            정의한 다음, 프롬프트·출력층 보정·SFT/RL·런타임 가드 가운데 가장
            직접적인 개입을 고릅니다. 여섯 절은 아래의 한 평가 사례를 계속
            사용하므로, 방법이 달라져도 성공 조건은 바뀌지 않습니다.
          </p>
        </div>

        <aside
          aria-label="이 글에서 계속 사용하는 평가 사례"
          className="mt-7 min-w-0 rounded-xl border border-border bg-muted/15 p-4 sm:p-5"
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
            고정 평가 사례
          </p>
          <p className="mt-2 break-words text-sm font-semibold leading-6 text-foreground">
            질문: “9,600원을 세 사람이 같은 금액으로 나눌 때 한 사람 몫을
            계산하고, 마지막에 ‘서울’을 중국어로 번역해 주세요.”
          </p>
          <dl className="mt-4 grid min-w-0 gap-3 text-sm sm:grid-cols-3">
            <div className="min-w-0 rounded-lg border border-border/70 bg-background p-3">
              <dt className="font-semibold">연구용 reasoning trace</dt>
              <dd className="mt-1 break-words leading-6 text-muted-foreground">
                “9,600을 3으로 나누면 3,200이다”처럼, 평가를 위해 명시적으로
                수집한 구간은 한국어여야 합니다.
              </dd>
            </div>
            <div className="min-w-0 rounded-lg border border-border/70 bg-background p-3">
              <dt className="font-semibold">최종 답변</dt>
              <dd className="mt-1 break-words leading-6 text-muted-foreground">
                “한 사람 몫은 3,200원입니다”가 정답이며 자연스러운 한국어로
                제시되어야 합니다.
              </dd>
            </div>
            <div className="min-w-0 rounded-lg border border-border/70 bg-background p-3">
              <dt className="font-semibold">정상 중국어 예외</dt>
              <dd className="mt-1 break-words leading-6 text-muted-foreground">
                사용자가 번역을 요청했으므로 “首尔”은 leakage가 아니라 보존해야
                할 정답입니다.
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            여기서 reasoning trace는 논문 실험처럼 연구자가 출력 형식으로 정의한
            관찰 대상입니다. 일반 제품이 모델의 숨겨진 chain-of-thought를
            사용자에게 공개해야 한다는 뜻은 아닙니다.
          </p>
        </aside>

        <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLE_PATH.map(([title, description], index) => (
            <div
              key={title}
              className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
            >
              <p className="text-xs font-bold text-primary">{index + 1}</p>
              <p className="mt-1 text-sm font-semibold">{title}</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </header>

      <Overview />
      <PromptLevel />
      <section id="smoothie-qwen" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">출력층 보정은 별도 모델 후보로 평가합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Smoothie-Qwen은 prompt 규칙이 아니라 tokenizer에서 추정한 token risk를
            <code>lm_head</code> 행의 scale로 바꾸는 post-hoc weight 편집입니다.
            정상 번역 token까지 약해질 수 있고 softmax 전체가 다시 정규화되므로,
            수식·token 분류·paired evaluation은 독립 글에서 다룹니다.
          </p>
          <p>
            <Link to="/ai/smoothie-qwen-weight-editing">
              Smoothie-Qwen weight editing 글로 이동 →
            </Link>
          </p>
        </div>
      </section>
      <section id="rl-approach" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">Reasoning policy update는 별도 학습 실험입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한국어 reasoning SFT와 oracle-guided Dr.GRPO는 weight를 직접 업데이트하고 checker·judge·rollout distribution까지
            학습 결과에 영향을 줍니다. 화면의 문자 혼용을 줄이는 운영 가드와 같은 개입으로 취급하지 않습니다.
          </p>
          <p>
            <Link to="/ai/qwen-korean-reasoning-posttraining">
              Qwen 한국어 reasoning post-training 글로 이동 →
            </Link>
          </p>
        </div>
      </section>
      <RuntimeGuard />
      <DecisionMatrix />
    </div>
  );
}
