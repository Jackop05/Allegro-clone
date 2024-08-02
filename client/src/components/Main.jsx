import React, { useEffect, useState } from 'react'
import { FaShippingFast, FaHeart, FaShoppingCart, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';



const Main = () => {
    const navigate = useNavigate();

    const [ userData, setUserData ] = useState('');
    const [ itemsData, setItemsData ] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/get-data', {
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
            const response = await fetch('http://localhost:5000/api/get-random-items-data', {
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






    const Navbar = () => {
        return (
            <div className='w-screen bg-white flex justify-between px-10 py-6 fixed  z-50'>

                <img src='./images/allegroLogo.png' alt="logo" className='w-[150px] h-auto cursor-pointer' />

                <div className='flex gap-4'>
                    <form className='max-w-[800px] self-center flex'>
                        <input type='text' className='p-2  w-[25vw] border-[1px] border-slate-800 border-solid border-r-0' placeholder="czego szukasz?" />
                        <button className='text-white bg-orange-500 text-xl p-2 pl-[4px] self-center rounded-sm tracking-wider'>Szukaj</button>
                    </form>
                    <form className='self-center border-solid border-[1px] border-slate-800 p-2'>
                        <label for="categories"></label>
                        <select id="categories" name="categories" className='outline-none' >
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
                    <Link to="/my-deliveries"><FaShippingFast size={40} className='text-slate-800 cursor-pointer' /></Link>
                    <Link to="/liked"><FaHeart size={40} className='text-slate-800 cursor-pointer' /></Link>
                    <Link to="/cart"><FaShoppingCart size={40} className='text-slate-800 cursor-pointer' /></Link>
                </div>

            </div>
        )
    }

    const Offers = () => {
        let offersArray = [];
        let tempArray = [];
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 5; j++) {
                tempArray.push(itemsData[i*5 + j]);
            }
            offersArray.push(tempArray);
            tempArray = [];
        }
        console.log(offersArray);

        const offersRender = offersArray.map((array) => {
            const tempItems = array.map((item) => {
                return (
                    <div className='flex flex-col gap-2 min-w-[150px] max-h-[500px] mr-4'>
                        <Link to={`/item/${item?._id}`}><img src={item?.image} alt="product" className='h-[200px] mb-4 cursor-pointer' /></Link>
                        <div className='text-slate-800 text-left text-2xl font-bold'>{item?.price}zł</div>
                        <div className='text-slate-600'>{item?.description}</div>
                    </div>
                )
            })

            return (
                <div className='mt-10 min-h-[380px] bg-white w-[90vw] mx-auto relative top-[130px] overflow-scroll p-6 flex gap-20 overflow-y-hidden'>
                    {tempItems}
                </div>
            )
        })

        return (
            <div>
                {offersRender}
            </div>
        )
    }

    const Footer = () => {
        return (
            <div className='relative top-[130px] text-white bg-gray-700 p-8' >
                <div class="container mx-auto px-4">
                    <div className='flex justify-between'>
                        <div class="flex justify-between items-center mb-6">
                            <div class="flex space-x-4">
                                <a href="https://play.google.com/" class="text-gray-400 hover:text-white" target="_blank">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" class="h-10" />
                                </a>
                            </div>
                            <div class="flex space-x-4">
                                <a href="#" class="text-gray-400 hover:text-white">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-white">
                                    <i class="fab fa-linkedin-in"></i>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-white">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-white">
                                    <i class="fab fa-pinterest-p"></i>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-white">
                                    <i class="fab fa-youtube"></i>
                                </a>
                                <a href="#" class="text-gray-400 hover:text-white">
                                    <i class="fas fa-heart"></i>
                                </a>
                            </div>
                        </div>

                        <img src="./images/allegroWhiteLogo.png" alt="Allegro logo" className='h-[40px] w-auto cursor-pointer' />
                    </div>

                    <div class="flex flex-col items-center">
                        <p class="mb-4">Serwisy Grupy Allegro</p>
                        <div class="flex space-x-6 text-gray-400 hover:text-white">
                            <a href="#" class="hover:text-white">Allegro.cz</a>
                            <a href="#" class="hover:text-white">Allegro.sk</a>
                            <a href="#" class="hover:text-white">Mall.cz</a>
                            <a href="#" class="hover:text-white">Mall.hu</a>
                            <a href="#" class="hover:text-white">Mall.hr</a>
                            <a href="#" class="hover:text-white">Mimovrste.com</a>
                            <a href="#" class="hover:text-white">Wedo.cz</a>
                            <a href="#" class="hover:text-white">Czc.cz</a>
                        </div>
                    </div>
                </div>

            </div>
        )
    }






  return (
    <div className="w-screen h-screen overflow-y-scroll flex flex-col bg-slate-100">
        <Navbar />

        <div className='flex flex-col gap-20 mb-8'>
            <Offers />
        </div>

        <Footer />
    </div>
  )
}

export default Main