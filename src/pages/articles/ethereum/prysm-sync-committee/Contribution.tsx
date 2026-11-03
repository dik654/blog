import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Contribution({ onCodeRef }: Props) {
  return (
    <section id="contribution" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 break-keep text-2xl font-bold">
        Subnet에서 먼저 줄이고, 다음 block에 네 구간을 합칩니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          V37의 position 261은 mainnet의 네 subcommittee 중 세 번째인 subnet 2에
          속합니다. 한 subnet은 <code>512 / 4 = 128</code> positions이므로 local
          position은 <code>261 - 2 × 128 = 5</code>입니다. Contribution에는 전체
          position 261이 아니라 subnet-local bit 5가 켜집니다. 전체 offset은
          다음 proposer가 SyncAggregate를 만들 때 복원됩니다.
        </p>

        <h3>Aggregator는 고정 담당자가 아니라 slot마다 다시 뽑힙니다</h3>
        <p>
          위원회 구성원은 slot과 subcommittee index를 별도 domain으로 서명해
          selection proof를 만듭니다. 그 proof의 hash가 modulo 조건을 통과하면 그
          slot의 aggregator가 됩니다. Mainnet 값으로 계산하면 modulo는 8입니다.
        </p>

        <ExplainedFormula
          question="왜 mainnet의 한 subcommittee에서 대략 16명의 aggregator를 기대할까요?"
          idea={<>128-position subcommittee를 목표 16명으로 나눠 modulo 8을 만들고, selection-proof hash가 여덟 residue 중 0에 들어온 경우만 선택합니다.</>}
          formula={String.raw`\begin{aligned}
q&=512/4=128\\
m&=\max(1,128/16)=8\\
h&=\operatorname{u64}(H(\sigma_{sel})_{0:8})\\
h\bmod 8&=0
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
q&=\underbrace{512/4}_{\text{한 subnet의 positions}}=128\\
m&=\max(1,\underbrace{128/16}_{\text{목표 aggregator 수로 나눔}})=8\\
h&=\operatorname{u64}(\underbrace{H(\sigma_{sel})_{0:8}}_{\text{proof hash 앞 8 bytes}})\\
\underbrace{h\bmod 8=0}_{\text{여덟 residue 중 하나면 선택}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`512/4=128`,
              annotation: [
                "Mainnet committee 512 positions를 4 subnets로 나눕니다.",
                "따라서 contribution bitvector는 128 bits입니다.",
              ],
            },
            {
              expression: String.raw`128/16=8`,
              annotation: [
                "Subcommittee당 목표 aggregator 수 16으로 나눕니다.",
                "Modulo 8이므로 균등 hash에서 한 proof의 통과 확률은 1/8입니다.",
              ],
            },
            {
              expression: String.raw`h\bmod 8=0`,
              annotation: [
                "Slot과 subcommittee가 바뀌면 selection proof와 hash도 바뀝니다.",
                "16은 목표 기대값이지 매 slot 정확히 16명이라는 보장이 아닙니다.",
              ],
            },
          ]}
          terms={[
            { symbol: "q", name: "subcommittee size", description: "Mainnet에서 한 subnet에 배치된 128 positions입니다." },
            { symbol: "m", name: "selection modulo", description: "Subcommittee 크기와 목표 aggregator 수로 계산한 8입니다." },
            { symbol: "\\sigma_{sel}", name: "selection proof", description: "Slot과 subcommittee index를 selection-proof domain으로 서명한 값입니다." },
            { symbol: "h", name: "proof hash integer", description: "Selection proof hash의 앞 8 bytes를 uint64로 읽은 값입니다." },
          ]}
          assumptions={[
            "Mainnet preset의 committee size 512, subnet count 4, target aggregators 16을 사용합니다.",
            "Hash residue를 균등하다고 보아 기대값을 말합니다. Duplicate positions와 우연 때문에 실제 distinct aggregator 수는 달라질 수 있습니다.",
          ]}
          interpretation="Modulo 8 조건은 각 eligible validator-subcommittee proof에 1/8의 선택 기회를 줍니다. 따라서 16은 목표 평균이지 고정 인원수가 아닙니다."
        />

        <div className="not-prose mb-5 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "sync-aggregator-selection",
                codeRefs["sync-aggregator-selection"],
              )
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            IsSyncCommitteeAggregator() 원문
          </span>
        </div>

        <h3>선택된 aggregator는 아무 message나 섞지 않습니다</h3>
        <p>
          Aggregator는 자신이 보는 R100과 같은 <strong>slot 100·R100·subnet
          2</strong>의 유효 message만 모읍니다. Position별 local bit를 켜고 BLS
          signatures를 합쳐 <code>SyncCommitteeContribution</code>을 만듭니다.
        </p>
        <p>
          Selection proof는 “이 validator가 이번 slot과 subnet의 aggregator로
          뽑혔다”는 증명이고, contribution-and-proof signature는 aggregator
          identity와 contribution 자체를 묶습니다.
        </p>

        <h3>다음 block proposer가 local bits를 512-position bits로 바꿉니다</h3>
        <p>
          Slot 101 proposer는 pool에서 slot 100과 parent root R100에 맞는
          contributions만 남깁니다. 각 subnet에서 중복을 합친 뒤 참여가 가장 많은
          contribution을 고르고, subnet 0·1·2·3의 128-bit 구간을 순서대로 이어
          512-bit <code>sync_committee_bits</code>를 만듭니다. 네 aggregate
          signatures도 한 BLS signature로 합칩니다.
        </p>
        <p>
          이때 subnet 2의 local bit 5는 전체 bit 261로 돌아갑니다. 같은 validator
          public key가 여러 position에 있더라도 position ordering을 유지해야
          합니다. Unique validator 목록으로 다시 압축하면 bits와 public keys가
          어긋나 서명 검증 결과가 달라집니다.
        </p>

        <div className="not-prose mb-5 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "proposer-sync-aggregate",
                codeRefs["proposer-sync-aggregate"],
              )
            }
          />
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "process-sync-aggregate",
                codeRefs["process-sync-aggregate"],
              )
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            proposer 구성과 state-transition 검증 원문
          </span>
        </div>

        <h3>Block 101은 왜 R100의 서명을 검사합니까?</h3>
        <p>
          Prysm의 <code>setSyncAggregate</code>는 새 block slot의 previous slot과
          parent root를 사용합니다. 따라서 block 101의 SyncAggregate는 slot 100의
          root R100을 가리킵니다.
        </p>
        <p>
          Block을 처리할 때 Prysm은 set bits에 해당하는
          current-committee public keys를 모으고, previous-slot root와 sync domain으로
          signing root를 다시 만든 뒤 FastAggregateVerify를 실행합니다.
        </p>
        <p>
          같은 loop에서 set bit position에는 participant reward를, unset position에는
          penalty를 적용하고 proposer에게 inclusion reward를 더합니다. 이 회계는
          “서명이 block 101의 state transition을 통과했다”는 consensus 처리입니다.
          Light client가 그 aggregate로 어떤 header를 채택할지는 다음 절의 별도
          규칙입니다.
        </p>
        <aside className="not-prose mt-5 border-l-2 border-amber-500/60 bg-amber-500/5 p-4 text-sm leading-6">
          <strong>여기까지 확정된 것:</strong> Block 101이 current committee의
          position ordering과 previous-slot root R100에 맞는 aggregate signature를
          포함했습니다. 이것만으로 R100이 finalized되었다고 말할 수는 없습니다.
        </aside>
      </div>
    </section>
  );
}
