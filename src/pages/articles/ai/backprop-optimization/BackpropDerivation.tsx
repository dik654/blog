import BackpropDerivViz from './viz/BackpropDerivViz';

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

        <h3 className="text-xl font-semibold mt-6 mb-3">Softmax + Cross-Entropy 조합 유도</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 설정
// h = logit (pre-softmax activation), h ∈ R^C
// ŷ = softmax(h), C = number of classes
// y = one-hot target
// L = cross-entropy loss = -Σ y_i log(ŷ_i)

// Step 1: Softmax 정의
// ŷ_i = exp(h_i) / Σ_j exp(h_j)

// Step 2: log(ŷ_i) 전개
// log(ŷ_i) = h_i - log(Σ_j exp(h_j))

// Step 3: L 전개
// L = -Σ_i y_i · (h_i - log(Σ_j exp(h_j)))
//   = -Σ_i y_i · h_i + log(Σ_j exp(h_j))   (since Σy_i = 1)

// Step 4: dL/dh_k
// 첫째 항: -y_k
// 둘째 항: exp(h_k) / Σ_j exp(h_j) = ŷ_k
//
// ∴ dL/dh_k = ŷ_k - y_k

// 놀라운 단순함!
// Vector form: dL/dh = ŷ - y
// 구현: 단순 element-wise subtraction`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Softmax 단독 Jacobian</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Softmax Jacobian (C x C 행렬)
// J_ij = ∂ŷ_i / ∂h_j

// Case 1: i = j
// ∂ŷ_i/∂h_i
// = [exp(h_i)·S - exp(h_i)^2] / S^2   (S = Σexp(h_k))
// = ŷ_i - ŷ_i^2
// = ŷ_i · (1 - ŷ_i)

// Case 2: i ≠ j
// ∂ŷ_i/∂h_j
// = -exp(h_i)·exp(h_j) / S^2
// = -ŷ_i · ŷ_j

// 정리
// J_softmax = diag(ŷ) - ŷŷ^T

// 전체 미분 (chain rule)
// dL/dh = J_softmax^T · dL/dŷ
//
// cross-entropy와 결합 시
// dL/dŷ = -y/ŷ  (element-wise)
// 대입하면 dL/dh = ŷ - y

// 왜 합쳐서 유도하는가
// - Softmax Jacobian 계산 O(C²)
// - 합쳐서 하면 O(C) (단순 뺄셈)
// - 수치 안정성도 향상`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PyTorch 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// PyTorch는 CrossEntropyLoss가 이미 합쳐진 형태
import torch
import torch.nn as nn

# 잘못된 방법 (수치 불안정)
class BadModel(nn.Module):
    def forward(self, x):
        logits = self.fc(x)
        probs = torch.softmax(logits, dim=-1)  # 분리 계산
        return probs

loss_fn = nn.NLLLoss()  # log 따로
loss = loss_fn(torch.log(probs), target)
# log(softmax(x)) → 수치 불안정 (log of very small number)

# 올바른 방법 (수치 안정)
class GoodModel(nn.Module):
    def forward(self, x):
        return self.fc(x)  # logits만 반환

loss_fn = nn.CrossEntropyLoss()  # 합쳐진 형태
loss = loss_fn(logits, target)

# 내부적으로 log_softmax + nll_loss 결합
# log_softmax는 max-subtraction trick 사용:
#   log(softmax(x)) = x - max(x) - log(sum(exp(x - max(x))))
# → overflow 방지`}</pre>

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
