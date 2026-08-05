import MathText from '@/components/ui/math-text';
import M from '@/components/ui/math';
import MultiHeadMergeScene from './viz/MultiHeadMergeScene';
import MultiHeadDetailScene from './viz/MultiHeadDetailScene';

export default function MultiHead() {
  return (
    <MathText id="multi-head">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Multi-Head Attention</h2>
      <p className="leading-7 mb-6">
        attention 하나만 두면 모든 관계를 한 점수표에 담아야 한다<br />
        문법 관계, 같은 대상 지시, 가까운 위치 관계처럼 서로 다른 패턴을 하나의 표로 동시에 잘 잡아내기 어렵다<br />
        여러 attention을 병렬로 두고 각 head가 다른 $W_Q$, $W_K$, $W_V$ 를 학습하게 한다
      </p>
      <MultiHeadMergeScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Head 수식과 구현</h3>
        <p className="leading-7">
          각 head는 작은 차원 d_k=d_model/h 에서 attention을 계산한다.
          작은 결과들을 concat하면 다시 d_model 크기가 된다.
          마지막 $W_O$ 는 head별 결과를 섞어 다음 layer가 읽을 한 표현으로 되돌린다.
        </p>
        <M display>{'\\text{MultiHead} = \\underbrace{\\text{Concat}(\\text{head}_0, \\ldots, \\text{head}_7)}_{8 \\times 64 = 512} \\cdot \\underbrace{W_O}_{(512, 512)}'}</M>
        <M display>{'\\text{head}_i = \\text{Attention}\\!\\left(X\\underbrace{W_Q^i}_{(512,64)},\\; XW_K^i,\\; XW_V^i\\right)'}</M>
      </div>
      <div className="not-prose my-8"><MultiHeadDetailScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Multi-Head는 <strong>병렬 attention</strong>으로 다양한 관계 동시 학습.<br />
          요약 2: 총 파라미터 수는 <strong>single head와 동일</strong> — 차원 분할.<br />
          요약 3: 실무에서는 <strong>h=8~16</strong> 헤드가 표준.
        </p>
      </div>
    </MathText>
  );
}
