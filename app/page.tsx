import MapClient from './map-client';
import { loadContent } from '@/lib/load-content';
export default function Home() {
  return <MapClient data={loadContent()} />;
}
