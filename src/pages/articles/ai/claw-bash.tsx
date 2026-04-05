import Overview from './claw-bash/Overview';
import ValidationPipeline from './claw-bash/ValidationPipeline';
import CommandIntentSection from './claw-bash/CommandIntent';
import Sandbox from './claw-bash/Sandbox';

export default function ClawBashArticle() {
  return (
    <>
      <Overview />
      <ValidationPipeline />
      <CommandIntentSection />
      <Sandbox />
    </>
  );
}
