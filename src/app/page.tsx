import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to FixMyCity
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          A comprehensive platform for citizens to report civic issues and municipal officers to manage them efficiently. 
          Choose your role to get started.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Citizen</h3>
            <p className="text-gray-600 mb-6">
              Report civic issues in your area and track their progress. Upload photos and provide detailed descriptions.
            </p>
            <Link href="/citizen" className="btn btn-primary">
              Citizen Dashboard
            </Link>
          </div>
          
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Municipal Officer</h3>
            <p className="text-gray-600 mb-6">
              View and manage all reported issues. Update status from pending to in-progress to solved.
            </p>
            <Link href="/municipal" className="btn btn-primary">
              Municipal Dashboard
            </Link>
          </div>
          
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin</h3>
            <p className="text-gray-600 mb-6">
              Manage municipal officers and view comprehensive reports across the entire city.
            </p>
            <Link href="/admin" className="btn btn-primary">
              Admin Dashboard
            </Link>
          </div>
        </div>
        
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Demo Instructions</h2>
          <div className="text-left max-w-4xl mx-auto">
            <p className="text-gray-700 mb-4">
              This is a demo application showcasing role-based dashboards for civic issue tracking. 
              The system includes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Citizen Dashboard:</strong> Submit new issues with photos and track your reported issues</li>
              <li><strong>Municipal Dashboard:</strong> View all issues and update their status (Pending → In Progress → Solved)</li>
              <li><strong>Admin Dashboard:</strong> Manage municipal officers and view city-wide issue analytics</li>
              <li><strong>Database:</strong> MongoDB with collections for users and issues</li>
              <li><strong>API Routes:</strong> RESTful endpoints for all CRUD operations</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Note:</strong> This demo uses simulated authentication. In a production environment, 
              you would implement proper JWT authentication and user management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
