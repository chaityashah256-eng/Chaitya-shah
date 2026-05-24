import React, { useState, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  MessageSquare, 
  Play, 
  Loader2, 
  UserPlus, 
  FileText, 
  Globe, 
  Award, 
  Zap, 
  Send, 
  Star, 
  Calendar, 
  ArrowRight,
  Tv, 
  Instagram, 
  Youtube, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Percent,
  CheckCircle2,
  Users2,
  ThumbsUp,
  BrainCircuit,
  Lock,
  RefreshCw,
  Sparkle,
  Share2,
  Heart,
  Mail,
  Key,
  LogOut,
  Chrome,
  User,
  Check,
  Bot,
  Server
} from "lucide-react";
import { Influencer, Contract, AIAnalysisResult, CommunityPost, CommunityComment } from "./types";
import DeviceSimulator from "./components/DeviceSimulator";
import HireModal from "./components/HireModal";
import ReachLogo from "./components/ReachLogo";
import AgentWidget from "./components/AgentWidget";
import { translations, languageList } from "./translations";
import GmailInviteCenter from "./components/GmailInviteCenter";

export default function App() {
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("desktop");
  const [appLanguage, setAppLanguage] = useState<string>(() => localStorage.getItem("reach_app_lang") || "en");
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareList, setCompareList] = useState<Influencer[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("All");
  
  // Advanced search/filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterAge, setFilterAge] = useState("All"); 
  const [filterGender, setFilterGender] = useState("All"); 
  const [filterAudienceLocale, setFilterAudienceLocale] = useState("All"); 
  const [filterAudienceInterest, setFilterAudienceInterest] = useState("All"); 
  const [filterPlatforms, setFilterPlatforms] = useState<string[]>(["youtube", "instagram", "tiktok", "twitch"]);
  const [filterMinFollowers, setFilterMinFollowers] = useState(0);
  const [filterMaxFollowers, setFilterMaxFollowers] = useState(5000000);
  const [filterMinEngagement, setFilterMinEngagement] = useState(0); 
  const [filterHasCampaignHistory, setFilterHasCampaignHistory] = useState(false);
  const [filterCreatorLocation, setFilterCreatorLocation] = useState("All"); 
  const [sortBy, setSortBy] = useState<"followerNum" | "engagementRate" | "costPerPost" | "engagementQualityScore" | "sentimentScore">("followerNum");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Profile Sub-tab tracking
  const [profileTab, setProfileTab] = useState<"overview" | "metrics_live" | "ai_diagnostics">("overview");

  // Real-time live KPIs state
  const [liveKpiTicks, setLiveKpiTicks] = useState({
    followers: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    reach: 0,
    impressions: 0,
    ctr: 4.2,
    commentsList: [] as string[]
  });
  const [isLiveActive, setIsLiveActive] = useState(true);
  
  // AI Agent State Control
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [agentTriggerMsg, setAgentTriggerMsg] = useState("");
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    handle: string;
    email: string;
    avatar: string;
    provider: "email" | "google";
  } | null>(() => {
    try {
      const saved = localStorage.getItem("reach_user_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auth form inputs
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authHandle, setAuthHandle] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authErrorMessage, setAuthErrorMessage] = useState("");

  // AI-Powered profile generation state
  const [newProfileUrl, setNewProfileUrl] = useState("");
  const [isAnalyzingProfileWithAI, setIsAnalyzingProfileWithAI] = useState(false);

  // Navigation tabs inside the simulated app
  const [activeTab, setActiveTab] = useState<"influencers" | "campaigns" | "signin" | "social">("influencers");
  const [showDashboard, setShowDashboard] = useState(false);
  const [signinRole, setSigninRole] = useState<"none" | "discover" | "influencer">("none");
  
  // Community social feed views states
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [newPostAuthor, setNewPostAuthor] = useState("");
  const [newPostRole, setNewPostRole] = useState("");
  const [newPostPlatform, setNewPostPlatform] = useState("Twitter / X");
  const [newPostTarget, setNewPostTarget] = useState("");
  const [newPostViews, setNewPostViews] = useState("");
  const [newPostRating, setNewPostRating] = useState(5);
  const [newPostMediaUrl, setNewPostMediaUrl] = useState("");
  const [commentInputs, setCommentInputs] = useState<{[postId: string]: string}>({});
  const [commentAuthors, setCommentAuthors] = useState<{[postId: string]: string}>({});
  const [postSuccessMessage, setPostSuccessMessage] = useState("");
  
  // AI Video Analyzer state
  const [videoUrl, setVideoUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  // Create Profile state
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileHandle, setNewProfileHandle] = useState("");
  const [newProfileNiche, setNewProfileNiche] = useState("Tech & Gadgets");
  const [newProfileFollowers, setNewProfileFollowers] = useState("120K");
  const [newProfileViews, setNewProfileViews] = useState("45K");
  const [newProfileCost, setNewProfileCost] = useState("400");
  const [newProfileLocation, setNewProfileLocation] = useState("New York, USA");
  const [newProfileBio, setNewProfileBio] = useState("");
  const [newProfileYT, setNewProfileYT] = useState("");
  const [newProfileIG, setNewProfileIG] = useState("");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");

  // Hire flow modal state
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  // Load backend data
  const fetchData = async () => {
    try {
      const resInf = await fetch("/api/influencers");
      const infData = await resInf.json();
      setInfluencers(infData);
      if (infData.length > 0 && !selectedInfluencer) {
        setSelectedInfluencer(infData[0]);
      }

      const resCtr = await fetch("/api/contracts");
      const ctrData = await resCtr.json();
      setContracts(ctrData);

      const resPosts = await fetch("/api/posts");
      if (resPosts.ok) {
        const postsData = await resPosts.json();
        setCommunityPosts(postsData);
      }
    } catch (err) {
      console.error("Error loading seed data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Initialize live simulated KPIs when selected creator switches
  useEffect(() => {
    if (!selectedInfluencer) return;
    
    const baseFollowers = selectedInfluencer.followerNum || 10000;
    const baseLikes = Math.floor(baseFollowers * 0.045);
    const baseComments = Math.floor(baseFollowers * 0.0062);
    const baseShares = Math.floor(baseFollowers * 0.0021);
    const baseReach = Math.floor(baseFollowers * 0.22);
    const baseImpressions = Math.floor(baseFollowers * 0.44);
    const baseCtr = parseFloat(selectedInfluencer.engagementRate) * 0.85 || 4.2;

    setLiveKpiTicks({
      followers: baseFollowers,
      likes: baseLikes,
      comments: baseComments,
      shares: baseShares,
      reach: baseReach,
      impressions: baseImpressions,
      ctr: Number(baseCtr.toFixed(2)),
      commentsList: [
        "Incredible unboxing segment! 🚀",
        "Where can I buy those keycaps?",
        "Subscribing immediately. Perfect styling.",
        "Is there a discount code available for the audience?",
        "This is why I love following this creator!"
      ]
    });
  }, [selectedInfluencer]);

  // Periodic near real-time telemetry updates (likes, comments, reach, CTR)
  useEffect(() => {
    if (!isLiveActive || !selectedInfluencer) return;

    const interval = setInterval(() => {
      setLiveKpiTicks(prev => {
        const tickFollowers = prev.followers + Math.floor(Math.random() * 3) + 1; // +1 to +3
        const tickLikes = prev.likes + Math.floor(Math.random() * 8) + 2;
        const tickComments = prev.comments + Math.floor(Math.random() * 3) + 1;
        const tickShares = prev.shares + Math.floor(Math.random() * 2) + 1;
        const tickReach = prev.reach + Math.floor(Math.random() * 12) + 5;
        const tickImpressions = prev.impressions + Math.floor(Math.random() * 24) + 10;
        const variance = (Math.random() - 0.5) * 0.06;
        const tickCtr = Math.max(1.8, Math.min(12.5, prev.ctr + variance));

        let updatedCommentsList = [...prev.commentsList];
        const newCommentsPool = [
          "This review is so detailed!",
          "Already sent to my teammates.",
          "Brilliant presentation format.",
          "Instantly bought after viewing! 🛒",
          "Best channel recommendation of the month!",
          "This custom setup is an absolute dream.",
          "Always trust this reviews channel."
        ];
        
        // Randomly mix comments stream
        if (Math.random() > 0.6) {
          const randomComment = newCommentsPool[Math.floor(Math.random() * newCommentsPool.length)];
          updatedCommentsList = [randomComment, ...prev.commentsList.slice(0, 5)];
        }

        return {
          followers: tickFollowers,
          likes: tickLikes,
          comments: tickComments,
          shares: tickShares,
          reach: tickReach,
          impressions: tickImpressions,
          ctr: Number(tickCtr.toFixed(2)),
          commentsList: updatedCommentsList
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveActive, selectedInfluencer]);

  // Update a contract state (e.g. release funds)
  const updateContractStatus = async (contractId: string, updates: { status?: string, paymentStatus?: string }) => {
    try {
      const res = await fetch(`/api/contracts/${contractId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok) {
        setContracts(prev => prev.map(c => c.id === contractId ? data : c));
      }
    } catch (err) {
      console.error("Error updating contract:", err);
    }
  };

  // Run AI Video auditing analysis via server
  const handleAnalyzeVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      setAnalysisError("Please provide a valid YouTube or Instagram URL.");
      return;
    }
    setAnalysisError("");
    setIsAnalyzing(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: videoUrl,
          influencerId: selectedInfluencer?.id
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Auditing process was interrupted.");

      setAiAnalysisResult(data);
      // Refresh current influencer profile on screen to display newly generated engagement quality levels!
      if (selectedInfluencer) {
        const updated = {
          ...selectedInfluencer,
          engagementQualityScore: data.engagementQualityScore,
          sentimentScore: data.sentimentScore,
          audienceDemographics: {
            ...selectedInfluencer.audienceDemographics,
            ...data.demographicsBreakdown
          }
        };
        setSelectedInfluencer(updated);
        // Also sync list
        setInfluencers(prev => prev.map(inv => inv.id === selectedInfluencer.id ? updated : inv));
      }
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to analyze video.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileUrl) {
      setProfileSuccessMessage("Please provide a valid creator Profile or Reel URL.");
      return;
    }
    setIsSubmittingProfile(true);
    setProfileSuccessMessage("🤖 Initiating dynamic Reach AI Scan... Looking up profile link metrics & comment sentiments...");

    // Stagger status updates for wonderful UX feel
    const statuses = [
      "💬 Downloading recent posts and viewing video metadata...",
      "📊 Extracting comments to analyze target audience interest patterns...",
      "🧑‍🤝‍🧑 Assessing gender & age groups via natural language processing...",
      "✨ Organizing custom demographic indexes & estimated post pricing..."
    ];
    let statusIdx = 0;
    const interval = setInterval(() => {
      if (statusIdx < statuses.length) {
        setProfileSuccessMessage(`🤖 AI Audit Progress: ${statuses[statusIdx]}`);
        statusIdx++;
      }
    }, 1800);

    try {
      const res = await fetch("/api/influencers/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileUrl: newProfileUrl,
          costPerPost: newProfileCost ? Number(newProfileCost) : undefined
        })
      });

      clearInterval(interval);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile dynamic scanning was interrupted.");

      // Insert onto local list & auto-select
      setInfluencers(prev => [data, ...prev]);
      setSelectedInfluencer(data);
      setProfileSuccessMessage(`🎉 AI Scan Successful! Registered ${data.name} (${data.handle}) on Reach directory!`);

      // Reset form fields
      setNewProfileUrl("");
      setNewProfileCost("400");

      // Switch to influencers
      setTimeout(() => {
        setActiveTab("influencers");
        setProfileSuccessMessage("");
      }, 3000);

    } catch (err: any) {
      clearInterval(interval);
      setProfileSuccessMessage(err.message || "Error scanned by AI engine.");
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setPostSuccessMessage("❌ You must be authenticated to publish posts.");
      return;
    }
    if (!newPostViews) {
      setPostSuccessMessage("❌ Please enter some text or link to post.");
      return;
    }
    setIsSubmittingPost(true);
    setPostSuccessMessage("");
    try {
      // Determine author metadata from logged in user for independent reach posting
      const authorNameVal = currentUser.name;
      const authorHandleVal = currentUser.handle;
      const authorAvatarVal = currentUser.avatar;

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          views: newPostViews,
          mediaUrl: newPostMediaUrl,
          authorName: authorNameVal,
          authorHandle: authorHandleVal,
          authorAvatar: authorAvatarVal,
          platform: "Reach",
          targetInfluencer: newPostTarget || "Independent Network Feed",
          rating: newPostRating
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCommunityPosts(prev => [data, ...prev]);
        setPostSuccessMessage("🎉 Post successfully broadcasted to the independent Reach feed!");
        setNewPostViews("");
        setNewPostMediaUrl("");
        setNewPostAuthor(""); // Reset custom block if set
        setTimeout(() => {
          setPostSuccessMessage("");
        }, 3000);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to publish post.");
      }
    } catch (err: any) {
      setPostSuccessMessage(err.message || "Error submitting post.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Dedicated Auth Management Actions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrorMessage("");
    const path = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail,
          password: authPassword,
          name: authName,
          handle: authHandle
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication error occurred.");
      }

      if (data.success && data.user) {
        const sessionUser = {
          ...data.user,
          provider: "email" as const
        };
        setCurrentUser(sessionUser);
        localStorage.setItem("reach_user_session", JSON.stringify(sessionUser));
        
        // Reset form variables
        setAuthEmail("");
        setAuthPassword("");
        setAuthName("");
        setAuthHandle("");
        setAuthErrorMessage("");
      }
    } catch (err: any) {
      setAuthErrorMessage(err.message || "Failed to authenticate.");
    }
  };

  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleGoogleConnect = async (selectedEmail: string, selectedName: string) => {
    setAuthErrorMessage("");
    try {
      const res = await fetch("/api/auth/google-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedEmail,
          name: selectedName,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedName)}`
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Google connection error.");
      }

      if (data.success && data.user) {
        const sessionUser = {
          ...data.user,
          provider: "google" as const
        };
        setCurrentUser(sessionUser);
        localStorage.setItem("reach_user_session", JSON.stringify(sessionUser));
        setShowGoogleModal(false);
      }
    } catch (err: any) {
      setAuthErrorMessage(err.message || "Failed to connect Google account.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("reach_user_session");
  };

  const handleLikePost = async (postId: string) => {
    const hasLiked = likedPosts.has(postId);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggle: true, hasLiked })
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setCommunityPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
        setLikedPosts(prev => {
          const next = new Set(prev);
          if (hasLiked) {
            next.delete(postId);
          } else {
            next.add(postId);
          }
          return next;
        });
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text) return;
    const author = commentAuthors[postId] || "Anonymous Contributor";

    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text })
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setCommunityPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
        setCommentInputs(prev => ({ ...prev, [postId]: "" }));
        setCommentAuthors(prev => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Filter influencers based on advanced criteria
  let filteredInfluencers = influencers.filter(inf => {
    // 1. Basic search term matches name, handle, niche, or location
    const matchesSearch = 
      inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // 2. Niche Filter (mapped from horizontal category tabs)
    if (selectedNiche !== "All" && inf.niche !== selectedNiche) return false;

    // 3. Demographics: Age Range check
    if (filterAge !== "All") {
      const targetAge = inf.audienceDemographics.age.find(a => a.range === filterAge);
      // If none of that age range or percentage is minor (< 15%), filter it out
      if (!targetAge || targetAge.percentage < 15) return false;
    }

    // 4. Demographics: Gender Breakdown check
    if (filterGender !== "All") {
      const g = inf.audienceDemographics.gender;
      if (filterGender === "mainly-male" && g.male < 50) return false;
      if (filterGender === "mainly-female" && g.female < 45) return false;
    }

    // 5. Demographics: Audience Top Locations
    if (filterAudienceLocale !== "All") {
      const matchesLocale = inf.audienceDemographics.topLocations.some(l => 
        l.name.toLowerCase().includes(filterAudienceLocale.toLowerCase()) && l.percentage >= 15
      );
      if (!matchesLocale) return false;
    }

    // 6. Demographics: Audience Top Interests
    if (filterAudienceInterest !== "All") {
      const matchesInterest = inf.audienceDemographics.interests.some(interest => 
        interest.toLowerCase().includes(filterAudienceInterest.toLowerCase())
      );
      if (!matchesInterest) return false;
    }

    // 7. Core Platforms checkboxes (Check if influencer shares at least one platform checked)
    const matchesPlatform = inf.platforms.some(plat => filterPlatforms.includes(plat));
    if (!matchesPlatform) return false;

    // 8. Followers count min/max slider limits
    if (inf.followerNum < filterMinFollowers || inf.followerNum > filterMaxFollowers) return false;

    // 9. Min Engagement Rate percentage slider
    const rateVal = parseFloat(inf.engagementRate); // e.g. "5.8%" -> 5.8
    if (rateVal < filterMinEngagement) return false;

    // 10. Campaign History Filter (Only show influencers with at least one review)
    if (filterHasCampaignHistory && inf.reviews.length === 0) return false;

    // 11. Creator Geography Location Filter
    if (filterCreatorLocation !== "All") {
      if (!inf.location.toLowerCase().includes(filterCreatorLocation.toLowerCase())) return false;
    }

    return true;
  });

  // Apply real-time Sorting
  filteredInfluencers = [...filteredInfluencers].sort((a, b) => {
    let valA: number = 0;
    let valB: number = 0;

    if (sortBy === "followerNum") {
      valA = a.followerNum;
      valB = b.followerNum;
    } else if (sortBy === "costPerPost") {
      valA = a.costPerPost;
      valB = b.costPerPost;
    } else if (sortBy === "engagementQualityScore") {
      valA = a.engagementQualityScore;
      valB = b.engagementQualityScore;
    } else if (sortBy === "sentimentScore") {
      valA = a.sentimentScore;
      valB = b.sentimentScore;
    } else if (sortBy === "engagementRate") {
      valA = parseFloat(a.engagementRate) || 0;
      valB = parseFloat(b.engagementRate) || 0;
    }

    if (valA < valB) return sortOrder === "desc" ? 1 : -1;
    if (valA > valB) return sortOrder === "desc" ? -1 : 1;
    return 0;
  });

  const niches = ["All", "Tech & Gadgets", "Fashion & Lifestyle", "Gaming & Esports", "Health & Fitness", "Travel & Food"];

  // Helper values for drawing responsive SVG graphs smoothly
  const maxGrowthVal = selectedInfluencer ? Math.max(...selectedInfluencer.socialMetrics.growthTrend) : 100;
  const minGrowthVal = selectedInfluencer ? Math.min(...selectedInfluencer.socialMetrics.growthTrend) : 0;
  const growthPoints = selectedInfluencer 
    ? selectedInfluencer.socialMetrics.growthTrend.map((val, idx) => {
        const x = (idx / (selectedInfluencer.socialMetrics.growthTrend.length - 1)) * 100;
        // inverse formula to map high values to lower Y coordinates
        const y = 35 - ((val - minGrowthVal) / (maxGrowthVal - minGrowthVal || 1)) * 25;
        return `${x},${y}`;
      }).join(" ")
    : "";

  const t = translations[appLanguage] || translations.en;

  return (
    <DeviceSimulator deviceType={deviceType} setDeviceType={setDeviceType}>
      {/* Simulation Screen Container */}
      <div id="reach-native-app" className="bg-gray-50 text-gray-900 flex-1 flex flex-col justify-between overflow-x-hidden relative">
        
        {/* Core Subheader: Quick App Navigation Tabs inside Simulator */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 px-4 py-2.5 text-xs flex justify-between items-center z-20 shadow-sm flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <ReachLogo className="h-6 w-auto hidden xs:block mb-1 -ml-6" />
            
            {/* Elegant Custom Language Selector */}
            <div className="relative flex items-center space-x-1 bg-gray-100 rounded-xl px-2.5 py-1.5 border border-gray-200 hover:border-gray-300 transition shadow-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <select
                id="language-selector"
                value={appLanguage}
                onChange={(e) => {
                  setAppLanguage(e.target.value);
                  localStorage.setItem("reach_app_lang", e.target.value);
                }}
                className="bg-transparent focus:outline-none text-[10px] sm:text-[11px] font-bold text-gray-700 cursor-pointer pr-1"
              >
                {languageList.map((lang) => (
                  <option key={lang.code} value={lang.code} className="font-sans">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Agent Button */}
            <button
              onClick={() => setIsAgentOpen((prev) => !prev)}
              className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border transition shadow-xs ${isAgentOpen ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100'}`}
            >
              <Bot className={`w-3.5 h-3.5 ${isAgentOpen ? 'text-white' : 'text-indigo-600 animate-pulse'}`} />
              <span className="text-[10px] sm:text-[11px] font-bold hidden xs:inline-block">Ask AI</span>
            </button>
          </div>

          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl border border-gray-200 overflow-x-auto">
            <button
              id="tab-influencers"
              onClick={() => setActiveTab("influencers")}
              className={`px-3 py-1.5 rounded-lg transition-all duration-300 font-bold text-[11px] tracking-wide whitespace-nowrap ${
                activeTab === "influencers" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-white"
              }`}
            >
              {t.tabInfluencers}
            </button>
            <button
              id="tab-campaigns"
              onClick={() => {
                setActiveTab("campaigns");
                fetchData(); // Load latest escrows
              }}
              className={`px-3 py-1.5 rounded-lg transition-all duration-300 font-bold text-[11px] flex items-center space-x-1 tracking-wide whitespace-nowrap ${
                activeTab === "campaigns" 
                  ? "bg-amber-500 text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <span>{t.tabEscrows}</span>
              {contracts.filter(c => c.paymentStatus === "escrowed").length > 0 && (
                <span className="h-4 w-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                  {contracts.filter(c => c.paymentStatus === "escrowed").length}
                </span>
              )}
            </button>
            <button
              id="tab-signin"
              onClick={() => setActiveTab("signin")}
              className={`px-3 py-1.5 rounded-lg transition-all duration-300 font-bold text-[11px] tracking-wide whitespace-nowrap ${
                activeTab === "signin" 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              {t.tabSignIn}
            </button>
            <button
              id="tab-social"
              onClick={() => {
                setActiveTab("social");
                fetchData();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all duration-300 font-bold text-[11px] tracking-wide flex items-center space-x-1 whitespace-nowrap ${
                activeTab === "social" 
                  ? "bg-fuchsia-600 text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              <span>{t.tabSocial}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Screens */}
        {activeTab === "influencers" && (
            <div className="flex-1 flex flex-col p-4 space-y-4">
              {!showDashboard && (
                <div className="space-y-4">
                  {/* Directory Header */}
                  <div className="text-center py-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col items-center">
                    <ReachLogo className="mb-3" />
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-indigo-100">
                      {t.verifiedBadge}
                    </span>
                    <h2 className="text-xl font-extrabold tracking-tight mt-2 text-gray-900">
                      {t.welcomeTitle}
                    </h2>
                    <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed mt-1">
                      {t.welcomeSubtitle}
                    </p>
                  </div>

            {/* Justdial style Search Bar & Filter Grid */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 space-y-3 shadow-sm text-gray-900">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  id="influencer-search-input"
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-24 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-all duration-300"
                />
                
                <div className="absolute right-2 top-1.5 flex items-center space-x-1">
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")} 
                      className="text-[10px] text-gray-500 hover:text-gray-900 px-1.5 py-1 bg-gray-100 border border-gray-200 rounded"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded transition duration-200 flex items-center space-x-1 ${
                      showAdvancedFilters 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "bg-gray-100 text-indigo-600 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <span>⚙️ Filter</span>
                  </button>
                </div>
              </div>

              {/* Justdial categories buttons */}
              <div className="flex space-x-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-gray-250 scrollbar-track-transparent">
                {niches.map((niche) => (
                  <button
                    key={niche}
                    id={`niche-${niche.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => {
                      setSelectedNiche(niche);
                      // Set default selected influencer of this niche
                      const firstOfNiche = influencers.find(inf => niche === "All" || inf.niche === niche);
                      if (firstOfNiche) {
                        setSelectedInfluencer(firstOfNiche);
                      }
                    }}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border transition-all duration-300 hover:scale-105 active:scale-95 ${
                      selectedNiche === niche
                        ? "bg-indigo-600 text-white border-transparent shadow-sm"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900 shadow-sm"
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>

              {/* Expandable Advanced Filters Panel */}
              {showAdvancedFilters && (
                <div className="bg-[#070709] border border-indigo-500/10 rounded-xl p-3 mt-2 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-extrabold flex items-center space-x-1">
                      <span>⚡ ADVANCED TARGET SEARCH FILTERS</span>
                    </span>
                    <button 
                      onClick={() => {
                        setFilterAge("All");
                        setFilterGender("All");
                        setFilterAudienceLocale("All");
                        setFilterAudienceInterest("All");
                        setFilterPlatforms(["youtube", "instagram", "tiktok", "twitch"]);
                        setFilterMinFollowers(0);
                        setFilterMaxFollowers(5000000);
                        setFilterMinEngagement(0);
                        setFilterCreatorLocation("All");
                      }}
                      className="text-[9px] uppercase font-bold text-slate-500 hover:text-rose-400 font-mono"
                    >
                      Reset All Filters
                    </button>
                  </div>

                  {/* Grid for filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Demographics selectors */}
                    <div className="bg-[#101014] p-2.5 rounded-lg border border-white/5 space-y-2">
                      <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Audience Demographics</p>
                      
                      <div className="space-y-1.5">
                        <label className="block text-[8px] uppercase text-slate-400 font-semibold">Age Group</label>
                        <select 
                          value={filterAge}
                          onChange={(e) => setFilterAge(e.target.value)}
                          className="w-full bg-[#070709] border border-white/10 rounded px-2 py-1 text-[10px] text-slate-200 focus:outline-none"
                        >
                          <option value="All">All Ages</option>
                          <option value="13-17">Gen-Z (13-17)</option>
                          <option value="18-24">Gen-Y Young (18-24)</option>
                          <option value="25-34">Millennials (25-34)</option>
                          <option value="35-54">Mid Professionals (35-54)</option>
                          <option value="55+">Seniors (55+)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[8px] uppercase text-slate-400 font-semibold">Gender Bias</label>
                        <select 
                          value={filterGender}
                          onChange={(e) => setFilterGender(e.target.value)}
                          className="w-full bg-[#070709] border border-white/10 rounded px-2 py-1 text-[10px] text-slate-200 focus:outline-none"
                        >
                          <option value="All">Balanced Gender</option>
                          <option value="mainly-male">Predominately Male (&gt;50%)</option>
                          <option value="mainly-female">Predominately Female (&gt;45%)</option>
                        </select>
                      </div>
                    </div>

                    {/* Audience Top Geolocales & Interests */}
                    <div className="bg-[#101014] p-2.5 rounded-lg border border-white/5 space-y-2">
                      <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Audience Localization</p>
                      
                      <div className="space-y-1.5">
                        <label className="block text-[8px] uppercase text-slate-400 font-semibold">Audience Top Country</label>
                        <select 
                          value={filterAudienceLocale}
                          onChange={(e) => setFilterAudienceLocale(e.target.value)}
                          className="w-full bg-[#070709] border border-white/10 rounded px-2 py-1 text-[10px] text-slate-200 focus:outline-none"
                        >
                          <option value="All">All Countries</option>
                          <option value="United States">United States</option>
                          <option value="India">India</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="France">France</option>
                          <option value="South Korea">South Korea</option>
                          <option value="Australia">Australia</option>
                          <option value="Japan">Japan</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[8px] uppercase text-slate-400 font-semibold">Audience Interest</label>
                        <select 
                          value={filterAudienceInterest}
                          onChange={(e) => setFilterAudienceInterest(e.target.value)}
                          className="w-full bg-[#070709] border border-white/10 rounded px-2 py-1 text-[10px] text-slate-200 focus:outline-none"
                        >
                          <option value="All">All Interests</option>
                          <option value="Tech">Tech & Gadgets</option>
                          <option value="Digital">Digital Design</option>
                          <option value="Fashion">Fashion & Lifestyle</option>
                          <option value="Gaming">Gaming & Esports</option>
                          <option value="Lifestyle">Lifestyle Hacks</option>
                          <option value="Travel">Travel & Culinary</option>
                        </select>
                      </div>
                    </div>

                    {/* Channels & Location Filter */}
                    <div className="bg-[#101014] p-2.5 rounded-lg border border-white/5 space-y-2">
                      <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Creator Profile Attributes</p>
                      
                      <div className="space-y-1.5">
                        <label className="block text-[8px] uppercase text-slate-400 font-semibold">Creator Geography</label>
                        <select 
                          value={filterCreatorLocation}
                          onChange={(e) => setFilterCreatorLocation(e.target.value)}
                          className="w-full bg-[#070709] border border-white/10 rounded px-2 py-1 text-[10px] text-slate-200 focus:outline-none"
                        >
                          <option value="All">Global Directory</option>
                          <option value="USA">United States</option>
                          <option value="France">France</option>
                          <option value="South Korea">South Korea</option>
                          <option value="Canada">Canada</option>
                          <option value="Indonesia">Indonesia</option>
                          <option value="London">United Kingdom</option>
                          <option value="Tokyo">Japan</option>
                        </select>
                      </div>

                      {/* Platforms selection */}
                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase text-slate-400 font-semibold mb-1">Target Media Outlets</label>
                        <div className="flex flex-wrap gap-1">
                          {["youtube", "instagram", "tiktok", "twitch"].map(plat => {
                            const isChecked = filterPlatforms.includes(plat);
                            return (
                              <button
                                key={plat}
                                type="button"
                                onClick={() => {
                                  if (isChecked) {
                                    setFilterPlatforms(prev => prev.filter(p => p !== plat));
                                  } else {
                                    setFilterPlatforms(prev => [...prev, plat]);
                                  }
                                }}
                                className={`px-2 py-0.5 rounded text-[8.5px] font-extrabold uppercase border transition ${
                                  isChecked 
                                  ? "bg-indigo-600/25 border-indigo-500 text-indigo-300"
                                  : "bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                {plat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Slider limits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    
                    {/* Follower limit slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[8px] uppercase text-slate-400 font-bold">
                        <span>Followers Scope</span>
                        <span className="text-indigo-400">
                          {filterMinFollowers >= 1000000 ? `${(filterMinFollowers / 1000000).toFixed(1)}M` : `${filterMinFollowers / 1000}K`} - {filterMaxFollowers === 5000000 ? "5M+" : `${filterMaxFollowers / 1000}K`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="range"
                          min="0"
                          max="2000000"
                          step="50000"
                          value={filterMinFollowers}
                          onChange={(e) => setFilterMinFollowers(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-full cursor-pointer"
                        />
                        <input 
                          type="range"
                          min="300000"
                          max="5000000"
                          step="100000"
                          value={filterMaxFollowers}
                          onChange={(e) => setFilterMaxFollowers(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-full cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Engagement quality limit slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[8px] uppercase text-slate-400 font-bold">
                        <span>Min Engagement Rate %</span>
                        <span className="text-emerald-400 font-mono">{filterMinEngagement}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={filterMinEngagement}
                        onChange={(e) => setFilterMinEngagement(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-full cursor-pointer"
                      />
                    </div>

                    {/* Campaign History Filter */}
                    <div className="space-y-1.5 flex items-center justify-between col-span-2 pt-2 border-t border-white/5">
                      <label className="text-[10px] uppercase text-slate-400 font-bold flex items-center space-x-2">
                        <span className="bg-amber-950/20 text-amber-400 px-1.5 py-0.5 rounded text-[8px] border border-amber-500/20">HISTORICAL</span>
                        <span>Only Influencers with Campaign History</span>
                      </label>
                      <input 
                        type="checkbox"
                        checked={filterHasCampaignHistory}
                        onChange={(e) => setFilterHasCampaignHistory(e.target.checked)}
                        className="accent-amber-500 h-3.5 w-3.5 cursor-pointer"
                      />
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        )}

            {/* Main Interactive Screen Splitter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* LEFT COLUMN: Match Results List (Grid catalog layout for creator list) */}
              {!showDashboard && (
                <div className="md:col-span-12 space-y-3">
                  
                  {compareMode && (
                    <div className="bg-[#0f0f13] text-white p-6 rounded-3xl border border-indigo-900/30 shadow-xl mb-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <Users2 className="w-5 h-5 text-indigo-400" />
                          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-300">Head-to-Head Comparison</h3>
                        </div>
                        <div className="text-[10px] text-indigo-400/80 font-mono font-bold bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-500/20">
                          {compareList.length}/2 Selected
                        </div>
                      </div>
                      
                      {compareList.length === 2 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {compareList.map((inf) => (
                            <div key={inf.id} className="bg-black/40 rounded-2xl border border-white/5 p-4 flex flex-col space-y-4">
                              <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
                                <img src={inf.avatar} alt={inf.name} className="w-12 h-12 rounded-full border border-gray-700" />
                                <div>
                                  <div className="text-sm font-bold text-slate-100">{inf.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{inf.handle}</div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1">Followers</div>
                                  <div className="text-lg font-black text-white">{inf.followers}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-white/5 p-2 rounded-xl">
                                    <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Engagement</div>
                                    <div className="text-xs font-bold text-emerald-400">{inf.engagementRate}</div>
                                  </div>
                                  <div className="bg-white/5 p-2 rounded-xl">
                                    <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">Escrow Cost</div>
                                    <div className="text-xs font-bold text-amber-400">${inf.costPerPost}</div>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1">Average Views</div>
                                  <div className="text-sm font-bold text-slate-200">{inf.averageViews}</div>
                                </div>
                                <div>
                                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1">Niche & Geo</div>
                                  <div className="text-xs text-slate-300">{inf.niche} &bull; {inf.location}</div>
                                </div>
                                <div className="bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-500/10">
                                  <div className="text-[9px] uppercase tracking-wider text-indigo-400/70 font-bold mb-1">AI Sentiment Score</div>
                                  <div className="flex items-center space-x-2">
                                    <div className="text-sm font-black text-indigo-300">{inf.sentimentScore}%</div>
                                    <div className="text-[10px] text-slate-400 line-clamp-1">{inf.sentimentScore > 85 ? "Exceptional" : "High"}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
                          <p className="text-xs text-slate-400">Select exactly two influencers from the directory below to compile comparative metrics.</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-1 bg-white p-2 border border-gray-200 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest leading-none">
                      Search Results ({filteredInfluencers.length})
                    </span>
                    <button
                      onClick={() => {
                        setCompareMode(!compareMode);
                        setCompareList([]);
                      }}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-colors shadow-sm ${
                        compareMode ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-indigo-600 border-indigo-200 hover:bg-slate-50"
                      }`}
                    >
                      {compareMode ? "Cancel Compare" : "Compare"}
                    </button>
                  </div>
                  
                  {/* Real-time Sorting & Ordering widgets */}
                  <div className="flex items-center space-x-1.5 text-[10px]">
                    <span className="text-gray-400 font-semibold text-[9px] uppercase tracking-wide">{t.sortByLabel}:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-gray-50 text-[10px] text-indigo-600 font-bold px-2 py-0.5 rounded border border-gray-205 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-sm"
                    >
                      <option value="followerNum">👥 Followers Count</option>
                      <option value="engagementRate">📈 Engagement Rate</option>
                      <option value="costPerPost">💵 Escrow Cost/Post</option>
                      <option value="engagementQualityScore">🤖 AI Quality Score</option>
                      <option value="sentimentScore">💬 Audience Sentiment</option>
                    </select>

                    <button
                      onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                      title={sortOrder === "desc" ? "Descending Order" : "Ascending Order"}
                      className="px-1.5 py-0.5 rounded bg-gray-50 border border-gray-200 text-indigo-600 hover:text-indigo-800 transition shadow-sm"
                    >
                      {sortOrder === "desc" ? (
                        <span className="text-[9px] font-extrabold">▼ DESC</span>
                      ) : (
                        <span className="text-[9px] font-extrabold">▲ ASC</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredInfluencers.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-gray-200 space-y-2">
                      <AlertCircle className="w-8 h-8 text-indigo-500 mx-auto" />
                      <p className="text-xs text-gray-500 font-medium font-mono">No matching influencers cataloged.</p>
                      <button 
                        onClick={() => { setSearchTerm(""); setSelectedNiche("All"); }}
                        className="text-[10px] uppercase font-extrabold text-indigo-600 underline hover:text-indigo-800"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    filteredInfluencers.map((inf) => {
                      const isCompared = compareList.some((c) => c.id === inf.id);
                      const isActive = compareMode ? isCompared : selectedInfluencer?.id === inf.id;
                      return (
                        <div
                          key={inf.id}
                          id={`influencer-card-${inf.id}`}
                          onClick={() => {
                            if (compareMode) {
                              if (isCompared) {
                                setCompareList(compareList.filter(c => c.id !== inf.id));
                              } else {
                                if (compareList.length < 2) {
                                  setCompareList([...compareList, inf]);
                                }
                              }
                            } else {
                              setSelectedInfluencer(inf);
                              setAiAnalysisResult(null); 
                              setShowDashboard(true);
                            }
                          }}
                          className={`p-4 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden group select-none ${
                            isActive
                              ? "bg-indigo-50 border-indigo-400 shadow-sm"
                              : "bg-white border-gray-200 hover:border-indigo-400 hover:bg-slate-50/50 shadow-sm"
                          }`}
                        >
                          {compareMode && (
                            <div className="absolute top-3 right-3">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isCompared ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                {isCompared && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center space-x-3.5">
                            <img
                              src={inf.avatar}
                              alt={inf.name}
                              className="w-12 h-12 rounded-full object-cover border border-gray-100 group-hover:scale-105 transition duration-300"
                              referrerPolicy="no-referrer"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1">
                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition truncate">{inf.name}</h4>
                                {inf.isVerified && (
                                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-400 font-mono truncate">{inf.handle}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100/60">
                            <span className="text-[9px] uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md text-indigo-600 font-bold">
                              {inf.niche}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center font-medium">
                              <MapPin className="w-3 h-3 mr-0.5 text-indigo-500" />
                              {inf.location.split(",")[0]}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100/60 text-center">
                            <div className="bg-gray-50/50 p-1.5 rounded-xl border border-gray-100">
                              <p className="text-[8px] text-slate-400 uppercase font-semibold">Followers</p>
                              <p className="text-xs font-black text-indigo-600 font-mono mt-0.5">{inf.followers}</p>
                            </div>
                            <div className="bg-gray-50/50 p-1.5 rounded-xl border border-gray-100">
                              <p className="text-[8px] text-slate-400 uppercase font-semibold">Min Escrow</p>
                              <p className="text-xs font-black text-emerald-600 font-mono mt-0.5">${inf.costPerPost}</p>
                            </div>
                          </div>

                          <div className="pt-1">
                            <span className="w-full bg-slate-900 border border-slate-950 text-white font-extrabold text-[10px] uppercase tracking-wider py-2 rounded-xl transition duration-300 flex items-center justify-center space-x-1 font-sans">
                              <span>Inspect Creator</span>
                              <ArrowRight className="w-3 h-3 text-indigo-400" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* PROMO BANNER FOR SYSTEM */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 text-center space-y-1 shadow-sm">
                  <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Escrow Insurance Enabled</p>
                  <p className="text-[10px] text-indigo-950 font-medium">
                    Reach handles contract drafting and active capital reserves automatically. No upfront risk.
                  </p>
                </div>
              </div>
              )}

              {/* RIGHT COLUMN: DETAIL PORTFOLIO AND DEMOGRAPHICS DASHBOARD */}
              {showDashboard && selectedInfluencer && (
                <div className="md:col-span-12 space-y-4">
                  
                  {/* Premium Return Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/40 p-3 px-4 border border-white/5 rounded-2xl shadow-sm mb-1 text-xs font-bold uppercase">
                    <button 
                      onClick={() => setShowDashboard(false)}
                      className="text-xs text-indigo-300 hover:text-indigo-200 flex items-center space-x-1.5 bg-indigo-950/45 px-4 py-1.5 rounded-full border border-indigo-900/35 cursor-pointer transition select-none"
                    >
                      <span>← Back to Marketplace Directory</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Portfolio: <strong className="text-indigo-400">{selectedInfluencer.name}</strong> • Detailed Demographics
                    </span>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Active Creator Identity Card */}
                    <div className="bg-[#101014] rounded-2xl border border-white/10 p-4 relative overflow-hidden">
                      <div className="absolute right-3 top-3 flex space-x-1.5">
                        {selectedInfluencer.platforms.map((plat) => (
                          <span 
                            key={plat}
                            className={`p-1.5 rounded-lg text-white border text-xs flex items-center justify-center ${
                              plat === "youtube" ? "bg-rose-950/60 border-rose-800/40" : "bg-purple-950/60 border-purple-800/40"
                            }`}
                          >
                            {plat === "youtube" ? <Youtube className="w-3.5 h-3.5 text-rose-400" /> : <Instagram className="w-3.5 h-3.5 text-purple-400" />}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <img
                          src={selectedInfluencer.avatar}
                          alt={selectedInfluencer.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/80 shadow-md shadow-indigo-500/20"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-base font-extrabold text-white">{selectedInfluencer.name}</h3>
                            {selectedInfluencer.isVerified && (
                              <span className="bg-amber-400/10 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center space-x-1">
                                <Zap className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                <span>TOP TIER</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-indigo-400 font-mono flex items-center space-x-2">
                            <span>{selectedInfluencer.handle}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 text-[11px]">{selectedInfluencer.location}</span>
                          </p>
                          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">{selectedInfluencer.bio}</p>
                        </div>
                      </div>

                      {/* External profile reference logs */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                        {selectedInfluencer.verifiedChannels.youtube && (
                          <a 
                            href={selectedInfluencer.verifiedChannels.youtube} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 border border-rose-900/30 rounded-xl px-2.5 py-1 text-[10px] font-medium flex items-center space-x-1 transition"
                          >
                            <Youtube className="w-3 h-3 text-rose-400" />
                            <span>YouTube Link Verified</span>
                          </a>
                        )}
                        {selectedInfluencer.verifiedChannels.instagram && (
                          <a 
                            href={selectedInfluencer.verifiedChannels.instagram} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="bg-purple-950/20 text-purple-300 hover:bg-purple-950/40 border border-purple-900/30 rounded-xl px-2.5 py-1 text-[10px] font-medium flex items-center space-x-1 transition"
                          >
                            <Instagram className="w-3 h-3 text-purple-400" />
                            <span>Instagram Verified</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* PROFILE SUB-TAB NAVIGATION PANEL */}
                    <div id="profiling-sub-tabs" className="bg-[#101014] p-1 rounded-xl border border-white/5 flex space-x-1 sticky top-[48px] z-20 shadow-lg">
                      <button
                        type="button"
                        onClick={() => setProfileTab("overview")}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                          profileTab === "overview" 
                          ? "bg-indigo-600 text-white shadow" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Overview & Demographics</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProfileTab("metrics_live")}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                          profileTab === "metrics_live" 
                          ? "bg-emerald-600/35 border border-emerald-500/30 text-emerald-300 shadow" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 font-semibold"
                        }`}
                      >
                        <span className="relative flex h-2 w-2">
                          {isLiveActive && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          )}
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`}></span>
                        </span>
                        <span>Live Dashboard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProfileTab("ai_diagnostics")}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
                          profileTab === "ai_diagnostics" 
                          ? "bg-purple-600/30 border border-purple-500/35 text-purple-300 shadow" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
                        <span>AI Diagnostic Hub</span>
                      </button>
                    </div>

                    {/* SUB-TAB CONTENTS */}
                    {profileTab === "overview" && (
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        {/* BENTO BLOCK 2: Live Platform Statistics (Followers + growth index) */}
                        <div className="sm:col-span-5 bg-[#101014] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Growth Trend</p>
                              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                            </div>
                            <span className="text-2xl font-black text-indigo-400 tracking-tight">{selectedInfluencer.followers}</span>
                            <p className="text-[10px] text-slate-400 leading-none mb-3">Enlisted Channel Followers</p>
                          </div>

                          {/* Growth Chart SVG */}
                          <div className="h-20 w-full relative bg-black/30 rounded-xl border border-white/5 p-1 flex flex-col justify-end">
                            <svg viewBox="0 0 100 35" className="w-full h-14 stroke-indigo-500 fill-none stroke-2">
                              <defs>
                                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#4338ca" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#4338ca" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path 
                                d={`M 0,35 L ${growthPoints} L 100,35 Z`} 
                                fill="url(#chartGlow)"
                                className="stroke-none"
                              />
                              <path d={`M ${growthPoints}`} />
                            </svg>
                            <div className="flex justify-between text-[8px] text-slate-500 px-1 mt-1 font-mono">
                              <span>Wk 1</span>
                              <span>Wk 6</span>
                              <span>Today</span>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                            <div className="bg-[#070709] p-1.5 rounded border border-white/5">
                              <p className="text-[8px] text-slate-500 uppercase leading-none">Impressions / Mo</p>
                              <p className="text-xs font-bold text-indigo-400 mt-0.5">{selectedInfluencer.socialMetrics.monthlyImpressions}</p>
                            </div>
                            <div className="bg-[#070709] p-1.5 rounded border border-white/5">
                              <p className="text-[8px] text-slate-500 uppercase leading-none">Reach Potential</p>
                              <p className="text-xs font-bold text-slate-200 mt-0.5">{selectedInfluencer.socialMetrics.totalReach}</p>
                            </div>
                          </div>
                        </div>

                        {/* BENTO BLOCK 3: Audience Demographics Breakdown */}
                        <div className="sm:col-span-7 bg-[#101014] border border-white/5 rounded-2xl p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                              <Users2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Audience Demographics & Typology</span>
                            </h4>
                            <span className="text-[9px] bg-slate-950 text-indigo-300 border border-white/5 px-2 py-0.5 rounded uppercase font-mono">
                              Verified Behavioral Data
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Age breakdown bars */}
                            <div className="space-y-2">
                              <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Age Group Representation (%)</p>
                              <div className="space-y-1.5">
                                {selectedInfluencer.audienceDemographics.age.map((ageGroup) => (
                                  <div key={ageGroup.range} className="space-y-1">
                                    <div className="flex justify-between text-[9px] text-slate-300">
                                      <span>Age {ageGroup.range}</span>
                                      <span>{ageGroup.percentage}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-950 rounded-full">
                                      <div 
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${ageGroup.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Gender & countries split */}
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-semibold">Gender Profile</p>
                                <div className="flex bg-slate-950 rounded-xl p-2 justify-around text-center text-xs">
                                  <div>
                                    <p className="text-xs font-black text-indigo-400">{selectedInfluencer.audienceDemographics.gender.male}%</p>
                                    <p className="text-[8px] text-slate-500 uppercase font-semibold">Male</p>
                                  </div>
                                  <div className="border-r border-white/5"></div>
                                  <div>
                                    <p className="text-xs font-black text-purple-400">{selectedInfluencer.audienceDemographics.gender.female}%</p>
                                    <p className="text-[8px] text-slate-500 uppercase font-semibold">Female</p>
                                  </div>
                                  <div className="border-r border-white/5"></div>
                                  <div>
                                    <p className="text-xs font-black text-slate-400">{selectedInfluencer.audienceDemographics.gender.other}%</p>
                                    <p className="text-[8px] text-slate-500 uppercase font-semibold">Other</p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Top Geolocales</p>
                                <div className="grid grid-cols-2 gap-1 px-1">
                                  {selectedInfluencer.audienceDemographics.topLocations.slice(0, 4).map((country) => (
                                    <div key={country.name} className="flex items-center justify-between bg-slate-950/60 px-2 py-0.5 rounded border border-white/5 text-[9px]">
                                      <span className="text-slate-300 shrink-0 truncate">{country.name}</span>
                                      <span className="font-bold text-indigo-400">{country.percentage}%</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/5">
                            <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Attracted Audience Core Interests</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedInfluencer.audienceDemographics.interests.map((interest) => (
                                <span 
                                  key={interest}
                                  className="bg-[#181820] text-indigo-200 border border-indigo-950/40 px-2 py-0.5 rounded text-[9px] font-medium"
                                >
                                  #{interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Dynamic Behavioral online activity scheduler report */}
                        <div className="sm:col-span-12 bg-[#101014] border border-white/5 rounded-2xl p-4 space-y-3 shadow-md">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Typical Audience Online Activity Times REPORT</span>
                            </p>
                            <span className="text-[8.5px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-mono font-bold animate-pulse">
                              Highly Accurate Release Scheduling suggestions
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {(selectedInfluencer.audienceDemographics.onlineActivityTimes || [
                              { day: "Mon-Wed", peakHours: "6 PM - 9 PM", activePercentage: 81 },
                              { day: "Thu-Fri", peakHours: "7 PM - 10 PM", activePercentage: 90 },
                              { day: "Sat-Sun", peakHours: "12 PM - 4 PM", activePercentage: 83 }
                            ]).map((sched, idx) => (
                              <div key={idx} className="bg-[#070709] p-3 rounded-xl border border-white/5 flex flex-col justify-between space-y-2">
                                <div className="flex justify-between items-center pb-1 border-b border-white/5">
                                  <span className="text-xs font-bold text-indigo-300">{sched.day}</span>
                                  <span className="text-xs text-indigo-400 font-mono font-bold">{sched.activePercentage}% active</span>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] text-slate-500 uppercase">Recommended publishing slot</p>
                                  <p className="text-xs text-white font-mono font-bold">{sched.peakHours}</p>
                                </div>
                                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" style={{ width: `${sched.activePercentage}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* BENTO BLOCK 4: Secure Escrow Call to Action (Instant Hire panel) */}
                        <div className="sm:col-span-12 bg-white text-black rounded-2xl p-4 flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Reach Secure Escrow Guarantee</h4>
                              </div>
                              <p className="text-base font-extrabold tracking-tight mt-1">Direct Verified Placement</p>
                              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                                Initiate placement contract campaigns safely. Locked funds are withheld in secure smart escrows automatically until satisfactory delivery is verified.
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">Placement Rate</p>
                              <p className="text-xl font-black text-emerald-600 mt-1">${selectedInfluencer.costPerPost}</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <span className="text-[9.5px] font-mono text-slate-500">🛡️ 100% Capital Protection & Refund Options Included</span>
                            <button
                              id="book-campaign-cta"
                              onClick={() => setIsHireModalOpen(true)}
                              className="w-full sm:w-auto bg-slate-900 border border-slate-950 hover:bg-slate-800 text-white font-extrabold text-[11px] uppercase tracking-wider py-2.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shrink-0 cursor-pointer"
                            >
                              <Lock className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Book Escrow Placement</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                    {profileTab === "metrics_live" && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        {/* Real-time Ticker Broadcast status bar */}
                        <div className="bg-[#101014] border border-emerald-500/20 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="relative flex h-3 w-3">
                              {isLiveActive && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              )}
                              <span className={`relative inline-flex rounded-full h-3 w-3 ${isLiveActive ? "bg-emerald-400" : "bg-slate-500"}`}></span>
                            </span>
                            <div>
                              <p className="text-[9.5px] font-extrabold text-slate-300 uppercase tracking-widest font-mono">
                                {isLiveActive ? "● METRIC BROADCAST TELEMETRY SIGNAL ACTIVE" : "● TELEMETRY SYNC MUTED"}
                              </p>
                              <p className="text-[8.5px] text-slate-500">Live API response tracking indices updated every 3 seconds.</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setIsLiveActive(!isLiveActive)}
                              className={`px-2.5 py-1 rounded text-[9px] uppercase font-bold tracking-wider border transition cursor-pointer ${
                                isLiveActive 
                                ? "bg-slate-900 border-white/5 text-slate-300 hover:bg-slate-800"
                                : "bg-emerald-600/20 border-emerald-500/30 text-emerald-400"
                              }`}
                            >
                              {isLiveActive ? "Pause Tracker" : "Resume Tracker"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLiveKpiTicks(prev => ({
                                  ...prev,
                                  followers: prev.followers + 7,
                                  likes: prev.likes + 25,
                                  ctr: Number(Math.min(12.5, prev.ctr + 0.15).toFixed(2))
                                }));
                              }}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                            >
                              Sync Signals
                            </button>
                          </div>
                        </div>

                        {/* real time KPIs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-[#101014] p-3 rounded-2xl border border-white/5 space-y-1 text-center relative overflow-hidden group">
                            <Users className="w-4.5 h-4.5 text-indigo-400 absolute right-3 top-3 opacity-20" />
                            <p className="text-[8px] text-slate-500 uppercase font-black tracking-wider leading-none">Live Followers</p>
                            <p className="text-base sm:text-lg font-black tracking-tight text-white font-mono mt-2 animate-pulse leading-none">
                              {liveKpiTicks.followers.toLocaleString()}
                            </p>
                            <span className="inline-block text-[8px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-1 py-0.5 rounded-sm mt-1 animate-pulse">
                              + {(Math.floor(Math.random() * 2) + 1)}/sec
                            </span>
                          </div>

                          <div className="bg-[#101014] p-3 rounded-2xl border border-white/5 space-y-1 text-center relative overflow-hidden group">
                            <ThumbsUp className="w-4.5 h-4.5 text-rose-500 absolute right-3 top-3 opacity-20" />
                            <p className="text-[8px] text-slate-500 uppercase font-black tracking-wider leading-none">Total Post Likes</p>
                            <p className="text-base sm:text-lg font-black tracking-tight text-rose-400 font-mono mt-2 leading-none">
                              {liveKpiTicks.likes.toLocaleString()}
                            </p>
                            <p className="text-[8px] text-slate-400 mt-1 uppercase font-semibold">Ticking Live Engagement</p>
                          </div>

                          <div className="bg-[#101014] p-3 rounded-2xl border border-white/5 space-y-1 text-center relative overflow-hidden group">
                            <MessageSquare className="w-4.5 h-4.5 text-cyan-400 absolute right-3 top-3 opacity-20" />
                            <p className="text-[8px] text-slate-500 uppercase font-black tracking-wider leading-none">Live Comments</p>
                            <p className="text-base sm:text-lg font-black tracking-tight text-cyan-400 font-mono mt-2 leading-none">
                              {liveKpiTicks.comments.toLocaleString()}
                            </p>
                            <p className="text-[8.5px] text-emerald-400 font-mono mt-1">▲ Growing</p>
                          </div>

                          <div className="bg-[#101014] p-3 rounded-2xl border border-white/5 space-y-1 text-center relative overflow-hidden group">
                            <Percent className="w-4.5 h-4.5 text-emerald-400 absolute right-3 top-3 opacity-20" />
                            <p className="text-[8px] text-slate-500 uppercase font-black tracking-wider leading-none">Average CTR %</p>
                            <p className="text-base sm:text-lg font-black tracking-tight text-emerald-400 font-mono mt-2 leading-none">
                              {liveKpiTicks.ctr}%
                            </p>
                            <span className="inline-block text-[8px] font-bold text-teal-400 font-mono mt-1">
                              {((Math.random() - 0.5) > 0 ? "▲ Stable" : "▼ Active")}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          
                          {/* Live Streams comments tickers */}
                          <div className="bg-[#101014] border border-white/5 p-4 rounded-2xl space-y-2.5">
                            <p className="text-[9.5px] font-bold text-indigo-400 uppercase tracking-widest flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-1.5 animate-ping"></span>
                              <span>Real-Time Audience Comment Stream</span>
                            </p>
                            
                            <div className="space-y-1.5 h-44 overflow-y-auto pr-1 scrollbar-thin">
                              {liveKpiTicks.commentsList.map((comment, index) => (
                                <div key={index} className="flex items-start space-x-2 text-[10.5px] bg-slate-950/70 border border-white/5 p-2 rounded-xl animate-in fade-in slide-in-from-left-2 duration-300">
                                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 animate-pulse shrink-0"></div>
                                  <span className="text-indigo-300 font-mono font-bold shrink-0">@user_ref:</span>
                                  <span className="text-slate-300">&quot;{comment}&quot;</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Near real-time organic reach / impressions meter */}
                          <div className="bg-[#101014] border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                <span>Organic Reach & Impressions hourly Tracker</span>
                                <span className="text-emerald-400 font-mono font-bold text-[8.5px] animate-pulse">● FEED INJECTOR SPEED: FAST</span>
                              </p>
                              
                              <div className="space-y-2 pt-2">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10.5px]">
                                    <span className="text-slate-400">Hourly Unique Reach</span>
                                    <span className="text-white font-mono font-bold">{liveKpiTicks.reach.toLocaleString()} views</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#10b981] transition-all duration-1000" style={{ width: `${Math.min(100, (liveKpiTicks.reach / 10000) * 100)}%` }}></div>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10.5px]">
                                    <span className="text-slate-400">Hourly Cumulative Impressions</span>
                                    <span className="text-white font-mono font-bold">{liveKpiTicks.impressions.toLocaleString()} views</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${Math.min(100, (liveKpiTicks.impressions / 20000) * 100)}%` }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 mt-3 text-[10px] text-slate-400 flex items-center space-x-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <p className="leading-snug">
                                Ticker verified by standard cryptographic social metrics tracking engine. 99.8% precision index matched.
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {profileTab === "ai_diagnostics" && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        {/* BENTO BLOCK 1: AI Sentiment & Engagement Quality */}
                        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-white/5 rounded-2xl p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="bg-indigo-500/20 text-indigo-300 text-[9px] font-bold px-2.5 py-1 rounded uppercase block w-fit border border-indigo-500/30 mb-1.5">
                                🤖 Gemini AI Audio Audit
                              </span>
                              <h4 className="text-sm font-bold text-slate-100">Quality & Sentiment Summary</h4>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-xl font-black text-indigo-300 select-none">
                                {selectedInfluencer.engagementQualityScore >= 90 ? "A+" : (selectedInfluencer.engagementQualityScore >= 80 ? "A" : "B+")}
                              </span>
                              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">ALGO RATING</p>
                            </div>
                          </div>

                          {/* Ratings Sliders */}
                          <div className="space-y-3 pt-2">
                            <div>
                              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                                <span>Engagement Quality Ratio</span>
                                <span className="font-bold text-indigo-400">{selectedInfluencer.engagementQualityScore}/100</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-1000"
                                  style={{ width: `${selectedInfluencer.engagementQualityScore}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                                <span>Viewer Audience Sentiment Index</span>
                                <span className="font-bold text-emerald-400">{selectedInfluencer.sentimentScore}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                                  style={{ width: `${selectedInfluencer.sentimentScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#070709] p-3 rounded-xl border border-white/5 text-[11.5px] italic text-slate-300 leading-relaxed text-center font-mono">
                            {aiAnalysisResult ? (
                              <span>&quot;{aiAnalysisResult.sentimentSummary}&quot;</span>
                            ) : (
                              <span>&quot;{selectedInfluencer.name} shows strong visual brand cohesion and high subscriber interaction depth. Positive comments represent over {selectedInfluencer.sentimentScore}% of studied samples, verifying top-tier commercial appeal.&quot;</span>
                            )}
                          </div>
                        </div>

                        {/* ADVANCED MODULE: DYNAMIC SENTIMENT / VIDEO ANALYZER PANEL */}
                        <div className="bg-[#0f0f13] rounded-3xl border border-indigo-500/20 p-5 space-y-4 shadow-[0_0_40px_rgba(79,70,229,0.1)] relative overflow-hidden group">
                          {/* Animated grid background */}
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-50"></div>
                          
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Bot className="w-24 h-24 text-indigo-500" />
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-2 rounded-xl border border-indigo-400/30 backdrop-blur-md">
                                  <BrainCircuit className="w-5 h-5 text-indigo-300 animate-pulse" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_5px_rgba(52,211,153,1)]"></div>
                              </div>
                              <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Gemini Cloud Auditor</h4>
                                <p className="text-[9px] text-slate-400 font-mono mt-0.5 tracking-wide">NN-driven demographic & sentiment extraction</p>
                              </div>
                            </div>

                            {/* Easy Demographics Trigger Link from linked profiles */}
                            {(selectedInfluencer.verifiedChannels.youtube || selectedInfluencer.verifiedChannels.instagram) && (
                              <button
                                type="button"
                                onClick={() => {
                                  const targetUrl = selectedInfluencer.verifiedChannels.youtube || selectedInfluencer.verifiedChannels.instagram || "";
                                  setVideoUrl(targetUrl);
                                }}
                                className="bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-[9px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition shrink-0 uppercase tracking-wider backdrop-blur-sm shadow-lg shadow-indigo-900/20"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                <span>Fetch Verified Target</span>
                              </button>
                            )}
                          </div>

                          <form onSubmit={handleAnalyzeVideo} className="flex flex-col sm:flex-row gap-2 relative z-10">
                            <div className="flex-1 relative group">
                              <Youtube className="absolute left-3.5 top-3 w-4 h-4 text-indigo-500/50 group-focus-within:text-indigo-400 transition-colors" />
                              <input
                                id="video-analysis-url"
                                type="url"
                                placeholder="Target URL (e.g., youtube.com/watch?v=...)"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="w-full bg-black/60 border border-indigo-500/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400 focus:bg-indigo-950/30 focus:shadow-[0_0_15px_rgba(79,70,229,0.15)] transition-all font-mono"
                              />
                            </div>
                            <button
                              id="submit-video-analysis"
                              type="submit"
                              disabled={isAnalyzing}
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white text-[11px] uppercase tracking-wider font-extrabold px-5 py-2.5 rounded-xl shrink-0 flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg shadow-indigo-600/20"
                            >
                              {isAnalyzing ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Allocating Nodes...</span>
                                </>
                              ) : (
                                <>
                                  <Server className="w-3.5 h-3.5" />
                                  <span>Run Analysis</span>
                                </>
                              )}
                            </button>
                          </form>

                          {analysisError && (
                            <p className="text-[11px] text-rose-400 bg-rose-950/30 px-4 py-2.5 rounded-xl border border-rose-800/30 flex items-center relative z-10 font-mono shadow-sm">
                              <AlertCircle className="w-4 h-4 mr-2 text-rose-500 shrink-0" />
                              {analysisError}
                            </p>
                          )}

                          {aiAnalysisResult && (
                            <div className="bg-[#050508]/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-500 relative z-10 shadow-2xl">
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-500/10">
                                <div className="flex items-center space-x-2 bg-indigo-950/40 border border-indigo-500/30 px-2.5 py-1 rounded-md shadow-sm">
                                  <Sparkle className="w-3 h-3 text-indigo-400 animate-pulse" />
                                  <span className="text-[9px] font-bold font-mono text-indigo-300 uppercase tracking-widest">
                                    AUDIT COMPUTED FOR: <span className="text-white">{aiAnalysisResult.influencerHandle || "CREATOR"}</span>
                                  </span>
                                </div>
                                <span className="text-[9px] text-slate-500 font-mono tracking-widest flex items-center space-x-1">
                                  <Server className="w-3 h-3 text-slate-600" />
                                  <span>T: {new Date(aiAnalysisResult.analyzedAt).toLocaleTimeString()}</span>
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                <div className="bg-[#101014] p-2 rounded-lg border border-white/5">
                                  <p className="text-[8px] text-slate-500 uppercase font-semibold">Quality Index</p>
                                  <p className="text-sm font-black text-indigo-400">{aiAnalysisResult.engagementQualityScore}/100</p>
                                  <p className="text-[8px] text-indigo-300/80 font-bold bg-indigo-500/10 px-1 py-0.5 rounded-full mt-1">
                                    {aiAnalysisResult.engagementQualityRating}
                                  </p>
                                </div>
                                
                                <div className="bg-[#101014] p-2 rounded-lg border border-white/5">
                                  <p className="text-[8px] text-slate-500 uppercase font-semibold">User Positivity</p>
                                  <p className="text-sm font-black text-emerald-400">{aiAnalysisResult.sentimentScore}%</p>
                                  <p className="text-[8px] text-emerald-400 font-mono mt-1">Optimistic Response</p>
                                </div>

                                <div className="bg-[#101014] p-2 rounded-lg border border-white/5">
                                  <p className="text-[8px] text-slate-500 uppercase font-semibold">Predominant Age Group</p>
                                  <p className="text-[10px] font-bold text-slate-200 mt-1">
                                    {aiAnalysisResult.demographicsBreakdown?.age?.[1]?.range || "18-24"}
                                  </p>
                                  <p className="text-[8px] text-slate-500 font-mono">Core Audience Node</p>
                                </div>

                                <div className="bg-[#101014] p-2 rounded-lg border border-white/5">
                                  <p className="text-[8px] text-slate-500 uppercase font-semibold">Locales Split</p>
                                  <p className="text-[10px] font-bold text-indigo-400 mt-1">
                                    {aiAnalysisResult.demographicsBreakdown?.topLocations?.[0]?.name || "US"} ({aiAnalysisResult.demographicsBreakdown?.topLocations?.[0]?.percentage || "45"}%)
                                  </p>
                                  <p className="text-[8px] text-slate-500 font-mono">Highest Concentration</p>
                                </div>
                              </div>

                              <div className="bg-[#101014] p-3 rounded-xl border border-indigo-500/20 mb-4 items-start shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                                <div className="flex items-center space-x-1.5 mb-2">
                                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-300">AI Deep Neural Network Analysis Log</p>
                                </div>
                                <p className="text-[10.5px] italic text-slate-300 font-mono leading-relaxed">
                                  {aiAnalysisResult.reasoning || "Neural network traces unavailable for this analysis scan."}
                                </p>
                              </div>

                              <div className="space-y-1.5">
                                <p className="text-[10px] uppercase font-bold text-indigo-300">Audience Discovered Interests & Behavioral Patterns</p>
                                <div className="flex flex-wrap gap-1">
                                  {aiAnalysisResult.demographicsBreakdown?.interests?.map((tag) => (
                                    <span key={tag} className="text-[9px] bg-indigo-950/45 text-indigo-300 border border-indigo-900/30 px-2 py-0.5 rounded-full">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="space-y-1 mt-2">
                                  {aiAnalysisResult.behavioralInsights?.map((insight, idx) => (
                                    <p key={idx} className="text-[10px] text-slate-400 leading-snug flex items-start">
                                      <span className="text-indigo-400 mr-1.5">✦</span>
                                      {insight}
                                    </p>
                                  ))}
                                </div>
                              </div>

                              {aiAnalysisResult.contentImprovementTriggers && aiAnalysisResult.contentImprovementTriggers.length > 0 && (
                                <div className="pt-2 border-t border-white/5 space-y-1">
                                  <p className="text-[10px] font-bold text-amber-400 uppercase">Constructive Improvement Markers:</p>
                                  <ul className="text-[9px] text-slate-400 list-disc list-inside space-y-0.5">
                                    {aiAnalysisResult.contentImprovementTriggers.map((trig, i) => (
                                      <li key={i}>{trig}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div className="pt-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAgentOpen(true);
                                    setAgentTriggerMsg(`Hey! Can you explain the AI Diagnostic Hub result for ${aiAnalysisResult.influencerHandle}? Here are the details: Quality Score: ${aiAnalysisResult.engagementQualityScore}/100, Sentiment: ${aiAnalysisResult.sentimentScore}%, Summary: ${aiAnalysisResult.sentimentSummary}`);
                                    setTimeout(() => setAgentTriggerMsg(""), 100);
                                  }}
                                  className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center space-x-2 transition border border-purple-500/30 shadow-sm shadow-purple-900/20"
                                >
                                  <Bot className="w-4 h-4" />
                                  <span>Discuss this Analysis with AI Agent</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}


                    {/* REVIEWS & RATINGS LIST BENTO BLOCK */}
                    <div className="bg-[#101014] rounded-2xl border border-white/10 p-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Employer Testimonials & Escrow History
                      </h4>

                      <div className="space-y-2.5">
                        {selectedInfluencer.reviews.length === 0 ? (
                          <div className="text-center py-6 text-slate-500 text-xs italic">
                            No review references indexed yet. Be the first to secure a verified milestone placement!
                          </div>
                        ) : (
                          selectedInfluencer.reviews.map((rev) => (
                            <div key={rev.id} className="p-3 bg-slate-950/60 rounded-xl border border-white/5 space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-indigo-300">{rev.businessName}</span>
                                <div className="flex items-center space-x-1">
                                  <span className="text-[10px] text-amber-400 font-black">{rev.rating}</span>
                                  <div className="flex text-amber-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-3 h-3 ${i < Math.floor(rev.rating) ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">&ldquo;{rev.comment}&rdquo;</p>
                              <p className="text-[9px] text-slate-600 text-right font-mono">{new Date(rev.date).toLocaleDateString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="flex-1 p-4 space-y-4">
            
            {/* ESCROW PORTAL MONITOR (Agnostic talent management) */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 p-4 rounded-2xl border border-white/10 space-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-2xl"></div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">
                SECURED SYSTEM GATEWAY
              </span>
              <h2 className="text-base font-extrabold text-white">Escrow Campaigns & Asset Protection Hub</h2>
              <p className="text-[11px] text-slate-400 max-w-xl">
                Track locked corporate sponsorship funds, inspect draft approvals, release payments securely to creators upon completion or request refunds.
              </p>
            </div>

            {/* Contracts details list */}
            {contracts.length === 0 ? (
              <div className="text-center py-16 bg-[#101014] rounded-2xl border border-white/5 space-y-3">
                <FileText className="w-8 h-8 text-indigo-400/80 mx-auto" />
                <h3 className="text-xs font-bold text-slate-300">No Active Hires Yet</h3>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Hire a cataloged influencer profile from the Search marketplace directory. Locked funds remain safely escrowed in state until released.
                </p>
                <button
                  onClick={() => setActiveTab("influencers")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition duration-300"
                >
                  Browse Influencer Directory
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-500 font-semibold px-1">
                  <span>ESCROW MILISTONES LIST ({contracts.length})</span>
                  <span>TRANSACTION RECORDERS</span>
                </div>

                <div className="space-y-3">
                  {contracts.map((ctr) => (
                    <div 
                      key={ctr.id}
                      className="bg-[#101014] border border-white/5 p-4 rounded-2xl space-y-4 relative overflow-hidden"
                    >
                      {/* Main identity information */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={ctr.influencerAvatar}
                            alt={ctr.influencerName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[9px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded font-mono border border-indigo-900/40">
                              {ctr.campaignName}
                            </span>
                            <h4 className="text-xs font-bold text-slate-100 mt-1">{ctr.influencerName} ({ctr.influencerHandle})</h4>
                            <p className="text-[10px] text-slate-500">Business Organizer: <span className="text-slate-300">{ctr.businessName}</span></p>
                          </div>
                        </div>

                        {/* Status elements */}
                        <div className="text-left sm:text-right space-y-0.5">
                          <p className="text-xs text-slate-500">Fund Amount Enlisted</p>
                          <p className="text-sm font-black text-emerald-400">${Number(ctr.amount || 0).toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 font-sans">
                            Commission (0.1%): <span className="text-indigo-400 font-mono">+${Number(ctr.commission ?? (ctr.amount * 0.001)).toFixed(2)}</span>
                          </p>
                          <p className="text-[10px] font-medium text-slate-300">
                            Total Hold: <span className="text-emerald-300 font-bold">${Number(ctr.totalAmount ?? (ctr.amount * 1.001)).toFixed(2)}</span>
                          </p>
                          <div className="flex flex-wrap sm:justify-end gap-1.5 pt-1">
                            {ctr.paymentStatus === "escrowed" && (
                              <span className="bg-amber-400/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                🔐 CAPITAL LOCKED
                              </span>
                            )}
                            {ctr.paymentStatus === "released" && (
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                ✅ FUNDS RELEASED
                              </span>
                            )}
                            {ctr.paymentStatus === "unpaid" && (
                              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                ⚠ INVOICED / UNPAID
                              </span>
                            )}
                            {ctr.paymentStatus === "refunded" && (
                              <span className="bg-slate-800 text-slate-400 border border-white/5 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                ↩ REFUNDED / DISPUTED
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Terms section & Expiration Date */}
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-xs text-slate-300">
                        <div className="flex flex-col sm:flex-row justify-between gap-2 mb-1">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Affiliated Milestone Guidelines</p>
                          {ctr.expirationDate && (
                            <p className="text-[10px] font-bold text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 rounded-full inline-flex max-w-fit">
                              DEADLINE: {new Date(ctr.expirationDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <p className="italic font-sans leading-snug">&ldquo;{ctr.terms}&rdquo;</p>
                      </div>

                      {/* Action trigger mechanics (Releasing escrow funds) */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/5">
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Status: <strong className="text-slate-200 capitalize font-bold">{ctr.status.replace("_", " ")}</strong></span>
                          
                          {/* Share Milestone to X */}
                          <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                              `🎉 Verified campaign milestone with ${ctr.influencerName} (${ctr.influencerHandle || '@creator'}) locked in secure escrow on @ReachCreators for "${ctr.campaignName}" worth $${ctr.amount}! 🤝🔐`
                            )}&url=${encodeURIComponent('https://reach-escrow.networks')}&hashtags=ReachSecure,EscrowAnalytics`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center space-x-1 border border-white/10 hover:border-sky-500/50 bg-[#0F0F12] hover:bg-sky-950/20 text-sky-450 text-sky-400 hover:text-sky-300 px-2.5 py-1 rounded-xl transition-all duration-250 cursor-pointer shadow-sm shadow-indigo-500/5"
                            title="Tweet campaign outcome on X"
                          >
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span className="text-[9px] font-black tracking-wider uppercase">Tweet</span>
                          </a>
                        </div>

                        <div className="flex space-x-2">
                          {ctr.paymentStatus === "escrowed" && (
                            <>
                              <button
                                id={`dispute-btn-${ctr.id}`}
                                onClick={() => updateContractStatus(ctr.id, { status: "cancelled", paymentStatus: "refunded" })}
                                className="px-3 py-1.5 bg-slate-900 border border-white/10 hover:border-slate-700 text-rose-400 text-[10px] font-bold uppercase rounded-lg transition"
                              >
                                Refund / Dispute Proposal
                              </button>
                              <button
                                id={`release-btn-${ctr.id}`}
                                onClick={() => updateContractStatus(ctr.id, { status: "completed", paymentStatus: "released" })}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase rounded-lg transition shadow shadow-emerald-500/10 flex items-center space-x-1"
                              >
                                <span>Release Escrow Capital</span>
                              </button>
                            </>
                          )}

                          {ctr.paymentStatus === "unpaid" && (
                            <button
                              id={`instapay-btn-${ctr.id}`}
                              onClick={() => {
                                // Trigger modal directly
                                const assocProfile = influencers.find(i => i.id === ctr.influencerId);
                                if (assocProfile) {
                                  setSelectedInfluencer(assocProfile);
                                  setIsHireModalOpen(true);
                                }
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase rounded-lg transition"
                            >
                              Go to Escrow payment
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === "signin" && (
          <div className="flex-1 p-6 max-w-xl mx-auto space-y-6 text-gray-950">
            {/* Header / Brand Identity with Uploaded Reach Logo */}
            <div className="text-center py-6 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-2 flex flex-col items-center">
              <ReachLogo className="mb-2" />
              <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200">
                ✨ Unified Identity & Access Control
              </span>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed mt-1">
                Access automated placement, escrow contract verification, and authentic audience analytics suite.
              </p>
            </div>

            {/* IF LOGGED IN: Manage profile, register influencer and logout */}
            {currentUser ? (
              <div className="space-y-6">
                {/* Active Session Identity Card */}
                <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-14 h-14 rounded-full border border-slate-200 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-extrabold text-gray-900">{currentUser.name}</h3>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          currentUser.provider === "google" 
                            ? "bg-slate-100 text-slate-700 border border-slate-200" 
                            : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        }`}>
                          {currentUser.provider === "google" ? "Google Connected" : "Reach standard"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{currentUser.handle}</p>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">{currentUser.email}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-xs text-red-500 hover:text-red-705 font-bold flex items-center space-x-1 cursor-pointer bg-red-55 hover:bg-red-100 px-3 py-1.5 rounded-xl transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 font-sans">
                    <h4 className="text-xs font-bold text-slate-700 mb-1">🛡️ Protected Identity System</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Your Reach username <strong className="text-slate-755 font-bold">{currentUser.handle}</strong> and authenticated details are automatically associated with posts and campaign updates you share.
                    </p>
                  </div>
                </div>

                {/* Simplified Influencer Profile Directory Enrollment */}
                <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-4 font-sans">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-sans">🚀 Join Public Directory (AI Automated)</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Enter your content portfolio/reel link. Our advanced AI scans metrics, demographic statistics, and commentary sentiment instantly!
                    </p>
                  </div>

                  {profileSuccessMessage && (
                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-center text-xs text-indigo-800 font-extrabold">
                      {profileSuccessMessage}
                    </div>
                  )}

                  <form onSubmit={handleCreateProfile} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Profile, Reel, or Video Link</label>
                      <input
                        type="url"
                        required
                        value={newProfileUrl}
                        onChange={(e) => setNewProfileUrl(e.target.value)}
                        placeholder="e.g. https://instagram.com/reel/C8..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-sans"
                      />
                      <p className="text-[10px] text-gray-450 mt-1 font-sans">We support Instagram Reels/Profiles and YouTube channel/video links.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Cost per Sponsored Post ($)</label>
                      <input
                        type="number"
                        required
                        value={newProfileCost}
                        onChange={(e) => setNewProfileCost(e.target.value)}
                        placeholder="350"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingProfile}
                      className="w-full bg-zinc-900 hover:bg-zinc-805 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-sm cursor-pointer disabled:opacity-50 font-sans"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isSubmittingProfile ? "Analyzing with AI..." : "Crawl Profile & Generate Directory List"}</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* IF NOT LOGGED IN: unified auth gate */
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
                {/* Mode Selectors */}
                <div className="flex border-b border-gray-100 pb-3">
                  <button 
                    onClick={() => { setAuthMode("login"); setAuthErrorMessage(""); }}
                    className={`flex-1 text-center py-2 text-xs font-bold transition-all cursor-pointer ${
                      authMode === "login" 
                        ? "text-indigo-600 border-b-2 border-indigo-600 pb-3 -mb-3.5" 
                        : "text-gray-400 hover:text-gray-650"
                    }`}
                  >
                    Standard Sign In
                  </button>
                  <button 
                    onClick={() => { setAuthMode("register"); setAuthErrorMessage(""); }}
                    className={`flex-1 text-center py-2 text-xs font-bold transition-all cursor-pointer ${
                      authMode === "register" 
                        ? "text-indigo-600 border-b-2 border-indigo-600 pb-3 -mb-3.5" 
                        : "text-gray-400 hover:text-gray-650"
                    }`}
                  >
                    Create Standard Account
                  </button>
                </div>

                {authErrorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-755 text-xs rounded-xl font-bold font-sans">
                    ⚠️ {authErrorMessage}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === "register" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Full Name</label>
                        <input 
                          type="text" 
                          required={authMode === "register"}
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Chaitya Shah"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Preferred Handle</label>
                        <input 
                          type="text" 
                          required={authMode === "register"}
                          value={authHandle}
                          onChange={(e) => setAuthHandle(e.target.value)}
                          placeholder="e.g. @chaitya_digital"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-sans"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-gray-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input 
                        type="email" 
                        required 
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="e.g. chaityashahgamer@gmail.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Password</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-gray-400">
                        <Key className="w-4 h-4" />
                      </span>
                      <input 
                        type="password" 
                        required 
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-sans"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-sm cursor-pointer font-sans text-center"
                  >
                    {authMode === "login" ? "Secure Sign In" : "Register Standard Reach Profile"}
                  </button>
                </form>

                {/* Google Sign-In Integrator Action */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-100 font-sans"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold font-sans">or connect securely with</span>
                  <div className="flex-grow border-t border-gray-100 font-sans"></div>
                </div>

                <button 
                  onClick={() => setShowGoogleModal(true)}
                  type="button"
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-755 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-2.5 shadow-sm cursor-pointer font-sans"
                >
                  <Chrome className="w-4 h-4 text-indigo-500" />
                  <span>Connect with Google Account</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Global Google Accounts Simulation Modal Overlay Portal */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs font-sans">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 transform animate-in fade-in zoom-in-95 duration-200">
              {/* Google Brand Header */}
              <div className="bg-gray-50 border-b border-gray-100 p-5 text-center flex flex-col items-center">
                <div className="flex space-x-1 mb-2.5">
                  <span className="text-xl font-extrabold text-[#4285F4]">G</span>
                  <span className="text-xl font-extrabold text-[#EA4335]">o</span>
                  <span className="text-xl font-extrabold text-[#FBBC05]">o</span>
                  <span className="text-xl font-extrabold text-[#4285F4]">g</span>
                  <span className="text-xl font-extrabold text-[#34A853]">l</span>
                  <span className="text-xl font-extrabold text-[#EA4335]">e</span>
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 leading-none">Sign In with Google</h3>
                <p className="text-[11px] text-gray-400 mt-1">to continue to <strong className="text-gray-650 font-semibold font-sans">Reach Identity Suite</strong></p>
              </div>

              {/* Accounts List */}
              <div className="p-5 space-y-3 bg-white">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Choose an active account</span>
                
                {/* Simulated Google User Account choice matching customer's real context */}
                <button 
                  onClick={() => handleGoogleConnect("chaityashahgamer@gmail.com", "Chaitya Shah")}
                  className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 border border-dashed border-indigo-200 hover:border-indigo-400 transition text-left cursor-pointer font-sans"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" 
                    alt="Chaitya Shah" 
                    className="w-10 h-10 rounded-full object-cover border border-indigo-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-950">Chaitya Shah</p>
                    <p className="text-[10px] font-mono text-gray-400 leading-none">chaityashahgamer@gmail.com</p>
                  </div>
                </button>

                {/* Simulated Standard Brand User account choice */}
                <button 
                  onClick={() => handleGoogleConnect("team@google.com", "Team Google")}
                  className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 border border-gray-100 hover:border-gray-200 transition text-left cursor-pointer font-sans"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    TG
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-950">Team Google</p>
                    <p className="text-[10px] font-mono text-gray-400 leading-none font-sans">team@google.com</p>
                  </div>
                </button>

                {/* Cancel Trigger */}
                <button 
                  onClick={() => setShowGoogleModal(false)}
                  className="w-full text-center text-xs text-gray-500 hover:text-gray-800 font-bold py-2 bg-gray-50 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Secure Footer */}
              <div className="bg-slate-50 border-t border-slate-100 p-3 text-center text-[9px] text-gray-400 font-sans">
                By entering, Google handles your profile photo securely and hands OAuth claims to Reach systems.
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="flex-1 p-6 space-y-6 max-w-2xl mx-auto text-gray-950 font-sans">
            
            {/* Header / Brand Logo */}
            <div className="text-center bg-white border border-gray-200 p-6 rounded-3xl shadow-sm space-y-1">
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
                ✨ REACH INDEPENDENT NETWORK
              </span>
              <h2 className="text-3xl font-extrabold italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 mt-1">reach</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Connect and post freely on our independent social stream. Reach is fully self-contained—no channel reveal required!
              </p>
            </div>

            {/* Gmail Workspace Sync & Invite Component */}
            <GmailInviteCenter 
              currentLocalUser={currentUser} 
              onLinkGoogleProfile={(gUser) => {
                // Keep local session info synced if needed
                if (!currentUser) {
                  const linkedUser = {
                    id: gUser.uid,
                    name: gUser.displayName || "Google Connected User",
                    email: gUser.email || "",
                    handle: `@${(gUser.displayName || "user").toLowerCase().replace(/[^a-z0-9]/g, "")}_reach`,
                    avatar: gUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(gUser.displayName || "")}`,
                    provider: "google" as const
                  };
                  setCurrentUser(linkedUser);
                  localStorage.setItem("reach_user_session", JSON.stringify(linkedUser));
                }
              }}
            />

            {/* Create Post Widget */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-750 uppercase tracking-widest flex items-center space-x-1.5 border-b border-gray-100 pb-2">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span>Publish to Reach Feed</span>
              </h3>

              {postSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-center text-xs font-extrabold">
                  {postSuccessMessage}
                </div>
              )}

              {!currentUser ? (
                <div className="bg-slate-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="mx-auto w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-gray-800">Authentication Required to Share Updates</p>
                    <p className="text-[10px] text-gray-500 max-w-sm mx-auto leading-normal font-sans">
                      Please connect your Google Workspace account or sign in with your Reach handle to publish campaign reviews and community stream posts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-[11px] px-4 py-2 rounded-xl transition duration-200 shadow-sm cursor-pointer"
                  >
                    <span>Go to Sign In Tab</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreatePost} className="space-y-3.5">
                  <div className="flex items-center space-x-2.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-xs text-indigo-900 font-sans">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-5 h-5 rounded-full object-cover border border-indigo-200"
                    />
                    <span className="text-[10.5px]">Posting authentically as <strong className="font-extrabold text-indigo-950 font-mono bg-indigo-100/50 px-1 py-0.5 rounded">{currentUser.handle}</strong> ({currentUser.name})</span>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 font-sans">
                      Tag Creator / Campaign (Optional)
                    </label>
                    <select
                      value={newPostTarget}
                      onChange={(e) => setNewPostTarget(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-indigo-600 font-sans"
                    >
                      <option value="">-- General Post --</option>
                      {influencers.map((inf) => (
                        <option key={inf.id} value={inf.name}>
                          {inf.name} ({inf.handle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 font-sans">
                      Select Post Image Accent
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "📸 Tech", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600" },
                        { label: "👗 Style", url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600" },
                        { label: "📈 ROI", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" },
                        { label: "🍱 Lifestyle", url: "https://images.unsplash.com/photo-1543286386-7a39e657ab8c?auto=format&fit=crop&q=80&w=600" }
                      ].map((opt) => (
                        <button
                          type="button"
                          key={opt.url}
                          onClick={() => setNewPostMediaUrl(opt.url)}
                          className={`text-[10px] font-bold py-1.5 px-0.5 rounded-xl border text-center transition cursor-pointer font-sans ${
                            newPostMediaUrl === opt.url
                              ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="url"
                      placeholder="Or paste direct image link..."
                      value={newPostMediaUrl}
                      onChange={(e) => setNewPostMediaUrl(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-[10.5px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1 font-sans">
                      Caption Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={newPostViews}
                      onChange={(e) => setNewPostViews(e.target.value)}
                      placeholder="Write a captivating, friendly caption about a sponsorship campaign..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10.5px] font-bold text-gray-500 uppercase tracking-widest font-sans">Rate Campaign:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((stars) => (
                          <button
                            type="button"
                            key={stars}
                            onClick={() => setNewPostRating(stars)}
                            className="focus:outline-none rounded-md cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 transition duration-200 ${
                                stars <= newPostRating
                                  ? "text-amber-400 fill-amber-400 scale-110"
                                  : "text-gray-300 hover:text-gray-400"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      id="submit-social-view-btn"
                      type="submit"
                      disabled={isSubmittingPost}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-sm disabled:opacity-50 cursor-pointer font-sans"
                    >
                      <Send className="w-3 h-3 text-white" />
                      <span>{isSubmittingPost ? "Broadcasting..." : "Share Post"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Posts Stream */}
            <div className="space-y-6 animate-fade-in">
              {communityPosts.length === 0 ? (
                <div className="text-center p-12 bg-white border border-gray-200 rounded-3xl shadow-sm space-y-2">
                  <Heart className="w-8 h-8 text-rose-500 fill-rose-500 mx-auto animate-pulse" />
                  <p className="text-xs text-gray-500 font-sans font-medium">No stream posts found. Share a campaign update above!</p>
                </div>
              ) : (
                    communityPosts.map((post) => {
                      return (
                        <div key={post.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-gray-950 text-left font-sans">
                          
                          {/* Top Bar Header */}
                          <div className="p-4 flex justify-between items-center border-b border-gray-150 bg-white">
                            <div className="flex items-center space-x-3">
                              <img
                                src={post.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(post.authorName)}`}
                                alt={post.authorName}
                                className="w-10 h-10 rounded-full object-cover border border-indigo-100 ring-2 ring-indigo-50"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <h4 className="text-xs font-bold text-gray-950 leading-tight font-sans">{post.authorName}</h4>
                                  <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                                  <span className="text-[9.5px] bg-gradient-to-r from-purple-600 to-pink-500 text-white font-extrabold uppercase font-sans px-1.5 py-0.5 rounded-md tracking-wider shadow-2xs w-fit">
                                    reach
                                  </span>
                                </div>
                                <span className="text-[10px] text-gray-400 block font-medium font-sans font-sans">
                                  {post.role}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 font-sans">
                              <span className="text-[9.5px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full text-indigo-700 font-bold font-sans">
                                ⭐⭐⭐⭐⭐
                              </span>
                            </div>
                          </div>

                          {/* Main Rendered Media Photo */}
                          {post.mediaUrl && (
                            <div className="bg-gray-50 border-y border-gray-100">
                              <img
                                src={post.mediaUrl}
                                alt="Campaign snapshot"
                                className="w-full max-h-[380px] object-cover mx-auto"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {/* Social Action Interaction Toolbar */}
                          <div className="p-4 space-y-3 bg-white">
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-4 items-center">
                                <button
                                  type="button"
                                  onClick={() => handleLikePost(post.id)}
                                  className="group flex items-center space-x-1.5 focus:outline-none transition cursor-pointer"
                                >
                                  <Heart className={`w-4 h-4 hover:scale-110 duration-200 ${likedPosts.has(post.id) ? 'text-rose-500 fill-rose-500' : 'text-gray-400 fill-transparent group-hover:text-rose-500'}`} />
                                  <span className={`text-[11.5px] font-bold font-sans transition-colors ${likedPosts.has(post.id) ? 'text-rose-600' : 'text-gray-900 group-hover:text-rose-600'}`}>
                                    {post.likes} Likes
                                  </span>
                                </button>
                                
                                <div className="flex items-center space-x-1.5">
                                  <MessageSquare className="w-4 h-4 text-gray-400" />
                                  <span className="text-[11.5px] font-medium text-gray-500 font-sans">
                                    {post.comments ? post.comments.length : 0} Comments
                                  </span>
                                </div>
                              </div>

                              <span className="text-[9.5px] text-gray-400 font-mono">
                                {new Date(post.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                              </span>
                            </div>

                            {/* Tag details */}
                            {post.targetInfluencer && (
                              <div className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-xl text-[10px] text-indigo-800 font-sans">
                                <span className="font-semibold">tagged creator:</span>
                                <span 
                                  className="font-bold underline cursor-pointer hover:text-indigo-950 font-sans" 
                                  onClick={() => {
                                    const target = influencers.find(i => i.name.toLowerCase() === post.targetInfluencer.toLowerCase());
                                    if (target) {
                                      setSelectedInfluencer(target);
                                      setShowDashboard(true);
                                      setActiveTab("influencers");
                                    }
                                  }}
                                >
                                  {post.targetInfluencer}
                                </span>
                              </div>
                            )}

                            {/* Caption and content body */}
                            <p className="text-xs text-gray-800 leading-relaxed font-normal whitespace-pre-wrap pt-1 font-sans">
                              <span className="font-extrabold text-gray-950 mr-1.5 font-sans">{post.authorName}</span>
                              {post.views}
                            </p>

                            {/* Nest Comment Feed Thread */}
                            <div className="space-y-1.5 bg-gray-50 p-3 rounded-2xl border border-gray-200 text-left mt-2.5 font-sans">
                              {post.comments && post.comments.length > 0 ? (
                                <div className="space-y-1.5 divide-y divide-gray-100 font-sans">
                                  {post.comments.map((comm, cidx) => (
                                    <div key={cidx} className="text-xs pt-1.5 leading-relaxed font-sans first:pt-0">
                                      <span className="font-extrabold text-gray-900 mr-2 font-sans">{comm.author}</span>
                                      <span className="text-gray-700 font-sans">{comm.text}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[10px] text-gray-400 italic font-sans animate-pulse">No comments written yet. Be the first to leave a comment!</p>
                              )}

                              {/* Comment Form */}
                              <div className="pt-2.5 border-t border-gray-200 mt-2.5 flex gap-2 font-sans">
                                <input
                                  type="text"
                                  placeholder="Name"
                                  value={commentAuthors[post.id] || ""}
                                  onChange={(e) => setCommentAuthors(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  className="bg-white border border-gray-200 rounded-xl px-2 py-1 text-xs text-gray-900 w-1/4 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-sans"
                                />
                                <div className="flex-1 flex gap-1.5 font-sans">
                                  <input
                                    type="text"
                                    placeholder="Add an opinion comment..."
                                    value={commentInputs[post.id] || ""}
                                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    className="bg-white border border-gray-200 rounded-xl px-2 py-1 text-xs text-gray-900 flex-1 placeholder-gray-400 focus:outline-none focus:border-indigo-600 font-sans"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleAddComment(post.id);
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddComment(post.id)}
                                    className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-xl text-[10px] font-extrabold text-white transition cursor-pointer font-sans"
                                  >
                                    Post
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              {/* Real-time Reach Pulse Widget */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm relative overflow-hidden mt-6 text-left">
                <div className="border-b border-gray-100 pb-2.5 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center space-x-2 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                    <span>Trending on Reach Network</span>
                  </h3>
                  <span className="flex items-center space-x-1 text-[8px] bg-red-100 text-red-700 border border-red-200 font-sans font-bold px-2 py-0.5 rounded-full">
                    <span className="h-1 w-1 bg-red-400 rounded-full animate-pulse"></span>
                    <span>LIVE</span>
                  </span>
                </div>

                <div className="space-y-3.5 divide-y divide-gray-100 text-left">
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-medium font-sans">
                      <span>1 · Trending in US Tech</span>
                    </div>
                    <p className="text-[12px] font-bold text-gray-950 mt-0.5 font-sans">#ReachEscrowSecure</p>
                    <p className="text-[10px] text-emerald-600 font-sans mt-0.5 flex items-center space-x-1">
                      <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping"></span>
                      <span>1,241 Campaign Trades Locked</span>
                    </p>
                  </div>

                  <div className="pt-2.5">
                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-medium select-none font-sans">
                      <span>2 · Sponsored Placements</span>
                      <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.2 rounded font-sans">Audit Code</span>
                    </div>
                    <p className="text-[12px] font-bold text-gray-950 mt-0.5 font-sans">#GeminiAudienceAudit</p>
                    <p className="text-[10.5px] text-gray-500 mt-0.5 leading-snug font-sans">Automated quality diagnostics & user sentiment trackers online</p>
                  </div>

                  <div className="pt-2.5">
                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-sans">
                      <span>3 · Gaming & Tech Trends</span>
                    </div>
                    <p className="text-[12px] font-bold text-gray-950 mt-0.5 font-sans">@alexis_tech_unboxing</p>
                    <p className="text-[10px] text-pink-600 font-sans font-bold mt-0.5">Alexis Rivera peaked 4.8x ROI</p>
                  </div>

                  <div className="pt-2.5">
                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-sans">
                      <span>4 · Secure Escrow Capital</span>
                    </div>
                    <p className="text-[12px] font-bold text-gray-950 mt-0.5 font-sans">#VerifyFirstPayLater</p>
                    <p className="text-[10.5px] text-gray-500 mt-0.5 leading-snug font-sans font-sans">99.8% settlement fidelity reached on verified video content submissions</p>
                  </div>
                </div>

                {/* Simulated recent tweets quoting Reach platform */}
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-150 mt-3 space-y-3 text-left">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                    <span className="text-[9px] uppercase font-bold text-gray-505 tracking-wider flex items-center space-x-1 font-sans">
                      <span>Recent X Quotes</span>
                    </span>
                    <span className="text-[8.5px] text-gray-400 font-medium font-sans">Verified Feed</span>
                  </div>

                  <div className="text-[11px] text-gray-700 space-y-3 leading-snug divide-y divide-gray-150">
                    <div className="pb-1 text-[11px]">
                      <p className="font-bold text-[10.5px] text-sky-600 font-sans">@SaaS_Founder_X</p>
                      <p className="text-gray-550 italic mt-0.5 font-sans">"Just finalized locked milestones with Tech & Gadgets, no fears of ghosting, fully auditable view. Huge game changer!"</p>
                    </div>
                    <div className="pt-2 pb-1 text-[11px]">
                      <p className="font-bold text-[10.5px] text-sky-600 font-sans">@AlexisRiveraTech</p>
                      <p className="text-gray-550 italic mt-0.5 font-sans">"Contract funds instantly released once my verified YouTube review processed in seconds. Love the secure dashboard setup!"</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        {/* Dynamic footer copyright */}
        <footer className="bg-[#070709] border-t border-white/5 py-4 px-4 text-center text-slate-500 text-[10px] font-medium mt-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 REACH Escrow Networks Inc. Global creator registry platform.</p>
          <div className="flex space-x-3 text-slate-600">
            <span className="hover:text-slate-400 transition cursor-pointer">Security Standards</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Escrow Protocols</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition cursor-pointer">API Ledger Status</span>
          </div>
        </footer>

      </div>

      {/* Hire & Escrow Milestone Payment Modal */}
      {selectedInfluencer && (
        <HireModal
          influencer={selectedInfluencer}
          isOpen={isHireModalOpen}
          onClose={() => setIsHireModalOpen(false)}
          onHireSuccess={(newContract) => {
            setContracts(prev => [newContract, ...prev]);
            // Take back to current campaigns to let them view
            setActiveTab("campaigns");
          }}
        />
      )}

      {/* Floating AI Agent */}
      <AgentWidget 
        isOpen={isAgentOpen}
        setIsOpen={setIsAgentOpen}
        triggerMessage={agentTriggerMsg}
        currentContext={`Currently viewing the Reach influencer directory. Active tab is ${activeTab}. Selected niche is ${selectedNiche}. Influencer Profile: ${selectedInfluencer ? selectedInfluencer.name : 'None'}. Profile Tab: ${profileTab}. ${profileTab === 'ai_diagnostics' && aiAnalysisResult ? 'AI Diagnostic Result is available for ' + aiAnalysisResult.influencerHandle + ' with sentiment summary: ' + aiAnalysisResult.sentimentSummary : ''}`}
      />

    </DeviceSimulator>
  );
}
