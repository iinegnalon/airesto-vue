import { defineStore } from 'pinia';

type Theme = 'dark' | 'light';

interface InterfaceStore {
  theme: Theme;
  scrollOff: boolean;
}

export const useInterfaceStore = defineStore('interface', {
  state: (): InterfaceStore => ({
    theme: 'dark',
    scrollOff: false,
  }),

  actions: {
    initTheme() {
      let saved = localStorage.getItem('theme');

      if (saved !== 'dark' && saved !== 'light') {
        saved = 'dark';
      }

      this.setTheme(saved as Theme);
    },

    setTheme(theme: Theme) {
      this.theme = theme;
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    },

    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    },

    disableBodyScroll() {
      this.scrollOff = true;
    },

    enableBodyScroll() {
      this.scrollOff = false;
    },
  },
});
