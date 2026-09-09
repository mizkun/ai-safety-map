import MapClient from './map-client';
import { loadSiteContent } from '@/lib/load-content';
export default function Home() {
  return <MapClient site={loadSiteContent()} />;
}
