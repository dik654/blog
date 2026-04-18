import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HardforkDetailViz from './viz/HardforkDetailViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { FORK_TYPES } from './HardforkData';

export default function Hardfork({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="hardfork" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hardfork enum & 활성화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 BTreeMap인가?</strong>{' '}
          Geth의 <code>ChainConfig</code>는 하드포크마다 struct 필드를 추가한다.<br />
          <code>ShanghaiTime *uint64</code>, <code>CancunTime *uint64</code> 같은 방식이다.<br />
          새 하드포크가 추가될 때마다 필드 + nil 체크 + 테스트를 갱신해야 한다.{' '}
          <CodeViewButton onClick={() => open('fork-condition')} />
        </p>
        <p className="leading-7">
          Reth는 <code>BTreeMap&lt;EthereumHardfork, ForkCondition&gt;</code>으로 관리한다.<br />
          BTreeMap의 키가 자동 정렬되므로 하드포크 순서가 자연스럽게 유지된다.<br />
          새 하드포크 지원은 enum variant 하나와 맵 엔트리 하나를 추가하는 것으로 끝난다.{' '}
          <CodeViewButton onClick={() => open('chainspec-struct')} />
        </p>

        {/* ── EthereumHardfork enum ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EthereumHardfork enum — 역사 전체</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2"><code>EthereumHardfork</code> enum — 18개 variant</p>
            <p className="text-xs text-foreground/50 mb-3"><code>derive(PartialOrd, Ord)</code>로 선언 순서 = 정렬 순서. <code>BTreeMap</code> 키로 사용 가능.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { name: 'Frontier', info: '2015-07 · blk 0 · 최초 런칭' },
                { name: 'Homestead', info: '2016-03 · blk 1.15M · EIP-2 gas' },
                { name: 'Dao', info: '2016-07 · blk 1.92M · DAO 롤백' },
                { name: 'Tangerine', info: '2016-10 · blk 2.46M · DoS 대응' },
                { name: 'SpuriousDragon', info: '2016-11 · blk 2.67M · replay 보호' },
                { name: 'Byzantium', info: '2017-10 · blk 4.37M · EIP-100/140' },
                { name: 'Constantinople', info: '2019-02 · blk 7.28M · CREATE2' },
                { name: 'Petersburg', info: '2019-02 · blk 7.28M · EIP-1283 롤백' },
                { name: 'Istanbul', info: '2019-12 · blk 9.07M · chainid' },
                { name: 'MuirGlacier', info: '2020-01 · blk 9.2M · 난이도 지연' },
                { name: 'Berlin', info: '2021-04 · blk 12.2M · gas 개편' },
                { name: 'London', info: '2021-08 · blk 12.9M · EIP-1559' },
                { name: 'ArrowGlacier', info: '2021-12 · blk 13.7M · 난이도 지연' },
                { name: 'GrayGlacier', info: '2022-06 · blk 15.0M · 난이도 지연' },
                { name: 'Paris', info: '2022-09 · blk 15.5M · The Merge' },
                { name: 'Shanghai', info: '2023-04 · ts 기반 · withdrawals' },
                { name: 'Cancun', info: '2024-03 · ts 기반 · blob TX' },
                { name: 'Prague', info: '2025 예정 · EIP-7702' },
              ].map(h => (
                <div key={h.name} className="rounded border border-border/40 px-2 py-1.5">
                  <code className="text-[11px] font-bold">{h.name}</code>
                  <p className="text-[10px] text-foreground/50">{h.info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="leading-7">
          Rust enum의 순서가 이더리움 하드포크 연대기와 정확히 일치 — <code>derive(PartialOrd, Ord)</code>가 선언 순서로 정렬 보장.<br />
          새 하드포크 추가: enum 끝에 variant 추가 + BTreeMap 엔트리 1줄 추가 = 전부.<br />
          Geth와의 대조: Geth는 <code>ChainConfig</code> struct에 <code>PragueTime *uint64</code> 필드 추가 + 각 호출부 nil 체크.
        </p>

        {/* ── active_at_block / active_at_timestamp ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">활성화 체크 — active_at_block / active_at_timestamp</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3"><code>ForkCondition</code> — 3개 활성화 체크 메서드</p>
            <div className="space-y-2">
              <div className="rounded border border-border/40 px-3 py-2">
                <code className="text-xs font-bold">active_at_block(current_block: u64) → bool</code>
                <p className="text-xs text-foreground/60 mt-1">
                  <code>Block(activation)</code> → <code>current_block &gt;= activation</code><br />
                  <code>TTD {"{ fork_block: Some(b) }"}</code> → <code>current_block &gt;= b</code><br />
                  나머지 → <code>false</code>
                </p>
              </div>
              <div className="rounded border border-border/40 px-3 py-2">
                <code className="text-xs font-bold">active_at_timestamp(current_ts: u64) → bool</code>
                <p className="text-xs text-foreground/60 mt-1">
                  <code>Timestamp(activation)</code> → <code>current_ts &gt;= activation</code><br />
                  나머지 → <code>false</code>
                </p>
              </div>
              <div className="rounded border border-border/40 px-3 py-2">
                <code className="text-xs font-bold">active_at_head(head: &Head) → bool</code>
                <p className="text-xs text-foreground/60 mt-1">
                  통합 진입점 — <code>Head {"{ number, timestamp, total_difficulty }"}</code>를 받아 모든 조건 처리.<br />
                  <code>Never</code> → 항상 <code>false</code>
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>active_at_head</code>가 통합 진입점 — <code>Head {"{ number, timestamp, total_difficulty }"}</code>를 받아 모든 조건을 처리.<br />
          EVM 실행 시점에 "이 블록에서 EIP-X가 활성인가?"를 O(1)로 판단.<br />
          <code>Never</code>는 L2가 특정 포크를 건너뛸 때 사용 — 활성 체크는 항상 false.
        </p>

        {/* ── ForkFilter (EIP-2124) ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ForkFilter — EIP-2124 fork identifier</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2"><code>ForkId</code> — EIP-2124</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded border border-border/40 px-3 py-2">
                <code className="text-xs font-bold">hash: ForkHash</code>
                <p className="text-xs text-foreground/60">4바이트 CRC32 체크섬</p>
              </div>
              <div className="rounded border border-border/40 px-3 py-2">
                <code className="text-xs font-bold">next: u64</code>
                <p className="text-xs text-foreground/60">다음 포크 활성 블록/ts (없으면 0)</p>
              </div>
            </div>
            <p className="text-xs text-foreground/70 mb-2">
              <strong>ForkHash 계산:</strong> <code>CRC32(genesis_hash || activation₁ || activation₂ || ...)</code>
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">피어 핸드셰이크 판단</p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-xs">
                <span className="text-emerald-500 font-bold mt-0.5">OK</span>
                <span className="text-foreground/70">hash 일치 → 같은 체인, 같은 포크 상태</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="text-emerald-500 font-bold mt-0.5">OK</span>
                <span className="text-foreground/70">hash 불일치 + next가 내 tip 이전 → 상대가 뒤처짐 (연결 가능)</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="text-amber-500 font-bold mt-0.5">UP</span>
                <span className="text-foreground/70">hash 불일치 + next가 내 tip 이후 → 내가 업그레이드 필요</span>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>ForkHash</code>는 4바이트 CRC32 — 두 노드가 같은 포크 상태인지 <strong>O(1) 비교</strong>로 확인.<br />
          <code>next</code> 필드는 "다음 포크까지의 유예 기간" 정보 — 상대가 업그레이드 지연 중인지 판별.<br />
          이 설계 덕분에 피어 연결 시 전체 ChainConfig를 주고받지 않아도 호환성 확인 가능.
        </p>

        {/* ── ChainHardforks 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ChainHardforks — BTreeMap 래퍼</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2"><code>ChainHardforks</code> — BTreeMap 래퍼</p>
            <p className="text-xs text-foreground/70 mb-3">
              키: <code>Box&lt;dyn Hardfork&gt;</code> (trait object) — 이더리움/OP/임의 체인 하드포크 모두 수용
            </p>
            <div className="rounded border border-border/40 px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-foreground/60 mb-1">메인넷 초기화 예시 (From&lt;EthereumHardforkList&gt;)</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { fork: 'Frontier', cond: 'Block(0)' },
                  { fork: 'Homestead', cond: 'Block(1.15M)' },
                  { fork: 'Dao', cond: 'Block(1.92M)' },
                  { fork: '...', cond: '17개 전부' },
                  { fork: 'Cancun', cond: 'Timestamp(1710338135)' },
                ].map(f => (
                  <span key={f.fork} className="text-[11px] bg-muted rounded px-2 py-0.5">
                    <code>{f.fork}</code> → <code>{f.cond}</code>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">API 사용 예</p>
            <ul className="text-xs space-y-1 text-foreground/70">
              <li><code>chainspec.hardforks.fork(EthereumHardfork::London)</code> → <code>&ForkCondition</code></li>
              <li><code>chainspec.hardforks.is_active_at_block(EthereumHardfork::Berlin, current)</code> → <code>bool</code></li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <code>Box&lt;dyn Hardfork&gt;</code>를 키로 사용 — trait object로 체인 종류에 무관하게 저장 가능.<br />
          OP Stack, Arbitrum, Base는 자체 Hardfork enum(<code>OpHardfork::Bedrock</code> 등)을 같은 맵에 공존시킬 수 있다.<br />
          <code>BTreeMap</code> 특성 덕분에 순회 시 자연스럽게 활성 순서대로 방문.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: enum vs struct field 전쟁</p>
          <p className="mt-2">
            Geth 방식 (struct 필드):<br />
            <code>{`type ChainConfig struct {
    BerlinBlock  *big.Int
    LondonBlock  *big.Int
    ShanghaiTime *uint64
    CancunTime   *uint64
    PragueTime   *uint64  // 새 포크마다 추가
}`}</code>
          </p>
          <p className="mt-2">
            Reth 방식 (BTreeMap + enum):<br />
            <code>BTreeMap&lt;EthereumHardfork, ForkCondition&gt;</code><br />
            새 포크 지원은 enum variant 추가 + 맵 엔트리 1줄 추가로 완료.
          </p>
          <p className="mt-2">
            각 방식의 트레이드오프:<br />
            - Geth: 필드 접근이 <code>config.LondonBlock</code>으로 직관적. 단, <code>nil</code> 체크가 모든 사용처에 필요.<br />
            - Reth: <code>hardforks.fork(London)</code> 한 단계 간접 접근. 대신 새 포크 추가가 enum 1줄.<br />
            - 확장성에서 Reth가 우세. Geth는 새 EIP 추가 시 코드베이스 전체 nil 체크 업데이트가 필요.
          </p>
        </div>
      </div>

      {/* Interactive ForkCondition type cards */}
      <h3 className="text-lg font-semibold mb-3">ForkCondition -- 3가지 활성화 조건</h3>
      <div className="not-prose space-y-2 mb-6">
        {FORK_TYPES.map(f => (
          <motion.div key={f.id}
            onClick={() => setExpanded(expanded === f.id ? null : f.id)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: expanded === f.id ? f.color : 'var(--color-border)',
              background: expanded === f.id ? `${f.color}08` : undefined,
            }}
            animate={{ opacity: expanded === f.id ? 1 : 0.7 }}>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: f.color }} />
              <span className="font-mono font-bold text-sm">{f.condition}</span>
              <span className="text-xs text-muted-foreground">{f.era}</span>
            </div>
            <AnimatePresence>
              {expanded === f.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="mt-3 ml-5 space-y-1 text-sm">
                    <p className="text-foreground/80">{f.detail}</p>
                    <p className="text-foreground/60">
                      <span className="font-semibold">예시:</span> {f.examples}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <HardforkDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
