import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import MemoryViz from "./viz/MemoryViz";

export default function MemoryAxis() {
  return (
    <section id="memory-axis" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">용량은 올라가느냐를, 대역폭은 얼마나 빠르냐를 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          메모리 축은 두 숫자로 이루어져 있고 각각 다른 질문에 답합니다. 용량은 모델과 그 실행 상태가 카드 한
          장에 들어가느냐를 정하고, 대역폭은 토큰 하나를 뽑는 데 걸리는 시간을 정합니다. 둘을 하나의 "메모리
          성능"으로 합치면 판단이 흐려집니다.
        </p>

        <p className="leading-7">
          용량이 중요한 이유는 들어가지 않으면 나눠야 하기 때문입니다. 나누는 순간 가속기 사이 통신이 생기고,
          그 통신이 다시 링크 축의 문제가 됩니다. 그래서 용량이 큰 쪽은 "나누지 않아도 되는 구간"을 넓혀 주는
          것이고, 이것이 대용량 모델 서빙에서 가장 실질적인 차이가 됩니다.
        </p>

        <p className="leading-7">
          대역폭이 중요한 이유는 자기회귀 생성의 성격 때문입니다. 토큰 하나를 만들 때마다 모델 가중치를 읽어야
          하고, 배치가 작으면 그 읽기 시간이 전체 시간을 지배합니다. 이 구간에서는 연산 성능 숫자가 아무리
          높아도 체감 속도가 바뀌지 않습니다.
        </p>
      </div>

      <ExplainedFormula
        question="대역폭이 생성 속도의 상한을 어떻게 정합니까"
        idea="배치가 작을 때는 토큰마다 가중치를 한 번씩 읽어야 하므로, 읽어야 할 바이트를 대역폭으로 나눈 값이 한 토큰의 하한 시간이 됩니다."
        formula={String.raw`t_{\text{token}} \ge \frac{b\,N_{\text{act}}}{W}`}
        annotatedFormula={String.raw`t_{\text{token}} \ge \frac{\overbrace{b\,N_{\text{act}}}^{\text{읽어야 할 바이트}}}{\underbrace{W}_{\text{메모리 대역폭}}}`}
        operations={[
          {
            expression: String.raw`b\,N_{\text{act}}`,
            annotation: [
              "토큰 하나에 실제로 읽히는 파라미터 수에 dtype 바이트를 곱합니다",
              "dense 모델이면 전체, MoE면 활성 파라미터만 해당합니다",
            ],
          },
          {
            expression: String.raw`\frac{b\,N_{\text{act}}}{W}`,
            annotation: "그 바이트를 대역폭으로 나눈 값이 한 토큰의 하한 시간입니다",
          },
          {
            expression: String.raw`t_{\text{token}} \ge`,
            annotation: "등호가 아니라 부등호입니다. 커널 효율과 KV 읽기, 통신이 더해져 실제는 이보다 큽니다",
          },
        ]}
        terms={[
          { symbol: String.raw`t_{\text{token}}`, name: "토큰당 시간", description: "배치가 작을 때의 생성 속도를 정하는 값입니다." },
          { symbol: String.raw`N_{\text{act}}`, name: "토큰당 활성 파라미터", description: "dense면 전체 파라미터, MoE면 활성 경로만입니다." },
          { symbol: "b", name: "dtype 바이트", description: "가중치 저장 형식이며 양자화하면 줄어듭니다." },
          { symbol: "W", name: "메모리 대역폭", description: "카드의 HBM 대역폭입니다." },
        ]}
        assumptions={[
          "배치가 작아 가중치 읽기가 지배적인 구간을 가정합니다. 배치가 커지면 연산이 지배적이 됩니다.",
          "가중치가 모두 같은 카드의 메모리에 있다고 가정합니다. 나눠 올리면 통신 항이 추가됩니다.",
        ]}
        interpretation="이 식은 하한이므로 '이보다 빠를 수 없다'만 말합니다. 대역폭이 같으면 이 구간의 상한이 같고, 그때 차이를 만드는 것은 용량과 커널 효율입니다."
      />

      <MemoryViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          용량과 대역폭이 독립이라는 사실 자체는 소비자 카드에서도 같습니다. 메모리 칩을 더 큰 밀도로 바꿔도
          버스 폭과 핀 속도가 그대로면 대역폭은 변하지 않습니다. 이 구분은{" "}
          <Link to="/gpu/modded-rtx4090-moe-serving#bandwidth-unchanged">개조 RTX 4090 사례</Link>에서 공식으로
          정리했고, 데이터센터 카드에서도 같은 축이 적용됩니다.
        </p>

        <p className="leading-7">
          그래서 벤더 비교에서 메모리 축을 읽는 방법은 이렇습니다. 내 모델이 한 장에 들어가는지를 용량으로 먼저
          가르고, 들어가는 후보들 사이에서는 대역폭으로 생성 속도의 상한을 비교합니다. 용량이 부족해 나눠야
          하는 후보는 다음 축의 비용을 함께 계산해야 합니다.
        </p>
      </div>
    </section>
  );
}
