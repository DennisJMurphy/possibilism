## [2025-07-10]
- added logout and a user-check
- Attempted to implement improved password reset by updating Supabase Auth redirect URLs and front-end flow.
- Discovered side effect: new user registration began redirecting to password reset instead of login/dashboard.
- Cause: Auth redirect URL misconfiguration—same route used for both registration and password reset, but app does not distinguish between confirmation and recovery tokens.
- Reverted changes to restore registration, but this broke password reset.
- Next steps: Review and refactor Supabase Auth URL configuration and front-end token handling to decouple registration confirmation and password reset flows.
- upgraded Expo

## [2025-07-09]
- cleaned up changes to reset-password flow
- added alerts, cleared forms after submitting
- adjusted formatting a bit

## [2025-07-08]
- fixed the password resetting, required some supabase changes

## [2025-07-07]
- had to give users RLS permission to delete rows from supabase
- had to make a reset-password option - WIP, not ready to push

## [2025-07-04]
- debugging in progress, dashboard is not refreshing as expected
- "track" and "stop tracking" appear to be working correctly

## [2025-07-03]
- started adding a "track group" button, wip
- changed and cleaned up some labels

## [2025-07-02]

- realised "join group" is not correct - anyone can and should be able to contribute to a metric
- checked multi-user flow - added privacy, follow, favourite, validation, to my considerations

## [2025-07-01]

- updated the dashboard to bring all information and action to the front