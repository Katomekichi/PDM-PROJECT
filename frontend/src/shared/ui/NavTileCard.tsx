interface NavTileCardProps {
  readonly title: string;
  readonly onClick: () => void;
}

export default function NavTileCard({ title, onClick }: NavTileCardProps) {
  return (
    <div
      className="dashboard-card"
      onClick={onClick}
      style={{ cursor: 'pointer', padding: '5rem', border: '1px solid rgb(11, 95, 165)', borderRadius: '20px' }}
    >
      <h2 style={{ color: 'rgb(11, 95, 165)' }}>{title}</h2>
    </div>
  );
}
