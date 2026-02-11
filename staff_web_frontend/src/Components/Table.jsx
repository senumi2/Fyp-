import axios from "axios";
import { useEffect, useState } from "react";

export default function Table({ api, columns }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [seeMore, setSeeMore] = useState(false);
  const [form, setForm] = useState({});

  const loadData = async () => {
    const res = await axios.get(api, {
      params: { search, all: seeMore }
    });
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, [search, seeMore]);

  const addData = async () => {
    await axios.post(api, form);
    loadData();
  };

  const deleteData = async (id) => {
    await axios.delete(`${api}/${id}`);
    loadData();
  };

  return (
    <>
      <input
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Form */}
      {columns.map(col => (
        <input
          key={col}
          placeholder={col}
          onChange={(e) =>
            setForm({ ...form, [col]: e.target.value })
          }
        />
      ))}
      <button onClick={addData}>Add</button>

      {/* Table */}
      <table>
        <thead>
          <tr>
            {columns.map(col => <th key={col}>{col}</th>)}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row._id}>
              {columns.map(col => <td key={col}>{row[col]}</td>)}
              <td>
                <button onClick={() => deleteData(row._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setSeeMore(!seeMore)}>
        {seeMore ? "Show Less" : "See More"}
      </button>
    </>
  );
}
