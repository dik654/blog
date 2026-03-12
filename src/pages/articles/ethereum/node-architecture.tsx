import { nodeSections } from './node-architecture/meta';
import Overview from './node-architecture/Overview';
import ExecutionLayer from './node-architecture/ExecutionLayer';
import ConsensusLayer from './node-architecture/ConsensusLayer';
import ValidatorLifecycle from './node-architecture/ValidatorLifecycle';
import BlockProposal from './node-architecture/BlockProposal';
import BlockLifecycle from './node-architecture/BlockLifecycle';
import AttestationFinality from './node-architecture/AttestationFinality';
import SlashingMechanics from './node-architecture/SlashingMechanics';
import TransactionEVM from './node-architecture/TransactionEVM';

const t = (id: string) => nodeSections.find(s => s.id === id)?.title ?? id;

export default function NodeArchitecture() {
  return (
    <>
      <Overview title={t('overview')} />
      <ExecutionLayer title={t('execution-layer')} />
      <ConsensusLayer title={t('consensus-layer')} />
      <ValidatorLifecycle title={t('validator-lifecycle')} />
      <BlockProposal title={t('block-proposal')} />
      <BlockLifecycle title={t('block-lifecycle')} />
      <AttestationFinality title={t('attestation-finality')} />
      <SlashingMechanics title={t('slashing')} />
      <TransactionEVM title={t('transaction-evm')} />
    </>
  );
}
