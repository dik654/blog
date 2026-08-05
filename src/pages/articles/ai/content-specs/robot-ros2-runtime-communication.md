# Robot ROS 2 Runtime & Communication content spec

## Goal

- Reader outcome: the reader can turn a logical robot node graph into an operationally safe ROS 2 runtime by specifying interface semantics, QoS compatibility, queue freshness over an explicit time horizon, executor scheduling, lifecycle readiness, ownership/copy behavior, time/TF alignment, end-to-end timing allocations, and a fault-injection release gate.
- System invariant: a command may reach an actuator only when its source data is semantically compatible, fresh in acquisition time, processed by a ready callback chain within a measured deadline, tied to the current lifecycle/goal/revision, and still cancellable or degradable when any contract fails.

## Why this is the next missing foundation

| Existing article | What it covers | Runtime assumption it leaves open |
|---|---|---|
| `robot-ai-top-down` | Names nodes, topics, services, actions, TF and QoS | Does not explain discovery, endpoint compatibility, middleware queues, callback scheduling, readiness, copies, time jumps, or deadline failure. |
| `robot-camera-geometry-calibration` | Produces acquisition-time metric observations | Assumes the message arrives with its type, timestamp, frame, covariance, ownership, and freshness intact. |
| `robot-localization-slam` | Produces smooth odometry, corrected map pose, and health | Assumes IMU, wheel, camera, and LiDAR callbacks execute in time and that TF lookup uses the intended clock and sample. |
| `robot-perception-scene-construction` | Builds tracks, occupancy, and PlanningScene revisions | Assumes large images/clouds are delivered without unsafe buffer reuse and stale samples are not silently accumulated. |
| `robot-motion-planning` | Produces paths from versioned scene state | Assumes a long-running goal has feedback, cancellation, ownership, and a bounded path to the controller. |
| `robot-dynamics-feedback-control` | Closes the physical feedback loop | Assumes middleware plus executor latency fits inside the sampled-control delay budget. |

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Message/service/action semantics | deep contract | Transport shape is insufficient; units, frames, stamps, covariance, goal/revision identity, timeout and cancellation define meaning. |
| DDS discovery and graph introspection | deep boundary | Endpoint visibility proves discovery, not QoS compatibility, application readiness, data freshness, or health. |
| QoS requested/offered compatibility | deep mechanism | History, depth, reliability, durability, deadline, lifespan and liveliness change whether endpoints match and which stale or missing data is observable. |
| Middleware queues and overload | deep causal model | Sensor freshness, command completeness, reliable retry, backpressure and drop policy require different queue contracts. |
| Executors, wait sets and callback groups | deep mechanism | A node graph does not specify callback order; shared threads, non-preemption, polling/ready semantics, hidden callbacks and mutex groups determine latency and deadlock. |
| Managed lifecycle and supervision | deep operational contract | Constructed/discovered is not configured, active, healthy, or safe to command. |
| Composition, intra-process and ownership | deep trade-off | Fewer copies can reduce latency but changes buffer lifetime, mutation, fan-out and fault-isolation requirements. |
| ROS/System/Steady time and TF | deep | Simulation jumps, clock synchronization, source stamps, queue arrival and transform availability are distinct time domains. |
| End-to-end response time and health | deep | Per-topic deadline or average latency cannot certify sensor-to-actuator worst-case behavior; supplied stage bounds must remain visibly distinct from a formal analysis. |
| Fault qualification and release gates | deep operational contract | An apparently fast run can still carry stale identity, violate a local allocation, or fail to stop within its independent acknowledgement bound. |
| DDS wire protocol, every RMW vendor, DDS Security, kernel tuning | bridge only | They deserve deployment-specific follow-ups; this article owns the portable runtime reasoning contract. |

## Reader prerequisites

- Topics, services and actions at name/use level.
- Sampling period, latency, jitter, queue and feedback-loop intuition.
- Acquisition timestamp, coordinate frame, covariance and TF composition.
- Process, thread, callback, mutex and memory ownership basics.

