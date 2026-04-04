import Overview from './claude-code/Overview';
import AgentArchitecture from './claude-code/AgentArchitecture';
import ToolsPermissions from './claude-code/ToolsPermissions';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import { codeRefs } from './claude-code/codeRefs';
import { claudeCodeTree } from './claude-code/fileTrees';

export default function ClaudeCodeArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <Overview onCodeRef={sidebar.open} />
      <AgentArchitecture onCodeRef={sidebar.open} />
      <ToolsPermissions onCodeRef={sidebar.open} />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef}
        onClose={sidebar.close} onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ 'claude-code': claudeCodeTree }}
        projectMetas={{
          'claude-code': { id: 'claude-code', label: 'Claude Code', badgeClass: 'bg-[#f0e6ff] border-[#8b5cf6] text-[#5b21b6]' },
        }}
      />
    </>
  );
}
