import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import AttentionPipelineViz from "./viz/AttentionPipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Attention은 필요한 정보를 그때그때 다시 고르는 방법이다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          초기 Seq2Seq 모델은 입력 문장 전체를 마지막 hidden state 하나에 담아
          decoder로 넘겼다. 짧은 문장에서는 잘 작동했지만, 입력이 길어질수록
          하나의 고정 길이 vector가 보존해야 할 정보가 많아졌다. Attention은 이
          병목을 없애기 위해 출력 token을 만들 때마다 입력의 어느 위치를 참고할지
          다시 계산한다.
        </p>
        <p>
          출발점은 “attention이 중요한 곳을 본다”는 비유가 아니라, query마다
          source memory를 다시 읽는 <strong>differentiable lookup</strong>이다. 주소를
          key로 비교하고, softmax weight로 value를 섞기 때문에 hard index를 고르지
          않아도 전체 경로를 end-to-end로 학습할 수 있다.
        </p>
        <p>
          이 글은 Seq2Seq의 구현을 반복하지 않고, attention에 공통으로 남는
          <strong> score → weight → aggregate</strong> 구조와 score 함수의 변화를
          설명한다. Encoder–decoder의 기본 흐름이 낯설다면 먼저{" "}
          <Link to="/ai/seq2seq">Seq2Seq 글</Link>을 읽는 편이 자연스럽다.
        </p>
      </div>

      <AttentionPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>모든 attention이 공유하는 세 단계</h3>
        <p>
          먼저 query와 각 key가 얼마나 관련 있는지 score를 계산한다. 그 score를
          softmax로 정규화하면 합이 1인 weight가 되고, 마지막으로 같은 위치의
          value를 가중합해 현재 query에 필요한 context를 만든다. 여기서 query는
          “무엇을 찾는가”, key는 “각 위치가 어떤 정보를 대표하는가”, value는
          “선택했을 때 실제로 가져올 정보”라고 이해하면 된다.
        </p>
      </div>

      <ExplainedFormula
        question="현재 query가 여러 memory slot 중 필요한 정보를 differentiable하게 읽으려면?"
        idea={<>각 key와의 score를 같은 query 안에서 softmax로 비교한 뒤, 그 probability로 value를 평균냅니다. hard argmax 대신 weighted sum을 쓰므로 score가 모든 후보 경로에서 gradient를 받습니다.</>}
        formula={String.raw`\begin{aligned}e_{ti}&=\operatorname{score}(q_t,k_i)\\[2pt]\alpha_{ti}&=\frac{\exp e_{ti}}{\sum_j\exp e_{tj}}\\[2pt]c_t&=\sum_i\alpha_{ti}v_i\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}e_{ti}&=\underbrace{\operatorname{score}(q_t,k_i)}_{\text{query 계산}}\\[2pt]\alpha_{ti}&=\underbrace{\frac{\exp e_{ti}}{\sum_j\exp e_{tj}}}_{\text{기준량당 비율}}\\[2pt]c_t&=\underbrace{\sum_i\alpha_{ti}v_i}_{\text{attention weight 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`\operatorname{score}(q_t,k_i)`, annotation: ["query이(가) 식의 결과에 기여하는 방식을 계산합니다.","각 key와의 score를 같은 query 안에서","softmax로 비교한 뒤, 그 probability로","value를 평균냅니다."] },
          { expression: String.raw`\frac{\exp e_{ti}}{\sum_j\exp e_{tj}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 key와의 score를 같은 query 안에서","softmax로 비교한 뒤, 그 probability로","value를 평균냅니다."] },
          { expression: String.raw`\sum_i\alpha_{ti}v_i`, annotation: ["attention weight이(가) 식의 결과에 기여하는","방식을 계산합니다.","각 key와의 score를 같은 query 안에서","softmax로 비교한 뒤, 그 probability로"] },
        ]}
        terms={[
          { symbol: "q_t", name: "query", description: "출력 시점 t가 현재 찾는 조건입니다." },
          { symbol: "k_i", name: "key", description: "source i번째 slot을 query와 비교할 주소 representation입니다." },
          { symbol: "v_i", name: "value", description: "해당 slot을 선택했을 때 실제로 가져오는 content입니다." },
          { symbol: "\\alpha_{ti}", name: "attention weight", description: "고정된 t에서 i축으로 합이 1인 nonnegative weight입니다." },
        ]}
        assumptions={["softmax가 적용되는 축은 source/key position i입니다.", "mask가 있으면 softmax 전에 허용하지 않는 score에 −∞를 더합니다."]}
        interpretation="attention은 score·normalize·aggregate 세 단계입니다. Weight는 value를 섞는 coefficient이지, 그 자체가 모델의 완전한 인과 설명은 아닙니다."
      />

      <ExplainedFormula
        question="Score 두 개가 log 2와 0일 때 실제 weight와 context vector는 어떻게 계산될까?"
        idea={<>Softmax는 score를 양수로 바꾼 뒤 같은 query row의 합으로 나눕니다. 따라서 exp(log 2):exp(0)=2:1이고, value 두 개를 그 비율로 섞습니다.</>}
        formula={String.raw`\begin{aligned}e&=(\log 2,0)\\\alpha&=\left(\frac23,\frac13\right)\\v_1&=(3,0),\quad v_2=(0,6)\\c&=\frac23v_1+\frac13v_2=(2,2)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}e&=\underbrace{(\log 2,0)}_{\text{로그 비용 변환}}\\\alpha&=\underbrace{\left(\frac23,\frac13\right)}_{\text{허용 경계 판정}}\\v_1&=\underbrace{(3,0),\quad v_2=(0,6)}_{\text{오른쪽 항으로 결과 계산}}\\c&=\frac23v_1+\frac13v_2=(2,2)\end{aligned}`}
        operations={[
          { expression: String.raw`(\log 2,0)`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Softmax는 score를 양수로 바꾼 뒤 같은 query","row의 합으로 나눕니다."] },
          { expression: String.raw`\left(\frac23,\frac13\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Softmax는 score를 양수로 바꾼 뒤 같은 query","row의 합으로 나눕니다."] },
          { expression: String.raw`(3,0),\quad v_2=(0,6)`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Softmax는 score를 양수로 바꾼 뒤 같은 query","row의 합으로 나눕니다."] },
        ]}
        terms={[
          { symbol: "e", name: "score row", description: "Query 하나와 key 두 개의 정규화 전 compatibility입니다." },
          { symbol: "\\alpha", name: "softmax weights", description: "양수이고 합이 1인 두 read coefficient입니다." },
          { symbol: "v_1,v_2", name: "values", description: "Key와 같은 slot에 저장된 실제 content vector입니다." },
          { symbol: "c", name: "context", description: "2v₁/3+v₂/3으로 얻은 query별 weighted sum입니다." },
        ]}
        assumptions={["두 key 모두 mask로 허용됐다고 가정합니다.", "log는 자연로그이며 exp와 서로 역함수입니다."]}
        interpretation="Weight가 더 큰 첫 slot은 context에 더 크게 기여하지만, 둘째 value도 1/3만큼 남습니다. 이것이 hard lookup과 다른 점입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Additive attention과 dot-product attention의 차이는 첫 단계인 score를
          만드는 방식에 있다. Self-attention은 이 틀을 그대로 두되 query, key,
          value를 모두 같은 sequence에서 만든다. 따라서 attention을 특정 모델
          하나의 이름으로 외우기보다, 세 단계로 분해해 보는 편이 이후
          Transformer를 이해하기 쉽다.
        </p>

        <div className="not-prose grid gap-3 sm:grid-cols-3">
          {[
            ["1 · Score", "query와 각 key의 관련도를 계산한다."],
            ["2 · Weight", "softmax로 비교 가능한 weight를 만든다."],
            ["3 · Aggregate", "value의 가중합으로 context를 구성한다."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-lg border border-border/70 bg-card p-4">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>

        <h3>원 논문에서 무엇이 바뀌었는지 따라가기</h3>
        <p>
          <a href="https://arxiv.org/abs/1409.0473" target="_blank" rel="noreferrer">Bahdanau et al.</a>은
          fixed-length encoder bottleneck을 soft alignment로 바꿨고,
          <a href="https://arxiv.org/abs/1508.04025" target="_blank" rel="noreferrer"> Luong et al.</a>은
          dot·general score와 global·local attention을 비교했다. 이후
          <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer"> Transformer 논문</a>은
          scaled dot-product와 multi-head self-attention을 recurrent encoder 밖의
          주된 계산으로 확장했다. 다음 절은 이 세 변화에서 score 함수와 tensor
          source가 각각 어떻게 달라졌는지를 분리해 본다.
        </p>
      </div>
    </section>
  );
}
