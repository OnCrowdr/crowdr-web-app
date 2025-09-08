import { Pagination, PaginationParams } from "@/api/types";

// payload
export interface IGetCampaignsParams extends PaginationParams {
  campaignStatus?: CampaignStatus;
  runningStatus?: RunningStatus;
  title?: string;
  type?: CampaignType;
  category?: CampaignCategory;
  userId?: string;
  sortBy?: string;
}

export enum CampaignStatus {
  Approved = "approved",
  InReview = "in-review",
  Declined = "declined"
}

export enum RunningStatus {
  Upcoming = "upcoming",
  Active = "active",
  Completed = "completed"
}

export enum CampaignType {
  Fundraise = "fundraise",
  Volunteer = "volunteer",
  FundraiseVolunteer = "fundraiseAndVolunteer"
}

export enum CampaignCategory {
  Business = "business",
  Education = "education",
  Arts = "arts",
  Events = "events",
  Family = "family",
  Sports = "sport",
  Tech = "tech",
  Health = "health",
  Music = "music",
  Legal = "legal",
  Politics = "politics",
  Others = "others"
}

// response
export interface IGetCampaignsResponse {
  success: boolean;
  message: string;
  data: IGetCampaignsResponseData;
}

export interface IGetCampaignsResponseData {
  campaigns: Campaign[];
  pagination: Pagination;
}

export interface WithdrawalAmount {
  currency: string;
  amount: number;
  breakdown: {
    totalDonated: number;
    serviceFee: number;
    totalWithdrawn: number;
    netAvailable: number;
  };
}

// export interface Campaign {
//   _id:                         string;
//   userId:                      string;
//   category:                    CampaignCategory;
//   title:                       string;
//   story:                       string;
//   campaignType:                CampaignType;
//   campaignStatus:              CampaignStatus;
//   campaignCoverImage:          CampaignImage;
//   campaignAdditionalImages:    CampaignImage[];
//   campaignStartDate:           string;
//   campaignEndDate:             string;
//   volunteer?:                  Volunteer;
//   campaignVolunteers:          CampaignVolunteer[];
//   campaignDonors:              any[];
//   user:                        User;
//   campaignViews:               number;
//   totalNoOfCampaignDonors:     number;
//   totalNoOfCampaignVolunteers: number;
//   totalAmountDonated:          TotalAmountDonated[];
//   isCompleted:                 boolean;
//   sortAmount?:                 number;
//   fundraise?:                  Fundraise;
//   tipsEmailSent?:              boolean;
//   deletedAt?:                  null;
//   photo?:                      CampaignImage;
// }

export interface BaseCampaign {
  campaignAdditionalImages: CampaignImage[];
  campaignCoverImage: CampaignImage;
  campaignDonors: any[];
  campaignEndDate: string;
  campaignStartDate: string;
  campaignStatus: CampaignStatus;
  campaignViews: number;
  campaignVolunteers: CampaignVolunteer[];
  category: CampaignCategory;
  deletedAt?: null;
  isCompleted: boolean;
  photo: CampaignImage;
  sortAmount?: number;
  story: string;
  tipsEmailSent: boolean;
  title: string;
  withdrawableAmounts: WithdrawalAmount[];
  totalAmountDonated: TotalAmountDonated[];
  totalNoOfCampaignDonors: number;
  totalNoOfCampaignVolunteers: number;
  user: User;
  userId: string;
  _id: string;
}

export interface FundraiseCampaign extends BaseCampaign {
  campaignType: CampaignType.Fundraise;
  fundraise: Fundraise;
}

export interface VolunteerCampaign extends BaseCampaign {
  campaignType: CampaignType.Volunteer;
  volunteer: Volunteer;
}

export interface FundraiseAndVolunteerCampaign
  extends Omit<FundraiseCampaign, "campaignType">,
    Omit<VolunteerCampaign, "campaignType"> {
  campaignType: CampaignType.FundraiseVolunteer;
}

export type Campaign =
  | FundraiseCampaign
  | VolunteerCampaign
  | FundraiseAndVolunteerCampaign;

export interface CampaignImage {
  _id: string;
  url: string;
  public_id: string;
  tags: string[];
}

export interface CampaignVolunteer {
  _id: string;
  campaignId: string;
  fullName: string;
  email: string;
  status: string;
  gender: string;
  ageRange: string;
  address: string;
  about: string;
  userId: string;
  phoneNumber: string;
}

export interface Fundraise {
  fundingGoalDetails: FundingGoalDetail[];
}

export interface FundingGoalDetail {
  amount: number;
  currency: Currency;
}

export enum Currency {
  Dollar = "dollar",
  Naira = "naira"
}

export interface TotalAmountDonated {
  currency: Currency;
  amount: number;
  serviceFee: number;
  payableAmount: number;
}

export interface User {
  _id: string;
  userType: string;
  email: string;
  interests: string[];
  isAdmin: boolean;
  fullName?: string;
  gender?: string;
  tipsEmailSent?: boolean;
  organizationName?: string;
  organizationId?: string;
}

export interface Volunteer {
  skillsNeeded: string[];
  ageRange: string;
  genderPreference: string;
  commitementStartDate: string;
  commitementEndDate: string;
  requiredCommitment: string;
  additonalNotes: string;
  volunteersNeeded?: number;
  email?: string;
  phoneNumber?: string;
  address?: string;
}
