import {
  InternalLink,
  Misconception,
} from '@/components/learning/ArticleLearning';

function DecisionRow({
  part,
  chosen,
  why,
  boundary,
}: {
  part: string;
  chosen: string;
  why: string;
  boundary: string;
}) {
  return (
    <div className="grid min-w-0 gap-3 border-t border-border py-4 lg:grid-cols-[8rem_11rem_minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-5">
      <p className="text-sm font-black">{part}</p>
      <p className="font-mono text-xs font-bold">{chosen}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{why}</p>
      <p className="text-xs leading-relaxed"><strong>검증 경계</strong> · {boundary}</p>
    </div>
  );
}

export default function Krea2Architecture() {
  return (
    <>
      <section id="data-captioning" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">넓은 style 분포의 첫 번째 원인은 architecture가 아니라 data다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Krea 2는 중복과 과대표현 concept, VLM이 중요한 장면을 계속 놓치는 sample, artifact·bias를 유도하는 image,
            저해상도에서 지나치게 복잡한 sample과 AI-generated image를 pretraining mix에서 제거했다고 밝힌다.
            합성 이미지는 배우기 쉬워 작은 비율만 섞여도 output distribution에 bias를 만들고 품질 상한을 낮춘다는 관찰이 이유다.
          </p>
          <p>
            Caption pipeline은 visible text를 먼저 OCR한다. 그 결과와 camera metadata, 알려진 entity를 captioning model에 함께 주고
            world knowledge가 포함된 긴 caption을 만든다. 이후 더 싼 LLM이 같은 내용을 여러 길이와 형식으로 바꾼다.
            긴 caption은 dense supervision을 주지만 실제 사용자는 짧은 prompt도 쓰므로 short·medium prompt도 학습 중 유지한다.
          </p>
          <p>
            여기서 “합성 이미지를 pretraining에서 쓰지 않았다”와 “RL rollout을 생성한다”는 모순이 아니다.
            Pretraining image mix는 세계와 style의 base distribution을 만든다. RL sample은 이미 만들어진 policy가 특정 prompt 요구를 얼마나
            지키는지 reward를 주는 on-policy signal이다. Stage와 목적이 다르다.
          </p>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">LLM 부품을 가져왔지만 diffusion의 비용 구조로 다시 검산했다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Data가 “어떤 style 방향이 존재하는가”를 정했다면, 공개 config의 rectified-flow DiT는 noise에서 image로 가는 velocity를
            학습하며 그 방향을 표현할 capacity와 계산 비용을 정한다. 공식 report와 repository는 block 폭과 깊이는 공개하지만
            전체 parameter 수를 명시하지 않으므로 여기서는 총규모를 역산해 공식 수치처럼 쓰지 않는다.
            Architecture는 없는 coverage를 새로 만들 수 없지만,
            이미 있는 signal을 불안정하게 잃거나 너무 비싸게 처리하지 않도록 만든다.
          </p>
          <p>
            Krea는 각 architecture 선택을 stability, performance, efficiency와 simplicity 네 질문으로 분류했다.
            “최신 부품이므로 채택”한 것이 아니다. 짧은 low-resolution run에서 좋아 보여도 긴 horizon과 high resolution에서 유지되는지,
            parameter·FLOP·memory·communication을 줄이는지, kernel ecosystem을 재사용할 수 있는지 확인했다.
          </p>
        </div>
        <div className="not-prose mt-6 border-b border-border">
          <DecisionRow part="Attention" chosen="GQA + gate" why="GQA는 작은 품질 저하로 compute 효율을 얻었고 sigmoid gate는 loss와 gradient norm을 더 안정적으로 만들었다." boundary="Diffusion은 inference가 prefill-only라 KV cache 절감이 핵심 이유는 아니다." />
          <DecisionRow part="MLP" chosen="SwiGLU" why="4× expansion의 GeLU MLP와 비교해 일관된 성능 향상을 보여 이후 ablation의 기본으로 삼았다." boundary="LLM에서 유명하다는 사실이 아니라 Krea의 ablation 범위 안 관찰이다." />
          <DecisionRow part="Stream" chosen="Single stream" why="Hybrid가 조금 앞섰지만 차이가 크지 않아 text·image가 같은 attention·MLP weight를 공유하는 단순한 final block을 골랐다." boundary="Single stream 자체가 style diversity의 단독 원인은 아니다." />
          <DecisionRow part="Timestep" chosen="Light bias" why="Block별 modulation MLP의 20–30% parameter overhead를 줄이고 attention·MLP에 capacity를 배분했다." boundary="Time condition 제거는 underperform했고 고해상도 timestep token도 경쟁력이 없었다." />
          <DecisionRow part="Norm · pos" chosen="zc-RMS · 3D RoPE" why="Zero-centered RMSNorm·QKNorm과 frame/height/width 축의 3D axial RoPE를 final configuration으로 골랐다." boundary="Low-res 이득이 high-res training 끝까지 유지되는지 따로 봤다." />
          <DecisionRow part="Autoencoder" chosen="Qwen · FLUX2 AE" why="DC-AE의 큰 압축은 reconstruction error가 fine detail 상한을 만들었고 두 AE가 convergence와 reconstruction을 함께 유지했다." boundary="Early와 larger model이 같은 AE 하나를 썼다고 단순화하지 않는다." />
        </div>
        <Misconception>
          GQA를 “KV cache를 줄여 autoregressive decoding을 빠르게 한다”고만 설명하면 Krea 2에서는 절반만 맞는다. 보고서는 diffusion inference가 전체 sequence를 매 step 다시 보는 prefill-only이고 KV cache가 없다고 명시한다. 여기서는 projection·attention compute와 kernel 재사용이 핵심 검산 대상이다.
        </Misconception>
      </section>

      <section id="text-features" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Qwen3-VL의 layer를 모으고 autoregressive bias를 한 번 더 줄인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Final text encoder는 Qwen3-VL이다. 마지막 hidden state 하나만 넘기지 않는다. Shallow attention module이 여러 VLM layer의
            hidden feature를 모으고, token axis의 가벼운 bidirectional transformer layer가 autoregressive representation bias를 줄인다.
            생성 prompt에서는 뒤 token도 앞 token과 함께 전체 장면 조건을 만들기 때문이다.
          </p>
          <p>
            이 선택은 “VLM이 text-only encoder보다 항상 우월하다”는 보편 법칙이 아니다. Krea의 caption distribution,
            architecture size와 training horizon에서 비교한 결과다. 실제 공개 runtime을 읽을 때는 encoder output shape,
            aggregation layer와 main transformer로 넘어가는 projection을 trace해야 한다.
            더 일반적인 single-stream·DiT 비교는
            <InternalLink slug="dit-flow-matching-evaluation">DiT·Flow Matching 평가</InternalLink>로 내려간다.
          </p>
        </div>
      </section>
    </>
  );
}
