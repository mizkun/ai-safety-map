import MapClient from './map-client';
import { loadSiteShell } from '@/lib/load-content';
export default function Home() {
  return <MapClient site={loadSiteShell()} />;
}
