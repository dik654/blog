import { motion } from 'framer-motion';

export default function DecoderImplSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">Decoder 아키텍처</text>
          {/* z 입력 */}
          <rect x={30} y={55} width={60} height={40} rx={14} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1.2} />
          <text x={60} y={73} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">z</text>
          <text x={60} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">20dim</text>
          {/* fc1 */}
          <line x1={90} y1={75} x2={130} y2={75} stroke="#ec4899" strokeWidth={1} />
          <rect x={130} y={52} width={90} height={46} rx={6} fill="#ec489910" stroke="#ec4899" strokeWidth={1} />
          <rect x={130} y={52} width={90} height={5} rx={2.5} fill="#ec4899" opacity={0.85} />
          <text x={175} y={74} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ec4899">fc1 + ReLU</text>
          <text x={175} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">400dim</text>
          {/* fc2 */}
          <line x1={220} y1={75} x2={260} y2={75} stroke="#ec4899" strokeWidth={1} />
          <rect x={260} y={52} width={100} height={46} rx={6} fill="#ec489910" stroke="#ec4899" strokeWidth={1} />
          <rect x={260} y={52} width={100} height={5} rx={2.5} fill="#ec4899" opacity={0.85} />
          <text x={310} y={74} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ec4899">fc2 + Sigmoid</text>
          <text x={310} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">784dim</text>
          {/* 출력 이미지 */}
          <line x1={360} y1={75} x2={390} y2={75} stroke="#3b82f6" strokeWidth={1} />
          <rect x={390} y={52} width={60} height={46} rx={6} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1} />
          <text x={420} y={73} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">x&#770;</text>
          <text x={420} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">28x28</text>
          <text x={240} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            sigmoid → 모든 값 [0, 1] 범위 (픽셀값)
          </text>
          <text x={240} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">MNIST: 20 → 400 → 784 → reshape(28,28)</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">출력 분포에 따른 손실 함수</text>
          {/* Bernoulli */}
          <rect x={20} y={30} width={140} height={60} rx={8} fill="#3b82f610" stroke="#3b82f6" strokeWidth={1} />
          <rect x={20} y={30} width={3.5} height={60} rx={2} fill="#3b82f6" />
          <text x={95} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">Bernoulli</text>
          <text x={95} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">활성화: sigmoid</text>
          <text x={95} y={74} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">손실: BCE</text>
          <text x={95} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">이진/이진화 이미지</text>
          {/* Gaussian */}
          <rect x={170} y={30} width={140} height={60} rx={8} fill="#10b98110" stroke="#10b981" strokeWidth={1} />
          <rect x={170} y={30} width={3.5} height={60} rx={2} fill="#10b981" />
          <text x={245} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">Gaussian</text>
          <text x={245} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">활성화: linear/sigmoid</text>
          <text x={245} y={74} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">손실: MSE</text>
          <text x={245} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">연속 픽셀 이미지</text>
          {/* Categorical */}
          <rect x={320} y={30} width={140} height={60} rx={8} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
          <rect x={320} y={30} width={3.5} height={60} rx={2} fill="#f59e0b" />
          <text x={395} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">Categorical</text>
          <text x={395} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">활성화: softmax</text>
          <text x={395} y={74} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">손실: CE</text>
          <text x={395} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">K=256 (8-bit)</text>
          {/* 핵심 */}
          <text x={240} y={115} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
            출력 분포 선택이 손실 함수를 결정
          </text>
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            MNIST(이진) → BCE | CelebA(연속) → MSE | PixelVAE → CE
          </text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">ConvTranspose Decoder</text>
          {/* 단계별 해상도 증가 */}
          {[
            { x: 20, w: 30, h: 30, label: 'latent', sub: '20', color: '#8b5cf6' },
            { x: 80, w: 24, h: 24, label: '4x4', sub: '256ch', color: '#ec4899' },
            { x: 150, w: 36, h: 36, label: '8x8', sub: '128ch', color: '#ec4899' },
            { x: 230, w: 48, h: 48, label: '16x16', sub: '64ch', color: '#ec4899' },
            { x: 320, w: 60, h: 60, label: '32x32', sub: '3ch', color: '#3b82f6' },
          ].map((d, i) => {
            const cy = 80;
            return (
              <g key={i}>
                <rect x={d.x} y={cy - d.h / 2} width={d.w} height={d.h} rx={4}
                  fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
                <text x={d.x + d.w / 2} y={cy} textAnchor="middle" fontSize={8} fontWeight={600} fill={d.color}>{d.label}</text>
                <text x={d.x + d.w / 2} y={cy + 10} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.sub}</text>
                {i < 4 && (
                  <>
                    <line x1={d.x + d.w + 4} y1={cy} x2={[80, 150, 230, 320][i] - 4} y2={cy}
                      stroke={d.color} strokeWidth={0.8} />
                    {i > 0 && (
                      <text x={(d.x + d.w + [80, 150, 230, 320][i]) / 2} y={cy - 8}
                        textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                        {['reshape', 'stride=2', 'stride=2', 'stride=2'][i]}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}
          {/* Sigmoid */}
          <rect x={390} y={60} width={70} height={40} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={1} />
          <text x={425} y={80} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Sigmoid</text>
          <text x={425} y={94} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">[0,1]</text>
          <line x1={380} y1={80} x2={390} y2={80} stroke="#10b981" strokeWidth={0.8} />
          <text x={240} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            stride=2 ConvTranspose → 해상도 2배 확장
          </text>
        </motion.g>
      )}
    </g>
  );
}
