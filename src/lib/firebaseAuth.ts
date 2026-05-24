import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
// Add required Workspace scopes
provider.addScope("https://www.googleapis.com/auth/gmail.send");
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export interface GoogleContact {
  name: string;
  email: string;
}

// Listen to Auth State Changes
export const initAuth = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  // Try retrieving temporary token form session if applicable
  const savedToken = sessionStorage.getItem("reach_g_token");
  if (savedToken) {
    cachedAccessToken = savedToken;
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      sessionStorage.removeItem("reach_g_token");
      onAuthFailure();
    }
  });
};

// Sign in with Google Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to retrieve access token from Google Auth.");
    }

    cachedAccessToken = credential.accessToken;
    sessionStorage.setItem("reach_g_token", cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  sessionStorage.removeItem("reach_g_token");
};

/**
 * Fetch contacts from Google People API
 */
export const fetchGoogleContacts = async (accessToken: string): Promise<GoogleContact[]> => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses&pageSize=100",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to load Google Contacts: ${response.statusText}`);
    }

    const data = await response.json();
    const connections = data.connections || [];
    
    const contacts: GoogleContact[] = [];
    for (const person of connections) {
      const name = person.names?.[0]?.displayName || "Unknown Name";
      const email = person.emailAddresses?.[0]?.value || "";
      if (email) {
        contacts.push({ name, email });
      }
    }
    
    return contacts;
  } catch (error) {
    console.error("Error fetching Google Contacts:", error);
    return [];
  }
};

/**
 * Helper to URL-safe base64 encode RFC 822 email strings for Gmail API
 */
function base64UrlEncode(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Send invitation email using Gmail send API
 */
export const sendGmailInvite = async (
  accessToken: string,
  toEmail: string,
  toName: string,
  fromName: string
): Promise<boolean> => {
  try {
    const subject = "Invitation to join Reach - Independent Creator Network";
    const appUrl = window.location.origin;

    const emailContent = [
      `To: ${toName} <${toEmail}>`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      ``,
      `<!DOCTYPE html>`,
      `<html>`,
      `<head>`,
      `<meta charset="utf-8">`,
      `</head>`,
      `<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #111827; padding: 24px;">`,
      `  <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">`,
      `    <div style="text-align: center; margin-bottom: 24px;">`,
      `      <span style="font-size: 10px; background: #eef2ff; color: #4f46e5; font-weight: bold; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">Reach Invitation</span>`,
      `      <h2 style="font-size: 22px; font-weight: 800; color: #111827; margin-top: 12px; margin-bottom: 4px;">Join the Independent Creator Network</h2>`,
      `      <p style="font-size: 13px; color: #6b7280; margin: 0;">Secured Escrow Backed Directory & Social Community</p>`,
      `    </div>`,
      `    `,
      `    <p style="font-size: 14px; line-height: 1.6; color: #374151;">Hi <strong>${toName}</strong>,</p>`,
      `    `,
      `    <p style="font-size: 14px; line-height: 1.6; color: #374151;">`,
      `      Your friend <strong>${fromName}</strong> has invited you to join <strong>Reach</strong>!`,
      `    </p>`,
      `    `,
      `    <div style="background-color: #f3f4f6; border-radius: 12px; padding: 16px; margin: 20px 0;">`,
      `      <h4 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #4b5563;">What is Reach?</h4>`,
      `      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #4b5563; line-height: 1.5;">`,
      `        <li><strong>Directory:</strong> Browse & book certified creators.</li>`,
      `        <li><strong>Escrow Protection:</strong> Funds secured until milestones are reached.</li>`,
      `        <li><strong>Independent feed:</strong> Connect and communicate freely with direct anonymity.</li>`,
      `      </ul>`,
      `    </div>`,
      `    `,
      `    <div style="text-align: center; margin-top: 28px; margin-bottom: 20px;">`,
      `      <a href="${appUrl}" style="background-color: #4f46e5; color: #ffffff; font-weight: bold; font-size: 14px; text-decoration: none; padding: 12px 32px; border-radius: 10px; display: inline-block; transition: background 0.2s;">`,
      `        Accept Invitation & Open Reach App`,
      `      </a>`,
      `    </div>`,
      `    `,
      `    <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 24px; border-top: 1px solid #f3f4f6; padding-top: 16px;">`,
      `      This email was sent to you directly via Google Workspace integration from ${fromName}.`,
      `    </p>`,
      `  </div>`,
      `</body>`,
      `</html>`
    ].join("\r\n");

    const rawMessage = base64UrlEncode(emailContent);

    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: rawMessage })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Error sending Gmail invite to ${toEmail}:`, error);
    return false;
  }
};
