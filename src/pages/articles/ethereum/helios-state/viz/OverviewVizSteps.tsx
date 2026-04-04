import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './OverviewVizData';

/* ── Step 0: Reth DB 실린더 vs Helios RPC+검증 ──────── */
export function Step0() {
  const rethY = 28;
  const heliosY = 122;

  return (
    <g>
      {/* ── 상단 라벨 ── */}
      <text x={240} y={16} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        eth_getBalance 요청 시 경로 비교
      </text>

      {/* ── Reth 경로 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}>
        <DataBox x={12} y={rethY} w={85} h={30} label="eth_getBalance"
          sub="요청" color={C.reth} />
      </motion.g>

      {/* 화살표: 요청 → DB */}
      <motion.path
        d="M 100 43 L 130 43"
        stroke={C.reth} strokeWidth={1.2} fill="none"
        markerEnd="url(#arrowReth)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      />

      {/* DB 실린더 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <ellipse cx={178} cy={rethY + 4} rx={40} ry={7}
          fill="var(--card)" stroke={C.reth} strokeWidth={0.8} />
        <rect x={138} y={rethY + 4} width={80} height={28}
          fill="var(--card)" />
        <line x1={138} y1={rethY + 4} x2={138} y2={rethY + 32}
          stroke={C.reth} strokeWidth={0.8} />
        <line x1={218} y1={rethY + 4} x2={218} y2={rethY + 32}
          stroke={C.reth} strokeWidth={0.8} />
        <ellipse cx={178} cy={rethY + 32} rx={40} ry={7}
          fill="var(--card)" stroke={C.reth} strokeWidth={0.8} />
        {/* 상단 타원 재렌더 (덮기) */}
        <ellipse cx={178} cy={rethY + 4} rx={40} ry={7}
          fill="var(--card)" stroke={C.reth} strokeWidth={0.8} />
        <text x={178} y={rethY + 22} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={C.reth}>State DB</text>
        <text x={178} y={rethY + 48} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">700GB+ 로컬 디스크</text>
      </motion.g>

      {/* 화살표: DB → 값 */}
      <motion.path
        d="M 220 43 L 250 43"
        stroke={C.reth} strokeWidth={1.2} fill="none"
        markerEnd="url(#arrowReth)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <DataBox x={254} y={rethY} w={58} h={30} label="1.5 ETH"
          sub="즉시 응답" color={C.reth} />
      </motion.g>

      {/* Reth 요약 라벨 */}
      <motion.text x={350} y={rethY + 10} fontSize={8}
        fontWeight={600} fill={C.reth}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        Reth: 직접 읽기
      </motion.text>
      <motion.text x={350} y={rethY + 22} fontSize={7}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        신뢰 불필요 (자체 DB)
      </motion.text>

      {/* ── 구분선 ── */}
      <motion.line
        x1={20} y1={95} x2={460} y2={95}
        stroke="var(--border)" strokeWidth={0.8} strokeDasharray="6 4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <rect x={185} y={87} width={110} height={16} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={98} textAnchor="middle"
          fontSize={8} fontWeight={600} fill="var(--foreground)">
          같은 요청, 다른 경로
        </text>
      </motion.g>

      {/* ── Helios 경로 ── */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}>
        <DataBox x={12} y={heliosY} w={85} h={30} label="eth_getBalance"
          sub="요청" color={C.helios} />
      </motion.g>

      {/* → RPC */}
      <motion.path
        d="M 100 137 L 118 137"
        stroke={C.helios} strokeWidth={1.2} fill="none"
        markerEnd="url(#arrowHelios)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.2 }}
      />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <ModuleBox x={122} y={heliosY - 2} w={60} h={34} label="RPC"
          sub="프로바이더" color={C.rpc} />
      </motion.g>

      {/* → 응답+증명 */}
      <motion.path
        d="M 184 137 L 202 137"
        stroke={C.helios} strokeWidth={1.2} fill="none"
        markerEnd="url(#arrowHelios)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.85, duration: 0.2 }}
      />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.95 }}>
        <DataBox x={206} y={heliosY} w={72} h={30} label="응답 + 증명"
          sub="EIP-1186" color={C.rpc} />
      </motion.g>

      {/* → Merkle 검증 */}
      <motion.path
        d="M 280 137 L 298 137"
        stroke={C.helios} strokeWidth={1.2} fill="none"
        markerEnd="url(#arrowHelios)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.1, duration: 0.2 }}
      />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}>
        <ActionBox x={302} y={heliosY - 1} w={72} h={32} label="Merkle 검증"
          sub="state_root" color={C.proof} />
      </motion.g>

      {/* → 값 */}
      <motion.path
        d="M 376 137 L 394 137"
        stroke={C.helios} strokeWidth={1.2} fill="none"
        markerEnd="url(#arrowHelios)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.35, duration: 0.2 }}
      />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.45 }}>
        <DataBox x={398} y={heliosY} w={58} h={30} label="1.5 ETH"
          sub="검증 완료" color={C.proof} />
      </motion.g>

      {/* Helios 요약 */}
      <motion.text x={240} y={heliosY + 48} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={C.helios}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}>
        Helios: 상태 없이 증명으로 검증 · 디스크 0
      </motion.text>

      {/* 화살표 마커 */}
      <defs>
        <marker id="arrowReth" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.reth} />
        </marker>
        <marker id="arrowHelios" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.helios} />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 1: EIP-1186 응답 구조 — 3 카드 ────────────── */
