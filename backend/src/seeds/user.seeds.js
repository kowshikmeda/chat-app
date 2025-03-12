import { config } from "dotenv";
import {connectDb} from '../libs/db.js'
import User from '../models/user.models.js'
config()
const seedUsers = [
    {
      fullName: "Alice Johnson",
      password: "123456",
      email: "alice@gmail.com",
      profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      fullName: "Bob Smith",
      password: "123456",
      email: "bob@gmail.com",
      profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      fullName: "Charlie Davis",
      password: "123456",
      email: "charlie@gmail.com",
      profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      fullName: "Diana Wilson",
      password: "123456",
      email: "diana@gmail.com",
      profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      fullName: "Ethan Brown",
      password: "123456",
      email: "ethan@gmail.com",
      profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      fullName: "Fiona Adams",
      password: "123456",
      email: "fiona@gmail.com",
      profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
        fullName: "George Miller",
        password: "123456",
        email: "george@gmail.com",
        profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
      },
      {
        fullName: "Hannah Clark",
        password: "123456",
        email: "hannah@gmail.com",
        profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
      },
      {
        fullName: "Isaac Martinez",
        password: "123456",
        email: "isaac@gmail.com",
        profilePic: "https://randomuser.me/api/portraits/men/8.jpg",
      },
      {
        fullName: "Jessica Lewis",
        password: "123456",
        email: "jessica@gmail.com",
        profilePic: "https://randomuser.me/api/portraits/women/9.jpg",
      }
  ];
  
  
  

const seedDatabase=async()=>{
    try{
        await connectDb();
        await User.deleteMany({});
        await User.insertMany(seedUsers);
        console.log("database seeded successfully")

    }catch(e){
        console.log("error in seeding database",error);

    }
}
seedDatabase();

