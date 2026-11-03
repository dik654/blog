import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function LightClientVerification({ onCodeRef }: Props) {
  return (
    <section id="light-client-verification" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 break-keep text-2xl font-bold">
        Light client는 서명부터 믿지 않고, trusted root에서 위원회를 먼저 고정합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          공격자가 “이것이 위원회입니다”라고 public keys를 건네고 그 keys의 aggregate
          signature까지 함께 준다면, signature만 확인해서는 순환 신뢰가 됩니다.
          공격자가 위원회와 서명을 모두 만들 수 있기 때문입니다. Light client의 첫
          질문은 “서명이 맞는가?”가 아니라 <strong>“이 위원회가 내가 신뢰한 chain
          state에 실제로 들어 있었는가?”</strong>입니다.
        </p>

        <h3>1. Bootstrap은 위원회의 출처를 고정합니다</h3>
        <p>
          사용자가 신뢰한 block root를 하나 제공합니다. Bootstrap header의
          hash-tree-root가 그 root와 같은지 확인하고, current sync committee의
          hash가 header의 state root에 포함된다는 Merkle branch를 검증합니다. 이
          검사를 통과한 뒤에야 해당 public-key ordering이 light-client store의
          current committee가 됩니다.
        </p>
        <div className="not-prose mb-5 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "light-client-bootstrap",
                codeRefs["light-client-bootstrap"],
              )
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            initialize_light_client_store() 사양
          </span>
        </div>

        <h3>2. 유효한 signature만으로는 update를 채택하지 않습니다</h3>
        <p>
          Update를 받으면 최소 한 명 이상 참여했는지, 현재 시각과 signature slot,
          attested slot, finalized slot의 순서가 맞는지부터 확인합니다. Signature
          period가 store의 current 또는 이미 증명된 next committee 범위를 건너뛰지
          않는지도 검사합니다.
        </p>
        <p>
          Finalized header나 next committee가 실려 있다면
          각각 attested header의 state root에 연결되는 Merkle branch가 필요합니다.
        </p>
        <p>
          마지막으로 set bits에 해당하는 public keys만 current 또는 next committee
          ordering에서 뽑고, signature slot의 previous slot fork version으로 domain을
          만든 뒤 attested header의 aggregate signature를 검증합니다. Bits, public
          keys, slot, fork와 header 중 하나라도 바뀌면 같은 signature를 재사용할 수
          없습니다.
        </p>
        <div className="not-prose mb-5 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "validate-light-client-update",
                codeRefs["validate-light-client-update"],
              )
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            validate_light_client_update() 사양
          </span>
        </div>

        <h3>3. Optimistic와 finalized는 같은 문턱이 아닙니다</h3>
        <p>
          유효한 update는 우선 best candidate로 보관됩니다. Optimistic header는 최근
          두 period에서 관찰한 최대 참여 수의 절반인 dynamic safety threshold를
          넘으면 전진할 수 있습니다. Finalized header를 정상 경로로 적용하려면
          2/3 이상 참여하고, update가 더 새로운 finalized header 또는 필요한 next
          committee finality를 담아야 합니다.
        </p>

        <ExplainedFormula
          question="Mainnet 512-position committee에서 2/3 finality 조건을 만족하는 최소 set bits는 몇 개일까요?"
          idea={<>사양의 정수 비교 n×3 ≥ N×2에 N=512를 넣고, 조건을 처음 만족하는 정수 n을 찾습니다.</>}
          formula={String.raw`\begin{aligned}
3n&\ge 2\cdot512=1024\\
n&\ge 1024/3=341.\overline{3}\\
n_{min}&=342
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
3\underbrace{n}_{\text{set bits}}&\ge 2\cdot\underbrace{512}_{\text{committee positions}}=1024\\
n&\ge 341.\overline{3}\\
\underbrace{n_{min}=342}_{\text{처음 조건을 만족하는 정수}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`2\cdot512=1024`,
              annotation: [
                "전체 512 positions의 2배를 오른쪽에 둡니다.",
                "부동소수점 비율 대신 사양처럼 정수 곱셈으로 비교합니다.",
              ],
            },
            {
              expression: String.raw`1024/3=341.\overline{3}`,
              annotation: [
                "341 bits면 341×3=1023으로 1024보다 작습니다.",
                "342 bits면 342×3=1026으로 조건을 만족합니다.",
              ],
            },
          ]}
          terms={[
            { symbol: "N", name: "committee positions", description: "Mainnet preset의 전체 512 positions입니다." },
            { symbol: "n", name: "active participants", description: "Update의 sync_committee_bits에서 켜진 position 수입니다." },
            { symbol: "n_{min}", name: "minimum supermajority", description: "2/3 정수 조건을 처음 통과하는 342 positions입니다." },
          ]}
          assumptions={[
            "Mainnet preset N=512를 사용합니다.",
            "342 bits는 update 적용 조건 중 참여 문턱만 만족합니다. Finality branch, slot ordering, period와 signature 검증도 모두 통과해야 합니다.",
          ]}
          interpretation="342/512 참여는 2/3 참여 문턱입니다. 이것만 보고 finalized header를 바꾸는 것이 아니라 유효한 finality proof와 더 새로운 header 조건을 함께 확인합니다."
        />

        <div className="not-prose mb-5 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "process-light-client-update",
                codeRefs["process-light-client-update"],
              )
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            process_light_client_update() 사양
          </span>
        </div>

        <div className="not-prose my-6 grid gap-3 sm:grid-cols-3">
          <article className="border border-border bg-background p-4">
            <p className="text-xs font-black text-primary">유효한 update</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Slot·period·branches·committee bits·BLS signature가 맞습니다. 아직 store
              header를 바꾼다는 뜻은 아닙니다.
            </p>
          </article>
          <article className="border border-border bg-background p-4">
            <p className="text-xs font-black text-primary">Optimistic header</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Dynamic safety threshold보다 많은 참여를 관찰해 head 후보를 빠르게
              전진시킵니다. Finality와는 다릅니다.
            </p>
          </article>
          <article className="border border-border bg-background p-4">
            <p className="text-xs font-black text-primary">Finalized header</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              2/3 참여, 유효한 finality branch와 더 새로운 finalized target 등 정상
              적용 조건을 모두 통과했습니다.
            </p>
          </article>
        </div>

        <h3>따라서 sync committee와 finality를 같은 말로 쓰면 안 됩니다</h3>
        <p>
          Sync committee는 제한된 public-key 집합으로 header를 저렴하게 따라가는
          경로입니다. Full node처럼 모든 block, attestation, execution payload와
          BeaconState transition을 직접 실행하지 않습니다.
        </p>
        <p>
          Finalized header도
          committee signature 하나가 만드는 것이 아니라 attested state가 담은
          finalized checkpoint를 Merkle branch로 연결하고 light-client update rule이
          충분한 participation과 함께 받아들인 결과입니다.
        </p>

        <h3>Release 전에 같은 사례로 실패 경계를 확인합니다</h3>
        <ul>
          <li>R100 대신 다른 root의 contribution이 섞이면 proposer가 제외하는가?</li>
          <li>Subnet 2 local bit 5를 전체 bit 5로 잘못 놓으면 검증이 실패하는가?</li>
          <li>Duplicate positions를 unique validators로 줄이면 parity test가 깨지는가?</li>
          <li>Wrong domain·fork·signature slot이면 BLS verification이 실패하는가?</li>
          <li>Finality 또는 next-committee Merkle branch가 깨지면 update가 거절되는가?</li>
          <li>Period 경계에서 current/next committee 선택이 바뀌어도 같은 결과인가?</li>
        </ul>
        <p>
          성능 최적화를 비교할 때는 BLS verification throughput만 보지 않습니다.
          같은 fixture에서 SyncAggregate bytes, reward delta, optimistic header와
          finalized header가 baseline과 같아야 participant identity와 trust boundary를
          보존했다고 말할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
