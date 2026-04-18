import BackpropDerivViz from './viz/BackpropDerivViz';
import BackpropMathViz from './viz/BackpropMathViz';

export default function BackpropDerivation() {
  return (
    <section id="backprop-derivation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">역전파 수식 전개</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        소프트맥스 + 교차엔트로피를 합쳐 미분하면 놀랍도록 단순해진다.<br />
        dL/dh = y - ŷ (예측 - 정답)
      </p>
      <BackpropDerivViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Softmax + CE 유도 · Jacobian · PyTorch 실전</h3>
        <p>
          조합 유도로 ŷ-y가 나오는 과정, Softmax Jacobian, 실전 패턴까지.
        </p>
      </div>
      <BackpropMathViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 softmax+CE를 같이 쓰는가</p>
          <p>
            <strong>수학적 우아함</strong>: Gradient가 (ŷ - y)로 단순<br />
            <strong>수치 안정성</strong>: logsumexp trick으로 overflow 방지<br />
            <strong>의미적 대칭</strong>: Softmax가 probability로 변환, CE가 그 probability를 평가
          </p>
          <p className="mt-2">
            <strong>대안 조합들</strong>:<br />
            - Sigmoid + BCE: binary classification (같은 원리)<br />
            - Hinge loss: SVM 계열<br />
            - Focal loss: 클래스 불균형 해결<br />
            - Label smoothing: regularization 추가
          </p>
          <p className="mt-2">
            <strong>실무 팁</strong>:<br />
            - 모델 출력은 항상 logits로 (raw scores)<br />
            - Probability 필요 시 추가 softmax 적용<br />
            - Loss function이 softmax 내부 처리<br />
            - 이중 softmax는 실수
          </p>
        </div>

      </div>
    </section>
  );
}
