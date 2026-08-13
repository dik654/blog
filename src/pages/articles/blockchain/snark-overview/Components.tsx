import Math from "@/components/ui/math";
import FormulaGuide from "@/components/ui/formula-guide";

export default function Components() {
  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Setup &middot; Prove &middot; Verify
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SNARK는 세 단계로 구성된다
          <br />각 단계의 입력과 출력, 그리고 비용 구조를 이해하는 것이 핵심이다
        </p>

        {/* ── Setup ── */}
        <h3 className="text-xl font-semibold mt-8 mb-4">1. Setup</h3>
        <p>
          회로(circuit)로부터 proving key <Math>{"\\mathsf{pk}"}</Math>와
          verification key <Math>{"\\mathsf{vk}"}</Math>를 생성한다
        </p>
        <Math display>
          {"\\mathsf{Setup}(C) \\rightarrow (\\mathsf{pk}, \\mathsf{vk})"}
        </Math>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mt-4 mb-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2 text-sky-400">
              Trusted Setup (Circuit-specific)
            </h4>
            <ul className="space-y-1 text-sm">
              <li>- Groth16: 회로마다 별도 세레모니 필요</li>
              <li>
                - toxic waste <Math>{"\\tau, \\alpha, \\beta"}</Math>가 생성되며
                반드시 폐기해야 한다
              </li>
              <li>- 장점: 가장 작은 증명, 가장 빠른 검증</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2 text-emerald-400">
              Universal Setup
            </h4>
            <ul className="space-y-1 text-sm">
              <li>- PLONK, Marlin: 한 번의 세레모니로 모든 회로에 재사용</li>
              <li>- SRS(Structured Reference String) 크기만 충분하면 된다</li>
              <li>- 회로 변경 시 재셋업 불필요</li>
            </ul>
          </div>
        </div>

        {/* ── Prove ── */}
        <h3 className="text-xl font-semibold mt-8 mb-4">2. Prove</h3>
        <p>
          증명자가 proving key, 공개 입력, 비밀 witness를 입력으로 증명{" "}
          <Math>{"\\pi"}</Math>를 생성한다
        </p>
        <Math display>
          {"\\mathsf{Prove}(\\mathsf{pk}, x, w) \\rightarrow \\pi"}
        </Math>
        <p>
          이 단계가 가장 계산 비용이 크다
          <br />
          핵심 연산은 <strong>MSM</strong>(Multi-Scalar Multiplication)과{" "}
          <strong>NTT</strong>(Number Theoretic Transform)다
          <br />
          Groth16은 3번의 MSM, PLONK은 다항식 evaluation + commitment가 병목이다
        </p>
        <div className="not-prose mt-4 mb-4 rounded-lg border p-4">
          <h4 className="font-medium text-sm mb-2">증명 시간 규모</h4>
          <ul className="space-y-1 text-sm">
            <li>- 작은 회로 (수천 게이트): 수백 ms</li>
            <li>- 중간 회로 (수백만 게이트): 수 초 ~ 수십 초</li>
            <li>
              - 큰 회로 (zkEVM 등): 수 분 ~ 수십 분 (GPU 가속 시 대폭 단축)
            </li>
          </ul>
        </div>

        {/* ── Verify ── */}
        <h3 className="text-xl font-semibold mt-8 mb-4">3. Verify</h3>
        <p>
          검증자가 verification key, 공개 입력, 증명만으로 수락/거부를 결정한다
        </p>
        <Math display>
          {"\\mathsf{Verify}(\\mathsf{vk}, x, \\pi) \\rightarrow \\{0, 1\\}"}
        </Math>
        <FormulaGuide
          title="SNARK의 세 알고리즘에서 이어지는 값"
          terms={[
            {
              symbol: "C",
              name: "회로 또는 관계",
              description:
                "어떤 공개 입력 x와 witness w가 유효한지를 정의합니다.",
            },
            {
              symbol: "\\mathsf{pk},\\;\\mathsf{vk}",
              name: "증명·검증 키",
              description:
                "Setup이 만든 시스템별 보조 정보입니다. universal·transparent 방식에서는 생성 조건이 달라질 수 있습니다.",
            },
            {
              symbol: "x,\\;w",
              name: "공개 입력과 비밀 witness",
              description:
                "x는 verifier도 알고, w는 prover만 가진 채 C(x,w)=1임을 증명합니다.",
            },
            {
              symbol: "\\pi",
              name: "증명",
              description:
                "w 자체를 보내지 않고 관계가 성립한다는 검증 가능한 정보를 압축한 결과입니다.",
            },
          ]}
          assumptions={[
            "Completeness·soundness·zero-knowledge의 정확한 보장은 선택한 proof system과 security model에 따라 달라집니다.",
            "Verify가 1을 반환한다는 것은 공개 입력 x에 대한 관계를 수락한다는 뜻이지, x 바깥의 사실까지 보장하지 않습니다.",
          ]}
          interpretation="Setup의 출력이 Prove와 Verify를 연결하고, 공개 입력 x는 양쪽에 같게 들어갑니다. witness w는 증명 생성에만 사용되며 verifier가 받는 것은 π입니다."
        />
        <p>
          검증은 반드시 빨라야 한다 &mdash; 온체인에서 모든 노드가 실행하기
          때문이다
        </p>
        <div className="not-prose mt-4 rounded-lg border p-4">
          <h4 className="font-medium text-sm mb-2">시스템별 검증 복잡도</h4>
          <ul className="space-y-1 text-sm">
            <li>
              -{" "}
              <a
                href="/blockchain/groth16"
                className="text-indigo-400 hover:underline"
              >
                Groth16
              </a>
              : 페어링 3회, <Math>{"O(1)"}</Math> &mdash; 회로 크기에 무관
            </li>
            <li>
              -{" "}
              <a
                href="/blockchain/plonk"
                className="text-indigo-400 hover:underline"
              >
                PLONK
              </a>
              : 다항식 commitment opening 검증, <Math>{"O(1)"}</Math> (공개 입력
              수에 선형)
            </li>
            <li>
              - STARK: FRI 쿼리 검증, <Math>{"O(\\log n)"}</Math> &mdash;
              trusted setup 불필요
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
