import React from "react";
import { useNavigate } from "react-router-dom";

function EliminarPersonaje() {
    const navigate = useNavigate();
    return (
        <div className="container my-5">
            <h1 className="mb-4">Eliminar Personaje</h1>
        </div>
    );
}

export default EliminarPersonaje