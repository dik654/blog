import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const hierarchyCode = `CUDA 스레드 계층 (Hopper 이전 vs 이후):

이전: Thread → Warp → Block ──────────── → Grid
이후: Thread → Warp → Block → Cluster → Grid
                                 ↑
                        같은 GPC 내 블록 그룹
                        분산 공유 메모리 접근 가능`;

const clusterCode = `// Cluster 런치: 컴파일 타임 속성으로 클러스터 크기 지정
__cluster_dims__(2, 1, 1)  // 2개 블록을 하나의 클러스터로
__global__ void matmul_cluster(float* A, float* B, float* C) {
    // 현재 블록의 공유 메모리
    __shared__ float smem_local[TILE_SIZE];

    // 클러스터 내 다른 블록의 공유 메모리 접근
    extern __shared__ float smem_remote[];
    float* neighbor = cluster.map_shared_rank(smem_remote, neighbor_rank);

    // 클러스터 단위 동기화
    cluster.sync();

    // neighbor 데이터를 직접 읽기 (L2 경유 없이)
    float val = neighbor[threadIdx.x];
}`;

const clusterAnnotations = [
  { lines: [1, 2] as [number, number], color: 'sky' as const, note: '클러스터 크기 선언' },
  { lines: [8, 9] as [number, number], color: 'emerald' as const, note: '분산 공유 메모리 매핑' },
  { lines: [11, 12] as [number, number], color: 'amber' as const, note: 'cluster.sync() 배리어' },
];

export default function Cluster() {
  return (
    <section id="cluster" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Thread Block Cluster & 분산 공유 메모리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          기존 CUDA는 Thread, Warp, Block, Grid의 4계층 구조였습니다.<br />
          블록 간 통신은 글로벌 메모리와 <code>__threadfence()</code>에 의존해야 했고, 이는 L2 캐시 경유로 느렸습니다.
        </p>
        <p className="leading-7">
          Hopper는 Block과 Grid 사이에 <strong>Cluster</strong> 계층을 추가했습니다.<br />
          클러스터는 같은 GPC(Graphics Processing Cluster) 내에 배치가 보장되는 블록 그룹입니다.<br />
          최대 <strong>16개 블록</strong>을 하나의 클러스터로 묶을 수 있습니다.
        </p>

        <CodePanel title="스레드 계층 변화" code={hierarchyCode} />

        <CitationBlock source="NVIDIA CUDA C++ Programming Guide -- Thread Block Clusters" citeKey={4} type="paper"
          href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#thread-block-clusters">
          <p className="italic">"A cluster is a group of thread blocks that are guaranteed to be
          concurrently scheduled onto a group of SMs within a GPC."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">분산 공유 메모리 (Distributed Shared Memory)</h3>
        <p className="leading-7">
          클러스터 내 블록들은 서로의 공유 메모리에 직접 접근할 수 있습니다.
          <code>cluster.map_shared_rank()</code>로 이웃 블록의 공유 메모리 포인터를 획득하고,
          <strong>SM 간 네트워크</strong>를 통해 L2를 경유하지 않고 데이터를 읽습니다.<br />
          이는 producer-consumer 패턴과 블록 간 reduction에 특히 유리합니다.
        </p>

        <CodePanel title="Cluster 기반 분산 공유 메모리 접근" code={clusterCode} lang="python"
          annotations={clusterAnnotations} />

        <h3 className="text-xl font-semibold mt-6 mb-3">활용 시나리오</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">패턴</th>
                <th className="border border-border px-4 py-2 text-left">기존 방식</th>
                <th className="border border-border px-4 py-2 text-left">Cluster 방식</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['블록 간 데이터 교환', '글로벌 메모리 + fence', '분산 공유 메모리 직접 접근'],
                ['동기화', 'cooperative_groups (제한적)', 'cluster.sync() 경량 배리어'],
                ['Halo region 로드', '이웃 타일 별도 fetch', '이웃 블록 smem에서 직접 읽기'],
                ['Producer-Consumer', '글로벌 버퍼 + 폴링', '공유 메모리 기반 파이프라인'],
              ].map(([pattern, old, cluster]) => (
                <tr key={pattern}>
                  <td className="border border-border px-4 py-2 font-medium">{pattern}</td>
                  <td className="border border-border px-4 py-2">{old}</td>
                  <td className="border border-border px-4 py-2 font-semibold">{cluster}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
