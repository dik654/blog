import Overview from './isms-encryption/Overview';
import PasswordHashing from './isms-encryption/PasswordHashing';
import KeyManagement from './isms-encryption/KeyManagement';

export default function IsmsEncryption() {
  return (
    <div className="space-y-12">
      <Overview />
      <PasswordHashing />
      <KeyManagement />
    </div>
  );
}
