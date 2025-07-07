import posthog from "posthog-js"
import config from "./utils/config"
import mixpanel from "mixpanel-browser"

export function register() {
  posthog.init(config.POSTHOG_KEY as string, {
    api_host: config.POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  })

  mixpanel.init("09420737b2f3103957800fa617fe2a0b", {
    /* eslint-disable camelcase */
    track_pageview: true,
    persistence: "localStorage",
    ignore_dnt: true,
  })
}
