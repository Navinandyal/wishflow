export type UserRole = 'owner' | 'staff' | 'superadmin';

export type TenantType = 'business' | 'scgt_member';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
}

export interface BusinessProfile {
  businessName: string;
  industry: string;
  city: string;
  state: string;
  website?: string;
  logoUrl?: string;
  brandDescription?: string;
  customSlug?: string;
}

export interface Tenant {
  id: string;
  name: string;
  type: TenantType;
  ownerId: string;
  profile: BusinessProfile;
  planId: 'free' | 'starter' | 'professional' | 'business' | 'enterprise';
  planStatus: 'trial' | 'active' | 'past_due' | 'suspended' | 'cancelled';
  trialDaysLeft: number;
  aiCreditsRemaining: number;
  aiCreditsMonthlyLimit: number;
  createdAt: string;
  whatsAppStatus: 'connected' | 'disconnected' | 'pending' | 'suspended';
  whatsAppNumber?: string;
  whatsAppDisplayName?: string;
  whatsAppQuality?: 'GREEN' | 'YELLOW' | 'RED';
  whatsAppTier?: 'TIER_1K' | 'TIER_10K' | 'TIER_100K' | 'TIER_UNLIMITED';
  scgtVerified: boolean;
  scgtVerificationStatus: 'unverified' | 'pending' | 'under_review' | 'info_requested' | 'verified' | 'rejected';
  scgtChapter?: string;
  scgtRegion?: string;
  scgtMembershipId?: string;
}

export type ConsentStatus = 'ACTIVE' | 'PENDING' | 'WITHDRAWN';
export type ConsentSource = 'COLLECTION_PAGE' | 'QR_CODE' | 'IN_PERSON' | 'IMPORT_EXPLICIT' | 'MANUAL_OFFLINE' | 'SCGT_NETWORK' | 'IMPORTED';

export interface ConsentRecord {
  status: ConsentStatus;
  source: ConsentSource;
  timestamp: string;
  channel: 'WHATSAPP';
  evidenceNote?: string;
  withdrawnAt?: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  mobile: string;
  whatsAppNumber?: string;
  email?: string;
  birthdayDay: number; // 1-31
  birthdayMonth: number; // 1-12
  birthdayYear?: number | null;
  anniversaryDay?: number;
  anniversaryMonth?: number;
  anniversaryYear?: number;
  anniversaryDate?: string;
  relationship: 'Patient' | 'Client' | 'VIP Customer' | 'Referral Partner' | 'Vendor' | 'Team Member' | 'Friend' | 'Family';
  industry?: string;
  occupation?: string;
  company?: string;
  city: string;
  state: string;
  preferredLanguage: 'English' | 'Hindi' | 'Marathi';
  tags: string[];
  notes?: string;
  consent: ConsentRecord;
  lastWishedYear?: number;
  lastWishedDate?: string;
  archived?: boolean;
  source: 'MANUAL' | 'IMPORT' | 'COLLECTION_PAGE' | 'QR_CODE' | 'SCGT_NETWORK' | 'IMPORTED';
  createdAt: string;
}

export type WishTone = 'Warm & Heartfelt' | 'Professional & Respectful' | 'Cheerful & Festive' | 'Brief & Crisp' | 'Networking / Business Value';
export type WishLanguage = 'English' | 'Hindi' | 'Marathi';

export interface WishVariant {
  id: string;
  text: string;
  tone: WishTone;
  language: WishLanguage;
  characterCount: number;
  isAiGenerated: boolean;
  modelUsed?: string;
  isEdited?: boolean;
  originalText?: string;
}

export type SendMode = 'ASSISTED' | 'MANAGED' | 'OWN_NUMBER';
export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'skipped';

export interface MessageRecord {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  messageBody: string;
  templateId?: string;
  templateVersion?: string;
  tone: string;
  language: string;
  isAiGenerated: boolean;
  sendMode: SendMode;
  status: MessageStatus;
  costInINR: number;
  providerMessageId?: string;
  queuedAt: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  repliedAt?: string;
  failureReason?: string;
  replyText?: string;
}

export interface ScheduledJob {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  occasion: 'BIRTHDAY' | 'ANNIVERSARY';
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  timezone: string;
  status: 'PLANNED' | 'GENERATED' | 'AWAITING_APPROVAL' | 'QUEUED' | 'SENT' | 'SKIPPED' | 'FAILED' | 'CANCELLED';
  wishText?: string;
  sendMode: SendMode;
  year: number;
  idempotencyKey: string;
}

export interface Template {
  id: string;
  tenantId?: string; // null for global library
  title: string;
  body: string;
  pack: 'Healthcare & Wellness' | 'Professional Services' | 'Retail & Hospitality' | 'SCGT Networking' | 'General Business';
  tone: 'Warm & Heartfelt' | 'Professional & Respectful' | 'Cheerful & Festive' | 'Brief & Crisp' | 'Networking / Business Value';
  language: 'English' | 'Hindi' | 'Marathi';
  occasion: 'BIRTHDAY' | 'ANNIVERSARY' | 'FESTIVAL';
  length: 'Short' | 'Medium' | 'Long';
  isFavorite?: boolean;
  isLibrary: boolean;
  version: number;
  metaApprovalStatus?: 'APPROVED' | 'PENDING' | 'REJECTED';
  usageCount: number;
  name?: string;
  category?: 'PROFESSIONAL' | 'WARM' | 'FESTIVE' | 'SHORT' | 'NETWORKING' | 'INDUSTRY' | string;
  content?: string;
  tags?: string[];
  isDefault?: boolean;
  useCount?: number;
}

export interface SCGTMember {
  id: string;
  name: string;
  businessName: string;
  category: string;
  chapter: string;
  region: string;
  city: string;
  birthdayDay: number;
  birthdayMonth: number;
  mobile: string;
  allowWhatsAppWish: boolean;
  allowBirthdayDisplay: boolean;
  allowBusinessDisplay: boolean;
  verified: boolean;
}

export interface SCGTChapter {
  id: string;
  name: string;
  region: string;
  city: string;
  memberCount: number;
  presidentName: string;
}

export interface NotificationItem {
  id: string;
  type: 'birthday_today' | 'wish_approval' | 'send_completed' | 'send_failed' | 'whatsapp_warning' | 'credits_low';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface SendingPreferences {
  defaultSendMode: SendMode;
  approvalMode: 'ALWAYS_ASK' | 'AUTOMATIC';
  defaultSendTime: string; // "08:30"
  timezone: string; // "Asia/Kolkata"
  defaultTone: 'Warm & Heartfelt' | 'Professional & Respectful' | 'Cheerful & Festive' | 'Brief & Crisp' | 'Networking / Business Value';
  defaultLanguage: 'English' | 'Hindi' | 'Marathi';
  frequencyCapDays: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'owner' | 'staff';
  status: 'active' | 'invited';
  joinedAt: string;
}

export interface PlanDetails {
  id: 'free' | 'starter' | 'professional' | 'business' | 'enterprise';
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  customerLimit: number;
  aiCreditsPerMonth: number;
  features: string[];
  popular?: boolean;
  ownNumberAllowed: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  tenantName: string;
  action: string;
  entity: string;
  ip: string;
  reason?: string;
}

export interface WebhookLogItem {
  id: string;
  source: 'WHATSAPP' | 'RAZORPAY' | 'AI_ENGINE';
  event: string;
  status: 'RECEIVED' | 'PROCESSED' | 'FAILED' | 'DEAD_LETTERED';
  timestamp: string;
  payloadSummary: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  targetPlans: string[];
}
