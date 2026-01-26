# AI / Developer Instructions — Grafos ERP

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
- Functional programming: prefer pure functions, immutable data, and declarative transforms (`map`, `filter`, `reduce`) over imperative mutation when reasonable.

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
- Use `authStore.tenantId` for tenant-scoped creates (or equivalent tenant context in loaders).

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

## Coding-style

- Prefer `interface` for public data shapes and props.
- All functions/components should have explicit return types.
- Use **named** exports for Solid components.
- Preferred nullability model: **`undefined`** for missing values.
- `any` is **never** acceptable.
- Use `Omit` when deriving form types from persisted/appwrite types (preferred pattern).
- Validation schemas should live **next to the component** (co-located) by default; extract to `src/validation/` only when shared across multiple modules.
- Max lines per function/component before splitting: **500** (practical upper bound; prefer smaller, focused functions but do not enforce a low hard limit).
- JSX formatting: one prop per line when > **2** props.
- Prefer **utility-classes** (Tailwind/daisyUI) for new components.
- Prefer **Vitest** for Unit test style
- Error messages: user-facing messages in **Spanish** by default
- Commit message style: conventional commits
- Patterns to avoid: heavy component logic