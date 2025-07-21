import { UserType } from "@/types";

// payload
export interface IGetProfilePath {
  userId: string
}

// response
export interface IGetProfileResponse {
  success: boolean;
  message: string;
  data:    IGetProfileResponseData;
}

export interface IGetProfileResponseData {
  _id:             string;
  user:            Individual | NonProfit;
  location:        string | null;
  bio:             string | null;
  instagram:       string | null;
  twitter:         string | null;
  image:           Image | null;
  backgroundImage: Image | null;
  engagements:     Image[];
  createdAt:       string;
  updatedAt:       string;
  __v:             number;
  members:         Member[];
  id:              string;
}

export interface Image {
  _id:       string;
  url:       string;
  public_id: string;
  tags:      string[];
  __v:       number;
  createdAt: string;
  updatedAt: string;
  id:        string;
}

export interface Member {
  fullname: string;
  position: string;
  image?:   Image;
}

export interface Individual {
  _id:             string;
  userType:        UserType.Individual;
  email:           string;
  interests:       string[];
  referrer:        string;
  isAdmin:         boolean;
  isEmailVerified: boolean;
  isDeleted:       boolean;
  tipsEmailSent:   boolean;
  fullName:        string;
  gender:          string;
}
export interface NonProfit {
  _id:              string;
  userType:         UserType.NonProfit;
  email:            string;
  interests:        string[];
  referrer:         string;
  isAdmin:          boolean;
  isEmailVerified:  boolean;
  isDeleted:        boolean;
  tipsEmailSent:    boolean;
  organizationName: string;
  organizationId:   string;
}
