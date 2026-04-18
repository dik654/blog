import PracticeWorkflowViz from './viz/PracticeWorkflowViz';

export default function Practice() {
  return (
    <section id="practice" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전: 학습 → 병합 → 배포</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>4단계 파이프라인</strong> — 데이터 준비 → trl/peft로 학습 → merge_and_unload로 병합 → 추론 서빙.
          각 단계에서 검증 포인트를 두고, 특히 데이터 품질과 학습 loss 수렴을 반드시 확인한다.
          7B 모델 기준 전체 소요 시간: 데이터 준비 2~3일, 학습 2~4시간(A100), 병합+배포 30분.
        </p>
        <p>
          <strong>학습 라이브러리</strong> — HuggingFace의 trl(Transformer Reinforcement Learning)과
          peft(Parameter-Efficient Fine-Tuning) 조합이 사실상 표준.
          SFTTrainer(trl)가 데이터 포맷팅 + 학습 루프를 통합 제공하고,
          LoraConfig(peft)로 어댑터 설정, BitsAndBytesConfig로 4비트 양자화를 구성한다.
        </p>
        <p>
          <strong>하이퍼파라미터</strong> — r(rank)은 8~64 범위에서 태스크 복잡도에 비례하여 선택.
          lora_alpha는 r과 같거나 2배.
          학습률은 full fine-tuning(1e-5~5e-5)보다 높은 1e-4~3e-4가 적절.
          epochs는 1~3으로 짧게 — LoRA는 적은 파라미터이므로 과적합에 취약.
          lora_dropout 0.05~0.1로 오버피팅을 방지한다.
        </p>
        <p>
          <strong>병합(Merge)</strong> — 학습 완료 후 model.merge_and_unload()로 LoRA 어댑터를
          원본 가중치에 합산한다: W' = W + (α/r) * B * A.
          병합된 모델은 원본과 동일한 구조이므로 vLLM, TGI, Ollama 등
          어떤 추론 프레임워크에서도 추가 수정 없이 로드 가능하다.
        </p>
        <p>
          <strong>평가</strong> — 자동 지표(perplexity, BLEU, ROUGE)만으로는 LLM 품질을 판단하기 어렵다.
          도메인 벤치마크 + 사람 A/B 평가를 병행하되, 비용 효율을 위해 GPT-4 judge를 활용하는 것이 실무 표준.
          학습 전 base 모델과 학습 후 모델을 동일 프롬프트로 비교하여 개선 정도를 정량화한다.
        </p>
      </div>

      <div className="not-prose"><PracticeWorkflowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">비용 & 시간 추정</h3>
        <p>
          QLoRA로 7B 모델 학습 시 A100 80GB 1장으로 충분.
          AWS p4d.24xlarge(A100 8장) 시간당 ~$32 → A100 1장 환산 ~$4/hour.
          학습 2시간 기준 총 비용 약 $8.
          RTX 4090(24GB)에서도 7B QLoRA 학습이 가능하며, 학습 시간은 약 2배 증가.
        </p>
        <p>
          13B 이상 모델은 RTX 4090에서는 batch size를 1로 줄이거나 gradient checkpointing을 활성화해야 한다.
          70B 모델은 A100 80GB에서도 gradient checkpointing 필수, 학습 시간 12~24시간.
        </p>
        <p className="leading-7">
          핵심 1: <strong>trl + peft</strong>가 실무 표준 — SFTTrainer 한 줄로 학습 시작 가능.<br />
          핵심 2: <strong>merge_and_unload()</strong> 후 원본과 동일 구조 — 추론 오버헤드 제로.<br />
          핵심 3: <strong>7B QLoRA 전체 비용 ~$8</strong> — full fine-tuning 대비 1/50 이하.
        </p>
      </div>
    </section>
  );
}
