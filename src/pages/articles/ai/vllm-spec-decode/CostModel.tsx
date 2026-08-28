import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import Math from "@/components/ui/math";
import TermBreakdown from "@/components/articles/term-breakdown";

const RATE_TERMS = [
  {
    symbol: "\\alpha",
    name: "Acceptance rate",
    description:
      "한 위치에서 draft token이 수락될 확률의 기댓값입니다. 같은 prefix에서 p와 q가 공유하는 확률 질량과 같습니다.",
  },
  {
    symbol: "D_{LK}(p,q)",
    name: "Divergence",
    description:
      "Leviathan et al.이 정의한 1−Σmin(p,q) 꼴의 거리입니다. 0이면 두 분포가 같고 1이면 support가 겹치지 않습니다.",
  },
  {
    symbol: "K",
    name: "Speculation length",
    description: "한 cycle에 draft가 제안하는 token 수입니다. vLLM의 num_speculative_tokens와 같습니다.",
  },
  {
    symbol: "\\mathbb{E}[Y_K]",
    name: "기대 확정 길이",
    description: "위치별 수락이 i.i.d. α일 때 한 cycle이 확정하는 token 수의 기댓값입니다. correction 또는 bonus 하나를 포함합니다.",
  },
] as const;

const SPEEDUP_TERMS = [
  {
    symbol: "c",
    name: "Cost coefficient",
    description:
      "Draft model 한 step 시간을 target 한 step 시간으로 나눈 값입니다. 논문 실험에서는 보통 0.05 아래였습니다.",
  },
  {
    symbol: "Kc+1",
    name: "Cycle 비용",
    description:
      "Target step 시간을 1로 두었을 때 한 cycle의 비용입니다. Draft K번과 verification pass 한 번을 더합니다.",
  },
  {
    symbol: "S(K)",
    name: "Speculative speedup",
    description: "Target-only 대비 wall-clock 개선 배수의 기댓값입니다. 1보다 커야 이득입니다.",
  },
  {
    symbol: "\\alpha",
    name: "Acceptance rate",
    description: "위 절에서 정의한 위치별 수락 확률입니다.",
  },
] as const;

const ALPHAS = [0.6, 0.8, 0.9] as const;
const KS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const COST = 0.05;

function speedup(alpha: number, k: number, c: number) {
  return (1 - alpha ** (k + 1)) / ((1 - alpha) * (k * c + 1));
}

