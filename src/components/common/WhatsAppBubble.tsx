import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { MessageStatus } from '../../types';

interface WhatsAppBubbleProps {
  message: string;
  recipientName?: string;
  senderName?: string;
  businessName?: string;
  status?: MessageStatus;
  time?: string;
  replyText?: string;
  isAiGenerated?: boolean;
  className?: string;
}

export const WhatsAppBubble: React.FC<WhatsAppBubbleProps> = ({
  message,
  recipientName = 'Customer',
  senderName = 'Dr. Rajesh Kulkarni',
  businessName = 'Sunrise Dental Care',
  status = 'delivered',
  time = '08:30 AM',
  replyText,
  isAiGenerated = true,
  className = '',
}) => {
  const renderStatusIcon = () => {
    switch (status) {
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-stone-500" />;
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-stone-500" />;
      case 'queued':
        return <Clock className="w-3.5 h-3.5 text-stone-400" />;
      case 'failed':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <CheckCheck className="w-3.5 h-3.5 text-stone-500" />;
    }
  };

  return (
    <div
      id="whatsapp-bubble-container"
      className={`rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden bg-[#efeae2] relative ${className}`}
    >
      {/* WhatsApp chat top bar */}
      <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-700/80 flex items-center justify-center text-xs font-semibold uppercase border border-emerald-500/40">
            {recipientName.slice(0, 2)}
          </div>
          <div>
            <div className="text-xs font-semibold leading-tight">{recipientName}</div>
            <div className="text-[10px] text-emerald-100/80">via WhatsApp Business</div>
          </div>
        </div>
        {isAiGenerated && (
          <span className="text-[10px] tracking-wide bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-400/30 text-emerald-200">
            AI Personalized
          </span>
        )}
      </div>

      {/* WhatsApp Chat Canvas Background Pattern */}
      <div className="p-4 space-y-3 min-h-[160px] flex flex-col justify-end bg-[#efeae2]/90">
        <div className="flex justify-center">
          <span className="text-[10px] font-medium uppercase px-2.5 py-0.5 rounded-md bg-white/70 text-stone-600 shadow-xs border border-stone-200/60">
            Today
          </span>
        </div>

        {/* Outgoing Message Bubble (Sent by business) */}
        <div className="flex flex-col items-end">
          <div className="max-w-[88%] bg-[#d9fdd3] text-stone-900 rounded-2xl rounded-tr-xs px-3.5 py-2.5 shadow-xs border border-[#c1e9bb] relative">
            <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap break-words font-normal">
              {message}
            </p>
            <div className="flex items-center justify-end gap-1 mt-1.5 text-[10.5px] text-stone-500 select-none">
              <span>{time}</span>
              <span>{renderStatusIcon()}</span>
            </div>
          </div>
        </div>

        {/* Incoming Customer Reply Bubble (if replied) */}
        {replyText && (
          <div className="flex flex-col items-start mt-1">
            <div className="max-w-[85%] bg-white text-stone-900 rounded-2xl rounded-tl-xs px-3.5 py-2 shadow-xs border border-stone-200">
              <p className="text-[13px] leading-relaxed text-stone-800">{replyText}</p>
              <div className="text-right text-[10px] text-stone-400 mt-1">08:42 AM</div>
            </div>
          </div>
        )}
      </div>

      {/* Message footer info */}
      <div className="bg-stone-50 px-3.5 py-2 text-[11px] text-stone-500 border-t border-stone-200 flex items-center justify-between">
        <span>Chars: {message.length}</span>
        <span>Sender: {businessName}</span>
      </div>
    </div>
  );
};
