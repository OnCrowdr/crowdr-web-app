const env = process.env

export default {
  POSTHOG_KEY: env.NEXT_PUBLIC_POSTHOG_KEY,
  POSTHOG_HOST: env.NEXT_PUBLIC_POSTHOG_HOST,
} as const