import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { LogOut, Settings, Database, FileText } from 'lucide-react';

export function Navigation() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold">R&D Newsletter Manager</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">
                <FileText className="w-4 h-4 mr-2" />
                Newsletters
              </Button>
            </Link>
            <Link to="/content">
              <Button variant="ghost">
                <Database className="w-4 h-4 mr-2" />
                Content
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}