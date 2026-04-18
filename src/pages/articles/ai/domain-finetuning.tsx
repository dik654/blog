import Overview from './domain-finetuning/Overview';
import ContinuedPretrain from './domain-finetuning/ContinuedPretrain';
import TaskFinetune from './domain-finetuning/TaskFinetune';
import Genomic from './domain-finetuning/Genomic';

export default function DomainFinetuningArticle() {
  return (
    <>
      <Overview />
      <ContinuedPretrain />
      <TaskFinetune />
      <Genomic />
    </>
  );
}
