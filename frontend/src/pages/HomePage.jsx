
import Navbar from '../components/common/Navbar'


const HomePage = () => {
  return (
    <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to QuizMaster Pro</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Test your knowledge with our interactive quizzes
          </p>
          <button className="btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  )
}

export default HomePage;