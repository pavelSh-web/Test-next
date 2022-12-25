import React from 'react';
import logoStyle from '@styles/atoms/logo.module.scss';

const Logo = () => {
    return (
        <div className={ logoStyle.logo }>
            <div className={ logoStyle['logo-main'] }>ALLinOne</div>
            <div className={ logoStyle['logo-desc'] }>NFTPass</div>
        </div>
    );
};

export default Logo;
