import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, CheckCircle, Clock, Send, AlertTriangle, Sparkles } from 'lucide-react';
import { ConsentStatus, MessageStatus } from '../../types';

export const ConsentBadge: React.FC<{ status: ConsentStatus; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <span
          id={`consent-badge-${status.toLowerCase()}`}
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        >
          <ShieldCheck className="w-3 h-3" />
          Consent Active
        </span>
      );
    case 'PENDING':
      return (
        <span
          id={`consent-badge-${status.toLowerCase()}`}
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
        >
          <Clock className="w-3 h-3" />
          Pending Consent
        </span>
      );
    case 'WITHDRAWN':
      return (
        <span
          id={`consent-badge-${status.toLowerCase()}`}
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
        >
          <ShieldX className="w-3 h-3" />
          Withdrawn
        </span>
      );
    default:
      return null;
  }
};

export const MessageStatusBadge: React.FC<{ status: MessageStatus; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'read':
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 ${className}`}>
          <CheckCircle className="w-3 h-3 text-sky-600" />
          Read
        </span>
      );
    case 'delivered':
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          Delivered
        </span>
      );
    case 'sent':
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 ${className}`}>
          <Send className="w-3 h-3 text-teal-600" />
          Sent
        </span>
      );
    case 'queued':
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 ${className}`}>
          <Clock className="w-3 h-3 text-stone-500" />
          Queued
        </span>
      );
    case 'failed':
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          Failed
        </span>
      );
    case 'skipped':
      return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 ${className}`}>
          Skipped
        </span>
      );
  }
};

export const SCGTStatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  const s = status.toUpperCase();
  if (s === 'VERIFIED') {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}>
        <Sparkles className="w-3 h-3 text-emerald-600" />
        Verified Member
      </span>
    );
  }
  if (s === 'PENDING' || s === 'UNDER_REVIEW') {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 ${className}`}>
        <Clock className="w-3 h-3 text-amber-600" />
        Verification Pending
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 ${className}`}>
      Not Verified
    </span>
  );
};

