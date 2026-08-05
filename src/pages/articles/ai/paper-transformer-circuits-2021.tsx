import FormulaNote from '@/components/ui/formula-note';
import MathFormula from '@/components/ui/math';
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
  InductionTraceLab,
  QkOvCircuitLab,
  VirtualWeightLab,
} from './paper-transformer-circuits-2021/viz/TransformerCircuitLabs';

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
        <MathFormula display className="my-0 text-[12px] sm:text-[15px]">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function PaperTransformerCircuits2021Article() {
  return (
    <>
      <section id="residual-channel" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Residual stream은 계산기가 아니라 component 사이의 공용 통신 채널이다</h2>
        <QuestionLead
          question="Layer 1의 head가 쓴 정보가 여러 block 뒤의 head에 영향을 주는 연결은 weight 어디에 있을까?"
          answer="Residual stream에 별도 edge가 저장되는 것은 아니다. 앞 component의 output projection과 뒤 component의 input projection을 곱하면, 앞에서 쓴 방향을 뒤가 얼마나 읽는지 나타내는 virtual weight가 드러난다. 논문은 이 선형 구조를 모델 내부 경로를 펼치는 출발점으로 삼았다."
        />
        <ConceptPrimer items={[
          { term: 'Residual stream', meaning: 'Token position마다 embedding과 이전 component update가 더해져 흐르는 공용 state다.', why: 'Head와 MLP가 서로 직접 호출하지 않고 이 state에 쓰고 읽는다.' },
          { term: 'Write matrix', meaning: 'Component 결과를 residual 차원으로 되돌려 더하는 output projection이다.', why: '어떤 subspace에 정보를 남기는지 정한다.' },
          { term: 'Read matrix', meaning: 'Residual state를 query, key, value 또는 MLP input으로 투영한다.', why: '뒤 component가 어느 방향을 사용할지 정한다.' },
          { term: 'Virtual weight', meaning: '앞 write와 뒤 read를 곱한 암묵적 end-to-end 연결이다.', why: '중간 residual vector의 임의 좌표 대신 component 사이 통신을 본다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Residual block은 이전 state를 지우고 새 state로 교체하지 않는다. 원 embedding과 모든 앞선 update를 계속 더한다.
            그래서 뒤 component는 한 덩어리 activation을 읽지만, 대수적으로는 어느 앞 component가 쓴 경로인지 다시 펼칠 수 있다.
            이때 residual basis 자체에 특별한 의미가 있다고 가정할 필요가 없다. 모든 read/write 행렬을 함께 회전하면 같은 계산을 만들 수 있기 때문이다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
x_\ell
&=\underbrace{x_0}_{\text{처음 token 표현}}
+\sum_{j<\ell}\underbrace{\Delta x_j}_{\text{앞 component가 쓴 update}}\\
\underbrace{C_{1\rightarrow2}}_{\substack{\text{앞→뒤}\\\text{암묵적 연결}}}
&=\underbrace{W_I^{(2)}}_{\text{뒤 read}}
\underbrace{W_O^{(1)}}_{\text{앞 write}}
\end{aligned}`}
          meaning="왜 update를 더하나: residual architecture는 공용 state를 유지하면서 각 component의 변화량을 누적한다. 왜 두 행렬을 곱하나: 앞 component가 residual에 쓴 방향을 뒤 component의 input projection이 다시 읽는 정도가 두 선형변환의 합성이기 때문이다. 이 곱은 별도 parameter가 아니라 기존 weight에서 계산한 virtual weight다."
          symbols={[
            [String.raw`x_\ell`, 'layer ℓ에 들어가는 residual state'],
            [String.raw`\Delta x_j`, 'j번째 attention head 또는 MLP가 residual에 더한 update'],
            [String.raw`W_O^{(1)}`, '앞 component의 결과를 residual 차원에 쓰는 행렬'],
            [String.raw`W_I^{(2)}`, '뒤 component가 residual에서 필요한 방향을 읽는 행렬'],
            [String.raw`C_{1\to2}`, '두 component 사이의 암묵적 선형 coupling'],
          ]}
        />
        <VirtualWeightLab />
        <Misconception>
          Residual dimension 하나를 곧바로 “문법 뉴런”처럼 이름 붙이는 것이 이 framework의 결론은 아니다. 논문은 오히려 residual stream이
          여러 component의 통신을 superposition으로 담는 병목이므로, raw 좌표보다 virtual weight와 path로 분해해 보자고 제안한다.
        </Misconception>
      </section>

      <section id="qk-ov" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Attention head 하나도 QK의 선택과 OV의 쓰기라는 두 회로로 나뉜다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Attention map은 source position을 얼마나 읽는지만 보여 준다. 그 위치의 value가 어떤 residual 방향으로 바뀌고, 최종적으로 어느
            vocabulary logit을 올리는지는 보이지 않는다. Framework는 중간 Q·K·V vector보다 두 저랭크 행렬
            <code>W_QK = W_QᵀW_K</code>와 <code>W_OV = W_OW_V</code>를 중심으로 head를 읽는다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{A^h}_{\text{어느 위치를 읽을지}}
&=\operatorname{softmax}^{*}\!\left(x^\top
\underbrace{W_{QK}^h}_{W_Q^\top W_K}x\right)\\
\underbrace{h(x)}_{\substack{\text{head가 residual에}\\\text{쓰는 update}}}
&=\left(\underbrace{A^h}_{\text{position 이동}}\otimes
\underbrace{W_{OV}^h}_{\substack{W_OW_V\\\text{feature 이동}}}\right)x
\end{aligned}`}
          meaning="QK circuit은 destination query와 source key의 점수로 attention pattern을 만든다. Causal softmax 별표는 미래 position을 가린 뒤 source 비율을 정규화한다. OV circuit은 선택된 source의 value를 output projection까지 통과시켜 residual에 어떤 방향으로 쓸지 정한다. 두 역할을 분리해야 “어디를 봤다”와 “무엇을 예측하게 했다”를 섞지 않는다."
          symbols={[
            [String.raw`A^h`, 'head h의 causal attention pattern'],
            [String.raw`W_{QK}^h`, 'query-key score를 직접 계산하는 저랭크 행렬'],
            [String.raw`W_{OV}^h`, '선택된 value를 residual write로 바꾸는 저랭크 행렬'],
            [String.raw`\otimes`, 'position 이동과 feature 변환을 동시에 적용하는 tensor product 표기'],
            [String.raw`h(x)`, 'head h가 모든 token position의 residual에 더하는 결과'],
          ]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{S_h}_{\text{token 쌍별 score map}}&=W_E^\top W_{QK}^h W_E\\
S_h&:(\text{query},\text{key})\mapsto\text{score}\\
\underbrace{V_h}_{\text{source-to-logit map}}&=W_UW_{OV}^hW_E\\
V_h&:\text{source token}\mapsto\Delta\text{logits}
\end{aligned}`}
          meaning="Embedding과 unembedding까지 곱하면 head를 token-to-token 표로 읽을 수 있다. 첫 행렬은 어떤 query token이 어떤 key token을 선호하는지, 둘째 행렬은 source token을 읽었을 때 어느 output token logit을 올리거나 내리는지 보여 준다. 둘 다 weight에서 계산한 가설이며 실제 context의 attention pattern과 model behavior로 다시 확인해야 한다."
          symbols={[
            [String.raw`W_E`, 'Vocabulary token을 residual vector로 바꾸는 embedding'],
            [String.raw`W_U`, 'Residual vector를 vocabulary logits로 바꾸는 unembedding'],
            [String.raw`W_E^\top W_{QK}W_E`, 'Token pair 좌표에서 본 QK circuit'],
            [String.raw`W_UW_{OV}W_E`, 'Source token에서 output logits까지 본 OV circuit'],
          ]}
        />
        <QkOvCircuitLab />
        <Misconception>
          Attention weight가 0.9라고 해서 그 source가 output의 90%를 설명하는 것은 아니다. Value vector의 크기와 방향, OV write,
          다른 head·MLP·skip path의 합까지 봐야 한다. <InternalLink slug="llm-interpretability-readouts">Readout 글</InternalLink>은 이 관찰 경계를 더 자세히 다룬다.
        </Misconception>
      </section>

      <section id="layer-ladder" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Layer를 하나 더 쌓을 때 lookup table이 composition algorithm으로 바뀐다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            저자들은 MLP를 뺀 작은 autoregressive Transformer를 0·1·2 attention layer로 나누어 reverse engineering했다.
            이것은 성능 순위표가 아니라 “어떤 end-to-end path가 새로 생기는가”를 통제한 실험이다.
          </p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['00', 'Zero layer · bigram', '[A] 다음 [B]처럼 embedding→unembedding의 token pair 통계를 직접 담는다.', '직전 token 밖의 context를 읽지 못한다.'],
            ['01', 'One layer · skip-trigram', '[A] … [B] 다음 [C]처럼 학습 중 자주 본 고정 token 연관을 head의 QK·OV 표에 저장한다.', '한 layer 안의 head는 서로의 결과를 읽지 못하므로, 처음 보는 token identity에도 적용되는 내용 기반 matching은 만들지 못한다.'],
            ['02', 'Two layer · composition', '뒤 head의 Q·K·V projection이 앞 head가 residual에 쓴 정보를 읽어 multi-step algorithm을 만든다.', '어떤 composition이 실제로 중요한지는 model과 context에서 검증해야 한다.'],
          ].map(([number, title, mechanism, boundary]) => (
            <article key={number} className="grid gap-3 py-5 sm:grid-cols-[3rem_12rem_minmax(0,1fr)] sm:gap-5">
              <p className="font-mono text-xl font-black text-muted-foreground">{number}</p>
              <p className="text-sm font-black">{title}</p>
              <div className="min-w-0">
                <p className="text-sm leading-relaxed">{mechanism}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">경계 · {boundary}</p>
              </div>
            </article>
          ))}
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{W_Q^{(2)}W_O^{(1)}}_{\text{Q-composition}}&:\ \text{앞 head의 write가 뒤 query를 바꿈}\\
\underbrace{W_K^{(2)}W_O^{(1)}}_{\text{K-composition}}&:\ \text{앞 head의 write가 뒤 key를 바꿈}\\
\underbrace{W_V^{(2)}W_O^{(1)}}_{\text{V-composition}}&:\ \text{앞 head의 write가 뒤 value를 바꿈}
\end{aligned}`}
          meaning="두 번째 layer의 query, key, value projection은 원 embedding뿐 아니라 첫 layer head가 residual에 쓴 update도 읽는다. 어느 input projection이 그 update를 읽느냐에 따라 Q-, K-, V-composition이 된다. Q/K composition은 뒤 head의 attention pattern을 바꾸고, V composition은 선택된 content가 이동하는 경로를 합성한다."
          symbols={[
            [String.raw`W_Q^{(2)},W_K^{(2)},W_V^{(2)}`, '두 번째 layer head의 query·key·value read'],
            [String.raw`W_O^{(1)}`, '첫 번째 layer head가 residual에 쓴 output'],
            ['Q-composition', '앞 head가 뒤 head의 찾는 질문을 바꾸는 경로'],
            ['K-composition', '앞 head가 뒤 head가 검색할 주소를 바꾸는 경로'],
            ['V-composition', '두 head의 정보 이동을 연속으로 합성하는 경로'],
          ]}
        />
      </section>

      <section id="induction-head" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Induction head는 현재 token의 이전 사용 예를 찾아 그 다음 token을 복사한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            One-layer copying head는 대략 <code>[b] … [a] → [b]</code>처럼 학습에서 본 “a 뒤에 b가 올 법하다”는
            고정 token 연관을 skip-trigram 표에 저장한다. 겉모양은 반복을 복사하는 것처럼 보여도, 처음 보는 무작위 token 쌍의
            identity를 그 자리에서 비교하는 algorithm은 아니다.
            Two-layer induction algorithm은 <code>[a][b] … [a] → [b]</code>를 구현한다. 첫 layer의 previous-token head가
            각 source 위치에 바로 앞 token 정보를 쓴다. 두 번째 layer의 induction head는 K-composition으로 그 정보를 key에서 읽어
            현재 token과 같은 앞 token을 가진 source를 찾고, copying OV circuit으로 그 source token을 output에 쓴다. 이 경로는
            특정 a·b 조합을 외운 표가 아니라 현재 context의 token identity로 주소를 만들기 때문에, 무작위 token을 반복한 실험에서도
            같은 규칙을 적용할 수 있다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
Q_{\text{현재 위치}}&=\mathrm{Id}\\
K_{\text{이전 token}}&=A^{h_{-1}}\\
S_{\text{같은 token}}&=W_{\mathrm{match}}\\
C_{\mathrm{induction}}&=Q\otimes K\otimes S
\end{aligned}`}
          meaning="왜 key 쪽을 이동하나: 현재 A와 과거 A를 직접 맞추면 과거 A 위치를 읽게 되지만, 복사해야 할 것은 그 다음 B다. Previous-token head가 B 위치의 key에 앞 token A 정보를 써 두면, 현재 A query가 B 위치를 선택할 수 있다. Identity는 query position을 유지하고, shifted attention은 source key의 주소만 한 칸 옮긴다."
          symbols={[
            [String.raw`\mathrm{Id}`, '현재 destination query의 position을 바꾸지 않는 identity path'],
            [String.raw`A^{h_{-1}}`, '바로 이전 token을 읽는 첫 layer head의 attention pattern'],
            [String.raw`W_{\mathrm{match}}`, '같은 token 표현일 때 QK score를 높이는 feature match'],
            ['K-composition', '앞 head의 output을 뒤 head의 key projection이 읽는 경로'],
          ]}
        />
        <InductionTraceLab />
        <Misconception>
          Induction head의 대각선 attention pattern만 보고 그 head 하나가 algorithm 전체를 소유한다고 말하면 안 된다. 앞 layer의 previous-token
          head가 key-side 정보를 옮기지 않으면 뒤 head는 어디를 선택해야 할지 알 수 없다. 눈에 띄는 attention과 causal dependency가 다를 수 있다.
        </Misconception>
      </section>

      <section id="evidence-limits" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">무작위 반복 token은 mechanism을 지지하지만 대형 모델 전체를 증명하지는 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            저자들은 자연어에서 본 pattern만으로 induction 가설을 확정하지 않았다. Vocabulary에서 균일하게 뽑은 무작위 token sequence를
            세 번 반복해, 일반적인 언어 통계가 전혀 도움이 되지 않는 분포 밖 입력에서도 induction heads가 반복 다음 token을 찾는지 확인했다.
            QK와 OV 행렬의 양의 eigenvalue 경향도 “same-token match + copying” 가설과 맞았다.
          </p>
          <p>
            반면 studied two-layer model에서 V-composition이 만든 2차 virtual attention-head term은 marginal loss 기여가 작았다.
            이는 “모든 Transformer에서 V-composition이 중요하지 않다”가 아니라 해당 작은 모델에서 우선순위를 낮출 근거다.
            논문 자체도 MLP를 제거하고 bias와 explicit LayerNorm을 생략한 toy models에 집중했다. 거대한 weight 표를 얻는 것과 사람이 이해할 수 있는
            압축 설명을 얻는 것도 같은 일이 아니다.
          </p>
          <p>
            원문에는 2022 correction도 붙어 있다. 저자들이 head composition의 Frobenius norm을 빠르게 계산하던 library에 오류가 있어
            한 diagram이 실제보다 sparse하게 보였다. 수정 뒤에는 추가 composition이 드러났지만 previous-token head와 induction head 사이의
            핵심 K-composition은 유지됐다. 따라서 composition score 그림 하나를 완성된 circuit 증명으로 읽지 않고, 계산식·실제 attention·
            ablation을 함께 확인해야 한다.
          </p>
          <p>
            따라서 이 글의 weight algebra는 mechanism hypothesis의 바닥이다. Dense activation에서 feature를 찾는 질문은
            <InternalLink slug="sparse-autoencoder">Sparse Autoencoder</InternalLink>로, 그 경로가 실제 answer의 원인인지 묻는 질문은
            <InternalLink slug="llm-circuit-analysis">Causal Circuit Analysis</InternalLink>로 올라간다.
          </p>
        </div>
        <StopRule>
          Residual virtual weight, QK/OV 분리, zero→one→two layer 표현력 계단과 induction K-composition을 한 token trace로 설명할 수 있으면
          이 원문의 최소 바닥은 끝이다. 더 오래된 circuit 계보 전체를 필수로 만들지 않는다.
        </StopRule>
        <CapabilityCheck items={[
          '앞 component의 write와 뒤 component의 read를 곱해 virtual weight가 되는 이유를 설명한다.',
          'Attention pattern의 QK 선택과 OV logit write를 같은 주장으로 합치지 않는다.',
          'Zero-, one-, two-layer attention-only model이 각각 어떤 context function을 추가하는지 말한다.',
          '[A][B] … [A] → [B]에서 previous-token head와 induction head의 K-composition 경로를 추적한다.',
          '무작위 반복-token evidence와 attention-only toy-model limitation을 함께 보고한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Elhage et al. · A Mathematical Framework for Transformer Circuits', href: 'https://transformer-circuits.pub/2021/framework/index.html', note: 'Virtual weights, QK/OV circuits, path expansion, composition과 induction-head 분석 및 2022 correction의 1차 interactive paper.' },
          { label: 'Olsson et al. · In-context Learning and Induction Heads', href: 'https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html', note: 'Induction head와 in-context learning의 phase change를 더 넓은 model scale에서 검증한 후속 연구.' },
          { label: 'Transformer Circuits thread', href: 'https://transformer-circuits.pub/', note: '2021 framework가 후속 superposition, SAE와 circuit tracing으로 이어지는 공식 연구 계보.' },
        ]} />
      </section>
    </>
  );
}
