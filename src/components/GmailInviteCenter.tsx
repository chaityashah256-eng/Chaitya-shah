import React, { useState, useEffect } from "react";
import { 
  googleSignIn, 
  fetchGoogleContacts, 
  sendGmailInvite, 
  GoogleContact, 
  logoutGoogle,
  initAuth
} from "../lib/firebaseAuth";
import { User as FirebaseUser } from "firebase/auth";
import { Mail, Shield, CheckCircle2, Loader2, Sparkles, Send, Users, Search, RefreshCw, LogOut } from "lucide-react";

interface GmailInviteCenterProps {
  currentLocalUser: { name: string; email: string } | null;
  onLinkGoogleProfile?: (googleUser: FirebaseUser) => void;
}

export default function GmailInviteCenter({ currentLocalUser, onLinkGoogleProfile }: GmailInviteCenterProps) {
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [manualEmails, setManualEmails] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendLogs, setSendLogs] = useState<string[]>([]);
  const [inviteProgress, setInviteProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorText, setErrorText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize Auth state listeners on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        loadContacts(token);
        if (onLinkGoogleProfile) {
          onLinkGoogleProfile(user);
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
        setContacts([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleConnect = async () => {
    setErrorText("");
    setSuccessMessage("");
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setSuccessMessage("Successfully connected to Google Secure Workspace APIs!");
        loadContacts(result.accessToken);
        if (onLinkGoogleProfile) {
          onLinkGoogleProfile(result.user);
        }
      }
    } catch (err: any) {
      console.error(err);
      const isPopupClosed = err.code === "auth/popup-closed-by-user" || 
                            (err.message && err.message.includes("popup-closed-by-user"));
      
      if (isPopupClosed) {
        setErrorText(
          "The security authentication popup was closed or blocked. Because the app runs inside a sandboxed preview iframe, custom Google sign-in windows cannot safely complete. Please click 'Open in New Tab' at the top-right corner of AI Studio, then try connecting. Your session is fully synced!"
        );
      } else {
        setErrorText(err.message || "Sign-in popup was cancelled or failed to resolve.");
      }
    }
  };

  const loadContacts = async (token: string) => {
    setLoadingContacts(true);
    setErrorText("");
    try {
      const fetched = await fetchGoogleContacts(token);
      setContacts(fetched);
      
      // Auto select contacts that look like Gmail accounts if any
      const autoSelected = new Set<string>();
      fetched.forEach(c => {
        if (c.email.toLowerCase().endsWith("@gmail.com")) {
          autoSelected.add(c.email);
        }
      });
      setSelectedContacts(autoSelected);
    } catch (err: any) {
      setErrorText("Could not populate contact connections.");
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleToggleContact = (email: string) => {
    setSelectedContacts(prev => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  const handleSelectAllFiltered = (filtered: GoogleContact[]) => {
    setSelectedContacts(prev => {
      const next = new Set(prev);
      filtered.forEach(c => next.add(c.email));
      return next;
    });
  };

  const handleDeselectAllFiltered = (filtered: GoogleContact[]) => {
    setSelectedContacts(prev => {
      const next = new Set(prev);
      filtered.forEach(c => next.delete(c.email));
      return next;
    });
  };

  const handleSendInvites = async () => {
    if (!googleToken) {
      setErrorText("Google token is expired or missing. Please connect again.");
      return;
    }

    setSuccessMessage("");
    setErrorText("");
    setSendLogs([]);

    // Collate all emails to invite
    const inviteQueue: { name: string; email: string }[] = [];
    
    // Add selected contacts
    contacts.forEach(c => {
      if (selectedContacts.has(c.email)) {
        inviteQueue.push(c);
      }
    });

    // Add manual entries
    if (manualEmails.trim()) {
      const entries = manualEmails.split(/[\s,;]+/).filter(e => e.includes("@"));
      entries.forEach(email => {
        const cleanEmail = email.trim();
        if (cleanEmail && !inviteQueue.some(q => q.email === cleanEmail)) {
          inviteQueue.push({ name: cleanEmail.split("@")[0], email: cleanEmail });
        }
      });
    }

    if (inviteQueue.length === 0) {
      setErrorText("Please select/input at least one target Gmail/email address to invite.");
      return;
    }

    // Explicit User Confirmation Dialog for Sending Emails
    const confirmMessage = `You are about to send ${inviteQueue.length} invitation email(s) directly from your Gmail account (${googleUser?.email}). Are you sure you want to proceed?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSending(true);
    setInviteProgress({ current: 0, total: inviteQueue.length });

    const senderName = googleUser?.displayName || currentLocalUser?.name || "A Friend on Reach";
    let successfulCount = 0;

    for (let i = 0; i < inviteQueue.length; i++) {
      const recipient = inviteQueue[i];
      setInviteProgress({ current: i + 1, total: inviteQueue.length });
      
      const res = await sendGmailInvite(googleToken, recipient.email, recipient.name, senderName);
      if (res) {
        successfulCount++;
        setSendLogs(prev => [...prev, `✅ Sent invite to: ${recipient.name} (${recipient.email})`]);
      } else {
        setSendLogs(prev => [...prev, `❌ Failed sending to: ${recipient.email}`]);
      }
    }

    setIsSending(false);
    setInviteProgress(null);
    
    if (successfulCount > 0) {
      setSuccessMessage(`🎉 Successfully sent ${successfulCount}/${inviteQueue.length} invitations via secure Google service!`);
      // Clear manual emails and selection
      setManualEmails("");
      setSelectedContacts(new Set());
    } else {
      setErrorText("Failed to deliver any invitations. Check your Gmail API permissions.");
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm("Disconnect Google Workspace connection?")) {
      await logoutGoogle();
      setGoogleUser(null);
      setGoogleToken(null);
      setContacts([]);
      setSelectedContacts(new Set());
      setSuccessMessage("Disconnected Gmail Workspace integration successfully.");
    }
  };

  // Filter contacts by search query
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4">
      <div className="flex items-start justify-between border-b border-gray-100 pb-3">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center space-x-1.5 font-sans">
            <Mail className="w-4 h-4 text-indigo-600" />
            <span>Gmail Invite Center</span>
          </h3>
          <p className="text-[10px] text-gray-500 max-w-sm">
            Frictionless inviting via Gmail. Connect your Google Workspace to load contacts and broadcast Reach securely.
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans font-bold px-1.5 py-0.5 rounded-full flex items-center space-x-0.5">
            <Shield className="w-2 h-2 text-emerald-500" />
            <span>Google SECURE OAuth</span>
          </span>
        </div>
      </div>

      {errorText && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[10px] rounded-xl font-mono leading-relaxed">
          ⚠️ {errorText}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] rounded-xl font-sans flex items-center space-x-1.5 leading-relaxed">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {!googleUser ? (
        <div className="bg-slate-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center space-y-3">
          <div className="mx-auto w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-800">No Google account connected</p>
            <p className="text-[9px] text-gray-400 max-w-xs mx-auto leading-normal">
              Authorize securely with Google to easily access your contacts and invite users to join Reach. Permissions are limited solely to sending invitations on your demand.
            </p>
          </div>
          <button
            onClick={handleConnect}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-[11px] px-4 py-2 rounded-xl transition duration-200 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Connect & Sync Google Contacts</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Linked Google Banner */}
          <div className="flex items-center justify-between bg-indigo-50/75 border border-indigo-100 rounded-2xl p-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <img 
                src={googleUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleUser.displayName || "")}`} 
                alt="google profile" 
                className="w-7 h-7 rounded-full border border-indigo-200 shadow-3xs"
                referrerPolicy="no-referrer"
              />
              <div className="leading-tight">
                <p className="text-[10px] font-extrabold text-indigo-950 flex items-center space-x-1">
                  <span>Connected via Google</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                </p>
                <p className="text-[9px] text-indigo-600 font-medium font-sans">{googleUser.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => loadContacts(googleToken!)}
                disabled={loadingContacts}
                className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-white rounded-lg transition"
                title="Refresh Contacts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingContacts ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleDisconnect}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition"
                title="Disconnect Account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Contact Directory Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block font-sans">
                Select Connections to Invite ({contacts.length} Found)
              </label>
              {contacts.length > 0 && (
                <div className="flex items-center space-x-2 text-[9px]">
                  <button 
                    onClick={() => handleSelectAllFiltered(filteredContacts)}
                    className="text-indigo-600 hover:underline font-bold"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={() => handleDeselectAllFiltered(filteredContacts)}
                    className="text-gray-500 hover:underline font-bold"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {loadingContacts ? (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-1.5">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                <p className="text-[9px] text-gray-400 font-mono">Syncing credentials and directory connections...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="border border-dashed border-gray-100 rounded-2xl p-5 text-center text-gray-400 text-[10px]">
                No Google Contacts with email addresses detected in this account.
              </div>
            ) : (
              <div className="space-y-2">
                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute left-2.5 top-2.5 text-gray-400">
                    <Search className="w-3 h-3" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search connection name or email address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-[10px] text-gray-900 focus:outline-none focus:border-indigo-600 placeholder-gray-400 font-sans"
                  />
                </div>

                {/* Scroller Area */}
                <div className="max-h-36 overflow-y-auto border border-gray-150 rounded-xl bg-gray-50 p-2 divide-y divide-gray-100 grid grid-cols-1 gap-1">
                  {filteredContacts.map((contact, index) => {
                    const isSelected = selectedContacts.has(contact.email);
                    return (
                      <label 
                        key={index}
                        className={`flex items-center justify-between p-1.5 rounded-lg hover:bg-white cursor-pointer transition text-[10px] ${isSelected ? "bg-white shadow-2xs font-semibold" : ""}`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleContact(contact.email)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3 cursor-pointer"
                          />
                          <div className="truncate">
                            <span className="text-gray-800 font-medium block truncate">{contact.name}</span>
                            <span className="text-[9px] text-gray-400 block font-mono font-normal truncate leading-none">{contact.email}</span>
                          </div>
                        </div>
                        {contact.email.toLowerCase().endsWith("@gmail.com") && (
                          <span className="text-[8px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded font-mono">
                            Gmail
                          </span>
                        )}
                      </label>
                    );
                  })}
                  
                  {filteredContacts.length === 0 && (
                    <div className="py-4 text-center text-gray-400 text-[9px]">
                      No matched connections for "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Manual Input Block */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block font-sans">
              Enter manual recipient emails (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. business@gmail.com, info@brandpartners.com"
              value={manualEmails}
              onChange={(e) => setManualEmails(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[10px] text-gray-900 focus:outline-none focus:border-indigo-600 placeholder-gray-400 font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Execution Progress & Logs */}
          {inviteProgress && (
            <div className="space-y-1.5 bg-slate-50 border border-gray-200 rounded-2xl p-3 text-[10px]">
              <div className="flex items-center justify-between text-[9px] font-semibold text-gray-600 font-mono">
                <span>Sending email updates...</span>
                <span>{inviteProgress.current} / {inviteProgress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${(inviteProgress.current / inviteProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {sendLogs.length > 0 && (
            <div className="bg-gray-900 text-gray-100 rounded-2xl p-2.5 max-h-24 overflow-y-auto font-mono text-[8.5px] space-y-0.5">
              {sendLogs.map((log, idx) => (
                <div key={idx} className="leading-tight">{log}</div>
              ))}
            </div>
          )}

          {/* Invite Delivery Trigger Button */}
          <button
            onClick={handleSendInvites}
            disabled={isSending || loadingContacts}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 text-white font-bold text-[11px] py-2.5 rounded-2xl transition duration-200 shadow-sm cursor-pointer"
          >
            {isSending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing Email Invitations...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>
                  Send {selectedContacts.size + (manualEmails.trim().split(/[\s,;]+/).filter(e => e.includes("@")).length || 0)} Invites via Gmail
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
