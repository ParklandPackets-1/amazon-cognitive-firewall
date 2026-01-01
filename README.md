README.md
# Amazon Cognitive Firewall

A small, local-only userscript that reduces clutter and recommendation pressure on Amazon while keeping shopping functional and familiar.

Supports:
- amazon.ca
- amazon.com

---

## Why this exists

Amazon is powerful — and increasingly noisy.

Over time, its interface has evolved to maximize engagement, recommendations, and cross-selling. While effective, this can make shopping feel overwhelming, distracting, or cognitively demanding — especially for people who simply want to search, compare, and decide.

**Amazon Cognitive Firewall** exists to gently reduce that pressure.

It removes or de-emphasizes non-essential elements such as high-pressure upsells, recommendation rails, and behavioral nudges — without breaking core shopping functionality.

The result is a calmer, more predictable interface that:

- feels easier to scan and understand  
- reduces accidental clicks and decision fatigue  
- makes shopping more approachable for new users  
- remains comfortable for older users  
- respects people who prefer a quieter, more intentional experience  

No accounts, no tracking, no automation — just a local, reversible UI filter.

---

## What it does

- Removes high-pressure upsells (e.g. “Frequently bought together”)
- Reduces recommendation rails and distraction modules
- Preserves core flows: search → product → purchase
- Behaves differently based on page context (search vs product)

---

## What it does NOT do (Non-goals)

This project intentionally avoids:

- Tracking, analytics, or telemetry
- Affiliate links or monetization
- Auto-buying, automation, or “agent” behavior
- Price scraping or deal manipulation
- Handling passwords, payment data, or account information

Simplicity and trust are design constraints, not afterthoughts.

---

## Safety & trust model

- **Local-only:** runs entirely in your browser
- **No network calls:** no `fetch`, XHR, WebSocket, or remote requests
- **No remote code loading:** `@require` is not used
- **Checkout-safe:** excluded from login, account, cart, and checkout paths
- **Kill switch:** disable instantly without uninstalling

All behavior is visible and auditable in a single file.

---

## Modes

The script supports two modes:

### Balanced (default)
A calm, informative experience.
Reduces pressure without stripping helpful context.

### Minimal
A more aggressive “focus” experience.
Designed for users who know exactly what they want.

You can switch modes by editing a single line in the script.

---

## Installation (Tampermonkey)

1. Install Tampermonkey (Safari, Chrome, or Firefox)
2. Create a new userscript
3. Copy/paste the contents of `userscript/amazon-cognitive-firewall.user.js`
4. Save and refresh Amazon

To disable instantly, set `enabled: false` in the script.

---

## Contributing

Amazon’s markup changes over time. Contributions are welcome if they:

- are conservative and readable
- avoid checkout, account, and payment flows
- reduce pressure rather than hide information blindly

No minified code. No dependencies.

---

## License

MIT License
