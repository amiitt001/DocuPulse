export type ScreenType = 
  | 'home'
  | 'viewer'
  | 'scanner'
  | 'crop'
  | 'edit-pdf'
  | 'qr'
  | 'qr-generator'
  | 'files'
  | 'tools'
  | 'settings';

export type HomeMode = 'pdf' | 'qr';

export type QRPayloadType = 'url' | 'text' | 'wifi' | 'contact' | 'email' | 'phone' | 'location';

export type QRErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export type QRModuleStyle = 'square' | 'dots' | 'smooth';

export type DocumentFilter = 'original' | 'magic' | 'grayscale' | 'bw' | 'warm';

export type CacheStatus = 'cached' | 'syncing' | 'pending';
export type SyncState = 'synced' | 'syncing' | 'pending' | 'offline';

export interface DocCacheMeta {
  status: CacheStatus;
  lastSynced: string;
  cacheSize: string;
  isPinned: boolean;
  integrityHash: string;
  highResCached: boolean;
}

export interface SyncHealthStats {
  totalDocuments: number;
  cachedOfflineCount: number;
  pendingCount: number;
  totalCacheSize: string;
  ocrIndexedCount: number;
  lastSyncTime: string;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  syncProgress: number;
  syncStepMessage: string;
}

export interface DocItem {
  id: string;
  filename: string;
  pages: number;
  size: string;
  date: string;
  type: 'pdf' | 'image' | 'qr';
  tag?: string;
  isLocked?: boolean;
  isOcr?: boolean;
  rawText?: string;
  cache?: DocCacheMeta;
}

export interface QRItem {
  id: string;
  title: string;
  subtitle: string;
  type: QRPayloadType;
  payload: string;
  date: string;
}

export interface PageCardItem {
  id: number;
  pageNum: number;
  title: string;
  type: string;
  rotation: number;
  isSelected: boolean;
  statBadge?: string;
  footerLabel: string;
}
