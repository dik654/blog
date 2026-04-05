import Overview from './claw-api-client/Overview';
import Anthropic from './claw-api-client/Anthropic';
import OpenAICompat from './claw-api-client/OpenAICompat';
import PromptCache from './claw-api-client/PromptCache';

export default function ClawApiClientArticle() {
  return (
    <>
      <Overview />
      <Anthropic />
      <OpenAICompat />
      <PromptCache />
    </>
  );
}
