import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";

export default function Applications() {
  return <section id="applications" data-teach-level="7" className="space-y-5 [&_p]:leading-8">
    <h2 className="text-2xl font-bold">10. 부분군 크기와 프로토콜이 요구하는 문제를 함께 봅니다</h2>
    <p>표를 거의 보관하지 않고 원소를 의사 무작위로 돌아다니다 같은 값의 충돌을 찾는 공격도 있습니다. Pollard rho는 그 충돌에서 지수의 합동식을 얻습니다. 기대 연산 수는 대략 √q이지만 실행 시간은 확률적으로 달라집니다. 충돌에서 나온 계수의 차이가 역원을 갖지 않으면 다시 시도하거나 별도로 풀어야 합니다.</p>
    <div id="paper-pollard-dlp"><CitationBlock source="Pollard (1978) · Monte Carlo Methods for Index Computation (mod p)" href="https://doi.org/10.1090/S0025-5718-1978-0491431-9" citeKey={1}><p>큰 저장 표 없이 충돌로 지수를 구하는 방법의 원 논문입니다. 이 글은 그 기대 비용과 메모리의 교환을 설명하며 특정 장비에서 실행 시간을 재현하지 않았습니다. 순환의 분할과 위수 조건을 확인해야 하며 모든 구체적인 군의 최선 공격이 이 방법이라는 주장은 하지 않습니다.</p></CitationBlock></div>
    <p>위수의 소인수가 작으면 각 작은 부분의 문제로 나눠 푸는 Pohlig–Hellman 공격도 고려합니다. 유한체의 곱셈군에는 숫자의 표현을 활용하는 index calculus 계열이 있습니다. 따라서 큰 나머지 기준 하나나 표의 겉모습만으로 보안을 판단하지 않습니다. 적절한 타원곡선군의 알려진 공격과도 같은 자릿수 기준으로 비교할 수 없습니다.</p>
    <h3 className="text-xl font-semibold">지수를 찾기와 두 사람의 공유 값을 만들기는 다른 문제입니다</h3>
    <p>DLP는 gˣ에서 x를 찾습니다. 계산 Diffie–Hellman 문제(CDH)는 gᵃ와 gᵇ에서 gᵃᵇ를 계산합니다. 판정 Diffie–Hellman 문제(DDH)는 세 번째 값이 gᵃᵇ인지 구분합니다. DLP를 풀면 a를 찾아 CDH를 풀 수 있지만 반대 방향이 자동으로 성립하지는 않습니다.</p>
    <p>같은 작은 군에서 a=5, b=3을 택하면 공개 값은 5와 10입니다(가정). 공유 값은 5³ mod 17=6이며 3¹⁵ mod 17=6과 같습니다. CDH는 비밀 5나 3 자체를 반환하지 않아도 6을 만들면 해결한 것입니다. DDH는 제시한 세 번째 값 6이 맞는지 답하면 됩니다. 쌍선형 계산을 지원하는 일부 군에서는 DDH가 쉬워도 DLP는 어렵게 설계할 수 있습니다.</p>
    <p><Link to="/cs/crypto/diffie-hellman">키 합의</Link>와 <Link to="/cs/crypto/elgamal">ElGamal 암호화</Link>는 자신의 보안 목표에 맞는 가정과 인코딩을 확인해야 합니다. <Link to="/cs/crypto/crypto-primitives#schnorr">Schnorr 서명</Link>도 지식을 증명하는 관계와 실제 서명 보안의 환원 조건을 구분합니다.</p>
    <h3 className="text-xl font-semibold">실제 매개변수와 구현을 고정합니다</h3>
    <p>구현을 선택할 때는 군과 부분군의 위수, 생성원, 전체 군에서 부분군이 차지하는 비율, 입력 인코딩과 라이브러리 버전을 기록합니다. 허용되지 않은 작은 부분군·항등원·다른 곡선·범위 밖 지수·비정규 인코딩을 거절하는지 공식 벡터와 독립 구현으로 확인합니다. 그 뒤 정상 계산 속도를 비교합니다.</p>
    <p>이 글의 17과 16은 보안 매개변수가 아닙니다. 충분한 오류 보정 자원을 갖춘 양자컴퓨터에서 <Link to="/cs/crypto/quantum-computing-and-cryptographic-risk">Shor 알고리즘</Link>을 실행하면 DLP를 푸는 비용 구조가 달라집니다. 고전적 공격의 비용과 장기 기록의 양자 대응을 따로 판단해야 합니다.</p>
    <ul className="list-disc space-y-3 pl-6"><li>같은 g=3, mod 17에서 비밀을 5 대신 21로 바꾸면 공개 값도 바뀔까요? (답: 7절)</li><li>Y=5에서 큰 걸음을 한 번 옮겨 3을 찾았다면 표의 어느 위치와 만나고 어떤 x를 얻을까요? (답: 9절)</li><li>g=4인 네 칸의 순환에서 Y=3을 받으면 더 오래 탐색해야 할까요? (답: 7절)</li></ul>
  </section>;
}
