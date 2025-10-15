import Navbar from '../../../../../component/Navbar';
import EmailTemplatePreviewComponent from '../../../../../component/email-templates/EmailTemplatePreviewComponent';

export default function EmailTemplatePreview() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full px-8 lg:px-12 py-8">
        <EmailTemplatePreviewComponent />
      </div>
    </div>
  );
}
