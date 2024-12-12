import React from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { FaSun, FaMoon } from "react-icons/fa";


const ThemeToggle = ({ theme, handleThemeToggle }) => {
    return (
        <div className="theme-toggle mt-3">
            <ToggleButtonGroup type="radio" name="theme-options" value={theme} onChange={handleThemeToggle}>
                <ToggleButton variant="outline-primary" value="light">
                    <FaSun /> Light
                </ToggleButton>
                <ToggleButton variant="outline-secondary" value="dark">
                    <FaMoon /> Dark
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

export default ThemeToggle;