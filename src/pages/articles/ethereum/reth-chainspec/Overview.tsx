import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import ChainSpecViz from './viz/ChainSpecViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { CHAINSPEC_FIELDS } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = CHAINSPEC_FIELDS.find(f => f.id === selected);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ChainSpec 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 ChainSpec이 필요한가?</strong>{' '}
          이더리움 노드는 "어떤 체인을 실행할 것인가"를 알아야 한다.<br />
          하드포크 활성화 조건, 제네시스 상태, 합의 매개변수가 모두 여기에 정의된다.<br />
          이 정보가 틀리면 피어와 합의가 불가능하다.{' '}
          <CodeViewButton onClick={() => open('chainspec-struct')} />
        </p>
        <p className="leading-7">
          Geth는 <code>ChainConfig</code> struct에 하드포크별 <code>*big.Int</code> 필드를 추가한다.<br />
          새 하드포크마다 필드를 추가하고, nil 체크 로직을 갱신해야 한다.<br />
          Reth는 <code>BTreeMap&lt;Hardfork, ForkCondition&gt;</code>으로 관리하여 enum variant 하나만 추가하면 새 하드포크를 지원한다.{' '}
          <CodeViewButton onClick={() => open('fork-condition')} />
        </p>
        <p className="leading-7">
          <code>EthChainSpec</code> trait은 모든 체인 설정의 공통 인터페이스다.<br />
          메인넷, 테스트넷, L2 커스텀 체인이 모두 이 trait을 구현한다.<br />
          NodeBuilder가 제네릭으로 받으므로 어떤 체인이든 동일한 빌드 파이프라인을 사용한다.{' '}
          <CodeViewButton onClick={() => open('eth-chainspec-trait')} />
        </p>

        {/* ── ChainSpec 구조체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ChainSpec 구조체 — 9개 핵심 필드</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3"><code>ChainSpec&lt;H = Header&gt;</code> — 9개 필드</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { field: 'chain: Chain', desc: 'mainnet, sepolia, holesky 등 (chain_id 포함)' },
                { field: 'genesis_header: SealedHeader<H>', desc: '제네시스 블록 헤더 (해시 포함, immutable)' },
                { field: 'genesis: Genesis', desc: 'genesis.json 파싱 결과 (alloc, extraData 등)' },
                { field: 'paris_block_and_final_difficulty', desc: 'The Merge 전환 (블록 번호, 최종 누적 난이도)' },
                { field: 'hardforks: ChainHardforks', desc: 'BTreeMap<Hardfork, ForkCondition>' },
                { field: 'deposit_contract', desc: 'CL(beacon chain) deposit 컨트랙트' },
                { field: 'base_fee_params: BaseFeeParamsKind', desc: 'EIP-1559 base_fee 파라미터' },
                { field: 'blob_params: BlobScheduleBlobParams', desc: 'EIP-4844 blob 파라미터' },
                { field: 'prune_delete_limit: usize', desc: '프루닝 배치 크기 (기본 1,750,000)' },
              ].map(f => (
                <div key={f.field} className="rounded border border-border/40 px-3 py-2">
                  <code className="text-xs font-bold">{f.field}</code>
                  <p className="text-xs text-foreground/60 mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/50 mt-3">
              <code>H = Header</code> 기본값 — 커스텀 체인(L2 OP Stack 등)은 <code>H</code>를 자체 헤더 타입으로 교체 가능
            </p>
          </div>
        </div>
        <p className="leading-7">
          <code>chain</code> 필드의 <code>Chain</code> 타입이 <code>chain_id</code>를 감싼다.<br />
          메인넷=1, Sepolia=11155111, Holesky=17000 — EIP-155 서명 검증에 사용된다.<br />
          <code>paris_block_and_final_difficulty</code>는 PoS 전환의 정체성 — 블록 15,537,394에서 최종 누적 난이도 ~58.75 × 10<sup>21</sup>로 PoW 종료.
        </p>

        {/* ── ForkCondition ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ForkCondition — 3가지 활성화 조건</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2"><code>ForkCondition</code> — 4가지 variant</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { variant: 'Block(BlockNumber)', desc: 'Frontier~Istanbul: 블록 번호로 활성' },
                { variant: 'TTD { total_difficulty, fork_block }', desc: 'The Merge: 누적 난이도로 PoS 전환' },
                { variant: 'Timestamp(u64)', desc: 'Shanghai~: Unix 타임스탬프로 활성' },
                { variant: 'Never', desc: 'L2 체인이 특정 포크 skip' },
              ].map(v => (
                <div key={v.variant} className="rounded border border-border/40 px-3 py-2">
                  <code className="text-[11px] font-bold">{v.variant}</code>
                  <p className="text-[11px] text-foreground/60 mt-0.5">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">활성화 방식 변천</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-border">
                <tbody>
                  <tr><td className="border border-border/40 px-2 py-1 font-mono">Frontier ~ GrayGlacier</td><td className="border border-border/40 px-2 py-1"><code>Block</code></td></tr>
                  <tr><td className="border border-border/40 px-2 py-1 font-mono">Paris (The Merge)</td><td className="border border-border/40 px-2 py-1"><code>TTD</code> → <code>Block</code> (사후)</td></tr>
                  <tr><td className="border border-border/40 px-2 py-1 font-mono">Shanghai ~ Prague</td><td className="border border-border/40 px-2 py-1"><code>Timestamp</code></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Shanghai 이후 Timestamp 활성화로 전환된 이유: PoS 환경에서 블록 생성 속도가 정확히 12초로 고정되므로, 타임스탬프가 블록 번호보다 예측 가능.<br />
          L2/테스트넷은 네트워크마다 블록 생성 시점이 다르므로 Timestamp가 더 이식성 있음.<br />
          <code>Never</code>는 L2가 특정 하드포크를 건너뛸 때 사용 — OP Stack은 일부 EIP를 의도적으로 skip.
        </p>

        {/* ── EthChainSpec trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EthChainSpec trait — 다형성 인터페이스</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2"><code>EthChainSpec</code> trait — 다형성 인터페이스</p>
            <p className="text-xs text-foreground/50 mb-3">연관 타입: <code>type Header: BlockHeader</code></p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { method: 'chain()', ret: 'Chain' },
                { method: 'chain_id()', ret: 'u64' },
                { method: 'base_fee_params_at_timestamp(ts)', ret: 'BaseFeeParams' },
                { method: 'genesis_hash()', ret: 'B256' },
                { method: 'genesis_header()', ret: '&Header' },
                { method: 'genesis()', ret: '&Genesis' },
                { method: 'bootnodes()', ret: 'Option<Vec<NodeRecord>>' },
              ].map(m => (
                <div key={m.method} className="rounded border border-border/40 px-3 py-1.5">
                  <code className="text-[11px]">{m.method}</code>
                  <p className="text-[10px] text-foreground/40">→ <code>{m.ret}</code></p>
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/60 mt-3">
              <code>NodeBuilder</code>가 이 trait을 제네릭으로 받으므로 메인넷/OP/Base 등 동일 빌드 파이프라인으로 동작
            </p>
          </div>
        </div>
        <p className="leading-7">
          <code>type Header: BlockHeader</code> — 연관 타입(associated type)으로 헤더 타입을 파라미터화.<br />
          이더리움 메인넷은 <code>Header</code>(20 필드), Optimism은 <code>OpHeader</code>(extra fields) 사용.<br />
          NodeBuilder가 이 trait을 제네릭으로 받으므로, 체인별 분기 코드 없이 단일 빌드 파이프라인 공유.
        </p>

        {/* ── MAINNET 초기화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MAINNET 정적 초기화 — LazyLock 패턴</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2"><code>MAINNET</code> — <code>LazyLock&lt;Arc&lt;ChainSpec&gt;&gt;</code></p>
            <p className="text-xs text-foreground/50 mb-3">첫 접근 시 1회 초기화. <code>include_str!()</code>로 JSON을 컴파일 타임 바이너리 임베딩.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { field: 'chain', value: 'Chain::mainnet()' },
                { field: 'genesis', value: 'serde_json::from_str(mainnet.json)' },
                { field: 'genesis_header', value: 'SealedHeader(make_genesis_header(), 0xd4e5...b3)' },
                { field: 'paris_block_and_final_difficulty', value: '(15,537,394, 58.75 × 10²¹)' },
                { field: 'hardforks', value: 'EthereumHardfork::mainnet()' },
                { field: 'deposit_contract', value: 'MAINNET_DEPOSIT_CONTRACT' },
                { field: 'base_fee_params', value: 'BaseFeeParams::ethereum() (Constant)' },
              ].map(f => (
                <div key={f.field} className="rounded border border-border/40 px-3 py-1.5">
                  <code className="text-xs font-bold">{f.field}</code>
                  <p className="text-[11px] text-foreground/60 mt-0.5"><code>{f.value}</code></p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>LazyLock</code>은 첫 접근 시 1회만 초기화되는 정적 값 — Rust 1.80 안정화.<br />
          <code>include_str!()</code>는 컴파일 타임에 JSON 파일을 바이너리에 임베딩 — 런타임 파일 I/O 없음.<br />
          <code>Arc&lt;ChainSpec&gt;</code>으로 래핑 — 여러 컴포넌트(NetworkManager, Executor, RPC)가 동일 인스턴스를 공유.
        </p>
      </div>

      {/* Interactive ChainSpec field cards */}
      <h3 className="text-lg font-semibold mb-3">ChainSpec 핵심 필드</h3>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {CHAINSPEC_FIELDS.map(f => (
          <button key={f.id}
            onClick={() => setSelected(selected === f.id ? null : f.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === f.id ? f.color : 'var(--color-border)',
              background: selected === f.id ? `${f.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-xs" style={{ color: f.color }}>{f.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{f.role}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-1" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-xs font-mono text-muted-foreground mb-2">{sel.type}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6">
        <ChainSpecViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: BTreeMap vs 필드 확장</p>
          <p className="mt-2">
            Geth의 ChainConfig는 매 하드포크마다 필드를 추가한다:<br />
            <code>BerlinBlock *big.Int, LondonBlock *big.Int, ShanghaiTime *uint64, ...</code><br />
            30여 개 필드가 나열되고, nil 체크가 곳곳에 분산되어 있다.
          </p>
          <p className="mt-2">
            Reth는 <code>BTreeMap&lt;Hardfork, ForkCondition&gt;</code>으로 통합:<br />
            1. <strong>새 포크 추가 = enum variant 1개</strong> — 구조체 변경 없음<br />
            2. <strong>정렬된 순회 보장</strong> — BTreeMap이 Hardfork 순서대로 iterate<br />
            3. <strong>ForkFilter 계산 간결</strong> — BTreeMap 순회만으로 EIP-2124 fork ID 생성<br />
            4. <strong>타입 안전</strong> — 활성화 조건 mismatch를 컴파일러가 잡음
          </p>
          <p className="mt-2">
            결론: 데이터 구조 선택이 코드 유지보수성을 결정.<br />
            "필드 추가" 스타일은 단기적으로 쉽지만, 장기적으로 분기 로직이 코드베이스에 퍼진다.
          </p>
        </div>
      </div>
    </section>
  );
}
