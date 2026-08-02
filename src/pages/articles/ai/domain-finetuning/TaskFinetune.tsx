import { CitationBlock } from '@/components/ui/citation';
import { CapabilityCheck, InternalLink, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';

const TASK_DECISIONS = [
  {
    task: '분류',
    target: '입력 하나의 class 또는 multi-label',
    head: 'Pooled representation 위의 linear head부터 시작',
    metric: 'Class imbalance가 있으면 macro F1, calibration과 slice별 recall을 함께 본다.',
  },
  {
    task: '검색',
    target: 'Query와 positive가 negative보다 가까운 순서',
    head: 'Normalized embedding과 contrastive 또는 ranking loss',
    metric: 'Recall@K뿐 아니라 false-neighbor 유형, MRR와 metadata filter 효과를 본다.',
  },
  {
    task: '시퀀스 라벨링',
    target: '각 token 또는 span의 label',
    head: 'Token classifier를 기준선으로 두고 필요한 경우 구조 제약을 추가',
    metric: 'Exact span, boundary 오류와 entity type별 성능을 분리한다.',
  },
  {
    task: '회귀',
    target: '연속값 또는 순위',
    head: 'Linear regressor부터 시작하고 outlier 특성에 맞는 loss를 비교',
    metric: '평균 오차만 보지 말고 극단값, calibration과 운영 허용 오차를 본다.',
  },
];

const UPDATE_POLICIES = [
  {
    label: 'Head only',
    use: '라벨이 매우 적거나 generic representation이 이미 잘 분리될 때',
    risk: '표현 자체의 domain mismatch는 고치지 못한다.',
  },
  {
    label: 'Partial unfreeze',
    use: '상위 표현만 바꿔도 과업 경계가 개선되는지 볼 때',
    risk: '어느 layer를 열지와 learning-rate 설정이 새로운 실험 축이 된다.',
  },
  {
    label: 'Full fine-tune',
    use: '충분한 근거와 validation이 있고 표현 전체를 바꿀 필요가 있을 때',
    risk: '과적합과 forgetting, 재현 비용이 가장 커진다.',
  },
];

export default function TaskFinetune() {
  return (
    <section id="task-finetune" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Task-specific Fine-tuning</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Domain을 이해하는 representation과 현재 업무 결정을 잘하는 representation은 같지 않다.
          <strong>Task fine-tuning</strong>은 실제 출력 계약과 같은 label, pair 또는 target으로 그 경계를 조정하는 단계다.
          라벨 수만 보고 성능을 약속할 수는 없다. 난이도는 class 수, leakage-safe split, label noise와 pretrained representation의 적합성에 함께 좌우된다.
        </p>
        <p>
          먼저 encoder를 고정한 단순 head를 기준선으로 둔다. 그다음 일부 layer, 전체 layer 순으로 update 범위를 넓힌다.
          Layer마다 다른 learning rate를 쓰는 discriminative fine-tuning도 후보지만,
          <strong>특정 숫자 세 개를 정답처럼 복사하지 않고</strong> head-only와 동일 split에서 실제 이득을 확인한다.
        </p>
        <p>
          Few-shot 방법도 같은 원칙을 따른다. Prompting, parameter-efficient tuning, SetFit 계열은
          특정 논문 protocol에서 강한 결과를 보였지만 적은 label만으로 일정 비율의 성능을 항상 보장하는 법칙은 아니다.
          Seed, class별 shot 수, 비교 baseline과 model이 같을 때만 수치를 해석한다.
        </p>
        <CitationBlock source="SetFit · Tunstall et al." citeKey={3} href="https://arxiv.org/abs/2209.11055">
          <p>
            SetFit은 sentence-transformer의 contrastive 학습과 분류 head를 결합한 few-shot text classification 방법이다.
            이 글에서는 특정 benchmark 수치를 일반화하지 않고, “적은 label에서 pair를 만들어 representation을 먼저 조정한다”는 선택지로만 사용한다.
          </p>
        </CitationBlock>
      </div>

      <div className="not-prose mb-8 divide-y divide-border border-y border-border">
        {TASK_DECISIONS.map((item, index) => (
          <div key={item.task} className="grid min-w-0 gap-3 py-5 md:grid-cols-[3rem_7rem_minmax(0,1fr)] md:gap-5">
            <span className="text-3xl font-black tabular-nums text-muted-foreground/40">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold">{item.task}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.target}</p>
            </div>
            <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
              <p><strong className="text-foreground">첫 기준선.</strong> {item.head}</p>
              <p className="mt-2"><strong className="text-foreground">판정.</strong> {item.metric}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>얼마나 많은 가중치를 열 것인가</h3>
      </div>
      <div className="not-prose mb-8 grid gap-3 md:grid-cols-3">
        {UPDATE_POLICIES.map((item, index) => (
          <div key={item.label} className="min-w-0 border-t-2 border-foreground/80 py-4">
            <p className="text-xs font-semibold text-muted-foreground">0{index + 1}</p>
            <h3 className="mt-2 text-base font-bold">{item.label}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">언제.</strong> {item.use}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">위험.</strong> {item.risk}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          제조 결함 검색이라면 “분류 head가 높은 정확도를 냈다”로 끝내지 않는다.
          실제 목표는 비슷한 과거 사례를 근거와 함께 찾는 것이므로
          <InternalLink slug="image-rag-defect-retrieval">Defect Retrieval</InternalLink>의
          Top-K 순위와 false-neighbor release gate로 돌아가야 한다.
        </p>
      </div>
      <StopRule>
        Task type마다 출력 계약과 metric이 왜 다른지 설명하고, head-only → partial → full update를 같은 split에서 비교할 수 있으면 충분하다. 라벨 수에 대한 보편적인 성능 약속은 외우지 않는다.
      </StopRule>
      <CapabilityCheck items={[
        'Domain adaptation과 task-specific decision boundary를 구분한다.',
        'Task의 출력 계약에서 가장 단순한 head와 metric을 고른다.',
        'Head-only를 기준선으로 update 범위를 단계적으로 넓힌다.',
        'Few-shot 수치는 model, split, seed와 shot 정의가 같을 때만 비교한다.',
        '분류 proxy가 아니라 실제 검색·운영 목표로 release를 판정한다.',
      ]} />
      <SourceNotes sources={[
        { label: 'SetFit', href: 'https://arxiv.org/abs/2209.11055', note: 'Contrastive sentence embedding과 classification head를 결합한 few-shot 사례.' },
        { label: 'ULMFiT', href: 'https://arxiv.org/abs/1801.06146', note: 'Discriminative fine-tuning과 gradual unfreezing의 역사적 기준.' },
        { label: 'Don’t Stop Pretraining', href: 'https://arxiv.org/abs/2004.10964', note: 'Domain/task adaptive pretraining과 final supervised task를 분리하는 근거.' },
      ]} />
    </section>
  );
}
