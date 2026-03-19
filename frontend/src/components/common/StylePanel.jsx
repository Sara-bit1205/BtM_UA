import { useEffect, useRef } from "react";
import {useTheme} from "../../context/ThemeContext";

function StylePanel ({ isOpen ,onClose}) {
    const { theme, setTheme, fontSize, setFontSize, accessibleFont, setAccessibleFont } = useTheme();

    const panelRef = useRef(null);

    useEffect(() => {
            if (!isOpen) return;

            const clickOutside = (event) => {
                if (panelRef.current && !panelRef.current.contains(event.target)){
                    onClose();
                }
            };

            const escape = (event) => {
                if(event.key === "Escape"){
                    onClose();
                }
            };

            document.addEventListener("mousedown", clickOutside);
            document.addEventListener("keydown", escape);

            return () => {
                document.removeEventListener("mousedown", clickOutside);
                document.removeEventListener("keydown", escape);
            };
    }, [isOpen,onClose]);
    
    if (!isOpen) return null;

    return (
        /*El stylePanel es un dropdown/floating panel*/
        <div ref={panelRef} className="style-panel" role="dialog" aria-modal="true" aria-label="Panel de accesibilidad">
            <div className="style-panel__section">
                <div className="titulo_close d-flex justify-content-between align-items-center mb-3">
                    <h3 className="style-panel__title text-center">TEMA</h3>
                    <button type="button" className="btn-close" aria-label="Close" onClick = {onClose}></button>
                </div>
                <div className="style-panel__themes">
                <button
                    type="button"
                    className={`theme-option ${theme === "light" ? "active" : ""}`}
                    onClick={() => setTheme("light")}
                    aria-label="Tema claro"
                    aria-pressed={theme === "light"}
                    title="Tema claro"
                >
                    <i className="bi bi-brightness-high"></i>
                </button>

                <button
                    type="button"
                    className={`theme-option ${theme === "default" ? "active" : ""}`}
                    onClick={() => setTheme("default")}
                    aria-label="Tema oscuro"
                    aria-pressed={theme === "default"}
                    title="Tema oscuro"
                >
                    <i className="bi bi-moon-fill"></i>
                </button>

                <button
                    type="button"
                    className={`theme-option ${theme === "contrast" ? "active" : ""}`}
                    onClick={() => setTheme("contrast")}
                    aria-label="Tema de alto contraste"
                    aria-pressed={theme === "contrast"}
                    title="Tema de alto contraste"
                >
                    <i className="bi bi-circle-half"></i>
                </button>
                </div>
            </div>

            <div className="style-panel__section">
                <h3 className="style-panel__title">Tamaño Texto</h3>

                <div className="style-panel__font-size">
                <span className="font-size-small">A</span>

                <input
                    type="range"
                    min="85"
                    max="130"
                    step="5"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="form-range"
                    aria-label="Cambiar tamaño del texto"
                />

                <span className="font-size-large">A</span>
                </div>
            </div>

            <div className="style-panel__section style-panel__switch-row">
                <h3 className="style-panel__title mb-0">Fuente dislexia</h3>

                <div className="form-check form-switch m-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switchAccessibleFont"
                    checked={accessibleFont}
                    onChange={(e) => setAccessibleFont(e.target.checked)}
                    aria-label="Activar fuente accesible"
                />
                </div>
            </div>
        </div>
    );
}

export default StylePanel;