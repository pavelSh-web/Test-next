import React from 'react';
import { Container, Flex, Box, Link } from '@chakra-ui/react';
import Image from 'next/image';

const FooterSocials = () => {
    // @ts-ignore
    return (
        <Container maxW='container.xl' position='relative' paddingY='50px'>
            <Flex align='center' gap='25px'>
                <Link className='social-link'>
                    <Image className='social-link' src='/img/footerSocials/telegram.svg' alt='' width='22' height='22'/>
                </Link>
                <Link className='social-link'>
                    <Image className='social-link' src='/img/footerSocials/email.svg' alt='' width='22' height='22'/>
                </Link>
                <Link className='social-link'>
                    <Image className='social-link' src='/img/footerSocials/git-book.svg' alt='' width='100' height='22'/>
                </Link>
                <Link className='social-link'>
                    <Image className='social-link' src='/img/footerSocials/twitter.svg' alt='' width='100' height='22'/>
                </Link>
                <Link className='social-link'>
                    <Image className='social-link' src='/img/footerSocials/discord.svg' alt='' width='100' height='22'/>
                </Link>
            </Flex>
        </Container>
    );
};

export default FooterSocials;
