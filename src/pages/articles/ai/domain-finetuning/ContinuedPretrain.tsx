import { CitationBlock } from '@/components/ui/citation';
import { CapabilityCheck, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';

const DECISIONS = [
  {
    label: '목표 함수',
    question: '기존 checkpoint가 무엇을 예측하며 배웠는가?',
    action: 'Encoder 계열은 masking objective, autoregressive 계열은 next-token objective처럼 원래 학습 계약과 맞춘다.',
    evidence: 'Mask 비율이나 corruption 방식은 상수가 아니다. 사용한 checkpoint와 구현 설정을 실험 기록에 고정한다.',
  },
  {
    label: '학습 강도',
    question: '얼마나 크게 가중치를 움직여도 되는가?',
    action: '작은 learning-rate 후보부터 짧은 pilot을 돌리고 domain validation과 generic holdout을 동시에 측정한다.',
    evidence: '“사전학습의 1/10” 같은 비율을 규칙으로 쓰지 않는다. optimizer, batch와 checkpoint가 바뀌면 같은 숫자의 의미도 달라진다.',
  },
  {
    label: '데이터 혼합',
    question: '새 분포를 배우면서 무엇을 잊으면 안 되는가?',
    action: 'Domain-only, replay mixture, regularization 후보를 같은 token budget으로 비교한다.',
    evidence: '일반 data 혼합률도 고정 처방이 아니다. 보존할 능력을 대표하는 holdout이 먼저 정의되어야 한다.',
  },
  {
    label: '중단 조건',
    question: '추가 학습을 언제 멈출 것인가?',
    action: 'Domain loss가 아니라 최종 과업 개선, generic 능력 보존과 계산 비용을 함께 gate로 둔다.',
    evidence: '더 많은 token이 자동으로 더 좋은 적응을 보장하지 않는다. downstream 이득이 멈추면 학습을 종료한다.',
  },
];

export default function ContinuedPretrain() {
  return (
    <section id="continued-pretrain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Continued Pretraining 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>Continued pretraining</strong>은 범용 checkpoint를 초기값으로 삼아, 라벨이 없는 domain corpus에서
          기존 사전학습 objective를 더 수행하는 단계다. 목표는 최종 class 경계를 곧바로 외우는 것이 아니라
          새 어휘, texture, 공정 문맥처럼 입력 분포 자체를 representation에 반영하는 것이다.
        </p>
        <p>
          MLM은 일부 입력을 가리고 복원하며 양쪽 문맥을 사용한다. CLM은 앞의 token으로 다음 token을 예측한다.
          중요한 점은 “분류면 MLM, 생성이면 CLM”이라는 단순 대응이 아니라,
          <strong>현재 checkpoint의 architecture와 pretraining contract를 보존하는가</strong>다.
          Vision encoder라면 masked image modeling, image-text alignment, self-distillation처럼 출발 checkpoint와 맞는 신호를 먼저 확인한다.
        </p>
        <CitationBlock source="Don't Stop Pretraining · Gururangan et al." citeKey={2} href="https://arxiv.org/abs/2004.10964">
          <p>
            이 논문은 domain-adaptive와 task-adaptive pretraining을 분리해 비교한 대표 근거다.
            여기서 특정 learning rate, 혼합률이나 token 수를 모든 모델의 최적값으로 가져오지 않고,
            “추가 사전학습을 독립 실험 branch로 검증한다”는 설계 원칙만 일반화한다.
          </p>
        </CitationBlock>
      </div>

      <div className="not-prose mb-8 divide-y divide-border border-y border-border">
        {DECISIONS.map((item, index) => (
          <div key={item.label} className="grid min-w-0 gap-3 py-5 md:grid-cols-[3rem_9rem_minmax(0,1fr)] md:gap-5">
            <span className="text-3xl font-black tabular-nums text-muted-foreground/40">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold">{item.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.question}</p>
            </div>
            <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
              <p><strong className="text-foreground">실행.</strong> {item.action}</p>
              <p className="mt-2"><strong className="text-foreground">근거.</strong> {item.evidence}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>최소 비교 실험</h3>
        <ol>
          <li><strong>Generic baseline:</strong> 원 checkpoint를 그대로 평가한다.</li>
          <li><strong>Domain adaptation:</strong> 같은 backbone에 domain corpus만 추가한다.</li>
          <li><strong>Replay 후보:</strong> 보존할 일반 data를 섞되 같은 계산 예산으로 비교한다.</li>
          <li><strong>최종 gate:</strong> domain slice, generic holdout, 새 시점 holdout과 비용을 함께 본다.</li>
        </ol>
        <p>
          2번이 1번을 이기지 못하면 domain pretraining이 아직 필요하다는 결론이 아니라,
          corpus 품질·objective·학습 강도 중 무엇이 잘못됐는지 다시 분리해야 한다.
          2번이 domain metric만 올리고 generic holdout을 크게 망치면 release하지 않는다.
        </p>
      </div>
      <StopRule>
        특정 learning rate나 token 수를 외우는 대신 generic baseline, domain-adapted candidate와 보존 holdout을 같은 조건에서 비교할 수 있으면 이 단계의 최소 기반에 도달했다.
      </StopRule>
      <CapabilityCheck items={[
        'Continued pretraining과 task fine-tuning의 목표 신호를 구분한다.',
        'Checkpoint의 원래 pretraining contract를 먼저 확인한다.',
        'Domain metric과 generic 능력 보존을 동시에 측정한다.',
        'Learning rate, 혼합률과 token budget을 보편 상수가 아닌 sweep 변수로 다룬다.',
        '추가 계산이 최종 과업 이득으로 이어지지 않으면 중단한다.',
      ]} />
      <SourceNotes sources={[
        { label: 'Don’t Stop Pretraining', href: 'https://arxiv.org/abs/2004.10964', note: 'Domain-adaptive와 task-adaptive pretraining의 실험 분리 기준.' },
        { label: 'BioBERT', href: 'https://arxiv.org/abs/1901.08746', note: '전문 corpus에서 continued pretraining을 수행한 공개 사례.' },
      ]} />
    </section>
  );
}
