import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { pdpTree } from "./fileTrees";
import { PdpChallengeViz } from "./PdpChallengeViz";
import DetectionCurveViz from "./viz/DetectionCurveViz";
import LogicalArrayViz from "./viz/LogicalArrayViz";
import PeriodRulesViz from "./viz/PeriodRulesViz";

const PDP_COMMIT = "4d6b30f95845ca5ef35f9430a3a3f435af54d291";
const CURIO_COMMIT = "409a2ab3510d65f22ae31ba1afddc911f4b315d7";
const PDP_DESIGN = `https://github.com/FilOzone/pdp/blob/${PDP_COMMIT}/docs/design.md`;
const PDP_VERIFIER = `https://github.com/FilOzone/pdp/blob/${PDP_COMMIT}/src/PDPVerifier.sol`;
const PDP_SERVICE = `https://github.com/FilOzone/pdp/blob/${PDP_COMMIT}/src/SimplePDPService.sol`;
const PDP_SCHEDULE = `https://github.com/FilOzone/pdp/blob/${PDP_COMMIT}/src/IPDPProvingSchedule.sol`;
const CURIO_PDP = `https://github.com/filecoin-project/curio/blob/${CURIO_COMMIT}/pdp/README.md`;

export default function ModernFilecoinPdp() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article className="space-y-14">
        <section id="overview" className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              Piece A 60 leaves와 Piece B 40 leaves를 한 번 증명하기
            </p>
            <h2 className="break-keep text-3xl font-bold tracking-tight">
              PDP는 무작위 leaf로 데이터의 현재 보유 여부를 반복 확인합니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            한 문장으로 말하면, <strong>PDP(Provable Data Possession)</strong>는
            계약이 고른 일부 위치의 Merkle proof를 제공자가 제때 제출하게 하는
            표본 검사입니다. 그러면 바로 두 질문이 생깁니다. 여러 piece 가운데
            어느 위치를 뽑는지, 그리고 표본 몇 개가 맞았다고 파일 전체를 가지고
            있다고 말해도 되는지입니다. 아래에서는 같은 100-leaf 예제를 끝까지
            따라가며 두 질문을 분리합니다.
          </p>

          <PdpChallengeViz />
          <ContentBoundary article="filecoin-pdp" />
        </section>

        <section id="dataset-artifact" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              01 · 먼저 ‘무엇을 증명할지’를 고정한다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Piece 순서와 leaf 수를 붙여 하나의 논리 배열로 보아야 73번의 뜻이
              정해집니다
            </h2>
          </header>

          <LogicalArrayViz />

          <p>
            예제 dataset에는 A가 먼저, B가 다음으로 등록돼 있습니다. A는 leaf
            60개이므로 전체 번호 0–59를 차지합니다. B는 40개이므로 60–99를
            차지합니다. 따라서 전체 73번은 B 안의 13번입니다. 같은 두 root를
            등록해도 순서를 바꾸거나 leaf 수를 바꾸면 전체 번호가 가리키는
            데이터도 달라집니다.
          </p>

          <p>
            개념상으로는 앞 piece들의 leaf 수를 누적하면 됩니다. 실제 PDP v3.5.0
            계약은 piece가 추가·삭제되는 dataset에서도 이 위치를 빨리 찾기 위해
            <strong> Fenwick/BIT 계열의 sum-tree</strong>를 사용합니다. 즉 아래
            식은 의미를 설명하고, 실제 코드는 같은 누적 구간 찾기를 이진
            탐색으로 수행합니다.
          </p>

          <ExplainedFormula
            question="전체 73번 leaf를 piece 안 위치로 어떻게 바꿀까?"
            idea={
              <>
                선택한 piece 앞의 leaf 수를 모두 더한 뒤 전체 번호에서 뺍니다.
              </>
            }
            formula={String.raw`o_i=\sum_{j<i}L_j,\qquad o_i\le c<o_i+L_i,\qquad local=c-o_i`}
            annotatedFormula={String.raw`\underbrace{o_i}_{\text{piece 시작점}}=\underbrace{\sum_{j<i}L_j}_{\text{앞 piece의 leaf 수}},\qquad \underbrace{o_i\le c<o_i+L_i}_{\text{c가 속한 구간}},\qquad \underbrace{local=c-o_i}_{\text{piece 안 위치}}`}
            operations={[
              {
                expression: String.raw`o_B=L_A=60`,
                annotation: [
                  "B 앞에는 A만 있습니다",
                  "A의 leaf 60개만큼 B의 시작점이 밀립니다",
                ],
              },
              {
                expression: String.raw`60\le73<100`,
                annotation: [
                  "73은 B가 차지한 구간 안입니다",
                  "따라서 piece B를 선택합니다",
                ],
              },
              {
                expression: String.raw`local=73-60=13`,
                annotation: ["B 안에서 열어야 할 위치는 13번입니다"],
              },
            ]}
            terms={[
              {
                symbol: "o_i",
                name: "Piece 시작점",
                description: "i번째 piece 앞에 놓인 전체 leaf 수입니다.",
              },
              {
                symbol: "L_j",
                name: "Piece leaf 수",
                description: "j번째 piece에 들어 있는 Merkle leaf 수입니다.",
              },
              {
                symbol: "c",
                name: "전체 challenge 번호",
                description:
                  "dataset 전체를 0부터 셌을 때 열어야 하는 위치입니다.",
              },
              {
                symbol: "local",
                name: "Piece 안 위치",
                description: "선택된 piece 안에서 열어야 하는 leaf 번호입니다.",
              },
            ]}
            assumptions={[
              "Piece 순서와 leaf 수는 challenge를 뽑기 전에 계약에 기록돼 있습니다.",
              "제공자와 verifier가 같은 Merkle tree 모양과 leaf 인코딩을 사용합니다.",
            ]}
            interpretation="A=60, B=40인 dataset에서 전체 번호 73은 B의 13번 leaf입니다. 실제 계약은 이 누적 구간 찾기를 sum-tree의 이진 탐색으로 처리합니다."
          />

          <div id="paper-pdp-design">
            <CitationBlock
              type="code"
              citeKey={1}
              source="FilOzone PDP design · v3.5.0"
              href={PDP_DESIGN}
            >
              <p>
                <strong>문제:</strong> 여러 Merkle piece를 하나의 dataset으로
                묶고, 무작위 표본으로 possession을 반복 확인해야 합니다.
              </p>
              <p>
                <strong>핵심:</strong> 공식 설계는 logical array, Fenwick/BIT
                계열 탐색, chain randomness, proving period와 listener의 fault
                처리를 설명합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> PDP v3.5.0 tag의 설계와 계약 경계에
                한정합니다.
              </p>
              <p>
                <strong>확대 금지:</strong> possession proof는 PoRep의 복제본
                전용 인코딩도, 전체 파일의 즉시 다운로드 보장도 아닙니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="challenge-proof" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · 다음은 ‘어느 leaf를 열지’를 제공자가 아닌 계약이 정한다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Beacon seed와 set ID, proof 순번을 해시해 dataset 전체 번호를
              만듭니다
            </h2>
          </header>

          <p>
            제공자가 번호를 직접 고르면 보관 중인 일부 위치만 골라 보여 줄 수
            있습니다. 그래서 verifier는 예약된 challenge epoch의 Filecoin beacon
            randomness를 읽고, 여기에 set ID와 proof 순번을 붙여 해시합니다.
            해시를 전체 leaf 수로 나눈 나머지가 challenge 번호입니다.
          </p>

          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="실제 PDPVerifier.sol · 번호 선택과 Merkle 검증"
              onClick={() =>
                sidebar.open("pdp-verifier", codeRefs["pdp-verifier"])
              }
            />
          </div>

          <ExplainedFormula
            question="해시 결과를 dataset 안의 번호로 어떻게 바꿀까?"
            idea={
              <>
                Seed·dataset·순번을 함께 해시한 정수를 전체 leaf 수로 나눠
                나머지를 씁니다.
              </>
            }
            formula={String.raw`c_i=\operatorname{uint}(keccak256(seed\|setId\|i))\bmod L`}
            annotatedFormula={String.raw`\underbrace{c_i}_{\text{열 leaf 번호}}=\operatorname{uint}(keccak256(\underbrace{seed}_{\text{beacon randomness}}\|\underbrace{setId}_{\text{dataset}}\|\underbrace{i}_{\text{proof 순번}}))\underbrace{\bmod L}_{\text{0부터 L-1로 제한}}`}
            operations={[
              {
                expression: String.raw`keccak256(seed\|setId\|i)`,
                annotation: [
                  "같은 period라도 dataset과 순번이 다르면 입력이 달라집니다",
                  "제공자가 보관한 위치만 골라 내기 어렵게 합니다",
                ],
              },
              {
                expression: String.raw`h\bmod100=73`,
                annotation: [
                  "이 글에서는 해시 정수 h의 나머지를 73으로 고정합니다",
                  "앞 절에 따라 piece B의 local 13을 엽니다",
                ],
              },
            ]}
            terms={[
              {
                symbol: "c_i",
                name: "Challenge 번호",
                description:
                  "i번째 proof가 열어야 하는 dataset 전체 leaf 번호입니다.",
              },
              {
                symbol: "seed",
                name: "Period seed",
                description:
                  "예약된 epoch에서 가져온 Filecoin beacon randomness입니다.",
              },
              {
                symbol: "setId",
                name: "Dataset ID",
                description: "어느 등록 dataset을 검증하는지 구별합니다.",
              },
              {
                symbol: "i",
                name: "Proof 순번",
                description:
                  "한 제출 안에서 각 challenge를 구별하는 0부터의 번호입니다.",
              },
              {
                symbol: "L",
                name: "Challenge range",
                description:
                  "이번 period에 challenge할 수 있는 전체 leaf 수입니다.",
              },
            ]}
            assumptions={[
              "Challenge range L은 0보다 크고 이번 period에 고정돼 있습니다.",
              "Beacon randomness를 읽는 epoch와 계약 버전이 고정돼 있습니다.",
            ]}
            interpretation="L=100이고 해시 정수를 100으로 나눈 나머지가 73이면 verifier와 provider 모두 B의 13번 leaf를 대상으로 같은 proof를 계산합니다."
          />

          <div id="paper-pdp-verifier">
            <CitationBlock
              type="code"
              citeKey={2}
              source="PDPVerifier.sol · v3.5.0"
              href={PDP_VERIFIER}
            >
              <p>
                <strong>문제:</strong> 계약이 같은 challenge를 재구성하고 제출된
                leaf와 Merkle path를 등록 root에 대해 검증해야 합니다.
              </p>
              <p>
                <strong>핵심:</strong> 실제 코드는 challenge epoch를 확인하고,
                beacon seed를 읽고, keccak256과 modulo로 번호를 만든 다음
                sum-tree와 Merkle verifier를 호출합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> v3.5.0의 on-chain 검증 동작에
                한정합니다.
              </p>
              <p>
                <strong>확대 금지:</strong> 계약 검증 성공은 제공자 디스크
                상태나 다운로드 대역폭을 직접 측정한 결과가 아닙니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="period-state" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · 한 번 맞힌 뒤에는 ‘언제, 몇 개를 냈는지’를 판정한다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Merkle proof만 맞는다고 이번 period가 성공하는 것은 아닙니다
            </h2>
          </header>

          <PeriodRulesViz />

          <p>
            PDPVerifier는 leaf와 path를 검증한 뒤 listener의
            <code> possessionProven</code>을 부릅니다. 기본 listener인
            SimplePDPService는 같은 period의 중복 제출, 필요한 수보다 적은
            challenge, 시작 전·너무 이른·deadline 뒤 제출을 거부합니다. 다음
            period로 이동할 때 이전 proof가 없었거나 여러 period를 건너뛰었다면
            FaultRecord를 남깁니다.
          </p>

          <p>
            암호 검증은 제출한 leaf가 root에 포함되는지 답하고, listener는 그
            제출이 서비스 일정에 맞았는지 답합니다. 두 판단은 한 transaction에서
            이어지지만 맡은 질문은 다릅니다.
          </p>

          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="실제 SimplePDPService.sol · window와 fault"
              onClick={() =>
                sidebar.open("pdp-schedule", codeRefs["pdp-schedule"])
              }
            />
          </div>

          <DetectionCurveViz />

          <ExplainedFormula
            question="데이터의 10%를 잃은 제공자를 한 period에 찾을 가능성은?"
            idea={
              <>
                K번 모두 손실 구간을 피할 확률을 먼저 구하고, 이를 1에서 뺍니다.
              </>
            }
            formula={String.raw`P_{detect}=1-(1-\alpha)^{KT}`}
            annotatedFormula={String.raw`\underbrace{P_{detect}}_{\text{T period 안에 발견}}=\underbrace{1}_{\text{전체 경우}}-\underbrace{(1-\alpha)^{KT}}_{\text{KT번 모두 손실을 피함}}`}
            operations={[
              {
                expression: String.raw`1-\alpha=1-0.1=0.9`,
                annotation: ["한 sample이 남아 있는 데이터를 뽑을 확률입니다"],
              },
              {
                expression: String.raw`0.9^5\approx0.59049`,
                annotation: [
                  "K=5인 한 period에서 다섯 번 모두 손실을 피할 확률입니다",
                ],
              },
              {
                expression: String.raw`1-0.59049=0.40951`,
                annotation: [
                  "한 번이라도 손실 leaf를 뽑을 확률은 약 41%입니다",
                ],
              },
            ]}
            terms={[
              {
                symbol: "P_{detect}",
                name: "발견 확률",
                description:
                  "T periods 안에 적어도 한 sample이 손실 영역을 맞힐 확률입니다.",
              },
              {
                symbol: String.raw`\alpha`,
                name: "손실 비율",
                description: "Dataset 전체 leaf 가운데 열 수 없는 비율입니다.",
              },
              {
                symbol: "K",
                name: "Period당 challenge 수",
                description: "한 period에 검증하는 sample 수입니다.",
              },
              {
                symbol: "T",
                name: "관찰한 period 수",
                description: "같은 손실 상태를 반복 검사한 횟수입니다.",
              },
            ]}
            assumptions={[
              "각 challenge가 독립적이고 dataset 전체에서 균등하게 뽑힌다고 단순화합니다.",
              "손실 비율이 관찰 기간 동안 변하지 않고 제공자가 중간에 복구하지 않는다고 봅니다.",
            ]}
            interpretation="α=0.1, K=5, T=1이면 발견 확률은 약 41%입니다. 이는 한 period의 통계적 발견 가능성이지 데이터가 100% 안전하다는 보장이 아닙니다."
          />

          <div id="paper-pdp-schedule">
            <CitationBlock
              type="code"
              citeKey={3}
              source="PDP proving schedule · v3.5.0"
              href={PDP_SCHEDULE}
            >
              <p>
                <strong>문제:</strong> 클라이언트가 최대 proving period,
                challenge window, 필요한 challenge 수와 다음 window를 같은
                기준으로 읽어야 합니다.
              </p>
              <p>
                <strong>핵심:</strong> IPDPProvingSchedule은 설정과 다음 window
                조회 경계를 정의하고, 실제 기본 구현은 SimplePDPService에서
                deadline과 fault를 처리합니다.
              </p>
              <p>
                <strong>구현 확인:</strong>{" "}
                <a className="text-primary hover:underline" href={PDP_SERVICE}>
                  SimplePDPService.sol
                </a>
                에서 proof 개수·window·FaultRecord 로직을 확인할 수 있습니다.
              </p>
              <p>
                <strong>확대 금지:</strong> ABI가 transaction inclusion, chain
                finality나 운영자의 재시도 성공을 보장하지는 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="release-gate" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · 마지막은 possession과 retrieval을 분리한다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              이번 period 성공은 전체 파일 다운로드 보장이 아닙니다
            </h2>
          </header>

          <p>
            운영 승인에서는 dataset revision, schedule, 모든 Merkle proof와
            canonical transaction을 함께 확인합니다. 그러나 여기까지는 ‘뽑힌
            leaf를 열 수 있었다’는 영수증입니다.
          </p>

          <p>
            사용자가 전체 파일을 실제로 받을 수 있는지, 어느 속도로 받을 수
            있는지는 별도의 retrieval 시험과 서비스 지표가 답합니다. Curio의
            upload·dataset API 성공도 같은 이유로 on-chain proof 성공과
            동일시하지 않습니다.
          </p>

          <ExplainedFormula
            question="이번 PDP period를 운영상 승인하려면 무엇이 모두 맞아야 할까?"
            idea={
              <>
                Dataset, 일정, K개 proof, canonical transaction을 AND로 묶고
                retrieval은 별도 gate로 둡니다.
              </>
            }
            formula={String.raw`A=D_{ok}\land S_{ok}\land\left(\bigwedge_{i=0}^{K-1}M_i\right)\land T_{final}`}
            annotatedFormula={String.raw`\underbrace{A}_{\text{PDP period 승인}}=\underbrace{D_{ok}}_{\text{dataset 일치}}\land\underbrace{S_{ok}}_{\text{window 일치}}\land\underbrace{\left(\bigwedge_{i=0}^{K-1}M_i\right)}_{\text{K개 Merkle proof 전부}}\land\underbrace{T_{final}}_{\text{canonical transaction}}`}
            operations={[
              {
                expression: String.raw`\bigwedge_{i=0}^{K-1}M_i`,
                annotation: [
                  "요구한 K개 challenge 가운데 하나라도 틀리면 전체 제출이 실패합니다",
                ],
              },
              {
                expression: String.raw`A=1\ \text{only if every term is 1}`,
                annotation: [
                  "Proof가 맞아도 dataset revision이나 window가 다르면 승인하지 않습니다",
                  "Retrieval 가능 여부는 이 식 밖에서 따로 검사합니다",
                ],
              },
            ]}
            terms={[
              {
                symbol: "A",
                name: "Period 승인",
                description:
                  "이번 possession receipt를 운영 장부에 반영하면 1입니다.",
              },
              {
                symbol: "D_{ok}",
                name: "Dataset 일치",
                description:
                  "Set ID, piece 순서·roots·leaf 수와 revision이 같으면 1입니다.",
              },
              {
                symbol: "S_{ok}",
                name: "Schedule 일치",
                description: "Challenge epoch와 제출 window가 맞으면 1입니다.",
              },
              {
                symbol: "M_i",
                name: "Merkle proof",
                description: "i번째 leaf와 path가 등록 root에 열리면 1입니다.",
              },
              {
                symbol: "T_{final}",
                name: "거래 확정",
                description:
                  "요구한 finality 기준에서 거래가 canonical chain에 남으면 1입니다.",
              },
            ]}
            assumptions={[
              "Local receipt와 on-chain verifier가 같은 ABI와 dataset revision을 사용합니다.",
              "Finality 기준과 retrieval SLO는 배포 환경의 운영 정책으로 따로 고정합니다.",
            ]}
            interpretation="모든 Merkle proof가 맞아도 잘못된 dataset revision이거나 transaction이 reorg되면 A=0입니다. A=1이어도 retrieval 시험 결과는 별도로 기록합니다."
          />

          <div id="paper-curio-pdp">
            <CitationBlock
              type="code"
              citeKey={4}
              source="Curio PDP provider API · v1.29.0"
              href={CURIO_PDP}
            >
              <p>
                <strong>문제:</strong> 제공자 쪽에서 piece upload, dataset
                생성·추가, pull과 종료 작업을 contract lifecycle에 연결해야
                합니다.
              </p>
              <p>
                <strong>핵심:</strong> 고정한 Curio README는 provider-side HTTP
                API와 piece·dataset 작업 경계를 설명합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> Curio v1.29.0의 provider 통합 문서에
                한정하며 on-chain 의미는 PDP 계약에서 확인합니다.
              </p>
              <p>
                <strong>확대 금지:</strong> API 성공은 장기 내구성, 고정 upload
                속도, retrieval SLO나 다음 period의 proof 성공을 보장하지
                않습니다.
              </p>
            </CitationBlock>
          </div>

          <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">이 글의 결론:</strong> PDP는
            dataset 전체에서 예측하기 어려운 위치를 뽑고, 등록 piece root까지
            Merkle path를 열게 하는 반복 표본 검사입니다. 성공 영수증이 말하는
            것은 이번 period의 sampled possession이며, 전체 retrieval과 미래
            availability는 별도 증거가 필요합니다.
          </aside>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ pdp: pdpTree }}
        projectMetas={{
          pdp: {
            id: "pdp",
            label: "FilOzone PDP · Solidity",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </>
  );
}
