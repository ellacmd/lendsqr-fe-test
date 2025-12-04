
export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';

export interface UserProfile {
  id: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
    personalInformation: {
    fullName: string;
    phoneNumber: string;
    email: string;
    bvn: string;
    gender: string;
    maritalStatus: string;
    children: string; 
    typeOfResidence: string; 
  };
  
  educationAndEmployment: {
    levelOfEducation: string;
    employmentStatus: string;
    sectorOfEmployment: string;
    durationOfEmployment: string;
    officeEmail: string;
    monthlyIncome: string[];
    loanRepayment: string;
  };
  
  socials: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
  
  guarantor: {
    fullName: string;
    phoneNumber: string;
    email: string;
    relationship: string;
  };
}