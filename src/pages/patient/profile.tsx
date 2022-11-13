import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import router from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import PatientNav from "../../components/PatientNav";
import { selectUserState } from "../../features/auth";
import emailValidator from "../../util/emailValidator";
import { IError } from "../signup";

export default function Profile(props: {}) {
  const userDetails = useSelector(selectUserState);
  const [name, setName] = useState<string>(userDetails.name);
  const [email, setEmail] = useState<string>(userDetails.email);
  const [phone, setPhone] = useState<string>(userDetails.phone);
  const [gender, setGender] = useState<string>(userDetails.gender);
  const [errors, setErrors] = useState<IError>({});
  const toast = useToast();

  const submitHandler = async (e: any) => {
    console.log("RUNNING");
    e.preventDefault();
    console.log(errors);
    if (name.trim() === "") {
      setErrors((prevState: IError) => ({
        ...prevState,
        name: "Name is required",
      }));
    } else {
      setErrors((prevState: IError) => ({
        ...prevState,
        name: "",
      }));
    }
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

    if (phone.trim() === "") {
      setErrors((prevState: IError) => ({
        ...prevState,
        phone: "Phone number is required",
      }));
    } else {
      setErrors((prevState: IError) => ({
        ...prevState,
        phone: "",
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
        const res = await fetch(
          "http://65.2.20.95:3000/api/v1/users/editdetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              name,
              phone,
              gender,
            }),
          }
        );
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
            title: "Account created.",
            description: "We've created your account for you.",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
            containerStyle: {
              backgroundColor: "green.500",
            },
          });
          router.push("/login");
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
    <>
      <PatientNav />
      <Box>
        <Center py={6}>
          <Box
            maxW={["sm", "md"]}
            w={"full"}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"2xl"}
            rounded={"md"}
            overflow={"hidden"}
          >
            <Box
              h={"120px"}
              w={"full"}
              objectFit={"cover"}
              bgColor={"teal.500"}
            />
            <Flex justify={"center"} mt={-12}>
              <Avatar
                size={"xl"}
                src={userDetails!.photo | ""}
                alt={"Author"}
                css={{
                  border: "2px solid white",
                }}
              />
            </Flex>

            <Box p={6}>
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                  User Details
                </Heading>
                <Stack spacing="4" mt="4">
                  <form onSubmit={submitHandler}>
                    <Box>
                      <FormControl
                        isRequired={true}
                        isInvalid={
                          errors.name !== undefined && errors.name !== ""
                        }
                      >
                        <FormLabel>Name</FormLabel>
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          id="1"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                        {errors.name && (
                          <FormErrorMessage color="red.500">
                            {errors.name}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl isRequired={true}>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          placeholder="Select option"
                          defaultValue={gender}
                          onChange={(e) => {
                            setGender(e.target.value);
                          }}
                        >
                          <option value="Male" selected={gender === "Male"}>
                            Male
                          </option>
                          <option value="Female" selected={gender === "Female"}>
                            Female
                          </option>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl
                        isRequired={true}
                        isInvalid={
                          errors.email !== undefined && errors.email !== ""
                        }
                      >
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          id="2"
                          value={email}
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
                          errors.phone !== undefined && errors.phone !== ""
                        }
                      >
                        <FormLabel>Phone</FormLabel>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          id="3"
                          value={phone}
                          onChange={(e) => {
                            {
                              setPhone(e.target.value);
                            }
                          }}
                        />
                        {errors.phone ? (
                          <FormErrorMessage color="red.500">
                            {errors.phone}
                          </FormErrorMessage>
                        ) : (
                          <></>
                        )}
                      </FormControl>
                    </Box>
                  </form>
                </Stack>
              </Stack>
              <Button
                w={"full"}
                mt={8}
                bg={useColorModeValue("#151f21", "gray.900")}
                color={"white"}
                rounded={"md"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Center>
      </Box>
    </>
  );
}
