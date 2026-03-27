import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function RangeSlider({ label, min, max, step, value, onChange, mertek }) {
    const sliderValue = Array.isArray(value) && value.length === 2 ? value : [min, max];

  return (
    <div className="mb-3 text-white">
      <label>
        {label}: {sliderValue[0].toLocaleString()} {mertek} - {sliderValue[1].toLocaleString()} {mertek}
      </label>
      <Slider
        range
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        allowCross={false}
      />
    </div>
  );
}
