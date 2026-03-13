import Overview from './cosmos-sdk/Overview';
import ModuleArchitecture from './cosmos-sdk/ModuleArchitecture';
import StateManagement from './cosmos-sdk/StateManagement';
import TransactionLifecycle from './cosmos-sdk/TransactionLifecycle';

export default function CosmosSDKArticle() {
  return (
    <>
      <Overview />
      <ModuleArchitecture />
      <StateManagement />
      <TransactionLifecycle />
    </>
  );
}
