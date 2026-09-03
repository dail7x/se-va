const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '5491133147770';
export const whatsappPhone = rawPhone.replace(/\D/g, '');

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
