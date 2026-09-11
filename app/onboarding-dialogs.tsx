import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { BookOpen, Play, Waypoints, X } from 'lucide-react';
import type { Messages } from '@/lib/i18n';
import type { MapNavigation } from './use-map-navigation';
type Props = { m: Messages; navigation: MapNavigation; startTour: () => void };
export default function OnboardingDialogs({ m, navigation, startTour }: Props) {
  const showGuide = navigation.state.guide;
  return (
    <>
      <Dialog
        open={navigation.state.welcome}
        onClose={() => navigation.close('welcome')}
        fullWidth
        maxWidth="xs"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-intro"
        slotProps={{ paper: { className: 'welcome-dialog' } }}
      >
        <DialogTitle className="modal-heading" id="welcome-title">
          <span>
            {m.welcomeTitle.replace('AI Safety Map', 'AI\u00a0Safety\u00a0Map')}
          </span>
          <IconButton
            aria-label={m.close}
            onClick={() => navigation.close('welcome')}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p className="welcome-intro" id="welcome-intro">
            {m.welcomeIntro}
          </p>
          {[
            {
              Icon: Waypoints,
              title: m.welcomeMapTitle,
              text: m.welcomeMapText,
            },
            { Icon: Play, title: m.welcomeTourTitle, text: m.welcomeTourText },
            {
              Icon: BookOpen,
              title: m.welcomeReadTitle,
              text: m.welcomeReadText,
            },
          ].map(({ Icon, title, text }) => {
            return (
              <div className="welcome-feature" key={title as string}>
                <Icon size={22} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigation.close('welcome')}>
            {m.welcomeBrowse}
          </Button>
          <Button
            variant="contained"
            startIcon={<Play size={16} />}
            onClick={() => {
              navigation.go({ welcome: false }, true);
              startTour();
            }}
          >
            {m.welcomeStart}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showGuide}
        onClose={() => navigation.close('guide')}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="modal-heading">
          <span>{m.parallelGuide}</span>
          <IconButton
            aria-label={m.close}
            onClick={() => navigation.close('guide')}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent className="parallel-guide">
          <p>
            <strong>AND · {m.joint}</strong>
            {m.jointHelp}
          </p>
          <p>
            <strong>OR · {m.alternative}</strong>
            {m.alternativeHelp}
          </p>
          <p>{m.parallelHelp}</p>
          <p>
            <strong>
              {m.influence} / {m.mitigation}
            </strong>
            {m.influenceHelp}
          </p>
          <p>{m.fullMapHelp}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
