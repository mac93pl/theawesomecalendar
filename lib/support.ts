export type SupportLanguage = 'pl' | 'en';

type SupportConfig = {
  amounts: readonly [number, number, number];
  currency: 'pln' | 'usd';
  currencyLabel: 'PLN' | 'USD';
  maxAmount: number;
  minAmount: number;
  recommendedAmount: number;
};

export const SUPPORT_CONFIG = {
  pl: {
    amounts: [10, 20, 50],
    currency: 'pln',
    currencyLabel: 'PLN',
    maxAmount: 1000,
    minAmount: 5,
    recommendedAmount: 20,
  },
  en: {
    amounts: [5, 10, 20],
    currency: 'usd',
    currencyLabel: 'USD',
    maxAmount: 250,
    minAmount: 2,
    recommendedAmount: 10,
  },
} as const satisfies Record<SupportLanguage, SupportConfig>;

export function formatSupportAmount(amount: number, language: SupportLanguage) {
  return language === 'pl' ? `${amount} zł` : `$${amount}`;
}
