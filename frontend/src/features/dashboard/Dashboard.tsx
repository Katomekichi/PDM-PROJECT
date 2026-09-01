import { useNavigate } from "react-router-dom";
import { dashboardCards } from "@/dashboard";
import NavTileCard from "@/components/NavTileCard";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard" style={{ display: 'flex', justifyContent: 'center', gap: '5rem', padding: '10rem' }}>
      {dashboardCards.map((card) => (
        <NavTileCard key={card.id} title={card.title} onClick={() => navigate(card.route)} />
      ))}
    </div>
  );
};

export default Dashboard;
