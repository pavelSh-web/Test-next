'use client';
import chakraTheme from '@utils/initChakraTheme';

import { Flex, ChakraProvider, Heading } from '@chakra-ui/react';
import { ExampleStoreProvider } from '../stores/ExampleStore';
import Logo from './atoms/Logo';
import Menu from './atoms/Menu';
import Button from './atoms/Button';


export default function UiDemo() {
    return (
        <ChakraProvider theme={ chakraTheme } resetCSS={true}>
            <ExampleStoreProvider>
                <Flex justify='center' align='center' height='100vh' textAlign='center'>
                    <main>
                        <Logo />
                        <Menu />
                        <Button coloredText={ true }>Mint Now</Button>
                    </main>
                </Flex>
            </ExampleStoreProvider>
        </ChakraProvider>
    )
}
