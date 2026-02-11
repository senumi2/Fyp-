export default function MaintenanceLogs() {
    return (
      <Table
        api="http://localhost:5000/api/maintenance"
        columns={["date", "issue", "status"]}
      />
    );
  }
  