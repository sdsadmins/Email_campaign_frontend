import Navbar from '../../../../component/Navbar';
import DashboardComponent from '../../../../component/dashboard/DashboardComponent';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <DashboardComponent />
      </div>
    </div>
  );
}
