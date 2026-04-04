import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  proof: '#6366f1', rpc: '#3b82f6', ok: '#10b981',
  bloom: '#f59e0b', trust: '#ef4444', muted: '#94a3b8',
};

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { delay: d, duration: 0.3 },
});

const fadeUp = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.3 },
});

const drawLine = (d: number) => ({
  initial: { pathLength: 0 }, animate: { pathLength: 1 },
  transition: { delay: d, duration: 0.4 },
});

const STEPS = [
  {
    label: '호출: eth_getCode(addr, block)',
    body: '컨트랙트 주소와 블록 태그를 받아 바이트코드를 요청한다. 라이트 클라이언트는 RPC 응답을 신뢰하지 않으므로 증명 기반 검증이 필요하다.',
  },
  {
    label: 'MPT 검증 \u2192 codeHash 획득',
    body: 'accountProof를 state_root 기준으로 검증한 뒤, Account 구조체에서 code_hash 필드를 추출한다. 이 해시는 CL이 확인한 상태에서 나온 신뢰할 수 있는 값이다.',
  },
  {
    label: '이중 검증: keccak256(code) == codeHash',
    body: 'RPC가 반환한 코드의 해시를 계산하고, 증명에서 얻은 codeHash와 대조한다. 이 검증이 없으면 RPC가 정상 증명과 함께 악성 코드를 주입할 수 있다.',
  },
  {
    label: 'EOA vs 컨트랙트 분기',
    body: 'codeHash가 EMPTY_CODE_HASH(keccak256(b""))이면 EOA로 판단해 빈 바이트를 반환한다. 코드가 있는 컨트랙트만 RPC에 실제 바이트코드를 요청한다.',
  },
];