## Private hardest transfer problem

Do not publish this integrated test as article filler. Use it only as a completeness gate.

A warehouse robot has a 30 Hz RGB camera, 10 Hz depth camera, 10 Hz LiDAR, 200 Hz IMU, 50 Hz localization output, 10 Hz planner update, and 100 Hz controller. Camera and detector are composed into one process, localization and planning run in another, and the motor bridge is a lifecycle node. During a Wi-Fi disturbance and CPU spike: the depth subscriber requests reliable data while its publisher offers best effort; image processing takes 42 ms inside the same default mutually-exclusive callback group as a watchdog and a synchronous parameter service; reliable queue depth grows; an old transient-local path is replayed after planner restart; the motor bridge is discovered but inactive; simulated time jumps backward during rosbag replay; a TF lookup uses arrival time rather than acquisition time; an intra-process image buffer is reused before the detector finishes; and a cancel request waits behind the callback it must stop. The graph remains visible and several topic rates look nominal.

The reader must be able to:

1. Choose topic, service, or action from interaction semantics rather than convenience and define cancellation/idempotency boundaries.
2. Specify a message contract containing type/version, units, frame, acquisition stamp/interval, covariance, source lineage, sequence/goal/revision identity, validity horizon and failure state.
3. Separate graph discovery, type/QoS matching, lifecycle readiness, data freshness, application health and end-to-end safety.
4. Apply requested-versus-offered QoS compatibility and diagnose silent non-communication from incompatible reliability, durability or deadline policies.
5. Choose history/depth and overload policy by stream semantics: newest sensor state, complete event log, command acknowledgement, or late-joiner configuration.
6. Explain why reliable delivery is not the same as fresh delivery and why queue growth plus retries can make a controller consume older truth.
7. Trace one message from DDS/RMW readiness through a wait set to a callback and explain why the classic executor is not a global FIFO queue.
8. Allocate callback groups and threads so a long image callback cannot starve a watchdog/controller, while protecting shared non-thread-safe state.
9. Detect the synchronous service/action deadlock caused by a hidden future done-callback in the same mutually-exclusive group and repair it with separation or asynchronous control flow.
10. Drive a managed node through configure, inactive, active, error and recovery; prevent actuation when the node is merely discovered or inactive.
11. Decide process composition and intra-process ownership from message size, copy cost, fan-out, mutation, lifetime, fault isolation and observability rather than assuming zero copy is free.
12. Separate SystemTime, SteadyTime and ROSTime; handle uninitialized time and backward jumps; use source acquisition stamps for TF and freshness rather than arrival time.
13. Prevent stale transient-local commands, goals, maps or paths from becoming valid after restart by binding them to epoch/revision/goal state and lifespan.
14. Build a sensor-to-actuator callback chain with WCET, queue/release jitter, communication delay, executor interference and CPU supply; distinguish measured typical latency from an analytical worst-case bound.
15. Publish a runtime health contract from matched endpoints, lifecycle state, sample age, queue/drop statistics, callback duration, deadline/liveliness events, TF success and end-to-end age; degrade, cancel, stop or restart on violation.
16. Run baseline, DDS burst, low-priority lock, clock-jump, stale-epoch and inactive-node fixtures; reject release when any local allocation, stop acknowledgement, time, epoch or lifecycle gate fails.

The article passes only when all premises have visible public evidence and the interactive states reveal the causal failure, not merely change colors.

## Source and intent ledger

