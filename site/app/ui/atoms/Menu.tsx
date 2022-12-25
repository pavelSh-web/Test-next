import React from 'react';
import menuStyle from '@styles/atoms/menu.module.scss';

const Menu = () => {
    return (
        <div className={ menuStyle['navbar-menu'] }>
            <a className={ menuStyle['navbar-menu__item'] } href="">The Eye</a>
            <a className={ menuStyle['navbar-menu__item'] } href="">Eyenfo</a>
            <a className={ menuStyle['navbar-menu__item'] } href="">Eyeture</a>
            <a className={ menuStyle['navbar-menu__item'] } href="">Eyeam and Eyenvestors</a>
            <a className={ menuStyle['navbar-menu__item'] } href="">When mint?</a>
        </div>
    );
};

export default Menu;
