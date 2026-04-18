import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function EncodeDecode({ onCodeRef }: Props) {
  return (
    <section id="encode-decode" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인코딩 & 디코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── fixed vs variable ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">Fixed vs Variable 구분 — 컴파일 타임 결정</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-green-500/30 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Fixed-size</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>basic types (<code>uint8</code>~<code>uint256</code>, <code>bool</code>, <code>byte</code>)</li>
              <li><code>Vector[T, N]</code>: T가 fixed + N 고정</li>
              <li><code>Container</code>: 모든 필드가 fixed</li>
              <li><code>Bitvector[N]</code>: 항상 fixed</li>
            </ul>
          </div>
          <div className="rounded-lg border border-amber-500/30 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Variable-size</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>List[T, N]</code>: 원소 개수가 런타임 결정</li>
              <li><code>Bitlist[N]</code>: 비트 개수가 런타임 결정</li>
              <li>Vector/Container 중 하나라도 variable 필드 포함</li>
              <li><code>Union</code>: tagged union</li>
            </ul>
          </div>
        </div>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Validator &mdash; fixed-size (121 bytes)</p>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code>pubkey</code>: <code>Vector[byte, 48]</code> (48B)</li>
              <li><code>withdrawal_credentials</code>: <code>B256</code> (32B)</li>
              <li><code>effective_balance</code>: <code>Gwei</code> (8B)</li>
              <li><code>slashed</code>: <code>bool</code> (1B)</li>
              <li><code>activation_eligibility_epoch</code>: <code>Epoch</code> (8B)</li>
              <li><code>activation_epoch</code>: <code>Epoch</code> (8B)</li>
              <li><code>exit_epoch</code>: <code>Epoch</code> (8B)</li>
              <li><code>withdrawable_epoch</code>: <code>Epoch</code> (8B)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Attestation &mdash; variable-size</p>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code>aggregation_bits</code>: <code>Bitlist[MAX_VALIDATORS_PER_COMMITTEE]</code> <span className="text-amber-400">(variable)</span></li>
              <li><code>data</code>: <code>AttestationData</code> (fixed)</li>
              <li><code>signature</code>: <code>BLSSignature</code> (fixed)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">Bitlist 하나로 전체 Container가 variable</p>
          </div>
        </div>
        <p className="leading-7">
          SSZ 타입은 <strong>구조적으로</strong> fixed/variable 결정.<br />
          한 필드라도 variable이면 전체 Container가 variable.<br />
          컴파일 타임 분석으로 인코딩 전략 결정 가능.
        </p>

        {/* ── Container 인코딩 레이아웃 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Container 인코딩 — 2-part 레이아웃</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Container 인코딩 알고리즘</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>각 필드 크기 계산</li>
              <li>fixed part 생성: fixed 필드는 실제 값, variable 필드는 <strong>4-byte LE offset</strong> (전체 인코딩 내 절대 위치)</li>
              <li>variable part: 실제 variable 데이터를 순서대로 concat</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Attestation 직렬화 레이아웃</p>
            <div className="grid grid-cols-4 gap-1 text-xs font-mono text-center mb-3">
              <div className="bg-amber-500/15 rounded p-2">
                <p className="text-amber-400">[0..4]</p>
                <p>offset = 228</p>
              </div>
              <div className="bg-blue-500/15 rounded p-2">
                <p className="text-blue-400">[4..132]</p>
                <p>data (128B)</p>
              </div>
              <div className="bg-blue-500/15 rounded p-2">
                <p className="text-blue-400">[132..228]</p>
                <p>signature (96B)</p>
              </div>
              <div className="bg-green-500/15 rounded p-2">
                <p className="text-green-400">[228..?]</p>
                <p>aggregation_bits</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">고정 part 크기 = 4 + 128 + 96 = <strong>228 bytes</strong> &rarr; 첫 variable offset = 228</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">인코딩 절차 (<code>EncodeAttestation</code>)</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code>aggregation_bits</code> offset 기록 &mdash; <code>fixedPartSize</code> = 228</li>
              <li><code>data</code> (128B) 직렬화 &mdash; fixed 필드 그대로 기록</li>
              <li><code>signature</code> (96B) 직렬화 &mdash; fixed 필드 그대로 기록</li>
              <li><code>aggregation_bits</code> 데이터 &mdash; variable 데이터 끝에 추가</li>
            </ol>
          </div>
        </div>
        <p className="leading-7">
          Container는 <strong>2-part 레이아웃</strong>: fixed part + variable part.<br />
          variable 필드는 offset으로만 표시, 실제 데이터는 끝에.<br />
          random access 가능 — 원하는 필드의 offset만 읽어서 바로 점프.
        </p>

        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('ssz-pack', codeRefs['ssz-pack'])} />
          <span className="text-[10px] text-muted-foreground self-center">PackByChunk()</span>
        </div>

        {/* ── 디코딩 validation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">디코딩 검증 — SSZ 공격 방어</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>UnmarshalAttestation</code> 검증 단계</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>최소 크기 체크</strong> &mdash; <code>{'len(data) < 228'}</code> 이면 <code>ErrTooShort</code></li>
              <li><strong>offset 파싱</strong> &mdash; <code>binary.LittleEndian.Uint32(data[0:4])</code></li>
              <li><strong>offset 범위 검증</strong> &mdash; <code>{'offset >= 228 && offset <= len(data)'}</code></li>
              <li><strong>variable 데이터 추출</strong> &mdash; <code>data[offset:]</code> (다음 offset 또는 끝까지)</li>
              <li><strong>Bitlist 크기 검증</strong> &mdash; max 2048 bits = 257 bytes 초과 시 <code>ErrListTooLarge</code></li>
              <li><strong>Sentinel bit 검증</strong> &mdash; Bitlist 마지막 바이트 MSB=1로 정확한 비트 수 역산</li>
              <li><strong>fixed 필드 파싱</strong> &mdash; <code>data[4:132]</code> (AttestationData), <code>data[132:228]</code> (BLSSignature)</li>
            </ol>
          </div>
          <div className="rounded-lg border border-red-500/30 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">공격 벡터 &amp; 방어</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
              <div><strong>offset 조작</strong><br />메모리 밖 읽기 시도 &rarr; 범위 체크로 거부</div>
              <div><strong>잘못된 sentinel bit</strong><br />Bitlist 크기 조작 &rarr; sentinel 검증으로 거부</div>
              <div><strong>list overflow</strong><br />max size 초과 &rarr; 크기 검증으로 거부</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          SSZ 디코더의 <strong>엄격한 검증</strong>이 보안 핵심.<br />
          offset 범위, list max size, bit sentinel 등 모든 bound 검사.<br />
          잘못된 SSZ 데이터로 노드 crash 방지.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 오프셋 기반 부분 디코딩</strong> — Unmarshal 시 고정부를 순차 읽으며 오프셋을 수집.<br />
          오프셋 구간 [offset_i, offset_i+1)에서 가변 데이터를 역직렬화.<br />
          전체를 읽지 않고 특정 필드만 빠르게 접근 가능.
        </p>
      </div>
    </section>
  );
}
