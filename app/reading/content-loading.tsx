import type { Messages } from '@/lib/i18n';
import { Button, CircularProgress } from '@mui/material';

export default function ContentLoading({
  m,
  error,
  onRetry,
}: {
  m: Messages;
  error: boolean;
  onRetry: () => void;
}) {
  return (
    <output className="content-loading">
      {error ? (
        <>
          <span>{m.loadError}</span>
          <Button onClick={onRetry}>{m.retry}</Button>
          <Button onClick={() => window.location.reload()}>
            {m.refreshPage}
          </Button>
        </>
      ) : (
        <>
          <CircularProgress size={24} />
          <span>{m.loading}</span>
        </>
      )}
    </output>
  );
}
