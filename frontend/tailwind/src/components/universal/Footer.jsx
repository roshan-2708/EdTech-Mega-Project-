import { Link } from "react-router-dom";
import { FooterLink2 } from "../../data/footer-links";
import { FaFacebook, FaTwitter, FaGoogle, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="w-full bg-richblack-800 text-richblack-200 border-t border-richblack-700">

            {/* MAIN FOOTER */}
            <div className="w-11/12 mx-auto py-12 flex flex-wrap 
                gap-10 md:gap-16 justify-between">

                {/* LEFT SECTION */}
                <div className="flex flex-col gap-6 min-w-[200px]">
                    <h1 className="text-xl font-bold text-white">StudyNotion</h1>

                    <div className="space-y-1 text-sm">
                        <p className="text-richblack-300">Company</p>
                        <Link to="/about">About </Link>
                        <Link to="/careers">Careers </Link>
                        <Link to="/affiliates">Affiliates</Link>
                    </div>

                    <div className="flex items-center gap-4 text-xl text-richblack-200">
                        <FaFacebook />
                        <FaGoogle />
                        <FaTwitter />
                        <FaYoutube />
                    </div>
                </div>

                {/* MIDDLE DEFAULT LINKS */}
                <div className="flex flex-wrap gap-12 md:gap-20">

                    <div>
                        <h2 className="font-semibold text-white mb-3">Resources</h2>
                        <ul className="space-y-1 text-sm">
                            <li>Articles</li>
                            <li>Blog</li>
                            <li>Chart Sheet</li>
                            <li>Code Challenges</li>
                            <li>Docs</li>
                            <li>Projects</li>
                            <li>Videos</li>
                            <li>Workspaces</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-white mb-3">Plans</h2>
                        <ul className="space-y-1 text-sm">
                            <li>Paid memberships</li>
                            <li>For students</li>
                            <li>Business solutions</li>
                        </ul>

                        <h2 className="font-semibold text-white mb-3 mt-5">Community</h2>
                        <ul className="space-y-1 text-sm">
                            <li>Forums</li>
                            <li>Chapters</li>
                            <li>Events</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-white mb-3">Support</h2>
                        <ul className="space-y-1 text-sm">
                            <li>Help Center</li>
                        </ul>
                    </div>
                </div>

                {/* RIGHT SECTION – FOOTER LINKS FROM DATA */}
                <div className="flex flex-wrap gap-12 md:gap-16">
                    {FooterLink2.map((col, index) => (
                        <div key={index} className="min-w-[150px]">
                            <h2 className="font-semibold text-white mb-3">{col.title}</h2>
                            <ul className="space-y-1 text-sm">
                                {col.links.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            className="hover:text-white transition"
                                            to={link.link}
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

            {/* BOTTOM BAR */}
            <div className="w-full border-t border-richblack-700 py-4">
                <div className="w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-richblack-300">

                    {/* LEFT SIDE LINKS */}
                    <div className="flex gap-5">
                        <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                        <Link to="/cookie-policy" className="hover:text-white">Cookie Policy</Link>
                        <Link to="/terms" className="hover:text-white">Terms</Link>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="text-center">
                        Made with ❤️ CodeHelp © 2025 StudyNotion
                    </div>
                </div>
            </div>

        </div>
    );
}
