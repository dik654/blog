import Overview from './lora-finetuning/Overview';
import LoRA from './lora-finetuning/LoRA';
import QLoRA from './lora-finetuning/QLoRA';
import Data from './lora-finetuning/Data';
import Practice from './lora-finetuning/Practice';

export default function LoraFinetuningArticle() {
  return (
    <>
      <Overview />
      <LoRA />
      <QLoRA />
      <Data />
      <Practice />
    </>
  );
}
