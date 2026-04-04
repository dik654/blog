import Overview from './kzg-gpu/Overview';
import SrsLoading from './kzg-gpu/SrsLoading';
import CommitMsm from './kzg-gpu/CommitMsm';
import BatchOpening from './kzg-gpu/BatchOpening';

export default function KzgGpuArticle() {
  return (
    <>
      <Overview />
      <SrsLoading />
      <CommitMsm />
      <BatchOpening />
    </>
  );
}
