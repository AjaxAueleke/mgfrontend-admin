import {
  Box,
  Center,
  Divider,
  SimpleGrid,
  Spinner,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { IDoctor } from "../../pages/doctor";
import DoctorCard from "../Card";
import AppointmentModal from "../Modal";
import SearchBox from "../SearchBox";

interface IPatientMain {
  doctorList: Array<IDoctor>;
  isLoading: Boolean;
}

export default function PatientMain(props: IPatientMain) {
  const { doctorList, isLoading } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const handleOnClose = () => {
    onClose();
    setSelectedDoctor(null);
  };
  const handleOnOpen = (doctor: IDoctor) => {
    setSelectedDoctor(doctor);
    onOpen();
  };
  return (
    <Box py={"30px"} px={["20px", "50px", "100px"]} width={"100%"}>
      <VStack spacing={"20px"}>
        <SearchBox />
        <Divider width={"100%"} />
        {isLoading ? (
          <Center w="100%" h="100vh">
            <Spinner size="md" color="teal.500" />
          </Center>
        ) : (
          <SimpleGrid columns={[1, 2, 2, 3]} w={"100%"} spacing={"6"}>
            {doctorList.map((doctor: IDoctor) => (
              <DoctorCard
                key={doctor.userId}
                doctor={doctor}
                onOpen={handleOnOpen}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>

      <AppointmentModal
        isOpen={isOpen}
        onClose={handleOnClose}
        bookAnAppointment={function (): void {
          throw new Error("Function not implemented.");
        }}
        doctor={selectedDoctor}
      />
    </Box>
  );
}
