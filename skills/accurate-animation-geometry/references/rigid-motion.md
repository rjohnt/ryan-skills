# Rigid hinged motion

## Coordinate model

For a laptop example, use X across the hinge, Y forward along the keyboard deck, and Z upward. Place the hinge on `Y = Z = 0`. A lid of width W and length L has inner corners at `X = ±W/2`, with its far edge:

```
Y = L cos(theta)
Z = L sin(theta)
```

Here theta is pi/2 when upright and zero when closed. The two hinge vertices remain fixed. The distance from either hinge vertex to its corresponding far vertex is always L.

The lid's outer face is offset along its rotated normal by its thickness T:

```
normal offset = [0, -T sin(theta), T cos(theta)]
```

At closure the inner face is on the deck's `Z = 0` contact plane, while the outer face is at `Z = T`. The base extends downward to `Z = -baseThickness`. This gives three distinct layers: lid exterior, contact seam, and chassis. Do not place the lid exterior below the deck to make silhouettes fit.

The base's front corners are `[±W/2, L, 0]`, exactly the same as the lid's inner far corners when theta reaches zero. Construct both from shared dimensions. Do not maintain separate hand-tuned closed outlines.

For a different joint axis, use Rodrigues rotation around an axis point. Rotate all body vertices and surface normals with the same transformation.

## One camera for all surfaces

A useful minimal perspective projection for this particular frontal example is:

```
q = 1 - Y / distance
screenX = centerX + (X + horizontalShear * Y) / q
screenY = hingeScreenY + (elevation * Y - Z) / q
```

Its camera-space coordinates are `[X + shear*Y, elevation*Y - Z, distance - Y]`. Every part uses the same denominator. Keep all geometry in front of the near plane; do not clamp invalid depth to hide a camera error.

This model provides coherent projective geometry, not a full lighting system. A standard view/projection matrix is also appropriate and is preferable for broader camera movement.

Before closure, the far lid edge widens because it approaches the camera. Its hinge edge stays fixed. The screen becomes a trapezoid. Changing only its height creates a rectangular squash, not a perspective rotation.

## Visibility and texture

Use the signed area of the projected lid polygon or a normal/view-direction test to choose the visible face. Near an edge-on pose, the face's area approaches zero and the lid's thickness supplies the silhouette. Avoid drawing a full inner screen and a full exterior shell simultaneously.

Map screen content onto the same physical plane. For Canvas 2D, subdivide the source image into a mesh, project each vertex, and render clipped affine triangles. Increase subdivisions only if visible distortion warrants it; inspect anti-aliased cracks between triangles. In a 3D renderer, use a textured plane attached to the lid.

Be careful with layer ordering: checkpoint packets or labels may need to appear above the laptop even when its body is rendered on a separate canvas. Coordinate all render layers in the same logical viewport. Capture the composed scene for image/GIF exports; an SVG-only export will omit a separate canvas.

## Sampling and acceptance

Sweep the joint angle, not just the animation timestamp. This separates bad geometry from easing. Include dense samples around visibility changes and contact.

For this example, inspect theta values near 90°, 60°, 30°, 10°, 5°, 1°, and 0°. Validate hinge errors, rigid lengths, and contact distances. Compare world-space clearances against the deck plane to detect penetration. Set numerical tolerances relative to model size; avoid making a large projected-pixel tolerance excuse a physical overlap.

The recurring failures that motivated this workflow were independent screen shrinking, a separate closed-lid replacement, mismatched front edges, and checking only the final pose. The correction was a single rigid lid with a shared camera and shared mating dimensions.
