import wallpaperVideo from '@/assets/wallpaper.mp4';
import lockscreenImg from '@/assets/lockscreen.jpg';

export const wallpapers = [
  {
    kind: 'animated',
    label: 'Aurora',
    style: {
      background:
        'radial-gradient(80% 60% at 20% 30%, rgba(108, 140, 255, 0.55) 0%, transparent 60%),' +
        'radial-gradient(70% 60% at 80% 70%, rgba(157, 93, 255, 0.5) 0%, transparent 60%),' +
        'radial-gradient(100% 80% at 50% 100%, rgba(60, 200, 220, 0.35) 0%, transparent 65%),' +
        'linear-gradient(180deg, #0a0d1c 0%, #060814 100%)',
    },
  },
  {
    kind: 'video',
    label: 'Motion',
    src: wallpaperVideo,
    mime: 'video/mp4',
  },
  {
    kind: 'image',
    label: 'Lockscreen',
    src: lockscreenImg,
  },
  {
    kind: 'animated',
    label: 'Nebula',
    style: {
      background:
        'radial-gradient(60% 50% at 70% 20%, rgba(255, 105, 180, 0.45) 0%, transparent 60%),' +
        'radial-gradient(70% 60% at 30% 80%, rgba(80, 100, 255, 0.5) 0%, transparent 65%),' +
        'linear-gradient(180deg, #110a26 0%, #02030a 100%)',
    },
  },
  {
    kind: 'animated',
    label: 'Cyber',
    style: {
      background:
        'linear-gradient(135deg, #021024 0%, #0a1730 30%, #311a4a 70%, #0a0916 100%)',
    },
  },
];
