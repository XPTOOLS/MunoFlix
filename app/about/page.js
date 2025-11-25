"use client";

import { nightTokyo } from "@/utils/fonts";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTelegram, FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa";

const FAQS = [
  {
    title: "🤔 What is MunoFlix?",
    description:
      "Just like every other website, MunoFlix is also a streaming site that helps to easily access all the TV shows and movies we wanted, without spending hours searching for them.",
  },
  {
    title: "❓ So what do we actually do?",
    description:
      "Well, let me tell you what we don't do: we definitely don't illegally host our files. We do not store any copyright-protected content on our website. Any linked content is stored only in third-party websites. This is a promotional website only. All files placed here are for introducing purpose. We highly ENCOURAGE users to BUY the CDs or DVDs of the movie or the music they like.",
  },
  {
    title: "🚫 I cannot watch video because of ads",
    description: (
      <p>
        We are very sorry that we can't help you with that. We have no control in the ads being
        served. Don't download anything in the popups. If you don't want to be annoyed. We highly
        recommend subscribing to a legal streaming service that you can afford (or use an adblocker
        like{" "}
        <a href="https://ublockorigin.com/" target="_blank" rel="noopener noreferrer" className="text-[#6c5dd3] font-bold hover:underline">
          uBlock Origin
        </a>{" "}
        or{" "}
        <a href="https://adblockplus.org/" target="_blank" rel="noopener noreferrer" className="text-[#6c5dd3] font-bold hover:underline">
          Adblock Plus
        </a>
        ).
      </p>
    ),
  },
  {
    title: "🐌 Streaming speed is slow or all videos do not play",
    description:
      "When you go on the page with the episode, in 99% of the cases there is a video player. What you have to do is click the Play button, of course. If it does not work (Don't be judgmental! Everybody makes mistakes!), just click on the Servers you see on the top right of your device. You will get a list of servers [Vidlink, VidSrc etc.] Try choosing different server, it will definitely solve the problem.",
  },
  {
    title: "😁 I want to download video",
    description:
      "Since we don't store any files, so we don't have any download feature here. All files found on this site have been collected from various sources across the web and are believed to be in the public domain.",
  },
  {
    title: "😟 Is it safe to stream in this website?",
    description:
      "This website is undoubtedly safer to stream, however downloading, uploading is illegal. You will not get into any trouble while using our website. It's highly not recommended to download the files and share them to the public, It might get you in trouble.",
  },
];

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border border-[#39374b] rounded-lg mb-4 overflow-hidden bg-[#242735] hover:border-[#6c5dd3] transition-all duration-300">
      <button
        onClick={onClick}
        className="w-full px-6 py-4 text-left flex justify-between items-center text-white font-semibold bg-[#2a2d3e] hover:bg-[#2d2f42] transition-colors"
      >
        <span className="text-lg">{faq.title}</span>
        {isOpen ? (
          <FaChevronUp className="text-[#6c5dd3] flex-shrink-0" />
        ) : (
          <FaChevronDown className="text-[#6c5dd3] flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 text-gray-300 leading-relaxed border-t border-[#39374b]">
          {faq.description}
        </div>
      )}
    </div>
  );
};

export default function AboutUs() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // Replace these URLs with your actual social media links
  const socialLinks = {
    telegram: "https://t.me/XPTOOLSTEAM", // Replace with your Telegram
    facebook: "https://www.facebook.com/profile.php?id=61556002877589", // Replace with your Facebook
    whatsapp: "https://wa.me/+25761787221", // Replace with your WhatsApp
    youtube: "https://youtube.com/@freenethubtech?si=q1t1496Zj6P9cmMs" // Replace with your YouTube
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      {/* Background effects matching homepage */}
      <div className="fixed w-[138.33px] h-[82.25px] left-[1%] top-[2%] bg-[#92b7fc8f] blur-[200px]"></div>
      <div className="fixed w-[500px] h-[370.13px] right-[50%] bottom-[20%] bg-[#576683b4] blur-[215.03px] translate-x-[70%] z-0 rounded-full"></div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className={`${nightTokyo.className} text-5xl text-white mb-4`}>
            About MunoFlix
          </h1>
          <p className="text-gray-300 text-lg">
            Your ultimate destination for streaming movies and TV shows
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-[#1a1a2e] bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-[#313e5038] mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                MunoFlix is dedicated to bringing you the best streaming experience 
                with a vast collection of movies and TV shows. We believe in making 
                quality entertainment accessible to everyone.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl text-white mb-4">What We Offer</h2>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#6c5dd3] rounded-full mr-3"></div>
                  High-quality streaming
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#6c5dd3] rounded-full mr-3"></div>
                  Curated collections
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#6c5dd3] rounded-full mr-3"></div>
                  Personalized recommendations
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#6c5dd3] rounded-full mr-3"></div>
                  Multi-platform support
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#313e5038]">
            <h2 className="text-2xl text-white mb-4">Join Our Community</h2>
            <p className="text-gray-300">
              Become part of our growing community of movie enthusiasts. 
              Discover new favorites, share your thoughts, and enjoy unlimited entertainment.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-[#1a1a2e] bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-[#313e5038]">
          <h2 className={`${nightTokyo.className} text-3xl text-white text-center mb-8`}>
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-8 pt-8 border-t border-[#313e5038] text-center">
            <h3 className="text-xl text-white mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-6">
              Feel free to reach out to us on our social media platforms:
            </p>
            
            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6">
              {/* Telegram */}
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-[#2a2d3e] border border-[#39374b] rounded-lg hover:border-[#0088cc] hover:bg-[#0088cc] transition-all duration-300 transform hover:scale-110"
                title="Telegram"
              >
                <FaTelegram className="text-2xl text-[#0088cc] group-hover:text-white transition-colors" />
              </a>

              {/* Facebook */}
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-[#2a2d3e] border border-[#39374b] rounded-lg hover:border-[#1877F2] hover:bg-[#1877F2] transition-all duration-300 transform hover:scale-110"
                title="Facebook"
              >
                <FaFacebook className="text-2xl text-[#1877F2] group-hover:text-white transition-colors" />
              </a>

              {/* WhatsApp */}
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-[#2a2d3e] border border-[#39374b] rounded-lg hover:border-[#25D366] hover:bg-[#25D366] transition-all duration-300 transform hover:scale-110"
                title="WhatsApp"
              >
                <FaWhatsapp className="text-2xl text-[#25D366] group-hover:text-white transition-colors" />
              </a>

              {/* YouTube */}
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 bg-[#2a2d3e] border border-[#39374b] rounded-lg hover:border-[#FF0000] hover:bg-[#FF0000] transition-all duration-300 transform hover:scale-110"
                title="YouTube"
              >
                <FaYoutube className="text-2xl text-[#FF0000] group-hover:text-white transition-colors" />
              </a>
            </div>

            <p className="text-gray-400 text-sm mt-4">
              We typically respond within 24 hours
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-[#2a2d3e] border border-[#39374b] rounded-lg p-6 text-center">
          <p className="text-gray-300 text-sm">
            <strong>Disclaimer:</strong> MunoFlix does not host any files on its server. All content is provided by non-affiliated third parties. We do not accept responsibility for content hosted on third-party sites.
          </p>
        </div>
      </div>
    </div>
  );
}