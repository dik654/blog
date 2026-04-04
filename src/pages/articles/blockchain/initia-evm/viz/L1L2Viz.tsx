import StepViz from '../../../../../components/ui/step-viz';
import { STEPS, L2_BOXES } from './L1L2VizData';
import { L1Box, BridgeLabel, L2Box, LiquidityLayer } from './L1L2VizParts';

export default function L1L2Viz() {
  return (
    <StepViz steps={STEPS}>
      {(step: number) => (
        <svg viewBox="0 0 400 210" className="w-full max-w-2xl" role="img">
          <L1Box highlight={step === 0} />
          <BridgeLabel show={step === 2} />
          {L2_BOXES.map(b => (
            <L2Box key={b.label} x={b.x} label={b.label} vm={b.vm} color={b.color}
              highlight={step === 1} delay={b.delay} />
          ))}
          <LiquidityLayer show={step === 3} />
        </svg>
      )}
    </StepViz>
  );
}
