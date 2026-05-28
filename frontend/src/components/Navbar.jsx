import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, Globe } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setLanguageMenuOpen(false);
  };

  const currentLanguage = i18n.language === 'ti' ? 'Tigrigna' : 'English';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            {t("app.title")}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={handleHomeClick}
              className="text-gray-700 hover:text-blue-600 font-semibold bg-none border-none cursor-pointer"
            >
              {t("nav.home")}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-semibold"
                >
                  {t("nav.dashboard")}
                </Link>
                <Link
                  to="/courses"
                  className="text-gray-700 hover:text-blue-600 font-semibold"
                >
                  {t("nav.courses")}
                </Link>

                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-blue-600 font-semibold"
                  >
                    {t("nav.admin")}
                  </Link>
                )}

                <div className="flex items-center gap-4 border-l pl-6">
                  <span className="text-gray-700">{t("nav.hello")}, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("nav.logout")}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="btn-secondary">
                  {t("nav.login")}
                </Link>
                <Link to="/register" className="btn-primary">
                  {t("nav.register")}
                </Link>
              </div>
            )}

            {/* Language Switcher */}
            <div className="relative border-l pl-6">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold"
              >
                <Globe className="w-4 h-4" />
                {currentLanguage}
              </button>
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`block w-full text-left px-4 py-2 ${
                      i18n.language === 'en' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ti')}
                    className={`block w-full text-left px-4 py-2 ${
                      i18n.language === 'ti' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ትግርኛ (Tigrigna)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t space-y-2">
            <button
              onClick={(e) => {
                handleHomeClick(e);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded bg-none border-none cursor-pointer"
            >
              {t("nav.home")}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.dashboard")}
                </Link>
                <Link
                  to="/courses"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.courses")}
                </Link>

                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.admin")}
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded font-semibold"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.register")}
                </Link>
              </>
            )}

            {/* Mobile Language Switcher */}
            <div className="border-t pt-2 mt-2">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded font-semibold w-full"
              >
                <Globe className="w-4 h-4" />
                {t("nav.language")}: {currentLanguage}
              </button>
              {languageMenuOpen && (
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`block w-full text-left px-4 py-2 rounded ${
                      i18n.language === 'en' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ti')}
                    className={`block w-full text-left px-4 py-2 rounded ${
                      i18n.language === 'ti' ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ትግርኛ (Tigrigna)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
