export function PasswordHelper({ password }) {
  const rules = [
    { ok: password.length >= 8, text: "At least 8 characters" },
    { ok: /[A-Z]/.test(password), text: "One uppercase letter" },
    { ok: /\d/.test(password), text: "One number" },
    { ok: /[@$!%*?&]/.test(password), text: "One special character" },
  ];

  return (
    <ul className="text-sm mt-2">
      {rules.map((r) => (
        <li key={r.text} className={r.ok ? "text-green-400" : "text-red-400"}>
          {r.text}
        </li>
      ))}
    </ul>
  );
}