import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, MSE_C, CE_C, GRAD_C, msePts, cePts, curvePath } from './CEvsMSEVizData';

export default function CEvsMSEViz() {
  const ox = 70, oy = 20, w = 320, h = 120;

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* axes */}
          <line x1={ox} y1={oy} x2={ox} y2={oy + h}
            stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
          <line x1={ox} y1={oy + h} x2={ox + w} y2={oy + h}
            stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
          <text x={ox + w / 2} y={oy + h + 16} textAnchor="middle"
            fontSize={9} fill="currentColor" fillOpacity={0.4}>예측 ŷ (0→1)</text>
          <text x={ox - 8} y={oy + h / 2} textAnchor="middle"
            fontSize={9} fill="currentColor" fillOpacity={0.4}
            transform={`rotate(-90,${ox - 8},${oy + h / 2})`}>Loss</text>
          <text x={ox} y={oy + h + 10} fontSize={9} fill="currentColor" fillOpacity={0.3}>0</text>
          <text x={ox + w - 4} y={oy + h + 10} fontSize={9} fill="currentColor" fillOpacity={0.3}>1</text>

          {/* MSE curve */}
          <motion.path d={curvePath(msePts, ox, oy, w, h)}
            fill="none" stroke={MSE_C} strokeWidth={2}
            strokeOpacity={step === 1 ? 0.25 : 1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }} key={`mse-${step}`} />
          {step !== 1 && (
            <text x={ox + 30} y={oy + 12} fontSize={9} fontWeight={600} fill={MSE_C}>MSE</text>
          )}

          {/* CE curve */}
          {step >= 1 && (
            <>
              <motion.path d={curvePath(cePts, ox, oy, w, h)}
                fill="none" stroke={CE_C} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }} key={`ce-${step}`} />
              <text x={ox + 8} y={oy + 30} fontSize={9} fontWeight={600} fill={CE_C}>CE</text>
            </>
          )}

          {/* gradient comparison */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={ox + 0.05 * w} y1={oy} x2={ox + 0.05 * w} y2={oy + h}
                stroke={GRAD_C} strokeWidth={1} strokeOpacity={0.3} strokeDasharray="3 2" />
              <text x={ox + 0.05 * w + 3} y={oy + 8} fontSize={9} fill={GRAD_C}>ŷ≈0.05</text>
              <line x1={420} y1={55} x2={420} y2={48}
                stroke={MSE_C} strokeWidth={2} markerEnd="url(#arrowMse)" />
              <text x={432} y={54} fontSize={9} fontWeight={600} fill={MSE_C}>작음</text>
              <line x1={420} y1={80} x2={420} y2={60}
                stroke={CE_C} strokeWidth={2} markerEnd="url(#arrowCe)" />
              <text x={432} y={74} fontSize={9} fontWeight={600} fill={CE_C}>큼!</text>
              <text x={420} y={100} fontSize={9} fill={GRAD_C} fontWeight={600}>기울기</text>
            </motion.g>
          )}

          <defs>
            <marker id="arrowMse" markerWidth={6} markerHeight={4} refX={3} refY={2} orient="auto">
              <path d="M0,0 L6,2 L0,4 Z" fill={MSE_C} />
            </marker>
            <marker id="arrowCe" markerWidth={6} markerHeight={4} refX={3} refY={2} orient="auto">
              <path d="M0,0 L6,2 L0,4 Z" fill={CE_C} />
            </marker>
          </defs>

          <text x={130} y={168} fontSize={9} fontWeight={600} fill={MSE_C}>MSE: (1-ŷ)²</text>
          <text x={280} y={168} fontSize={9} fontWeight={600} fill={CE_C}>CE: -log(ŷ)</text>
        </svg>
      )}
    </StepViz>
  );
}
