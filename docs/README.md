# Project Documentation

Before writing any code, read the documentation in the following order.

1. assignment/requirements.md
2. api/backend-base-url.md
3. api/login-credentials.md
4. api/api-documentation.md
5. figma/figma-link.md
6. Review every image inside figma/

After reading all documentation:

- Understand the complete project.
- Summarize the application.
- Propose the architecture.
- Identify reusable components.
- Identify routing.
- Identify state management.
- Identify API layer.
- Identify validation strategy.
- Identify edge cases.

# Project Implementation Rules

These rules apply throughout the entire project.

## Component Size

- Keep components focused and maintainable.
- No component should exceed approximately 250–300 lines.
- If a component grows too large:
  - Extract reusable child components.
  - Extract custom hooks.
  - Extract utility functions.
  - Keep route/page components thin.

---

## Development Quality Gate

A feature is considered complete only when all of the following are true:

- Production build succeeds.
- TypeScript reports zero errors.
- ESLint reports zero errors.
- No unused imports or variables.
- No TODO or placeholder code unless explicitly approved.
- Responsive behavior matches the Figma design.
- API integration is fully functional.
- Error states, loading states, and empty states are implemented.
- The implementation is reusable and production-ready.

---

## Development Process

Implement features incrementally.

Do not start implementing the next feature until the current feature has been fully completed, tested, and approved.
