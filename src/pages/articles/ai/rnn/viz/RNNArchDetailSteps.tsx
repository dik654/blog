import { motion } from 'framer-motion';
import Math from '@/components/ui/math';
import { CELL_C, HIDDEN_C, INPUT_C, OUTPUT_C, DEEP_C } from './RNNArchDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① Forward Pass — hₜ 계산 과정 (LaTeX 수식 + 의미 주석) */
export function Step0() {
  return (
    <g>
      {/* LaTeX 수식 — foreignObject로 KaTeX 삽입 */}
      <motion.g initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <foreignObject x={10} y={0} width={460} height={50}>
          <div style={{ display: 'flex', justifyContent: 'center', overflow: 'visible' }}>
            <Math display>{'h_t = \\tanh(\\underbrace{W_{hh} \\cdot h_{t-1}}_{\\text{이전 상태}} + \\underbrace{W_{xh} \\cdot x_t}_{\\text{현재 입력}} + b_h)'}</Math>
          </div>
        </foreignObject>
      </motion.g>

      {/* 각 항 설명 카드 — "왜" 포함 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={10} y={56} width={140} height={52} rx={6}
          fill={HIDDEN_C + '10'} stroke={HIDDEN_C} strokeWidth={1} />
        <foreignObject x={10} y={58} width={140} height={30}>
          <div style={{ overflow: 'visible', display: 'flex', justifyContent: 'center' }}><Math>{'W_{hh} \\cdot h_{t-1}'}</Math></div>
        </foreignObject>
        <text x={80} y={88} textAnchor="middle" fontSize={8} fontWeight={600} fill={HIDDEN_C}>
          기억 전달
        </text>
        <text x={80} y={98} textAnchor="middle" fontSize={7} fill="#999">
          W_hh: hidden→hidden 가중치
        </text>
        <text x={80} y={106} textAnchor="middle" fontSize={7} fill="#999">
          h_{'{t-1}'}: 이전 시점 은닉 상태
        </text>
      </motion.g>

      {/* + 기호 — 두 박스 사이 정중앙 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {/* 첫 박스 끝: 10+140=150, 둘째 박스 시작: 190 → 중앙: 170 */}
        <text x={170} y={78} textAnchor="middle" fontSize={16} fill="#999" fontWeight={700}>+</text>
        <text x={170} y={94} textAnchor="middle" fontSize={7} fill="#666">기억 + 입력</text>
        <text x={170} y={104} textAnchor="middle" fontSize={7} fill={CELL_C}>결합</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={195} y={56} width={125} height={52} rx={6}
          fill={INPUT_C + '10'} stroke={INPUT_C} strokeWidth={1} />
        <foreignObject x={195} y={58} width={125} height={30}>
          <div style={{ overflow: 'visible', display: 'flex', justifyContent: 'center' }}><Math>{'W_{xh} \\cdot x_t'}</Math></div>
        </foreignObject>
        <text x={257} y={88} textAnchor="middle" fontSize={8} fontWeight={600} fill={INPUT_C}>
          새 입력 인코딩
        </text>
        <text x={257} y={98} textAnchor="middle" fontSize={7} fill="#999">
          W_xh: input→hidden 가중치
        </text>
        <text x={257} y={106} textAnchor="middle" fontSize={7} fill="#999">
          x_t: 현재 시점 입력 벡터
        </text>
      </motion.g>

      {/* → tanh → hₜ (왜 tanh인지 설명) */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <text x={330} y={82} textAnchor="middle" fontSize={12} fill="#999">→</text>
        <rect x={345} y={62} width={56} height={48} rx={8}
          fill={CELL_C + '18'} stroke={CELL_C} strokeWidth={1.5} />
        <text x={373} y={78} textAnchor="middle" fontSize={10} fill={CELL_C} fontWeight={700}>tanh</text>
        <text x={373} y={92} textAnchor="middle" fontSize={7} fill="#999">왜?</text>
        <text x={373} y={104} textAnchor="middle" fontSize={7} fill={CELL_C}>[-1,1] 제한</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <text x={416} y={82} textAnchor="middle" fontSize={12} fill="#999">→</text>
        <foreignObject x={428} y={70} width={44} height={30}>
          <div style={{ overflow: 'visible' }}><Math>{'h_t'}</Math></div>
        </foreignObject>
        <text x={450} y={102} textAnchor="middle" fontSize={7} fill={CELL_C}>새 상태</text>
      </motion.g>

      {/* 왜 이런 구조인가 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={10} y={116} width={460} height={28} rx={5}
          fill={CELL_C + '06'} stroke={CELL_C + '30'} strokeWidth={0.6} />
        <text x={240} y={128} textAnchor="middle" fontSize={8} fill={CELL_C} fontWeight={600}>
          왜 이 구조? — 덧셈으로 기억+입력 결합 → tanh로 값 범위 제한 → 안정적 순환
        </text>
        <text x={240} y={140} textAnchor="middle" fontSize={7} fill="#999">
          tanh 없이 선형만 쓰면 값이 발산하거나 소멸. [-1,1]로 잡아줘야 수백 스텝 반복 가능
        </text>
      </motion.g>

      {/* 파라미터 수 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={10} y={150} width={460} height={44} rx={6}
          fill="#88888808" stroke="#88888830" strokeWidth={0.8} />
        <text x={24} y={166} fontSize={8} fill="#999">예: D=100, H=128</text>
        <foreignObject x={120} y={158} width={130} height={28}>
          <div style={{ overflow: 'visible' }}>
            <span style={{ fontSize: '10px', color: INPUT_C }}><Math>{'W_{xh}'}</Math>{' = 12,800'}</span>
          </div>
        </foreignObject>
        <foreignObject x={260} y={158} width={130} height={28}>
          <div style={{ overflow: 'visible' }}>
            <span style={{ fontSize: '10px', color: HIDDEN_C }}><Math>{'W_{hh}'}</Math>{' = 16,384'}</span>
          </div>
        </foreignObject>
        <text x={410} y={166} fontSize={8} fill="#666">bₕ = 128</text>
        <text x={240} y={190} textAnchor="middle" fontSize={8} fontWeight={600} fill={CELL_C}>
          합계: 29,312 파라미터
        </text>
      </motion.g>
    </g>
  );
}

/** ② 초기 상태와 시간/공간 복잡도 */
export function Step1() {
  return (
    <g>
      {/* h₀ initialization */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={20} y={8} width={130} height={58} rx={6}
          fill={HIDDEN_C + '10'} stroke={HIDDEN_C} strokeWidth={1} />
        <text x={85} y={28} textAnchor="middle" fontSize={10} fill={HIDDEN_C}
          fontStyle="italic">h₀ = zeros(H)</text>
        <text x={85} y={50} textAnchor="middle" fontSize={8} fill="#999">
          또는 nn.Parameter (학습)
        </text>
        <text x={85} y={62} textAnchor="middle" fontSize={7} fill={HIDDEN_C}>
          왜? — 정보 없는 초기 상태
        </text>
      </motion.g>

      {/* Time complexity — KaTeX */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={170} y={8} width={140} height={58} rx={6}
          fill={CELL_C + '10'} stroke={CELL_C} strokeWidth={1} />
        <text x={240} y={28} textAnchor="middle" fontSize={11} fill={CELL_C}
          fontStyle="italic">O(T·H²)</text>
        <text x={240} y={50} textAnchor="middle" fontSize={8} fill="#999">
          T=100, H=256
        </text>
        <text x={240} y={62} textAnchor="middle" fontSize={8} fill={CELL_C}>
          ~6.5M 연산/시퀀스
        </text>
      </motion.g>

      {/* Space complexity — KaTeX */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={330} y={8} width={130} height={58} rx={6}
          fill={INPUT_C + '10'} stroke={INPUT_C} strokeWidth={1} />
        <text x={395} y={28} textAnchor="middle" fontSize={11} fill={INPUT_C}
          fontStyle="italic">O(T·H)</text>
        <text x={395} y={50} textAnchor="middle" fontSize={8} fill="#999">
          T=1000, H=512
        </text>
        <text x={395} y={62} textAnchor="middle" fontSize={8} fill={INPUT_C}>
          ~2MB (FP32)
        </text>
      </motion.g>

      {/* Comparison bars */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={30} y={88} fontSize={8} fill="#999">메모리 비교:</text>
        {[
          { label: 'RNN', w: 60, color: CELL_C, formula: 'O(T·H)' },
          { label: 'Transformer', w: 160, color: '#ec4899', formula: 'O(T²·H)' },
        ].map((b, i) => (
          <g key={i}>
            <rect x={30} y={96 + i * 24} width={b.w} height={14} rx={4}
              fill={b.color + '25'} stroke={b.color} strokeWidth={0.8} />
            <text x={b.w + 46} y={107 + i * 24} fontSize={10} fill={b.color}>
              {b.label}: <tspan fontStyle="italic">{b.formula}</tspan>
            </text>
          </g>
        ))}
        <text x={30} y={152} fontSize={8} fill="#ef4444">
          왜 Transformer 등장? — 순차 처리 → GPU 병렬화 불가
        </text>
      </motion.g>
    </g>
  );
}

/** ③ Deep RNN — 레이어 쌓기 */
export function Step2() {
  const layers = [
    { label: 'Layer 1', y: 95, color: CELL_C, sub: 'xₜ 입력' },
    { label: 'Layer 2', y: 55, color: DEEP_C, sub: 'h^(1) 입력' },
    { label: 'Layer 3', y: 15, color: OUTPUT_C, sub: 'h^(2) 입력' },
  ];
  return (
    <g>
      <defs>
        <marker id="deepArr" markerWidth={5} markerHeight={4} refX={5} refY={2} orient="auto">
          <path d="M0,0 L5,2 L0,4" fill="#888" />
        </marker>
      </defs>
      {/* 3 timesteps x 3 layers */}
      {[0, 1, 2].map(t => (
        <g key={t}>
          {layers.map((l, li) => (
            <motion.g key={li} initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: t * 0.1 + li * 0.08 }}>
              <rect x={80 + t * 140} y={l.y} width={80} height={28} rx={5}
                fill={l.color + '15'} stroke={l.color} strokeWidth={1.2} />
              <text x={120 + t * 140} y={l.y + 17} textAnchor="middle"
                fontSize={8} fill={l.color} fontWeight={600}>
                {l.label} (t={t + 1})
              </text>
              {/* Vertical arrow between layers */}
              {li > 0 && (
                <line x1={120 + t * 140} y1={l.y + 28}
                  x2={120 + t * 140} y2={layers[li - 1].y}
                  stroke="#88888860" strokeWidth={1} markerEnd="url(#deepArr)" />
              )}
              {/* Horizontal arrow between timesteps */}
              {t < 2 && (
                <line x1={160 + t * 140} y1={l.y + 14}
                  x2={220 + t * 140} y2={l.y + 14}
                  stroke={l.color + '60'} strokeWidth={1} markerEnd="url(#deepArr)" />
              )}
            </motion.g>
          ))}
          {/* Input label */}
          <text x={120 + t * 140} y={135} textAnchor="middle" fontSize={8} fill={INPUT_C}>
            x_{t + 1}
          </text>
          <line x1={120 + t * 140} y1={128} x2={120 + t * 140} y2={123}
            stroke={INPUT_C} strokeWidth={0.8} />
        </g>
      ))}
      {/* Deep RNN formulas — 본문 텍스트로 표현 (foreignObject 잘림 방지) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={10} y={142} width={460} height={52} rx={6}
          fill="#88888808" stroke="#88888820" strokeWidth={0.8} />
        <text x={20} y={158} fontSize={9} fontFamily="monospace" fill={CELL_C}>
          Layer 1: h⁽¹⁾ = tanh(W⁽¹⁾·h⁽¹⁾ₜ₋₁ + U⁽¹⁾·xₜ)
        </text>
        <text x={20} y={172} fontSize={9} fontFamily="monospace" fill={DEEP_C}>
          Layer 2: h⁽²⁾ = tanh(W⁽²⁾·h⁽²⁾ₜ₋₁ + U⁽²⁾·h⁽¹⁾ₜ)  ← 아래 층 출력이 입력
        </text>
        <text x={20} y={188} fontSize={7} fill="#999">
          층간 dropout 적용 | 2-3층 일반적 | H=256 → ~196K params | 왜? 음소→단어→구문 추상화
        </text>
      </motion.g>
    </g>
  );
}

/** ④ Bidirectional RNN */
export function Step3() {
  const words = ['Apple', '이', '새', '제품을', '출시'];
  return (
    <g>
      <defs>
        <marker id="biArrF" markerWidth={5} markerHeight={4} refX={5} refY={2} orient="auto">
          <path d="M0,0 L5,2 L0,4" fill={CELL_C} />
        </marker>
        <marker id="biArrB" markerWidth={5} markerHeight={4} refX={5} refY={2} orient="auto">
          <path d="M0,0 L5,2 L0,4" fill={DEEP_C} />
        </marker>
      </defs>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill="#666">
        Bidirectional RNN
      </text>
      {words.map((w, i) => {
        const cx = 50 + i * 85;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            {/* Forward cell */}
            <rect x={cx - 25} y={30} width={50} height={22} rx={4}
              fill={CELL_C + '15'} stroke={CELL_C} strokeWidth={1} />
            <text x={cx} y={44} textAnchor="middle" fontSize={7.5} fill={CELL_C}>
              →h{i + 1}
            </text>
            {/* Backward cell */}
            <rect x={cx - 25} y={60} width={50} height={22} rx={4}
              fill={DEEP_C + '15'} stroke={DEEP_C} strokeWidth={1} />
            <text x={cx} y={74} textAnchor="middle" fontSize={7.5} fill={DEEP_C}>
              ←h&apos;{i + 1}
            </text>
            {/* Input word */}
            <text x={cx} y={100} textAnchor="middle" fontSize={9} fill={INPUT_C}
              fontWeight={i === 0 ? 700 : 400}>{w}</text>
            {/* Forward arrow */}
            {i < 4 && (
              <line x1={cx + 25} y1={41} x2={cx + 60} y2={41}
                stroke={CELL_C} strokeWidth={1} markerEnd="url(#biArrF)" />
            )}
            {/* Backward arrow */}
            {i > 0 && (
              <line x1={cx - 25} y1={71} x2={cx - 60} y2={71}
                stroke={DEEP_C} strokeWidth={1} markerEnd="url(#biArrB)" />
            )}
          </motion.g>
        );
      })}
      {/* Concat output — KaTeX formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={5} y={110} width={140} height={26} rx={4}
          fill={HIDDEN_C + '12'} stroke={HIDDEN_C} strokeWidth={0.8} />
        <text x={75} y={127} textAnchor="middle" fontSize={9} fill={HIDDEN_C}
          fontStyle="italic">[→hₜ; ←h'ₜ] ∈ R²ᴴ</text>
        <rect x={155} y={110} width={90} height={26} rx={4}
          fill={INPUT_C + '12'} stroke={INPUT_C} strokeWidth={0.8} />
        <text x={200} y={127} textAnchor="middle" fontSize={8} fill={INPUT_C}>
          "출시" → 회사!
        </text>
        <rect x={260} y={110} width={200} height={26} rx={4}
          fill="#88888808" stroke="#88888830" strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={360} y={120} textAnchor="middle" fontSize={7.5} fill="#999">
          제약: 전체 시퀀스 필요 → 실시간 생성 불가
        </text>
        <text x={360} y={132} textAnchor="middle" fontSize={7} fill={DEEP_C}>
          왜? — 미래 문맥("출시")이 과거("Apple") 의미 결정
        </text>
      </motion.g>
    </g>
  );
}
