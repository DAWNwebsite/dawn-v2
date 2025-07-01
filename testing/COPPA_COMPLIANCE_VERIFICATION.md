# COPPA Compliance Verification Plan

**Objective:** To manually verify that the application's parental consent workflow strictly adheres to the requirements of the Children's Online Privacy Protection Act (COPPA). This plan covers the entire lifecycle of a child user account, from creation to consent revocation.

**Reference Task:** Task 3 - Implement Advanced User Profile Models (including `ParentalConsent` model).

---

## I. Test Scenarios & Personas

*   **Child User (CU):** A user whose entered date of birth indicates they are under the age of 13.
*   **Parent/Guardian (PG):** The adult user responsible for providing consent.
*   **Adult User (AU):** A user whose entered date of birth indicates they are 13 or older.

---

## II. Test Cases

### A. Age-Gating and Account Creation

| Test Case ID | Persona | Action                                                                                                         | Expected Result                                                                                                                                                                                                                                                                                                                      | Pass/Fail | Notes |
| :----------- | :------ | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :---- |
| COPPA-AC-01  | CU      | Attempt to sign up with a date of birth making the user under 13.                                              | The standard registration flow is halted. The user is redirected to a page explaining that parental consent is required. A form is presented to enter a parent/guardian's email address.                                                                                                                                 |           |       |
| COPPA-AC-02  | CU      | Complete the parental consent request form.                                                                    | A `ParentalConsent` record is created in the database with a status of `PENDING`. An email is sent to the parent's email address containing a unique, secure link to the consent form. The child's account is created but is in a "locked" or "limited" state, preventing access to most features. |           |       |
| COPPA-AC-03  | AU      | Sign up with a date of birth making the user 13 or older.                                                      | The user completes the standard registration process without any parental consent interruption. No `ParentalConsent` record is created. The account is immediately active.                                                                                                                                              |           |       |
| COPPA-AC-04  | CU      | After requesting consent, try to log in before the parent has granted it.                                      | The user can log in but is restricted to a "waiting for consent" page. They cannot access the dashboard, assessments, or other features that collect personal information.                                                                                                                                  |           |       |

### B. Parental Consent Workflow

| Test Case ID | Persona | Action                                                                                                             | Expected Result                                                                                                                                                                                                                           | Pass/Fail | Notes |
| :----------- | :------ | :----------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :---- |
| COPPA-CW-01  | PG      | Click the unique consent link from the email.                                                                      | The parent is taken to a secure, dedicated consent page. The page clearly explains what information DAWN collects, how it is used, and who it is shared with. It links to the Privacy Policy.                                                 |           |       |
| COPPA-CW-02  | PG      | Grant consent via the form on the consent page.                                                                    | The `ParentalConsent` record for the child is updated to `GRANTED`, and the `grantedAt` timestamp is set. The child's account is now fully "unlocked" and they can access all features. An email confirmation is sent to the parent.      |           |       |
| COPPA-CW-03  | PG      | Deny consent via the form on the consent page.                                                                     | The `ParentalConsent` record is updated to `DENIED`. The child's account and all associated data are queued for deletion according to the data retention policy. An email confirmation is sent to the parent.                         |           |       |
| COPPA-CW-04  | -       | Attempt to use a consent link that has already been used (either granted or denied).                                 | The link is invalidated. The user is shown a message indicating that consent has already been processed and is directed to the parent dashboard or a support page.                                                                      |           |       |
| COPPA-CW-05  | -       | Attempt to use a consent link that has expired (if expiration logic is implemented).                               | The link is invalid. The user is prompted to restart the consent process.                                                                                                                                                                 |           |       |

### C. Consent Management and Revocation

| Test Case ID | Persona | Action                                                                                                        | Expected Result                                                                                                                                                                                                                                                                                                                                   | Pass/Fail | Notes |
| :----------- | :------ | :------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :---- |
| COPPA-CM-01  | PG      | Log in to the parent dashboard and navigate to the child management section.                                  | The parent can view the status of their child's consent (`GRANTED`).                                                                                                                                                                                                                                                              |           |       |
| COPPA-CM-02  | PG      | From the dashboard, find and click the option to review the consent details or privacy policy.                | The parent is shown the same information they originally consented to, reaffirming what data is being collected and how it's used.                                                                                                                                                                                                    |           |       |
| COPPA-CM-03  | PG      | From the dashboard, find and activate the "Revoke Consent" option. A confirmation step should be present.       | After confirmation, the `ParentalConsent` record is updated to `REVOKED`. The child's account is immediately returned to a "locked" state, and all associated personal data is scheduled for deletion from the platform's active databases in accordance with the privacy policy. An email confirmation is sent to the parent. |           |       |
| COPPA-CM-04  | CU      | Attempt to log in after the parent has revoked consent.                                                       | The user is informed that their access has been revoked and they should speak with their parent or guardian. They cannot access any features.                                                                                                                                                                                          |           |       |

---

## III. Reporting

All failures will be documented with the same level of detail as the Accessibility Audit, referencing the specific Test Case ID and logged in the project's issue tracker with a "Compliance" or "COPPA" label.
