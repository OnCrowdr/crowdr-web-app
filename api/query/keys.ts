const verb = "GET"

export default {
  PROFILE: "GET /profile",
  CAMPAIGNS: "GET /campaigns",
  MY_CAMPAIGNS: "GET /my-campaigns",
  MY_CAMPAIGN: "GET /my-campaign",
  MY_CAMPAIGN_SUMMARY: "GET /my-campaign",
  CAMPAIGN_SUMMARY: "GET /campaigns/summary",
  CAMPAIGN_DONATIONS: "GET /campaigns/${campaignId}/donations",
  CAMPAIGN_VOLUNTEERS: "GET /campaigns/${campaignId}/volunteers",
  SETTINGS_KYC: "GET /settings/KYC",
} as const
