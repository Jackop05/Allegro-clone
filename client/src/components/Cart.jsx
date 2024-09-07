import React, { useEffect, useState } from 'react';
import { FaHeart, FaShippingFast, FaShoppingCart, FaTrash, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();

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
            calculateTotalPrice(items);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.price * item.numberOfItems, 0);
        setTotalPrice(total);
    };

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
            const updatedItems = cartItems.map(item =>
                item.itemId === itemId
                    ? { ...item, numberOfItems: newQuantity }
                    : item
            );

            setCartItems(updatedItems);
            calculateTotalPrice(updatedItems);

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
            calculateTotalPrice(updatedItems);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const boughtItems = async () => {
        const userConfirmed = confirm("Are you sure you want to buy these items?");
        if (!userConfirmed) {
            alert("Purchase canceled.");
            navigate('/');
            navigate('/cart');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/bought-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
  
            navigate('/')
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }



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

    const OfferCart = ({ item }) => {
        console.log(item)
        return (
            <div className='flex-col gap-4'>
                <div className='flex flex-col lg:flex-row justify-between bg-white p-16'>
                    <div className='gap-4 flex flex-col lg:flex-row'>
                        <Link to={`/item/${item.itemId}`} ><img src={item?.image} alt="Product" className='h-[100px] cursor-pointer mx-auto mb-4' /></Link>
                        <div className='flex border-[1px] border-slate-800 h-[40px] items-center self-center md:mx-8'>
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
                    </div>
                    <div className='flex self-center gap-4 mt-8 lg:mt-0'>
                        <div className='text-slate-800 text-left text-2xl font-semibold'>{(item.price * item.numberOfItems).toFixed(2)} zł</div>
                        <div onClick={() => removeItem(item.itemId)}>
                            <FaTrash className='text-slate-700 self-center text-2xl cursor-pointer' />
                        </div>
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
            <div className='relative top-[130px] py-4 px-8 md:py-20 md:px-20'>
                <div className='text-black text-2xl font-bold mb-6'>Koszyk <span className='text-lg self-center font-normal relative bottom-1'>({cartItems.length})</span></div>
                <div className='flex-col lg:flex gap-20'>
                    <div className='flex flex-col gap-10 mb-8 lg:mb-0 max-w-[800px]'>
                        {cartItems.map(item => (
                            <OfferCart key={item.itemId} item={item} />
                        ))}
                    </div>

                    <div className='bg-white text-slate-800 flex flex-col gap-2 p-4 w-[320px] max-h-[180px] right-20'>
                        <div className='flex justify-between pb-4 border-b-[2px] border-slate-200'>
                            <div className=''>Wartość produktów</div>
                            <div className=''>{totalPrice.toFixed(2)} zł</div>
                        </div>
                        <div className='flex justify-between mt-2 mb-4'>
                            <div className=''>Razem z dostawą</div>
                            <div className=''>{(totalPrice + 10).toFixed(2)} zł</div> {/* Assuming 10 zł is the delivery cost */}
                        </div>
                        <div className='bg-orange-500 text-white p-2 max-h-[40px] rounded-sm cursor-pointer text-center' onClick={boughtItems}>Płatność</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
