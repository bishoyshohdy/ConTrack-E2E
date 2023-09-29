import React from 'react';
import {
    Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import theme from './tab-theme';
// import { ColorModeSwitcher } from './ColorModeSwitcher';

export default function TabPan() {
  return (
    <Tabs isFitted variant='enclosed'>
    <TabList mb='1em' h={"100px"} bg={"grey"}>
        <Tab  bg={"blue"}>One</Tab>
        <Tab>Two</Tab>
        <Tab>Two</Tab>
    </TabList>
    <TabPanels>
        <TabPanel>
        <p>one!</p>
        </TabPanel>
        <TabPanel>
        <p>two!</p>
        </TabPanel>
    </TabPanels>
    </Tabs>
  );
}