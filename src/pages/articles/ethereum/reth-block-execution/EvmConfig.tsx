import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import EvmConfigDetailViz from './viz/EvmConfigDetailViz';
import { BLOCK_ENV_FIELDS, TX_ENV_FIELDS } from './EvmConfigData';
import type { CodeRef } from '@/components/code/types';

export default function EvmConfig({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [tab, setTab] = useState<'block' | 'tx'>('block');
  const fields = tab === 'block' ? BLOCK_ENV_FIELDS : TX_ENV_FIELDS;

  return (
    <section id="evm-config" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EvmConfig & revm 설정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          revm의 <code>Evm</code> 인스턴스는 두 가지 환경 설정이 필요하다.<br />
          <code>BlockEnv</code>는 블록 수준 정보(번호, 수수료, 타임스탬프)를 담고, <code>TxEnv</code>는 TX 수준 정보(발신자, 가스, 값)를 담는다.<br />
          EvmConfig trait이 헤더와 TX에서 이 값들을 추출해 revm 환경에 매핑한다.
        </p>
        <p className="leading-7">
          <strong>왜 trait인가?</strong> Geth는 EVM 환경 설정이 <code>core/vm</code>에 하드코딩되어 있다.<br />
          다른 체인을 지원하려면 코드를 직접 수정해야 한다.<br />
          Reth의 EvmConfig trait 덕분에 체인별 구현체를 교체할 수 있다.<br />
          Optimism은 L1 block info TX 등의 추가 환경만 오버라이드해서 사용한다.
        </p>
        <p className="leading-7">
          PoS 전환 이후 <code>difficulty</code>는 항상 0이다.<br />
          대신 <code>prevrandao</code>(이전 RANDAO 값)가 난수 소스로 사용된다.<br />
          <code>fill_block_env()</code>가 <code>after_merge</code> 플래그를 보고 이 분기를 처리한다.
        </p>

        {/* ── BlockEnv 필드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockEnv — revm에 전달하는 블록 컨텍스트</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">BlockEnv 구조체</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">number</code>
                <span className="text-foreground/60 text-xs">U256 -- BLOCKNUMBER opcode</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">coinbase</code>
                <span className="text-foreground/60 text-xs">Address -- COINBASE opcode</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">timestamp</code>
                <span className="text-foreground/60 text-xs">U256 -- TIMESTAMP opcode</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">gas_limit</code>
                <span className="text-foreground/60 text-xs">U256 -- GASLIMIT opcode</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">basefee</code>
                <span className="text-foreground/60 text-xs">U256 -- EIP-1559 BASEFEE opcode</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">difficulty</code>
                <span className="text-foreground/60 text-xs">U256 -- PoS에서는 0</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">prevrandao</code>
                <span className="text-foreground/60 text-xs">Option&lt;B256&gt; -- PoS PREVRANDAO</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">blob_excess_gas_and_price</code>
                <span className="text-foreground/60 text-xs">EIP-4844 blob gas 가격</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/20 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5">fill_block_env() PoS 분기</p>
            <div className="text-xs text-foreground/60 space-y-0.5">
              <p><code>after_merge == true</code>: difficulty = 0, prevrandao = <code>header.mix_hash</code></p>
              <p><code>after_merge == false</code>: difficulty = <code>header.difficulty</code>, prevrandao = None</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>BlockEnv</code>의 각 필드는 EVM opcode에 1:1 매핑 — BLOCKNUMBER, COINBASE, TIMESTAMP, GASLIMIT, BASEFEE, DIFFICULTY/PREVRANDAO.<br />
          PoS 전환 후 <code>difficulty</code>는 0, 대신 <code>mix_hash</code>가 <code>prevrandao</code>로 사용 — 스마트 컨트랙트의 난수 소스.<br />
          <code>blob_excess_gas_and_price</code>는 EIP-4844 이후 추가 — blob TX의 가격 결정에 사용.
        </p>

        {/* ── TxEnv 필드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TxEnv — TX 실행 컨텍스트</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">TxEnv 구조체</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">caller</code>
                <span className="text-foreground/60 text-xs">Address -- msg.sender</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">gas_limit</code>
                <span className="text-foreground/60 text-xs">u64 -- TX 가스 한도</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">gas_price</code>
                <span className="text-foreground/60 text-xs">U256 -- effective gas price</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">transact_to</code>
                <span className="text-foreground/60 text-xs">TxKind -- Call(address) | Create</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">value / data</code>
                <span className="text-foreground/60 text-xs">전송 ETH (wei) / calldata</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">chain_id</code>
                <span className="text-foreground/60 text-xs">Option&lt;u64&gt; -- EIP-155 replay 방어</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">access_list</code>
                <span className="text-foreground/60 text-xs">Vec&lt;AccessListItem&gt; -- EIP-2930</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1 py-0.5 rounded">blob_hashes</code>
                <span className="text-foreground/60 text-xs">Vec&lt;B256&gt; -- EIP-4844</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="text-xs font-semibold text-foreground/60 mb-1.5">effective_gas_price 계산 (TX 타입별)</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-foreground/50">
              <p>Legacy / EIP-2930: <code>tx.gas_price</code> (고정)</p>
              <p>EIP-1559 / EIP-4844: <code>min(max_fee, base_fee + priority_fee)</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>TxEnv</code>는 EVM의 <strong>msg.sender, msg.value, msg.data</strong>에 대응.<br />
          <code>gas_price</code>는 TX 타입에 따라 다르게 계산 — Legacy는 고정, EIP-1559는 base_fee 기반 동적.<br />
          <code>blob_hashes</code>는 Cancun 이후 추가 — BLOBHASH opcode의 입력.
        </p>

        {/* ── EIP-4788 beacon_root ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-4788 — Cancun 이후 beacon root 처리</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">EIP-4788 — Cancun pre-execution 훅</p>
            <p className="text-sm text-foreground/70 mb-2">매 블록 실행 전 시스템 TX를 주입해 beacon root를 EVM 컨트랙트에 기록</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">target</code>
              <span className="text-foreground/60 text-xs"><code>0xbEAC020...8002</code> (beacon root precompile)</span>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">calldata</code>
              <span className="text-foreground/60 text-xs"><code>parent_beacon_block_root</code></span>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">caller</code>
              <span className="text-foreground/60 text-xs"><code>0xffff...fffe</code> (SYSTEM_ADDRESS)</span>
              <code className="text-xs bg-muted px-1 py-0.5 rounded">gas</code>
              <span className="text-foreground/60 text-xs">30,000,000 (고정)</span>
            </div>
            <p className="text-xs text-foreground/50 mt-2">결과는 블록 receipts에 포함되지 않음 (invisible TX)</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
            <p className="text-xs text-foreground/50">조회: <code>keccak256(timestamp) % 8191</code> &rarr; storage slot / CL-EL 간 staking 상태 증명에 활용 (Lido, EigenLayer 등)</p>
          </div>
        </div>
        <p className="leading-7">
          EIP-4788은 <strong>CL 상태를 EL EVM에서 증명 가능</strong>하게 만듦.<br />
          매 블록 시작 시 "시스템 TX"로 beacon root를 컨트랙트에 기록 — 스마트 컨트랙트가 읽을 수 있음.<br />
          Lido, EigenLayer 등 restaking 프로토콜의 기반 기술.
        </p>
      </div>

      <div className="not-prose mb-6"><EvmConfigDetailViz /></div>

      {/* Tab toggle for Block vs TX env */}
      <div className="not-prose mb-6">
        <div className="flex gap-2 mb-3">
          <button onClick={() => setTab('block')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === 'block' ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>
            BlockEnv
          </button>
          <button onClick={() => setTab('tx')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === 'tx' ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
            TxEnv
          </button>
        </div>
        <motion.div key={tab} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-4 py-2 font-medium">필드</th>
                <th className="text-left px-4 py-2 font-medium">소스</th>
                <th className="text-left px-4 py-2 font-medium">설명</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f, i) => (
                <tr key={i} className="border-t border-border/30">
                  <td className="px-4 py-2 font-mono text-xs">{f.field}</td>
                  <td className="px-4 py-2 font-mono text-xs text-foreground/60">{f.source}</td>
                  <td className="px-4 py-2 text-foreground/80">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('evm-config', codeRefs['evm-config'])} />
        <span className="text-[10px] text-muted-foreground self-center">EvmConfig trait</span>
      </div>
    </section>
  );
}
