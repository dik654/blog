import { Link } from "react-router-dom";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function SszInternal({ onCodeRef }: Props) {
  return (
    <>
      <section id="proof-context" className="mb-16 scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">타입이 정한 길이로 root를 다시 만듭니다</h2>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            JSON decode가 끝나도 U1422의 내용은 아직 믿을 수 없습니다. Helios는
            leaf 객체의 SSZ <code>tree_hash_root</code>를 만들고, branch의 sibling을
            generalized index 방향에 따라 하나씩 결합합니다. 마지막 값이 attested
            header의 <code>state_root</code> 또는 <code>body_root</code>와 같아야
            포함 증명이 성립합니다.
          </p>
        </div>

        <ExplainedFormula
          question="Branch의 sibling은 어떤 순서로 root에 접힐까요?"
          idea="Leaf의 SSZ root에서 시작합니다. Index의 i번째 bit가 1이면 sibling을 왼쪽에, 0이면 오른쪽에 놓고 SHA-256을 반복합니다."
          formula={String.raw`r_0=HTR(leaf),\qquad r_{i+1}=\begin{cases}H(s_i\|r_i)&bit_i=1\\H(r_i\|s_i)&bit_i=0\end{cases},\qquad accept\iff r_d=R`}
          annotatedFormula={String.raw`\underbrace{r_0=HTR(leaf)}_{\text{SSZ object root}},\qquad \underbrace{r_{i+1}=H(left\|right)}_{\text{index bit로 순서 결정}},\qquad \underbrace{r_d=R}_{\text{trusted root와 비교}}`}
          operations={[
            {
              expression: String.raw`r_0=HTR(leaf)`,
              annotation: [
                "JSON 문자열 자체를 hash하지 않습니다",
                "Fork별 Rust 객체의 SSZ tree hash에서 시작합니다",
              ],
            },
            {
              expression: String.raw`r_{i+1}=H(s_i\|r_i)\;or\;H(r_i\|s_i)`,
              annotation: [
                "Generalized index의 bit가 sibling 방향을 정합니다",
                "같은 hash 목록도 순서를 바꾸면 다른 root가 됩니다",
              ],
            },
            {
              expression: String.raw`r_d=R`,
              annotation: [
                "Electra finality이면 d=7, next committee이면 d=6입니다",
                "길이가 맞아도 마지막 root가 다르면 거절합니다",
              ],
            },
          ]}
          terms={[
            { symbol: "HTR", name: "Hash-tree-root", description: "Fork별 SSZ schema로 만든 leaf 객체의 32-byte commitment입니다." },
            { symbol: "s_i", name: "Sibling", description: "Merkle branch의 i번째 32-byte hash입니다." },
            { symbol: "bit_i", name: "Path bit", description: "Generalized index에서 현재 node가 왼쪽인지 오른쪽인지 나타냅니다." },
            { symbol: "R", name: "Trusted root", description: "Attested beacon header가 이미 결속한 state_root 또는 body_root입니다." },
          ]}
          assumptions={[
            "Branch 길이와 generalized index는 같은 활성 fork의 consensus schema에서 가져옵니다.",
            "Hash 함수와 SSZ tree shape는 Ethereum consensus-specs v1.6.1을 따릅니다.",
          ]}
          interpretation="U1422의 배열 길이가 Electra 타입에 맞는 것은 첫 관문입니다. 각 leaf의 SSZ root, sibling 순서와 최종 trusted root 비교까지 맞아야 증거가 됩니다."
        />

        <div className="not-prose mt-5">
          <CodeViewButton
            label="실제 branch depth와 hash fold 보기"
            onClick={() => onCodeRef("helios-proof-fold", codeRefsReal["helios-proof-fold"])}
          />
        </div>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            Merkle 증명 뒤에는 서명 문맥이 남습니다. Helios는 signature slot으로
            sync committee period와 fork version을 고르고, participation bits가
            가리키는 public key만 모읍니다. 그 key 집합과 genesis root·fork
            version이 들어간 domain으로 aggregate signature를 확인합니다. Branch가
            맞아도 서명이 틀리면 U1422는 검증된 update가 아닙니다.
          </p>
          <p>
            SSZ의 packing·mix-in-length·generalized index 자체는
            <Link to="/cs/blockchain/prysm-ssz"> SSZ 정본 글</Link>이 소유합니다.
            이 글은 그 규칙이 Helios의 JSON decode 결과와 어떻게 연결되는지만
            추적합니다.
          </p>
        </div>
      </section>

      <section id="validation-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">검증 성공은 Store 변경이 아니라 후보 반환입니다</h2>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Helios는 fork별 <code>Update</code>를 공통
            <code>GenericUpdate</code>로 바꿔 검증 함수에 넘깁니다. 여기서 optional
            next committee와 finalized header는 “없어도 되는 field”가 아니라,
            실제 update 종류가 제공한 증거만 공통 경로에 표현한 것입니다.
          </p>
          <p>
            검증 함수는 참여 0, 잘못된 execution proof, 시간 순서, committee
            period, finality branch, next committee branch, participant key와 BLS
            signature를 차례로 확인합니다. 어느 단계든 실패하면 오류로 끝납니다.
            성공해도 이 함수가 <code>LightClientStore</code>를 수정하지는 않습니다.
            Optimistic·finalized header와 committee를 바꾸는 조건은
            <Link to="/cs/blockchain/helios-update#store-transition"> Store update 글</Link>의
            책임입니다.
          </p>
        </div>

        <div className="not-prose mt-5 flex flex-wrap gap-3">
          <CodeViewButton
            label="검증 순서 원문"
            onClick={() => onCodeRef("helios-update-verify", codeRefsReal["helios-update-verify"])}
          />
          <CodeViewButton
            label="GenericUpdate 경계 원문"
            onClick={() => onCodeRef("helios-fork-types", codeRefsReal["helios-fork-types"])}
          />
        </div>

        <div className="mt-8 grid gap-px bg-border p-px sm:grid-cols-3">
          <div className="bg-background p-4">
            <p className="text-xs font-bold text-muted-foreground">Decode 성공</p>
            <p className="mt-2 font-bold">구조가 맞음</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">증거와 서명은 아직 미확인</p>
          </div>
          <div className="bg-background p-4">
            <p className="text-xs font-bold text-muted-foreground">Verify 성공</p>
            <p className="mt-2 font-bold">후보가 유효함</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">GenericUpdate를 다음 단계로 전달</p>
          </div>
          <div className="bg-background p-4">
            <p className="text-xs font-bold text-muted-foreground">Apply 성공</p>
            <p className="mt-2 font-bold">Store가 조건별로 전진</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">다음 글이 소유하는 상태 전이</p>
          </div>
        </div>
      </section>

      <section id="self-check" className="mb-16 scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">이 글에서 확인할 수 있어야 하는 것</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>Helios 0.11.1의 Beacon API update 경로가 JSON을 읽는다고 설명할 수 있습니다.</li>
            <li>JSON decode와 SSZ hash-tree-root 검증을 서로 다른 단계로 구분할 수 있습니다.</li>
            <li>Base의 5·6과 Electra의 6·7 branch 길이가 타입 선택과 proof에 모두 필요한 이유를 설명할 수 있습니다.</li>
            <li>Slot 11,649,024를 epoch 364,032와 period 1,422로 계산할 수 있습니다.</li>
            <li>검증된 GenericUpdate 후보와 변경된 LightClientStore를 같은 상태로 부르지 않습니다.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
