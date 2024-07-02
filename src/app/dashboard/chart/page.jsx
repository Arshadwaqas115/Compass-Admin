"use client"
import { Loading } from "@/components/custom/loading";
import { db } from "@/firebase/firebase";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Chart from "./Chart"
const Page = () => {

    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const [fromDate, setFromDate] = useState(dayjs().format('MM-DD-YY'))
    const [toDate, setToDate] = useState(dayjs().add(1, 'week').format('MM-DD-YY'))

    const fetchData = async () => {   

        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "Data"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching documents: ", error);
            setLoading(false);
        }

     }

     useEffect(()=>{
        fetchData()
     },[])

    const handleFromDateChange = (date) => {
        setFromDate(dayjs(date).format('MM-DD-YY'));
    }

    const handleToDateChange = (date) => {
        setToDate(dayjs(date).format('MM-DD-YY'));
    }

    if(loading)
    {
        return(
            <Loading/>
        )
    }

    return(
            <div className="pt-8 ">
                <h1 className="text-2xl mb-4">Chart</h1>
                <div className="flex justify-end gap-8 mt-4">
                    <DatePicker
                        label="From"
                        value={dayjs(fromDate)}
                        onChange={handleFromDateChange}
                        format="MM-DD-YY"
                        InputAdornmentProps={{ position: 'start' }}
                    />
                    <DatePicker
                        label="To"
                        value={dayjs(toDate)}
                        onChange={handleToDateChange}
                        format="MM-DD-YY"
                        InputAdornmentProps={{ position: 'start' }}
                    />
                </div>


                <div className="">
                    <Chart data={data} fromDate={fromDate} toDate={toDate}/>
                </div>
            </div>
            
            

    )
};

export default Page;

