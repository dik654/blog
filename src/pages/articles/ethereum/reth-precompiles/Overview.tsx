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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// revm-precompile 크레이트의 trait
pub trait Precompile {
    /// 프리컴파일 실행
    fn call(
        &self,
        input: &[u8],         // CALL의 calldata
        gas_limit: u64,        // 남은 gas
        env: &Env,             // EVM 환경 (chain_spec, block)
    ) -> Result<PrecompileOutput, PrecompileError>;
}

pub struct PrecompileOutput {
    pub gas_used: u64,
    pub bytes: Bytes,  // 반환 데이터
}

pub enum PrecompileError {
    OutOfGas,
    Blake2WrongLength,
    Blake2WrongFinalIndicatorFlag,
    ModexpExpOverflow,
    ModexpBaseOverflow,
    ModexpModOverflow,
    Bn128FieldPointNotAMember,
    Bn128AffineGFailedToCreate,
    Bn128PairLength,
    BlobInvalidInputLength,
    BlobMismatchedVersion,
    BlobVerifyKzgProofFailed,
    Other(String),
}

// 실행 흐름:
// 1. EVM이 CALL opcode 실행
// 2. to 주소가 0x01~0x0a 확인
// 3. precompile 함수 직접 호출 (bytecode 없음)
// 4. native Rust 코드로 암호 연산 수행
// 5. 결과 + gas_used 반환

// 성능:
// - bytecode 실행: opcode마다 overhead ~100ns
// - precompile: 직접 함수 호출 → opcode overhead 0`}
        </pre>
        <p className="leading-7">
          <code>Precompile</code> trait이 <strong>네이티브 함수의 공통 인터페이스</strong>.<br />
          EVM opcode 디스패치 거치지 않고 직접 Rust 함수 호출 → 성능 극대화.<br />
          모든 프리컴파일이 동일 시그니처 → 레지스트리에서 통일 관리.
        </p>

        {/* ── 포크별 레지스트리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Precompile 레지스트리 — 하드포크별 누적</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 하드포크별 Precompiles 정의
pub enum PrecompileSpecId {
    Homestead,     // 0x01-0x04
    Byzantium,     // +0x05-0x08
    Istanbul,      // +0x09
    Berlin,        // (gas 조정)
    Cancun,        // +0x0a (point_evaluation)
    Prague,        // +0x0b-0x11 (BLS12-381)
}

pub fn precompiles_by_spec(spec: PrecompileSpecId) -> &'static Precompiles {
    match spec {
        PrecompileSpecId::Homestead => &HOMESTEAD_PRECOMPILES,
        PrecompileSpecId::Byzantium => &BYZANTIUM_PRECOMPILES,
        PrecompileSpecId::Istanbul => &ISTANBUL_PRECOMPILES,
        PrecompileSpecId::Berlin => &BERLIN_PRECOMPILES,
        PrecompileSpecId::Cancun => &CANCUN_PRECOMPILES,
        PrecompileSpecId::Prague => &PRAGUE_PRECOMPILES,
    }
}

// OnceLock 지연 초기화
static CANCUN_PRECOMPILES: OnceLock<Precompiles> = OnceLock::new();

fn init_cancun() -> Precompiles {
    let mut p = BERLIN_PRECOMPILES.clone();  // Berlin 상속
    p.insert(POINT_EVALUATION_ADDRESS, point_evaluation_precompile());
    p
}

// 장점:
// 1. 하드포크별 명확한 목록
// 2. 이전 fork 기반으로 증분 추가 → 중복 제거
// 3. OnceLock으로 thread-safe + 1회만 초기화

// 레지스트리 조회:
fn get_precompile(addr: &Address, spec: PrecompileSpecId) -> Option<&Precompile> {
    precompiles_by_spec(spec).get(addr)
}`}
        </pre>
        <p className="leading-7">
          하드포크별 <strong>누적 모델</strong>로 precompile 관리.<br />
          각 fork는 이전 목록 상속 + 새 항목만 추가 → 명확한 증분.<br />
          OnceLock 지연 초기화 → 첫 호출 시만 1회 구성 (thread-safe).
        </p>

        {/* ── Precompile 주소 할당 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Precompile 주소 할당 규칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 주소 0x00은 예약 (사용 안 됨)
// 0x01부터 순차 할당

// Frontier/Homestead (2015):
0x0000000000000000000000000000000000000001 ecrecover    (3_000 gas)
0x0000000000000000000000000000000000000002 sha256      (60 + 12*len gas)
0x0000000000000000000000000000000000000003 ripemd160   (600 + 120*len gas)
0x0000000000000000000000000000000000000004 identity    (15 + 3*len gas)

// Byzantium (EIP-196/197/198, 2017):
0x0000000000000000000000000000000000000005 modexp      (복잡 공식)
0x0000000000000000000000000000000000000006 bn128Add    (150 gas)
0x0000000000000000000000000000000000000007 bn128Mul    (6_000 gas)
0x0000000000000000000000000000000000000008 bn128Pairing (45_000 + 34_000*n)

// Istanbul (EIP-152/1108, 2019):
0x0000000000000000000000000000000000000009 blake2f     (rounds * 1 gas)

// Cancun (EIP-4844, 2024):
0x000000000000000000000000000000000000000a point_eval  (50_000 gas)

// Prague (EIP-2537, 예정):
0x000000000000000000000000000000000000000b BLS12_G1_add
0x000000000000000000000000000000000000000c BLS12_G1_msm
0x000000000000000000000000000000000000000d BLS12_G2_add
0x000000000000000000000000000000000000000e BLS12_G2_msm
0x000000000000000000000000000000000000000f BLS12_pairing
0x0000000000000000000000000000000000000010 BLS12_map_fp_to_g1
0x0000000000000000000000000000000000000011 BLS12_map_fp2_to_g2

// 주소 할당 원칙:
// - 순차 할당 (빈 주소 없음)
// - 절대 재할당 금지 (deprecated도 유지)
// - 주소 충돌 = EOA/컨트랙트 절대 사용 불가`}
        </pre>
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
