import Navbar from '../../../../../../component/Navbar';
import EmailTemplateEditComponent from '../../../../../../component/email-templates/EmailTemplateEditComponent';

export default function EmailTemplateEdit() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full px-8 lg:px-12 py-8">
        <EmailTemplateEditComponent />
      </div>
    </div>
  );
}
