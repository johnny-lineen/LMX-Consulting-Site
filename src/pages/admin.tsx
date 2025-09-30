import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Legacy admin page - redirects to /admin/resources
 * This redirect ensures backward compatibility
 */
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/resources');
  }, [router]);

  return null;
}
