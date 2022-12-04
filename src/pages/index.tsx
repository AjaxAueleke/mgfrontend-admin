//Appointment page for patient
// path: src\pages\patient\appointment\index.tsx

import {
  Divider,
  Button,
  Center,
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
  useColorModeValue,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Box, Heading, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PatientNav from "../components/PatientNav";
import { fetchUserDetails } from "../features/auth";

import { useRouter } from "next/router";

export function AppointmentCard({ appointment }: { appointment: any }) {
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
            {appointment.patient_name}
          </Text>
        </Stack>
        
      </Stack>
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
  patient_name: string;
  patient_photo: string;
}
export default function Appointment() {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Array<IAppointmnet>>([]);
  const [filter, setFilter] = useState("upcoming");
  const toast = useToast();
  const dispatch = useDispatch();
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/appointments/getappointments?filter=${filter}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      console.log("data", data);

      // Had to hardcode the data because the api is not working
      // const data: { data: Array<IAppointmnet> } = {
      //   data: [
      //     {
      //       appointment_id: 1,
      //       appointment_aptdate: "2021-09-01",
      //       doctorschedule_scheduleid: 1,
      //       doctorschedule_location: "Kandy",
      //       doctorschedule_day: "Monday",
      //       doctorschedule_from: "10:00",
      //       doctorschedule_till: "11:00",
      //       doctor_name: "Dr. John",
      //     },
      //     {
      //       appointment_id: 2,
      //       appointment_aptdate: "2021-09-01",
      //       doctorschedule_scheduleid: 2,
      //       doctorschedule_location: "Kandy",
      //       doctorschedule_day: "Monday",
      //       doctorschedule_from: "11:00",
      //       doctorschedule_till: "12:00",
      //       doctor_name: "Mr. Moana",
      //     },
      //   ],
      // };
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
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      dispatch(fetchUserDetails(localStorage.getItem("token")));
    } else {
      router.push("/login");
    }
    fetchAppointments();
  }, [filter]);

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
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="upcoming">Upcoming</option>
          <option value="passed">Passed</option>
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
