import React, { useEffect, useState } from 'react';
import { FaShippingFast, FaHeart, FaShoppingCart, FaHome } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Item = () => {
    const navigate = useNavigate();

    const { itemId } = useParams();
    const [clicked, setClicked] = useState(false);
    const [counter, setCounter] = useState(1);
    const [itemData, setItemData] = useState([]);
    const [userLikedItems, setUserLikedItems] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/get-item-data/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            setItemData(result.data);
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    

    useEffect(() => {
        fetchData();
    }, []);

    const toggleLike = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/toggle-like/${itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            setClicked(!clicked);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addToCart = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    itemId,
                    numberOfItems: counter,
                    itemDescription: itemData?.description,
                    itemName: itemData?.name,
                    price: itemData?.price,
                    image: itemData?.image
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            navigate('/cart');
            const result = await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const clickUp = () => {
        setCounter(counter + 1);
    };

    const clickDown = () => {
        if (counter > 0) {
            setCounter(counter - 1);
        }
    };

    return (
        <div className="w-screen h-screen overflow-y-scroll flex flex-col bg-slate-100">
            <div className='relative top-[130px]'>
                <div className='w-screen bg-white flex justify-between px-10 py-6 fixed top-0 z-50 '>
                    <img src='../images/allegroLogo.png' alt="logo" className='w-[150px] h-auto cursor-pointer' />
                    <div className='flex gap-4'>
                        <form className='max-w-[800px] self-center flex'>
                            <input type='text' className='p-2  w-[25vw] border-[1px] border-slate-800 border-solid border-r-0' placeholder="czego szukasz?" />
                            <button className='text-white bg-orange-500 text-xl p-2 pl-[4px] self-center rounded-sm tracking-wider'>Szukaj</button>
                        </form>
                        <form className='self-center border-solid border-[1px] border-slate-800 p-2'>
                            <label htmlFor="categories"></label>
                            <select id="categories" name="categories" className='outline-none' >
                                <option value="wszystkie_kategorie">Wszystkie kategorie</option>
                                {/* More options */}
                            </select>
                        </form>
                    </div>
                    <div className='flex gap-4'>
                        <Link to="/"><FaHome size={40} className='text-slate-800 cursor-pointer' /></Link>
                        <Link to="/my-deliveries"><FaShippingFast size={40} className='text-slate-800 cursor-pointer' /></Link>
                        <Link to="/liked"><FaHeart size={40} className='text-slate-800 cursor-pointer' /></Link>
                        <Link to="/cart"><FaShoppingCart size={40} className='text-slate-800 cursor-pointer' /></Link>
                    </div>
                </div>
                <div className='flex justify-between mx-32 gap-6 mb-24'>
                    <div className='w-[70%] bg-white p-8'>
                        <div className='flex justify-between'>
                            <div className='text-xl font-bold'>{itemData?.description}</div>
                            <FaHeart
                                size={40}
                                className={`cursor-pointer ${(clicked) ? 'text-red-500' : 'text-slate-300'}`}
                                onClick={toggleLike}
                            />
                        </div>
                        <div className='text-md text-slate-700'>4,5/5</div>
                        <img src={itemData?.image} alt="Product" className='w-[60%] mx-auto mt-8' />
                    </div>
                    <div className='bg-white text-slate-800 flex flex-col gap-2 p-4 w-[25%] fixed right-32'>
                        <div className='pb-4 border-b-[2px] border-slate-200'>
                            <div className='font-bold text-3xl'>{itemData?.price}zł</div>
                            <div className='text-md text-slate-500'>{itemData?.boughtNumber} osób kupiło</div>
                        </div>
                        <div className='mt-4 text-md text-slate-500'>Liczba sztuk</div>
                        <div className='flex h-[40px] justify-left mt-0'>
                            <div className='text-slate-800 py-2 px-4 cursor-pointer border-[1px] border-slate-800' onClick={clickDown}>-</div>
                            <div className='text-slate-800 py-2 px-8 border-[1px] border-slate-800'>{counter}</div>
                            <div className='text-slate-800 py-2 px-4 cursor-pointer border-l-[1px] border-[1px] border-slate-800' onClick={clickUp}>+</div>
                        </div>
                        <div className='bg-orange-500 text-white p-2 max-h-[40px] rounded-sm cursor-pointer text-center mt-0' onClick={addToCart}>Dodaj do koszyka</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Item;
