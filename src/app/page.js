import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/email-campaign/dashboard');
}
