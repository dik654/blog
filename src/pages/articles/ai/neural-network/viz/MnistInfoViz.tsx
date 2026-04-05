export default function MnistInfoViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 260" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">MNIST 데이터셋 구조</text>

        {/* 좌: 샘플 이미지 */}
        <rect x={20} y={48} width={190} height={190} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={115} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          28×28 grayscale
        </text>

        {/* pseudo digit */}
        <rect x={50} y={78} width={130} height={130} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
        {[
          [0, 1, 1, 1, 1, 0],
          [1, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 1],
          [1, 0, 0, 0, 0, 1],
          [0, 1, 1, 1, 1, 0],
        ].map((row, r) =>
          row.map((v, c) => (
            <rect key={`${r}-${c}`} x={55 + c * 20} y={83 + r * 20} width={19} height={19}
              fill={v ? '#3b82f6' : 'var(--muted)'} fillOpacity={v ? 0.7 : 0.15} />
          ))
        )}
        <text x={115} y={226} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          픽셀값: 0(흰) ~ 255(검)
        </text>

        {/* 중: 데이터 구성 */}
        <rect x={220} y={48} width={210} height={190} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.8} />
        <text x={325} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          데이터 구성
        </text>

        {/* Train bar */}
        <rect x={240} y={92} width={170} height={22} rx={3}
          fill="#10b981" fillOpacity={0.3} stroke="#10b981" strokeWidth={1.2} />
        <text x={325} y={107} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          Train: 60,000
        </text>

        {/* Test bar */}
        <rect x={240} y={122} width={30} height={22} rx={3}
          fill="#f59e0b" fillOpacity={0.3} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={325} y={137} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          Test: 10,000
        </text>

        <line x1={240} y1={156} x2={410} y2={156} stroke="var(--border)" strokeOpacity={0.5} strokeWidth={0.8} />

        <text x={325} y={176} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          클래스: 0 ~ 9 (10개)
        </text>

        {/* One-hot 예 */}
        <text x={240} y={196} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          라벨 = 2
        </text>
        <text x={240} y={212} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          one-hot:
        </text>
        <text x={240} y={228} fontSize={9} fontFamily="monospace" fill="#10b981">
          [0,0,1,0,0,0,0,0,0,0]
        </text>

        {/* 우: 역사 */}
        <rect x={440} y={48} width={185} height={190} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1.8} />
        <text x={532} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
          역사적 중요성
        </text>

        <text x={452} y={92} fontSize={10} fontWeight={700} fill="var(--foreground)">1998</text>
        <text x={452} y={106} fontSize={10} fill="var(--muted-foreground)">LeCun의 LeNet-5</text>
        <text x={452} y={120} fontSize={10} fill="var(--muted-foreground)">최초 CNN 해결</text>

        <text x={452} y={144} fontSize={10} fontWeight={700} fill="var(--foreground)">별칭</text>
        <text x={452} y={158} fontSize={10} fill="var(--muted-foreground)">"Hello World"</text>
        <text x={452} y={172} fontSize={10} fill="var(--muted-foreground)">of deep learning</text>

        <text x={452} y={196} fontSize={10} fontWeight={700} fill="var(--foreground)">현재</text>
        <text x={452} y={210} fontSize={10} fill="var(--muted-foreground)">99%+ 달성 (인간 수준)</text>
        <text x={452} y={224} fontSize={10} fill="var(--muted-foreground)">CIFAR/ImageNet으로 이동</text>
      </svg>
    </div>
  );
}
