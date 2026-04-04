import Overview from './server-vs-desktop/Overview';
import CPU from './server-vs-desktop/CPU';
import Motherboard from './server-vs-desktop/Motherboard';
import Reliability from './server-vs-desktop/Reliability';

export default function ServerVsDesktopArticle() {
  return (
    <>
      <Overview />
      <CPU />
      <Motherboard />
      <Reliability />
    </>
  );
}
