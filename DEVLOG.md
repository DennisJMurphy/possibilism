## [2025-07-24]
- blocked by payment issues with apple
- deployed to android

## [2025-07-23]
- added an icon and a splash screen
- made progress towards first test build

## [2025-07-21]
- moved identity info to app.json
- considered a privacy policy

## [2025-07-18]
- checked for user-facing error messages
- started considering identity issues

## [2025-07-17]
- prepping for EAS Build
- removed unused screens
- added check for login in dashboard

## [2025-07-16]
- all screens updated for light and dark
- added description field to group form

## [2025-07-15]
- dashboard updated with light/dark and consolidated styles

## [2025-07-14]
- login screen prepped for light/dark
- styles moved to separate file for login

## [2025-07-11]
- set the reset-password redirect path in the app, rather than in supabase
- this successfully decouples registration confirmation and reset password
- cleaned up some duplicate code
- started consolidating styles, in preparation for dark/light modes WIP

## [2025-07-10]
- added logout and a user-check
- Attempted to implement improved password reset by updating Supabase Auth redirect URLs
- Discovered side effect: new user registration began redirecting to password reset instead of login/dashboard.
- Cause: Auth redirect URL misconfiguration—same route used for both registration and password reset, but app does not distinguish between confirmation and recovery tokens.
- Reverted changes to restore registration, but this broke password reset.
- Next steps: Review and refactor Supabase Auth URL configuration and front-end token handling to decouple registration confirmation and password reset flows.
- upgraded Expo to 53.0.0 (was 52.0.46)

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