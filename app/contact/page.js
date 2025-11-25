"use client";
import { useState } from "react";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaPaperPlane,
  FaWhatsapp,
  FaTwitter,
  FaInstagram,
  FaTelegram,
  FaFacebook,
  FaYoutube
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create email content
    const emailContent = `
Name: ${formData.name}
Email: ${formData.email}
Category: ${formData.category}
Subject: ${formData.subject}

Message:
${formData.message}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:freenethubbusiness@gmail.com?subject=MunoFlix Support: ${formData.subject}&body=${encodeURIComponent(emailContent)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Simulate submission success
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          category: "general"
        });
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: <FaEnvelope className="text-purple-400" />,
      title: "Email Us",
      description: "Send us an email anytime",
      details: "freenethubbusiness@gmail.com",
      action: "mailto:freenethubbusiness@gmail.com"
    },
    {
      icon: <FaWhatsapp className="text-green-500" />,
      title: "WhatsApp",
      description: "24/7 instant messaging",
      details: "+257 617 87221",
      action: "https://wa.me/25761787221"
    },
    {
      icon: <FaTelegram className="text-blue-400" />,
      title: "Telegram",
      description: "Join our community",
      details: "@XPTOOLSTEAM",
      action: "https://t.me/XPTOOLSTEAM"
    },
    {
      icon: <FaMapMarkerAlt className="text-red-400" />,
      title: "Location",
      description: "Based in",
      details: "Digital Space",
      action: "#"
    }
  ];

  const socialLinks = [
    {
      icon: <FaFacebook className="text-blue-500" />,
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61556002877589",
      handle: "MunoFlix"
    },
    {
      icon: <FaTwitter className="text-blue-400" />,
      name: "Twitter",
      url: "https://twitter.com/munoflix",
      handle: "@munoflix"
    },
    {
      icon: <FaInstagram className="text-pink-400" />,
      name: "Instagram",
      url: "https://instagram.com/munoflix",
      handle: "@munoflix"
    },
    {
      icon: <FaYoutube className="text-red-500" />,
      name: "YouTube",
      url: "https://youtube.com/@freenethubtech?si=q1t1496Zj6P9cmMs",
      handle: "@freenethubtech"
    }
  ];

  const issueCategories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing Issue" },
    { value: "content", label: "Content Request" },
    { value: "bug", label: "Report a Bug" },
    { value: "feature", label: "Feature Request" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12111a] via-[#1a1825] to-[#2d2a44] pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get in touch with our team. We're here to help you with any questions or concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e1c2f] border border-[#39374b] rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              
              {/* Contact Methods */}
              <div className="space-y-3 mb-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.action}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#2d2a44] transition-colors group"
                  >
                    <div className="text-xl mt-1 group-hover:scale-110 transition-transform">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-gray-400 text-xs">{method.description}</p>
                      <p className="text-gray-300 text-xs font-medium mt-1">{method.details}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 text-sm">Follow Us</h3>
                <div className="grid grid-cols-2 gap-2">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#2d2a44] hover:bg-[#39374b] border border-[#39374b] rounded-lg p-2 transition-all hover:scale-105 group flex items-center gap-2"
                    >
                      <div className="text-lg group-hover:scale-110 transition-transform">
                        {social.icon}
                      </div>
                      <span className="text-white text-xs">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-purple-400 text-sm" />
                  <h4 className="text-white font-semibold text-sm">Business Hours</h4>
                </div>
                <div className="text-gray-300 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Monday - Sunday:</span>
                    <span>24/7 Support</span>
                  </div>
                  <div className="text-green-400 font-semibold text-center mt-1">
                    Always Available
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#1e1c2f] border border-[#39374b] rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              
              {isSubmitted ? (
                <div className="text-center py-6">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <FaPaperPlane className="text-green-400 text-xl" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Message Ready!</h3>
                  <p className="text-gray-300 text-sm">
                    Your email client should open with the message pre-filled. 
                    Just click send to contact us at freenethubbusiness@gmail.com
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-white font-medium mb-2 text-sm">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#2d2a44] border border-[#39374b] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2 text-sm">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#2d2a44] border border-[#39374b] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-white font-medium mb-2 text-sm">
                      Issue Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#2d2a44] border border-[#39374b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
                    >
                      {issueCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-white font-medium mb-2 text-sm">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#2d2a44] border border-[#39374b] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white font-medium mb-2 text-sm">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full bg-[#2d2a44] border border-[#39374b] rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-vertical"
                      placeholder="Please provide detailed information about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Preparing Email...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Message via Email
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* FAQ Quick Link */}
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-xs">
                  Looking for quick answers? Check out our{" "}
                  <a href="/help" className="text-purple-400 hover:text-purple-300 underline transition-colors">
                    Help & Support
                  </a>{" "}
                  page for common questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ContactPage;