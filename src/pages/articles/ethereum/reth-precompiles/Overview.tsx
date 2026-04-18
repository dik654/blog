import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import PrecompileMapViz from './viz/PrecompileMapViz';
import { DESIGN_CHOICES, PRECOMPILE_TABLE } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프리컴파일 레지스트리</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM 바이트코드는 범용 연산에 최적화되어 있다.<br />
          산술, 메모리 복사, 조건 분기 등은 효율적이지만, 타원곡선 페어링(bn128)이나 KZG 검증 같은 무거운 암호 연산은 사실상 불가능하다.<br />
          옵코드 조합으로 구현하면 가스비가 수백만에 달한다.
        </p>
        <p className="leading-7">
          프리컴파일(precompiled contract)은 이 문제의 해결책이다.<br />
          CALL 명령의 <code>to</code> 주소가 0x01~0x0a 범위이면, EVM은 바이트코드를 실행하지 않고 네이티브 함수를 직접 호출한다.<br />
          ecRecover는 3,000 gas, bn128Pairing은 34,000*n+45,000 gas로 수백 배 저렴하다.
        </p>
        <p className="leading-7">
          revm은 <code>PrecompileSpecId</code> enum으로 하드포크별 프리컴파일 목록을 관리한다.<br />
          각 목록은 <code>OnceLock</code>으로 지연 초기화되며, 새 하드포크는 이전 목록을 상속하고 새 항목만 추가한다.
        </p>

        {/* ── Precompile trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Precompile trait — revm의 네이티브 함수 인터페이스</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">Precompile::call(<code>input: &amp;[u8]</code>, <code>gas_limit: u64</code>, <code>env: &amp;Env</code>)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-emerald-400 mb-1">PrecompileOutput</p>
              <p className="text-xs text-foreground/60"><code>gas_used: u64</code> + <code>bytes: Bytes</code> (반환 데이터)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="font-mono text-xs text-red-400 mb-1">PrecompileError</p>
              <p className="text-xs text-foreground/60">OutOfGas, Blake2WrongLength, Bn128PairLength, BlobVerifyKzgProofFailed 등</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">실행 흐름</p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
              <span>1. CALL opcode</span>
              <span>&#8594;</span>
              <span>2. to=0x01~0x0a 확인</span>
              <span>&#8594;</span>
              <span>3. precompile 직접 호출</span>
              <span>&#8594;</span>
              <span>4. native Rust 암호 연산</span>
              <span>&#8594;</span>
              <span>5. 결과 반환</span>
            </div>
          </div>
          <p className="text-xs text-foreground/50">bytecode: opcode마다 ~100ns overhead / precompile: 직접 함수 호출 &#8594; opcode overhead 0</p>
        </div>
        <p className="leading-7">
          <code>Precompile</code> trait이 <strong>네이티브 함수의 공통 인터페이스</strong>.<br />
          EVM opcode 디스패치 거치지 않고 직접 Rust 함수 호출 → 성능 극대화.<br />
          모든 프리컴파일이 동일 시그니처 → 레지스트리에서 통일 관리.
        </p>

        {/* ── 포크별 레지스트리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Precompile 레지스트리 — 하드포크별 누적</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <p className="font-mono font-bold text-sm mb-3">PrecompileSpecId enum</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-foreground/70">Homestead</p>
              <p className="text-[11px] text-foreground/50">0x01-0x04</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-foreground/70">Byzantium</p>
              <p className="text-[11px] text-foreground/50">+0x05-0x08</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-foreground/70">Istanbul</p>
              <p className="text-[11px] text-foreground/50">+0x09</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-foreground/70">Berlin</p>
              <p className="text-[11px] text-foreground/50">(gas 조정)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-foreground/70">Cancun</p>
              <p className="text-[11px] text-foreground/50">+0x0a (point_eval)</p>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-2">
              <p className="font-mono text-xs text-foreground/70">Prague</p>
              <p className="text-[11px] text-foreground/50">+0x0b-0x11 (BLS12)</p>
            </div>
          </div>
          <div className="rounded-md border border-border/40 bg-background/60 p-3 mb-3">
            <p className="text-xs font-semibold text-foreground/70 mb-1">초기화 패턴 (Cancun 예시)</p>
            <p className="text-xs text-foreground/60"><code>OnceLock&lt;Precompiles&gt;</code> 지연 초기화. Berlin 목록 clone + point_evaluation 추가</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-foreground/50">
            <p>1. 하드포크별 명확한 목록</p>
            <p>2. 이전 fork 상속 + 증분 추가</p>
            <p>3. OnceLock: thread-safe + 1회</p>
          </div>
        </div>
        <p className="leading-7">
          하드포크별 <strong>누적 모델</strong>로 precompile 관리.<br />
          각 fork는 이전 목록 상속 + 새 항목만 추가 → 명확한 증분.<br />
          OnceLock 지연 초기화 → 첫 호출 시만 1회 구성 (thread-safe).
        </p>

        {/* ── Precompile 주소 할당 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Precompile 주소 할당 규칙</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 mb-4">
          <div className="space-y-3 mb-3">
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-foreground/70 mb-2">Frontier/Homestead (2015)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div><p className="font-mono text-[11px] text-indigo-400">0x01</p><p className="text-[11px] text-foreground/50">ecrecover (3K gas)</p></div>
                <div><p className="font-mono text-[11px] text-indigo-400">0x02</p><p className="text-[11px] text-foreground/50">sha256 (60+12*len)</p></div>
                <div><p className="font-mono text-[11px] text-indigo-400">0x03</p><p className="text-[11px] text-foreground/50">ripemd160 (600+120*len)</p></div>
                <div><p className="font-mono text-[11px] text-indigo-400">0x04</p><p className="text-[11px] text-foreground/50">identity (15+3*len)</p></div>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-foreground/70 mb-2">Byzantium (2017)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div><p className="font-mono text-[11px] text-amber-400">0x05</p><p className="text-[11px] text-foreground/50">modexp</p></div>
                <div><p className="font-mono text-[11px] text-amber-400">0x06</p><p className="text-[11px] text-foreground/50">bn128Add (150)</p></div>
                <div><p className="font-mono text-[11px] text-amber-400">0x07</p><p className="text-[11px] text-foreground/50">bn128Mul (6K)</p></div>
                <div><p className="font-mono text-[11px] text-amber-400">0x08</p><p className="text-[11px] text-foreground/50">bn128Pairing</p></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-md border border-border/40 bg-background/60 p-3">
                <p className="text-xs font-bold text-foreground/70 mb-1">Istanbul (2019)</p>
                <p className="font-mono text-[11px] text-emerald-400">0x09 <span className="text-foreground/50">blake2f (rounds*1)</span></p>
              </div>
              <div className="rounded-md border border-border/40 bg-background/60 p-3">
                <p className="text-xs font-bold text-foreground/70 mb-1">Cancun (2024)</p>
                <p className="font-mono text-[11px] text-emerald-400">0x0a <span className="text-foreground/50">point_eval (50K)</span></p>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/60 p-3">
              <p className="text-xs font-bold text-foreground/70 mb-2">Prague (예정) — BLS12-381</p>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-1 text-[11px]">
                <p className="font-mono text-red-400">0x0b <span className="text-foreground/50">G1_add</span></p>
                <p className="font-mono text-red-400">0x0c <span className="text-foreground/50">G1_msm</span></p>
                <p className="font-mono text-red-400">0x0d <span className="text-foreground/50">G2_add</span></p>
                <p className="font-mono text-red-400">0x0e <span className="text-foreground/50">G2_msm</span></p>
                <p className="font-mono text-red-400">0x0f <span className="text-foreground/50">pairing</span></p>
                <p className="font-mono text-red-400">0x10 <span className="text-foreground/50">fp&#8594;G1</span></p>
                <p className="font-mono text-red-400">0x11 <span className="text-foreground/50">fp2&#8594;G2</span></p>
              </div>
            </div>
          </div>
          <p className="text-xs text-foreground/50">원칙: 순차 할당(빈 주소 없음), 절대 재할당 금지(deprecated 유지), 주소 충돌 = EOA/컨트랙트 사용 불가</p>
        </div>
        <p className="leading-7">
          Precompile 주소는 <strong>단조 증가 순서</strong>로 할당.<br />
          주소 재할당 금지 → 기존 컨트랙트와의 호환성 영구 보장.<br />
          2025년 현재 0x01~0x0a 활성, Prague에서 0x0b~0x11 추가 예정.
        </p>
      </div>

      {/* 설계 판단 카드 */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(d => (
          <button key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{ borderColor: selected === d.id ? d.color : 'var(--color-border)', background: selected === d.id ? `${d.color}10` : undefined }}>
            <p className="font-bold text-sm" style={{ color: d.color }}>{d.title}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.title}</p>
            <p className="text-sm text-foreground/60 leading-relaxed mb-2"><strong>문제:</strong> {sel.problem}</p>
            <p className="text-sm text-foreground/80 leading-relaxed"><strong>해결:</strong> {sel.solution}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 프리컴파일 전체 테이블 */}
      <h3 className="text-lg font-semibold mb-3">프리컴파일 전체 목록 (0x01~0x0a)</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">주소</th>
              <th className="text-left p-3 font-semibold">이름</th>
              <th className="text-left p-3 font-semibold">하드포크</th>
              <th className="text-left p-3 font-semibold">가스</th>
              <th className="text-left p-3 font-semibold">용도</th>
            </tr>
          </thead>
          <tbody>
            {PRECOMPILE_TABLE.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3 font-mono text-indigo-400">{r.addr}</td>
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3 text-foreground/60">{r.fork}</td>
                <td className="p-3 text-amber-400">{r.gas}</td>
                <td className="p-3 text-foreground/70">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6"><PrecompileMapViz /></div>
    </section>
  );
}
