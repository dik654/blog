import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Kzg({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="kzg" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KZG Commitment 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blob-validate', codeRefs['blob-validate'])} />
          <span className="text-[10px] text-muted-foreground self-center">KZG 검증 흐름</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('header-4844-standalone', codeRefs['header-4844-standalone'])} />
          <span className="text-[10px] text-muted-foreground self-center">헤더 blob gas 독립 검증</span>
        </div>

        {/* ── KZG 개요 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">KZG Commitment Scheme — 다항식 commitment</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">KZG 개요</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              다항식 P(x)에 대한 짧은 commitment — 원본 없이 P(z)=y 증명 가능.<br />
              Blob(128KB) → Commitment(48 bytes) — <strong>2,730배 압축</strong>.
            </p>
            <ul className="text-xs text-foreground/60 mt-2 space-y-1">
              <li><code className="text-xs">KzgCommitment([u8; 48])</code> — BLS12-381 G1 point</li>
              <li><code className="text-xs">KzgProof([u8; 48])</code> — 증명</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">BLS12-381 곡선</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>Pairing 지원: <code className="text-xs">e(a*G1, b*G2) = e(G1,G2)^(ab)</code></li>
              <li>128-bit 보안 수준</li>
              <li>효율적 라이브러리: c-kzg, arkworks</li>
            </ul>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">verify_blob_kzg_proof() 흐름</p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/70">
              <span className="rounded bg-muted/40 px-2 py-1">Blob → 4096 field elements</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">evaluation point z (Fiat-Shamir)</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">P(z) = y 계산</span>
              <span className="text-foreground/30">&rarr;</span>
              <span className="rounded bg-muted/40 px-2 py-1">pairing 검증</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          KZG commitment이 <strong>128KB blob을 48바이트로 압축</strong>.<br />
          다항식 commitment의 성질 — 원본 숨기면서 특정 지점 증명 가능.<br />
          L2 fraud proof에서 "특정 blob의 특정 위치에 특정 값"을 증명할 때 사용.
        </p>

        {/* ── Versioned Hash ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Versioned Hash — 미래 호환성</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">kzg_to_versioned_hash()</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              <code className="text-xs">hash = SHA-256(commitment)</code><br />
              <code className="text-xs">hash[0] = 0x01</code> (version byte)<br />
              결과: <code className="text-xs">0x01 + SHA-256[1..32]</code> = 32바이트 B256
            </p>
            <p className="text-xs text-foreground/50 mt-2">SHA-256: BLS12-381 G1(48B)을 32B로 축약 + zk 스택 호환</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">왜 Versioned?</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>미래 KZG → FRI, IPA 등으로 교체 가능</li>
              <li><code className="text-xs">0x02</code>, <code className="text-xs">0x03</code>으로 새 알고리즘 지원</li>
              <li>on-chain 계약은 version 체크 후 처리</li>
            </ul>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">Precompile 0x0A (point_evaluation)</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              입력: <code className="text-xs">(versioned_hash, z, y, commitment, proof)</code><br />
              검증: commitment의 versioned_hash 일치 + KZG 증명 검증.<br />
              L2 fraud proof에서 "특정 blob 위치의 특정 값" 증명 시 사용.
            </p>
          </div>
        </div>
        <p className="leading-7">
          <code>versioned_hash</code>가 <strong>future-proof 설계</strong>.<br />
          첫 바이트 version으로 commitment scheme 교체 가능 (현재 0x01 = KZG).<br />
          미래 post-quantum commitment scheme 마이그레이션 대비.
        </p>

        {/* ── Trusted Setup ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Trusted Setup — KZG의 보안 기반</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">Powers of Tau</p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              G1: [G1, &tau;*G1, ..., &tau;^4095*G1]<br />
              G2: [G2, &tau;*G2]<br />
              &tau; 유출 시 KZG 위조 가능 → ceremony로 분산 생성.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">KZG Ceremony (2023)</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>140,000+ 참가자 (세계 최대 MPC)</li>
              <li>각 참가자 random 값 기여 후 파기</li>
              <li><strong>1명만 정직해도</strong> 전체 secure</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">KzgSettings (Reth)</p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li><code className="text-xs">g1_values_monomial: [G1; 4097]</code></li>
              <li><code className="text-xs">g2_values_monomial: [G2; 4097]</code></li>
              <li><code className="text-xs">roots_of_unity: [Fr; 4096]</code></li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">바이너리 임베드 → 시작 시 1회 파싱, 메모리 영구 보관</p>
          </div>
        </div>
        <p className="leading-7">
          KZG의 <strong>trusted setup이 보안의 근원</strong>.<br />
          140K+ 참가자의 MPC ceremony로 τ 분산 생성 → 신뢰 최소화.<br />
          바이너리에 파라미터 임베드 → 런타임 다운로드 불필요.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-3">
          <strong>point evaluation precompile</strong> — KZG precompile(0x0a)은 L2가<br />
          L1 blob의 특정 지점을 검증할 때 사용. 사기 증명에 활용 가능하다.
        </p>
      </div>
    </section>
  );
}
