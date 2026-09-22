# Ausca Agent Inbox run - Frantic bounty #135

- Discovery (707 ms): read the live SKILL.md, OpenAPI document, and catalog, selecting inbox.receive revision receive-duration-r4.
- Challenge (970 ms): the unsigned POST to /v1/open-inbox returned HTTP 402 with x402 v2, Base native USDC, 50000 base units, and payTo 0x26572ff23c6c52bfb1a69cb0c9114a8be443b422.
- Payment (1934 ms): signed one payment from 0xE7b1DD8d14C19382de3Bc9c408c841ea48803a4e; the settlement response reported transaction 0xd13acc814be0cf891e9839f25ae8e23df3e96130346616426469dc3f1c7d81f4.
- Invocation (2268 ms): paid POST returned HTTP 200; invocation paid_6423993b-fcf2-403e-88ca-716e2afadd97 reached accepted after 0 poll(s).
- Wait (2268 ms): preserved the private capability in host memory, then used the returned lease address inbox+9ddcb02a9fe2b4b6332e63568f5384af28ee40b0.34f51c2c63a4376e@mail.ausca.com for the inbound test.
- Result (4827 ms): AgentMail message msg_LGuO_GR5y_DJYBGlIN3TsXDQI_m4LvKYTxOp7D0JLsw matched the sent subject and marker, was read through the inbox capability, and the delete request was acknowledged with HTTP 200.
- Receipt (5779 ms): public receipt read back at https://runx.ai/r/a37b8baf1774ee7cb3edc84032074fbb7c3e4671926c6c14607caa56fb7535e3 with HTTP 200.

- Niggle 1 (POST /v1/open-inbox): the live catalog binding is easy to under-specify by hand because the revision and two schema digests are required; generate a copy-ready envelope.
- Niggle 2 (resource_access.capability): the useful lifecycle bearer is also a secret; the docs should show an explicit redacted host-bound handling pattern.
- Niggle 3 (GET /v1/agent-inboxes/{inbox_id}/messages): delivery is asynchronous and empty pages require cursor-preserving bounded polling; add a clearer next-poll hint.
- Niggle 4 (DELETE /v1/agent-inboxes/{inbox_id}): successful message validation still requires a separate cleanup call; include a finally-block example.
- Concrete change: provide one canonical JavaScript example covering unsigned 402 discovery, PAYMENT-SIGNATURE retry, capability-safe message polling, and deletion.
