import ExplainedFormula from "@/components/ui/explained-formula";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation";
import { Link } from "react-router-dom";

export default function Practice() {
  return (
    <section id="practice" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        배포 단위는 adapter 파일 하나가 아닙니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          학습이 끝나면 작은 adapter checkpoint가 생깁니다. 하지만 이 파일만으로는
          같은 모델을 복원할 수 없습니다. Adapter는 정확한 base revision,
          tokenizer와 target module 위에서만 의미가 있기 때문입니다.
        </p>
        <p>
          그래서 실제 배포 단위는 base와 adapter를 함께 식별하고 load·merge와 task 평가를 통과한 serving artifact입니다. 이름이 비슷해도 base
          hash나 module shape가 다르면 조용히 계속하지 않고 실패시켜야 합니다.
        </p>
        <p>
          평가는 frozen base와 adapter-enabled model을 같은 prompt와 decoding으로
          비교합니다. 가능하면 full fine-tuning baseline도 추가합니다. Target
          성능뿐 아니라 general capability, format, safety, 긴 길이와 seed variance를
          함께 봐야 개선과 회귀를 구분할 수 있습니다.
        </p>
      </div>
      <ProgressiveDetail
        title="재현 가능한 adapter manifest에는 무엇을 고정해야 하나요?"
        preview="Base·tokenizer·adapter 구조·학습 데이터·배포 변환을 하나의 versioned artifact로 묶어야 합니다."
      >
        <p>
          Base revision과 hash, tokenizer, chat template, target module, rank, α,
          dropout, initialization과 quantization config를 기록합니다. Data split과
          training code revision도 같은 manifest에 연결합니다.
        </p>
        <p>
          Merge 전후에는 logit maximum error와 relative error의 tolerance를 먼저
          고정하고 task metric을 함께 확인합니다. QLoRA라면 full-precision LoRA도
          비교해 quantized base에서 생긴 차이를 분리합니다.
        </p>
      </ProgressiveDetail>
      <div id="checkpoint-resume" className="scroll-mt-24">
        <h3 className="mt-10 text-xl font-bold">
          전원이 꺼진 뒤 weight만 읽으면 같은 학습을 이어 간 것이 아닙니다
        </h3>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            (가정) 2,000번째 갱신을 목표로 LoRA를 학습하던 중 1,800번째 갱신 직후
            worker가 종료됐습니다. Adapter weight만 다시 읽자 loss는 계속 내려갔지만,
            learning rate가 처음 값으로 돌아갔고 이미 본 mini-batch를 다시 읽었습니다.
            파일은 복구됐지만 학습의 진행 상태는 복구되지 않은 사건입니다.
          </p>
          <p>
            이 차이를 보려면 저장 목적을 둘로 나눕니다. 추론용 adapter는 base model 위에
            얹을 작은 weight와 설정을 남깁니다. 중단 복구용 checkpoint는 다음 optimizer
            update를 같은 위치에서 계산하는 데 필요한 상태를 남깁니다. 두 묶음은 겹칠 수
            있지만 완료 조건은 다릅니다.
          </p>
        </div>
        <div className="not-prose my-8 max-w-full overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/30">
                <th className="px-3 py-3">복원할 것</th>
                <th className="px-3 py-3">1,800 step 사례에서 맡는 일</th>
                <th className="px-3 py-3">빠졌을 때 보이는 증상</th>
                <th className="px-3 py-3">확인할 증거</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ["Model·adapter state", "1,800번째 갱신까지 배운 값", "loss가 과거 지점과 전혀 이어지지 않음", "tensor key·shape·digest"],
                ["Optimizer state", "momentum·moment 같은 누적량", "첫 갱신의 크기와 방향이 달라짐", "optimizer state file과 parameter group"],
                ["Scheduler state", "1,801번째 learning rate", "warmup이나 decay가 처음부터 다시 시작", "global step과 learning rate"],
                ["RNG state", "dropout·sampling의 다음 난수", "같은 seed를 다시 줘도 중간 지점 뒤가 달라짐", "Python·NumPy·framework·device RNG"],
                ["Data position", "다음에 읽을 batch·sampler 위치", "이미 본 sample을 반복하거나 일부를 건너뜀", "sampler epoch·cursor·worker topology"],
              ].map((row) => (
                <tr key={row[0]} className="align-top">
                  {row.map((cell) => <td key={cell} className="px-3 py-3 leading-6 text-muted-foreground">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Transformers Trainer의 현재 공식 경로에서는 checkpoint 디렉터리를 지정해
            학습을 재개합니다. 다만 호출이 성공했다는 사실만 보지 않습니다. 재개 전 마지막
            기록과 재개 후 첫 기록에서 global step, learning rate, data position과 checkpoint
            digest를 대조해야 합니다.
          </p>
        </div>
        <pre className="not-prose my-6 max-w-full overflow-x-auto rounded-xl border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`# Hugging Face Transformers Trainer의 현재 API
checkpoint = "out/checkpoint-1800"
trainer.train(resume_from_checkpoint=checkpoint)

# 별도 실행 기록에 남길 최소 판독값(예시)
receipt = {
    "checkpoint": checkpoint,
    "global_step_before": 1800,
    "global_step_after_first_update": 1801,
    "lr_before": 1.2e-5,
    "lr_after": 1.199e-5,
    "dataset_revision": "sha256:…",
    "sampler_cursor": 57600,
}`}</code></pre>
        <div className="not-prose my-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-emerald-600/30 bg-emerald-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wide">정상 판독 · 예시 출력</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-background p-3 text-xs leading-5"><code>{`step 1800 → 1801
lr 1.200e-05 → 1.199e-05
sampler cursor 57,600 → 57,632
checkpoint digest: match`}</code></pre>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">진행 좌표가 단조롭게 이어지고 입력 revision도 같습니다. 이 증거가 있어야 “재개했다”는 주장을 할 수 있습니다.</p>
          </div>
          <div className="rounded-xl border border-rose-600/30 bg-rose-500/5 p-4">
            <p className="text-xs font-bold uppercase tracking-wide">실패 판독 · 예시 출력</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-background p-3 text-xs leading-5"><code>{`step 1800 → 1
lr 1.200e-05 → 2.000e-04
sampler cursor 57,600 → 0
optimizer state: missing`}</code></pre>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Weight는 읽었지만 새 optimizer run을 시작했습니다. 이전 실행과 같은 run으로 덮지 말고 새 attempt로 기록합니다.</p>
          </div>
        </div>
        <CitationBlock
          source="Hugging Face Transformers · Trainer features"
          citeKey={1}
          href="https://huggingface.co/docs/transformers/trainer_recipes#resume-training-from-a-checkpoint"
        >
          현재 문서는 resume 시 optimizer·scheduler·RNG state를 복원한다고 설명하며,
          model만 저장한 checkpoint에는 optimizer와 scheduler가 없어 처음부터 다시
          시작된다는 경계를 함께 밝힙니다. JIT checkpoint는 불완전 저장 표식과 종료
          유예 시간도 별도로 확인해야 합니다.
        </CitationBlock>
        <CitationBlock
          source="Hugging Face PEFT · Checkpoint format"
          citeKey={2}
          href="https://huggingface.co/docs/peft/main/developer_guides/checkpoint"
        >
          PEFT adapter 저장물은 adapter weight와 설정을 담으며 원본 base model을
          별도로 필요로 합니다. 따라서 adapter가 load된다는 사실은 optimizer step을
          이어 갈 training checkpoint가 완전하다는 뜻이 아닙니다.
        </CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            학습을 끝낼 때는 재개용 checkpoint를 그대로 production에 올리지 않습니다.
            Base revision, adapter와 tokenizer digest, chat template, data·code revision,
            held-out slice 결과, merge·quantization 경로를 새 후보 묶음으로 만들고 아래의
            동치 검사와 task gate를 통과시킵니다. 이 지점부터는 학습 복구가 아니라
            배포 승격 문제입니다.
          </p>
        </div>
      </div>
      <ExplainedFormula
        question="Unmerged LoRA를 base weight에 합치면 왜 같은 linear output을 만들 수 있을까요?"
        idea={<>분배법칙으로 W와 sBA를 먼저 더한 새 weight를 만들 수 있습니다. 같은 dtype에서 dropout이 꺼진 deterministic inference라면 두 경로의 결과가 수치 오차 범위에서 일치해야 합니다.</>}
        formula={String.raw`\begin{aligned}
Wx+sBAx&=(W+sBA)x\\
&=W'x\\
W'&=W+sBA
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\underbrace{Wx+sBAx}_{\text{unmerged: 두 경로 합}}&=(\underbrace{W+sBA}_{\text{base+adapter delta}})x\\&=\underbrace{W'x}_{\text{merged: matmul 한 번}}\\W'&=W+sBA\end{aligned}`}
        operations={[
          { expression: String.raw`(W+sBA)x`, annotation: ["분배법칙으로 base weight와", "low-rank delta를 먼저 더해 둡니다"] },
          { expression: String.raw`W'x`, annotation: ["합친 W′ 하나로 같은 linear output", "dropout이 꺼진 같은 dtype이면", "logit max error가 수치 오차 안이어야 함"] },
        ]}
        terms={[
          { symbol: "W", name: "base weight", description: "Adapter와 호환되는 원본 linear weight입니다." },
          { symbol: "sBA", name: "adapter delta", description: "학습된 low-rank update를 base shape로 materialize한 값입니다." },
          { symbol: "W'", name: "merged weight", description: "Base와 adapter를 합쳐 한 matmul로 실행할 수 있는 새 artifact입니다." },
        ]}
        assumptions={["Inference에서 adapter dropout이 꺼져 있고 같은 bias·dtype·operator를 사용합니다.", "Base revision과 target module shape가 학습 시점과 일치합니다.", "Quantization·rounding·different accumulation이 들어가면 bitwise equality가 아니라 tolerance와 task metric으로 비교합니다."]}
        interpretation="Unmerged output과 merged output의 logit max error를 먼저 검사한 뒤 task metric·latency를 비교합니다. 여러 adapter를 동적으로 바꿔야 한다면 merge 이점과 routing 유연성을 맞바꿉니다."
      />
      <ExplainedFormula
        question="QLoRA adapter를 merge한 뒤 왜 ‘원래 4-bit base에 adapter만 더했다’고 볼 수 없을까요?"
        idea={<>Quantizer Q는 rounding과 clipping이 있는 비선형 연산이므로 일반적으로 덧셈을 보존하지 않습니다. Dequantize한 base에 delta를 더한 뒤 다시 quantize하면 새로운 code·scale·오차를 가진 artifact가 됩니다.</>}
        formula={String.raw`\begin{aligned}
\widetilde W&=D(q_W,s_W)+sBA\\
Q(\widetilde W)&\ne q_W+Q(sBA)\\
&\text{(generally)}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\widetilde W&=\underbrace{D(q_W,s_W)}_{\text{4-bit base 복원}}+\underbrace{sBA}_{\text{학습된 delta}}\\\underbrace{Q(\widetilde W)}_{\text{다시 quantize}}&\ne \underbrace{q_W+Q(sBA)}_{\text{원래 code에 delta만 추가}}\\&\text{(generally)}\end{aligned}`}
        operations={[
          { expression: String.raw`D(q_W,s_W)+sBA`, annotation: ["frozen 4-bit code를 dequantize해", "higher precision delta를 더합니다"] },
          { expression: String.raw`q_W+Q(sBA)`, annotation: ["rounding·clipping은 덧셈을 보존하지 않아", "requantize하면 새 code·scale·오차를 가진", "별도 artifact가 됩니다"] },
        ]}
        terms={[
          { symbol: "Q,D", name: "quantize · dequantize", description: "Real-valued weight와 low-bit code/metadata 사이 변환입니다." },
          { symbol: "q_W,s_W", name: "base quantized artifact", description: "QLoRA training에 사용한 frozen code와 scale입니다." },
          { symbol: "sBA", name: "learned delta", description: "Higher precision으로 학습된 adapter update입니다." },
          { symbol: "W tilde", name: "merged real-valued weight", description: "Dequantize한 base와 adapter delta를 더했지만 아직 다시 quantize하지 않은 weight입니다." },
        ]}
        assumptions={["Requantization method·grouping·calibration·dtype·kernel을 새 artifact manifest에 기록합니다.", "Merged fp16/bf16과 merged-requantized quality를 unmerged QLoRA와 각각 비교합니다.", "Equality가 우연히 성립하는 scalar/quantization cell이 있어도 일반적인 선형성은 아닙니다."]}
        interpretation="Merge 후 4-bit로 다시 저장하려면 새 quantization error가 생깁니다. 그래서 unmerged 4-bit base+adapter, merged higher-precision, merged+requantized를 서로 다른 checksum과 benchmark로 승인합니다."
      />
      <div className="not-prose my-8 rounded-xl border border-border bg-muted/20 p-5">
        <p className="text-sm font-semibold">여러 adapter를 동시에 서빙하려면</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Adapter를 합칠지, base는 한 번만 올리고 요청마다 adapter를 바꿀지는
          학습 산출물의 승격과 다른 운영 문제입니다. Adapter 적재·퇴거, 요청별 선택,
          batching과 GPU 메모리 관리는 전용 글에서 한 요청을 끝까지 따라가며 설명합니다.
        </p>
        <Link
          className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
          to="/cs/ai/multi-adapter-serving"
        >
          Multi-Adapter Serving으로 이어서 보기 →
        </Link>
      </div>
      <div id="standard-peft-lora" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 구현 참고 · Hugging Face PEFT LoRA</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          PEFT 문서는 현재 LoraConfig의 rank, alpha, target_modules, dropout, bias와
          modules_to_save를 설명합니다. Initialization과 merge 관련 구현 경계도
          함께 제공합니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 글은 특정 version의 default를 영구 표준으로 가정하지 않습니다. 실제
          설치 version의 config, checkpoint format과 target module mapping을
          manifest에 고정해야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://huggingface.co/docs/peft/main/package_reference/lora" target="_blank" rel="noreferrer">현재 LoraConfig와 구현 옵션 보기</a>
      </div>
    </section>
  );
}
