import React from 'react';
import buttonStyles from '@styles/atoms/button.module.scss';

export type ButtonProps = {
    coloredText?: boolean,
    text?: string,
    onClick?: (e: Event) => void,
    href?: string,
    size?: 'small' | 'large',
    children?: any
}

const Button = (props: ButtonProps) => {
    const buttonOnClick = (e: any) => {
        if (typeof props.onClick === 'function') {
            e.preventDefault();

            props.onClick(e);
        }
    };

    props = {
        size: 'small',

        ...props
    };

    return (
        <a className={ `${ buttonStyles.button } ${ buttonStyles[props.size || 'small'] } ${ props.coloredText ? buttonStyles.colored : '' }` }
           href={ props.href }
           onClick={ buttonOnClick }
        >
            { props.children || props.text }
        </a>
    );
};

export default Button;
