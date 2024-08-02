import React from 'react'
import { FaHeart, FaShippingFast, FaShoppingCart, FaTrash, FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom';

const Cart = () => {
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

    const OfferCart = () => {
        return (
            <div className='flex flex-col gap-4'>
                <div className='flex justify-between bg-white p-16'>
                    <div className='flex gap-4 cursor-pointer'>
                        <img src='./images/product.png' alt="Product" className='h-[100px]' />
                        <div className='flex flex-col justify-center'>                            
                            <div className='text-slate-600 text-lg max-w-[200px] ml-4'>Dmuchana deska 320cm SUP unosząca na wodzie</div>
                        </div>
                    </div>

                    <div className='flex border-[1px] border-slate-800 h-[40px] items-center self-center mx-16'>
                        <div className='text-slate-800 py-2 px-4 border-r-[1px] border-slate-800 cursor-pointer'>-</div>
                        <div className='text-slate-800 py-2 px-8'>1</div>
                        <div className='text-slate-800 py-2 px-4 border-l-[1px] border-slate-800 cursor-pointer'>+</div>
                    </div>

                    <div className='flex self-center gap-4'>
                        <div className='text-slate-800 text-left text-2xl font-semibold'>600.00zł</div>
                        <FaTrash className='text-slate-700 self-center text-2xl cursor-pointer' />
                    </div>
                </div>
            </div>
        )
    }



  return (
    <div className="w-screen h-screen overflow-y-scroll flex flex-col bg-slate-100">
        <Navbar />
        
        <div className='relative top-[100px] py-20 px-32'>
            <div className='text-black text-2xl font-bold mb-6'>Koszyk <span className='text-lg self-center font-normal relative bottom-1'>(1)</span></div>

            <div className='flex gap-20'>
                <div className='flex flex-col gap-10'>
                    <OfferCart />
                    <OfferCart />
                    <OfferCart />
                    <OfferCart />
                    <OfferCart />
                    <OfferCart />
                </div>

                <div className='bg-white text-slate-800 flex flex-col gap-2 p-4 w-[320px] max-h-[180px] fixed right-32'>
                    <div className='flex justify-between pb-4 border-b-[2px] border-slate-200'>
                        <div className=''>Wartość produktów</div>
                        <div className=''>600 zł</div>
                    </div>

                    <div className='flex justify-between mt-2 mb-4'>
                        <div className=''>Razem z dostawą</div>
                        <div className=''>610.99 zł</div>
                    </div>

                    <div className='bg-orange-500 text-white p-2 max-h-[40px] rounded-sm cursor-pointer text-center'>Płatność</div>

                </div>
            </div>
        </div>



    </div>
  )
}

export default Cart