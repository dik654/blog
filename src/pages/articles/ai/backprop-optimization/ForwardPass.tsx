import CodePanel from '@/components/ui/code-panel';
import ForwardPassViz from './viz/ForwardPassViz';

const matrixCode = `# 입력 데이터: 3개 도시의 경도 (3×1 행렬)
X = np.array([[2.35],    # 파리
              [-3.70],   # 마드리드
              [13.40]])  # 베를린

# 가중치 행렬 W (1×3) — 뉴런 3개, 입력 1개
W1 = np.random.randn(1, 3)  # 랜덤 초기화
b1 = np.zeros((1, 3))       # 바이어스 0 초기화

# 순전파: Z = X × W + b
Z = X.dot(W1) + b1          # (3×1)·(1×3) → (3×3)

# 활성화: A = sigmoid(Z)
A = 1 / (1 + np.exp(-Z))    # element-wise 적용`;

const matrixAnn = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: 'X(3×1) — 3개 예시를 행렬로 한번에 통과' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: 'W(1×3) — 뉴런 3개의 가중치' },
  { lines: [10, 11] as [number, number], color: 'amber' as const, note: 'Z = X·W → (3×3) 행렬곱 한 줄' },
  { lines: [13, 14] as [number, number], color: 'violet' as const, note: 'sigmoid 원소별 적용 → 확률값' },
];

export default function ForwardPass() {
  return (
    <section id="forward-pass" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">순전파: 뉴런의 선형 모델</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        h = m·x + b — 뉴런 하나의 계산은 직선 방정식과 동일.<br />
        행렬 곱 Z = X × W + b로 모든 뉴런의 출력을 동시 계산.
      </p>
      <ForwardPassViz />
      <div className="mt-6">
        <CodePanel title="Python 구현: 행렬 기반 순전파" code={matrixCode}
          lang="python" annotations={matrixAnn} />
      </div>
    </section>
  );
}
