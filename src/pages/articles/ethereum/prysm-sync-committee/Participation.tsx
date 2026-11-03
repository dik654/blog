import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Participation({ onCodeRef }: Props) {
  return (
    <section id="participation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 break-keep text-2xl font-bold">
        먼저 기간의 위원회를 정하고, 구성원이 매 slot의 head root에 서명합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Light client가 매번 전체 validator set을 내려받지 않으려면 “이번 기간에
          누구의 서명을 확인할지”가 state에 미리 고정돼 있어야 합니다. Beacon
          state는 <strong>current sync committee</strong>와{" "}
          <strong>next sync committee</strong>를 함께 보관하고, period 경계에서
          next를 current로 넘긴 뒤 새 next를 계산합니다.
        </p>

        <div className="not-prose mb-5 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef("next-sync-committee", codeRefs["next-sync-committee"])
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            NextSyncCommitteeIndices() 원문
          </span>
        </div>

        <h3>왜 validator를 한 번씩만 뽑지 않을까요?</h3>
        <p>
          Prysm은 활성 validator를 shuffle한 뒤 candidate의 effective balance에
          비례해 position을 받아들입니다. 위원회가 찰 때까지 이 과정을 반복하며,
          한번 뽑힌 validator를 후보 집합에서 제거하지 않습니다. 그래서 잔액이 큰
          validator는 더 높은 확률로 뽑히고, 같은 validator가 둘 이상의 position을
          차지할 수도 있습니다.
        </p>
        <p>
          예를 들어 V37이 position 5와 261에 두 번 들어갔다면 public key도 두
          자리에 나타납니다. V37이 한 signature를 만들더라도 그 signature는
          committee ordering의 두 position에 대응할 수 있습니다. 따라서 “512
          positions”를 “서로 다른 validator 512명”으로 읽으면 안 됩니다.
        </p>

        <h3>Slot 100에서 V37은 정확히 무엇을 서명합니까?</h3>
        <p>
          V37은 유효한 block을 받았거나 sync-message due time이 되었을 때 beacon
          node에 현재 head root를 묻습니다. 반환된 R100을 바로 서명하지 않고,
          현재 fork와 genesis 문맥을 포함한 sync-committee domain을 결합해 signing
          root를 만든 뒤 key manager에 서명을 요청합니다.
        </p>

        <ExplainedFormula
          question="같은 R100에 대한 attestation 서명과 sync-committee 서명이 왜 서로 대체되지 않을까요?"
          idea={<>서명할 object root에 역할별 domain을 함께 hash하므로, block root가 같아도 signing root가 달라집니다.</>}
          formula={String.raw`\begin{aligned}
R_{sign}&=\operatorname{HTR}(R_{100},D_{sync})\\
\sigma_{37}&=\operatorname{BLS.Sign}(sk_{37},R_{sign})
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
R_{sign}&=\operatorname{HTR}(\underbrace{R_{100}}_{\text{관찰한 head root}},\underbrace{D_{sync}}_{\text{sync 역할·fork 문맥}})\\
\sigma_{37}&=\operatorname{BLS.Sign}(\underbrace{sk_{37}}_{\text{V37 비밀키}},\underbrace{R_{sign}}_{\text{역할이 묶인 메시지}})
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{HTR}(R_{100},D_{sync})`,
              annotation: [
                "R100과 sync 역할의 domain을 SigningData로 묶습니다.",
                "Attester domain을 넣으면 다른 32-byte signing root가 나옵니다.",
              ],
            },
            {
              expression: String.raw`\operatorname{BLS.Sign}(sk_{37},R_{sign})`,
              annotation: [
                "V37의 비밀키로 역할이 고정된 root를 서명합니다.",
                "검증자는 같은 domain과 R100으로 signing root를 다시 만듭니다.",
              ],
            },
          ]}
          terms={[
            { symbol: "R_{100}", name: "head block root", description: "Slot 100에 V37이 관찰한 head block의 32-byte root입니다." },
            { symbol: "D_{sync}", name: "sync committee domain", description: "DOMAIN_SYNC_COMMITTEE와 fork version·genesis root로 만든 domain입니다." },
            { symbol: "R_{sign}", name: "signing root", description: "Block root와 역할 문맥을 함께 hash한 실제 서명 대상입니다." },
            { symbol: "sk_{37}", name: "validator secret key", description: "V37 key manager가 보관하는 BLS 비밀키입니다." },
            { symbol: "\\sigma_{37}", name: "BLS signature", description: "V37이 R100을 sync-committee 역할로 보았다는 96-byte 서명입니다." },
          ]}
          assumptions={[
            "Validator와 검증자가 같은 fork schedule과 genesis validators root를 사용합니다.",
            "서명 성공은 R100을 관찰했다는 위원회 표이지 R100의 execution과 모든 state transition을 단독으로 증명하지 않습니다.",
          ]}
          interpretation="같은 R100이라도 역할 domain이 다르면 signing root가 달라집니다. 그래서 attestation signature를 sync-committee signature로 재사용할 수 없습니다."
        />

        <div className="not-prose mb-5 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef("submit-sync-msg", codeRefs["submit-sync-msg"])
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            SubmitSyncCommitteeMessage() 원문
          </span>
        </div>

        <p>
          Prysm이 제출하는 <code>SyncCommitteeMessage</code>에는 slot 100, R100,
          V37의 validator index와 σ37이 들어갑니다. Beacon node는 V37이 속한
          distinct subnet마다 같은 message를 전파할 수 있습니다.
        </p>
        <p>
          V37이 같은
          subnet 안에서 여러 position을 가져도 같은 message를 중복 전파할 필요는
          없지만, 서로 다른 subnet에 position이 있다면 각 subnet에 한 번씩
          보내야 합니다.
        </p>
        <aside className="not-prose mt-5 border-l-2 border-amber-500/60 bg-amber-500/5 p-4 text-sm leading-6">
          <strong>여기까지 확정된 것:</strong> V37이 slot 100의 R100을 sync 역할로
          서명했습니다. 아직 다른 위원회 position의 참여, subnet aggregate, block
          포함, light-client 채택과 finality는 확정되지 않았습니다.
        </aside>
      </div>
    </section>
  );
}
