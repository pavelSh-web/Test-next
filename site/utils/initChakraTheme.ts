import { extendTheme } from '@chakra-ui/react'

const breakpoints = {
    sm: '300px',
    s: '576px',
    md: '768px',
    lg: '992px',
    xl: '1280px'
};

// 2. Extend the theme to include custom colors, fonts, etc
const theme = {
    fonts: {
        heading: 'Exo, sans-serif',
        body: 'Exo, sans-serif',
        mono: 'Exo, sans-serif'
    },
    styles: {
        global: null
    },
    colors: {},
    config: {
        cssVarPrefix: 'ck',
        useSystemColorMode: false,
        initialColorMode: 'light'
    },
    breakpoints
}

export default extendTheme(theme);
