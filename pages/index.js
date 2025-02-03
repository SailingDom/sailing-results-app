import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { db } from "@/lib/firebase"; // Assuming Firebase integration
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function SailingResultsApp() {
  const [competitors, setCompetitors] = useState([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Finished");

  const addCompetitor = async () => {
    if (name) {
      const result = {
        name,
        time: status === "Finished" ? parseInt(time, 10) || 0 : status,
        status,
        points: calculatePoints(status, parseInt(time, 10)),
      };
      setCompetitors([...competitors, result]);
      setName("");
      setTime("");
      setStatus("Finished");

      // Save to Firebase
      await addDoc(collection(db, "raceResults"), result);
    }
  };

  const calculatePoints = (status, time) => {
    if (status === "DNF" || status === "DSQ") return 100; // Arbitrary high penalty points
    return time;
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Sailing Race Results</h1>
      <div className="flex gap-2 mb-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Competitor Name" />
        <Input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="Finish Time (s)" disabled={status !== "Finished"} />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Finished">Finished</option>
          <option value="DNF">DNF</option>
          <option value="DSQ">DSQ</option>
        </Select>
        <Button onClick={addCompetitor}>Add</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Finish Time (s)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competitors.map((comp, index) => (
            <TableRow key={index}>
              <TableCell>{comp.name}</TableCell>
              <TableCell>{comp.time}</TableCell>
              <TableCell>{comp.status}</TableCell>
              <TableCell>{comp.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
