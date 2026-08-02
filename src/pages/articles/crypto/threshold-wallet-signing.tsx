import { Link } from 'react-router-dom';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import { ShareSigningExplorer } from './wallet-key-management/viz/WalletKeyExplorers';

export default function ThresholdWalletSigningArticle() {
  return (
    <>
      <section id="sss" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Shamir Secret Sharing은 무엇을 하고 무엇을 하지 않을까?</h2>
        <QuestionLead
          question="브라우저·서비스·백업 share 중 2개로 개인키를 복원한 뒤 일반 ECDSA로 서명하면 threshold ECDSA일까?"
          answer="아니다. 그것은 Shamir share를 이용한 threshold recovery 뒤 단일키 서명을 한 것이다. Threshold signature는 signing 도중에도 원본 개인키를 복원하지 않고 각 party의 share로 공동 계산한다. SSS는 비밀 분산 프리미티브이지 그 자체로 서명 프로토콜이 아니다."
        />
        <ConceptPrimer items={[
          { term: 'Secret sharing', meaning: '비밀을 여러 share로 표현하고 일정 수 이상에서만 복원한다.', why: '백업·복구와 threshold protocol의 장기 key share를 구성하는 기반이다.' },
          { term: 'MPC', meaning: '각 party의 비밀 입력을 공개하지 않고 공동 함수를 계산한다.', why: '원본 키를 만들지 않은 채 signature 계산을 분산하는 일반 도구다.' },
          { term: 'TSS', meaning: 'Threshold Signature Scheme. 일정 수의 signer가 협력해 표준 검증 가능한 signature를 만든다.', why: 'MPC라는 넓은 범위에서 지갑 signing에 필요한 기능을 정확히 가리킨다.' },
          { term: 'DKG', meaning: 'Trusted dealer 없이 참가자들이 key share와 public key를 공동 생성한다.', why: '한 주체가 완성된 개인키를 본 뒤 나누는 초기 단일 실패점을 제거한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            임계값을 <M>t</M>, 전체 share 수를 <M>n</M>이라 하자. Dealer는 유한체 위에서 상수항이 비밀 <M>s</M>인
            <M>{String.raw`t-1`}</M>차 다항식을 만들고, 서로 다른 좌표의 함수값을 share로 나눈다.
          </p>
          <M display>{String.raw`\underbrace{f(x)}_{\text{share를 만드는 다항식}}=\underbrace{s}_{\text{숨길 비밀}}+a_1x+\cdots+a_{t-1}x^{t-1}`}</M>
          <M display>{String.raw`\underbrace{\mathrm{share}_i}_{\text{참가자 }i\text{가 보관}}=\bigl(i,\,f(i)\bigr)`}</M>
          <FormulaNote meaning="왜 비밀을 상수항에 두나: t개의 점으로 다항식을 복원하면 f(0)=s를 얻기 위해서다. 왜 차수를 t-1로 두나: 서로 다른 t개 점은 t-1차 다항식 하나를 정하지만 t-1개 이하 점에는 가능한 상수항이 많이 남기 때문이다." symbols={[["s", '나눌 비밀'], ["t", '복원에 필요한 share 수'], ["n", '전체 share 수'], ["f(i)", '참가자 i에게 전달할 유한체 원소']]} />
          <M display>{String.raw`\underbrace{s}_{\text{복원한 비밀}}=\sum_{i\in S}\underbrace{\lambda_i f(i)}_{\text{각 share의 Lagrange 기여}},\qquad |S|\ge t`}</M>
          <FormulaNote meaning="왜 Lagrange 계수를 곱해 더하나: 선택한 점들을 지나는 유일한 다항식을 x=0에서 평가한 값으로 바꾸기 위해서다. 이 복원 연산을 실제 signing process에서 실행하면 그 순간 원본 키가 메모리에 존재한다." symbols={[["S", '복원에 참여하는 share 집합'], ["\\lambda_i", 'x=0에서의 Lagrange 보간 계수'], ["|S|\\ge t", '이 특정 SSS 설정의 복원 조건']]} />
        </div>
      </section>

      <section id="reconstruct-vs-sign" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">복원 후 서명과 원본 키 없는 공동 서명</h2>
        <ShareSigningExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            복원 후 서명은 단순하고 기존 signing library를 그대로 쓸 수 있다. 대신 복원 process의 memory dump, crash log, swap, debugger와 내부자 접근까지
            원본 키를 보호해야 한다. Threshold signing은 이 노출 지점을 없애지만 round message, commitment, nonce, complaint, abort와 malicious party
            방어가 추가된다.
          </p>
          <p>
            “Partial signature를 합치면 끝”도 모든 방식에 공통인 설명은 아니다. Schnorr 계열은 선형 구조를 활용하기 쉽지만 ECDSA는 nonce inverse와 곱셈
            관계 때문에 MtA, oblivious transfer 또는 zero-knowledge proof 같은 추가 protocol이 필요할 수 있다. 최종 signature 형식이 같아도 내부 round는 다르다.
          </p>
        </div>
        <Misconception>SSS와 TSS는 경쟁 기술이 아니다. Threshold signature는 장기 secret share 표현에 Shamir류 sharing을 사용할 수 있다. 차이는 share가 있다는 사실이 아니라 signing 때 원본 키를 복원하는지, 어떤 MPC protocol로 signature를 계산하는지다.</Misconception>
      </section>

      <section id="dkg" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">DKG가 초기 키 생성의 단일 실패점을 없애는 방법</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            단순 dealer 방식은 한 장치가 완성된 개인키를 만든 뒤 share로 나눈다. 나눈 뒤 메모리를 지워도 생성 순간의 장치가 침해됐다면 모든 share가 무의미하다.
            DKG에서는 각 참가자가 자신의 무작위 다항식과 commitment를 만들고 다른 참가자에게 share contribution을 보낸다. 각자의 최종 share는 받은 contribution의
            합이고, 전체 public key도 공개 contribution의 합으로 정해진다.
          </p>
          <M display>{String.raw`\underbrace{x_i}_{\text{참가자 }i\text{의 최종 share}}=\sum_{j=1}^{n}\underbrace{f_j(i)}_{\text{참가자 }j\text{가 보낸 기여}}`}</M>
          <M display>{String.raw`\underbrace{x}_{\text{개념상 공동 비밀}}=\sum_{j=1}^{n}\underbrace{f_j(0)}_{\text{어느 한 party도 단독으로 모름}}`}</M>
          <FormulaNote meaning="왜 각 참가자의 contribution을 더하나: 적어도 한 정직한 참가자의 무작위 비밀이 남으면 어느 한 party도 최종 secret 전체를 선택하거나 알지 못하게 하기 위해서다. 실제 protocol은 commitment, proof와 complaint로 잘못된 share를 탐지해야 한다." symbols={[["f_j", '참가자 j가 만든 secret-sharing 다항식'], ["x_i", '참가자 i가 signing에 사용할 최종 key share'], ["x", '공개키에 대응하지만 평문으로 만들지 않는 공동 secret']]} />
          <p>
            <strong>Refresh</strong>는 상수항이 0인 새 sharing을 더해 public key는 유지하면서 오래된 share를 무효화한다. <strong>Resharing</strong>은
            threshold나 참가자 집합을 바꾼다. “2-of-3”의 숫자만 같아도 active corruption, adaptive corruption, abort, identifiable blame과 proactive
            refresh를 어떤 보안 모델에서 제공하는지는 protocol마다 다르다.
          </p>
        </div>
      </section>

      <section id="signature-families" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Threshold ECDSA, EdDSA와 FROST를 같은 상자에 넣지 않기</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['FROST / Schnorr', 'RFC 9591은 threshold 수의 signer가 협력하는 2-round Schnorr signature protocol을 명시한다. 2-of-3에서 한 signer가 offline이어도 나머지 2명이 두 round를 완주하면 서명할 수 있다. 각 signer는 참여 집합 S의 Lagrange 계수 λ_i를 자기 share에만 반영하므로 원본 s를 만들지 않는다. 다만 참여자가 중간에 이탈하면 다른 집합으로 session을 재시작해야 한다.'],
            ['Threshold ECDSA', '기존 ECDSA verifier와 호환되는 signature를 만들지만 비선형 연산 때문에 protocol과 proof가 더 복잡하다. 구현 이름만으로 round 수와 보안 모델을 추정하지 않는다.'],
            ['Threshold EdDSA', 'Edwards curve를 쓴다는 사실과 FROST/Schnorr protocol을 쓴다는 사실은 같지 않다. Ciphersuite, key derivation, nonce와 output 호환성을 구체적으로 확인한다.'],
            ['Multi-signature', '각자 독립 key pair를 가진 signer의 signature를 모으는 방식과 하나의 공동 public key에 대한 threshold signature를 구분한다. On-chain 검증 비용과 signer 공개 범위도 달라진다.'],
          ].map(([title, detail], index) => <div key={title} className="grid gap-2 py-5 sm:grid-cols-[3rem_10rem_minmax(0,1fr)]"><code className="text-xs font-black text-muted-foreground">0{index + 1}</code><strong className="text-sm">{title}</strong><p className="text-sm leading-relaxed text-muted-foreground">{detail}</p></div>)}
        </div>
      </section>

      <section id="operations" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실서비스에서 암호 수식 다음에 필요한 것</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Nonce 재사용 방지, authenticated channel, transcript binding, replay 방지, party identity, rate limit, abort recovery, share rotation, 독립 backup과
            감사 log가 protocol security를 제품 security로 이어 준다. Coordinator는 반드시 secret share를 가지지 않아도 signer를 속여 서로 다른 거래에
            참여시키거나 availability를 막을 수 있으므로 별도 위협 주체로 본다.
          </p>
          <p>
            특정 Paillier·MtA 기반 threshold ECDSA round와 코드 경로는 <Link to={articlePath('crypto', 'mpc')}>기존 MPC 구현 심화</Link>에서 이어진다.
            그 글의 조건은 모든 MPC의 보편 법칙이 아니라 선택한 protocol과 라이브러리의 계약으로 읽어야 한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'SSS recovery와 threshold signing을 실행 시점의 원본 키 존재 여부로 구분한다.',
          'DKG, refresh, resharing과 signing을 서로 다른 lifecycle 단계로 설명한다.',
          'Threshold ECDSA와 FROST를 단순 partial-signature aggregation으로 일반화하지 않는다.',
          't-of-n 숫자 외에 adversary model, abort, nonce와 coordinator를 확인한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'NIST IR 8214C · Threshold Call (2026)', href: 'https://csrc.nist.gov/pubs/ir/8214/c/final', note: 'Threshold key generation·signing과 제출 보안 요구사항의 현재 1차 자료.' },
          { label: 'RFC 9591 · FROST', href: 'https://www.rfc-editor.org/rfc/rfc9591.html', note: '2-round Schnorr threshold signature, nonce와 participant binding의 규격.' },
          { label: 'Shamir · How to Share a Secret', href: 'https://dl.acm.org/doi/10.1145/359168.359176', note: '다항식 보간 기반 t-of-n secret sharing의 원 논문.' },
        ]} />
      </section>
    </>
  );
}
