import type { Lang } from '../types';
import RustLine from './RustLine';
import GoLine from './GoLine';
import PythonLine from './PythonLine';
import TypeScriptLine from './TypeScriptLine';
import CLine from './CLine';

const highlighters: Record<Lang, React.FC<{ text: string }>> = {
  rust: RustLine,
  go: GoLine,
  python: PythonLine,
  typescript: TypeScriptLine,
  c: CLine,
};

export default function CodeLine({ text, lang }: { text: string; lang: Lang }) {
  const H = highlighters[lang];
  return <H text={text} />;
}
