import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function SnappyEncoding({ onCodeRef: _ }: Props) {
  return (
    <section id="snappy-encoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SSZ-Snappy 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          비콘 체인 메시지는 <strong>SSZ 직렬화 + Snappy 프레임 압축</strong>을 거친다.<br />
          RLP(EL)와 달리 SSZ는 고정 크기 필드 오프셋으로 부분 디코딩이 가능하다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">인코딩 파이프라인</h3>
        <ul>
          <li><strong>SSZ 직렬화</strong> — 구조체를 고정 오프셋 바이트로 변환</li>
          <li><strong>Snappy 압축</strong> — LZ77 기반 빠른 압축 (CPU 부담 최소)</li>
          <li><strong>길이 프리픽스</strong> — varint로 압축 전 크기를 명시</li>
        </ul>

        {/* ── Snappy 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Snappy — Google의 빠른 압축 알고리즘</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Snappy (Google, 2011) — LZ77 기반, 속도 우선 압축</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-foreground/80">
                <thead><tr className="border-b border-border/40">
                  <th className="text-left p-2 font-bold">알고리즘</th><th className="text-right p-2">압축률</th><th className="text-right p-2">압축 속도</th><th className="text-right p-2">해제 속도</th>
                </tr></thead>
                <tbody>
                  <tr className="border-b border-border/20 bg-blue-500/5"><td className="p-2 font-bold">Snappy</td><td className="text-right p-2">2~2.5x</td><td className="text-right p-2">~500 MB/s</td><td className="text-right p-2">~2000 MB/s</td></tr>
                  <tr className="border-b border-border/20"><td className="p-2">LZ4</td><td className="text-right p-2">2~2.5x</td><td className="text-right p-2">~400 MB/s</td><td className="text-right p-2">~3000 MB/s</td></tr>
                  <tr className="border-b border-border/20"><td className="p-2">gzip(-6)</td><td className="text-right p-2">3~4x</td><td className="text-right p-2">~30 MB/s</td><td className="text-right p-2">~300 MB/s</td></tr>
                  <tr><td className="p-2">zstd(-3)</td><td className="text-right p-2">3~4x</td><td className="text-right p-2">~300 MB/s</td><td className="text-right p-2">~1000 MB/s</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">알고리즘 4단계</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-foreground/70">
              <div className="rounded border border-border/40 p-2">32-bit rolling hash로 중복 탐색</div>
              <div className="rounded border border-border/40 p-2">매치 → (distance, length) tag</div>
              <div className="rounded border border-border/40 p-2">literal byte → literal tag</div>
              <div className="rounded border border-border/40 p-2">64-byte sliding window</div>
            </div>
            <p className="text-xs text-foreground/60 mt-2">출력 형식: <code>[length_prefix varint][compressed_data]</code>. length_prefix로 decoder가 미리 버퍼 할당.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center">
              <p className="text-xs font-bold text-foreground/70 mb-1">beacon_block (~100KB)</p>
              <p className="text-sm text-foreground/80">→ ~50KB (50% 압축)</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center">
              <p className="text-xs font-bold text-foreground/70 mb-1">attestation (~500B)</p>
              <p className="text-sm text-foreground/80">→ ~400B (20% 감소)</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center">
              <p className="text-xs font-bold text-foreground/70 mb-1">blob_sidecar (~128KB)</p>
              <p className="text-sm text-foreground/80">→ ~90KB (30% 감소)</p>
            </div>
          </div>
          <p className="text-xs text-foreground/60">채택 이유 — 30K attestation/slot 처리 가능한 속도 + 기존 libsnappy 재사용 + Go/Rust/Java/JS 구현체 풍부.</p>
        </div>
        <p className="leading-7">
          Snappy는 <strong>속도 우선</strong> 압축 알고리즘.<br />
          gzip보다 10~15배 빠른 압축/해제 → consensus 타이밍 제약 대응.<br />
          압축률 2~2.5배로도 대역폭 절약에 충분.
        </p>

        {/* ── Ethereum 사용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Ethereum 2.0의 SSZ-Snappy 사용</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-bold text-green-500 mb-2"><code>EncodeMessage()</code> — 인코딩</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>1. SSZ 직렬화 — <code>msg.MarshalSSZ()</code></p>
                <p>2. Snappy 압축 — <code>snappy.Encode(nil, ssz_bytes)</code></p>
                <p>3. GossipSub은 message-per-payload → 길이 prefix 불필요</p>
              </div>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs font-bold text-blue-500 mb-2"><code>DecodeMessage()</code> — 디코딩</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>1. Snappy 해제 — <code>snappy.Decode(nil, data)</code></p>
                <p>2. 크기 검증 — <code>MAX_CHUNK_SIZE</code>(10MB) 초과 시 거부(DoS 방어)</p>
                <p>3. SSZ 역직렬화 — <code>msg.UnmarshalSSZ(ssz_bytes)</code></p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs text-foreground/70">프로토콜 이름: <code>/eth2/&lt;fork_digest&gt;/beacon_block/<strong>ssz_snappy</strong></code> — 인코딩 명시. 미래 대체: <code>ssz_zstd</code> 향후 고려, 현재 변경 계획 없음.</p>
          </div>
        </div>
        <p className="leading-7">
          모든 P2P 메시지가 <strong>SSZ → Snappy → 전송</strong> 파이프라인.<br />
          토픽 이름에 <code>/ssz_snappy</code> suffix로 인코딩 명시.<br />
          크기 검증(10MB 상한)으로 DoS 공격 방어.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Snappy vs gzip</strong> — gzip 대비 압축률은 낮지만 속도가 10배 이상 빠름.<br />
          12초 슬롯마다 수천 개 어테스테이션을 처리해야 하므로 CPU 오버헤드 최소화가 압축률보다 우선.
        </p>
      </div>
    </section>
  );
}
