'use client';
import { type Locale } from '@/lib/i18n';
import { libraryPanels } from '@/lib/map-navigation';
import {
  ButtonBase,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import {
  ArrowUpRight,
  GitBranch,
  Info,
  Menu as MenuIcon,
  Waypoints,
} from 'lucide-react';
import type { Panel } from './reading-panels';

import type { LocaleOption } from '@/lib/content-types';
import type { Messages } from '@/lib/i18n';
import { repositoryUrl as REPO } from '@/lib/site-config';
import type { MapNavigation } from './use-map-navigation';
type Props = {
  navigation: MapNavigation;
  m: Messages;
  alternateLocale?: LocaleOption;
  menuAnchor: HTMLElement | null;
  onMenuAnchor: (anchor: HTMLElement | null) => void;
  selectRoute: (id: string) => void;
  openCurrent: () => void;
  changeLocale: (locale: Locale) => void;
  navigate: (map: Panel) => void;
};
export default function MapHeader({
  navigation,
  m,
  alternateLocale,
  menuAnchor,
  onMenuAnchor: setMenuAnchor,
  selectRoute,
  openCurrent,
  changeLocale,
  navigate,
}: Props) {
  const { view, tour, expanded } = navigation.state;
  const panels = libraryPanels;
  return (
    <>
      <header className="app-header">
        <Paper elevation={0} className="brand-pill glass">
          <ButtonBase
            aria-label={m.overview}
            onClick={() => selectRoute('overview')}
          >
            <Waypoints size={21} />
            <span>AI SAFETY MAP</span>
          </ButtonBase>
        </Paper>
        <div className="header-actions">
          <Paper elevation={0} className="current-map-control glass">
            <FormControlLabel
              className="current-map-toggle"
              label={m.currentToggle}
              labelPlacement="start"
              control={
                <Switch
                  size="small"
                  checked={Boolean(navigation.state.lens)}
                  onChange={(_, checked) =>
                    navigation.go({ lens: checked ? 'current' : null })
                  }
                  slotProps={{ input: { role: 'switch' } }}
                />
              }
            />
            <Tooltip title={m.currentKey}>
              <IconButton aria-label={m.currentKey} onClick={openCurrent}>
                <Info size={17} />
              </IconButton>
            </Tooltip>
          </Paper>
          <Paper elevation={0} className="header-tools glass">
            {view === 'overview' && !tour && (
              <>
                <ToggleButtonGroup
                  className="header-scope"
                  size="small"
                  exclusive
                  value={expanded ? 'all' : 'summary'}
                  onChange={(_, value: string | null) => {
                    if (value) navigation.go({ expanded: value === 'all' });
                  }}
                  aria-label={m.displayScope}
                >
                  <ToggleButton value="summary">{m.summaryView}</ToggleButton>
                  <ToggleButton value="all">{m.allElements}</ToggleButton>
                </ToggleButtonGroup>
                <span className="header-divider" aria-hidden="true" />
              </>
            )}
            {alternateLocale && (
              <Tooltip title={alternateLocale.name}>
                <ButtonBase
                  className="language-switch"
                  aria-label={alternateLocale.name}
                  lang={alternateLocale.code}
                  onClick={() => changeLocale(alternateLocale.code)}
                >
                  {alternateLocale.code === 'ja' ? 'JP' : 'EN'}
                </ButtonBase>
              </Tooltip>
            )}
            <Tooltip title={m.library}>
              <IconButton
                aria-label={m.library}
                aria-controls={menuAnchor ? 'library-menu' : undefined}
                aria-haspopup="menu"
                aria-expanded={Boolean(menuAnchor)}
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <MenuIcon size={19} />
              </IconButton>
            </Tooltip>
          </Paper>
        </div>
      </header>
      <Menu
        id="library-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={openCurrent}>{m.currentTitle}</MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            navigation.go({ guide: true });
          }}
        >
          {m.parallelGuide}
        </MenuItem>
        {panels.map((p) => (
          <MenuItem key={p} onClick={() => navigate(p)}>
            <span>{m[p]}</span>
          </MenuItem>
        ))}
        <MenuItem
          component="a"
          href={REPO}
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuAnchor(null)}
        >
          <GitBranch size={16} />
          <span>{m.contribute}</span>
          <ArrowUpRight size={13} />
        </MenuItem>
      </Menu>
    </>
  );
}
