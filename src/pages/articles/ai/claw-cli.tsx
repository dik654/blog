import Overview from './claw-cli/Overview';
import SlashCommands from './claw-cli/SlashCommands';
import Rendering from './claw-cli/Rendering';
import Init from './claw-cli/Init';

export default function ClawCliArticle() {
  return (
    <>
      <Overview />
      <SlashCommands />
      <Rendering />
      <Init />
    </>
  );
}
