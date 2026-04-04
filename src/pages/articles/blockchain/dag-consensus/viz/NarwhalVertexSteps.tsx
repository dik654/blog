import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function VertexStep() {
  const fields = [
    { name: 'author', desc: '검증자 ID', c: CV },
    { name: 'round', desc: '라운드 번호', c: CV },
    { name: 'payload', desc: 'tx 배치 (batch)', c: CE },
    { name: 'parents', desc: '이전 라운드 인증서들', c: CA },
  ];
  return (
    <svg viewBox="0 0 440 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={8} width={190} height={94} rx={5} fill={`${CV}06`} stroke={CV} strokeWidth={1} />
        <text x={110} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={CV}>Vertex</text>
        <line x1={25} y1={30} x2={195} y2={30} stroke={CV} strokeWidth={0.3} opacity={0.3} />
      </motion.g>
      {fields.map((f, i) => (
        <motion.g key={i} {...slide(0.3 + i * 0.2)}>
          <rect x={25} y={34 + i * 16} width={170} height={14} rx={2} fill={`${f.c}08`} stroke={f.c} strokeWidth={0.4} />
          <text x={35} y={45 + i * 16} fontSize={10} fontWeight={500} fill={f.c}>{f.name}</text>
          <text x={100} y={45 + i * 16} fontSize={10} fill="var(--muted-foreground)">{f.desc}</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.0)}>
        <rect x={230} y={20} width={195} height={68} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={327} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={CA}>parents: 여러 부모 참조</text>
        <text x={327} y={56} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">이더리움 parentHash는 1개</text>
        <text x={327} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Narwhal은 이전 라운드 전체 참조</text>
        <text x={327} y={84} textAnchor="middle" fontSize={10} fill={CE}>→ DAG 구조 형성</text>
      </motion.g>
    </svg>
  );
}

export function CertificateStep() {
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={10} width={100} height={40} rx={4} fill={`${CV}08`} stroke={CV} strokeWidth={0.8} />
        <text x={65} y={34} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>Vertex</text>
      </motion.g>
      <motion.g {...fade(0.5)}>
        <line x1={115} y1={30} x2={155} y2={30} stroke={CE} strokeWidth={0.8} markerEnd="url(#nvA)" />
        <rect x={125} y={18} width={20} height={14} rx={2} fill="var(--background)" stroke={CE} strokeWidth={0.4} />
        <text x={135} y={29} textAnchor="middle" fontSize={10} fill={CE}>+</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        {[0, 1, 2].map(i => (
          <rect key={i} x={160 + i * 28} y={16} width={24} height={28} rx={3}
            fill={`${CE}10`} stroke={CE} strokeWidth={0.5} />
        ))}
        <text x={196} y={50} textAnchor="middle" fontSize={10} fill={CE}>2f+1 서명</text>
      </motion.g>
      <motion.g {...fade(0.9)}>
        <line x1={246} y1={30} x2={276} y2={30} stroke={CA} strokeWidth={0.8} markerEnd="url(#nvB)" />
      </motion.g>
      <motion.g {...slide(1.0)}>
        <rect x={280} y={10} width={140} height={40} rx={4} fill={`${CA}12`} stroke={CA} strokeWidth={1.2} />
        <text x={350} y={34} textAnchor="middle" fontSize={10} fontWeight={600} fill={CA}>Certificate</text>
      </motion.g>
      <motion.g {...fade(1.3)}>
        <rect x={15} y={62} width={405} height={28} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.5} />
        <text x={217} y={80} textAnchor="middle" fontSize={10} fill={CE}>
          인증서 존재 = 2f+1 노드가 데이터를 보유 — 서명으로 직접 증명 (DAS 불필요)
        </text>
      </motion.g>
      <defs>
        <marker id="nvA" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CE} /></marker>
        <marker id="nvB" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CA} /></marker>
      </defs>
    </svg>
  );
}

export function RoundFlowStep() {
  const steps = ['Vertex 브로드캐스트', '수신 확인 서명', 'Certificate 생성', 'parent로 참조'];
  return (
    <svg viewBox="0 0 440 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {steps.map((s, i) => (
        <motion.g key={i} {...slide(0.2 + i * 0.25)}>
          <rect x={10 + i * 108} y={14} width={100} height={30} rx={4}
            fill={`${[CV, CE, CA, CV][i]}10`} stroke={[CV, CE, CA, CV][i]} strokeWidth={0.8} />
          <text x={60 + i * 108} y={33} textAnchor="middle" fontSize={10} fontWeight={500}
            fill={[CV, CE, CA, CV][i]}>{s}</text>
          {i < 3 && <text x={110 + i * 108} y={33} fontSize={10} fill="var(--muted-foreground)">→</text>}
        </motion.g>
      ))}
      <motion.g {...fade(1.2)}>
        <text x={220} y={64} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          매 라운드 반복 — 모든 검증자가 동시에 Vertex 제안
        </text>
      </motion.g>
    </svg>
  );
}
