import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { BrowserThreatLab } from './wallet-key-management/viz/WalletKeyExplorers';

export default function BrowserWalletRecoveryArticle() {
  return (
    <>
      <section id="serverless-term" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Serverless wallet은 암호학 보안 속성일까?</h2>
        <QuestionLead
          question="서버가 key share를 데이터베이스에 저장하지 않고 브라우저에서 WASM으로 서명하면 자동으로 self-custody일까?"
          answer="아니다. `serverless`는 표준화된 threshold cryptography 용어가 아니라 배포·제품 설명이다. 서버가 raw share를 저장하지 않아도 인증, ciphertext, policy, 코드 배포, coordinator와 복구를 통제할 수 있다. 브라우저 WASM도 secure enclave가 아니므로 같은 origin의 악성 script와 거래 바꿔치기를 따로 방어해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            서버가 없는지 묻기보다 서버가 무엇을 할 수 있는지 묻는다. 로그인 assertion을 발급하는가, encrypted share를 전달하는가, 새 장치를 승인하는가,
            signing session을 연결하는가, frontend code를 배포하는가, provider outage 때 사용자가 독립적으로 이탈할 수 있는가를 분리한다.
          </p>
          <p>
            `Client-side signing`도 하나의 보장만 말한다. 최종 signing computation이 client process에서 일어났다는 뜻일 수 있지만, 그 process에 들어온 key
            material과 transaction intent가 안전하다는 뜻은 아니다. 공격자가 같은 page의 script를 장악하면 사용자가 보는 주소와 실제 digest를 함께 바꿀 수 있다.
          </p>
        </div>
      </section>

      <section id="deterministic-trap" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">결정론적 share 재생성에서 가장 위험한 한 줄</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 입력에서 같은 share를 재생성하면 저장과 복구가 쉬워 보인다. 그러나 UID, email, phone number와 공개 salt만 입력하면 공격자도 같은 후보를
            계산할 수 있다. HKDF는 이미 충분한 entropy를 가진 input keying material을 독립된 key로 펼치는 도구이지, 공개 식별자에서 비밀 entropy를 만드는
            password hashing 장치가 아니다.
          </p>
          <M display>{String.raw`\underbrace{k_i}_{\text{재생성된 share}}=\operatorname{HKDF}(\underbrace{\mathrm{salt}}_{\text{공개 가능}},\underbrace{\mathrm{UID}\|i}_{\text{추측 가능한 입력}})`}</M>
          <FormulaNote meaning="왜 위험한가: 함수와 salt를 아는 공격자가 UID 후보마다 같은 출력을 offline으로 계산할 수 있기 때문이다. Salt는 계정 간 같은 출력과 미리 계산한 표의 재사용을 줄이지만 UID를 비밀로 만들지 않는다." symbols={[["k_i", 'i번째 party나 용도의 결정론적 출력'], ["\\mathrm{UID}", 'email·전화번호·사용자 ID 같은 식별자'], ["\\mathrm{salt}", '비밀일 필요는 없지만 독립적으로 선택해야 하는 값']]} />
          <M display>{String.raw`\underbrace{H_{\infty}(KDF(X))}_{\text{출력의 추측 난이도}}\le\underbrace{H_{\infty}(X)}_{\text{입력에 원래 있던 비밀 entropy}}`}</M>
          <FormulaNote meaning="왜 entropy가 늘지 않나: 결정론적 함수는 공격자가 고려해야 할 입력 후보 수를 새로 만들지 못하기 때문이다. 안전한 설계는 장치에서 생성한 고엔트로피 secret, passkey·secure hardware가 보호하는 비밀, 강한 사용자 비밀용 KDF 또는 별도 threshold recovery protocol 중 어떤 신뢰를 쓰는지 명시해야 한다." symbols={[["H_\\infty", '가장 가능성 높은 후보를 맞히는 난이도를 나타내는 min-entropy'], ["X", 'KDF에 들어가는 실제 비밀 입력']]} />
        </div>
        <Misconception>“저장하지 않는다”와 “공격자가 계산할 수 없다”는 다른 속성이다. 결정론적 재생성은 데이터베이스 유출을 줄일 수 있지만 입력 entropy와 인증·rate-limit·복구 경계가 약하면 공격 표면을 계산 문제로 옮길 뿐이다.</Misconception>
      </section>

      <section id="browser-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">WASM, WebCrypto와 secure hardware의 경계</h2>
        <BrowserThreatLab />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['WASM', '검증된 memory-safe sandbox와 빠른 암호 구현을 제공한다. 그러나 같은 page의 JavaScript, imported function, DOM과 공급망 script로부터 비밀을 격리하는 enclave는 아니다.'],
            ['WebCrypto', 'CryptoKey를 non-extractable로 만들어 raw export를 막을 수 있다. W3C 규격은 실제 key storage, disk encryption, hardware binding이나 참조 제거 후 zeroization을 보장하지 않는다.'],
            ['Secure Enclave / TEE', 'OS·browser보다 좁은 실행 경계와 hardware-backed key를 제공할 수 있다. Attestation, rollback, side channel, vendor recovery와 transaction UI binding은 별도 검토가 필요하다.'],
            ['Passkey / WebAuthn', '사용자·장치 인증과 user presence를 강화한다. Blockchain transaction 자체의 의미와 금액을 사용자가 확인했다는 보장은 wallet이 별도로 묶어야 한다.'],
          ].map(([title, detail], index) => <div key={title} className="grid gap-2 py-5 sm:grid-cols-[3rem_10rem_minmax(0,1fr)]"><code className="text-xs font-black text-muted-foreground">0{index + 1}</code><strong className="text-sm">{title}</strong><p className="text-sm leading-relaxed text-muted-foreground">{detail}</p></div>)}
        </div>
      </section>

      <section id="identity-intent" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">OAuth 로그인 성공이 서명 승인이 아닌 이유</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            OIDC identity assertion은 “이 session이 이 사용자와 연결됐다”는 근거다. Transaction authorization은 “이 사용자가 이 chain에서 이 recipient에게
            이 amount를 보내는 바로 이 payload를 승인했다”는 근거다. 두 사건 사이에 policy evaluation, fresh challenge, human-readable transaction,
            origin·device binding과 replay 방지가 필요하다.
          </p>
          <p>
            OAuth token 탈취가 곧 key share 탈취는 아닐 수 있다. 그러나 서비스가 OAuth session 하나만으로 provider-held signer와 복구를 모두 승인한다면
            결과적으로 단독 서명 권한과 비슷해진다. 반대로 device share만 있어도 frontend가 악성 digest를 보여 주면 사용자가 공격자의 거래에 직접 서명할 수 있다.
            Identity와 key isolation 어느 하나만으로 transaction intent가 완성되지 않는다.
          </p>
        </div>
      </section>

      <section id="recovery" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">복구 설계가 실제 custody 모델을 결정한다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['장치 추가', '새 장치의 public key와 사용자 승인을 기존 독립 signer가 확인하는가? OAuth session 하나로 조용히 share가 복제되지 않는가?'],
            ['Backup share', 'Cloud backup은 암호화되어 있고 복호 key는 다른 경계에 있는가? Provider와 cloud 계정 동시 침해를 하나의 failure로 모델링했는가?'],
            ['Rotation / refresh', '주기적 또는 침해 대응 refresh 뒤 옛 share로는 signing quorum을 만들 수 없는가? Public key·주소 변경 여부와 migration을 명시했는가?'],
            ['Disaster recovery', 'Provider outage, 사용자 사망·장기 부재, 규제 동결, chain fork에서 누가 어떤 증거와 timelock으로 권한을 회복하는가?'],
            ['Audit', '어떤 identity·device·policy·transaction digest·party set이 서명에 참여했는지 secret을 노출하지 않고 추적 가능한가?'],
          ].map(([title, detail], index) => <div key={title} className="grid gap-2 py-5 sm:grid-cols-[3rem_10rem_minmax(0,1fr)]"><code className="text-xs font-black text-muted-foreground">0{index + 1}</code><strong className="text-sm">{title}</strong><p className="text-sm leading-relaxed text-muted-foreground">{detail}</p></div>)}
        </div>
        <CapabilityCheck items={[
          'Serverless를 표준 암호 속성이 아니라 검증해야 할 배포 주장으로 취급한다.',
          'UID·salt·HKDF가 비밀 entropy를 만들지 못하는 이유를 설명한다.',
          'WASM, WebCrypto와 hardware isolation의 보장 범위를 구분한다.',
          '로그인·정책·거래 의도·signing quorum·broadcast를 별도 단계로 검증한다.',
          '정상 서명과 같은 깊이로 장치 손실·provider 장애·share rotation을 설계한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'RFC 5869 · HKDF', href: 'https://www.rfc-editor.org/rfc/rfc5869.html', note: 'Input keying material의 entropy 가정과 extract-then-expand 구조.' },
          { label: 'W3C · Web Cryptography Level 2', href: 'https://www.w3.org/TR/WebCryptoAPI/', note: 'CryptoKey storage, non-extractable key와 script injection·zeroization 한계.' },
          { label: 'W3C · WebAssembly Core 3.0', href: 'https://www.w3.org/TR/wasm-core/', note: 'Memory-safe sandbox와 embedder·hardware side-channel 경계.' },
          { label: 'RFC 9700 · OAuth 2.0 Security BCP', href: 'https://www.rfc-editor.org/rfc/rfc9700.html', note: 'PKCE, replay 방지, sender-constrained token과 최신 OAuth 공격 모델.' },
          { label: 'OpenID Connect Core 1.0', href: 'https://openid.net/specs/openid-connect-core-1_0.html', note: '인증 identity layer와 ID Token의 역할.' },
        ]} />
      </section>
    </>
  );
}
