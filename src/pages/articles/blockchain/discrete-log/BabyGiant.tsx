import BabyGiantViz from './viz/BabyGiantViz';
import Math from '@/components/ui/math';

export default function BabyGiant() {
  return (
    <section id="baby-giant" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Baby-step Giant-step</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Bitcoin은 secp256k1(256-bit), Ed25519도 256-bit 키를 쓴다. 왜 128-bit가 아니라 256-bit일까?
          <br />
          역방향 전수 탐색은 O(p)이지만, Baby-step Giant-step 알고리즘은 O(√p)에 풀 수 있다.
          <br />
          즉 실제 안전성은 키 크기의 절반이다 — 256-bit 키의 안전성은 √(2²⁵⁶) = 2¹²⁸ = 128-bit.
          <br />
          2¹²⁸ ≈ 3.4 × 10³⁸. 초당 10¹²번 연산하는 컴퓨터 10억 대를 동원해도 10¹⁰년(우주 나이) 이상 걸린다.
          <br />
          NIST는 2030년 이후에도 128-bit를 안전 기준으로 권고하며, AES-128도 같은 수준이다.
          <br />
          이 알고리즘의 존재가 실무에서 키 크기를 결정하는 근거이므로, 원리를 알아야 한다.
        </p>

        <h3>수식 전개</h3>
        <p>
          <Math>{'q'}</Math>는 군의 위수 — mod p에서 0을 제외한 {'{'}1, 2, 3, …, p−1{'}'} 의 개수다.
          <br />
          p=17이면 <Math>{'q = p-1 = 16'}</Math>, 즉 x가 될 수 있는 후보는 0~15의 16개.
          <br />
          이 16개를 효율적으로 탐색하는 것이 목표다.
        </p>
        <p>
          <strong>① 분해:</strong> 어떤 정수든 <Math>{'m'}</Math>으로 나누면 몫과 나머지로 쓸 수 있다.
          <br />
          <Math>{'m = \\lceil\\sqrt{q}\\rceil'}</Math>로 잡으면 몫과 나머지 모두 0~m−1 범위가 되어,
          q개를 전수 탐색하는 대신 m×m 격자로 분할할 수 있다.
          <Math display>{'\\underbrace{x}_{\\text{정수}} = \\underbrace{i}_{\\text{몫}} \\cdot \\underbrace{m}_{\\lceil\\sqrt{q}\\rceil} + \\underbrace{j}_{\\text{나머지}}'}</Math>
        </p>
        <p>
          <strong>② 양변에 g를 씌우기:</strong>
          <Math display>{'g^x = g^{i \\cdot m + j} = g^{i \\cdot m} \\cdot g^j'}</Math>
        </p>
        <p>
          <strong>③</strong> <Math>{'y = g^x'}</Math> 이므로:
          <Math display>{'y = g^{i \\cdot m} \\cdot g^j'}</Math>
        </p>
        <p>
          <strong>④ 양변에서</strong> <Math>{'g^j'}</Math>를 이항:
          <Math display>{'y \\cdot g^{-j} = g^{i \\cdot m} = (g^m)^i'}</Math>
        </p>
        <p>
          <strong>⑤ 알고리즘:</strong>
          <br />
          Baby-step — <Math>{'g^j'}</Math> 값 (j=0~m−1)을 미리 계산해 테이블에 저장.
          <br />
          Giant-step — y를 <Math>{'g^m'}</Math>으로 한 번씩 나누며 (<Math>{'y,\\; y \\cdot g^{-m},\\; y \\cdot g^{-2m},\\; \\ldots'}</Math>)
          결과가 Baby 테이블에 있는지 검색한다.
          <br />
          매칭되면 나눈 횟수가 i, 테이블에서 찾은 위치가 j → <Math>{'x = i \\cdot m + j'}</Math>.
        </p>
      </div>
      <div className="not-prose mb-8"><BabyGiantViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>그래서 DLP는 안전한가?</h3>
        <p>
          O(√p) 알고리즘이 있다고 DLP가 깨진 것은 아니다.
          <br />
          이 알고리즘의 존재를 이미 알고 있기 때문에, 처음부터 키 크기를 2배로 설정한다.
          <br />
          2¹²⁸번 연산은 현재 전 세계 컴퓨터를 동원해도 우주 나이(~10¹⁰년)보다 오래 걸린다.
        </p>
        <p>
          핵심은 "깨는 방법이 없다"가 아니라 "최선의 방법을 써도 비용이 천문학적"이라는 점이다.
          <br />
          암호학의 안전성은 항상 "알려진 최선의 공격 대비 충분한 마진"으로 정의된다.
        </p>
      </div>
    </section>
  );
}
