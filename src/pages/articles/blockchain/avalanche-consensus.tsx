import Overview from './avalanche-consensus/Overview';
import Snowflake from './avalanche-consensus/Snowflake';
import Snowball from './avalanche-consensus/Snowball';
import Comparison from './avalanche-consensus/Comparison';

export default function AvalancheConsensusArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Snowflake />
      <Snowball />
      <Comparison />
    </div>
  );
}
