import OverviewViz from './viz/OverviewViz';
import DataAtRestInlineViz from './viz/DataAtRestInlineViz';
import TlsHandshakeInlineViz from './viz/TlsHandshakeInlineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화가 필요한 곳</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <OverviewViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">ISMS 2.7 암호화 적용 요구사항</h3>
        <p className="leading-7">
          ISMS-P 인증 기준 2.7(암호화 적용)은 개인정보와 인증정보를 저장하거나 전송할 때 암호화를 의무화한다.
          <br />
          여기서 "암호화"란 평문(plaintext) 데이터를 수학적 알고리즘으로 변환하여 인가되지 않은 자가 읽을 수 없는 형태(ciphertext)로 만드는 것을 뜻한다.
          <br />
          암호화 없이 데이터를 저장하거나 전송하면, DB 유출이나 네트워크 도청 한 번으로 전체 이용자 정보가 노출된다.
        </p>
        <p className="leading-7">
          암호화 적용 범위는 크게 세 영역으로 나뉜다.
          <br />
          저장 시 암호화(data at rest), 전송 시 암호화(data in transit), 비밀번호 저장(단방향 해시).
          <br />
          각 영역의 위협 모델이 다르므로 적용하는 알고리즘과 키 관리 방식도 달라진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">저장 시 암호화 (Data at Rest)</h3>
        <p className="leading-7">
          저장 시 암호화는 디스크에 기록된 데이터를 보호하는 것이 목적이다.
          <br />
          DB 내 개인정보(주민등록번호, 계좌번호, 연락처), 백업 파일, 로그 파일에 포함된 민감 정보가 대상이다.
          <br />
          공격자가 DB 덤프를 탈취하거나 백업 테이프를 물리적으로 훔쳐도, 암호화되어 있으면 평문을 복원할 수 없다.
        </p>
        <p className="leading-7">
          DB 컬럼 단위 암호화와 디스크 전체 암호화(Full Disk Encryption, FDE)는 보호 범위가 다르다.
          <br />
          컬럼 단위 암호화는 특정 필드만 암호화하므로 애플리케이션이 복호화 로직을 직접 처리해야 한다.
          성능 영향이 크지만, DB 관리자가 평문을 볼 수 없다는 장점이 있다.
          <br />
          FDE는 OS 레벨에서 디스크 전체를 암호화하므로 애플리케이션 변경이 필요 없다.
          그러나 OS가 부팅되어 디스크가 마운트된 상태에서는 모든 데이터가 평문으로 접근 가능하다.
          <br />
          실무에서는 두 방식을 병행한다 -- FDE로 물리적 탈취를 방어하고, 컬럼 암호화로 논리적 접근을 통제한다.
        </p>
        <p className="leading-7">
          암호화 알고리즘은 AES-256(Advanced Encryption Standard, 256비트 키 길이)이 현재 표준이다.
          <br />
          AES는 대칭키(symmetric key) 알고리즘으로, 암호화와 복호화에 동일한 키를 사용한다.
          키 길이가 256비트이면 무차별 대입(brute force)으로 키를 찾는 것이 물리적으로 불가능하다.
          <br />
          국내 법령(개인정보의 안전성 확보조치 기준)은 주민등록번호, 여권번호, 바이오인식정보 등을 AES-128 이상으로 암호화하도록 명시한다.
        </p>

        <DataAtRestInlineViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">전송 시 암호화 (Data in Transit)</h3>
        <p className="leading-7">
          전송 시 암호화는 네트워크를 통해 이동하는 데이터를 도청과 변조로부터 보호한다.
          <br />
          HTTPS는 HTTP 위에 TLS(Transport Layer Security) 프로토콜을 얹어 통신 구간을 암호화하는 방식이다.
          <br />
          TLS 핸드셰이크(handshake) 과정에서 서버 인증서를 검증하고, 세션 키를 교환한 뒤 대칭키로 데이터를 암호화한다.
        </p>
        <p className="leading-7">
          TLS 1.2 이상 사용이 필수이며, TLS 1.0/1.1은 알려진 취약점(POODLE, BEAST)이 존재하므로 비활성화해야 한다.
          <br />
          TLS 1.3은 핸드셰이크 왕복 횟수를 줄이고(1-RTT), 취약한 암호 스위트(cipher suite)를 제거하여 보안과 성능을 모두 개선했다.
          <br />
          HSTS(HTTP Strict Transport Security) 헤더를 설정하면 브라우저가 HTTP 접속을 자동으로 HTTPS로 리다이렉트하여 평문 통신을 원천 차단한다.
        </p>
        <p className="leading-7">
          내부 서버 간 통신도 암호화 대상이다.
          <br />
          API 서버와 DB 서버 사이, 마이크로서비스 간 통신에 TLS를 적용하지 않으면 내부 네트워크를 장악한 공격자가 평문 데이터를 가로챌 수 있다.
          <br />
          VPN(Virtual Private Network)은 원격 접속 시 전체 통신 구간을 암호화 터널로 감싸는 역할을 한다.
          재택 근무자나 외부 협력사가 내부 시스템에 접근할 때 VPN을 필수로 적용하여 공용 네트워크 구간의 도청을 방지한다.
        </p>

        <TlsHandshakeInlineViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">비밀번호 저장: 단방향 해시</h3>
        <p className="leading-7">
          비밀번호는 암호화가 아닌 해싱(hashing)으로 저장한다.
          <br />
          해싱은 입력값을 고정 길이의 출력값(해시값, digest)으로 변환하는 단방향 함수다.
          "단방향"이란 해시값에서 원래 비밀번호를 역산할 수 없다는 뜻이다.
          <br />
          암호화(encryption)는 복호화가 가능하므로, 암호화 키가 유출되면 모든 비밀번호가 노출된다.
          해싱은 복호화 자체가 불가능하므로 키 유출 리스크가 원천적으로 사라진다.
        </p>
        <p className="leading-7">
          로그인 검증 절차는 다음과 같다: 이용자가 입력한 비밀번호를 동일한 해시 함수에 넣어 해시값을 생성하고,
          DB에 저장된 해시값과 비교한다. 두 해시값이 일치하면 인증 성공이다.
          <br />
          평문 비밀번호를 어디에도 저장하지 않으므로, DB 전체가 유출되어도 비밀번호 원문은 알 수 없다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">대칭키 vs 비대칭키 사용처 구분</h3>
        <p className="leading-7">
          대칭키 암호(symmetric cipher)는 암호화와 복호화에 같은 키를 사용한다.
          AES가 대표적이며, 연산 속도가 빨라 대량 데이터 암호화에 적합하다.
          <br />
          문제는 키 배포(key distribution)다 -- 통신하는 양쪽이 같은 키를 안전하게 공유해야 하는데,
          키 자체를 평문으로 전송하면 의미가 없다.
        </p>
        <p className="leading-7">
          비대칭키 암호(asymmetric cipher)는 공개키(public key)와 개인키(private key) 쌍을 사용한다.
          RSA, ECDSA가 대표적이며, 공개키로 암호화한 데이터는 대응하는 개인키로만 복호화할 수 있다.
          <br />
          연산 비용이 대칭키보다 수십~수백 배 높아 대량 데이터 직접 암호화에는 부적합하다.
        </p>
        <p className="leading-7">
          실무에서는 두 방식을 결합한다.
          TLS 핸드셰이크에서 비대칭키로 세션 키(대칭키)를 안전하게 교환하고, 이후 데이터 전송은 세션 키로 수행한다.
          <br />
          이를 하이브리드 암호 체계(hybrid cryptosystem)라 부르며, 키 교환의 안전성과 데이터 암호화의 속도를 모두 확보하는 표준 패턴이다.
          <br />
          디지털 서명(digital signature)은 비대칭키의 또 다른 활용으로, 개인키로 서명하고 공개키로 검증하여 데이터의 무결성과 발신자 인증을 보장한다.
        </p>
      </div>
    </section>
  );
}
