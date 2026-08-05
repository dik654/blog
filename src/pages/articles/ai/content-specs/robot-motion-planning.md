# Robot Motion Planning content spec

## Goal

- Reader outcome: the reader can turn workspace geometry into a configuration-space feasibility problem, distinguish a valid state from a valid motion, choose and diagnose grid, PRM and RRT planners, and explain why a geometric path is not yet executable.
- System invariant: a plan is executable only when every state and edge has been checked against a named planning-scene version, the path has been time-parameterized within limits, and the start state is revalidated immediately before execution.

## Scope decision

| Topic | Depth | Why |
|---|---|---|
| Configuration space and C-obstacles | deep | Collision between extended bodies becomes point membership and path connectivity in a space whose coordinates are robot degrees of freedom. |
| State validity and edge validity | deep | Collision-free endpoints do not imply a collision-free interpolation; this is a common production failure. |
| Topology, angle wrap and distance metric | deep | Joint spaces are often products of circles and intervals, so naive Euclidean distance can choose the long way around. |
| Graph search and A* | deep | Sampling creates a graph or tree; search decides which feasible route is actually returned. |
| Grid planning | medium | It makes completeness and discretization visible, then exposes the curse of dimensionality. |
| PRM | deep | It separates reusable roadmap learning from repeated query search and reveals local-planner and narrow-passage failures. |
| RRT and RRT-Connect | deep | It explains single-query exploration and why Voronoi bias reaches large unexplored regions quickly. |
| Completeness and optimality vocabulary | deep | Probabilistically complete, resolution complete, feasible and asymptotically optimal are not interchangeable claims. |
| Smoothing and clearance | medium | A jagged feasible path can be shortened, but every shortcut must be collision checked and clearance-aware. |
| Time parameterization and execution | deep handoff | A planner usually returns a geometric path; velocity, acceleration, scene freshness and controller tracking remain separate gates. |
| Kinodynamic planning and trajectory optimization | bridge | Important successors, but full dynamics and nonlinear optimization deserve their own phase. |

## Reader prerequisites

- Coordinate frames, forward kinematics, inverse kinematics and joint limits.
- Vector norms, graph basics and derivatives at the level of the foundation curriculum.
- Feedback control as the distinction between a desired trajectory and physical tracking.

## Private hardest transfer problem

Do not publish this as a standalone exercise. Use it as the completeness gate for the prose and Viz.

A 2R robot arm must move a tool from an elbow-down start to an elbow-up goal around a shelf. Both endpoints satisfy joint limits and are collision-free, but the straight joint interpolation intersects the shelf halfway through. Joint 1 is continuous and the two endpoint values lie near +pi and -pi, so a naive Euclidean metric measures an almost full revolution instead of a short wrapped motion. A narrow connected passage exists in free C-space. The collision checker samples only edge endpoints at first. A planner eventually finds a path, but its waypoints have no timestamps. While it plans, a box is attached to the gripper and the planning-scene version changes.

The reader must be able to:

1. Define C, C_obs and C_free and explain why a workspace shelf becomes a region in joint-angle space.
2. Show that valid endpoints do not prove a valid edge and choose a collision-checking resolution or continuous check that cannot silently skip the shelf.
3. Use wrapped angular distance for a continuous revolute joint and explain how a wrong metric changes nearest-neighbor selection and path cost.
4. Run A* on a small roadmap using g + h, state the admissibility condition, and separate graph-search correctness from missing roadmap connectivity.
5. Explain why a fixed grid grows exponentially with degrees of freedom and why coarse resolution can erase the narrow passage.
6. Trace PRM construction and query phases, including sampling, state checks, neighbor selection, local planning and graph search.
7. Trace RRT expansion and explain Voronoi exploration bias without claiming that the first solution is shortest.
8. Distinguish deterministic completeness, resolution completeness, probabilistic completeness and asymptotic optimality.
9. Smooth a path only through validated shortcuts and preserve clearance instead of optimizing length alone.
10. Convert q(s) to q(s(t)), enforce velocity and acceleration limits, and explain why timestamps cannot be inferred by the controller.
11. Reject or replan when the start state or planning-scene version has changed before execution.

The article passes only when every premise has a visible public location and at least one interactive visual consequence.

## Source and intent ledger

