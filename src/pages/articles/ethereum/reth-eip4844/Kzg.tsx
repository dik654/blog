import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function Kzg({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="kzg" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">KZG commitment: blob 전체를 block에 넣지 않고도 같은 data인지 검증한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Blob transaction에는 실제 128 KiB data 대신 48-byte KZG commitment에서 만든 versioned hash가 들어갑니다. Commitment는 data를 압축해 복원하는 값이 아니라 특정 polynomial에 결속시키는 cryptographic reference이며, proof와 evaluation point를 함께 사용해 “이 위치의 값이 맞다”는 사실을 짧게 검증할 수 있습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("blob-validate", codeRefs["blob-validate"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            KZG 검증 흐름
          </span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "header-4844-standalone",
                codeRefs["header-4844-standalone"],
              )
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            헤더 blob gas 독립 검증
          </span>
        </div>

        {/* ── KZG 개요 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          KZG Commitment Scheme — 다항식 commitment
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              KZG 개요
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              Blob의 4,096개 field element를 polynomial <em>P(x)</em>로 해석하고 48-byte commitment를 만듭니다. 이후 원본 전체를 다시 넣지 않고도 <em>P(z)=y</em>라는 주장을 검증할 수 있지만, commitment만으로 원본 blob을 복원할 수는 없습니다.
            </p>
            <ul className="text-xs text-foreground/60 mt-2 space-y-1">
              <li>
                <code className="text-xs">KzgCommitment([u8; 48])</code> —
                BLS12-381 G1 point
              </li>
              <li>
                <code className="text-xs">KzgProof([u8; 48])</code> — 증명
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              BLS12-381 곡선
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                Pairing 지원:{" "}
                <code className="text-xs">e(a*G1, b*G2) = e(G1,G2)^(ab)</code>
              </li>
              <li>128-bit 보안 수준</li>
              <li>효율적 라이브러리: c-kzg, arkworks</li>
            </ul>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              verify_blob_kzg_proof() 흐름
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/70">
              <span className="rounded bg-muted/40 px-2 py-1">
                Blob → 4096 field elements
              </span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">
                evaluation point z (Fiat-Shamir)
              </span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">
                P(z) = y 계산
              </span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">
                pairing 검증
              </span>
            </div>
          </div>
        </div>
        <p>
          따라서 KZG commitment는 blob의 요약본이라기보다 blob과 evaluation proof를 연결하는 검증 기준점입니다. Point-evaluation precompile은 versioned hash가 가리키는 commitment와 <em>P(z)=y</em> proof를 EVM 안에서 확인해 L2 contract가 특정 blob 위치의 값을 검증할 수 있게 합니다.
        </p>

        {/* ── Versioned Hash ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Versioned Hash — 미래 호환성
        </h3>
        <ExplainedFormula
          question="48-byte KZG commitment를 transaction이 참조하는 32-byte identifier로 어떻게 바꿀까요?"
          idea="Commitment를 SHA-256으로 hash한 뒤 첫 byte를 scheme version으로 예약합니다. 이 값은 blob 원문을 압축한 것이 아니라 commitment 종류와 digest를 묶은 식별자입니다."
          formula={String.raw`h_v=\mathrm{0x01}\ \Vert\ \mathrm{SHA256}(C)[1{:}32]`}
          terms={[
            { symbol: "C", name: "KZG commitment", description: "blob polynomial에 결속된 48-byte G1 encoding" },
            { symbol: "0x01", name: "version byte", description: "현재 KZG commitment scheme을 식별하는 첫 byte" },
            { symbol: String.raw`\Vert`, name: "concatenation", description: "version byte와 digest의 뒤 31 bytes를 이어 붙이는 연산" },
          ]}
          assumptions={["Commitment encoding과 SHA-256 규칙은 활성 EIP-4844 specification을 따릅니다.", "입력 commitment와 sidecar proof는 별도로 검증합니다."]}
          interpretation="같은 commitment는 같은 versioned hash를 만들지만, hash만으로 blob을 복원하거나 KZG proof의 유효성을 대신 확인할 수는 없습니다."
        />
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              kzg_to_versioned_hash()
            </p>
            <div className="space-y-2 text-sm text-foreground/80"><p><code className="text-xs">hash = SHA-256(commitment)</code></p><p><code className="text-xs">hash[0] = 0x01</code>로 version byte를 덮어씁니다.</p><p>결과는 <code className="text-xs">0x01 + SHA-256(commitment)[1..32]</code> 형태의 32-byte 값입니다.</p></div>
            <p className="text-xs text-foreground/50 mt-2">
              SHA-256: BLS12-381 G1(48B)을 32B로 축약 + zk 스택 호환
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              왜 Versioned?
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>hash가 어떤 commitment version을 가리키는지 명시</li>
              <li>미래 version은 별도 EIP와 검증 규칙으로 추가 가능</li>
              <li>on-chain 계약은 version 체크 후 처리</li>
            </ul>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              Precompile 0x0A (point_evaluation)
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              <code className="text-xs">(versioned_hash, z, y, commitment, proof)</code>를 입력받아 commitment에서 계산한 hash가 일치하는지 확인한 뒤 KZG proof를 검증합니다. L2 contract는 이를 이용해 특정 blob의 특정 evaluation point가 주장한 값을 갖는지 확인할 수 있습니다.
            </p>
          </div>
        </div>
        <p>
          첫 byte를 version으로 예약했기 때문에 transaction 형식을 전부 바꾸지 않고도 미래의 commitment scheme을 구분할 수 있습니다. 현재 <code>0x01</code>은 KZG를 뜻하며, 다른 version의 검증 규칙은 실제로 채택된 protocol specification이 정의해야 합니다.
        </p>

        {/* ── Trusted Setup ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Trusted Setup — KZG의 보안 기반
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              Powers of Tau
            </p>
            <div className="space-y-2 text-sm leading-6 text-foreground/80"><p><code className="text-xs">G1: [G1, τG1, …, τ⁴⁰⁹⁵G1]</code></p><p><code className="text-xs">G2: [G2, τG2]</code></p><p>비밀값 τ를 아는 주체가 남으면 proof를 위조할 수 있으므로 여러 참가자가 순차적으로 entropy를 더하는 ceremony로 parameter를 생성했습니다.</p></div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              KZG Ceremony (2023)
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>다수 참가자가 순차적으로 entropy를 기여한 MPC</li>
              <li>각 참가자 random 값 기여 후 파기</li>
              <li>
                <strong>1명만 정직해도</strong> 전체 secure
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              KzgSettings (Reth)
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>Ethereum trusted setup 파일을 c-kzg 설정으로 로드</li>
              <li>commitment·proof 생성/검증 API가 같은 설정 사용</li>
              <li>배포·검증 방식은 Reth/c-kzg 버전에 맞춰 확인</li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">
              바이너리 임베드 → 시작 시 1회 파싱, 메모리 영구 보관
            </p>
          </div>
        </div>
        <p>
          KZG의 안전성은 ceremony가 끝난 뒤 어느 누구도 최종 τ를 알지 못한다는 가정에 기대고 있습니다. 참가자 가운데 한 명이라도 자신의 entropy를 제대로 폐기했다면 전체 toxic waste를 복원할 수 없습니다. Node를 배포할 때는 이 cryptographic 가정과 별개로 trusted setup file의 hash, package version과 공식 배포 경로도 함께 확인해야 합니다.
        </p>

        <p className="mt-3 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>Point-evaluation precompile(0x0A)</strong>은 L2가 L1 blob의 특정 evaluation을 검증할 수 있게 하지만, blob data 자체를 EVM에 다시 제공하지는 않습니다. Fraud proof나 bridge logic이 사용할 때도 data availability 경로와 proof 검증 경로를 구분해야 합니다.
        </p>
        <div id="paper-kzg-ceremony" className="not-prose scroll-mt-24">
          <CitationBlock source="Ethereum KZG Ceremony specifications" href="https://github.com/ethereum/kzg-ceremony-specs" citeKey={3}>
            Ceremony 자료는 KZG public parameter 생성과 contribution 검증의 근거입니다. 한 명의 정직한 참여자가 기여를 안전하게 폐기했다는 보안 가정은 node의 setup file 배포·checksum·library correctness까지 자동 보장하지 않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
