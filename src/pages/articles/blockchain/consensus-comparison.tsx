import Overview from './consensus-comparison/Overview';
import Performance from './consensus-comparison/Performance';
import Security from './consensus-comparison/Security';
import UseCases from './consensus-comparison/UseCases';

export default function ConsensusComparisonArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Performance />
      <Security />
      <UseCases />
    </div>
  );
}
