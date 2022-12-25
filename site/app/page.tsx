"use client";

import Header from './ui/blocks/Header';
import chakraTheme from '@utils/initChakraTheme';
import { ChakraProvider } from '@chakra-ui/provider';
import { Box } from '@chakra-ui/react';

import FirstScreen from './ui/blocks/FirstScreen';
import EyeInfo from './ui/blocks/EyeInfo';
import EyeTure from './ui/blocks/EyeTure';
import OurEyes from './ui/blocks/OurEyes';
import Eyenvestors from './ui/blocks/Eyenvestors';
import LinksSlider from './ui/blocks/LinksSlider';
import Timer from './ui/blocks/Timer';
import FooterSocials from './ui/blocks/Socials';

export default function Home() {
    return (
        <ChakraProvider theme={ chakraTheme } resetCSS={ true }>
            <Box fontSize={{ lg: '18px', md: '16px', sm: '16px' }}>
                <Box position='absolute' zIndex='100' width='100%'>
                    <Header />
                </Box>
                <FirstScreen />
                <EyeInfo />
                <EyeTure />
                <OurEyes />
                <Eyenvestors />
                <LinksSlider />
                <Timer />
                <Header />
                <FooterSocials />
            </Box>

            <div className="foreground-noise"></div>
        </ChakraProvider>
    );
}
