import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation-block";
import ContentBoundary from "@/components/articles/content-boundary";

const FLOW = [
  ["01", "Function", "공개 output과 허용 leakage"],
  ["02", "Adversary", "corruption·network·abort"],
  ["03", "Building blocks", "sharing·encryption·proof"],
  ["04", "Rounds", "session-bound message order"],
  ["05", "Receipt", "result·failure·cost·rollback"],
] as const;

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5">
        <h2 className="text-3xl font-bold">
          MPC: 함수 결과는 공유하되 private inputs은 공유하지 않는다
        </h2>
        <p className="text-lg leading-8">
          Alice의 3과 Bob의 4를 더해 7을 얻되 서로의 input을 알지 못하게 한다고
          해 봅시다. MPC의 질문은 “나누어 계산했는가”가 아니라 실제 party view가
          trusted ideal functionality가 허용한 result·leakage 밖의 정보를 주는지입니다.
        </p>
        <figure data-viz="mpc-security-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-5">
          <figcaption className="mb-4 text-sm font-semibold">
            Private inputs에서 session-bound protocol receipt까지
          </figcaption>
          <div className="grid gap-3 sm:grid-cols-5">
            {FLOW.map(([number, title, description]) => (
              <div key={number} className="min-w-0 rounded-lg border border-border bg-background p-4">
                <span className="text-xs font-semibold text-primary">{number}</span>
                <p className="mt-2 break-words text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </figure>
        <p>
          Shamir sharing, Paillier encryption, DKG는 각각 threshold storage,
          homomorphic arithmetic, dealerless key generation을 담당합니다. 한 building
          block의 security를 전체 protocol의 malicious security·fairness로 확대하면
          안 됩니다.
        </p>
        <ContentBoundary article="mpc" />
      </section>

      <section id="security-model" className="space-y-5">
        <h2 className="text-2xl font-bold">Adversary·network·abort/fairness를 먼저 고정한다</h2>
        <p>
          Semi-honest adversary는 protocol을 따르면서 본 messages로 추가 정보를
          얻으려 하지만 malicious adversary는 message를 변조하고 잘못된 share를
          보내거나 중간에 abort할 수 있습니다. Static/adaptive corruption,
          authenticated channels/broadcast, synchrony/timeout과 corruption threshold도
          security statement의 일부입니다.
        </p>
        <p>
          Privacy가 있어도 fairness는 없을 수 있습니다. 마지막 message를 먼저 본
          공격자가 abort해 자신만 result를 얻는 반례가 가능하므로 output delivery와
          abort 범위를 별도 기록합니다.
        </p>
      </section>

      <section id="shamir" className="scroll-mt-20 space-y-4">
        <h2 className="text-2xl font-bold">Shamir은 독립적인 threshold-sharing primitive입니다</h2>
        <p>
          Secret을 random polynomial의 상수항으로 두고 nonzero points를 shares로
          나눕니다. 복원식, t-share privacy의 전제, 잘못된 share·refresh·VSS 경계는
          MPC 전체 정의와 다른 학습 단위이므로 별도 글로 이동했습니다.
        </p>
        <Link className="font-medium text-primary hover:underline" to="/crypto/shamir-secret-sharing">
          Shamir Secret Sharing 글로 이동 →
        </Link>
      </section>

      <section id="paillier" className="scroll-mt-20 space-y-4">
        <h2 className="text-2xl font-bold">Paillier는 독립적인 확률적 public-key cryptosystem입니다</h2>
        <p>
          Ciphertext 곱을 plaintext 덧셈으로 옮기는 항등식에는 key generation,
          unit randomizer, modulus와 security assumption이 붙습니다. Homomorphism을
          active MPC input proof나 ciphertext integrity로 확대하지 않는 경계는 별도
          글에서 유도합니다.
        </p>
        <Link className="font-medium text-primary hover:underline" to="/crypto/paillier-cryptosystem">
          Paillier Cryptosystem 글로 이동 →
        </Link>
      </section>

      <section id="dkg" className="space-y-5">
        <h2 className="text-2xl font-bold">DKG round를 session-bound artifact로 보존한다</h2>
        <p>
          Protocol/source version, session ID, party public identities·indices, n/t,
          curve/group, commitment·encrypted-share·proof messages, round order,
          complaints·disqualifications와 accepted group public key를 receipt에 넣습니다.
          Session ID나 roster hash가 빠지면 이전 ceremony의 commitment를 새 ceremony에
          replay할 수 있습니다.
        </p>
        <p>
          DKG의 output은 한 명이 전체 secret을 얻지 않은 public key와 secret
          shares입니다. Application signature protocol, nonce generation, resharing과
          membership rotation은 별도 protocol/version입니다.
        </p>
      </section>

      <section id="release" className="space-y-5">
        <h2 className="text-2xl font-bold">Active failures·dropout·restart를 통과한 뒤 성능을 재다</h2>
        <p>
          Duplicate party/index, out-of-field share, invalid commitment, malformed key,
          reordered/cross-session round, false/valid complaint, dropout, timeout과
          crash/restart를 replay합니다. 같은 n/t·adversary/network model·security
          parameter·hardware에서 rounds, messages, wire bytes, p50/p99 latency,
          CPU/RSS를 나누고 regression이면 이전 protocol generation으로 rollback합니다.
        </p>
        <div id="paper-tsslib-source">
          <CitationBlock
            source="bnb-chain/tss-lib pinned source 3f677ff"
            citeKey={1}
            href="https://github.com/bnb-chain/tss-lib/tree/3f677ff761fcf692edb0243a5d812930844d879a"
          >
            <p><b>문제:</b> Threshold DKG/MtA/VSS의 concrete implementation seam을 고정합니다.</p>
            <p><b>기여:</b> Official Go source·tests의 pinned snapshot입니다.</p>
            <p><b>전제:</b> Commit과 protocol/toolchain/dependency profile을 함께 pin합니다.</p>
            <p><b>근거 범위:</b> 선택 source의 round·artifact behavior입니다.</p>
            <p><b>말하지 않는 것:</b> Generic MPC 정의나 모든 threshold scheme을 대신하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
