# Robot Embedded Real-Time Control content spec

## Goal

- Reader outcome: the reader can turn a host-level torque/velocity setpoint into a bounded embedded execution path by specifying command validity, fieldbus timing, hardware-triggered sampling, ISR/DMA ownership, RTOS scheduling, shared-resource blocking, memory/numeric bounds, watchdog/fault behavior, and physical actuation acknowledgement.
- System invariant: PWM or drive enable may remain active only when the command belongs to the current control epoch, all required measurements were captured at the intended hardware time, the control job completed before its latch deadline, communication and shared-resource bounds remain valid, and independent hardware/software fault paths still agree that actuation is safe.
- Curriculum boundary: this article owns host-to-MCU execution. It introduces current-loop timing and PWM/ADC synchronization but leaves motor electromagnetic derivation, Clarke/Park transforms, FOC current regulation, inverter switching, thermal design, and PCB layout to the next motor-control article.

## Why this is the next missing foundation

| Existing article | Output it already promises | Embedded assumption it leaves open |
|---|---|---|
| `robot-ros2-runtime-communication` | A fresh, cancellable command reaches an actuator callback within a host-side response budget. | Assumes the device receives, validates, schedules, applies, and acknowledges the command in a bounded hardware cycle. |
| `robot-trajectory-generation` | Timestamped, limit-feasible `q*(t), qdot*(t), qddot*(t)`. | Assumes setpoints are sampled at intended instants and do not become a stale FIFO inside a drive. |
| `robot-dynamics-feedback-control` | Control input `u_k` from a sampled state and controller. | Assumes `u_k` is applied before the next sample with bounded jitter, saturation, quantization, and actuator lag. |
| `signals-systems-convolution` | Sampling, delay, aliasing, filtering, and state-space intuition. | Does not map those timing ideas to timer triggers, ADC/encoder capture, DMA, ISR, RTOS tasks, and PWM shadow registers. |
| `robot-ai-top-down` | Names embedded, CAN/EtherCAT, encoder, RTOS and FOC as the lower stack. | Does not explain the execution contracts or how to debug a deadline miss without blaming the AI/controller. |

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Command/setpoint envelope | deep contract | Value alone is unsafe; unit, mode, source, sequence, epoch, target hardware time, validity horizon, limit and fallback must travel together. |
| Time-triggered sample-compute-actuate cycle | deep mechanism | A timer-triggered ADC/encoder capture and a defined PWM latch point separate physical sampling jitter from software completion jitter. |
| ISR, DMA and task handoff | deep mechanism | Interrupt priority, bounded ISR work, buffer ownership, cache/coherency and release event determine when data becomes valid. |
| RTOS task model and scheduling | deep mechanism | Period, WCET, deadline, release jitter, priority, blocking and overhead must be explicit before utilization or response claims mean anything. |
| Rate-monotonic and deadline-driven foundations | deep paper spine | Liu–Layland supplies the foundational critical-instant, RM and EDF results and their narrow assumptions. |
| Resource sharing and priority inversion | deep operational boundary | A short high-priority control task can miss because a low-priority telemetry task holds a bus or driver lock. |
| CAN/EtherCAT and distributed time | deep contract, protocol bridge | Arbitration, cycle, distributed clocks, sequence/epoch and timeout change command age and multi-axis simultaneity; wire-level protocol internals remain follow-up material. |
| Bounded memory and numerical representation | deep production boundary | Dynamic allocation, stack overflow, unbounded logging, integer wrap, scale/saturation and NaN can violate timing or command meaning. |
| Watchdog, fault latch and safe state | deep safety boundary | A scheduler heartbeat is not proof of fresh measurement, valid control, energized driver, or stopped motor. |
| BLDC/PMSM electromagnetic model, FOC, inverter and PCB | bridge only | These require a separate article with electrical equations, current sensing, switching loss, protection, thermal and layout evidence. |

## Reader prerequisites

- ROS 2 runtime article through end-to-end host deadline and lifecycle command gate.
- Sample period, delay, jitter, feedback loop, state and control input intuition.
- Process/thread/callback basics plus integer, buffer and pointer ownership basics.
- Voltage, current and PWM at qualitative level; no motor electromagnetic derivation required.

## Private hardest transfer problem

Do not publish this integrated problem as a quiz. Use it as a completeness gate.

A mobile manipulator receives a 1 kHz torque setpoint over EtherCAT. Each joint drive has a 20 kHz current loop, 2 kHz velocity loop and 1 kHz outer position/setpoint task on a single-core Cortex-M MCU. A center-aligned PWM timer should trigger two phase-current ADC conversions, DMA should complete before the current ISR, and a shadow register should latch the new duty cycle at the next safe timer event. During a payload lift, all host ROS topic rates remain nominal, the EtherCAT link stays operational, and the MCU heartbeat continues.

