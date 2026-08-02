import M from '@/components/ui/math';

export default function InnerProduct({ title }: { title?: string }) {
  return (
    <section id="inner-product" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Inner Product Argument — O(log n) 압축'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          공개 생성원 <M>{'\\mathbf{G}, \\mathbf{H} \\in \\mathbb{G}^n'}</M> 와 <M>{'U \\in \\mathbb{G}'}</M>, 그리고 커밋:
        </p>
        <M display>{'C = \\underbrace{\\langle \\mathbf{a}, \\mathbf{G} \\rangle}_{\\text{벡터 a 의 커밋}} + \\underbrace{\\langle \\mathbf{b}, \\mathbf{H} \\rangle}_{\\text{벡터 b 의 커밋}} + \\underbrace{c \\cdot U}_{c \\text{ 바인딩}}'}</M>
        <p>
          Prover 는 <M>{'\\mathbf{a}, \\mathbf{b}'}</M> 를 알지만, 직접 보내지 않고 "<M>{' c = \\langle \\mathbf{a}, \\mathbf{b} \\rangle'}</M> 가 맞다" 만 증명한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">재귀 폴딩 한 라운드</h3>
        <p>
          벡터를 절반씩 자른다 — <M>{'\\mathbf{a}_L, \\mathbf{a}_R \\in \\mathbb{F}^{n/2}'}</M>, 마찬가지로 <M>{'\\mathbf{b}, \\mathbf{G}, \\mathbf{H}'}</M> 도 분할.
        </p>
        <p>
          Prover 가 두 개의 교차 커밋을 보낸다:
        </p>
        <M display>{'L = \\underbrace{\\langle \\mathbf{a}_L, \\mathbf{G}_R \\rangle}_{\\text{교차}} + \\underbrace{\\langle \\mathbf{b}_R, \\mathbf{H}_L \\rangle}_{\\text{교차}} + \\underbrace{\\langle \\mathbf{a}_L, \\mathbf{b}_R \\rangle U}_{\\text{교차 내적}}'}</M>
        <M display>{'R = \\underbrace{\\langle \\mathbf{a}_R, \\mathbf{G}_L \\rangle}_{\\text{교차}} + \\underbrace{\\langle \\mathbf{b}_L, \\mathbf{H}_R \\rangle}_{\\text{교차}} + \\underbrace{\\langle \\mathbf{a}_R, \\mathbf{b}_L \\rangle U}_{\\text{교차 내적}}'}</M>
        <p>
          Verifier 가 랜덤 도전값 <M>{'u \\in \\mathbb{F}^*'}</M> 을 보내면 (Fiat–Shamir 로 비대화형화), 양쪽 모두 다음으로 갱신:
        </p>
        <M display>{"\\mathbf{a}' = \\underbrace{\\mathbf{a}_L \\cdot u}_{\\text{왼쪽 반 × challenge}} + \\underbrace{\\mathbf{a}_R \\cdot u^{-1}}_{\\text{오른쪽 반 × 역원}}"}</M>
        <M display>{"\\mathbf{b}' = \\mathbf{b}_L \\cdot u^{-1} + \\mathbf{b}_R \\cdot u"}</M>
        <M display>{"\\mathbf{G}' = \\mathbf{G}_L \\cdot u^{-1} + \\mathbf{G}_R \\cdot u, \\quad \\mathbf{H}' = \\mathbf{H}_L \\cdot u + \\mathbf{H}_R \\cdot u^{-1}"}</M>
        <p>
          벡터 길이가 <M>{'n \\to n/2'}</M> 로 절반이 됐다.
          그리고 Verifier 가 보유한 새 커밋:
        </p>
        <M display>{"C' = u^2 \\cdot L + C + u^{-2} \\cdot R"}</M>
        <p>
          이 식이 <M>{"\\langle \\mathbf{a}', \\mathbf{G}' \\rangle + \\langle \\mathbf{b}', \\mathbf{H}' \\rangle + \\langle \\mathbf{a}', \\mathbf{b}' \\rangle U"}</M> 와
          정확히 일치하도록 <M>L, R</M> 정의가 설계됐다 — 곱셈 전개에서 cross term 이 <M>L, R</M> 에 흡수.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">총 메시지 크기</h3>
        <p>
          매 라운드마다 <M>(L, R)</M> 두 개의 EC 점 전송 + 길이 절반. <M>{'\\log_2 n'}</M> 라운드 후 길이 1 → 마지막에
          <M>{'\\mathbf{a}, \\mathbf{b}'}</M> 의 단일 스칼라 한 쌍을 평문 전송. 총 메시지:
        </p>
        <M display>{'\\underbrace{2 \\log_2 n}_{(L, R) \\text{ 점들}} + \\underbrace{2}_{\\text{최종 스칼라 쌍}}'}</M>
        <p>
          예: <M>{'n = 64'}</M> 면 6 라운드 × 2 + 2 = 14 EC 점/스칼라. naive 64 개 대비 4.5 배 압축.
          range proof <M>{'n = 2^{64}'}</M> 비트 길이도 단지 64 → 6 라운드.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Verifier 의 마지막 검증</h3>
        <p>
          Prover 가 마지막 단일 스칼라 <M>{'a, b'}</M> 를 보내면, Verifier 는 누적된 <M>{'C^*'}</M> 와 누적된 generators
          <M>{'\\mathbf{G}^*, \\mathbf{H}^*'}</M> 를 가지고 다음 등식 1회만 검증:
        </p>
        <M display>{'C^* \\stackrel{?}{=} a \\cdot \\mathbf{G}^* + b \\cdot \\mathbf{H}^* + (a \\cdot b) \\cdot U'}</M>
        <p>
          모든 라운드에서 누적된 <M>{'u'}</M> 들의 곱으로 generator 를 한 번에 재구성하는 <strong>multi-scalar trick</strong> 이 핵심 최적화.
        </p>
      </div>
    </section>
  );
}
