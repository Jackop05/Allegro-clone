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

        try {
            const response = await fetch(`http://localhost:5000/api/get-data`, {
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
            setUserLikedItems(result.data.liked);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if(userLikedItems.includes(itemId)){
            setClicked(true);
        }
    }, [userLikedItems, clicked]);

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

    const Navbar = () => {
        return (
            <div className='w-screen bg-white flex justify-between px-10 py-6 fixed z-50'>
                <img src='./images/allegroLogo.png' alt="logo" className='w-[150px] h-auto cursor-pointer  hidden md:inline' />
                
                <div className='flex justify-around md:justify-end gap-4 w-full'>
                    <Link to="/"><FaHome size={40} className='text-slate-800 cursor-pointer' /></Link>
                    <Link to="/liked"><FaHeart size={40} className='text-slate-800 cursor-pointer' /></Link>
                    <Link to="/cart"><FaShoppingCart size={40} className='text-slate-800 cursor-pointer' /></Link>
                </div>
            </div>
        );
    };

    

    return (
        <div className="w-screen h-screen overflow-y-scroll flex flex-col bg-slate-100">
            <div className='relative top-[130px]'>
                <div className='w-screen bg-white flex justify-between px-10 py-6 fixed top-0 z-50'>
                    <img src='../images/allegroLogo.png' alt="logo" className='w-[150px] h-auto cursor-pointer hidden sm:inline' />
                    <div className='flex justify-around sm:justify-end gap-4 w-full'>
                        <Link to="/"><FaHome size={40} className='text-slate-800 cursor-pointer' /></Link>
                        <Link to="/liked"><FaHeart size={40} className='text-slate-800 cursor-pointer' /></Link>
                        <Link to="/cart"><FaShoppingCart size={40} className='text-slate-800 cursor-pointer' /></Link>
                    </div>
                </div>

                <div className='flex flex-col justify-between mx-8 lg:mx-16 gap-6 mb-24'>
                    <div className='max-w-[700px] bg-white p-8'>
                        <div className='flex justify-between gap-2'>
                            <div className='text-xl font-bold'>{itemData?.description}</div>
                            <FaHeart
                                className={`cursor-pointer ${(clicked) ? 'text-red-500' : 'text-slate-300'} text-[50px]`}
                                onClick={toggleLike}
                            />
                        </div>
                        <div className='text-md text-slate-700'>4,5/5</div>
                        <img src={itemData?.image} alt="Product" className='w-[60%] mx-auto mt-8' />
                    </div>
                    <div className='bg-white text-slate-800 flex flex-col gap-2 p-4 max-w-[300px] right-32'>
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
