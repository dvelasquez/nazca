# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# shadcn/ui Usage

> **Note:** The `shadcn-ui` package is deprecated. Use the new package for adding components:
>
> ```bash
> npx shadcn@latest add <component>
> ```
>
> Example for Button:
> ```bash
> npx shadcn@latest add button
> ```
>
> **Important:** All shadcn and related commands for the web app must be run from the `./web` directory.

# Generic Maintainer Pattern (Hybrid Approach)

## Overview

For CRUD maintainers (admin UIs), we use a **hybrid approach** for defining table columns and form fields:

- **Auto-generate** columns/fields from TypeScript types or OpenAPI schemas as a starting point.
- **Manually refine** the generated config for each entity to ensure best UX, labels, order, and custom logic.

## Why Hybrid?

| Approach         | Flexibility | Speed | UX Quality | Recommended For         |
|------------------|-------------|-------|------------|------------------------|
| Auto-generated   | Low         | High  | Low        | Internal tools, protos |
| Manual           | High        | Med   | High       | Production, UX focus   |
| **Hybrid**       | **High**    | **High** | **High** | **Most teams**         |

- **Auto-generation** saves time and keeps maintainers in sync with backend changes.
- **Manual refinement** ensures the UI is user-friendly, accessible, and handles edge cases (relations, enums, custom widgets, etc).

## Recommended Workflow

1. **Generate a draft config**
   - Use a CLI or script to read your TypeScript types or OpenAPI schema and output a default `columns` and `fields` config for the entity.
   - Example output:
     ```ts
     const fields = [
       { name: 'id', label: 'ID', type: 'text', required: true },
       { name: 'name', label: 'Name', type: 'text', required: true },
     ]
     ```
2. **Manually review and refine**
   - Adjust field order, labels, required flags, and add custom renderers or widgets as needed.
   - Add help text, tooltips, or validation for better UX.
   - Handle relations, enums, or computed fields manually.
3. **Use with GenericMaintainer**
   - Pass the refined config to the `GenericMaintainer` component for a consistent, maintainable CRUD UI.

## Example

```ts
// Auto-generated (then refined) fields for Tenant
const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
]
```

## Pros & Cons

- **Pros:**
  - Fast initial setup for new entities
  - Consistent UI across maintainers
  - Easy to keep in sync with backend changes
  - Full control for UX and edge cases
- **Cons:**
  - Requires a review step after generation
  - Some manual work for complex fields

## Tools
- You can write a simple script or CLI to generate the initial config from your types or OpenAPI schema.
- Always review and refine the generated config before using in production.

## Data Loading Best Practice

- Always use TanStack Router's `loader` for fetching data needed by a page or route.
- Do **not** fetch data inside React components (no useEffect for data fetching in pages/forms).
- Components, pages, and forms should be pure and only receive data via props or loader.
- This ensures predictable, testable, and maintainable UI.

## React Best Practices & Rules

- **Minimize useEffect:** Only use Effects for synchronizing with external systems (e.g., subscriptions, manual DOM manipulation, network requests that must be tied to component lifecycle). For most UI logic, derive data during render instead of using Effects. See [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
- **Keep Components Pure:** Components, pages, and forms should be pure and only receive data via props or router loader. Avoid side effects in render logic.
- **Thinking in React:** Break down your UI into a component hierarchy, build a static version first, identify minimal state, and make UI interactive by lifting state up and passing data down. See [Thinking in React](https://react.dev/learn/thinking-in-react).
- **No Redundant State:** If something can be calculated from props or state, do not store it in state. Compute it during render.
- **Prefer Router Loaders for Data:** Use TanStack Router's loader for all data fetching in pages/routes. Do not fetch data in useEffect in components.

## @tanstack/react-form Usage Pattern

- Use `<form.Field name="...">` for each field in your form. This provides the field API and state for controlled inputs.
- Render your input inside the field render function, using `field.state.value`, `field.handleChange`, and `field.handleBlur`.
- Handle form submission with `form.handleSubmit` in the form's `onSubmit` handler. Prevent default and stop propagation as needed.
- Do not manage field state manually; always use the field API provided by TanStack Form.

**Example:**

```tsx
<form onSubmit={(e) => {
  e.preventDefault()
  e.stopPropagation()
  form.handleSubmit()
}} className="space-y-4">
  <form.Field
    name="name"
    children={(field) => (
      <div>
        <label htmlFor={field.name} className="block text-sm font-medium mb-1">Name</label>
        <input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
    )}
  />
  <div className="flex gap-2 justify-end">
    <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/tenants' })}>
      Cancel
    </Button>
    <Button type="submit">Create</Button>
  </div>
</form>
```

- This pattern ensures your forms are fully controlled, type-safe, and compatible with TanStack Form's validation and state management.

---

**Summary:**
- Use auto-generation for speed, manual refinement for quality.
- This hybrid approach is recommended for most teams and projects.
