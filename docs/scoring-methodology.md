# Priority and confidence methodology

All factors are normalized to 0–100 and stored with the run configuration.

## Priority

`0.35 × severity + 0.25 × critical infrastructure + 0.20 × population exposure + 0.10 × accessibility difficulty + 0.10 × confidence`.

Severity combines change intensity, changed-pixel percentage and flood probability. Critical infrastructure prioritizes hospitals, major bridges/routes, shelters/schools, then ordinary buildings. Population exposure combines density, estimated exposed people and residential footprint. Accessibility difficulty combines road blockage, distance from facilities, isolation and terrain where available. Confidence is the quality-adjusted evidence signal.

## Confidence

`0.40 × method agreement + 0.25 × image quality + 0.20 × temporal closeness + 0.15 × spatial consistency`.

Cloud coverage, distant pre-event capture, missing bands, patchy polygons and missing supporting layers lower confidence. Every score generates evidence bullets, uncertainty factors and a recommended verification action. Score explanations use “potentially affected” and “requires field verification” rather than confirmed-damage language.
