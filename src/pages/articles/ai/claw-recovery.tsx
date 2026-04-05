import Overview from './claw-recovery/Overview';
import Recipes from './claw-recovery/Recipes';
import StaleBranch from './claw-recovery/StaleBranch';
import Escalation from './claw-recovery/Escalation';

export default function ClawRecoveryArticle() {
  return (
    <>
      <Overview />
      <Recipes />
      <StaleBranch />
      <Escalation />
    </>
  );
}
