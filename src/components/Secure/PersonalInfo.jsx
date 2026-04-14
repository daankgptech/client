import { Calendar, MapPin, Phone, Droplet } from "lucide-react";

const PersonalInfo = ({ data, editing, onChange }) => {
  const info = data || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format date for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const fields = [
    { key: "address", label: "Address", icon: MapPin, type: "text" },
    { key: "city", label: "City", icon: MapPin, type: "text" },
    { key: "state", label: "State", icon: MapPin, type: "text" },
    { key: "pincode", label: "Pincode", icon: MapPin, type: "text" },
    { key: "emergencyContact", label: "Emergency Contact", icon: Phone, type: "text" },
    { key: "bloodGroup", label: "Blood Group", icon: Droplet, type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  ];

  return (
    <div className="space-y-3">
      {/* Date of Birth - Native HTML Date Picker */}
      <div className="flex justify-between items-center gap-4 text-sm group">
        <span className="text-gray-500 flex items-center gap-2">
          <Calendar className="w-4 h-4 opacity-60" />
          Date of Birth
        </span>
        {editing ? (
          <input
            type="date"
            value={formatDateForInput(info.dob)}
            onChange={(e) => onChange("dob", e.target.value ? new Date(e.target.value).toISOString() : "")}
            className="text-right bg-transparent border-b border-rose-400 text-gray-900 dark:text-gray-100 focus:outline-none px-2 py-1"
          />
        ) : (
          <span className="text-gray-800 dark:text-gray-200 font-medium">
            {formatDate(info.dob)}
          </span>
        )}
      </div>

      {/* Other Fields */}
      {fields.map(({ key, label, icon: Icon, type, options }) => (
        <div key={key} className="flex justify-between items-center gap-4 text-sm group">
          <span className="text-gray-500 flex items-center gap-2">
            <Icon className="w-4 h-4 opacity-60" />
            {label}
          </span>
          {editing ? (
            type === "select" ? (
              <select
                value={info[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                className="text-right bg-transparent border-b border-rose-400 text-gray-900 dark:text-gray-100 focus:outline-none px-2 py-1"
              >
                <option value="">Select</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={info[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder="—"
                className="text-right bg-transparent border-b border-rose-400 text-gray-900 dark:text-gray-100 focus:outline-none px-2 py-1 w-1/2"
              />
            )
          ) : (
            <span className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-[50%]">
              {info[key] || "—"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default PersonalInfo;
