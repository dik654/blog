import ExplainedFormula from "@/components/ui/explained-formula";
import LoggingViz from "./viz/LoggingViz";

export default function Logging() {
  return (
    <section id="logging" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">로그는 점수에서 원인과 artifact까지 거슬러 올라가는 index입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Validation score 하나만 남기면 어느 data와 code로 만든 결과인지 알 수
          없습니다. Run ID에서 code revision, data snapshot, split manifest,
          resolved config, environment fingerprint, checkpoint와 evaluation report로
          이동할 수 있어야 합니다. Model 내부에서는 loss·task metric뿐 아니라
          learning rate, gradient norm, AMP scale, skipped updates를 기록합니다.
        </p>
        <p>
          System 지표에는 samples/s 또는 valid tokens/s, data wait, device compute,
          GPU memory를 포함합니다. 결과가 나빠졌을 때 optimization 문제인지 input
          starvation인지 구분하려면 품질과 system timeline이 같은 optimizer update
          clock에 정렬돼야 합니다.
        </p>
      </div>

      <div className="not-prose my-8"><LoggingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Batch metric의 평균이 dataset metric과 같지는 않습니다</h3>
        <p>
          크기가 64인 batch와 마지막 크기 5인 batch의 accuracy를 단순 평균하면
          두 batch에 같은 weight를 줍니다. Token task에서는 padding 양이 다른
          batch도 같은 문제가 생깁니다. Metric이 합산 가능한 sufficient statistics로
          표현되면 rank와 batch마다 분자·분모를 누적한 뒤 마지막에 한 번 나눕니다.
        </p>
      </div>

      <ExplainedFormula
        question="Batch 크기나 valid token 수가 달라도 전체 평균 metric을 정확히 어떻게 계산할까?"
        idea={<>각 batch metric 자체를 평균내지 않고 metric의 합계인 분자와 유효 관측 수인 분모를 따로 더합니다. Distributed run도 두 값부터 all-reduce한 뒤 나눕니다.</>}
        formula={String.raw`\begin{aligned}U&=\sum_{r=1}^{W}\sum_{b}U_{r,b},\\N&=\sum_{r=1}^{W}\sum_{b}N_{r,b},\\M&=U/N.\end{aligned}`}
        terms={[
          { symbol: "U_r,b", name: "metric numerator", description: "Rank r의 batch b에서 맞힌 sample 수·loss 합·correct token 수 같은 합산값입니다." },
          { symbol: "N_r,b", name: "valid denominator", description: "해당 batch의 실제 sample 또는 PAD를 제외한 token 수입니다." },
          { symbol: "W", name: "world size", description: "Metric statistics를 합칠 distributed rank 수입니다." },
          { symbol: "M", name: "global metric", description: "전체 유효 관측에 같은 weight를 준 최종 평균입니다." },
        ]}
        assumptions={["Metric이 numerator와 denominator로 분해 가능한 평균형 통계입니다.", "F1·AUROC처럼 전체 prediction order나 confusion totals가 필요한 metric은 해당 sufficient statistics 또는 prediction을 별도 집계합니다.", "Checkpoint 선택 전에 모든 rank의 통계를 같은 evaluation set에서 reduce합니다."]}
        interpretation="Accuracy .5인 64-sample batch와 1.0인 5-sample batch의 단순 평균은 .75지만, 올바른 전체 accuracy는 (32+5)/(64+5)≈.536입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Learning curve는 결론이 아니라 다음 진단을 고르는 신호입니다</h3>
        <p>
          Train loss가 내려가고 validation이 나빠지면 overfitting일 수 있지만 split
          shift·metric bug·eval mode 누락도 같은 모양을 만들 수 있습니다. Class,
          source, sequence length 같은 slice와 representative prediction을 함께 보고
          원인을 좁힙니다. Early stopping도 monitor metric·direction·minimum delta·
          patience·evaluation interval을 사전에 정한 model-selection policy입니다.
        </p>
      </div>

      <div id="docs-pytorch-reproducibility" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 따라 읽기 · Reproducibility</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Seed는 출발점일 뿐입니다. PyTorch 문서는 release·platform·CPU/GPU가
          달라지면 완전한 재현을 보장하지 않는다고 명시하고, Python·NumPy·PyTorch
          RNG, DataLoader worker seed, cuDNN benchmark와 deterministic algorithms를
          서로 다른 설정으로 설명합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/notes/randomness" target="_blank" rel="noreferrer">재현성의 보장 범위와 worker seeding 보기</a>
      </div>
    </section>
  );
}
