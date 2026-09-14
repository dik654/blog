import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import ChannelViz from "./viz/ChannelViz";

export default function MemoryChannels() {
  return (
    <section id="memory-channels" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">채널 수가 대역폭과 최대 용량을 함께 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          CPU가 몇 개의 메모리 채널을 갖는지는 두 가지를 동시에 정합니다. 하나는 초당 읽고 쓸 수 있는 양이고,
          다른 하나는 꽂을 수 있는 모듈 수, 곧 최대 용량입니다. 가속기 서버에서 이 두 값은 데이터를 얼마나 빨리
          준비해 줄 수 있는지로 이어집니다.
        </p>

        <p className="leading-7">
          대역폭은 채널 수에 채널당 전송률을 곱해 나옵니다. 12채널 구성은 8채널 구성보다 같은 속도 등급에서
          1.5배의 대역폭을 갖습니다. 학습 데이터를 디스크에서 읽어 전처리하고 가속기로 보내는 경로가 이 값에
          묶여 있으면, 코어를 늘려도 처리량이 오르지 않습니다.
        </p>

        <p className="leading-7">
          용량은 채널 수에 채널당 모듈 수와 모듈 용량을 곱한 값입니다. 여기서 주의할 점은 채널당 모듈을 둘로
          늘리면 전기적 부하가 커져 동작 속도가 내려가는 경우가 있다는 것입니다. 용량을 키우려다 대역폭을 잃는
          교환이 생깁니다.
        </p>
      </div>

      <ChannelViz />

      <TermBreakdown
        title="메모리 사양에서 함께 봐야 하는 값"
        description="하나만 보면 나머지가 제약이 되어 기대한 성능이 안 나옵니다."
        items={[
          {
            term: "채널 수",
            description: "CPU가 동시에 접근하는 메모리 경로의 수입니다. 대역폭과 최대 모듈 수를 함께 정합니다.",
            example: "12채널과 8채널은 같은 속도 등급에서 1.5배 차이입니다.",
            boundary: "채널을 다 채우지 않으면 그만큼 대역폭이 줄어듭니다. 모듈을 대칭으로 꽂아야 합니다.",
          },
          {
            term: "채널당 모듈 수",
            description: "한 채널에 몇 개의 모듈을 꽂을 수 있는지이며 최대 용량을 정합니다.",
            example: "채널당 둘로 늘리면 용량은 두 배가 되지만 동작 속도 등급이 내려갈 수 있습니다.",
            boundary: "전기적 부하 때문에 생기는 제약이라 보드와 모듈 종류에 따라 다릅니다.",
          },
          {
            term: "오류 정정 지원",
            description: "서버와 워크스테이션 계열은 정정 기능이 있는 모듈을 요구하거나 지원합니다.",
            example: "장시간 학습에서 조용한 비트 오류를 잡아 주는 안전장치입니다.",
            boundary: "정정 기능이 있는 모듈은 일반 모듈과 호환되지 않으며 플랫폼이 지원해야 합니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          채널 대역폭 계산과 전기적 부하, 오류 정정의 원리는{" "}
          <Link to="/cs/gpu/hw-memory">메모리</Link>가 소유합니다. 이 절이 더하는 것은 그 값이 가속기 서버에서
          데이터 공급 경로의 상한이 된다는 점과, 제품군 선택이 채널 수를 통해 이 상한을 미리 정한다는 점입니다.
        </p>

        <p className="leading-7">
          실무에서 확인하는 방법은 간단합니다. 학습 중에 가속기 사용률이 낮고 CPU 쪽 대기가 길면 데이터 공급이
          병목입니다. 이때 코어를 늘리는 것보다 채널을 다 채웠는지, 저장장치에서 읽는 경로가 레인을 충분히 받고
          있는지를 먼저 봐야 합니다.
        </p>
      </div>
    </section>
  );
}
