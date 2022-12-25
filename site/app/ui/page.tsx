'use client';
import chakraTheme from '@utils/initChakraTheme';

import { Flex, ChakraProvider, Heading } from '@chakra-ui/react';
import { ExampleStoreProvider } from '../stores/ExampleStore';
import Nested from './Nested';


export default function UiDemo() {
    return (
        <ChakraProvider theme={chakraTheme} resetCSS={true}>
            <ExampleStoreProvider>
                <Flex justify='center' align='center' height='100vh' textAlign='center'>
                    <main>
                        <Heading>
                            Chakra UI + MOBX store demo
                        </Heading>

                        <Nested/>
                    </main>
                </Flex>
            </ExampleStoreProvider>
        </ChakraProvider>
    )
}
