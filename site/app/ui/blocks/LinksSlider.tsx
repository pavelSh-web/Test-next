import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Box, Container, Flex, Link } from '@chakra-ui/react';

import Image from 'next/image';

const LinksSlider = () => {
    const swiperRef = useRef();

    // @ts-ignore
    return (
        <Container maxW='container.xl' position='relative' paddingY='120px'>
            <Flex alignItems='center' position='relative' width='100%' height='150px' paddingX='9%'>
                <Flex position='absolute' top='0' left='0' width='100%' height='100%' alignItems='center' justify='space-between'>
                    <Box onClick={() => (swiperRef.current as any)?.slidePrev()} padding='30px'>
                        <Image src='/img/arrow-left.svg' alt='' width='28' height='28'/>
                    </Box>
                    <Box onClick={() => (swiperRef.current as any)?.slideNext()} padding='30px'>
                        <Image src='/img/arrow-right.svg' alt='' width='28' height='28'/>
                    </Box>
                </Flex>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={75}
                    slidesPerView={4}
                    onBeforeInit={(swiper: any) => {
                        swiperRef.current = swiper;
                    }}
                >
                    <SwiperSlide>
                        <Link className='social-link'>
                            <Image src='/img/socials/discord.svg' alt='' width='400' height='400'/>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link className='social-link'>
                            <Image src='/img/socials/twitter.svg' alt='' width='400' height='400'/>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link className='social-link'>
                            <Image src='/img/socials/figma.svg' alt='' width='400' height='400'/>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link className='social-link'>
                            <Image src='/img/socials/whatsApp.svg' alt='' width='400' height='400'/>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link className='social-link'>
                            <Image src='/img/socials/discord.svg' alt='' width='400' height='400'/>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link className='social-link'>
                            <Image src='/img/socials/twitter.svg' alt='' width='400' height='400'/>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link className='social-link'>
                            <Image src='/img/socials/figma.svg' alt='' width='400' height='400'/>
                        </Link>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Link className='social-link'>
                            <Image src='/img/socials/whatsApp.svg' alt='' width='400' height='400'/>
                        </Link>
                    </SwiperSlide>
                </Swiper>

            </Flex>
        </Container>
    );
};

export default LinksSlider;
