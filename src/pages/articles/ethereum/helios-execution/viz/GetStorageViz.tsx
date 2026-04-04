import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = { proof: '#6366f1', rpc: '#3b82f6', ok: '#10b981', bloom: '#f59e0b', trust: '#ef4444', muted: '#94a3b8' };

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const fadeY = (d: number, y = 6) => ({ initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });
const drawLine = (d: number, dur = 0.3) => ({
  initial: { pathLength: 0 }, animate: { pathLength: 1 },
  transition: { delay: d, duration: dur },
});

const STEPS = [
  { label: '호출: eth_getStorageAt(addr, slot, block)', body: '특정 컨트랙트의 스토리지 슬롯 값을 읽는다. getBalance와 달리 slot 인자가 핵심 차이점이다.' },
  { label: 'storageKeys: &[slot] -- 왜 슬롯을 지정하는가', body: 'getBalance/getCode는 계정 레벨 정보 → storageKeys 빈 배열.\ngetStorageAt는 스토리지 트라이 내부 값 → 슬롯을 지정해야 storageProof를 받을 수 있다.' },
  { label: '2단계 MPT: State Trie → Storage Trie', body: '1단계: state_root에서 accountProof로 Account 검증 → storageRoot 추출\n2단계: storageRoot에서 storageProof로 slot 값 검증' },
  { label: '슬롯 값 추출: storage_proof[0].value', body: 'H256(256비트) 값 반환. Solidity mapping은 slot = keccak256(key ++ slot_number)로 슬롯 위치를 결정한다.' },
];

