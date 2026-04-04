import Overview from './reth-trie/Overview';
import PrefixSet from './reth-trie/PrefixSet';
import StateRoot from './reth-trie/StateRoot';
import Parallel from './reth-trie/Parallel';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './reth-trie/codeRefs';
import { rethTrieTree } from './reth-trie/fileTrees';

export default function RethTrieArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <PrefixSet onCodeRef={sidebar.open} />
      <StateRoot onCodeRef={sidebar.open} />
      <Parallel />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethTrieTree }}
        projectMetas={{
          reth: { id: 'reth', label: 'Reth \u00b7 Rust', badgeClass: 'bg-orange-500/10 border-orange-500 text-orange-700' },
        }}
      />
    </>
  );
}
