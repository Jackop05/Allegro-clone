import React, { useEffect, useState } from 'react'
import { FaShippingFast, FaHeart, FaShoppingCart, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Main = () => {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('wszystkie_kategorie');
    const [userData, setUserData] = useState('');
    const [itemsData, setItemsData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/get-data?category=${selectedCategory}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });
      
            if (!response.ok) {
              navigate('/login');
              throw new Error('Network response was not ok ' + response.statusText);
            }
      
            const result = await response.json();
            setUserData(result);
            console.log('Success:', result);
          } catch (error) {
            console.error('Error:', error);
          }

          try {
            const response = await fetch(`http://localhost:5000/api/get-random-items-data?category=${selectedCategory}`, {
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
            setItemsData(result);
            console.log('Success:', result);
          } catch (error) {
            console.error('Error:', error);
          }
    }

    const searchClick = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/get-specific-data/${searchText}?category=${selectedCategory}`, {
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
            setItemsData(result);
            console.log('Success:', result);
          } catch (error) {
            console.error('Error:', error);
          }
    }

    useEffect(() => {
        fetchData();
        console.log(itemsData);
    }, [])

    console.log(userData)

    const Offers = () => {
        let offersArray = [];
        let tempArray = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 5; j++) {
                tempArray.push(itemsData[i * 5 + j]);
            }
            offersArray.push(tempArray);
            tempArray = [];
        }
        console.log(offersArray);

        const offersRender = offersArray.map((array, index) => {
            const tempItems = array.map((item, idx) => (
                <div key={idx} className='flex flex-col gap-2 min-w-[150px] max-h-[500px] mr-4'>
                    <Link to={`/item/${item?._id}`}><img src={item?.image} alt="product" className='h-[200px] mb-4 cursor-pointer' /></Link>
                    <div className='text-slate-800 text-left text-2xl font-bold'>{item?.price}zł</div>
                    <div className='text-slate-600'>{item?.description}</div>
                </div>
            ));

            return (
                <div key={index} className='mt-10 min-h-[380px] bg-white w-[90vw] mx-auto relative top-[130px] overflow-scroll p-6 flex gap-20 overflow-y-hidden'>
                    {tempItems}
                </div>
            );
        });

        return (
            <div>
                {offersRender}
            </div>
        )
    }

    const Footer = () => {
        return (
            <div className='relative top-[130px] text-white bg-gray-700 p-8'>
                <div className="container mx-auto px-4">
                    <div className='flex justify-between'>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex space-x-4">
                                <a href="https://play.google.com/" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
                                </a>
                            </div>
                            <div className="flex space-x-4">
                                {/* Ikony mediów społecznościowych */}
                            </div>
                        </div>
                        <img src="./images/allegroWhiteLogo.png" alt="Allegro logo" className='h-[40px] w-auto cursor-pointer' />
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="mb-4">Serwisy Grupy Allegro</p>
                        <div className="flex space-x-6 text-gray-400 hover:text-white">
                            {/* Linki do serwisów */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-screen h-screen overflow-y-scroll flex flex-col bg-slate-100">
            <div className='w-screen bg-white flex justify-between px-10 py-6 fixed  z-50'>
                <img src='./images/allegroLogo.png' alt="logo" className='w-[150px] h-auto cursor-pointer' />
                <div className='flex gap-4'>
                    <div className='max-w-[800px] self-center flex'>
                        <input type='text' className='p-2 w-[25vw] border-[1px] border-slate-800 border-solid border-r-0' placeholder="czego szukasz?" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                        <button className='text-white bg-orange-500 text-xl p-2 pl-[4px] self-center rounded-sm tracking-wider' onClick={searchClick} >Szukaj</button>
                    </div>
                    <form className='self-center border-solid border-[1px] border-slate-800 p-2'>
                        <label htmlFor="categories"></label>
                        <select id="categories" name="categories" className='outline-none' value={selectedCategory} onChange={(e) => {setSelectedCategory(e.target.value); fetchData()}}>
                            <option value="wszystkie_kategorie">Wszystkie kategorie</option>
                            <optgroup label="Kategorie">
                                <option value="dom_ogrod">Dom i Ogród</option>
                                <option value="dziecko">Dziecko</option>
                                <option value="elektronika">Elektronika</option>
                                <option value="firma_uslugi">Firma i usługi</option>
                                <option value="kolekcje_sztuka">Kolekcje i sztuka</option>
                                <option value="kultura_rozrywka">Kultura i rozrywka</option>
                                <option value="moda">Moda</option>
                                <option value="motoryzacja">Motoryzacja</option>
                                <option value="nieruchomosci">Nieruchomości</option>
                                <option value="sport_turystyka">Sport i turystyka</option>
                                <option value="supermarket">Supermarket</option>
                                <option value="uroda">Uroda</option>
                                <option value="zdrowie">Zdrowie</option>
                            </optgroup>
                            <optgroup label="Inne opcje">
                                <option value="cele_charytatywne">Cele charytatywne</option>
                                <option value="organizacje_charytatywne">Organizacje charytatywne</option>
                                <option value="sprzedawcy">Sprzedawcy</option>
                                <option value="zakonczone">Zakończone</option>
                            </optgroup>
                        </select>
                    </form>
                </div>
                <div className='flex gap-4'>
                    <Link to="/"><FaHome size={40} className='text-slate-800 cursor-pointer' /></Link>
                    <Link to="/liked"><FaHeart size={40} className='text-slate-800 cursor-pointer' /></Link>
                    <Link to="/cart"><FaShoppingCart size={40} className='text-slate-800 cursor-pointer' /></Link>
                </div>
            </div>

            <div className='flex flex-col gap-20 mb-8'>
                <Offers />
            </div>

            <Footer />
        </div>
    )
}

export default Main
