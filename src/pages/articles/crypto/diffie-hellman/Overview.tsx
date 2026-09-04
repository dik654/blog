import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Diffie–Hellman은 공개 채널에서 같은 secret material을 계산하지만 상대를 인증하지 않는다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Alice와 Bob은 비밀 자체를 보내지 않고 각자의 공개값만 교환합니다.
          상대 공개값에 자기 secret exponent를 적용하면 둘 다 같은 group
          element에 도달합니다. 도청자는 두 공개값을 보지만 정확한 group과
          parameter에서 Computational Diffie–Hellman(CDH)이 어렵다는 가정 아래
          그 값을 계산하기 어렵습니다.
        </p>
        <p>
          Group·generator·order와 DLP/CDH/DDH의 차이는
          <Link to="/crypto/discrete-log"> 이산로그 정본</Link>, elliptic-curve
          point와 subgroup validation은
          <Link to="/crypto/elliptic-curves"> 타원곡선 정본</Link>, ephemeral
          secret의 randomness는 <Link to="/crypto/csprng">CSPRNG 정본</Link>을
          재사용합니다. 이 글은 DH output을 실제 session key로 바꾸기 위해 필요한
          public-key validation, transcript authentication, KDF, key confirmation,
          ephemeral lifecycle을 소유합니다.
        </p>
        <p>
          배포 예시는 RFC 7748의 X25519 byte/function contract와 RFC 5869 HKDF를 씁니다. 임의 mod-p group은 여기에 쓰지 않습니다. 아래
          p=23 계산은 등식만 확인하는 장난감 예이며 작은 composite-order group이라 보안 parameter 구실을 못 합니다.
        </p>
      </div>
      <ContentBoundary article="diffie-hellman" />
      <div id="paper-diffie-hellman-1976" className="scroll-mt-24">
        <CitationBlock source="Diffie & Hellman (1976) · New Directions in Cryptography" href="https://ee.stanford.edu/~hellman/publications/24.pdf" citeKey={1}>
          문제: 사전에 shared secret을 운반하지 않고 공개 통신에서 keying material을
          합의합니다. 기여: public-key cryptography의 방향과 exponentiation 기반
          public-key distribution 아이디어를 제시합니다. 전제: 선택 group에서
          역문제와 shared value 계산이 공격자에게 어렵습니다. 근거 범위: 원래 key
          distribution 아이디어와 보안 문제 설정입니다. 비주장: 현대 byte encoding,
          peer authentication, KDF, forward secrecy lifecycle이나 X25519 parameter를
          표준화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
