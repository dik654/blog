import type { FileNode } from '@/components/code/types';

export const openR1Tree: FileNode = {
  name: 'open-r1',
  type: 'dir',
  children: [
    {
      name: 'src/open_r1',
      type: 'dir',
      children: [
        { name: 'sft.py', type: 'file' },
        { name: 'grpo.py', type: 'file' },
        { name: 'rewards.py', type: 'file' },
        { name: 'generate.py', type: 'file' },
      ],
    },
  ],
};
