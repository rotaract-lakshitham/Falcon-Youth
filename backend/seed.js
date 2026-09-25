require('dotenv').config();
const mongoose = require('mongoose');

const Event = require('./models/Event.js');
const Project = require('./models/Project.js');
const CouncilMember = require('./models/CouncilMember.js');
const Newsletter = require('./models/Newsletter.js');
const Business = require('./models/Business.js');
// const Stats = require('./models/Stats.js');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Event.deleteMany({});
    await Project.deleteMany({});
    await CouncilMember.deleteMany({});
    await Newsletter.deleteMany({});
    await Business.deleteMany({});
    // await Stats.deleteMany({});

    // Seed Stats (Commented out)
    /*
    await Stats.create({
      activeMembers: 150,
      projectsCompleted: 85,
      livesImpacted: 12000,
      volunteerHours: 5400
    });
    */

    // Seed Events
    await Event.create([
      { title: 'Blood Donation Drive', date: new Date('2026-10-15'), time: '10:00 AM', location: 'City Hospital', category: 'Community Service', description: 'Annual blood donation drive.', status: 'upcoming' },
      { title: 'Leadership Workshop', date: new Date('2026-11-05'), time: '02:00 PM', location: 'Rotary Hall', category: 'Professional Development', description: 'Guest speaker session on leadership.', status: 'upcoming' },
      { title: 'Tree Plantation', date: new Date('2026-09-10'), time: '08:00 AM', location: 'Central Park', category: 'Community Service', description: 'Planted 500 saplings.', status: 'past' },
      { title: 'Cultural Night', date: new Date('2026-08-25'), time: '06:00 PM', location: 'Club Auditorium', category: 'Club Service', description: 'A night of music and dance.', status: 'past' }
    ]);

    // Seed Projects
    await Project.create([
      { title: 'Project Vidya', avenue: 'Community Service', status: 'Ongoing', date: 'August 2026', location: 'Local Schools', description: 'Providing free stationary to underprivileged students.' },
      { title: 'Global Connect', avenue: 'International Service', status: 'Completed', date: 'July 2026', location: 'Virtual', description: 'A joint meeting with Rotaract Club of Tokyo.' },
      { title: 'Career Catalyst', avenue: 'Professional Development', status: 'Upcoming', date: 'December 2026', location: 'Tech Park', description: 'A massive networking event for young professionals.' }
    ]);

    // Seed Council
    await CouncilMember.create([
      { name: 'Rahul Sharma', designation: 'President', rotaryYear: '2026-27', bio: 'Leading the club with a vision for sustainable community impact.', socials: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', email: 'rahul@example.com' } },
      { name: 'Priya Patel', designation: 'Secretary', rotaryYear: '2026-27', bio: 'Managing club operations and ensuring seamless communication.', socials: { linkedin: 'https://linkedin.com', email: 'priya@example.com' } },
      { name: 'Amit Singh', designation: 'Treasurer', rotaryYear: '2026-27', bio: 'Keeping our finances transparent and organized.', socials: { instagram: 'https://instagram.com' } },
      { name: 'Sneha Reddy', designation: 'Vice President', rotaryYear: '2026-27', bio: 'Supporting the president and leading club committees.', socials: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' } }
    ]);

    // Seed Directory
    await Business.create([
      { businessName: 'Falcon Tech Solutions', category: 'IT Services', ownerName: 'Vikram Gupta', contactNumber: '9876543210', location: 'Bengaluru', email: 'info@falcontech.com', description: 'Providing top-notch web development services.' },
      { businessName: 'Green Eats', category: 'Food & Beverage', ownerName: 'Anjali Desai', contactNumber: '9123456789', location: 'Bengaluru', email: 'hello@greeneats.com', description: 'Healthy and organic meal deliveries.' },
      { businessName: 'Pixel Perfect Studios', category: 'Photography', ownerName: 'Rohan Mehta', contactNumber: '9988776655', location: 'Bengaluru', email: 'rohan@pixelperfect.com', description: 'Professional event and portrait photography.' }
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