However, the host sends commands without epoch and target-cycle identity; an old command remains in a three-entry drive FIFO after a controller restart; one current ADC is triggered by a software call after the other; the DMA producer reuses a ping buffer while the control task still reads it; the current ISR performs formatted logging; a 2 kHz velocity task and 1 kHz fieldbus task share a SPI/encoder mutex with low-priority telemetry; a medium-priority diagnostic task causes unbounded priority inversion; the measured WCET excludes cache miss, interrupt nesting and context-switch overhead; the RTOS tick is used as the PWM timebase; a 32-bit microsecond timestamp wraps; fixed-point current scaling overflows near regeneration; the software watchdog is kicked by a high-priority task before output validation; an overcurrent fault disables the gate driver but the host sees only the unchanged command echo; and the emergency stop message waits behind ordinary bus traffic. Occasionally the old torque is applied one cycle late to only two of six axes.

The reader must be able to:

1. Separate host command arrival, target hardware cycle, measurement capture, callback/task start, PWM latch, electrical response and acknowledgement time.
2. Design a setpoint envelope with mode, unit, sequence, source, epoch, target cycle/time, validity horizon, limit, fallback and acknowledgement identity.
3. Explain why queue depth greater than one can preserve obsolete commands and choose overwrite/latest, scheduled-cycle, interpolation or reject policies by command semantics.
4. Construct a hardware-triggered sample-compute-actuate timeline and locate the real deadline at the PWM shadow-register latch, not at function return.
5. Synchronize ADC/encoder acquisition and distinguish physical sampling jitter from task release and completion jitter.
6. Keep ISR work bounded, defer noncritical work, and define ISR-to-task release semantics without losing or reusing data.
7. Define DMA buffer ownership with producer/consumer phase, completion flag, memory visibility and overrun policy.
8. Characterize each RTOS task by period/minimum inter-arrival, WCET, deadline, release jitter, priority, blocking, stack and shared resources.
9. Apply the Liu–Layland RM sufficient utilization bound only when its assumptions hold and use exact response-time iteration when blocking and non-harmonic interference matter.
10. Contrast fixed-priority RM with EDF without claiming 100 percent utilization in a real MCU after ISR, blocking, overhead, dependency and aperiodic faults are added.
11. Diagnose priority inversion and choose priority inheritance/ceiling, lock-free snapshot, bus-owner task or critical-section redesign with a bounded blocking term.
12. Separate RTOS tick, peripheral timer, synchronized fieldbus clock and host ROS clock; handle wraparound with modular elapsed-time arithmetic.
13. Bound CAN/EtherCAT command age and multi-axis skew, and distinguish bus link health from current-cycle command validity.
14. Validate stack high-water, allocation, logging budget, fixed/floating numeric range, saturation, unit conversion, NaN and sensor plausibility outside the critical loop.
15. Build a fault ladder in which independent hardware protection can disable power, firmware latches cause and safe state, the host receives observed actuator state, and restart requires a supervised transaction.
16. Produce an end-to-end device contract from host send through physical output acknowledgement, with measured trace points and a stop/degrade decision for each violated invariant.

The article passes only when all sixteen premises have visible public evidence and each Viz changes a measured timing, ownership, schedule, numeric or fault consequence.

## Source and intent ledger

