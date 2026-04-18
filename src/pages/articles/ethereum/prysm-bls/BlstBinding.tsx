import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlstBinding({ onCodeRef }: Props) {
  return (
    <section id="blst-binding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLST CGo 바인딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Prysm은 <strong>supranational/blst</strong> C 라이브러리를 CGo로 래핑한다.<br />
          Go → C → x86-64 어셈블리 체인으로, 순수 Go 구현 대비 약 10배 빠르다.
        </p>

        {/* ── CGo 바인딩 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CGo 바인딩 구조 — 3계층</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-blue-500/30 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Layer 1: Go (Prysm API)</p>
              <p className="text-sm text-muted-foreground font-mono">SecretKey.Sign(msg) Signature</p>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Layer 2: CGo bridge</p>
              <p className="text-sm text-muted-foreground font-mono">C.blst_sign_pk_in_g1(&sig, ...)</p>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Layer 3: C + Assembly</p>
              <p className="text-sm text-muted-foreground">Hash to G2 &rarr; scalar mul &rarr; 96B</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground/70 mb-2">CGo overhead</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Go &harr; C stack 전환: ~100ns</li>
                <li>C 함수 호출: ~수 us</li>
                <li>전환 비용 = 실제 연산의 <strong>0.005%</strong></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground/70 mb-2">blst 내부 최적화</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>AVX-512</strong> (Intel): 512-bit 필드 연산 parallel</li>
                <li><strong>ADX</strong>: 64-bit carry chain 가속</li>
                <li><strong>NEON</strong> (ARM/Apple Silicon): 128-bit SIMD</li>
                <li>critical path assembly 직접 작성 &rarr; 2~3배 빠름</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          3계층 구조: <strong>Go API → CGo bridge → C + Assembly</strong>.<br />
          CGo overhead(~100ns)는 서명 연산(~1ms) 대비 무시할 수준.<br />
          AVX-512/ADX/NEON 어셈블리 최적화로 순수 언어 구현 대비 우위.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">호출 체인</h3>
        <ul>
          <li><strong>Go 레이어</strong> — <code>secretKey.Sign(msg)</code> 인터페이스</li>
          <li><strong>CGo 레이어</strong> — <code>blst_sign_pk_in_g1()</code> C 함수 호출</li>
          <li><strong>어셈블리</strong> — AVX-512/ADX 명령어로 필드 연산 가속</li>
        </ul>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('bls-sign', codeRefs['bls-sign'])} />
          <span className="text-[10px] text-muted-foreground self-center">Sign() CGo 체인</span>
        </div>

        {/* ── DST 도메인 분리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DST (Domain Separation Tag) — 용도별 서명 분리</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Ethereum 2.0 DST</p>
            <p className="text-sm font-mono text-muted-foreground mb-2">BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div><code>BLS_SIG</code>: BLS signature</div>
              <div><code>BLS12381G2</code>: 곡선 + G2 그룹</div>
              <div><code>XMD:SHA-256</code>: hash 방식</div>
              <div><code>SSWU</code>: hash-to-curve mapping</div>
              <div><code>RO</code>: Random Oracle model</div>
              <div><code>POP</code>: Proof-of-Possession</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">사용처별 도메인</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div><strong>Attestation</strong>: signing_root(att_data)</div>
              <div><strong>Block proposal</strong>: signing_root(block)</div>
              <div><strong>Sync committee</strong>: signing_root(contribution)</div>
              <div><strong>Deposit</strong>: deposit_message_root</div>
              <div><strong>Randao</strong>: signing_root(epoch)</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">DST + domain 2단계 분리</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-xs text-foreground/70 mb-1">DST &mdash; BLS 메시지 공간 분리 (cryptographic)</p>
                <p className="font-semibold text-xs text-foreground/70 mb-1">domain &mdash; 네트워크/포크/용도 분리 (protocol-level)</p>
                <p className="text-xs"><code>compute_domain(domain_type, fork_version, genesis_root)</code></p>
              </div>
              <div>
                <p className="font-semibold text-xs text-red-400 mb-1">예방 공격</p>
                <ul className="space-y-0.5 text-xs">
                  <li>Cross-protocol: 테스트넷 &rarr; 메인넷 replay</li>
                  <li>Cross-fork: Bellatrix &rarr; Capella replay</li>
                  <li>Cross-purpose: attestation &rarr; proposal 위조</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>DST</strong> — BLS 메시지 공간 분리의 암호학 메커니즘.<br />
          POP(Proof-of-Possession) 스킴으로 rogue key attack 방어.<br />
          domain separation으로 같은 키의 다용도 서명이 서로 독립됨.
        </p>

        {/* ── blst vs 대안 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">blst vs 대안 구현 벤치마크</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">BLS12-381 Go 구현체 비교</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-center">
              <div className="bg-green-500/10 rounded p-2">
                <p className="font-semibold">blst</p>
                <p className="text-xs text-muted-foreground">C++ + ASM</p>
                <p className="font-mono text-muted-foreground">1.8ms / 28ms</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="font-semibold">herumi</p>
                <p className="text-xs text-muted-foreground">C++ (부분 ASM)</p>
                <p className="font-mono text-muted-foreground">2.5ms / 40ms</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="font-semibold">kilic</p>
                <p className="text-xs text-muted-foreground">pure Go</p>
                <p className="font-mono text-muted-foreground">8ms / 180ms</p>
              </div>
              <div className="bg-muted/50 rounded p-2 opacity-50">
                <p className="font-semibold">go-bls</p>
                <p className="text-xs text-muted-foreground">legacy (2019)</p>
                <p className="font-mono text-muted-foreground">deprecated</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">단일 검증 / 배치 100개 기준</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">메인넷 검증 부하 (블록당 ~150 aggregate attestation)</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">blst</p><p className="font-mono text-green-400">~300ms (여유)</p></div>
              <div><p className="text-muted-foreground">herumi</p><p className="font-mono">~400ms (여유)</p></div>
              <div><p className="text-muted-foreground">pure Go</p><p className="font-mono text-red-400">~1.2초 (빠듯)</p></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">2024년 blst가 사실상 표준 &mdash; Lighthouse, Teku, Lodestar도 blst 사용 (FFI 경유)</p>
          </div>
        </div>
        <p className="leading-7">
          blst가 <strong>Ethereum 2.0 CL의 사실상 표준</strong>.<br />
          Go/Rust/Java/JavaScript 구현체 모두 blst로 수렴.<br />
          C++ + 어셈블리 최적화의 성능 차이가 validator 운영에 직접 영향.
        </p>
      </div>
    </section>
  );
}
