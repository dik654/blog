import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation-block";
import { codeRefs } from "./codeRefs";
import AttestationFlowViz from "./viz/AttestationFlowViz";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-primary">먼저 한 문장으로</p>
          <h2 className="mt-2 break-keep text-3xl font-bold leading-tight">
            Attestation은 validator가 본 head와 checkpoint를 한 장에 서명해,
            fork choice와 finality에 보내는 표입니다
          </h2>
        </div>
        <p className="text-lg leading-8">
          하지만 서명한 순간 곧바로 chain에 반영되지는 않습니다. Duty를
          확인하고, 충돌 서명을 막고, 맞는 subnet으로 보내고, 같은 내용을 지지한
          표끼리 집계한 뒤, proposer가 block에 포함해야 합니다.
        </p>
        <p>
          아래에서는 validator 17의 표 한 장을 slot 352부터 끝까지 따라갑니다.
          이 한 장이 “지금 어느 block을 따라갈까?”와 “어느 checkpoint를
          확정할까?”라는 두 질문에 어떻게 나뉘어 쓰이는지가 이 글의 결론입니다.
        </p>
        <AttestationFlowViz />
      </div>

      <section id="fixed-case" className="mt-12 space-y-5 scroll-mt-20">
        <h3 className="break-keep text-xl font-bold">
          표 한 장의 내용을 먼저 고정합니다
        </h3>
        <div
          className="not-prose grid gap-px bg-border p-px sm:grid-cols-4"
          aria-label="Prysm attestation 설명용 fixture"
        >
          {[
            ["Duty", "validator 17", "slot 352 · committee 2 · position 17"],
            ["Head", "B352", "지금 따라가야 한다고 본 block"],
            ["Source", "J10", "이미 justified된 checkpoint"],
            ["Target", "T11", "이번 epoch에서 justify할 checkpoint"],
          ].map(([label, value, detail]) => (
            <article key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">
                {label}
              </span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">
                {detail}
              </p>
            </article>
          ))}
        </div>
        <p>
          Head B352는 LMD-GHOST가 현재 branch를 고를 때 쓰는 표입니다. Source
          J10에서 target T11로 향하는 표는 Casper FFG의 justification·finality에
          쓰입니다. 같은 메시지 안에 들어 있지만 판단 규칙과 결과 포인터는
          다릅니다.
        </p>
      </section>

      <section id="names" className="mt-12 space-y-5 scroll-mt-20">
        <h3 className="break-keep text-xl font-bold">
          동작을 본 뒤 이름을 붙입니다
        </h3>
        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-3">
          {[
            [
              "AttestationData",
              "slot·committee와 head·source·target을 담은 투표 내용입니다.",
            ],
            [
              "Attestation",
              "투표 내용에 참여 bit와 BLS signature를 붙인 전파 단위입니다.",
            ],
            [
              "AggregateAndProof",
              "Aggregator 자격 증명과 여러 참여자의 집계 결과를 묶은 object입니다.",
            ],
          ].map(([name, meaning]) => (
            <article key={name} className="min-w-0 bg-background p-4">
              <h4 className="font-mono text-xs font-black text-primary">
                {name}
              </h4>
              <p className="mt-3 break-keep text-xs leading-6 text-muted-foreground">
                {meaning}
              </p>
            </article>
          ))}
        </div>
        <p>
          Electra 전후에는 committee를 표현하는 schema가 달라질 수 있습니다.
          그러므로 “Attestation은 항상 이 필드 모양”이라고 외우기보다, 활성
          fork에서 같은 세 주장과 참여자를 어떻게 표현하는지 확인해야 합니다.
        </p>
      </section>

      <section id="why-pipeline" className="mt-12 space-y-5 scroll-mt-20">
        <h3 className="break-keep text-xl font-bold">
          왜 서명·전파·집계·포함을 나눕니까?
        </h3>
        <p>
          서명 단계는 validator 17이 충돌하는 표를 만들지 않았는지 지킵니다.
          Subnet 전파는 모든 노드가 모든 단일 표를 받는 비용을 줄입니다. 집계는
          같은 내용을 지지한 서명을 고정 크기 signature와 participation bits로
          묶습니다. Block 포함은 이 off-chain 표를 protocol state transition의
          입력으로 바꿉니다.
        </p>
        <p>
          그래서 “gossip에서 표를 봤다”와 “block에 포함됐다”는 다릅니다. Pool
          장애 뒤 재시도할 수 있는 전파와, 같은 key가 다시 하면 slashable
          conflict가 될 수 있는 서명도 같은 retry 정책을 쓰면 안 됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef("submit-attestation", codeRefs["submit-attestation"])
            }
          />
          <span className="text-xs text-muted-foreground">
            Prysm v7.3.1의 실제 duty→signing root→slashing check→제출 경로
          </span>
        </div>
      </section>

      <ContentBoundary article="prysm-attestation" />

      <section id="scope" className="mt-12 space-y-5 scroll-mt-20">
        <h3 className="break-keep text-xl font-bold">이 글이 맡는 범위</h3>
        <p>
          Head vote의 weight 계산은{" "}
          <Link to="/cs/blockchain/prysm-forkchoice">fork choice</Link>,
          checkpoint 확정 규칙은{" "}
          <Link to="/cs/blockchain/prysm-finality">finality</Link>, 과거 서명과
          double·surround vote 비교는{" "}
          <Link to="/cs/blockchain/prysm-validator-client#slashing-protection">
            validator slashing protection
          </Link>
          에서 이어집니다. 이 글은 한 표가 그 세 영역의 입력이 되기 전까지를
          소유합니다.
        </p>
      </section>

      <section id="evidence" className="mt-12 space-y-5 scroll-mt-20">
        <h3 className="break-keep text-xl font-bold">근거와 범위</h3>
        <div id="paper-consensus-attestation-spec" className="scroll-mt-24">
          <CitationBlock
            source="Ethereum Consensus Specifications v1.7.0-beta.4 @ aa16bb4c"
            citeKey={1}
            href="https://github.com/ethereum/consensus-specs/tree/aa16bb4c156184e9548a997d53efaf2a228a6304"
          >
            AttestationData, subnet 계산, selection proof와 aggregation의
            protocol 기준을 확인했습니다. Pre-release 안의 unstable future
            fork를 현재 mainnet 규칙으로 확대하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-prysm-attestation-source" className="scroll-mt-24">
          <CitationBlock
            source="OffchainLabs Prysm v7.3.1 @ 96d418cd"
            citeKey={2}
            type="code"
            href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db"
          >
            Validator submission, subnet helper와 attestation pool의 실제 owner
            경계를 확인했습니다. Deadline·throughput과 peer 전파 성능은 이
            source만으로 일반화하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </section>
  );
}
