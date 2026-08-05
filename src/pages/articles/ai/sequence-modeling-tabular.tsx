import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaPair from './practical-tabular/FormulaPair';
import {
  OrderLossLab,
  SequenceInputLab,
} from './practical-tabular/viz/TabularEvidenceLabs';

export default function SequenceModelingTabularArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Sequence model은 최신 model이 아니라 잃어버린 순서에 대한 비용이다</h2>
        <QuestionLead
          question="두 사용자가 검색·상품·결제를 각각 한 번씩 했다. Count feature가 같다면 두 history는 같은 예측을 받아야 할까?"
          answer="순서가 검색→상품→결제인지 결제→상품→검색인지에 따라 다음 행동의 의미가 달라질 수 있다. 하지만 실제 target이 이 차이에 반응한다는 temporal OOF evidence가 없다면 sequence model을 추가할 이유도 없다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 <InternalLink slug="time-features">point-in-time 시간 피처</InternalLink>와
            forward validation이 준비됐다고 가정한다. 먼저 last value, count, rolling, recency,
            n-gram과 transition feature를 <InternalLink slug="gradient-boosting">강한 flat
            baseline</InternalLink>에 넣는다. 그 baseline이 order·interval·long-range dependency가
            있는 slice에서 반복 실패할 때만 sequence representation을 추가한다.
          </p>
          <p>
            Event sequence의 핵심은 여러 행을 이어 붙이는 것이 아니다. 어떤 entity의 어느 episode를
            한 sample로 볼지, observation window가 어디서 끝나는지, 다음 event·미래 horizon 중 무엇을
            target으로 삼는지와 뒤늦게 도착한 event를 어떻게 replay할지 정하는 작업이다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Episode', meaning: '한 sample로 묶을 event 구간. Session, 설비 cycle, 경기 possession 등이 될 수 있다.', why: '서로 무관한 event를 한 sequence로 이어 붙이지 않게 한다.' },
          { term: 'Observation window', meaning: 'Target cutoff 이전에 model이 볼 수 있는 event 범위', why: '미래 event와 label 결과가 input token에 섞이는 것을 막는다.' },
          { term: 'Truncation', meaning: '최대 길이를 넘는 history의 일부를 버리는 정책', why: '어떤 과거를 잃었는지와 long-range signal 손실을 드러낸다.' },
          { term: 'Padding mask', meaning: '길이를 맞추기 위해 추가한 PAD token을 attention·pooling에서 제외하는 표지', why: '가짜 event가 표현과 loss에 기여하지 않게 한다.' },
          { term: 'Causal mask', meaning: 'Position j가 j보다 뒤의 token을 보지 못하게 하는 삼각형 경계', why: 'Next-event 학습에서 미래 token을 답처럼 보는 것을 막는다.' },
        ]} />
        <OrderLossLab />
      </section>

      <section id="sample-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Target event에서 뒤로 걸어 observation sample을 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Next-event task라면 target event의 시각 t를 cutoff로 삼고, 그보다 앞에서 발생·도착한
            최대 L개 event를 input으로 만든다. Horizon classification이라면 t 뒤 [t,t+H)의
            outcome을 label로 만들되 input은 여전히 t 전에 닫는다. 동일 원본 event에서 겹치는 window가
            많이 생기므로 split은 생성된 row가 아니라 entity·episode·target time을 기준으로 설계한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}q_j(i,t)&=\underbrace{\mathbf 1[\operatorname{entity}(e_j)=i]}_{\text{같은 주체}}\\[2pt]&\quad\cdot\underbrace{\mathbf 1[s_j<t]}_{\text{이전 발생}}\underbrace{\mathbf 1[a_j\le t]}_{\text{도착 완료}}\\[2pt]\mathcal O_i(t)&=\underbrace{\{e_j:q_j(i,t)=1\}}_{\text{합법적인 과거 event}}\\[2pt]X_i(t;L)&=\operatorname{last}_L(\operatorname{sort}_{s}\mathcal O_i(t))\\[2pt]y_i(t)&=\underbrace{\operatorname{Target}(i,t)}_{\text{다음 결과}}\end{aligned}`}
          meaning="같은 entity에서 target cutoff 전에 발생하고 당시 도착한 event만 정렬한 뒤 최대 L개를 input으로 쓴다. Target은 input window 밖에 두며, target time이 split 어느 쪽에 속하는지로 sample을 배정한다."
          symbols={[
            [String.raw`s_j,a_j`, 'Event j의 발생 시각과 availability 시각'],
            [String.raw`L`, 'Model에 허용할 최대 event 수'],
            [String.raw`X_i(t;L)`, 'Entity i의 cutoff t에서 재현한 input sequence'],
            [String.raw`y_i(t)`, 'Next event 또는 미래 horizon label'],
          ]}
        />
        <Misconception>먼저 전체 event log를 sequence로 만든 뒤 마지막에 train/validation row를 나누면 같은 원본 history가 양쪽에 겹칠 수 있다. Split boundary를 먼저 고정하고 각 boundary 안에서 sample을 생성하거나, 원본 event lineage로 overlap을 검사한다.</Misconception>
      </section>

      <section id="baselines" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Sequence network 전에 정보 손실의 위치를 baseline으로 측정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            복잡도를 한 번에 올리지 않는다. 마지막 event와 time-since-last-event, event type count,
            최근 window 통계, bigram·transition count를 순서대로 추가한다. Last-value가 이기면 긴
            history가 필요 없고, n-gram이 충분하면 거대한 Transformer보다 작고 설명 가능한 model이
            낫다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}c_k(t)&=\underbrace{\sum_{e_j\in X(t)}\mathbf 1[\operatorname{type}(e_j)=k]}_{\text{event type }k\text{의 횟수}}\\[2pt]c_{u\to v}(t)&=\underbrace{\sum_{j=2}^{|X(t)|}\mathbf 1[\operatorname{type}(e_{j-1})=u,\operatorname{type}(e_j)=v]}_{\text{인접 순서 }u\to v\text{의 횟수}}\\[2pt]\Delta_{\mathrm{last}}(t)&=\underbrace{t-\max_{e_j\in X(t)}s_j}_{\text{마지막 event 이후 경과 시간}}\end{aligned}`}
          meaning="단순 count는 어떤 event가 몇 번 있었는지만 남기고, transition count는 인접한 두 event의 순서를 일부 보존한다. Recency는 가장 최근 event와 cutoff 사이의 시간 정보를 보존한다."
          symbols={[
            [String.raw`c_k`, 'Type k의 순서를 무시한 count feature'],
            [String.raw`c_{u\to v}`, '인접 type u 다음 v가 나온 횟수'],
            [String.raw`\Delta_{\mathrm{last}}`, '마지막 관측 이후의 freshness feature'],
          ]}
        />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['B0 · 마지막 상태', '마지막 event type·값·경과 시간만 사용한다. 짧은 memory 가설의 하한이다.'],
            ['B1 · 집계', 'Count, mean, max, recency와 window별 통계로 순서를 압축한다.'],
            ['B2 · 짧은 순서', 'Bigram, transition matrix와 recent pattern으로 local order를 보존한다.'],
            ['B3 · 작은 sequence', 'GRU/TCN 같은 작은 model로 variable order가 실제 OOF delta를 만드는지 본다.'],
            ['B4 · Attention', 'Long-range pair 관계가 남고 compute·latency budget이 허용될 때 Transformer를 비교한다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
        <StopRule>B2까지의 flat baseline이 order-sensitive slice에서 sequence model과 차이가 없으면 더 큰 sequence architecture를 채택하지 않는다. 길이·latency·label volume을 늘리기 전에 target이 순서를 요구하는지 다시 본다.</StopRule>
      </section>

      <section id="order-loss" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 집계를 가진 pair가 다른 label을 갖는지 찾는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sequence 필요성을 가장 직접적으로 보는 방법은 count·mean·duration이 같은데 순서만 다른
            history pair를 찾는 것이다. 두 집단의 target rate와 baseline error가 안정적으로 다르면
            flat representation이 잃은 정보가 보인다. 반대로 차이가 없으면 order encoder의 자유도만
            늘어날 수 있다.
          </p>
          <p>
            이 분석도 validation을 보며 pair 조건을 끝없이 바꾸면 과적합한다. Domain mechanism으로
            pair를 정의하고, train 기간에서 hypothesis를 만들고, 이후 기간과 entity slice에서
            재검증한다.
          </p>
        </div>
      </section>

      <section id="encoding-mask" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Event token은 종류·값·간격·위치를 서로 다른 책임으로 더한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Event 하나에는 type, amount·좌표 같은 수치, 이전 event와의 시간 간격과 sequence position이
            있다. 첫 event에는 이전 event가 없으므로 학습 가능한 BOS sentinel 또는 observation
            start부터의 clipped 간격 중 하나를 schema에 고정한다. 각각을 d차원으로 바꿔 더하면
            model은 “무슨 사건인가”, “값이 얼마인가”, “얼마 만에 일어났나”, “몇 번째인가”를
            구분해 사용할 수 있다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}\Delta t_1&=\underbrace{\delta_{\mathrm{BOS}}}_{\text{첫 event의 고정 경계값}}\\[2pt]\Delta t_j&=\underbrace{s_j-s_{j-1}}_{\text{이전 event와의 간격}}\quad(j>1)\\[2pt]u_j^{\mathrm{type}}&=\underbrace{E_{\mathrm{type}}[c_j]}_{\text{event 종류}}\\[2pt]u_j^{\mathrm{num}}&=\underbrace{W_{\mathrm{num}}v_j}_{\text{수치 속성}}\\[2pt]u_j^{\mathrm{pos}}&=\underbrace{E_{\mathrm{pos}}[j]}_{\text{sequence 위치}}\\[2pt]u_j^{\Delta}&=\underbrace{W_{\Delta}\log(1+\Delta t_j)}_{\text{압축한 시간 간격}}\\[2pt]z_j&=u_j^{\mathrm{type}}+u_j^{\mathrm{num}}+u_j^{\mathrm{pos}}+u_j^\Delta\end{aligned}`}
          meaning="첫 event는 이전 event가 없으므로 release schema에 정한 BOS 경계값을 쓴다. 이후 event의 실제 간격과 함께 projection하고, type·numeric·position 표현과 같은 d차원 token에 더한다. Log는 긴 간격의 scale을 완화하지만 단위와 clipping 정책이 필요하다."
          symbols={[
            [String.raw`c_j`, 'Event j의 type ID'],
            [String.raw`v_j`, 'Event j의 수치형 속성 vector'],
            [String.raw`\Delta t_j`, '직전 event와의 발생 시간 차이'],
            [String.raw`\delta_{\mathrm{BOS}}`, '첫 event에 쓰는 학습 가능 sentinel 또는 observation-start 간격의 고정 표현'],
            [String.raw`z_j`, 'Sequence model에 들어갈 event token'],
          ]}
        />
        <SequenceInputLab />
        <FormulaPair
          formula={String.raw`\begin{aligned}S_{\mathrm{pair}}&=\underbrace{\frac{QK^\top}{\sqrt{d_h}}}_{\text{event pair score}}\\[2pt]S&=S_{\mathrm{pair}}+\underbrace{M_{\mathrm{pad}}}_{\text{PAD 차단}}+\underbrace{M_{\mathrm{future}}}_{\text{미래 차단}}\\[2pt]A&=\underbrace{\operatorname{softmax}(S)}_{\text{허용 위치의 참고 비율}}\\[2pt]Z&=\underbrace{AV}_{\text{섞은 event 표현}}\end{aligned}`}
          meaning="Padding mask는 가짜 PAD token을 항상 막는다. Next-event autoregressive 학습은 causal future mask도 쓰지만, cutoff 전에 완성된 history 전체를 분류하는 encoder는 목적에 따라 bidirectional attention을 쓸 수 있다."
          symbols={[
            [String.raw`M_{\mathrm{pad}}`, 'PAD key 위치에 -∞를 넣는 mask'],
            [String.raw`M_{\mathrm{future}}`, 'Query보다 뒤 position을 막는 causal mask'],
            [String.raw`d_h`, 'Attention head 하나의 차원'],
          ]}
        />
      </section>

      <section id="model-choice" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">RNN·TCN·Transformer는 기억 방식과 운영 비용이 다르다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            GRU 같은 RNN은 hidden state를 순서대로 갱신해 streaming과 짧은 sequence에 자연스럽다.
            TCN은 causal convolution과 dilation으로 병렬 처리하면서 고정 receptive field를 만든다.
            Transformer는 event pair를 직접 비교해 long-range interaction을 표현하지만 token 수가
            늘면 attention memory와 latency가 커진다.
          </p>
          <p>
            모델 선택은 sequence 길이만 보지 않는다. Online state를 유지할 수 있는지, late event를
            replay해야 하는지, batch inference인지 streaming인지, target volume과 class imbalance,
            truncation이 중요한 과거를 버리는지를 함께 본다. 최신 architecture 이름보다 작은 baseline의
            failure mode가 선택 이유가 되어야 한다.
          </p>
        </div>
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {[
            ['GRU/RNN', '순차 state', 'Streaming·짧은 history', '긴 dependency와 순차 계산 병목'],
            ['TCN', 'Dilated causal convolution', '고정 latency·병렬 학습', 'Receptive field 밖 정보 손실'],
            ['Transformer', 'Content-based event pair', '불규칙 long-range 관계', 'Token² memory·mask·cache 비용'],
          ].map(([name, mechanism, fit, cost]) => (
            <div key={name} className="min-w-0 bg-background p-4">
              <p className="text-sm font-bold">{name}</p>
              <p className="mt-3 text-xs font-bold">기억 방식</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{mechanism}</p>
              <p className="mt-3 text-xs font-bold">먼저 비교할 조건</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{fit}</p>
              <p className="mt-3 text-xs font-bold">주요 비용</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{cost}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Release evidence는 sequence뿐 아니라 sample generator를 고정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            OOF prediction에는 target time, entity, episode, observation start/end, selected event IDs,
            max length, truncation direction, late-event policy와 mask version을 남긴다. Model checkpoint만
            저장하면 같은 input tensor를 다시 만들 수 없다.
          </p>
          <p>
            Flat baseline과 sequence 후보를 같은 temporal folds에서 비교하고, history length,
            event density, new entity, late arrival과 rare transition slice를 본다. 평균 metric이
            좋아도 long-history slice만 이득이고 p95 latency가 budget을 넘는다면 routing이나 작은
            stateful model이 더 나을 수 있다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Entity·episode·cutoff·target event에서 leakage 없는 sequence sample을 만들 수 있다.',
          'Last/count/rolling/n-gram baseline으로 sequence model이 필요한 정보 손실을 위치시킬 수 있다.',
          'Event type·numeric·time delta·position을 각각 어떤 token 책임으로 넣는지 설명할 수 있다.',
          'Padding mask와 causal mask가 언제 필요한지 task 기준으로 구분할 수 있다.',
          'Sample generator manifest와 temporal OOF·latency evidence로 sequence model을 승격할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          아래 원문은 attention과 대표 sequential recommendation architecture의 근거다. Baseline
          ladder, order-loss pair audit와 release manifest는 이 경로의 engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'Vaswani et al. · Attention Is All You Need', href: 'https://arxiv.org/abs/1706.03762', note: 'Scaled dot-product attention과 positional representation의 기반.' },
          { label: 'Hidasi et al. · GRU4Rec', href: 'https://arxiv.org/abs/1511.06939', note: 'Session event sequence를 recurrent state로 모델링한 대표 초기 작업.' },
          { label: 'Sun et al. · BERT4Rec', href: 'https://arxiv.org/abs/1904.06690', note: 'Bidirectional Transformer를 sequential recommendation에 적용한 원 논문.' },
          { label: 'scikit-learn · TimeSeriesSplit', href: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html', note: 'Sequence sample도 따라야 하는 forward evaluation의 공식 기준.' },
        ]} />
      </section>
    </div>
  );
}
