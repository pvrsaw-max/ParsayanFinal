# Parsayan V22 Release QA

## Added
- New premium landing identity and custom inline SVG icon system (no external icon dependency).
- Distinct visual treatments for categories.
- Cinematic Auction, Duel and active Coup/Power states.
- Secret-power cards with descriptions and icons.
- Game Pulse for in-match correct-answer momentum.
- Responsive refinements for small phones, phones, tablets, desktop and landscape.
- Explicit multiple-choice selection and result feedback retained: correct/wrong state, correct answer and explanation.

## Verified locally
- challengeTiersV16: 24/24 PASS
- browserHardeningV15: 8/8 PASS
- stateMachineV14: PASS (1000 simulated games / 99,733 checks)
- stressEdgeV13: 36/36 PASS
- deepAuditV12: 34/34 PASS
- auditRegression: 10/10 PASS
- fullFlow: 19/19 PASS
- secretResumeTie: 18/18 PASS
- GitHub workflow uses Node 22, npm install without npm cache/package-lock requirement, test:audit, Vite build, Pages artifact and deploy-pages.

## Build note
Local npm install timed out in the execution environment before dependencies were available, so the Vite production build was not claimed as locally verified. GitHub Actions remains the authoritative production build check.
