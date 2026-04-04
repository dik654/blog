export const GPU_CODE = `// C2 최적화: GPU 가속 Groth16 증명

// Multi-Scalar Multiplication (MSM)
// - 수천 개의 스칼라 곱셈을 GPU에서 병렬 처리
// - 메모리 대역폭 최적화된 접근 패턴

// NTT (Number Theoretic Transform)
// - GPU 병렬성을 활용한 고속 FFT
// - 인플레이스 연산으로 메모리 사용량 최소화

// bellperson 통합
// - cuda-supraseal 기능을 통한 GPU 가속
// - 배치 증명 생성 지원`;

export const HW_CODE = `// 참조 플랫폼 (하드웨어 구성)
CPU:  Threadripper PRO 5995WX (64코어)
RAM:  512GB DDR4
SSD:  16 x Samsung 7.68TB U.2 NVMe
GPU:  Nvidia RTX 4090
HBA:  4 x Supermicro NVMe HBA

// 시스템 최적화
GRUB: "hugepagesz=1G hugepages=36"
FS:   F2FS (플래시 최적화, Lazy Time)

// 디스크 분리 전략
PC1 디스크: SPDK 제어 (읽기 집약적)
PC2 디스크: 파일시스템 (쓰기 집약적)
캐시 디스크: 부모 캐시 전용 (I/O 경합 방지)`;
