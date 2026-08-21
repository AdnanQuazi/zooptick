import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IconWorld, IconCheck, IconChevronDown } from "@tabler/icons-react";
import "./LanguageSwitcher.css";

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang =
    languages.find((l) => l.code === (i18n.language || "en").substring(0, 2)) ||
    languages[0];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="language-switcher-container" ref={dropdownRef}>
      <button
        type="button"
        className="language-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Switch Language"
        title="Switch Language / تغيير اللغة"
      >
        <IconWorld size={18} className="lang-icon" />
        <span className="lang-flag">{currentLang.flag}</span>
        <span className="lang-text">{currentLang.nativeName}</span>
        <IconChevronDown
          size={14}
          className={`lang-chevron ${isOpen ? "open" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="language-dropdown-menu">
          {languages.map((lang) => {
            const isSelected = currentLang.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                className={`language-dropdown-item ${isSelected ? "selected" : ""}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="item-flag">{lang.flag}</span>
                <span className="item-name">{lang.nativeName}</span>
                {isSelected && <IconCheck size={16} className="item-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
