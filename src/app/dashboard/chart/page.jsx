"use client";

import { Loading } from "@/components/custom/loading";
import { db } from "@/firebase/firebase";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Chart from "./Chart";
import Select from 'react-select';

const Page = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(dayjs().format('MM-DD-YY'));
    const [toDate, setToDate] = useState(dayjs().add(1, 'week').format('MM-DD-YY'));
    const [hotelVendorSelected, setHotelVendorSelected] = useState(null);
    const [transportVendorSelected, setTransportVendorSelected] = useState(null);
    const [hotelVendors, setHotelVendors] = useState([{ value: '', label: 'Select Hotel Vendor' }]);
    const [transportVendors,setTransportVendors] = useState([{value:'',label:'Select Transport Vendor'}])
    

    const fetchData = async () => {
        setLoading(true);
        try {
            
            const querySnapshot = await getDocs(collection(db, "Data"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(data);

            
            let hotelVendorsData = [{ value: '', label: 'Select Hotel Vendor' }];
            const hotelVendorsQuerySnapshot = await getDocs(collection(db, "Vendors"));
            hotelVendorsQuerySnapshot.docs.forEach((doc) => {
                hotelVendorsData.push({
                    value: doc.data().name,
                    label: doc.data().name
                });
            });
            setHotelVendors(hotelVendorsData);

            let transportVendorsData = [{value:'',label:'Select Transport Vendor'}]
            const transportVendorsQuerySnapshot = await getDocs(collection(db, "TransportVendors"));
            transportVendorsQuerySnapshot.docs.forEach((doc) => {
                transportVendorsData.push({
                    value: doc.data().name,
                    label: doc.data().name,
                })
            });

            setTransportVendors(transportVendorsData)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching documents: ", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleFromDateChange = (date) => {
        setFromDate(dayjs(date).format('MM-DD-YY'));
    }

    const handleToDateChange = (date) => {
        setToDate(dayjs(date).format('MM-DD-YY'));
    }

    if (loading) {
        return <Loading />;
    }

    const filteredData = hotelVendorSelected || transportVendorSelected
    ? data
        .filter(item =>
            item.accomodation.some(accomodation => accomodation.vendor === hotelVendorSelected) ||
            item.transport.some(transport => transport.vendor === transportVendorSelected)
        )
        .map(item => ({
            ...item,
            accomodation: item.accomodation.filter(accomodation => accomodation.vendor === hotelVendorSelected),
            transport: item.transport.filter(transport => transport.vendor === transportVendorSelected),
        }))
    : data.map(item => ({
        ...item,
    }));

   
    return (
        <div className="pt-8">
            <h1 className="text-2xl mb-4">Chart</h1>
            <div className="flex justify-end gap-8 mt-4">
                <DatePicker
                    label="From"
                    value={dayjs(fromDate, 'MM-DD-YY')}
                    onChange={handleFromDateChange}
                    format="MM-DD-YY"
                    InputAdornmentProps={{ position: 'start' }}
                />
                <DatePicker
                    label="To"
                    value={dayjs(toDate, 'MM-DD-YY')}
                    onChange={handleToDateChange}
                    format="MM-DD-YY"
                    InputAdornmentProps={{ position: 'start' }}
                />
            </div>
            <div className="flex justify-end gap-4 mt-4">
                <Select
                    placeholder="Select Hotel Vendor"
                   className="p-2 rounded-lg w-[270px]"
                    value={hotelVendors.find(vendor => vendor.value === hotelVendorSelected)}
                    onChange={(selectedOption) => setHotelVendorSelected(selectedOption.value)}
                    options={hotelVendors}
                />
                <Select
                    placeholder="Select Transport Vendor"
                    className="p-2 rounded-lg w-[270px]"
                    value={transportVendors.find(vendor => vendor.value === transportVendorSelected)}
                    onChange={(selectedOption) => setTransportVendorSelected(selectedOption.value)}
                    options={transportVendors}
                />
            </div>
            <div>
                <Chart data={filteredData} fromDate={fromDate} toDate={toDate} />
            </div>
        </div>
    );
};

export default Page;

