import { Link } from "react-router-dom";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">프로토콜은 DLP·CDH·DDH를 같은 가정으로 취급하지 않는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          DLP는 Y=gˣ에서 x를 찾는 문제입니다. Computational Diffie–Hellman(CDH)은 gᵃ,gᵇ에서 gᵃᵇ를 계산하는 문제이고 Decisional
          Diffie–Hellman(DDH)은 (gᵃ,gᵇ,gᶜ)에서 c=ab인지 구분하는 문제입니다. DLP를 풀면 CDH도 풀 수 있지만 반대 방향이 자동으로 성립하지 않으며
          pairing group처럼 DDH가 쉬워도 DLP는 어렵게 설계된 환경도 있습니다.
        </p>
        <p>
          <Link to="/crypto/diffie-hellman">Diffie–Hellman</Link>은 CDH/DDH 계열 가정을, <Link to="/crypto/elgamal">ElGamal</Link>의 confidentiality는 보통 DDH와 message encoding 조건을, <Link to="/crypto/crypto-primitives#schnorr">Schnorr</Link>는 knowledge-of-secret와 signature reduction을 사용합니다. “DLP 기반”이라는 한 줄만으로 각 protocol의 exact security property를 대체할 수 없습니다.
        </p>
        <h3>Parameter 선택과 release gate</h3>
        <p>
          Run receipt에는 group/curve 이름뿐 아니라 parameter version, full group·subgroup order, generator, cofactor,
          point encoding, validation policy와 library SHA를 고정합니다. Toy group·small
          subgroup·identity·noncanonical point·wrong curve·out-of-range scalar를 reject하고 official vector 및
          independent implementation과 public key·shared secret·signature parity를 맞춥니다. 그 뒤 target hardware의
          scalar multiplication과 attack budget을 비교합니다.
        </p>
        <p>
          Shor algorithm을 실행할 충분히 큰 fault-tolerant quantum computer가 있다면 DLP 계열은 polynomial time에 풀립니다. 현재 classical security estimate와 post-quantum migration horizon을 분리해 기록하며, “오늘 실용적 quantum attack이 없다”를 장기 기록의 안전성으로 확대하지 않습니다.
        </p>
      </div>
    </section>
  );
}
