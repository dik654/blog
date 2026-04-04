import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './COWDetailVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

function Step0() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: dst.sharedFieldRefs = src.sharedFieldRefs
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: for _, ref := range src.sharedFieldRefs {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     ref.AddRef()  // refCount++ (복사 없음)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // Copy() — 참조 카운트만 증가, 실제 슬라이스 복사 없음
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="refCount=2" color={C.ok} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: if b.sharedFieldRefs[fieldIdx].refs &gt; 1 {'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     b.validators = append([]Validator{'{}'}{'{}'}, b.validators...)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     b.sharedFieldRefs[fieldIdx] = newRef()
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // Setter → refCount&gt;1이면 해당 필드만 deep copy
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="deep copy" color={C.write} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: forkA := baseState.Copy()  // ref 공유
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: forkB := baseState.Copy()  // ref 공유
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: forkA.SetSlot(4801)  // validators만 deep copy
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 10개 분기에도 메모리 ~1.x배 — 변경 필드만 독립
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="메모리 ~1.x배" color={C.ok} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function COWDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 420 100" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
