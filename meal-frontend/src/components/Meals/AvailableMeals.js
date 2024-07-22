import Card from "../UI/Card";
import classes from './AvailableMeals.module.css';
import MealItem from "./MealItem/MealItem";
import axios from 'axios';
import { useEffect,useState } from "react";


const DUMMY_MEALS = [
    {
        id: 'm1',
        name: 'Sushi',
        description: 'Finest fish and veggies',
        price: 22.99,
    },
    {
        id: 'm2',
        name: 'Schnitzel',
        description: 'A german specialty!',
        price: 16.5,
    },
    {
        id: 'm3',
        name: 'Barbecue Burger',
        description: 'American, raw, meaty',
        price: 12.99,
    },
    {
        id: 'm4',
        name: 'Green Bowl',
        description: 'Healthy...and green...',
        price: 18.99,
    },
];

const AvailableMeals = () => {
    const [availableMeals, setAvailableMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMealItems = async () => {
        try {
            const response = await axios.get('http://localhost:8080/mealItems');
            setAvailableMeals(response.data);
            console.log(response.data);
            setIsLoading(false);
        } catch (error) {
            setError('Error fetching meal items');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMealItems();
    }, []);

    let mealsList;
    console.log("availableMeals:",availableMeals.data);
    if (availableMeals && availableMeals.data && availableMeals.data.length > 0) {
        mealsList = availableMeals.data.map((meal) => 
            <MealItem id={meal.id} key={meal.id} name={meal.name} description={meal.description} price={meal.price} />
        );
    }

    return (
        <section className={classes.meals}>
            <Card>
                {isLoading && <p>Loading...</p>}
                {error && <p className={classes.error}>{error}</p>}
                {!isLoading && !error && (mealsList ? (
                    <ul>{mealsList}</ul>
                ) : (
                    <p className={classes.noMeals}>There are no meals in the bucket</p>
                ))}
            </Card>
        </section>
    );
};


export default AvailableMeals;
