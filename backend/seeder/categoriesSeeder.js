import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import Category from "../models/Category.js";

const categories = [
  {
    title: "Web Development",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and web technologies.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "Mathematics",
    description: "Practice arithmetic, percentages, algebra and basic math concepts.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "Science",
    description: "Test your knowledge of physics, chemistry, biology and nature.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "General Knowledge",
    description: "Explore common facts about the world, countries, animals and more.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "Business",
    description: "Learn business, marketing, sales, profit and startup basics.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "Languages",
    description: "Practice languages, grammar, vocabulary and communication basics.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "Health & Wellness",
    description: "Test knowledge about fitness, diet, hygiene, stress and wellness.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "Photography",
    description: "Learn camera, lens, focus, ISO, aperture and photography basics.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "Artificial Intelligence",
    description: "Explore AI, machine learning, chatbots, data and algorithms.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "Literature",
    description: "Test your knowledge of stories, poems, fiction and books.",
    image: "https://placehold.co/300x200.png"
  },
  {
    title: "Design",
    description: "Learn design, colors, fonts, layout, UI, UX and creativity.",
    image: "https://placehold.co/300x200.png"
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Category.deleteMany({});
    await Category.insertMany(categories);

    console.log("✅ Categories Inserted");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seedCategories();