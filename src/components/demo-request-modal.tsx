"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Check, AlertCircle } from "lucide-react";
import { FlagIcon } from "./flag-icon";
import { countries } from "@/data/countries";

// Confetti animation function
function triggerConfetti() {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
  }> = [];

  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];

  // Create particles
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 5 + 5,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
    });
  }

  let animationId: number;

  function animate() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.life -= 0.01;

      if (p.life <= 0) {
        particles.splice(index, 1);
      } else {
        ctx!.globalAlpha = p.life;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  }

  animate();
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  country: string;
  phone: string;
  companyName: string;
  companySize: string;
  interests: string[];
  message: string;
  newsletter: boolean;
  privacyConsent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoRequestModal({ isOpen, onClose }: DemoRequestModalProps) {
  const t = useTranslations("demoForm");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    country: "TR",
    phone: "",
    companyName: "",
    companySize: "",
    interests: [],
    message: "",
    newsletter: false,
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const interestOptions = [
    { key: "workManagement", label: t("interests_options.workManagement") },
    { key: "salesCRM", label: t("interests_options.salesCRM") },
    { key: "productManagement", label: t("interests_options.productManagement") },
    { key: "softwareDevelopment", label: t("interests_options.softwareDevelopment") },
    { key: "productSoftwareDevelopment", label: t("interests_options.productSoftwareDevelopment") },
    { key: "emailMarketing", label: t("interests_options.emailMarketing") },
    { key: "agencyFactory", label: t("interests_options.agencyFactory") },
    { key: "ticketingServiceManagement", label: t("interests_options.ticketingServiceManagement") },
    { key: "other", label: t("interests_options.other") },
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Remove spaces and check if it has at least 7 digits
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 7;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    if (value) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(null);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
    if (formatted) {
      setPhoneValid(validatePhone(formatted));
    } else {
      setPhoneValid(null);
    }
  };

  const handleInterestChange = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(key)
        ? prev.interests.filter((i) => i !== key)
        : [...prev.interests, key],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Lock body and html scroll
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
      
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.documentElement.style.overflow = "unset";
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email";
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Required";
    if (!formData.country) newErrors.country = "Required";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    else if (!validatePhone(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.companyName.trim()) newErrors.companyName = "Required";
    if (!formData.companySize) newErrors.companySize = "Required";
    if (!formData.privacyConsent) newErrors.privacyConsent = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const backendBaseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const apiUrl = `${backendBaseUrl.replace(/\/$/, "")}/api/demo-request`;

    try {
      console.log("🚀 Starting form submission...");
      console.log("📍 API URL:", apiUrl);

      const payload = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        company: formData.companyName,
        jobTitle: formData.jobTitle,
        message: formData.message,
        country: formData.country,
        companySize: formData.companySize,
        interests: formData.interests,
        acceptedKvkk: formData.privacyConsent,
        acceptedMarketing: formData.newsletter,
      };

      console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response received");
      console.log("📥 Response status:", response.status);
      console.log("📥 Response ok:", response.ok);

      const responseData = await response.json();
      console.log("📥 Response data:", JSON.stringify(responseData, null, 2));

      if (response.ok && responseData.success) {
        console.log("✅ Success! Demo request saved to MongoDB");
        triggerConfetti();
        setSubmitSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          jobTitle: "",
          country: "TR",
          phone: "",
          companyName: "",
          companySize: "",
          interests: [],
          message: "",
          newsletter: false,
          privacyConsent: false,
        });
        setErrors({});

        setTimeout(() => {
          setSubmitSuccess(false);
          onClose();
        }, 2000);
      } else {
        // Backend returned an error
        const errorMessage = responseData?.message || responseData?.error || `Server error: ${response.status}`;
        console.error("❌ Backend error:", errorMessage);
        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      console.error("❌ Network/Fetch error:", errorMessage);
      console.error("❌ Full error object:", error);
      
      // More descriptive error message for user
      let userMessage = "Failed to connect to server";
      if (errorMessage.includes("Failed to fetch")) {
        userMessage = `Cannot reach backend at ${backendBaseUrl}. Make sure the backend server is running.`;
      } else if (errorMessage.includes("CORS")) {
        userMessage = "CORS error: Backend rejected the request";
      } else if (errorMessage.includes("TypeError")) {
        userMessage = "Network error: Please check your internet connection";
      }
      
      setErrors({ submit: userMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedCountry = countries.find((c) => c.code === formData.country);

  return (
    <>
      {/* Backdrop with glow effect - covers entire viewport */}
      <div
        className="fixed inset-0 z-40 bg-black/60 transition-opacity duration-300"
        onClick={onClose}
      >
        {/* Ambient glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Modal - centered container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Glassmorphism container - fixed height, flex layout */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
            {/* Header - Fixed at top */}
            <div className="flex-shrink-0 px-6 py-6 border-b border-slate-700/30 bg-gradient-to-r from-slate-900/90 to-slate-800/90">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    {t("title")}
                  </h2>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                    {t("description")}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content - Scrollable area */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(100, 116, 139, 0.6) rgba(30, 41, 59, 0.3)",
              }}
            >
              <style>{`
                /* Webkit scrollbar styling */
                div::-webkit-scrollbar {
                  width: 8px;
                }
                
                div::-webkit-scrollbar-track {
                  background: rgba(30, 41, 59, 0.3);
                  border-radius: 4px;
                }
                
                div::-webkit-scrollbar-thumb {
                  background: rgba(100, 116, 139, 0.6);
                  border-radius: 4px;
                }
                
                div::-webkit-scrollbar-thumb:hover {
                  background: rgba(100, 116, 139, 0.8);
                }
                
                /* Remove webkit autofill background */
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus,
                input:-webkit-autofill:active {
                  -webkit-box-shadow: 0 0 0 1000px rgba(30, 41, 59, 1) inset !important;
                  -webkit-text-fill-color: #e2e8f0 !important;
                  caret-color: #e2e8f0 !important;
                }
                
                input:-webkit-autofill::first-line {
                  font-size: 16px;
                }
                
                /* Select styling */
                select {
                  color-scheme: dark;
                }
                
                select option {
                  background-color: #1e293b;
                  color: #e2e8f0;
                }
              `}</style>

              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t("successTitle")}
                  </h3>
                  <p className="text-slate-300 text-center mb-2">
                    {t("successMessage")}
                  </p>
                  <p className="text-slate-400 text-sm text-center">
                    {t("successSubtext")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Section 1: Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">1</span>
                      {t("personalInfo")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label={t("firstName")}
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        placeholder="John"
                        error={errors.firstName}
                        required
                      />

                      <FormInput
                        label={t("lastName")}
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Doe"
                        error={errors.lastName}
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          {t("workEmail")} <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={handleEmailChange}
                            className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                              errors.email
                                ? "border-red-500/50"
                                : "border-slate-700 hover:border-slate-600"
                            }`}
                            placeholder="john@company.com"
                          />
                          {emailValid === true && (
                            <Check className="absolute right-3 top-3 w-5 h-5 text-emerald-400" />
                          )}
                          {emailValid === false && (
                            <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-400" />
                          )}
                        </div>
                        {errors.email && (
                          <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>

                      <FormInput
                        label={t("jobTitle")}
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                        placeholder="CTO"
                        error={errors.jobTitle}
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          {t("country")} <span className="text-red-400">*</span>
                        </label>
                        <div ref={dropdownRef} className="relative">
                          <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-slate-100 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                              errors.country
                                ? "border-red-500/50"
                                : "border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {selectedCountry && (
                                <div className="w-5 h-3 flex-shrink-0">
                                  <FlagIcon
                                    countryCode={selectedCountry.code}
                                    className="w-full h-full"
                                  />
                                </div>
                              )}
                              <span className="truncate">{selectedCountry?.name}</span>
                            </div>
                            <svg
                              className={`w-4 h-4 transition-transform text-slate-400 flex-shrink-0 ml-2 ${
                                showDropdown ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                              />
                            </svg>
                          </button>

                          {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur border border-slate-700/50 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                              {countries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      country: country.code,
                                    });
                                    setShowDropdown(false);
                                  }}
                                  className="w-full px-4 py-2.5 text-left text-slate-200 hover:bg-slate-700/50 active:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-700/20 last:border-b-0"
                                >
                                  <div className="w-5 h-3 flex-shrink-0">
                                    <FlagIcon
                                      countryCode={country.code}
                                      className="w-full h-full"
                                    />
                                  </div>
                                  <span className="flex-1 truncate">{country.name}</span>
                                  <span className="text-slate-400 text-xs flex-shrink-0 ml-2">
                                    {country.dialCode}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.country && (
                          <p className="text-red-400 text-xs mt-1">{errors.country}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          {t("phoneNumber")} <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2">
                          <div className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 text-sm flex items-center whitespace-nowrap">
                            {selectedCountry?.dialCode}
                          </div>
                          <div className="flex-1 relative">
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={handlePhoneChange}
                              className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10 ${
                                errors.phone
                                  ? "border-red-500/50"
                                  : "border-slate-700 hover:border-slate-600"
                              }`}
                              placeholder="555 000 0000"
                            />
                            {phoneValid === true && (
                              <Check className="absolute right-3 top-3 w-5 h-5 text-emerald-400" />
                            )}
                            {phoneValid === false && (
                              <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-400" />
                            )}
                          </div>
                        </div>
                        {errors.phone && (
                          <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Company Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">2</span>
                      {t("companyDetails")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label={t("companyName")}
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                        placeholder="Acme Inc."
                        error={errors.companyName}
                        required
                      />

                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          {t("companySize")} <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={formData.companySize}
                          onChange={(e) =>
                            setFormData({ ...formData, companySize: e.target.value })
                          }
                          className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.companySize
                              ? "border-red-500/50"
                              : "border-slate-700 hover:border-slate-600"
                          }`}
                        >
                          <option value="">{t("selectSize")}</option>
                          <option value="1-10">{t("companySizes.1-10")}</option>
                          <option value="11-50">{t("companySizes.11-50")}</option>
                          <option value="51-200">{t("companySizes.51-200")}</option>
                          <option value="201-500">{t("companySizes.201-500")}</option>
                          <option value="500+">{t("companySizes.500+")}</option>
                        </select>
                        {errors.companySize && (
                          <p className="text-red-400 text-xs mt-1">{errors.companySize}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Interests */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">3</span>
                      {t("interests")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {interestOptions.map((option) => (
                        <label
                          key={option.key}
                          className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-800/30 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(option.key)}
                            onChange={() => handleInterestChange(option.key)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800/50 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Tell More */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">4</span>
                      {t("tellMore")}
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        {t("tellMoreQuestion")}
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-600 resize-none"
                        rows={4}
                        placeholder={t("tellMorePlaceholder")}
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/30">
                    <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.newsletter}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newsletter: e.target.checked,
                          })
                        }
                        className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800/50 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                        {t("newsletter")}
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.privacyConsent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            privacyConsent: e.target.checked,
                          })
                        }
                        className={`mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800/50 text-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0 ${
                          errors.privacyConsent ? "border-red-500" : ""
                        }`}
                      />
                      <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                        {t("privacy")}{" "}
                        <a
                          href="https://www.kafein.com.tr/media/_h/kafeinweb/Kafein_Ki%C5%9Fisel_Verilerin_Korunmas%C4%B1_ve_%C4%B0slenmesi%20Politikas%C4%B1_(31.07.2024).pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          {t("clarificationText")}
                        </a>
                      </span>
                    </label>

                    {errors.privacyConsent && (
                      <p className="text-red-400 text-xs">{errors.privacyConsent}</p>
                    )}
                  </div>

                  {/* reCAPTCHA Notice */}
                  <div className="pt-4 border-t border-slate-700/30">
                    <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-3">
                      <p className="text-xs text-slate-400 text-center leading-relaxed">
                        {t("recaptcha")}{" "}
                        <a
                          href="https://policies.google.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {t("privacyLink")}
                        </a>{" "}
                        <span className="text-slate-600">•</span>{" "}
                        <a
                          href="https://policies.google.com/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {t("termsLink")}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 disabled:from-blue-600/50 disabled:via-blue-500/50 disabled:to-cyan-500/50 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-blue-500/50"
                  >
                    {isSubmitting ? "Submitting..." : t("submitButton")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper component for form inputs
function FormInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-200 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error
            ? "border-red-500/50"
            : "border-slate-700 hover:border-slate-600"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
