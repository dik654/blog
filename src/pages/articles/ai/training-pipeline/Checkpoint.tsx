import ExplainedFormula from "@/components/ui/explained-formula";
import CheckpointViz from "./viz/CheckpointViz";

export default function Checkpoint() {
  return (
    <section id="checkpoint" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Best artifact와 resume checkpoint는 목적도 저장 상태도 다릅니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Best artifact는 사전에 정한 validation policy로 선택한 배포 후보입니다.
          Model <code>state_dict</code>, architecture config, tokenizer·scaler·label map
          같은 preprocessing contract가 필요합니다. Last checkpoint는 장애 직전에서
          학습을 이어가기 위한 복구 지점이므로 optimizer·scheduler·AMP scaler,
          optimizer update와 micro-batch 위치, sampler cursor, RNG state가 더
          필요합니다.
        </p>
        <p>
          Momentum과 Adam moment를 잃으면 같은 weight에서 시작해도 다음 update가 달라집니다. 마찬가지로 scheduler 위치나 GradScaler state를
          잃으면 learning rate와 skipped update가 어긋날 수 있습니다. Stream이나 distributed sampler라면 “epoch=3”만으로 다음
          sample을 재현할 수 있는지도 별도로 확인해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8"><CheckpointViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Resume 가능성은 새 process에서 비교해야 합니다</h3>
        <p>
          같은 초기 상태 C로 K+M updates를 연속 실행한 reference를 먼저 만듭니다. 다른 실행은 K updates 뒤 저장한 다음 process를 완전히 종료합니다. 새
          process가 checkpoint를 load해 M updates를 더 수행했을 때 sample ID 순서와 learning rate, global update, loss와 최종
          parameter가 허용 오차 안에서 맞는지 비교합니다.
        </p>
      </div>

      <ExplainedFormula
        question="저장 후 재개가 중단 없는 실행과 같은 training trajectory인지 어떻게 검사할까?"
        idea={<>같은 초기 contract에서 연속 실행의 최종 state와 K번째 checkpoint를 새 process에서 불러 M번 더 update한 state를 비교합니다. Equality 범위는 deterministic mode와 hardware 조건에 맞게 정합니다.</>}
        formula={String.raw`\begin{aligned}\theta_{K+M}^{\mathrm{continuous}}&=\operatorname{Run}(C,K+M),\\\theta_{K+M}^{\mathrm{resume}}&=\operatorname{Run}(\operatorname{Load}(S_K),M),\\\delta_{\mathrm{resume}}&=\|\theta_{K+M}^{\mathrm{continuous}}-\theta_{K+M}^{\mathrm{resume}}\|.\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\theta_{K+M}^{\mathrm{continuous}}&=\underbrace{\operatorname{Run}(C,K+M),}_{\text{initial run contract 계산}}\\\theta_{K+M}^{\mathrm{resume}}&=\underbrace{\operatorname{Run}(\operatorname{Load}(S_K),M),}_{\text{checkpoint state 계산}}\\\delta_{\mathrm{resume}}&=\underbrace{\|\theta_{K+M}^{\mathrm{continuous}}-\theta_{K+M}^{\mathrm{resume}}\|.}_{\text{오른쪽 항으로 결과 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`\operatorname{Run}(C,K+M),`, annotation: ["initial run contract이(가) 식의 결과에","기여하는 방식을 계산합니다.","같은 초기 contract에서 연속 실행의 최종 state와","K번째 checkpoint를 새 process에서 불러 M번"] },
          { expression: String.raw`\operatorname{Run}(\operatorname{Load}(S_K),M),`, annotation: ["checkpoint state이(가) 식의 결과에 기여하는","방식을 계산합니다.","같은 초기 contract에서 연속 실행의 최종 state와","K번째 checkpoint를 새 process에서 불러 M번"] },
          { expression: String.raw`\|\theta_{K+M}^{\mathrm{continuous}}-\theta_{K+M}^{\mathrm{resume}}\|.`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","같은 초기 contract에서 연속 실행의 최종 state와","K번째 checkpoint를 새 process에서 불러 M번","더 update한 state를 비교합니다."] },
        ]}
        terms={[
          { symbol: "C", name: "initial run contract", description: "Code·data·config·seed·environment를 포함한 공통 초기 조건입니다." },
          { symbol: "S_K", name: "checkpoint state", description: "K번째 optimizer update 뒤 저장한 model·optimizer·scheduler·RNG·sampler 상태입니다." },
          { symbol: "θ", name: "model parameters", description: "연속 실행과 resume 실행의 최종 학습 weight입니다." },
          { symbol: "δ_resume", name: "resume divergence", description: "두 최종 parameter vector의 차이를 정한 norm으로 측정한 값입니다." },
        ]}
        assumptions={["두 실행은 같은 sample order와 augmentation randomness를 소비합니다.", "같은 PyTorch·CUDA·library·hardware 조건에서 deterministic algorithm을 요구할지 먼저 정합니다.", "Bitwise equality가 보장되지 않는 조건에서는 loss·metric·parameter tolerance와 비교 step을 사전에 고정합니다."]}
        interpretation="δ가 커졌다면 model weight만 보지 말고 첫 divergence update의 sample IDs·LR·AMP scale·optimizer buffer·RNG를 차례로 비교합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>저장 파일도 commit처럼 완결된 뒤 공개합니다</h3>
        <p>
          같은 filesystem의 임시 경로에 모두 쓰고 flush·checksum을 확인한 뒤 atomic
          rename합니다. Distributed run에서는 저장 owner와 barrier를 정합니다.
          신뢰할 수 없는 pickle checkpoint는 임의 code 실행 위험이 있으므로 받지
          않으며, 가능한 경우 <code>weights_only=True</code>와 명시적인
          <code>state_dict</code> schema를 사용합니다.
        </p>
      </div>

      <div id="docs-pytorch-checkpoint" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 예제 따라 읽기 · Saving and Loading Models</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공식 recipe도 inference용 weight 저장과 general checkpoint를 구분하며 resume에는 optimizer state를 포함해야 한다고 설명합니다.
          다만 sampler·RNG·distributed cursor는 각 pipeline이 쓰는 무작위성과 data path에 맞춰 직접 채워 넣어야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html" target="_blank" rel="noreferrer">공식 state_dict·general checkpoint recipe 보기</a>
      </div>
    </section>
  );
}
