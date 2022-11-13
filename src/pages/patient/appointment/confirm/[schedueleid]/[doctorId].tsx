import { NextPage } from "next";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { IDoctor, ISchedule } from "../../..";
import doctors from "../../../../../features/doctors";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

const CheckoutForm = ({
  doctor,
  scheduele,
}: {
  doctor: IDoctor;
  scheduele: ISchedule;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    const { error, token } = await stripe!.createToken(
      elements.getElement(CardElement)!
    );

    console.log();
    if (error) {
      toast({
        position: "top",
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/appointments/bookappointment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              docid: doctor.userId,
              scheduleid: scheduele.scheduleid,
              apptdate: scheduele.availabledate
,
            }),
          }
        );

        const data = await res.json();
        console.log(data);
        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/bookings/addnewbooking`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              doctorid: doctor.userId,
              appointmentid: data.data.appointmentid,
              tokenid: token,
            }),
          }
        );
      } catch (err) {
        console.log(err);
        toast({
          position: "top",
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <Box
      margin={"auto"}
      maxW={"container.md"}
      padding="2rem"
      minHeight={"100vh"}
      display="flex"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box
        maxW={"md"}
        border="1px solid #e2e8f0"
        borderRadius={"lg"}
        p={["40px"]}
      >
        <form onSubmit={handleSubmit}>
          <Heading fontSize="2xl" fontWeight="bold">
            Confirm your appointment
          </Heading>
          <Box padding={["3px", "5px", "6px"]} my="5" border="ActiveBorder">
            <Stack spacing="3">
              <Flex justifyContent={"space-between"}>
                <Box>
                  <Text as="h1" fontSize={"xl"} fontWeight={"semibold"}>
                    {"Doctor Name: "}
                  </Text>
                </Box>
                <Box>
                  <Text as="h1" fontSize={"xl"}>
                    {doctor.name}
                  </Text>
                </Box>
              </Flex>
              <Flex justifyContent={"space-between"}>
                <Box>
                  <Text as="h1" fontSize={"xl"} fontWeight={"semibold"}>
                    Appointment Date:
                  </Text>
                </Box>
                <Box>
                  <Text as="h1" fontSize={"xl"}>
                    {scheduele?.day || "Not Available"}
                  </Text>
                </Box>
              </Flex>
              <Flex justifyContent={"space-between"}>
                <Box>
                  <Text as="h1" fontSize={"xl"} fontWeight={"semibold"}>
                    Appointment Time:
                  </Text>
                </Box>
                <Box>
                  <Text as="h1" fontSize={"xl"}>
                    {scheduele?.from ? scheduele.from : "Not Available"}
                  </Text>
                </Box>
              </Flex>
              <Flex justifyContent={"space-between"}>
                <Box>
                  <Text as="h1" fontSize={"xl"} fontWeight={"semibold"}>
                    Appointment Fee:
                  </Text>
                </Box>
                <Box>
                  <Text as="h1" fontSize={"xl"}>
                    ${doctor.sessionfee}
                  </Text>
                </Box>
              </Flex>
            </Stack>
          </Box>
          <Box my={"4"}>
            <CardElement />
          </Box>
          <Button
            width={"100%"}
            bgColor={"teal.500"}
            mt={4}
            px={"5"}
            border="1px solid teal"
            color={"white"}
            _hover={{
              bg: "white",
              color: "teal.500",
            }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? <Spinner /> : "Confirm Payment"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default function AppointmentConfirm({ doctor, schedueleid }: any) {
  console.log("doctor", doctor);
  console.log("schedueleid", schedueleid);
  const scheduele = doctor.doctorschedule.find(
    (item: ISchedule) => item.scheduleid == schedueleid
  );
  console.log("scheduele", scheduele);
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm scheduele={scheduele} doctor={doctor} />
    </Elements>
  );
}

export async function getServerSideProps(context: any) {
  const { schedueleid, doctorId } = context.params;
  console.log(context.params);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/doctors/${doctorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    return {
      props: {
        doctor: data.data,
        schedueleid,
      },
    };
  } catch (err) {
    return {
      props: {
        doctor: {},
        schedueleid,
      },
      //   notFound : true,
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
}
