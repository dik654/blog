import Overview from './claw-plugin/Overview';
import Registry from './claw-plugin/Registry';
import ToolExecution from './claw-plugin/ToolExecution';
import Lifecycle from './claw-plugin/Lifecycle';

export default function ClawPluginArticle() {
  return (
    <>
      <Overview />
      <Registry />
      <ToolExecution />
      <Lifecycle />
    </>
  );
}