| Source locator | Original claim | Boundary | Inclusion intent | Public transformation |
|---|---|---|---|---|
| Lozano-Perez 1983, Spatial Planning: A Configuration Space Approach | Build geometric objects containing every colliding configuration, then reduce Findspace and Findpath to point and path search outside those objects. | Exact construction becomes difficult with rotation, articulation and high dimension; geometric models and motion are uncertain. | Establish the conceptual reduction on which later planners operate. | Linked workspace/C-space lab and C-obstacle equation. |
| Lynch & Park, Modern Robotics Ch. 9-10 | A trajectory is a path q(s) plus time scaling s(t); motion planning uses C-space, graph search, grids, samples, potentials and optimization. | The survey does not select one universal planner and separates geometric planning from dynamics. | Build the bottom-up vocabulary and responsibility boundaries. | Path-versus-trajectory pipeline and planner decision ledger. |
| Kavraki et al. 1996, Probabilistic Roadmaps | A learning phase stores collision-free configurations and local paths in a reusable graph; a query phase connects start and goal and searches it. | Scene-dependent parameters, local planner and difficult regions determine practical coverage. | Explain multi-query sampling as an inspectable system, not a random magic box. | Seeded PRM construction lab with visible samples, rejected edges and query path. |
| Kavraki, Kolountzakis & Latombe 1996 conference / 1998 journal, Analysis of Probabilistic Roadmaps for Path Planning | Given a postulated path, failure-probability bounds depend on path length, distance from C-obstacles and roadmap node count; the proof covers the path with free balls sampled independently. | This is later formal analysis, not a theorem supplied by the 1996 roadmap experiments. Its simplified straight-line local connection, sampling and clearance assumptions must remain visible. | State probabilistic completeness as a conditional asymptotic contract and prevent finite-deadline, arbitrary-sampler or optimality overclaims. | Conditional failure formula plus a support/radius counterexample in the PRM paper article. |
| LaValle 1998, Rapidly-Exploring Random Trees | Repeated random targets and nearest-tree extensions create an exploration-biased tree suitable for high-dimensional and constrained planning. | Basic RRT is a feasible-path method, not an optimality guarantee; metric and steering matter. | Contrast reusable roadmap coverage with single-query tree growth. | Deterministic RRT stepper sharing the same world as PRM. |
| OMPL official planner documentation | Modern OMPL exposes PRM, LazyPRM, PRM*, RRT, RRTConnect, RRT* and other planners with different query and guarantee profiles. | Planner class names do not choose collision resolution, metric, objective or deadline correctly by themselves. | Connect classical papers to current implementation choices. | Planner-selection matrix and configuration checklist. |
| MoveIt planning pipeline and time-parameterization docs | Motion planners typically return kinematic paths; adapters validate requests, post-process paths and attach velocity/acceleration-constrained timing using the robot model and planning scene. | A successful planning response can become stale before execution and does not prove controller tracking. | Close the gap from algorithm demo to production motion. | Plan-simplify-time-revalidate-execute pipeline with scene version gate. |

## Narrative sections

### 01. IK gives a pose, not a route

- Start with two safe arm poses whose direct interpolation collides.
- Define configuration q and C-space before naming algorithms.
- Linked Viz: animate one point in C-space and the corresponding full robot in workspace.

### 02. C-obstacles turn body collision into point membership

- Define C_obs = {q in C | R(q) intersects O} and C_free = C minus C_obs.
- Show a sampled 2R C-space map generated from actual segment-obstacle collision tests.
- Explain connected components: no planner can connect start and goal if they lie in different components.
- Cover circle topology and wrapped joint distance.

### 03. A valid state is not a valid edge

- Define StateValid(q) and MotionValid(q_a, q_b).
- Show endpoint-only checking failing while intermediate samples reveal collision.
- Explain discrete resolution, recursive subdivision and continuous collision detection boundaries.
- Include robot radius, attached-object geometry, safety margin and model uncertainty.

### 04. Search needs a representation of free space

- Build graph vocabulary: nodes, weighted edges, paths and trees.
- Derive Dijkstra and A* as g(n) + h(n); an optimistic heuristic preserves optimality on the represented graph.
- Make clear that perfect A* cannot traverse a passage absent from the graph.
- Grid Viz: change resolution and watch memory/cell count and narrow-passage representation.

### 05. PRM separates learning from repeated queries

- Construction: sample, reject collision, choose neighbors, validate local paths, add edges.
- Query: validate endpoints, connect them to roadmap, run graph search.
- Diagnose narrow passages, bad distance scaling and expensive collision checking.
- Compare eager and lazy validation and fixed-neighbor PRM with PRM* only at the guarantee level.

### 06. RRT grows toward unexplored space

- Trace q_rand, q_near, Steer and q_new.
- Explain Voronoi bias geometrically: nodes owning large unexplored regions are selected more often.
- Contrast single-query RRT/RRTConnect with multi-query PRM and optimal descendants PRM*/RRT*.
- Viz: deterministic iteration slider and mode toggle; rejected extensions and current best path remain visible.

### 07. Planner guarantees answer different questions

