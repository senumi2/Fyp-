import Table from "../Components/Table";

export default function Inventory() {
  return (
    <Table
      api="http://localhost:5000/api/inventory"
      columns={["date", "item", "quantity"]}
    />
  );
}
