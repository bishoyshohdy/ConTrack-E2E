import { Image } from '@chakra-ui/react';
import React from 'react';

function Logo ({ logo, w, h, m, mt, mb, ml, mr, p, pt, pb, pl, pr }) {
    return logo && <Image fit={'scale-down'} w={w} h={h} m={m} mt={mt} mb={mb} ml={ml} mr={mr} p={p} pt={pt} pb={pb} pl={pl} pr={pr} className="logo" src={logo} />;
}
export default Logo;
