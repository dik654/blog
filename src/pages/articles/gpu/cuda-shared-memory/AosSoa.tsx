import CodePanel from '@/components/ui/code-panel';

const aosCode = `// AoS (Array of Structures): 구조체 배열
struct Particle {
  float x;    // offset 0
  float y;    // offset 4
  float z;    // offset 8
};
Particle particles[N];

// 메모리 레이아웃:
// [x0 y0 z0] [x1 y1 z1] [x2 y2 z2] ...

// x 좌표만 읽을 때:
// Thread 0 → particles[0].x  (addr 0)
// Thread 1 → particles[1].x  (addr 12)  ← stride = 12B!
// Thread 2 → particles[2].x  (addr 24)
// → 12바이트 간격, non-coalesced (128B 캐시라인에 float 10개만 유효)`;

const soaCode = `// SoA (Structure of Arrays): 배열의 구조체
struct ParticlesSoA {
  float x[N];   // x 좌표 연속 저장
  float y[N];   // y 좌표 연속 저장
  float z[N];   // z 좌표 연속 저장
};
ParticlesSoA particles;

// 메모리 레이아웃:
// [x0 x1 x2 x3 ...] [y0 y1 y2 y3 ...] [z0 z1 z2 z3 ...]

// x 좌표만 읽을 때:
// Thread 0 → particles.x[0]  (addr 0)
// Thread 1 → particles.x[1]  (addr 4)   ← stride = 4B!
// Thread 2 → particles.x[2]  (addr 8)
// → 4바이트 간격, coalesced (128B 캐시라인에 float 32개 모두 유효)`;

const comparisonCode = `// AoS 커널: x 좌표 업데이트
__global__ void updateAoS(Particle* p, float dt, int N) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i < N) p[i].x += p[i].vx * dt;   // stride=sizeof(Particle)
}                                         // → non-coalesced

// SoA 커널: x 좌표 업데이트
__global__ void updateSoA(float* x, float* vx, float dt, int N) {
  int i = blockIdx.x * blockDim.x + threadIdx.x;
  if (i < N) x[i] += vx[i] * dt;        // stride=4B
}                                         // → coalesced

// 성능 비교 (N=1M, A100 기준):
//   AoS:  ~2.1ms  (대역폭 효율 ~30%)
//   SoA:  ~0.4ms  (대역폭 효율 ~90%)
//   차이: ~5x — coalescing이 핵심 원인

// 실전 가이드:
//   모든 필드를 함께 쓴다 → AoS도 가능 (stride=구조체 크기)
//   일부 필드만 접근한다 → SoA 필수 (대부분의 GPU 워크로드)`;

export default function AosSoa() {
  return (
    <section id="aos-soa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AoS vs SoA: 데이터 레이아웃</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          같은 데이터라도 메모리 배치에 따라 GPU 성능이 <strong>수 배</strong> 차이 난다.<br />
          핵심은 <strong>연속 스레드가 연속 주소를 접근</strong>하도록 설계하는 것이다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">AoS: 구조체 배열</h3>
        <p>
          각 파티클의 모든 필드가 연속 저장된다. 직관적이지만, 특정 필드만 접근할 때 stride가 구조체 크기만큼 벌어진다.
        </p>
        <CodePanel title="AoS 레이아웃과 접근 패턴" code={aosCode}
          annotations={[
            { lines: [2, 8], color: 'sky', note: '구조체 정의와 배열' },
            { lines: [11, 11], color: 'amber', note: '메모리 상 배치' },
            { lines: [14, 17], color: 'rose', note: 'stride=12B, non-coalesced' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">SoA: 배열의 구조체</h3>
        <p>
          같은 필드끼리 연속 저장된다. 특정 필드만 접근할 때 stride가 4바이트(float)여서 완전한 coalescing을 달성한다.
        </p>
        <CodePanel title="SoA 레이아웃과 접근 패턴" code={soaCode}
          annotations={[
            { lines: [2, 7], color: 'sky', note: '배열의 구조체 정의' },
            { lines: [10, 10], color: 'emerald', note: '같은 필드가 연속' },
            { lines: [13, 16], color: 'emerald', note: 'stride=4B, coalesced' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">성능 비교</h3>
        <CodePanel title="AoS vs SoA 커널 성능 비교" code={comparisonCode}
          annotations={[
            { lines: [1, 5], color: 'rose', note: 'AoS: non-coalesced 접근' },
            { lines: [7, 11], color: 'emerald', note: 'SoA: coalesced 접근' },
            { lines: [13, 17], color: 'amber', note: '~5배 성능 차이' },
            { lines: [19, 21], color: 'violet', note: '실전 선택 기준' },
          ]} />
      </div>
    </section>
  );
}
