"use client";
import { useState } from "react";
import { 
  FaSearch, 
  FaQuestionCircle, 
  FaFilm, 
  FaUser, 
  FaCreditCard,
  FaMobile,
  FaExclamationTriangle,
  FaComments,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

const FAQS = [
  {
    title: "🤔 What is MunoFlix?",
    description: "Just like every other website, MunoFlix is also a streaming site that helps to easily access all the TV shows and movies we wanted, without spending hours searching for them.",
    category: "general"
  },
  {
    title: "❓ So what do we actually do?",
    description: "Well, let me tell you what we don't do: we definitely don't illegally host our files. We do not store any copyright-protected content on our website. Any linked content is stored only in third-party websites. This is a promotional website only. All files placed here are for introducing purpose. We highly ENCOURAGE users to BUY the CDs or DVDs of the movie or the music they like.",
    category: "general"
  },
  {
    title: "🚫 I cannot watch video because of ads",
    description: "We are very sorry that we can't help you with that. We have no control in the ads being served. Don't download anything in the popups. If you don't want to be annoyed. We highly recommend subscribing to a legal streaming service that you can afford (or use an adblocker like uBlock Origin or Adblock Plus).",
    category: "technical"
  },
  {
    title: "🐌 Streaming speed is slow or all videos do not play",
    description: "When you go on the page with the episode, in 99% of the cases there is a video player. What you have to do is click the Play button, of course. If it does not work (Don't be judgmental! Everybody makes mistakes!), just click on the Servers you see on the top right of your device. You will get a list of servers [Vidlink, VidSrc etc.] Try choosing different server, it will definitely solve the problem.",
    category: "technical"
  },
  {
    title: "😁 I want to download video",
    description: "Since we don't store any files, so we don't have any download feature here. All files found on this site have been collected from various sources across the web and are believed to be in the public domain.",
    category: "content"
  },
  {
    title: "😟 Is it safe to stream in this website?",
    description: "This website is undoubtedly safer to stream, however downloading, uploading is illegal. You will not get into any trouble while using our website. It's highly not recommended to download the files and share them to the public, It might get you in trouble.",
    category: "general"
  }
];

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border border-[#39374b] rounded-lg mb-3 overflow-hidden bg-[#1e1c2f] hover:border-[#6c5dd3] transition-all duration-300">
      <button
        onClick={onClick}
        className="w-full px-4 py-3 text-left flex justify-between items-center text-white font-semibold bg-[#2a2d3e] hover:bg-[#2d2f42] transition-colors"
      >
        <span className="text-sm md:text-base pr-2">{faq.title}</span>
        {isOpen ? (
          <FaChevronUp className="text-[#6c5dd3] flex-shrink-0" />
        ) : (
          <FaChevronDown className="text-[#6c5dd3] flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 py-3 text-gray-300 text-sm leading-relaxed border-t border-[#39374b]">
          {faq.description}
        </div>
      )}
    </div>
  );
};

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  // FAQ Categories
  const faqCategories = [
    {
      id: "account",
      name: "Account & Profile",
      icon: <FaUser className="text-blue-400" />,
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Sign Up' button in the navigation menu or on the More page. You'll need to provide your email address, create a password, and choose a username. After verification, your account will be ready to use."
        },
        {
          question: "I forgot my password. How can I reset it?",
          answer: "Click on 'Sign In' and then 'Forgot Password'. Enter your email address and we'll send you a password reset link. Make sure to check your spam folder if you don't see the email."
        }
      ]
    },
    {
      id: "technical",
      name: "Technical Issues",
      icon: <FaMobile className="text-green-400" />,
      questions: [
        {
          question: "The app keeps crashing. What should I do?",
          answer: "Try these steps: 1) Force close and restart the app, 2) Update to the latest version, 3) Clear app cache, 4) Restart your device, 5) Reinstall the app if issues persist."
        },
        {
          question: "Video quality is poor even with good internet",
          answer: "Check your video quality settings in the app. Go to Settings > Video Quality and select 'Auto' or the highest available quality. Also ensure your device meets the minimum requirements for HD streaming."
        }
      ]
    }
  ];

  // Popular Help Topics
  const popularTopics = [
    {
      title: "Troubleshooting Playback Issues",
      description: "Solve common video streaming problems",
      category: "technical"
    },
    {
      title: "Managing Your Watchlist",
      description: "How to add and organize your favorite content",
      category: "account"
    }
  ];

  // Get all questions for search
  const allQuestions = [...FAQS, ...faqCategories.flatMap(category => 
    category.questions.map(q => ({ 
      title: q.question, 
      description: q.answer, 
      category: category.id 
    }))
  )];

  // Filter questions based on search and category
  const filteredQuestions = activeCategory === "all" 
    ? allQuestions.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allQuestions.filter(q => 
        q.category === activeCategory &&
        (q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         q.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12111a] via-[#1a1825] to-[#2d2a44] pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Help & Support
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find answers to common questions and get help with MunoFlix
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e1c2f] border border-[#39374b] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {popularTopics.map((topic, index) => (
              <div
                key={index}
                className="bg-[#1e1c2f] border border-[#39374b] rounded-xl p-3 hover:border-purple-500 transition-colors cursor-pointer"
                onClick={() => {
                  setActiveCategory(topic.category);
                  setSearchQuery(topic.title.split(' ')[0]);
                }}
              >
                <h3 className="text-white font-semibold text-sm mb-1">{topic.title}</h3>
                <p className="text-gray-400 text-xs">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                activeCategory === "all"
                  ? 'bg-[#6c5dd3] text-white'
                  : 'bg-[#2d2a44] text-gray-300 hover:bg-[#39374b] hover:text-white'
              }`}
            >
              All Topics
            </button>
            {faqCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                  activeCategory === category.id
                    ? 'bg-[#6c5dd3] text-white'
                    : 'bg-[#2d2a44] text-gray-300 hover:bg-[#39374b] hover:text-white'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {activeCategory === "all" ? "Frequently Asked Questions" : faqCategories.find(c => c.id === activeCategory)?.name + " Questions"}
          </h2>
          
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-6">
              <FaQuestionCircle className="text-gray-400 text-3xl mx-auto mb-3" />
              <p className="text-gray-400">No questions found. Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredQuestions.map((item, index) => (
                <FAQItem
                  key={index}
                  faq={item}
                  isOpen={openFaqIndex === index}
                  onClick={() => toggleFAQ(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contact Support CTA */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
          <FaComments className="text-purple-400 text-2xl mx-auto mb-3" />
          <h3 className="text-white font-semibold text-lg mb-2">Still Need Help?</h3>
          <p className="text-gray-300 text-sm mb-3">
            Can't find what you're looking for? Our support team is here to help you.
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-[#6c5dd3] hover:bg-[#5d4bc4] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Contact Support
          </button>
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

export default HelpPage;