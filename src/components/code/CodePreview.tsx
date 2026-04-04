import type { CodeRef } from './types';
import CodeLine from './highlighters';

export default function CodePreview({
  codeRef,
}: {
  codeRef: CodeRef;
}) {
  const allLines = codeRef.code.split('\n');
  const MAX = 18;
  const from = codeRef.highlight[0] - 1;
  const to = Math.min(codeRef.highlight[1] - 1, from + MAX - 1);
  const lines = allLines.slice(from, to + 1);
  const truncated = codeRef.highlight[1] - codeRef.highlight[0] > MAX;
  return (
    <div className="mt-2 rounded border border-[#d0d7de] dark:border-[#30363d] overflow-hidden text-[10px] font-mono">
      <div className="px-2 py-1 bg-[#f6f8fa] dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] text-[9px] truncate">
        {codeRef.path}  L{codeRef.highlight[0]}–{Math.min(codeRef.highlight[1], codeRef.highlight[0] + MAX - 1)}{truncated && ' …'}
      </div>
      <div className="overflow-x-auto bg-white dark:bg-[#0d1117] max-h-[220px] overflow-y-auto">
        <table className="border-collapse w-full leading-5">
          <tbody>
            {lines.map((line, i) => {
              const ln = codeRef.highlight[0] + i;
              return (
                <tr key={ln} className="hover:bg-[#f6f8fa] dark:hover:bg-[#161b22]">
                  <td className="select-none text-right pr-2 pl-3 py-0 text-[#57606a] dark:text-[#636e7b] w-10 shrink-0 border-r border-[#eaecef] dark:border-[#21262d]">{ln}</td>
                  <td className="pl-3 pr-3 py-0 whitespace-pre text-[#24292f] dark:text-[#e6edf3] border-l-2 border-[#d4a72c]">
                    <CodeLine text={line} lang={codeRef.lang} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
