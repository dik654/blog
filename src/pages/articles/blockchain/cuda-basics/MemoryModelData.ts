export const memoryHierarchyCode = `GPU 메모리 계층 (속도 순):

+-----------------------------------------------------+
|  Registers (레지스터)           ~1 cycle, per-thread  |
|  -> 가장 빠름, 각 스레드 전용                          |
+-----------------------------------------------------+
|  Shared Memory (공유 메모리)   ~5 cycles, per-block   |
|  -> 같은 블록 내 스레드 간 공유                        |
|  -> 블록체인: 같은 트랜잭션 그룹의 중간 결과 공유       |
+-----------------------------------------------------+
|  L1/L2 Cache                  ~30 cycles              |
|  -> 자동 캐싱                                         |
+-----------------------------------------------------+
|  Global Memory (전역 메모리)   ~400 cycles             |
|  -> 모든 스레드 접근 가능, 하지만 가장 느림             |
|  -> 블록체인: 전체 상태 트라이, 트랜잭션 배열           |
+-----------------------------------------------------+
|  Host Memory (CPU RAM)        ~10,000+ cycles         |
|  -> PCIe 버스를 통한 전송 필요                         |
+-----------------------------------------------------+

블록체인 최적화 패턴:
  1. 트랜잭션 데이터를 Global Memory에 한 번에 전송
  2. 각 블록이 Shared Memory에 필요한 데이터 로드
  3. 레지스터에서 해시/서명 연산 수행
  4. 결과를 Global Memory에 기록

핵심 성능 병목:
  ZK 증명의 경우 메모리 대역폭이 병목
  -> RTX 4090: 1,008 GB/s (Global Memory 대역폭)
  -> NTT/MSM은 32-bit 정수 파이프라인 사용
  -> 데이터 의존성으로 명령 수준 병렬성 제한

Warp (32 스레드 단위):
  하드웨어 수준에서 실제 실행 단위
  -> 같은 warp 내 모든 스레드가 동일 명령 실행 (SIMT)
  -> 분기 발산(branch divergence) -> 경로 직렬화 -> 성능 저하
  -> 블록체인: 모든 스레드가 동일 연산이므로 분기 없음 = 최적`;

export const memoryAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: '레지스터: 가장 빠름 (~1 cycle)' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '공유 메모리: 블록 내 공유' },
  { lines: [14, 17] as [number, number], color: 'amber' as const, note: '전역 메모리: 가장 느림 (~400 cycles)' },
  { lines: [22, 27] as [number, number], color: 'violet' as const, note: '블록체인 최적화 패턴' },
  { lines: [34, 38] as [number, number], color: 'rose' as const, note: 'Warp: SIMT 실행 단위' },
];
