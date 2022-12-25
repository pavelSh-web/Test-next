import React from 'react';
import { Box, Container, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';

import runningTextStyle from '@styles/atoms/running-text.module.scss';

const OurEyes = () => {
    return (
        <Container maxW='container.xl' position='relative' paddingY='100px'>
            <Text className='block-title'>Our eyes</Text>
            <Flex gap='4.5%' flexDirection='column'>
                <Flex gap='2.5%' marginTop='4%'>
                    <Box flexBasis='16%' minWidth='150px'>
                        <Image src='/img/eyes/196.png'
                               alt=''
                               width='200'
                               height='200'
                        />
                    </Box>
                    <Box flexBasis='84%'>
                        <Box alignSelf='flex-start'>
                            <Text className={ runningTextStyle['running-text'] }
                                  fontFamily='RetroLandMayhem'
                                  fontSize={{ lg: '28px', md: '24px', sm: '20px' }}
                            >
                                A u ready for being
                            </Text>
                            <Text marginTop='2%'>
                                Jordan is the person who comes up with and develops ideas in our team, this does not mean at all that others do not do it, but the main ideas and decisions on the project itself remain with him. It is he who decides how and why the characters are connected to each other and it is he who creates a full-fledged thoughtful world for you. He is also responsible for managing the development from the technical side: smart contracts, websites, servers, and the like. It is on his shoulders that the responsibility for the performance of the site during the future mint.
                            </Text>
                        </Box>
                    </Box>
                </Flex>
                <Flex gap='2.5%' marginTop='4%'>
                    <Box flexBasis='16%' minWidth='150px'>
                        <Image src='/img/eyes/196.png'
                               alt=''
                               width='200'
                               height='200'
                        />
                    </Box>
                    <Box flexBasis='84%'>
                        <Box alignSelf='flex-start'>
                            <Text className={ runningTextStyle['running-text'] }
                                  fontFamily='RetroLandMayhem'
                                  fontSize={{ lg: '28px', md: '24px', sm: '20px' }}
                            >
                                A u ready for being
                            </Text>
                            <Text marginTop='2%'>
                                Jordan is the person who comes up with and develops ideas in our team, this does not mean at all that others do not do it, but the main ideas and decisions on the project itself remain with him. It is he who decides how and why the characters are connected to each other and it is he who creates a full-fledged thoughtful world for you. He is also responsible for managing the development from the technical side: smart contracts, websites, servers, and the like. It is on his shoulders that the responsibility for the performance of the site during the future mint.
                            </Text>
                        </Box>
                    </Box>
                </Flex>
                <Flex gap='2.5%' marginTop='4%'>
                    <Box flexBasis='16%' minWidth='150px'>
                        <Image src='/img/eyes/196.png'
                               alt=''
                               width='200'
                               height='200'
                        />
                    </Box>
                    <Box flexBasis='84%'>
                        <Box alignSelf='flex-start'>
                            <Text className={ runningTextStyle['running-text'] }
                                  fontFamily='RetroLandMayhem'
                                  fontSize={{ lg: '28px', md: '24px', sm: '20px' }}
                            >
                                A u ready for being
                            </Text>
                            <Text marginTop='2%'>
                                Jordan is the person who comes up with and develops ideas in our team, this does not mean at all that others do not do it, but the main ideas and decisions on the project itself remain with him. It is he who decides how and why the characters are connected to each other and it is he who creates a full-fledged thoughtful world for you. He is also responsible for managing the development from the technical side: smart contracts, websites, servers, and the like. It is on his shoulders that the responsibility for the performance of the site during the future mint.
                            </Text>
                        </Box>
                    </Box>
                </Flex>
            </Flex>
        </Container>
    );
};

export default OurEyes;
