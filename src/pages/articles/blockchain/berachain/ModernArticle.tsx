import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ModernBerachainViz from "./viz/ModernBerachainViz";

export default function ModernBerachainArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Berachain · security and incentives
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Berachain은 BERA stake로 block proposer를 정하고, 별도 BGT flow로
            liquidity·application activity에 emission 방향을 연결한다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          처음에는 세 token을 분리합니다. <strong>BERA</strong>는 gas와
          validator security bond, <strong>BGT</strong>는 non-transferable
          governance·boost·reward token, <strong>HONEY</strong>는 별도
          stablecoin product입니다. BGT를 보유하거나 Reward Vault에 liquidity
          receipt를 맡긴 사실이 consensus finality를 직접 만드는 것은 아닙니다.
        </p>
        <p>
          고정 사례는 user가 eligible receipt token 100개를 vault에 stake하고
          전체 stake가 1,000개인 경우입니다. 해당 기간 vault에 50 BGT가 배정되면
          단순 share는 10%이므로 5 BGT입니다. 실제 reward
          rate·duration·boost·commission·whitelist와 contract generation은
          onchain 상태를 조회합니다.
        </p>
        <ContentBoundary article="berachain" />
        <ModernBerachainViz />
        <div id="paper-berachain-pol">
          <CitationBlock
            source="Berachain · Proof of Liquidity overview"
            citeKey={1}
            type="paper"
            href="https://docs.berachain.com/general/proof-of-liquidity/overview"
          >
            <p>
              <strong>문제:</strong> Validator security와 application liquidity
              incentive를 하나의 undifferentiated staking flow로 두지 않고
              연결해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> BERA validator lifecycle, BGT boost, block
              emissions, reward allocation과 vault stake의 공식 lifecycle을
              설명합니다.
            </p>
            <p>
              <strong>전제:</strong> 2026-08-14에 확인한 current Berachain
              docs와 deployed governance/configuration surface입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> PoL actor·token·reward direction의
              현재 conceptual contract입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 특정 APR·active-set size·emission
              parameter가 영구 고정되거나 incentive가 consensus safety를
              대신한다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="pol-flow" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · PoL flow</p>
          <h2 className="mt-2 text-2xl font-bold">
            Receipt stake→BGT earning→validator boost→vault allocation은 네 개의
            state transition이다
          </h2>
        </header>
        <ExplainedFormula
          question="Vault 전체 1,000 units 중 100 units를 stake했고 50 BGT가 배정되면 단순 pro-rata reward는 얼마인가요?"
          idea="같은 accounting interval의 user balance를 total eligible stake로 나눈 share에 distributable reward를 곱합니다."
          formula={String.raw`R_u=R_v\frac{s_u}{S_v}`}
          annotatedFormula={String.raw`R_u=\underbrace{R_v\frac{s_u}{S_v}}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`R_v\frac{s_u}{S_v}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","같은 accounting interval의 user","balance를 total eligible stake로 나눈","share에 distributable reward를 곱합니다."] },
          ]}
          terms={[
            {
              symbol: "Rᵤ",
              name: "user reward",
              description:
                "해당 accounting interval에 user가 적립한 BGT입니다.",
            },
            {
              symbol: "Rᵥ",
              name: "vault distributable reward",
              description: "Vault accounting에 실제 notify된 BGT reward입니다.",
            },
            {
              symbol: "sᵤ",
              name: "user eligible stake",
              description:
                "Interval과 delegation rule을 반영한 user stake units입니다.",
            },
            {
              symbol: "Sᵥ",
              name: "vault total eligible stake",
              description: "같은 interval의 전체 eligible stake units입니다.",
            },
          ]}
          assumptions={[
            "Reward와 stake가 같은 interval·precision을 사용합니다.",
            "Vault가 whitelisted이고 reward period가 활성 상태입니다.",
            "Boost·validator allocation은 Rᵥ를 만드는 앞 단계이며 이 share 식과 분리합니다.",
            "APR·token price·withdrawal availability를 이 식 하나로 보장하지 않습니다.",
          ]}
          interpretation="100/1,000=10%이고 Rv=50이면 Ru=5 BGT입니다. User share가 같아도 validator allocation이나 vault reward가 0이면 reward도 0입니다."
        />
        <p>
          User는 protocol action으로 receipt token을 얻고 Reward Vault에 stake해
          BGT를 적립합니다. BGT holder는 validator를 boost할 수 있고,
          validator는 자신에게 발생한 variable emission을 whitelisted vault들에
          percentage로 allocation합니다. Protocol은 incentive tokens로
          allocation을 유도할 수 있습니다. Vault 생성과 emission eligibility는
          같지 않으며 governance whitelist를 확인해야 합니다.
        </p>
        <p>
          BGT는 일반 ERC-20처럼 자유 전송되는 token으로 취급하지 않습니다.
          Governance·boost·reward 권한과 BERA로의 current redemption path는
          contract/API version을 고정해 해석합니다. BGT price를 임의
          시장가격으로 두거나 one-way redemption을 양방향 peg로 부르지 않습니다.
        </p>
        <div id="paper-berachain-vault">
          <CitationBlock
            source="Berachain · Reward Vaults"
            citeKey={2}
            type="paper"
            href="https://docs.berachain.com/general/proof-of-liquidity/reward-vaults"
          >
            <p>
              <strong>문제:</strong> Protocol activity receipt를 stake한
              users에게 validator-directed BGT emission을 accounting해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Vault stake·delegation·reward
              modes·incentives·whitelisting과 reward-rate 계산 surface를
              문서화합니다.
            </p>
            <p>
              <strong>전제:</strong> Current RewardVault
              implementation/configuration과 onchain manager/governance 권한을
              확인합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Vault 내부 balance·reward
              distribution과 eligibility lifecycle입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 표시 APR의 실현, principal
              safety, incentive token value 또는 모든 vault의 audit status를
              보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="consensus-boundary" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · consensus boundary
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            BeaconKit의 CometBFT·Engine API block path와 PoL reward accounting을
            분리한다
          </h2>
        </header>
        <p>
          BeaconKit은 Engine API-compatible execution client에서 payload를 받아
          CometBFT consensus 경로로 합의하는 modular consensus framework입니다.
          Validator의 BERA stake와 consensus messages가 block
          ordering/finality에 참여합니다. Execution payload validity, consensus
          vote certificate, state commit과 PoL distribution receipt는 서로 다른
          evidence입니다.
        </p>
        <p>
          따라서 “vault TVL이 커졌다→chain security가 같은 비율로 커졌다”거나
          “BGT governance vote가 block을 finalized했다”고 말하지 않습니다.
          Incentive design은 validator·protocol 행동과 centralization pressure를
          바꿀 수 있으나 safety/liveness는 authenticated committee, fault bound,
          networking과 implementation correctness를 별도로 검증합니다.
        </p>
        <div id="paper-berachain-beaconkit">
          <CitationBlock
            source="BeaconKit · pinned implementation"
            citeKey={3}
            type="code"
            href="https://github.com/berachain/beacon-kit/tree/59c0fd169f024e2a0ca95b4d550012eab3e4fee9"
          >
            <p>
              <strong>문제:</strong> EVM execution payload를 CometBFT-based
              consensus client와 Engine API boundary에서 처리해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> BeaconKit modules, proposal processing,
              execution-client integration과 state transition의 executable
              source를 제공합니다.
            </p>
            <p>
              <strong>전제:</strong> Commit 59c0fd16, matching execution
              client·chain spec·CometBFT/configuration을 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Pinned source의 consensus/execution
              integration seam입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> PoL incentives가 consensus
              theorem이거나 임의 deployment가 같은 finality·performance를 낸다는
              뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="berachain-release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Token·vault·validator·chain generation을 한 manifest에 묶고 reward와
            finality를 따로 대조한다
          </h2>
        </header>
        <p>
          Release fixture는 vault whitelist 추가/제거, allocation 합계, zero
          reward, delegation withdraw authority, incentive depletion, BGT
          redemption, validator miss, Engine API rejection, reorg/restart를
          포함합니다. BERA stake snapshot·BGT boost·BeraChef allocation·vault
          accounting·block/commit receipt를 같은 height와 contract
          generation에서 연결합니다.
        </p>
        <p>
          기초 6문제는 세 token, fixed reward share, boost/allocation/vault와
          consensus 경계를 묻습니다. 심화 4문제는 whitelist governance,
          incentive attack, validator/reward reconciliation과 rollback release
          matrix를 설계하게 합니다.
        </p>
      </section>
    </article>
  );
}
