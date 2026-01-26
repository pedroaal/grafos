# AI / Developer Custom Instructions — Grafos ERP

## Purpose

Provide a single-source, machine- and human-readable instructions file for code generation, PR reviews, and on‑boarding AI assistants for the Grafos ERP project.

---

## Project snapshot 🔧

- Tech: **SolidStart** + **SolidJS**, **daisyUI**, **Appwrite** (backend).
- Forms & validation: **@modular-forms/solid** + **valibot**.
- Types: canonical types live in `src/types/appwrite.d.ts` — always import from there.
- Services: REST/SDK calls live under `src/services/**` (business logic belongs here).

> Important: follow existing patterns in `src/components/production/AreaModal.tsx` and `src/routes/app/(users)/profile/[[id]].tsx`.

---

## High-level rules for code & for the assistant ✅

- Favor small, focused PRs (one feature/bug per PR).
- Always import and use types from `src/types/appwrite.d.ts` (no ad-hoc shapes).
- Keep UI components presentational — move data fetching & business logic to `src/services/**` or `src/routes/**` loaders.
- Forms: use `@modular-forms/solid` + `valibot` schema per existing examples. Put the schema next to the component unless reused across pages.
- Accessibility: all interactive controls must have accessible labels and keyboard support.
- Security: never hardcode secrets; validate and sanitize inputs on server and client.
- Error handling: surface friendly messages via `addAlert` and log detailed errors to the console (or telemetry).
- Tests: add unit tests for complex logic and integration tests for important flows.
- Exports: prefer named exports for components and helpers; default export only when the file exports a single main component.

---

## Form pattern (required) — build example (extracted & simplified)

Source examples: `src/components/production/AreaModal.tsx`, `src/routes/app/(users)/profile/[[id]].tsx`.

```tsx
// Validation schema (valibot)
const AreaSchema = object({
  name: string(),
  sortOrder: number(),
});

type AreaForm = Omit<Areas, keyof Models.Row>;

// Component (modular-forms + valibot)
const [form, { Form, Field }] = createForm<AreaForm>({
  validate: valiForm(AreaSchema),
  initialValues: { name: '', sortOrder: 0 },
});

// Fill values when editing
createEffect(() => {
  const a = area();
  if (!a || !isEdit()) return;
  setValues(form, { name: a.name || '', sortOrder: a.sortOrder ?? 0 });
});

// Submit handler pattern
const handleSubmit = async (values: AreaForm) => {
  const loader = addLoader();
  try {
    if (isEdit()) await updateArea(id, values);
    else await createArea(tenantId, values as Areas);
    addAlert({ type: 'success', message: 'Saved' });
    closeModal?.();
  } catch (err: any) {
    addAlert({ type: 'error', message: err?.message || 'Save failed' });
  } finally {
    removeLoader(loader);
  }
};
```

Notes:

- Keep the valibot schema small and explicit; prefer `object({ ... })` instead of loose validation.
- Use `setValues(form, ...)` to populate forms on edit.
- Use `authStore.tenantId` for tenant-scoped creates.

---

## Code-generation / PR checklist for the assistant 📝

- [ ] Use types from `src/types/appwrite.d.ts`.
- [ ] Put data fetching in `src/services/**` and call from components/routes.
- [ ] Add/adjust valibot schema when changing form fields.
- [ ] Ensure accessibility (labels, aria-* where appropriate).
- [ ] Include unit tests for non-trivial logic; include at least one integration or route-level test for new flows.
- [ ] Keep changes backwards-compatible; document breaking changes.

---

## Where to look (quick links) 🔎

- Form examples: `src/components/production/AreaModal.tsx`
- Profile form: `src/routes/app/(users)/profile/[[id]].tsx`
- Types: `src/types/appwrite.d.ts`
- Services: `src/services/**` (search for the relevant domain)

---

## Coding-style questions — recorded answers + remaining (≥10) 💬

Thanks — your answers for questions 1–5 are recorded below. Please answer the remaining questions (6–15) so the assistant can auto-generate configs that match your style.

### ✅ Answers (from author)

