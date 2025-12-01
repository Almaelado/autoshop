import { Typeahead } from "react-bootstrap-typeahead";
import { useState, useEffect } from "react";

export default function TypeaheadComponent({ options, value, onChange, label, labelKey }) {
  const [selectedValues, setSelectedValues] = useState(value || []);

  useEffect(() => {
    setSelectedValues(value || []);
  }, [value]);

  // Márka törlése
  const removeItem = (item) => {
    const updatedValues = selectedValues.filter((v) => v !== item);
    setSelectedValues(updatedValues);
    onChange(updatedValues);
  };

  // Normalize options so the labelKey field is always a string (Typeahead requires string labels)
  const normalizedOptions = (options || []).map((opt) => {
    if (!labelKey) return opt;
    const val = opt[labelKey];
    // If it's already a string or null/undefined, leave it, otherwise stringify
    if (val == null) return opt;
    if (typeof val === "string") return opt;
    return { ...opt, [labelKey]: String(val) };
  });

  // Filter out already selected values by comparing strings
  const filteredOptions = normalizedOptions.filter((m) => {
    const optLabel = labelKey ? m[labelKey] : m;
    return !selectedValues.includes(optLabel);
  });

  return (
    <div className="mb-3">
      <label className="form-label text-white m-0">{label || "Kiválasztott:"}</label>
      <div className="mb-2">
        {selectedValues.map((item) => (
          <span
            key={item}
            className="badge bg-primary me-2"
            style={{ display: "inline-flex", alignItems: "center", padding: "0.4rem 0.6rem" }}
          >
            {item}
            <button
              type="button"
              className="btn-close btn-close-white ms-2"
              aria-label="Remove"
              onClick={() => removeItem(item)}
              style={{ padding: "0", marginLeft: "0.3rem" }}
            ></button>
          </span>
        ))}
      </div>

      <Typeahead
        id="typeahead-search"
        options={filteredOptions} // csak a még nem kiválasztottak
        placeholder="Elkezdesz írni..."
        selected={[]}
        multiple={false} // egy választás egyszerre
        labelKey={labelKey || ((option) => option)}
        onChange={(selected) => {
          if (selected.length === 0) return;

          const rawValue = labelKey ? selected[0][labelKey] : selected[0];
          const newValue = rawValue == null ? rawValue : String(rawValue);
          const updatedValues = [...selectedValues, newValue];
          setSelectedValues(updatedValues);
          onChange(updatedValues);
        }}
      />
    </div>
  );
}