- Feasible versus optimal; single-query versus multi-query; geometric versus kinodynamic.
- Deterministic complete, resolution complete, probabilistically complete and asymptotically optimal.
- Deadline is part of observed behavior: termination conditions change what a theoretical guarantee means in production.

### 08. A path becomes executable only after post-processing

- Shortcut and smooth with collision checks and clearance cost.
- Separate q(s) from s(t), then derive q_dot and q_ddot by chain rule.
- Apply joint velocity and acceleration limits during time parameterization.
- Revalidate planning-scene version, attached objects and measured start state before handing the trajectory to the controller.
- Log planner seed/type, scene version, collision-check resolution, path clearance, timing limits and execution status.

## Formula contract

Every display formula is authored with `String.raw`. Every paper-spine formula carries an in-equation Korean `underbrace` annotation and a nearby `FormulaNote`; concept-article formulas may use the matching entry in `foundationFormulaAnnotations.ts`. Formula notes identify the representation, operation, assumption and failure boundary. At 360 px, use aligned rows before scaling; no primary equation may require horizontal scrolling.

## Viz design contract

- Use responsive viewBoxes with at least 24 px label margins and no text anchored at the right edge.
- Geometry uses round caps, 1-3 px hierarchy and muted obstacle fills; active path, sample or invalid edge gets one saturated accent.
- Animation or sliders must change a measurable planner state, not decorate a static diagram.
- Workspace and C-space stay visually linked by a shared joint-state marker and status color.
- PRM/RRT random sequences are seeded so explanation, screenshots and tests are reproducible.
- Controls have stable height, wrap at mobile widths and never force document horizontal scroll.
- Desktop, 768 px and 360/390 px screenshots plus SVG text-bound checks are required.

## Paper spine

1. Lozano-Perez 1983: configuration-space obstacles as the geometric reduction underlying Findspace and Findpath.
2. Kavraki et al. 1996: a reusable probabilistic roadmap for high-dimensional configuration spaces.
3. LaValle 1998 is a full successor bridge in the concept article for this phase; promote it to a dedicated paper article in the later kinodynamic-planning phase, where control propagation and nonholonomic constraints can be reconstructed rather than omitted.

### Public paper transfer gates

These are evidence questions shown in the paper articles, not private exercises.

1. **C-space preservation test:** Change the moving body's reference point and configuration chart. Reconstruct both C-obstacles, then identify why workspace collision truth and free-space connectivity must agree while obstacle coordinates, metric length and apparent chart continuity may differ.
2. **C-space scope test:** Add a rotation degree of freedom or an attached body to the translation-only polygon problem. Identify exactly why the fixed-orientation Minkowski construction no longer spans the full configuration space, and determine which collision equivalence survives.
3. **C-space robustness test:** Inflate the body geometry by epsilon after computing an exact 2D visibility shortest path. Decide whether feasibility or optimality fails first and explain why the 1983 construction does not certify model uncertainty, timing or feedback tracking.
4. **PRM edge-contract test:** Give two collision-free nodes whose interpolation collides and one feasible pair never considered by the neighbor policy. Explain why stored edge validity is an implication rather than a biconditional.
5. **PRM completeness test:** Keep a positive-clearance path fixed, then independently set the sampler mass on one cover neighborhood to zero, shorten the connection radius below the cover overlap, and corrupt the edge checker. For each change, name the probabilistic-completeness premise that fails.
6. **PRM evidence-layer test:** Separate what the 1996 roadmap paper's static planar articulated-robot experiments support, what the 1996/1998 analysis proves under path and sampling assumptions, and what later LazyPRM and PRM* change. Do not use one layer as evidence for another.

## Coverage gate

| Hard-problem premise | Public evidence required |
|---|---|
| Safe endpoints but colliding interpolation | Sections 01 and 03, edge-validity lab |
| Workspace obstacle to C-obstacle | Sections 01-02, linked 2R workspace/C-space lab |
| Wrapped joint metric | Section 02 formula, numeric comparison and failure note |
| A* on represented graph | Section 04 search equation and graph/search boundary |
| Narrow passage and dimension | Sections 04-06, resolution and seeded sampling Viz |
| PRM and RRT execution order | Sections 05-06 and algorithm ledger |
| C-space preservation versus representation change | Lozano-Perez paper reader bridge, equations and all three evidence transfer questions |
| PRM sampling/local/query/completeness conditions | Kavraki paper reader bridge, implication edge contract and conditional asymptotic formula |
| Original-paper evidence versus later practice | Both paper evidence ceilings, legacy sections and source ledger |
| Correct guarantee vocabulary | Section 07 comparison table |
| Geometric path versus timed trajectory | Section 08 chain-rule equations and pipeline |
| Stale scene and start state | Section 08 revalidation gate and logging contract |
