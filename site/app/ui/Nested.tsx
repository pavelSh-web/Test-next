'use client';

import { Button, ButtonGroup, Stat, StatGroup, StatLabel, StatNumber, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useExampleStore } from '../stores/ExampleStore';

function Nested() {
    const toast = useToast();
    const exampleStore = useExampleStore();

    const [timerStarted, setTimerStarted] = useState(false);

    useEffect(() => {
        if (!timerStarted) {
            return;
        }

        let timer = setTimeout(() => {
            exampleStore.secondsPassed += 1;
        }, 1000);

        // Unmount
        return () => {
            clearTimeout(timer);
        };
    });

    const showToast = () => {
        exampleStore.increaseClicks();

        toast({
            title: 'Account created.',
            description: "We've created your account for you.",
            status: 'success',
            duration: 9000,
            isClosable: true,
        })
    };

    const startTimer = () => {
        setTimerStarted(true);
        exampleStore.increaseClicks();
    };

    const resetTimer = () => {
        setTimerStarted(false);
        exampleStore.increaseClicks();
        exampleStore.resetTimer();
    };

    return <>
        <StatGroup my='4'>
            <Stat>
                <StatLabel>Seconds</StatLabel>
                <StatNumber>{ exampleStore.secondsPassed }</StatNumber>
            </Stat>

            <Stat>
                <StatLabel>Clicked</StatLabel>
                <StatNumber>{ exampleStore.clicked }</StatNumber>
            </Stat>
        </StatGroup>

        <ButtonGroup gap='2'>
            <Button colorScheme='telegram' onClick={startTimer}>Start timer</Button>
            <Button colorScheme='telegram' onClick={resetTimer}>Reset timer</Button>
            <Button colorScheme='telegram' onClick={showToast}>Show Toast</Button>
        </ButtonGroup>
    </>
}

export default observer(Nested);
