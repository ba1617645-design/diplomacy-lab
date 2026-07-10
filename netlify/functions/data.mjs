// =============================================
//  Netlify Function - التخزين السحابي الدائم
//  يستخدم Netlify Blobs المدمج في Netlify
// =============================================

import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const store = getStore('diplomacy-lab-store');

    // GET: تحميل البيانات
    if (req.method === 'GET') {
      const data = await store.get('app-data', { type: 'json' });
      const users = await store.get('users', { type: 'json' });
      return new Response(JSON.stringify({
        data: data || {},
        users: users || [],
      }), { status: 200, headers });
    }

    // PUT: حفظ البيانات
    if (req.method === 'PUT') {
      const body = await req.json();
      console.log('📝 Saving data...');

      if (body.users) {
        await store.setJSON('users', body.users);
        console.log(`✅ Saved ${body.users.length} users`);
      }
      if (body.data) {
        await store.setJSON('app-data', body.data);
        console.log('✅ Saved app data (lock state, trainer info)');
      }

      return new Response(JSON.stringify({ status: 'ok' }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
};
