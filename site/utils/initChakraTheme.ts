import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const theme = {
    styles: {
        global: null
    },
    colors: {
        // brand: {
        //     900: '#1a365d',
        //     800: '#153e75',
        //     700: '#2a69ac',
        // }
    },
    config: {
        cssVarPrefix: 'ck',
        useSystemColorMode: false,
        initialColorMode: 'light'
    }
}

export default extendTheme(theme);
