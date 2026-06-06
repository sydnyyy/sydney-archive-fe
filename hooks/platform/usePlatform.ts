import { useState, useEffect } from 'react';

export type Platform = 'mobile' | 'web';

export const usePlatform = () => {
    const [platform, setPlatform] = useState<Platform | undefined>(undefined);

    useEffect(() => {
        const handleResize = () => {
            const isSmallScreen = window.innerWidth <= 1024;
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

            if (isSmallScreen && hasTouch && isCoarsePointer) {
                setPlatform('mobile');
            } else {
                setPlatform('web');
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        platform,
        isMobile: platform === 'mobile',
        isWeb: platform === 'web'
    };
};