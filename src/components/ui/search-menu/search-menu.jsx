import React from "react";
import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import ThemeButton from "../theme-button/theme-button";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { SearchIcon } from "@chakra-ui/icons";
import { getUserInfo, signOut } from "../../../api/user";

function SearchMenu({ showSearch, showUser, children }) {
  return (
    <Flex mt={1} bg={"primary.80"} p={2} borderRadius={"20px"}>
      {showSearch && (
        <InputGroup justifyItems={"baseline"}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="primary.40" />
          </InputLeftElement>
          <Input
            placeholder="search"
            color={"text.primary"}
            htmlSize={10}
            bg={"primary.100"}
            borderRadius={"20px"}
            width="auto"
            variant={"outline"}
            me={2}
            borderWidth={0}
          />
        </InputGroup>
      )}
      {showUser && (
        <Menu>
          <MenuButton
            rounded={"full"}
            bg={'action.80'}
            mr={1}
            display={"flex"}
            as={IconButton}
            size={'md'}
            icon={<FaUser display={"flex"} color="white" />}
          ></MenuButton>
          <MenuList>
            <MenuItem
              icon={
                <Avatar
                  mr={2}
                  size={"sm"}
                  name={
                    getUserInfo && getUserInfo().user_name
                      ? getUserInfo().user_name
                      : ""
                  }
                />
              }
            >
              {getUserInfo && getUserInfo().user_name
                ? getUserInfo().user_name
                : ""}
            </MenuItem>
            <MenuItem
              onClick={signOut}
              icon={<FaSignOutAlt />}
              aria-label="signout"
              size={"sm"}
            >
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      <ThemeButton />
      {children}
    </Flex>
  );
}

export default SearchMenu;
