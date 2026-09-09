import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export const LiveDemoGenerator: React.FC = () => {
	const [name, setName] = useState('Ananya');
	const [wish, setWish] = useState('');

	const generate = () => {
		setWish(`Dear ${name || 'friend'}, wishing you a joyful birthday filled with good health and wonderful moments!`);
	};

	return (
		<div className="mx-auto max-w-2xl rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 text-left shadow-sm">
			<div className="flex items-center gap-2 text-sm font-bold text-emerald-800"><Sparkles className="h-4 w-4" /> Try a birthday wish</div>
			<div className="mt-4 flex flex-col gap-3 sm:flex-row">
				<input value={name} onChange={(event) => setName(event.target.value)} className="min-h-11 flex-1 rounded-xl border border-stone-200 bg-white px-4 text-sm" placeholder="Customer name" />
				<button onClick={generate} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700">Generate wish</button>
			</div>
			{wish && <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-stone-700">{wish}</p>}
		</div>
	);
};
