# Frontend Developer Assessment - Test Management Application

> **Note**
>
> The sections under **Original Assignment Requirements** are copied exactly from the assessment document and should be treated as the source of truth.
>
> Additional notes in this document are only to provide implementation guidance and better project understanding. They do not override the original assignment.

---

# Project Overview

Build a production-ready Test Management Application that enables administrators to create, edit, manage, preview, and publish MCQ-based tests.

The application should closely follow the provided Figma design and integrate with the provided backend APIs.

The application should emphasize:

- Clean Architecture
- Reusable Components
- Type Safety
- API Integration
- Excellent User Experience
- Responsive Design
- Production-ready Code Quality

---

# Original Assignment Requirements

## Overview

Build a test management application that allows users to create tests, add questions, and publish them. This is a 5-page flow application focusing on CRUD operations and API integration.

---

## Application Flow

### Page 1: Login Page

- Simple login form with userId and password fields
- Form validation
- JWT token management (store in localStorage/sessionStorage)
- Redirect to dashboard on successful login
- Error handling for failed login attempts

### Page 2: Dashboard / Test List

- Display all tests in a table/card layout
- Show test details: name, subject, status, created date
- Actions: Edit, View, Delete buttons
- "Create New Test" button
- Filter/search functionality (bonus)

### Page 3: Create/Edit Test Page

- Form fields:
  - Test Name (required)
  - Subject (dropdown - fetched from API)
  - Test Type (dropdown/select)
  - Topics (multi-select based on selected subject)
  - Sub-topics (multi-select based on selected topics)
  - Difficulty level
  - Marking scheme: correct_marks, wrong_marks, unattempt_marks
  - Total time, Total marks
- Save as Draft functionality
- "Next: Add Questions" button
- Form validation

### Page 4: Add Questions Page

- Display selected test details at top
- Form to add questions:
  - Question text
  - 4 options (option1, option2, option3, option4)
  - Correct option
  - Explanation (optional)
  - Difficulty (optional)
  - Topic and Sub-topic (optional, dropdowns)
  - Media URL (optional)
- "Add Another Question" button
- List of added questions with edit/delete actions
- "Save & Continue" button
- Minimum 1 question required

### Page 5: Preview & Publish

- Display complete test overview:
  - Test details
  - All questions with options
- Edit test or questions buttons
- "Publish Test" button
- Success message on publish
- Redirect to dashboard

---

# Additional Implementation Expectations

The implementation should also consider the following engineering practices:

- Follow the provided Figma design accurately.
- Build reusable and maintainable React components.
- Keep business logic separated from UI components.
- Handle loading, empty and error states.
- Avoid hardcoded data whenever backend APIs are available.
- Use proper form validation.
- Implement responsive layouts.
- Use TypeScript best practices.
- Keep code modular and scalable.
- Ensure good user experience and accessibility wherever applicable.

---

# Deliverables

The final submission should include:

- GitHub Repository
- Deployed Web Application
- Walkthrough Video
- Brief explanation of technical decisions
