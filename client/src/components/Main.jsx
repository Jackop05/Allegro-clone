import React from 'react'
import { FaShippingFast, FaHeart, FaShoppingCart } from 'react-icons/fa';



const Main = () => {
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
                    <FaShippingFast size={40} className='text-slate-800 cursor-pointer' />
                    <FaHeart size={40} className='text-slate-800 cursor-pointer' />
                    <FaShoppingCart size={40} className='text-slate-800 cursor-pointer' />
                </div>

            </div>
        )
    }

    const Offers = () => {
        return (
            <div className='min-h-[380px] bg-white w-[90vw] mx-auto relative top-[130px] overflow-scroll p-6 flex gap-20 overflow-y-hidden'>
                <div className='flex flex-col gap-2 w-[150px] cursor-pointer'>
                    <img src="./images/product.png" alt="product" className='w-60 mb-4' />
                    <div className='text-slate-800 text-left text-2xl font-bold'>600.00 zł</div>
                    <div className='text-slate-600'>Dmuchana deska 320cm SUP unosząca na wodzie</div>
                </div>

                <div className='flex flex-col gap-2 w-[150px] max-h-[500px]'>
                    <img src="./images/product.png" alt="product" className='w-60 mb-4 cursor-pointer' />
                    <div className='text-slate-800 text-left text-2xl font-bold'>600.00 zł</div>
                    <div className='text-slate-600'>Dmuchana deska 320cm SUP unosząca na wodzie</div>
                </div>

                <div className='flex flex-col gap-2 w-[150px] max-h-[500px] cursor-pointer'>
                    <img src="./images/product.png" alt="product" className='w-60 mb-4' />
                    <div className='text-slate-800 text-left text-2xl font-bold'>600.00 zł</div>
                    <div className='text-slate-600'>Dmuchana deska 320cm SUP unosząca na wodzie</div>
                </div>

                <div className='flex flex-col gap-2 w-[150px] max-h-[500px] cursor-pointer'>
                    <img src="./images/product.png" alt="product" className='w-60 mb-4' />
                    <div className='text-slate-800 text-left text-2xl font-bold'>600.00 zł</div>
                    <div className='text-slate-600'>Dmuchana deska 320cm SUP unosząca na wodzie</div>
                </div>

                <div className='flex flex-col gap-2 w-[150px] max-h-[500px] cursor-pointer'>
                    <img src="./images/product.png" alt="product" className='w-60 mb-4' />
                    <div className='text-slate-800 text-left text-2xl font-bold'>600.00 zł</div>
                    <div className='text-slate-600'>Dmuchana deska 320cm SUP unosząca na wodzie</div>
                </div>
            </div>
        )
    }

    const Footer = () => {
        return (
            <div className='' >

            </div>
        )
    }






  return (
    <div className="w-screen h-screen overflow-y-scroll flex flex-col bg-slate-100">
        <Navbar />

        <div className='flex flex-col gap-10 mb-8'>
            <Offers />
            <Offers />
            <Offers />
            <Offers />
            <Offers />
        </div>

        <Footer />
    </div>
  )
}

export default Main