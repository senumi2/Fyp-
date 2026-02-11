export default function ReportIssues() {
    return (
      <Table
        api="http://localhost:5000/api/issues"
        columns={["date", "issue", "status"]}
      />
    );
  }
  