import Overview from './skills-anatomy/Overview';
import Format from './skills-anatomy/Format';
import Loading from './skills-anatomy/Loading';
import Execution from './skills-anatomy/Execution';
import Registry from './skills-anatomy/Registry';

export default function SkillsAnatomyArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Format />
      <Loading />
      <Execution />
      <Registry />
    </div>
  );
}
