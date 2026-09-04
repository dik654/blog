import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import MotifGdlaViz from "./viz/MotifGdlaViz";

const configRows = [
  ["전체 / token당 활성", "약 314B / 13.2B"],
  ["Main layers", "53 = dense 2 + sparse MoE 51"],
  ["Routed / shared experts", "384 top-8 / 1"],
  ["Query / KV heads", "80 / 16"],
  ["Signal / noise heads", "64 / 16 (g=4)"],
  ["Attention schedule", "full 1 + sliding-window 3 반복"],
  ["Context", "262,144 tokens"],
] as const;

export default function Motif3ArchitectureArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader number="00" eyebrow="2026-08-24 release receipt" title="정식 명칭은 MDLA가 아니라 GDLA이며, Motif 3는 architecture와 post-training을 함께 설계한 314B MoE다">
          Motif 3 technical report v1은 2026년 8월 10일 공개됐고, 현재 정식 checkpoint는 MIT license로 배포됩니다. 핵심 attention 이름은 <strong>Grouped Differential Latent Attention(GDLA)</strong>입니다. 모델 하나의 성과를 GDLA 단독 효과로 환원하지 않고 architecture·training system·data·post-training을 각각 읽겠습니다.
        </LessonHeader>
        <TermLesson
          name="Motif 3 system configuration"
          oneLine="314B weight capacity 가운데 token마다 약 13.2B를 활성화하고, GDLA·modified mHC·Expert-Specific PolyNorm·MTP와 7개 specialist의 MOPD를 조합한 decoder-only MoE입니다."
          shape="token → [modified mHC → GDLA → modified mHC → MoE] × 53 → MTP-assisted decode"
          example="Sparse 51층에서는 token 하나가 routed expert 384개 중 8개와 shared expert 1개를 통과합니다."
          boundary="314B는 weight residency, 13.2B는 활성 parameter 장부입니다. 둘 중 어느 숫자도 VRAM·latency·품질과 동일하지 않습니다."
        />
        <div className="not-prose overflow-hidden rounded-lg border border-border">
          <dl className="grid md:grid-cols-2">
            {configRows.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b border-border px-5 py-3 odd:md:border-r"><dt className="text-sm font-bold text-muted-foreground">{label}</dt><dd className="text-sm font-black">{value}</dd></div>)}
          </dl>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          Router·Top-k·shared expert의 일반 원리는 <Link className="text-primary hover:underline" to="/ai/mixture-of-experts">MoE 글</Link>, MTP objective와 self-speculative serving의 경계는 <Link className="text-primary hover:underline" to="/ai/vllm-spec-decode">MTP 글</Link>이 소유합니다.
        </p>
      </section>

      <section id="gdla" className="space-y-6">
        <LessonHeader number="01" eyebrow="두 축의 결합" title="MLA는 KV 저장 폭을 줄이고 GDA는 signal·noise head의 계산 배분을 바꾼다">
          MLA의 compressed KV와 GDA의 차분 attention은 서로 다른 문제를 풉니다. Motif 3는 두 query path가 같은 KV latent를 읽게 해 별도 noise KV cache를 만들지 않고, token별 λ와 output gate를 추가합니다.
        </LessonHeader>
        <MotifGdlaViz />
        <div className="grid gap-5 md:grid-cols-2">
          <TermLesson name="MLA latent KV compression" oneLine="Token의 key와 value 정보를 작은 joint latent cKV로 내린 뒤 필요할 때 head representation으로 확장하는 cache 설계입니다." shape="xₜ → [cKVₜ ; rotary keyₜ] → normalized latent → K,V heads" example="Motif 3의 query/KV low-rank dimension은 1,024/512이고 expanded KV heads는 16개입니다." boundary="Low-rank compression은 정보 손실·projection compute와 맞바꾸며 모든 model에서 같은 cache 감소율을 보장하지 않습니다." />
          <TermLesson name="Grouped Differential Attention" oneLine="Signal query head를 noise query head보다 더 많이 두고, 작은 noise-head 집합의 output을 group마다 반복해 차분하는 attention입니다." shape="64 signal heads − λₜ ⊙ Repeat₄(16 noise heads)" example="g=4이면 80 query heads 중 signal 64개, noise 16개가 됩니다." boundary="두 map을 빼는 것을 실제 음향 noise source 분리나 causal relevance 증명으로 읽지 않습니다." />
        </div>
        <ExplainedFormula
          question="64개 signal head와 16개 noise head는 어떻게 같은 shape로 차분될까요?"
          idea="Noise output 하나를 group 안의 signal head 네 개에 반복하고, 각 signal head가 현재 token에서 예측한 0–1 계수로 suppression 양을 정합니다."
          formula={String.raw`\mathbf D_t=\mathbf H_{S,t}-\boldsymbol\lambda_t\odot\operatorname{Repeat}_g(\mathbf H_{N,t}),\quad \boldsymbol\lambda_t=\sigma(\mathbf x_t\mathbf W^\lambda)`}
          annotatedFormula={String.raw`\mathbf D_t=\underbrace{\mathbf H_{S,t}}_{\text{signal attention output}}-\underbrace{\boldsymbol\lambda_t\odot\operatorname{Repeat}_g(\mathbf H_{N,t})}_{\substack{\text{noise output을 group shape로 반복하고}\text{token별 suppression 비율을 곱함}}}`}
          operations={[
            { expression: String.raw`\operatorname{Repeat}_g(\mathbf H_{N,t})`, annotation: ["작은 noise-head 집합을 g번 반복해", "signal-head output과 shape 정렬"] },
            { expression: String.raw`\boldsymbol\lambda_t\odot\operatorname{Repeat}_g(\mathbf H_{N,t})`, annotation: ["각 signal head의 token별 계수로", "뺄 noise 기여를 0–1 범위로 조절"] },
            { expression: String.raw`\mathbf H_{S,t}-\boldsymbol\lambda_t\odot\operatorname{Repeat}_g(\mathbf H_{N,t})`, annotation: ["공통적으로 잡힌 output 기여를 빼", "차분 representation 생성"] },
          ]}
          terms={[
            { symbol: String.raw`\mathbf H_S`, name: "signal-head output", description: "64개 signal query가 shared K/V를 읽은 output입니다." },
            { symbol: String.raw`\mathbf H_N`, name: "noise-head output", description: "16개 noise query가 같은 shared K/V를 읽은 output입니다." },
            { symbol: "g", name: "grouped ratio", description: "Noise output 하나를 대응시킬 signal head 수이며 Motif 3는 4입니다." },
            { symbol: String.raw`\boldsymbol\lambda_t`, name: "token-dependent coefficient", description: "Signal head마다 현재 token에서 sigmoid로 예측한 suppression 비율입니다." },
          ]}
          assumptions={["Signal과 noise path는 같은 compressed KV와 positional reference를 사용합니다.", "λ가 0–1이므로 noise term을 반전하거나 1보다 크게 증폭하지 않습니다.", "‘Noise’는 학습된 attention path의 이름이며 사람이 지정한 irrelevant token mask가 아닙니다."]}
          interpretation="노이즈 캔슬링 이어폰 비유는 subtraction 직관까지만 유효합니다. HN이 실제 noise의 ground truth라는 보장도, D가 항상 더 sparse하거나 해석 가능하다는 보장도 없습니다."
        />
        <AlgorithmBlock
          title="한 token의 GDLA forward"
          input={["hidden state xₜ", "compressed query/KV projections", "causal or sliding-window mask", "group ratio g=4"]}
          steps={[
            { code: "cQ ← RMSNorm(xₜ WQa); [qContent, qRoPE] ← cQ WQb", note: "Query도 low-rank latent를 거쳐 signal/noise heads로 확장합니다." },
            { code: "[cKV, kRoPE] ← xₜ WKVa; [KContent, V] ← RMSNorm(cKV) WKVb", note: "두 query path가 공유할 16 KV heads를 한 번 만듭니다." },
            { code: "HS ← Attention(Qsignal, K, V, mask); HN ← Attention(Qnoise, K, V, mask)", note: "Layer schedule에 따라 full causal 또는 window 128 mask를 씁니다." },
            { code: "λ ← sigmoid(xₜ Wλ); D ← HS − λ ⊙ Repeatg(HN)", note: "Noise output을 signal shape로 반복한 뒤 token별로 뺍니다." },
            { code: "G ← sigmoid(reshape(cQ WG)); output ← vec(G ⊙ D) WO", note: "차분 뒤 element-wise output gate와 projection을 적용합니다." },
          ]}
          output="GDLA token-mixing update"
        />
        <p className="text-sm leading-7 text-muted-foreground">
          MLA와 GDA는 서로 다른 병목에서 출발합니다. MLA는 decode 가 옮기는 KV cache 크기를 줄이는
          <Link className="text-primary hover:underline" to="/ai/differential-attention#boundary"> memory 축</Link>이고,
          <Link className="text-primary hover:underline" to="/ai/differential-attention"> differential attention</Link>의
          signal·noise 차분(원 mechanism은 대칭 head, GDA는 그 head 비율을 비대칭으로 바꾼 변형)은
          attention 이 무엇에 점수를 주는지를 바꾸는 selectivity 축입니다.
        </p>
        <p className="text-sm leading-7 text-muted-foreground">
          GDLA의 결합 지점은 두 query path(signal, noise)가 별도 KV cache 없이 같은 compressed latent를 읽게 만든 자리입니다. 새로 드는
          비용은 두 가지입니다. latent 하나를 signal·noise 두 경로가 각각 복원해야 하고, token별 λ·output gate 계산도 MLA 단독보다 늘어납니다.
        </p>
      </section>

      <section id="mhc" className="space-y-6">
        <LessonHeader number="02" eyebrow="Depth information flow" title="Modified mHC는 residual 하나를 네 stream의 token-dependent mixing으로 바꾼다">
          일반 residual은 직전 state와 sublayer update를 더합니다. mHC는 네 residual stream을 하나의 sublayer input으로 줄이고, sublayer output을 다시 네 stream에 배분하면서 기존 stream끼리도 doubly-stochastic matrix로 섞습니다.
        </LessonHeader>
        <TermLesson name="Modified manifold-constrained hyper-connections" oneLine="네 parallel residual stream의 pre·residual·post mapping을 token마다 만들되 residual matrix의 모든 행·열 합을 1로 제한하는 연결 구조입니다." shape="4 streams → Hpre reduction → F → Hpost broadcast + Hres stream mixing" example="Motif 3는 post multiplier st를 training 중 2에서 1로 낮춰 반복 amplification 범위를 (0,2)에서 (0,1)로 옮깁니다." boundary="Doubly-stochastic constraint가 loss convergence나 모든 depth의 안정성을 자동 증명하지 않으며 mapping 계산·memory 비용이 추가됩니다." />
        <ExplainedFormula
          question="한 sublayer 뒤 네 residual stream은 어떤 두 경로를 합칠까요?"
          idea="첫 경로는 기존 stream을 convex mixing하고, 둘째 경로는 pre-map으로 고른 sublayer input을 계산한 뒤 post-map으로 네 stream에 다시 배분합니다."
          formula={String.raw`\mathbf X_{\ell+1}=\mathbf H_{\rm res}\mathbf X_\ell+\mathbf H_{\rm post}^{\top}F_\ell(\mathbf H_{\rm pre}\mathbf X_\ell)`}
          annotatedFormula={String.raw`\mathbf X_{\ell+1}=\underbrace{\mathbf H_{\rm res}\mathbf X_\ell}_{\substack{\text{기존 네 residual stream을}\text{doubly-stochastic하게 혼합}}}+\underbrace{\mathbf H_{\rm post}^{\top}F_\ell(\mathbf H_{\rm pre}\mathbf X_\ell)}_{\substack{\text{stream을 하나로 줄여 sublayer 계산 후}\text{네 stream으로 다시 배분}}}`}
          operations={[
            { expression: String.raw`\mathbf H_{\rm pre}\mathbf X_\ell`, annotation: ["네 stream의 token별 비중을 골라", "sublayer input 하나로 축약"] },
            { expression: String.raw`F_\ell(\mathbf H_{\rm pre}\mathbf X_\ell)`, annotation: ["선택한 input에 attention 또는 FFN을 적용해", "새 update 계산"] },
            { expression: String.raw`\mathbf H_{\rm res}\mathbf X_\ell+\mathbf H_{\rm post}^{\top}F_\ell(\mathbf H_{\rm pre}\mathbf X_\ell)`, annotation: ["기존 정보 흐름과 새 update를 합쳐", "다음 layer의 네 stream 생성"] },
          ]}
          terms={[
            { symbol: String.raw`\mathbf X_\ell`, name: "parallel residual streams", description: "Layer ℓ에서 token별로 유지하는 4×d state입니다." },
            { symbol: String.raw`\mathbf H_{\rm pre}`, name: "pre mapping", description: "네 stream을 sublayer input 하나로 줄이는 nonnegative vector입니다." },
            { symbol: String.raw`\mathbf H_{\rm res}`, name: "residual mixing", description: "행·열 합이 1인 4×4 doubly-stochastic matrix입니다." },
            { symbol: String.raw`\mathbf H_{\rm post}`, name: "post mapping", description: "Sublayer output을 네 stream에 다시 쓰는 vector입니다." },
          ]}
          assumptions={["Mapping은 token마다 동적으로 계산합니다.", "Sinkhorn normalization과 mapping logits는 보고서상 FP32로 계산합니다.", "Motif의 2→1 annealing은 원 mHC 전체와 구분한 model-specific modification입니다."]}
          interpretation="네 stream은 네 개의 독립 모델이 아닙니다. 같은 layer 안에서 정보가 지나갈 residual width를 늘리고 제약된 mixing으로 update source를 재배치합니다."
        />
        <p className="text-sm leading-7 text-muted-foreground">
          H_res를 doubly-stochastic 행렬로 제한하는 원리 자체와 이 제약이 없을 때 층을 쌓을수록
          신호가 폭발하는 이유는
          <Link className="text-primary hover:underline" to="/ai/hyper-connections-residual-streams"> hyper-connection·mHC 글</Link>이
          정본으로 다룹니다. 이 절은 그 위에 얹은 post multiplier 2→1 annealing만 Motif 3 고유의
          변형으로 소유합니다.
        </p>
      </section>

      <section id="polynorm" className="space-y-6">
        <LessonHeader number="03" eyebrow="Expert specialization" title="Expert-Specific PolyNorm은 expert마다 비선형 response의 모양을 따로 학습한다">
          모든 expert가 같은 SiLU gate를 쓰는 대신 1·2·3차 항을 각각 RMS-normalize하고 expert별 coefficient로 합칩니다. Routing이 만든 서로 다른 token distribution에 activation shape도 적응시키려는 설계입니다.
        </LessonHeader>
        <ExplainedFormula
          question="Expert i는 input z에서 어떤 polynomial activation을 만들까요?"
          idea="각 차수의 magnitude를 RMS로 먼저 나눠 scale 폭주를 줄인 뒤, expert별로 학습한 0–1 coefficient와 제한된 bias를 합칩니다."
          formula={String.raw`\operatorname{PolyNorm}_i(\mathbf z)=\sum_{n=1}^{3}a_{i,n}\frac{\mathbf z^n}{\operatorname{RMS}(\mathbf z^n)}+b_i`}
          annotatedFormula={String.raw`\operatorname{PolyNorm}_i(\mathbf z)=\underbrace{\sum_{n=1}^{3}}_{\text{1·2·3차 basis 누적}}\underbrace{a_{i,n}}_{\text{expert i의 차수별 비중}}\underbrace{\frac{\mathbf z^n}{\operatorname{RMS}(\mathbf z^n)}}_{\substack{\text{각 polynomial 성분을}\text{token hidden 차원에서 정규화}}}+\underbrace{b_i}_{\text{expert별 제한 bias}}`}
          operations={[
            { expression: String.raw`\frac{\mathbf z^n}{\operatorname{RMS}(\mathbf z^n)}`, annotation: ["각 차수의 input scale을 나눠", "polynomial magnitude를 별도로 통제"] },
            { expression: String.raw`a_{i,n}\frac{\mathbf z^n}{\operatorname{RMS}(\mathbf z^n)}`, annotation: ["expert·차수별 coefficient를 곱해", "서로 다른 nonlinear response 생성"] },
            { expression: String.raw`\sum_{n=1}^{3}a_{i,n}\frac{\mathbf z^n}{\operatorname{RMS}(\mathbf z^n)}+b_i`, annotation: ["세 normalized basis와 bias를 합쳐", "expert gate activation 완성"] },
          ]}
          terms={[
            { symbol: "i", name: "expert index", description: "384 routed expert 또는 shared expert의 구분입니다." },
            { symbol: "n", name: "polynomial order", description: "1·2·3차 element-wise basis입니다." },
            { symbol: String.raw`a_{i,n}`, name: "expert coefficient", description: "Sigmoid parameterization으로 0과 1 사이에 둔 차수별 weight입니다." },
            { symbol: String.raw`b_i`, name: "expert bias", description: "−0.5와 0.5 사이로 clip한 expert별 bias입니다." },
          ]}
          assumptions={["RMS는 token별 hidden dimension에서 계산합니다.", "Polynomial coefficient의 차이가 사람이 해석 가능한 domain specialization을 뜻하지 않습니다.", "보고서의 effective-rank 비교는 약 10B controlled model 범위입니다."]}
          interpretation="PolyNorm은 expert마다 activation shape를 다르게 허용하고 outlier를 통제하려는 방법입니다. Motif 3 전체 benchmark가 이 component 하나 때문에 나왔다고 귀속할 수는 없습니다."
        />
      </section>

      <section id="post-training" className="space-y-6">
        <LessonHeader number="04" eyebrow="Capability integration" title="일반 SFT에서 일곱 specialist를 만든 뒤 student rollout의 선택 token probability로 다시 통합한다">
          Motif 3는 여섯 domain teacher를 GRPO로, software-engineering teacher 하나를 SFT로 만듭니다. 마지막 MOPD에서는 general SFT model이 rollout을 만들고 prompt domain의 teacher가 그 rollout의 선택 token에 부여한 log probability를 제공합니다.
        </LessonHeader>
        <TermLesson name="Motif 3 selected-token MOPD" oneLine="Full vocabulary KL 대신 student가 실제 sample한 token 하나에 대한 teacher·old-student log-probability 차이를 token별 distillation signal로 쓰는 multi-teacher OPD 변형입니다." shape="student rollout yₜ → domain teacher log πT(yₜ|hₜ) → ICE-POP weight → student update" example="Agentic prompt는 agent teacher, math prompt는 math teacher로 route하며 environment reward와 reference KL은 MOPD loss에서 제외합니다." boundary="일반 MOPD가 항상 chosen-token scalar만 쓰는 것은 아닙니다. Motif 3 보고서의 구체적 구현 선택입니다." />
        <ExplainedFormula
          question="Motif 3 MOPD는 sampled token 하나에서 어떤 방향의 update를 만들까요?"
          idea="Teacher가 old student보다 sampled token을 더 지지하면 positive signal, 덜 지지하면 negative signal을 만들고, generation·old policy mismatch가 허용 범위인 token만 사용합니다."
          formula={String.raw`d_t=\operatorname{sg}\!\left[\log\frac{\pi_{T(x)}(y_t\mid h_t)}{\pi_{\rm old}(y_t\mid h_t)}\right],\quad \mathcal L_{\rm MOPD}=-\mathbb E_t[\widetilde w_t d_t\log\pi_\theta(y_t\mid h_t)]`}
          annotatedFormula={String.raw`d_t=\underbrace{\operatorname{sg}\!\left[\log\frac{\pi_{T(x)}(y_t\mid h_t)}{\pi_{\rm old}(y_t\mid h_t)}\right]}_{\substack{\text{선택 token을 teacher가 old student보다}\text{얼마나 더 지지하는지 고정 signal로 계산}}},\quad \mathcal L=-\underbrace{\mathbb E_t[\widetilde w_t d_t\log\pi_\theta(y_t\mid h_t)]}_{\substack{\text{허용 token만 importance-weight해}\text{현재 student log probability를 update}}}`}
          operations={[
            { expression: String.raw`\log\frac{\pi_{T(x)}(y_t\mid h_t)}{\pi_{\rm old}(y_t\mid h_t)}`, annotation: ["같은 sampled token의 teacher·old 지지를 비교해", "token별 distillation 방향 생성"] },
            { expression: String.raw`\operatorname{sg}[\cdot]`, annotation: ["teacher signal 경로를 detach해", "현재 student parameter만 update"] },
            { expression: String.raw`\widetilde w_t d_t\log\pi_\theta(y_t\mid h_t)`, annotation: ["policy mismatch filter와 teacher 방향을 곱해", "sampled token의 update 기여 결정"] },
          ]}
          terms={[
            { symbol: String.raw`T(x)`, name: "routed teacher", description: "Prompt x의 domain에 배정한 specialist입니다." },
            { symbol: String.raw`\pi_{\rm old}`, name: "old student", description: "현재 update 직전 student policy입니다." },
            { symbol: String.raw`\widetilde w_t`, name: "ICE-POP filtered weight", description: "보고서에서는 0.5–5.0 밖의 importance ratio token을 0으로 버립니다." },
            { symbol: String.raw`h_t`, name: "student prefix", description: "Prompt와 t 이전까지 student가 생성한 token입니다." },
          ]}
          assumptions={["Teacher routing과 tokenizer가 고정돼 있습니다.", "Motif 3는 full-vocabulary distribution을 계산할 수 있지만 이 run에서는 사용하지 않았습니다.", "Environment reward와 reference-policy KL은 이 MOPD objective에 들어가지 않습니다."]}
          interpretation="RL의 terminal reward와 달리 teacher가 sampled token마다 방향을 줍니다. 다만 vocabulary 전체 KL보다 훨씬 적은 teacher 정보만 사용하며 long-horizon credit assignment를 자동 해결하지 않습니다."
        />
        <p className="text-sm leading-7 text-muted-foreground">
          OPD의 일반 state-distribution mismatch와 full-vocabulary objective는 <Link className="text-primary hover:underline" to="/ai/on-policy-distillation">On-Policy Distillation 글</Link>, RL teacher의 GRPO·verifier 조건은 <Link className="text-primary hover:underline" to="/ai/open-r1">Open-R1 글</Link>에서 이어집니다.
        </p>
      </section>

      <section id="evidence" className="space-y-6">
        <LessonHeader number="05" eyebrow="근거의 강도" title="공개 config, 10B component 비교, 314B 통합 모델의 benchmark를 세 층으로 나눈다">
          GDLA가 loss 3.2에 도달할 때 MLA보다 9.2% 적은 token을 사용했다는 결과와 PolyNorm effective-rank 비교는 약 10B controlled model에서 측정됐습니다. 314B Motif 3의 benchmark는 architecture·12.5T pretraining·system optimization·post-training을 모두 포함합니다.
        </LessonHeader>
        <div id="paper-motif3" className="scroll-mt-24"><CitationBlock source="Motif 3: Technical Report" citeKey={1} href="https://arxiv.org/abs/2608.09119"><EvidenceGrid problem="Sparse expert capacity와 KV 효율·attention selectivity·deep optimization·capability integration을 함께 확장" contribution="314B-A13.2B MoE, GDLA, modified mHC, PolyNorm, MTP와 MOPD 통합" assumptions="v1 model·data·training system·sampling·benchmark protocol" scope="공개 configuration, 약 10B diagnostics, full-model report와 evaluation" notClaim="GDLA·PolyNorm·mHC 각각의 314B 독립 기여나 모든 hardware의 우위" /></CitationBlock></div>
        <div id="paper-gda" className="scroll-mt-24"><CitationBlock source="Grouped Differential Attention" citeKey={2} href="https://arxiv.org/abs/2510.06949"><EvidenceGrid problem="대칭 Differential Attention이 signal과 noise에 같은 head capacity를 할당" contribution="Signal head를 더 많이 두고 noise output을 controlled repetition하는 GDA" assumptions="논문의 model scale·head ratio·pretraining/continual-training 조건" scope="GDA formulation과 보고된 generalization·stability comparison" notClaim="Noise head가 실제 irrelevant token을 식별한다는 해석" /></CitationBlock></div>
        <div id="paper-mhc" className="scroll-mt-24"><CitationBlock source="mHC: Manifold-Constrained Hyper-Connections" citeKey={3} href="https://arxiv.org/abs/2512.24880"><EvidenceGrid problem="Unconstrained hyper-connections의 identity mapping 손실과 training instability" contribution="Residual mixing을 manifold에 투영하고 efficient implementation 제안" assumptions="원 mHC paper의 architecture·scale·infrastructure" scope="원 mHC mechanism과 공개 scaling experiment" notClaim="Motif의 post scale 2→1 annealing까지 원 논문이 제안했다는 주장" /></CitationBlock></div>
        <div className="not-prose rounded-lg border border-border p-5 text-sm leading-7 text-muted-foreground">
          <p><strong className="text-foreground">Artifact 경계:</strong> 정식 <a className="text-primary hover:underline" href="https://huggingface.co/Motif-Technologies/Motif-3" target="_blank" rel="noreferrer">Motif-3 model card</a>는 현재 MIT checkpoint·MTP deployment를, <a className="text-primary hover:underline" href="https://github.com/MotifTechnologies/motif3-training-example" target="_blank" rel="noreferrer">training example</a>은 B200 4×8 GPU용 train-only framework를 공개합니다. Base checkpoint에서 MTP head가 빠졌다는 설명과 instruction checkpoint의 built-in MTP를 섞지 않습니다.</p>
        </div>
        <ContentBoundary article="motif-3-architecture" />
      </section>
    </article>
  );
}
