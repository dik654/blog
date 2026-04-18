import ContextViz from './viz/ContextViz';
import BLSSignFlowViz from './viz/BLSSignFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLS12-381 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 BLS 서명 생성, 집계, FastAggregateVerify 검증의 전체 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── BLS12-381 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BLS12-381 — 서명 집계가 가능한 곡선</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">BLS12-381 특징</p>
            <p className="text-sm text-muted-foreground mb-2">Barreto-Lynn-Scott 곡선 (embedding degree 12, 381-bit prime) &mdash; 128-bit 보안</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Pairing 지원: <code>e(G1, G2) &rarr; GT</code></li>
              <li>서명 집계 가능: <code>sig_agg = sig_1 + sig_2 + ... + sig_n</code></li>
              <li>동일 메시지 집계 검증: <code>FastAggregateVerify</code></li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">2개 그룹</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>G1</strong>: 48 bytes &mdash; 공개키(pk)에 사용</li>
                <li><strong>G2</strong>: 96 bytes &mdash; 서명(sig)에 사용</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-1">서명이 더 크지만 공개키 서브넷 방송 효율 우선</p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">연산 비용 (blst 기준)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>서명 생성: <strong>~1ms</strong> (G2 scalar mul)</li>
                <li>서명 검증: <strong>~2ms</strong> (1 pairing)</li>
                <li>배치 100개: <strong>~50ms</strong> (~20배 가속)</li>
                <li>서명 집계: <strong>~50us</strong>/sig</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">메인넷 활용</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-center text-muted-foreground">
              <div><strong>Attestation</strong><br />슬롯당 ~30K sig &rarr; 서브넷 집계</div>
              <div><strong>Block 서명</strong><br />proposal 서명</div>
              <div><strong>Sync committee</strong><br />512 validator block root</div>
              <div><strong>Deposit</strong><br />validator 등록</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          BLS의 핵심 가치: <strong>서명 집계</strong> — N개 서명을 1개로 압축.<br />
          Ethereum consensus는 슬롯당 수만 개 attestation → 집계 필수.<br />
          각 validator가 독립 서명 → 서브넷에서 집계 → 블록에 1개 aggregate로 포함.
        </p>

        {/* ── BLS의 왜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 BLS? — ECDSA와의 비교</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">ECDSA (secp256k1, EL TX)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>서명 크기: <strong>64~65 bytes</strong></li>
                <li>검증: <strong>~0.1ms</strong> (빠름)</li>
                <li>집계 <strong>불가</strong> &mdash; N개 서명 = N x 65 bytes</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">BLS (BLS12-381, CL attestation)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>서명 크기: <strong>96 bytes</strong></li>
                <li>검증: <strong>~2ms</strong> (20배 느림)</li>
                <li>집계 <strong>가능</strong> &mdash; N개 서명 &rarr; 1개 96 bytes</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">30K attestation/slot 시나리오</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-xs text-red-400 mb-1">ECDSA 사용 시</p>
                <ul className="space-y-0.5">
                  <li>30K x 65B = <strong>1.95 MB/slot</strong> &rarr; 블록 크기 폭발</li>
                  <li>30K x 0.1ms = <strong>3초</strong> 검증 &rarr; 12초 슬롯 내 불가</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-xs text-green-400 mb-1">BLS 사용 시</p>
                <ul className="space-y-0.5">
                  <li>서브넷 집계 &rarr; ~200 aggregate x 96B = <strong>~20KB</strong> (100배 절약)</li>
                  <li>200 x 2ms = <strong>~400ms</strong> 검증 (가능) + 배치 가속</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          BLS는 <strong>집계 가능성이 핵심</strong> — 100만 validator 운영에 필수.<br />
          개별 서명은 ECDSA보다 느리지만, 집계로 네트워크 오버헤드 100배 절약.<br />
          Ethereum 2.0이 BLS를 consensus 서명으로 채택한 근본 이유.
        </p>

        {/* ── Prysm의 BLS 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm의 BLS 구현 — blst CGo 바인딩</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">패키지 구조 (<code>prysm/crypto/bls/</code>)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code>bls.go</code> &mdash; 공개 API (SecretKey, PublicKey, Signature)</li>
                <li><code>common/interfaces.go</code> &mdash; trait 정의</li>
                <li><code>blst/blst.go</code> &mdash; blst 초기화</li>
                <li><code>blst/secret_key.go</code> &mdash; <code>blst.SecretKey</code> 래퍼</li>
                <li><code>blst/public_key.go</code> &mdash; <code>blst.P1</code> (G1) 래퍼</li>
                <li><code>blst/signature.go</code> &mdash; <code>blst.P2</code> (G2) 래퍼</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Go 타입 매핑</p>
              <ul className="text-sm space-y-1 text-muted-foreground font-mono">
                <li>blstPublicKey = blst.P1Affine (48B, G1)</li>
                <li>blstSignature = blst.P2Affine (96B, G2)</li>
                <li>blstSecretKey = blst.SecretKey (32B, scalar)</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-border/40">
                <p className="font-semibold text-xs text-foreground/70 mb-1">CGo overhead</p>
                <p className="text-sm text-muted-foreground">Go &harr; C 전환 ~100ns vs 서명 검증 ~2ms = <strong>0.005%</strong></p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">blst vs pure Go (herumi) 비교</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">단일 검증</p><p className="font-mono text-green-400">blst 2배 빠름</p></div>
              <div><p className="text-muted-foreground">배치 검증</p><p className="font-mono text-green-400">blst 4배 빠름</p></div>
              <div><p className="text-muted-foreground">메모리</p><p className="font-mono">동등</p></div>
              <div><p className="text-muted-foreground">안정성</p><p className="font-mono">동등</p></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Prysm이 <strong>blst</strong>를 선택한 이유는 <strong>성능</strong>.<br />
          CGo 오버헤드(~100ns) vs 서명 검증 비용(2ms) → 무시할 수준.<br />
          대량 attestation 검증에서 2~5배 가속 → 메인넷 운영에 필수.
        </p>
      </div>
      <div className="not-prose mt-6"><BLSSignFlowViz /></div>
    </section>
  );
}
