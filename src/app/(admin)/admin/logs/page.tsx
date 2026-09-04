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
      <div className="pb-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
            <span>Nhật Ký Kiểm Toán (Audit Logs)</span>
          </h1>
          <p className="text-xs font-mono text-[var(--text-secondary)] mt-1">
            Ghi nhận toàn bộ thao tác quản trị nhằm đảm bảo an ninh tuyệt đối cho hệ thống
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-[var(--accent-green)]/15 text-[var(--accent-green)] dark:text-emerald-400 border border-[var(--accent-green)]/30 rounded-full">
          <span>Bất biến (Append-only)</span>
        </span>
      </div>

      <div className="overflow-x-auto border border-[var(--border-subtle)] bg-[var(--bg-card)] rounded-2xl shadow-xs">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[var(--text-primary)]/[0.04] border-b border-[var(--border-subtle)] uppercase tracking-wider text-[var(--text-secondary)]">
            <tr>
              <th className="py-3 px-4">Thời gian</th>
              <th className="py-3 px-4">Hành động</th>
              <th className="py-3 px-4">Đối tượng</th>
              <th className="py-3 px-4">Người thực hiện</th>
              <th className="py-3 px-4 text-right">Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {mockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[var(--text-primary)]/[0.02] transition-colors">
                <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                  {new Date(log.created_at).toLocaleTimeString("vi-VN")}{" "}
                  {new Date(log.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 bg-[var(--text-primary)]/5 border border-[var(--border-subtle)] text-[var(--accent-green)] dark:text-emerald-400 text-[10px] rounded-md font-bold">
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-serif text-sm text-[var(--text-primary)]">
                  {log.entity_name}
                </td>
                <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                  {log.user_email}
                </td>
                <td className="py-3.5 px-4 text-[var(--text-muted)] text-right">
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
