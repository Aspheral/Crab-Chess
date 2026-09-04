# EXP-0011 source-identity note

EXP-0011 used a patch-based experiment wrapper. The GitHub pull-request head therefore identified the workflow, documentation, and patch file, while the tested engine source was produced inside CI by applying that exact patch to the accepted Crab baseline.

For audit purposes, do not treat the wrapper SHA alone as the candidate engine identity. The canonical reproducible identity for the tested candidate is:

- accepted Crab source: `e8cefaae1523776b4e783e2cb04cfa7389a08433`
- patch SHA-256: `1d8afa8b3e8af624d879ff0c49e71e0625cfdacce544c06a9c9e0e32b5612c3e`
- resulting applied engine diff SHA-256: `b446be6c1757cb33a57dbc6c6ac0a6eb7feb48a1476b1fbfd9ffed4d75ccf053`
- resulting tested candidate binary SHA-256: `546db943b54b57fe2c0338a93202cb338874b1d8ac2f6f4888c20633c58d022f`
- deterministic candidate bench: `2347163` nodes

This closes the audit-identity weakness discovered while the strength run was in progress without changing or rerunning the rejected search hypothesis.
