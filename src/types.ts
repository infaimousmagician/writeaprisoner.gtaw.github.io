export type FacilityName = 
  | 'Bolingbroke State Penitentiary - Maximum'
  | 'Bolingbroke State Penitentiary - Medium'
  | 'LSCJ Twin Towers Correctional'
  | 'Sandy Shores Correctional Camp'
  | 'Paleto Bay Detention Center';

export type ConvictionCategory = 
  | 'Robbery / Theft'
  | 'Violent Crimes'
  | 'Narcotics & Smuggling'
  | 'Weapons & Firearms'
  | 'White Collar / Fraud'
  | 'Racketeering / RICO'
  | 'Other Offenses';

export type SeekingIntent = 
  | 'Friendship'
  | 'Romance'
  | 'Pen-Pal Letters'
  | 'Legal Assistance'
  | 'Mentorship'
  | 'Creative Exchange';

export interface InmateProfile {
  id: string;
  name: string;
  moniker?: string;
  bookingNumber: string;
  facility: FacilityName;
  gender: 'Male' | 'Female' | 'Non-Binary';
  age: number;
  dateOfBirth: string;
  ethnicity: string;
  hometown: string;
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  astrologicalSign: string;
  religion?: string;
  sexualOrientation: string;
  maritalStatus: string;
  conviction: string;
  convictionCategory: ConvictionCategory;
  sentence: string;
  incarceratedSince: string;
  paroleEligibility: string;
  securityLevel: 'Minimum' | 'Medium' | 'Maximum' | 'SuperMax';
  seeking: SeekingIntent[];
  aboutMe: string;
  whyWriteMe: string;
  hobbies: string[];
  institutionalAddress: {
    facilityName: string;
    poBox: string;
    cityStateZip: string;
  };
  primaryPhoto: string;
  galleryPhotos: string[];
  status: 'pending' | 'approved' | 'rejected';
  featured?: boolean;
  verifiedInmate: boolean;
  submittedAt: string;
  moderationNotes?: string;
  moderatedAt?: string;
  moderatedBy?: string;
}

export interface PrivateMessage {
  id: string;
  inmateId: string;
  inmateName: string;
  inmateBooking: string;
  senderName: string;
  senderHometown: string;
  senderContact: string;
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
  isLegalMail: boolean;
  status: 'Screened & Dispatched' | 'Pending Mailroom Clearance' | 'Delivered to Inmate';
  replies: {
    id: string;
    fromInmate: boolean;
    author: string;
    body: string;
    sentAt: string;
  }[];
}

export interface ModerationLog {
  id: string;
  inmateId: string;
  inmateName: string;
  action: 'Approved' | 'Rejected' | 'Verified' | 'Unverified' | 'Edited';
  reason?: string;
  moderator: string;
  timestamp: string;
}

export interface FilterState {
  searchQuery: string;
  facility: string;
  gender: string;
  ageRange: string;
  convictionCategory: string;
  seeking: string;
  sortBy: 'newest' | 'paroleSoon' | 'ageAsc' | 'ageDesc' | 'name';
}
