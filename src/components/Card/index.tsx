import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
  textDecoration,
} from "@chakra-ui/react";
import Link from "next/link";
import { Rating } from "../../pages/doctor/[id]";
import { IDoctor } from "../../pages/patient";

export interface IDoctorCard {
  doctor: IDoctor;
  onOpen: (doctor: IDoctor) => void;
}
export default function DoctorCard(props: IDoctorCard) {
  const { doctor, onOpen } = props;
  return (
    <Box
      maxW={"445px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="outline"
      rounded={"sm"}
      overflow={"hidden"}
      padding="10"
    >
      <Flex justify={"center"}>
        <Avatar
          size={"xl"}
          src={doctor.photo}
          css={{
            border: "2px solid white",
          }}
        />
      </Flex>

      <Box p={6}>
        <Stack spacing={0} align={"center"} mb={5}>
          <Heading
            fontSize={"2xl"}
            fontWeight={500}
            fontFamily={"body"}
            _hover={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            <Link href={`/doctor/${doctor?.userId}`}>
              {doctor.name?.toUpperCase()}
            </Link>
          </Heading>
          <Text color={"gray.500"} fontSize="2xs">
            {doctor.qualifications?.join(", ")}
          </Text>
          <Text color={"gray.500"} fontSize="1xl">
            {doctor.specializedtreatments?.join(", ")}
          </Text>
        </Stack>

        <Stack direction={"row"} justify={"center"} spacing={6}>
          <Stack spacing={0} align={"center"}>
            <Rating rating={doctor?.rating ? doctor?.rating : 0} />
            <Text
              fontSize={"sm"}
              color={"gray.500"}
              textAlign="center"
              textShadow="md"
            >
              Average Rating
            </Text>
          </Stack>
          <Stack spacing={0} align={"center"}>
            <Text fontWeight={600}>{doctor?.doctorschedule?.length}</Text>
            <Text
              fontSize={"sm"}
              color={"gray.500"}
              textAlign="center"
              textShadow={"md"}
            >
              Available Days
            </Text>
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
          onClick={() => onOpen(doctor)}
        >
          See Available Days
        </Button>
      </Box>
    </Box>
  );
}
