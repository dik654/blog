import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { InternalLink, QuestionLead } from '@/components/learning/ArticleLearning';

const responsibilities = [
  { stage: '복원 출력', signal: String.raw`\hat x-x`, meaning: '각 복원값이 target보다 높거나 낮은지 측정' },
  { stage: 'Decoder 가중치', signal: String.raw`\delta_{out}z^\top`, meaning: 'latent에서 각 출력으로 가는 연결의 책임 계산' },
  { stage: 'Latent code', signal: String.raw`W_{dec}^\top\delta_{out}`, meaning: '모든 출력 오차를 code의 책임으로 합산' },
  { stage: 'Encoder 가중치', signal: String.raw`\delta_zx^\top`, meaning: '입력을 code로 압축한 연결까지 gradient 전달' },
];

export default function ReconstructionBackprop() {
  return (
    <section id="loss-backprop" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">복원 오차가 encoder까지 어떻게 돌아갈까?</h2>
      <QuestionLead
        question="loss는 decoder 출력에서 측정되는데 encoder는 어떤 신호로 학습할까?"
        answer="decoder의 local derivative를 거쳐 출력 오차를 latent code의 gradient로 모으고, 다시 encoder activation과 weight를 거슬러 간다. 한 계산 그래프의 reverse-mode backprop과 동일하다."
      />
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {responsibilities.map((item, index) => (
          <div key={item.stage} className="grid min-w-0 gap-2 border-b border-border p-4 last:border-0 sm:grid-cols-[2rem_8rem_minmax(0,1fr)_minmax(0,1.3fr)] sm:items-center">
            <span className="font-mono text-xs font-bold text-blue-600">{String(index + 1).padStart(2, '0')}</span><p className="text-sm font-bold">{item.stage}</p><div className="min-w-0 text-xs font-semibold"><Math>{item.signal}</Math></div><p className="text-xs leading-relaxed text-muted-foreground">{item.meaning}</p>
          </div>
        ))}
      </div>
      <div data-formula-pair className="not-prose my-6 min-w-0">
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{r}_{\text{복원 잔차}}=\underbrace{\frac{2}{d}(\hat x-x)}_{\text{오차의 방향과 크기}}`}</Math></div>
          <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\delta_{out}=\underbrace{r}_{\text{복원 잔차}}\odot\underbrace{\sigma'(a_{out})}_{\text{출력의 국소 기울기}}`}</Math></div>
          <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\nabla_{W_{dec}}L=\underbrace{\delta_{out}}_{\text{출력 책임}}\underbrace{z^\top}_{\text{입력 code}}`}</Math></div>
          <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{u_z}_{\text{code로 모인 책임}}=\underbrace{W_{dec}^\top\delta_{out}}_{\text{출력 책임을 역방향 합산}}`}</Math></div>
          <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\delta_z=\underbrace{u_z}_{\text{모인 책임}}\odot\underbrace{\sigma'(a_z)}_{\text{encoder 국소 기울기}}`}</Math></div>
          <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\nabla_{W_{enc}}L=\underbrace{\delta_z}_{\text{code 책임}}\underbrace{x^\top}_{\text{encoder 입력}}`}</Math></div>
        </div>
        <FormulaNote
          meaning="decoder transpose는 여러 출력에 흩어진 오차를 latent 좌표별로 합친다. 이 gradient를 optimizer가 update로 바꾸면 encoder와 decoder가 함께 바뀌며, 다음 forward에서 code와 reconstruction도 달라진다."
          symbols={[
            [String.raw`\delta_{out}`, '출력 pre-activation에 대한 loss gradient'],
            [String.raw`\delta_z`, 'latent pre-activation에 대한 loss gradient'],
            [String.raw`r`, 'MSE를 reconstruction에 미분해 얻은 복원 잔차'],
            [String.raw`u_z`, 'decoder의 모든 출력 책임을 latent 좌표별로 합친 중간 gradient'],
            [String.raw`\odot`, '같은 위치끼리 곱하는 element-wise product'],
            [String.raw`d`, '복원해야 하는 입력 차원의 수'],
          ]}
        />
      </div>
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <div className="border-b border-border bg-muted/20 px-4 py-3 sm:px-5">
          <p className="text-sm font-bold">앞 절의 x=(0.8, 0.4)를 encoder gradient까지 검산</p>
          <p className="mt-1 text-xs text-muted-foreground">sigmoid의 국소 기울기 σ′(a)=σ(a)(1-σ(a))를 각 단계에 대입한다.</p>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
          {[
            [String.raw`a_z=0.52`, String.raw`z=0.6271`, '입력을 code로 압축'],
            [String.raw`\hat x=(0.5930,\,0.6080)`, String.raw`r=(-0.2070,\,0.2080)`, '두 좌표의 복원 잔차'],
            [String.raw`\delta_{out}=(-0.0500,\,0.0496)`, String.raw`u_z=0.00473`, 'decoder 책임을 code로 합산'],
            [String.raw`\delta_z=0.00110`, String.raw`\sigma'(0.52)=0.2338`, 'encoder 국소 기울기 적용'],
            [String.raw`\nabla_{W_{enc}}L=(0.00088,\,0.00044)`, String.raw`\delta_zx^\top`, 'optimizer가 받을 최종 값'],
          ].map(([value, detail, body], index) => (
            <div key={value} className="min-w-0 bg-background p-4">
              <p className="font-mono text-[10px] font-bold text-blue-600">{String(index + 1).padStart(2, '0')}</p>
              <div className="mt-3 min-w-0 text-sm font-bold"><Math>{value}</Math></div>
              <div className="mt-2 min-w-0 text-xs text-muted-foreground"><Math>{detail}</Math></div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Reconstruction loss는 데이터 분포와 맞아야 한다</h3>
        <p>
          연속 실수에 Gaussian observation model을 가정하면 MSE가 자연스럽고, binary 값에는 Bernoulli likelihood에서 나온
          BCE를 생각할 수 있다. 이미지에서 pixel MSE만 쓰면 작은 위치 변화에 과도하게 민감하고 시각적으로 흐린 평균을
          선호할 수 있어 perceptual feature loss나 task-specific objective를 함께 쓰기도 한다.
        </p>
        <p>
          두 선택은 단순한 취향이 아니다. Gaussian의 negative log-likelihood를 전개하면 상수항을 제외하고 MSE가 남고,
          Bernoulli의 negative log-likelihood를 전개하면 BCE가 남는다. 이 likelihood→loss 변환은
          <InternalLink slug="cross-entropy">크로스 엔트로피 글</InternalLink>의 같은 원리다. 일반 계산 그래프에서 이 신호를
          재사용하는 법은 <InternalLink slug="backprop-optimization">역전파 글</InternalLink>이 소유한다.
        </p>
      </div>
    </section>
  );
}
