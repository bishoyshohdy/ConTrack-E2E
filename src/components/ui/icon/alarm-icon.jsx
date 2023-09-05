import { Box } from '@chakra-ui/react';
import React from 'react';

function AlarmIcon (props) {
    const { color, ...rest } = props;
    return (
        <Box w={'100%'} h={'100%'} {...rest}>
            <svg width="100%" height="100%" viewBox="0 0 250 250" fill={color} xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_212_13)">
                    <g clipPath="url(#clip1_212_13)">
                        <path d="M140.76 187.842C140.76 197.019 134.607 203.871 125.099 203.871H124.768C115.59 203.871 109.259 197.019 109.259 187.842C109.259 178.346 115.78 171.825 125.099 171.825C134.417 171.825 140.595 178.32 140.76 187.842ZM115.069 163.028H135.167L139.006 83.2739H111.191L115.069 163.028ZM247.692 230.338C244.781 235.105 239.607 238.042 234.039 238.042H15.98C10.2214 238.042 4.90769 234.94 2.0609 229.932C-0.748165 224.924 -0.684412 218.809 2.25216 213.865L111.688 19.7155C114.561 14.8728 119.76 11.9609 125.379 11.9609H125.811C131.594 12.1002 136.793 15.3672 139.489 20.4779L248.15 214.639C250.743 219.583 250.628 225.52 247.692 230.338ZM234.039 222.011L125.366 27.9137L15.993 222.011H234.039Z" fill={color}/>
                    </g>
                </g>
                <defs>
                    <clipPath id="clip0_212_13">
                        <rect width="250" height="250" fill={color}/>
                    </clipPath>
                    <clipPath id="clip1_212_13">
                        <rect width="250" height="250" fill={color}/>
                    </clipPath>
                </defs>
            </svg>
        </Box>
    );
}

export default AlarmIcon;
