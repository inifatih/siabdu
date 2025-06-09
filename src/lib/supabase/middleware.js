import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Ambil data user dari auth
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (!request.nextUrl.pathname.startsWith('/authentication')) {
      return NextResponse.redirect(new URL('/authentication/login', request.url));
    }
    return supabaseResponse;
  }

  // Ambil is_admin dari tabel custom_users
  const { data: customUser, error } = await supabase
    .from('custom_users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching custom user data:', error);
    return NextResponse.redirect(new URL('/authentication', request.url));
  }

  const isAdmin = customUser?.is_admin === true;
  const allowedUserPaths = ['/landing', '/skrining', '/kebutuhanKhusus', '/jadwal', '/bantuan', '/pengaturan'];

  // **Tambahkan pengecualian halaman login agar tidak looping**
  if (request.nextUrl.pathname.startsWith('/authentication')) {
    return supabaseResponse;
  }

  // **Redirect hanya jika user bukan admin & mengakses halaman terlarang**
  if (!isAdmin && !allowedUserPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/skrining', request.url));
  }

  return supabaseResponse;
}
