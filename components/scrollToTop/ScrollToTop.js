"use client";

import React, { useEffect, useState } from 'react';

const ScrollToTop = () => {
    
    const scrollThreshold = 200;

    useEffect(() => {
        const handleScroll = () => {
            console.log(document.body.scrollTop >= scrollThreshold)
        };

        document.body.addEventListener('scroll', handleScroll);

        return () => {
            document.body.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="scrollToTopButton">
            <i className="fa fa-angle-up"></i>
        </div>
    )
}

export default ScrollToTop;