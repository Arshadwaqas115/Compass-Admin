import { Loading } from "@/components/custom/loading";
import { db } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "./usercard";

export const Customers = ({ setPath, setDocId ,setType}) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [agentSearchTerm, setAgentSearchTerm] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [showAgents, setShowAgents] = useState(false);

  console.log(agents)
  const getUsersData = async () => {
    setLoading(true);
    try {
      const userQuerySnapshot = await getDocs(collection(db, "Users"));
      const agentQuerySnapshot = await getDocs(collection(db, "Agents"));

      let usersTemp = [];
      userQuerySnapshot.forEach((doc) => {
      
        usersTemp.push({ id: doc.id, ...doc.data()  });
      });

      let agentsTemp = [];
      agentQuerySnapshot.forEach((doc) => {
        console.log(doc.id)
        agentsTemp.push({ id: doc.id, refid: doc.id, ...doc.data() });
      });
   
      setUsers(usersTemp);
      setFilteredUsers(usersTemp);
      setAgents(agentsTemp);
      setFilteredAgents(agentsTemp);
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

    const agentResults = agents.filter((agent) =>
      agent.name.toLowerCase().includes(agentSearchTerm.toLowerCase())
    );
    setFilteredAgents(agentResults);

   
    if (searchTerm.trim() !== "") {
      setShowUsers(true);
    } else {
      setShowUsers(false);
    }

  
    if (agentSearchTerm.trim() !== "") {
      setShowAgents(true);
    } else {
      setShowAgents(false);
    }
  }, [searchTerm, agentSearchTerm, users, agents]);

  const handleUserCheckboxChange = () => {
    setShowUsers(!showUsers);
  };

  const handleAgentCheckboxChange = () => {
    setShowAgents(!showAgents);
  };

  if (loading) {
    return <Loading />;
  }

  const noResultsMessage = "No results to display.";

  return (
    <div className="p-4">
      <div className="flex items-center justify-between border-b">
        <div>
          <h1 className="text-xl p-4">Users/Agents</h1>
        </div>
        <div className="gap-4 flex">
          <div>
            <input
              type="text"
              placeholder="Search by username"
              className="p-2 placeholder:text-center border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Search by agent name"
              className="p-2 placeholder:text-center border border-gray-300 rounded"
              value={agentSearchTerm}
              onChange={(e) => setAgentSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-4 mb-4">
          <label>
            <input
              type="checkbox"
              checked={showUsers}
              onChange={handleUserCheckboxChange}
            />{" "}
            Show Users
          </label>
          <label>
            <input
              type="checkbox"
              checked={showAgents}
              onChange={handleAgentCheckboxChange}
            />{" "}
            Show Agents
          </label>
        </div>

        <div className="h-96 overflow-y-scroll">
          {showUsers && (
            <div>
              <h2 className="text-lg mb-2">Users</h2>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((item, index) => (
                  <Card key={index} item={item} setPath={setPath} setDocId={setDocId}  type="User" setType={setType} />
                ))
              ) : (
                <p className="">{noResultsMessage}</p>
              )}
            </div>
          )}

          {showAgents && (
            <div>
              <h2 className="text-lg mt-4 mb-2">Agents</h2>
              {filteredAgents.length > 0 ? (
                filteredAgents.map((item, index) => (
                  <Card key={index} item={item} setPath={setPath} setDocId={setDocId}  type="Agent" setType={setType} />
                ))
              ) : (
                <p>{noResultsMessage}</p>
              )}
            </div>
          )}

          {!showUsers && !showAgents && (
            <p className="text-lg text-center mt-20 ">{noResultsMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};
