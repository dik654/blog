import { Link } from "react-router-dom";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function AbelianGroup() {
  return (
    <section id="abelian-group" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">대수 구조는 프리미티브가 허용하는 계산을 정한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          군·환·체를 단순한 “진화 단계”로 외우면 실제 타입 경계를 놓치기 쉽습니다. Schnorr의 point는 덧셈으로 쓰는 prime-order 아벨군 G의 원소이고, secret·challenge·response는 scalar field Fq의 원소입니다. Poseidon state는 별도의 prime field Fp 위에 있으며, BN254에서는 base field modulus p와 group order q가 서로 다른 수입니다. 따라서 point coordinate, scalar와 hash field element를 같은 정수 타입처럼 바꾸면 range·reduction bug가 생깁니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="algebra-contract" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>최소 계산 예</h3>
        <p>
          F7에서 3의 곱셈 inverse는 5이므로 6/3=6·5≡2입니다. 반면 curve point P의 inverse는 field inverse가 아니라 덧셈 역원 −P이며 P+(−P)=O입니다. Scalar multiplication 3P는 point를 세 번 더한다는 뜻이지 coordinate x,y 각각에 정수 3을 곱한다는 뜻이 아닙니다. 이 구분과 합성수 modulus의 zero-divisor 반례는 <Link to="/crypto/finite-field-theory#overview">유한체의 연산 계약</Link>에서 더 깊게 유도합니다.
        </p>
        <h3>조합 체크리스트</h3>
        <p>
          구현 전에 각 값에 대해 domain, modulus/order, canonical encoding, identity 허용 여부, subgroup validation과 secret-dependent operation 여부를 기록합니다. Group law가 성립한다고 signature가 안전한 것도 아니고 field가 크다고 hash가 collision-resistant한 것도 아닙니다. 대수 구조는 계산 무대이며 보안 성질은 구체 scheme·parameter·공격 모델에서 추가로 증명해야 합니다.
        </p>
      </div>
    </section>
  );
}
