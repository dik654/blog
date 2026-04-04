export const FFT_CODE = `// NTT(Number Theoretic Transform) 최적화
// 유한체 위 FFT — 부동소수점 오차 없는 정확한 연산

template<typename FieldT>
class OptimizedNTT {
  vector<FieldT> roots;       // 미리 계산된 단위근
  vector<FieldT> inv_roots;   // 역 단위근

  void ntt(vector<FieldT>& a, bool invert) {
    bit_reverse(a);            // 비트 역순 정렬
    // Cooley-Tukey FFT
    for (size_t len = 2; len <= n; len <<= 1) {
      for (size_t i = 0; i < n; i += len) {
        for (size_t j = 0; j < len/2; j++) {
          FieldT w = roots[len/2 + j];
          FieldT u = a[i+j];
          FieldT v = a[i+j+len/2] * w;
          a[i+j] = u + v;       // 버터플라이
          a[i+j+len/2] = u - v;
        }}}
    if (invert) { /* n^{-1} 스케일링 */ }
  }
};`;

export const OPT_CODE = `// libiop 핵심 최적화 기법

// 1. 배치 역원 계산 (Montgomery Trick)
//    n개 역원을 곱셈 3(n-1)회로 처리
batch_inversion(vector<FieldT>& values);

// 2. 코셋 FFT (Coset FFT)
//    g * H 위에서 평가 → vanishing poly 소거
coset_fft(poly, generator, domain);

// 3. 지연 머클 트리 (Lazy Merkle Tree)
//    필요한 경로만 계산 → 메모리 절약
class LazyMerkleTree {
  hash_t get_root() {
    if (!computed) compute_root_lazy();
    return root;
  }
};

// 4. SIMD 병렬 해싱 (Blake2b)
parallel_hash(values);  // 벡터화된 해싱`;
