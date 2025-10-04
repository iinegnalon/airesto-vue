import { defineStore } from 'pinia';

type Theme = 'dark' | 'light';

interface InterfaceStore {
  theme: Theme;
}

export const useInterfaceStore = defineStore('interface', {
  state: (): InterfaceStore => ({
    theme: 'dark',
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
  },
});
