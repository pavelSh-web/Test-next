import React from 'react';
import boxStyles from '@styles/atoms/hidden-content-box.module.scss';
import { Flex, Text } from '@chakra-ui/react';
import Image from 'next/image'

export type HiddenContentBoxProps = {
    image?: string;
    text?: string;
    overlayTitle?: string;
    overlayBg: string;
    overlayBordered?: boolean;
}

const HiddenContentBox = (props: HiddenContentBoxProps) => {
    return (
        <div className={ boxStyles['hidden-content-box'] }>
            <Flex className={ boxStyles['hidden-content-box__content'] }
                  justify='center'
                  align='center'
            >
                { (props.image)
                    ? <Image className={ boxStyles['hidden-content-box__image'] } src={ props.image } alt='' width='900' height='900'/>
                    : (props.text)
                        ? <Text className={ boxStyles['hidden-content-box__text'] }>{ props.text }</Text>
                        : ''
                }
            </Flex>
            <Flex className={ `${ boxStyles['hidden-content-box__overlay'] } ${ props.overlayBordered ? boxStyles.bordered : '' }`} justify='center' align='center' background={ props.overlayBg }>
                { props.overlayTitle ? <Text fontFamily='RetroLandMayhem' fontSize={{ lg: '36px', md: '28px', sm: '18px' }}>{ props.overlayTitle }</Text> : '' }
            </Flex>
        </div>
    );
};

export default HiddenContentBox;
