import React, { useEffect, useState } from 'react';
import { FaHeart, FaShippingFast, FaShoppingCart, FaTrash, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);

    // Fetch user data and cart items
    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/get-data', {
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
            const items = result.data.cart; // Assuming `result.data.cart` is an array of cart items

            setCartItems(items);

            // Calculate total price
            const total = items.reduce((acc, item) => acc + item.price * item.numberOfItems, 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Handle quantity update
    const updateQuantity = async (itemId, change) => {
        try {
            const item = cartItems.find(item => item.itemId === itemId);
            const newQuantity = item.numberOfItems + change;

            if (newQuantity <= 0) {
                return; // Prevent removal of item
            }

            const response = await fetch('http://localhost:5000/api/update-cart-item', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    itemId: itemId,
                    numberOfItems: newQuantity,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            // Update local state
            setCartItems(cartItems.map(item =>
                item.itemId === itemId
                    ? { ...item, numberOfItems: newQuantity }
                    : item
            ));

            // Update total price
            const total = cartItems.reduce((acc, item) => acc + (item.itemId === itemId ? newQuantity : item.numberOfItems) * item.price, 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // Handle item removal
    const removeItem = async (itemId) => {
        try {
            const response = await fetch('http://localhost:5000/api/remove-from-cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    itemId: itemId,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            // Remove item from local state
            const updatedItems = cartItems.filter(item => item.itemId !== itemId);
            setCartItems(updatedItems);

            // Update total price
            const total = updatedItems.reduce((acc, item) => acc + item.price * item.numberOfItems, 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const Navbar = () => {
        return (
            <div className='w-screen bg-white flex justify-between px-10 py-6 fixed z-50'>
                <img src='./images/allegroLogo.png' alt="logo" className='w-[150px] h-auto cursor-pointer' />
                <div className='flex gap-4'>
                    <form className='max-w-[800px] self-center flex'>
                        <input type='text' className='p-2 w-[25vw] border-[1px] border-slate-800 border-solid border-r-0' placeholder="czego szukasz?" />
                        <button className='text-white bg-orange-500 text-xl p-2 pl-[4px] self-center rounded-sm tracking-wider'>Szukaj</button>
                    </form>
                    <form className='self-center border-solid border-[1px] border-slate-800 p-2'>
                        <label htmlFor="categories"></label>
                        <select id="categories" name="categories" className='outline-none'>
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
        );
    };

    const OfferCart = ({ item }) => {
        console.log(item)
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex justify-between bg-white p-16'>
                    <div className='flex gap-4 cursor-pointer'>
                        <img src={item?.image} alt="Product" className='h-[100px]' />
                        <div className='flex flex-col justify-center'>
                            <div className='text-slate-600 text-lg max-w-[200px] ml-4'>{item.description}</div>
                        </div>
                    </div>
                    <div className='flex border-[1px] border-slate-800 h-[40px] items-center self-center mx-16'>
                        <div
                            className='text-slate-800 py-2 px-4 border-r-[1px] border-slate-800 cursor-pointer'
                            onClick={() => updateQuantity(item.itemId, -1)}
                        >
                            -
                        </div>
                        <div className='text-slate-800 py-2 px-8'>{item.numberOfItems}</div>
                        <div
                            className='text-slate-800 py-2 px-4 border-l-[1px] border-slate-800 cursor-pointer'
                            onClick={() => updateQuantity(item.itemId, 1)}
                        >
                            +
                        </div>
                    </div>
                    <div className='flex self-center gap-4'>
                        <div className='text-slate-800 text-left text-2xl font-semibold'>{(item.price * item.numberOfItems).toFixed(2)} zł</div>
                        <FaTrash
                            className='text-slate-700 self-center text-2xl cursor-pointer'
                            onClick={() => removeItem(item.itemId)}
                        />
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-screen h-screen overflow-y-scroll flex flex-col bg-slate-100">
            <Navbar />
            <div className='relative top-[100px] py-20 px-32'>
                <div className='text-black text-2xl font-bold mb-6'>Koszyk <span className='text-lg self-center font-normal relative bottom-1'>({cartItems.length})</span></div>
                <div className='flex gap-20'>
                    <div className='flex flex-col gap-10'>
                        {cartItems.map(item => (
                            <OfferCart key={item.itemId} item={item} />
                        ))}
                    </div>
                    <div className='bg-white text-slate-800 flex flex-col gap-2 p-4 w-[320px] max-h-[180px] fixed right-32'>
                        <div className='flex justify-between pb-4 border-b-[2px] border-slate-200'>
                            <div className=''>Wartość produktów</div>
                            <div className=''>{totalPrice.toFixed(2)} zł</div>
                        </div>
                        <div className='flex justify-between mt-2 mb-4'>
                            <div className=''>Razem z dostawą</div>
                            <div className=''>{(totalPrice + 10).toFixed(2)} zł</div> {/* Assuming 10 zł is the delivery cost */}
                        </div>
                        <div className='bg-orange-500 text-white p-2 max-h-[40px] rounded-sm cursor-pointer text-center'>Płatność</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
