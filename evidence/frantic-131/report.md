# Ausca Document OCR run - Frantic bounty #131

- Discovery (176 ms): read the live skill and catalog, selecting document.ocr revision ocr-fixed-r8.
- Artifact commit (2902 ms): idempotently committed 135230 PNG bytes as runx:artifact:sha256:65490e1979134a6db062b273f9e26b273f16eee531bd0652ecdadaa470813fcd; the digest matched sha256:2193ab93788ed2dccfeaad06967deb0db2fe447d24ec2e51cd906b359e1b8ba0.
- Challenge (3552 ms): preparation returned the settled invocation paid_46a26d7c-d804-4d85-9b1c-255bfab508bd with exact Base native USDC, amount 250000 base units, and payTo 0x26572fF23c6c52bfB1a69cB0C9114a8Be443B422.
- Payment (5180 ms): independently verified one successful x402 settlement in 0x60e70cffb69d92ec4508e54286d68cdc0ab027a69875cfd68e368f6025daa473; the recovery submitted no additional payment.
- Invocation (4871 ms): authoritative GET returned succeeded; invocation updated at 2026-09-21T14:28:03.382Z.
- Wait (5180 ms): the observed payment-block-to-terminal-update interval was 4382 ms.
- Result (5180 ms): output validated as ausca.document_ocr.output.v1; source_digest matched the committed artifact and contained 10 OCR line(s).
- Receipt (5978 ms): public receipt read back at https://runx.ai/r/717f68fae2fdf7be3bb486679580bde8f97acc217f3a043fc1b82fbf77d6f4d3.

- Niggle 1 (POST /v1/artifacts): the byte commitment is a separate free step; a copy-ready HTTP example would make non-CLI integrations less error-prone.
- Niggle 2 (PAYMENT-RESPONSE): payment settlement and OCR completion are distinct signals; the client must not treat settlement alone as proof of a result.
- Niggle 3 (catalog.json:request_example): the live envelope needs multiple revision and schema digests; a generated canonical request would reduce hand-built binding mistakes.
- Concrete change: add an end-to-end curl or JavaScript example that commits an image, sends the unsigned request, retries with PAYMENT-SIGNATURE, polls the invocation, and verifies source_digest.

Receipt: https://runx.ai/r/717f68fae2fdf7be3bb486679580bde8f97acc217f3a043fc1b82fbf77d6f4d3
