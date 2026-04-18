import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import NodeBuilderViz from './viz/NodeBuilderViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { DESIGN_CHOICES } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(c => c.id === selected);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CLI 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 modular builder 패턴인가?</strong>{' '}
          Geth는 모놀리식 구조다. EVM, 멤풀, 합의, 네트워크가 하나의 바이너리에 하드코딩되어 있다.<br />
          새 L2를 지원하려면 전체를 포크해야 하고, 업스트림 변경을 병합하는 비용이 크다.
        </p>
        <p className="leading-7">
          Reth는 이 문제를 <strong>NodeBuilder 패턴</strong>으로 해결한다.<br />
          4개 핵심 컴포넌트(Pool, Evm, Consensus, Network)를 Rust trait으로 추상화하고, 빌더가 제네릭으로 주입받는다.<br />
          기본 메인넷 구현체가 제공되지만, L2나 커스텀 체인에서 필요한 trait만 교체할 수 있다.{' '}
          <CodeViewButton onClick={() => open('builder-node')} />
        </p>
        <p className="leading-7">
          op-reth가 대표적 사례다. OP Stack L2 노드를 구현할 때 Evm과 PayloadBuilder만 교체하고, 나머지는 Reth 기본값을 그대로 재사용한다.<br />
          Geth 포크 대비 유지보수 범위가 극적으로 줄어든다.{' '}
          <CodeViewButton onClick={() => open('cli-main')} />
        </p>

        {/* ── CLI 진입점 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CLI 진입점 — clap 기반 서브커맨드</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2">진입점 — <code>Cli::parse()</code> → <code>Commands</code> match</p>
            <p className="text-sm text-foreground/70 mb-3">Clap으로 CLI 파싱 후 서브커맨드 디스패치</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { cmd: 'reth node', desc: '노드 실행' },
                { cmd: 'reth init', desc: 'genesis 초기화' },
                { cmd: 'reth db', desc: 'DB 조회/디버깅' },
                { cmd: 'reth stage', desc: 'Stage 수동 실행' },
                { cmd: 'reth p2p', desc: '네트워크 디버깅' },
                { cmd: 'reth recover', desc: '크래시 복구' },
                { cmd: 'reth debug', desc: '내부 상태 검사' },
              ].map(s => (
                <div key={s.cmd} className="rounded border border-border/40 px-3 py-2">
                  <p className="font-mono text-xs font-bold">{s.cmd}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">Clap 프레임워크 장점</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>자동 <code>--help</code> 생성</li>
              <li>타입 안전 인자 파싱</li>
              <li>환경변수 / 설정파일 결합</li>
              <li>bash/zsh completion 자동 생성</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <strong>Clap</strong>이 Rust CLI의 표준 — 선언적 인자 정의로 자동 파싱.<br />
          7개 서브커맨드로 노드 운영 전 기능 제공 — 실행부터 복구/디버깅까지.<br />
          <code>--help</code>, completion 자동 생성 → 사용자 경험 향상.
        </p>

        {/* ── Builder 패턴 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">NodeBuilder 패턴 — 제네릭 컴포넌트 조립</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2">Type State 전이 — 3단계</p>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              {[
                { state: 'InitialState', method: 'new(config)', desc: '설정 로드' },
                { state: 'WithTypes', method: 'with_types::<T>()', desc: '체인 타입 고정 (EthereumNode, OpNode)' },
                { state: 'WithComponents', method: 'with_components(c)', desc: '컴포넌트 주입 (Pool, Evm, Consensus, Network)' },
              ].map((s, i) => (
                <div key={s.state} className="flex-1 rounded border border-border/40 px-3 py-2 flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <code className="text-xs font-bold">{s.state}</code>
                  </div>
                  <p className="text-xs text-foreground/60"><code>{s.method}</code></p>
                  <p className="text-xs text-foreground/60 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-foreground/70 mt-3">
              <code>launch()</code>는 <code>WithComponents</code> 상태에서만 호출 가능 — 이전 단계에서 호출하면 컴파일 에러
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">컴파일 타임 보장</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>잘못된 초기화 순서 → 컴파일 에러</li>
              <li>필수 필드 누락 → 컴파일 에러</li>
              <li>IDE 자동완성으로 다음 단계 메서드 안내</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <strong>Type state 패턴</strong>으로 빌더의 상태를 타입 시스템에 인코딩.<br />
          잘못된 호출 순서를 컴파일 타임에 차단 → runtime panic 없음.<br />
          IDE가 다음 단계 메서드를 자동 완성 → 사용자 가이던스 제공.
        </p>

        {/* ── L2 확장 예시 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">L2 확장 — op-reth 구조</h3>
        <div className="not-prose my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2 text-amber-600 dark:text-amber-400">교체된 것</p>
              <ul className="text-sm space-y-1 text-foreground/80">
                <li><code>NodeTypes</code>: <code>EthereumNode</code> → <code>OpNode</code> (OP 헤더, fork config)</li>
                <li><code>ExecutionStrategy</code>: <code>EthStrategy</code> → <code>OpStrategy</code> (deposit TX, L1 attributes)</li>
                <li><code>PayloadBuilder</code>: <code>EthPayloadBuilder</code> → <code>OpPayloadBuilder</code> (L1 block info 주입)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2 text-emerald-600 dark:text-emerald-400">재사용한 것</p>
              <ul className="text-sm space-y-1 text-foreground/80">
                <li><code>Pipeline</code> / <code>Stages</code> — 전부</li>
                <li><code>Provider</code> / <code>DB</code> — 전부</li>
                <li><code>Network</code> — eth/68 그대로</li>
                <li><code>RPC</code> — eth namespace + op namespace 추가</li>
                <li><code>txpool</code> — validation만 커스터마이즈</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4 bg-muted/30">
            <p className="font-semibold text-sm mb-1">결과</p>
            <p className="text-sm text-foreground/80">
              op-reth 코드량 ~10K LOC / Reth 전체 재사용 ~300K LOC → <strong>재사용률 ~97%</strong>
            </p>
          </div>
        </div>
        <p className="leading-7">
          op-reth가 <strong>Reth 재사용의 증명</strong>.<br />
          OP 고유 로직(deposit, L1 attributes) 10K LOC만 작성 → 나머지 Reth 재사용.<br />
          Geth 포크(50K+ LOC 수정 필요) 대비 유지보수 비용 극단적 감소.
        </p>
      </div>

      {/* Interactive design choice cards */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(c => (
          <button key={c.id}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === c.id ? c.color : 'var(--color-border)',
              background: selected === c.id ? `${c.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{c.role}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.details}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed mb-3">
              Geth와 비교: {sel.why}
            </p>
            {sel.codeRefKeys && (
              <div className="flex flex-wrap gap-2">
                {sel.codeRefKeys.map(k => (
                  <CodeViewButton key={k} onClick={() => open(k)} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6">
        <NodeBuilderViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
