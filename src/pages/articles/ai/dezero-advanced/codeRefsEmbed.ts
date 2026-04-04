import type { CodeRef } from '@/components/code/types';

export const embedCodeRefs: Record<string, CodeRef> = {
  'embedding-struct': {
    path: 'src/lib.rs — Embedding 레이어',
    lang: 'rust',
    highlight: [1, 20],
    desc: 'Embedding: 정수 ID → 밀집 벡터 룩업.\nXavier 초기화된 (vocab_size, embed_dim) 테이블.',
    code: `pub struct Embedding {
    w: Variable,  // (vocab_size, embed_dim) 가중치 행렬
}

impl Embedding {
    pub fn new(vocab_size: usize, embed_dim: usize, seed: u64) -> Self {
        let scale = (1.0 / embed_dim as f64).sqrt(); // Xavier
        let w_data: Vec<f64> = (0..vocab_size * embed_dim)
            .map(|_| {
                // LCG + Box-Muller → normal * scale
                normal * scale
            }).collect();
        Embedding {
            w: Variable::new(ArrayD::from_shape_vec(
                IxDyn(&[vocab_size, embed_dim]), w_data
            ).unwrap()),
        }
    }

    pub fn forward(&self, idx: &Variable) -> Variable {
        embedding(&self.w, idx)  // W[idx] 룩업
    }
}`,
    annotations: [
      { lines: [2, 2], color: 'sky', note: 'one-hot @ W와 동일하지만 실제 one-hot을 만들지 않아 메모리 효율적' },
      { lines: [7, 7], color: 'emerald', note: 'Xavier: sqrt(1/embed_dim) — 차원이 클수록 초기 가중치를 작게' },
      { lines: [21, 21], color: 'amber', note: 'embedding() 함수가 인덱스 룩업 + backward(scatter-add) 처리' },
    ],
  },
  'embedding-fn': {
    path: 'src/lib.rs — EmbeddingFn (forward + backward)',
    lang: 'rust',
    highlight: [1, 28],
    desc: '룩업 연산의 역전파: scatter-add.\n동일 인덱스에 대한 기울기를 합산.',
    code: `struct EmbeddingFn {
    vocab_size: usize,
    idx_data: Vec<usize>,  // 정수 인덱스 캐시
    input_shape: Vec<usize>,
}

impl Function for EmbeddingFn {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>> {
        let w = &xs[0]; // (vocab_size, embed_dim)
        let indices: Vec<usize> = xs[1].iter()
            .map(|&v| v as usize).collect();
        for &i in &indices {
            out_data.extend(w.slice(s![i, ..]).iter());
        }
        vec![out]
    }

    fn backward(&self, _xs: &[Variable], gys: &[Variable]) -> Vec<Variable> {
        let gy = &gys[0];
        let mut gw = ArrayD::zeros(IxDyn(&[self.vocab_size, embed_dim]));
        for (i, &idx) in self.idx_data.iter().enumerate() {
            let mut target = gw.slice_mut(s![idx, ..]);
            target += &gy_2d.slice(s![i, ..]);  // 동일 인덱스면 합산
        }
        vec![gw_var, gidx_zeros]
    }
}`,
    annotations: [
      { lines: [12, 14], color: 'sky', note: 'forward: W[i]행 복사. O(n*d) — one-hot matmul(O(V*d))보다 효율적' },
      { lines: [21, 24], color: 'emerald', note: 'scatter-add: 동일 인덱스면 기울기를 합산. 정확한 gradient 보장' },
    ],
  },
};
