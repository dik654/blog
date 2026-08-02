import Overview from './raid-backup-strategy/Overview';
import RaidLevels from './raid-backup-strategy/RaidLevels';
import Backup321 from './raid-backup-strategy/Backup321';
import CostModel from './raid-backup-strategy/CostModel';
import Scenarios from './raid-backup-strategy/Scenarios';

export default function RaidBackupStrategy() {
  return (
    <>
      <Overview />
      <RaidLevels />
      <Backup321 />
      <CostModel />
      <Scenarios />
    </>
  );
}
