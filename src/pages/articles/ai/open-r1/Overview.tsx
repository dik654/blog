import ContentBoundary from "@/components/articles/content-boundary";
import { Link } from "react-router-dom";
import ReproductionScopeViz from "./viz/ReproductionScopeViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Open-R1은 checkpoint 하나가 아니라 공개 reasoning recipe를 재구성하는
        프로젝트다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          DeepSeek-R1은 weight와 technical report를 공개했지만 원 training data,
          전체 code와 모든 hyperparameter까지 제공한 것은 아닙니다. Hugging
          Face의 Open-R1은 이 빈칸을 synthetic data generation, SFT, GRPO와
          LightEval 기반 평가로 다시 구축해 누구나 실험 조건을 바꾸고 검증할 수
          있게 하는 프로젝트입니다.
        </p>
        <p className="leading-8">
          여기서 <strong>checkpoint</strong>는 특정 시점의 model parameter와
          tokenizer·config를 묶은 저장본이고, <strong>recipe</strong>는 그
          checkpoint를 만든 data·code·sampling·training·evaluation 절차를
          뜻합니다. 같은 checkpoint와 비슷한 score를 얻었다고 해서 원래
          recipe까지 재현한 것은 아닙니다. 반대로 완전히 같은 weight를 만들지
          못해도 공개 조건에서 같은 학습 현상과 성능 범위를 반복해서 확인했다면
          recipe 일부를 재현했다고 말할 수 있습니다.
        </p>
        <p className="leading-8">
          그러므로 “R1을 재현했다”는 표현만으로는 부족합니다. Teacher trace를
          작은 model에 SFT한 distillation, cold-start SFT 없이 base model에 RL을
          적용하는 R1-Zero-like 경로, 여러 단계를 이어 붙이는 최종 R1 recipe는
          서로 다른 claim입니다. Open-R1 저장소도 distillation, pure RL,
          multi-stage의 세 단계를 별도 목표로 제시합니다.
        </p>
      </div>

      <ReproductionScopeViz />

      <div
        id="paper-deepseek-r1"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          핵심 논문 · DeepSeek-R1 Technical Report
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          논문의 핵심 아이디어는 하나의 학습법을 제시하는 데 그치지 않고, SFT
          없이 base model에 RL을 적용한 R1-Zero 경로와 cold-start data·여러 RL
          stage를 결합한 R1 경로, 큰 model의 reasoning trace를 작은 dense
          model에 옮긴 distillation 경로를 분리한 것입니다. 공개 benchmark와
          checkpoint는 이 세 경로의 가능성을 보여 주지만, 원 training data와
          모든 implementation detail이 포함된 완전한 재현 package라는 뜻은
          아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2501.12948"
          target="_blank"
          rel="noreferrer"
        >
          논문의 세 training 경로와 실험 범위 보기
        </a>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>이 글이 답하려는 질문</h3>
        <p className="leading-8">
          이 글은 “GRPO를 쓰면 reasoning이 생긴다”는 결과 요약보다, 어떤
          checkpoint가 어떤 completion을 만들고 verifier가 무엇을 보상하며 그
          data가 어느 update에 들어가는지를 추적합니다. Preference alignment의
          일반적인 feedback·policy 경계는{" "}
          <Link to="/ai/rlhf">RLHF 정본 글</Link>에서 먼저 볼 수 있고, 여기서는
          자동으로 정답을 확인할 수 있는 RLVR(Reinforcement Learning with
          Verifiable Rewards)와 Open-R1의 재현 계약에 집중합니다.
        </p>

        <h3>Distillation과 on-policy RL은 data가 생기는 시점부터 다르다</h3>
        <p className="leading-8">
          Distillation SFT에서는 teacher가 만든 trace dataset을 고정한 뒤
          student가 그 token sequence를 모사합니다. 반면 on-policy RL에서는 현재
          student policy가 completion을 생성하고, verifier가 붙인 reward가 바로
          다음 update의 신호가 됩니다. Policy가 달라지면 rollout distribution도
          바뀌므로, 한 번 만든 dataset을 학습하는 문제보다
          sampler·trainer·verifier의 version 일치가 중요해집니다.
        </p>

        <h3>결과는 model 하나가 아니라 recipe ledger로 남긴다</h3>
        <p className="leading-8">
          Base checkpoint, dataset revision, chat template, rollout engine,
          reward code, optimizer config와 evaluation protocol을 함께 남겨야
          재현할 수 있습니다. 이후 절에서는 SFT의 token supervision, GRPO의
          relative advantage와 policy objective, verifier의 맹점, synthetic data
          lineage, sampling evaluation 순서로 내려갑니다.
        </p>
      </div>
      <ContentBoundary article="open-r1" />
    </section>
  );
}
