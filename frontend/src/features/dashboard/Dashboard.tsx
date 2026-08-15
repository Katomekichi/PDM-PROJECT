import { useNavigate } from "react-router-dom";
import { dashboardCards } from "@/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard" color="default" style={{ cursor: 'pointer',display: 'flex', justifyContent: 'center', gap: '5rem', padding: '10rem'}}>
      {dashboardCards.map((card) => (
        <div
          key={card.id}
          className="dashboard-card"
          onClick={() => navigate(card.route)}
          style={{padding: '5rem', border: '1px solid rgb(11, 95, 165)', borderRadius: '20px'}}
        >
          <h2 style={{color: 'rgb(11, 95, 165)'}}>{card.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;