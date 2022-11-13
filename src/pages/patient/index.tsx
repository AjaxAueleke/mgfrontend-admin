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
  const [doctorList, setDoctorList] = useState<Array<IDoctor>>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const toast = useToast();
  const dispath = useDispatch();

  const fetchDoctors = async (url: string) => {
    setLoading(true);
    try {
      // const response = await fetch(url);
      // const data = await response.json();
      // setDoctorList((prev) => [...data.data]);
      // dispatch(setDoctors(data.data));
    } catch (err) {
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

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const onClickSearch = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor/search?name=${name}`
    );
    const data = await res.json();
    setDoctorList(data);
  };
  return (
    <>
      <PatientNav />
      <PatientMain doctorList={doctorList} isLoading={loading} />
    </>
  );
}
