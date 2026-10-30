import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  FieldAdmissionViz,
  FieldEvidenceViz,
  FieldImplementationViz,
  FieldParameterViz,
  MontgomeryLedgerViz,
} from "./FieldImplementationViz";
import ZkFromScratchLocator, {
  ZkFromScratchMapReturn,
} from "./ZkFromScratchLocator";
import { arkworksFieldTree } from "./fileTrees";
import { officialCodeRefs } from "./officialCodeRefs";

const ARK_FP =
  "https://github.com/arkworks-rs/algebra/tree/6a28df57ddf1f0cb9735ec22d6e9e7f8785980b5/ff/src/fields/models/fp";
const ARK_SERIALIZE =
  "https://github.com/arkworks-rs/algebra/blob/6a28df57ddf1f0cb9735ec22d6e9e7f8785980b5/serialize/src/lib.rs";

export default function ModernFieldImplementationArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <ZkFromScratchLocator
          currentSlug="impl-field-arithmetic"
          region="유한체 값과 계산 경계"
          question="파일의 0x05와 0x09가 Rust의 유한체 곱셈을 거쳐 왜 0x06으로 돌아옵니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            같은 수를 세 가지 모습으로 바꿔도 뜻은 어떻게 보존됩니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            두 공개 입력 <code>0x05</code>와 <code>0x09</code>를 소수체{" "}
            <code>F₁₃</code>에서 곱하겠습니다. 공개 bytes, 범위를 검사한 정수,
            계산용 Montgomery residue를 차례로 따라가면 답은 <code>0x06</code>
            입니다. 작은 수를 쓰는 이유는 실제 구현의 경계를 손으로 확인하기
            위해서입니다.
          </p>
        </div>

        <FieldImplementationViz />

        <p className="text-lg leading-8">
          <strong>Rust의 field element는 공개 정수 그 자체가 아닙니다.</strong>{" "}
          입력에서는 한 가지 canonical encoding만 승인하고, 함수 안에서는 곱셈에
          유리한 표현을 사용하며, 출력할 때 다시 공개 정수로 돌아옵니다. 세
          경계가 모두 같은 <code>p</code>와 같은 표현 상수를 사용해야{" "}
          <code>5 × 9 mod 13 = 6</code>이라는 뜻이 보존됩니다.
        </p>
        <p>
          유한체와 Montgomery reduction의 수학은{" "}
          <Link
            to="/cs/crypto/field-arithmetic"
            className="font-bold text-primary hover:underline"
          >
            유한체 산술 정본
          </Link>
          이 설명합니다. 이 글은 그 수학이 arkworks의 Rust 타입, 입력 검사, 곱셈
          코드와 출력 경계에 어떻게 놓이는지만 다룹니다. BN254의 실제 254-bit
          값은 64-bit limb 네 개를 사용하지만 경계의 순서는 같습니다.
        </p>
        <ContentBoundary article="impl-field-arithmetic" />
      </section>

      <section id="parameter-artifact" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          계산 상수는 modulus와 따로 움직일 수 없습니다
        </h2>
        <FieldParameterViz />
        <p>
          field를 정하는 소수 <code>p</code>만 바꾸고 예전 <code>R²</code>나{" "}
          <code>INV</code>를 남겨 두면 타입은 컴파일돼도 다른 계산 공간이
          섞입니다. 그래서 limb 수와 순서, radix, 변환 상수와 소거 상수를 한
          configuration이 소유해야 합니다.
        </p>

        <ExplainedFormula
          question="p를 limb와 Montgomery 상수로 옮길 때 어떤 값이 함께 정해집니까?"
          idea={
            <>
              p를 담을 word 수를 먼저 정하고, 그 전체 폭의 2의 거듭제곱을
              radix로 사용합니다.
            </>
          }
          formula={
            "L=\\left\\lceil\\frac{\\operatorname{bitlen}(p)}{w}\\right\\rceil,\\quad R=2^{wL},\\quad R_2=R^2\\bmod p,\\quad n'=-p_0^{-1}\\bmod 2^w"
          }
          annotatedFormula={
            "L=\\underbrace{\\left\\lceil\\frac{\\operatorname{bitlen}(p)}{w}\\right\\rceil}_{\\text{p를 담는 word 수}},\\quad R=\\underbrace{2^{wL}}_{\\text{전체 limb 폭}},\\quad R_2=\\underbrace{R^2\\bmod p}_{\\text{입력 변환 상수}},\\quad n'=\\underbrace{-p_0^{-1}\\bmod 2^w}_{\\text{낮은 word 소거 상수}}"
          }
          operations={[
            {
              expression: "p=13,\\ w=4\\Rightarrow L=1,\\ R=16",
              annotation: [
                "13은 4 bit에 들어가므로 설명용 limb는 하나입니다.",
                "실제 arkworks word는 64 bit입니다.",
              ],
            },
            {
              expression: "R_2=16^2\\bmod13=9",
              annotation: [
                "canonical 정수에 R²를 곱한 뒤 reduction하면",
                "xR mod p인 내부 표현이 됩니다.",
              ],
            },
            {
              expression: "n'=-13^{-1}\\bmod16=11",
              annotation: [
                "13×5=65≡1 mod16이므로 역원은 5입니다.",
                "그 음수 −5는 mod16에서 11입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: "p",
              name: "modulus",
              description: "공개 값이 0부터 p−1까지인 소수입니다.",
            },
            {
              symbol: "w",
              name: "word 폭",
              description: "한 limb가 담는 bit 수입니다.",
            },
            {
              symbol: "L",
              name: "limb 수",
              description: "p를 담는 word 개수입니다.",
            },
            {
              symbol: "R",
              name: "radix",
              description: "p보다 크고 p와 서로소인 2의 거듭제곱입니다.",
            },
            {
              symbol: "R₂",
              name: "변환 상수",
              description: "canonical 정수를 Montgomery domain으로 옮깁니다.",
            },
            {
              symbol: "p₀",
              name: "modulus의 낮은 word",
              description: "word 단위 CIOS가 매 단계 소거할 부분입니다.",
            },
            {
              symbol: "n′",
              name: "소거 상수",
              description: "낮은 word가 0이 되도록 p의 배수를 고릅니다.",
            },
          ]}
          assumptions={[
            "p는 홀수 소수라 2의 거듭제곱 R과 서로소입니다.",
            "설명용 계산은 w=4이고, 실제 arkworks backend의 w=64와 혼동하지 않습니다.",
            "p, w, L이 달라지면 R²와 n′도 같은 configuration에서 다시 계산합니다.",
          ]}
          interpretation="p=13, w=4에서는 L=1, R=16, R² mod13=9, n′=11입니다. 이 네 값은 뒤의 5×9 계산에서 하나의 묶음으로 사용됩니다."
        />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="Fp 타입과 설정 코드"
            onClick={() =>
              sidebar.open("ark-fp-type", officialCodeRefs["ark-fp-type"])
            }
          />
          <CodeViewButton
            label="R·R²·INV 코드"
            onClick={() =>
              sidebar.open(
                "ark-montgomery-constants",
                officialCodeRefs["ark-montgomery-constants"],
              )
            }
          />
        </div>
      </section>

      <section id="serialization" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          bytes는 범위를 통과한 뒤에만 field element가 됩니다
        </h2>
        <FieldAdmissionViz />
        <p>
          <code>0x0d</code>를 13으로 읽은 뒤 mod 13으로 줄이면 0이 됩니다.
          그러면 <code>0x00</code>과 <code>0x0d</code>라는 서로 다른 입력이 같은
          field element로 승인됩니다. Canonical encoding은 이 모호함을 허용하지
          않고, 길이와 범위를 먼저 검사합니다.
        </p>

        <ExplainedFormula
          question="bytes 하나를 field element로 승인하는 최소 조건은 무엇입니까?"
          idea={
            <>
              정해진 byte order로 정수를 복원한 뒤 길이와 범위를 함께
              확인합니다.
            </>
          }
          formula={
            "x=\\sum_{i=0}^{B-1}b_i2^{8i},\\qquad \\operatorname{admit}(b)\\iff |b|=B\\ \\land\\ 0\\le x<p"
          }
          annotatedFormula={
            "x=\\underbrace{\\sum_{i=0}^{B-1}b_i2^{8i}}_{\\text{little-endian 정수 복원}},\\qquad \\operatorname{admit}(b)\\iff\\underbrace{|b|=B}_{\\text{정확한 길이}}\\ \\land\\ \\underbrace{0\\le x<p}_{\\text{canonical 범위}}"
          }
          operations={[
            {
              expression: "B=1,\\ b_0=0x05\\Rightarrow x=5",
              annotation: ["길이가 한 byte이고 5<13이므로 승인합니다."],
            },
            {
              expression: "B=1,\\ b_0=0x0d\\Rightarrow x=13",
              annotation: [
                "길이는 맞지만 x<p가 거짓이므로 거절합니다.",
                "mod 13으로 0을 만들지 않습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: "bᵢ",
              name: "i번째 byte",
              description: "예시는 little-endian 순서를 사용합니다.",
            },
            {
              symbol: "B",
              name: "고정 길이",
              description: "field profile이 정한 encoded byte 수입니다.",
            },
            {
              symbol: "x",
              name: "canonical 정수 후보",
              description: "Montgomery 변환 전의 공개 값입니다.",
            },
            {
              symbol: "admit",
              name: "승인 조건",
              description:
                "두 조건을 모두 통과한 bytes만 typed value가 됩니다.",
            },
          ]}
          assumptions={[
            "예시는 flag가 없는 한 byte little-endian encoding입니다.",
            "곡선점처럼 상위 bit에 flag를 넣는 형식은 별도의 schema 검사가 필요합니다.",
            "압축 여부가 field value의 범위 검사를 대신하지 않습니다.",
          ]}
          interpretation="0x05는 5로 승인되지만 0x0d는 13이라 거절됩니다. 같은 field value에 공개 byte 표현을 하나만 남기는 경계입니다."
        />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="입력 승인 코드"
            onClick={() =>
              sidebar.open(
                "ark-field-admission",
                officialCodeRefs["ark-field-admission"],
              )
            }
          />
        </div>
      </section>

      <section id="execution-profile" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          곱셈은 p의 배수를 더해 낮은 word를 없앱니다
        </h2>
        <MontgomeryLedgerViz />
        <p>
          내부 값 <code>2</code>와 <code>1</code>의 곱 <code>T=2</code>에{" "}
          <code>6p</code>를 더해도 mod 13 값은 바뀌지 않습니다. 그런데 합계 80은
          radix 16으로 정확히 나뉩니다. 그래서 비싼 일반 나눗셈으로 나머지를
          구하는 대신, 낮은 word를 소거하고 shift하는 계산으로 내부 결과를
          얻습니다.
        </p>

        <ExplainedFormula
          question="Montgomery reduction은 왜 값의 뜻을 보존하면서 R 배율 하나를 없앱니까?"
          idea={
            <>
              T의 낮은 R 영역을 상쇄할 p의 배수 m을 고른 뒤, 정확히 R로
              나눕니다.
            </>
          }
          formula={
            "m=(T\\bmod R)N'\\bmod R,\\qquad u=\\frac{T+mp}{R},\\qquad z=u\\ge p\\ ?\\ u-p:u"
          }
          annotatedFormula={
            "m=\\underbrace{(T\\bmod R)N'\\bmod R}_{\\text{R로 나뉘게 할 p의 배수}},\\qquad u=\\underbrace{\\frac{T+mp}{R}}_{\\text{낮은 word를 버린 후보}},\\qquad z=\\underbrace{u\\ge p\\ ?\\ u-p:u}_{\\text{[0,p) 정규화}}"
          }
          operations={[
            {
              expression: "m=(2\\times11)\\bmod16=6",
              annotation: [
                "T=2의 낮은 word에 N′=11을 곱합니다.",
                "2+6×13=80은 16으로 나뉩니다.",
              ],
            },
            {
              expression: "u=80/16=5<p",
              annotation: [
                "5는 6의 Montgomery 표현입니다.",
                "6R mod13=6×16 mod13=5입니다.",
              ],
            },
            {
              expression: "\\operatorname{REDC}(5)=(5+7\\times13)/16=6",
              annotation: [
                "출력할 때 reduction을 한 번 더 적용해",
                "R 배율을 완전히 제거합니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: "T",
              name: "넓은 곱",
              description: "두 내부 residue를 곱한 중간값입니다.",
            },
            {
              symbol: "N′",
              name: "전체 폭 inverse",
              description:
                "−p⁻¹ mod R입니다. 한 word 사례에서는 n′와 같습니다.",
            },
            {
              symbol: "m",
              name: "소거 배수",
              description: "T+mp가 R로 나뉘게 만듭니다.",
            },
            {
              symbol: "u",
              name: "reduced 후보",
              description: "R로 나눈 뒤의 내부 결과 후보입니다.",
            },
            {
              symbol: "z",
              name: "정규화된 residue",
              description: "필요하면 p를 한 번 빼 [0,p)에 둡니다.",
            },
          ]}
          assumptions={[
            "T<pR이어서 u<2p이고 마지막 p subtraction 한 번이면 충분합니다.",
            "T, p, R, N′는 같은 field configuration에 속합니다.",
            "실제 CIOS 구현은 이 관계를 64-bit word마다 carry와 함께 반복합니다.",
          ]}
          interpretation="내부 계산은 2×1→5로 끝나지만 공개 의미는 5×9 mod13=6입니다. into_bigint가 마지막 R 배율을 없앤 뒤에만 6을 출력합니다."
        />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="CIOS 곱셈 코드"
            onClick={() =>
              sidebar.open(
                "ark-field-multiply",
                officialCodeRefs["ark-field-multiply"],
              )
            }
          />
          <CodeViewButton
            label="canonical 출력 코드"
            onClick={() =>
              sidebar.open(
                "ark-field-output",
                officialCodeRefs["ark-field-output"],
              )
            }
          />
        </div>
      </section>

      <section id="release-gate" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          구현의 증거는 공개 경계에서 확인합니다
        </h2>
        <FieldEvidenceViz />
        <p>
          내부 limb 배열은 backend가 바뀌면 달라질 수 있습니다. 그래서 구현의
          계약은 <code>0</code>, <code>1</code>, <code>p−1</code>을 승인하고{" "}
          <code>p</code>를 거절하는지, 연산 결과가 작은 정수 reference와 같은지,
          직렬화 왕복이 같은 bytes로 닫히는지에서 확인합니다.
        </p>
        <p>
          시스템이 스스로 드러내는 실패도 이 경계에 붙어 있습니다. 범위 밖
          정수는 <code>from_bigint</code>에서 <code>None</code>이 되고
          deserialize는 <code>InvalidData</code>를 반환합니다. 0의 역원은
          존재하지 않으므로 inverse도 <code>None</code>입니다. Base field와
          scalar field는 비트 수가 비슷해도 modulus가 다르므로 같은 타입으로
          합쳐서는 안 됩니다.
        </p>
        <p>
          반대로 source에 분기가 적어 보인다는 사실만으로 constant-time 실행을
          증명할 수는 없습니다. 컴파일러와 target ISA까지 포함한 timing 검증,
          성능 비교, 배포 승인과 rollback은 환경에 따라 달라지는 별도 실무
          판단입니다. 이 글의 결론은 공개 값과 내부 표현 사이의 의미
          보존까지입니다.
        </p>

        <div className="not-prose grid gap-px bg-border p-px lg:grid-cols-2">
          <div id="paper-arkworks-field">
            <CitationBlock
              type="code"
              citeKey={1}
              source="arkworks algebra · prime-field model · commit 6a28df5"
              href={ARK_FP}
            >
              <p>
                <strong>확인한 것:</strong> <code>FpConfig</code>, 내부
                Montgomery form, <code>R·R²·INV</code>, canonical integer 변환과
                CIOS 곱셈 경계입니다.
              </p>
              <p>
                <strong>말하지 않는 것:</strong> 임의의 custom constants, 모든
                target에서의 constant-time 성질과 production 보안 감사를
                자동으로 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
          <div id="paper-arkworks-serialize">
            <CitationBlock
              type="code"
              citeKey={2}
              source="arkworks canonical serialization · commit 6a28df5"
              href={ARK_SERIALIZE}
            >
              <p>
                <strong>확인한 것:</strong> little-endian serializer, checked와
                unchecked deserialize API, compression·validation mode의 trait
                경계입니다.
              </p>
              <p>
                <strong>말하지 않는 것:</strong> trait 사용만으로 다른 언어의
                schema 일치, 곡선점 flag·subgroup 검사와 protocol 호환성이
                증명되지는 않습니다.
              </p>
            </CitationBlock>
          </div>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          0x05 × 0x09의 경로를 다시 말해 보기
        </h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>
            <code>0x0d</code>를 0으로 줄이지 않고 거절하는 이유는 무엇입니까?{" "}
            <strong>
              서로 다른 bytes가 같은 field value로 승인되는 일을 막아 canonical
              encoding을 유지하기 위해서입니다.
            </strong>
          </li>
          <li>
            5와 9가 내부에서 2와 1로 저장돼도 같은 값인 이유는 무엇입니까?{" "}
            <strong>
              내부 표현이 xR mod p이고 모든 연산과 복원이 같은 R을 사용하기
              때문입니다.
            </strong>
          </li>
          <li>
            <code>T+mp</code>에 p의 배수를 더해도 답이 바뀌지 않는 이유는
            무엇입니까? <strong>mod p에서는 mp가 0과 같기 때문입니다.</strong>
          </li>
          <li>
            내부 결과 5를 바로 출력하지 않는 이유는 무엇입니까?{" "}
            <strong>
              5는 공개 값 6의 Montgomery residue이므로 reduction을 한 번 더 해 R
              배율을 제거해야 합니다.
            </strong>
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          다음 글에서는 이 field value 두 개를 좌표로 쓰는 점이 bytes에서 들어와
          on-curve·subgroup 검사를 통과하고 pairing으로 이어지는 경로를
          추적합니다.
        </p>
      </section>

      <ZkFromScratchMapReturn
        currentSlug="impl-field-arithmetic"
        closure="Rust 유한체 구현은 공개 bytes를 canonical 정수로 승인하고, 같은 field configuration의 Montgomery 표현으로 계산한 뒤, R 배율을 제거한 canonical bytes로 돌아올 때 한 값의 뜻을 보존합니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialCodeRefs}
        fileTrees={{ arkworks: arkworksFieldTree }}
        projectMetas={{
          arkworks: {
            id: "arkworks",
            label: "arkworks algebra · 6a28df5 · Rust",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
