import { motion } from 'framer-motion';

export default function EncoderImplSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Encoder 아키텍처</text>
          {/* 입력 */}
          <rect x={20} y={50} width={60} height={60} rx={6} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1} />
          <text x={50} y={75} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">입력 x</text>
          <text x={50} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">784dim</text>
          {/* fc1 */}
          <line x1={80} y1={80} x2={120} y2={80} stroke="#6366f1" strokeWidth={1} />
          <rect x={120} y={55} width={80} height={50} rx={6} fill="#6366f110" stroke="#6366f1" strokeWidth={1} />
          <rect x={120} y={55} width={80} height={5} rx={2.5} fill="#6366f1" opacity={0.85} />
          <text x={160} y={78} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">fc1 + ReLU</text>
          <text x={160} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">400dim</text>
          {/* 분기 → μ */}
          <line x1={200} y1={72} x2={260} y2={52} stroke="#10b981" strokeWidth={1} />
          <rect x={260} y={35} width={80} height={34} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={1} />
          <text x={300} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">fc_mu</text>
          <text x={300} y={64} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">20dim</text>
          <line x1={340} y1={52} x2={380} y2={52} stroke="#10b981" strokeWidth={1} />
          <rect x={380} y={38} width={70} height={28} rx={14} fill="#10b98118" stroke="#10b981" strokeWidth={1.2} />
          <text x={415} y={56} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">μ</text>
          {/* 분기 → logvar */}
          <line x1={200} y1={88} x2={260} y2={108} stroke="#f59e0b" strokeWidth={1} />
          <rect x={260} y={91} width={80} height={34} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
          <text x={300} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">fc_logvar</text>
          <text x={300} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">20dim</text>
          <line x1={340} y1={108} x2={380} y2={108} stroke="#f59e0b" strokeWidth={1} />
          <rect x={380} y={94} width={70} height={28} rx={14} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1.2} />
          <text x={415} y={112} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">log σ²</text>
          {/* 크기 표시 */}
          <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">MNIST: 784 → 400 → 20 (μ, log σ²)</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">왜 log σ²를 출력하는가?</text>
          {/* 이유 1 */}
          <rect x={20} y={30} width={140} height={48} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <rect x={20} y={30} width={3.5} height={48} rx={2} fill="#10b981" />
          <text x={95} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">양수 보장</text>
          <text x={95} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">σ² = exp(log σ²) {'>'} 0</text>
          <text x={95} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">어떤 실수든 양수 변환</text>
          {/* 이유 2 */}
          <rect x={170} y={30} width={140} height={48} rx={6} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <rect x={170} y={30} width={3.5} height={48} rx={2} fill="#3b82f6" />
          <text x={245} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">수치 안정성</text>
          <text x={245} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">log 공간 = 선형 영역</text>
          <text x={245} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">기울기 포화 없음</text>
          {/* 이유 3 */}
          <rect x={320} y={30} width={140} height={48} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <rect x={320} y={30} width={3.5} height={48} rx={2} fill="#f59e0b" />
          <text x={395} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">KL 효율</text>
          <text x={395} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">KL 공식에 직접 등장</text>
          <text x={395} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">추가 변환 불필요</text>
          {/* 비교 */}
          <rect x={80} y={96} width={160} height={28} rx={4} fill="#ef444408" stroke="#ef4444" strokeWidth={0.6} strokeDasharray="4 3" />
          <text x={160} y={114} textAnchor="middle" fontSize={9} fill="#ef4444">σ² 직접 출력 → sigmoid 필요</text>
          <rect x={260} y={96} width={160} height={28} rx={4} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={340} y={114} textAnchor="middle" fontSize={9} fill="#10b981">log σ² 출력 → 제약 없음</text>
          <text x={240} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">log 공간이 안정적이고 효율적</text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">실무 Encoder 변형</text>
          {/* MLP */}
          <rect x={20} y={30} width={130} height={50} rx={8} fill="#6366f112" stroke="#6366f1" strokeWidth={1} />
          <rect x={20} y={30} width={130} height={5} rx={2.5} fill="#6366f1" opacity={0.85} />
          <text x={85} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">MLP Encoder</text>
          <text x={85} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">4~6층, Dropout</text>
          <text x={85} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">MNIST, 테이블</text>
          {/* Conv */}
          <rect x={170} y={30} width={130} height={50} rx={8} fill="#10b98112" stroke="#10b981" strokeWidth={1} />
          <rect x={170} y={30} width={130} height={5} rx={2.5} fill="#10b981" opacity={0.85} />
          <text x={235} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">Conv Encoder</text>
          <text x={235} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">CNN 특징 추출</text>
          <text x={235} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이미지, 영상</text>
          {/* ResNet */}
          <rect x={320} y={30} width={140} height={50} rx={8} fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
          <rect x={320} y={30} width={140} height={5} rx={2.5} fill="#f59e0b" opacity={0.85} />
          <text x={390} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">ResNet Encoder</text>
          <text x={390} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Skip connection</text>
          <text x={390} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">고해상도 이미지</text>
          {/* 공통 출력 */}
          <line x1={85} y1={80} x2={85} y2={100} stroke="#6366f1" strokeWidth={0.6} />
          <line x1={235} y1={80} x2={235} y2={100} stroke="#10b981" strokeWidth={0.6} />
          <line x1={390} y1={80} x2={390} y2={100} stroke="#f59e0b" strokeWidth={0.6} />
          <line x1={85} y1={100} x2={390} y2={100} stroke="var(--border)" strokeWidth={0.5} />
          <line x1={240} y1={100} x2={240} y2={115} stroke="var(--foreground)" strokeWidth={0.8} />
          <rect x={170} y={115} width={140} height={28} rx={6} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1} />
          <text x={240} y={133} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">출력: (μ, log σ²)</text>
        </motion.g>
      )}
    </g>
  );
}
