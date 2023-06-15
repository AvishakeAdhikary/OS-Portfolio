<template>
  <div class="settings-container">
    <div class="navbar">
      <div
        class="navbarmenu"
        v-for="item in navbarItems"
        :key="item.id"
        :class="{ active: activeItem === item.id }"
        @click="changeActiveItem(item.id)"
      >
        <img class="settingsicon" :src="item.icon" alt="Icon" />
        {{ item.name }}
      </div>
    </div>

    <div class="subsettings">
      <div v-if="activeItem === 'system'" class="subsettings-section">
        <h3>System</h3>
        <ul>
          <li>Display</li>
          <li>Sound</li>
          <li>Notifications & actions</li>
          <li>Power & sleep</li>
          <li>Storage</li>
          <li>Windows Update</li>
          <li>Activation</li>
          <li>Find my device</li>
          <li>Backup</li>
          <li>Accessibility</li>
          <li>Focus assist</li>
          <li>Clipboard</li>
          <li>Remote Desktop</li>
          <li>Shared experiences</li>
          <li>About</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'bluetoothDevices'" class="subsettings-section">
        <h3>Bluetooth & Devices</h3>
        <ul>
          <li>Bluetooth</li>
          <li>Printers & scanners</li>
          <li>Mouse</li>
          <li>Typing</li>
          <li>Pen & Windows Ink</li>
          <li>AutoPlay</li>
          <li>USB</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'networkInternet'" class="subsettings-section">
        <h3>Network & Internet</h3>
        <ul>
          <li>Status</li>
          <li>Wi-Fi</li>
          <li>Cellular & SIM</li>
          <li>Ethernet</li>
          <li>VPN</li>
          <li>Data usage</li>
          <li>Proxy</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'personalization'" class="subsettings-section">
        <h3>Personalization</h3>
        <ul>
          <li>Background</li>
          <li>Colors</li>
          <li>Lock screen</li>
          <li>Themes</li>
          <li>Start</li>
          <li>Taskbar</li>
          <li>Notifications & actions</li>
          <li>Folders</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'apps'" class="subsettings-section">
        <h3>Apps</h3>
        <ul>
          <li>Apps & features</li>
          <li>Default apps</li>
          <li>Offline maps</li>
          <li>Apps for websites</li>
          <li>Video playback</li>
          <li>Startup</li>
          <li>Fonts</li>
          <li>Manage optional features</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'accounts'" class="subsettings-section">
        <h3>Accounts</h3>
        <ul>
          <li>Your info</li>
          <li>Email & accounts</li>
          <li>Sign-in options</li>
          <li>Family & other users</li>
          <li>Sync your settings</li>
          <li>Access work or school</li>
          <li>Backup</li>
          <li>Accessories</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'timeLanguage'" class="subsettings-section">
        <h3>Time & Language</h3>
        <ul>
          <li>Date & time</li>
          <li>Region</li>
          <li>Language</li>
          <li>Typing</li>
          <li>Speech</li>
          <li>Keyboard shortcuts</li>
          <li>Privacy</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'gaming'" class="subsettings-section">
        <h3>Gaming</h3>
        <ul>
          <li>Xbox Game Pass</li>
          <li>Game bar</li>
          <li>Captures</li>
          <li>Game Mode</li>
          <li>Xbox Networking</li>
          <li>TruePlay</li>
          <li>Auto HDR</li>
          <li>Broadcasting</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'accessibility'" class="subsettings-section">
        <h3>Accessibility</h3>
        <ul>
          <li>Display</li>
          <li>Hearing</li>
          <li>Interaction</li>
          <li>Speech</li>
          <li>Cursor & pointer size</li>
          <li>Closed captions</li>
          <li>Other options</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'privacySecurity'" class="subsettings-section">
        <h3>Privacy & Security</h3>
        <ul>
          <li>Windows Security</li>
          <li>Privacy settings</li>
          <li>Find My Device</li>
          <li>Backup</li>
          <li>Device encryption</li>
          <li>Windows Hello</li>
          <li>Windows Defender Firewall</li>
          <li>App permissions</li>
          <li>Other devices</li>
          <li>SmartScreen</li>
          <li>Secure DNS</li>
          <li>Device security</li>
          <li>Device restrictions</li>
          <li>Health & diagnostics</li>
          <li>Windows Update</li>
          <li>Delivery Optimization</li>
          <li>Windows Insider Program</li>
        </ul>
      </div>

      <div v-else-if="activeItem === 'windowsUpdate'" class="subsettings-section">
        <h3>Windows Update</h3>
        <ul>
          <li>Windows Update</li>
          <li>Windows Insider Program</li>
          <li>Delivery Optimization</li>
          <li>Recovery</li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
import desktopIcon from '@/assets/icons/pc.ico';
import bluetoothIcon from '@/assets/icons/wifi.ico';
import networkIcon from '@/assets/icons/network.ico';
import paletteIcon from '@/assets/icons/appearance.ico';
import appsIcon from '@/assets/icons/apps.ico';
import userIcon from '@/assets/icons/user.ico';
import clockIcon from '@/assets/icons/language.ico';
import gamepadIcon from '@/assets/icons/games.ico';
import accessibilityIcon from '@/assets/icons/3d.ico';
import lockIcon from '@/assets/icons/system 1.ico';
import uploadIcon from '@/assets/icons/refresh.ico';
import windowsIcon from '@/assets/icons/3d.ico';


export default {
  name:"Settings",
  data() {
    return {
      navbarItems: [
        { id: 'system', name: 'System', icon: desktopIcon },
        { id: 'bluetoothDevices', name: 'Bluetooth & Devices', icon: bluetoothIcon },
        { id: 'networkInternet', name: 'Network & Internet', icon: networkIcon },
        { id: 'personalization', name: 'Personalization', icon: paletteIcon },
        { id: 'apps', name: 'Apps', icon: appsIcon },
        { id: 'accounts', name: 'Accounts', icon: userIcon },
        { id: 'timeLanguage', name: 'Time & Language', icon: clockIcon },
        { id: 'gaming', name: 'Gaming', icon: gamepadIcon },
        { id: 'accessibility', name: 'Accessibility', icon: accessibilityIcon },
        { id: 'privacySecurity', name: 'Privacy & Security', icon: lockIcon },
        { id: 'windowsUpdate', name: 'Windows Update', icon: uploadIcon }
      ],
      activeItem: 'system'
    };
  },
  methods: {
    changeActiveItem(itemId) {
      this.activeItem = itemId;
    }
  }
};
</script>

<style>
.settings-container {
  display: flex;
  color: white;
  padding: 10px;
}

.navbar {
  width: 250px;
  background-color: #3c3e3c;
  padding: 20px;
  border-radius: 10px;
/*  height: calc(100vh - 120px);*/
}

.navbar div {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 10px;
}

.navbar div:hover {
  background-color: #181818;
}

.navbar div.active {
  background-color: #181818;
}

.subsettings {
  flex-grow: 1;
  padding: 20px;
}

.subsettings-section {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid white;
  border-radius: 10px;
}

.subsettings-section h3 {
  color: white;
  display: flex;
  justify-content: center;
  background-color: #3c3e3c;
  padding: 10px;
  border-radius: 10px;
}

.subsettings-section ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.subsettings-section ul li {
  margin-bottom: 10px;
  cursor: pointer;
}

.settingsicon{
  width: 25px;
  height: 25px;
}

.navbarmenu{
  display: flex;
/*  align-items: baseline;*/
  align-content: center;
}
</style>
