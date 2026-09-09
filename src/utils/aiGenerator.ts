import { Customer, Tenant, WishLanguage, WishTone, WishVariant } from '../types';

interface GenerateWishInput {
	customer: Customer;
	tenant: Tenant;
	tone: WishTone;
	language: WishLanguage;
	customInstructions?: string;
}

const languageOpening: Record<WishLanguage, string> = {
	English: 'Wishing you a wonderful birthday filled with good health, happiness, and success.',
	Hindi: 'आपको जन्मदिन की हार्दिक शुभकामनाएं। आपका जीवन खुशियों और सफलता से भरा रहे।',
	Marathi: 'आपणास वाढदिवसाच्या हार्दिक शुभेच्छा! उत्तम आरोग्य आणि आनंद लाभो.',
};

export function generateWishVariants({ customer, tenant, tone, language, customInstructions }: GenerateWishInput): WishVariant[] {
	const name = customer.name;
	const business = tenant.profile.businessName;
	const instruction = customInstructions ? ` ${customInstructions}` : '';
	const variants = [
		`Dear ${name}, ${languageOpening[language]} Warm wishes from ${business}.${instruction}`,
		`${name}, happy birthday! May your special day bring you plenty of joy and memorable moments. Best wishes from ${business}.${instruction}`,
		`Dear ${name}, wishing you another bright year ahead. Thank you for being a valued part of our community. Happy birthday! - ${business}${instruction}`,
	];

	return variants.map((text, index) => ({
		id: `local-wish-${Date.now()}-${index}`,
		text,
		tone,
		language,
		characterCount: text.length,
		isAiGenerated: false,
		modelUsed: 'local-template',
	}));
}

export function refineWishText(text: string, type: 'shorter' | 'warmer' | 'formal' | 'less_salesy', name: string, businessName: string): string {
	if (type === 'shorter') return text.split('.').slice(0, 2).join('.').trim() + '.';
	if (type === 'warmer') return `Dear ${name}, ${text.replace(/^Dear\s+[^,]+,\s*/i, '').replace(/\s+-\s+.*$/, '')} With warmest wishes from all of us at ${businessName}.`;
	if (type === 'formal') return `Dear ${name}, please accept our sincere birthday wishes. We wish you continued health, happiness, and success.`;
	return text.replace(new RegExp(`\\s*(from|at)\\s+${businessName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[.!]?`, 'i'), '.');
}
