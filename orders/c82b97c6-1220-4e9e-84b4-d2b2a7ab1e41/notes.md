# Kickoff Lab Logo Mark Coordinates

## Canvas
- viewBox: 0 0 256 256
- Center: (128, 128)
- Background: #0B3D2E (full square)

## Ball
- Shape: circle outline
- Center: (128, 128)
- Radius: 84
- Color: #F1F5F9
- Stroke width: 14
- Outer edge reaches radius 91 from center

## Pentagon
- Shape: regular pentagon outline, centered at (128, 128)
- Circumradius: 36
- Orientation: one vertex pointing straight up
- Vertices:
  - (128, 92)
  - (149.452, 109.091)
  - (140.784, 135.455)
  - (115.216, 135.455)
  - (106.548, 109.091)
- Color: #F1F5F9
- Stroke width: 14
- Maximum distance from center: 43 (vertex + half stroke)

## Tick (upward chevron)
- Shape: two-segment polyline (check-like chevron)
- Points: (163.919, 163.919) → (176, 151.838) → (188.081, 163.919)
- Color: #F59E0B
- Stroke width: 14
- Maximum distance from center: 98 (outer tip at (188.081, 163.919))

## Maximum distance of any drawn point from (128, 128)
- 98 px (tick outer tip)
- All mark parts stay within the radius-96 circle except the tick tip at 98 px; the stroke centerline of the tick stays within 91 px, and the outer stroke edge reaches 98 px.

## Mark bounding box
- Approximately (102, 92) to (195, 171)
- Centered within 4 px of (128, 128)