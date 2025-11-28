import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, FileText } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/editor/new" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Create Blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}