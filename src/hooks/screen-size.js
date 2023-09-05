import { useState, useEffect } from 'react';
import { SCREEN_SIZE } from '../types/screen';

function useScreenSize () {
    const [screenSize, setScreenSize] = useState(SCREEN_SIZE.LG);

    useEffect(() => {
        const handleWindowResize = () => {
            const windowSize = window.innerWidth;
            if (windowSize <= SCREEN_SIZE.SM) {
                setScreenSize(SCREEN_SIZE.SM);
            }
            if (windowSize <= SCREEN_SIZE.MD && windowSize > SCREEN_SIZE.SM) {
                setScreenSize(SCREEN_SIZE.MD);
            }
            if (windowSize > SCREEN_SIZE.MD) {
                setScreenSize(SCREEN_SIZE.LG);
            }
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });
    return screenSize;
}

export default useScreenSize;
