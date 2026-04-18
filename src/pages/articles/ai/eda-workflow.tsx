import Overview from './eda-workflow/Overview';
import Distribution from './eda-workflow/Distribution';
import Correlation from './eda-workflow/Correlation';
import Missing from './eda-workflow/Missing';
import Hypothesis from './eda-workflow/Hypothesis';

export default function EdaWorkflowArticle() {
  return (
    <>
      <Overview />
      <Distribution />
      <Correlation />
      <Missing />
      <Hypothesis />
    </>
  );
}
