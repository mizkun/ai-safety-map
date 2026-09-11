import type { ReactNode } from 'react';
import type { Content } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import type { MapNavigation } from '../use-map-navigation';
import type { useReadingTools } from './use-reading-tools';

export type ReadingProps = {
  data: Content;
  m: Messages;
  navigation: MapNavigation;
  tools: ReturnType<typeof useReadingTools>;
  detailsReady: boolean;
  loading: ReactNode;
};
