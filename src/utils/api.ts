// =============================================
//  API Client - للتخزين السحابي الدائم
//  يتصل بـ Netlify Function للتخزين في Netlify Blobs
// =============================================

const API_URL = '/.netlify/functions/data';

// حفظ جميع البيانات
export async function saveToCloud(data: {
  users: any[];
  appData: any;
}): Promise<boolean> {
  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        users: data.users,
        data: data.appData,
      }),
    });
    return res.ok;
  } catch (e) {
    console.warn('⚠️ Cloud save failed (offline?):', e);
    return false;
  }
}

// تحميل جميع البيانات
export async function loadFromCloud(): Promise<{
  users: any[];
  data: any;
} | null> {
  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('⚠️ Cloud load failed (offline?):', e);
    return null;
  }
}
