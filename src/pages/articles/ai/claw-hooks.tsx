import Overview from './claw-hooks/Overview';
import PrePost from './claw-hooks/PrePost';
import ShellExecution from './claw-hooks/ShellExecution';
import PermissionOverride from './claw-hooks/PermissionOverride';

export default function ClawHooksArticle() {
  return (
    <>
      <Overview />
      <PrePost />
      <ShellExecution />
      <PermissionOverride />
    </>
  );
}
