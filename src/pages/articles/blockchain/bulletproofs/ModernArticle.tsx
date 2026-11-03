import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import BulletproofsFlowViz from "./BulletproofsFlowViz";
import { codeRefs } from "./codeRefs";
import { bulletproofsTree } from "./fileTree";

const BULLETPROOFS_PAPER = "https://eprint.iacr.org/2017/1066.pdf";
const DALEK_SOURCE =
  "https://github.com/dalek-cryptography/bulletproofs/tree/be67b6d5f5ad1c1f54d5511b52e6d645a1313d07";

export default function ModernBulletproofsArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article className="space-y-14 [overflow-wrap:anywhere]">
        <section id="overview" className="space-y-6 scroll-mt-20">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              한 문장으로 먼저 답하기
            </p>
            <h2 className="max-w-4xl break-keep text-3xl font-bold tracking-tight">
              Bulletproofs는 숨긴 값을 열지 않고 범위 안이라는 사실을 증명합니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            공개된 값은 <code>x=3</code>과 <code>y=12</code>이고, 숨길 값은
            <code>w=4</code>라고 하겠습니다. Prover는 <code>3w=12</code>와
            <code>0≤w&lt;8</code>을 모두 보이고 싶지만, verifier에게 4를 직접
            알려 주고 싶지는 않습니다.
          </p>
          <p>
            먼저 <code>V=wG+rH</code>라는 Pedersen commitment를 공개합니다.
            무작위 blinding <code>r</code> 때문에 V만 보고 w를 알 수 없지만, 이후
            증명은 같은 V에 들어간 값이 산술식과 3-bit range를 함께 만족한다는
            사실을 확인하게 합니다.
          </p>

          <BulletproofsFlowViz />
          <ContentBoundary article="bulletproofs" />

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              [
                "COMMITMENT",
                "값을 숨긴 공개 기준점",
                "V=wG+rH는 w를 숨기면서 이후 증명이 가리킬 같은 기준점을 남깁니다.",
              ],
              [
                "RANGE RELATION",
                "0부터 7까지를 식으로 표현",
                "Secret bits의 booleanity와 1·2·4 weighted sum이 3-bit unsigned range를 만듭니다.",
              ],
              [
                "INNER PRODUCT",
                "긴 vector 관계를 절반씩 접기",
                "Round마다 L·R을 먼저 고정하고 challenge로 relation을 n→n/2로 줄입니다.",
              ],
            ].map(([eyebrow, title, body]) => (
              <article key={eyebrow} className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-primary">{eyebrow}</p>
                <h3 className="mt-2 break-keep text-sm font-black">{title}</h3>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                  {body}
                </p>
              </article>
            ))}
          </div>

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="실제 Pedersen commitment"
              onClick={() =>
                sidebar.open("pedersen-gens", codeRefs["pedersen-gens"])
              }
            />
          </div>
        </section>

        <section id="range-proof" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              01 · 숨긴 4를 3개 bit로 바꾸기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Booleanity와 자릿값의 합이 0≤w&lt;8을 만듭니다
            </h2>
          </header>

          <p>
            4의 3-bit little-endian 표현은 <code>(0,0,1)</code>입니다. 각 원소가
            정말 0 또는 1인지 확인하고, 자릿값 1·2·4를 곱해 더한 결과가 같은
            witness w인지 확인합니다. 두 조건이 모두 있어야 음수·8·9처럼 범위를
            벗어난 integer를 막을 수 있습니다.
          </p>

          <ExplainedFormula
            question="3개의 secret field element가 어떻게 0부터 7까지의 integer가 되나요?"
            idea="각 원소를 bit로 제한한 뒤, 1·2·4 자릿값으로 같은 w를 복원합니다."
            formula={String.raw`a_i(a_i-1)=0,qquad w=langlemathbf a_L,(1,2,4)angle`}
            annotatedFormula={String.raw`\underbrace{a_i(a_i-1)=0}_{\text{각 }a_i\text{는 0 또는 1}},\qquad \underbrace{w}_{\text{commitment의 같은 값}}=\underbrace{\langle\mathbf a_L,(1,2,4)\rangle}_{\text{bit에 자릿값을 곱해 합침}}`}
            operations={[
              {
                expression: String.raw`a_i(a_i-1)=0`,
                annotation: [
                  "Field에는 zero divisor가 없으므로",
                  "곱이 0이면 ai=0 또는 ai=1",
                  "세 원소 모두 따로 검사",
                ],
              },
              {
                expression: String.raw`(0,0,1)\cdot(1,2,4)`,
                annotation: [
                  "0·1 + 0·2 + 1·4",
                  "합은 4",
                  "3 bits가 만드는 값은 0부터 7",
                ],
              },
              {
                expression: String.raw`V=wG+rH`,
                annotation: [
                  "복원한 w를 처음 commitment의 value와 결속",
                  "3w=12의 w와도 같은 변수",
                  "각각 다른 witness를 쓰는 위조를 차단",
                ],
              },
            ]}
            terms={[
              {
                symbol: "a_i",
                name: "Secret bit",
                description: "Field 안에서 0 또는 1로 제한한 비공개 값입니다.",
              },
              {
                symbol: String.raw`\mathbf a_L`,
                name: "Bit vector",
                description: "w=4일 때 little-endian (0,0,1)입니다.",
              },
              {
                symbol: "w",
                name: "Committed value",
                description: "V와 산술식, range 식이 공유해야 하는 같은 witness입니다.",
              },
            ]}
            assumptions={[
              "Protocol profile이 unsigned integer, bit length 3과 little-endian 자릿값을 고정합니다.",
              "Field element를 integer로 옮길 때 canonical encoding을 사용하고 silent truncation을 허용하지 않습니다.",
              "Bit relation과 V=wG+rH, 3w=12가 같은 witness variable을 공유합니다.",
            ]}
            interpretation="w=9의 하위 3 bits만 취하면 001, 즉 1이 됩니다. 이는 9가 range 안이라는 증명이 아니라 9 mod 8의 다른 값을 증명한 것이므로 reject해야 합니다."
          />

          <p>
            여러 commitment의 bit vectors를 이어 붙이면 한 proof로 aggregate할 수
            있습니다. 논문에서 proof 길이는 단일 proof보다 <code>O(log m)</code>
            group element만 더 늘지만, generator 수·multiscalar multiplication과
            참여자 간 nonce·순서 조율 비용까지 사라지는 것은 아닙니다.
          </p>
        </section>

        <section id="inner-product" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · 긴 관계를 짧은 proof로 접기
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              L과 R을 먼저 고정한 뒤 challenge로 vector 길이를 절반으로 줄입니다
            </h2>
          </header>

          <p>
            Range proof가 만든 긴 vector relation을 그대로 보내면 proof도 길어집니다.
            Inner-product argument는 vector를 좌우로 나눈 뒤 cross term을 담은
            <code>L</code>과 <code>R</code>을 먼저 transcript에 넣습니다. 그 뒤에
            challenge <code>u</code>를 얻고 witness와 generator를 함께 접습니다.
          </p>

          <ExplainedFormula
            question="한 round에서 길이 n relation을 어떻게 n/2 relation으로 줄이나요?"
            idea="Witness와 generator에 맞물린 u·u⁻¹ 계수를 써서 commitment equality를 보존합니다."
            formula={String.raw`\mathbf a'=u\mathbf a_L+u^{-1}\mathbf a_R,\quad \mathbf G'=u^{-1}\mathbf G_L+u\mathbf G_R`}
            annotatedFormula={String.raw`\underbrace{\mathbf a'}_{\text{절반 길이 witness}}=\underbrace{u\mathbf a_L+u^{-1}\mathbf a_R}_{\text{challenge로 좌우 결합}},\quad \underbrace{\mathbf G'}_{\text{절반 길이 basis}}=\underbrace{u^{-1}\mathbf G_L+u\mathbf G_R}_{\text{반대 계수로 결합}}`}
            operations={[
              {
                expression: String.raw`L,R\to u`,
                annotation: [
                  "Cross term point L·R을 먼저 transcript에 추가",
                  "그 다음 challenge u 생성",
                  "Prover가 u를 본 뒤 L·R을 바꾸지 못함",
                ],
              },
              {
                expression: String.raw`n\to n/2`,
                annotation: [
                  "Witness a·b와 generator G·H를 모두 접음",
                  "길이 8이면 8→4→2→1",
                  "총 3=log₂8 rounds",
                ],
              },
              {
                expression: String.raw`(L_i,R_i)_{i=1}^{\log_2 n}`,
                annotation: [
                  "Proof에는 round별 point pair와 마지막 scalar가 남음",
                  "Proof 크기는 O(log n)",
                  "전체 MSM work는 여전히 n 규모",
                ],
              },
            ]}
            terms={[
              {
                symbol: "L,R",
                name: "Cross-term commitments",
                description: "현재 좌우 절반의 교차 inner product를 challenge 전에 고정합니다.",
              },
              {
                symbol: "u",
                name: "Transcript challenge",
                description: "Statement와 L·R을 흡수한 뒤 얻는 round scalar입니다.",
              },
              {
                symbol: "n",
                name: "Relation dimension",
                description: "Profile이 정한 power-of-two vector 길이입니다.",
              },
            ]}
            assumptions={[
              "n은 power of two이며 padding을 쓰면 logical length와 padding rule을 transcript에 결속합니다.",
              "Prime-order group, 독립 generator와 discrete-log hardness를 가정합니다.",
              "Statement·generator/range profile·L·R을 같은 Merlin transcript에 순서대로 넣습니다.",
            ]}
            interpretation="n=8이면 L/R pair는 3개만 남지만 prover와 verifier가 처음 vector 전체를 처리하는 일까지 3개 연산으로 줄어드는 것은 아닙니다."
          />

          <AlgorithmBlock
            title="Inner-product argument 한 round"
            input={[
              "길이 n인 witness vectors a, b",
              "길이 n인 generators G, H와 commitment point Q",
              "Statement까지 흡수한 transcript",
            ]}
            steps={[
              {
                code: "a,b,G,H를 왼쪽과 오른쪽 절반으로 나눈다",
                note: "네 vector 모두 같은 가운데에서 나눠야 관계의 좌표가 맞습니다.",
              },
              {
                code: "cL ← ⟨aL,bR⟩, cR ← ⟨aR,bL⟩",
                note: "접을 때 생기는 두 cross inner product를 계산합니다.",
              },
              {
                code: "L,R을 계산하고 transcript에 append한다",
                note: "Challenge를 보기 전에 이번 round의 cross term을 point로 고정합니다.",
              },
              {
                code: "u ← transcript.challenge_scalar('u')",
                note: "Statement와 L·R에 결속된 challenge와 inverse u⁻¹을 얻습니다.",
              },
              {
                code: "a,b,G,H ← u와 u⁻¹ 계수로 fold한다",
                note: "Witness와 basis를 함께 접어 길이를 n/2로 줄이면서 같은 relation을 유지합니다.",
              },
            ]}
            repeatUntil="vector 길이가 1이 될 때까지 반복합니다. n=8이면 세 round입니다."
            output="L_vec, R_vec와 마지막 scalar a, b"
          />

          <div className="not-prose flex flex-wrap gap-2">
            <CodeViewButton
              label="실제 IPA proof 구조"
              onClick={() => sidebar.open("ipa-struct", codeRefs["ipa-struct"])}
            />
            <CodeViewButton
              label="실제 IPA 첫 round"
              onClick={() =>
                sidebar.open("ipa-first-round", codeRefs["ipa-first-round"])
              }
            />
          </div>

          <p>
            논문 abstract는 n-bit range proof가 <code>2log₂(n)+9</code>개의 group과
            field element로 구성되고, proof generation과 verification time은 n에
            선형이라고 명시합니다. “짧은 proof”와 “logarithmic verifier time”은
            같은 말이 아닙니다.
          </p>
        </section>

        <section id="release" className="space-y-6 scroll-mt-20">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · 검증 결과와 배포 경계
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Trusted setup이 없다는 말도 모든 신뢰와 실패가 없다는 뜻은 아닙니다
            </h2>
          </header>

          <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
            <article className="bg-background p-5">
              <p className="text-xs font-bold text-primary">Proof가 확인하는 것</p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>고정한 V의 숨긴 값이 지정 range 안에 있음</li>
                <li>산술식과 range가 같은 witness를 공유함</li>
                <li>고정한 transcript·generator profile에서 IPA가 성립함</li>
              </ul>
            </article>
            <article className="bg-background p-5">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                따로 확인할 것
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li>Generator derivation과 curve 구현의 안전성</li>
                <li>Signed·unsigned와 bit length·domain의 일치</li>
                <li>Verifier 배포·serialization·성능·애플리케이션 정책</li>
              </ul>
            </article>
          </div>

          <p>
            Release test는 먼저 w=4와 올바른 V가 통과하는지 확인합니다. 이어서 실패
            원인을 섞지 않고 다음 입력을 하나씩 거절해야 합니다.
          </p>
          <ul>
            <li>범위를 벗어난 −1·8·9</li>
            <li>값이 바뀐 V와 잘못된 bit order</li>
            <li>다른 generator·transcript domain</li>
            <li>해석할 수 없는 Ristretto point</li>
          </ul>
          <p>
            그다음 single·aggregate proof의 bytes, prove time, verify time과 peak memory를
            같은 commit·curve·generator capacity·logical range에서 측정합니다. 구버전과
            신버전 verifier의 교차 검증도 포함합니다.
          </p>

          <div id="paper-bulletproofs" className="scroll-mt-24">
            <CitationBlock
              type="paper"
              citeKey={1}
              source="Bünz et al. · Bulletproofs · 2017/1066"
              href={BULLETPROOFS_PAPER}
            >
              <p>
                <strong>문제:</strong> Trusted setup 없이 committed range와 arithmetic
                relation을 짧게 증명해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Logarithmic-size inner-product argument,
                range proof와 aggregation·multi-party protocol을 제시합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> Discrete-log hardness, independent generator,
                random-oracle Fiat–Shamir와 protocol의 integer encoding을 사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> 논문 construction·security model과 당시
                benchmark에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> Proof size가 logarithmic하다는 사실을
                prover·verifier time도 logarithmic하다고 확대하지 않습니다.
              </p>
            </CitationBlock>
          </div>

          <div id="paper-dalek-bulletproofs" className="scroll-mt-24">
            <CitationBlock
              type="code"
              citeKey={2}
              source="dalek-cryptography/bulletproofs · commit be67b6d"
              href={DALEK_SOURCE}
            >
              <p>
                <strong>문제:</strong> 실제 Ristretto commitment와 Merlin transcript,
                IPA folding 순서를 source로 확인해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> PedersenGens, InnerProductProof와 첫 round의
                L·R→u→fold 구현을 제공합니다.
              </p>
              <p>
                <strong>고정한 버전:</strong> Commit <code>be67b6d</code>의 세 원문
                범위를 사용합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 이 snapshot의 source 확인이 최신 release,
                모든 target의 constant-time 동작이나 production audit를 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ bulletproofs: bulletproofsTree }}
        projectMetas={{
          bulletproofs: {
            id: "bulletproofs",
            label: "dalek bulletproofs · Rust",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </>
  );
}
