import { defineStore } from 'pinia';
import { reactive } from 'vue';

import driveOsIcon from '@/assets/icons/drive os.ico';
import driveIcon from '@/assets/icons/drive.ico';
import usbIcon from '@/assets/icons/usb 1.ico';
import folderIcon from '@/assets/icons/folder 1.ico';
import folderAltIcon from '@/assets/icons/folder 2.ico';
import documentsIcon from '@/assets/icons/documents.ico';
import downloadsIcon from '@/assets/icons/downloads.ico';
import musicIcon from '@/assets/icons/music.ico';
import picturesIcon from '@/assets/icons/pictures 2.ico';
import videoIcon from '@/assets/icons/video.ico';
import desktopIcon from '@/assets/icons/desktop.ico';
import fileIcon from '@/assets/icons/file 2.ico';
import scriptIcon from '@/assets/icons/script.ico';
import gameIcon from '@/assets/icons/games.ico';
import notesIcon from '@/assets/icons/notes.ico';
import favouriteIcon from '@/assets/icons/favorites.ico';
import githubIcon from '@/assets/icons/github.ico';
import internetIcon from '@/assets/icons/internet.ico';

export const FS_ICONS = {
  folder: folderIcon,
  folderAlt: folderAltIcon,
  documents: documentsIcon,
  downloads: downloadsIcon,
  music: musicIcon,
  pictures: picturesIcon,
  video: videoIcon,
  desktop: desktopIcon,
  file: fileIcon,
  script: scriptIcon,
  game: gameIcon,
  notes: notesIcon,
  favourite: favouriteIcon,
  github: githubIcon,
  internet: internetIcon,
};

function folder(name, icon, children = [], extra = {}) {
  return {
    type: 'folder',
    name,
    icon: icon ?? folderIcon,
    children,
    ...extra,
  };
}

function file(name, icon, action, extra = {}) {
  return {
    type: 'file',
    name,
    icon: icon ?? fileIcon,
    action,
    ...extra,
  };
}

function shortcut(name, icon, appId, extra = {}) {
  return {
    type: 'shortcut',
    name,
    icon: icon ?? scriptIcon,
    action: { kind: 'openApp', appId },
    ...extra,
  };
}

export const useFsStore = defineStore('fs', {
  state: () => ({
    tree: reactive({
      type: 'root',
      name: 'Computer',
      children: [
        {
          type: 'drive',
          name: 'Local Disk (C:)',
          label: 'C:',
          icon: driveOsIcon,
          totalSpace: 250,
          freeSpace: 132,
          children: [
            folder('Users', folderAltIcon, [
              folder('Avishake', folderAltIcon, [
                folder('Desktop', desktopIcon, [
                  shortcut('Resume.pdf', fileIcon, 'resume'),
                  shortcut('Github.url', githubIcon, 'github'),
                  shortcut('Portfolio.html', internetIcon, 'browser'),
                ]),
                folder('Documents', documentsIcon, [
                  shortcut('Resume.pdf', fileIcon, 'resume'),
                  shortcut('Certificates', favouriteIcon, 'certificates'),
                  shortcut('Timeline', notesIcon, 'timeline'),
                ]),
                folder('Downloads', downloadsIcon, [
                  file('readme.txt', fileIcon, {
                    kind: 'text',
                    body: 'Welcome to Avishake OS. Explore the drives — each shortcut opens a real application.',
                  }),
                ]),
                folder('Music', musicIcon, [
                  shortcut('Open Music Player', musicIcon, 'musicPlayer'),
                ]),
                folder('Pictures', picturesIcon, [
                  shortcut('Open Photos', picturesIcon, 'photos'),
                ]),
                folder('Videos', videoIcon, []),
              ]),
            ]),
            folder('Program Files', folderIcon, [
              shortcut('File Explorer', folderIcon, 'fileExplorer'),
              shortcut('Music Player', musicIcon, 'musicPlayer'),
              shortcut('Photos', picturesIcon, 'photos'),
              shortcut('Browser', internetIcon, 'browser'),
              shortcut('Email', folderIcon, 'email'),
              shortcut('Terminal', scriptIcon, 'terminal'),
              shortcut('Settings', folderIcon, 'settings'),
            ]),
            folder('Windows', folderIcon, [
              folder('System32', folderIcon, [
                file('kernel.sys', scriptIcon, { kind: 'text', body: 'Access denied.' }),
              ]),
            ]),
          ],
        },
        {
          type: 'drive',
          name: 'Projects (D:)',
          label: 'D:',
          icon: driveIcon,
          totalSpace: 500,
          freeSpace: 312,
          children: [
            folder('Open Source', folderIcon, [
              file('OS-Portfolio.md', fileIcon, {
                kind: 'link',
                href: 'https://github.com/AvishakeAdhikary/OS-Portfolio',
              }),
              file('Text-To-Image-Generator.md', fileIcon, {
                kind: 'link',
                href: 'https://github.com/AvishakeAdhikary/Text-To-Image-Generator',
              }),
              file('Python-Code-Generator.md', fileIcon, {
                kind: 'link',
                href: 'https://github.com/AvishakeAdhikary/Python-Code-Generator',
              }),
            ]),
            folder('Experiments', folderIcon, [
              file('notes.txt', notesIcon, {
                kind: 'text',
                body:
                  'Currently learning Large Language Models & integrating them into products.\nFeel free to reach out: avhishe.adhikary11@gmail.com',
              }),
            ]),
          ],
        },
        {
          type: 'drive',
          name: 'Media (F:)',
          label: 'F:',
          icon: usbIcon,
          totalSpace: 1000,
          freeSpace: 740,
          children: [
            folder('Photos', picturesIcon, [
              shortcut('Open Gallery', picturesIcon, 'photos'),
            ]),
            folder('Music', musicIcon, [
              shortcut('Open Music', musicIcon, 'musicPlayer'),
            ]),
          ],
        },
      ],
    }),
  }),
  getters: {
    drives: (s) => s.tree.children.filter((c) => c.type === 'drive'),
  },
  actions: {
    findByPath(pathSegments) {
      let node = this.tree;
      const trail = [{ name: 'Computer', node }];
      for (const seg of pathSegments) {
        if (!seg) continue;
        const child = node.children?.find(
          (c) => c.name === seg || c.label === seg,
        );
        if (!child) return { node: null, trail };
        node = child;
        trail.push({ name: child.name, node: child });
      }
      return { node, trail };
    },
  },
});
