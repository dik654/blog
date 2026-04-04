import Overview from './power-cooling/Overview';
import TDP from './power-cooling/TDP';
import Cooling from './power-cooling/Cooling';
import Rack from './power-cooling/Rack';

export default function PowerCoolingArticle() {
  return (
    <>
      <Overview />
      <TDP />
      <Cooling />
      <Rack />
    </>
  );
}
