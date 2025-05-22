"use client";

import { useEffect } from "react";

const Language = () => {
    useEffect(() => {
        // Define the GTranslate settings object
        const gTranslateSettings = {
            default_language: 'en',
            languages: ['en', 'zh-CN', 'ru'],
            wrapper_selector: '.gtranslate_wrapper',
            native_language_names: true,
        };

        // Create a new script element for GTranslate widget
        const script = document.createElement('script');
        script.innerHTML = `window.gtranslateSettings = ${JSON.stringify(gTranslateSettings)}`;
        script.src = 'https://cdn.gtranslate.net/widgets/latest/float.js';
        script.defer = true;

        // Append the script element to the document body
        document.body.appendChild(script);

        // Clean up by removing the script when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    return (
        <>
            <div className="gtranslate_wrapper"></div>
        </>
    )
}

export default Language;