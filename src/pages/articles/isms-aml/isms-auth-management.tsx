import Overview from './isms-auth-management/Overview';
import PasswordPolicy from './isms-auth-management/PasswordPolicy';
import AccountLifecycle from './isms-auth-management/AccountLifecycle';

export default function IsmsAuthManagement() {
  return (
    <div className="space-y-12">
      <Overview />
      <PasswordPolicy />
      <AccountLifecycle />
    </div>
  );
}
