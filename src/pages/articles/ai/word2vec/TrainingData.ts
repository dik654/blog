export const negSamplingCode = `# 목적 함수 (NEG, k=5로 가정)
J_NEG = log σ(v'_{w_O}ᵀ · v_{w_I})          # positive pair
      + Σ_{i=1}^{k} E[log σ(-v'_{w_i}ᵀ · v_{w_I})]  # k negative pairs

# 노이즈 분포: P(w) ∝ f(w)^(3/4)  (빈도의 3/4 거듭제곱)
# → 빈도가 낮은 단어도 적당히 샘플링
# → 실제 C 구현에서는 1억 크기 테이블 사전 구성 후 랜덤 인덱스

# 업데이트 대상: v_{w_I} (입력 벡터) + v'_{w_O}, v'_{w_i} (출력 벡터)
# → 어휘 전체가 아닌 k+1개의 단어 벡터만 업데이트`;

export const negSamplingAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'positive + negative pair 목적 함수' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: '노이즈 분포 — 빈도의 3/4 거듭제곱' },
];

export const hierarchicalSoftmaxCode = `# 어휘 V=100만, Huffman 트리 깊이 ≈ log2(V) = 20
# → O(V) → O(log V) 로 복잡도 감소

# 각 내부 노드에 벡터 v'_n (파라미터) 보유
# 경로 d1, d2, ..., dL에서 각 노드의 이진 결정:
P(w | w_I) = Π_{j=1}^{L-1} σ([d_j = 1] · v'_{n_j}ᵀ · v_{w_I})

# 자주 쓰는 단어: 경로 짧음 → 더 많은 학습 기회
# 희귀 단어: 경로 길지만 전체 어휘보다는 훨씬 짧음`;

export const hierarchicalAnnotations = [
  { lines: [1, 2] as [number, number], color: 'emerald' as const, note: 'O(V) → O(log V) 복잡도 감소' },
  { lines: [6, 6] as [number, number], color: 'sky' as const, note: '경로별 시그모이드 곱으로 확률 계산' },
];

export const subsamplingCode = `# 단어 w의 학습 건너뜀 확률
P(discard) = 1 - sqrt(t / f(w))

# f(w) = 말뭉치에서 단어 w의 빈도 비율
# t = threshold (보통 1e-5)
# "the", "은/는" 같은 고빈도 단어 → 자주 건너뜀
# 희귀 단어 → 거의 건너뛰지 않음
# → 학습 속도 향상 + 희귀어 품질 개선`;

export const subsamplingAnnotations = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: '서브샘플링 확률 공식' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: '고빈도 단어 스킵 → 학습 효율 개선' },
];

export const cOptimizationCode = `// 1. 시그모이드 사전 계산 테이블 (루프마다 exp() 대신 테이블 조회)
for (int i = 0; i < EXP_TABLE_SIZE; i++) {
    expTable[i] = exp((i / EXP_TABLE_SIZE * 2 - 1) * MAX_EXP);
    expTable[i] = expTable[i] / (expTable[i] + 1); // sigmoid
}

// 2. 128-byte 메모리 정렬 (SIMD 최적화)
posix_memalign((void**)&syn0, 128, vocab_size * layer_size * sizeof(real));

// 3. 멀티스레딩: 코퍼스를 스레드 수로 나눠 병렬 학습
// (Hogwild! 알고리즘 — 락 없는 비동기 SGD)
pthread_create(&pt[a], NULL, TrainModelThread, (void *)a);`;

export const cOptimizationAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: '시그모이드 LUT — exp() 호출 제거' },
  { lines: [7, 8] as [number, number], color: 'emerald' as const, note: 'SIMD 최적화용 메모리 정렬' },
  { lines: [10, 12] as [number, number], color: 'amber' as const, note: 'Hogwild! 비동기 SGD' },
];
