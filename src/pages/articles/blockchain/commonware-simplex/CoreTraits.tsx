import StateRoundViz from './viz/StateRoundViz';
import MessageTypesViz from './viz/MessageTypesViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CoreTraits({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="core-traits" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Core Types: State · Round · Proposal</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Simplex의 상태 관리는 2단계 — State(에폭) → Round(뷰)
          <br />
          각 뷰의 투표·인증서·타임아웃을 Round가 독립 추적
        </p>
      </div>
      <div className="not-prose mb-8">
        <StateRoundViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">프로토콜 메시지 & Trait 분리</h3>
        <p className="leading-7">
          투표(개별 서명) → 인증서(2f+1 집합) 2단계 + Automaton·Relay·Reporter 분리
        </p>
      </div>
      <div className="not-prose">
        <MessageTypesViz onOpenCode={open} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">State, Round 및 Trait 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Simplex Core Types & Traits
//
// State hierarchy:
//   Epoch: configuration period (validator set, parameters)
//   View (Round): single consensus attempt
//   Height: blockchain position

// State structure:
//
//   struct State<D: Digest> {
//       epoch: Epoch,
//       current_view: View,
//       rounds: BTreeMap<View, Round<D>>,
//       finalized: Option<(View, D)>,
//       participants: Vec<PublicKey>,
//       thresholds: Thresholds,
//   }
//
//   Per-epoch:
//     Fixed validator set
//     Known public keys
//     Fixed Byzantine threshold (f)
//
//   Per-view:
//     Separate Round struct
//     Independent vote tracking
//     Pruned after finalization

// Round structure:
//
//   struct Round<D: Digest> {
//       view: View,
//       leader: PublicKey,
//       proposal: Option<Proposal<D>>,
//       notarizes: AttributableMap<Notarize<D>>,
//       nullifies: AttributableMap<Nullify>,
//       finalizes: AttributableMap<Finalize<D>>,
//       notarization: Option<Notarization<D>>,
//       nullification: Option<Nullification>,
//       finalization: Option<Finalization<D>>,
//       timeout: Option<Instant>,
//   }
//
//   Tracks:
//     Individual votes (signed by each validator)
//     Aggregated certificates (2f+1 signatures)
//     Timeouts (advance view if no progress)

// AttributableMap:
//
//   struct AttributableMap<V> {
//       by_signer: BTreeMap<ValidatorIndex, V>,
//   }
//
//   Purpose:
//     Ensure one vote per validator
//     Enables slashing for double-voting
//     Aggregation when quorum reached

// Message types (wire format):
//
//   enum Message<D> {
//       Propose(Propose<D>),
//       Notarize(Notarize<D>),
//       Nullify(Nullify),
//       Finalize(Finalize<D>),
//       Certificate(Certificate<D>),
//   }
//
//   struct Propose<D> {
//       view: View,
//       parent: Option<Certificate<D>>,
//       payload: Bytes,
//       proposer_sig: Signature,
//   }
//
//   struct Notarize<D> {
//       view: View,
//       digest: D,
//       signer: ValidatorIndex,
//       signature: Signature,
//   }

// Trait separation (Automaton/Relay/Reporter):
//
//   trait Automaton<D>: Send + Sync {
//       fn propose(&self, view: View) -> Bytes;
//       fn verify(&self, view: View, payload: Bytes) -> bool;
//       fn genesis(&self) -> D;
//   }
//
//   // Application logic (block validation, etc.)
//
//   trait Relay: Send + Sync {
//       fn broadcast(&self, message: Message);
//   }
//
//   // Network layer abstraction
//
//   trait Reporter: Send + Sync {
//       fn finalized(&self, view: View, payload: Bytes);
//       fn notarized(&self, view: View, payload: Bytes);
//   }
//
//   // Observability hooks

// Why trait separation?
//
//   Automaton: app-specific logic (VM, ordering, etc.)
//   Relay: network transport
//   Reporter: metrics, storage, indexing
//
//   Benefits:
//     - Consensus engine stays generic
//     - Different apps use same engine
//     - Easy testing (mock traits)
//     - Clean separation of concerns

// Certificate types:
//
//   Notarization: 2f+1 Notarize votes
//     Proves: this block was proposed & accepted
//     Enables: view advancement
//
//   Nullification: 2f+1 Nullify votes
//     Proves: this view failed to make progress
//     Enables: view advancement (without block)
//
//   Finalization: 2f+1 Finalize votes
//     Proves: this block is committed
//     Enables: state finality

// Two-phase commit pattern:
//
//   Phase 1 (Notarize):
//     Validators sign: "I've seen valid block X in view V"
//     2f+1 notarizes → Notarization
//     Not yet committed!
//
//   Phase 2 (Finalize):
//     Validators sign: "I commit block X in view V"
//     2f+1 finalizes → Finalization
//     Block now irreversible

// Epoch rotation:
//   Configuration updates (validator set, threshold)
//   Happens at known boundary (e.g., every N blocks)
//   State transitions to new Epoch
//   Old epochs archived for light client verification`}
        </pre>
      </div>
    </section>
  );
}
