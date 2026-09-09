import React from 'react';
import { Check, Clock3, MessageCircle, X } from 'lucide-react';
import { ConsentStatus, MessageStatus } from '../../types';

interface ConsentBadgeProps {
	status: ConsentStatus;
}

interface MessageStatusBadgeProps {
	status: MessageStatus;
}

const consentStyles: Record<ConsentStatus, string> = {
	ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
	WITHDRAWN: 'bg-rose-50 text-rose-700 border-rose-200',
};

const consentLabels: Record<ConsentStatus, string> = {
	ACTIVE: 'WhatsApp opted in',
	PENDING: 'Consent pending',
	WITHDRAWN: 'Opted out',
};

const messageStyles: Record<MessageStatus, string> = {
	queued: 'bg-sky-50 text-sky-700 border-sky-200',
	sent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
	delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	read: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	failed: 'bg-rose-50 text-rose-700 border-rose-200',
	skipped: 'bg-stone-100 text-stone-600 border-stone-200',
};

const messageLabels: Record<MessageStatus, string> = {
	queued: 'Queued',
	sent: 'Sent',
	delivered: 'Delivered',
	read: 'Read',
	failed: 'Failed',
	skipped: 'Skipped',
};

export const ConsentBadge: React.FC<ConsentBadgeProps> = ({ status }) => (
	<span
		className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${consentStyles[status]}`}
	>
		{status === 'ACTIVE' ? <Check className="h-3 w-3" /> : status === 'PENDING' ? <Clock3 className="h-3 w-3" /> : <X className="h-3 w-3" />}
		{consentLabels[status]}
	</span>
);

export const MessageStatusBadge: React.FC<MessageStatusBadgeProps> = ({ status }) => (
	<span
		className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${messageStyles[status]}`}
	>
		<MessageCircle className="h-3 w-3" />
		{messageLabels[status]}
	</span>
);

export const SCGTStatusBadge: React.FC<{ status?: string }> = ({ status }) => {
	const verified = status === 'VERIFIED' || status === 'verified';
	return (
		<span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-bold ${verified ? 'border-emerald-300 bg-emerald-400/20 text-emerald-200' : 'border-amber-300 bg-amber-400/20 text-amber-200'}`}>
			{verified ? 'Verified' : status || 'Pending'}
		</span>
	);
};
