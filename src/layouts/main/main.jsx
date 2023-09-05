import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import AdminLayout from '../admin/admin';
import { ThemeContext } from '../../context/theme';
import './main.css';
// import ColorPalatte from '../../components/ui/color-palatte/color-palatte';
import { DevicesProvider } from '../../context/devices';
import { UsersProvider } from '../../context/users';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainLayout () {
    const themeContext = useContext(ThemeContext);
    const theme = extendTheme(themeContext.theme);
    const location = useLocation().pathname;

    return (
        <div>
            <ChakraProvider theme={theme}>
                <DevicesProvider>
                    <UsersProvider>
                    {location === '/login' ? <Outlet /> : <AdminLayout />}
                    {/* <ColorPalatte /> */}
                    <ToastContainer
                        position="bottom-center"
                        autoClose={3500}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss={false}
                        pauseOnHover={false}
                        theme="colored"
                        limit={1}
                    />
                    </UsersProvider>
                </DevicesProvider>
            </ChakraProvider>
        </div>
    );
}

export default MainLayout;
