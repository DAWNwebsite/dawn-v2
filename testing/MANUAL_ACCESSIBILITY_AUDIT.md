# Manual Accessibility Audit Plan

**Objective:** To ensure the DAWN AI Study application is fully accessible and usable for individuals relying on assistive technologies, complementing the automated `jest-axe` checks. This audit focuses on WCAG 2.1 AA compliance.

**Target Audience:** Users with visual impairments (requiring screen readers), mobility impairments (requiring keyboard-only navigation), and cognitive or learning disabilities.

---

## I. Tools Required

1.  **Screen Readers:**
    *   **NVDA** (Windows) - Latest version.
    *   **VoiceOver** (macOS/iOS) - Latest version.
2.  **Web Browsers:**
    *   Google Chrome (Latest)
    *   Mozilla Firefox (Latest)
    *   Apple Safari (Latest)
3.  **Keyboard:** Standard physical keyboard.
4.  **Checklist:** A copy of this plan to track progress.

---

## II. Scope of Testing

This audit will cover the following critical user flows and components:

1.  **Authentication Flow:**
    *   Sign Up page (`/auth/signup`)
    *   Sign In page (`/auth/signin`)
    *   Parental Consent page (`/auth/parental-consent`)
2.  **Onboarding:**
    *   Role Selection
    *   Learning Profile Form
    *   Accessibility Settings Form
3.  **Core Dashboard (`/dashboard`):**
    *   Main navigation (Sidebar)
    *   Role-based views (Parent, Teacher, Admin)
    *   Data visualizations and charts
4.  **Diagnostic Assessments (`/assessments`):**
    *   ADHD and Dyslexia assessment forms.
    *   FocusCard and SensoryContainer components during assessment.
5.  **Knowledge Base (`/knowledge-base`):**
    *   Search input and filtering controls.
    *   Display of search results and articles.
    *   Interaction with DyslexiaText component.

---

## III. Manual Test Procedures

### A. Keyboard-Only Navigation

For each page/flow in scope, perform the following using only the keyboard:

| Test Case ID | Action                                                                                                 | Expected Result                                                                                                    | Pass/Fail | Notes |
| :----------- | :----------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :-------- | :---- |
| KB-01        | Use `Tab` key to navigate through all interactive elements (links, buttons, form fields, tabs).          | All interactive elements are focusable. The focus order is logical and predictable, following the visual layout.       |           |       |
| KB-02        | Use `Shift+Tab` to navigate backward through all interactive elements.                                   | Navigation moves backward in a logical and predictable order.                                                      |           |       |
| KB-03        | Observe the currently focused element.                                                                 | A highly visible focus indicator (outline) is present on the element that has focus.                               |           |       |
| KB-04        | Press `Enter` or `Spacebar` on focused buttons, links, and form controls (checkboxes, radios).           | The element's action is triggered (e.g., a link is followed, a button is activated, a checkbox is toggled).      |           |       |
| KB-05        | Use arrow keys (`Up`, `Down`, `Left`, `Right`) to interact with complex components (e.g., radio groups, select dropdowns, tabs). | The selection or active state of the component changes appropriately.                                              |           |       |
| KB-06        | Attempt to access all functionality without using a mouse.                                             | All features and actions are fully operable via the keyboard. No "keyboard traps" exist where focus cannot escape. |           |       |

### B. Screen Reader Testing (VoiceOver & NVDA)

For each page/flow in scope, perform the following with a screen reader enabled:

| Test Case ID | Action                                                                             | Expected Result                                                                                                                                                                                                                                            | Pass/Fail | Notes |
| :----------- | :--------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :---- |
| SR-01        | Let the screen reader announce the page title as the page loads.                     | The page title is announced and accurately describes the page's content or purpose.                                                                                                                                                                          |           |       |
| SR-02        | Navigate through the page using the screen reader's standard navigation shortcuts.   | All text content is read aloud correctly. The reading order is logical.                                                                                                                                                                                      |           |       |
| SR-03        | Interact with images.                                                              | All informative images have descriptive alt text that is announced. Decorative images are skipped or have empty alt text.                                                                                                                                |           |       |
| SR-04        | Interact with links and buttons.                                                   | The link/button text is announced, and it's clear what action will occur. If an icon is used, an accessible name (e.g., via `aria-label`) is announced.                                                                                              |           |       |
| SR-05        | Interact with form fields (inputs, textareas, checkboxes, radios, selects).          | Each form field has a clearly associated and announced label. Instructions or error messages are announced when the user focuses on the field or after submission. The state (e.g., checked/unchecked) is announced. |           |       |
| SR-06        | Navigate data tables or complex data visualizations.                               | Table headers are announced for data cells. Chart data is presented in an accessible format (e.g., a summary text or a fallback data table).                                                                                                      |           |       |
| SR-07        | Trigger dynamic content changes (e.g., opening a modal, showing an error message).   | The screen reader announces the change in content, moving focus to the new content if appropriate (e.g., to a modal dialog).                                                                                                                             |           |       |

---

## IV. Reporting

All failures should be documented with the following information:
*   Test Case ID
*   Page/URL
*   Browser and Assistive Technology used
*   Description of the issue
*   Expected behavior vs. Actual behavior
*   Screenshot or short video clip
*   Severity (Critical, High, Medium, Low)

Issues will be logged in the project's issue tracker with an "Accessibility" label.
