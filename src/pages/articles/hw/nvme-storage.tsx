import Overview from './nvme-storage/Overview';
import M2 from './nvme-storage/M2';
import U2 from './nvme-storage/U2';
import E1S from './nvme-storage/E1S';

export default function NVMeStorageArticle() {
  return (
    <>
      <Overview />
      <M2 />
      <U2 />
      <E1S />
    </>
  );
}
