import { Pagination } from "@/api/types";

// response
export interface IGetCampaignVolunteersResponse {
  success: boolean;
  message: string;
  data:    IGetCampaignVolunteersResponseData;
}

export interface IGetCampaignVolunteersResponseData {
  volunteerings: Volunteering[];
  pagination:    Pagination;
}

export interface Volunteering {
  _id:         string;
  campaignId:  string;
  fullName:    string;
  email:       string;
  status:      string;
  gender:      string;
  ageRange:    string;
  address:     string;
  about:       string;
  userId:      string;
  phoneNumber: string;
  createdAt:   string;
  updatedAt:   string;
  remark:      string;
  campaign:    Campaign;
}

export interface Campaign {
  _id:                      string;
  userId:                   string;
  category:                 string;
  title:                    string;
  story:                    string;
  campaignType:             string;
  campaignStatus:           string;
  campaignCoverImage:       string;
  campaignAdditionalImages: any[];
  campaignStartDate:        string;
  campaignEndDate:          string;
  volunteer:                Volunteer;
  tipsEmailSent:            boolean;
  createdAt:                string;
  updatedAt:                string;
  __v:                      number;
}

export interface Volunteer {
  skillsNeeded:         string[];
  ageRange:             string;
  genderPreference:     string;
  commitementStartDate: string;
  commitementEndDate:   string;
  requiredCommitment:   string;
  additonalNotes:       string;
}