| Source locator | Original claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| Current FreeRTOS task-priority and scheduling documentation | Default single-core scheduling is fixed-priority, preemptive and highest-ready-first; equal-priority time slicing is configurable; a continuously ready high-priority task can starve lower tasks. | An API scheduler description does not prove an application schedulable or bound ISR, driver, bus and shared-resource delays. | Ground task states, preemption and starvation in current behavior. | RTOS timeline lab and task-contract table. |
| Current FreeRTOS interrupt configuration and mutex documentation | ISR code should remain short and wake a handler task; API-calling interrupts obey configured priority boundaries; mutexes provide a simplified priority-inheritance mechanism and are not ISR primitives. | Priority inheritance limits inversion but does not remove all blocking or nested-lock complexity. | Connect NVIC/ISR/task handoff and shared-resource policy to response time. | ISR/DMA lab and priority-inversion lab. |
| Arm Cortex-M/NVIC official documentation | NVIC provides configurable, nested, vectored interrupt priorities close to the core. | Implemented priority bits and vendor mappings differ; numerical priority conventions can be inverted. | Explain that hardware interrupt arbitration precedes RTOS task scheduling. | Interrupt nesting timeline and configuration checklist. |
| ROS 2 Rolling `rclc` executor documentation | `rclc` supports user-defined sequential order, trigger conditions, scheduling configuration and ideas from Logical Execution Time; LET reads inputs at period start and intends outputs at period end. | Documentation notes output-at-period-end is not fully implemented in the described LET path; host `rclcpp` behavior and microcontroller execution are not identical. | Bridge the prior ROS 2 runtime article to periodic embedded data-age semantics without claiming full LET automatically. | Host/MCU boundary and copy-in/compute/latch timeline. |
| EtherCAT Technology Group current technology and implementation guide | Distributed Clocks compensate propagation and synchronize device actions in hardware to much better than 1 microsecond for suitable systems; acquisition can be triggered by local synchronized time rather than frame arrival. | This does not bound application task execution, drive response, cable faults, or every deployment's achieved accuracy. | Separate synchronized actuation time from telegram arrival jitter and host clock. | Multi-axis distributed-clock lab and fieldbus contract. |
| Liu & Layland, JACM 1973 | Under five explicit assumptions, simultaneous release is the critical instant for fixed priority; rate-monotonic priority assignment is optimal among fixed-priority assignments; `m(2^(1/m)-1)` is a sufficient least-upper utilization bound; deadline-driven scheduling is optimal with utilization up to one. | Single preemptive processor, independent periodic tasks, deadline=period, constant/max runtime, and special aperiodic work; modern ISR, blocking, jitter, dependencies, multicore, caches and I/O require extended analysis. | Supply the foundational paper spine and teach proof assumptions as part of the formula. | Dedicated paper reconstruction, critical-instant schedule lab and current-MCU counterexample. |

## Narrative sections

### 01. A controller output is not yet an actuator command

- Trace `u_k` through host serialization, fieldbus, drive receive, target cycle, control law, PWM latch, power stage and physical acknowledgement.
- Define command envelope and distinguish requested, accepted, applied and observed state.
- Viz: toggle epoch, target cycle, validity and ack fields; inject restart/delay and show which command can reach PWM.

### 02. Real time means a consequence before a deadline

- Separate fast average, deterministic bound, hard/firm/soft deadline and failure consequence.
- Define release, start, finish, response, jitter, slack and deadline.
- Put the physical deadline at the next safe PWM latch or control effect.
- Viz: move WCET, release jitter and latch phase; show response/slack and whether a superficially early function still misses the latch.

### 03. Hardware should define sample-compute-actuate order

- Use one peripheral timer to trigger ADC/encoder capture and PWM update.
- Compare hardware trigger with software-sequential sampling.
- Explain center-aligned PWM quiet windows, shadow register and one-cycle delay at bridge depth.
- Viz: move ADC trigger phase and computation completion; show channel skew, current error and actual duty-cycle application cycle.

### 04. ISR and DMA are ownership protocols

- Trace peripheral event -> NVIC -> bounded ISR -> DMA completion -> release -> task -> buffer return.
- Compare ping-pong, ring and latest-snapshot ownership.
- Explain memory visibility, overrun counters and why logging/formatting does not belong in the critical ISR.
- Viz: change ISR work, interrupt priority, DMA buffer count and consumer time; show nesting, data corruption, lost sample and deadline margin.

### 05. An RTOS schedule is a proof model, not a task list

- Build the task ledger `(T or minimum inter-arrival, C, D, J, priority, blocking, stack, resources)`.
- Show fixed-priority preemption and critical instant.
- Introduce utilization as load, not a complete proof.
- Viz: schedule current, velocity, fieldbus and telemetry tasks; toggle simultaneous release and expose completion/deadline.

### 06. Shared resources add blocking to high-priority response

- Reconstruct low/medium/high priority inversion.
- Compare mutex inheritance, priority ceiling, bus-owner task and lock-free snapshot.
- Derive fixed-priority response iteration with blocking and release jitter.
- Viz: choose resource protocol; show the exact interval that blocks the current loop and whether inheritance bounds it.

### 07. Fieldbus time is not host arrival time

- Compare CAN arbitration/priority bridge and cyclic EtherCAT process data.
- Separate link operational, frame received, current epoch valid, target cycle met and axes synchronized.
- Explain distributed clocks, sequence, epoch, timeout, emergency path and acknowledgement.
- Viz: change bus jitter, clock skew, FIFO depth and target-cycle policy; show command age and six-axis skew.

### 08. Memory and numbers are timing and safety contracts

