import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ForgotPass() {
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [codeSend, setCodeSend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  const handleCodeSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/resetpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: code, email: email, password }),
        }
      );
      router.push("/login");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEmailSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/mailresetcode/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );
      setLoading(false);
      setCodeSend(true);
    } catch (err: any) {
      setEmail("");
      setCode("");
      setPassword("");
      console.log(err);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(true);
    } finally {
    }
  };
  return (
    <Center height={"100vh"} width={"100%"}>
      <Box
        width={"container.sm"}
        py={4}
        px={"10"}
        borderRadius="lg"
        boxShadow="xs"
        rounded="lg"
        textAlign={"center"}
        minHeight={"400px"}
      >
        <Stack spacing="2">
          <Heading>Reset Password</Heading>
          {!loading ? (
            !codeSend ? (
              <EmailInput
                onChange={(e: any) => setEmail(e.target.value)}
                onSubmit={handleEmailSubmit}
                email={email}
              />
            ) : (
              <CodeInput
                onChangeCode={(e) => setCode(e.target.value)}
                onChangePwd={(e) => setPassword(e.target.value)}
                password={password}
                code={code}
                onSubmit={handleCodeSubmit}
              />
            )
          ) : (
            <Center>
              <Spinner />
            </Center>
          )}
        </Stack>
      </Box>
    </Center>
  );
}

interface IEmailInput {
  email: string;
  onChange: (e: any) => void;
  onSubmit: () => void;
}
const EmailInput = (props: IEmailInput) => {
  const { onChange, email, onSubmit } = props;
  return (
    <Box>
      <Stack spacing={"8"} my="4">
        <FormControl isRequired={true}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            id="2"
            value={email}
            onChange={onChange}
          />
        </FormControl>
        <Button mx="auto" size="md" colorScheme={"teal"} onClick={onSubmit}>
          Send a reset code
        </Button>
      </Stack>
    </Box>
  );
};

interface ICodeInput {
  code: string;
  password: string;
  onChangeCode: (e: any) => void;
  onChangePwd: (e: any) => void;
  onSubmit: () => void;
}

const CodeInput = (props: ICodeInput) => {
  const { code, password, onChangeCode, onChangePwd, onSubmit } = props;
  return (
    <>
      <Box>
        <Stack spacing={"8"} my="4">
          <FormControl isRequired={true}>
            <FormLabel>Code</FormLabel>
            <Input
              type="text"
              placeholder="Enter code"
              id="1"
              value={code}
              onChange={onChangeCode}
            />
          </FormControl>
          <FormControl isRequired={true}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter new password"
              id="2"
              value={password}
              onChange={onChangePwd}
            />
          </FormControl>
          <Button mx="auto" size="md" colorScheme={"teal"} onClick={onSubmit}>
            Reset Password
          </Button>
        </Stack>
      </Box>
    </>
  );
};
