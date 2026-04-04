import Glossary from './da-theory/Glossary';
import Overview from './da-theory/Overview';
import DAS from './da-theory/DAS';
import KZGCommitment from './da-theory/KZGCommitment';
import CellProofDAS from './da-theory/CellProofDAS';
import EIP4844 from './da-theory/EIP4844';
import BlobGasMath from './da-theory/BlobGasMath';
import DALayer from './da-theory/DALayer';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './da-theory/codeRefs';
import { gethTree } from './da-theory/gethFileTree';

export default function DATheoryArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Glossary />
      <Overview onCodeRef={sidebar.open} />
      <DAS onCodeRef={sidebar.open} />
      <KZGCommitment onCodeRef={sidebar.open} />
      <CellProofDAS onCodeRef={sidebar.open} />
      <EIP4844 onCodeRef={sidebar.open} />
      <BlobGasMath onCodeRef={sidebar.open} />
      <DALayer />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'go-ethereum': gethTree }}
        projectMetas={{
          'go-ethereum': { id: 'go-ethereum', label: 'go-ethereum · Go', badgeClass: 'bg-sky-50 border-sky-400 text-sky-800' },
        }}
      />
    </>
  );
}
