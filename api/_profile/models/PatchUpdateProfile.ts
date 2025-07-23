// payload
export interface IPatchUpdateProfileBody {
  location: string
  bio: string
  twitter: string
  instagram: string
  image?: File
  backgroundImage?: File
  engagements: File[]
  membersImages?: File[]
  members?: {
    fullname: string
    position: string
  }[]
}

// response
export interface IPatchUpdateProfileResponse {
  success: boolean;
  message: string;
  data:    IPatchUpdateProfileResponseData;
}

export interface IPatchUpdateProfileResponseData {
  phoneNumber:     null;
  _id:             string;
  user:            string;
  location:        string;
  bio:             string;
  instagram:       string;
  twitter:         string;
  image:           null;
  backgroundImage: null;
  engagements:     string[];
  members:         Member[];
  createdAt:       string;
  updatedAt:       string;
  __v:             number;
  id:              string;
}

export interface Member {
  fullname: string;
  position: string;
  image:    string;
}

