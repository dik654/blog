export default function FinalExp() {
  return (
    <section id="final-exp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Final Exponentiation</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Miller Loop의 결과 f는 아직 GT의 원소가 아닙니다.
          <code>{"f^((p^12-1)/r)"}</code>을 계산하여 r-th roots of unity 부분군 GT로 투영합니다.
          지수는 세 인자로 분해됩니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`(p^12 - 1) / r = (p^6 - 1) * (p^2 + 1) * (p^4 - p^2 + 1)/r
                  ~~~~~~~~~~   ~~~~~~~~~~   ~~~~~~~~~~~~~~~~~~~
                  Easy Part 1  Easy Part 2      Hard Part`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Easy Part 1: f^(p^6 - 1)</h3>
        <p>
          <code>{"f^(p^6) = conjugate(f)"}</code>가 성립합니다.
          Fp12 = Fp6[w]/(w^2-v)에서 <code>{"w^(p^6) = -w"}</code>이므로
          (c0 + c1*w)의 p^6승은 c0 - c1*w, 즉 conjugate입니다.
          연산: conjugate 1회 + inv 1회 + mul 1회.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Easy Part 2: result^(p^2 + 1)</h3>
        <p>
          <code>{"result^(p^2+1) = frobenius2(result) * result"}</code>로 계산합니다.
          Fp12 Frobenius^2에서는 Fp2 원소의 p^2승이 항등이므로,
          v와 w 계수에 보정 상수(<code>{"xi^((p^2-1)/3)"}</code> 등)만 곱하면 됩니다.
          이 상수들은 모두 실수(허수부 = 0)입니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Hard Part: (p^4 - p^2 + 1)/r</h3>
        <p>
          약 761비트 지수를 square-and-multiply로 계산합니다.
          프로덕션에서는 BN 파라미터 u를 사용한 addition chain으로 최적화하지만,
          교육용 구현에서는 지수를 12개 u64 limb로 하드코딩하여 naive pow를 사용합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`fn final_exponentiation(f: Fp12) -> Fp12 {
    // Easy Part 1: conjugate(f) * f^(-1)
    let f_inv = f.inv().unwrap();
    let r1 = f.conjugate() * f_inv;

    // Easy Part 2: frobenius2(r1) * r1
    let r2 = fp12_frob2(&r1) * r1;

    // Hard Part: r2^((p^4-p^2+1)/r)
    let hard_exp: [u64; 12] = [
        0xe81bb482ccdf42b1, 0x5abf5cc4f49c36d4,
        0xf1154e7e1da014fd, 0xdcc7b44c87cdbacf,
        0xaaa441e3954bcf8a, 0x6b887d56d5095f23,
        0x79581e16f3fd90c6, 0x3b1b1355d189227d,
        0x4e529a5861876f6b, 0x6c0eb522d5b12278,
        0x331ec15183177faf, 0x01baaa710b0759ad,
    ];
    r2.pow(&hard_exp)
}`}</code></pre>

        <p className="mt-4">
          각 단계는 점진적으로 더 깊은 부분군으로 사영합니다:
          Fp12* 전체(p^12-1) → mu_(p^6+1) → mu_(p^4-p^2+1) → mu_r = GT.
        </p>
      </div>
    </section>
  );
}
