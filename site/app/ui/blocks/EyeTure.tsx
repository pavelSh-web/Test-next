import React from 'react';
import { Box, Text, Container, Flex } from '@chakra-ui/react';

const EyeTure = () => {
    return (
        <Container maxW='container.xl' position='relative' paddingY='70px'>
            <Text className='block-title'>Why do we want you to participate?</Text>
            <Flex gap='2.5%' background='url(/img/waves.png) no-repeat' backgroundSize='auto 100%' backgroundPosition='-50px auto'>
                <Box flexBasis={{ lg: '66%', md: '50%' }} position='relative'>
                </Box>
                <Box className='gradient-bg' flexBasis={{ lg: '33%', md: '50%', sm: '50%' }} padding='10px'>
                    <Text marginBottom={{ lg: '23%', md: '3%', sm: '3%' }}>We have told you about what the project is, what opportunities it opens up, why you can make money on it and why it is worth following us, helping in all possible ways. </Text>
                    <Text marginBottom='3%'>In fact, behind all this is an ordinary dream, the dream of our team to make their ideas a reality. Ideas that will be able to interest a lot of people, ideas that will be a trend and that will be followed by everyone else. We want to do something that millions will believe in. A project that will win the hearts of many degens.</Text>
                    <Text>We were the same and we understand perfectly well that the crypt is not just money out of thin air. This is a lot of hours without sleep, these are risks, this is a detailed analysis, as well as a lot of stress, like when dealing in a casino. </Text>
                </Box>
            </Flex>
        </Container>
    );
};

export default EyeTure;