export default function GetStorageViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="gsArrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.proof} />
            </marker>
            <marker id="gsArrowOk" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.ok} />
            </marker>
            <marker id="gsArrowBloom" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.bloom} />
            </marker>
            <marker id="gsArrowRpc" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rpc} />
            </marker>
          </defs>

          {/* ===== Step 0: eth_getStorageAt 호출 ===== */}
          {step === 0 && (
            <motion.g key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 제목 */}
              <motion.text x={240} y={18} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={C.rpc} {...fade(0)}>
                eth_getStorageAt -- 스토리지 슬롯 읽기
              </motion.text>

              {/* 함수 모듈 */}
              <motion.g {...fadeY(0.15)}>
                <ModuleBox x={140} y={30} w={200} h={40} label="eth_getStorageAt"
                  sub="EIP-1186 증명 기반" color={C.rpc} />
              </motion.g>

              {/* 3개 파라미터 */}
              <motion.g {...fadeY(0.4)}>
                <DataBox x={30} y={88} w={110} h={30} label="addr"
                  sub="컨트랙트 주소" color={C.muted} />
              </motion.g>
              <motion.g {...fadeY(0.55)}>
                <DataBox x={185} y={88} w={110} h={30} label="slot"
                  sub="스토리지 키" color={C.bloom} />
              </motion.g>
              <motion.g {...fadeY(0.7)}>
                <DataBox x={340} y={88} w={110} h={30} label="block"
                  sub="블록 태그" color={C.muted} />
              </motion.g>

              {/* slot 강조 표시 */}
              <motion.g {...fade(0.9)}>
                <motion.line x1={240} y1={120} x2={240} y2={140}
                  stroke={C.bloom} strokeWidth={1.2} strokeDasharray="3 2"
                  {...drawLine(0.9)} />
                <rect x={150} y={142} width={180} height={28} rx={14}
                  fill={`${C.bloom}12`} stroke={C.bloom} strokeWidth={1} />
                <text x={240} y={160} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={C.bloom}>
                  slot이 핵심 차이점
                </text>
              </motion.g>

              {/* 파라미터 → 함수 연결선 */}
              {[85, 240, 395].map((cx, i) => (
                <motion.line key={i} x1={cx} y1={88} x2={240} y2={72}
                  stroke={C.muted} strokeWidth={0.6} strokeOpacity={0.3}
                  {...drawLine(0.3 + i * 0.1)} />
              ))}
            </motion.g>
          )}

          {/* ===== Step 1: storageKeys 비교 ===== */}
          {step === 1 && (
            <motion.g key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text x={240} y={16} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={C.proof} {...fade(0)}>
                storageKeys 차이 -- 빈 배열 vs 슬롯 지정
              </motion.text>

              {/* 상단 행: getBalance / getCode */}
              <motion.g {...fadeY(0.15)}>
                {/* 좌측 라벨 */}
                <ActionBox x={10} y={32} w={100} h={34} label="getBalance"
                  sub="getCode" color={C.muted} />

                {/* 화살표 */}
                <motion.line x1={114} y1={49} x2={148} y2={49}
                  stroke={C.muted} strokeWidth={1} markerEnd="url(#gsArrow)"
                  {...drawLine(0.3)} />

                {/* storageKeys: [] */}
                <DataBox x={152} y={33} w={100} h={30} label="storageKeys: []"
                  color={C.muted} />

                {/* 화살표 */}
                <motion.line x1={256} y1={49} x2={290} y2={49}
                  stroke={C.muted} strokeWidth={1} markerEnd="url(#gsArrow)"
                  {...drawLine(0.45)} />

                {/* 결과 */}
                <DataBox x={294} y={29} w={160} h={36} label="accountProof만"
                  sub="계정 레벨 정보로 충분" color={C.muted} />
              </motion.g>

              {/* 구분선 */}
              <motion.line x1={30} y1={78} x2={450} y2={78}
                stroke="var(--border)" strokeWidth={0.5} {...fade(0.5)} />

              {/* 하단 행: getStorageAt */}
              <motion.g {...fadeY(0.5)}>
                {/* 좌측 라벨 */}
                <ActionBox x={10} y={92} w={100} h={34} label="getStorageAt"
                  sub="슬롯 지정 필수" color={C.bloom} />

                {/* 화살표 */}
                <motion.line x1={114} y1={109} x2={148} y2={109}
                  stroke={C.bloom} strokeWidth={1.2} markerEnd="url(#gsArrowBloom)"
                  {...drawLine(0.65)} />

                {/* storageKeys: [slot] */}
                <DataBox x={152} y={93} w={110} h={30} label="storageKeys: [slot]"
                  color={C.bloom} />

                {/* 화살표 */}
                <motion.line x1={266} y1={109} x2={290} y2={109}
                  stroke={C.bloom} strokeWidth={1.2} markerEnd="url(#gsArrowBloom)"
                  {...drawLine(0.8)} />

                {/* 결과: 두 증명 포함 */}
                <rect x={294} y={89} width={160} height={42} rx={8}
                  fill={`${C.bloom}08`} stroke={C.bloom} strokeWidth={1} />
                <text x={374} y={106} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={C.bloom}>accountProof</text>
                <text x={374} y={106} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={C.bloom} dy={14}>+ storageProof</text>
              </motion.g>

              {/* 하단 핵심 설명 */}
              <motion.g {...fade(1.0)}>
                <rect x={70} y={146} width={340} height={34} rx={8}
                  fill="var(--card)" stroke={C.bloom} strokeWidth={0.5} />
                <circle cx={88} cy={163} r={3} fill={C.bloom} />
                <text x={98} y={160} fontSize={8} fill="var(--foreground)">
                  슬롯을 지정해야 RPC가 해당 슬롯의
                </text>
                <text x={98} y={172} fontSize={8} fill="var(--foreground)">
                  storageProof(Merkle 경로)를 함께 반환한다
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* ===== Step 2: 2단계 MPT 검증 ===== */}
          {step === 2 && (
            <motion.g key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text x={240} y={14} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={C.proof} {...fade(0)}>
                2단계 MPT 검증 -- 중첩 트라이 구조
              </motion.text>

              {/* ── 1단계: State Trie ── */}
              <motion.g {...fadeY(0.1)}>
                <rect x={10} y={24} width={210} height={80} rx={8}
                  fill={`${C.ok}06`} stroke={C.ok} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={115} y={36} textAnchor="middle" fontSize={8}
                  fontWeight={600} fill={C.ok}>1단계: State Trie</text>
              </motion.g>

              {/* state_root */}
              <motion.g {...fadeY(0.2)}>
                <ModuleBox x={20} y={42} w={70} h={34} label="state_root"
                  sub="CL 검증" color={C.ok} />
              </motion.g>

              {/* 화살표: state_root → verify */}
              <motion.line x1={94} y1={59} x2={108} y2={59}
                stroke={C.ok} strokeWidth={1} markerEnd="url(#gsArrowOk)"
                {...drawLine(0.35)} />

              {/* verify_proof #1 */}
              <motion.g {...fadeY(0.35)}>
                <ActionBox x={112} y={42} w={96} h={34} label="verify_proof()"
                  sub="keccak(addr)" color={C.ok} />
              </motion.g>

              {/* 결과: Account */}
              <motion.g {...fadeY(0.5)}>
                <motion.line x1={212} y1={59} x2={226} y2={59}
                  stroke={C.ok} strokeWidth={1} markerEnd="url(#gsArrowOk)"
                  {...drawLine(0.5)} />
                <rect x={228} y={40} width={70} height={40} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={263} y={53} textAnchor="middle" fontSize={8}
                  fontWeight={700} fill="var(--foreground)">Account</text>
                <text x={263} y={64} textAnchor="middle" fontSize={7}
                  fill={C.bloom} fontWeight={600}>storageRoot</text>
                <text x={263} y={73} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">balance, nonce</text>
              </motion.g>

              {/* 화살표: Account → Storage Trie (연결) */}
              <motion.path
                d="M 298 60 Q 318 60, 318 80 Q 318 100, 328 100"
                fill="none" stroke={C.bloom} strokeWidth={1.5}
                markerEnd="url(#gsArrowBloom)"
                {...drawLine(0.7, 0.4)} />
              <motion.g {...fade(0.75)}>
                <rect x={302} y={82} width={16} height={14} rx={3}
                  fill="var(--card)" />
                <text x={310} y={92} textAnchor="middle" fontSize={7}
                  fontWeight={700} fill={C.bloom}>↓</text>
              </motion.g>

              {/* ── 2단계: Storage Trie ── */}
              <motion.g {...fadeY(0.6)}>
                <rect x={260} y={94} width={210} height={80} rx={8}
                  fill={`${C.bloom}06`} stroke={C.bloom} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={365} y={106} textAnchor="middle" fontSize={8}
                  fontWeight={600} fill={C.bloom}>2단계: Storage Trie</text>
              </motion.g>

              {/* storageRoot */}
              <motion.g {...fadeY(0.75)}>
                <ModuleBox x={270} y={112} w={70} h={34} label="storageRoot"
                  sub="Account에서" color={C.bloom} />
              </motion.g>

              {/* 화살표: storageRoot → verify */}
              <motion.line x1={344} y1={129} x2={358} y2={129}
                stroke={C.bloom} strokeWidth={1} markerEnd="url(#gsArrowBloom)"
                {...drawLine(0.9)} />

              {/* verify_proof #2 */}
              <motion.g {...fadeY(0.9)}>
                <ActionBox x={362} y={112} w={96} h={34} label="verify_proof()"
                  sub="keccak(slot)" color={C.bloom} />
              </motion.g>

              {/* 최종 결과 */}
              <motion.g {...fadeY(1.1)}>
                <DataBox x={170} y={158} w={140} h={30} label="slot 값 검증 완료"
                  sub="storageProof 통과" color={C.proof} />
              </motion.g>

              {/* 화살표: verify #2 → 결과 */}
              <motion.path
                d="M 410 150 Q 410 168, 314 168"
                fill="none" stroke={C.proof} strokeWidth={1}
                markerEnd="url(#gsArrow)"
                {...drawLine(1.15, 0.3)} />
            </motion.g>
          )}

          {/* ===== Step 3: 슬롯 값 추출 ===== */}
          {step === 3 && (
            <motion.g key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text x={240} y={16} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={C.ok} {...fade(0)}>
                최종 값 추출 -- storage_proof[0].value
              </motion.text>

              {/* 증명 배열 구조 */}
              <motion.g {...fadeY(0.15)}>
                <rect x={30} y={28} width={200} height={50} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={130} y={41} textAnchor="middle" fontSize={8}
                  fontWeight={600} fill="var(--foreground)">EIP1186ProofResponse</text>
                <text x={130} y={54} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)" fontFamily="monospace">
                  storage_proof: Vec&lt;StorageProof&gt;
                </text>
                <text x={130} y={68} textAnchor="middle" fontSize={7.5}
                  fill={C.bloom}>
                  [0].value = H256 (256비트)
                </text>
              </motion.g>

              {/* 화살표 → 값 추출 */}
              <motion.line x1={234} y1={53} x2={268} y2={53}
                stroke={C.ok} strokeWidth={1.2} markerEnd="url(#gsArrowOk)"
                {...drawLine(0.4)} />

              {/* 추출된 값 */}
              <motion.g {...fadeY(0.4)}>
                <DataBox x={272} y={33} w={110} h={38} label="H256 Value"
                  sub="256비트 슬롯 값" color={C.ok} />
              </motion.g>

              {/* 반환 화살표 */}
              <motion.line x1={395} y1={53} x2={430} y2={53}
                stroke={C.ok} strokeWidth={1} markerEnd="url(#gsArrowOk)"
                {...drawLine(0.6)} />
              <motion.text x={443} y={57} textAnchor="middle" fontSize={9}
                fontWeight={700} fill={C.ok} {...fade(0.65)}>
                반환
              </motion.text>

              {/* 하단 설명: Solidity mapping 슬롯 계산 */}
              <motion.g {...fadeY(0.8)}>
                <rect x={30} y={96} width={420} height={82} rx={8}
                  fill="var(--card)" stroke={C.proof} strokeWidth={0.5} />

                <text x={46} y={114} fontSize={9} fontWeight={700}
                  fill={C.proof}>
                  Solidity 슬롯 계산 규칙
                </text>

                {/* 단순 변수 */}
                <circle cx={46} cy={132} r={3} fill={C.ok} />
                <text x={56} y={135} fontSize={8} fill="var(--foreground)">
                  단순 변수: slot = 선언 순서 (0, 1, 2, ...)
                </text>

                {/* mapping */}
                <circle cx={46} cy={148} r={3} fill={C.bloom} />
                <text x={56} y={151} fontSize={8} fill="var(--foreground)">
                  mapping(k =&gt; v): slot = keccak256(key ++ slot_number)
                </text>

                {/* 동적 배열 */}
                <circle cx={46} cy={164} r={3} fill={C.proof} />
                <text x={56} y={167} fontSize={8} fill="var(--foreground)">
                  동적 배열: slot = keccak256(slot_number) + index
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
