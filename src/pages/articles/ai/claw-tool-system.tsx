import Overview from './claw-tool-system/Overview';
import Dispatch from './claw-tool-system/Dispatch';
import PermissionGating from './claw-tool-system/PermissionGating';
import PluginTools from './claw-tool-system/PluginTools';

export default function ClawToolSystemArticle() {
  return (
    <>
      <Overview />
      <Dispatch />
      <PermissionGating />
      <PluginTools />
    </>
  );
}
