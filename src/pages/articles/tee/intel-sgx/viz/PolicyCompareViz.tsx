import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'MRENCLAVE 정책: 동일 바이너리만 복호화', body: 'SHA-256(코드+데이터) 해시가 키 파생에 포함. 코드 1비트라도 변경 → 다른 키 → 복호화 불가. 업그레이드 시 마이그레이션 필요.' },
  { label: 'MRSIGNER 정책: 동일 서명자면 버전 업 가능', body: 'RSA 공개키 해시(서명자)가 키 파생에 포함. 같은 서명자가 서명한 새 버전도 복호화 가능. isv_svn으로 롤백 방어.' },
  { label: '정책 비교: 보안 vs 유연성 트레이드오프', body: 'MRENCLAVE = 최대 보안(코드 변경 불가), MRSIGNER = 유연성(업그레이드 허용). 실무에서는 MRSIGNER + isv_svn 조합이 일반적.' },
];

const R = 6;

export default function PolicyCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* MRENCLAVE column */}
          <motion.g animate={{ opacity: step === 0 || step === 2 ? 1 : 0.3 }}>
            <rect x={20} y={10} width={240} height={180} rx={R} fill="#6366f108" stroke="#6366f130" strokeWidth={1} />
            <text x={140} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">MRENCLAVE</text>
            <text x={140} y={46} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">SGX_KEYPOLICY_MRENCLAVE</text>

            <rect x={40} y={60} width={80} height={32} rx={4} fill="#6366f115" stroke="#6366f140" strokeWidth={0.8} />
            <text x={80} y={80} textAnchor="middle" fontSize={10} fill="var(--foreground)">Binary v1</text>

            <rect x={160} y={60} width={80} height={32} rx={4} fill="#6366f115" stroke="#6366f140" strokeWidth={0.8} />
            <text x={200} y={80} textAnchor="middle" fontSize={10} fill="var(--foreground)">Binary v2</text>

            <text x={80} y={110} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>Key A</text>
            <text x={200} y={110} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>Key B</text>
            <text x={140} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">해시 다름 → 키 다름</text>

            <line x1={80} y1={145} x2={200} y2={145} stroke="var(--border)" strokeWidth={0.5} />
            <text x={140} y={160} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">보안 ★★★</text>
            <text x={140} y={176} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">유연성 ★☆☆</text>
          </motion.g>

          {/* MRSIGNER column */}
          <motion.g animate={{ opacity: step === 1 || step === 2 ? 1 : 0.3 }}>
            <rect x={280} y={10} width={240} height={180} rx={R} fill="#10b98108" stroke="#10b98130" strokeWidth={1} />
            <text x={400} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">MRSIGNER</text>
            <text x={400} y={46} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">SGX_KEYPOLICY_MRSIGNER</text>

            <rect x={300} y={60} width={80} height={32} rx={4} fill="#10b98115" stroke="#10b98140" strokeWidth={0.8} />
            <text x={340} y={80} textAnchor="middle" fontSize={10} fill="var(--foreground)">Binary v1</text>

            <rect x={420} y={60} width={80} height={32} rx={4} fill="#10b98115" stroke="#10b98140" strokeWidth={0.8} />
            <text x={460} y={80} textAnchor="middle" fontSize={10} fill="var(--foreground)">Binary v2</text>

            <text x={340} y={110} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>Key A</text>
            <text x={460} y={110} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>Key A</text>
            <text x={400} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">서명자 동일 → 키 동일</text>

            <line x1={340} y1={145} x2={460} y2={145} stroke="var(--border)" strokeWidth={0.5} />
            <text x={400} y={160} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">보안 ★★☆</text>
            <text x={400} y={176} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">유연성 ★★★</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
