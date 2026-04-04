import Overview from './storage-comparison/Overview';
import Interface from './storage-comparison/Interface';
import Enterprise from './storage-comparison/Enterprise';
import Filecoin from './storage-comparison/Filecoin';

export default function StorageComparisonArticle() {
  return (
    <>
      <Overview />
      <Interface />
      <Enterprise />
      <Filecoin />
    </>
  );
}
