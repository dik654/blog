import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const litellmTree: FileNode = d('litellm', [
  f('router.py', 'litellm/router.py', 'router'),
  f('main.py', 'litellm/main.py', 'main'),
  d('proxy', [
    f('proxy_server.py', 'litellm/proxy/proxy_server.py', 'proxy'),
    f('common_request_processing.py',
      'litellm/proxy/common_request_processing.py'),
  ]),
  d('router_strategy', [
    f('lowest_latency.py',
      'litellm/router_strategy/lowest_latency.py', 'latency'),
    f('lowest_cost.py',
      'litellm/router_strategy/lowest_cost.py', 'cost'),
    f('budget_limiter.py',
      'litellm/router_strategy/budget_limiter.py', 'budget'),
  ]),
  d('router_utils', [
    f('cooldown_handlers.py',
      'litellm/router_utils/cooldown_handlers.py', 'cooldown'),
    f('fallback_event_handlers.py',
      'litellm/router_utils/fallback_event_handlers.py', 'fallback'),
  ]),
]);
