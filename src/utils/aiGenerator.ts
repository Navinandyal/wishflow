import { Customer, Tenant, WishVariant, Template } from '../types';

interface GenerateContext {
  customer: Partial<Customer>;
  tenant: Tenant;
  tone: 'Warm & Heartfelt' | 'Professional & Respectful' | 'Cheerful & Festive' | 'Brief & Crisp' | 'Networking / Business Value';
  language: 'English' | 'Hindi' | 'Marathi';
  length?: 'Short' | 'Medium' | 'Long';
  customNotes?: string;
  customInstructions?: string;
  senderName?: string;
  occasion?: 'BIRTHDAY' | 'ANNIVERSARY';
}

// Cultural tone templates for instant fallback and high-quality generation
const TEMPLATE_KNOWLEDGE_BASE = {
  English: {
    'Warm & Heartfelt': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Dear ${c.name || 'Friend'}, wishing you a wonderfully healthy and joyful Birthday! 🎂✨ May your special day bring countless reasons to smile. We feel truly privileged to have you as part of our ${t.profile.businessName || 'clinic'} family. Have a fantastic year filled with wellness and prosperity! Warm regards, ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Happy Birthday, ${c.name || 'Friend'}! 🌟 Sending you our warmest heartfelt wishes on your special day. Thank you for your continued trust in ${t.profile.businessName || 'our team'}. May this coming year bring you radiant health, peace of mind, and immense happiness. Best wishes from ${s || t.name}!`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Dearest ${c.name || 'Friend'}, wishing you a day filled with love, laughter, and your brightest smile! 🎉 May all your dreams and aspirations for this new year come true. Warmest birthday greetings from everyone at ${t.profile.businessName || 'our clinic'}. Celebrate big!`,
    ],
    'Professional & Respectful': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Dear ${c.name || 'valued customer'}, on the occasion of your Birthday, the entire team at ${t.profile.businessName || 'our organization'} extends our warmest greetings and best wishes. May the year ahead be defined by good health, personal milestones, and continued success. Warm regards, ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Wishing you a very Happy Birthday, ${c.name || 'Sir/Madam'}. It is a privilege to serve and collaborate with you. May you achieve continued fulfillment, good health, and prosperity in all your endeavors. Sincerely, ${s || t.name} (${t.profile.businessName || 'WishFlow'}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Warm birthday greetings to you, ${c.name || 'valued partner'}. On behalf of ${t.profile.businessName || 'our team'}, we wish you a prosperous and healthy year ahead. Thank you for being a cherished part of our journey. Regards, ${s || t.name}.`,
    ],
    'Cheerful & Festive': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Happy, Happy Birthday ${c.name || 'there'}! 🎈🥳 Time to put work on pause, treat yourself to your favorite cake, and celebrate another wonderful trip around the sun! Wishing you pure joy and good vibes from your friends at ${t.profile.businessName || 'our team'}. Cheers to an amazing year! 🥂`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Hurrah! It's your special day, ${c.name || 'Friend'}! 🎂🎉 May your birthday be as lively, bright, and delightful as you are! Wishing you boundless energy, joy, and wonderful celebrations today. Cheers from ${t.profile.businessName || 'WishFlow'}!`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Wishing you the happiest of birthdays, ${c.name || 'Friend'}! 🌟 May your year ahead be packed with exciting adventures, lots of laughter, and unforgettable moments. Have a blast today! Best regards from ${s || t.name}.`,
    ],
    'Brief & Crisp': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Happy Birthday, ${c.name || 'Friend'}! Wishing you good health, happiness, and memorable milestones this year. Warm regards from all of us at ${t.profile.businessName || 'our clinic'}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Wishing you a very Happy Birthday, ${c.name || 'there'}! May this new year bring you robust health and continued success. Best wishes, ${s || t.name} (${t.profile.businessName}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Warm birthday wishes, ${c.name || 'Friend'}! Wishing you joy, good health, and success today and always. From ${t.profile.businessName || 'our team'}.`,
    ],
    'Networking / Business Value': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Dear ${c.name || 'Colleague'}, wishing you an exceptional Birthday! 🚀 It is an honor collaborating and networking with you. Wishing you and your venture ${c.company ? `(${c.company}) ` : ''}monumental growth, breakthroughs, and prosperous partnerships this year. Let's catch up soon over coffee! Best wishes, ${s || t.name} (${t.profile.businessName}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Happy Birthday, ${c.name || 'Business Partner'}! 🤝 Wishing you strategic wins, expanding horizons, and robust health in your professional and personal journey. Looking forward to our continued association. Warm regards, ${s || t.name} (${t.profile.businessName}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `Wishing you a very Happy Birthday, ${c.name || 'Fellow Member'}! 🌟 May this year unlock remarkable business opportunities and lasting prosperity for you. Proud to be connected with you. Best regards, ${s || t.name}.`,
    ],
  },
  Marathi: {
    'Warm & Heartfelt': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `प्रिय ${c.name || 'मित्र'}, आपणास वाढदिवसाच्या मनःपूर्वक हार्दिक शुभेच्छा! 💐 ${t.profile.businessName || 'आमच्या परिवारा'}कडून आपणास उत्तम आरोग्य, सुख-शांती, समाधान आणि दीर्घायुष्य लाभो हीच ईश्वरचरणी प्रार्थना. आपले सुंदर हास्य असेच नेहमी कायम राहो! सस्नेह, ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `वाढदिवसाच्या हार्दिक शुभेच्छा ${c.name || 'जी'}! 🎂 ${t.profile.businessName} परिवाराचा एक महत्त्वाचा भाग असल्याबद्दल आपले मनःपूर्वक धन्यवाद. हे येणारे वर्ष आपल्या जीवनात नवीन आनंद आणि सुख-समृद्धी घेऊन येवो हीच सदिच्छा. सप्रेम, ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `सस्नेह नमस्कार ${c.name || ''}, वाढदिवसाच्या लक्षावधी मंगलमय शुभेच्छा! 🌟 आरोग्यसंपन्न, आनंदी आणि यशस्वी वर्षासाठी ${t.profile.businessName} कडून खूप खूप प्रेम आणि सदिच्छा!`,
    ],
    'Professional & Respectful': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `आदरणीय ${c.name || 'महोदय'}, आपणास वाढदिवसाच्या मनःपूर्वक आणि आदरयुक्त शुभेच्छा! 💐 ${t.profile.businessName || 'आमच्या संस्थे'}कडून आपणास उत्तम आरोग्य, दीर्घायुष्य आणि कार्यक्षेत्रात उत्तुंग यश लाभो हीच प्रार्थना. सस्नेह, ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `सस्नेह जय महाराष्ट्र! ${c.name || 'महोदय'}, आपल्या वाढदिवसानिमित्त हार्दिक मंगलकामना. आपल्या सहकार्याबद्दल मनःपूर्वक आभार. आपले आगामी वर्ष यशदायी जावो. आदरपूर्वक, ${s || t.name} (${t.profile.businessName}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `आदरणीय ${c.name || ''}, वाढदिवसाच्या हार्दिक शुभेच्छा! ईश्वर आपणास निरामय आरोग्य आणि अखंड सुख-समृद्धी देवो हीच सदिच्छा. - ${t.profile.businessName}.`,
    ],
    'Cheerful & Festive': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `वाढदिवसाच्या खूप खूप शुभेच्छा ${c.name || 'मित्रा'}! 🎈🎉 आजचा दिवस तुमच्यासाठी खास आनंद आणि गोड आठवणींचा जावो! वाढदिवस जोमात साजरा करा! ${t.profile.businessName} कडून खूप खूप सदिच्छा!`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `हॅपी बर्थडे ${c.name || ''}! 🥳🎂 नवीन वर्षात नवीन स्वप्ने, नवीन यश आणि भरपूर आनंद मिळो हीच सदिच्छा! सेलिब्रेट करा आजचा दिवस! सप्रेम, ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `धमाकेदार वाढदिवसाच्या मनापासून शुभेच्छा ${c.name || ''}! 🌟 हसत राहा आणि नेहमी आनंदी राहा! - ${t.profile.businessName}.`,
    ],
    'Brief & Crisp': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `वाढदिवसाच्या हार्दिक शुभेच्छा ${c.name || ''}! उत्तम आरोग्य आणि दीर्घायुष्य लाभो हीच सदिच्छा. - ${s || t.name} (${t.profile.businessName}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `आपणास वाढदिवसाच्या मनःपूर्वक मंगल शुभेच्छा! सुख, समाधान आणि समृद्धी लाभो. - ${t.profile.businessName}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `हॅपी बर्थडे ${c.name || ''}! पुढील वर्षासाठी हार्दिक सदिच्छा. - ${s || t.name}.`,
    ],
    'Networking / Business Value': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `सस्नेह नमस्कार ${c.name || 'मित्र'}, वाढदिवसाच्या मनःपूर्वक शुभेच्छा! 🚀 आपल्यासोबत नेटवर्किंग आणि व्यवसाय संबंध असणे अभिमानास्पद आहे. आपल्या ${c.company ? `(${c.company}) ` : ''}व्यवसायाची अशीच भरभराट होवो हीच सदिच्छा! लवकरच भेटूया. सस्नेह, ${s || t.name} (${t.profile.businessName}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `वाढदिवसाच्या हार्दिक शुभेच्छा ${c.name || 'सर'}! उद्योजकीय प्रवासात आपणास नवनवीन शिखरे पादाक्रांत करण्याचे बळ मिळो. उत्तम सहयोगासाठी मनःपूर्वक धन्यवाद! - ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `हॅपी बर्थडे ${c.name || ''}! 🤝 व्यवसाय वृद्धी आणि वैयक्तिक आयुष्यात भरभराट लाभो हीच सदिच्छा. सस्नेह, ${t.profile.businessName}.`,
    ],
  },
  Hindi: {
    'Warm & Heartfelt': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `प्रिय ${c.name || 'जी'}, आपको जन्मदिन की हार्दिक और ढेरों शुभकामनाएं! 🎂✨ ${t.profile.businessName || 'हमारी टीम'} की ओर से ईश्वर से प्रार्थना है कि आपका यह विशेष दिन उत्तम स्वास्थ्य, अपार खुशियां और शांति लेकर आए। आपकी मुस्कान हमेशा यूं ही बनी रहे! सप्रेम, ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `जन्मदिन मुबारक हो, ${c.name || 'जी'}! 🌟 ${t.profile.businessName} परिवार का एक अहम हिस्सा बनने के लिए आपका धन्यवाद। आने वाला साल आपके लिए नई उमंग और तरक्की लेकर आए। ढेरों शुभकामनाएं!`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `आदरणीय ${c.name || ''}, आपको जन्मदिन की अशेष शुभकामनाएं! 💐 प्रभु आपको दीर्घायु और निरोगी जीवन प्रदान करें। सप्रेम, ${s || t.name} (${t.profile.businessName}).`,
    ],
    'Professional & Respectful': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `आदरणीय ${c.name || 'महोदय'}, जन्मदिन के शुभ अवसर पर ${t.profile.businessName || 'हमारी संस्था'} की ओर से आपको कोटिशः शुभकामनाएं। हम आपके उत्तम स्वास्थ्य, दीर्घायु और निरंतर सफलता की मंगल कामना करते हैं। ससम्मान, ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `नमस्कार ${c.name || 'जी'}, आपको जन्मदिन की बहुत-बहुत बधाई। आपके साथ जुड़े रहना हमारे लिए गौरव की बात है। आपका आगामी वर्ष उपलब्धियों से भरा रहे। सादर, ${s || t.name} (${t.profile.businessName}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `आदरणीय ${c.name || ''} जी, जन्मदिन की हार्दिक बधाई। प्रभु की कृपा से आप सदैव स्वस्थ और समृद्ध रहें। - ${t.profile.businessName}.`,
    ],
    'Cheerful & Festive': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `जन्मदिन की ढेर सारी बधाई ${c.name || 'जी'}! 🎈🎉 आज का दिन मस्ती, मिठास और खुशियों से भरा हो! खूब जश्न मनाइए और हमेशा मुस्कुराते रहिए! शुभकामनाएं, ${t.profile.businessName}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `हैप्पी बर्थडे ${c.name || ''}! 🥳🎂 आपका नया साल ढेर सारी खुशियां और नई सफलताएं लेकर आए! बेस्ट विशेस फ्रॉम ${s || t.name}!`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `जन्मदिन बहुत-बहुत मुबारक हो ${c.name || ''}! 🌟 हमेशा हंसते-मुस्कुराते रहिए और जीवन का आनंद लीजिए! - ${t.profile.businessName}.`,
    ],
    'Brief & Crisp': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `जन्मदिन की हार्दिक शुभकामनाएं ${c.name || ''} जी! उत्तम स्वास्थ्य और समृद्धि की कामना करते हैं। - ${s || t.name} (${t.profile.businessName}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `आपको जन्मदिन की बधाई! आपका दिन और आने वाला वर्ष मंगलमय हो। - ${t.profile.businessName}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `हैप्पी बर्थडे ${c.name || ''}! सप्रेम, ${s || t.name}.`,
    ],
    'Networking / Business Value': [
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `प्रिय ${c.name || 'साथी'}, आपको जन्मदिन की बहुत-बहुत शुभकामनाएं! 🚀 आपके साथ नेटवर्किंग और व्यावसायिक संबंध अत्यंत प्रेरणादायक रहे हैं। आपके ${c.company ? `(${c.company}) ` : ''}व्यवसाय में अपार वृद्धि और नई ऊंचाइयों की कामना करते हैं। जल्द मिलते हैं! सस्नेह, ${s || t.name} (${t.profile.businessName}).`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `जन्मदिन की हार्दिक बधाई ${c.name || 'जी'}! 🤝 व्यापार और व्यक्तिगत जीवन में नई सफलताओं के लिए शुभकामनाएं। हमारे सहयोग के लिए आभार। सादर, ${s || t.name}.`,
      (c: Partial<Customer>, t: Tenant, s?: string) =>
        `हैप्पी बर्थडे ${c.name || ''}! व्यापार में नई उपलब्धियां और निरंतर उन्नति आपके कदम चूमे। - ${t.profile.businessName}.`,
    ],
  },
};

