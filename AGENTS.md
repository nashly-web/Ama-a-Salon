<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- The nail studio (`/estudio`) keeps each step screen in `src/components/estudio/`; the route only holds shared state, so screens stay small and testable.
- Per-finger design assignment is the source of truth for design counts, so the hand view and the price always agree.
- The design scanner (`/escaner`) only maps photos to catalog ids from `src/lib/nails.ts`; prices always come from `totalPrice`, never from the model, so the quote matches the Estudio.
- Scanner AI calls live in `src/lib/scan.server.ts` behind the `scanNails` server function; photos stay in memory and only the resulting design passes to the Estudio via sessionStorage, so no image is ever stored.
- Nail systems are mutually exclusive: every system pick goes through `selectSystem` in `src/lib/nails.ts`, so the Estudio, the scanner and the handoff never hold two systems.
- Estudio step access goes through `canReach` in `src/lib/estudio-steps.ts` (only Sistema and Forma are required), so the step pills, Siguiente and the send button share one rule.
- Quote sending uses free WhatsApp share links built in `src/lib/whatsapp.ts` (`api.whatsapp.com/send`, not wa.me, whose redirect breaks emojis), addressed to the phone typed in the Envío form, so no paid API or stored messages are needed.