| Source locator | Original claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| Current ROS 2 Kilted interface and QoS concepts | Topics are continuous asynchronous streams, services are short request/response operations, actions are long-running cancellable operations; QoS profiles can be incompatible and prevent delivery. | Documentation defines portable concepts, not a safety architecture or vendor-independent latency guarantee. | Ground interface selection and requested/offered compatibility in current behavior. | Interface-contract lab and QoS match matrix. |
| Current ROS 2 executor and callback-group docs | Executors use threads to invoke callbacks; classic wait sets expose readiness rather than per-queue counts and overloaded scheduling is not FIFO; mutually-exclusive/reentrant groups control concurrency; a synchronous call can deadlock with its hidden done-callback. | Executor implementations evolve; current docs note EventsCBGExecutor and removal of historical timer prioritization. | Replace the misleading mental model “topic callback runs immediately in publish order.” | Queue-to-wait-set timeline, starvation/deadlock lab, historical/current boundary. |
| ROS 2 managed-node design | A managed node has Unconfigured, Inactive, Active and Finalized primary states plus supervised transitions and error processing; inactive nodes do not perform functional processing. | A design state machine does not by itself implement application-specific readiness, health checks, or restart policy. | Separate discovery from readiness and make safe activation explicit. | Lifecycle supervisor lab and command gate. |
| ROS 2 deadline/liveliness/lifespan design | Deadline monitors expected intervals at RMW, liveliness detects entity lease failure, lifespan expires old samples from a DDS source/write timestamp; deadline does not include upper application processing overhead. | DDS source/write time need not equal a sensor message's physical acquisition `Header.stamp`; QoS status is not sensor-to-actuator certification. | Give each policy one precise question and expose the missing consumer acquisition-age and application/executor intervals. | QoS diagnostic ledger, explicit acquisition-age gate and end-to-end timing equation. |
| ROS 2 clock/time design and TF conventions | System, steady and ROS time serve different purposes; `/clock` may pause or jump backward and zero ROS time is uninitialized. | Clock abstraction does not synchronize physical devices automatically or repair wrong source timestamps. | Prevent replay/simulation and acquisition/arrival-time defects from appearing as geometry failures. | Multi-clock timeline and TF buffer lab. |
| ROS 2 intra-process communication design | Composition can keep messages in-process; buffers and unique/shared ownership change copy count, queue behavior and fan-out trade-offs. | The 2020 design document contains historical implementation/evidence and is not a universal zero-copy guarantee for every RMW or message type. | Teach optimization as an ownership contract, not an on/off speed switch. | Copy/ownership lab with mutation and isolation failure. |
| Casini et al., ECRTS 2019 revised paper | Logical callback graphs mapped to single-thread executors and resource reservations require ROS-specific response-time analysis; processing-chain latency depends on arrival curves, WCET, executor interference, communication and supplied CPU budget. | It analyzes ROS 2 Crystal's built-in single-thread executor, fixed DAG, known WCET/arrival bounds and reservation scheduling; timer priority was later removed, multi-thread callback groups and dynamic mode changes are out of scope. | Provide the foundational bridge from node graph to analyzable sensor-to-actuator timing. | Dedicated paper reconstruction and current-runtime comparison. |
| Casini et al., RTSS 2021 | Later analysis models ROS 2 callback scheduling more accurately and shows why implementation semantics and release patterns must match the analysis model. | It still requires bounded workload and deployment assumptions; it is not a universal certificate for every executor, callback group or dynamic graph. | Prevent the educational worksheet from being presented as a formal response-time analyzer. | Explicit “supplied bounds” worksheet boundary and qualification handoff. |

## Narrative sections

### 01. A graph is not yet a runtime contract

- Separate logical nodes/interfaces from endpoints, processes, threads, middleware queues, callbacks and physical effects.
- Define the complete message envelope: meaning plus transport plus validity.
- Select topic/service/action from duration, direction, state, feedback and cancellation.
- Viz: change task semantics and contract fields; report whether the interface is valid and which ambiguity can reach the actuator.

### 02. Discovery, matching, readiness and health are different gates

- Trace participant discovery, endpoint name/type match, QoS compatibility, lifecycle readiness, first valid data and health.
- Explain why `ros2 topic list` or a graph edge is not proof of communication.
- Treat each gate as observable state with a specific diagnostic.
- Viz: toggle gates on a publisher/subscriber path and reveal the first failed boundary.

### 03. QoS is a requested/offered contract, not a quality slider

