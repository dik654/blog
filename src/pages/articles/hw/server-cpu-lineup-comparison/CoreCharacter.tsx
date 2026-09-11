import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import CoreViz from "./viz/CoreViz";

export default function CoreCharacter() {
  return (
    <section id="core-character" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">코어는 개수보다 성격과 배치가 중요합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          최근 서버 CPU는 같은 세대 안에서도 성격이 다른 코어를 내놓습니다. 하나는 단일 스레드 성능을 우선한
          코어이고, 다른 하나는 면적과 전력을 아껴 더 많이 넣은 밀도 우선 코어입니다. 같은 "128코어"라도 어느
          쪽인지에 따라 워크로드 적합성이 갈립니다.
        </p>

        <p className="leading-7">
          가속기 서버에서 CPU가 맡는 일은 대체로 병렬화가 잘 됩니다. 데이터 로딩과 디코딩, 전처리는 코어를
          늘리면 그만큼 나눠집니다. 그래서 밀도 우선 코어가 유리한 구간이 넓습니다. 다만 한 스레드가 오래 붙잡는
          작업이 섞여 있으면 그 부분은 단일 스레드 성능에 묶입니다.
        </p>

        <p className="leading-7">
          그리고 코어 수보다 자주 문제가 되는 것이 배치입니다. 코어와 메모리, 가속기가 물리적으로 어느 쪽에
          붙어 있는지에 따라 같은 작업이 두 배 느려질 수 있습니다. 이 문제는 코어를 더 사는 것으로 해결되지
          않습니다.
        </p>
      </div>

      <CoreViz />

      <h3 id="numa-placement" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        어느 소켓에 붙은 가속기인지가 성능을 바꿉니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          두 소켓 서버에서는 메모리와 확장 슬롯이 소켓마다 나뉩니다. 어떤 가속기는 0번 소켓의 레인에, 다른
          가속기는 1번 소켓의 레인에 붙습니다. 이때 0번 소켓의 메모리에 있는 데이터를 1번 소켓에 붙은 가속기로
          보내면 소켓 사이 링크를 한 번 더 지나갑니다.
        </p>

        <p className="leading-7">
          그래서 데이터 로딩 프로세스를 어느 코어에 묶고 어느 메모리를 쓰게 할지를 지정하는 것이 실제 성능
          차이를 만듭니다. 가속기와 같은 쪽 소켓의 코어와 메모리를 쓰도록 고정하면 소켓 간 이동이 사라집니다.
          이 배치는 소프트웨어 설정이지만, 그 설정이 가능하려면 하드웨어 배치를 먼저 알아야 합니다.
        </p>

        <p className="leading-7">
          단일 소켓 구성은 이 문제가 없습니다. 레인 예산이 충분하다면 단일 소켓이 오히려 단순하고 예측 가능한
          선택이 되는 이유입니다. 소켓을 늘리는 결정은 레인이나 메모리 용량이 모자랄 때 하는 것이지 코어 수를
          늘리려고 하는 것이 아닙니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="코어 수를 늘려도 처리량이 안 오를 때 확인할 것"
          preview="데이터 공급 경로나 배치가 병목이면 코어는 놀고 있습니다. 사용률과 대기 시간을 먼저 봐야 합니다."
        >
          <p className="leading-7">
            첫 번째는 저장장치에서 읽는 경로입니다. 레인이 부족하거나 나눠 쓰는 구성이면 읽기 대역폭이 먼저
            막힙니다. 이때는 코어가 아니라 경로를 고쳐야 합니다.
          </p>
          <p className="leading-7">
            두 번째는 메모리 대역폭입니다. 채널을 다 채우지 않았거나 속도 등급이 내려간 구성이면 전처리가 그
            상한에 묶입니다. 모듈 배치를 대칭으로 맞추는 것만으로 개선되는 경우가 있습니다.
          </p>
          <p className="leading-7">
            세 번째는 배치입니다. 프로세스가 가속기와 다른 소켓에 묶여 있으면 소켓 간 링크를 계속 지나갑니다.
            이 경우 사용률은 높은데 실제 진행이 느린 패턴으로 나타납니다. 여러 장을 묶어 쓰는 구성의 통신 배치
            원리는 <Link to="/ai/parallelism-strategy-and-placement">병렬화 전략과 배치</Link>에서 다룹니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
