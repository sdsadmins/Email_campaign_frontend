import Navbar from '../../../../component/Navbar';
import EmailTemplatesComponent from '../../../../component/email-templates/EmailTemplatesComponent';

export default function EmailTemplates() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full px-8 lg:px-12 py-8">
        <EmailTemplatesComponent />
      </div>
    </div>
  );
}
