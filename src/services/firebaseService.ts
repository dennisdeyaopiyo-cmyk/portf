import { 
  db, 
  auth, 
  googleProvider,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from '../lib/firebase';
import { ContactMessage, Testimonial, Project, PortfolioVisit } from '../types';

export const ADMIN_EMAIL = 'dennisdeyaopiyo@gmail.com';
export const ADMIN_PASSWORD = 'Dennis@2005';

export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  return password.trim() === ADMIN_PASSWORD;
}

export function isUserAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// -------------------------------------------------------------
// 0. VISITOR TRACKING & TELEMETRY (Firestore: portfolio_visits)
// -------------------------------------------------------------

function getBrowserInfo(ua: string): { browser: string; os: string; device: string } {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let device = 'Desktop';

  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) device = 'Tablet';

  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(ua)) browser = 'Apple Safari';
  else if (/opr\//i.test(ua)) browser = 'Opera';

  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { browser, os, device };
}

export async function recordPortfolioVisit(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Avoid spamming Firestore on every slight re-render within a 15-minute window
    const lastVisitKey = 'dennis_portfolio_last_visit_time';
    const lastVisitTime = sessionStorage.getItem(lastVisitKey);
    const now = Date.now();

    if (lastVisitTime && now - parseInt(lastVisitTime, 10) < 15 * 60 * 1000) {
      return; // Already logged this session recently
    }

    const ua = navigator.userAgent || '';
    const { browser, os, device } = getBrowserInfo(ua);

    let referrer = 'Direct / Bookmark';
    if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        referrer = refUrl.hostname.replace('www.', '');
      } catch {
        referrer = document.referrer.slice(0, 50);
      }
    }

    const screenResolution = `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`;
    const timezone = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || 'UTC';
    const language = navigator.language || 'en';

    let sessionId = sessionStorage.getItem('dennis_portfolio_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('dennis_portfolio_session_id', sessionId);
    }

    await addDoc(collection(db, 'portfolio_visits'), {
      visitedAt: new Date().toISOString(),
      deviceType: device,
      browser,
      operatingSystem: os,
      screenResolution,
      language,
      referrer,
      timezone,
      path: window.location.pathname || '/',
      sessionId,
    });

    sessionStorage.setItem(lastVisitKey, now.toString());
  } catch (err: any) {
    console.warn('Could not record portfolio visit:', err?.message || err);
  }
}

export function subscribeToPortfolioVisits(
  onUpdate: (visits: PortfolioVisit[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(collection(db, 'portfolio_visits'), orderBy('visitedAt', 'desc'), limit(150));
    return onSnapshot(
      q,
      (snapshot) => {
        const visits: PortfolioVisit[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            visitedAt: data.visitedAt || new Date().toISOString(),
            deviceType: data.deviceType || 'Desktop',
            browser: data.browser || 'Browser',
            operatingSystem: data.operatingSystem || 'OS',
            screenResolution: data.screenResolution || 'N/A',
            language: data.language || 'en',
            referrer: data.referrer || 'Direct',
            timezone: data.timezone || 'UTC',
            path: data.path || '/',
            sessionId: data.sessionId,
          };
        });
        onUpdate(visits);
      },
      (err) => {
        console.warn('Portfolio visits subscription warning:', err.message);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn('Could not subscribe to portfolio visits:', err.message);
    return () => {};
  }
}

export async function deletePortfolioVisit(visitId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'portfolio_visits', visitId));
    return true;
  } catch (err) {
    console.error('Error deleting portfolio visit log:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 1. CONTACT INQUIRIES (Firestore: contact_messages)
// -------------------------------------------------------------

export async function submitContactInquiry(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const docRef = await addDoc(collection(db, 'contact_messages'), {
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    });

    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.error('Error saving contact message to Firestore:', err);
    return { success: false, error: err?.message || 'Failed to submit' };
  }
}

export function subscribeToContactMessages(
  onUpdate: (messages: ContactMessage[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const msgs: ContactMessage[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name || 'Anonymous',
            email: data.email || '',
            subject: data.subject || 'No Subject',
            message: data.message || '',
            createdAt: data.createdAt || new Date().toISOString(),
            status: data.status || 'unread',
          };
        });
        onUpdate(msgs);
      },
      (err) => {
        console.warn('Firestore contact messages listener error:', err.message);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn('Could not establish contact messages subscription:', err.message);
    return () => {};
  }
}

export async function markContactMessageStatus(
  messageId: string, 
  status: 'read' | 'unread' | 'archived'
): Promise<boolean> {
  try {
    const ref = doc(db, 'contact_messages', messageId);
    await updateDoc(ref, { status });
    return true;
  } catch (err) {
    console.error('Error updating contact status:', err);
    return false;
  }
}

export async function deleteContactMessage(messageId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'contact_messages', messageId));
    return true;
  } catch (err) {
    console.error('Error deleting contact message:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 2. SHARED TESTIMONIALS / GUESTBOOK (Firestore: testimonials)
// -------------------------------------------------------------

export async function submitTestimonialToFirestore(
  testimonial: Omit<Testimonial, 'id'>
): Promise<{ success: boolean; id?: string }> {
  try {
    const docRef = await addDoc(collection(db, 'testimonials'), {
      authorName: testimonial.authorName,
      name: testimonial.authorName,
      role: testimonial.authorTitle || 'Colleague / Recruiter',
      authorTitle: testimonial.authorTitle || 'Colleague / Recruiter',
      company: 'Industry Partner',
      content: testimonial.quote,
      quote: testimonial.quote,
      rating: Number(testimonial.rating) || 5,
      authorAvatar: testimonial.authorAvatar || '',
      status: 'approved',
      createdAt: testimonial.date || new Date().toISOString(),
      date: testimonial.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    });

    return { success: true, id: docRef.id };
  } catch (err) {
    console.error('Error submitting testimonial to Firestore:', err);
    return { success: false };
  }
}

export function subscribeToTestimonials(
  onUpdate: (testimonials: Testimonial[]) => void,
  fallbackInitial: Testimonial[]
) {
  try {
    const q = query(collection(db, 'testimonials'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(fallbackInitial);
          return;
        }

        const cloudTestimonials: Testimonial[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            authorName: data.authorName || data.name || 'Anonymous Peer',
            authorTitle: data.authorTitle || data.role || 'Software Engineer',
            quote: data.quote || data.content || '',
            rating: typeof data.rating === 'number' ? data.rating : 5,
            authorAvatar: data.authorAvatar || data.avatar || '',
            date: data.date || (data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent'),
          };
        });

        // Combine fallback and live testimonials (avoid duplicate IDs)
        const combined = [...cloudTestimonials];
        for (const item of fallbackInitial) {
          if (!combined.some((t) => t.id === item.id || t.quote === item.quote)) {
            combined.push(item);
          }
        }

        onUpdate(combined);
      },
      (err) => {
        console.warn('Testimonials onSnapshot error, using local fallback:', err.message);
        onUpdate(fallbackInitial);
      }
    );
  } catch (err: any) {
    console.warn('Could not initialize testimonials listener, using local fallback:', err.message);
    onUpdate(fallbackInitial);
    return () => {};
  }
}

export async function deleteTestimonialFromFirestore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'testimonials', id));
    return true;
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 3. ADMIN AUTHENTICATION
// -------------------------------------------------------------

export async function adminSignInWithGoogle(): Promise<{ user: User | null; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    return { user: null, error: err?.message || 'Authentication failed' };
  }
}

export async function adminSignOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign Out Error:', err);
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
