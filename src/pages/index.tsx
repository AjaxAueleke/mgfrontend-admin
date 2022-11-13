import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { useEffect } from "react";
import NavBar from "../components/NavBar";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      router.push("/patient");
    }
  });
  return (
    <>
      <NavBar cta="Getting Started" />

      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: useBreakpointValue({ base: "20%", md: "30%" }),
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "teal.400",
                  zIndex: -1,
                }}
              >
                SkinCare.
              </Text>
              <br />{" "}
              <Text color={"teal.400"} as={"span"}>
                Appoitments Made Easy
              </Text>{" "}
            </Heading>
            <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
              Pakistan&apos;s leading appointment management system.
            </Text>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Button
                rounded={"full"}
                bg={"teal.400"}
                color={"white"}
                padding={"10px"}
                fontSize={["sm", "md"]}
                _hover={{
                  bg: "teal.500",
                }}
              >
                <Link href={"/login"}>Book your next appointment</Link>
              </Button>
              <Button rounded={"full"}>
                <Link href={"/signup"}>Sign Up</Link>
              </Button>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            src={
              "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
          />
        </Flex>
      </Stack>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}


