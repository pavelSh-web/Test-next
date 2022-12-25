import React from 'react';

import Logo from '../atoms/Logo';
import Menu from '../atoms/Menu';
import Button from '../atoms/Button';
import { Box, Container, Flex } from '@chakra-ui/react';

const Header = () => {
    return (
        <Box width='100%' paddingY='36px'>
            <Container maxW='container.xl'>
                <Flex justify='space-between' align='center' textAlign='center' fontSize={{ lg: '20px', md: '18px', sm: '16px' }}>
                    <Flex justify='flex-start' flex='3'>
                        <Logo />
                    </Flex>
                    <Box marginLeft='auto'>
                        <Menu />
                    </Box>
                    <Flex justify='flex-end' flex='1.5' marginLeft='20px'>
                        <Button coloredText={ true }>Mint Now</Button>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default Header;
