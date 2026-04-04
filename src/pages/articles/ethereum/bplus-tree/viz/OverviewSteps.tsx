import ArrayStep from './OverviewStepArray';
import HashStep from './OverviewStepHash';
import BSTStep from './OverviewStepBST';
import BTreeStep from './OverviewStepBTree';
import BPlusTreeStep from './OverviewStepBPlus';

export default function OverviewSteps({ step }: { step: number }) {
  return [<ArrayStep />, <HashStep />, <BSTStep />, <BTreeStep />, <BPlusTreeStep />][step];
}
