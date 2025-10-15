import Navbar from '../../../../component/Navbar';
import InfoListComponent from '../../../../component/infolist/InfoListComponent';

export default function InfoList() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full px-8 lg:px-12 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Info List</h1>
          <p className="mt-2 text-gray-600">Manage and view your contact information with advanced filtering and pagination.</p>
        </div>
        <InfoListComponent />
      </div>
    </div>
  );
}