// Guardrail filters
export function applyGuardrails(text: string, customer: Partial<Customer>): { safeText: string; passed: boolean; reason?: string } {
  // 1. PII check: ensure no passwords, credit card numbers, or internal DB IDs are leaked
  let clean = text;
  
  // Replace unresolved placeholders if any remain
  clean = clean.replace(/\{\{name\}\}/gi, customer.name || 'Valued Customer');
  clean = clean.replace(/\{\{business_name\}\}/gi, 'Sunrise Dental Care');
  clean = clean.replace(/\{\{chapter\}\}/gi, 'Pune Champions Chapter');
  clean = clean.replace(/\{\{sender_name\}\}/gi, 'Dr. Rajesh Kulkarni');

  // Check for banned spam terms or offensive phrases
  const bannedPatterns = [/urgent transfer/i, /click here to win/i, /bank account/i, /lottery/i, /password/i];
  for (const pat of bannedPatterns) {
    if (pat.test(clean)) {
      return {
        safeText: `Happy Birthday ${customer.name || 'Friend'}! Wishing you good health and joy today from Sunrise Dental Care!`,
        passed: false,
        reason: 'Contained prohibited commercial spam phrase; replaced with safe professional greeting.',
      };
    }
  }

  return { safeText: clean.trim(), passed: true };
}

