import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CASES = [
  {
    id: 'stock', label: '주가 예측', color: '#6366f1',
    desc: '과거 N일 종가/거래량을 입력으로 다음 시점 가격 예측 — 윈도우 크기와 피처 엔지니어링(이동 평균, RSI 등)이 핵심',
  },
  {
    id: 'anomaly', label: '이상 탐지', color: '#ef4444',
    desc: '정상 패턴을 학습한 LSTM의 예측 오차가 임계값 초과 시 이상 판별 — 서버 모니터링, IoT 센서에 활용',
  },
  {
    id: 'seq2seq', label: 'Seq2Seq', color: '#10b981',
    desc: 'Encoder LSTM — 입력 시퀀스 압축, Decoder LSTM — 출력 시퀀스 생성. 다변량 다단계(multi-step) 예측에 활용',
  },
  {
    id: 'energy', label: '에너지 수요 예측', color: '#f59e0b',
    desc: '온도, 시간, 요일 등 외부 변수를 함께 입력하는 다변량 LSTM으로 전력 수요 예측',
  },
];

export default function UseCases() {
  const [active, setActive] = useState<string | null>(null);
  const sel = CASES.find((c) => c.id === active);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <p className="text-xs font-mono text-foreground/50">LSTM 시계열 응용 분야</p>
      <div className="grid grid-cols-2 gap-2">
        {CASES.map((c) => (
          <motion.button key={c.id} whileHover={{ scale: 1.02 }}
            onClick={() => setActive(active === c.id ? null : c.id)}
            className="rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer"
            style={{
              borderColor: active === c.id ? c.color : c.color + '30',
              background: active === c.id ? c.color + '14' : c.color + '06',
            }}>
            <span className="font-semibold text-xs" style={{ color: c.color }}>{c.label}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="rounded-lg border p-3 text-sm text-foreground/80"
            style={{ borderColor: sel.color + '30', background: sel.color + '08' }}>
            {sel.desc}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
