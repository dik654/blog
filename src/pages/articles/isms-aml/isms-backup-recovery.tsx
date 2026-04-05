import Overview from './isms-backup-recovery/Overview';
import BackupPolicy from './isms-backup-recovery/BackupPolicy';
import RecoveryTesting from './isms-backup-recovery/RecoveryTesting';

export default function IsmsBackupRecovery() {
  return (
    <div className="space-y-12">
      <Overview />
      <BackupPolicy />
      <RecoveryTesting />
    </div>
  );
}
