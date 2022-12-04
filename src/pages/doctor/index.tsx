import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppointmentModal from "../../components/Modal";
import PatientMain from "../../components/PatientMain";
import PatientNav from "../../components/PatientNav";
import {
  fetchUserDetails,
  selectUserState,
  setAuthState,
} from "../../features/auth";
import { setDoctors } from "../../features/doctors";
export interface ISchedule {
  availabledate: any;
  scheduleid: number;
  location: string;
  latitude: string;
  longitude: string;
  day: string;
  from: string;
  till: string;
}

export interface IDoctor {
  userId?: number;
  name?: string;
  phone?: string;
  sessionfee?: number;
  qualifications?: [string];
  rating?: number;
  specializedtreatments?: [string];
  photo?: string;
  doctorschedule?: Array<ISchedule>;
}

export default function Home() {
  const user = useSelector(selectUserState);
  console.log(user);
  const authState = useSelector(selectUserState);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState<Boolean>(false);
  const [appointments, setAppointments] = useState<Array<any>>([]);
  const toast = useToast();
  const dispath = useDispatch();
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

  useEffect(() => {
    if (!authState && localStorage.getItem("token") === null) {
      router.push("/login");
    }
    if (localStorage.getItem("token") !== null) {
      dispatch(setAuthState(true));
    }
    if (localStorage.getItem("token") !== null) {
      dispatch(fetchUserDetails(localStorage.getItem("token")));
    }

    fetchDoctors(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/doctors/getalldoc`
    );
  }, []);
  const [search, setSearch] = useState<string>("");

  
  
  return (
    <>
      <PatientNav />
      <PatientMain doctorList={doctorList} isLoading={loading} />
    </>
  );
}
