import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Container,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { selectUserState } from "../../features/auth";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Links = [
  { text: "Find Doctors", link: "/patient" },
  { text: "See Appointments", link: "/patient/appointment" },
  { text: "Message", link: "/message" },
];

const NavLink = (props: { text: string; link: string }) => {
  const { text, link } = props;
  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      color={useColorModeValue("white", "gray.200")}
      _hover={{
        textDecoration: "none",
        color: useColorModeValue("gray.800", "white"),
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={`${link}`}
    >
      <Text>{text}</Text>
    </Link>
  );
};

export default function PatientNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector(selectUserState);
  const router = useRouter();
  return (
    <>
      <Box bg={useColorModeValue("teal.500", "teal.900")} px={4} width="100%">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            color={"gray.500"}
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Flex
            justifyContent={["center", "space-between"]}
            alignItems={"center"}
            width="100%"
            px={["2px", "10px"]}
          >
            <Box>
              <Text fontWeight="bolder" color="whiteAlpha.900" fontSize="md">
                SkinCare.
              </Text>
            </Box>

            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
              mx={5}
            >
              {Links.map((link) => (
                <NavLink key={link.link} text={link.text} link={link.link} />
              ))}
            </HStack>
          </Flex>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"sm"} src={user?.photo || ""} />
              </MenuButton>
              <MenuList borderRadius="md" border={`1px solid #e428f0`}>
                <MenuItem
                  onClick={() => {
                    router.push("/patient/profile");
                  }}
                >
                  Edit Details
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                  }}
                >
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.link} text={link.text} link={link.link} />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
