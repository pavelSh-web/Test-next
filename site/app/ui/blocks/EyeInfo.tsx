import React from 'react';
import { Box, Container, Flex, Grid, GridItem, Hide, Show, SimpleGrid } from '@chakra-ui/react';
import HiddenContentBox from '../atoms/HiddenContentBox';

const EyeInfo = () => {
    return (
        <Container maxW='container.xl' position='relative' paddingY='70px'>
            <div className='blob blob_2'></div>
            <div className='blob blob_3'></div>

            <Grid templateColumns='repeat(2, 1fr)'
                  templateRows='repeat(3, auto)'
                  columnGap='2.5%'
                  rowGap='5%'
                  className=''
            >
                <Hide below='s'>
                    <GridItem gridColumnStart='1'
                              gridColumnEnd='2'
                              gridRowStart='1'
                              gridRowEnd='2'
                    >
                        <HiddenContentBox overlayBg='linear-gradient(98.72deg, #FF00F5 -64.15%, #FFBB37 104.21%)'
                                          overlayTitle='What are we doing?'
                                          text="Before we start we would like to say that we are ordinary degens and like you want to earn more than only money from projects, so after that we came up with this idea. We want to fasten together ideas of WL, Stake, Hodl, P2E and dApps in one project. So that's it!"
                        />
                    </GridItem>
                    <GridItem gridColumnStart='2'
                              gridColumnEnd='3'
                              gridRowStart='1'
                              gridRowEnd='2'
                    >
                        <HiddenContentBox overlayBg='linear-gradient(96.57deg, #9747FF -3.06%, #FFBB37 104%);'
                                          overlayTitle='Why are we doing?'
                                          text="Before we start we would like to say that we are ordinary degens and like you want to earn more than only money from projects, so after that we came up with this idea. We want to fasten together ideas of WL, Stake, Hodl, P2E and dApps in one project. So that's it!"

                        />
                    </GridItem>
                </Hide>

                <Hide above='s'>
                    <GridItem gridColumnStart='1'
                              gridColumnEnd='3'
                              gridRowStart='1'
                              gridRowEnd='2'
                    >
                        <HiddenContentBox overlayBg='linear-gradient(98.72deg, #FF00F5 -64.15%, #FFBB37 104.21%)'
                                          overlayTitle='What are we doing?'
                                          text="Before we start we would like to say that we are ordinary degens and like you want to earn more than only money from projects, so after that we came up with this idea. We want to fasten together ideas of WL, Stake, Hodl, P2E and dApps in one project. So that's it!"
                        />
                    </GridItem>
                    <GridItem gridColumnStart='1'
                              gridColumnEnd='3'
                              gridRowStart='2'
                              gridRowEnd='3'
                    >
                        <HiddenContentBox overlayBg='linear-gradient(96.57deg, #9747FF -3.06%, #FFBB37 104%);'
                                          overlayTitle='Why are we doing?'
                                          text="Before we start we would like to say that we are ordinary degens and like you want to earn more than only money from projects, so after that we came up with this idea. We want to fasten together ideas of WL, Stake, Hodl, P2E and dApps in one project. So that's it!"

                        />
                    </GridItem>
                </Hide>


                <Hide below='lg'>
                    <GridItem gridColumnStart='2'
                              gridColumnEnd='3'
                              gridRowStart='2'
                              gridRowEnd='3'
                    >
                        <Flex gap='5%'>
                            <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/1265.png' overlayBordered={ true }/>
                            <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/1211.png' overlayBordered={ true }/>
                            <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/219.png' overlayBordered={ true }/>
                        </Flex>
                    </GridItem>
                </Hide>

                <Show above='s'>
                    <Hide above='lg'>
                        <GridItem gridColumnStart='1'
                                  gridColumnEnd='3'
                                  gridRowStart='2'
                                  gridRowEnd='3'
                        >
                            <Flex gap='5%'>
                                <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/1265.png' overlayBordered={ true }/>
                                <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/1211.png' overlayBordered={ true }/>
                                <HiddenContentBox overlayBg='#0D0D0D' image='/img/eyes/219.png' overlayBordered={ true }/>
                            </Flex>
                        </GridItem>
                    </Hide>
                </Show>

                <Hide below='lg'>
                    <GridItem gridColumnStart='2'
                              gridColumnEnd='3'
                              gridRowStart='3'
                              gridRowEnd='4'
                    >
                        <HiddenContentBox overlayBg='linear-gradient(99.11deg, #FF7070 0%, #FF7F00 84.55%);'
                                          overlayTitle='Why Aptos?'
                                          text="Before we start we would like to say that we are ordinary degens and like you want to earn more than only money from projects, so after that we came up with this idea. We want to fasten together ideas of WL, Stake, Hodl, P2E and dApps in one project. So that's it!"
                        />
                    </GridItem>
                </Hide>

                <Hide above='lg'>
                    <GridItem gridColumnStart='1'
                              gridColumnEnd='3'
                              gridRowStart='3'
                              gridRowEnd='4'
                    >
                        <HiddenContentBox overlayBg='linear-gradient(99.11deg, #FF7070 0%, #FF7F00 84.55%);'
                                          overlayTitle='Why Aptos?'
                                          text="Before we start we would like to say that we are ordinary degens and like you want to earn more than only money from projects, so after that we came up with this idea. We want to fasten together ideas of WL, Stake, Hodl, P2E and dApps in one project. So that's it!"
                        />
                    </GridItem>
                </Hide>
            </Grid>
        </Container>
    );
};

export default EyeInfo;
