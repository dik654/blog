import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import { AuthorizationPipelineExplorer, CustodyAuthorityExplorer } from './wallet-key-management/viz/WalletKeyExplorers';

function RouteRow({ number, slug, title, question }: { number: string; slug: string; title: string; question: string }) {
  return (
    <Link to={articlePath('crypto', slug)} className="group grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[3rem_12rem_minmax(0,1fr)_1.5rem] sm:items-start">
      <code className="text-xs font-black text-muted-foreground">{number}</code>
      <strong className="text-sm">{title}</strong>
      <span className="text-sm leading-relaxed text-muted-foreground">{question}</span>
      <ArrowRight className="hidden h-4 w-4 transition-transform group-hover:translate-x-1 sm:block" aria-hidden="true" />
    </Link>
  );
}

export default function WalletKeyManagementMapArticle() {
  return (
    <>
      <section id="current-question" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이 개념들은 최근에 생긴 것일까?</h2>
        <QuestionLead
          question="MPC wallet, embedded wallet, serverless wallet이 모두 ‘개인키를 서버에 저장하지 않는다’고 말하면 같은 보안 구조일까?"
          answer="아니다. Shamir 비밀 분산과 MPC는 오래된 기반이고, 최근 변화는 이 기술을 소셜 로그인·브라우저·TEE·smart account·정책 엔진과 묶어 일반 사용자에게 제공하는 제품화다. 제품 이름 대신 누가 단독 서명할 수 있는지, 누가 복구와 정책 변경을 할 수 있는지를 확인해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Shamir Secret Sharing은 1979년 논문까지 내려가고 MPC와 threshold signature도 수십 년의 연구가 있다. 반면 NIST는 두 차례 공개 초안을 거쳐
            2026년 1월 첫 Multi-Party Threshold Schemes 공개 모집의 최종본을 발행했다. 즉 원리가 갑자기 생긴 것이 아니라, 구현·상호운용·평가 기준을 산업 규모로 정리하는 과정이 현재 진행 중이다.
          </p>
          <p>
            Privy, Web3Auth, Lit Protocol, Fireblocks, Coinbase WaaS, Turnkey, DFNS와 Safe를 한 줄의 “지갑 서비스”로 비교하면 중요한 차이를 놓친다.
            인증 SDK, embedded wallet, threshold signing, TEE 기반 키 실행, 기관 custody, smart account는 서로 다른 층이다. 한 제품이 여러 층을 묶을 수도 있다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Authentication', meaning: '지금 요청한 사용자가 누구인지 확인한다.', why: 'Google·Apple 로그인이 성공해도 어떤 거래든 서명해도 된다는 뜻은 아니다.' },
          { term: 'Signing authority', meaning: '유효한 blockchain signature를 실제로 만들 수 있는 권한이다.', why: 'Custody의 핵심은 파일 위치가 아니라 이 권한을 누가 단독 또는 공동으로 행사하는가다.' },
          { term: 'Recovery authority', meaning: '장치·share를 잃었을 때 서명 능력을 다시 만드는 권한이다.', why: '주 서명 경로보다 약한 복구 경로가 전체 시스템의 실제 보안 강도가 되기 쉽다.' },
          { term: 'Policy authority', meaning: '금액·대상·시간·승인자 같은 서명 조건을 바꿀 권한이다.', why: '키 share가 분산되어도 한 서버가 정책과 coordinator를 모두 통제하면 새로운 집중점이 생긴다.' },
        ]} />
      </section>

      <section id="authority-not-label" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Custody는 키 파일 위치가 아니라 권한 그래프다</h2>
        <CustodyAuthorityExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Custodial</strong>은 보통 서비스가 사용자를 대신해 서명 권한을 행사한다. <strong>Self-custody</strong> 또는
            <strong> non-custodial</strong>은 사용자가 최종 통제권을 가진다는 주장이다. 그러나 이 말만으로 장치 분실, 서비스 장애, 법적 동결, 관리자
            override와 복구 조건은 알 수 없다.
          </p>
          <p>
            <strong>Embedded wallet</strong>은 지갑 UX가 앱 안에 들어왔다는 제품 형태다. 구현은 사용자 장치 키, TEE, threshold signing 또는
            server-controlled wallet 중 어느 쪽도 될 수 있다. <strong>Smart wallet</strong>은 계정 contract가 signer·session key·recovery 규칙을
            검증하는 구조이며, 그 signer의 키 관리 문제는 여전히 남는다.
          </p>
        </div>
        <Misconception>`non-custodial`이라는 마케팅 문구만으로 충분하지 않다. 서비스가 단독으로 share를 복구하거나 정책을 바꾸거나 사용자의 승인 없이 signer quorum을 구성할 수 있다면 통제권 주장을 다시 검토해야 한다.</Misconception>
      </section>

      <section id="wallet-shapes" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">아키텍처 문서에서 먼저 찾을 네 문장</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['정상 서명', '평상시 누가 어떤 장치와 서버를 거쳐 동일한 transaction digest에 동의해야 하는가?'],
            ['단독 침해', '브라우저, 앱 서버, provider, backup 중 하나만 탈취했을 때 공격자가 서명 가능한가?'],
            ['복구', '장치 분실 뒤 어떤 증거와 대기 시간으로 새 share를 만들며, 누가 이 절차를 거부하거나 우회할 수 있는가?'],
            ['이탈', '서비스가 중단되거나 계약이 종료되어도 사용자가 다른 구현으로 키·계정 통제권을 옮길 수 있는가?'],
          ].map(([title, detail], index) => (
            <div key={title} className="grid gap-2 py-5 sm:grid-cols-[3rem_9rem_minmax(0,1fr)]">
              <code className="text-xs font-black text-muted-foreground">0{index + 1}</code><strong className="text-sm">{title}</strong><p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="auth-signing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">로그인과 거래 서명 사이를 닫기</h2>
        <AuthorizationPipelineExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            OpenID Connect는 OAuth 2.0 위에서 사용자의 identity를 전달한다. 이 identity는 지갑 계정을 찾는 입력이 될 수 있지만, 그 자체가 특정 chain의
            특정 transaction에 대한 의도는 아니다. 정책 엔진은 로그인 세션, device binding, 위험 신호를 보고 권한을 결정하고, 사용자가 실제로 보는
            recipient·amount·contract method와 서명할 digest를 묶어야 한다.
          </p>
          <p>
            Threshold signer가 두 개여도 둘 다 같은 브라우저 session의 지시를 무조건 따른다면 독립성이 약하다. 서로 다른 party가 같은 digest와 policy
            context를 확인하고 replay-resistant nonce를 사용해야 분산된 key share가 분산된 승인으로 이어진다.
          </p>
        </div>
      </section>

      <section id="bounded-route" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">현재 지도에서 필요한 바닥으로 내려가는 세 단계</h2>
        <div className="border-y border-border">
          <RouteRow number="01" slug="threshold-wallet-signing" title="SSS → MPC/TSS" question="비밀 복구와 원본 키 없는 공동 서명을 어떻게 구분하며 DKG·refresh는 어디에 들어가는가?" />
          <RouteRow number="02" slug="browser-wallet-recovery" title="브라우저·복구" question="Serverless·결정론적 share·OAuth·WASM 주장을 어떤 위협 모델로 검증하는가?" />
          <RouteRow number="03" slug="mpc" title="프로토콜 구현" question="Shamir, Paillier와 threshold ECDSA의 실제 round와 코드 경로는 어떻게 이어지는가?" />
        </div>
        <CapabilityCheck items={[
          '지갑 제품을 서명·복구·정책·서비스 의존의 네 권한으로 분해한다.',
          'Embedded, smart, threshold와 non-custodial이 서로 다른 분류 축임을 설명한다.',
          '로그인 인증과 transaction authorization을 분리한다.',
          '최신 제품 문구에서 실제 trust boundary와 단독 실패점을 찾는다.',
        ]} />
        <SourceNotes sources={[
          { label: 'NIST · Multi-Party Threshold Cryptography', href: 'https://csrc.nist.gov/Projects/threshold-cryptography', note: '2026 Threshold Call과 원본 키를 복원하지 않는 threshold operation의 정의.' },
          { label: 'OpenID Connect Core 1.0', href: 'https://openid.net/specs/openid-connect-core-1_0.html', note: 'OAuth 위의 identity layer와 authentication response의 범위.' },
          { label: 'EIP-4337 · Account Abstraction', href: 'https://eips.ethereum.org/EIPS/eip-4337', note: 'Smart account의 검증·실행·bundling 구조를 읽기 위한 1차 규격.' },
          { label: 'Privy · Wallets overview', href: 'https://docs.privy.io/wallets/overview', note: 'Embedded, user-controlled, server-controlled wallet이 한 제품군에 공존하는 현재 사례.' },
        ]} />
      </section>
    </>
  );
}
