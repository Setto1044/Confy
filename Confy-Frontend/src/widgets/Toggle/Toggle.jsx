import React from "react";
import style from "./Toggle.module.css";

function Toggle({ isChecked, onChange }) {
  return (
    <label className={style.switch}>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      <span className={style.slider}></span>
    </label>
  );
}

export default Toggle;
