import type { CodeRef } from '@/components/code/types';
import { loopRefs } from './codeRefsLoop';
import { handleMsgRefs } from './codeRefsHandleMsg';
import { roundRefs } from './codeRefsRound';
import { prevoteRefs } from './codeRefsPrevote';
import { precommitRefs } from './codeRefsPrecommit';
import { commitRefs } from './codeRefsCommit';
import { voteRefs } from './codeRefsVote';
import { addVoteRefs } from './codeRefsAddVote';

export const codeRefs: Record<string, CodeRef> = {
  ...loopRefs,
  ...handleMsgRefs,
  ...roundRefs,
  ...prevoteRefs,
  ...precommitRefs,
  ...commitRefs,
  ...voteRefs,
  ...addVoteRefs,
};
