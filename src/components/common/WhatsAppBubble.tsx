import React from 'react';
import { CheckCheck } from 'lucide-react';
import { MessageStatus } from '../../types';

interface WhatsAppBubbleProps {
	message: string;
	recipientName?: string;
	businessName?: string;
	status?: MessageStatus;
	time?: string;
}

export const WhatsAppBubble: React.FC<WhatsAppBubbleProps> = ({
	message,
	recipientName,
	businessName,
	status = 'delivered',
	time = '08:30 AM',
}) => (
	<div className="max-w-xl rounded-2xl rounded-tl-sm border border-emerald-200 bg-[#e7f8df] p-3 text-sm text-stone-800 shadow-sm">
		{(recipientName || businessName) && (
			<div className="mb-2 text-[10px] font-semibold text-emerald-800">
				{recipientName ? `To ${recipientName}` : businessName}
			</div>
		)}
		<p className="whitespace-pre-wrap leading-relaxed">{message}</p>
		<div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-stone-500">
			<span>{time}</span>
			{status !== 'failed' && <CheckCheck className="h-3.5 w-3.5 text-sky-600" />}
		</div>
	</div>
);
