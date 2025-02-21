import { useState } from "react";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BFHLApp() {
  const [jsonInput, setJsonInput] = useState("{}");
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const response = await fetch("http://localhost:5000/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });
      const result = await response.json();
      setResponseData(result);
      document.title = result.roll_number || "BFHL App";
    } catch (error) {
      alert("Invalid JSON or API error");
    }
  };

  const filteredData = () => {
    if (!responseData) return {};
    const { numbers, alphabets, highest_alphabet } = responseData;
    const data = {};
    if (selectedFilters.includes("Alphabets")) data.alphabets = alphabets;
    if (selectedFilters.includes("Numbers")) data.numbers = numbers;
    if (selectedFilters.includes("Highest Alphabet")) data.highest_alphabet = highest_alphabet;
    return data;
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <Input value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder="Enter JSON" />
      <Button onClick={handleSubmit}>Submit</Button>
      {responseData && (
        <Select multiple onValueChange={setSelectedFilters}>
          <SelectItem value="Alphabets">Alphabets</SelectItem>
          <SelectItem value="Numbers">Numbers</SelectItem>
          <SelectItem value="Highest Alphabet">Highest Alphabet</SelectItem>
        </Select>
      )}
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(filteredData(), null, 2)}</pre>
    </div>
  );
}
