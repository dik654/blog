import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  ReproducibleMlExecutionLocator,
  ReproducibleMlExecutionReturn,
} from "../shared/ModelDeliveryPathLocator";
import ReproducibleMlExecutionViz from "./ReproducibleMlExecutionViz";

export default function ReproducibleMlExecutionArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <ReproducibleMlExecutionLocator />
        <ReproducibleMlExecutionViz />

        <h2 className="mb-6 text-2xl font-bold">
          1. 승인한 v21을 다른 실행 환경에서도 같은 계약으로 검증합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 <code>run-27</code>이 만든 모델을 변경 불가능한 버전
            <code>v21</code>로 등록하고, 모델 파일·container·설정 digest를
            <code>promotion-84</code>에 고정했습니다. 이제 새 worker에는 그 기록만
            전달합니다. 개발자 노트북의 cache나 설치 상태 없이도 같은 결과를 만들 수
            있는지 확인하는 재현 실행을 <code>repro-31</code>이라고 하겠습니다.
          </p>
          <p>
            재현은 seed 숫자 하나를 복사하는 작업이 아닙니다. 무엇을 같다고 볼지 먼저
            정하고, 입력과 실행 환경을 고정하며, 병렬 난수의 계보를 남긴 뒤, 처음
            달라진 단계를 보고해야 합니다. 결과가 달라졌을 때 원인을 좁힐 수 있어야
            재현 검사가 운영 도구가 됩니다.
          </p>
          <p>
            이 글의 실행 ID, digest, seed, tensor 값과 허용 오차는 과정을 설명하기 위한
            가정입니다. 특정 환경에서 측정한 수치가 아닙니다.
          </p>
        </div>

        <TermBreakdown
          title="한 실행을 끝까지 추적한 뒤 붙이는 네 이름"
          items={[
            {
              term: "동등성 계약",
              description: "두 실행의 결과를 같다고 판정할 검사 대상과 허용 범위를 실행 전에 정합니다.",
              example: "모델 파일은 digest, tensor는 절대·상대 오차, 중요 사용자 구간은 정책 기준으로 검사합니다.",
              boundary: "결과를 본 뒤 허용 범위를 넓히면 재현 결과로 사용할 수 없습니다.",
            },
            {
              term: "실행 증명 묶음",
              description: "데이터·코드·모델·container·설정·명령·하드웨어와 runtime 정보를 한 실행 단위로 묶습니다.",
              example: "promotion-84의 v21 bundle, container d18c…, config 53aa…를 repro-31의 입력으로 사용합니다.",
              boundary: "모델 파일만 같아도 library나 kernel이 달라지면 연산 결과는 달라질 수 있습니다.",
            },
            {
              term: "난수 계보",
              description: "root seed에서 용도와 병렬 좌표별 child seed를 만드는 규칙과 결과를 기록합니다.",
              example: "train·rank·worker·epoch 좌표로 DataLoader worker마다 다른 난수 흐름을 만듭니다.",
              boundary: "Worker 수나 sample 배치 규칙이 바뀌면 같은 root seed도 같은 sample 순서를 보장하지 않습니다.",
            },
            {
              term: "최초 차이",
              description: "두 실행을 단계별로 대조했을 때 처음 불일치한 입력·환경·중간 산출물을 가리킵니다.",
              example: "입력과 환경은 같지만 step 820 logits부터 달라졌다고 보고합니다.",
              boundary: "최종 지표만 비교하면 차이를 만든 위치와 복구 방법을 찾기 어렵습니다.",
            },
          ]}
        />
        <ContentBoundary article="reproducible-ml-execution" />
      </section>

      <section id="equivalence-level" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          2. 파일·tensor·분포·사용자 행동에 서로 다른 같음의 기준을 둡니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 결과에 bitwise equality를 요구하면 하드웨어와 병렬 reduction 순서가
            조금만 달라도 실패합니다. 반대로 평균 점수만 같다고 하면 중요한 사용자
            구간에서 생긴 회귀를 숨길 수 있습니다. 따라서 검사 대상마다 필요한 수준을
            선택합니다. v21 bundle과 fixture는 byte 단위로, 중간 tensor는 수치 오차로,
            여러 seed의 지표는 분포로, 출시 결정은 중요 구간의 행동 기준으로 봅니다.
          </p>
        </div>
        <ExplainedFormula
          question="기준값 100.00과 재실행값 100.08을 절대 오차 0.01, 상대 오차 0.001로 비교하면 통과하나요?"
          idea={
            <p>
              실제 차이는 0.08입니다. 허용 오차는 고정값 0.01과 기준값의 0.1%인 0.10을 더한 0.11이므로 이 원소는 통과합니다.
            </p>
          }
          formula={String.raw`|100.00-100.08|=0.08\le 0.01+0.001|100.00|=0.11`}
          annotatedFormula={String.raw`\begin{aligned}e&=\underbrace{|100.00-100.08|}_{0.08}\\\tau&=\underbrace{0.01}_{\text{절대 허용량}}+\underbrace{0.001\times100.00}_{\text{값의 크기에 비례한 허용량}}=0.11\\Q_{num}&=\underbrace{[e\le\tau]}_{0.08\le0.11}=\mathrm{pass}\end{aligned}`}
          operations={[
            {
              expression: String.raw`|100.00-100.08|`,
              annotation: ["기준값과 재실행값의 차이를 구해", "방향과 무관한 실제 오차 0.08을 계산"],
            },
            {
              expression: String.raw`0.01+0.001\times100.00`,
              annotation: ["고정 허용량과 값의 크기에 비례한 허용량을 더해", "0 근처와 큰 값에 함께 적용할 경계 0.11 생성"],
            },
            {
              expression: String.raw`0.08\le0.11`,
              annotation: ["실제 오차를 사전에 정한 경계와 비교해", "이 원소의 numeric gate를 통과로 판정"],
            },
          ]}
          terms={[
            { symbol: String.raw`e`, name: "실제 오차", description: "같은 위치의 기준값과 재실행값 사이 거리입니다." },
            { symbol: String.raw`\varepsilon_a`, name: "절대 허용 오차", description: "기준값이 0에 가까울 때도 유지되는 고정 허용량입니다." },
            { symbol: String.raw`\varepsilon_r`, name: "상대 허용 오차", description: "기준값의 크기에 비례하는 허용 비율입니다." },
            { symbol: String.raw`Q_{num}`, name: "수치 동등성 판정", description: "검사 대상의 모든 원소가 경계를 통과했는지 나타냅니다." },
          ]}
          assumptions={[
            "Tensor의 shape·dtype·원소 대응 관계가 먼저 같아야 합니다.",
            "허용 오차 0.01과 0.001은 결과를 보기 전에 등록합니다.",
            "NaN·Inf와 중요 구간의 threshold 전환은 별도 실패 규칙으로 처리합니다.",
          ]}
          interpretation="예시의 한 원소는 통과하지만 전체 tensor가 통과했다는 뜻은 아닙니다. 모든 원소와 중요 slice를 검사한 뒤 numeric·behavioral gate를 각각 판정합니다."
        />
      </section>

      <section id="seed-tree" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          3. root seed를 복사하지 않고 병렬 좌표마다 다른 난수 흐름을 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 worker에 24017을 그대로 넣으면 서로 같은 augmentation이나 sampling
            순서를 만들 수 있습니다. <code>train</code>이라는 용도, 실행·rank·worker·epoch
            좌표와 root seed를 모호하지 않게 직렬화한 뒤 hash해 child seed를 만듭니다.
            Hash·encoding 버전과 만들어진 seed 목록도 실행 증명 묶음에 넣습니다.
          </p>
        </div>
        <ExplainedFormula
          question="병렬 worker마다 겹치지 않으면서 다시 계산할 수 있는 child seed는 어떻게 만드나요?"
          idea={<p>Root seed와 난수의 용도·병렬 좌표를 한 tuple로 묶고, 버전이 고정된 hash 함수로 64-bit seed를 파생합니다.</p>}
          formula={String.raw`s_{r,w,e}=H_v(s_0\Vert\texttt{train}\Vert r\Vert w\Vert e)\bmod 2^{64}`}
          annotatedFormula={String.raw`\begin{aligned}b_{r,w,e}&=\underbrace{encode_v(s_0,\texttt{train},r,w,e)}_{\text{root·용도·병렬 좌표를 길이 구분해 직렬화}}\\d_{r,w,e}&=\underbrace{H_v(b_{r,w,e})}_{\text{버전이 고정된 hash로 좌표를 확산}}\\s_{r,w,e}&=\underbrace{d_{r,w,e}\bmod2^{64}}_{\text{PRNG 입력 폭에 맞춘 child seed}}\end{aligned}`}
          operations={[
            { expression: String.raw`encode_v(s_0,\texttt{train},r,w,e)`, annotation: ["root와 역할·병렬 좌표를 길이 구분해 묶어", "서로 다른 tuple이 같은 bytes로 해석되는 충돌 방지"] },
            { expression: String.raw`H_v(b_{r,w,e})`, annotation: ["좌표 bytes를 버전이 고정된 hash에 넣어", "가까운 worker 번호도 다른 seed 공간으로 확산"] },
            { expression: String.raw`\bmod2^{64}`, annotation: ["digest를 64-bit 범위로 줄여", "대상 PRNG가 받을 수 있는 seed로 변환"] },
          ]}
          terms={[
            { symbol: String.raw`s_0`, name: "Root seed", description: "재현 계획 전체가 공유하는 최상위 난수 식별값입니다." },
            { symbol: String.raw`r,w,e`, name: "Rank·worker·epoch", description: "난수 흐름을 구분하는 병렬 실행 좌표입니다." },
            { symbol: String.raw`\texttt{train}`, name: "용도 표식", description: "학습·augmentation·sampling 등 서로 다른 난수 용도를 분리합니다." },
            { symbol: String.raw`s_{r,w,e}`, name: "Child seed", description: "특정 좌표의 generator를 초기화하는 재생 가능한 값입니다." },
          ]}
          assumptions={[
            "Hash 함수와 tuple encoding 버전을 실행 명세에 고정합니다.",
            "Worker 수·sampler topology·resume cursor가 달라지면 exact 재현 주장을 다시 평가합니다.",
            "같은 작업을 재시도할지 새 시도로 셀지 attempt 좌표 정책을 먼저 정합니다.",
          ]}
          interpretation="같은 root seed는 난수 계보의 시작점입니다. 실제 sample 순서를 다시 만들려면 child seed뿐 아니라 worker topology, sampler state와 checkpoint 시점까지 함께 복구해야 합니다."
        />

        <pre className="not-prose my-6 max-w-full overflow-x-auto border border-border bg-muted/20 p-4 text-sm leading-6"><code>{`# 실행 명세에서 고정한 최상위 seed입니다.
root_seed = 24017

# 용도와 병렬 좌표를 길이 구분이 있는 형식으로 직렬화합니다.
coordinate = encode_v1(root_seed, "train", run, rank, worker, epoch)

# 고정한 hash 버전으로 좌표별 digest를 만듭니다.
digest = sha256(coordinate).digest()

# PRNG가 받는 64-bit 범위로 child seed를 줄입니다.
child_seed = int.from_bytes(digest[:8], "big")

# 생성한 좌표와 seed를 실행 증명 묶음에 기록합니다.
seed_manifest.append({"coordinate": coordinate, "seed": child_seed})`}</code></pre>

        <div id="standard-pytorch-reproducibility" className="scroll-mt-24">
          <CitationBlock
            source="PyTorch 2.14 · Reproducibility"
            citeKey={1}
            href="https://docs.pytorch.org/docs/2.14/notes/randomness.html"
          >
            2026-10-26에 확인한 공식 문서는 release·platform·CPU/GPU가 달라지면 같은
            seed만으로 완전한 재현을 보장하지 않는다고 설명합니다. 같은 환경에서는
            난수원을 제어하고 비결정적 알고리즘을 피할 수 있으며, DataLoader worker를
            다시 seed하는 공식 예시도 제공합니다. 결정적 실행은 더 느릴 수 있으므로
            성능과 검증 목적을 구분해야 합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="clean-room" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          4. 빈 worker는 실행 전 차단과 실행 후 최초 차이를 서로 다르게 처리합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 worker가 <code>container 91ef…</code>를 보고했다면 승인 기록의
            <code>d18c…</code>와 다르므로 학습을 시작하지 않습니다. 잘못된 환경에서 나온
            결과를 만든 뒤 비교하는 것보다 worker를 폐기하고 올바른 image로 다시 만드는
            편이 원인 경계를 지킵니다. 입력·환경·명령이 모두 맞으면 그때 실행합니다.
          </p>
          <p>
            실행 뒤에는 입력, 환경, 난수 manifest, 중간 산출물, 최종 tensor, 지표, 중요
            사용자 구간 순서로 대조합니다. 이 예시에서는 앞의 세 단계는 같지만 step 820의
            logits부터 달랐습니다. 보고서는 “재현 실패”가 아니라 최초 차이와 양쪽
            증명값을 남기고, 해당 연산·library·병렬 reduction 범위부터 조사하게 합니다.
          </p>
        </div>

        <div className="not-prose my-7 overflow-x-auto border-y border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-3 py-3">발견 위치</th>
                <th className="px-3 py-3">시스템 동작</th>
                <th className="px-3 py-3">남기는 근거</th>
                <th className="px-3 py-3">다음 조사 위치</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["실행 전 · 입력", "시작 차단", "snapshot·code·bundle digest", "잘못된 URI·권한·retention"],
                ["실행 전 · 환경", "worker 폐기 후 재생성", "container·driver·runtime 증명", "image pin·node image·설치 drift"],
                ["실행 중 · 난수", "해당 시도 중단", "seed tuple·sampler cursor", "worker topology·resume 정책"],
                ["실행 중 · 중간값", "최종 성공 판정 보류", "최초 다른 tensor와 step", "kernel·library·reduction 순서"],
                ["실행 후 · 행동", "출시 기준 실패", "지표·중요 구간별 판정", "threshold·data slice·정책"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-border last:border-b-0">
                  {row.map((cell, index) => (
                    <td key={cell} className={`px-3 py-3 align-top leading-6 ${index === 0 ? "font-bold" : "text-muted-foreground"}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div id="standard-pytorch-deterministic" className="scroll-mt-24">
          <CitationBlock
            source="PyTorch 2.14 · torch.use_deterministic_algorithms"
            citeKey={2}
            href="https://docs.pytorch.org/docs/2.14/generated/torch.use_deterministic_algorithms.html"
          >
            공식 API는 가능한 연산을 결정적 구현으로 바꾸고, 결정적 대안이 없는 연산은
            기본적으로 오류를 내도록 설정할 수 있습니다. 이 설정만으로 입력·환경·난수
            계보가 고정되는 것은 아니며, 모든 release와 hardware에서 bitwise 일치를
            보장하는 기능도 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-ml-reproducibility" className="scroll-mt-24">
          <CitationBlock
            source="Pineau et al. · Improving Reproducibility in Machine Learning Research"
            citeKey={3}
            href="https://jmlr.org/papers/v22/20-303.html"
          >
            이 논문은 같은 코드와 데이터를 이용해 유사한 결과를 얻는 재현성을 연구
            신뢰성의 한 부분으로 다루고, NeurIPS의 checklist·code 제출·reproducibility
            프로그램을 분석합니다. 본문의 다섯 단계나 repro-31 절차 자체를 표준으로
            제시한 논문은 아닙니다.
          </CitationBlock>
        </div>

        <ReproducibleMlExecutionReturn />
      </section>
    </div>
  );
}
