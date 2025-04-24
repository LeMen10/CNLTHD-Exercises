import React from 'react';
// import axios from 'axios';
import images from '~/assets/images/images';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import className from 'classnames/bind';
import styles from './Header.module.scss';
// import Cookies from 'js-cookie';
// import { CartIcon, HeartIcon, UserIcon } from '~/components/Icons';
// import { useState, useEffect } from 'react';

const cx = className.bind(styles);

function Header() {
    // const token = Cookies.get('token') || undefined;
    // const [boxShadowHeader, setBoxShadowHeader] = useState('');
    // const [stateProduct, setStateProduct] = useState();

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (window.scrollY >= 31) {
    //             setBoxShadowHeader('header-top-z-index');
    //         } else {
    //             setBoxShadowHeader('');
    //         }
    //     };
    //     window.addEventListener('scroll', handleScroll);
    // }, []);

    // useEffect(() => {
    //     const api = axios.create({
    //         headers: {
    //             'Content-Type': 'application/json',
    //             cookies: token,
    //         },
    //     });

    //     api.get('http://localhost:9000/')
    //         .then((res) => {

    //             if(res.data.message){
    //                 setStateProduct(false)
    //             }else{
    //                 setStateProduct(res.data);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, [token]);

    return (
        <div className={cx('header')}>
            <div className={cx('container_m')}>
                <div className={cx('header-wrap')}>
                    <div className={cx('logo-primary')}>
                        <img className={cx('icon-logo')} src={images.logo} alt="tiktok" />
                    </div>
                    <div className={cx('header-action')}></div>
                </div>
            </div>
        </div>
    );
}

export default Header;
