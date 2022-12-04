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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PatientNav from "../../components/PatientNav";
import { fetchUserDetails, selectUserState } from "../../features/auth";
import emailValidator from "../../util/emailValidator";

interface IError {
  [key: string]: string;
}

export default function Profile(props: {}) {
  const userDetails = useSelector(selectUserState);
  const dispatch = useDispatch();
  const [name, setName] = useState<string>(userDetails?.name);
  const [email, setEmail] = useState<string>(userDetails?.email);
  const [phone, setPhone] = useState<string>(userDetails?.phone);
  const [gender, setGender] = useState<string>(userDetails?.gender);
  const [errors, setErrors] = useState<any>({});
  const [perros, setPerros] = useState<any>({});
  const [password, setPassword] = useState<string>("");
  const [npassword, setNPassword] = useState<string>("");
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionfee, setSessionfee] = useState(userDetails.sessionfee);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
      return;
    }
    // dispatch(fetchUserDetails());
  }, []);

  const passwordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/changepassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            oldpw: password,
            newpw: npassword,
            newpwconfirm: npassword,
          }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        toast({
          title: "Password changed.",
          description: "We've changed your password for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
          containerStyle: {
            backgroundColor: "green.500",
          },
        });
        router.push("/login");
      } else {
        toast({
          title: "An error occurred.",
          description: data.error,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Could not update your password",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

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
        console.log({
          name,
          phone,
          gender,
        });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/change`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              property: ["name", "phone", "gender", "sessionfee"],
              value: [name, phone, gender.toLowerCase(), sessionfee],
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
            title: "Account updated.",
            description: "We've updated your account for you.",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
            containerStyle: {
              backgroundColor: "green.500",
            },
          });
          // router.push("/login");
        }
      } catch (err) {
        console.log(err);
        toast({
          title: "An error occurred.",
          description: "We were unable to update your account.",
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
                          value={gender}
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
                          disabled={true}
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
                      <FormControl isRequired={true}>
                        <FormLabel>Session Fee</FormLabel>
                        <Input
                          type="number"
                          placeholder="Session fee"
                          id="1"
                          value={sessionfee}
                          onChange={(e) => {
                            setSessionfee(e.target.value);
                          }}
                        />
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
                disabled={loading}
                w={"full"}
                mt={8}
                bg={useColorModeValue("#151f21", "gray.900")}
                color={"white"}
                rounded={"md"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                onClick={submitHandler}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Center>
      </Box>

      {/* {change password} */}
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
            <Box p={6}>
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                  Change Password
                </Heading>
                <Stack spacing="4" mt="4">
                  <form onSubmit={passwordHandler}>
                    <Box>
                      <FormControl
                        isRequired={true}
                        isInvalid={password.length === 0 || password.length < 6}
                      >
                        <FormLabel>Current Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Enter your current password"
                          id="1"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl
                        isRequired={true}
                        isInvalid={
                          npassword.length === 0 || npassword.length < 6
                        }
                      >
                        <FormLabel>New Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          id="2"
                          value={npassword}
                          onChange={(e) => {
                            setNPassword(e.target.value);
                          }}
                        />
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
                disabled={loading}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                onClick={passwordHandler}
              >
                Update Password
              </Button>
            </Box>
          </Box>
        </Center>
      </Box>
    </>
  );
}
