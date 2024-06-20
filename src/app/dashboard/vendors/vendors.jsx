import { Loading } from "@/components/custom/loading";
import { db } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {Card} from "../../../components/custom/usercard";
export const Vendors = ({ setPath, setDocId, setType }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getUsersData = async () => {
    setLoading(true);
    try {
      const userQuerySnapshot = await getDocs(collection(db, "Vendors"));
      let usersTemp = [];
      userQuerySnapshot.forEach((doc) => {
        usersTemp.push({ id: doc.id, ...doc.data() });
      });

      setUsers(usersTemp);
      setFilteredUsers(usersTemp);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  useEffect(() => {
    const userResults = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(userResults);
  }, [searchTerm, users]);

  if (loading) {
    return <Loading />;
  }

  const noResultsMessage = "No results to display.";

  return (
    <div className="p-4">
      <div className="flex items-center justify-between border-b">
        <div>
          <h1 className="text-xl p-4">Vendors</h1>
        </div>
        <div className="flex  items-center gap-4">
          <div>
              <input
                type="text"
                placeholder="Search by vendor name"
                className="p-2 placeholder:text-center border border-gray-300 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <div>
                <button onClick={()=>{setPath("add")}} className=" w-10 bg-green-300 text-white  h-10 rounded-full border"><h1 className="text-2xl">+</h1></button>
          </div>
          
        </div>
      </div>

      <div className="mt-4">
        <div className="h-96 overflow-y-scroll">
          <div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((item, index) => (
                <Card
                  key={index}
                  item={item}
                  setPath={setPath}
                  setDocId={setDocId}
                  type="Vendor"
                  setType={setType}
                />
              ))
            ) : (
              <p className="">{noResultsMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
