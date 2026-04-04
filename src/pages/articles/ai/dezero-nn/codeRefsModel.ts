import type { CodeRef } from '@/components/code/types';

export const modelCodeRefs: Record<string, CodeRef> = {
  'model-trait': {
    path: 'src/lib.rs — Model trait',
    lang: 'rust',
    highlight: [1, 24],
    desc: 'Model trait — 모든 신경망 모델의 공통 인터페이스.\nforward + layers를 구현하면 cleargrads, params, save/load가 자동 제공.',
    code: `pub trait Model {
    /// 순전파 (모델의 네트워크 구조를 정의)
    fn forward(&self, x: &Variable) -> Variable;

    /// 모델이 포함하는 모든 레이어를 반환
    /// Python에서는 __setattr__로 자동 등록하지만
    /// Rust에서는 사용자가 명시적으로 나열
    fn layers(&self) -> Vec<&Linear>;

    /// 모든 레이어의 모든 파라미터 기울기를 초기화
    fn cleargrads(&self) {
        for l in self.layers() {
            l.cleargrads();
        }
    }

    /// 모든 레이어의 모든 파라미터를 반환
    fn params(&self) -> Vec<Variable> {
        self.layers()
            .iter()
            .flat_map(|l| l.params())
            .collect()
    }
}`,
    annotations: [
      { lines: [2, 2], color: 'sky', note: 'forward — 모델 구조를 정의하는 유일한 필수 메서드' },
      { lines: [5, 8], color: 'emerald', note: 'Python은 __setattr__로 자동 등록, Rust는 명시적 나열' },
      { lines: [11, 14], color: 'amber', note: 'cleargrads — 모든 레이어를 순회하며 W, b의 grad 초기화' },
    ],
  },
};
