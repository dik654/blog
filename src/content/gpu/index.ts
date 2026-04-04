import type { Category } from '../types';
import { hwArticles } from './articlesHw';

const gpu: Category = {
  slug: 'gpu',
  name: 'HW / GPU',
  description: 'GPU 병렬처리, CUDA, 서버 하드웨어, 스토리지',
  subcategories: [
    {
      slug: 'hw-basics', name: 'Hardware Basics', description: '서버/워크스테이션 부품, 스토리지, 메모리', icon: '🔩',
      children: [
        { slug: 'hw-compute', name: 'Compute', description: 'CPU, GPU, 서버 vs 데스크톱', icon: '⚙️' },
        { slug: 'hw-storage', name: 'Storage', description: 'NVMe, M.2, U.2, SAS, 엔터프라이즈 SSD', icon: '💿' },
        { slug: 'hw-memory', name: 'Memory', description: 'DDR4/DDR5, ECC, RDIMM', icon: '🧠' },
        { slug: 'hw-infra', name: 'Infrastructure', description: '전력, 냉각, 네트워크, 랙마운트', icon: '🏗️' },
      ],
    },
    { slug: 'gpu-fundamentals', name: 'GPU Fundamentals', description: 'SIMT, 메모리 계층, CUDA 기초', icon: '🖥️' },
    { slug: 'zk-acceleration', name: 'ZK Acceleration', description: 'MSM, NTT, 증명 GPU 가속 기법', icon: '⚡' },
  ],
  articles: [
    ...hwArticles,
    {
      slug: 'gpu-architecture', title: 'GPU 아키텍처 기초 (SIMT, 메모리 계층, 워프)', subcategory: 'gpu-fundamentals',
      sections: [{ id: 'overview', title: 'CPU vs GPU & SIMT 모델' }, { id: 'memory-hierarchy', title: '메모리 계층 구조' }, { id: 'warp', title: '워프 스케줄링 & 점유율' }, { id: 'optimization', title: 'GPU 최적화 기법' }],
      component: () => import('@/pages/articles/blockchain/gpu-architecture'),
    },
    {
      slug: 'cuda-basics', title: 'CUDA 기초 (GPU 병렬처리와 블록체인)', subcategory: 'gpu-fundamentals',
      sections: [{ id: 'overview', title: 'CUDA 기초 & 블록체인 활용' }, { id: 'memory-model', title: '메모리 계층 & 최적화' }, { id: 'blockchain-gpu', title: '블록체인 GPU 가속 실전' }],
      component: () => import('@/pages/articles/blockchain/cuda-basics'),
    },
    {
      slug: 'cuda-thread-hierarchy', title: 'CUDA 스레드 계층: 그리드, 블록, 워프, 인덱싱', subcategory: 'gpu-fundamentals',
      sections: [{ id: 'overview', title: '스레드 계층 구조' }, { id: 'builtin-vars', title: '내장 변수와 레이아웃 설정' }, { id: 'indexing-1d', title: '1D 인덱싱' }, { id: 'indexing-2d', title: '2D 인덱싱' }],
      component: () => import('@/pages/articles/gpu/cuda-thread-hierarchy'),
    },
    {
      slug: 'cuda-matrix-multiply', title: 'CUDA 행렬 곱셈: 기초 → 공유메모리 타일링', subcategory: 'gpu-fundamentals',
      sections: [{ id: 'overview', title: '행렬 곱셈과 스레드 매핑' }, { id: 'naive', title: '나이브 구현' }, { id: 'tiled', title: '타일링: 공유 메모리' }, { id: 'performance', title: '성능 비교' }],
      component: () => import('@/pages/articles/gpu/cuda-matrix-multiply'),
    },
    {
      slug: 'cuda-shared-memory', title: 'CUDA 공유 메모리: 뱅크 충돌, Coalescing', subcategory: 'gpu-fundamentals',
      sections: [{ id: 'overview', title: '공유 메모리란?' }, { id: 'bank-conflict', title: '뱅크 충돌' }, { id: 'coalescing', title: 'Coalescing' }, { id: 'aos-soa', title: 'AoS vs SoA' }],
      component: () => import('@/pages/articles/gpu/cuda-shared-memory'),
    },
    {
      slug: 'cuda-sync-streams', title: 'CUDA 동기화 & 스트림', subcategory: 'gpu-fundamentals',
      sections: [{ id: 'overview', title: '동기화 메커니즘' }, { id: 'streams', title: 'CUDA 스트림' }, { id: 'events', title: 'CUDA 이벤트' }, { id: 'multi-gpu', title: '다중 GPU' }],
      component: () => import('@/pages/articles/gpu/cuda-sync-streams'),
    },
    {
      slug: 'gpu-arch-hopper', title: 'Hopper 아키텍처: SM, TMA, Cluster', subcategory: 'gpu-fundamentals',
      sections: [{ id: 'overview', title: 'Hopper vs 이전 세대' }, { id: 'sm-structure', title: 'SM 구조' }, { id: 'tma', title: 'TMA' }, { id: 'cluster', title: 'Thread Block Cluster' }, { id: 'transformer-engine', title: 'Transformer Engine' }],
      component: () => import('@/pages/articles/gpu/gpu-arch-hopper'),
    },
    {
      slug: 'cuda-perf-analysis', title: 'CUDA 성능 분석: 암달 법칙, 점유율', subcategory: 'gpu-fundamentals',
      sections: [{ id: 'overview', title: '병렬 처리 성능 지표' }, { id: 'amdahl', title: '암달의 법칙' }, { id: 'occupancy', title: '점유율' }, { id: 'profiling', title: 'Nsight 프로파일링' }],
      component: () => import('@/pages/articles/gpu/cuda-perf-analysis'),
    },
    {
      slug: 'msm-ntt', title: 'MSM & NTT 이론 (Pippenger, Cooley-Tukey)', subcategory: 'zk-acceleration',
      sections: [{ id: 'overview', title: 'MSM & NTT 개요' }, { id: 'pippenger', title: 'Pippenger MSM' }, { id: 'ntt', title: 'NTT & 나비 연산' }, { id: 'gpu-accel', title: 'GPU 병렬화' }],
      component: () => import('@/pages/articles/blockchain/msm-ntt'),
    },
    {
      slug: 'filecoin-gpu-proofs', title: 'Filecoin 증명 GPU 가속 (bellperson, sppark)', subcategory: 'zk-acceleration',
      sections: [{ id: 'overview', title: '증명 시스템 & GPU 가속 개요' }, { id: 'gpu-acceleration', title: 'GPU 가속 라이브러리' }, { id: 'references', title: '참고 자료' }],
      component: () => import('@/pages/articles/blockchain/filecoin-gpu-proofs'),
    },
    // ── ZK GPU 심화 ──
    {
      slug: 'ec-gpu-ops', title: '타원곡선 GPU 연산: Fp 곱셈, 점 덧셈 CUDA 커널', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: '왜 타원곡선을 GPU에서?' },
        { id: 'fp-montgomery', title: 'Fp Montgomery 곱셈 커널' },
        { id: 'point-ops', title: 'Jacobian 점 덧셈/더블링' },
        { id: 'warp-bigint', title: 'Warp 단위 Bigint 연산' },
      ],
      component: () => import('@/pages/articles/gpu/ec-gpu-ops'),
    },
    {
      slug: 'msm-gpu-impl', title: 'MSM GPU 구현: 버킷 누적과 커널 설계', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: 'Pippenger → GPU 매핑' },
        { id: 'window-partition', title: '윈도우 분할과 스레드 매핑' },
        { id: 'bucket-kernel', title: '버킷 누적 CUDA 커널' },
        { id: 'reduction', title: '버킷 환원: Warp Reduction' },
        { id: 'sppark', title: 'sppark 구현 분석' },
      ],
      component: () => import('@/pages/articles/gpu/msm-gpu-impl'),
    },
    {
      slug: 'ntt-gpu-impl', title: 'NTT GPU 구현: Butterfly 커널과 메모리 전략', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: 'Cooley-Tukey → GPU 매핑' },
        { id: 'butterfly-kernel', title: 'Butterfly CUDA 커널' },
        { id: 'shared-memory', title: '공유메모리 전략 & Bank Conflict' },
        { id: 'bit-reverse', title: '비트 리버스 & Twiddle 전처리' },
      ],
      component: () => import('@/pages/articles/gpu/ntt-gpu-impl'),
    },
    {
      slug: 'gpu-proof-pipeline', title: 'GPU 증명 파이프라인: Groth16/PLONK 전체 흐름', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: '증명 = MSM + NTT의 조합' },
        { id: 'groth16-flow', title: 'Groth16 GPU 파이프라인' },
        { id: 'plonk-flow', title: 'PLONK GPU 파이프라인' },
        { id: 'memory-management', title: 'GPU 메모리 관리 전략' },
      ],
      component: () => import('@/pages/articles/gpu/gpu-proof-pipeline'),
    },
    {
      slug: 'icicle-framework', title: 'ICICLE: ZK GPU 가속 프레임워크', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: 'ICICLE 아키텍처' },
        { id: 'cuda-backend', title: 'CUDA 백엔드 & Curve 추상화' },
        { id: 'bindings', title: 'Rust/Go 바인딩' },
        { id: 'benchmark', title: '벤치마크 & 비교' },
      ],
      component: () => import('@/pages/articles/gpu/icicle-framework'),
    },
    {
      slug: 'poseidon-gpu', title: 'Poseidon 해시 GPU: S-box, MDS 행렬 CUDA 커널', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: 'Poseidon과 GPU 가속' },
        { id: 'sbox-kernel', title: 'S-box 커널: x^5 거듭제곱' },
        { id: 'mds-kernel', title: 'MDS 행렬 곱셈 커널' },
        { id: 'batch-hash', title: '배치 해싱 & Merkle 트리 GPU' },
      ],
      component: () => import('@/pages/articles/gpu/poseidon-gpu'),
    },
    {
      slug: 'poly-ops-gpu', title: '다항식 연산 GPU: coset NTT, 나눗셈, 다점 평가', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: 'NTT 너머의 다항식 연산' },
        { id: 'coset-ntt', title: 'Coset NTT & INTT' },
        { id: 'poly-div', title: '다항식 나눗셈: Vanishing Polynomial' },
        { id: 'multi-eval', title: '다점 평가 (Multi-point Evaluation)' },
      ],
      component: () => import('@/pages/articles/gpu/poly-ops-gpu'),
    },
    {
      slug: 'kzg-gpu', title: 'KZG 커밋먼트 GPU: SRS, MSM 기반 커밋, Batch Opening', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: 'KZG와 GPU의 관계' },
        { id: 'srs-loading', title: 'SRS 로딩 & GPU 메모리' },
        { id: 'commit-msm', title: '커밋 = MSM: 다항식 → 곡선점' },
        { id: 'batch-opening', title: 'Batch Opening 최적화' },
      ],
      component: () => import('@/pages/articles/gpu/kzg-gpu'),
    },
    {
      slug: 'ec-gpu-gen', title: 'ec-gpu-gen: 커브별 CUDA/OpenCL 커널 자동 생성', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: 'ec-gpu-gen이란?' },
        { id: 'codegen', title: '코드 생성: 템플릿 → 커브 전용 커널' },
        { id: 'bellperson-integration', title: 'bellperson 통합 & GPU 디스패치' },
        { id: 'opencl-cuda', title: 'OpenCL vs CUDA 백엔드' },
      ],
      component: () => import('@/pages/articles/gpu/ec-gpu-gen'),
    },
    {
      slug: 'rapidsnark-gpu', title: 'rapidsnark: Groth16 GPU Prover 구현 분석', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: 'rapidsnark 아키텍처' },
        { id: 'witness', title: 'Witness 로딩 & 메모리 매핑' },
        { id: 'proving', title: 'GPU Proving: NTT → MSM 파이프라인' },
        { id: 'optimization', title: '최적화: 메모리 풀, 스트림 겹침' },
      ],
      component: () => import('@/pages/articles/gpu/rapidsnark-gpu'),
    },
    {
      slug: 'gpu-witness-gen', title: 'GPU Witness 생성: R1CS 제약 병렬 풀기', subcategory: 'zk-acceleration',
      sections: [
        { id: 'overview', title: 'Witness 생성이란?' },
        { id: 'r1cs-solve', title: 'R1CS 제약 풀기: 순차 vs 병렬' },
        { id: 'gpu-approach', title: 'GPU 접근법: 의존성 분석 & 레벨 병렬화' },
        { id: 'state-of-art', title: '현황: Scroll, Celer, gnark' },
      ],
      component: () => import('@/pages/articles/gpu/gpu-witness-gen'),
    },
  ],
};

export default gpu;
