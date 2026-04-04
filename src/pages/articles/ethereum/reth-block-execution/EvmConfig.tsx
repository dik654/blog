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
          revm의 <code>Evm</code> 인스턴스는 두 가지 환경 설정이 필요하다.
          <code>BlockEnv</code>는 블록 수준 정보(번호, 수수료, 타임스탬프)를 담고,
          <code>TxEnv</code>는 TX 수준 정보(발신자, 가스, 값)를 담는다.
          <br />
          EvmConfig trait이 헤더와 TX에서 이 값들을 추출해 revm 환경에 매핑한다.
        </p>
        <p className="leading-7">
          <strong>왜 trait인가?</strong> Geth는 EVM 환경 설정이 <code>core/vm</code>에 하드코딩되어 있다.<br />
          다른 체인을 지원하려면 코드를 직접 수정해야 한다.
          <br />
          Reth의 EvmConfig trait 덕분에 체인별 구현체를 교체할 수 있다.<br />
          Optimism은 L1 block info TX 등의 추가 환경만 오버라이드해서 사용한다.
        </p>
        <p className="leading-7">
          PoS 전환 이후 <code>difficulty</code>는 항상 0이다.<br />
          대신 <code>prevrandao</code>(이전 RANDAO 값)가 난수 소스로 사용된다.
          <br />
          <code>fill_block_env()</code>가 <code>after_merge</code> 플래그를 보고 이 분기를 처리한다.
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
