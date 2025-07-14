import { IPagination } from ".";

export interface IDonationResponse {
  donations: IDonation[];
  pagination: IPagination;
}

export interface IDonation {
  _id: string;
  campaignOwnerId: string;
  campaignDonorId: string;
  campaignId: string;
  amount: string;
  email: string;
  currency: string;
  fullName: string;
  isAnonymous: boolean;
  shouldShareDetails: boolean;
  isSubscribedToPromo: boolean;
  transactionRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVolunteeringResponse {
  volunteerings: IVolunteer[];
  pagination: IPagination;
}

export interface IVolunteer {
  _id: string;
  campaignId: string;
  userId: string;
  fullName: string;
  email: string;
  gender: string;
  ageRange: string;
  address: string;
  about: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVolunteerResponse {
  volunteers: IVolunteer[];
  pagination: IPagination;
}