- Explain history/depth, reliability, durability, deadline, lifespan and liveliness by the question each answers.
- Derive requested/offered compatibility for reliability, durability and deadline.
- Compare sensor freshness, configuration replay, command/state and event-log profiles.
- Viz: configure publisher/subscriber policies and show match, queue behavior, late join, stale age and status events.

### 04. Queues decide whether overload loses samples or loses time

- Distinguish loss, retry, backpressure, overwrite-oldest and unbounded backlog.
- Show `B(t)=min(N,ceil((lambda-mu)^+ t))`, an explicit observation horizon, time-to-full and response-age growth.
- Explain why reliable + deep queue can be worse for a feedback sensor than best effort + keep-last(1).
- Viz: tune input rate, callback cost, depth, observation window and policy; measure backlog, age, drop/blocking and time-to-full.

### 05. Executors turn ready work into callback order

- Trace DDS/RMW queue, wait set readiness flag, executor selection, callback group and thread.
- Explain non-preemptive completion, classic round-robin/non-FIFO behavior under overload, current EventsCBGExecutor boundary and priority inversion risk.
- Separate multi-thread availability from actual parallelism allowed by groups.
- Reconstruct the hidden future done-callback deadlock.
- Viz: schedule image, IMU, watchdog and service callbacks under executor/group choices; show timeline, missed watchdog and deadlock.

### 06. Lifecycle makes readiness a supervised state machine

- Walk Unconfigured -> Inactive -> Active, error processing, cleanup/reconfigure and finalized states.
- Allocate resources in configure, acquire active-only hardware in activate, stop publications/commands in deactivate.
- Keep discovery and management interface visible while functional behavior remains gated.
- Viz: inject calibration failure or runtime fault and choose automatic activation versus supervisor transaction; report whether command escape is possible.

### 07. Composition trades copies for ownership and fault boundaries

- Compare inter-process serialization, intra-process shared ownership and unique ownership transfer.
- Count minimum copies under one/fan-out subscribers and mutation requirements.
- Explain buffer pooling, loan lifetime, immutable publication, and why reuse-before-completion corrupts observations.
- Viz: change message size, subscribers, ownership and process boundary; show copies/latency, corruption risk and crash blast radius.

### 08. Time, TF and replay need one acquisition-time story

- Separate SystemTime, SteadyTime and ROSTime and map each to a use.
- Compare source acquisition time, transport arrival, callback start and actuation time.
- Handle `/clock` zero, pause and backward jump; clear time-indexed buffers on jump.
- Query TF at acquisition time, not latest/arrival time; choose wait/drop/degrade on missing transform.
- Viz: move a sensor during delayed delivery and replay with a backward jump; measure spatial error, sample age and buffer validity.

### 09. Safety lives in the end-to-end chain

- Construct `sensor -> deserialize/take -> preprocess -> estimate -> plan -> control -> actuator` as callbacks/communications.
- Define callback WCET, arrival curve/jitter, executor wait/interference, communication delay and CPU supply.
- Sum/propagate response bounds only under explicit assumptions; separate empirical percentiles from analytical bounds.
- Build one runtime acceptance gate with endpoint match, lifecycle, age, deadline, TF, queue and goal/revision epoch.
- Viz: sum user-supplied callback, executor, communication and trigger bounds. Until every input is backed by a WCET/arrival/network assumption, label the result illustrative and never emit RUN/STOP claims.

### 10. Fault fixtures qualify the release contract

- Derive a 100 ms physical deadline into a 90 ms stage envelope, 10 ms reserve and independent 30 ms stop-acknowledgement contract.
- Require both the whole envelope and every local stage allocation to pass.
- Derive priority-inversion delay from a lower-priority 35 ms critical section: `B_H=35 ms`, `R_stop=12+35=47 ms`.
- Inject DDS burst, priority inversion, backward ROS time jump, restart history and inactive lifecycle; require zero bad commands and an explicit recovery/requalification action.
- Viz: compare baseline 61 ms, DDS burst 83 ms with local breaches, priority inversion 96 ms/47 ms stop, and independent time/epoch/lifecycle gate closures.

