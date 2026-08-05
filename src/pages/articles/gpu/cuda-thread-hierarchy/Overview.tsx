import HierarchyViz from './viz/HierarchyViz';
import MappingViz from './viz/MappingViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스레드 계층 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CUDA 프로그램은 <strong>Grid &rarr; Block &rarr; Warp &rarr; Thread</strong> 4단계 계층으로 구성된다.<br />
          커널 함수를 한 번 호출하면 Grid 하나가 생성되고, 그 안에 수백~수천 개의 Block이 포함된다.
        </p>
        <p>
          각 Block은 최대 <strong>1024개</strong> 스레드를 담을 수 있다.<br />
          Block 내부의 스레드 32개가 하나의 <strong>Warp</strong>를 이루고, Warp 단위로 명령어가 동시에 실행된다.<br />
          이것이 SIMT(Single Instruction, Multiple Threads) 모델의 핵심이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">계층 구조와 제약</h3>
        <p>
          Block과 Grid는 각각 3차원(x, y, z)으로 구성할 수 있다.
          1D 벡터 연산에는 x축만 사용하고, 2D 이미지 처리에는 x, y축을 모두 활용한다.<br />
          차원 설정에 따라 인덱스 계산 방식이 달라진다.
        </p>
        <HierarchyViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">하드웨어 매핑</h3>
        <p>
          소프트웨어 계층은 하드웨어에 직접 대응된다.<br />
          Block은 SM 하나에 통째로 배정되므로, 같은 Block의 스레드끼리만 공유 메모리를 사용할 수 있다.<br />
          Block 간 통신이 필요하면 글로벌 메모리와 동기화를 사용해야 한다.
        </p>
        <MappingViz />
      </div>
    </section>
  );
}