- Prefer initialization-time allocation and bounded queues in critical paths.
- Track stack high-water, buffer bounds, log budget and fault-safe telemetry.
- Explain modular timer arithmetic, fixed-point scale/range/saturation and NaN/unit gates.
- Viz: tune timestamp near wrap, current scale and command magnitude; compare naive and modular elapsed time plus wrap/saturation outcome.

### 09. Watchdogs must observe the physical effect

- Separate CPU alive, task alive, fresh input, valid output, driver enabled and motor responding.
- Build fault ladder: hardware comparator/gate disable -> firmware fault latch -> safe output -> host state/ack -> supervised reset.
- Compose host and device response into one acceptance gate.
- Viz: inject deadline, sensor, numeric, driver and acknowledgement faults; show which layer catches it and whether PWM can remain enabled.

## Formula contract

- Display formulas: command validity gate, response/slack/latch cycle, channel sample skew, ISR/task release, task utilization, Liu–Layland RM bound, fixed-priority response iteration with blocking/jitter, command age and multi-axis skew, modular timestamp difference, fixed-point scale/saturation, device health/actuation gate, host-to-physical response.
- Every display uses `String.raw`, Korean `underbrace` annotations and a `FormulaNote` explaining symbols, units, why the operation exists and when it is invalid.
- Long equations split by semantic operation. Minimum rendered scale is 0.75 at 360 px with no horizontal scroll.

## Viz design contract

- Each Viz changes a causal variable and exposes a measured result: accepted/applied command identity, latch miss, sample skew, ISR margin, DMA corruption, task response, blocking, bus age/axis skew, timestamp/numeric fault, or PWM gate state.
- Timelines use restrained 1-3 px lines, round caps and a stable millisecond/microsecond scale. Callback/task bars use compact symbols plus an external legend at narrow widths.
- Responsive HTML carries all essential labels; SVG is reserved for clocks, schedule geometry and signal paths. Mobile layouts become vertical causal order rather than miniaturized desktop graphs.
- Color roles: blue measurement/data, teal device runtime, violet scheduling/clock control, amber wait/stale/saturation, emerald bounded/valid, red only corruption/deadline/fault/unsafe power.
- Continuous animation is deferred until static interactions and responsive bounds pass. Later motion is justified only for timer phase, interrupt nesting, DMA ownership and PWM latch order.
- Verify initial, worst and recovery states at 360, 390, 768 and 1440 px with zero document overflow, inner scroll, clipped text, raw LaTeX, missing Korean annotation, uncontrolled whitespace or right-edge truncation.

## Paper spine

1. Liu & Layland 1973: reconstruct environment assumptions, critical instant, RM optimal fixed-priority assignment, utilization bound, deadline-driven/EDF result, mixed scheduling, limitations and current embedded legacy.
2. Sha, Rajkumar & Lehoczky priority inheritance/ceiling: future resource-sharing paper after the embedded blocking section exists.
3. Giotto/Logical Execution Time: future deterministic data-age paper connecting `rclc` and time-triggered control.
4. Park/Blaschke and modern FOC: next motor-control concept/paper phase after the host-to-MCU execution contract is complete.

## Coverage gate

| Hard-problem premise | Public evidence required |
|---|---|
| Timeline identities and physical acknowledgement | Sections 01/02 command and deadline labs |
| Epoch/target cycle/validity/ack | Section 01 envelope formula and lab |
| Stale command FIFO | Sections 01/07 queue and target-cycle behavior |
| PWM latch deadline | Sections 02/03 timeline and latch metric |
| ADC/encoder simultaneity | Section 03 sample-skew lab |
| Bounded ISR and deferral | Section 04 nesting timeline |
| DMA ownership and reuse | Section 04 buffer state/overrun metric |
| Complete task ledger | Section 05 task table and Viz |
| RM bound assumptions and exact response | Sections 05/06 plus paper reconstruction |
| RM versus EDF boundary | Section 05 and paper evidence |
| Priority inversion and bounded blocking | Section 06 resource-protocol lab |
| Clock separation and wraparound | Sections 03/07/08 |
| Link health versus valid command | Section 07 fieldbus gates |
| Stack/allocation/logging/numeric faults | Section 08 memory/numeric lab |
| Hardware/software/host fault ladder | Section 09 fault lab |
| End-to-end device execution contract | Section 09 host-to-physical gate |

## Direct entry contract

- Open with the gap between pressing a software light switch and the physical lamp actually changing.
- Define requested command, small control chip, measurement, calculation cycle, and output before MCU, ISR, DMA, RTOS, or PWM terminology appears.
- The first formal question follows receive -> sample -> compute -> latch -> observe and keeps the physical deadline visible.
