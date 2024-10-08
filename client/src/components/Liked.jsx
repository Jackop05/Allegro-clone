import React, { useEffect, useState } from 'react';
import { FaHeart, FaShippingFast, FaShoppingCart, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Liked = () => {
    const navigate = useNavigate();

    const [likedItems, setLikedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user data and liked items
    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/get-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include credentials for authentication
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            const likedItemsIds = result.data.liked; // Assuming `result.data.liked` is an array of item IDs

            // Fetch product details for each liked item
            const fetchProductDetails = async () => {
                try {
                    const productsResponse = await Promise.all(likedItemsIds.map(id =>
                        fetch(`http://localhost:5000/api/get-item-data/${id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                        })
                    ));

                    const productsData = await Promise.all(productsResponse.map(res => res.json()));
                    setLikedItems(productsData.map(data => data.data)); // Assuming `data.data` contains product info
                } catch (error) {
                    console.error('Error fetching product details:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchProductDetails();
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Function to handle adding item to the cart
    const addToCart = async (item) => {
        try {
            const response = await fetch('http://localhost:5000/api/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    itemId: item.itemId,
                    itemName: item.description, // or whatever field you use for the item name
                    itemDescription: item.description,
                    numberOfItems: 1, // You can adjust this based on user input
                    price: item.price,
                    image: item.image,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            navigate('/cart')
            const result = await response.json();
            // Handle success (e.g., show a success message or update UI)
            console.log('Item added to cart:', result);
        } catch (error) {
            console.error('Error adding item to cart:', error);
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

    const LikedOffer = ({ item }) => {
        console.log(item);
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex-row lg:flex justify-between bg-white p-8'>
                    <Link to={`/item/${item._id}`}>
                        <div className='flex-row md:flex gap-4 cursor-pointer mb-4 lg:mb-0'>
                            <img src={item.image} alt="Product" className='h-[160px]' />
                            <div className='flex flex-col gap-1'>
                                <div className='text-slate-600 text-xl max-w-[300px]'>{item.description}</div>
                                <div className='text-slate-800 text-left text-2xl font-semibold'>{item.price} zł</div>
                                <div className='text-slate-500 mt-4'>{item.boughtNumber} osoba kupiła</div>
                            </div>
                        </div>
                    </Link>
                    <div className='flex flex-col justify-end'>
                        <div
                            className='bg-orange-600 text-white p-2 max-h-[40px] w-[160px] text-center rounded-sm cursor-pointer'
                            onClick={() => addToCart(item)}
                        >
                            Dodaj do koszyka
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
            <div className='relative top-[130px] py-4 px-8 md:py-20 md:px-32'>
                <div className='text-black text-2xl font-bold mb-6'>Ulubione <span className='text-lg self-center font-normal relative bottom-1'>({likedItems.length})</span></div>
                <div className='flex flex-col gap-10'>
                    {likedItems.map(item => (
                        <LikedOffer item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Liked;
