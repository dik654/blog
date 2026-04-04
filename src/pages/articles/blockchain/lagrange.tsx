import Overview from './lagrange/Overview';
import Formula from './lagrange/Formula';
import Vanishing from './lagrange/Vanishing';
import Usage from './lagrange/Usage';

export default function Lagrange() {
  return (
    <div className="space-y-12">
      <Overview />
      <Formula />
      <Vanishing />
      <Usage />
    </div>
  );
}
