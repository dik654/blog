import { Link } from 'react-router-dom';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import {
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const powers = [1, 3, 9, 10, 13, 5, 15, 11, 16, 14, 8, 7, 4, 12, 2, 6];

const cycleSteps: StepDef[] = [
  { label: '1. x=0에서 시작한다', body: '3⁰ mod 17 = 1이다. 지수 x는 위치, 나머지는 그 위치에서 보이는 값이다.' },
  { label: '2. 매번 3을 곱하고 17로 나눈 나머지만 남긴다', body: '값은 1, 3, 9, 10, 13, 5…처럼 섞여 보이지만 계산 자체는 빠르다.' },
  { label: '3. 생성원은 군의 모든 값을 한 번씩 지난다', body: '3은 mod 17의 곱셈군에서 위수 16인 생성원이라 0~15의 지수가 16개 값을 순환한다.' },
  { label: '4. y=5의 위치를 거꾸로 찾는다', body: '표가 작으면 x=5를 눈으로 찾지만 실제 군에서는 표 전체를 만들 수 없다. 이것이 이산로그 문제다.' },
];

function PowerCycleViz() {
  return (
    <StepViz steps={cycleSteps}>
      {(step) => (
        <div className="w-full" aria-label="3의 거듭제곱을 17로 나눈 순환">
          <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
            {powers.map((value, exponent) => {
              const target = value === 5;
              const visible = step >= 1 || exponent === 0;
              return (
                <div key={exponent} className={`min-w-0 rounded-md border px-2 py-3 text-center transition-all ${target && step >= 3 ? 'border-emerald-600 bg-emerald-500/10' : 'border-border bg-background'} ${visible ? 'opacity-100' : 'opacity-25'}`}>
                  <div className="font-mono text-[10px] text-muted-foreground">x={exponent}</div>
                  <div className="mt-2 text-lg font-bold">{value}</div>
                  {target && step >= 3 && <div className="mt-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">y=5</div>}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">각 칸은 <M>{String.raw`3^x\bmod 17`}</M>의 결과다. 값의 순서와 지수의 순서는 같지 않다.</p>
        </div>
      )}
    </StepViz>
  );
}

const bsgsSteps: StepDef[] = [
  { label: '1. 16개 후보를 4×4 좌표로 바꾼다', body: 'm=⌈√16⌉=4로 두고 x=4i+j로 분해한다.' },
  { label: '2. Baby table을 만든다', body: 'j=0..3에 대한 3ʲ mod 17 = {1,3,9,10}을 값→j 사전으로 저장한다.' },
  { label: '3. y를 한 giant step씩 되감는다', body: '3⁴=13의 mod 17 역원은 4다. y=5에 4를 곱하면 3이 되고 baby table과 만난다.' },
  { label: '4. 두 좌표를 합친다', body: 'i=1, j=1이므로 x=4·1+1=5다. 3⁵ mod 17=5로 검산한다.' },
];

function BabyGiantViz() {
  const baby = [1, 3, 9, 10];
  return (
    <StepViz steps={bsgsSteps}>
      {(step) => (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.8fr)]" aria-label="Baby-step Giant-step 예제">
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-2">
              {baby.map((value, j) => (
                <div key={value} className={`rounded-md border px-2 py-3 text-center ${step >= 1 ? 'border-blue-500/50 bg-blue-500/10' : 'border-border'}`}>
                  <div className="font-mono text-[10px] text-muted-foreground">j={j}</div>
                  <strong className="mt-2 block text-lg">{value}</strong>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Baby table: 값으로 j를 즉시 찾는 작은 사전</p>
          </div>
          <div className="min-w-0 border-l-2 border-border pl-4">
            <div className={`transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-35'}`}>
              <span className="font-mono text-[11px] font-bold text-muted-foreground">GIANT 00</span>
              <p className="mt-2 text-sm"><M>{String.raw`\gamma_0=5`}</M> · table에 없음</p>
            </div>
            <div className={`mt-5 transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-35'}`}>
              <span className="font-mono text-[11px] font-bold text-muted-foreground">GIANT 01</span>
              <p className="mt-2 text-sm"><M>{String.raw`\gamma_1=5\cdot4\bmod17=3`}</M></p>
              <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">Baby table의 j=1과 일치</p>
            </div>
            <div className={`mt-5 rounded-md bg-muted/35 p-3 transition-opacity ${step >= 3 ? 'opacity-100' : 'opacity-35'}`}>
              <M>{String.raw`x=im+j=1\cdot4+1=5`}</M>
            </div>
          </div>
        </div>
      )}
    </StepViz>
  );
}

const applications = [
  ['Diffie-Hellman', '두 사람이 공개값을 교환해 같은 shared secret을 만들되, 도청자가 secret을 계산하기 어렵게 한다.', articlePath('crypto', 'diffie-hellman')],
  ['Schnorr', '공개키에 대응하는 이산로그를 안다는 사실을 비밀값 공개 없이 증명하거나 서명한다.', `${articlePath('blockchain', 'zk-theory')}#schnorr`],
  ['ElGamal', '수신자의 공개키와 임시 지수를 결합해 메시지를 암호화한다.', articlePath('crypto', 'elgamal')],
  ['Elliptic-curve DLP', '정수의 곱셈군 대신 곡선 위 점의 덧셈군에서 Q=[x]G의 x를 찾기 어렵다는 성질을 쓴다.', articlePath('blockchain', 'elliptic-curves')],
] as const;

export default function DiscreteLog() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이산로그 문제란?</h2>
        <QuestionLead
          question="3⁵ mod 17은 금방 계산되는데, 결과 5만 보고 지수 5를 찾는 일은 왜 갑자기 어려워질까?"
          answer="정방향은 반복 제곱으로 필요한 곱셈만 계산할 수 있지만, 역방향은 결과가 어느 지수에서 나왔는지 찾아야 한다. 작은 군에서는 표를 만들 수 있지만 군의 원소가 약 2²⁵⁶개면 알려진 generic 공격도 약 √n 규모의 작업이 필요하다."
        />
        <ConceptPrimer items={[
          { term: 'mod p', meaning: '계산 결과를 p로 나눈 나머지만 남기는 규칙이다.', why: '값이 0부터 p-1 사이를 순환하는 이유를 본다.' },
          { term: 'Group order n', meaning: '연산 가능한 군 원소의 개수다.', why: '공격 비용은 표기된 key byte보다 실제 부분군 크기 n에 연결된다.' },
          { term: 'Generator g', meaning: '거듭제곱으로 선택한 군의 모든 원소를 순환하는 시작 원소다.', why: '어떤 y가 실제로 g의 거듭제곱인지 보장한다.' },
          { term: 'Inverse', meaning: '곱했을 때 1이 되는 mod p 원소다.', why: '나눗셈 대신 곱셈으로 giant step을 되감는다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            소수 <M>{'p=17'}</M>에서 0이 아닌 나머지들은 곱셈군을 이룬다. <M>{'g=3'}</M>은 이 군의 생성원이고,
            공개된 <M>{'y=5'}</M>에 대해 아래 식을 만족하는 지수 <M>{'x'}</M>를 찾는 것이 이산로그다.
          </p>
          <M display>{String.raw`\underbrace{g^x\bmod p}_{\text{정방향: 빠른 거듭제곱}}=\underbrace{y}_{\text{공개된 군 원소}}\quad\Longrightarrow\quad\underbrace{x}_{\text{역방향에서 찾을 비밀 지수}}`}</M>
          <FormulaNote
            meaning="g, p, y가 공개돼도 x를 되찾는 계산은 정방향 거듭제곱과 같은 방식으로 뒤집히지 않는다."
            symbols={[
              ['g', '반복해서 거듭제곱할 생성원'],
              ['x', '찾고 싶은 비밀 지수'],
              ['p', '나머지 연산의 소수 modulus'],
              ['y', 'g^x를 계산한 뒤 공개된 결과'],
            ]}
          />
        </div>
        <PowerCycleViz />
      </section>

      <section id="power-table" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">거듭제곱 테이블이 보여 주는 것</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            위 표에는 1부터 16까지가 정확히 한 번씩 나타난다. 이는 <M>{'3'}</M>의 위수가 16이라는 뜻이다.
            하지만 “순서가 무작위처럼 보인다”는 인상만으로 안전성을 증명하지는 않는다. 핵심은 큰 군에서 역함수를 계산하는 알려진
            최선의 알고리즘 비용을 분석하고, 선택한 군에 특수한 지름길이 없는지 검토하는 것이다.
          </p>
          <p>
            정방향은 지수의 binary bit를 따라 square-and-multiply를 쓰므로 대략 <M>{String.raw`O(\log x)`}</M>번의 군 연산으로 계산한다.
            반대로 모든 지수를 하나씩 확인하면 <M>{'O(n)'}</M>이고, 다음 BSGS는 이를 시간과 메모리 각각 <M>{String.raw`O(\sqrt n)`}</M>으로 줄인다.
          </p>
        </div>
        <Misconception>
          “패턴이 눈에 안 보인다”가 DLP의 보안 근거는 아니다. 군의 선택, 부분군 위수, 알려진 generic·specialized 공격과 구현의 side channel까지 포함해 판단한다.
        </Misconception>
      </section>

      <section id="baby-giant" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Baby-step Giant-step</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            BSGS의 생각은 <M>{'n'}</M>개 후보를 한 줄로 찾지 않고 약 <M>{String.raw`\sqrt n\times\sqrt n`}</M> 격자의 두 좌표로 바꾸는 것이다.
            <M>{String.raw`m=\lceil\sqrt n\rceil`}</M>으로 두고 지수를 <M>{'x=im+j'}</M>로 쓴다.
          </p>
          <M display>{String.raw`\underbrace{y(g^{-m})^i}_{\text{되감는 giant step}}=\underbrace{g^j}_{\text{저장한 baby step}}`}</M>
          <M display>{String.raw`\underbrace{x}_{\text{찾은 지수}}=\underbrace{im}_{\text{giant 좌표}}+\underbrace{j}_{\text{baby 좌표}}`}</M>
          <FormulaNote
            meaning="오른쪽의 √n개 값을 먼저 저장하고, 왼쪽 값을 최대 √n번 바꾸며 같은 값을 찾는다."
            symbols={[
              ['m', '후보 수 n의 제곱근을 올림한 격자 한 변'],
              ['j', '미리 저장하는 baby-step 좌표'],
              ['i', 'y에서 giant step을 몇 번 되감았는지'],
              ['g^{-m}', 'g^m의 군 역원, giant step을 되감는 배율'],
            ]}
          />
        </div>
        <BabyGiantViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>256-bit curve가 약 128-bit 보안이라는 말의 정확한 범위</h3>
          <p>
            위수가 약 <M>{'2^{256}'}</M>인 잘 선택된 elliptic-curve 부분군에는 BSGS나 Pollard rho 같은 generic 공격이 약
            <M>{'2^{128}'}</M> 군 연산을 요구한다. BSGS는 같은 규모의 메모리도 필요하지만 Pollard rho는 훨씬 적은 메모리로 기대
            <M>{String.raw`O(\sqrt n)`}</M> 시간에 접근한다. 실무의 “128-bit security” 설명에는 보통 이 generic 공격 경계가 쓰인다.
          </p>
          <p>
            그러나 모든 DLP가 “bit 수의 절반”으로 끝나는 것은 아니다. 소수체의 곱셈군 DLP에는 index calculus 계열의 sub-exponential 공격이 있어
            같은 128-bit 보안을 위해 훨씬 큰 modulus가 필요하다. 타원곡선 DLP와 유한체 DLP의 key 길이를 숫자만으로 비교하면 안 되는 이유다.
          </p>
          <CitationBlock source="NIST SP 800-186" citeKey={1} href="https://doi.org/10.6028/NIST.SP.800-186">
            <p>NIST 표는 P-256, Curve25519, Edwards25519 등을 128-bit security strength 범주에 배치한다.</p>
          </CitationBlock>
        </div>
        <Misconception>
          Bitcoin의 secp256k1과 Ed25519가 모두 “256-bit”라고 해서 같은 표준·인코딩·서명 알고리즘을 쓰는 것은 아니다. 공통점은 약 256-bit 크기의 prime-order elliptic-curve subgroup에서 generic DLP 공격을 고려한다는 수준이다.
        </Misconception>
      </section>

      <section id="applications" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">암호학 응용</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실제 프로토콜은 “DLP가 어렵다” 한 문장만으로 안전해지지 않는다. Diffie-Hellman은 계산 Diffie-Hellman 가정,
            서명은 위조 불가능성 게임, 암호화는 선택한 공격 모델을 각각 명시한다. DLP는 그 증명에 들어가는 기반 가정이다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {applications.map(([name, body, href], index) => (
            <Link key={name} to={href} className="grid gap-2 py-4 hover:bg-muted/20 sm:grid-cols-[3rem_10rem_minmax(0,1fr)] sm:gap-4 sm:px-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span>
              <strong className="text-sm">{name}</strong>
              <span className="text-sm leading-relaxed text-muted-foreground">{body}</span>
            </Link>
          ))}
        </div>
        <CapabilityCheck items={[
          '작은 mod p 예제에서 생성원, 지수, 공개값과 군 위수를 구분할 수 있다.',
          'BSGS의 x=im+j 분해와 baby table·giant step의 일치 조건을 손으로 계산할 수 있다.',
          'BSGS의 O(√n) 시간·메모리와 Pollard rho의 낮은 메모리 generic 공격을 구분할 수 있다.',
          '유한체 DLP와 elliptic-curve DLP의 key bit 수를 직접 비교하면 안 되는 이유를 설명할 수 있다.',
        ]} />
        <div className="not-prose grid gap-3 sm:grid-cols-3">
          <Link to={articlePath('blockchain', 'finite-field-theory')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">더 아래 기반</span><strong className="mt-2 block text-sm">유한체와 생성원</strong></Link>
          <Link to={articlePath('blockchain', 'elliptic-curves')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">다음 구조</span><strong className="mt-2 block text-sm">타원곡선 위의 DLP</strong></Link>
          <Link to={articlePath('blockchain', 'zk-theory')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">다음 프로토콜</span><strong className="mt-2 block text-sm">Schnorr와 영지식 증명</strong></Link>
        </div>
        <SourceNotes sources={[
          { label: 'NIST SP 800-186', href: 'https://doi.org/10.6028/NIST.SP.800-186', note: '권고 elliptic curves와 security-strength 대응.' },
          { label: 'RFC 8032 · Ed25519/Ed448', href: 'https://www.rfc-editor.org/rfc/rfc8032', note: 'EdDSA의 curve, encoding과 서명 절차를 정의한 IETF 표준.' },
          { label: 'SEC 2 · Recommended Elliptic Curve Domain Parameters', href: 'https://www.secg.org/sec2-v2.pdf', note: 'Bitcoin이 사용하는 secp256k1 domain parameters의 원 규격.' },
        ]} />
      </section>
    </div>
  );
}
