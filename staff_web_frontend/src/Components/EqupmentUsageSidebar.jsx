import { Link } from "react-router-dom";

 function EqupmentUsageSidebar() {
  return (
    <div className="sidebar">
      <Link to="/">Inventory</Link>
      <Link to="/issues">Report Issues</Link>
      <Link to="/maintenance">Maintenance Logs</Link>
    </div>
  );
}

export default EqupmentUsageSidebar;