## Formula contract

- Display formulas: full message contract, requested/offered compatibility, queue utilization/backlog/time-to-full/age, freshness, callback-chain latency decomposition, callback-group concurrency constraint, lifecycle command gate, copy count/ownership, multi-clock timestamps and TF lookup, arrival curve, reservation utilization/supply, priority-inversion blocking, local timing allocations, and release/health gates.
- Every display formula uses `String.raw`, Korean in-equation annotations and a `FormulaNote` with symbols, units, operation reason and failure boundary.
- Long equations split into semantic rows or separate displays. Minimum scale is 0.75 at 360 px and no display may create horizontal scrolling.

## Viz design contract

- Each Viz changes one or more causal variables and exposes measurable consequences: match/no-match, queue age/drop, callback start/end, deadlock, activation escape, copy/corruption, spatial time error or deadline margin.
- Animation is required only for queue progression, callback execution and time/TF order; all animations must pause when out of view or under reduced-motion preference if they run continuously.
- Use responsive HTML for labels/metrics and SVG only for topology/timelines. Curves and transfer paths use round caps, 1-3 px hierarchy and stable view boxes.
- Color roles: blue data/measurement, teal middleware/runtime, violet scheduling/control flow, amber waiting/stale/risk, emerald compatible/ready/within budget, red only mismatch/deadlock/corruption/deadline violation.
- Use section milestones and large numerals to establish reading position without turning sections into decorative cards.
- Verify initial, worst and recovery states at 360, 390, 768 and 1440 px: no inner scroll, clipped label, overlap, illegible math, uncontrolled whitespace or right-edge truncation.

## Paper spine

1. Casini et al. 2019 revised: reconstruct logical/runtime mapping, historical executor scheduling, arrival curves, reservations, callback/subchain response bounds, move_base case study, evidence and version limits.
2. Pöhnl et al. executor determinism: future bridge from the historical classic executor to explicit scheduling and callback-chain control.
3. ROS 2 design/architecture Science Robotics 2022: future system-history article after the operational runtime layer exists.
4. LET/rclc and real-time tracing: future implementation article for deterministic embedded control paths.

## Coverage gate

| Hard-problem premise | Public evidence required |
|---|---|
| Interface selection and cancellation | Section 01 semantics Viz |
| Complete message meaning/validity contract | Section 01 envelope and formula |
| Discovery != safety | Section 02 multi-gate path |
| Requested/offered match | Section 03 compatibility matrix/Viz |
| Stream-specific history/depth | Sections 03/04 profile and queue behavior |
| Reliable != fresh | Section 04 age/drop/backpressure metrics |
| Wait set/executor semantics | Section 05 queue-to-callback timeline |
| Starvation/group allocation | Section 05 watchdog timeline |
| Hidden callback deadlock | Section 05 synchronous-call mode |
| Lifecycle command gate | Section 06 supervisor transaction |
| Ownership/copy/fault isolation | Section 07 composition lab |
| Multi-clock and TF acquisition time | Section 08 time/TF lab |
| Restart stale replay/epoch | Sections 03/10 durability and qualification gate |
| End-to-end latency bound | Section 09 supplied-bound worksheet plus the separate paper reconstruction |
| Queue horizon and saturation | Section 04 explicit observation window and time-to-full |
| Priority inversion and bounded stop | Section 10 blocking derivation and stop-ack fixture |
| Local allocation breach | Section 10 DDS burst stage gate |
| Wrong-time/wrong-epoch/inactive command | Section 10 zero-bad-command qualification |
| Runtime degradation/stop | Section 10 independent release and stop decisions |

## Direct entry contract

- Open with a correctly addressed parcel that can still arrive late, stale, or in the wrong order.
- Define node, topic, publisher, subscriber, queue, and deadline before DDS, QoS, executor, callback group, or lifecycle terminology appears.
- The first formal question follows sender -> waiting line -> receiver -> physical deadline and asks how correctness is proved, not merely whether a message arrived.
