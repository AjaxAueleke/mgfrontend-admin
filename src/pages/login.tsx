import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Link,
  FormErrorMessage,
  useToast,
  Select,
  Center,
} from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthState } from "../features/auth";
import emailValidator from "../util/emailValidator";
interface IError {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}
const Login: NextPage = () => {
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [errors, setErrors] = useState<IError>({});
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  const submitHandler = async (e: any) => {
    console.log("RUNNING");
    e.preventDefault();
    console.log(errors);

    if (email.trim() === "") {
      setErrors((prevState: IError) => ({
        ...prevState,
        email: "Email is required",
      }));
    } else if (!emailValidator(email)) {
      setErrors((prevState: IError) => ({
        ...prevState,
        email: "Invalid email",
      }));
    } else {
      setErrors((prevState: IError) => ({
        ...prevState,
        email: "",
      }));
    }

    if (password.trim() === "") {
      setErrors((prevState: IError) => ({
        ...prevState,
        password: "Password is required",
      }));
    } else {
      setErrors((prevState: IError) => ({
        ...prevState,
        password: "",
        confirmPassword: "",
      }));
    }

    // if there are no errors, post data
    for (const key in errors) {
      if (errors[key] === "") {
        delete errors[key];
      }
    }
    if (Object.keys(errors).length === 0) {
      console.log("PUSHING");
      try {
        const res = await fetch("http://65.2.20.95:3000/api/v1/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        const data = await res.json();

        console.log(data);
        if (data.error) {
          toast({
            title: "An error occurred.",
            description: data.error,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
        }
        if (data.status === "success") {
          toast({
            title: "Success.",
            description: data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
          }
          dispatch(setAuthState(true));
          router.push("/patient");
        }
      } catch (err) {
        console.log(err);
        toast({
          title: "An error occurred.",
          description: "We were unable to create your account.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  return (
    <Box
      maxW="container.sm"
      py={4}
      px={"10"}
      m="auto"
      mx={["10px", "auto", "auto", "auto"]}
      mt={5}
      borderRadius="lg"
      boxShadow="xs"
      rounded="lg"
      textAlign={"center"}
    >
      <Stack spacing="2">
        <Text fontSize="3xl" fontWeight="bold" as="h1">
          SkinCure.
        </Text>
        <Text fontSize="lg" fontWeight="semibold" as="h2">
          Login to your account.
        </Text>
      </Stack>

      <Stack spacing="4" mt="4">
        <form onSubmit={submitHandler}>
          <Box>
            <FormControl
              isRequired={true}
              isInvalid={errors.email !== undefined && errors.email !== ""}
            >
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                id="2"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {errors.email !== "" ? (
                <FormErrorMessage color="red.500">
                  {errors.email}
                </FormErrorMessage>
              ) : (
                <></>
              )}
            </FormControl>
          </Box>
          <Box>
            <FormControl
              isRequired={true}
              isInvalid={
                errors.password !== undefined && errors.password !== ""
              }
            >
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                id="4"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {errors.password ? (
                <FormErrorMessage color="red.500">
                  {errors.password}
                </FormErrorMessage>
              ) : (
                <></>
              )}
            </FormControl>
          </Box>
        </form>
      </Stack>
      <Box my={5}>
        <Button
          mx="auto"
          size="md"
          colorScheme={"teal"}
          onClick={submitHandler}
        >
          Login
        </Button>
      </Box>
      <Stack mt={6} spacing={4}>
        <Divider />
        <Text fontSize="sm" as="h3" color="muted">
          Don&apos;t have an account?{" "}
          <NextLink href={"/signup"}>
            <Link color="teal.500">Sign Up</Link>
          </NextLink>
        </Text>
        <Text fontSize="sm" as="h3" color="muted">
          Forgot your password.{" "}
          <NextLink href={"/forgot"}>
            <Link color="teal.500">Click Here</Link>
          </NextLink>
        </Text>
      </Stack>
    </Box>
  );
};

export default Login;
