import pcIcon from '@/assets/icons/pc.ico';
import musicIcon from '@/assets/icons/music.ico';
import picturesIcon from '@/assets/icons/pictures 2.ico';
import internetIcon from '@/assets/icons/internet.ico';
import githubIcon from '@/assets/icons/github.ico';
import emailIcon from '@/assets/icons/email.ico';
import controlPanelIcon from '@/assets/icons/control panel.ico';
import userIcon from '@/assets/icons/account.ico';
import favouriteIcon from '@/assets/icons/favorites.ico';
import timelineIcon from '@/assets/icons/archive 2.ico';
import notesIcon from '@/assets/icons/notes.ico';
import scriptIcon from '@/assets/icons/script.ico';

export const appRegistry = {
  fileExplorer: {
    id: 'fileExplorer',
    name: 'File Explorer',
    icon: pcIcon,
    component: () => import('@/components/apps/FileExplorer.vue'),
    defaultSize: { w: 980, h: 620 },
    pinToDesktop: true,
    pinToTaskbar: true,
    bootDelayMs: 350,
    bootMessage: 'Mounting drives…',
  },
  musicPlayer: {
    id: 'musicPlayer',
    name: 'Music Player',
    icon: musicIcon,
    component: () => import('@/components/apps/MusicPlayer.vue'),
    defaultSize: { w: 900, h: 620 },
    pinToDesktop: true,
    pinToTaskbar: true,
    bootDelayMs: 600,
    bootMessage: 'Loading audio engine…',
  },
  photos: {
    id: 'photos',
    name: 'Photos',
    icon: picturesIcon,
    component: () => import('@/components/apps/Photos.vue'),
    defaultSize: { w: 1000, h: 680 },
    pinToDesktop: true,
    bootDelayMs: 400,
    bootMessage: 'Indexing photo library…',
  },
  browser: {
    id: 'browser',
    name: 'Browser',
    icon: internetIcon,
    component: () => import('@/components/apps/Browser.vue'),
    defaultSize: { w: 1080, h: 720 },
    pinToDesktop: true,
    pinToTaskbar: true,
    bootDelayMs: 300,
    bootMessage: 'Initializing renderer…',
  },
  resume: {
    id: 'resume',
    name: 'Resume',
    icon: userIcon,
    component: () => import('@/components/apps/ResumeViewer.vue'),
    defaultSize: { w: 900, h: 720 },
    pinToDesktop: true,
    bootDelayMs: 400,
    bootMessage: 'Loading document…',
  },
  github: {
    id: 'github',
    name: 'Github Profile',
    icon: githubIcon,
    component: () => import('@/components/apps/Github.vue'),
    defaultSize: { w: 920, h: 680 },
    pinToDesktop: true,
    bootDelayMs: 350,
    bootMessage: 'Connecting to github.com…',
  },
  certificates: {
    id: 'certificates',
    name: 'Certificates',
    icon: favouriteIcon,
    component: () => import('@/components/apps/Certificates.vue'),
    defaultSize: { w: 980, h: 660 },
    pinToDesktop: true,
    bootDelayMs: 350,
    bootMessage: 'Reading credentials…',
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline',
    icon: timelineIcon,
    component: () => import('@/components/apps/Timeline.vue'),
    defaultSize: { w: 1000, h: 660 },
    pinToDesktop: true,
    bootDelayMs: 350,
    bootMessage: 'Loading history…',
  },
  email: {
    id: 'email',
    name: 'Email',
    icon: emailIcon,
    component: () => import('@/components/apps/Email.vue'),
    defaultSize: { w: 800, h: 600 },
    pinToDesktop: true,
    bootDelayMs: 250,
    bootMessage: 'Loading composer…',
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: controlPanelIcon,
    component: () => import('@/components/apps/Settings.vue'),
    defaultSize: { w: 980, h: 640 },
    pinToDesktop: true,
    bootDelayMs: 300,
    bootMessage: 'Loading preferences…',
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    icon: scriptIcon,
    component: () => import('@/components/apps/Terminal.vue'),
    defaultSize: { w: 760, h: 480 },
    pinToTaskbar: true,
    bootDelayMs: 200,
    bootMessage: 'Initializing shell…',
  },
  about: {
    id: 'about',
    name: 'About this PC',
    icon: notesIcon,
    component: () => import('@/components/apps/About.vue'),
    defaultSize: { w: 720, h: 520 },
    bootDelayMs: 250,
    bootMessage: 'Reading system info…',
  },
};

export const desktopApps = Object.values(appRegistry).filter((a) => a.pinToDesktop);
export const taskbarPinned = Object.values(appRegistry).filter((a) => a.pinToTaskbar);
