import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Route tự động gửi truy vấn nhẹ tới Supabase định kỳ (24h)
 * Giúp giữ database luôn hoạt động (tránh chính sách ngủ đông sau 7 ngày của gói Free)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET || 'thinkai-poetry-cron-secret-2026';

    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Thực hiện truy vấn nhẹ
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('categories').select('id').limit(1);

    if (error) {
      console.error('[Keep-Alive Cron Error]:', error);
      return NextResponse.json({ status: 'warning', error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Supabase database kept alive successfully',
      timestamp: new Date().toISOString(),
      rowsChecked: data?.length ?? 0,
    });
  } catch (err: any) {
    console.error('[Keep-Alive Exception]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
