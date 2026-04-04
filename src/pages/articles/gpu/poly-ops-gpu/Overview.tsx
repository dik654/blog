import CodePanel from '@/components/ui/code-panel';

const pipelineCode = `PLONK Prover 다항식 연산 파이프라인:

1. 게이트 다항식 f(x) 구성         ← 계수 형태 (coefficient form)
2. NTT: f(x) → f(omega^i)         ← 평가 형태 (evaluation form)
3. 몫 다항식 t(x) 계산             ← 게이트 제약 합산
4. t(x) / Z(x) = h(x)             ← vanishing poly로 나눗셈 ★
   → Z(omega^i) = 0이므로 coset 평가 필요!
5. Coset NTT: t(g*omega^i) 계산   ← g = coset 생성원
6. Pointwise division              ← h(g*omega^i) = t(g*omega^i) / Z(g*omega^i)
7. Coset INTT: h(g*omega^i) → h(x)← 계수 복원
8. KZG 커밋: [h(x)]_1 = MSM       ← 곡선점 커밋먼트

핵심: 단계 4~7이 "coset NTT + 다항식 나눗셈" 조합`;

const opsCode = `NTT 기반 다항식 연산 전체 맵:

기본 연산:
  NTT(f)         O(n log n)  계수 → 평가 변환
  INTT(F)        O(n log n)  평가 → 계수 변환
  pointwise_mul  O(n)        평가끼리 곱셈 (= 다항식 곱셈)

확장 연산 (이 글의 주제):
  coset_NTT(f, g)    O(n log n)  coset 위에서 평가
  coset_INTT(F, g)   O(n log n)  coset 평가 → 계수 복원
  poly_div(t, Z)     O(n)        vanishing poly로 나눗셈
  multi_eval(f, z)   O(n)        임의 점에서 평가 (Horner)
  batch_inversion    O(n)        n개 역원을 1회 역원 연산으로`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NTT 너머의 다항식 연산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ZK 증명 시스템에서 NTT는 가장 기본적인 다항식 연산 프리미티브다.<br />
          그러나 실제 PLONK/Groth16 프로버는 NTT만으로 완성되지 않는다.<br />
          몫 다항식(quotient polynomial) 계산에는 <strong>coset NTT</strong>와
          <strong>vanishing polynomial 나눗셈</strong>이 필수이고,
          KZG 오프닝 증명에는 <strong>다점 평가</strong>가 필요하다.
        </p>
        <CodePanel title="PLONK 프로버 다항식 파이프라인" code={pipelineCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: 'NTT: 기본 변환' },
            { lines: [5, 9], color: 'emerald', note: 'coset NTT + 나눗셈 구간' },
            { lines: [10, 10], color: 'amber', note: 'MSM으로 커밋' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 coset이 필요한가</h3>
        <p>
          PLONK에서 몫 다항식 h(x) = t(x) / Z(x)를 계산해야 한다.<br />
          Z(x) = x^n - 1은 단위근 omega^i에서 모두 0이다.<br />
          따라서 평가 형태에서 직접 나누면 0으로 나누기가 발생한다.<br />
          해결책: 단위근이 아닌 <strong>coset</strong> g*omega^i에서 평가하면 Z(g*omega^i) != 0이 보장된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">이 글에서 다루는 연산</h3>
        <CodePanel title="NTT 기반 다항식 연산 맵" code={opsCode}
          annotations={[
            { lines: [3, 6], color: 'sky', note: '기본: NTT/INTT/pointwise' },
            { lines: [8, 14], color: 'emerald', note: '확장: coset, 나눗셈, 다점 평가' },
          ]} />
        <p>
          각 연산은 GPU에서 높은 병렬성을 가진다.
          coset NTT는 전처리 곱셈 + 표준 NTT, 다항식 나눗셈은 원소별 Fp 나눗셈,
          다점 평가는 점마다 독립적인 Horner 평가다.<br />
          모두 GPU의 대규모 스레드에 자연스럽게 매핑된다.
        </p>
      </div>
    </section>
  );
}
