import React, { useState } from 'react';
import { Check, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicCustomerCollection: React.FC = () => {
	const { tenant, addCustomer } = useApp();
	const [submitted, setSubmitted] = useState(false);
	const [name, setName] = useState('');
	const [mobile, setMobile] = useState('');
	const [birthday, setBirthday] = useState('');
	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		const [birthdayMonth, birthdayDay] = birthday.split('-').map(Number);
		if (!name || !mobile || !birthdayDay || !birthdayMonth) return;
		addCustomer({ name, mobile, birthdayDay, birthdayMonth, relationship: 'Client', city: '', state: '', preferredLanguage: 'English', tags: [], consent: { status: 'ACTIVE', source: 'COLLECTION_PAGE', timestamp: new Date().toISOString(), channel: 'WHATSAPP' }, source: 'COLLECTION_PAGE' });
		setSubmitted(true);
	};
	return <main className="flex min-h-screen items-center justify-center bg-emerald-950 p-6"><div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">{submitted ? <div className="py-10 text-center"><Check className="mx-auto h-12 w-12 text-emerald-600" /><h1 className="mt-4 text-2xl font-bold">You are all set</h1><p className="mt-2 text-sm text-stone-600">{tenant.profile.businessName} will remember your special day.</p></div> : <><div className="mb-7 text-center"><Gift className="mx-auto h-9 w-9 text-emerald-600" /><h1 className="mt-3 text-2xl font-bold">Stay in touch with {tenant.profile.businessName}</h1><p className="mt-2 text-sm text-stone-600">Share your details to receive a thoughtful birthday wish.</p></div><form onSubmit={submit} className="space-y-4"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" /><input required value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="WhatsApp number" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" /><input required type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm" /><button className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700">Save my birthday</button></form></>}</div></main>;
};
