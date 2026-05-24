export interface DemographicAge {
  range: string;
  percentage: number;
}

export interface DemographicLocation {
  name: string;
  percentage: number;
}

export interface AudienceDemographics {
  gender: {
    male: number;
    female: number;
    other: number;
  };
  age: DemographicAge[];
  topLocations: DemographicLocation[];
  interests: string[];
  onlineActivityTimes?: Array<{
    day: string;
    peakHours: string;
    activePercentage: number;
  }>;
}

export interface SocialMetrics {
  growthTrend: number[]; // Weekly growth indices for charts
  totalReach: string;
  monthlyImpressions: string;
}

export interface Review {
  id: string;
  businessName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  niche: string;
  followers: string;
  followerNum: number; // numeric value for sorting
  engagementRate: string;
  engagementQualityScore: number; // calculated quality score (0-100)
  sentimentScore: number; // calculated user sentiment score (0-100)
  platforms: string[];
  averageViews: string;
  costPerPost: number; // numeric price
  location: string;
  bio: string;
  isVerified: boolean;
  audienceDemographics: AudienceDemographics;
  socialMetrics: SocialMetrics;
  reviews: Review[];
  verifiedChannels: {
    youtube?: string;
    instagram?: string;
  };
}

export interface Contract {
  id: string;
  influencerId: string;
  influencerName: string;
  influencerHandle: string;
  influencerAvatar: string;
  businessName: string;
  status: 'pending' | 'active' | 'in_review' | 'completed' | 'cancelled';
  terms: string;
  amount: number;
  commission?: number;
  totalAmount?: number;
  paymentStatus: 'unpaid' | 'escrowed' | 'released' | 'refunded';
  campaignName: string;
  expirationDate?: string;
}

export interface AIAnalysisResult {
  sourceUrl: string;
  platform: 'youtube' | 'instagram' | 'unknown';
  influencerHandle: string;
  reasoning: string;
  engagementQualityScore: number;
  engagementQualityRating: 'Exceptional' | 'High' | 'Moderate' | 'Low';
  sentimentScore: number;
  sentimentSummary: string;
  demographicsBreakdown: AudienceDemographics;
  behavioralInsights: string[];
  keyStrengths: string[];
  contentImprovementTriggers: string[];
  analyzedAt: string;
}

export interface CommunityComment {
  author: string;
  text: string;
  timestamp?: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  avatar: string;
  role: string;
  platform: string;
  targetInfluencer: string;
  views: string;
  rating: number;
  likes: number;
  comments: CommunityComment[];
  timestamp: string;
  mediaUrl?: string;
}

