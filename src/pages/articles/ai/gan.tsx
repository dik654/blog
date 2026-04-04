import Overview from './gan/Overview';
import Training from './gan/Training';
import Variants from './gan/Variants';

export default function GANArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Training />
      <Variants />
    </div>
  );
}
