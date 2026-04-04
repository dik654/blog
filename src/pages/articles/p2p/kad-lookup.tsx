import Overview from './kad-lookup/Overview';
import Algorithm from './kad-lookup/Algorithm';
import GethLookup from './kad-lookup/GethLookup';
import Refresh from './kad-lookup/Refresh';
import type { CodeRef } from '@/components/code/types';

export default function KadLookupArticle({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <Overview />
      <Algorithm onCodeRef={onCodeRef} />
      <GethLookup onCodeRef={onCodeRef} />
      <Refresh onCodeRef={onCodeRef} />
    </>
  );
}
