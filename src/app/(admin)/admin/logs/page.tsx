import React from "react";
import { ShieldCheck, History } from "lucide-react";

export default function AuditLogsPage() {
  const mockLogs = [
    {
      id: "log-1",
      user_email: "admin@thinkai.id.vn",
      action: "PUBLISH_POEM",
      entity_type: "POEM",
      entity_name: "Vườn Xưa Hoa Nở",
      ip_address: "14.232.208.10",
      created_at: new Date().toISOString(),
    },
    {
      id: "log-2",
      user_email: "admin@thinkai.id.vn",
      action: "CREATE_COLLECTION",
      entity_type: "COLLECTION",
      entity_name: "Tuyển Tập Ánh Thịnh — Gió Đầu Mùa",
      ip_address: "14.232.208.10",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "log-3",
      user_email: "admin@thinkai.id.vn",
      action: "TOGGLE_AUTHOR_INFO",
      entity_type: "POEM",
      entity_name: "Tiếng Thu Rơi Nghiêng (Tắt hiển thị)",
      ip_address: "14.232.208.10",
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "log-4",
      user_email: "admin@thinkai.id.vn",
      action: "ADMIN_LOGIN_2FA_SUCCESS",
      entity_type: "AUTH",
      entity_name: "Xác thực TOTP thành công",
      ip_address: "14.232.208.10",
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-16">
      <div className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-[#2D5A3D]" />
            <span>Nhật Ký Kiểm Toán (Audit Logs)</span>
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Ghi nhận toàn bộ thao tác quản trị nhằm đảm bảo an ninh tuyệt đối cho hệ thống
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Bất biến (Append-only)</span>
        </span>
      </div>

      <div className="overflow-x-auto border border-white/10 bg-[#0D0D10]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider text-neutral-400">
            <tr>
              <th className="py-3 px-4">Thời gian</th>
              <th className="py-3 px-4">Hành động</th>
              <th className="py-3 px-4">Đối tượng</th>
              <th className="py-3 px-4">Người thực hiện</th>
              <th className="py-3 px-4 text-right">Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4 text-neutral-400">
                  {new Date(log.created_at).toLocaleTimeString("vi-VN")}{" "}
                  {new Date(log.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[#4ade80] text-[10px]">
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-serif text-sm text-white">
                  {log.entity_name}
                </td>
                <td className="py-3.5 px-4 text-neutral-300">
                  {log.user_email}
                </td>
                <td className="py-3.5 px-4 text-neutral-500 text-right">
                  {log.ip_address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
