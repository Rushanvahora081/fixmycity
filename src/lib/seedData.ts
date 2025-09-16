import { connectToDatabase } from './mongodb';
import { User } from '@/models/User';
import { Issue } from '@/models/Issue';
import { ObjectId } from 'mongodb';

export async function seedDatabase() {
  try {
    const { db } = await connectToDatabase();
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('issues').deleteMany({});
    
    // Create users
    const users: Omit<User, '_id'>[] = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'citizen',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@municipal.gov',
        role: 'municipal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin User',
        email: 'admin@fixmycity.gov',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@municipal.gov',
        role: 'municipal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        role: 'citizen',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const userResult = await db.collection('users').insertMany(users);
    const userIds = Object.values(userResult.insertedIds);
    
    // Create issues
    const issues: Omit<Issue, '_id'>[] = [
      {
        title: 'Pothole on Main Street',
        description: 'Large pothole causing damage to vehicles. Located near the intersection of Main Street and Oak Avenue.',
        location: 'Main Street & Oak Avenue',
        status: 'pending',
        createdBy: userIds[0], // John Doe
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        photoUrl: 'https://via.placeholder.com/400x300?text=Pothole+Photo'
      },
      {
        title: 'Broken Street Light',
        description: 'Street light has been flickering and completely went out last night. Safety concern for pedestrians.',
        location: '123 Elm Street',
        status: 'in_progress',
        createdBy: userIds[0], // John Doe
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        photoUrl: 'https://via.placeholder.com/400x300?text=Street+Light+Photo'
      },
      {
        title: 'Garbage Collection Missed',
        description: 'Garbage was not collected on our street this week. Bins are overflowing.',
        location: '456 Pine Street',
        status: 'solved',
        createdBy: userIds[4], // Sarah Wilson
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        photoUrl: 'https://via.placeholder.com/400x300?text=Garbage+Photo'
      },
      {
        title: 'Damaged Sidewalk',
        description: 'Sidewalk has large cracks and uneven surface. Difficult for wheelchair users.',
        location: '789 Maple Avenue',
        status: 'pending',
        createdBy: userIds[4], // Sarah Wilson
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        photoUrl: 'https://via.placeholder.com/400x300?text=Sidewalk+Photo'
      },
      {
        title: 'Traffic Signal Malfunction',
        description: 'Traffic light at busy intersection is not working properly. Cars are running red lights.',
        location: 'Central Avenue & 5th Street',
        status: 'in_progress',
        createdBy: userIds[0], // John Doe
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        photoUrl: 'https://via.placeholder.com/400x300?text=Traffic+Signal+Photo'
      },
      {
        title: 'Water Leak in Park',
        description: 'Water fountain in Central Park has been leaking for days. Water is pooling around the area.',
        location: 'Central Park - Water Fountain',
        status: 'pending',
        createdBy: userIds[4], // Sarah Wilson
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        photoUrl: 'https://via.placeholder.com/400x300?text=Water+Leak+Photo'
      }
    ];
    
    await db.collection('issues').insertMany(issues);
    
    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users and ${issues.length} issues`);
    
    return {
      users: users.length,
      issues: issues.length
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
