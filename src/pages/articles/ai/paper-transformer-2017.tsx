import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  AttentionShapeLab,
  TransformerEvidenceLab,
  TransformerPathLab,
} from './paper-transformer-2017/viz/TransformerPaperLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[12px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const trainingReceipts = [
  ['DATA', 'WMT14 EN-DE 4.5M sentence pairs · shared BPE vocabulary 약 37k'],
  ['BASE', 'N=6 · d_model=512 · h=8 · d_ff=2048 · dropout 0.1 · 약 65M parameters'],
  ['OPTIMIZER', 'Adam β₁=0.9 · β₂=0.98 · ε=10⁻⁹ · warmup 4,000 steps'],
  ['TRAIN', '8× NVIDIA P100 · 100k steps · 약 12시간 · 5-checkpoint averaging'],
  ['DECODE', 'Beam size 4 · length penalty α=0.6 · maximum output length=input length+50'],
] as const;

export default function TransformerPaper() {
  return (
    <>
      <section id="context" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">무엇을 없애야 모든 token을 한 번에 계산할 수 있을까?</h2>
        <QuestionLead
          question="“Attention is all you need”에서 필요 없다고 한 것은 FFN이나 encoder가 아니라 무엇일까?"
          answer="Sequence 위치를 한 칸씩 넘기며 hidden state를 갱신하는 recurrence와, 먼 위치를 연결하려고 여러 convolution layer를 통과하는 경로다. 2017 Transformer는 encoder-decoder 구조, position-wise FFN, residual connection과 normalization을 그대로 사용한다. 달라진 핵심은 token 사이 정보를 섞는 연산을 attention으로 통일해 한 layer 안의 모든 위치를 병렬 계산한 것이다."
        />
        <ConceptPrimer items={[
          {
            term: 'Recurrence',
            meaning: '이전 위치 hidden state가 있어야 다음 위치를 계산하는 실행 의존성이다.',
            why: '문장이 길어질수록 한 training step 내부에서도 위치를 순서대로 기다려야 하는 병목을 만든다.',
          },
          {
            term: 'Query · Key · Value',
            meaning: 'Query는 지금 묻는 것, Key는 찾을 주소, Value는 주소에서 가져올 내용이다.',
            why: 'Attention 식 하나가 서로 다른 세 정보 경로에서 어떻게 재사용되는지 설명한다.',
          },
          {
            term: 'Causal mask',
            meaning: 'Target 위치 i가 i보다 뒤의 정답 token을 읽지 못하게 score를 −∞로 바꾸는 장치다.',
            why: 'Training에서 정답 문장 전체를 병렬 입력해도 실제 생성과 같은 앞→뒤 조건을 지킨다.',
          },
          {
            term: 'Encoder memory',
            meaning: 'Source 문장을 여섯 encoder layer로 처리한 최종 hidden sequence다.',
            why: 'Cross-attention의 K와 V가 되고, decoder의 각 target 위치가 source 전체를 찾아보게 한다.',
          },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Source token 하나는 embedding에 <strong>√512</strong>를 곱하고 sinusoidal position을 더한 뒤
            여섯 encoder layer를 지난다. 각 layer는 self-attention으로 다른 source 위치의 정보를 섞고,
            같은 FFN을 위치마다 독립 적용한다. 이 결과 전체가 decoder가 읽을 memory가 된다.
          </p>
          <p>
            Target은 정답을 한 칸 오른쪽으로 민 sequence에서 시작한다. 현재 token은 masked self-attention으로
            앞 prefix만 읽고, cross-attention에서는 자신의 hidden state를 Q로, encoder memory를 K·V로 사용한다.
            마지막 linear와 softmax가 다음 token 분포를 만든다.
          </p>
        </div>
        <TransformerPathLab />
        <Misconception>
          이 논문은 decoder-only GPT 구조를 제안한 논문이 아니다. 원문에는 source encoder, masked target
          decoder와 encoder-decoder attention이 모두 있다. 오늘날의 Pre-LN, RMSNorm, RoPE, GQA, SwiGLU와
          FlashAttention을 원문 구성으로 소급하면 안 된다.
        </Misconception>
      </section>

      <section id="claim" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Attention 식은 “누가 누구를 읽는가”를 score 행렬로 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 head에서 Q의 각 행은 한 query 위치다. K의 각 행과 내적하면 모든 memory 위치에 대한 score가
            생긴다. <strong>dₖ=64</strong>개의 독립적인 성분이 단위 분산이라고 생각하면 내적의 분산은 dₖ에
            비례해 커진다. √dₖ로 나누어 score 규모를 낮추지 않으면 softmax가 지나치게 뾰족해져 gradient가
            작아질 수 있다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\operatorname{Attn}(Q,K,V)}_{\text{질문마다 내용을 모은 출력}}=\underbrace{\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)}_{\text{읽을 위치의 가중치}}\underbrace{V}_{\text{가져올 내용}}`}
          meaning="QKᵀ는 모든 query-memory 쌍의 적합도를 만든다. √dₖ는 dot product의 규모를 안정화하고, mask M은 읽으면 안 되는 위치를 −∞로 만든다. Softmax는 각 query 행을 합이 1인 가중치로 바꾸며, 그 가중치로 V를 평균한다. 원문 Equation 1에는 M이 식으로 쓰이지 않고, Section 3.2.3이 illegal connection의 score를 −∞로 만든다고 서술한다. 여기서는 두 근거를 한 실행식으로 합쳤다."
          symbols={[
            [String.raw`Q`, '현재 위치가 찾으려는 정보를 담은 query 행렬'],
            [String.raw`K`, '참고 가능한 memory 위치의 주소 행렬'],
            [String.raw`V`, '선택된 비율만큼 실제로 섞을 내용 행렬'],
            [String.raw`\sqrt{d_k}`, 'Key 차원이 커질 때 dot-product 분산이 함께 커지는 것을 보정'],
            [String.raw`M`, 'Decoder의 미래 위치 또는 padding 위치를 attention 후보에서 제거'],
            ['softmax', '각 query가 memory 위치에 배분할 가중치 합을 1로 정규화'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Multi-head는 같은 attention을 여덟 번 복제하는 데서 끝나지 않는다. 서로 다른 projection이
            512차원 표현을 여덟 개의 64차원 subspace로 옮기고, 각 head가 별도 score와 value mixture를 만든다.
            Head 출력을 이어 붙인 뒤 Wᴼ가 다시 d_model=512로 섞는다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{H_i}_{\text{i번째 head}}=\operatorname{Attn}(\underbrace{QW_i^Q}_{\text{질문 투영}},\underbrace{KW_i^K}_{\text{주소 투영}},\underbrace{VW_i^V}_{\text{내용 투영}})`}
          meaning="Head마다 Q·K·V projection이 다르므로 같은 token sequence를 서로 다른 비교 공간에서 읽는다. 원문 실험은 multi-head가 유용하다는 제한된 증거를 주지만, 각 head가 반드시 인간이 이름 붙일 기능 하나를 맡는다고 증명하지는 않는다."
          symbols={[
            [String.raw`W_i^Q,W_i^K,W_i^V`, '512차원 입력을 head별 64차원 공간으로 보내는 학습 행렬'],
            [String.raw`H_i`, 'i번째 head가 query 위치마다 만든 64차원 결과'],
            ['서로 다른 projection', '한 번의 평균이 서로 다른 관계를 뭉개지 않도록 여러 비교 공간을 제공'],
          ]}
        />
        <Formula
          latex={String.raw`\underbrace{\operatorname{MultiHead}(Q,K,V)}_{\text{512차원 출력}}=\underbrace{\operatorname{Concat}(H_1,\ldots,H_8)}_{\text{8×64차원 연결}}\underbrace{W^O}_{\text{head 정보 재조합}}`}
          meaning="8개 head의 64차원 출력을 붙이면 다시 512차원이 된다. Output projection은 head별 결과를 다음 residual stream이 사용할 좌표계로 재조합한다."
          symbols={[
            [String.raw`\operatorname{Concat}`, 'Query 위치 축은 유지하고 마지막 feature 축으로 head 출력을 연결'],
            [String.raw`W^O`, '연결된 head feature를 d_model 출력으로 선형 혼합'],
            [String.raw`8\times64=512`, '원문 base model에서 concatenate 뒤의 실제 feature 크기'],
          ]}
        />
      </section>

      <section id="mechanism" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Attention은 token을 섞고 FFN은 각 token의 feature를 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Attention 출력은 위치마다 다른 token의 V를 섞는다. 그 다음 FFN은 위치끼리 섞지 않는다. 모든
            위치에 같은 두 linear layer를 적용해 512차원을 2,048차원으로 넓히고 ReLU를 거쳐 다시 512차원으로
            줄인다. “Sequence mixing”과 “feature transformation”의 책임이 이렇게 분리된다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\operatorname{FFN}(x)}_{\text{한 위치의 feature 변환}}=\underbrace{\max(0,xW_1+b_1)}_{\text{512→2048 확장과 ReLU}}\underbrace{W_2+b_2}_{\text{2048→512 축소}}`}
          meaning="같은 W₁과 W₂를 모든 sequence 위치에 독립 적용한다. 첫 linear는 더 넓은 feature 공간을 만들고 ReLU가 입력에 따라 활성 feature를 고르며, 두 번째 linear가 residual stream 폭으로 되돌린다."
          symbols={[
            [String.raw`x`, '한 token 위치의 512차원 hidden vector'],
            [String.raw`W_1`, '512에서 2,048차원으로 확장하는 학습 행렬'],
            [String.raw`\max(0,\cdot)`, '원문이 사용한 ReLU 비선형성'],
            [String.raw`W_2`, '2,048차원을 512차원으로 축소하는 학습 행렬'],
            ['위치별 독립 적용', 'Token 간 정보 이동은 attention에 맡기고 각 token의 feature 계산은 공유'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Recurrence를 없애면 순서가 저절로 들어오지 않는다. 그래서 원문은 짝수 차원에 sin, 홀수 차원에
            cos를 넣고 차원이 커질수록 파장을 2π부터 10,000·2π까지 기하급수적으로 늘린다. 각 position은
            여러 주기의 위상 조합으로 구별되고, 상대 offset은 이 표현의 선형 결합으로 나타낼 수 있다는
            직관을 제시했다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{PE_{p,2i}}_{\text{짝수 feature}}=\sin\!\left(\frac{\underbrace{p}_{\text{token 위치}}}{\underbrace{10000^{2i/512}}_{\text{차원별 파장 스케일}}}\right)`}
          meaning="Position p를 서로 다른 주파수의 sin 신호로 변환한다. 홀수 feature에는 같은 각도의 cos를 사용한다. 원문은 learned position도 실험했고 거의 같은 BLEU를 얻었으므로 sinusoidal이 보편적으로 우월하다는 결론은 아니다."
          symbols={[
            [String.raw`p`, 'Sequence 안의 절대 token 위치'],
            [String.raw`i`, 'Sin/cos 한 쌍이 차지하는 frequency index'],
            [String.raw`512`, 'Base model의 d_model'],
            [String.raw`PE_{p,2i+1}`, '같은 각도에 cos를 적용한 홀수 feature'],
            ['기하급수 파장', '짧은 거리와 긴 거리의 위치 변화를 동시에 구별하기 위해 사용'],
          ]}
        />
        <AttentionShapeLab />
      </section>

      <section id="evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">표의 숫자는 어느 주장까지 지지하는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Table 1은 layer 하나의 asymptotic operation 수, 순차 연산 수와 최대 경로 길이를 비교한다.
            Table 2는 완성된 training·decoding recipe의 번역 결과다. Table 3은 EN-DE 개발셋에서 일부
            component를 바꾼 ablation이다. 서로 다른 질문에 답하는 표를 하나의 “Transformer가 최고”라는
            문장으로 합치면 근거 범위를 잃는다.
          </p>
        </div>
        <TransformerEvidenceLab />
      </section>

      <section id="reproduction" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">재현은 block 그림이 아니라 recipe와 실행 순서를 복원하는 일이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원문 base model은 <strong>Post-LN</strong>이다. 각 sublayer 출력은
            <strong>LayerNorm(x + Sublayer(x))</strong>로 계산된다. Embedding과 pre-softmax linear weight를
            공유하고 embedding에는 √d_model을 곱한다. Label smoothing ε=0.1과 dropout 0.1도 Table 2의
            결과를 이루는 조건이다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\operatorname{lr}(s)}_{\text{현재 learning rate}}=\underbrace{512^{-1/2}}_{\text{model 폭 보정}}\min\!\left(\underbrace{s^{-1/2}}_{\text{warmup 이후 감소}},\underbrace{s\,4000^{-3/2}}_{\text{초기 선형 증가}}\right)`}
          meaning="처음 4,000 step까지는 learning rate가 선형으로 커지고, 이후에는 step의 역제곱근으로 감소한다. 원문 결과를 재현한다고 말하려면 이 schedule과 Adam 설정을 architecture와 함께 고정해야 한다."
          symbols={[
            [String.raw`s`, '현재 optimizer update step'],
            [String.raw`512^{-1/2}`, 'd_model에 따라 전체 learning-rate 규모를 조정'],
            [String.raw`s\,4000^{-3/2}`, 'Warmup 동안 0에서 선형으로 증가하는 branch'],
            [String.raw`s^{-1/2}`, 'Warmup 뒤 서서히 감소하는 branch'],
            ['min', '두 branch가 만나는 4,000 step에서 증가에서 감소로 전환'],
          ]}
        />
        <div className="not-prose divide-y divide-border border-y border-border">
          {trainingReceipts.map(([label, value]) => (
            <div key={label} className="grid gap-1 py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5">
              <strong className="font-mono text-[12px] text-muted-foreground">{label}</strong>
              <p className="text-sm font-semibold leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral mt-7 max-w-none dark:prose-invert">
          <p>
            최소 shape oracle은 세 개다. Encoder self-attention score는 <strong>B×h×S×S</strong>,
            masked decoder self-attention은 <strong>B×h×T×T</strong>, cross-attention은
            <strong>B×h×T×S</strong>다. Cross-attention의 output 길이는 query를 낸 target의 T이며 source
            길이 S가 아니다. 이 invariant를 test로 고정하면 mask와 transpose 오류를 빠르게 찾을 수 있다.
          </p>
        </div>
      </section>

      <section id="legacy" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원문을 닫고 현대 LLM으로 넘어가는 경계</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Transformer의 오래가는 기여는 특정 normalization이나 position encoding이 아니라, sequence
            dependency를 attention·residual stream·position-wise transformation의 반복으로 재구성한 것이다.
            이후 BERT는 encoder를, GPT 계열은 causal decoder를 중심으로 갈라졌고 효율화 연구는 attention의
            memory traffic, KV cache와 긴 context 문제를 다시 다뤘다.
          </p>
          <p>
            원문 tensor를 직접 구현하려면 <InternalLink slug="transformer-architecture">Transformer 구조
            구현</InternalLink>으로 이동한다. 현재 dense, MoE, GQA, hybrid 구조를 비교하려면
            <InternalLink slug="llm-architecture-gallery">LLM 아키텍처 계보</InternalLink>에서 원문 이후에
            무엇이 추가됐는지 따로 읽는다.
          </p>
        </div>
        <StopRule>
          세 attention의 Q·K·V 소유자와 score shape, scaling, FFN 책임, original Post-LN recipe와 Table
          1~3의 증거 한계를 설명할 수 있으면 이 원문 단계는 끝이다. 현대 구성요소를 더 외우기 위해 여기서
          과거로 내려가지 않는다.
        </StopRule>
        <CapabilityCheck items={[
          'Encoder self, masked decoder self, cross-attention의 Q·K·V 출처를 구분한다.',
          'B=2, S=5, T=4에서 세 score와 output tensor shape를 계산한다.',
          '왜 1/√dₖ가 필요한지 score 분산과 softmax 관점에서 설명한다.',
          'Attention의 token mixing과 FFN의 position-wise feature 변환을 구분한다.',
          '2017 Post-LN·sinusoidal·ReLU 구조와 현대 LLM의 대체 구성요소를 혼동하지 않는다.',
          'Table 1, 2, 3이 각각 지지하는 주장과 지지하지 않는 주장을 말한다.',
        ]} />
        <SourceNotes sources={[
          {
            label: 'Attention Is All You Need · arXiv',
            href: 'https://arxiv.org/abs/1706.03762',
            note: 'Architecture, 식, training recipe, Tables 1~3와 부록의 1차 근거.',
          },
          {
            label: 'NeurIPS 2017 proceedings',
            href: 'https://proceedings.neurips.cc/paper/7181-attention-is-all-you-need',
            note: '공식 출판 기록과 paper PDF.',
          },
          {
            label: 'Tensor2Tensor repository',
            href: 'https://github.com/tensorflow/tensor2tensor',
            note: '저자 구현 계열과 당시 training configuration을 대조할 source artifact.',
          },
          {
            label: 'The Annotated Transformer',
            href: 'https://nlp.seas.harvard.edu/annotated-transformer/',
            note: '원문 block과 training loop를 실행 가능한 code로 다시 읽는 보조 자료. 원문 자체와 구분한다.',
          },
        ]} />
      </section>
    </>
  );
}
