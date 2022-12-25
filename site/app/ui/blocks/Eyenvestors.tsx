import React from 'react';
import { Box, Container, Flex, Text } from '@chakra-ui/react';
import Button from '../atoms/Button';
import Image from 'next/image';

const Eyenvestors = () => {
    return (
        <Container maxW='container.xl' position='relative' paddingY='70px'>
            <div className='blob blob_4'></div>
            <Text className='block-title'>Our investors and partners</Text>
            <Flex gap='80px' flexDirection='column' marginTop='8.4%'>
                <Flex gap='2.5%' width='66%' justify='flex-end'>
                    <Box flexBasis='39.5%' position='relative' zIndex='-1'>
                        <Box position='absolute' bottom='-30%' left='2%' width='117%'>
                            <Image src='/img/investor.svg'
                                   alt=''
                                   width='500'
                                   height='500'
                            ></Image>
                        </Box>
                    </Box>
                    <Box flexBasis='60.5%' textAlign='center'>
                        <Text fontSize='32px'
                              textAlign='center'
                              fontWeight='500'
                              paddingX='3.1%'
                        >
                            Wanna be our early investor, fill the form below
                        </Text>
                        <Box marginTop='4.9%'>
                            <Button size='large'>Become investor</Button>
                        </Box>
                    </Box>
                </Flex>
                <Flex gap='2.5%' marginLeft='auto' width='66%' justify='flex-end'>
                    <Box flexBasis='39.5%' position='relative' zIndex='-1'>
                        <Box position='absolute' bottom='-30%' left='2%' width='117%'>
                            <Image src='/img/partner.svg'
                                   alt=''
                                   width='500'
                                   height='500'
                            ></Image>
                        </Box>
                    </Box>
                    <Box flexBasis='60.5%' textAlign='center'>
                        <Text fontSize='32px'
                              textAlign='center'
                              fontWeight='500'
                              paddingX='3.1%'
                        >
                            Wanna be our early investor, fill the form below
                        </Text>
                        <Box marginTop='4.9%'>
                            <Button size='large'>Become investor</Button>
                        </Box>
                    </Box>
                </Flex>
            </Flex>
        </Container>
    );
};

export default Eyenvestors;
