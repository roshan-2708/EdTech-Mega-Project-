import { Link } from "react-router-dom";
import { FooterLink2 } from "../../data/footer-links";
import { FaFacebookF, FaTwitter, FaGoogle, FaYoutube, FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#030816] text-richblack-300 border-t border-richblack-800/80 font-sans">
      {/* Top Newsletter / Quick Info Bar */}
      <div className="w-11/12 max-w-7xl mx-auto py-10 border-b border-richblack-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Study<span className="text-yellow-50">Notion</span>
          </h3>
          <p className="text-xs sm:text-sm text-richblack-400 mt-1">
            Empowering curious developers with world-class, production-ready skills.
          </p>
        </div>

        {/* Interactive Social Buttons */}
        <div className="flex items-center gap-3">
          {[
            { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
            { icon: <FaGoogle />, href: "https://google.com", label: "Google" },
            { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
            { icon: <FaYoutube />, href: "https://youtube.com", label: "YouTube" },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              className="w-9 h-9 rounded-lg bg-richblack-800/80 border border-richblack-700/60 flex items-center justify-center text-richblack-300 hover:text-yellow-50 hover:border-yellow-50/50 hover:bg-richblack-800 transition-all duration-200"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="w-11/12 max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8 lg:gap-12">
          
          {/* Company Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-richblack-100">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-yellow-50 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-yellow-50 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/affiliates" className="hover:text-yellow-50 transition-colors">
                  Affiliates
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-richblack-100">
              Resources
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              {['Articles', 'Blog', 'Cheat Sheets', 'Code Challenges', 'Docs', 'Projects'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-yellow-50 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plans & Community */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-richblack-100">
                Plans
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li><Link to="/membership" className="hover:text-yellow-50 transition-colors">Paid tiers</Link></li>
                <li><Link to="/students" className="hover:text-yellow-50 transition-colors">For students</Link></li>
                <li><Link to="/enterprise" className="hover:text-yellow-50 transition-colors">Business solutions</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-richblack-100">
                Community
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li><Link to="/forums" className="hover:text-yellow-50 transition-colors">Forums</Link></li>
                <li><Link to="/chapters" className="hover:text-yellow-50 transition-colors">Chapters</Link></li>
                <li><Link to="/events" className="hover:text-yellow-50 transition-colors">Events</Link></li>
              </ul>
            </div>
          </div>

          {/* Dynamic FooterLink2 Columns */}
          {FooterLink2.map((col, index) => (
            <div key={index} className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-richblack-100">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.link}
                      className="hover:text-yellow-50 transition-colors line-clamp-1"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="w-full bg-[#020612] border-t border-richblack-800/80 py-5">
        <div className="w-11/12 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-richblack-400">
          
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-richblack-700">•</span>
            <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            <span className="text-richblack-700">•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <div className="flex items-center gap-1.5 text-richblack-400">
            <span>Made with</span>
            <FaHeart className="text-pink-400 text-[11px]" />
            <span>CodeHelp © 2026 StudyNotion</span>
          </div>

        </div>
      </div>
    </footer>
  );
}