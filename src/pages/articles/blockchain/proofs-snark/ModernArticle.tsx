import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { BellpersonSnarkViz } from "./BellpersonSnarkViz";

const PROVER =
  "https://github.com/filecoin-project/bellperson/blob/fd8f0dc3568589cd4d0f78bc5cd652fb6e6ee2c5/src/groth16/prover/mod.rs";
const SUPRASEAL =
  "https://github.com/filecoin-project/bellperson/blob/fd8f0dc3568589cd4d0f78bc5cd652fb6e6ee2c5/src/groth16/prover/supraseal.rs";
const GPU =
  "https://github.com/filecoin-project/bellperson/blob/fd8f0dc3568589cd4d0f78bc5cd652fb6e6ee2c5/src/gpu/mod.rs";

export default function ModernProofsSnark() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            PoRep·PoSt의 큰 계산을 짧은 검증 결과로 바꾸기
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            SNARK는 큰 저장 증명을 다시 계산하지 않고도 결과가 맞는지 확인하게
            합니다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          PoRep와 PoSt에는 많은 계산이 들어갑니다. 그 계산을 체인의 모든
          검증자가 다시 실행한다면 저장 증명보다 검증 비용이 더 큰 문제가
          생깁니다. 그래서 증명자가 무거운 계산을 한 번 수행하고, 검증자는 짧은
          proof와 공개 입력만 확인합니다.
        </p>
        <p className="text-lg leading-8 text-foreground/90">
          이 글에서는 같은 회로 8개에 서로 다른 비공개 답을 넣어 proof 8개를
          만드는 한 묶음을 따라갑니다. 회로를 실행해 채운 답안지가
          <code>assignment</code>입니다. 증명을 만드는 구현은
          <code>prover</code>입니다. 다른 언어의 GPU 코드로 넘어가는 경계는
          <code>FFI</code>입니다. 이름보다 먼저 볼 것은 “답안지 작성 → 구현 선택
          → proof 생성 → 원래 공개 입력으로 검증”이라는 이동입니다.
        </p>
        <p className="text-lg leading-8 text-foreground/90">
          <a className="text-primary hover:underline" href="/cs/crypto/groth16">
            Groth16 정본
          </a>
          은 QAP와 pairing 검증을 설명하고,{" "}
          <a
            className="text-primary hover:underline"
            href="/cs/gpu/filecoin-gpu-proofs"
          >
            GPU proof pipeline
          </a>
          은 FFT·MSM 가속의 원리를 설명합니다. 이 글은 Bellperson v0.27.0의 현재
          소스에서 assignment, 빌드 시점의 구현 선택, SupraSeal batch와 독립
          검증이 어떻게 이어지는지만 다룹니다.
        </p>
        <BellpersonSnarkViz />
        <ContentBoundary article="proofs-snark" />
      </section>

      <section id="assignment-artifact" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · 회로가 채운 답안지
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Assignment에는 왜 비공개 답 외에 A·B·C와 density도 들어갈까요?
          </h2>
        </header>
        <p>
          회로를 실행하면 공개 입력, 비공개 답과 각 제약식의 A·B·C 평가값이 같은
          순서로 생깁니다. Bellperson의 <code>ProvingAssignment</code>는 이
          채워진 답안지와 query가 실제로 쓰는 위치를 함께 보관합니다. 어떤
          위치가 쓰이는지를 표시한 것이 density tracker입니다.
        </p>
        <p>
          이 구조체 자체에는 회로 이름이나 proving key digest가 들어 있지
          않습니다. 따라서 운영 artifact에서는 회로·field·parameter digest, 공개
          입력 순서와 예상 vector 길이를 별도 header로 묶어야 합니다. 그렇지
          않으면 모양이 비슷한 다른 회로의 답안지가 섞여도 원인을 찾기
          어렵습니다.
        </p>
        <ExplainedFormula
          question="Density map은 왜 별도 artifact인가?"
          idea={
            <>
              0이 아닌 query 항만 MSM에 보내면 결과는 유지하면서 불필요한
              scalar-point 곱을 피할 수 있기 때문입니다.
            </>
          }
          formula={String.raw`M_A=\sum_{i=0}^{N_{aux}-1}\mathbf{1}[D_A(i)=1],\quad \rho_A=M_A/N_{aux}`}
          annotatedFormula={String.raw`\underbrace{M_A}_{\text{실제 MSM 항 수}}=\sum_{i=0}^{N_{aux}-1}\underbrace{\mathbf{1}[D_A(i)=1]}_{\text{A query에 쓰이면 1}},\quad \underbrace{\rho_A=M_A/N_{aux}}_{\text{활성 비율}}`}
          operations={[
            {
              expression: String.raw`\mathbf{1}[D_A(i)=1]`,
              annotation: [
                "auxiliary 변수마다 density bit 확인",
                "0인 항은 MSM에 보내지 않음",
              ],
            },
            {
              expression: String.raw`\rho_A=M_A/N_{aux}`,
              annotation: [
                "100개 중 24개면 M_A=24, ρ_A=0.24",
                "성능 입력일 뿐 security parameter 아님",
              ],
            },
          ]}
          terms={[
            {
              symbol: "D_A(i)",
              name: "A-query density bit",
              description:
                "Auxiliary variable i가 A query MSM에 포함되는지 나타냅니다.",
            },
            {
              symbol: "N_{aux}",
              name: "Auxiliary count",
              description:
                "회로가 만든 private auxiliary assignments 수입니다.",
            },
            {
              symbol: "M_A",
              name: "Active A terms",
              description: "A-query MSM이 실제 처리할 항 수입니다.",
            },
            {
              symbol: String.raw`\rho_A`,
              name: "A density",
              description: "0과 1 사이의 활성 비율입니다.",
            },
            {
              symbol: String.raw`\mathbf{1}[\cdot]`,
              name: "Indicator",
              description: "조건이 참이면 1, 아니면 0입니다.",
            },
          ]}
          assumptions={[
            "Density bit와 query vector index가 같은 circuit synthesis 순서를 사용합니다.",
            "Density는 correctness를 바꾸지 않으며, 빠진 nonzero term은 proof를 깨뜨립니다.",
          ]}
          interpretation="보조 변수 100개 중 A query가 24개만 쓰이면 MA=24, ρA=0.24입니다. 이 값은 성능 입력이지 Groth16 security parameter가 아닙니다."
        />
        <div id="paper-bellperson-assignment">
          <CitationBlock
            type="code"
            citeKey={1}
            source="bellperson Groth16 prover v0.27.0 · commit fd8f0dc"
            href={PROVER}
          >
            <p>
              <strong>문제:</strong> Constraint synthesis 결과를 Groth16
              prover의 FFT·MSM 입력으로 변환해야 합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Pinned source는 ProvingAssignment의
              A/B/C evaluations, input/aux assignments와 density trackers,
              native/SupraSeal compile-time path를 보여 줍니다.
            </p>
            <p>
              <strong>중요 가정:</strong> commit fd8f0dc와 동일한 feature set,
              scalar engine, parameters를 사용합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> bellperson의 prover data layout과
              dispatch 경계입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 임의 SNARK의 assignment 형식이나 GPU
              speedup을 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="prover-dispatch" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · 증명 구현 고르기
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Native와 SupraSeal은 요청마다 자동으로 고르는 선택지일까요?
          </h2>
        </header>
        <p>
          아닙니다. 현재 소스에서는 <code>cuda-supraseal</code> feature를 켜서
          빌드하면 SupraSeal module이, 끄면 native module이 연결됩니다. 요청이
          들어온 뒤 두 구현의 속도를 비교해 고르는 구조가 아닙니다.
        </p>
        <p>
          Native 경로 안에서는 CUDA·OpenCL feature와 실행 장치에 따라 FFT·MSM
          helper가 달라질 수 있습니다. 이 내부 가속기 선택과 SupraSeal 전체
          batch 경로를 같은 선택으로 보면 안 됩니다. 영수증에는 binary revision,
          feature manifest와 실제 장치를 남깁니다. SupraSeal 실패 뒤 native를
          쓰려면 별도 binary와 새 job으로 드러내야 합니다.
        </p>
        <ExplainedFormula
          question="한 job의 prover path를 어떻게 결정적으로 기록할까?"
          idea={
            <>
              빌드 feature와 admitted batch preconditions를 path identity에
              포함합니다.
            </>
          }
          formula={String.raw`P=\begin{cases}SS,& f_{ss}=1\land E=1\land S=1\\Native,& f_{ss}=0\end{cases}`}
          annotatedFormula={String.raw`P=\begin{cases}\underbrace{SS}_{\text{SupraSeal batch}},& \underbrace{f_{ss}=1}_{\text{feature 빌드}}\land \underbrace{E=1}_{\text{동일 크기}}\land \underbrace{S=1}_{\text{SRS 확인}}\\\underbrace{Native}_{\text{Bellperson 기본}},& f_{ss}=0\end{cases}`}
          operations={[
            {
              expression: String.raw`f_{ss}=1\land E=1\land S=1`,
              annotation: [
                "cuda-supraseal 빌드, 동일 크기 batch,",
                "pinned SRS 로드가 모두 참일 때만 SS",
                "A vector 길이가 다른 항목이면 batch 중단",
              ],
            },
            {
              expression: String.raw`f_{ss}=0`,
              annotation: [
                "feature 없이 빌드된 binary만 native",
                "f_ss=1인데 E·S 실패면 fail-closed",
              ],
            },
          ]}
          terms={[
            {
              symbol: "P",
              name: "Prover path",
              description:
                "이번 receipt가 사용한 SupraSeal 또는 native implementation입니다.",
            },
            {
              symbol: "f_{ss}",
              name: "SupraSeal feature",
              description: "Binary가 cuda-supraseal로 컴파일됐는지 나타냅니다.",
            },
            {
              symbol: "E",
              name: "Equal-size admission",
              description:
                "Batch assignments의 constraint/A-vector 길이가 같으면 1입니다.",
            },
            {
              symbol: "S",
              name: "SRS admission",
              description: "Pinned SRS가 성공적으로 로드되고 확인되면 1입니다.",
            },
            {
              symbol: "SS",
              name: "SupraSeal path",
              description: "FFI batch prover 경로입니다.",
            },
            {
              symbol: "Native",
              name: "Native path",
              description: "Bellperson의 기본 prover 경로입니다.",
            },
          ]}
          assumptions={[
            "fss=1인데 E 또는 S가 0이면 식의 결과가 없으므로 fail-closed합니다.",
            "Feature-selected 구현을 런타임 heuristic으로 바꾸지 않습니다.",
          ]}
          interpretation="A vector 길이가 다른 assignment가 하나라도 섞이면 현재 adapter의 assert에서 batch가 중단됩니다. 같은 프로세스에서 몰래 native로 바꾸는 것은 이 식이 허용하는 동작이 아닙니다."
        />
        <div id="paper-bellperson-gpu-dispatch">
          <CitationBlock
            type="code"
            citeKey={2}
            source="bellperson GPU module v0.27.0 · commit fd8f0dc"
            href={GPU}
          >
            <p>
              <strong>문제:</strong> 같은 prover interface에서 CPU-only와
              CUDA/OpenCL MSM 구현을 선택해야 합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Pinned module은 cfg feature에 따른
              CpuGpuMultiexpKernel 또는 no-GPU surface를 정의합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> 빌드 artifact와 runtime device/runtime
              libraries가 일치합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> bellperson 내부의 accelerator
              selection입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 특정 GPU의 availability, 성능, 자동
              fallback 성공을 뜻하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="supraseal-boundary" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · Rust에서 GPU batch로 넘기기
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            FFI가 proof를 돌려주면 왜 곧바로 성공이라고 할 수 없을까요?
          </h2>
        </header>
        <p>
          SupraSeal adapter는 Rust assignments의 포인터와 길이를 C++가 읽는
          형태로 바꿉니다. 이어서 각 assignment의 A vector 길이가 첫 항목과
          같은지 확인하고, SRS handle과 함께 batch prover를 호출합니다.
        </p>
        <p>
          여기서 proof 8개가 돌아왔다는 사실은 “출력이 생겼다”는 뜻일 뿐입니다.
          Rust 쪽 circuit index와 반환 proof index를 다시 연결하고, 각 proof를
          원래 공개 입력과 verification key로 독립 검증해야 “요청 8개가
          성공했다”고 말할 수 있습니다.
        </p>
        <ExplainedFormula
          question="Batch latency에서 무엇을 분리해 기록해야 할까?"
          idea={
            <>
              병렬 synthesis, FFI 변환, GPU prover와 독립 검증을 한 숫자로
              뭉개지 않습니다.
            </>
          }
          formula={String.raw`T_{e2e}=\max_i T_{synth,i}+T_{pack}+T_{ffi}+T_{prove}+T_{verify}`}
          annotatedFormula={String.raw`T_{e2e}=\underbrace{\max_i T_{synth,i}}_{\text{가장 늦은 synthesis}}+\underbrace{T_{pack}+T_{ffi}}_{\text{FFI 경계 비용}}+\underbrace{T_{prove}}_{\text{GPU batch 증명}}+\underbrace{T_{verify}}_{\text{독립 검증}}`}
          operations={[
            {
              expression: String.raw`\max_i T_{synth,i}`,
              annotation: [
                "synthesis는 병렬이라 가장 늦은",
                "circuit 하나만 wall time에 들어갑니다",
              ],
            },
            {
              expression: String.raw`T_{pack}+T_{ffi}+T_{prove}+T_{verify}`,
              annotation: [
                "이후 단계는 차례로 더하되 따로 기록합니다",
                "8+3+1+20+4=36 ms",
              ],
            },
          ]}
          terms={[
            {
              symbol: "T_{e2e}",
              name: "End-to-end latency",
              description:
                "Assignment 시작부터 모든 proof 검증까지의 wall time입니다.",
            },
            {
              symbol: "T_{synth,i}",
              name: "Circuit synthesis",
              description: "i번째 circuit assignment 생성 시간입니다.",
            },
            {
              symbol: "T_{pack}",
              name: "FFI packing",
              description: "Rust values를 backend payload로 바꾸는 시간입니다.",
            },
            {
              symbol: "T_{ffi}",
              name: "FFI overhead",
              description: "Boundary call과 result materialization 시간입니다.",
            },
            {
              symbol: "T_{prove}",
              name: "Batch proving",
              description: "SupraSeal이 batch proof를 만드는 시간입니다.",
            },
            {
              symbol: "T_{verify}",
              name: "Independent verification",
              description: "각 proof/public input을 검증하는 시간입니다.",
            },
          ]}
          assumptions={[
            "Synthesis가 실제로 병렬 실행될 때만 max로 모델링합니다.",
            "동기화와 device transfer는 측정된 stage에 빠짐없이 포함합니다.",
          ]}
          interpretation="각 synthesis가 8ms, pack 3ms, FFI 1ms, prove 20ms, verify 4ms라면 e2e는 36ms입니다. stage 합을 숨긴 고정 speedup 주장은 하지 않습니다."
        />
        <div id="paper-bellperson-supraseal">
          <CitationBlock
            type="code"
            citeKey={3}
            source="bellperson SupraSeal adapter v0.27.0 · commit fd8f0dc"
            href={SUPRASEAL}
          >
            <p>
              <strong>문제:</strong> 여러 Groth16 assignments를 external batch
              prover와 안전하게 연결해야 합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Pinned source는 equal-size check,
              assignment conversion, SRS acquisition과 batch proof call을 보여
              줍니다.
            </p>
            <p>
              <strong>중요 가정:</strong> 같은 commit의 FFI ABI, parameter
              cache와 cuda-supraseal dependency를 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Bellperson–SupraSeal integration
              boundary입니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 완전한 memory safety, constant-time,
              모든 circuit size 지원이나 고정 speedup을 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · 배포해도 되는지 판단하기
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            빠른 proof가 아니라 검증된 proof를 기준으로 비교해야 합니다
          </h2>
        </header>
        <p>
          먼저 정상 회로가 세 backend에서 같은 statement를 증명하는지 봅니다.
          그다음 실패 사례를 두 묶음으로 나눕니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="font-semibold">Statement를 바꾸는 오류</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
              <li>만족하지 않는 비공개 답</li>
              <li>공개 입력의 순서 변경</li>
              <li>다른 parameter·SRS 또는 proof 한 byte 변조</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="font-semibold">Batch 경계를 깨는 오류</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
              <li>서로 다른 assignment 길이</li>
              <li>손상된 FFI 길이와 proof 개수</li>
              <li>반환 proof 순서 변경</li>
            </ul>
          </div>
        </div>
        <p>
          모든 proof가 독립 verifier를 통과한 뒤에만 cold/warm, batch size,
          synthesis·transfer·kernel·verify 시간과 peak host/device memory를
          비교합니다. 새 binary나 driver에서 parity가 깨지면 고정해 둔 native
          artifact로 되돌립니다.
        </p>
        <ExplainedFormula
          question="Batch prover의 유효 처리량은 무엇인가?"
          idea={
            <>
              정확한 public input으로 검증된 proof만 전체 wall time으로
              나눕니다.
            </>
          }
          formula={String.raw`Q_v=\frac{N_{ok}}{T_{e2e}},\quad r_f=1-\frac{N_{ok}}{N_{submitted}}`}
          annotatedFormula={String.raw`\underbrace{Q_v}_{\text{검증된 처리량}}=\frac{\underbrace{N_{ok}}_{\text{검증 통과 proof}}}{\underbrace{T_{e2e}}_{\text{전체 wall time}}},\quad \underbrace{r_f}_{\text{실패율}}=1-\frac{N_{ok}}{N_{submitted}}`}
          operations={[
            {
              expression: String.raw`\frac{N_{ok}}{T_{e2e}}`,
              annotation: [
                "expected input·VK로 검증된 proof만",
                "synthesis~verification 시간으로 나눔",
              ],
            },
            {
              expression: String.raw`1-\frac{N_{ok}}{N_{submitted}}`,
              annotation: [
                "제출했지만 승인되지 않은 비율",
                "8개 중 7개면 r_f=0.125, 배포 차단",
              ],
            },
          ]}
          terms={[
            {
              symbol: "Q_v",
              name: "Verified throughput",
              description: "초당 승인된 Groth16 proofs입니다.",
            },
            {
              symbol: "N_{ok}",
              name: "Verified proofs",
              description:
                "Expected public inputs와 pinned VK로 검증된 proof 수입니다.",
            },
            {
              symbol: "T_{e2e}",
              name: "End-to-end time",
              description: "Synthesis부터 verification까지 wall time입니다.",
            },
            {
              symbol: "r_f",
              name: "Failure rate",
              description: "제출했지만 승인되지 않은 비율입니다.",
            },
            {
              symbol: "N_{submitted}",
              name: "Submitted circuits",
              description: "Batch에 넣은 전체 circuit 수입니다.",
            },
          ]}
          assumptions={[
            "동일 circuit/parameters/input distribution과 cold/warm 조건을 비교합니다.",
            "한 건이라도 unexpected failure면 release gate는 실패합니다.",
          ]}
          interpretation="8개 중 7개만 검증돼도 Qv는 계산할 수 있지만 rf=0.125이므로 배포는 막아야 합니다."
        />
        <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">이 글의 완료 경계:</strong>{" "}
          Assignment 생성, 빌드 시점의 prover 선택, SupraSeal batch와 독립
          verification까지 설명합니다. Groth16 수학과 Filecoin chain inclusion은
          연결한 정본 글에서 이어집니다.
        </aside>
      </section>
    </article>
  );
}
