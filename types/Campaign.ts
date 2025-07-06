import { CampaignCategory, CampaignType } from "@/api/_campaigns/models/GetCampaigns";
import { IPagination } from ".";

export interface ICampaign {
  _id: string;
  userId: string;
  category: CampaignCategory;
  title: string;
  story: string;
  campaignType: CampaignType;
  campaignStatus: CampaignStatus;
  campaignCoverImage: CampaignCoverImage;
  campaignAdditionalImages: CampaignCoverImage[];
  campaignStartDate: string;
  campaignEndDate: string;
  campaignViews: number;
  campaignVolunteers: any[];
  campaignDonors: any[];
  user: User;
  photo: CampaignCoverImage;
  totalNoOfCampaignDonors: number;
  totalNoOfCampaignVolunteers: number;
  totalAmountDonated: TotalAmountDonated[];
  isCompleted: boolean;
}

export interface IFundraiseCampaign extends ICampaign {
  fundraise: Fundraise;
}

export interface IVolunteerCampaign extends ICampaign {
  volunteer: Volunteer;
}

export type IFundraiseVolunteerCampaign =
  | IFundraiseCampaign
  | IVolunteerCampaign;

export interface CampaignCoverImage {
  _id: string;
  url: string;
  public_id: string;
  tags?: string[];
}

export interface Fundraise {
  fundingGoalDetails: TotalAmountDonated[];
}

export interface TotalAmountDonated {
  amount: number;
  currency: string;
  payableAmount: number;
  serviceFee: number;
}

export interface User {
  _id: string;
  isAdmin: boolean;
  organizationName: string;
  organizationId: string;
  userType: string;
  interests: string[];
  fullName: string;
}

export interface Volunteer {
  skillsNeeded: string[];
  otherSkillsNeeded?: string;
  ageRange: string;
  genderPreference: string;
  commitementStartDate: string;
  commitementEndDate: string;
  requiredCommitment: string;
  additonalNotes: string;
  volunteersNeeded: number
  address: string
  email: string
  phoneNumber: string
}

export interface ICampaignResponse {
  campaigns: IFundraiseVolunteerCampaign[];
  pagination: IPagination;
}

export type CampaignStatus =
  | "completed"
  | "in-progress"
  | "declined"
  | "in-review";
// export type CampaignType = "fundraise" | "volunteer" | "fundraiseAndVolunteer";
