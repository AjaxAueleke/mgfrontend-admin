//Appointment page for patient
// path: src\pages\patient\appointment\index.tsx

import {
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { Box, Heading, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PatientNav from "../../../components/PatientNav";
import { fetchUserDetails } from "../../../features/auth";
import {
  Badge,
  Button,
  Center,
  Flex,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
            }}
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

export function AppointmentCard({
  appointment,
}: {
  appointment: IAppointmnet;
}) {
  const {
    isOpen: isOpenReview,
    onOpen: onOpenReview,
    onClose: onCloseReview,
  } = useDisclosure();
  const {
    isOpen: isOpenComplain,
    onOpen: onOpenComplain,
    onClose: onCloseComplain,
  } = useDisclosure();

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [complain, setComplain] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalRef = useRef(null);
  const toast = useToast();

  const router = useRouter();

  return (
    <Center py={6} ref={finalRef}>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        height={"min-content"}
        direction={{ base: "column" }}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"md"}
        padding={7}
      >
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={1}
          pt={1}
        >
          <Heading
            fontSize={"xl"}
            fontFamily={"body"}
            fontWeight={"bold"}
            color={"gray.600"}
          >
            {appointment.doctorschedule_day} - {appointment.appointment_aptdate}{" "}
          </Heading>
          <Text fontWeight={600} color={"gray.500"} size="sm" mb={4}>
            {appointment.doctorschedule_from} -{" "}
            {appointment.doctorschedule_till}
          </Text>
          <Text fontWeight={"medium"} color="gray.800" mb={4} fontSize={"lg"}>
            {appointment.doctor_name}
          </Text>
        </Stack>
        <Stack
          width={"100%"}
          mt={"2rem"}
          direction={"row"}
          padding={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            _focus={{
              bg: "gray.200",
            }}
            disabled={new Date() < new Date(appointment.appointment_aptdate)}
            onClick={onOpenComplain}
          >
            Complain
          </Button>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            bg={"blue.400"}
            color={"white"}
            boxShadow={
              "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
            }
            _hover={{
              bg: "blue.500",
            }}
            _focus={{
              bg: "blue.500",
            }}
            disabled={new Date() < new Date(appointment.appointment_aptdate)}
            onClick={onOpenReview}
          >
            Review
          </Button>
        </Stack>
      </Stack>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpenReview}
        onClose={() => {
          onCloseReview();
          router.replace(router.asPath);
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Give Feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Select
                placeholder="Rate your experience"
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
              <Input
                placeholder="Review"
                onChange={(e) => setReview(e.target.value)}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                onCloseReview();
                router.replace(router.asPath);
              }}
            >
              Close
            </Button>
            <Button colorScheme="blue" mr={3}>
              Submit Review
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpenComplain}
        onClose={() => {
          onCloseComplain();
          router.replace(router.asPath);
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a complain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup onChange={setReason} value={reason}>
              <Stack direction="column">
                <Radio value="1">First</Radio>
                <Radio value="2">Second</Radio>
                <Radio value="3">Third</Radio>
              </Stack>
            </RadioGroup>
            <Input
              disabled={reason !== "10"}
              placeholder="Complain"
              onChange={(e) => setComplain(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                onCloseComplain();
                router.replace(router.asPath);
              }}
            >
              Close
            </Button>
            <Button colorScheme="blue" mr={3}>
              Submit Complain
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}

interface IAppointmnet {
  appointment_id: number;
  appointment_aptdate: string;
  doctorschedule_scheduleid: number;
  doctorschedule_location: string;
  doctorschedule_day: string;
  doctorschedule_from: string;
  doctorschedule_till: string;
  doctor_name: string;
}
export default function Appointment() {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Array<IAppointmnet>>([]);
  const toast = useToast();
  const dispatch = useDispatch();
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/appointments/getappointments`,
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      //   }
      // );
      // const data = await res.json();
      // Had to hardcode the data because the api is not working
      const data: { data: Array<IAppointmnet> } = {
        data: [
          {
            appointment_id: 1,
            appointment_aptdate: "2021-09-01",
            doctorschedule_scheduleid: 1,
            doctorschedule_location: "Kandy",
            doctorschedule_day: "Monday",
            doctorschedule_from: "10:00",
            doctorschedule_till: "11:00",
            doctor_name: "Dr. John",
          },
          {
            appointment_id: 2,
            appointment_aptdate: "2021-09-01",
            doctorschedule_scheduleid: 2,
            doctorschedule_location: "Kandy",
            doctorschedule_day: "Monday",
            doctorschedule_from: "11:00",
            doctorschedule_till: "12:00",
            doctor_name: "Mr. Moana",
          },
        ],
      };
      console.log(data);
      setAppointments([...data.data]);
    } catch (err) {
      toast({
        position: "top",
        title: "Error",
        description:
          "Something went wrong, Please check your internet connection",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchUserDetails(localStorage.getItem("token")));
    }
    fetchAppointments();
  }, []);

  return (
    <>
      <PatientNav />
      <Box width={"100%"} p={"10px"} display="flex" flexDirection={"column"}>
        <Heading fontWeight={"semibold"} textAlign="center">
          Appointments
        </Heading>

        <Divider my={3} />
        <Select
          variant="outline"
          w={["100%", "100%", "25%"]}
          alignSelf="flex-end"
        >
          <option value="default" selected>
            All
          </option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </Select>
        <SimpleGrid
          columns={[1, 2, 4]}
          spacing={5}
          padding={{ base: "1", lg: "5" }}
        >
          {loading ? (
            <Center height="100vh">
              <Spinner />
            </Center>
          ) : (
            <>
              {appointments.map((appointment) => (
                <AppointmentCard
                  appointment={appointment}
                  key={appointment.appointment_id}
                />
              ))}
            </>
          )}
        </SimpleGrid>
      </Box>
    </>
  );
}
