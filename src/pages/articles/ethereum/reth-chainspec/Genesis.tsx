import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GenesisViz from './viz/GenesisViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { GENESIS_STEPS } from './GenesisData';

export default function Genesis({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="genesis" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Genesis 초기화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 컴파일 타임 임베딩인가?</strong>{' '}
          Geth는 런타임에 genesis.json 파일을 읽는다.<br />
          파일 경로 오류, 포맷 불일치 등 런타임 실패 가능성이 있다.<br />
          Reth는 <code>include_str!</code> 매크로로 JSON을 바이너리에 직접 포함시킨다.<br />
          배포 시 바이너리 하나만 있으면 메인넷을 실행할 수 있다.{' '}
          <CodeViewButton onClick={() => open('mainnet-spec')} />
        </p>
        <p className="leading-7">
          제네시스 초기화의 핵심은 <code>state_root</code> 계산이다.<br />
          alloc 필드의 모든 계정으로 Merkle Patricia Trie를 구성하고 루트 해시를 도출한다.<br />
          이 값이 genesis header에 포함되며, 피어 연결 시 제네시스 해시로 체인 호환성을 검증한다.{' '}
          <CodeViewButton onClick={() => open('make-genesis')} />
        </p>

        {/* ── genesis.json 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">genesis.json 구조 — 이더리움 메인넷</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">genesis.json 구조 (메인넷)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { field: 'config', value: '{ ... }', desc: 'ChainConfig (ChainSpec이 파싱)' },
                { field: 'nonce', value: '0x42', desc: 'PoW 시절 필드 (현재 무의미)' },
                { field: 'timestamp', value: '0x0', desc: '1970-01-01 (메인넷 고정)' },
                { field: 'extraData', value: '0x11bbe8...', desc: '존 로키 예언서 문구 인코딩' },
                { field: 'gasLimit', value: '0x1388 (5000)', desc: '초기값 (현재 30M)' },
                { field: 'difficulty', value: '0x400000000', desc: '17,179,869,184 (초기 PoW)' },
                { field: 'mixHash / coinbase', value: '0x0000...', desc: '초기값 (제로)' },
                { field: 'alloc', value: '8,893개 계정', desc: '총 72M ETH 프리세일 배분' },
              ].map(f => (
                <div key={f.field} className="rounded border border-border/40 px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-bold">{f.field}</code>
                    <span className="text-[10px] text-foreground/40 font-mono">{f.value}</span>
                  </div>
                  <p className="text-[11px] text-foreground/60">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="leading-7">
          메인넷 <code>extraData</code>에는 "we owe it all to Jon Schnelle" 등의 문구가 인코딩되어 있다.<br />
          <code>alloc</code> 필드가 8,893개 계정을 포함 — 2014년 ETH 프리세일 참여자에게 배분된 약 72M ETH.<br />
          이 파일이 이더리움 전체 역사의 "출생 증명" — state_root를 계산하는 유일한 입력.
        </p>

        {/* ── make_genesis_header ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">make_genesis_header — 하드포크 조건부 필드</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2"><code>make_genesis_header()</code> — 하드포크 조건부 필드</p>
            <p className="text-xs text-foreground/50 mb-3">각 필드는 활성화된 하드포크에 따라 조건부로 채워짐</p>
            <div className="space-y-2">
              {[
                { fork: 'London', field: 'base_fee_per_gas', value: 'INITIAL_BASE_FEE (1 Gwei)', eip: 'EIP-1559' },
                { fork: 'Shanghai', field: 'withdrawals_root', value: 'EMPTY_WITHDRAWALS (keccak256(RLP([])))', eip: 'EIP-4895' },
                { fork: 'Cancun', field: 'blob_gas_used + excess_blob_gas', value: 'Some(0)', eip: 'EIP-4844' },
              ].map(f => (
                <div key={f.fork} className="rounded border border-border/40 px-3 py-2 flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-foreground/50 whitespace-nowrap">{f.fork} 활성 →</span>
                  <div>
                    <code className="text-xs">{f.field}</code>
                    <p className="text-[11px] text-foreground/60">{f.value} ({f.eip})</p>
                  </div>
                </div>
              ))}
              <div className="rounded border border-border/40 px-3 py-2">
                <code className="text-xs font-bold">state_root</code>
                <p className="text-[11px] text-foreground/60"><code>state_root_ref_unhashed(&genesis.alloc)</code> — 핵심: alloc → MPT 루트</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          제네시스 헤더의 각 필드는 <strong>활성화된 하드포크에 따라</strong> 조건부로 채워진다.<br />
          테스트넷/L2는 제네시스부터 최신 포크가 활성화될 수 있으므로 이 분기가 필요하다.<br />
          예: Holesky는 genesis부터 Shanghai 활성 → <code>withdrawals_root</code>가 genesis에 존재.
        </p>

        {/* ── state_root 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">state_root 계산 — alloc → MPT 루트</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2"><code>state_root_ref_unhashed()</code> — alloc → MPT 루트</p>
            <p className="text-xs text-foreground/50 mb-3">8,893개 계정을 순회하며 MPT leaf 구성 → 최종 root 계산</p>
            <div className="space-y-2">
              <div className="rounded border border-border/40 px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">1</span>
                  <span className="text-xs font-semibold">주소 해시</span>
                </div>
                <p className="text-[11px] text-foreground/60 ml-7"><code>keccak256(address)</code> → MPT 키</p>
              </div>
              <div className="rounded border border-border/40 px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">2</span>
                  <span className="text-xs font-semibold"><code>GenesisAccount</code> → <code>TrieAccount</code></span>
                </div>
                <div className="ml-7 grid grid-cols-2 gap-1.5">
                  <p className="text-[11px] text-foreground/60"><code>nonce</code>: <code>unwrap_or(0)</code></p>
                  <p className="text-[11px] text-foreground/60"><code>balance</code>: 그대로</p>
                  <p className="text-[11px] text-foreground/60"><code>storage_root</code>: 스토리지 있으면 하위 트라이 계산, 없으면 <code>EMPTY_ROOT_HASH</code></p>
                  <p className="text-[11px] text-foreground/60"><code>code_hash</code>: 코드 있으면 <code>keccak256(code)</code>, 없으면 <code>KECCAK_EMPTY</code></p>
                </div>
              </div>
              <div className="rounded border border-border/40 px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">3</span>
                  <span className="text-xs font-semibold">RLP 인코딩 + leaf 추가</span>
                </div>
                <p className="text-[11px] text-foreground/60 ml-7"><code>alloy_rlp::encode(trie_account)</code> → <code>hb.add_leaf(Nibbles, encoded)</code></p>
              </div>
            </div>
            <p className="text-xs text-foreground/50 mt-3">
              메인넷 genesis state_root: <code className="text-[10px]">0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544</code>
            </p>
          </div>
        </div>
        <p className="leading-7">
          <code>HashBuilder</code>는 정렬된 키 순서로 MPT를 구성하는 유틸리티.<br />
          8,893개 계정을 정렬(keccak256 순) → 각각 leaf로 추가 → 최종 root 계산.<br />
          메인넷 genesis state_root: <code>0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544</code> — 고정값.
        </p>

        {/* ── genesis_hash ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">genesis_hash — 피어 호환성 검증 키</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-1">메인넷 genesis hash</p>
            <p className="text-xs font-mono text-foreground/60 break-all">0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2">eth/68 <code>StatusMessage</code> — 피어 핸드셰이크</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { field: 'protocol_version', value: '68 (eth/68)' },
                { field: 'network_id', value: '1 (mainnet)' },
                { field: 'total_difficulty', value: 'PoS 이후 final TD 고정' },
                { field: 'best_hash', value: '현재 tip 블록 해시' },
                { field: 'genesis_hash', value: '호환성 체크 키' },
                { field: 'fork_id', value: 'EIP-2124 identifier' },
              ].map(f => (
                <div key={f.field} className="rounded border border-border/40 px-2 py-1.5">
                  <code className="text-[11px] font-bold">{f.field}</code>
                  <p className="text-[10px] text-foreground/50">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">피어 연결 흐름</p>
            <div className="flex items-center gap-2 text-xs text-foreground/70">
              <span className="bg-muted rounded px-2 py-1">Status 수신</span>
              <span className="text-foreground/40">→</span>
              <span className="bg-muted rounded px-2 py-1">genesis_hash 비교</span>
              <span className="text-foreground/40">→</span>
              <span className="bg-emerald-100 dark:bg-emerald-900/30 rounded px-2 py-1">일치: 연결</span>
              <span className="text-foreground/40">/</span>
              <span className="bg-red-100 dark:bg-red-900/30 rounded px-2 py-1">불일치: 거부</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>genesis_hash</code>는 체인의 <strong>지문(fingerprint)</strong>.<br />
          내가 메인넷 노드를 실행하는데 상대가 Sepolia 제네시스 해시를 보내면 즉시 연결 거부.<br />
          실수로 잘못된 chain_id만 설정하면 genesis_hash가 같을 수 있으므로, 이 체크가 있어야 fork 체인과 안전하게 분리 가능.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 컴파일 타임 임베딩의 대가</p>
          <p className="mt-2">
            <code>include_str!()</code>로 genesis.json을 바이너리에 포함시키는 비용:<br />
            - 메인넷 genesis: ~200KB (8,893 계정)<br />
            - Sepolia: ~50KB<br />
            - Holesky: ~150KB<br />
            - 합계 ~400KB 바이너리 증가 (전체 ~50MB 중 0.8%)
          </p>
          <p className="mt-2">
            얻는 이점:<br />
            1. <strong>zero config 배포</strong> — 바이너리 하나면 끝<br />
            2. <strong>런타임 실패 제거</strong> — 파일 경로/권한/포맷 오류 불가능<br />
            3. <strong>Docker 이미지 단순화</strong> — genesis 파일 마운트 불필요<br />
            4. <strong>버전 일관성 보장</strong> — 바이너리와 genesis가 항상 짝
          </p>
          <p className="mt-2">
            0.8% 크기 증가로 배포 안정성을 얻는 것 — 명확한 트레이드오프 승리.
          </p>
        </div>
      </div>

      {/* Interactive genesis initialization steps */}
      <h3 className="text-lg font-semibold mb-3">초기화 단계</h3>
      <div className="not-prose space-y-2 mb-6">
        {GENESIS_STEPS.map((s, i) => (
          <motion.div key={i}
            onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors
              ${i === step ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i === step ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <GenesisViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
