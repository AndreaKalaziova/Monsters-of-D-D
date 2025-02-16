import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import MonsterCard from "./Monstercard";

//return all monsters
function MonsterList() {

    const [monsters, setMonsters] = useState([]);
    const [selectedMonster, setSelectedMonster] = useState('aboleth');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const monstersPerPage = 25;

    useEffect(() => {
        async function fetchMonsters() {
            setIsLoading(true);
            const data = await apiGet('https://www.dnd5eapi.co/api/monsters');
            setMonsters(data.results);
            setIsLoading(false);
        };
        fetchMonsters();
    }, []);

    //pagination
    const totalPages = Math.ceil(monsters.length / monstersPerPage);
    const startIndex = (currentPage - 1) * monstersPerPage;
    const endIndex = startIndex + monstersPerPage;
    const currentMonsters = monsters.slice(startIndex, endIndex)

    const NextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const PreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <h1 style={{ color: "red" }} className="text-center my-3">Dungeons & Dragons Monsters selection</h1>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        {isLoading ? (
                            <div className="text-center my-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Fetching monsters...</span>
                                </div>
                            </div>
                        ) : (
                            <ul>
                                {currentMonsters.map((monster) => (
                                    <li
                                        key={monster.index}
                                        onClick={() => setSelectedMonster(monster.index)}
                                        style={{ cursor: 'pointer' }}
                                        className="link-danger">
                                        {monster.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {selectedMonster && (
                        <div className="col">
                            <MonsterCard monsterIndex={selectedMonster} />
                        </div>
                    )}
                </div>
            </div>

            <div className="container text-center my-3">
                <button type="button" className="btn btn-danger me-1"
                    onClick={PreviousPage} disabled={currentPage === 1}>Previous</button>
                <span> Page {currentPage} of {totalPages} </span>
                <button type="button" className="btn btn-danger me-1"
                    onClick={NextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default MonsterList;