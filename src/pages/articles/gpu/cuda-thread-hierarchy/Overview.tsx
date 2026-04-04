import CodePanel from '@/components/ui/code-panel';

const hierarchyCode = `// CUDA 스레드 계층 구조
//
// Grid           ← 커널 1회 호출 = Grid 1개
// ├─ Block (0,0)   Block (1,0)   Block (2,0)
// │   ├─ Warp 0 (Thread 0-31)
// │   ├─ Warp 1 (Thread 32-63)
// │   └─ ...
// └─ Block (0,1)   Block (1,1)   ...
//
// 제약 조건
// - 블록 당 최대 스레드: 1024개
// - 블록 차원 최대: x=1024, y=1024, z=64
// - 그리드 차원 최대: x=2^31-1, y=65535, z=65535
// - 워프 크기: 32 (모든 NVIDIA GPU 공통)`;

const mappingCode = `// 하드웨어 매핑 관계
//
// 소프트웨어 계층     하드웨어 대응
// ─────────────     ──────────
// Grid          →   GPU 전체 (Device)
// Block         →   SM (Streaming Multiprocessor) 1개에 배정
// Warp          →   SM 내 워프 스케줄러가 관리
// Thread        →   CUDA 코어 1개가 실행
//
// 핵심: 같은 Block의 스레드는 반드시 같은 SM에서 실행된다.
//       → 공유 메모리(shared memory) 접근이 가능한 이유.
//       → Block 간에는 공유 메모리를 사용할 수 없다.`;

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
        <CodePanel
          title="CUDA 스레드 계층 구조"
          code={hierarchyCode}
          annotations={[
            { lines: [3, 8], color: 'sky', note: 'Grid > Block > Warp > Thread' },
            { lines: [11, 14], color: 'amber', note: '하드웨어 제약 조건' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">하드웨어 매핑</h3>
        <p>
          소프트웨어 계층은 하드웨어에 직접 대응된다.<br />
          Block은 SM 하나에 통째로 배정되므로, 같은 Block의 스레드끼리만 공유 메모리를 사용할 수 있다.<br />
          Block 간 통신이 필요하면 글로벌 메모리와 동기화를 사용해야 한다.
        </p>
        <CodePanel
          title="소프트웨어 → 하드웨어 매핑"
          code={mappingCode}
          annotations={[
            { lines: [4, 7], color: 'emerald', note: '계층별 하드웨어 대응' },
            { lines: [9, 11], color: 'violet', note: 'Block = SM 단위 배정' },
          ]}
        />
      </div>
    </section>
  );
}
