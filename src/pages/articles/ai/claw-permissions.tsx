import Overview from './claw-permissions/Overview';
import Policy from './claw-permissions/Policy';
import Enforcer from './claw-permissions/Enforcer';
import ContextOverride from './claw-permissions/ContextOverride';

export default function ClawPermissionsArticle() {
  return (
    <>
      <Overview />
      <Policy />
      <Enforcer />
      <ContextOverride />
    </>
  );
}
