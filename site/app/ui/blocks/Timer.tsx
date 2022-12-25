import React, { useState, useEffect, useMemo } from 'react';
import { Text, Box, Flex, Container } from '@chakra-ui/react';
import Button from '../atoms/Button';
const endDate = Date.now() + 10000000;

const normalizeTime = (time: number) => `${ time < 10 ? '0' : '' }${ time }`

const Timer = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const displayHours = useMemo(() => normalizeTime(hours), [hours]);
    const displayMinutes = useMemo(() => normalizeTime(minutes), [minutes]);
    const displaySeconds = useMemo(() => normalizeTime(seconds), [seconds]);

    useEffect(() => {
        const myInterval = setInterval(() => {
            const timeLeft = endDate - Date.now();

            if (timeLeft > 0) {
                const currentHours = Math.floor(timeLeft / 1000 / 60 / 60);
                const currentMinutes = Math.floor((timeLeft / 1000 / 60) - currentHours * 60);
                const currentSeconds = Math.floor((timeLeft / 1000) - currentHours * 60 * 60 - currentMinutes * 60);

                setHours(currentHours);
                setMinutes(currentMinutes);
                setSeconds(currentSeconds);
            }
        }, 1000);

        return clearInterval.bind(this, myInterval);
    })

    return (
        <Box className='timer-blobs-overlay' marginY='18vw'>
            <Box className='timer-bg-overlay' />
            <Container maxW='container.xl' position='relative'>
                <Flex gap='2.5%'>
                    <Flex className='timer'
                          fontSize='80px'
                          fontFamily='RetroLandMayhem'
                          flexBasis='50%'
                          gap='5%'
                    >
                        <Flex justify='center' align='center' paddingY='3.3%' flexBasis='33%'>{ displayHours }</Flex>
                        <Box className='timer-divider'></Box>
                        <Flex justify='center' align='center' paddingY='3.3%' flexBasis='33%'>{ displayMinutes }</Flex>
                        <Box className='timer-divider'></Box>
                        <Flex justify='center' align='center' paddingY='3.3%' flexBasis='33%'>{ displaySeconds }</Flex>
                    </Flex>
                    <Flex flexBasis='50%' direction='column' justify='space-between'>
                         <Flex align='center' height='max-content' flexWrap='wrap' fontFamily='RetroLandMayhem' fontSize='29.9px'>
                             <Text>Be ready to become&nbsp;</Text>
                             <Text marginLeft='auto'>a part of us</Text>
                         </Flex>
                        <Button size='large'>Mint Now</Button>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default Timer;
