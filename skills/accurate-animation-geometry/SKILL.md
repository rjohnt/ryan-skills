---
name: accurate-animation-geometry
description: Build or refine animations of rigid objects when hinges, perspective, occlusion, or mating surfaces must remain geometrically consistent throughout motion. Use for closing laptops, folding panels, rotating lids, articulated mechanisms, and similar physical animation problems.
---

# Accurate Animation Geometry

Animate a physical model rather than independently adjusting its visible parts. A convincing final frame does not establish that the motion is correct.

## Establish the model

Identify the rigid bodies, dimensions, hinge or joint axes, camera, thickness, and intended contact surfaces. Use the user's chosen visual style and composition. For a genuinely flat diagram, a constrained 2D construction can suffice; use a shared 3D model when surfaces turn toward or away from the camera or perspective matters.

Keep object coordinates, camera projection, and animation timing separate. Rotate each rigid body about its joint in object space, then project all of its surfaces through the same camera. Attach screens, textures, borders, ports, and highlights to that body. Derive shadows from the pose when they materially affect depth perception.

A hinged lid needs one fixed axis and a constant physical length. The base and the lid's mating surface must share their contact geometry. Give the lid and base separate thickness; distinguish the lid's inner contact plane, outer shell, and edge faces.

Do not fix a broken model by shrinking the screen independently, widening arbitrary corners, clamping a moving edge into place, or fading in a replacement closed object. Those techniques can make an endpoint look correct while introducing stretching, floating hinges, or intersections during motion.

For mathematical construction and a worked laptop example, read [references/rigid-motion.md](references/rigid-motion.md). The dependency-free [scripts/rigid-hinge.mjs](scripts/rigid-hinge.mjs) supplies axis rotation, projection, a lid model, and invariant checks; adapt its example dimensions rather than treating them as required.

## Render coherent surfaces

Choose a renderer appropriate to the output: a small canvas projection, CSS 3D, or a 3D engine can all work. Check front/back visibility from the transformed normals or projected winding. Account for edge faces and thickness near the edge-on pose. Render the newly visible exterior at the actual visibility transition, rather than an arbitrary percentage of the timeline.

If mapping a flat screen image onto a projected plane, use a projective texture mapping or a sufficiently subdivided mesh. An affine scale of the whole screen cannot describe a perspective trapezoid. Inspect texture seams and small labels after projection. Exports must capture the actual renderer: serializing an SVG does not capture a canvas overlay or its current contents.

## Separate mechanics from timing

Animate an angle or joint parameter and apply easing to that parameter. The geometry stays rigid regardless of easing. Respect prerequisite events: for example, close the laptop only after its handoff completes. A rebound is a small joint rotation away from contact, not penetration into the other body.

When the user requests alternatives for selection, deliver playable animation variants. Hold the important mechanical invariants constant while varying the requested aspect—camera angle, depth, pacing, or contact motion. Keep the accepted composition and other approved components intact. Static storyboard frames are optional planning views, not substitutes for animation alternatives.

## Inspect the whole motion

Check initial pose, intermediate angles, the edge-on visibility transition, near-contact, settled contact, and the loop reset. Scrubbing is useful for geometry review; offer replay of the close segment and the full sequence when appropriate. Optional edge/hinge markers make attachment and contact easier to inspect.

Verify meaningful invariants:

- Joint endpoints coincide with the fixed body's hinge throughout motion.
- Rigid edge lengths stay constant in object space; projected lengths may change.
- At contact, corresponding mating vertices or planes coincide within a stated tolerance.
- Before contact, moving geometry remains on the permitted side of the stationary surface.
- Front/back and edge visibility agree with the pose, without gaps or duplicate shells.

Use numerical checks and rendered frames together. Neither alone detects every problem. Include near-contact samples instead of checking only the exact endpoint. For the example helper, run `node scripts/rigid-hinge.mjs --self-test`.

Preview and test in the user's preferred browser. Check playback, pause, replay, range scrubbing, inspection toggles, reduced motion, and responsive containment. Target timeline inputs explicitly when checkboxes coexist with sliders. After geometry changes, refresh the relevant previews and exports so they agree.