export default function GetCodeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="gc-arrow" viewBox="0 0 10 7" refX={9} refY={3.5}
              markerWidth={7} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L10,3.5 L0,7z" fill={C.muted} />
            </marker>
            <marker id="gc-arrow-proof" viewBox="0 0 10 7" refX={9} refY={3.5}
              markerWidth={7} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L10,3.5 L0,7z" fill={C.proof} />
            </marker>
            <marker id="gc-arrow-ok" viewBox="0 0 10 7" refX={9} refY={3.5}
              markerWidth={7} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L10,3.5 L0,7z" fill={C.ok} />
            </marker>
            <marker id="gc-arrow-trust" viewBox="0 0 10 7" refX={9} refY={3.5}
              markerWidth={7} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L10,3.5 L0,7z" fill={C.trust} />
            </marker>
            <marker id="gc-arrow-rpc" viewBox="0 0 10 7" refX={9} refY={3.5}
              markerWidth={7} markerHeight={5} orient="auto-start-reverse">
              <path d="M0,0 L10,3.5 L0,7z" fill={C.rpc} />
            </marker>
          </defs>

          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            {/* ── Step 0: 함수 호출 ── */}
            {step === 0 && (
              <g>
                <motion.g {...fadeUp(0)}>
                  <ModuleBox x={160} y={20} w={160} h={50} label="eth_getCode" sub="ExecutionModule" color={C.rpc} />
                </motion.g>
                <motion.line x1={240} y1={70} x2={240} y2={95}
                  stroke={C.muted} strokeWidth={1} markerEnd="url(#gc-arrow)"
                  {...drawLine(0.3)} />
                <motion.g {...fadeUp(0.4)}>
                  <DataBox x={130} y={100} w={100} h={30} label="contract addr" color={C.proof} />
                </motion.g>
                <motion.g {...fadeUp(0.5)}>
                  <DataBox x={250} y={100} w={100} h={30} label="block tag" color={C.muted} />
                </motion.g>
                <motion.g {...fade(0.7)}>
                  <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                    RPC 응답을 그대로 믿지 않고, 증명 기반으로 검증한다
                  </text>
                </motion.g>
              </g>
            )}

            {/* ── Step 1: MPT 검증 → codeHash 획득 ── */}
            {step === 1 && (
              <g>
                {/* state_root 시작점 */}
                <motion.g {...fadeUp(0)}>
                  <DataBox x={10} y={12} w={85} h={28} label="state_root" sub="CL 검증됨" color={C.ok} />
                </motion.g>

                {/* 화살표: state_root → verify_proof */}
                <motion.line x1={95} y1={26} x2={120} y2={26}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#gc-arrow-ok)"
                  {...drawLine(0.15)} />

                {/* verify_proof 액션 */}
                <motion.g {...fadeUp(0.2)}>
                  <ActionBox x={122} y={8} w={100} h={36} label="verify_proof" sub="MPT 경로 추적" color={C.proof} />
                </motion.g>

                {/* 화살표: verify_proof → Account */}
                <motion.line x1={222} y1={26} x2={248} y2={26}
                  stroke={C.proof} strokeWidth={1} markerEnd="url(#gc-arrow-proof)"
                  {...drawLine(0.35)} />

                {/* Account 구조체 — 4개 필드 */}
                <motion.g {...fadeUp(0.4)}>
                  <rect x={250} y={4} width={220} height={108} rx={8}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <rect x={250} y={4} width={220} height={20} rx={8}
                    fill={C.proof + '15'} />
                  {/* 하단 모서리 채움 */}
                  <rect x={250} y={16} width={220} height={8}
                    fill={C.proof + '15'} />
                  <text x={360} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.proof}>
                    Account 구조체
                  </text>

                  {/* 필드들 */}
                  {[
                    { label: 'nonce', val: '트랜잭션 수', y: 36 },
                    { label: 'balance', val: '잔액 (wei)', y: 55 },
                    { label: 'storage_root', val: '스토리지 트라이 루트', y: 74 },
                    { label: 'code_hash', val: 'keccak256(bytecode)', y: 93 },
                  ].map((f, i) => (
                    <g key={f.label}>
                      <rect x={258} y={f.y - 9} width={204} height={17} rx={3}
                        fill={i === 3 ? C.bloom + '20' : 'transparent'}
                        stroke={i === 3 ? C.bloom : 'transparent'} strokeWidth={i === 3 ? 1 : 0} />
                      <text x={270} y={f.y + 3} fontSize={8} fontWeight={i === 3 ? 700 : 500}
                        fill={i === 3 ? C.bloom : 'var(--foreground)'}>{f.label}</text>
                      <text x={454} y={f.y + 3} textAnchor="end" fontSize={7.5}
                        fill={i === 3 ? C.bloom : 'var(--muted-foreground)'}>{f.val}</text>
                    </g>
                  ))}
                </motion.g>

                {/* code_hash 추출 화살표 */}
                <motion.path d="M 360 112 L 360 135 L 240 135 L 240 155"
                  fill="none" stroke={C.bloom} strokeWidth={1.2} markerEnd="url(#gc-arrow)"
                  {...drawLine(0.7)} />

                <motion.g {...fadeUp(0.8)}>
                  <DataBox x={180} y={158} w={120} h={28} label="code_hash" sub="신뢰할 수 있는 값" color={C.bloom} />
                </motion.g>
              </g>
            )}

            {/* ── Step 2: 이중 검증 (핵심) ── */}
            {step === 2 && (
              <g>
                {/* 상단: 정상 검증 흐름 */}
                <motion.g {...fadeUp(0)}>
                  <text x={240} y={14} textAnchor="middle" fontSize={8} fontWeight={600}
                    fill={C.ok}>정상 검증 흐름</text>
                </motion.g>

                {/* RPC 코드 응답 */}
                <motion.g {...fadeUp(0.1)}>
                  <DataBox x={15} y={22} w={90} h={28} label="RPC 응답" sub="bytecode" color={C.rpc} />
                </motion.g>

                {/* 화살표: RPC → keccak256 */}
                <motion.line x1={105} y1={36} x2={130} y2={36}
                  stroke={C.rpc} strokeWidth={1} markerEnd="url(#gc-arrow-rpc)"
                  {...drawLine(0.2)} />

                {/* keccak256 해싱 */}
                <motion.g {...fadeUp(0.25)}>
                  <ActionBox x={132} y={18} w={100} h={36} label="keccak256(code)" sub="해시 계산" color={C.proof} />
                </motion.g>

                {/* 비교 기호 */}
                <motion.line x1={232} y1={36} x2={260} y2={36}
                  stroke={C.muted} strokeWidth={1}
                  {...drawLine(0.35)} />

                <motion.g {...fade(0.4)}>
                  <rect x={260} y={24} width={28} height={24} rx={12}
                    fill={C.ok + '20'} stroke={C.ok} strokeWidth={1} />
                  <text x={274} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ok}>==</text>
                </motion.g>

                <motion.line x1={288} y1={36} x2={316} y2={36}
                  stroke={C.muted} strokeWidth={1}
                  {...drawLine(0.45)} />

                {/* codeHash from proof */}
                <motion.g {...fadeUp(0.3)}>
                  <DataBox x={318} y={22} w={100} h={28} label="codeHash" sub="증명에서 획득" color={C.bloom} />
                </motion.g>

                {/* 체크마크 결과 */}
                <motion.g {...fadeUp(0.5)}>
                  <circle cx={448} cy={36} r={12} fill={C.ok + '20'} stroke={C.ok} strokeWidth={1} />
                  <text x={448} y={40} textAnchor="middle" fontSize={12} fill={C.ok}>✓</text>
                </motion.g>
                <motion.line x1={418} y1={36} x2={434} y2={36}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#gc-arrow-ok)"
                  {...drawLine(0.5)} />

                {/* 구분선 */}
                <motion.line x1={30} y1={68} x2={450} y2={68}
                  stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3"
                  {...fade(0.6)} />

                {/* 하단: 공격 시나리오 */}
                <motion.g {...fadeUp(0.6)}>
                  <text x={240} y={82} textAnchor="middle" fontSize={8} fontWeight={600}
                    fill={C.trust}>검증 없을 때 공격 시나리오</text>
                </motion.g>

                <motion.g {...fadeUp(0.7)}>
                  <AlertBox x={20} y={90} w={130} h={44} label="악성 RPC" sub="정상 proof + 악성 code" color={C.trust} />
                </motion.g>

                <motion.line x1={150} y1={112} x2={178} y2={112}
                  stroke={C.trust} strokeWidth={1} markerEnd="url(#gc-arrow-trust)"
                  {...drawLine(0.8)} />

                {/* 두 갈래 */}
                <motion.g {...fadeUp(0.85)}>
                  {/* 정상 proof */}
                  <rect x={180} y={90} width={120} height={20} rx={4}
                    fill={C.ok + '12'} stroke={C.ok} strokeWidth={0.8} />
                  <text x={240} y={103} textAnchor="middle" fontSize={7.5} fill={C.ok}>accountProof ✓ 통과</text>

                  {/* 악성 code */}
                  <rect x={180} y={114} width={120} height={20} rx={4}
                    fill={C.trust + '12'} stroke={C.trust} strokeWidth={0.8} />
                  <text x={240} y={127} textAnchor="middle" fontSize={7.5} fill={C.trust}>code = 악성 바이트코드</text>
                </motion.g>

                <motion.line x1={300} y1={112} x2={328} y2={112}
                  stroke={C.trust} strokeWidth={1} markerEnd="url(#gc-arrow-trust)"
                  {...drawLine(0.9)} />

                <motion.g {...fadeUp(0.95)}>
                  <AlertBox x={330} y={90} w={130} h={44} label="코드 주입 성공" sub="해시 검증이 이를 차단" color={C.trust} />
                </motion.g>

                {/* 하단 결론 */}
                <motion.g {...fade(1.0)}>
                  <rect x={100} y={148} width={280} height={22} rx={4}
                    fill={C.ok + '10'} stroke={C.ok} strokeWidth={0.8} />
                  <text x={240} y={163} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ok}>
                    keccak256 대조가 proof + code 분리 공격을 방어한다
                  </text>
                </motion.g>
              </g>
            )}

            {/* ── Step 3: EOA vs 컨트랙트 분기 ── */}
            {step === 3 && (
              <g>
                {/* 분기 시작점: codeHash */}
                <motion.g {...fadeUp(0)}>
                  <DataBox x={185} y={8} w={110} h={30} label="codeHash" sub="proof에서 획득" color={C.bloom} />
                </motion.g>

                {/* 분기 화살표 — 왼쪽 */}
                <motion.path d="M 210 38 L 210 48 L 110 48 L 110 62"
                  fill="none" stroke={C.muted} strokeWidth={1} markerEnd="url(#gc-arrow)"
                  {...drawLine(0.2)} />

                {/* 분기 화살표 — 오른쪽 */}
                <motion.path d="M 270 38 L 270 48 L 370 48 L 370 62"
                  fill="none" stroke={C.muted} strokeWidth={1} markerEnd="url(#gc-arrow)"
                  {...drawLine(0.2)} />

                {/* ─ 왼쪽: EOA ─ */}
                <motion.g {...fadeUp(0.3)}>
                  {/* 배경 영역 */}
                  <rect x={20} y={64} width={180} height={120} rx={8}
                    fill={C.muted + '08'} stroke={C.muted} strokeWidth={0.5} strokeDasharray="4 3" />
                  <text x={110} y={78} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
                    EOA (일반 계정)
                  </text>
                </motion.g>

                <motion.g {...fadeUp(0.4)}>
                  <ActionBox x={40} y={86} w={140} h={32} label="codeHash 비교" sub="== EMPTY_CODE_HASH" color={C.muted} />
                </motion.g>

                <motion.line x1={110} y1={118} x2={110} y2={132}
                  stroke={C.muted} strokeWidth={1} markerEnd="url(#gc-arrow)"
                  {...drawLine(0.5)} />

                <motion.g {...fadeUp(0.55)}>
                  <rect x={50} y={134} width={120} height={24} rx={12}
                    fill={C.muted + '15'} stroke={C.muted} strokeWidth={1} />
                  <text x={110} y={150} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.muted}>
                    빈 Bytes 반환
                  </text>
                </motion.g>

                <motion.g {...fade(0.6)}>
                  <text x={110} y={174} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                    RPC 요청 생략 (최적화)
                  </text>
                </motion.g>

                {/* ─ 오른쪽: 컨트랙트 ─ */}
                <motion.g {...fadeUp(0.3)}>
                  <rect x={280} y={64} width={180} height={120} rx={8}
                    fill={C.ok + '06'} stroke={C.ok} strokeWidth={0.5} strokeDasharray="4 3" />
                  <text x={370} y={78} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ok}>
                    컨트랙트
                  </text>
                </motion.g>

                <motion.g {...fadeUp(0.4)}>
                  <ActionBox x={300} y={86} w={140} h={32} label="eth_getCode RPC" sub="바이트코드 요청" color={C.rpc} />
                </motion.g>

                <motion.line x1={370} y1={118} x2={370} y2={132}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#gc-arrow-ok)"
                  {...drawLine(0.5)} />

                <motion.g {...fadeUp(0.55)}>
                  <rect x={310} y={134} width={120} height={24} rx={12}
                    fill={C.ok + '15'} stroke={C.ok} strokeWidth={1} />
                  <text x={370} y={150} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ok}>
                    전체 코드 반환
                  </text>
                </motion.g>

                <motion.g {...fade(0.6)}>
                  <text x={370} y={174} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                    keccak256 검증 후 반환
                  </text>
                </motion.g>
              </g>
            )}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
