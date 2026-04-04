import ECODArchViz from './viz/ECODArchViz';
import CodePanel from '@/components/ui/code-panel';

const FORMULA = `# ECOD 이상치 점수 계산 수식

## 1. 경험적 CDF (각 차원 j에 대해)
  F_j(x) = (1/n) * Σ I(X_ij ≤ x)    # I는 지시함수

## 2. 꼬리 확률 → 이상치 점수 변환
  O_left(i,j)  = -log( F_j(x_ij) )         # 좌측 꼬리
  O_right(i,j) = -log( 1 - F_j(x_ij) )     # 우측 꼬리

## 3. Two-tail 결합
  O(i,j) = max( O_left(i,j), O_right(i,j) )

## 4. 최종 이상치 점수 (차원 합산)
  O(i) = Σ_j O(i,j)    # 독립성 가정 하에 합산`;

export default function Algorithm() {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECDF 기반 이상치 점수 계산</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        차원별 ECDF → 꼬리 확률에 -log 변환 → Two-tail max → 합산.<br />
        꼬리 확률 0.01 → 점수 4.6, 0.5 → 점수 0.7. 극단일수록 급증.
      </p>
      <ECODArchViz />
      <div className="mt-6">
        <CodePanel title="ECOD 수학적 정의" code={FORMULA} defaultOpen />
      </div>
    </section>
  );
}
