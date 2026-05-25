import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import Category from '../models/Category.js';
import Question from '../models/Question.js';
const questionsData = {
  'Web Development': [
    {
      question: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'High Tech Language', 'Hyper Tool Markup', 'None'],
      correctAnswer: 'Hyper Text Markup Language',
      difficulty: 'easy'
    },
    {
      question: 'What is CSS used for?',
      options: ['Styling', 'Database', 'Logic', 'Server'],
      correctAnswer: 'Styling',
      difficulty: 'easy'
    },
    {
      question: 'What is JavaScript?',
      options: ['Programming Language', 'Database', 'OS', 'Browser'],
      correctAnswer: 'Programming Language',
      difficulty: 'easy'
    },
    {
      question: 'What is Node.js used for?',
      options: ['Backend', 'Frontend', 'Design', 'Hosting'],
      correctAnswer: 'Backend',
      difficulty: 'easy'
    },
    {
      question: 'Which tag is used for links in HTML?',
      options: ['<a>', '<p>', '<div>', '<span>'],
      correctAnswer: '<a>',
      difficulty: 'easy'
    },
    {
      question: 'Which company developed React?',
      options: ['Google', 'Facebook', 'Microsoft', 'Amazon'],
      correctAnswer: 'Facebook',
      difficulty: 'medium'
    },
    {
      question: 'What is Git used for?',
      options: ['Version Control', 'Hosting', 'Design', 'Database'],
      correctAnswer: 'Version Control',
      difficulty: 'easy'
    },
    {
      question: 'What does API stand for?',
      options: ['Application Programming Interface', 'App Protocol Interface', 'Advanced Programming Interface', 'None'],
      correctAnswer: 'Application Programming Interface',
      difficulty: 'medium'
    },
    {
      question: 'Which language runs in browser?',
      options: ['Python', 'Java', 'JavaScript', 'C++'],
      correctAnswer: 'JavaScript',
      difficulty: 'easy'
    },
    {
      question: 'What is MongoDB?',
      options: ['Database', 'Language', 'Framework', 'Server'],
      correctAnswer: 'Database',
      difficulty: 'easy'
    }
  ],

  'Mathematics': [
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      difficulty: 'easy'
    },
    {
      question: 'What is the square root of 144?',
      options: ['10', '11', '12', '13'],
      correctAnswer: '12',
      difficulty: 'easy'
    },
    {
      question: 'What is 15% of 200?',
      options: ['20', '25', '30', '35'],
      correctAnswer: '30',
      difficulty: 'medium'
    },
    {
      question: 'What is 10 × 10?',
      options: ['50', '100', '150', '200'],
      correctAnswer: '100',
      difficulty: 'easy'
    },
    {
      question: 'What is π value?',
      options: ['3.12', '3.14', '3.18', '3.20'],
      correctAnswer: '3.14',
      difficulty: 'easy'
    },
    {
      question: 'What is 9 × 9?',
      options: ['72', '81', '90', '99'],
      correctAnswer: '81',
      difficulty: 'easy'
    },
    {
      question: 'What is 50 ÷ 5?',
      options: ['5', '10', '15', '20'],
      correctAnswer: '10',
      difficulty: 'easy'
    },
    {
      question: 'What is 7 + 8?',
      options: ['14', '15', '16', '17'],
      correctAnswer: '15',
      difficulty: 'easy'
    },
    {
      question: 'What is 100 - 25?',
      options: ['50', '60', '75', '80'],
      correctAnswer: '75',
      difficulty: 'easy'
    },
    {
      question: 'What is factorial of 5?',
      options: ['60', '100', '120', '150'],
      correctAnswer: '120',
      difficulty: 'medium'
    }
  ],

  'Science': [
    {
      question: 'What is the chemical formula of water?',
      options: ['H2O', 'CO2', 'O2', 'NaCl'],
      correctAnswer: 'H2O',
      difficulty: 'easy'
    },
    {
      question: 'What is carbon dioxide formula?',
      options: ['CO2', 'O2', 'H2O', 'N2'],
      correctAnswer: 'CO2',
      difficulty: 'easy'
    },
    {
      question: 'Which planet is closest to the sun?',
      options: ['Earth', 'Mars', 'Mercury', 'Venus'],
      correctAnswer: 'Mercury',
      difficulty: 'easy'
    },
    {
      question: 'What gas do humans breathe?',
      options: ['Oxygen', 'Nitrogen', 'CO2', 'Hydrogen'],
      correctAnswer: 'Oxygen',
      difficulty: 'easy'
    },
    {
      question: 'What is boiling point of water?',
      options: ['50°C', '100°C', '150°C', '200°C'],
      correctAnswer: '100°C',
      difficulty: 'easy'
    },
    {
      question: 'What is the sun?',
      options: ['Planet', 'Star', 'Moon', 'Galaxy'],
      correctAnswer: 'Star',
      difficulty: 'easy'
    },
    {
      question: 'What is gravity?',
      options: ['Force', 'Energy', 'Light', 'Sound'],
      correctAnswer: 'Force',
      difficulty: 'medium'
    },
    {
      question: 'Which gas is most in air?',
      options: ['Oxygen', 'Nitrogen', 'CO2', 'Hydrogen'],
      correctAnswer: 'Nitrogen',
      difficulty: 'medium'
    },
    {
      question: 'What is Earth shape?',
      options: ['Flat', 'Round', 'Square', 'Triangle'],
      correctAnswer: 'Round',
      difficulty: 'easy'
    },
    {
      question: 'What is human body temperature?',
      options: ['35°C', '36°C', '37°C', '38°C'],
      correctAnswer: '37°C',
      difficulty: 'easy'
    }
  ],
    'General Knowledge': [
    {
      question: 'What is the capital of Japan?',
      options: ['Seoul', 'Tokyo', 'Beijing', 'Bangkok'],
      correctAnswer: 'Tokyo',
      difficulty: 'easy'
    },
    {
      question: 'Which animal is called Ship of the Desert?',
      options: ['Horse', 'Camel', 'Elephant', 'Lion'],
      correctAnswer: 'Camel',
      difficulty: 'easy'
    },
    {
      question: 'How many continents are there?',
      options: ['5', '6', '7', '8'],
      correctAnswer: '7',
      difficulty: 'easy'
    },
    {
      question: 'What is the largest ocean?',
      options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
      correctAnswer: 'Pacific',
      difficulty: 'easy'
    },
    {
      question: 'Which country has the largest population?',
      options: ['USA', 'India', 'China', 'Russia'],
      correctAnswer: 'China',
      difficulty: 'easy'
    },
    {
      question: 'What is the currency of USA?',
      options: ['Euro', 'Dollar', 'Rupee', 'Yen'],
      correctAnswer: 'Dollar',
      difficulty: 'easy'
    },
    {
      question: 'What color is the sky?',
      options: ['Blue', 'Red', 'Green', 'Yellow'],
      correctAnswer: 'Blue',
      difficulty: 'easy'
    },
    {
      question: 'Which is fastest land animal?',
      options: ['Lion', 'Tiger', 'Cheetah', 'Horse'],
      correctAnswer: 'Cheetah',
      difficulty: 'easy'
    },
    {
      question: 'How many days in a week?',
      options: ['5', '6', '7', '8'],
      correctAnswer: '7',
      difficulty: 'easy'
    },
    {
      question: 'Which is biggest planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 'Jupiter',
      difficulty: 'easy'
    }
  ],

  'Business': [
    {
      question: 'What is business?',
      options: ['Trade', 'Game', 'Study', 'Sport'],
      correctAnswer: 'Trade',
      difficulty: 'easy'
    },
    {
      question: 'What is profit?',
      options: ['Loss', 'Gain', 'Expense', 'Tax'],
      correctAnswer: 'Gain',
      difficulty: 'easy'
    },
    {
      question: 'What is marketing?',
      options: ['Selling', 'Coding', 'Drawing', 'Cooking'],
      correctAnswer: 'Selling',
      difficulty: 'easy'
    },
    {
      question: 'What is investment?',
      options: ['Spending', 'Saving money to earn', 'Borrowing', 'None'],
      correctAnswer: 'Saving money to earn',
      difficulty: 'easy'
    },
    {
      question: 'Who is CEO?',
      options: ['Worker', 'Manager', 'Top leader', 'Clerk'],
      correctAnswer: 'Top leader',
      difficulty: 'easy'
    },
    {
      question: 'What is startup?',
      options: ['New company', 'Old company', 'Shop', 'Office'],
      correctAnswer: 'New company',
      difficulty: 'easy'
    },
    {
      question: 'What is brand?',
      options: ['Name', 'Logo identity', 'Color', 'None'],
      correctAnswer: 'Logo identity',
      difficulty: 'easy'
    },
    {
      question: 'What is sales?',
      options: ['Buying', 'Selling', 'Coding', 'None'],
      correctAnswer: 'Selling',
      difficulty: 'easy'
    },
    {
      question: 'What is expense?',
      options: ['Income', 'Cost', 'Profit', 'None'],
      correctAnswer: 'Cost',
      difficulty: 'easy'
    },
    {
      question: 'What is revenue?',
      options: ['Loss', 'Income', 'Debt', 'None'],
      correctAnswer: 'Income',
      difficulty: 'easy'
    }
  ],

  'Languages': [
    {
      question: 'What is English?',
      options: ['Language', 'Country', 'City', 'Game'],
      correctAnswer: 'Language',
      difficulty: 'easy'
    },
    {
      question: 'Which language is used in Pakistan?',
      options: ['French', 'Urdu', 'Spanish', 'German'],
      correctAnswer: 'Urdu',
      difficulty: 'easy'
    },
    {
      question: 'Which language is used in China?',
      options: ['Hindi', 'Chinese', 'English', 'Arabic'],
      correctAnswer: 'Chinese',
      difficulty: 'easy'
    },
    {
      question: 'Which language is used in Saudi Arabia?',
      options: ['Arabic', 'English', 'Urdu', 'French'],
      correctAnswer: 'Arabic',
      difficulty: 'easy'
    },
    {
      question: 'What is grammar?',
      options: ['Rules of language', 'Game', 'Food', 'None'],
      correctAnswer: 'Rules of language',
      difficulty: 'easy'
    },
    {
      question: 'What is noun?',
      options: ['Person place thing', 'Action', 'Color', 'None'],
      correctAnswer: 'Person place thing',
      difficulty: 'easy'
    },
    {
      question: 'What is verb?',
      options: ['Action word', 'Name', 'Color', 'None'],
      correctAnswer: 'Action word',
      difficulty: 'easy'
    },
    {
      question: 'What is sentence?',
      options: ['Group of words', 'Letter', 'Number', 'None'],
      correctAnswer: 'Group of words',
      difficulty: 'easy'
    },
    {
      question: 'What is alphabet?',
      options: ['Letters', 'Numbers', 'Symbols', 'None'],
      correctAnswer: 'Letters',
      difficulty: 'easy'
    },
    {
      question: 'What is translation?',
      options: ['Change language', 'Write code', 'Draw', 'None'],
      correctAnswer: 'Change language',
      difficulty: 'easy'
    }
  ],
    'Health & Wellness': [
    {
      question: 'What is a healthy diet?',
      options: ['Balanced food', 'Junk food', 'Fast food', 'None'],
      correctAnswer: 'Balanced food',
      difficulty: 'easy'
    },
    {
      question: 'How many hours should we sleep?',
      options: ['4', '6', '8', '10'],
      correctAnswer: '8',
      difficulty: 'easy'
    },
    {
      question: 'What is exercise?',
      options: ['Physical activity', 'Sleeping', 'Eating', 'None'],
      correctAnswer: 'Physical activity',
      difficulty: 'easy'
    },
    {
      question: 'Which vitamin comes from sunlight?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'D',
      difficulty: 'easy'
    },
    {
      question: 'What is meditation?',
      options: ['Relax mind', 'Run', 'Eat', 'None'],
      correctAnswer: 'Relax mind',
      difficulty: 'easy'
    },
    {
      question: 'What is water important for?',
      options: ['Hydration', 'Color', 'Taste', 'None'],
      correctAnswer: 'Hydration',
      difficulty: 'easy'
    },
    {
      question: 'What is stress?',
      options: ['Mental pressure', 'Food', 'Game', 'None'],
      correctAnswer: 'Mental pressure',
      difficulty: 'easy'
    },
    {
      question: 'What is hygiene?',
      options: ['Cleanliness', 'Food', 'Exercise', 'None'],
      correctAnswer: 'Cleanliness',
      difficulty: 'easy'
    },
    {
      question: 'What is protein?',
      options: ['Nutrient', 'Vitamin', 'Mineral', 'None'],
      correctAnswer: 'Nutrient',
      difficulty: 'easy'
    },
    {
      question: 'What is fitness?',
      options: ['Healthy body', 'Weak body', 'Illness', 'None'],
      correctAnswer: 'Healthy body',
      difficulty: 'easy'
    }
  ],

  'Photography': [
    {
      question: 'What is a camera?',
      options: ['Device to capture images', 'Phone', 'TV', 'None'],
      correctAnswer: 'Device to capture images',
      difficulty: 'easy'
    },
    {
      question: 'What is lens?',
      options: ['Glass for focus', 'Battery', 'Screen', 'None'],
      correctAnswer: 'Glass for focus',
      difficulty: 'easy'
    },
    {
      question: 'What is ISO?',
      options: ['Light sensitivity', 'Zoom', 'Focus', 'None'],
      correctAnswer: 'Light sensitivity',
      difficulty: 'easy'
    },
    {
      question: 'What is shutter speed?',
      options: ['Time of light entry', 'Color', 'Zoom', 'None'],
      correctAnswer: 'Time of light entry',
      difficulty: 'easy'
    },
    {
      question: 'What is aperture?',
      options: ['Lens opening', 'Battery', 'Sound', 'None'],
      correctAnswer: 'Lens opening',
      difficulty: 'easy'
    },
    {
      question: 'What is portrait mode?',
      options: ['Blur background', 'Zoom', 'Night mode', 'None'],
      correctAnswer: 'Blur background',
      difficulty: 'easy'
    },
    {
      question: 'What is focus?',
      options: ['Sharp image', 'Blur image', 'Color', 'None'],
      correctAnswer: 'Sharp image',
      difficulty: 'easy'
    },
    {
      question: 'What is zoom?',
      options: ['Magnify image', 'Reduce', 'Blur', 'None'],
      correctAnswer: 'Magnify image',
      difficulty: 'easy'
    },
    {
      question: 'What is tripod?',
      options: ['Stand', 'Lens', 'Camera', 'None'],
      correctAnswer: 'Stand',
      difficulty: 'easy'
    },
    {
      question: 'What is editing?',
      options: ['Modify image', 'Capture', 'Delete', 'None'],
      correctAnswer: 'Modify image',
      difficulty: 'easy'
    }
  ],

  'Artificial Intelligence': [
    {
      question: 'What is AI?',
      options: ['Smart machines', 'Game', 'Food', 'None'],
      correctAnswer: 'Smart machines',
      difficulty: 'easy'
    },
    {
      question: 'What is machine learning?',
      options: ['Learning from data', 'Coding', 'Drawing', 'None'],
      correctAnswer: 'Learning from data',
      difficulty: 'easy'
    },
    {
      question: 'What is chatbot?',
      options: ['Talking software', 'Game', 'Device', 'None'],
      correctAnswer: 'Talking software',
      difficulty: 'easy'
    },
    {
      question: 'What is data?',
      options: ['Information', 'Food', 'Game', 'None'],
      correctAnswer: 'Information',
      difficulty: 'easy'
    },
    {
      question: 'What is algorithm?',
      options: ['Steps to solve problem', 'Food', 'Game', 'None'],
      correctAnswer: 'Steps to solve problem',
      difficulty: 'easy'
    },
    {
      question: 'What is automation?',
      options: ['Work by machines', 'Manual work', 'Game', 'None'],
      correctAnswer: 'Work by machines',
      difficulty: 'easy'
    },
    {
      question: 'What is robot?',
      options: ['Machine', 'Human', 'Animal', 'None'],
      correctAnswer: 'Machine',
      difficulty: 'easy'
    },
    {
      question: 'What is neural network?',
      options: ['Brain-like system', 'Game', 'Food', 'None'],
      correctAnswer: 'Brain-like system',
      difficulty: 'medium'
    },
    {
      question: 'What is deep learning?',
      options: ['Advanced AI', 'Game', 'Food', 'None'],
      correctAnswer: 'Advanced AI',
      difficulty: 'medium'
    },
    {
      question: 'What is training data?',
      options: ['Data to teach AI', 'Game', 'Food', 'None'],
      correctAnswer: 'Data to teach AI',
      difficulty: 'easy'
    }
  ],

  'Literature': [
    {
      question: 'What is a novel?',
      options: ['Long story', 'Poem', 'Song', 'None'],
      correctAnswer: 'Long story',
      difficulty: 'easy'
    },
    {
      question: 'What is poetry?',
      options: ['Creative writing', 'Math', 'Game', 'None'],
      correctAnswer: 'Creative writing',
      difficulty: 'easy'
    },
    {
      question: 'Who is a writer?',
      options: ['Person who writes', 'Reader', 'Singer', 'None'],
      correctAnswer: 'Person who writes',
      difficulty: 'easy'
    },
    {
      question: 'What is drama?',
      options: ['Play', 'Game', 'Food', 'None'],
      correctAnswer: 'Play',
      difficulty: 'easy'
    },
    {
      question: 'What is story?',
      options: ['Narrative', 'Math', 'Game', 'None'],
      correctAnswer: 'Narrative',
      difficulty: 'easy'
    },
    {
      question: 'What is fiction?',
      options: ['Imaginary', 'Real', 'Math', 'None'],
      correctAnswer: 'Imaginary',
      difficulty: 'easy'
    },
    {
      question: 'What is non-fiction?',
      options: ['Real facts', 'Story', 'Game', 'None'],
      correctAnswer: 'Real facts',
      difficulty: 'easy'
    },
    {
      question: 'What is poem?',
      options: ['Verse writing', 'Math', 'Game', 'None'],
      correctAnswer: 'Verse writing',
      difficulty: 'easy'
    },
    {
      question: 'What is author?',
      options: ['Writer', 'Reader', 'Teacher', 'None'],
      correctAnswer: 'Writer',
      difficulty: 'easy'
    },
    {
      question: 'What is book?',
      options: ['Collection of pages', 'Game', 'Food', 'None'],
      correctAnswer: 'Collection of pages',
      difficulty: 'easy'
    }
  ],

  'Design': [
    {
      question: 'What is design?',
      options: ['Create visuals', 'Coding', 'Game', 'None'],
      correctAnswer: 'Create visuals',
      difficulty: 'easy'
    },
    {
      question: 'What is color?',
      options: ['Visual element', 'Sound', 'Taste', 'None'],
      correctAnswer: 'Visual element',
      difficulty: 'easy'
    },
    {
      question: 'What is font?',
      options: ['Text style', 'Color', 'Image', 'None'],
      correctAnswer: 'Text style',
      difficulty: 'easy'
    },
    {
      question: 'What is layout?',
      options: ['Arrangement', 'Color', 'Sound', 'None'],
      correctAnswer: 'Arrangement',
      difficulty: 'easy'
    },
    {
      question: 'What is logo?',
      options: ['Brand symbol', 'Text', 'Image', 'None'],
      correctAnswer: 'Brand symbol',
      difficulty: 'easy'
    },
    {
      question: 'What is UI?',
      options: ['User interface', 'Code', 'Game', 'None'],
      correctAnswer: 'User interface',
      difficulty: 'easy'
    },
    {
      question: 'What is UX?',
      options: ['User experience', 'Code', 'Game', 'None'],
      correctAnswer: 'User experience',
      difficulty: 'easy'
    },
    {
      question: 'What is graphic?',
      options: ['Visual image', 'Sound', 'Text', 'None'],
      correctAnswer: 'Visual image',
      difficulty: 'easy'
    },
    {
      question: 'What is creativity?',
      options: ['New ideas', 'Copy', 'Game', 'None'],
      correctAnswer: 'New ideas',
      difficulty: 'easy'
    },
    {
      question: 'What is tool?',
      options: ['Software', 'Food', 'Game', 'None'],
      correctAnswer: 'Software',
      difficulty: 'easy'
    }
  ]


};
async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const categories = await Category.find({});
    const categoryMap = {};

    categories.forEach(cat => {
      categoryMap[cat.title] = cat._id;
    });

    let totalInserted = 0;

    for (const [categoryName, questions] of Object.entries(questionsData)) {
      const categoryId = categoryMap[categoryName];

      if (!categoryId) {
        console.log(`Category ${categoryName} not found`);
        continue;
      }

      for (const q of questions) {
        await Question.create({
          ...q,
          categoryId
        });
        totalInserted++;
      }
    }

    console.log(`✅ Inserted: ${totalInserted} questions`);

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('Done');
  }
}

seedQuestions();