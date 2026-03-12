import R1CS from './constraint-systems/R1CS';
import R1CSGadgets from './constraint-systems/R1CSGadgets';
import QAP from './constraint-systems/QAP';

export default function ConstraintSystems() {
  return (
    <>
      <R1CS />
      <R1CSGadgets />
      <QAP />
    </>
  );
}
