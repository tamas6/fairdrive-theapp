module.exports = {
  purge: [],
  darkMode: 'class',
  theme: {
    extend: {
      width: {
        98: '400px',
        100: '480px',
        108: '640px',
      },
      boxShadow: {
        top: '0 10px 15px 12px rgba(0, 0, 0, 0.1), 0 4px 6px 8px rgba(0, 0, 0, 0.05)',
        'soft-purple': ' 0px 1px 24px rgba(132, 118, 219, 0.37)',
        'dark-purple': ' 0px 0px 15px 0px #7D6BECC4',
        'dark-active': '0px 4px 4px 0px #362F68',
        'light-active': '0px 0px 5px 0px #5C568540',
      },
      backgroundImage: {
        'auth-light': "url('/media/authentication/authentication-light.svg')",
        'auth-dark': "url('/media/authentication/authentication-dark.svg')",
      },
      filter: {
        'purple-shadow': 'drop-shadow(0px 1px 24px rgba(132, 118, 219, 0.37))',
      },
    },
    colors: {
      'color-accents-soft-lavender': '#ccd3ff',
      'color-accents-grey-pastel': '#a6b7ff',
      'color-accents-grey-lavendar': '#9aa8ff',
      'color-accents-grey-cloud': '#8391cd',
      'color-accents-blue-pastel': '#6784ff',
      'color-accents-blue-electric': '#455ef8',
      'color-accents-blue-water': '#4862d1',
      'color-accents-purple-feather': '#7367ff',
      'color-accents-purple-med': '#6945f8',
      'color-accents-purple-heavy': '#5b48d1',
      'color-accents-plum-black': '#362f68',
      'color-accents-purple-black': '#262148',
      'color-shade-white-day': '#101113',
      'color-shade-light-1-day': '#2a2f3d',
      'color-shade-light-2-day': '#28282b',
      'color-shade-light-3-day': '#b2bac3',
      'color-shade-dark-1-day': '#f8fcff',
      'color-shade-dark-2-day': '#f0f4f6',
      'color-shade-dark-3-day': '#f7f8fa',
      'color-shade-dark-4-day': '#fcfdff',
      'color-shade-black-day': '#ffffff',
      'color-shade-white-night': '#eef0ff',
      'color-shade-light-1-night': '#ced0dd',
      'color-shade-light-2-night': '#82848e',
      'color-shade-light-3-night': '#494b50',
      'color-shade-dark-1-night': '#36383f',
      'color-shade-dark-2-night': '#27292e',
      'color-shade-dark-3-night': '#202226',
      'color-shade-dark-4-night': '#17191d',
      'color-shade-dark-5-night': '#131517',
      'color-shade-black-night': '#101113',
      'color-status-negative-day': '#ff3864',
      'color-status-positive-day': '#0cb128',
      'color-status-neutral-day': '#1a88c7',
      'color-status-negative-night': '#ff3864',
      'color-status-positive-night': '#7fc18a',
      'color-status-components-day': '#7b61ff',
      'color-status-components-night': '#7b61ff',
    },
  },
  variants: {
    extend: {
      border: ['dark'],
      backgroundColor: ['disabled', 'hover', 'focus', 'active', 'dark'],
      shadow: ['dark'],
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
