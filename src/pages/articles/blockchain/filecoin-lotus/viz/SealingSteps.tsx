import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

/* ── Step 0: AddPiece — 클라이언트 데이터 → 섹터 패킹 ── */
export function StepAddPiece() {
  return (
    <g>
      <text x={230} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#f59e0b">
        AddPiece: 클라이언트 데이터를 섹터에 패킹
      </text>
      {/* 클라이언트 파일들 */}
      {['파일 A\n8 GiB', '파일 B\n12 GiB', '파일 C\n4 GiB'].map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, ...sp }}>
          <rect x={15 + i * 80} y={28} width={70} height={36} rx={4}
            fill="#3b82f610" stroke="#3b82f6" strokeWidth={1} />
          {f.split('\n').map((l, li) => (
            <text key={li} x={50 + i * 80} y={42 + li * 14} textAnchor="middle"
              fontSize={10} fontWeight={li === 0 ? 600 : 400}
              fill={li === 0 ? '#3b82f6' : 'var(--muted-foreground)'}>{l}</text>
          ))}
        </motion.g>
      ))}

      {/* 화살표 */}
      <motion.text x={260} y={50} fontSize={12} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>→</motion.text>

      {/* 섹터 — 32 GiB 구조 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, ...sp }}>
        <rect x={280} y={24} width={160} height={45} rx={6}
          fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1.5} />
        <text x={360} y={38} textAnchor="middle" fontSize={11} fontWeight={600} fill="#f59e0b">섹터 (32 GiB)</text>
        {/* 내부 piece 구조 */}
        <rect x={290} y={46} width={50} height={14} rx={2} fill="#3b82f625" stroke="#3b82f6" strokeWidth={0.5} />
        <text x={315} y={57} textAnchor="middle" fontSize={9} fill="#3b82f6">A 8G</text>
        <rect x={342} y={46} width={60} height={14} rx={2} fill="#3b82f625" stroke="#3b82f6" strokeWidth={0.5} />
        <text x={372} y={57} textAnchor="middle" fontSize={9} fill="#3b82f6">B 12G</text>
        <rect x={404} y={46} width={26} height={14} rx={2} fill="#3b82f625" stroke="#3b82f6" strokeWidth={0.5} />
        <text x={417} y={57} textAnchor="middle" fontSize={9} fill="#3b82f6">C</text>
      </motion.g>

      {/* comm_d (piece commitment) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, ...sp }}>
        <line x1={360} y1={69} x2={360} y2={84} stroke="#10b981" strokeWidth={1} />
        <rect x={300} y={86} width={120} height={24} rx={4}
          fill="#10b98110" stroke="#10b981" strokeWidth={1} />
        <text x={360} y={102} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
          comm_d (원본 해시)
        </text>
      </motion.g>

      <text x={230} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        각 piece의 SHA256 해시 → Merkle Tree → comm_d (데이터 커밋먼트)
      </text>
    </g>
  );
}

/* ── Step 1: PC1 — SDR 11레이어 인코딩 ── */
export function StepPC1() {
  return (
    <g>
      <text x={230} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#f59e0b">
        PC1: SDR 11레이어 인코딩 (CPU 전용, 3~5시간)
      </text>
      {/* 레이어 스택 */}
      {Array.from({ length: 6 }).map((_, i) => {
        const y = 26 + i * 16;
        const isLast = i === 5;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, ...sp }}>
            <rect x={30} y={y} width={180} height={13} rx={2}
              fill={isLast ? '#f59e0b20' : '#6366f110'} stroke={isLast ? '#f59e0b' : '#6366f1'} strokeWidth={0.6} />
            <text x={120} y={y + 10} textAnchor="middle" fontSize={10}
              fill={isLast ? '#f59e0b' : '#6366f1'}>
              {isLast ? '... Layer 11 (최종)' : `Layer ${i + 1}`}
            </text>
          </motion.g>
        );
      })}

      {/* 오른쪽: 의존성 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, ...sp }}>
        <rect x={240} y={30} width={200} height={70} rx={5}
          fill="#ef444408" stroke="#ef4444" strokeWidth={0.8} />
        <text x={340} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">순차 의존성</text>
        <text x={340} y={64} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          각 노드 = SHA256(이전 레이어 14개 부모)
        </text>
        <text x={340} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          d_drg=6 + d_exp=8 = 14 부모/노드
        </text>
        <text x={340} y={92} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight={600}>
          → GPU 병렬화 불가 (순차)
        </text>
      </motion.g>

      <text x={230} y={128} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        32GiB 섹터 → 11레이어 × 10억 노드 = 352GiB 인코딩 데이터
      </text>
    </g>
  );
}

/* ── Step 2: PC2 — Poseidon Merkle Tree (GPU) ── */
export function StepPC2() {
  return (
    <g>
      <text x={230} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#6366f1">
        PC2: Poseidon Merkle Tree 구축 (GPU, ~10분)
      </text>

      {/* TreeC (칼럼 해시) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, ...sp }}>
        <rect x={20} y={28} width={130} height={50} rx={5}
          fill="#6366f110" stroke="#6366f1" strokeWidth={1} />
        <text x={85} y={44} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">TreeC</text>
        <text x={85} y={58} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">칼럼 해시</text>
        <text x={85} y={70} textAnchor="middle" fontSize={9} fill="#6366f1">→ comm_c</text>
      </motion.g>

      <text x={165} y={56} fontSize={10} fill="var(--muted-foreground)">+</text>

      {/* TreeR (레플리카) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, ...sp }}>
        <rect x={180} y={28} width={130} height={50} rx={5}
          fill="#10b98110" stroke="#10b981" strokeWidth={1} />
        <text x={245} y={44} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">TreeR</text>
        <text x={245} y={58} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">레플리카 트리</text>
        <text x={245} y={70} textAnchor="middle" fontSize={9} fill="#10b981">→ comm_r_last</text>
      </motion.g>

      {/* 합산 → comm_r */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, ...sp }}>
        <text x={325} y={56} fontSize={10} fill="var(--muted-foreground)">→</text>
        <rect x={340} y={36} width={100} height={32} rx={5}
          fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1.5} />
        <text x={390} y={56} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">comm_r</text>
      </motion.g>

      {/* GPU 가속 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, ...sp }}>
        <rect x={60} y={92} width={320} height={26} rx={5}
          fill="#6366f108" stroke="#6366f1" strokeWidth={0.8} />
        <text x={220} y={109} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={600}>
          Poseidon₁₁ 해시 (ZK-friendly) — GPU 가속: neptune/pc2_cuda
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: WaitSeed — 인터랙티브 PoRep ── */
export function StepWaitSeed() {
  return (
    <g>
      <text x={230} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">
        WaitSeed: 150 에폭(~75분) 대기
      </text>

      {/* 타임라인 */}
      <line x1={40} y1={50} x2={420} y2={50} stroke="var(--muted-foreground)" strokeWidth={1} />
      <text x={40} y={44} fontSize={9} fill="var(--muted-foreground)">PC2 완료</text>
      <text x={420} y={44} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">C1 시작</text>

      {/* 대기 구간 */}
      <motion.rect x={80} y={42} width={300} height={16} rx={3}
        fill="#10b98115" stroke="#10b981" strokeWidth={1}
        initial={{ width: 0 }} animate={{ width: 300 }}
        transition={{ duration: 0.8 }} />
      <text x={230} y={54} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>
        150 에폭 대기 (~75분)
      </text>

      {/* 왜? */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, ...sp }}>
        <rect x={60} y={72} width={340} height={44} rx={5}
          fill="#ef444408" stroke="#ef4444" strokeWidth={0.8} />
        <text x={230} y={88} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">
          왜 기다려야 하는가?
        </text>
        <text x={230} y={104} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          체인에서 랜덤 시드를 추출 → 사전 계산 공격 방지
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: C1+C2 — Groth16 증명 ── */
export function StepCommit() {
  return (
    <g>
      <text x={230} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#6366f1">
        C1+C2: Groth16 zk-SNARK 증명 (GPU, 20~30분)
      </text>

      {/* C1: 경로 추출 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, ...sp }}>
        <rect x={20} y={30} width={140} height={40} rx={5}
          fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1} />
        <text x={90} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">C1: 경로 추출</text>
        <text x={90} y={62} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Merkle 포함 증명</text>
      </motion.g>

      <text x={172} y={54} fontSize={10} fill="var(--muted-foreground)">→</text>

      {/* C2: Groth16 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, ...sp }}>
        <rect x={185} y={30} width={140} height={40} rx={5}
          fill="#6366f110" stroke="#6366f1" strokeWidth={1} />
        <text x={255} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">C2: Groth16 증명</text>
        <text x={255} y={62} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">bellperson GPU</text>
      </motion.g>

      <text x={337} y={54} fontSize={10} fill="var(--muted-foreground)">→</text>

      {/* 출력 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, ...sp }}>
        <rect x={350} y={34} width={90} height={32} rx={5}
          fill="#10b98115" stroke="#10b981" strokeWidth={1.5} />
        <text x={395} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">192 bytes</text>
        <text x={395} y={60} textAnchor="middle" fontSize={9} fill="#10b981">증명 완료</text>
      </motion.g>

      {/* GPU 파이프라인 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, ...sp }}>
        <rect x={60} y={86} width={320} height={26} rx={5}
          fill="#6366f108" stroke="#6366f1" strokeWidth={0.8} />
        <text x={220} y={103} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={600}>
          MSM(80%) + NTT(15%) — GPU 가속이 핵심 (bellperson + sppark)
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 5: Finalize — 온체인 제출 ── */
export function StepFinalize() {
  return (
    <g>
      <text x={230} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">
        Finalize: 증명 온체인 제출 → 섹터 활성화
      </text>

      {['Groth16\n증명 (192B)', 'L1 TX\n제출', 'Verifier\n온체인 검증', '섹터\n활성화'].map((label, i) => {
        const x = 15 + i * 110;
        const colors = ['#6366f1', '#f59e0b', '#8b5cf6', '#10b981'];
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15, ...sp }}>
            <rect x={x} y={30} width={95} height={42} rx={5}
              fill={`${colors[i]}10`} stroke={colors[i]} strokeWidth={1} />
            {label.split('\n').map((l, li) => (
              <text key={li} x={x + 47} y={46 + li * 14} textAnchor="middle"
                fontSize={10} fontWeight={li === 0 ? 600 : 400} fill={colors[i]}>{l}</text>
            ))}
            {i < 3 && <text x={x + 102} y={54} fontSize={10} fill="var(--muted-foreground)">→</text>}
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={230} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Verifier: pairing 2회로 ~10ms 검증 (192바이트 증명만으로 32GiB 저장 확인)
        </text>
      </motion.g>
    </g>
  );
}
