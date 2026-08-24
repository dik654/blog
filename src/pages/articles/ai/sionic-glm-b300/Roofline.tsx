import {
  GLM_B300_DERIVED,
  GLM_B300_PROJECT_MEASUREMENTS as M,
  GLM_B300_SOURCE_LINKS,
} from "@/content/sionic-glm-b300";
import ExplainedFormula from "@/components/ui/explained-formula";

const ms = (value: number) => value.toFixed(2);

export default function Roofline() {
  return (
    <section id="roofline" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        먼저 연산량이 아니라 데이터 이동량을 계산한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU 연산이 느린지 메모리 이동이 느린지 구분하려면 두 양을 같은 시간
          단위로 바꿔야 한다. Roofline model은 연산량을 이동한 byte로 나눈
          <strong> arithmetic intensity</strong>를 사용해, peak FLOPS와 memory
          bandwidth 중 어느 쪽이 먼저 상한을 만드는지 보여준다.
        </p>
        <div id="paper-roofline" className="scroll-mt-24">
          <ExplainedFormula
            question="이 kernel의 처리 성능은 연산 장치와 HBM 중 어디에서 막히는가?"
            idea={
              <p>
                계산 1회를 위해 옮겨야 하는 byte가 많으면 bandwidth가, 같은
                byte를 여러 번 재사용해 계산량이 많아지면 peak compute가 먼저
                한계를 만듭니다.
              </p>
            }
            formula={String.raw`\begin{aligned}
I&=\frac{F}{Q}\\
P_{\mathrm{attainable}}&\le\min\!\left(P_{\mathrm{peak}},\ I\,B_{\mathrm{mem}}\right)
\end{aligned}`}
            annotatedFormula={String.raw`\begin{aligned}
I&=\underbrace{\frac{F}{Q}}_{\text{기준량당 비율}}\\
P_{\mathrm{attainable}}&\le\underbrace{\min\!\left(P_{\mathrm{peak}},\ I\,B_{\mathrm{mem}}\right)}_{\text{경계 후보 선택}}
\end{aligned}`}
            operations={[
              { expression: String.raw`\frac{F}{Q}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","계산 1회를 위해 옮겨야 하는 byte가 많으면","bandwidth가, 같은 byte를 여러 번 재사용해","계산량이 많아지면 peak compute가 먼저 한계를"] },
              { expression: String.raw`\min\!\left(P_{\mathrm{peak}},\ I\,B_{\mathrm{mem}}\right)`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","계산 1회를 위해 옮겨야 하는 byte가 많으면","bandwidth가, 같은 byte를 여러 번 재사용해","계산량이 많아지면 peak compute가 먼저 한계를"] },
            ]}
            terms={[
              { symbol: "I", name: "arithmetic intensity", description: "이동한 byte마다 수행한 연산량입니다. 단위는 FLOP/byte입니다." },
              { symbol: "F", name: "연산량", description: "관측 구간의 부동소수점 연산 수이며 단위는 FLOP입니다." },
              { symbol: "Q", name: "memory traffic", description: "같은 구간에서 memory hierarchy를 오간 데이터량이며 단위는 byte입니다." },
              { symbol: "B_{\\mathrm{mem}}", name: "실효 bandwidth", description: "해당 memory path가 지속한 전송률이며 단위는 byte/s입니다." },
              { symbol: "P_{\\mathrm{peak}}", name: "compute 상한", description: "해당 dtype과 shape에서 가능한 연산 성능이며 단위는 FLOP/s입니다." },
            ]}
            assumptions={[
              "F와 Q는 같은 kernel·같은 관측 경계를 사용합니다.",
              "Peak 사양 대신 실제 dtype·shape에서 지속 가능한 bandwidth와 compute도 함께 측정합니다.",
              "Roofline은 성능 상한을 설명하며 실제 latency를 자동으로 예측하지 않습니다.",
            ]}
            interpretation="I가 낮아 I·Bmem이 더 작으면 memory-bound입니다. 이 경우 FLOPS를 더 높이는 것보다 byte 수를 줄이거나 같은 byte를 재사용하는 편이 직접적인 최적화가 됩니다."
          />
        </div>
        <p className="leading-7">
          TP8·batch 1·프로젝트 serving precision에서 rank당 token step의 weight
          traffic을 {M.trafficAssumptionGbPerRank}GB로 추정했다. 이 가정이
          맞다면 HBM streaming만 놓고 본 하한은 다음과 같다.
        </p>
        <ExplainedFormula
          question="rank당 weight traffic과 실효 HBM bandwidth로 한 token step의 최소 시간을 어떻게 검산하는가?"
          idea={
            <p>
              이동해야 할 데이터량을 초당 이동 가능한 데이터량으로 나누면
              HBM 항에 필요한 시간이 됩니다. 다른 kernel·collective·launch
              시간은 여기에 포함되지 않습니다.
            </p>
          }
          formula={String.raw`t_{\mathrm{HBM}}\ge\frac{Q_{\mathrm{rank}}}{B_{\mathrm{eff}}}`}
          annotatedFormula={String.raw`t_{\mathrm{HBM}}\ge\underbrace{\frac{Q_{\mathrm{rank}}}{B_{\mathrm{eff}}}}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\frac{Q_{\mathrm{rank}}}{B_{\mathrm{eff}}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","이동해야 할 데이터량을 초당 이동 가능한 데이터량으로 나누면","HBM 항에 필요한 시간이 됩니다."] },
          ]}
          terms={[
            { symbol: "t_{\\mathrm{HBM}}", name: "HBM 시간 하한", description: "한 rank가 weight를 streaming하는 데 필요한 조건부 시간이며 단위는 초입니다." },
            { symbol: "Q_{\\mathrm{rank}}", name: "rank traffic", description: "Token step당 그 rank가 읽는 weight traffic이며 단위는 byte입니다." },
            { symbol: "B_{\\mathrm{eff}}", name: "실효 HBM bandwidth", description: "그 접근 pattern에서 실제로 지속한 전송률이며 단위는 byte/s입니다." },
          ]}
          assumptions={[
            "TP layout·활성 expert·weight precision이 같아 Qrank 추정이 유효합니다.",
            "GB와 TB는 여기서 decimal 단위로 맞춰 계산합니다.",
            "Weight가 cache에 남는 정도와 다른 traffic의 간섭은 별도로 측정합니다.",
          ]}
          interpretation={`이 글의 가정에서는 6.65GB ÷ 8TB/s = ${ms(GLM_B300_DERIVED.peakFloorMs)}ms이고, 실효 4.8TB/s를 쓰면 ${ms(GLM_B300_DERIVED.practicalFloorMs)}ms입니다. 관측한 ${M.observedForwardMs}ms 전체 forward와 같은 값이 아닙니다.`}
        />
        <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">peak 8 TB/s 가정</p>
            <strong className="mt-2 block text-2xl">
              {ms(GLM_B300_DERIVED.peakFloorMs)} ms
            </strong>
            <p className="mt-2 font-mono text-xs">6.65 GB ÷ 8,000 GB/s</p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">peak의 60% 가정</p>
            <strong className="mt-2 block text-2xl">
              {ms(GLM_B300_DERIVED.practicalFloorMs)} ms
            </strong>
            <p className="mt-2 font-mono text-xs">6.65 GB ÷ 4,800 GB/s</p>
          </div>
        </div>
        <p className="leading-7">
          이는 전체 forward latency의 물리 법칙이 아니라{" "}
          <strong>traffic 추정과 달성 bandwidth에 조건부인 HBM 항</strong>이다.
          collective, attention, routing, launch, sampling, synchronization은
          별도로 더해진다. 프로젝트에서 관측한 {M.observedForwardMs}ms forward를
          “9ms 물리 한계”라고 부르면 안 된다. 비교 대상은 약{" "}
          {ms(GLM_B300_DERIVED.peakFloorMs)}ms의 이상적 HBM 항과 약
          {ms(GLM_B300_DERIVED.practicalFloorMs)}ms의 60% 가정이다.
        </p>
        <p className="rounded-xl border-l-4 border-sky-400 bg-sky-500/5 p-4 text-sm leading-6">
          <strong>측정 전제:</strong> {M.environment.hardware},{" "}
          {M.environment.parallelism}. {M.environment.note}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          원 논문은 이 관계를 architecture별 성능 한계를 빠르게 찾는 visual
          model로 제안했다. 여기서는 그 아이디어를 batch-1 decode의 weight
          streaming 항에 적용했을 뿐, GLM-5.2 전체 forward가 단일 memory
          kernel이라는 뜻은 아니다. {" "}
          <a
            href={GLM_B300_SOURCE_LINKS.roofline.href}
            target="_blank"
            rel="noreferrer"
          >
            Roofline 원 논문
          </a>
        </p>
      </div>
    </section>
  );
}
