import React from 'react';
import { Box, Container, Flex, Grid, GridItem, Hide, SimpleGrid, Text } from '@chakra-ui/react';
import runningTextStyle from '@styles/atoms/running-text.module.scss';
import HiddenContentBox from '../atoms/HiddenContentBox';

const FirstScreen = () => {
    return (
        <Container maxW='container.xl' position='relative' paddingY='100px'>
            <div className='blob blob_1'></div>

            <Flex direction='column'
                  justify='center'
                  align='center'
                  minHeight={{ lg: '100vh', md: '100%' }}
                  paddingTop={{ lg: '0', md: '100px' }}
            >
                <Flex justify='space-between'
                      direction='column'
                      fontFamily='RetroLandMayhem'
                      fontSize={{ lg: '46px', md: '38px', s: '30px', sm: '24px' }}
                      width='100%'
                      position='relative'
                      zIndex='2'
                >
                    <Box alignSelf='flex-start'>
                        <div className={ runningTextStyle['running-text'] }>A u ready for being</div>
                    </Box>
                    <Box alignSelf='flex-end' marginRight={{ s: '8.8%', sm: '0' }}>
                        <div className={ runningTextStyle['running-text'] }>a legendary eye?</div>
                    </Box>
                </Flex>
                <SimpleGrid columns={{ sm: 1, md: 2, lg: 2 }}
                            spacing='2.5%'
                            marginTop={{ lg: '-50px', md: '-40px', sm: '-30px' }}
                >
                    <Hide below='md'>
                        <div className="eyes-grid">
                            <Grid templateColumns='repeat(6, 1fr)'
                                  templateRows='repeat(29, 1.77%)'
                                  columnGap='5%'
                                  rowGap='1.77%'
                                  className=''
                            >
                                <GridItem gridColumnStart='2'
                                          gridColumnEnd='4'
                                          gridRowStart='1'
                                          gridRowEnd='10'
                                >
                                    <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/196.png' overlayBordered={ true }/>
                                </GridItem>
                                <GridItem gridColumnStart='4'
                                          gridColumnEnd='7'
                                          gridRowStart='5'
                                          gridRowEnd='19'
                                >
                                    <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/287.png' overlayBordered={ true }/>
                                </GridItem>
                                <GridItem gridColumnStart='1'
                                          gridColumnEnd='4'
                                          gridRowStart='11'
                                          gridRowEnd='25'
                                >
                                    <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/765.png' overlayBordered={ true }/>
                                </GridItem>
                                <GridItem gridColumnStart='5'
                                          gridColumnEnd='7'
                                          gridRowStart='20'
                                          gridRowEnd='29'
                                >
                                    <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/432.png' overlayBordered={ true }/>
                                </GridItem>
                            </Grid>
                        </div>
                    </Hide>

                    <Box marginTop='calc(10% + 19px)' maxW='492px'>
                        <Text>We are proud to welcome u, newbie! So, do you remember why a u here? Of course, because of becoming a legendary eye with a large number of opportunities that u have never seen in yo life! </Text>
                        <Box marginTop='10%'>
                            <Text>We are talking about it below: rarities, stake, hodl, WL and more u can find out at our official <a className='yellow-link' href='#'>discord</a>.</Text>
                            <Text marginTop='5%'><span className='accent-text'>Phase 1</span> is here for you, be one of the first: get it now so you won't regret it in the future.</Text>
                        </Box>
                    </Box>
                </SimpleGrid>
            </Flex>
        </Container>
    );
};

export default FirstScreen;
