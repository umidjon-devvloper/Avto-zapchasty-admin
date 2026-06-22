import type { Condition, ListingStatus } from './types';

export const CONDITION_LABELS: Record<Condition, string> = {
  new: 'Yangi',
  used: 'B/u',
  contract: 'Kontrakt',
  original: 'Original',
  duplicate: 'Dublikat',
};

export const STATUS_LABELS: Record<ListingStatus, string> = {
  draft: 'Qoralama',
  pending: 'Tekshiruvda',
  active: 'Faol',
  sold: 'Sotilgan',
  rejected: 'Rad etilgan',
  archived: 'Arxiv',
};

export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: 'new', label: 'Yangi' },
  { value: 'used', label: 'B/u' },
  { value: 'contract', label: 'Kontrakt' },
  { value: 'original', label: 'Original' },
  { value: 'duplicate', label: 'Dublikat' },
];

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'relevance', label: 'Aloqadorlik' },
  { value: 'newest', label: 'Eng yangi' },
  { value: 'cheap', label: 'Arzon' },
  { value: 'expensive', label: 'Qimmat' },
];
