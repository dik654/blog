export default function MemoryModel() {
  return (
    <section id="memory-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 계층 & 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 메모리 계층</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`GPU 메모리 계층 (속도 순):

┌─────────────────────────────────────────────────────┐
│  Registers (레지스터)           ~1 cycle, per-thread │
│  → 가장 빠름, 각 스레드 전용                          │
├─────────────────────────────────────────────────────┤
│  Shared Memory (공유 메모리)   ~5 cycles, per-block  │
│  → 같은 블록 내 스레드 간 공유                        │
│  → 블록체인: 같은 트랜잭션 그룹의 중간 결과 공유       │
├─────────────────────────────────────────────────────┤
│  L1/L2 Cache                  ~30 cycles             │
│  → 자동 캐싱                                         │
├─────────────────────────────────────────────────────┤
│  Global Memory (전역 메모리)   ~400 cycles            │
│  → 모든 스레드 접근 가능, 하지만 가장 느림             │
│  → 블록체인: 전체 상태 트라이, 트랜잭션 배열           │
├─────────────────────────────────────────────────────┤
│  Host Memory (CPU RAM)        ~10,000+ cycles        │
│  → PCIe 버스를 통한 전송 필요                         │
└─────────────────────────────────────────────────────┘

블록체인 최적화 패턴:
  1. 트랜잭션 데이터를 Global Memory에 한 번에 전송
  2. 각 블록이 Shared Memory에 필요한 데이터 로드
  3. 레지스터에서 해시/서명 연산 수행
  4. 결과를 Global Memory에 기록`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록체인에서의 GPU 활용 사례</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">분야</th>
                <th className="border border-border px-4 py-2 text-left">연산</th>
                <th className="border border-border px-4 py-2 text-left">병렬화 대상</th>
                <th className="border border-border px-4 py-2 text-left">가속 효과</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">PoW 마이닝</td>
                <td className="border border-border px-4 py-2">SHA-256/Ethash</td>
                <td className="border border-border px-4 py-2">nonce 탐색</td>
                <td className="border border-border px-4 py-2">~100x vs CPU</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">ZK 증명</td>
                <td className="border border-border px-4 py-2">MSM, NTT</td>
                <td className="border border-border px-4 py-2">타원곡선 스칼라 곱</td>
                <td className="border border-border px-4 py-2">~10-50x vs CPU</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">서명 검증</td>
                <td className="border border-border px-4 py-2">ECDSA/BLS</td>
                <td className="border border-border px-4 py-2">배치 검증</td>
                <td className="border border-border px-4 py-2">~20x vs CPU</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">Filecoin Sealing</td>
                <td className="border border-border px-4 py-2">Poseidon 해시</td>
                <td className="border border-border px-4 py-2">Merkle 트리 구축</td>
                <td className="border border-border px-4 py-2">~5-10x vs CPU</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
