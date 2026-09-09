import React from 'react';
import { Cake } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
	const { navigate } = useApp();
	return (
		<header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
			<button onClick={() => navigate('/')} className="flex items-center gap-2 text-lg font-bold">
				<span className="rounded-lg bg-emerald-500 p-2 text-stone-950"><Cake className="h-4 w-4" /></span>
				WishFlow AI
			</button>
			<div className="flex items-center gap-3 text-sm font-semibold">
				<button onClick={() => navigate('/pricing')} className="text-stone-500 hover:text-stone-900">Pricing</button>
				<button onClick={() => navigate('/login')} className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Sign in</button>
			</div>
		</header>
	);
};
