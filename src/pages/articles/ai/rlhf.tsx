import Overview from './rlhf/Overview';
import RewardModel from './rlhf/RewardModel';
import PPO from './rlhf/PPO';
import DPO from './alignment-methods/DPO';
import ConstitutionalAI from './alignment-methods/ConstitutionalAI';
import ORPO from './alignment-methods/ORPO';
import KTO from './alignment-methods/KTO';

export default function RLHFArticle() {
  return (
    <>
      <Overview />
      <RewardModel />
      <PPO />
      <DPO />
      <ConstitutionalAI />
      <ORPO />
      <KTO />
    </>
  );
}
