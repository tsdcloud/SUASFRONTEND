import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        // <div className="h-20 w-full text-gray-400 bg-primary flex items-center justify-center">
        //        <p className='mt-8 text-xs'>&copy; SUAS 2024 . Tous les droits sont reservés. </p>
        // </div>
        <footer className="bg-gray-800 text-white pt-4 pb-4">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
                    <div>
                        <h4 className="font-semibold mb-3">About</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <Link to="/about-us" className="space-y-2 text-sm text-gray-400">
                                A Propos de nous
                            </Link >
                            {/* <li><a href="#">How it works</a></li> */}
                            {/* <li><a href="#">Press</a></li> */}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {/* <li><a href="#">Contactez nous</a></li> */}
                            <Link to="/about-us" className="space-y-2 text-sm text-gray-400">
                                Contactez nous
                            </Link >
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Organize</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <Link to="/events" className="space-y-2 text-sm text-gray-400">
                                Les évènements
                            </Link >
                            {/* <li><a href="#">Les évènements</a></li> */}
                            {/* <li><a href="#">Pricing</a></li> */}
                        </ul>
                    </div>
                    {/* <div>
                        <h4 className="font-semibold mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#">Terms</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div> */}
                </div>
                <hr className="my-4 border-gray-700" />
                <p className="text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} SUAS 2024 . Tous les droits sont reservés.
                </p>
            </div>
        </footer>
    )
}

export default Footer