function SpeedupTable() {
  return (
    <figure className="not-prose my-9 min-w-0 overflow-hidden rounded-lg border border-border/70 bg-background">
      <figcaption className="border-b border-border/60 bg-muted/20 px-4 py-3 sm:px-6">
        <p className="text-xs font-bold text-primary">Speedup 표</p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          α와 K에 따른 S(K), c=0.05 가정
        </p>
      </figcaption>
      <div className="overflow-x-auto px-4 py-4 sm:px-6">
        <table className="w-full min-w-[32rem] border-collapse font-mono text-xs">
          <thead>
            <tr className="text-muted-foreground">
              <th className="py-1 pr-3 text-left font-semibold">α \ K</th>
              {KS.map((k) => (
                <th key={k} className="py-1 px-2 text-right font-semibold">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALPHAS.map((alpha) => {
              const row = KS.map((k) => speedup(alpha, k, COST));
              const best = row.indexOf(maxOf(row));
              return (
                <tr key={alpha} className="border-t border-border/60">
                  <td className="py-1.5 pr-3 font-semibold text-foreground">{alpha.toFixed(1)}</td>
                  {row.map((value, index) => (
                    <td
                      key={KS[index]}
                      className={`py-1.5 px-2 text-right tabular-nums ${
                        index === best ? "font-bold text-primary" : "text-foreground/85"
                      }`}
                    >
                      {value.toFixed(2)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border/60 bg-muted/20 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-6">
        굵은 값이 그 α에서 가장 큰 S입니다. α=0.6은 K=4에서 꺾이고, α=0.9는 K=8까지 계속 오릅니다. Leviathan et al. Table 1은 c=0 가정이라 값이 조금 더 큽니다.
      </div>
    </figure>
  );
}

function maxOf(values: readonly number[]) {
  let max = -Infinity;
  for (const value of values) if (value > max) max = value;
  return max;
}

export default function CostModel() {
  return (
    <section id="cost-model" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Speedup은 α, K, draft 비용 c 세 수로 정해집니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          앞 절의 계약이 지켜진다면 출력 분포는 target과 같습니다. 남는 질문은
          얼마나 빨라지는가이고, 그 답은 세 숫자로 정리됩니다. Draft가 한 위치를
          얼마나 자주 맞히는지(α), 한 번에 몇 개를 제안하는지(K), draft 한 step이
          target 한 step에 비해 얼마나 싼지(c)입니다.
        </p>
        <p className="leading-8">
          이 절은 Leviathan et al. 2023의 분석을 그대로 따릅니다. 위치별 수락이
          서로 독립이고 확률이 같다는 단순화 아래 기대 확정 길이와 speedup이
          닫힌 식으로 나오며, 그 식이 어디서 깨지는지를 마지막 절에서 봅니다.
        </p>

        <h3 id="speculation-length" className="scroll-mt-20">
          Speculation length K는 한 cycle에 미리 쓰는 token 수입니다
        </h3>
        <p className="leading-8">
          K는 draft model이 target 검증 없이 연속으로 뽑는 token 수입니다. 논문은
          이를 γ라고 부르고, vLLM은 <code>num_speculative_tokens</code>로
          받습니다. K가 4이면 draft가 네 token을 쓰고 target이 한 번에 다섯
          위치를 채점하므로, 한 cycle이 확정할 수 있는 최대 길이는 K+1입니다.
        </p>
        <p className="leading-8">
          K는 클수록 좋은 값이 아닙니다. 뒤쪽 위치일수록 앞의 모든 후보가
          맞아야 쓸모가 있어 기대 이득은 빠르게 포화하는데, draft 비용은 K에
          비례해 늘고 verification pass의 계산량도 K+1배로 커집니다. 그래서 K는
          α와 c가 정해진 뒤 speedup 식을 최대로 하는 값으로 고릅니다.
        </p>

        <h3 id="acceptance-rate" className="scroll-mt-20">
          Acceptance rate α는 두 분포가 공유하는 확률 질량입니다
        </h3>
        <p className="leading-8">
          한 위치에서 draft token이 수락될 확률을 q로 평균하면
          <Math>{String.raw`\sum_x \min(p(x),q(x))`}</Math>가 됩니다. 이 값이
          acceptance rate α이며, draft가 얼마나 target을 닮았는지를 0과 1 사이의
          한 숫자로 요약합니다. p와 q가 같으면 1이고 겹치는 token이 없으면
          0입니다.
        </p>
        <p className="leading-8">
          예를 들어 p=(0.7, 0.3), q=(0.4, 0.6)이면 공유 질량은 0.4+0.3=0.7이므로
          α=0.7입니다. 이 값을 모든 위치에 같은 확률로 가정하면 수락 길이는
          최대 K인 기하 분포를 따르고, 기대 확정 길이가 등비 합으로 나옵니다.
        </p>
      </div>

      <ExplainedFormula
        question="Acceptance rate α 하나로 한 cycle의 기대 확정 길이를 쓸 수 있을까요?"
        idea={
          <>
            위치 i까지 모두 수락될 확률이 <Math>{String.raw`\alpha^i`}</Math>라면
            i번째 draft가 확정될 확률도 <Math>{String.raw`\alpha^i`}</Math>입니다.
            여기에 rejection point의 correction 또는 bonus 하나는 항상 확정되므로
            1부터 <Math>{String.raw`\alpha^K`}</Math>까지의 등비 합이 됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
\alpha &= \mathbb{E}_{x\sim q}\!\left[\min\!\left(1,\frac{p(x)}{q(x)}\right)\right]
= \sum_x \min(p(x),q(x)) = 1 - D_{LK}(p,q) \\
\mathbb{E}[Y_K] &= \sum_{i=0}^{K}\alpha^{i} = \frac{1-\alpha^{K+1}}{1-\alpha}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\alpha &= \underbrace{\mathbb{E}_{x\sim q}\!\left[\min\!\left(1,\frac{p(x)}{q(x)}\right)\right]}_{\text{위치별 수락 확률의 평균}}
= \underbrace{\sum_x \min(p(x),q(x))}_{\text{p와 q의 공유 질량}} = 1 - D_{LK}(p,q) \\
\mathbb{E}[Y_K] &= \underbrace{\sum_{i=0}^{K}\alpha^{i}}_{\text{i번째까지 전부 수락될 확률의 합}} = \underbrace{\frac{1-\alpha^{K+1}}{1-\alpha}}_{\text{cap K+1 등비 합}}
\end{aligned}`}
        operations={[
          {
            expression: String.raw`\min\!\left(1,\frac{p(x)}{q(x)}\right)`,
            annotation: ["draft가 x를 제안했을 때", "그 자리에서 x를 받아들일 조건부 확률"],
          },
          {
            expression: String.raw`\sum_x \min(p(x),q(x))`,
            annotation: ["q(x)로 가중해 x 전체를 더하면", "두 분포가 함께 가진 확률 질량"],
          },
          {
            expression: String.raw`\sum_{i=0}^{K}\alpha^{i}`,
            annotation: ["i=0 항은 correction 또는 bonus", "i≥1 항은 i번째 draft까지 전부 수락될 확률"],
          },
          {
            expression: String.raw`\frac{1-\alpha^{K+1}}{1-\alpha}`,
            annotation: ["K+1개 항의 등비 합을 닫힌 식으로", "K→∞이면 1/(1−α)로 수렴"],
          },
        ]}
        terms={RATE_TERMS}
        assumptions={[
          "각 위치의 수락 사건이 서로 독립이고 확률이 같은 α라고 가정합니다. 실제로는 위치·prompt마다 β가 다르므로 α는 그 평균입니다.",
          "Y_K는 correction 또는 bonus token 하나를 포함한 committed length입니다. Draft만 센 A는 E[Y_K]−1입니다.",
          "Greedy(temperature 0)에서는 p와 q가 one-hot이 되어 α는 두 argmax가 일치할 확률이 됩니다.",
        ]}
        interpretation="α=0.8, K=3이면 E[Y]=(1−0.8⁴)/0.2=2.95이고 K를 8로 늘려도 4.33에 그칩니다. 상한 1/(1−α)=5에 가까워질 뿐이므로, K를 키우는 것보다 α를 0.9로 올리는 쪽이 상한을 10으로 두 배 늘립니다."
        title="Acceptance rate와 기대 확정 길이"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          이 등비 합은 앞 절의 <Math>{String.raw`\mathbb{E}[A]=\sum_i \Pr(A\ge i)`}</Math>에
          <Math>{String.raw`\Pr(A\ge i)=\alpha^i`}</Math>를 대입한 것입니다. 독립
          가정을 빼면 tail probability를 직접 재야 하고, 그것이 운영에서
          <Math>{String.raw`\bar A`}</Math>와 <Math>{String.raw`\bar Y`}</Math>를
          따로 기록하는 이유입니다.
        </p>

        <h3 id="speedup-model" className="scroll-mt-20">
          Speedup은 기대 확정 길이를 cycle 비용으로 나눈 값입니다
        </h3>
        <p className="leading-8">
          Target 한 step 시간을 1로 두면 한 cycle은 draft K번에 verification
          pass 한 번을 더한 Kc+1만큼 걸립니다. 같은 시간에 target-only는 Kc+1
          token을 만들고 speculative decoding은 평균 E[Y_K] token을 만들므로,
          두 값의 비가 speedup입니다.
        </p>
        <p className="leading-8">
          여기서 draft overhead는 Kc 항이고 verification overhead는 1 항입니다.
          Verification이 target-only의 한 step과 같은 1로 잡히는 이유는 다음
          절에서 다루는 memory-bound 가정 때문입니다. 그 가정이 깨지면 1 대신
          더 큰 값이 들어가고 speedup은 그만큼 줄어듭니다.
        </p>
      </div>

      <ExplainedFormula
        question="α와 c가 주어졌을 때 speculative decoding은 target-only보다 얼마나 빨라질까요?"
        idea={
          <>
            한 cycle의 기대 산출 <Math>{String.raw`\mathbb{E}[Y_K]`}</Math>를 그
            cycle의 비용 <Math>{String.raw`Kc+1`}</Math>로 나눕니다. 분자는 α가
            좌우하고 분모는 c가 좌우하므로, α가 c보다 크기만 하면 K=1에서 이미
            1보다 큰 값이 나옵니다.
          </>
        }
        formula={String.raw`\begin{aligned}
c &= \frac{t_{\text{draft}}}{t_{\text{target}}} \\
S(K) &= \frac{\mathbb{E}[Y_K]}{Kc+1} = \frac{1-\alpha^{K+1}}{(1-\alpha)(Kc+1)} \\
S(1) &= \frac{1+\alpha}{1+c} > 1 \iff \alpha > c
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
c &= \underbrace{\frac{t_{\text{draft}}}{t_{\text{target}}}}_{\text{draft 한 step의 상대 비용}} \\
S(K) &= \frac{\mathbb{E}[Y_K]}{\underbrace{Kc+1}_{\text{draft K번 + verify 1번}}} = \underbrace{\frac{1-\alpha^{K+1}}{(1-\alpha)(Kc+1)}}_{\text{cycle당 token / cycle당 비용}} \\
S(1) &= \underbrace{\frac{1+\alpha}{1+c}}_{\text{K=1의 하한}} > 1 \iff \alpha > c
\end{aligned}`}
        operations={[
          {
            expression: String.raw`\frac{t_{\text{draft}}}{t_{\text{target}}}`,
            annotation: ["같은 hardware·batch에서 잰 두 step 시간의 비", "model 크기가 아니라 시간으로 정의"],
          },
          {
            expression: String.raw`Kc+1`,
            annotation: ["draft를 K번 순차 실행한 비용 Kc에", "target verification pass 한 번의 1을 더함"],
          },
          {
            expression: String.raw`\frac{1-\alpha^{K+1}}{(1-\alpha)(Kc+1)}`,
            annotation: ["cycle당 기대 확정 token을", "cycle당 비용으로 나눈 wall-clock 개선 배수"],
          },
          {
            expression: String.raw`\frac{1+\alpha}{1+c}`,
            annotation: ["K=1을 대입한 값", "α>c이면 최적 K의 speedup은 이 값 이상"],
          },
        ]}
        terms={SPEEDUP_TERMS}
        assumptions={[
          "Draft K번과 verification 한 번이 직렬로 실행되고, K+1 위치의 verification이 target 한 step과 같은 시간이 든다고 가정합니다.",
          "Scheduler·sampler·KV commit 같은 runtime 비용은 0으로 둡니다. 실측에서는 서빙 손익분기식의 t_R 항으로 따로 넣습니다.",
          "생성이 충분히 길어서 마지막 cycle의 잘림 효과를 무시할 수 있다고 가정합니다.",
        ]}
        interpretation="α=0.8, c=0.05, K=5이면 S=(1−0.8⁶)/(0.2×1.25)=2.95배입니다. 같은 α에서 c가 0.5로 오르면 K=5의 S는 1.05배로 떨어지고, c가 α를 넘으면 어떤 K에서도 이득이 없습니다."
        title="Speculative speedup 모델"
      />

      <SpeedupTable />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          표를 읽으면 두 가지가 보입니다. 첫째, 같은 K에서 α를 0.6에서 0.9로
          올리면 speedup이 두 배 넘게 뛰므로 draft의 품질이 K보다 먼저입니다.
          둘째, α가 낮을수록 최적 K가 작고, K를 그 너머로 늘리면 오히려
          느려집니다. Draft 비용은 계속 쌓이는데 뒤쪽 위치의 기대 이득은
          거의 0이기 때문입니다.
        </p>
        <p className="leading-8">
          논문의 T5-XXL 실험에서는 α가 0.75 근처인 T5-small draft가 γ=7로 3.4배를
          냈고, Chen et al. 2023은 Chinchilla 70B에 4B draft를 붙여 2배에서
          2.5배를 보고했습니다. 둘 다 저자 자기보고이며 batch 1 근처의
          memory-bound 조건에서 잰 값입니다.
        </p>

        <h3 id="not-always-faster" className="scroll-mt-20">
          Memory-bound 가정이 깨지면 verification은 더 이상 공짜가 아닙니다
        </h3>
        <p className="leading-8">
          위 식에서 verification 비용을 1로 둔 근거는 낮은 batch의 target이
          weight read에 묶여 있다는 관찰입니다. 한 token을 처리하든 K+1 token을
          처리하든 읽어야 하는 weight는 같으므로 시간이 거의 같습니다. 이
          가정은 batch가 커지면 무너집니다.
        </p>
        <p className="leading-8">
          Batch B에서 K개를 speculation하면 target이 한 step에 처리하는 유효
          token 수는 B(K+1)입니다. 이 값이 GPU가 compute-bound로 넘어가는
          경계를 지나면 verification 시간이 K에 비례해 늘고, 분모의 1이 K+1에
          가까워지며 speedup은 1 아래로 떨어집니다. vLLM의 dynamic speculative
          decoding이 동시성 구간별로 K를 줄이고 높은 구간에서 0으로 끄는 이유가
          이것입니다.
        </p>
        <p className="leading-8">
          Draft 쪽에서도 같은 일이 생깁니다. c는 시간의 비이므로 draft가
          target과 GPU를 나눠 쓰거나 별도 kernel launch·동기화가 붙으면 model
          크기 비보다 훨씬 커집니다. Corollary대로 α가 c 아래로 내려가면 K를
          어떻게 골라도 이득이 없습니다. 총 연산량은 항상 늘어나므로 전력이나
          throughput이 목표인 서빙에서는 latency 개선과 별개로 판단해야 합니다.
        </p>
      </div>

      <TermBreakdown
        title="Speedup 식이 숨긴 세 가지 overhead"
        description="식의 각 항이 실제 서빙에서 어떤 비용으로 나타나는지 정리합니다."
        items={[
          {
            term: "Draft overhead (Kc)",
            description: "Draft model K step의 직렬 시간입니다. Draft가 클수록, K가 클수록 선형으로 늘어납니다.",
            example: "c=0.05, K=5이면 cycle 비용의 20%가 draft입니다.",
            boundary: "Draft와 target이 같은 GPU를 경쟁하면 c는 model 크기 비보다 커집니다.",
          },
          {
            term: "Verification overhead (1 → K+1)",
            description: "Target이 K+1 위치를 한 pass에 채점하는 시간입니다. Memory-bound에서는 1에 가깝고 compute-bound에서는 K+1로 갑니다.",
            example: "Batch 64에 K=3이면 유효 batch가 256이 되어 verify가 느려질 수 있습니다.",
            boundary: "Attention의 KV read는 위치 수에 비례하므로 긴 context에서는 1보다 큽니다.",
          },
          {
            term: "Runtime overhead (t_R)",
            description: "Rejection 판정·resample·KV commit·CPU-GPU 동기화 같은 식 밖의 비용입니다.",
            example: "동기화 한 번이 target step의 10%라면 K=1에서 S(1)의 분모가 1.15가 됩니다.",
            boundary: "이 항은 측정으로만 얻으며 이론 식이 아니라 서빙 손익분기식에서 다룹니다.",
          },
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          이 세 항을 실측 시간으로 바꿔 넣은 것이 다음 절의{" "}
          <Link to="/ai/vllm-spec-decode#serving-break-even">서빙 손익분기식</Link>
          입니다. Self-speculative·tree·suffix 계열은 같은 식에서 c와 α를 다른
          방식으로 바꾸는 변형이므로 별도 글에서 다룹니다.
        </p>
      </div>
    </section>
  );
}
