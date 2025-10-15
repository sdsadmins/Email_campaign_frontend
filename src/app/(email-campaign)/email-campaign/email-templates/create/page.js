import Navbar from '../../../../../component/Navbar';
import EmailTemplateCreateComponent from '../../../../../component/email-templates/EmailTemplateCreateComponent';

export default function EmailTemplateCreate() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full px-8 lg:px-12 py-8">
        <EmailTemplateCreateComponent />
      </div>
    </div>
  );
}