1. Prefer `interface` for public data shapes and props.
2. **Yes** — all functions/components should have explicit return types.
3. Use **named** exports for React/Solid components.
4. Preferred nullability model: **`undefined`** for missing values.
5. `any` is **never** acceptable.

### ✅ Answers (6–10 recorded)

1. Prefer `Omit`/`Pick` utility types for forms — use `Omit` when deriving form types from persisted/appwrite types (preferred pattern).
2. Validation schemas should live **next to the component** (co-located) by default; extract to `src/validation/` only when shared across multiple modules.
3. Max lines per function/component before splitting: **999** (practical upper bound; prefer smaller, focused functions but do not enforce a low hard limit).
4. JSX formatting: one prop per line when > **2** props.
5. Prefer **utility-classes** (Tailwind/daisyUI) for new components.

### ❗ Remaining questions (please answer: 11–15)

1. How strict should accessibility enforcement be in PRs (block/flag/optional)?
2. Unit test style: prefer Jest + Testing Library or another stack?
3. Error messages: user-facing messages in English or Spanish by default?
4. Commit message style: conventional commits or freeform?
5. Any patterns to avoid (e.g., heavy component logic, large monolithic files)?

> Tip: answering 11–13 next helps me generate CI rules, test templates and i18n defaults.

---

## Suggested editor/lint/CI rules (recommended) ⚙️

Applied to reflect the recorded answers (interface, explicit return types, named exports, `undefined`, no `any`).

- TypeScript
  - `tsconfig.json`: `"strict": true` (required).
  - Enforce `noImplicitAny` and `exactOptionalPropertyTypes` where feasible.

- ESLint (recommended rules)
  - `@typescript-eslint/consistent-type-definitions`: ["error", "interface"]
  - `@typescript-eslint/explicit-function-return-type`: ["error", { "allowExpressions": true, "allowTypedFunctionExpressions": true }]
  - `@typescript-eslint/no-explicit-any`: ["error"]
  - `import/no-default-export`: ["error"] (encourage named exports)
  - `unicorn/prefer-optional-catch-binding`: ["warn"]
  - `max-lines-per-function`: ["warn", { "max": 999, "skipBlankLines": true, "skipComments": true }]
  - `react/jsx-max-props-per-line`: ["error", { "maximum": 2 }]

  Notes:
  - Validation schemas: co-locate with component by default; extract to `src/validation/` only when shared.
  - UI styling: prefer utility-classes (Tailwind/daisyUI). Avoid introducing CSS-in-JS unless there's a strong justification.

- Prettier
  - Keep defaults; set `printWidth = 100`.

- CI / Tests
  - Run type-check + eslint + vitest on every PR (use `pnpm|npm|yarn test:unit` to run unit suite).
  - Use Vitest + Testing Library for component tests; require at least one unit test for new business logic and an integration test for critical flows.
  - Enforce Conventional Commits via `commitlint` in CI; fail PRs with non-conforming commit messages.
  - i18n: surface missing translation keys in CI for user-facing strings (default language: Spanish).
  - Accessibility: run automated a11y checks (axe or similar); flag issues in PRs (optional enforcement) and require fixes for high-severity failures.

---

## How these choices affect autogenerated code

- Linter/codemods will prefer `interface` over `type`, add explicit return types to exported functions/components, and fail PRs that use `any` or default exports.
- Form generation will derive form types using `Omit`/`Pick` per your preference and co-locate valibot schemas with components by default.
- Generated tests will use **Vitest** + Testing Library and create Spanish fixtures/messages for user-facing text.
- CI will check commit messages (Conventional Commits), run vitest, flag accessibility issues (optional), and fail when critical i18n keys are missing.

---

---

## Next steps — how I can help right now

- [ ] Add this file to the repo (docs/AI_CUSTOM_INSTRUCTIONS.md) — ready to commit.
- [ ] Generate a lint/ESLint config or codemod to enforce any answers you give above.
- [ ] Open a PR template that enforces the checklist.

> Tell me which of the coding-style questions you'd like to answer first, or say `commit` to add this file to the repo as-is.