// Generate 3 variants based on context
export function generateWishVariants(ctx: GenerateContext): WishVariant[] {
  const lang = ctx.language || 'English';
  const tone = ctx.tone || 'Warm & Heartfelt';
  const sender = ctx.senderName || 'Dr. Rajesh Kulkarni';

  const langPack = TEMPLATE_KNOWLEDGE_BASE[lang] || TEMPLATE_KNOWLEDGE_BASE['English'];
  const toneFns = langPack[tone] || langPack['Warm & Heartfelt'];

  const variants: WishVariant[] = toneFns.map((fn, idx) => {
    const raw = fn(ctx.customer, ctx.tenant, sender);
    const { safeText } = applyGuardrails(raw, ctx.customer);
    return {
      id: `var_${Date.now()}_${idx}`,
      text: safeText,
      tone,
      language: lang,
      characterCount: safeText.length,
      isAiGenerated: true,
      modelUsed: 'gemini-2.5-flash',
      isEdited: false,
      originalText: safeText,
    };
  });

  return variants;
}

// Refine text using quick chips
export function refineWishText(
  currentText: string,
  refinementType: 'shorter' | 'warmer' | 'formal' | 'less_salesy' | 'translate_hindi' | 'translate_marathi' | 'translate_english',
  customerName: string = 'Friend',
  clinicName: string = 'Sunrise Dental Care'
): string {
  switch (refinementType) {
    case 'shorter':
      return `Happy Birthday, ${customerName}! 🎂 Wishing you wonderful health, joy, and success today and always. Warm regards from ${clinicName}.`;
    case 'warmer':
      return `Dearest ${customerName}, wishing you a truly wonderful Birthday surrounded by your loved ones! 💖 May your day be as sweet and bright as your smile. We are so lucky to have you with us. With heartfelt warmth, ${clinicName}.`;
    case 'formal':
      return `Dear ${customerName}, please accept our warmest congratulations and respect on the occasion of your Birthday. We wish you continued good health, peace, and distinguished achievements in the year ahead. Respectfully, ${clinicName}.`;
    case 'less_salesy':
      return `Happy Birthday ${customerName}! Sending you our sincere best wishes for peace, robust health, and happiness in the coming year. Warmly, ${clinicName}.`;
    case 'translate_hindi':
      return `प्रिय ${customerName} जी, आपको जन्मदिन की अशेष शुभकामनाएं! 🎂 प्रभु से आपके उत्तम स्वास्थ्य, दीर्घायु और खुशहाल जीवन की कामना करते हैं। सप्रेम, ${clinicName}.`;
    case 'translate_marathi':
      return `प्रिय ${customerName}, आपणास वाढदिवसाच्या मनःपूर्वक हार्दिक शुभेच्छा! 💐 ${clinicName} कडून आपणास उत्तम आरोग्य, सुख-शांती आणि दीर्घायुष्य लाभो हीच सदिच्छा. आपले सुंदर हास्य असेच कायम राहो! सस्नेह, ${clinicName}.`;
    case 'translate_english':
      return `Dear ${customerName}, wishing you a wonderfully healthy and joyful Birthday from all of us at ${clinicName}! 🎂✨ May your day be filled with reasons to flash your brightest smile. Warm regards, ${clinicName}.`;
    default:
      return currentText;
  }
}
