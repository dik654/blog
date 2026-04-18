import ContextViz from './viz/ContextViz';
import SSZMerkleViz from './viz/SSZMerkleViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SSZ 규격</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 SSZ 인코딩 규칙, 청크 패킹, HashTreeRoot 계산 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── SSZ vs RLP ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SSZ vs RLP — 왜 새로운 직렬화?</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-red-500/30 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">RLP (EL) 한계</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>정수 길이 가변 &rarr; canonical form 복잡</li>
              <li>Merkle root 직접 계산 불가 (별도 MPT 필요)</li>
              <li>스트림 파싱 어려움</li>
              <li>Fixed-size 구조체도 length prefix 필요</li>
            </ul>
          </div>
          <div className="rounded-lg border border-green-500/30 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">SSZ (CL) 설계 목표</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Merkleization 내장</strong> &mdash; 모든 타입이 <code>HashTreeRoot</code> 계산 가능</li>
              <li><strong>Fixed vs Variable 구분</strong> &mdash; fixed는 length prefix 없음, variable은 4-byte offset</li>
              <li><strong>스키마 기반</strong> &mdash; 컴파일 타임 필드 순서, reflection 불필요</li>
              <li><strong>Ethereum 2.0 전용</strong> 하위 호환 설계</li>
            </ul>
          </div>
        </div>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Basic Types</p>
            <ul className="text-sm space-y-1 text-muted-foreground font-mono">
              <li>uint{'{'}8,16,32,64,128,256{'}'}</li>
              <li>bool</li>
              <li>byte (= uint8)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Composite Types</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>Vector[T, N]</code> &mdash; 고정 길이</li>
              <li><code>List[T, N]</code> &mdash; 가변 길이 (최대 N)</li>
              <li><code>Container</code> &mdash; 구조체</li>
              <li><code>Bitvector[N]</code> &mdash; 고정 비트</li>
              <li><code>Bitlist[N]</code> &mdash; 가변 비트</li>
              <li><code>Union[T1, T2]</code> &mdash; tagged union (EIP-7495)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          SSZ는 <strong>Merkleization 내장</strong>이 핵심 차이.<br />
          RLP는 인코딩만 → MPT 별도 필요. SSZ는 인코딩 + 해시 통합.<br />
          BeaconState, BeaconBlock 등 모든 CL 타입이 SSZ 기반.
        </p>

        {/* ── SSZ 인코딩 규칙 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SSZ 인코딩 규칙 — Fixed vs Variable</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Basic types &mdash; little-endian 바이트 시퀀스</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm font-mono text-muted-foreground">
              <div><code>uint64(42)</code> &rarr; <code>[0x2a, 0, ..., 0]</code> 8B</div>
              <div><code>bool(true)</code> &rarr; <code>[0x01]</code> 1B</div>
              <div><code>byte(0xff)</code> &rarr; <code>[0xff]</code> 1B</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Fixed-size Vector &mdash; 단순 concat</p>
            <p className="text-sm text-muted-foreground"><code>Vector[uint64, 3](1, 2, 3)</code> &rarr; 3개 원소를 순서대로 이어붙임 (24 bytes)</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Container 인코딩 &mdash; 2-part 레이아웃</p>
            <p className="text-sm text-muted-foreground mb-2">
              fixed 필드는 그대로 인코딩, variable 필드는 4-byte offset으로 위치만 기록, 실제 데이터는 끝에 순서대로 배치
            </p>
            <div className="text-sm font-mono text-muted-foreground bg-muted/50 rounded p-2">
              <p>{'{'} a: uint64, b: List[uint64, 10], c: uint32 {'}'}</p>
              <p className="mt-1">[a=1 (8B)] [b_offset=16 (4B)] [c=3 (4B)] [b=10,20 (16B)]</p>
              <p className="text-xs mt-1">fixed part &middot; &middot; &middot; offset &middot; &middot; &middot; fixed &middot; &middot; &middot; variable data &mdash; 총 32 bytes</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">디코딩 순서</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>fixed 부분 먼저 파싱</li>
              <li>offset으로 variable 부분 위치 파악</li>
              <li>다음 offset (없으면 끝)까지가 현재 필드 데이터</li>
            </ol>
          </div>
        </div>
        <p className="leading-7">
          SSZ의 핵심: <strong>fixed vs variable 구분</strong>.<br />
          variable 필드만 4-byte offset 필요 → RLP 대비 공간 효율.<br />
          offset 기반 파싱으로 random access 가능.
        </p>

        {/* ── BeaconState 직렬화 크기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BeaconState 직렬화 — 실전 수치</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">BeaconState 주요 필드 (Deneb fork)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-xs text-foreground/70 mb-1">Fixed-size</p>
                <ul className="space-y-0.5">
                  <li><code>genesis_time</code>: <code>uint64</code></li>
                  <li><code>slot</code>: <code>Slot</code></li>
                  <li><code>fork</code>: <code>Fork</code></li>
                  <li><code>block_roots</code>: <code>Vector[B256, 8192]</code></li>
                  <li><code>state_roots</code>: <code>Vector[B256, 8192]</code></li>
                  <li><code>randao_mixes</code>: <code>Vector[B256, 65536]</code></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-xs text-foreground/70 mb-1">Variable-size</p>
                <ul className="space-y-0.5">
                  <li><code>validators</code>: <code>{'List[Validator, 2^40]'}</code></li>
                  <li><code>balances</code>: <code>{'List[Gwei, 2^40]'}</code></li>
                  <li><code>historical_roots</code>: <code>List[B256, ...]</code></li>
                  <li><code>eth1_data_votes</code>: <code>List[Eth1Data, 2048]</code></li>
                  <li><code>historical_summaries</code>: <code>List[HistoricalSummary, ...]</code></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">메인넷 크기 추정 (2025 기준)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">validators</p><p className="font-mono">~120 MB</p></div>
              <div><p className="text-muted-foreground">balances</p><p className="font-mono">~8 MB</p></div>
              <div><p className="text-muted-foreground">기타 필드</p><p className="font-mono">~100 MB</p></div>
              <div><p className="text-muted-foreground font-semibold">총합</p><p className="font-mono font-semibold">~250 MB</p></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">이 거대한 구조체의 <code>HashTreeRoot</code>가 상수 시간 업데이트되어야 함 &rarr; FieldTrie 해시 캐싱 필요</p>
          </div>
        </div>
        <p className="leading-7">
          BeaconState는 <strong>~250MB 거대 구조체</strong>.<br />
          매 슬롯(12초)마다 state_root 재계산 필요 → 증분 업데이트 필수.<br />
          FieldTrie로 변경된 필드만 재해시 → O(1) 해시 업데이트 달성.
        </p>
      </div>
      <div className="not-prose mt-6"><SSZMerkleViz /></div>
    </section>
  );
}
