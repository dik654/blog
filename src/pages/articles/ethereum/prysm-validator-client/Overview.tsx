import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import PrysmConsensusViz from "../prysm-consensus-viz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Validator client는 key를 가진 자동화 도구가 아니라 deadline 안에서 한 번만 안전하게 서명하는 실행기다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Validator는 모든 slot에 같은 일을 하지 않습니다. Beacon node가 계산한 proposer·attester·aggregator·sync-committee
          duty를 받아 정해진 시간에 수행합니다. Fork domain과 signing root를 검토한 뒤 local key 또는 remote signer에 서명을 요청합니다. 이때
          잘못된 재시도 한 번이 같은 slot의 conflicting block이나 같은 target epoch의 double vote를 만들어 slashable evidence가 될 수
          있습니다.
        </p>
        <p>
          이 글은 <strong>duty 조회→slot deadline→signing context→keymanager trust boundary→slashing-protection
          transaction→submission receipt→failover</strong> 순서로 내려갑니다. Beacon state·head·finality 계산은
          <Link to="/blockchain/prysm"> Prysm 개요</Link>와 세부 글이 소유하며, validator client는 그 결과를 검증 가능한
          signing request로 바꾸는 경계만 소유합니다.
        </p>
      </div>

      <ContentBoundary article="prysm-validator-client" />
      <PrysmConsensusViz mode="validator" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>핵심 아이디어: duty ID와 signing history를 같은 원자적 결정으로 묶습니다</h3>
        <p>
          최소 duty identity에는 validator public key/index, duty type, slot 또는 source·target epoch, fork domain과
          signing root가 들어갑니다. 서명 전에 이 identity를 slashing-protection history와 비교합니다. 허용된 signing root를 기록하는
          시점과 실제 signature receipt의 관계도 명시해야 합니다. “Timeout이 났으니 다른 signer에서 다시 시도”하는 방식은 첫 요청이 성공했는지 모르는 상태에서
          두 번째 signature를 만들 수 있으므로 안전하지 않습니다.
        </p>
        <p>
          예를 들어 slot 100의 proposal root R1을 remote signer에 보낸 뒤 응답만 잃었다면 같은 stable duty ID로 R1의 receipt를 조회하거나
          동일 root 재요청만 허용해야 합니다. R2로 바꿔 blind retry하면 두 signed block이 network에 보이는 순간 proposer slashing 조건을
          만족할 수 있습니다.
        </p>

        <h3>Local key와 remote signer는 위험이 없어지는 대신 위치가 달라집니다</h3>
        <p>
          Local keymanager는 secret key를 validator host에서 복호화하므로 file permission, memory exposure와 backup이 핵심
          경계입니다. Remote signer는 secret을 분리합니다. 대신 authentication과 authorization, network partition, signer-
          side slashing history, timeout reconciliation이 새 dependency로 붙습니다. 어느 방식이든 beacon node가 준 object를
          그대로 서명하지 않고 domain·root·duty·chain identity를 확인해야 합니다.
        </p>
      </div>

      <div id="paper-ethereum-validator-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications — Honest Validator"
          href="https://github.com/ethereum/consensus-specs/blob/master/specs/phase0/validator.md"
          citeKey={1}
        >
          이 규격은 validator가 proposer·attester·aggregator duty를 언제 어떻게 수행하는지 설명합니다. Duty timing과 head
          선택은 active fork·network configuration에 귀속하며 특정 client의 retry·key storage 구현을 정하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-eip3076" className="scroll-mt-24">
        <CitationBlock
          source="EIP-3076 — Slashing Protection Interchange Format"
          href="https://eips.ethereum.org/EIPS/eip-3076"
          citeKey={2}
        >
          EIP-3076은 validator key를 client 사이에 옮길 때 signed block과 attestation history를 교환하는 JSON format을
          정의합니다. 파일을 import했다는 사실만으로 source DB가 완전히 멈췄거나 active/standby 동시 서명이 차단됐다는 뜻은
          아닙니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-validator-source" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.prysm.repository} citeKey={3} type="code">
          Prysm repository는 duty loop, keymanager와 slashing-protection database의 implementation 근거입니다. 실제 flag,
          schema와 backend는 release에 따라 바뀔 수 있으므로 binary version·SHA를 함께 기록합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
