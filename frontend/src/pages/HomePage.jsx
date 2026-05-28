import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Zap, ArrowRight, Star } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  const courses = [
    {
      id: 1,
      title: t("courses.course1.title"),
      description: t("courses.course1.description"),
      icon: "💻",
      color: "from-blue-500 to-blue-600",
      level: "Beginner",
    },
    {
      id: 2,
      title: t("courses.course2.title"),
      description: t("courses.course2.description"),
      icon: "🐍",
      color: "from-green-500 to-green-600",
      level: "Intermediate",
    },
    {
      id: 3,
      title: t("courses.course3.title"),
      description: t("courses.course3.description"),
      icon: "🤖",
      color: "from-purple-500 to-purple-600",
      level: "Intermediate",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-24 md:py-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-white/20 rounded-full backdrop-blur-md">
                <span className="text-sm font-semibold">Welcome to DesOnline</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                {t("hero.subtitle")}
              </p>
              <p className="text-lg text-blue-50 mb-8 leading-relaxed">
                {t("hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="btn-primary px-8 py-4 font-semibold text-lg rounded-lg hover:shadow-lg transform hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                    >
                      {t("hero.dashboard")}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="btn-secondary px-8 py-4 font-semibold text-lg rounded-lg hover:shadow-lg transform hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                      >
                        {t("hero.adminDashboard")}
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary px-8 py-4 font-semibold text-lg rounded-lg hover:shadow-lg transform hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                    >
                      {t("hero.getStarted")}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-4 font-semibold text-lg bg-white text-blue-600 rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                    >
                      {t("hero.signIn")}
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-3xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl h-96 flex items-center justify-center shadow-2xl">
                <BookOpen className="w-48 h-48 text-white opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">3</div>
              <p className="text-gray-700 font-semibold">{t("stats.students")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">4</div>
              <p className="text-gray-700 font-semibold">{t("stats.courses")}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">1</div>
              <p className="text-gray-700 font-semibold">{t("stats.instructors")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("features.whyChooseUs")}
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by learners worldwide for quality education
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("features.expertInstructors.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.expertInstructors.desc")}
              </p>
            </div>
            <div className="card p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("features.communitySupport.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.communitySupport.desc")}
              </p>
            </div>
            <div className="card p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("features.selfPaced.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.selfPaced.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("courses.ourCourses")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("courses.learnToday")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {courses.map((course) => (
              <div
                key={course.id}
                className="card overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${course.color} h-40 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
                  </div>
                  <span className="text-7xl relative z-10">{course.icon}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {course.level}
                    </span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              {t("courses.browseCourses")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t("cta.subtitle")}
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary px-8 py-4 font-semibold text-lg rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                {t("cta.signUp")}
              </Link>
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                {t("cta.learnMore")}
              </button>
            </div>
          )}
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
  );
};

export default HomePage;
