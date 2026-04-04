import Overview from './autobahn-deep/Overview';
import Pipeline from './autobahn-deep/Pipeline';
import HybridDesign from './autobahn-deep/HybridDesign';
import Performance from './autobahn-deep/Performance';

export default function AutobahnDeepArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Pipeline />
      <HybridDesign />
      <Performance />
    </div>
  );
}
