import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PatientNav from "../../components/PatientNav";
import { fetchUserDetails } from "../../features/auth";
import { IDoctor, ISchedule } from "../patient";
import AppointmentModalBody from "../../components/Modal/ModalBody";
import { CheckCircleIcon } from "@chakra-ui/icons";

interface Review {
  review_reviewdate: string | number | Date;
  review_stars: number;
  review_reviewtext: ReactNode;
  reviewid: number;
  review: string;
  by: string;
}
interface IDoctorSingle extends IDoctor {
  reviews?: Array<Review>;
}

interface RatingProps {
  rating: number;
}

export function Rating({ rating }: RatingProps) {
  return (
    <Box display="flex" alignItems="center">
      {Array(5)
        .fill("")
        .map((_, i) => {
          const roundedRating = Math.round(rating * 2) / 2;
          if (roundedRating - i >= 1) {
            return (
              <BsStarFill
                key={i}
                style={{ marginLeft: "1" }}
                color={i < rating ? "yellow.300" : "gray.300"}
              />
            );
          }
          if (roundedRating - i === 0.5) {
            return <BsStarHalf key={i} style={{ marginLeft: "1" }} />;
          }
          return <BsStar key={i} style={{ marginLeft: "1" }} />;
        })}
    </Box>
  );
}

export default function Doctor({
  doctor,
  reviews,
}: {
  doctor: IDoctorSingle;
  reviews: Array<Review>;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedSlot, setSelectedSlot] = useState<ISchedule | null>(null);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    dispatch(fetchUserDetails(localStorage.getItem("token")));
    // fetchDoctor();
    return () => {};
  }, []);

  return (
    <>
      <PatientNav />
      <Box
        m={10}
        border="1px solid"
        borderColor={useColorModeValue("gray.800", "gray.500")}
        borderRadius="lg"
      >
        {/* Doctors Card */}
        <Stack spacing="2">
          <Box display={"flex"} padding="20px" width="100%" flexWrap={"wrap"}>
            <Box
              width={["100%", "50%", "30%"]}
              display={"flex"}
              alignItems="center"
              justifyContent="center"
            >
              <Image boxSize="150px" src={doctor?.photo} borderRadius="full" />
            </Box>
            <Box
              my={"20px"}
              width={["100%", "50%", "30%"]}
              display="flex"
              alignItems={"center"}
              justifyContent="center"
            >
              <Stack spacing={"3"}>
                <Text align={"center"} fontSize="2xl" fontWeight="bold">
                  {doctor?.name}
                </Text>
                <Text
                  align={"center"}
                  fontSize={"sm"}
                  color={"gray.500"}
                  fontFamily="san-serif"
                >
                  {doctor?.qualifications?.join(", ")} |{" "}
                  {doctor?.specializedtreatments?.join(", ")}
                </Text>
                <Rating rating={doctor?.rating ? doctor?.rating : 0} />
              </Stack>
            </Box>
            {/* Charges Block */}
            <Box
              width={["100%", "50%", "30%"]}
              boxSizing="border-box"
              flexGrow={"3"}
              display={"flex"}
              alignItems="center"
              justifyContent="center"
              padding={"20px"}
            >
              <Heading fontSize="2xl" fontWeight="bold">
                {`$` + doctor?.sessionfee?.toString() + "/session"}
              </Heading>
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box padding="2px">
        <Heading align="center" fontWeight={"semibold"}>
          Patient Reviews
        </Heading>
        <Box
          padding="2px"
          m={10}
          overflow={"scroll-y"}
          maxHeight={"100"}
          marginY="5px"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexWrap={"wrap"}
        >
          {!reviews
            ? null
            : reviews?.map((review, id) => {
                return (
                  <Box
                    key={id}
                    border="1px solid"
                    borderColor={useColorModeValue("gray.800", "gray.500")}
                    borderRadius="lg"
                    padding={"10px"}
                  >
                    <Stack spacing="3">
                      <Flex>
                        <Rating rating={review.review_stars} />
                        <Text
                          fontSize={"2xl"}
                          marginLeft={"10px"}
                          color={useColorModeValue("gray.800", "gray.500")}
                          fontWeight={"semibold"}
                        >
                          {review.review_reviewtext}
                        </Text>
                      </Flex>
                      <Box>
                        <Text
                          fontSize={"sm"}
                          fontFamily={"san-serif"}
                          color="gray.400"
                          fontWeight={"light"}
                        >
                          {" "}
                          Anonymous{" "}
                        </Text>
                        <Text
                          ml={"auto"}
                          fontSize={"sm"}
                          color={"gray.400"}
                          fontWeight={"light"}
                        >
                          {new Date(review.review_reviewdate).getDate() +
                            "/" +
                            new Date(review.review_reviewdate).getMonth() +
                            1 +
                            "/" +
                            new Date(
                              review.review_reviewdate
                            ).getFullYear()}{" "}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
        </Box>
      </Box>

      {/* Book an Appointment */}
      <Box m={10}>
        <Heading fontWeight={"semibold"}>Book an Appointment</Heading>
        {doctor?.doctorschedule?.length === 0 ? (
          <Box>
            <Text>Doctor is not available this week</Text>
          </Box>
        ) : (
          <AppointmentModalBody
            doctor={doctor}
            selectedSlot={selectedSlot}
            onClick={(schedule: ISchedule) => {
              setSelectedSlot(schedule);
            }}
          />
        )}
        <Divider />
        <Box>
          <Button
            disabled={selectedSlot === null}
            colorScheme="teal"
            _hover={{ bg: "teal.500", color: "white" }}
            onClick={() => {
              router.push(
                "/patient/appointment/confirm/" +
                  selectedSlot?.scheduleid +
                  "/" +
                  doctor?.userId
              );
            }}
          >
            <Flex alignItems={"center"}>
              <Box mx={"2px"}>
                <Text>Book Appointment</Text>
              </Box>
              <Box mx={"2px"}>
                <CheckCircleIcon />
              </Box>
            </Flex>
          </Button>
        </Box>
      </Box>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  let reviews = [];
  let doctor = {};

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/doctors/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    doctor = data.data;
    console.log(doctor);
  } catch (err) {
    console.log(err);
    return {
      props: {},
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
  try {
    const reviewData = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/reviews/getdoctorreview/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const reviewDataJson = await reviewData.json();
    reviews = reviewDataJson.data;
    console.log(reviews);
  } catch (err) {
    reviews = [];
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
  return {
    props: {
      doctor,
      reviews,
    }, // will be passed to the page component as props
  };
}
