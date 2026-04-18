import Overview from './competition-workflow/Overview';
import EdaPhase from './competition-workflow/EdaPhase';
import Baseline from './competition-workflow/Baseline';
import Iteration from './competition-workflow/Iteration';
import Final from './competition-workflow/Final';

export default function CompetitionWorkflowArticle() {
  return (
    <>
      <Overview />
      <EdaPhase />
      <Baseline />
      <Iteration />
      <Final />
    </>
  );
}
