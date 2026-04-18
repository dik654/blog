import PasswordHashingViz from './viz/PasswordHashingViz';
import HashAttackInlineViz from './viz/HashAttackInlineViz';
import MigrationInlineViz from './viz/MigrationInlineViz';

export default function PasswordHashing() {
  return (
    <section id="password-hashing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비밀번호 해싱 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PasswordHashingViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">왜 단방향인가</h3>
        <p className="leading-7">
          비밀번호를 암호화(양방향)로 저장하면 복호화 키 하나가 유출될 때 전체 이용자의 비밀번호가 한꺼번에 노출된다.
          <br />
          단방향 해시는 원본 복원이 수학적으로 불가능하므로, DB가 통째로 유출되어도 비밀번호 원문은 알 수 없다.
          <br />
          이것이 비밀번호 저장에 암호화 대신 해싱을 사용하는 근본적인 이유다.
        </p>
        <p className="leading-7">
          공격자가 해시값을 손에 넣었다고 해서 완전히 안전한 것은 아니다.
          <br />
          해시 함수의 특성상 동일한 입력은 항상 동일한 출력을 생성하므로,
          자주 사용되는 비밀번호의 해시값을 미리 계산해 놓으면(사전 계산 공격) 해시값을 역추적할 수 있다.
          <br />
          이 공격을 막기 위해 salt(솔트)와 느린 해시 함수를 조합한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">MD5/SHA-1의 취약점</h3>
        <p className="leading-7">
          MD5(Message Digest 5)와 SHA-1(Secure Hash Algorithm 1)은 한때 표준이었지만 현재는 비밀번호 해싱에 부적합하다.
          <br />
          첫 번째 문제는 속도다. MD5는 최신 GPU 한 장으로 초당 수십억 개의 해시를 계산할 수 있다.
          공격자가 "123456", "password", "qwerty" 같은 흔한 비밀번호부터 순서대로 해시를 생성하면 수 분 내에 상당수를 맞출 수 있다.
        </p>
        <p className="leading-7">
          두 번째 문제는 레인보우 테이블(rainbow table) 공격이다.
          레인보우 테이블은 "평문 → 해시값" 매핑을 미리 대량 계산해 놓은 조회 테이블이다.
          <br />
          MD5 해시값을 레인보우 테이블에 넣으면 원본 비밀번호를 즉시 찾을 수 있다.
          SHA-1도 같은 원리에 취약하다.
          <br />
          솔트(salt)를 추가하면 레인보우 테이블 공격은 무력화된다 -- 각 비밀번호마다 고유한 랜덤 값을 붙여 해싱하므로
          미리 계산한 테이블이 소용없어진다.
          그러나 MD5/SHA-1은 근본적으로 "빠른" 해시 함수이므로 솔트를 추가해도 브루트포스(brute force, 무차별 대입) 속도가 여전히 빠르다.
        </p>
        <p className="leading-7">
          세 번째 문제는 충돌(collision) 취약점이다.
          SHA-1은 2017년에 실질적인 충돌 공격(SHAttered)이 시연되었고, MD5는 그보다 훨씬 이전에 깨졌다.
          <br />
          비밀번호 해싱에서 충돌은 직접적 위협은 아니지만, 알고리즘의 전체적 신뢰성을 훼손하므로 사용 자체를 중단하는 것이 원칙이다.
        </p>

        <HashAttackInlineViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">bcrypt: 의도적으로 느린 해시</h3>
        <p className="leading-7">
          bcrypt는 비밀번호 해싱을 위해 설계된 적응형(adaptive) 해시 함수다.
          <br />
          "적응형"이란 cost factor(비용 인자)를 조절하여 연산 시간을 의도적으로 늘릴 수 있다는 뜻이다.
          cost factor를 1 올리면 연산 시간이 2배로 증가한다.
          <br />
          현재 권장 cost factor는 12 이상이며, 이 값에서 한 번의 해시 연산에 약 250ms가 소요된다.
          이용자 로그인 시에는 체감되지 않는 지연이지만, 공격자가 수십억 개를 시도하려면 수백 년이 걸린다.
        </p>
        <p className="leading-7">
          bcrypt는 솔트를 자동으로 생성하여 해시값에 포함시킨다.
          <br />
          출력 형식은 "$2b$12$" + 솔트(22자) + 해시(31자)로 구성된다.
          "$2b$"는 알고리즘 버전, "12"는 cost factor, 그 뒤가 솔트와 해시다.
          <br />
          개발자가 별도로 솔트를 관리할 필요가 없으므로 구현 실수가 줄어든다.
        </p>
        <p className="leading-7">
          bcrypt의 내부 구조는 Blowfish 암호를 변형한 Eksblowfish(Expensive Key Schedule Blowfish)를 사용한다.
          <br />
          키 스케줄(key schedule) 단계를 cost factor만큼 반복 수행하므로, 단순 해시 함수와 달리 연산을 빠르게 만들기 어렵다.
          <br />
          GPU에서 병렬화해도 Blowfish의 키 스케줄은 순차적이므로 속도 향상이 제한적이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">scrypt/Argon2: 메모리 하드 함수</h3>
        <p className="leading-7">
          scrypt는 CPU 연산뿐 아니라 메모리(RAM) 사용량도 함께 증가시키는 해시 함수다.
          <br />
          GPU는 수천 개의 코어로 연산을 병렬 처리하지만, 각 코어에 할당할 수 있는 메모리는 제한적이다.
          scrypt는 대량의 메모리를 요구하므로 GPU 병렬 공격의 효율이 급격히 떨어진다.
          <br />
          이를 메모리 하드(memory-hard) 함수라 부르며, ASIC(주문형 반도체) 공격도 함께 방어한다.
        </p>
        <p className="leading-7">
          Argon2는 2015년 Password Hashing Competition(PHC)에서 우승한 차세대 해시 함수다.
          <br />
          세 가지 변형이 존재한다:
          Argon2d는 GPU 공격에 강하지만 사이드 채널(side-channel) 공격에 취약하고,
          Argon2i는 사이드 채널에 강하지만 GPU 저항이 상대적으로 낮다.
          Argon2id는 두 방식을 결합한 하이브리드로, 비밀번호 해싱에 가장 권장되는 변형이다.
        </p>
        <p className="leading-7">
          Argon2의 파라미터는 세 가지다: 시간 비용(time cost, 반복 횟수), 메모리 비용(memory cost, 사용할 메모리 양),
          병렬 정도(parallelism, 스레드 수).
          <br />
          이 세 파라미터를 독립적으로 조절할 수 있어 서버 사양에 맞게 최적 지점을 찾을 수 있다.
          <br />
          OWASP(Open Web Application Security Project)의 현재 권장값은 Argon2id, 메모리 19MB, 반복 2회, 병렬 1이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">마이그레이션: MD5에서 bcrypt로 점진적 전환</h3>
        <p className="leading-7">
          레거시 시스템에서 MD5로 저장된 비밀번호를 bcrypt로 한꺼번에 전환하는 것은 불가능하다.
          <br />
          단방향 해시는 복호화할 수 없으므로 원본 비밀번호를 꺼내서 다시 해싱할 수 없기 때문이다.
          <br />
          대신 로그인 시점에 점진적으로 전환하는 방식을 사용한다.
        </p>
        <p className="leading-7">
          절차는 다음과 같다.
          <br />
          이용자가 로그인하면 입력한 비밀번호를 기존 MD5 해시와 먼저 비교한다.
          일치하면 인증 성공이고, 이 시점에 입력된 평문 비밀번호를 bcrypt로 해싱하여 DB의 해시값을 교체한다.
          <br />
          다음 로그인부터는 bcrypt 해시로 검증한다.
          <br />
          장기간 로그인하지 않는 계정은 비밀번호 재설정을 강제하여 전환을 완료한다.
        </p>
        <p className="leading-7">
          이중 해시(double hashing) 방식도 있다: 기존 MD5 해시값을 입력으로 bcrypt를 적용하는 것이다.
          <br />
          bcrypt(MD5(password)) 형태로 저장하면 모든 계정을 일괄 전환할 수 있다.
          <br />
          그러나 MD5의 출력이 128비트로 고정되어 있어 bcrypt의 입력 엔트로피가 제한되는 단점이 있다.
          장기적으로는 로그인 시 점진 전환을 통해 순수 bcrypt로 교체하는 것이 바람직하다.
        </p>

        <MigrationInlineViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">로그인 실패 횟수 제한</h3>
        <p className="leading-7">
          느린 해시 함수만으로는 온라인 브루트포스를 완전히 막을 수 없다.
          <br />
          공격자가 봇넷(botnet, 악성코드에 감염된 대규모 컴퓨터 네트워크)을 이용하면 분산 환경에서 초당 수천 건의 로그인 시도가 가능하다.
          <br />
          이를 방어하기 위해 로그인 실패 횟수 제한(account lockout)을 적용한다.
        </p>
        <p className="leading-7">
          일반적인 정책은 5회 연속 실패 시 계정을 일시 잠금하는 것이다.
          <br />
          잠금 해제는 일정 시간(예: 30분) 경과 후 자동 해제하거나, 본인확인(이메일 인증, 휴대폰 인증) 후 수동 해제하는 두 가지 방식이 있다.
          <br />
          자동 해제만 적용하면 공격자가 30분 간격으로 반복 시도할 수 있으므로, 고위험 시스템에서는 본인확인 후 해제를 병행한다.
        </p>
        <p className="leading-7">
          CAPTCHA(Completely Automated Public Turing test to tell Computers and Humans Apart)는 자동화 공격을 차단하는 보조 수단이다.
          <br />
          3회 실패 후 CAPTCHA를 노출하고, 5회 실패 시 계정을 잠그는 단계적 방어가 효과적이다.
          <br />
          Rate limiting(속도 제한)을 API 레벨에서 적용하면 동일 IP에서 과도한 요청 자체를 차단할 수 있다.
          <br />
          이 모든 조치는 해시 함수의 느림과 결합하여 온라인/오프라인 공격 모두에 대한 방어층을 형성한다.
        </p>
      </div>
    </section>
  );
}
