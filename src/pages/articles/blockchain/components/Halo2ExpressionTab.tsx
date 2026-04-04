import { motion } from 'framer-motion';
import { EXPRESSION_TYPES } from './Halo2CircuitVizData';

export default function Halo2ExpressionTab() {
  return (
    <div>
      <p className="text-xs text-foreground/50 mb-3">
        Expression&lt;F&gt;는 게이트 제약을 표현하는 재귀 열거형입니다.
        <code className="mx-1">meta.create_gate()</code>에서 제약 다항식을 조합합니다.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {EXPRESSION_TYPES.map((e, i) => (
          <motion.div
            key={e.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-lg border p-2.5 text-xs"
            style={{
              borderColor: e.color + '30',
              background: e.color + '08',
            }}
          >
            <p className="font-mono font-medium mb-1" style={{ color: e.color }}>{e.name}</p>
            <p className="text-foreground/55 leading-relaxed">{e.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 p-3 rounded-lg border border-border text-xs text-foreground/50 leading-relaxed">
        <strong className="text-foreground/70">게이트 예시:</strong> 곱셈 게이트 a × b - c = 0 →
        <code className="mx-1">Product(Advice(a), Advice(b)) - Advice(c)</code>를 벡터로 반환.
        Selector로 해당 행에서만 활성화.
      </div>
    </div>
  );
}
