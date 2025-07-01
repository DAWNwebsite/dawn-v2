# User Acceptance Testing (UAT) Plan

**Objective:** To validate that the DAWN AI Study platform is functional, intuitive, and meets the real-world needs of its target users, with a specific focus on the experience of neurodivergent learners and their parents/guardians.

---

## 1. UAT Goals

*   Confirm that end-to-end user flows are logical and free of critical bugs.
*   Validate that the application is perceived as helpful, usable, and trustworthy.
*   Gather qualitative feedback on the user experience, especially regarding neurodivergent-specific features.
*   Identify any final usability issues or sources of confusion before a public launch.
*   Ensure the parental consent workflow (COPPA) is clear and easy for parents to navigate.

---

## 2. Participant Recruitment

A diverse group of testers is required to ensure comprehensive feedback.

### Target Profiles (10-15 participants total):

*   **Parents/Guardians of K-12 Students (5-7 participants):**
    *   Mix of tech-savviness levels.
    *   At least 3-4 with children who are neurodivergent (ADHD, dyslexia, etc.).
*   **Neurodivergent Students (Ages 13-18) (3-5 participants):**
    *   With parental consent obtained prior to testing.
    *   Representing different neurotypes (ADHD, dyslexia, autism spectrum).
*   **Educators/Tutors (2-3 participants):**
    *   Experience working with neurodivergent students.
    *   Will test from a teacher/administrator perspective.

### Recruitment Channels:
*   Local parent support groups.
*   Special education communities online.
*   Partnering with local schools or tutoring centers.
*   Social media outreach.

---

## 3. UAT Test Scenarios & Scripts

Detailed, step-by-step scripts will be provided to each participant. The scripts will be tailored to their persona (Parent, Student, Educator).

### Scenario 1: Onboarding a New Child User (Parent & Child Persona)
*   **Script P1:** As a parent, sign up for an account. Register your child (who is under 13).
*   **Script P2:** Receive the consent email and follow the link. Review the consent information and grant consent.
*   **Script C1:** As the child, attempt to log in before consent is given. Confirm you are in a waiting state.
*   **Script C2:** Log in after consent is granted. Complete the user profile and accessibility settings.

### Scenario 2: Taking a Diagnostic Assessment (Student Persona)
*   **Script S1:** Navigate to the assessments page and begin the dyslexia diagnostic.
*   **Script S2:** Interact with the assessment questions, including the `FocusCard` and `SensoryContainer` components.
*   **Script S3:** Complete the assessment and view the initial results summary.

### Scenario 3: Reviewing Child's Progress (Parent/Educator Persona)
*   **Script P3/E1:** Log in to the dashboard.
*   **Script P4/E2:** Navigate to the student's progress report.
*   **Script P5/E3:** Review the diagnostic results and AI-driven recommendations.
*   **Script P6/E4:** Use the dashboard filters to view different data points.

### Scenario 4: Using the Knowledge Base (All Personas)
*   **Script A1:** Navigate to the knowledge base.
*   **Script A2:** Search for information about "ADHD study strategies."
*   **Script A3:** Use the content filters (e.g., by disability type, subject).
*   **Script A4:** Interact with an article, noting the readability and usefulness of the `DyslexiaText` feature.

### Scenario 5: Managing Consent (Parent Persona)
*   **Script P7:** From your dashboard, locate the consent management section for your child.
*   **Script P8:** Review the consent you previously granted.
*   **Script P9 (Optional/Hypothetical):** Walk through the steps to revoke consent, stopping before final confirmation.

---

## 4. Feedback Collection & Triage

### Collection Method:
*   A standardized online feedback form (e.g., Google Forms, Typeform) will be linked at the end of each test script.
*   The form will include:
    *   Which script was completed.
    *   A 1-5 rating for ease of use for each major step.
    *   Open-ended questions about what was confusing, what was liked, and suggestions for improvement.
    *   A field for bug reports (with steps to reproduce).
    *   An optional field for a follow-up interview.

### Triage Process:
1.  **Daily Review:** The project lead will review all submitted feedback daily.
2.  **Categorization:** Feedback will be categorized into:
    *   **Critical Bug:** A crash, data loss, or blocker for a core user flow.
    *   **Major Usability Issue:** A source of significant confusion or frustration.
    *   **Minor Bug:** A cosmetic issue or non-critical error.
    *   **Feature Request/Suggestion:** A new idea or improvement.
3.  **Prioritization:**
    *   **P0 - Urgent:** Critical bugs. Must be fixed immediately.
    *   **P1 - High:** Major usability issues. To be addressed before launch.
    *   **P2 - Medium:** Minor bugs. Can be addressed post-launch.
    *   **P3 - Low:** Suggestions. To be considered for future versions.
4.  **Logging:** All categorized feedback will be logged as issues in the project's GitHub repository with appropriate labels (e.g., `UAT-Feedback`, `bug`, `enhancement`) and priority.

---

## 5. UAT Timeline (Example)

*   **Week 1:** Finalize test scripts and feedback forms. Begin participant recruitment.
*   **Week 2:** Conduct UAT sessions.
*   **Week 3:** Continue UAT sessions. Begin daily triage and P0 bug fixing.
*   **Week 4:** Conclude testing. Analyze all feedback. Prioritize P1 issues for a final pre-launch sprint.