export function Step1() {
  /* accountProof 노드 배열 시각화 */
  const proofNodes = ['root', 'branch', 'ext', 'leaf'];

  /* storageProof 구조 */
  const storageFields = [
    { key: 'key', val: '0x0000..01' },
    { key: 'value', val: '0x1234..ab' },
    { key: 'proof', val: '[node, ...]' },
  ];

  /* account 필드 4개 */
  const accountFields = [
    { field: 'balance', val: '1.5 ETH', color: C.helios },
    { field: 'nonce', val: '42', color: C.helios },
    { field: 'codeHash', val: '0xc5d2..46', color: C.proof },
    { field: 'storageHash', val: '0x56e8..1a', color: C.proof },
  ];

  return (
    <g>
      {/* 타이틀 */}
      <text x={240} y={16} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        eth_getProof 응답의 3가지 구성요소
      </text>

      {/* ── Card 1: accountProof ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}>
        <rect x={10} y={30} width={148} height={72} rx={8}
          fill="var(--card)" stroke={C.proof} strokeWidth={0.8} />
        {/* 상단 컬러바 (clipPath) */}
        <defs>
          <clipPath id="apClip"><rect x={10} y={30} width={148} height={72} rx={8} /></clipPath>
        </defs>
        <rect x={10} y={30} width={148} height={5} fill={C.proof} opacity={0.7}
          clipPath="url(#apClip)" />
        <text x={18} y={48} fontSize={9} fontWeight={700}
          fill={C.proof}>accountProof</text>
        <text x={128} y={48} fontSize={7}
          fill="var(--muted-foreground)">상태 트라이 경로</text>

        {/* 노드 체인: root → branch → ext → leaf */}
        {proofNodes.map((n, i) => (
          <motion.g key={n}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}>
            <rect x={18 + i * 35} y={56} width={30} height={18} rx={4}
              fill="var(--card)" stroke={C.proof} strokeWidth={0.5} />
            <text x={33 + i * 35} y={68} textAnchor="middle"
              fontSize={7} fontWeight={600} fill={C.proof}>{n}</text>
            {/* 화살표 (마지막 제외) */}
            {i < proofNodes.length - 1 && (
              <text x={50 + i * 35} y={68} fontSize={8}
                fill="var(--muted-foreground)">→</text>
            )}
          </motion.g>
        ))}

        <text x={84} y={92} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">Merkle 노드 배열 (루트→리프)</text>
      </motion.g>

      {/* ── Card 2: storageProof ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        <rect x={168} y={30} width={148} height={72} rx={8}
          fill="var(--card)" stroke={C.rpc} strokeWidth={0.8} />
        <defs>
          <clipPath id="spClip"><rect x={168} y={30} width={148} height={72} rx={8} /></clipPath>
        </defs>
        <rect x={168} y={30} width={148} height={5} fill={C.rpc} opacity={0.7}
          clipPath="url(#spClip)" />
        <text x={176} y={48} fontSize={9} fontWeight={700}
          fill={C.rpc}>storageProof</text>
        <text x={288} y={48} fontSize={7}
          fill="var(--muted-foreground)">스토리지 트라이</text>

        {/* 3개 필드 */}
        {storageFields.map((f, i) => (
          <motion.g key={f.key}
            initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}>
            <rect x={176} y={56 + i * 14} width={132} height={12} rx={3}
              fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
            <text x={182} y={65 + i * 14} fontSize={7} fontWeight={600}
              fill="var(--foreground)">{f.key}</text>
            <text x={304} y={65 + i * 14} textAnchor="end" fontSize={7}
              fill="var(--muted-foreground)">{f.val}</text>
          </motion.g>
        ))}
      </motion.g>

      {/* ── Card 3: account 필드 ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        <rect x={326} y={30} width={148} height={72} rx={8}
          fill="var(--card)" stroke={C.helios} strokeWidth={0.8} />
        <defs>
          <clipPath id="afClip"><rect x={326} y={30} width={148} height={72} rx={8} /></clipPath>
        </defs>
        <rect x={326} y={30} width={148} height={5} fill={C.helios} opacity={0.7}
          clipPath="url(#afClip)" />
        <text x={334} y={48} fontSize={9} fontWeight={700}
          fill={C.helios}>account 필드</text>
        <text x={446} y={48} fontSize={7}
          fill="var(--muted-foreground)">계정 상태</text>

        {/* 4개 필드 — 2×2 그리드 */}
        {accountFields.map((f, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const fx = 334 + col * 70;
          const fy = 56 + row * 18;
          return (
            <motion.g key={f.field}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.08 }}>
              <rect x={fx} y={fy} width={64} height={14} rx={3}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
              <text x={fx + 3} y={fy + 10} fontSize={7} fontWeight={600}
                fill={f.color}>{f.field}</text>
              <text x={fx + 62} y={fy + 10} textAnchor="end" fontSize={7}
                fill="var(--muted-foreground)">{f.val}</text>
            </motion.g>
          );
        })}
      </motion.g>

      {/* ── 하단: 비교 테이블 요약 ── */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}>
        {/* 테이블 배경 */}
        <rect x={30} y={114} width={420} height={72} rx={8}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

        {/* 헤더행 */}
        <rect x={30} y={114} width={420} height={16} rx={0}
          fill="var(--border)" opacity={0.1}
          clipPath="url(#tblClip)" />
        <defs>
          <clipPath id="tblClip"><rect x={30} y={114} width={420} height={72} rx={8} /></clipPath>
        </defs>
        <text x={110} y={126} textAnchor="middle" fontSize={8}
          fontWeight={700} fill="var(--foreground)">항목</text>
        <text x={240} y={126} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.reth}>Reth</text>
        <text x={370} y={126} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={C.helios}>Helios</text>

        {/* 구분선 */}
        <line x1={170} y1={116} x2={170} y2={184}
          stroke="var(--border)" strokeWidth={0.4} />
        <line x1={310} y1={116} x2={310} y2={184}
          stroke="var(--border)" strokeWidth={0.4} />

        {/* 데이터행 3줄 */}
        {[
          { item: '상태 저장', reth: '로컬 700GB+', helios: '없음 (0 디스크)' },
          { item: '접근 방식', reth: 'DB 직접 읽기', helios: 'RPC + Merkle 증명' },
          { item: '구현', reth: 'StateProvider trait', helios: 'ProofDB (revm)' },
        ].map((r, i) => (
          <g key={r.item}>
            <line x1={32} y1={132 + i * 18} x2={448} y2={132 + i * 18}
              stroke="var(--border)" strokeWidth={0.3} />
            <text x={110} y={145 + i * 18} textAnchor="middle"
              fontSize={7.5} fill="var(--foreground)">{r.item}</text>
            <text x={240} y={145 + i * 18} textAnchor="middle"
              fontSize={7.5} fill="var(--muted-foreground)">{r.reth}</text>
            <text x={370} y={145 + i * 18} textAnchor="middle"
              fontSize={7.5} fill={C.helios}>{r.helios}</text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}

/* ── Step 2: 신뢰 모델 — RPC 불신 → Merkle 검증 → 확인 ── */
export function Step2() {
  return (
    <g>
      {/* 타이틀 */}
      <text x={240} y={16} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        프로바이더를 신뢰하지 않으면서 데이터를 사용하는 방법
      </text>

      {/* ── 왼쪽: RPC (불신 대상) ── */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}>
        {/* RPC 프로바이더 박스 */}
        <AlertBox x={20} y={36} w={100} h={50} label="RPC 프로바이더"
          sub="거짓일 수 있음" color={C.trust} />

        {/* 물음표 */}
        <text x={70} y={104} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.trust}>신뢰 불가</text>
      </motion.g>

      {/* ── 화살표: RPC → 응답 ── */}
      <motion.path
        d="M 124 61 L 152 61"
        stroke={C.trust} strokeWidth={1.2} fill="none"
        markerEnd="url(#arrowTrust)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      />

      {/* ── 중앙: 응답 데이터 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={156} y={36} width={80} height={50} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={196} y={52} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="var(--foreground)">응답 데이터</text>
        <text x={196} y={64} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">balance: 1.5 ETH</text>
        <text x={196} y={75} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">+ accountProof</text>
      </motion.g>

      {/* ── 화살표: 응답 → Merkle 검증 ── */}
      <motion.path
        d="M 240 61 L 268 61"
        stroke={C.proof} strokeWidth={1.2} fill="none"
        markerEnd="url(#arrowProof)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      />

      {/* ── Merkle 검증 ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <ActionBox x={272} y={36} w={86} h={50} label="Merkle 검증"
          sub="state_root 기준" color={C.proof} />
      </motion.g>

      {/* ── 화살표: 검증 → 결과 ── */}
      <motion.path
        d="M 362 61 L 390 61"
        stroke={C.proof} strokeWidth={1.2} fill="none"
        markerEnd="url(#arrowProof)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      />

      {/* ── 결과 (체크마크) ── */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring' }}>
        <circle cx={416} cy={61} r={22}
          fill="var(--card)" stroke={C.proof} strokeWidth={1.5} />
        <circle cx={416} cy={61} r={14}
          fill={C.proof} opacity={0.12} />
        <text x={416} y={67} textAnchor="middle" fontSize={18}
          fontWeight={700} fill={C.proof}>{'✓'}</text>
      </motion.g>

      <motion.text x={416} y={98} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={C.proof}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}>
        검증 완료
      </motion.text>

      {/* ── 하단: state_root 출처 설명 ── */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}>
        <rect x={40} y={120} width={400} height={58} rx={8}
          fill="var(--card)" stroke={C.proof} strokeWidth={0.6} />

        {/* 3단계 체인: finalized_header → state_root → Merkle 증명 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}>
          {/* BLS 검증 완료 */}
          <rect x={56} y={130} width={90} height={20} rx={10}
            fill={C.helios} opacity={0.08} stroke={C.helios} strokeWidth={0.6} />
          <text x={101} y={143} textAnchor="middle" fontSize={7.5}
            fontWeight={600} fill={C.helios}>finalized_header</text>
          <text x={101} y={157} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">BLS 서명 검증 완료</text>
        </motion.g>

        <motion.text x={155} y={143} fontSize={9}
          fill="var(--muted-foreground)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}>
          →
        </motion.text>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}>
          <rect x={168} y={130} width={82} height={20} rx={10}
            fill={C.proof} opacity={0.08} stroke={C.proof} strokeWidth={0.6} />
          <text x={209} y={143} textAnchor="middle" fontSize={7.5}
            fontWeight={600} fill={C.proof}>state_root</text>
          <text x={209} y={157} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">신뢰 기준점</text>
        </motion.g>

        <motion.text x={259} y={143} fontSize={9}
          fill="var(--muted-foreground)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}>
          →
        </motion.text>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}>
          <rect x={272} y={130} width={90} height={20} rx={10}
            fill={C.proof} opacity={0.08} stroke={C.proof} strokeWidth={0.6} />
          <text x={317} y={143} textAnchor="middle" fontSize={7.5}
            fontWeight={600} fill={C.proof}>Merkle 증명 검증</text>
          <text x={317} y={157} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">데이터 무결성 확인</text>
        </motion.g>

        {/* 핵심 강조 */}
        <motion.text x={400} y={143} fontSize={7.5}
          fontWeight={600} fill={C.proof}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}>
          위조 불가
        </motion.text>
        <motion.text x={400} y={157} fontSize={7}
          fill="var(--muted-foreground)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}>
          수학적 보장
        </motion.text>
      </motion.g>

      {/* 화살표 마커 */}
      <defs>
        <marker id="arrowTrust" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.trust} />
        </marker>
        <marker id="arrowProof" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.proof} />
        </marker>
      </defs>
    </g>
  );
}
