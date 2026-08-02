import M from '@/components/ui/math';

export default function RangeProof({ title }: { title?: string }) {
  return (
    <section id="range-proof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Range Proof — 비밀 값이 [0, 2ⁿ) 안에 있음'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          비밀 금액 <M>{'v \\in \\mathbb{Z}'}</M> 의 Pedersen 커밋 <M>{'V = v \\cdot G + \\gamma \\cdot H'}</M> 가 공개됐을 때,
          <strong><M>{'v \\in [0, 2^n)'}</M> 임을 증명</strong>해야 함 — 그렇지 않으면 음수 금액 송금으로 코인 인플레이션 발생.
          Bulletproofs 는 이를 다음 4단계로 푼다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Step 1 — 비트 분해</h3>
        <p>
          <M>v</M> 를 <M>n</M>-bit 이진 표현 <M>{'\\mathbf{a}_L \\in \\{0, 1\\}^n'}</M> 으로 분해. 정의상:
        </p>
        <M display>{'v = \\langle \\mathbf{a}_L, \\mathbf{2}^n \\rangle, \\quad \\text{where } \\mathbf{2}^n = (1, 2, 4, \\ldots, 2^{n-1})'}</M>
        <p>
          또한 <M>{'\\mathbf{a}_R = \\mathbf{a}_L - \\mathbf{1}'}</M> 로 정의 (각 비트 - 1). 비트 조건은 다음 두 식과 동치:
        </p>
        <ol>
          <li><M>{'\\mathbf{a}_L \\circ \\mathbf{a}_R = \\mathbf{0}'}</M> (Hadamard) — 각 i 에 대해 <M>{'a_{L,i} \\cdot (a_{L,i} - 1) = 0 \\Rightarrow a_{L,i} \\in \\{0, 1\\}'}</M></li>
          <li><M>{'\\mathbf{a}_R - \\mathbf{a}_L + \\mathbf{1} = \\mathbf{0}'}</M> — 정의 자체에서 자명</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">Step 2 — 다항식 동치성으로 결합</h3>
        <p>
          위 두 비트 조건과 분해 식 <M>{'v = \\langle \\mathbf{a}_L, \\mathbf{2}^n \\rangle'}</M> 을 모두 한 번에 검증하기 위해
          Verifier 가 두 개의 도전값 <M>{'y, z \\in \\mathbb{F}'}</M> 을 보낸다. Prover 는 다항식
        </p>
        <M display>{'t(X) = \\langle \\mathbf{l}(X), \\mathbf{r}(X) \\rangle'}</M>
        <p>
          를 구성한다. 여기서 <M>{'\\mathbf{l}(X), \\mathbf{r}(X)'}</M> 는 <M>X</M> 에 대한 1차 벡터 다항식이고,
          그 계수에 비트 조건과 도전값 <M>y, z</M> 가 정교하게 엮여 있어 다음이 성립한다:
        </p>
        <M display>{'\\underbrace{t(X) = t_0 + t_1 X + t_2 X^2}_{\\text{2차 다항식}}, \\quad t_0 = \\underbrace{(z^2 \\cdot v + \\delta(y, z))}_{\\text{공개 입력으로부터 계산 가능}}'}</M>
        <p>
          비트가 모두 0/1 이고 분해가 정확하면 <M>{'t_0'}</M> 가 위 형태가 된다 — 비트가 어긋나면 <M>{'t_0'}</M> 가 달라져 검증 실패.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Step 3 — 평가 + IPA 압축</h3>
        <p>
          Verifier 가 새 도전값 <M>{'x \\in \\mathbb{F}'}</M> 을 보내면, Prover 는:
        </p>
        <ol>
          <li><M>{'\\mathbf{l} = \\mathbf{l}(x), \\; \\mathbf{r} = \\mathbf{r}(x)'}</M> 두 벡터 평가 (길이 <M>n</M>)</li>
          <li><M>{'\\hat{t} = \\langle \\mathbf{l}, \\mathbf{r} \\rangle'}</M> 스칼라 평가</li>
          <li>그리고 이 <M>{'(\\mathbf{l}, \\mathbf{r}, \\hat{t})'}</M> 을 직접 보내는 대신, 앞 절의 <strong>Inner Product Argument</strong> 로
            <M>{'O(\\log n)'}</M> 크기 증명을 만든다.</li>
        </ol>
        <p>
          <M>{'\\hat{t}'}</M> 자체는 다항식 <M>{'t(X)'}</M> 의 <M>X = x</M> 에서의 평가값이므로, Verifier 가 위의 <M>{'t_0, t_1, t_2'}</M> 의
          공개된 커밋과 일치하는지 한 번 확인.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">최종 증명 크기</h3>
        <M display>{'\\underbrace{2 \\log_2 n}_{\\text{IPA (L, R) 점}} + \\underbrace{4}_{\\text{커밋 } A, S, T_1, T_2} + \\underbrace{3}_{\\text{스칼라 } \\tau_x, \\mu, \\hat{t}} + \\underbrace{2}_{\\text{IPA 최종 } a, b}'}</M>
        <p>
          예: <M>{'n = 64'}</M> 면 12 + 4 + 3 + 2 = 21 EC 점/스칼라 ≈ <strong>672 바이트</strong>. 단일 트랜잭션의 range proof 크기 자명한 비교:
          <M>{'n = 64'}</M> bit 비트마다 1 EC 점 (~32B) → naive 2 KB → Bulletproofs 700B → <strong>3 배 절감</strong>.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">집계 (Aggregation)</h3>
        <p>
          <M>m</M> 개의 range proof 를 묶어 단일 증명으로 만들 수 있다. 각 range 의 비트 분해 벡터를 길이 <M>mn</M> 으로 concat 하고
          IPA 한 번 적용. 증명 크기:
        </p>
        <M display>{'\\underbrace{2 \\log_2(mn)}_{\\text{IPA}} + O(1) \\quad (\\text{상수 부분 동일})'}</M>
        <p>
          → 1024 개 range × 64-bit 를 하나의 ~1.4 KB 증명으로. Confidential Tx 가 한 블록의 수많은 거래를 모아 한 번에 검증할 수 있는 이유.
        </p>
      </div>
    </section>
  );
}
