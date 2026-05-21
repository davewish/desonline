import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Users, Zap } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const HomePage = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard')
    }
  }, [isAuthenticated, user, navigate])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Learn Anything, Anytime, Anywhere
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of students and unlock your potential with our
                comprehensive online learning platform.
              </p>
              <div className="flex gap-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="btn-primary px-8 py-4 font-semibold text-lg"
                    >
                      Go to Dashboard
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="btn-secondary px-8 py-4 font-semibold text-lg"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary px-8 py-4 font-semibold text-lg"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="btn px-8 py-4 font-semibold text-lg bg-white text-blue-600 hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="bg-blue-500 rounded-lg h-80 flex items-center justify-center">
              <BookOpen className="w-40 h-40 text-blue-100" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8">
              <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Expert Instructors
              </h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of experience in
                their fields.
              </p>
            </div>
            <div className="card p-8">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Community Support
              </h3>
              <p className="text-gray-600">
                Join a vibrant community of learners and get help when you need
                it.
              </p>
            </div>
            <div className="card p-8">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Self-Paced Learning
              </h3>
              <p className="text-gray-600">
                Learn at your own pace with lifetime access to all course
                materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of learners today and transform your future.
          </p>
          <Link
            to={isAuthenticated ? '/courses' : '/register'}
            className="btn-primary px-8 py-4 font-semibold text-lg inline-block"
          >
            {isAuthenticated ? 'Browse Courses' : 'Sign Up Now'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">DesOnline</h3>
              <p className="text-sm">
                Your gateway to learning anything you want.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 DesOnline. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
