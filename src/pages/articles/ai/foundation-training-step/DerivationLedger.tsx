import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function DerivationLedger() {
  return (
    <section id="derivation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">각 수식은 왜 바로 다음 값을 만들까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          아래 식은 새로운 예제가 아니다. Explorer의 기본 학습률 0.10과 같은 원장을 수식으로 다시 펼친 것이다.
          각 식 아래에서 기호뿐 아니라 왜 그 연산을 선택했는지까지 확인한다.
        </p>
      </div>

      <div className="not-prose mt-8 min-w-0 rounded-md border border-border p-3 sm:p-4">
        <Math display className="my-0 text-xs sm:text-base">
          {String.raw`\begin{gathered}
            \underbrace{z=w^\top x+b}_{\text{feature 합과 기준}}\\[-1pt]
            =0.2(1)-0.1(2)+0.1=0.1\\[5pt]
            \underbrace{p=\sigma(z)\approx0.524979}_{\text{class 1의 확률}}
          \end{gathered}`}
        </Math>
      </div>
      <FormulaNote
        meaning="Dot product는 각 feature와 그 weight의 기여를 곱해 더한다. Bias는 모든 입력이 0일 때도 결정 기준을 옮긴다. Sigmoid는 logit의 크기 순서를 유지하면서 binary class 1의 확률로 읽을 수 있는 범위로 바꾼다."
        symbols={[
          [String.raw`w^\top x`, 'feature별 weight 기여의 합'],
          [String.raw`b`, '입력과 무관한 기준 이동'],
          [String.raw`\sigma(z)`, '실수 logit을 (0,1)로 옮기는 함수'],
        ]}
      />

      <div className="not-prose mt-8 min-w-0 rounded-md border border-border p-3 sm:p-4">
        <Math display className="my-0 text-xs sm:text-base">
          {String.raw`\begin{aligned}\underbrace{\mathcal L=-\log p}_{\text{정답 y=1의 BCE}}&\approx0.644397\\[6pt]\underbrace{\delta=\frac{\partial\mathcal L}{\partial z}=p-y}_{\text{sigmoid와 BCE를 합친 logit 신호}}&\approx-0.475021\end{aligned}`}
        </Math>
      </div>
      <FormulaNote
        meaning="Negative log는 정답에 낮은 확률을 준 경우 비용을 급격히 키우고, 여러 sample의 likelihood 곱을 loss의 합으로 바꾼다. Sigmoid의 derivative와 BCE의 derivative를 연쇄 법칙으로 곱하면 중간 항이 약분되어 p-y가 남는다."
        symbols={[
          [String.raw`-\log p`, '이 비용을 최소화하면 정답 확률 p가 커지는 값'],
          [String.raw`\delta`, 'logit z가 최종 loss에 진 책임'],
          [String.raw`p-y`, '현재 예측에서 원하는 target을 뺀 오차 신호'],
        ]}
      />

      <div className="not-prose mt-8 min-w-0 rounded-md border border-border p-3 sm:p-4">
        <Math display className="my-0 text-xs sm:text-base">
          {String.raw`\begin{gathered}
            \underbrace{\nabla_w\mathcal L=\delta x}_{\text{input만큼 weight 책임}}\\[-1pt]
            =[-0.475021,-0.950042]\\[5pt]
            \underbrace{\nabla_b\mathcal L=\delta=-0.475021}_{\text{bias의 책임}}
          \end{gathered}`}
        </Math>
      </div>
      <FormulaNote
        meaning="Weight 하나는 z에 wᵢxᵢ만큼 기여하므로 local derivative가 xᵢ다. 따라서 같은 delta라도 입력값 2를 본 두 번째 weight가 두 배 큰 gradient를 받는다. Bias는 z에 1배로 더해져 delta를 그대로 받는다."
        symbols={[
          [String.raw`\nabla_w\mathcal L`, '두 weight의 loss 민감도 vector'],
          [String.raw`\delta x`, 'upstream 책임에 각 연결의 input을 곱한 값'],
          [String.raw`\nabla_b\mathcal L`, 'bias의 loss 민감도'],
        ]}
      />

      <div className="not-prose mt-8 min-w-0 rounded-md border border-border p-3 sm:p-4">
        <Math display className="my-0 text-[11px] sm:text-base">
          {String.raw`\begin{aligned}\underbrace{w'=w-0.1\nabla_w\mathcal L}_{\text{gradient 반대 방향으로 SGD 이동}}&=[0.247502,-0.004996]\\[6pt]\underbrace{b'=b-0.1\nabla_b\mathcal L}_{\text{bias도 같은 규칙으로 이동}}&=0.147502\end{aligned}`}
        </Math>
      </div>
      <FormulaNote
        meaning="Gradient는 loss가 가장 빨리 커지는 local 방향이다. 작은 범위의 1차 근사에서는 그 반대 방향으로 이동해야 loss가 줄어든다. 0.1은 gradient 자체가 아니라 실제 이동량을 조절하는 learning rate다."
        symbols={[
          [String.raw`w',b'`, 'update 뒤의 새 parameter snapshot'],
          [String.raw`0.1`, '이번 예제의 learning rate'],
          [String.raw`-\eta\nabla\mathcal L`, 'loss 감소를 기대하는 1차 이동'],
        ]}
      />

      <div className="not-prose mt-8 min-w-0 rounded-md border border-emerald-500/40 bg-emerald-500/[0.045] p-3 sm:p-4">
        <Math display className="my-0 text-[11px] sm:text-base">
          {String.raw`\begin{aligned}\underbrace{z'=w'^\top x+b'}_{\text{새 snapshot으로 재-forward}}&\approx0.385012\\[6pt]\underbrace{p'=\sigma(z')}_{\text{새 양성 확률}}&\approx0.595081\\[6pt]\underbrace{\mathcal L'=-\log p'}_{\text{같은 target으로 재검산}}&\approx0.519057\end{aligned}`}
        </Math>
      </div>
      <FormulaNote
        meaning="Optimizer가 parameter를 바꾼 뒤에는 이전 p나 loss를 재사용하지 않는다. 같은 x와 y를 새 snapshot에 다시 통과시켜야 update의 효과를 비교할 수 있다. 이 예에서는 양성 확률이 올라가고 BCE가 약 0.12534 줄었다."
        symbols={[
          [String.raw`z',p'`, '새 parameter로 다시 계산한 forward 값'],
          [String.raw`\mathcal L'`, '같은 sample과 target에서 다시 계산한 loss'],
          [String.raw`\mathcal L-\mathcal L'`, '한 local step의 개선량이며 일반화 성능은 아님'],
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <h3>다층 신경망에서는 무엇이 더해질까?</h3>
        <p>
          각 layer가 logit 대신 다음 activation을 만들고, backward는 뒤 layer에서 받은 gradient에 현재 layer의 local
          derivative를 곱한다. 계산이 길어질 뿐 세 원칙은 같다. 현재 snapshot으로 forward하고, scalar loss에서 책임을
          거꾸로 나누고, optimizer가 새 snapshot을 만든다.
        </p>
      </div>
    </section>
  );
}
