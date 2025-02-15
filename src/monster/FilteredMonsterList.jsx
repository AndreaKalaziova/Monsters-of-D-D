import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { apiGet } from "../utils/api";
import MonsterCard from "./Monstercard";

function FilteredMonsterList() {

    const [monsters, setMonsters] = useState([]);
    const [selectedMonster, setSelectedMonster] = useState('aboleth');
    const [filteredMonsters, setFilteredMonsters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const monstersPerPage = 25;

    //for fetching only monsters with image
    useEffect(() => {
        async function fetchMonstersWithImages() {
            setIsLoading(true);

            try {
                // Step 1: Fetch all monsters
                const data = await apiGet('https://www.dnd5eapi.co/api/monsters');

                // Step 2: Fetch detailed data for each monster
                const monsterDetails = await Promise.all(
                    data.results.map(async (monster) => {
                        const details = await apiGet(`https://www.dnd5eapi.co${monster.url}`);
                        return { ...monster, image: details.image }; // Add the image property
                      })
                    );

                // Step 3: Filter monsters with images
                const monstersWithImages = monsterDetails.filter((monster) => monster.image);
                setFilteredMonsters(monstersWithImages);
            } catch (error) {
                console.error("Error fetching monsters:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMonstersWithImages();
    }, []);

    //pagination
    const totalPages = Math.ceil(filteredMonsters.length / monstersPerPage);
    const startIndex = (currentPage - 1) * monstersPerPage;
    const endIndex = startIndex + monstersPerPage;
    const currentFilteredMonsters = filteredMonsters.slice(startIndex, endIndex)

    const NextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const PreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <h1 style={{ color: "red" }} className="text-center my-3">Dungeons & Dragons Monsters selection</h1>
            <p className="text-center my-3">(only monsters with available image)</p>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        {isLoading ? (
                            <div className="text-center my-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Fetching monsters...</span>
                                </div>
                                <p className="mt-2">Fetching monsters...</p>
                            </div>
                        ) : (
                            <ul>
                                {currentFilteredMonsters.map((monster) => (
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

export default FilteredMonsterList;