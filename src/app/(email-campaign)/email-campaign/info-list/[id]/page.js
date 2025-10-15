import Navbar from '../../../../../component/Navbar';
import ContactDetailsComponent from '../../../../../component/infolist/ContactDetailsComponent';

export default function ViewDetails() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full px-8 lg:px-12 py-8">
        <ContactDetailsComponent />
      </div>
    </div>
  );
}
