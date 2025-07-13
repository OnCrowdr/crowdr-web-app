// payload
export interface IPostRequestWithdrawalBody {
  campaignId: string;
}

// response
export interface IPostRequestWithdrawalResponse {
  _id:        string;
  userId:     string;
  campaignId: string;
  campaign:   Campaign;
  status:     string;
  createdAt:  string;
  updatedAt:  string;
}

export interface Campaign {
  success: boolean;
  message: string;
  data:    CampaignData;
}

export interface CampaignData {
  category:                    string;
  title:                       string;
  story:                       string;
  campaignType:                string;
  campaignStatus:              string;
  campaignCoverImageUrl:       string;
  campaignAdditionalImagesUrl: string[];
  fundraise:                   Fundraise;
  volunteer:                   Volunteer;
}

export interface Fundraise {
  fundingGoalDetails: FundingGoalDetail[];
}

export interface FundingGoalDetail {
  amount:   number;
  currency: string;
}

export interface Volunteer {
  volunteersNeeded:     number;
  email:                string;
  phoneNumber:          string;
  address:              string;
  skillsNeeded:         string[];
  otherSkillsNeeded:    string;
  ageRange:             string;
  genderPreference:     string;
  commitementStartDate: string;
  commitementEndDate:   string;
  requiredCommitment:   string;
  additonalNotes:       string;
}
