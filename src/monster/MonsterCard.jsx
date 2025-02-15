import React, { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';
import "./MonsterCard.css";
import TYPE_ALIGNMENT from '../utils/alignmentColors';

function MonsterCard({ monsterIndex }) {
    const [monster, setMonster] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMonsters() {
            setIsLoading(true);
            const MonsterData = await apiGet(`https://www.dnd5eapi.co/api/monsters/${monsterIndex}`);
            setMonster(MonsterData);
            setIsLoading(false);
        };
        fetchMonsters();
    }, [monsterIndex]);

    const alignmentColor = monster?.alignment ? TYPE_ALIGNMENT[monster.alignment] || "#a0a0a3" : "#a0a0a3"; // Default to grey

    return (
        <div className="card" style={{ width: "30rem", height: "40rem" }}>
            {isLoading ? (
                <div className="text-center my-3">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Fetching selected monster...</span>
                    </div>
                    <p className="mt-2">Fetching details...</p>
                </div>
            ) : (
                <div className="text-center">
                    <img
                        src={`https://www.dnd5eapi.co${monster.image}`}
                        className="card-img-top"
                        alt={monster.name} />
                    <div className="card-body">
                        <h4 className="card-title text-center text-uppercase fw-bold">{monster.name} </h4>

                        <div className="badge text-white me-1"
                            style={{ backgroundColor: alignmentColor, fontSize: "1em" }}
                        >
                            {monster.alignment}
                        </div>

                        <div className="card-text">
                            <div className="row">
                                <div className="col-6">
                                    <small>Size: <strong> {monster.size}</strong></small><br />
                                    <small>Type: <strong> {monster.type}</strong></small><br />
                                    <small>Strength: <strong> {monster.strength}</strong></small><br />
                                </div>
                                <div className="col-6">
                                    <small>Intelligence: <strong> {monster.intelligence}</strong></small><br />
                                    <small>Wisdom: <strong> {monster.wisdom}</strong></small><br />
                                    <small>Charisma: <strong> {monster.charisma}</strong></small><br />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default MonsterCard;