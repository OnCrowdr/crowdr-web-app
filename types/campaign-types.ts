export interface DonationInputs {
  amount: string;
  fullName: string;
  email: string;
}

export interface VolunteerInputs {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  ageRange: string;
  address: string;
  about: string;
}

export interface CheckboxValues {
  isAnonymous: boolean;
  shouldShareDetails: boolean;
  isSubscribedToPromo: boolean;
}
